/**
 * Quality Score Analyzer
 * 
 * Analyzes the generated timeline for retention best practices and emotional pacing.
 * Provides a score (0-100) and actionable feedback.
 */

import type { CalculatedSegment } from './calculator';
import type { Platform } from '../../context/ResonanceContext';

export interface QualityReport {
    totalScore: number;
    feedback: string[];
}

/**
 * Calculates a quality score for the current timeline configuration.
 * 
 * Rules:
 * 1. Hook Penalty: TikTok/Reels/Shorts hooks > 3s are penalized.
 * 2. Pacing Check: Average segment duration should be between 2s and 15s.
 * 3. Contrast Check: Energy must have variation (at least one HIGH/MAX peak).
 * 
 * @param timeline - The calculated timeline segments
 * @param platform - The target platform
 * @returns QualityReport with score and feedback
 */
export const calculateQuality = (
    timeline: CalculatedSegment[],
    platform: Platform,
): QualityReport => {
    let score = 100;
    const feedback: string[] = [];

    // 1. Hook Penalty
    // Affects short-form vertical video platforms mostly
    const isShortForm = platform === 'TikTok' || platform === 'Instagram' || platform === 'YouTube Shorts';
    if (isShortForm && timeline.length > 0) {
        const hook = timeline[0];
        // Check if first segment is meant to be a hook (usually first segment is hook/intro)
        // Even if not explicitly named HOOK, the opening seconds are the de-facto hook.
        if (hook.duration > 3) {
            score -= 20;
            feedback.push(`Hook is ${hook.duration}s. Aim for <3s for retention on ${platform}.`);
        }
    }

    // 2. Pacing Check (Average Duration)
    if (timeline.length > 0) {
        const totalDuration = timeline.reduce((acc, seg) => acc + seg.duration, 0);
        const avgDuration = totalDuration / timeline.length;

        if (avgDuration < 2.0) {
            score -= 15;
            feedback.push(`Pacing is too choppy (Avg: ${avgDuration.toFixed(1)}s). Consolidate segments.`);
        } else if (avgDuration > 15.0) {
            score -= 15;
            feedback.push(`Pacing is too slow (Avg: ${avgDuration.toFixed(1)}s). Add more cuts.`);
        }
    }

    // 3. Contrast Check (Dynamic Range)
    // Check if sound density reaches HIGH or MAX at any point
    const hasHighEnergy = timeline.some(seg =>
        seg.soundDensity === 'MAX' || seg.soundDensity === 'HIGH'
    );

    if (!hasHighEnergy) {
        score -= 10;
        feedback.push('Energy is too flat. Add a Peak or Surge segment for contrast.');
    }

    // Clamp score min to 0
    return {
        totalScore: Math.max(0, score),
        feedback
    };
};
