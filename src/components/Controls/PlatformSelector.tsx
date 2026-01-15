import { useResonance, type Platform } from '../../context/ResonanceContext';
import styles from './PlatformSelector.module.css';

const PLATFORMS: Platform[] = ['TikTok', 'Instagram', 'YouTube', 'YouTube Shorts', 'LinkedIn'];

export function PlatformSelector() {
    const { platform, setPlatform } = useResonance();

    return (
        <div className={styles.container}>
            <label className={styles.label}>Distribution Platform</label>
            <div className={styles.grid}>
                {PLATFORMS.map((p) => (
                    <button
                        key={p}
                        className={`${styles.button} ${platform === p ? styles.active : ''}`}
                        onClick={() => setPlatform(p)}
                    >
                        {p === 'YouTube Shorts' ? 'YT Shorts' : p}
                    </button>
                ))}
            </div>
        </div>
    );
}
