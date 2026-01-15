/**
 * TimelineStrip Component
 * 
 * Visualizes calculated timeline segments as a proportional colored bar.
 * Uses CSS Grid with fr units mapped to segment durations.
 */

import type { CalculatedSegment } from '../../core/engine/calculator';
import styles from './TimelineStrip.module.css';

interface TimelineStripProps {
    /** Array of calculated segments from the timeline engine */
    segments: CalculatedSegment[];
    /** Optional label to display above the timeline */
    label?: string;
}

/**
 * Maps segment type to CSS class for coloring.
 */
function getSegmentTypeClass(type: string): string {
    const typeMap: Record<string, string> = {
        PEAK: styles.typePeak,
        DROP: styles.typeDrop,
        BUILD: styles.typeBuild,
        HOOK: styles.typeHook,
        SUSTAIN: styles.typeSustain,
        RESOLVE: styles.typeResolve,
        CALM: styles.typeCalm,
        BREAK: styles.typeBreak,
    };

    return typeMap[type] || styles.typeDefault;
}

/**
 * Formats time as seconds string.
 */
function formatTime(seconds: number): string {
    return `${seconds}s`;
}

/**
 * TimelineStrip - Renders a proportional timeline visualization
 * 
 * @example
 * ```tsx
 * const segments = calculateTimeline(60, STRUCTURES.SURGE);
 * <TimelineStrip segments={segments} />
 * ```
 */
export function TimelineStrip({ segments, label }: TimelineStripProps) {
    // Build the grid-template-columns using fr units based on duration
    // This ensures proportional widths without percentage drift
    const gridColumns = segments.map(s => `${s.duration}fr`).join(' ');

    // Calculate total duration for reference
    const totalDuration = segments.reduce((sum, s) => sum + s.duration, 0);

    return (
        <div className={styles.container}>
            {label && <div className={styles.label}>{label}</div>}

            <div
                className={styles.strip}
                style={{ gridTemplateColumns: gridColumns }}
                role="img"
                aria-label={`Timeline: ${totalDuration} seconds total, ${segments.length} segments`}
            >
                {segments.map((segment, index) => {
                    const isSmall = segment.duration < 5;
                    const timeRange = `${formatTime(segment.startTime)} - ${formatTime(segment.endTime)}`;
                    const tooltip = `${segment.type}: ${timeRange} (${segment.duration}s)`;

                    return (
                        <div
                            key={`${segment.type}-${index}`}
                            className={`
                ${styles.segment} 
                ${getSegmentTypeClass(segment.type)}
                ${isSmall ? styles.segmentSmall : ''}
              `}
                            data-tooltip={tooltip}
                            title={tooltip}
                        >
                            <span className={styles.segmentName}>{segment.type}</span>
                            <span className={styles.timeRange}>{timeRange}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TimelineStrip;
