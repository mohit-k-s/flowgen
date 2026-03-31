import { InputPane } from './components/InputPane'
import { DiagramPane } from './components/DiagramPane'
import { useDiagramGeneration } from './hooks/useDiagramGeneration'

function App() {
  const { generate, reset, loadDiagram, status, diagram, error, warningsEnabled, toggleWarnings } = useDiagramGeneration()

  const handleApplyFix = (fix: string) => {
    generate(fix)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0f0f1a]">
      {/* Left: Input */}
      <div className="w-[38%] min-w-[320px] max-w-[480px] flex flex-col">
        <InputPane
          onGenerate={generate}
          onLoadTemplate={loadDiagram}
          status={status}
          hasExistingDiagram={diagram !== null}
        />
      </div>

      {/* Right: Diagram */}
      <div className="flex-1 flex flex-col">
        <DiagramPane
          diagram={diagram}
          status={status}
          error={error}
          onReset={reset}
          onApplyFix={handleApplyFix}
          warningsEnabled={warningsEnabled}
          onToggleWarnings={toggleWarnings}
        />
      </div>
    </div>
  )
}

export default App
