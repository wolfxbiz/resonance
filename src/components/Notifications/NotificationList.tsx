import type { Conflict } from '../../core/engine/rules';
import styles from './NotificationToast.module.css';

interface NotificationListProps {
    conflicts: Conflict[];
}

export function NotificationList({ conflicts }: NotificationListProps) {
    if (conflicts.length === 0) return null;

    return (
        <div className={styles.container}>
            {conflicts.map((conflict, index) => (
                <div
                    key={`${conflict.code}-${index}`}
                    className={`${styles.toast} ${conflict.severity === 'BLOCK' ? styles.block : styles.warning}`}
                >
                    <div className={styles.title}>
                        {conflict.severity === 'BLOCK' ? '⛔ CRITICAL ERROR' : '⚠️ WARNING'}
                    </div>
                    <div className={styles.message}>{conflict.message}</div>
                    <div className={styles.fix}>Fix: {conflict.fix}</div>
                </div>
            ))}
        </div>
    );
}
