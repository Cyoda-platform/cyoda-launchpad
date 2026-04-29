interface EntityDataModelCardProps {
  title: string;
  body: string;
  snippet: string;
}

const EntityDataModelCard = ({ title, body, snippet }: EntityDataModelCardProps) => {
  return (
    <div className="rounded-lg border border-border/60 bg-background p-4">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-muted-foreground">{body}</p>
      <pre className="mt-3 overflow-x-auto rounded-md border border-border/60 bg-card px-3 py-3 text-xs leading-relaxed text-muted-foreground">
        <code>{snippet}</code>
      </pre>
    </div>
  );
};

export default EntityDataModelCard;
