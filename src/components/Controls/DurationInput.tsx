import { useResonance } from '../../context/ResonanceContext';
import styles from './DurationInput.module.css';

export function DurationInput() {
    const { duration, setDuration } = useResonance();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDuration(Number(e.target.value));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.label}>Total Duration</span>
                <span className={styles.valueDisplay}>{duration}s</span>
            </div>

            <div className={styles.inputWrapper}>
                <input
                    type="range"
                    min="5"
                    max="180"
                    value={duration}
                    onChange={handleChange}
                    className={styles.slider}
                    aria-label="Video Duration"
                />
            </div>

            <div className={styles.markers}>
                <span>5s</span>
                <span>60s</span>
                <span>120s</span>
                <span>180s</span>
            </div>
        </div>
    );
}
