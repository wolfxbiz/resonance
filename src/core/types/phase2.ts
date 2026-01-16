import type { EmotionalStructureDef } from '../../types';
import type { CalculatedSegment } from '../engine/calculator';

/**
 * Phase 2 Data Architecture
 * Defines the strict data structures for the Feedback System.
 */

// ============================================================================
// Layer 1: The Blueprint (Frozen)
// ============================================================================

export interface SafeZones {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface PlatformContext {
    platformId: string;
    maxDuration: number;
    safeZones: SafeZones;
}

export interface Phase1Data {
    structure: EmotionalStructureDef;
    timeline: CalculatedSegment[];
}

export interface Blueprint {
    readonly id: string; // UUID
    readonly timestamp: string; // ISO 8601
    readonly platformContext: Readonly<PlatformContext>;
    readonly phase1Data: Readonly<Phase1Data>;
}

// ============================================================================
// Layer 2: Execution Mapping (Mutable)
// ============================================================================

export interface TimeRange {
    start: number;
    end: number;
}

export type PacingCurve = 'LINEAR_ACCEL' | 'STATIC' | 'EXP_DECEL';

export interface ExecutionSegment extends CalculatedSegment {
    targetASL: number; // Average Shot Length
    pacingCurve: PacingCurve;
}

export interface AudioPlan {
    bpm: number;
    silenceMarkers: TimeRange[];
    duckingEnabled: boolean;
}

export interface EditRhythm {
    segments: ExecutionSegment[];
}

export type VisualIntensity = 'LOW' | 'MED' | 'HIGH';

export interface VisualDensityMarker {
    timeRange: string; // e.g., "0:00-0:05" or specific format? Using string as requested.
    intensity: VisualIntensity;
}

export interface ExecutionMapping {
    audioPlan: AudioPlan;
    editRhythm: EditRhythm;
    visualDensity: VisualDensityMarker[]; // "Array of { timeRange: string, intensity... }"
}

// ============================================================================
// Layer 3: Validation Signals (Computed)
// ============================================================================

export type ValidationStatus = 'PASS' | 'WARNING' | 'FAIL';

export interface ValidationSignal {
    checkName: string;
    result: string;
    message: string;
    segmentIndex?: number;
}

export interface ValidationReport {
    globalStatus: ValidationStatus;
    signals: ValidationSignal[];
}

// ============================================================================
// The Project Container
// ============================================================================

export interface OutcomeLog {
    posted: boolean;
    platform: string;
    retention3s: number; // 0-100
    dropOffTimestamp?: string;
    userConfidence: number; // 1-5
    loggedAt: string; // ISO date
}

export interface ProjectMeta {
    version: string;
    createdAt: string;
}

export interface ProjectLayers {
    blueprint: Blueprint | null; // Nullable until initialized
    execution: ExecutionMapping | null;
    validation: ValidationReport | null;
    outcome?: OutcomeLog;
}

export interface ResonanceProject {
    meta: ProjectMeta;
    layers: ProjectLayers;
}
