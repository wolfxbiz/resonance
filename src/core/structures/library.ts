/**
 * Emotional Logic Matrix - Structure Library
 * 
 * ⚠️  IMMUTABLE DATA - DO NOT MODIFY ⚠️
 * 
 * This file contains the 7 core emotional structures that define
 * the Resonance Engine's pacing algorithms. These values are
 * derived from the System Truths and must not be altered.
 * 
 * Each structure represents a distinct emotional arc pattern
 * optimized for specific content goals and audience retention.
 */

import type { EmotionalStructureDef } from '../../types';

/**
 * The 7 Immutable Emotional Structures.
 * 
 * CRITICAL: These values are hard-coded from the product specification.
 * Do not use AI generation or modification for these values.
 */
export const STRUCTURES: Record<string, EmotionalStructureDef> = {
    /**
     * SURGE
     * Fast rise → Early peak → Quick release.
     * Best for high-energy retention.
     */
    SURGE: {
        id: 'surge',
        name: 'Surge',
        description: 'Fast rise → Early peak → Quick release. Best for high-energy retention.',
        pacing: {
            start: 'FAST',
            peakPositionMax: 0.6, // Peak must occur between 40% and 60%
            silenceRequired: true, // Mandatory silence before peak
        },
        segments: [
            { type: 'HOOK', basePercentage: 15, cutSpeedGuidance: 'FAST', soundDensity: 'MED' },
            { type: 'BUILD', basePercentage: 35, cutSpeedGuidance: 'ACCEL', soundDensity: 'HIGH' },
            { type: 'PEAK', basePercentage: 10, cutSpeedGuidance: 'FAST', soundDensity: 'MAX' }, // The Drop
            { type: 'SUSTAIN', basePercentage: 25, cutSpeedGuidance: 'FAST', soundDensity: 'HIGH' },
            { type: 'RESOLVE', basePercentage: 15, cutSpeedGuidance: 'DECEL', soundDensity: 'LOW' },
        ],
    },

    /**
     * CLIMB
     * Slow start → Steady rise → Late payoff.
     * Best for narrative authority.
     */
    CLIMB: {
        id: 'climb',
        name: 'Climb',
        description: 'Slow start → Steady rise → Late payoff. Best for narrative authority.',
        pacing: {
            start: 'SLOW',
            peakPositionMax: 0.9, // Payoff occurs at 85–90%
            silenceRequired: false,
        },
        segments: [
            { type: 'HOOK', basePercentage: 20, cutSpeedGuidance: 'SLOW', soundDensity: 'LOW' },
            { type: 'BUILD', basePercentage: 65, cutSpeedGuidance: 'ACCEL', soundDensity: 'MED' }, // Linear acceleration
            { type: 'PEAK', basePercentage: 15, cutSpeedGuidance: 'FAST', soundDensity: 'MAX' }, // Late payoff
        ],
    },

    /**
     * PULSE
     * Constant rhythm, no extreme peaks.
     * Hypnotic and cool.
     */
    PULSE: {
        id: 'pulse',
        name: 'Pulse',
        description: 'Constant rhythm, no extreme peaks. Hypnotic and cool.',
        pacing: {
            start: 'CONSTANT',
            peakPositionMax: 1.0, // Distributed energy
            silenceRequired: false,
        },
        segments: [
            { type: 'SUSTAIN', basePercentage: 25, cutSpeedGuidance: 'CONSTANT', soundDensity: 'MED' },
            { type: 'SUSTAIN', basePercentage: 25, cutSpeedGuidance: 'CONSTANT', soundDensity: 'MED' },
            { type: 'SUSTAIN', basePercentage: 25, cutSpeedGuidance: 'CONSTANT', soundDensity: 'MED' },
            { type: 'SUSTAIN', basePercentage: 25, cutSpeedGuidance: 'CONSTANT', soundDensity: 'MED' },
        ],
    },

    /**
     * DROP
     * Normal energy → Silence → Impact.
     * Binary structure.
     */
    DROP: {
        id: 'drop',
        name: 'Drop',
        description: 'Normal energy → Silence → Impact. Binary structure.',
        pacing: {
            start: 'CONSTANT',
            peakPositionMax: 0.6,
            silenceRequired: true, // High Priority silence
        },
        segments: [
            { type: 'BUILD', basePercentage: 50, cutSpeedGuidance: 'CONSTANT', soundDensity: 'MED' }, // The Setup
            { type: 'BREAK', basePercentage: 5, cutSpeedGuidance: 'SLOW', soundDensity: 'SILENCE' }, // The Void
            { type: 'PEAK', basePercentage: 45, cutSpeedGuidance: 'FAST', soundDensity: 'MAX' }, // The Chaos
        ],
    },

    /**
     * BREATHE
     * Minimal energy, long holds.
     * Antithesis of retention hacking.
     * 
     * CRITICAL: Cut speed is 'SLOW' for all segments.
     */
    BREATHE: {
        id: 'breathe',
        name: 'Breathe',
        description: 'Minimal energy, long holds. Antithesis of retention hacking.',
        pacing: {
            start: 'SLOW',
            peakPositionMax: 0.0, // Non-existent peak
            silenceRequired: false,
        },
        segments: [
            { type: 'SUSTAIN', basePercentage: 50, cutSpeedGuidance: 'SLOW', soundDensity: 'LOW' }, // Very Slow cuts
            { type: 'RESOLVE', basePercentage: 50, cutSpeedGuidance: 'SLOW', soundDensity: 'SILENCE' }, // High density silence
        ],
    },

    /**
     * WAVE
     * Multiple rises and falls.
     * Only valid for longer durations.
     */
    WAVE: {
        id: 'wave',
        name: 'Wave',
        description: 'Multiple rises and falls. Only valid for longer durations.',
        pacing: {
            start: 'FAST',
            peakPositionMax: 0.8, // Multiple peaks required
            silenceRequired: false,
        },
        segments: [
            { type: 'HOOK', basePercentage: 15, cutSpeedGuidance: 'FAST', soundDensity: 'MED' },
            { type: 'PEAK', basePercentage: 10, cutSpeedGuidance: 'FAST', soundDensity: 'HIGH' }, // Peak 1
            { type: 'RESOLVE', basePercentage: 20, cutSpeedGuidance: 'SLOW', soundDensity: 'LOW' }, // Valley
            { type: 'BUILD', basePercentage: 30, cutSpeedGuidance: 'ACCEL', soundDensity: 'MED' },
            { type: 'PEAK', basePercentage: 10, cutSpeedGuidance: 'FAST', soundDensity: 'MAX' }, // Peak 2
            { type: 'RESOLVE', basePercentage: 15, cutSpeedGuidance: 'DECEL', soundDensity: 'LOW' },
        ],
    },

    /**
     * RESOLVE
     * Early tension → Calm authority.
     * Inverted Surge.
     */
    RESOLVE: {
        id: 'resolve',
        name: 'Resolve',
        description: 'Early tension → Calm authority. Inverted Surge.',
        pacing: {
            start: 'FAST',
            peakPositionMax: 0.2, // Very Early Peak (10–20%)
            silenceRequired: true,
        },
        segments: [
            { type: 'PEAK', basePercentage: 20, cutSpeedGuidance: 'FAST', soundDensity: 'MAX' }, // Chaos
            { type: 'SUSTAIN', basePercentage: 30, cutSpeedGuidance: 'DECEL', soundDensity: 'MED' }, // Settling
            { type: 'RESOLVE', basePercentage: 50, cutSpeedGuidance: 'SLOW', soundDensity: 'SILENCE' }, // Authority
        ],
    },
} as const;

