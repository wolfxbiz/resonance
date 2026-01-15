/**
 * Resonance Calculator
 * Core mathematical engine for resonance frequency calculations.
 */

import type { Segment, ResonanceResult, SegmentType } from '../../types';

/**
 * Material properties used in resonance calculations.
 */
interface MaterialProperties {
    density: number; // kg/m³
    elasticModulus: number; // GPa
    dampingCoefficient: number; // dimensionless
}

/**
 * Default material properties for unknown materials.
 */
const DEFAULT_MATERIAL: MaterialProperties = {
    density: 7850, // Steel
    elasticModulus: 200, // GPa
    dampingCoefficient: 0.02,
};

/**
 * Material property lookup table.
 */
const MATERIAL_PROPERTIES: Record<string, MaterialProperties> = {
    steel: { density: 7850, elasticModulus: 200, dampingCoefficient: 0.02 },
    aluminum: { density: 2700, elasticModulus: 70, dampingCoefficient: 0.01 },
    copper: { density: 8960, elasticModulus: 120, dampingCoefficient: 0.015 },
    titanium: { density: 4500, elasticModulus: 116, dampingCoefficient: 0.008 },
    default: DEFAULT_MATERIAL,
};

/**
 * Calculates the natural resonance frequency for a segment.
 * Uses the formula: f = (1/2L) * sqrt(E/ρ)
 * where L = length, E = elastic modulus, ρ = density
 *
 * @param segment - The segment to analyze
 * @param materialProps - Optional material properties override
 * @returns Resonance result for the segment
 */
export function calculateResonance(
    segment: Segment,
    materialProps?: Partial<MaterialProperties>
): ResonanceResult {
    const material = getMaterialProperties(segment.materialId);
    const props = { ...material, ...materialProps };

    // Calculate segment length if not provided
    const length = segment.length > 0 ? segment.length : calculateSegmentLength(segment);

    // Convert length to meters for calculation
    const lengthM = length / 1000;

    // Calculate fundamental frequency
    // f = (n * π / L) * sqrt(E * I / (ρ * A))
    // Simplified for beam: f = (1 / 2L) * sqrt(E / ρ)
    const frequency = calculateNaturalFrequency(lengthM, props);

    // Calculate amplitude based on segment type
    const amplitude = calculateAmplitude(segment.type, lengthM, props);

    // Calculate phase shift
    const phase = calculatePhaseShift(segment.type, frequency);

    // Calculate Q-factor (quality factor)
    const qualityFactor = 1 / (2 * props.dampingCoefficient);

    return {
        segmentId: segment.id,
        frequency: Math.round(frequency * 100) / 100,
        amplitude: Math.round(amplitude * 1000) / 1000,
        phase: Math.round(phase * 1000) / 1000,
        qualityFactor: Math.round(qualityFactor * 10) / 10,
        calculatedAt: new Date().toISOString(),
    };
}

/**
 * Batch calculates resonance for multiple segments.
 */
export function calculateBatchResonance(
    segments: Segment[],
    materialPropsOverride?: Partial<MaterialProperties>
): ResonanceResult[] {
    return segments.map((segment) =>
        calculateResonance(segment, materialPropsOverride)
    );
}

/**
 * Calculates the natural frequency of a beam segment.
 */
function calculateNaturalFrequency(
    lengthM: number,
    props: MaterialProperties
): number {
    if (lengthM <= 0) return 0;

    // E in Pa (convert from GPa)
    const E = props.elasticModulus * 1e9;

    // Wave speed in material: c = sqrt(E / ρ)
    const waveSpeed = Math.sqrt(E / props.density);

    // Fundamental frequency: f = c / (2 * L)
    return waveSpeed / (2 * lengthM);
}

/**
 * Calculates amplitude based on segment type and properties.
 */
function calculateAmplitude(
    type: SegmentType,
    lengthM: number,
    props: MaterialProperties
): number {
    // Amplitude modifier based on segment type
    const typeModifiers: Record<SegmentType, number> = {
        LINEAR: 1.0,
        ARC: 0.85,
        SPLINE: 0.75,
        TRANSITION: 0.6,
        TERMINAL: 0.5,
    };

    const modifier = typeModifiers[type] || 1.0;

    // Base amplitude calculation (normalized)
    // A = (1 / damping) * (L / sqrt(E))
    const E = props.elasticModulus * 1e9;
    const baseAmplitude = lengthM / Math.sqrt(E) / props.dampingCoefficient;

    return baseAmplitude * modifier * 1e6; // Scale to micrometers
}

/**
 * Calculates phase shift based on segment type and frequency.
 */
function calculatePhaseShift(type: SegmentType, frequency: number): number {
    // Phase shift varies by segment type
    const basePhase: Record<SegmentType, number> = {
        LINEAR: 0,
        ARC: Math.PI / 6,
        SPLINE: Math.PI / 4,
        TRANSITION: Math.PI / 3,
        TERMINAL: Math.PI / 2,
    };

    // Add frequency-dependent component
    const freqComponent = (frequency % 100) * (Math.PI / 1000);

    return (basePhase[type] || 0) + freqComponent;
}

/**
 * Gets material properties from the lookup table.
 */
function getMaterialProperties(materialId: string): MaterialProperties {
    const normalized = materialId.toLowerCase();
    return MATERIAL_PROPERTIES[normalized] || DEFAULT_MATERIAL;
}

/**
 * Calculates the Euclidean distance between start and end points.
 */
function calculateSegmentLength(segment: Segment): number {
    const dx = segment.endPoint[0] - segment.startPoint[0];
    const dy = segment.endPoint[1] - segment.startPoint[1];
    const dz = segment.endPoint[2] - segment.startPoint[2];

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
