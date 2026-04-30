import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface EntityDataModelCardProps {
  title: string;
  body: string;
  snippet: string;
  className?: string;
  codeClassName?: string;
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
  dialogTitle,
  dialogDescription,
  dialogTriggerLabel,
}: EntityDataModelCardProps) => {
  return (
    <div className={cn('rounded-lg border border-border/60 bg-background p-4', className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="font-medium text-foreground">{title}</p>
          <p className="mt-1 text-muted-foreground">{body}</p>
        </div>
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
              <pre className="max-h-[72vh] overflow-x-auto overflow-y-auto rounded-md border border-border/60 bg-card px-4 py-4 text-[12px] leading-6 text-muted-foreground">
                <code>{snippet}</code>
              </pre>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
      <pre
        className={cn(
          'mt-3 max-h-72 overflow-x-auto overflow-y-auto rounded-md border border-border/60 bg-card px-3 py-3 text-[11px] leading-5 text-muted-foreground',
          codeClassName,
        )}
      >
        <code>{snippet}</code>
      </pre>
    </div>
  );
};

export default EntityDataModelCard;
