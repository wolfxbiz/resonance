/**
 * Resonance Engine - Core Type Definitions
 * Strictly typed interfaces for segment analysis, cut operations, and structure definitions.
 */

// ============================================================================
// Segment Types
// ============================================================================

/**
 * Available segment types in the resonance structure.
 * Each segment type has distinct physical and resonance properties.
 */
export const SegmentType = {
    /** Standard linear segment with uniform properties */
    LINEAR: 'LINEAR',
    /** Curved segment following an arc trajectory */
    ARC: 'ARC',
    /** Complex spline-based segment with variable curvature */
    SPLINE: 'SPLINE',
    /** Transition segment connecting different segment types */
    TRANSITION: 'TRANSITION',
    /** Terminal segment marking structure endpoints */
    TERMINAL: 'TERMINAL',
} as const;

export type SegmentType = (typeof SegmentType)[keyof typeof SegmentType];

/**
 * Interface representing a single segment within a structure.
 */
export interface Segment {
    /** Unique identifier for the segment */
    id: string;
    /** Type classification of the segment */
    type: SegmentType;
    /** Starting position coordinates [x, y, z] */
    startPoint: [number, number, number];
    /** Ending position coordinates [x, y, z] */
    endPoint: [number, number, number];
    /** Length of the segment in millimeters */
    length: number;
    /** Material identifier reference */
    materialId: string;
    /** Optional metadata for extended segment properties */
    metadata?: Record<string, unknown>;
}

// ============================================================================
// Cut Speed Configuration
// ============================================================================

/**
 * Units for cut speed measurement.
 */
export type CutSpeedUnit = 'mm/s' | 'm/min' | 'in/s' | 'ft/min';

/**
 * Material hardness classification affecting cut speed.
 */
export const MaterialHardness = {
    SOFT: 'SOFT',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD',
    ULTRA_HARD: 'ULTRA_HARD',
} as const;

export type MaterialHardness = (typeof MaterialHardness)[keyof typeof MaterialHardness];

/**
 * Cut speed configuration for material processing operations.
 * Defines the velocity and parameters for cutting operations.
 */
export interface CutSpeed {
    /** Base cutting speed value */
    value: number;
    /** Unit of measurement for the speed */
    unit: CutSpeedUnit;
    /** Material hardness classification */
    materialHardness: MaterialHardness;
    /** Minimum allowable speed for safe operation */
    minSpeed: number;
    /** Maximum allowable speed for safe operation */
    maxSpeed: number;
    /** Recommended feed rate in mm/rev */
    feedRate: number;
    /** Depth of cut per pass in millimeters */
    depthOfCut: number;
    /** Cooling requirement flag */
    requiresCooling: boolean;
    /** Optional tolerance percentage (±) */
    tolerance?: number;
}

/**
 * Preset cut speed configurations for common materials.
 */
export interface CutSpeedPreset {
    /** Preset identifier */
    id: string;
    /** Display name for the preset */
    name: string;
    /** Description of the preset's intended use */
    description: string;
    /** The cut speed configuration */
    cutSpeed: CutSpeed;
    /** Tags for categorization */
    tags: string[];
}

// ============================================================================
// Structure Definition
// ============================================================================

/**
 * Validation status for structure definitions.
 */
export const StructureValidationStatus = {
    VALID: 'VALID',
    INVALID: 'INVALID',
    PENDING: 'PENDING',
    WARNING: 'WARNING',
} as const;

export type StructureValidationStatus = (typeof StructureValidationStatus)[keyof typeof StructureValidationStatus];

/**
 * Dimensional constraints for a structure.
 */
export interface StructureBounds {
    /** Minimum X coordinate */
    minX: number;
    /** Maximum X coordinate */
    maxX: number;
    /** Minimum Y coordinate */
    minY: number;
    /** Maximum Y coordinate */
    maxY: number;
    /** Minimum Z coordinate */
    minZ: number;
    /** Maximum Z coordinate */
    maxZ: number;
}

/**
 * Complete structure definition containing all segments and metadata.
 * This is the primary data structure for the resonance engine.
 */
export interface StructureDef {
    /** Unique identifier for the structure */
    id: string;
    /** Human-readable name for the structure */
    name: string;
    /** Semantic version of the structure definition */
    version: string;
    /** ISO 8601 timestamp of creation */
    createdAt: string;
    /** ISO 8601 timestamp of last modification */
    updatedAt: string;
    /** Author or creator identifier */
    author: string;
    /** Optional description of the structure */
    description?: string;
    /** Array of segments composing the structure */
    segments: Segment[];
    /** Dimensional bounds of the structure */
    bounds: StructureBounds;
    /** Default cut speed configuration for this structure */
    defaultCutSpeed: CutSpeed;
    /** Validation status of the structure */
    validationStatus: StructureValidationStatus;
    /** Validation error messages, if any */
    validationErrors?: string[];
    /** Optional tags for categorization */
    tags?: string[];
    /** Custom metadata storage */
    metadata?: Record<string, unknown>;
}

// ============================================================================
// Engine State Types
// ============================================================================

/**
 * Processing state of the resonance engine.
 */
export const EngineState = {
    IDLE: 'IDLE',
    LOADING: 'LOADING',
    PROCESSING: 'PROCESSING',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR',
} as const;

export type EngineState = (typeof EngineState)[keyof typeof EngineState];

/**
 * Result of a resonance calculation.
 */
export interface ResonanceResult {
    /** The segment ID that was analyzed */
    segmentId: string;
    /** Calculated resonance frequency in Hz */
    frequency: number;
    /** Amplitude of the resonance */
    amplitude: number;
    /** Phase shift in radians */
    phase: number;
    /** Quality factor (Q-factor) */
    qualityFactor: number;
    /** Timestamp of the calculation */
    calculatedAt: string;
}

