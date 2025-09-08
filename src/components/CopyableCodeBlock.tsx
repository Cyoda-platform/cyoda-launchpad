import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface CopyableCodeBlockProps {
  children: string;
  language?: string;
  className?: string;
  maxHeight?: string;
  showLineNumbers?: boolean;
}

const CopyableCodeBlock: React.FC<CopyableCodeBlockProps> = ({
  children,
  language = 'text',
  className,
  maxHeight = '400px',
  showLineNumbers = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = children;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Determine if content should be scrollable
  const lineCount = children.split('\n').length;
  const shouldScroll = lineCount > 15; // Scroll if more than 15 lines

  return (
    <div className={cn('relative mb-6 group code-block-container', className)}>
      {/* Code block container */}
      <div className="code-block bg-card/20 backdrop-blur border border-border/50 rounded-lg overflow-hidden relative">
        {/* Language label and copy button */}
        <div className="absolute top-2 right-2 z-30 flex items-center gap-2">
          {language && language !== 'text' && (
            <div className="bg-background/95 backdrop-blur-sm border border-border/70 px-2 py-1 text-xs text-muted-foreground rounded shadow-sm">
              {language}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className={cn(
              'copy-button opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-8 p-0 rounded-md',
              'bg-background/95 backdrop-blur-sm border-border/70 hover:bg-primary hover:text-primary-foreground hover:border-primary',
              'shadow-sm hover:shadow-md transform hover:scale-105',
              copied && 'copy-button-visible bg-green-500/20 border-green-500/60 text-green-600 dark:text-green-400 hover:bg-green-500/30'
            )}
            title={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {shouldScroll ? (
          <div style={{ height: maxHeight }} className="overflow-hidden">
            <ScrollArea className="h-full w-full">
              <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
                className="!bg-transparent !text-sm !m-0"
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  paddingTop: '2.5rem', // Extra padding for the copy button
                  background: 'transparent',
                }}
                showLineNumbers={showLineNumbers}
                lineNumberStyle={{
                  minWidth: '3em',
                  paddingRight: '1em',
                  color: '#6b7280',
                  borderRight: '1px solid #374151',
                  marginRight: '1em',
                }}
              >
                {children}
              </SyntaxHighlighter>
            </ScrollArea>
          </div>
        ) : (
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            PreTag="div"
            className="!bg-transparent !text-sm !m-0"
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              paddingTop: '2.5rem', // Extra padding for the copy button
              background: 'transparent',
            }}
            showLineNumbers={showLineNumbers}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              color: '#6b7280',
              borderRight: '1px solid #374151',
              marginRight: '1em',
            }}
          >
            {children}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
};

export default CopyableCodeBlock;
