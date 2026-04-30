import { useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type PrettyJsonBlockProps = {
  title: string;
  badge?: string;
  value: unknown;
  maxHeight?: string;
  defaultExpanded?: boolean;
  className?: string;
};

function normaliseJson(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  return JSON.stringify(value, null, 2);
}

const PrettyJsonBlock = ({
  title,
  badge = 'JSON entity',
  value,
  maxHeight = '520px',
  defaultExpanded = true,
  className,
}: PrettyJsonBlockProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const json = useMemo(() => normaliseJson(value), [value]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = json;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)]',
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-border/70 bg-muted/55 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-[-2px] h-7 w-7 shrink-0 text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={() => setExpanded((current) => !current)}
            aria-label={expanded ? 'Collapse JSON block' : 'Expand JSON block'}
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-semibold text-foreground">{title}</p>
          </div>
          {badge ? (
            <span className="inline-flex shrink-0 items-center rounded-full border border-primary/20 bg-primary/[0.08] px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
              {badge}
            </span>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 justify-center gap-2 rounded-md border border-border/70 bg-background/90 text-foreground hover:bg-accent hover:text-foreground sm:justify-start"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          <span className="text-xs">{copied ? 'Copied' : 'Copy'}</span>
        </Button>
      </div>

      {expanded ? (
        <div className="overflow-auto" style={{ maxHeight }}>
          <SyntaxHighlighter
            language="json"
            style={oneLight}
            wrapLongLines={false}
            showLineNumbers={false}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'hsl(210 40% 98%)',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              minWidth: '100%',
              borderRadius: 0,
            }}
            codeTagProps={{
              style: {
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace',
              },
            }}
          >
            {json}
          </SyntaxHighlighter>
        </div>
      ) : null}
    </section>
  );
};

export default PrettyJsonBlock;
