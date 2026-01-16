import { useReducer } from 'react';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import type {
    ResonanceProject,
    ExecutionMapping,
    Phase1Data,
    PlatformContext,
    ExecutionSegment,
    OutcomeLog
} from '../types/phase2';

// ============================================================================
// Actions
// ============================================================================

export type ProjectAction =
    | {
        type: 'LOCK_BLUEPRINT';
        payload: {
            phase1Data: Phase1Data;
            platformContext: PlatformContext;
        };
    }
    | {
        type: 'UPDATE_EXECUTION';
        payload: {
            path: string; // Dot notation path, e.g., "audioPlan.bpm" or "editRhythm.segments[0].targetASL"
            value: any;
        };
    }
    | { type: 'RUN_VALIDATION' }
    | { type: 'LOG_OUTCOME'; payload: OutcomeLog }
    | { type: 'UNLOCK_BLUEPRINT' };

// ============================================================================
// Initial State
// ============================================================================

const initialState: ResonanceProject = {
    meta: {
        version: '2.0.0',
        createdAt: new Date().toISOString(),
    },
    layers: {
        blueprint: null,
        execution: null,
        validation: null,
    },
};

import { validateExecution } from '../engine/validation';

// ============================================================================
// Reducer
// ============================================================================

export const projectReducer = produce((draft: ResonanceProject, action: ProjectAction) => {
    switch (action.type) {
        case 'LOCK_BLUEPRINT': {
            const { phase1Data, platformContext } = action.payload;

            // 1. Create Blueprint (Layer 1)
            draft.layers.blueprint = {
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                platformContext: platformContext,
                phase1Data: phase1Data,
            };

            // 2. Initialize Execution Mapping (Layer 2)
            // Initialize editRhythm segments matching Phase 1 segments but mutable
            const initialSegments: ExecutionSegment[] = phase1Data.timeline.map(seg => {
                let targetASL = 2.5; // Default fallback
                switch (seg.type) {
                    case 'HOOK': targetASL = 1.5; break;
                    case 'BUILD': targetASL = 2.0; break;
                    case 'PEAK': targetASL = 0.8; break;
                    case 'SUSTAIN': targetASL = 3.0; break;
                    case 'RESOLVE': targetASL = 4.0; break;
                    case 'BREAK': targetASL = 5.0; break;
                }

                return {
                    ...seg,
                    targetASL,
                    pacingCurve: 'STATIC', // Default value
                };
            });

            const visualDensity = initialSegments.map(seg => ({
                timeRange: `${seg.startTime}-${seg.endTime}`,
                intensity: 'MED' as const
            }));

            const execution: ExecutionMapping = {
                audioPlan: {
                    bpm: 120, // Default
                    silenceMarkers: [],
                    duckingEnabled: false,
                },
                editRhythm: {
                    segments: initialSegments,
                },
                visualDensity: visualDensity,
            };

            draft.layers.execution = execution;

            // 3. Initialize Validation (Layer 3)
            draft.layers.validation = validateExecution(execution, platformContext);

            break;
        }

        case 'UPDATE_EXECUTION': {
            const { path, value } = action.payload;
            if (!draft.layers.execution || !draft.layers.blueprint) return;

            // Simple path traversal for "audioPlan.bpm", etc.
            const parts = path.split('.');
            let current: any = draft.layers.execution;

            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (part.includes('[') && part.includes(']')) {
                    const [name, indexStr] = part.split('[');
                    const index = parseInt(indexStr.replace(']', ''), 10);
                    current = current[name][index];
                } else {
                    current = current[part];
                }
            }

            const lastPart = parts[parts.length - 1];
            if (lastPart.includes('[') && lastPart.includes(']')) {
                const [name, indexStr] = lastPart.split('[');
                const index = parseInt(indexStr.replace(']', ''), 10);
                current[name][index] = value;
            } else {
                current[lastPart] = value;
            }

            // Re-run validation on every update
            draft.layers.validation = validateExecution(draft.layers.execution, draft.layers.blueprint.platformContext);
            break;
        }

        case 'RUN_VALIDATION': {
            if (draft.layers.execution && draft.layers.blueprint) {
                draft.layers.validation = validateExecution(draft.layers.execution, draft.layers.blueprint.platformContext);
            }
            break;
        }

        case 'LOG_OUTCOME': {
            draft.layers.outcome = action.payload;
            break;
        }

        case 'UNLOCK_BLUEPRINT': {
            draft.layers.blueprint = null;
            draft.layers.execution = null;
            draft.layers.validation = null;
            break;
        }
    }
});

// ============================================================================
// Hook
// ============================================================================

export const useProjectStore = () => {
    const [state, dispatch] = useReducer(projectReducer, initialState);
    return { state, dispatch };
};
