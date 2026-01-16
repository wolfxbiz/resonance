import React, { useState } from 'react';
import { useProject } from '../../core/store/ProjectContext';
import type { PacingCurve, VisualIntensity } from '../../core/types/phase2';

export const SegmentEditor: React.FC = () => {
    const { state, dispatch } = useProject();
    const [expandedIndex, setExpandedIndex] = useState<number>(0);
    const execution = state.layers.execution;

    if (!execution) return null;

    const { segments } = execution.editRhythm;
    const { visualDensity } = execution;

    const handlePacingChange = (index: number, value: PacingCurve) => {
        dispatch({
            type: 'UPDATE_EXECUTION',
            payload: {
                path: `editRhythm.segments[${index}].pacingCurve`,
                value
            }
        });
    };

    const handleIntensityChange = (index: number, value: VisualIntensity) => {
        dispatch({
            type: 'UPDATE_EXECUTION',
            payload: {
                path: `visualDensity[${index}].intensity`,
                value
            }
        });
    };

    return (
        <div className="segment-editor" style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
            <header className="section-header" style={{ marginBottom: '24px' }}>
                <h3>Edit Rhythm & Visual Density</h3>
                <p className="section-subtitle">Configure pacing and motion for each segment</p>
            </header>

            {/* Vertical Spine */}
            <div className="timeline-spine" style={{
                position: 'absolute',
                left: '20px',
                top: '100px',
                bottom: '20px',
                width: '1px',
                background: 'rgba(255,255,255,0.1)',
                zIndex: 0
            }} />

            <div className="segment-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1, width: '100%', boxSizing: 'border-box' }}>
                {segments.map((seg, index) => {
                    const isExpanded = index === expandedIndex;
                    const density = visualDensity[index];
                    const targetFrames = Math.round(seg.targetASL * 30);
                    const indexStr = (index + 1).toString().padStart(2, '0');

                    if (!isExpanded) {
                        return (
                            <div
                                key={`${seg.type}-${index}`}
                                onClick={() => setExpandedIndex(index)}
                                className="segment-row-collapsed"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: '6px',
                                    padding: '12px 16px',
                                    marginLeft: '40px',
                                    borderLeft: `4px solid ${getSegmentColor(seg.type)}`,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    position: 'relative',
                                    minHeight: '44px',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                            >
                                {/* Index Dot */}
                                <div style={{
                                    position: 'absolute',
                                    left: '-25px',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: getSegmentColor(seg.type),
                                    border: '2px solid #111'
                                }} />

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ color: '#444', fontSize: '0.7rem', fontWeight: 'bold' }}>{indexStr}</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{seg.type}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#444', fontSize: '0.7rem' }}>
                                    <span>TAP TO EDIT</span>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={`${seg.type}-${index}`} className="segment-card" style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: '8px',
                            padding: '20px',
                            marginLeft: '40px',
                            borderLeft: `4px solid ${getSegmentColor(seg.type)}`,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                            position: 'relative',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            {/* Index Dot (Active) */}
                            <div style={{
                                position: 'absolute',
                                left: '-27px',
                                width: '14px',
                                height: '14px',
                                borderRadius: '50%',
                                background: getSegmentColor(seg.type),
                                border: '3px solid #111',
                                boxShadow: `0 0 10px ${getSegmentColor(seg.type)}`
                            }} />

                            <div className="segment-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', minHeight: '44px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ color: '#666', fontSize: '0.8rem', fontWeight: 'bold' }}>{indexStr}</span>
                                    <h4 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '0.5px' }}>{seg.type}</h4>
                                </div>
                                <span
                                    className="asl-display"
                                    title={`${targetFrames} frames at 30fps`}
                                    style={{ fontSize: '0.85rem', color: '#06D6A0', cursor: 'help', fontWeight: 'bold' }}
                                >
                                    {seg.targetASL}s
                                </span>
                            </div>

                            <div className="segment-controls" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {/* Pacing Curve */}
                                <div className="control-group">
                                    <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', color: '#555' }}>Pacing Curve</label>
                                    <select
                                        value={seg.pacingCurve}
                                        onChange={(e) => handlePacingChange(index, e.target.value as PacingCurve)}
                                        style={{ width: '100%', padding: '10px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px', fontSize: '0.85rem', minHeight: '44px' }}
                                    >
                                        <option value="STATIC">STATIC</option>
                                        <option value="LINEAR_ACCEL">LINEAR_ACCEL</option>
                                        <option value="EXP_DECEL">EXP_DECEL</option>
                                    </select>
                                </div>

                                {/* Motion Intensity */}
                                <div className="control-group">
                                    <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', color: '#555' }}>Motion Intensity</label>
                                    <div className="pill-control" style={{
                                        display: 'flex',
                                        background: '#111',
                                        borderRadius: '20px',
                                        padding: '4px',
                                        border: '1px solid #222',
                                        minHeight: '44px'
                                    }}>
                                        {(['LOW', 'MED', 'HIGH'] as VisualIntensity[]).map((intensity) => {
                                            const isActive = density?.intensity === intensity;
                                            let activeColor = '#666';
                                            if (isActive) {
                                                if (intensity === 'HIGH') activeColor = '#06D6A0';
                                                else if (intensity === 'MED') activeColor = '#FFD166';
                                                else activeColor = '#118AB2';
                                            }

                                            return (
                                                <button
                                                    key={intensity}
                                                    onClick={() => handleIntensityChange(index, intensity)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '6px 0',
                                                        border: 'none',
                                                        borderRadius: '16px',
                                                        background: isActive ? activeColor : 'transparent',
                                                        color: isActive ? '#000' : '#444',
                                                        fontSize: '0.65rem',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        boxShadow: isActive ? `0 0 12px ${activeColor}44` : 'none',
                                                        minHeight: '36px'
                                                    }}
                                                >
                                                    {intensity[0]}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="segment-footer" style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', color: '#444', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{seg.startTime}s — {seg.endTime}s</span>
                                <span style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Active Workspace</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Helper for segment colors
function getSegmentColor(type: string) {
    switch (type) {
        case 'PEAK': case 'DROP': return '#FF4D4D';
        case 'BUILD': case 'HOOK': return '#FFD166';
        case 'SUSTAIN': return '#06D6A0';
        default: return '#118AB2';
    }
}
