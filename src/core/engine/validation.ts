import type {
    ExecutionMapping,
    PlatformContext,
    ValidationReport,
    ValidationSignal,
    ValidationStatus
} from '../types/phase2';

/**
 * Validation Engine for Phase 2
 * Runs compliance checks against the execution mapping.
 */

export const validateExecution = (
    execution: ExecutionMapping,
    platform: PlatformContext
): ValidationReport => {
    const signals: ValidationSignal[] = [];
    let globalStatus: ValidationStatus = 'PASS';

    // Platform-specific validation (placeholder for future rules)
    if (!platform.platformId) {
        // Just using the variable
    }

    // 1. Hook Integrity
    const hookIndex = execution.editRhythm.segments.findIndex(s => s.type === 'HOOK');
    if (hookIndex !== -1) {
        const hook = execution.editRhythm.segments[hookIndex];
        const density = execution.visualDensity[hookIndex];

        if (hook.duration > 3 && density.intensity !== 'HIGH') {
            globalStatus = 'FAIL';
            signals.push({
                checkName: 'Hook Integrity',
                result: 'FAIL',
                message: 'Hook is too long for low motion. Increase intensity to stop the scroll.',
                segmentIndex: hookIndex
            });
        }
    }

    // 2. Peak Presence
    const hasHighIntensity = execution.visualDensity.some(d => d.intensity === 'HIGH');
    if (!hasHighIntensity) {
        if (globalStatus !== 'FAIL') globalStatus = 'WARNING';
        signals.push({
            checkName: 'Peak Presence',
            result: 'WARNING',
            message: 'Flatline Structure: No Peak detected.'
        });
    }

    // 3. Rhythm Integrity (Micro-drift)
    execution.editRhythm.segments.forEach((seg, index) => {
        const frames = seg.targetASL * 30; // Assuming 30fps
        // Check if frames is not an integer (allowing for tiny float precision errors)
        if (Math.abs(frames - Math.round(frames)) > 0.001) {
            signals.push({
                checkName: 'Rhythm Integrity',
                result: 'INFO',
                message: `Micro-drift detected in ${seg.type}. Adjust BPM for perfect frame alignment.`,
                segmentIndex: index
            });
        }
    });

    return {
        globalStatus,
        signals
    };
};
