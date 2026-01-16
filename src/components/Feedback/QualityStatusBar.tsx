import React, { useState } from 'react';
import type { QualityReport } from '../../core/engine/quality';
import styles from './QualityStatusBar.module.css';

interface QualityStatusBarProps {
    report: QualityReport;
    onStartProduction: () => void;
    disabled?: boolean;
}

export const QualityStatusBar: React.FC<QualityStatusBarProps> = ({ report, onStartProduction, disabled }) => {
    const [showDetails, setShowDetails] = useState(false);

    const getScoreColor = (score: number) => {
        if (score >= 90) return '#06D6A0';
        if (score >= 70) return '#FFD166';
        return '#FF4D4D';
    };

    return (
        <div className={styles.statusBar}>
            <div className={styles.content}>
                <div
                    className={styles.scoreSection}
                    onClick={() => setShowDetails(!showDetails)}
                    role="button"
                >
                    <span className={styles.label}>QUALITY SCORE:</span>
                    <span className={styles.score} style={{ color: getScoreColor(report.totalScore) }}>
                        {report.totalScore}
                    </span>
                    <span className={styles.detailsLink}>{showDetails ? 'Hide Details' : 'View Details'}</span>
                </div>

                <button
                    className={`${styles.productionButton} ${!disabled ? styles.pulse : ''}`}
                    onClick={onStartProduction}
                    disabled={disabled}
                >
                    START PRODUCTION
                </button>
            </div>

            {showDetails && (
                <div className={styles.popover}>
                    <h4>Quality Analysis</h4>
                    <ul className={styles.feedbackList}>
                        {report.feedback.map((item, i) => (
                            <li key={i} className={styles.feedbackItem}>
                                <span className={styles.bullet}>•</span>
                                {item}
                            </li>
                        ))}
                        {report.feedback.length === 0 && (
                            <li className={styles.feedbackItem}>✓ Configuration is optimal.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};
