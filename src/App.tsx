import { useMemo } from 'react';
import './App.css';
import {
  TimelineStrip,
  DurationInput,
  StructureSelector,
  DownloadButton,
  PlatformSelector,
  AlertBanner,
  Scorecard,
  DialogueToggle,
  ResonanceProvider,
  useResonance
} from './components';
import { calculateTimeline } from './core/engine/calculator';
import { validateConfiguration } from './core/engine/rules';
import { applyDialogueConstraints } from './core/engine/modifiers';
import { calculateQuality } from './core/engine/quality';




/**
 * Main Content Component
 * Accessed inside the provider so hooks work.
 */
function ResonanceDashboard() {
  const { duration, structure, platform, hasDialogue } = useResonance();

  // Apply modifiers if needed
  const modifiedStructure = useMemo(() => {
    return hasDialogue ? applyDialogueConstraints(structure) : structure;
  }, [structure, hasDialogue]);

  // Calculate the timeline directly from context state
  // This updates live as the user drags the slider
  const activeTimeline = useMemo(() => {
    return calculateTimeline(duration, modifiedStructure, platform);
  }, [duration, modifiedStructure, platform]);

  // Run the Rules Engine checks
  const conflicts = useMemo(() => {
    return validateConfiguration(duration, structure.id, platform);
  }, [duration, structure.id, platform]);

  const hasBlockingError = conflicts.some(c => c.severity === 'BLOCK');

  // Calculate Quality Score
  const qualityReport = useMemo(() => {
    return calculateQuality(activeTimeline, platform);
  }, [activeTimeline, platform,]);

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h1>Resonance Engine</h1>
        <p>Emotional Logic Matrix</p>
      </header>

      <main className="dashboard-main">
        {/* Top Controls Area */}
        <section className="controls-section">
          <div className="left-column">
            <PlatformSelector />
            <StructureSelector />
          </div>

          <div className="right-column">
            <DurationInput />
            <DialogueToggle />
            <DownloadButton disabled={hasBlockingError} qualityReport={qualityReport} />
            <Scorecard report={qualityReport} />


            <div className="info-card">
              <div className="info-label">Active Structure</div>
              <div className="info-value">{structure.name}</div>
              <div className="info-desc">{structure.description}</div>
              <div className="info-tags">
                {structure.pacing.silenceRequired && <span className="tag fade">Silence Required</span>}
                <span className="tag">Peak @ {structure.pacing.peakPositionMax * 100}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Visualization */}
        <section className="visualization-section">
          <h2>Timeline Visualization</h2>
          <AlertBanner conflicts={conflicts} />
          <TimelineStrip segments={activeTimeline} />

          <div className="timeline-stats">
            {activeTimeline.map((seg, i) => (
              <div key={i} className="stat-row">
                <span className="stat-type" style={{ color: getSegmentColor(seg.type) }}>{seg.type}</span>
                <span className="stat-time">{seg.startTime}s - {seg.endTime}s</span>
                <span className="stat-dur">{seg.duration}s</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// Helper for log output colors matching the CSS module
function getSegmentColor(type: string) {
  switch (type) {
    case 'PEAK': case 'DROP': return '#FF4D4D';
    case 'BUILD': case 'HOOK': return '#FFD166';
    case 'SUSTAIN': return '#06D6A0';
    default: return '#118AB2';
  }
}

/**
 * App Root
 * Wraps the dashboard in the state provider.
 */
function App() {
  return (
    <ResonanceProvider>
      <ResonanceDashboard />
    </ResonanceProvider>
  );
}

export default App;
