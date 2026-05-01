import { ShieldCheck } from 'lucide-react';

const ProofBar = () => {
  return (
    <div
      className="py-4 flex items-center justify-center gap-2 flex-wrap text-sm text-muted-foreground"
      style={{
        backgroundColor: 'hsl(var(--proof-bar-bg))',
        borderTop: '1px solid hsl(var(--proof-bar-border))',
        borderBottom: '1px solid hsl(var(--proof-bar-border))',
      }}
    >
      <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
      <span>
        In production at VC Trade in the European private-debt market since 2017.
      </span>
      <span aria-hidden="true" className="hidden sm:inline text-border">|</span>
      <span className="hidden sm:inline">
        Previously deployed at a global KYC platform for four years.
      </span>
      {/* TODO: Add open-source chip once public launch is confirmed */}
    </div>
  );
};

export default ProofBar;
