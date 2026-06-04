import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trackCtaConversion } from '@/utils/analytics';

// ---------------------------------------------------------------------------
// Google Form wiring ("Cyoda Cloud Waitlist" in the Cyoda Google Workspace).
// These IDs are public by nature — any visitor can read them from the bundle —
// so there is no env-var ceremony. Responses land in the form's response sheet.
// This component is the swap boundary for a future IdP pre-registration CTA
// (see spec: docs/superpowers/specs/2026-06-03-cyoda-cloud-waitlist-page-design.md).
// ---------------------------------------------------------------------------
const FORM_ID = '1FAIpQLSeJ8n1Kn1832pqspay9n3BJ9FtGohGy6nj8qG2sGCBbPkY5fg';
const FORM_ACTION = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;
const ENTRY_EMAIL = 'entry.985266879';
const ENTRY_COMPANY = 'entry.226608520';
const ENTRY_USE_CASE = 'entry.1541059541';
const ENTRY_MESSAGE = 'entry.1183618716';

// Must match the Google Form's option strings byte-for-byte — Google Forms
// silently drops POSTed values that don't match an existing option.
const USE_CASE_OPTIONS = [
  'Regulated or audit-heavy workflows',
  'Transactional core / system of record',
  'Operational workflow automation',
  'Governed AI agents',
  'Just exploring',
  'Something else',
];

// Anti-spam: submissions faster than a human could plausibly type are dropped.
const MIN_SUBMIT_MS = 3000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'submitting' | 'success' | 'error';

const CloudWaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [useCase, setUseCase] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [emailError, setEmailError] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const mountedAt = useRef(Date.now());

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!EMAIL_RE.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');

    // Honeypot filled, or submitted faster than a human could type: pretend
    // success WITHOUT sending — never tip a bot off that it was detected.
    if (honeypot || Date.now() - mountedAt.current < MIN_SUBMIT_MS) {
      setStatus('success');
      return;
    }

    setStatus('submitting');
    const body = new URLSearchParams();
    body.set(ENTRY_EMAIL, email);
    if (company) body.set(ENTRY_COMPANY, company);
    if (useCase) body.set(ENTRY_USE_CASE, useCase);
    if (message) body.set(ENTRY_MESSAGE, message);

    try {
      // no-cors = fire-and-forget: Google accepts the POST but the response is
      // opaque. Resolve means "sent"; reject means a genuine network failure.
      await fetch(FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      trackCtaConversion({
        location: 'waitlist_form',
        page_variant: 'cloud',
        cta: 'waitlist_signup',
        url: '/cloud',
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center" role="status">
        <p className="text-lg font-semibold text-foreground">You're on the list.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We'll be in touch when early access opens.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
      <div className="space-y-1.5">
        <Label htmlFor="waitlist-email">Work email</Label>
        <Input
          id="waitlist-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-invalid={Boolean(emailError)}
        />
        {emailError && <p className="text-sm text-destructive">{emailError}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="waitlist-company">
          Company <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="waitlist-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="waitlist-use-case">
          What are you building? <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Select value={useCase} onValueChange={setUseCase}>
          <SelectTrigger id="waitlist-use-case">
            <SelectValue placeholder="Choose one" />
          </SelectTrigger>
          <SelectContent>
            {USE_CASE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="waitlist-message">
          Anything you'd like to tell us?{' '}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="waitlist-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* Honeypot — hidden from humans (off-screen, skipped by tab order and
          screen readers); naive bots fill every field they find. */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        data-testid="hp-field"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      />

      <Button type="submit" className="w-full font-semibold" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Joining…' : 'Join the waitlist'}
      </Button>

      {status === 'error' && (
        <p className="text-sm text-destructive" role="alert">
          Something went wrong — try again, or reach us via the{' '}
          <Link to="/contact" className="underline underline-offset-2">
            contact page
          </Link>
          .
        </p>
      )}
    </form>
  );
};

export default CloudWaitlistForm;
