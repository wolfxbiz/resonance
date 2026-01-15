/**
 * Frequency Analyzer
 * Advanced frequency analysis and signal processing utilities.
 */

import type { ResonanceResult } from '../../types';

/**
 * Frequency spectrum data point.
 */
export interface SpectrumPoint {
    frequency: number;
    magnitude: number;
    phase: number;
}

/**
 * Complete frequency analysis result.
 */
export interface FrequencyAnalysis {
    dominantFrequency: number;
    harmonics: number[];
    bandwidth: number;
    spectrum: SpectrumPoint[];
    analysisTime: string;
}

/**
 * Analyzes the frequency spectrum of resonance results.
 * @param results - Array of resonance calculation results
 * @returns Complete frequency analysis
 */
export function analyzeFrequencySpectrum(
    results: ResonanceResult[]
): FrequencyAnalysis {
    if (results.length === 0) {
        return {
            dominantFrequency: 0,
            harmonics: [],
            bandwidth: 0,
            spectrum: [],
            analysisTime: new Date().toISOString(),
        };
    }

    // Find dominant frequency (highest amplitude)
    const sorted = [...results].sort((a, b) => b.amplitude - a.amplitude);
    const dominantFrequency = sorted[0].frequency;

    // Calculate harmonics (integer multiples of fundamental)
    const fundamental = findFundamentalFrequency(results);
    const harmonics = calculateHarmonics(fundamental, 5);

    // Calculate bandwidth (-3dB points)
    const bandwidth = calculateBandwidth(results);

    // Generate spectrum from results
    const spectrum = results.map((r) => ({
        frequency: r.frequency,
        magnitude: r.amplitude,
        phase: r.phase,
    }));

    return {
        dominantFrequency,
        harmonics,
        bandwidth,
        spectrum: spectrum.sort((a, b) => a.frequency - b.frequency),
        analysisTime: new Date().toISOString(),
    };
}

/**
 * Identifies resonance peaks in the frequency spectrum.
 * @param results - Resonance results to analyze
 * @param threshold - Amplitude threshold for peak detection (0-1)
 * @returns Array of peak frequencies
 */
export function findResonancePeaks(
    results: ResonanceResult[],
    threshold = 0.5
): number[] {
    if (results.length < 3) {
        return results.map((r) => r.frequency);
    }

    const maxAmplitude = Math.max(...results.map((r) => r.amplitude));
    const thresholdValue = maxAmplitude * threshold;

    const peaks: number[] = [];
    const sorted = [...results].sort((a, b) => a.frequency - b.frequency);

    for (let i = 1; i < sorted.length - 1; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        const next = sorted[i + 1];

        // Check if current point is a local maximum above threshold
        if (
            curr.amplitude > prev.amplitude &&
            curr.amplitude > next.amplitude &&
            curr.amplitude >= thresholdValue
        ) {
            peaks.push(curr.frequency);
        }
    }

    return peaks;
}

/**
 * Calculates the modal coupling between two segments.
 * @param segment1 - First segment resonance
 * @param segment2 - Second segment resonance
 * @returns Coupling coefficient (0-1)
 */
export function calculateModalCoupling(
    segment1: ResonanceResult,
    segment2: ResonanceResult
): number {
    // Coupling based on frequency proximity and phase relationship
    const freqRatio = Math.min(segment1.frequency, segment2.frequency) /
        Math.max(segment1.frequency, segment2.frequency);

    const phaseDiff = Math.abs(segment1.phase - segment2.phase);
    const phaseAlignment = Math.cos(phaseDiff);

    // Combined coupling coefficient
    const coupling = freqRatio * Math.abs(phaseAlignment);

    return Math.round(coupling * 1000) / 1000;
}

/**
 * Estimates critical frequencies that may cause resonance issues.
 * @param segments - Array of segments to analyze
 * @param operatingRange - Operating frequency range [min, max]
 * @returns Array of critical frequencies within operating range
 */
export function identifyCriticalFrequencies(
    results: ResonanceResult[],
    operatingRange: [number, number]
): number[] {
    const [minFreq, maxFreq] = operatingRange;

    return results
        .filter((r) => r.frequency >= minFreq && r.frequency <= maxFreq)
        .filter((r) => r.qualityFactor > 10) // High Q-factor indicates sharp resonance
        .map((r) => r.frequency)
        .sort((a, b) => a - b);
}

/**
 * Finds the fundamental frequency from a set of results.
 */
function findFundamentalFrequency(results: ResonanceResult[]): number {
    const frequencies = results.map((r) => r.frequency).filter((f) => f > 0);

    if (frequencies.length === 0) return 0;
    if (frequencies.length === 1) return frequencies[0];

    // Find GCD of frequencies (approximate fundamental)
    let gcd = frequencies[0];
    for (let i = 1; i < frequencies.length; i++) {
        gcd = approximateGCD(gcd, frequencies[i]);
    }

    return Math.round(gcd * 100) / 100;
}

/**
 * Calculates harmonic frequencies.
 */
function calculateHarmonics(fundamental: number, count: number): number[] {
    if (fundamental <= 0) return [];

    const harmonics: number[] = [];
    for (let n = 1; n <= count; n++) {
        harmonics.push(Math.round(fundamental * n * 100) / 100);
    }

    return harmonics;
}

/**
 * Calculates the bandwidth of the frequency response.
 */
function calculateBandwidth(results: ResonanceResult[]): number {
    if (results.length < 2) return 0;

    const frequencies = results.map((r) => r.frequency);
    const minFreq = Math.min(...frequencies);
    const maxFreq = Math.max(...frequencies);

    return Math.round((maxFreq - minFreq) * 100) / 100;
}

/**
 * Approximate GCD for floating point numbers.
 */
function approximateGCD(a: number, b: number, epsilon = 1): number {
    a = Math.abs(a);
    b = Math.abs(b);

    while (b > epsilon) {
        const temp = b;
        b = a % b;
        a = temp;
    }

    return a;
}
