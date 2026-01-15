/**
 * Structure Validator
 * Validates StructureDef objects for correctness and completeness.
 */

import type {
    StructureDef,
    Segment,
    StructureValidationStatus,
} from '../../types';

export interface ValidationResult {
    status: StructureValidationStatus;
    errors: string[];
    warnings: string[];
}

/**
 * Validates a complete structure definition.
 * @param structure - The structure to validate
 * @returns Validation result with status, errors, and warnings
 */
export function validateStructure(structure: StructureDef): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!structure.id || structure.id.trim() === '') {
        errors.push('Structure ID is required');
    }

    if (!structure.name || structure.name.trim() === '') {
        errors.push('Structure name is required');
    }

    // Segments validation
    if (!structure.segments || structure.segments.length === 0) {
        errors.push('Structure must contain at least one segment');
    } else {
        structure.segments.forEach((segment, index) => {
            const segmentErrors = validateSegment(segment, index);
            errors.push(...segmentErrors);
        });

        // Check for segment connectivity
        const connectivityWarnings = checkSegmentConnectivity(structure.segments);
        warnings.push(...connectivityWarnings);
    }

    // Cut speed validation
    if (structure.defaultCutSpeed) {
        const cutSpeedErrors = validateCutSpeed(structure.defaultCutSpeed);
        errors.push(...cutSpeedErrors);
    }

    // Bounds validation
    if (structure.bounds) {
        if (structure.bounds.maxX < structure.bounds.minX) {
            errors.push('Invalid bounds: maxX must be >= minX');
        }
        if (structure.bounds.maxY < structure.bounds.minY) {
            errors.push('Invalid bounds: maxY must be >= minY');
        }
        if (structure.bounds.maxZ < structure.bounds.minZ) {
            errors.push('Invalid bounds: maxZ must be >= minZ');
        }
    }

    const status: StructureValidationStatus =
        errors.length > 0
            ? 'INVALID'
            : warnings.length > 0
                ? 'WARNING'
                : 'VALID';

    return { status, errors, warnings };
}

/**
 * Validates a single segment.
 */
function validateSegment(segment: Segment, index: number): string[] {
    const errors: string[] = [];
    const prefix = `Segment ${index} (${segment.id})`;

    if (!segment.id || segment.id.trim() === '') {
        errors.push(`${prefix}: ID is required`);
    }

    if (!segment.type) {
        errors.push(`${prefix}: Type is required`);
    }

    // Validate coordinates
    if (!isValidPoint(segment.startPoint)) {
        errors.push(`${prefix}: Invalid start point`);
    }

    if (!isValidPoint(segment.endPoint)) {
        errors.push(`${prefix}: Invalid end point`);
    }

    // Validate length
    if (segment.length < 0) {
        errors.push(`${prefix}: Length cannot be negative`);
    }

    if (segment.length === 0 && !arePointsEqual(segment.startPoint, segment.endPoint)) {
        errors.push(`${prefix}: Length is 0 but start and end points differ`);
    }

    return errors;
}

/**
 * Validates cut speed configuration.
 */
function validateCutSpeed(cutSpeed: { value: number; minSpeed: number; maxSpeed: number }): string[] {
    const errors: string[] = [];

    if (cutSpeed.value < 0) {
        errors.push('Cut speed value cannot be negative');
    }

    if (cutSpeed.minSpeed < 0) {
        errors.push('Minimum cut speed cannot be negative');
    }

    if (cutSpeed.maxSpeed < cutSpeed.minSpeed) {
        errors.push('Maximum cut speed must be >= minimum speed');
    }

    if (cutSpeed.value < cutSpeed.minSpeed || cutSpeed.value > cutSpeed.maxSpeed) {
        errors.push('Cut speed value must be within min/max range');
    }

    return errors;
}

/**
 * Checks if segments are properly connected (endpoint to startpoint).
 */
function checkSegmentConnectivity(segments: Segment[]): string[] {
    const warnings: string[] = [];

    for (let i = 0; i < segments.length - 1; i++) {
        const current = segments[i];
        const next = segments[i + 1];

        if (!arePointsEqual(current.endPoint, next.startPoint)) {
            warnings.push(
                `Gap detected between segment ${i} and ${i + 1}: ` +
                `end point [${current.endPoint.join(', ')}] does not match ` +
                `start point [${next.startPoint.join(', ')}]`
            );
        }
    }

    return warnings;
}

/**
 * Validates that a point is a valid 3D coordinate.
 */
function isValidPoint(point: [number, number, number]): boolean {
    return (
        Array.isArray(point) &&
        point.length === 3 &&
        point.every((coord) => typeof coord === 'number' && isFinite(coord))
    );
}

/**
 * Checks if two 3D points are equal within a small epsilon.
 */
function arePointsEqual(
    a: [number, number, number],
    b: [number, number, number],
    epsilon = 0.0001
): boolean {
    return (
        Math.abs(a[0] - b[0]) < epsilon &&
        Math.abs(a[1] - b[1]) < epsilon &&
        Math.abs(a[2] - b[2]) < epsilon
    );
}
