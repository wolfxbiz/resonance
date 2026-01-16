import { useMemo } from 'react';
import './App.css';
import {
  DurationInput,
  StructureSelector,
  PlatformSelector,
  AlertBanner,
  QualityStatusBar,
  DialogueToggle,
  ResonanceProvider,
  useResonance
} from './components';
import { calculateTimeline } from './core/engine/calculator';
import { validateConfiguration } from './core/engine/rules';
import { applyDialogueConstraints } from './core/engine/modifiers';
import { calculateQuality } from './core/engine/quality';
import { ProjectProvider, useProject } from './core/store/ProjectContext';
import { ProductionDashboard } from './components/Phase2/ProductionDashboard';
import type { PlatformContext, Phase1Data } from './core/types/phase2';

/**
 * Main Content Component
 * Accessed inside the provider so hooks work.
 */
function ResonanceDashboard() {
  const { duration, structure, platform, hasDialogue } = useResonance();
  const { state: projectState, dispatch: projectDispatch } = useProject();

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
  }, [activeTimeline, platform]);

  // Handle Start Production
  const handleStartProduction = () => {
    // Construct Phase 1 Data
    const phase1Data: Phase1Data = {
      structure: modifiedStructure,
      timeline: activeTimeline
    };

    // Construct Platform Context
    // Note: Safe zones are hardcoded for now, ideally should come from a config based on platform
    const platformContext: PlatformContext = {
      platformId: platform,
      maxDuration: duration,
      safeZones: { top: 0, bottom: 0, left: 0, right: 0 } // Placeholder
    };

    projectDispatch({
      type: 'LOCK_BLUEPRINT',
      payload: {
        phase1Data,
        platformContext
      }
    });
  };

  // Conditional Rendering: Phase 2 vs Phase 1
  if (projectState.layers.blueprint) {
    return <ProductionDashboard />;
  }

  return (
    <div className="dashboard-layout phase1-mode">
      <style>
        {`
          .dashboard-layout {
            padding-bottom: 80px;
            min-height: 100vh;
            background: #121212;
          }
          .dashboard-main {
            display: grid;
            gap: 24px;
            padding: 16px;
            max-width: 1400px;
            margin: 0 auto;
            grid-template-columns: 1fr;
          }
          @media (min-width: 1024px) {
            .dashboard-main {
              grid-template-columns: 300px 1fr;
              padding: 32px;
              gap: 40px;
            }
          }
          .config-column h4 {
            color: #666;
            text-transform: uppercase;
            font-size: 0.7rem;
            letter-spacing: 1px;
            margin-bottom: 20px;
          }
        `}
      </style>
      <header className="dashboard-header" style={{ borderBottom: '2px solid #118AB2', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.2rem', margin: 0 }}>Phase 1: Blueprint</h1>
        <div className="meta-info" style={{ fontSize: '0.8rem', color: '#666' }}>
          <span>Emotional Logic Matrix</span>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Column 1: Config */}
        <aside className="config-column">
          <h4>Configuration</h4>

          <PlatformSelector />
          <DurationInput />
          <DialogueToggle />

          <div className="alert-area" style={{ marginTop: '30px' }}>
            <AlertBanner conflicts={conflicts} />
          </div>
        </aside>

        {/* Column 2: Selection */}
        <section className="selection-column">
          <StructureSelector activeTimeline={activeTimeline} />
        </section>
      </main>

      {/* Fixed Bottom Status Bar */}
      <QualityStatusBar
        report={qualityReport}
        onStartProduction={handleStartProduction}
        disabled={hasBlockingError}
      />
    </div>
  );
}

/**
 * App Root
 * Wraps the dashboard in the state provider.
 */
function App() {
  return (
    <ProjectProvider>
      <ResonanceProvider>
        <ResonanceDashboard />
      </ResonanceProvider>
    </ProjectProvider>
  );
}

export default App;
