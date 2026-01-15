/**
 * Structure Parser
 * Parses JSON structure definitions into typed StructureDef objects.
 */

import type { StructureDef, Segment, SegmentType } from '../../types';

/**
 * Parses a raw JSON object into a validated StructureDef.
 * @param json - Raw JSON object representing a structure
 * @returns Parsed and typed StructureDef
 * @throws Error if the JSON structure is invalid
 */
export function parseStructure(json: unknown): StructureDef {
    if (!json || typeof json !== 'object') {
        throw new Error('Invalid structure: expected an object');
    }

    const data = json as Record<string, unknown>;

    // Validate required fields
    if (!data.id || typeof data.id !== 'string') {
        throw new Error('Invalid structure: missing or invalid id');
    }

    if (!data.name || typeof data.name !== 'string') {
        throw new Error('Invalid structure: missing or invalid name');
    }

    if (!Array.isArray(data.segments)) {
        throw new Error('Invalid structure: segments must be an array');
    }

    // Parse segments
    const segments = data.segments.map((seg, index) => parseSegment(seg, index));

    // Calculate bounds from segments
    const bounds = calculateBounds(segments);

    return {
        id: data.id,
        name: data.name,
        version: (data.version as string) || '1.0.0',
        createdAt: (data.createdAt as string) || new Date().toISOString(),
        updatedAt: (data.updatedAt as string) || new Date().toISOString(),
        author: (data.author as string) || 'Unknown',
        description: data.description as string | undefined,
        segments,
        bounds,
        defaultCutSpeed: parseCutSpeed(data.defaultCutSpeed),
        validationStatus: 'PENDING' as const,
        tags: Array.isArray(data.tags) ? data.tags as string[] : [],
        metadata: data.metadata as Record<string, unknown> | undefined,
    };
}

/**
 * Parses a single segment from JSON.
 */
function parseSegment(data: unknown, index: number): Segment {
    if (!data || typeof data !== 'object') {
        throw new Error(`Invalid segment at index ${index}`);
    }

    const seg = data as Record<string, unknown>;

    return {
        id: (seg.id as string) || `segment-${index}`,
        type: (seg.type as SegmentType) || 'LINEAR',
        startPoint: parsePoint(seg.startPoint, 'startPoint', index),
        endPoint: parsePoint(seg.endPoint, 'endPoint', index),
        length: (seg.length as number) || 0,
        materialId: (seg.materialId as string) || 'default',
        metadata: seg.metadata as Record<string, unknown> | undefined,
    };
}

/**
 * Parses a 3D point from JSON.
 */
function parsePoint(
    data: unknown,
    fieldName: string,
    segmentIndex: number
): [number, number, number] {
    if (!Array.isArray(data) || data.length !== 3) {
        throw new Error(
            `Invalid ${fieldName} in segment ${segmentIndex}: expected [x, y, z]`
        );
    }

    return [Number(data[0]), Number(data[1]), Number(data[2])];
}

/**
 * Parses cut speed configuration from JSON.
 */
function parseCutSpeed(data: unknown) {
    const defaultCutSpeed = {
        value: 100,
        unit: 'mm/s' as const,
        materialHardness: 'MEDIUM' as const,
        minSpeed: 10,
        maxSpeed: 500,
        feedRate: 0.1,
        depthOfCut: 1,
        requiresCooling: false,
    };

    if (!data || typeof data !== 'object') {
        return defaultCutSpeed;
    }

    const cs = data as Record<string, unknown>;

    return {
        value: (cs.value as number) ?? defaultCutSpeed.value,
        unit: (cs.unit as typeof defaultCutSpeed.unit) ?? defaultCutSpeed.unit,
        materialHardness:
            (cs.materialHardness as typeof defaultCutSpeed.materialHardness) ??
            defaultCutSpeed.materialHardness,
        minSpeed: (cs.minSpeed as number) ?? defaultCutSpeed.minSpeed,
        maxSpeed: (cs.maxSpeed as number) ?? defaultCutSpeed.maxSpeed,
        feedRate: (cs.feedRate as number) ?? defaultCutSpeed.feedRate,
        depthOfCut: (cs.depthOfCut as number) ?? defaultCutSpeed.depthOfCut,
        requiresCooling: (cs.requiresCooling as boolean) ?? defaultCutSpeed.requiresCooling,
        tolerance: cs.tolerance as number | undefined,
    };
}

/**
 * Calculates the bounding box from an array of segments.
 */
function calculateBounds(segments: Segment[]) {
    if (segments.length === 0) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 };
    }

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    for (const seg of segments) {
        const points = [seg.startPoint, seg.endPoint];
        for (const [x, y, z] of points) {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
        }
    }

    return { minX, maxX, minY, maxY, minZ, maxZ };
}