/**
 * Complete engine output containing all calculation results.
 */
export interface EngineOutput {
    /** Reference to the source structure */
    structureId: string;
    /** All resonance calculation results */
    results: ResonanceResult[];
    /** Total processing time in milliseconds */
    processingTime: number;
    /** Engine state at completion */
    state: EngineState;
    /** Any warnings generated during processing */
    warnings?: string[];
}

// ============================================================================
// Action Types for Reducer
// ============================================================================

/**
 * Action types for the application state reducer.
 */
export type AppAction =
    | { type: 'LOAD_STRUCTURE'; payload: StructureDef }
    | { type: 'UPDATE_SEGMENT'; payload: { id: string; segment: Partial<Segment> } }
    | { type: 'ADD_SEGMENT'; payload: Segment }
    | { type: 'REMOVE_SEGMENT'; payload: string }
    | { type: 'SET_CUT_SPEED'; payload: CutSpeed }
    | { type: 'SET_ENGINE_STATE'; payload: EngineState }
    | { type: 'SET_RESULTS'; payload: ResonanceResult[] }
    | { type: 'CLEAR_RESULTS' }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' };

/**
 * Application state interface for the context.
 */
export interface AppState {
    /** Currently loaded structure, if any */
    currentStructure: StructureDef | null;
    /** Active cut speed configuration */
    activeCutSpeed: CutSpeed | null;
    /** Current engine processing state */
    engineState: EngineState;
    /** Results from the latest calculation */
    results: ResonanceResult[];
    /** Current error message, if any */
    error: string | null;
    /** Loading indicator */
    isLoading: boolean;
}

// ============================================================================
// Emotional Logic Matrix Types
// ============================================================================

/**
 * Emotional segment types for video structure pacing.
 * These define the narrative function of each segment.
 */
export const EmotionalSegmentType = {
    /** Opening hook to capture attention */
    HOOK: 'HOOK',
    /** Rising action building tension */
    BUILD: 'BUILD',
    /** Climactic peak moment */
    PEAK: 'PEAK',
    /** Sustained energy plateau */
    SUSTAIN: 'SUSTAIN',
    /** Resolution and conclusion */
    RESOLVE: 'RESOLVE',
    /** Silence/pause for impact */
    BREAK: 'BREAK',
} as const;

export type EmotionalSegmentType = (typeof EmotionalSegmentType)[keyof typeof EmotionalSegmentType];

/**
 * Cut speed guidance for video editing pacing.
 * Controls the rhythm and tempo of cuts.
 */
export const CutSpeedGuidance = {
    /** Fast-paced cutting */
    FAST: 'FAST',
    /** Slow, deliberate cuts */
    SLOW: 'SLOW',
    /** Accelerating cut rhythm */
    ACCEL: 'ACCEL',
    /** Decelerating cut rhythm */
    DECEL: 'DECEL',
    /** Constant, steady rhythm */
    CONSTANT: 'CONSTANT',
    /** Moderate rhythm for dialogue */
    MODERATE: 'MODERATE',
} as const;

export type CutSpeedGuidance = (typeof CutSpeedGuidance)[keyof typeof CutSpeedGuidance];

/**
 * Sound density levels for audio layering.
 * Controls the fullness of the soundscape.
 */
export const SoundDensity = {
    /** Complete silence */
    SILENCE: 'SILENCE',
    /** Minimal sound elements */
    LOW: 'LOW',
    /** Moderate sound layering */
    MED: 'MED',
    /** Rich, full sound */
    HIGH: 'HIGH',
    /** Maximum intensity sound */
    MAX: 'MAX',
} as const;

export type SoundDensity = (typeof SoundDensity)[keyof typeof SoundDensity];

/**
 * Pacing start speed options.
 * Defines how a structure begins.
 */
export const PacingStart = {
    /** High energy opening */
    FAST: 'FAST',
    /** Gentle, measured opening */
    SLOW: 'SLOW',
    /** Steady, unchanging opening */
    CONSTANT: 'CONSTANT',
} as const;

export type PacingStart = (typeof PacingStart)[keyof typeof PacingStart];

/**
 * Pacing configuration for emotional structures.
 * Defines the rhythm and timing rules for a structure.
 */
export interface Pacing {
    /** Starting energy level */
    start: PacingStart;
    /** Maximum position for peak (0.0 - 1.0, where 1.0 = end) */
    peakPositionMax: number;
    /** Whether silence is required before peak moments */
    silenceRequired: boolean;
}

/**
 * Emotional segment within a structure.
 * Defines the properties of a single segment in the emotional arc.
 */
export interface EmotionalSegment {
    /** Narrative function of this segment */
    type: EmotionalSegmentType;
    /** Base percentage of total duration (must sum to 100 across all segments) */
    basePercentage: number;
    /** Cut speed guidance for this segment */
    cutSpeedGuidance: CutSpeedGuidance;
    /** Sound density level for this segment */
    soundDensity: SoundDensity;
}

/**
 * Emotional Structure Definition.
 * Represents one of the 7 immutable emotional structures.
 * This is the core data type for the Emotional Logic Matrix.
 */
export interface EmotionalStructureDef {
    /** Unique identifier (lowercase) */
    id: string;
    /** Display name */
    name: string;
    /** Description of the structure's purpose and best use case */
    description: string;
    /** Pacing configuration */
    pacing: Pacing;
    /** Array of emotional segments composing the structure */
    segments: EmotionalSegment[];
}

/**
 * Structure library type for the 7 immutable structures.
 */
export type StructureLibrary = Record<string, EmotionalStructureDef>;

