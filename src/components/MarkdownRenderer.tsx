import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import MermaidDiagram from './MermaidDiagram';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

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
          
          // Custom paragraph styling
          p: ({ children }) => (
            <p className="text-foreground leading-relaxed mb-6">
              {children}
            </p>
          ),
          
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
          
          // Custom blockquote styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 pl-6 py-4 my-6 bg-card/20 backdrop-blur border border-border/50 rounded-r-lg">
              <div className="text-muted-foreground italic leading-relaxed">{children}</div>
            </blockquote>
          ),
          
          // Custom code styling with syntax highlighting and mermaid support
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

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
                  chart={String(children).replace(/\n$/, '')}
                  className="my-6"
                />
              );
            }

            return (
              <div className="relative mb-6">
                {language && (
                  <div className="absolute top-0 right-0 bg-card/80 backdrop-blur border border-border/50 px-3 py-1 text-xs text-muted-foreground rounded-bl-lg rounded-tr-lg z-10">
                    {language}
                  </div>
                )}
                <div className="code-block bg-card/20 backdrop-blur border border-border/50 rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    style={oneDark}
                    language={language || 'text'}
                    PreTag="div"
                    className="!bg-transparent !text-sm"
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      background: 'transparent',
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              </div>
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
          
          // Custom image styling
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg shadow-lg max-w-full h-auto my-6"
              loading="lazy"
            />
          ),
          
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
