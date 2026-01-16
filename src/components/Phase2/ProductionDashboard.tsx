import React from 'react';
import { useProject } from '../../core/store/ProjectContext';
import { AudioPlanControl } from './AudioPlanControl';
import { SegmentEditor } from './SegmentEditor';
import { ValidationPanel } from './ValidationPanel';
import { generateFCPXML } from '../../core/export/xmlGenerator';
import { generatePremiereXML } from '../../core/export/premiereGenerator';
import { generateProjectPDF } from '../../core/export/pdfGenerator';

export const ProductionDashboard: React.FC = () => {
    const { state, dispatch } = useProject();
    const { blueprint, validation } = state.layers;

    const handleExportFCPXML = () => {
        const xmlString = generateFCPXML(state);
        if (!xmlString) return;

        const blob = new Blob([xmlString], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resonance-project-${blueprint?.id.slice(0, 8) || 'export'}.fcpxml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExportPremiereXML = () => {
        const xmlString = generatePremiereXML(state);
        if (!xmlString) return;

        const blob = new Blob([xmlString], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resonance-project-${blueprint?.id.slice(0, 8) || 'export'}.xml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExportPDF = () => {
        generateProjectPDF(state);
    };

    const isReady = validation?.globalStatus === 'PASS';

    const handleUnlock = () => {
        if (window.confirm('Going back will reset your current execution markers. Continue?')) {
            dispatch({ type: 'UNLOCK_BLUEPRINT' });
        }
    };

    return (
        <div className="dashboard-layout production-mode">
            <style>
                {`
                    .dashboard-layout {
                        padding-bottom: calc(80px + env(safe-area-inset-bottom));
                        min-height: 100vh;
                        background: #121212;
                    }
                    .dashboard-main {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 24px;
                        padding: 16px;
                        max-width: 1400px;
                        margin: 0 auto;
                    }
                    @media (min-width: 1024px) {
                        .dashboard-main {
                            grid-template-columns: repeat(12, 1fr);
                            padding: 32px;
                            gap: 30px;
                        }
                        .physics-column {
                            grid-column: span 3;
                        }
                        .execution-column {
                            grid-column: span 9;
                            min-width: 0;
                        }
                    }
                    @keyframes pulse-ready {
                        0% { box-shadow: 0 0 0 0 rgba(6, 214, 160, 0.4); }
                        70% { box-shadow: 0 0 0 10px rgba(6, 214, 160, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(6, 214, 160, 0); }
                    }
                    .pulse-animation {
                        animation: pulse-ready 2s infinite;
                    }
                    .back-button {
                        background: transparent;
                        border: none;
                        color: #666;
                        cursor: pointer;
                        font-size: 0.8rem;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        padding: 4px 8px;
                        border-radius: 4px;
                        transition: all 0.2s;
                    }
                    .back-button:hover {
                        color: #fff;
                        background: rgba(255,255,255,0.05);
                    }
                    .secondary-button {
                        background: transparent;
                        border: 1px solid #333;
                        color: #888;
                        padding: 10px;
                        border-radius: 4px;
                        font-weight: bold;
                        font-size: 0.75rem;
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .secondary-button:hover {
                        border-color: #666;
                        color: #fff;
                        background: rgba(255,255,255,0.02);
                    }
                `}
            </style>
            <header className="dashboard-header" style={{ borderBottom: '2px solid #06D6A0', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button className="back-button" onClick={handleUnlock}>
                        ← Edit Configuration
                    </button>
                    <h1 style={{ fontSize: '1.2rem', margin: 0 }}>Production Mode</h1>
                </div>
                <div className="meta-info" style={{ fontSize: '0.8rem', color: '#666' }}>
                    <span>Blueprint: {blueprint?.id.slice(0, 8)}</span>
                </div>
            </header>

            <main className="dashboard-main">
                {/* Left Column: Physics */}
                <aside className="physics-column">
                    <h4 style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px', marginBottom: '12px' }}>Physics Engine</h4>
                    <AudioPlanControl />

                    <div className="export-actions" style={{ marginTop: '30px' }}>
                        <h4 style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px', marginBottom: '12px' }}>Final Export</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                className={`primary-button ${isReady ? 'pulse-animation' : ''}`}
                                onClick={handleExportFCPXML}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: '#06D6A0',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    opacity: isReady ? 1 : 0.5,
                                    transition: 'all 0.3s ease',
                                    minHeight: '44px'
                                }}
                            >
                                FCPX / RESOLVE (.fcpxml)
                            </button>
                            <button
                                className="primary-button"
                                onClick={handleExportPremiereXML}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: '#118AB2',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    opacity: isReady ? 1 : 0.5,
                                    transition: 'all 0.3s ease',
                                    minHeight: '44px'
                                }}
                            >
                                PREMIERE PRO (.xml)
                            </button>
                            <button
                                className="secondary-button"
                                onClick={handleExportPDF}
                                style={{ width: '100%', marginTop: '10px' }}
                            >
                                DOWNLOAD BLUEPRINT (PDF)
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Column: Execution */}
                <section className="execution-column">
                    <SegmentEditor />
                </section>
            </main>

            {/* Bottom Status Strip */}
            <ValidationPanel report={validation} />
        </div>
    );
};
