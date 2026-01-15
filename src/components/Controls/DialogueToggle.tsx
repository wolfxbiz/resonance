import { useResonance } from '../../context/ResonanceContext';
import styles from './DialogueToggle.module.css';

export function DialogueToggle() {
    const { hasDialogue, setHasDialogue } = useResonance();

    return (
        <div
            className={`${styles.container} ${hasDialogue ? styles.active : ''}`}
            onClick={() => setHasDialogue(!hasDialogue)}
            role="switch"
            aria-checked={hasDialogue}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    setHasDialogue(!hasDialogue);
                }
            }}
        >
            <div className={styles.label}>
                <span className={styles.title}>
                    Dialogue Heavy
                </span>
                <span className={styles.desc}>
                    Optimizes pacing for speech clarity
                </span>
            </div>

            <div className={styles.switch}>
                <div className={styles.knob} />
            </div>
        </div>
    );
}
