import React from 'react';
import { useResonance } from '../../context/ResonanceContext';
import { getAllStructures } from '../../core/structures/library';
import { TimelineStrip } from '../Timeline/TimelineStrip';
import type { CalculatedSegment } from '../../core/engine/calculator';
import styles from './StructureSelector.module.css';

interface StructureSelectorProps {
    activeTimeline: CalculatedSegment[];
}

export const StructureSelector: React.FC<StructureSelectorProps> = ({ activeTimeline }) => {
    const { structureId, setStructureId } = useResonance();
    const structures = getAllStructures();

    return (
        <div className={styles.container}>
            <h3 className={styles.label}>Emotional Structure</h3>

            <div className={styles.accordion}>
                {structures.map((s) => {
                    const isActive = s.id === structureId;

                    return (
                        <div
                            key={s.id}
                            className={`${styles.row} ${isActive ? styles.rowActive : ''}`}
                            onClick={() => setStructureId(s.id)}
                            style={{ minHeight: '44px' }}
                        >
                            <div className={styles.rowHeader} style={{ minHeight: '44px' }}>
                                <div className={styles.rowTitle}>
                                    <span className={styles.icon}>{isActive ? '◈' : '◇'}</span>
                                    <span className={styles.name}>{s.name}</span>
                                </div>
                                {!isActive && <span className={styles.hint}>TAP TO SELECT</span>}
                            </div>

                            {isActive && (
                                <div className={styles.rowContent}>
                                    <p className={styles.description}>{s.description}</p>

                                    <div className={styles.vizWrapper}>
                                        <div className={styles.vizLabel}>Timeline Visualization</div>
                                        <TimelineStrip segments={activeTimeline} />
                                    </div>

                                    <div className={styles.details}>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Peak Position:</span>
                                            <span className={styles.detailValue}>{s.pacing.peakPositionMax * 100}%</span>
                                        </div>
                                        {s.pacing.silenceRequired && (
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Constraint:</span>
                                                <span className={styles.detailValue} style={{ color: '#FF4D4D' }}>Silence Required</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
