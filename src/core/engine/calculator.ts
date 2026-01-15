/**
 * Integer Partitioning Engine
 * 
 * Uses the Largest Remainder Method (LRM) to distribute seconds
 * across segments without rounding drift.
 * 
 * ⚠️  DO NOT OPTIMIZE WITH STANDARD ROUNDING ⚠️
 * Standard rounding causes drift and segments won't sum correctly.
 */

import type { EmotionalStructureDef, EmotionalSegment } from '../../types';
import type { Platform } from '../../context/ResonanceContext';

// ... existing interfaces ...

/**
 * A calculated segment with timing information.
 * Extends EmotionalSegment with computed duration and time bounds.
 */
export interface CalculatedSegment extends EmotionalSegment {
    /** The calculated integer seconds for this segment */
    duration: number;
    /** Start time in seconds from beginning */
    startTime: number;
    /** End time in seconds from beginning */
    endTime: number;
}

/**
 * Calculates a timeline of segments with exact integer durations.
 * ...
 * @param platform - Optional target platform for constraint application
 */
export const calculateTimeline = (
    totalSeconds: number,
    structure: EmotionalStructureDef,
    platform?: Platform
): CalculatedSegment[] => {
    // 1. Calculate Raw Values (float)
    const rawValues = structure.segments.map(s => ({
        original: s,
        raw: (s.basePercentage / 100) * totalSeconds
    }));

    // 2. Floor and Remainder separation
    const parts = rawValues.map((val, index) => ({
        index,
        original: val.original,
        integer: Math.floor(val.raw),
        remainder: val.raw - Math.floor(val.raw)
    }));

    // 3. Calculate Deficit (Total - Sum of Integers)
    const sumInt = parts.reduce((acc, curr) => acc + curr.integer, 0);
    const deficit = totalSeconds - sumInt; // deficit is definitely integer

    // 4. Distribute Deficit to segments with highest remainders
    const sortedByRemainder = [...parts].sort((a, b) => b.remainder - a.remainder);

    for (let i = 0; i < deficit; i++) {
        const winnerIndex = sortedByRemainder[i].index;
        const partToBump = parts.find(p => p.index === winnerIndex);
        if (partToBump) {
            partToBump.integer += 1;
        }
    }

    // ---------------------------------------------------------
    // SMART HOOK CLAMPING (Section 3.3)
    // ---------------------------------------------------------
    if (platform === 'TikTok' || platform === 'Instagram' || platform === 'YouTube Shorts') {
        const hookPart = parts.find(p => p.original.type === 'HOOK');
        const buildPart = parts.find(p => p.original.type === 'BUILD');

        if (hookPart && buildPart && hookPart.integer > 3) {
            const stolenSeconds = hookPart.integer - 3;

            // Apply the transfer
            hookPart.integer = 3;
            buildPart.integer += stolenSeconds;

            // Log/Warn if needed (in a real system, we might return this metadata)
        }
    }

    // 5. Re-assemble the timeline in chronological order
    let currentTime = 0;
    return parts.map(part => {
        const duration = part.integer;
        const segment: CalculatedSegment = {
            ...part.original,
            duration,
            startTime: currentTime,
            endTime: currentTime + duration
        };
        currentTime += duration;
        return segment;
    });
};
/**
 * Validates that calculated segments sum to the expected total.
 * @param segments - Array of calculated segments
 * @param expectedTotal - Expected total duration
 * @returns true if segments sum correctly
 */
export const validateTimelineSum = (
    segments: CalculatedSegment[],
    expectedTotal: number
): boolean => {
    const actualTotal = segments.reduce((sum, seg) => sum + seg.duration, 0);
    return actualTotal === expectedTotal;
};

/**
 * Formats a timeline for display/logging.
 * @param segments - Array of calculated segments
 * @returns Formatted string representation
 */
export const formatTimeline = (segments: CalculatedSegment[]): string => {
    const lines = segments.map((seg, i) =>
        `  [${i + 1}] ${seg.type.padEnd(8)} | ${seg.duration.toString().padStart(3)}s | ${seg.startTime.toString().padStart(3)}s → ${seg.endTime.toString().padStart(3)}s | ${seg.cutSpeedGuidance} | ${seg.soundDensity}`
    );

    const total = segments.reduce((sum, seg) => sum + seg.duration, 0);

    return [
        '┌─────────────────────────────────────────────────────────────┐',
        '│                    CALCULATED TIMELINE                      │',
        '├─────────────────────────────────────────────────────────────┤',
        '│  #   Type     │ Dur  │ Time Range  │ Speed    │ Density    │',
        '├─────────────────────────────────────────────────────────────┤',
        ...lines,
        '├─────────────────────────────────────────────────────────────┤',
        `│  TOTAL: ${total}s                                            │`,
        '└─────────────────────────────────────────────────────────────┘'
    ].join('\n');
};
