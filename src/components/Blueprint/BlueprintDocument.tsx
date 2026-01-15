/**
 * Blueprint Document
 * 
 * Generates a PDF schematic of the resonance structure.
 * Designed to look like a technical blueprint / engineering doc.
 */

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { CalculatedSegment } from '../../core/engine/calculator';
import type { EmotionalStructureDef } from '../../types';

// Register a technical looking font (using standard fonts first to ensure it works)
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf' }, // Fallback to standard
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333333',
    },
    header: {
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#000000',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 24,
        fontWeight: 'black',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 10,
        color: '#666666',
        marginTop: 4,
    },
    meta: {
        fontSize: 10,
        textAlign: 'right',
    },
    content: {
        flex: 1,
    },
    structureInfo: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#F5F5F5',
        borderLeftWidth: 4,
        borderLeftColor: '#000000',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    infoLabel: {
        width: 100,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#666666',
        fontSize: 8,
    },
    infoValue: {
        flex: 1,
        fontWeight: 'bold',
    },
    table: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#000000',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        backgroundColor: '#EAEAEA',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        paddingVertical: 10,
        paddingHorizontal: 4,
        minHeight: 30,
    },
    col1: { width: '20%' }, // Segment Name
    col2: { width: '20%' }, // Time Range
    col3: { width: '15%' }, // Duration
    col4: { width: '45%' }, // Instructions

    colHeader: {
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    cellText: {
        fontSize: 10,
    },
    cellBold: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    cellMuted: {
        fontSize: 10,
        color: '#666666',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#999999',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: 10,
    },
});

import type { QualityReport } from '../../core/engine/quality';

interface BlueprintDocumentProps {
    timeline: CalculatedSegment[];
    structure: EmotionalStructureDef;
    totalDuration: number;
    hasDialogue?: boolean;
    qualityReport?: QualityReport;
}

/**
 * Format timestamp (HH:MM:SS or MM:SS)
 */
const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

/**
 * Get guidance text based on segment type
 */
const getGuidanceText = (segment: CalculatedSegment, hasDialogue?: boolean) => {
    let text = `${segment.cutSpeedGuidance} cuts. ${segment.soundDensity} density.`;
    if (hasDialogue) text += ' Ensure audio ducking during speech.';
    return text;
};

export const BlueprintDocument = ({ timeline, structure, totalDuration, hasDialogue, qualityReport }: BlueprintDocumentProps) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Resonance</Text>
                    <Text style={styles.title}>Blueprint</Text>
                    <Text style={styles.subtitle}>Structure Analysis & Timeline</Text>
                </View>
                <View style={styles.meta}>
                    <Text>DATE: {new Date().toLocaleDateString()}</Text>
                    <Text>ID: {structure.id.toUpperCase()}-{totalDuration}S</Text>
                    <Text>VER: 1.0.0</Text>
                </View>
            </View>

            {/* STRUCTURE INFO */}
            <View style={styles.structureInfo}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Structure</Text>
                    <Text style={styles.infoValue}>{structure.name.toUpperCase()}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Total Time</Text>
                    <Text style={styles.infoValue}>{totalDuration} Seconds</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Pacing</Text>
                    <Text style={styles.infoValue}>Peak at {structure.pacing.peakPositionMax * 100}%</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Mission</Text>
                    <Text style={styles.infoValue}>{structure.description}</Text>
                </View>
            </View>

            {/* QUALITY ASSESSMENT */}
            {qualityReport && (
                <View style={{ marginBottom: 20, padding: 10, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>QUALITY ASSESSMENT</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 10 }}>Score: {qualityReport.totalScore}/100</Text>
                        <View style={{ flex: 1, marginLeft: 20 }}>
                            {qualityReport.feedback.map((msg, i) => (
                                <Text key={i} style={{ fontSize: 8, color: '#444' }}>• {msg}</Text>
                            ))}
                        </View>
                    </View>
                </View>
            )}

            {/* TIMELINE TABLE */}
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>SEGMENTATION MAP</Text>

            <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <View style={styles.col1}><Text style={styles.colHeader}>Segment</Text></View>
                    <View style={styles.col2}><Text style={styles.colHeader}>Time Range</Text></View>
                    <View style={styles.col3}><Text style={styles.colHeader}>Duration</Text></View>
                    <View style={styles.col4}><Text style={styles.colHeader}>Action Plan</Text></View>
                </View>

                {/* Table Rows */}
                {timeline.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <View style={styles.col1}>
                            <Text style={styles.cellBold}>{item.type}</Text>
                        </View>
                        <View style={styles.col2}>
                            <Text style={styles.cellText}>{formatTime(item.startTime)} - {formatTime(item.endTime)}</Text>
                        </View>
                        <View style={styles.col3}>
                            <Text style={styles.cellMuted}>{item.duration}s</Text>
                        </View>
                        <View style={styles.col4}>
                            <Text style={styles.cellText}>{getGuidanceText(item, hasDialogue)}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
                <Text>GENERATED BY RESONANCE ENGINE • EMOTIONAL LOGIC MATRIX • AUDIO-VISUAL SYNCHRONIZATION</Text>
            </View>

        </Page>
    </Document>
);
