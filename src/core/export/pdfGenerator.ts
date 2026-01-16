import type { ResonanceProject } from '../types/phase2';

/**
 * Generates a printable HTML Blueprint for the project.
 * This is designed to be opened in a new window and printed to PDF.
 */
export const generateProjectPDF = (project: ResonanceProject) => {
    const { blueprint, execution } = project.layers;
    if (!blueprint || !execution) return;

    const { platformContext } = blueprint;
    const { editRhythm, audioPlan, visualDensity } = execution;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resonance Blueprint - ${blueprint.id.slice(0, 8)}</title>
            <style>
                body {
                    font-family: 'Inter', -apple-system, sans-serif;
                    line-height: 1.6;
                    color: #111;
                    padding: 40px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                header {
                    border-bottom: 2px solid #06D6A0;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                }
                h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
                .meta { color: #666; font-size: 14px; margin-top: 5px; }
                
                .section { margin-bottom: 40px; }
                h2 { font-size: 18px; text-transform: uppercase; border-left: 4px solid #118AB2; padding-left: 10px; margin-bottom: 20px; }
                
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                .stat-card { background: #f9f9f9; padding: 15px; border-radius: 4px; border: 1px solid #eee; }
                .stat-label { font-size: 12px; color: #888; text-transform: uppercase; font-weight: bold; }
                .stat-value { font-size: 18px; font-weight: bold; color: #000; }

                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th { text-align: left; background: #f0f0f0; padding: 12px; font-size: 12px; text-transform: uppercase; }
                td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
                
                .tag { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
                .tag-high { background: #ffebee; color: #c62828; }
                .tag-med { background: #fff8e1; color: #f9a825; }
                .tag-low { background: #e3f2fd; color: #1565c0; }

                @media print {
                    body { padding: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <header>
                <h1>Resonance Production Blueprint</h1>
                <div class="meta">
                    ID: ${blueprint.id} | Generated: ${new Date().toLocaleDateString()} | Platform: ${platformContext.platformId}
                </div>
            </header>

            <div class="section">
                <h2>The Physics</h2>
                <div class="grid">
                    <div class="stat-card">
                        <div class="stat-label">Total Duration</div>
                        <div class="stat-value">${platformContext.maxDuration} Seconds</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Audio Grid</div>
                        <div class="stat-value">${audioPlan.bpm} BPM (120 FPS)</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Edit Structure & Rhythm</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Segment</th>
                            <th>Time Range</th>
                            <th>Target ASL</th>
                            <th>Pacing</th>
                            <th>Intensity</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${editRhythm.segments.map((seg, i) => `
                            <tr>
                                <td>${(i + 1).toString().padStart(2, '0')}</td>
                                <td><strong>${seg.type}</strong></td>
                                <td>${seg.startTime}s - ${seg.endTime}s</td>
                                <td>${seg.targetASL}s</td>
                                <td>${seg.pacingCurve}</td>
                                <td>
                                    <span class="tag tag-${visualDensity[i].intensity.toLowerCase()}">
                                        ${visualDensity[i].intensity}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="section">
                <h2>Production Notes</h2>
                <p style="font-size: 14px; color: #444;">
                    This blueprint is optimized for <strong>${platformContext.platformId}</strong>. 
                    The rhythm is locked to a <strong>${audioPlan.bpm} BPM</strong> grid. 
                    Ensure all cuts land on the specified frame boundaries for maximum emotional impact.
                </p>
            </div>

            <div class="no-print" style="margin-top: 50px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #06D6A0; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                    PRINT TO PDF
                </button>
            </div>
        </body>
        </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
};
