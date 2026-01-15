/**
 * Structure Modifiers
 * 
 * Logic to dynamically alter Emotional Structures based on content constraints
 * (e.g., Dialogue, Platform specific limits).
 */

import type { EmotionalStructureDef } from '../../types';

/**
 * Applies constraints for speech-heavy content.
 * 
 * Rules:
 * 1. Sound Density Cap: MAX/HIGH -> MED (to allow voice clarity)
 * 2. Cut Speed Limit: FAST -> MODERATE (to prevent visual overwhelm during speech)
 * 
 * @param structure - The immutable structure to modify (creates a clone)
 * @returns A modified structure definition optimized for dialogue
 */
export const applyDialogueConstraints = (structure: EmotionalStructureDef): EmotionalStructureDef => {
    // Deep clone to prevent mutating the immutable library
    const modified: EmotionalStructureDef = {
        ...structure,
        segments: structure.segments.map(seg => ({ ...seg }))
    };

    modified.segments.forEach(seg => {
        // 1. Density Cap
        if (seg.soundDensity === 'MAX' || seg.soundDensity === 'HIGH') {
            seg.soundDensity = 'MED';
        }

        // 2. Cut Speed Limit
        if (seg.cutSpeedGuidance === 'FAST') {
            seg.cutSpeedGuidance = 'MODERATE';
        }
    });

    return modified;
};
