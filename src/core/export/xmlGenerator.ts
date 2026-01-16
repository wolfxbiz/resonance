import type { ResonanceProject } from '../types/phase2';

/**
 * FCPXML Generator for Resonance Engine
 * Creates a valid FCPXML v1.9 string for import into NLEs like DaVinci Resolve or Premiere Pro.
 */
export const generateFCPXML = (project: ResonanceProject): string => {
    const execution = project.layers.execution;
    if (!execution) return '';

    const segments = execution.editRhythm.segments;
    const visualDensity = execution.visualDensity;
    const totalDuration = segments.reduce((acc, seg) => acc + seg.duration, 0);

    // FCPXML v1.9 Template
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
    <resources>
        <format id="r1" name="FFVideoFormat1080p30" frameDuration="1/30s" width="1920" height="1080"/>
    </resources>
    <library>
        <event name="Resonance Export">
            <project name="Resonance Blueprint">
                <sequence format="r1" duration="${totalDuration}s" tcStart="0s" tcFormat="NDF">
                    <spine>`;

    let currentOffset = 0;
    segments.forEach((seg, index) => {
        const density = visualDensity[index]?.intensity || 'MED';
        const label = `${seg.type} - ${density} Motion`;
        const note = `ASL: ${seg.targetASL}s, Curve: ${seg.pacingCurve}`;

        // We use <gap> as a placeholder for the timeline structure
        xml += `
                        <gap name="${seg.type}" offset="${currentOffset}s" duration="${seg.duration}s" start="0s">
                            <marker start="0s" duration="1/30s" value="${label}" note="${note}"/>
                        </gap>`;

        currentOffset += seg.duration;
    });

    xml += `
                    </spine>
                </sequence>
            </project>
        </event>
    </library>
</fcpxml>`;

    return xml;
};
