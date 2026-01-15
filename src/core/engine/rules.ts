/**
 * The Conscience (Rules Engine)
 * 
 * Enforces narrative consistency and platform constraints.
 * Acts as the safety layer to prevent invalid or ineffective combinations.
 */

import type { Platform } from '../../context/ResonanceContext';

export interface Conflict {
    code: string;
    severity: 'WARNING' | 'BLOCK';
    message: string;
    fix: string;
}

/**
 * Validates the current configuration against the Rules of Resonance.
 * 
 * Logic Gates Implemented:
 * 1. The Boredom Protocol (TikTok + Breathe)
 * 2. Shorts Limit (YouTube Shorts + >60s)
 * 3. Wave Constraints (Wave + <20s)
 */
export const validateConfiguration = (
    duration: number,
    structureId: string,
    platform: Platform
): Conflict[] => {
    const conflicts: Conflict[] = [];
    const structId = structureId.toLowerCase();

    // 1. The Boredom Protocol
    // "Breathe" is antithetical to TikTok's high-dopamine environment
    if (platform === 'TikTok' && structId === 'breathe') {
        conflicts.push({
            code: 'BOREDOM_PROTOCOL',
            severity: 'WARNING',
            message: 'Breathe structure is high-risk on TikTok due to low retention',
            fix: 'Consider "Pulse" or "Surge" for better retention.'
        });
    }

    // 2. Shorts Limit
    // YouTube Shorts significantly penalizes videos over 60 seconds (often turning them into VODs)
    if (platform === 'YouTube Shorts' && duration > 60) {
        conflicts.push({
            code: 'SHORTS_LIMIT',
            severity: 'BLOCK',
            message: 'YouTube Shorts cannot exceed 60 seconds',
            fix: 'Reduce duration to 60s or less, or switch platform to Standard YouTube.'
        });
    }

    // 3. Wave Constraints
    // "Wave" requires multiple peaks and valleys; < 20s compresses this into noise.
    if (structId === 'wave' && duration < 20) {
        conflicts.push({
            code: 'WAVE_COMPRESSION',
            severity: 'BLOCK',
            message: 'Duration too short for complex Wave structure',
            fix: 'Increase duration to at least 20s or switch to "Surge".'
        });
    }

    return conflicts;
};
