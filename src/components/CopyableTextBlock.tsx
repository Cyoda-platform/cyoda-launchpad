import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface CopyableTextBlockProps {
  children: React.ReactNode;
  text: string; // The actual text to copy
  className?: string;
  maxHeight?: string;
  label?: string;
  variant?: 'code' | 'prompt' | 'command';
}

const CopyableTextBlock: React.FC<CopyableTextBlockProps> = ({
  children,
  text,
  className,
  maxHeight = '300px',
  label,
  variant = 'code',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
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

  // Determine if content should be scrollable based on text length
  const shouldScroll = text.split('\n').length > 12 || text.length > 800;

  const getVariantStyles = () => {
    switch (variant) {
      case 'prompt':
        return 'bg-blue-500/5 border-blue-500/20';
      case 'command':
        return 'bg-green-500/5 border-green-500/20';
      default:
        return 'bg-card/20 border-border/50';
    }
  };

  const getVariantLabel = () => {
    if (label) return label;
    switch (variant) {
      case 'prompt':
        return 'Prompt';
      case 'command':
        return 'Command';
      default:
        return null;
    }
  };

  return (
    <div className={cn('relative mb-6 group code-block-container', className)}>
      {/* Content container */}
      <div className={cn(
        'backdrop-blur border rounded-lg overflow-hidden relative',
        getVariantStyles()
      )}>
        {/* Label and copy button */}
        <div className="absolute top-2 right-2 z-30 flex items-center gap-2">
          {getVariantLabel() && (
            <div className="bg-background/95 backdrop-blur-sm border border-border/70 px-2 py-1 text-xs text-muted-foreground rounded shadow-sm">
              {getVariantLabel()}
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
            title={copied ? 'Copied!' : 'Copy text'}
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
              <div className="p-4 pt-10">
                {children}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="p-4 pt-10">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default CopyableTextBlock;
