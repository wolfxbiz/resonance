import type { ResonanceProject } from '../types/phase2';

/**
 * Robust Premiere Pro XML (XMEML v4) Generator
 * Strictly follows the FCP7 XML specification for reliable import.
 */
export const generatePremiereXML = (project: ResonanceProject): string => {
    const execution = project.layers.execution;
    if (!execution) return '';

    const segments = execution.editRhythm.segments;
    const visualDensity = execution.visualDensity;
    const timebase = 30;

    let currentFrame = 0;

    const trackItems = segments.map((seg, index) => {
        const durationFrames = Math.round(seg.duration * timebase);
        const startFrame = currentFrame;
        const endFrame = currentFrame + durationFrames;
        currentFrame += durationFrames;

        // Motion Intensity Label Mapping (Premiere Label Colors)
        // 0=Violet, 1=Iris, 2=Carribean, 3=Lavender, 4=Cerulean, 5=Forest, 6=Rose, 7=Mango
        // We map High Motion -> Rose (6), Med -> Mango (7), Low -> Lavender (3)
        let labelColor = 3; // Default Low

        const density = visualDensity[index]?.intensity;
        const typeStr = seg.type as string;
        if (density === 'HIGH' || typeStr === 'PEAK' || typeStr === 'DROP') {
            labelColor = 6;
        } else if (density === 'MED' || typeStr === 'BUILD') {
            labelColor = 7;
        }

        return `
                    <clipitem id="clipitem-${index + 1}">
                        <name>${seg.type}</name>
                        <rate>
                            <timebase>${timebase}</timebase>
                            <ntsc>FALSE</ntsc>
                        </rate>
                        <duration>${durationFrames}</duration>
                        <start>${startFrame}</start>
                        <end>${endFrame}</end>
                        <in>${startFrame}</in>
                        <out>${endFrame}</out>
                        <labels>
                            <label2>${labelColor}</label2>
                        </labels>
                        <file id="slug-file">
                            <name>Slug</name>
                            <duration>100000</duration>
                            <rate>
                                <timebase>${timebase}</timebase>
                                <ntsc>FALSE</ntsc>
                            </rate>
                            <media>
                                <video>
                                    <samplecharacteristics>
                                        <width>1920</width>
                                        <height>1080</height>
                                    </samplecharacteristics>
                                </video>
                            </media>
                        </file>
                        <marker>
                            <name>${seg.type}</name>
                            <in>${startFrame}</in>
                            <out>${startFrame + 1}</out>
                            <comment>Target ASL: ${seg.targetASL}s | ${seg.pacingCurve}</comment>
                            <color>
                                <red>255</red>
                                <green>0</green>
                                <blue>0</blue>
                            </color>
                        </marker>
                    </clipitem>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<xmeml version="4">
    <sequence>
        <name>Resonance Blueprint</name>
        <rate>
            <timebase>${timebase}</timebase>
            <ntsc>FALSE</ntsc>
        </rate>
        <media>
            <video>
                <format>
                    <samplecharacteristics>
                        <width>1920</width>
                        <height>1080</height>
                        <rate>
                            <timebase>${timebase}</timebase>
                        </rate>
                    </samplecharacteristics>
                </format>
                <track>${trackItems}
                </track>
            </video>
        </media>
    </sequence>
</xmeml>`;
};
