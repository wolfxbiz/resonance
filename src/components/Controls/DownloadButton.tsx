import { PDFDownloadLink } from '@react-pdf/renderer';
import { useResonance } from '../../context/ResonanceContext';
import { calculateTimeline } from '../../core/engine/calculator';
import type { QualityReport } from '../../core/engine/quality';
import { applyDialogueConstraints } from '../../core/engine/modifiers';
import { BlueprintDocument } from '../Blueprint/BlueprintDocument';
import styles from './DownloadButton.module.css';

interface DownloadButtonProps {
    disabled?: boolean;
    qualityReport?: QualityReport;
}

export function DownloadButton({ disabled = false, qualityReport }: DownloadButtonProps) {
    const { duration, structure, hasDialogue, platform } = useResonance();

    // Apply modifiers for exact WYSIWYG output
    const finalStructure = hasDialogue ? applyDialogueConstraints(structure) : structure;

    // Calculate timeline fresh for the PDF
    const timeline = calculateTimeline(duration, finalStructure, platform);
    const fileName = `Resonance_${structure.name}_${duration}s.pdf`;

    if (disabled) {
        return (
            <div className={styles.container}>
                <button
                    className={`${styles.button} ${styles.buttonDisabled}`}
                    disabled={true}
                >
                    GENERATION BLOCKED
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <PDFDownloadLink
                document={
                    <BlueprintDocument
                        timeline={timeline}
                        structure={structure}
                        totalDuration={duration}
                        hasDialogue={hasDialogue}
                        qualityReport={qualityReport}
                    />
                }
                fileName={fileName}
                style={{ textDecoration: 'none', width: '100%' }}
            >
                {({ loading }) => (
                    <button
                        className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'GENERATING...' : 'GENERATE BLUEPRINT'}
                    </button>
                )}
            </PDFDownloadLink>
        </div>
    );
}