/**
 * Array of all structure keys for iteration.
 */
export const STRUCTURE_KEYS = Object.keys(STRUCTURES) as (keyof typeof STRUCTURES)[];

/**
 * Total number of immutable structures.
 */
export const STRUCTURE_COUNT = 7;

/**
 * Get a structure by its ID (lowercase identifier).
 * @param id - The structure ID (e.g., 'surge', 'climb')
 * @returns The structure definition or undefined if not found
 */
export function getStructureById(id: string): EmotionalStructureDef | undefined {
    const key = id.toUpperCase();
    return STRUCTURES[key];
}

/**
 * Get a structure by its key (uppercase key).
 * @param key - The structure key (e.g., 'SURGE', 'CLIMB')
 * @returns The structure definition or undefined if not found
 */
export function getStructureByKey(key: string): EmotionalStructureDef | undefined {
    return STRUCTURES[key];
}

/**
 * Validate that segment percentages sum to 100.
 * @param structure - The structure to validate
 * @returns true if valid, false otherwise
 */
export function validateSegmentPercentages(structure: EmotionalStructureDef): boolean {
    const total = structure.segments.reduce((sum, seg) => sum + seg.basePercentage, 0);
    return total === 100;
}

/**
 * Get all structures as an array.
 * @returns Array of all emotional structure definitions
 */
export function getAllStructures(): EmotionalStructureDef[] {
    return Object.values(STRUCTURES);
}
