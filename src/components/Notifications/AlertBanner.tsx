import type { Conflict } from '../../core/engine/rules';
import styles from './AlertBanner.module.css';

interface AlertBannerProps {
    conflicts: Conflict[];
}

export function AlertBanner({ conflicts }: AlertBannerProps) {
    if (conflicts.length === 0) return null;

    return (
        <div className={styles.container}>
            {conflicts.map((conflict, index) => (
                <div
                    key={`${conflict.code}-${index}`}
                    className={`${styles.banner} ${conflict.severity === 'BLOCK' ? styles.block : styles.warning}`}
                >
                    <div className={styles.title}>
                        {conflict.severity === 'BLOCK' ? '⛔ BLOCK:' : '⚠️ WARNING:'} {conflict.message}
                    </div>
                    <div className={styles.fix}>Fix: {conflict.fix}</div>
                </div>
            ))}
        </div>
    );
}
