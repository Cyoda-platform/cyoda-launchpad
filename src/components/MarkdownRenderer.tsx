import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import MermaidDiagram from './MermaidDiagram';
import CopyableCodeBlock from './CopyableCodeBlock';
import CopyableTextBlock from './CopyableTextBlock';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Map markdown-relative image paths to actual Vite-served asset URLs
const blogAssets = import.meta.glob(
  '/src/docs/blogs/**/*.{png,jpg,jpeg,webp,svg,gif}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const guideAssets = import.meta.glob(
  '/src/docs/guides/**/*.{png,jpg,jpeg,webp,svg,gif}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;
const assetMap: Record<string, string> = { ...blogAssets, ...guideAssets };

function resolveMarkdownImageSrc(src?: string): string | undefined {
  if (!src) return src;
  // Leave absolute/http/data URLs as-is
  if (/^(?:https?:)?\/\//.test(src) || src.startsWith('data:') || src.startsWith('/')) {
    return src;
  }
  // Normalize leading './' or '/'
  const rel = src.replace(/^\.\/+/, '').replace(/^\//, '');
  const candidates = [
    `/src/docs/blogs/${rel}`,
    `/src/docs/guides/${rel}`,
  ];
  for (const key of candidates) {
    if (assetMap[key]) {
      const url = assetMap[key];
      if (import.meta.env.DEV && url !== src) {
        // Helpful during development to confirm resolution behavior
        // eslint-disable-next-line no-console
        console.debug('[MarkdownRenderer] Resolved markdown image', src, '->', url);
      }
      return url;
    }
  }
  // Fallback to original src if no match found
  return src;
}


// Utility functions to detect copyable content patterns
const detectCopyableContent = (text: string): { isCopyable: boolean; variant: 'prompt' | 'command' | 'code'; extractedText: string } => {
  const cleanText = text.trim();

  // Detect prompts (common patterns)
  const promptPatterns = [
    /^(copy this|use this prompt|prompt:|sample prompt)/i,
    /^(generate|create|build|make).*using/i,
    /^(here's the prompt|this prompt)/i,
  ];

  // Detect commands (bash, shell, etc.)
  const commandPatterns = [
    /^(curl|npm|yarn|pip|docker|git|mvn|gradle|cargo)\s/i,
    /^(sudo|chmod|mkdir|cd|ls|cat|echo)\s/i,
    /^\$\s/,
    /^#\s/,
  ];

  // Check for prompt patterns
  for (const pattern of promptPatterns) {
    if (pattern.test(cleanText)) {
      return { isCopyable: true, variant: 'prompt', extractedText: cleanText };
    }
  }

  // Check for command patterns
  for (const pattern of commandPatterns) {
    if (pattern.test(cleanText)) {
      return { isCopyable: true, variant: 'command', extractedText: cleanText };
    }
  }

  // Check if it looks like a long copyable text block (configuration, etc.)
  if (cleanText.length > 100 && (cleanText.includes('\n') || cleanText.includes('='))) {
    return { isCopyable: true, variant: 'code', extractedText: cleanText };
  }

  return { isCopyable: false, variant: 'code', extractedText: cleanText };
};

const extractTextFromChildren = (children: any): string => {
  if (typeof children === 'string') {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }

  if (children?.props?.children) {
    return extractTextFromChildren(children.props.children);
  }

  return '';
};

const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  return (
    <div className={cn('prose prose-slate dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom heading components with better styling
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold text-foreground mb-6 mt-8 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold text-foreground mb-4 mt-8 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold text-foreground mb-3 mt-6 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-semibold text-foreground mb-2 mt-4 first:mt-0">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-lg font-semibold text-foreground mb-2 mt-4 first:mt-0">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-base font-semibold text-foreground mb-2 mt-4 first:mt-0">
              {children}
            </h6>
          ),

          // Custom paragraph styling with copyable content detection
          p: ({ children }) => {
            const textContent = extractTextFromChildren(children);
            const { isCopyable, variant } = detectCopyableContent(textContent);

            // Only make paragraphs copyable if they contain commands or are very specific patterns
            // Avoid making regular text copyable to prevent UI clutter
            if (isCopyable && (variant === 'command' || textContent.length > 200)) {
              return (
                <CopyableTextBlock
                  text={textContent}
                  variant={variant}
                  className="my-6"
                >
                  <div className="text-foreground leading-relaxed">{children}</div>
                </CopyableTextBlock>
              );
            }

            return (
              <p className="text-foreground leading-relaxed mb-6">
                {children}
              </p>
            );
          },

          // Custom link styling
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:text-primary/80 underline underline-offset-4 transition-all duration-200 hover:bg-primary/10 px-1 py-0.5 rounded"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),

          // Custom list styling
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-6 space-y-2 text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-6 space-y-2 text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed text-muted-foreground">{children}</li>
          ),

          // Custom blockquote styling with copyable content detection
          blockquote: ({ children }) => {
            const textContent = extractTextFromChildren(children);
            const { isCopyable, variant } = detectCopyableContent(textContent);

            if (isCopyable) {
              return (
                <CopyableTextBlock
                  text={textContent}
                  variant={variant}
                  className="my-6"
                >
                  <div className="text-foreground leading-relaxed">{children}</div>
                </CopyableTextBlock>
              );
            }

            return (
              <blockquote className="border-l-4 border-primary/50 pl-6 py-4 my-6 bg-card/20 backdrop-blur border border-border/50 rounded-r-lg">
                <div className="text-muted-foreground italic leading-relaxed">{children}</div>
              </blockquote>
            );
          },

          // Custom code styling with syntax highlighting, copy functionality, and mermaid support
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeContent = String(children).replace(/\n$/, '');

            if (inline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                  {children}
                </code>
              );
            }

            // Handle mermaid diagrams
            if (language === 'mermaid') {
              return (
                <MermaidDiagram
                  chart={codeContent}
                  className="my-6"
                />
              );
            }

            // Use the new CopyableCodeBlock component
            const lineCount = codeContent.split('\n').length;
            return (
              <CopyableCodeBlock
                language={language}
                showLineNumbers={language && language !== 'text' && lineCount > 10}
                maxHeight={lineCount > 15 ? '400px' : undefined}
              >
                {codeContent}
              </CopyableCodeBlock>
            );
          },

          // Custom pre styling for code blocks (fallback)
          pre: ({ children }) => (
            <div className="mb-4">
              {children}
            </div>
          ),

          // Custom table styling
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6">
              <div className="bg-card/20 backdrop-blur border border-border/50 rounded-lg overflow-hidden">
                <table className="min-w-full border-collapse">
                  {children}
                </table>
              </div>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-primary/10 border-b border-border/50 px-4 py-3 text-left font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/30 px-4 py-3 text-foreground">
              {children}
            </td>
          ),

          // Custom image styling with asset resolution for relative paths
          img: ({ src, alt }) => {
            const resolved = resolveMarkdownImageSrc(src);
            return (
              <img
                src={resolved}
                alt={alt}
                className="rounded-lg shadow-lg max-w-full h-auto my-6"
                loading="lazy"
              />
            );
          },

          // Custom horizontal rule
          hr: () => (
            <hr className="border-border my-8" />
          ),

          // Custom strong/bold styling
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),

          // Custom emphasis/italic styling
          em: ({ children }) => (
            <em className="italic text-muted-foreground">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
