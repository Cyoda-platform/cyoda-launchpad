import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Twitter, 
  Linkedin, 
  Facebook, 
  Link2, 
  Check,
  Share2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
  className?: string;
  variant?: 'horizontal' | 'vertical';
  showLabels?: boolean;
}

const SocialShare: React.FC<SocialShareProps> = ({
  title,
  url,
  description = '',
  className,
  variant = 'horizontal',
  showLabels = false
}) => {
  const [copied, setCopied] = useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
  };

  const shareButtons = [
    {
      name: 'Twitter',
      icon: Twitter,
      onClick: () => handleShare('twitter'),
      className: 'hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: () => handleShare('linkedin'),
      className: 'hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600/30',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: () => handleShare('facebook'),
      className: 'hover:bg-blue-700/10 hover:text-blue-700 hover:border-blue-700/30',
    },
    {
      name: 'Copy Link',
      icon: copied ? Check : Link2,
      onClick: handleCopyLink,
      className: copied 
        ? 'bg-green-500/10 text-green-500 border-green-500/30' 
        : 'hover:bg-primary/10 hover:text-primary hover:border-primary/30',
    },
  ];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center text-sm text-muted-foreground mr-2">
        <Share2 className="w-4 h-4 mr-1" />
        {showLabels && <span>Share:</span>}
      </div>
      
      <div className={cn(
        'flex gap-2',
        variant === 'vertical' ? 'flex-col' : 'flex-row'
      )}>
        {shareButtons.map((button) => (
          <Button
            key={button.name}
            variant="outline"
            size="sm"
            onClick={button.onClick}
            className={cn(
              'bg-card/20 backdrop-blur border-border/50 transition-all duration-200',
              button.className,
              showLabels ? 'justify-start' : 'p-2'
            )}
            title={button.name}
          >
            <button.icon className={cn('w-4 h-4', showLabels && 'mr-2')} />
            {showLabels && <span>{button.name}</span>}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SocialShare;
