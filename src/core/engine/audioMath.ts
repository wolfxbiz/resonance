/**
 * Audio Math Helpers for Phase 2
 */

/**
 * Calculates the number of frames per beat based on BPM and FPS.
 * Formula: (fps * 60) / bpm
 * 
 * @param bpm - Beats per minute
 * @param fps - Frames per second (default 30)
 * @returns Number of frames per beat
 */
export const calculateFramesPerBeat = (bpm: number, fps: number = 30): number => {
    return (fps * 60) / bpm;
};
