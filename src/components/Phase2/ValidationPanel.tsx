import React, { useState } from 'react';
import type { ValidationReport } from '../../core/types/phase2';

interface ValidationPanelProps {
    report: ValidationReport | null;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ report }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!report) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PASS': return '#06D6A0';
            case 'WARNING': return '#FFD166';
            case 'FAIL': return '#FF4D4D';
            default: return '#118AB2';
        }
    };

    const warningCount = report.signals.filter(s => s.result === 'WARNING').length;
    const failCount = report.signals.filter(s => s.result === 'FAIL').length;

    let statusText = 'READY';
    let statusColor = '#06D6A0';

    if (failCount > 0) {
        statusText = `${failCount} BLOCKING ERRORS`;
        statusColor = '#FF4D4D';
    } else if (warningCount > 0) {
        statusText = `${warningCount} WARNINGS`;
        statusColor = '#FFD166';
    }

    return (
        <div className="validation-strip-container" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: '#111',
            borderTop: `2px solid ${statusColor}`,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
        }}>
            {/* The Strip */}
            <div className="validation-strip" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 24px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'bold', letterSpacing: '1px' }}>EXPORT STATUS:</span>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: statusColor }}>{statusText}</span>
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#118AB2',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                >
                    {isExpanded ? 'Hide Details' : 'View Details'}
                </button>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="validation-details" style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    padding: '0 24px 24px 24px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div className="signal-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                        {report.signals.length === 0 ? (
                            <p style={{ fontSize: '0.9rem', color: '#888' }}>✓ All technical checks passed.</p>
                        ) : (
                            report.signals.map((signal, index) => (
                                <div key={index} className="signal-item" style={{
                                    padding: '12px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '6px',
                                    borderLeft: `3px solid ${getStatusColor(signal.result)}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{signal.checkName}</span>
                                        <span style={{ fontSize: '0.7rem', color: getStatusColor(signal.result) }}>{signal.result}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#ccc' }}>{signal.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
