import { useResonance } from '../../context/ResonanceContext';
import { getAllStructures } from '../../core/structures/library';
import styles from './StructureSelector.module.css';

export function StructureSelector() {
    const { structureId, setStructureId } = useResonance();
    const structures = getAllStructures();

    return (
        <div className={styles.container}>
            <h3 className={styles.label}>Emotional Structure</h3>

            <div className={styles.grid}>
                {structures.map((s) => (
                    <div
                        key={s.id}
                        className={`${styles.card} ${s.id === structureId ? styles.cardActive : ''}`}
                        onClick={() => setStructureId(s.id)}
                        role="button"
                        aria-pressed={s.id === structureId}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                setStructureId(s.id);
                            }
                        }}
                    >
                        <div className={styles.cardName}>{s.name}</div>
                        <div className={styles.cardDescription}>{s.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
