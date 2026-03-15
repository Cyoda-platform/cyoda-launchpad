import { type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface UseCaseCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const UseCaseCard = ({ title, description, href, icon: Icon }: UseCaseCardProps) => {
  return (
    <Card className="hover:border-primary/40 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2 shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mt-2">{description}</p>
      </CardContent>
      <CardFooter>
        <Link
          to={href}
          className="text-primary text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          Learn more →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default UseCaseCard;
