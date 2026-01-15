/**
 * Resonance Context
 * 
 * Manages the core application state including:
 * - Target duration (seconds)
 * - Selected emotional structure
 * - Target platform (TikTok, IG Reels, etc.)
 */

import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import { getStructureById, getStructureByKey } from '../core/structures/library';
import type { EmotionalStructureDef } from '../types';

// ============================================================================
// Types
// ============================================================================

export type Platform = 'TikTok' | 'Instagram' | 'YouTube' | 'YouTube Shorts' | 'LinkedIn';

interface ResonanceState {
    /** Target video duration in seconds */
    duration: number;
    /** Currently selected structure ID */
    structureId: string;
    /** Current active structure definition */
    structure: EmotionalStructureDef;
    /** Target distribution platform */
    platform: Platform;
    /** Whether the content contains dialogue (speech) */
    hasDialogue: boolean;
}

interface ResonanceContextType extends ResonanceState {
    /** Set duration with validation (5s - 180s) */
    setDuration: (seconds: number) => void;
    /** Set active structure by ID */
    setStructureId: (id: string) => void;
    /** Set target platform */
    setPlatform: (platform: Platform) => void;
    /** Toggle dialogue mode */
    setHasDialogue: (hasDialogue: boolean) => void;
}

// ============================================================================
// Defaults
// ============================================================================

const DEFAULT_DURATION = 60;
const DEFAULT_STRUCTURE_ID = 'surge';
const DEFAULT_PLATFORM: Platform = 'TikTok';
const DEFAULT_HAS_DIALOGUE = false;

// Determine initial structure safely
const INITIAL_STRUCTURE = getStructureById(DEFAULT_STRUCTURE_ID)
    || getStructureByKey('SURGE')!; // Fallback that should always exist if library is intact

const ResonanceContext = createContext<ResonanceContextType | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export function ResonanceProvider({ children }: { children: ReactNode }) {
    const [duration, setDurationRaw] = useState(DEFAULT_DURATION);
    const [structureId, setStructureIdRaw] = useState(DEFAULT_STRUCTURE_ID);
    const [structure, setStructure] = useState<EmotionalStructureDef>(INITIAL_STRUCTURE);
    const [platform, setPlatform] = useState<Platform>(DEFAULT_PLATFORM);
    const [hasDialogue, setHasDialogue] = useState(DEFAULT_HAS_DIALOGUE);

    /**
     * Set duration with strict bounds validation.
     */
    const setDuration = useCallback((val: number) => {
        // Clamp between 5s and 180s
        const safeVal = Math.max(5, Math.min(180, val));
        setDurationRaw(safeVal);
    }, []);

    /**
     * Set structure by ID and update the full definition object.
     */
    const setStructureId = useCallback((id: string) => {
        // Try to find by ID (case insensitive search in library)
        const newStruct = getStructureById(id);

        if (newStruct) {
            setStructureIdRaw(id);
            setStructure(newStruct);
        } else {
            console.warn(`Attempted to set invalid structure ID: ${id}`);
        }
    }, []);

    const value: ResonanceContextType = {
        duration,
        structureId,
        structure,
        platform,
        hasDialogue,
        setDuration,
        setStructureId,
        setPlatform,
        setHasDialogue
    };

    return (
        <ResonanceContext.Provider value={value}>
            {children}
        </ResonanceContext.Provider>
    );
}

// ============================================================================
// Hook
// ============================================================================

export function useResonance() {
    const context = useContext(ResonanceContext);
    if (context === undefined) {
        throw new Error('useResonance must be used within a ResonanceProvider');
    }
    return context;
}
