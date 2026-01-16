import React, { useState } from 'react';
import { useProject } from '../../core/store/ProjectContext';
import type { OutcomeLog } from '../../core/types/phase2';

export const OutcomeLogger: React.FC = () => {
    const { state, dispatch } = useProject();
    const outcome = state.layers.outcome;
    const platform = state.layers.blueprint?.platformContext.platformId || 'Unknown';

    const [formData, setFormData] = useState({
        posted: false,
        retention3s: 0,
        userConfidence: 3,
        dropOffTimestamp: ''
    });

    const handleLogOutcome = () => {
        const payload: OutcomeLog = {
            ...formData,
            platform,
            loggedAt: new Date().toISOString()
        };

        dispatch({
            type: 'LOG_OUTCOME',
            payload
        });
    };

    if (outcome) {
        return (
            <div className="outcome-summary control-card" style={{ borderTop: '4px solid #06D6A0' }}>
                <h3>Project Outcome (Closed)</h3>
                <div className="summary-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                    <div className="summary-item">
                        <span className="label" style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Posted</span>
                        <span className="value" style={{ fontWeight: 'bold' }}>{outcome.posted ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label" style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>3s Retention</span>
                        <span className="value" style={{ fontWeight: 'bold', color: '#06D6A0' }}>{outcome.retention3s}%</span>
                    </div>
                    <div className="summary-item">
                        <span className="label" style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Confidence</span>
                        <span className="value" style={{ fontWeight: 'bold' }}>{outcome.userConfidence}/5</span>
                    </div>
                    <div className="summary-item">
                        <span className="label" style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Logged At</span>
                        <span className="value" style={{ fontSize: '0.85rem' }}>{new Date(outcome.loggedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="outcome-logger control-card">
            <h3>Outcome Review</h3>
            <p className="section-subtitle">Close the loop by logging real-world performance</p>

            <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={formData.posted}
                        onChange={(e) => setFormData({ ...formData, posted: e.target.checked })}
                    />
                    Did you post this?
                </label>
            </div>

            <div className="form-group" style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#888' }}>First 3s Retention (%)</label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.retention3s}
                    onChange={(e) => setFormData({ ...formData, retention3s: parseInt(e.target.value, 10) || 0 })}
                    style={{ width: '100%', padding: '8px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
                />
            </div>

            <div className="form-group" style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#888' }}>Confidence (1-5)</label>
                <div className="rating-input" style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            onClick={() => setFormData({ ...formData, userConfidence: num })}
                            style={{
                                flex: 1,
                                padding: '8px 0',
                                border: '1px solid #444',
                                borderRadius: '4px',
                                background: formData.userConfidence === num ? '#06D6A0' : '#222',
                                color: formData.userConfidence === num ? '#000' : '#fff',
                                cursor: 'pointer'
                            }}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            <button
                className="primary-button"
                onClick={handleLogOutcome}
                style={{
                    width: '100%',
                    marginTop: '20px',
                    padding: '12px',
                    background: '#06D6A0',
                    color: '#000',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                LOG OUTCOME
            </button>
        </div>
    );
};
