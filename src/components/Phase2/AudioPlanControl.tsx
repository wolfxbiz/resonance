import React, { useState } from 'react';
import { useProject } from '../../core/store/ProjectContext';
import { calculateFramesPerBeat } from '../../core/engine/audioMath';

export const AudioPlanControl: React.FC = () => {
    const { state, dispatch } = useProject();
    const [showSettings, setShowSettings] = useState(false);
    const audioPlan = state.layers.execution?.audioPlan;

    if (!audioPlan) return null;

    const framesPerBeat = calculateFramesPerBeat(audioPlan.bpm);

    const handleDuckingToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'UPDATE_EXECUTION',
            payload: {
                path: 'audioPlan.duckingEnabled',
                value: e.target.checked
            }
        });
    };

    return (
        <div className="control-card audio-plan-control" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px' }}>
            <div className="physics-display" style={{
                padding: '16px',
                background: '#111',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #333',
                position: 'relative'
            }}>
                <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '0.8rem', color: '#06D6A0' }}>🔒</div>
                <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Audio Grid: Locked</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '4px 0', color: '#fff' }}>{audioPlan.bpm} BPM</div>
                <div style={{ fontSize: '0.85rem', color: '#06D6A0' }}>{framesPerBeat.toFixed(0)} Frames / Beat</div>
            </div>

            <div className="audio-settings-container" style={{ marginTop: '12px', textAlign: 'center' }}>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                >
                    {showSettings ? 'Hide Audio Settings' : 'Audio Settings'}
                </button>

                {showSettings && (
                    <div className="settings-popover" style={{
                        marginTop: '12px',
                        padding: '12px',
                        background: '#1a1a1a',
                        borderRadius: '6px',
                        border: '1px solid #333'
                    }}>
                        <label className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#ccc' }}>
                            <input
                                type="checkbox"
                                checked={audioPlan.duckingEnabled}
                                onChange={handleDuckingToggle}
                            />
                            Enable Smart Ducking
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};
