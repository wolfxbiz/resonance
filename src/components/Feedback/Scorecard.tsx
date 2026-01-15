import type { QualityReport } from '../../core/engine/quality';
import styles from './Scorecard.module.css';

interface ScorecardProps {
    report: QualityReport;
}

export function Scorecard({ report }: ScorecardProps) {
    const { totalScore, feedback } = report;

    // Determine color class
    const scoreClass =
        totalScore >= 80 ? styles.good :
            totalScore >= 50 ? styles.fair :
                styles.poor;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.label}>Quality Score</span>
                <div className={styles.scoreWrapper}>
                    <span className={`${styles.score} ${scoreClass}`}>{totalScore}</span>
                    <span className={styles.scoreTotal}>/100</span>
                </div>
            </div>

            <div className={styles.feedbackList}>
                {feedback.length > 0 ? (
                    feedback.map((msg, i) => (
                        <div key={i} className={styles.feedbackItem}>
                            <span className={styles.feedbackIcon}>💡</span>
                            <span>{msg}</span>
                        </div>
                    ))
                ) : (
                    <div className={styles.perfect}>
                        ✨ Perfect configuration! No issues detected.
                    </div>
                )}
            </div>
        </div>
    );
}
