import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import PrettyJsonBlock from '@/components/PrettyJsonBlock';
import { cn } from '@/lib/utils';

interface EntityDataModelCardProps {
  title: string;
  body: string;
  snippet: string;
  className?: string;
  codeClassName?: string;
  jsonTitle?: string;
  jsonBadge?: string;
  jsonMaxHeight?: string;
  jsonDefaultExpanded?: boolean;
  dialogTitle?: string;
  dialogDescription?: string;
  dialogTriggerLabel?: string;
}

const EntityDataModelCard = ({
  title,
  body,
  snippet,
  className,
  codeClassName,
  jsonTitle,
  jsonBadge,
  jsonMaxHeight,
  jsonDefaultExpanded,
  dialogTitle,
  dialogDescription,
  dialogTriggerLabel,
}: EntityDataModelCardProps) => {
  const hasSummary = title.trim().length > 0 || body.trim().length > 0;

  return (
    <div className={cn('rounded-lg border border-border/60 bg-background p-4', className)}>
      <div
        className={cn(
          'flex flex-col gap-3 md:flex-row md:items-start',
          hasSummary ? 'md:justify-between' : 'md:justify-end',
        )}
      >
        {hasSummary ? (
          <div className="min-w-0">
            {title.trim().length > 0 ? <p className="font-medium text-foreground">{title}</p> : null}
            {body.trim().length > 0 ? (
              <p className={cn('text-muted-foreground', title.trim().length > 0 ? 'mt-1' : '')}>
                {body}
              </p>
            ) : null}
          </div>
        ) : null}
        {dialogTriggerLabel ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0">
                {dialogTriggerLabel}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-5xl">
              <DialogHeader>
                <DialogTitle>{dialogTitle ?? title}</DialogTitle>
                {dialogDescription ? (
                  <DialogDescription>{dialogDescription}</DialogDescription>
                ) : null}
              </DialogHeader>
              <PrettyJsonBlock
                title={jsonTitle ?? dialogTitle ?? title}
                badge={jsonBadge}
                value={snippet}
                maxHeight="72vh"
                defaultExpanded
              />
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
      <PrettyJsonBlock
        title={jsonTitle ?? title}
        badge={jsonBadge}
        value={snippet}
        maxHeight={jsonMaxHeight}
        defaultExpanded={jsonDefaultExpanded}
        className={cn(hasSummary ? 'mt-3' : 'mt-0', codeClassName)}
      />
    </div>
  );
};

export default EntityDataModelCard;
