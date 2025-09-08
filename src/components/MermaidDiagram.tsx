import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize mermaid with configuration
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#1e40af',
        lineColor: '#6b7280',
        sectionBkgColor: '#1f2937',
        altSectionBkgColor: '#374151',
        gridColor: '#4b5563',
        secondaryColor: '#10b981',
        tertiaryColor: '#f59e0b',
        background: '#111827',
        mainBkg: '#1f2937',
        secondBkg: '#374151',
        tertiaryBkg: '#4b5563',
        // State diagram specific colors
        labelColor: '#ffffff',
        labelTextColor: '#ffffff',
        labelBackgroundColor: '#1f2937',
        nodeBorder: '#6b7280',
        clusterBkg: '#374151',
        clusterBorder: '#6b7280',
        defaultLinkColor: '#6b7280',
        titleColor: '#ffffff',
        edgeLabelBackground: '#1f2937',
        // Additional state diagram colors
        stateLabelColor: '#ffffff',
        stateBkg: '#1f2937',
        labelBoxBkgColor: '#1f2937',
        labelBoxBorderColor: '#6b7280',
        fillType0: '#1f2937',
        fillType1: '#374151',
        fillType2: '#4b5563',
        fillType3: '#6b7280',
        fillType4: '#9ca3af',
        fillType5: '#d1d5db',
        fillType6: '#e5e7eb',
        fillType7: '#f3f4f6',
      },
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      fontSize: 14,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
      },
      sequence: {
        useMaxWidth: true,
        wrap: true,
      },
      gantt: {
        useMaxWidth: true,
      },
      journey: {
        useMaxWidth: true,
      },
      timeline: {
        useMaxWidth: true,
      },
      gitgraph: {
        useMaxWidth: true,
      },
      state: {
        useMaxWidth: true,
      },
      pie: {
        useMaxWidth: true,
      },
      quadrantChart: {
        useMaxWidth: true,
      },
      xyChart: {
        useMaxWidth: true,
      },
      requirement: {
        useMaxWidth: true,
      },
      mindmap: {
        useMaxWidth: true,
      },
      sankey: {
        useMaxWidth: true,
      },
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!ref.current || !chart) return;

      setIsLoading(true);
      setError(null);

      try {
        // Clear previous content
        ref.current.innerHTML = '';
        
        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        // Render the diagram
        const { svg } = await mermaid.render(id, chart);
        
        if (ref.current) {
          ref.current.innerHTML = svg;
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className={cn(
        'bg-destructive/10 border border-destructive/20 rounded-lg p-4 my-6',
        className
      )}>
        <div className="text-destructive font-medium mb-2">Diagram Rendering Error</div>
        <div className="text-sm text-muted-foreground">{error}</div>
        <details className="mt-2">
          <summary className="text-sm cursor-pointer text-muted-foreground hover:text-foreground">
            Show diagram source
          </summary>
          <pre className="mt-2 text-xs bg-muted/50 p-2 rounded overflow-x-auto">
            <code>{chart}</code>
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className={cn(
      'relative bg-card/20 backdrop-blur border border-border/50 rounded-lg overflow-hidden my-6',
      className
    )}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Rendering diagram...</span>
          </div>
        </div>
      )}
      <div
        ref={ref}
        className="mermaid-container p-6 flex justify-center items-center min-h-[300px] overflow-x-auto"
        style={{
          // Ensure mermaid diagrams are visible in dark theme
          filter: 'invert(0)',
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
};

export default MermaidDiagram;
