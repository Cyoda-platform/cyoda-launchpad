import { ShieldCheck } from 'lucide-react';

const ProofBar = () => {
  return (
    <div
      className="py-4 flex items-center justify-center gap-3 flex-wrap text-sm font-medium text-muted-foreground"
      style={{
        backgroundColor: 'hsl(var(--proof-bar-bg))',
        borderTop: '1px solid hsl(var(--proof-bar-border))',
        borderBottom: '1px solid hsl(var(--proof-bar-border))',
      }}
    >
      <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
      <span>In production in the European private-debt market since 2017</span>
      <span aria-hidden="true">·</span>
      <span className="font-semibold text-foreground">VC Trade</span>
      <span aria-hidden="true">·</span>
      <span>Used by a global KYC platform for 4+ years prior to launch</span>
    </div>
  );
};

export default ProofBar;
