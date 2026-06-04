# Cyoda Cloud Waitlist Page + ai.cyoda.net De-emphasis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/cloud` coming-soon/waitlist page for the new Cyoda Cloud and remove every `ai.cyoda.net` reference from the site, replacing the try-it-today narrative with the OSS-on-ramp story.

**Architecture:** A new prerendered route (`/cloud`) with a self-contained waitlist form component that POSTs to a Google Form (fire-and-forget, honeypot + min-time anti-spam). Site-wide sweep re-points nav/footer/CTAs to `/cloud` and rewrites live-SaaS copy per the spec's binding rule: *no surviving sentence may promise live, self-serve hosted capability*. The conversion-tracking predicate re-targets from outbound `ai.cyoda.net` to the internal waitlist destination.

**Tech Stack:** React 18 + TS, shadcn/ui (`Card`/`Input`/`Label`/`Textarea`/`Select`/`Button`/existing patterns), react-router v6, Vitest + @testing-library/react, the existing prerender pipeline (`/cloud` gets HTML + `.md` + sitemap automatically).

**Spec:** `docs/superpowers/specs/2026-06-03-cyoda-cloud-waitlist-page-design.md` — the authority. Branch: **stack commits onto `feat/prerender`** (decided; do NOT create a new branch).

---

## Verified constants (extracted from the live Google Form, test-submission confirmed)

```
FORM_ID        1FAIpQLSeJ8n1Kn1832pqspay9n3BJ9FtGohGy6nj8qG2sGCBbPkY5fg
entry.985266879   Work email
entry.226608520   Company
entry.1541059541  What are you building?   (multiple choice)
entry.1183618716  Anything you'd like to tell us?  (paragraph)
```

Option strings (MUST match byte-for-byte; verified against the form):
`Regulated or audit-heavy workflows`, `Transactional core / system of record`, `Operational workflow automation`, `Governed AI agents`, `Just exploring`, `Something else`

## File structure

| File | Responsibility |
|---|---|
| `src/components/CloudWaitlistForm.tsx` (create) | The waitlist form: Google-Form POST, honeypot, min-time, validation, states. The future IdP swap boundary |
| `tests/unit/components/cloud-waitlist-form.test.tsx` (create) | Suppression/validation/state tests |
| `src/pages/CyodaCloud.tsx` (create) | The `/cloud` page (hero + form + value cards + strip + star block) |
| `src/routes.tsx` (modify) | `/cloud` route entry |
| `src/utils/conversion-tracking.ts`, `src/utils/analytics.ts`, `tests/unit/utils/conversion-tracking.test.ts` (modify) | Conversion predicate re-target |
| `src/components/Header.tsx`, `Footer.tsx` (modify) | Nav swaps |
| `src/components/{ThreeStepSection,PersonaSwitcher,CyodaPathsSection,AINativeSection,DeveloperReliabilitySection}.tsx` (modify) | OSS-on-ramp narrative |
| `src/pages/{Dev,Comparison,Support,UseCaseGovernedAiActions,About}.tsx` (modify) | OSS-on-ramp narrative |
| `public/llms.txt`, `CLAUDE.md`, `AGENTS.md`, `README.md` (modify) | Estate descriptions |

---

### Task 1: `CloudWaitlistForm` component (TDD)

**Files:**
- Create: `src/components/CloudWaitlistForm.tsx`
- Create: `tests/unit/components/cloud-waitlist-form.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/components/cloud-waitlist-form.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CloudWaitlistForm from '@/components/CloudWaitlistForm';

// trackCtaConversion is fired on successful submits — keep it inert in tests.
vi.mock('@/utils/analytics', () => ({
  trackCtaConversion: vi.fn(),
}));

const renderForm = () =>
  render(
    <MemoryRouter>
      <CloudWaitlistForm />
    </MemoryRouter>,
  );

const fillEmail = (value: string) =>
  fireEvent.change(screen.getByLabelText(/work email/i), { target: { value } });

const submit = () => fireEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));

describe('CloudWaitlistForm', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers({ now: 0 });
    fetchMock = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('rejects an invalid email without sending', () => {
    renderForm();
    vi.setSystemTime(10_000);
    fillEmail('not-an-email');
    submit();
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits to the Google Form endpoint and shows success', async () => {
    renderForm();
    vi.setSystemTime(10_000); // past the min-time window
    fillEmail('founder@example.com');
    submit();
    await waitFor(() => expect(screen.getByText(/you're on the list/i)).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('/formResponse');
    expect(init.mode).toBe('no-cors');
    expect(init.body).toContain('entry.985266879=founder%40example.com');
  });

  it('honeypot filled: shows success WITHOUT sending', async () => {
    renderForm();
    vi.setSystemTime(10_000);
    fillEmail('bot@example.com');
    // The honeypot is hidden from humans but present in the DOM.
    fireEvent.change(screen.getByTestId('hp-field'), { target: { value: 'http://spam' } });
    submit();
    await waitFor(() => expect(screen.getByText(/you're on the list/i)).toBeInTheDocument());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submission faster than the min-time window: success WITHOUT sending', async () => {
    renderForm();
    vi.setSystemTime(1_000); // only 1s after mount (< 3s)
    fillEmail('fast@example.com');
    submit();
    await waitFor(() => expect(screen.getByText(/you're on the list/i)).toBeInTheDocument());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('network failure shows the error state', async () => {
    fetchMock.mockRejectedValueOnce(new Error('offline'));
    renderForm();
    vi.setSystemTime(10_000);
    fillEmail('founder@example.com');
    submit();
    await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument());
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/unit/components/cloud-waitlist-form.test.tsx`
Expected: FAIL — cannot resolve `@/components/CloudWaitlistForm`.

- [ ] **Step 3: Create `src/components/CloudWaitlistForm.tsx`**

```tsx
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/components/cloud-waitlist-form.test.tsx`
Expected: PASS (5 tests). If the fake-timers/`waitFor` combination hangs, switch the suite to `vi.useFakeTimers({ now: 0, shouldAdvanceTime: true })` — that keeps `Date.now()` controllable while letting `waitFor` polling proceed.

- [ ] **Step 5: Typecheck + commit**

Run: `npm run typecheck`
```bash
git add src/components/CloudWaitlistForm.tsx tests/unit/components/cloud-waitlist-form.test.tsx
git commit -m "feat: Cyoda Cloud waitlist form — Google Form POST with honeypot and min-time guards

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: `/cloud` page + route

**Files:**
- Create: `src/pages/CyodaCloud.tsx`
- Modify: `src/routes.tsx` (insert one entry)

- [ ] **Step 1: Create `src/pages/CyodaCloud.tsx`** (copy is spec-approved verbatim — do not editorialize):

```tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import CloudWaitlistForm from '@/components/CloudWaitlistForm';
import { Card, CardContent } from '@/components/ui/card';
import { SiGithub } from 'react-icons/si';
import { Building2, History, ServerCog, GitBranch } from 'lucide-react';
import { organizationSchema } from '@/data/schemas';

const valueProps = [
  {
    icon: Building2,
    title: 'Production architecture from day one',
    body: 'Prototype on the same entity-database core a regulated institution would run. When real volume arrives, you change infrastructure — not your code or your data model.',
  },
  {
    icon: History,
    title: 'An audit trail by construction',
    body: 'Every entity state change is committed with its full history, queryable at any point in time. The artifact auditors and investors ask for, built in — not bolted on.',
  },
  {
    icon: ServerCog,
    title: 'Fully managed, zero ops',
    body: 'We run the platform, the storage, and the upgrades. You never patch a server or carry a pager.',
  },
  {
    icon: GitBranch,
    title: 'Your code stays yours',
    body: 'Business logic runs in compute nodes you own: your repository, your pipeline, your artifact. The platform never holds your source.',
  },
];

const waitlistPerks = [
  'Early access in invitation cohorts',
  'Founding-customer pricing',
  'A direct line to the engineers building it',
];

const CyodaCloud = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Cyoda Cloud — Coming Soon | Join the Waitlist"
      description="The new Cyoda Cloud: a fully managed platform for regulated workflows. Prototype to production without re-architecting. Join the waitlist for early access."
      url="https://cyoda.com/cloud"
      type="website"
      jsonLd={organizationSchema}
    />
    <Header />
    <main>
      {/* Hero with inline waitlist form */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary border border-primary/30 rounded-full px-3 py-1 mb-6">
              Coming soon
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
              The new Cyoda Cloud
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              A fully managed platform that runs your regulated workflows on Cyoda —
              start with a prototype, reach production without re-architecting.
            </p>
            <div className="max-w-md mx-auto rounded-2xl border border-border bg-card p-6 text-left">
              <h2 className="text-lg font-semibold text-foreground mb-4">Join the waitlist</h2>
              <CloudWaitlistForm />
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-16 bg-[hsl(var(--section-alt-bg))]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {valueProps.map((prop) => (
              <Card key={prop.title} className="border-border/60 bg-card/80">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <prop.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{prop.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What waitlist members get */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
            {waitlistPerks.map((perk) => (
              <p key={perk} className="text-sm font-medium text-foreground">
                {perk}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Anonymous alternative */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Not ready to share your email?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Star{' '}
              <a
                href="https://github.com/Cyoda-platform/cyoda-cloud-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline underline-offset-2"
              >
                cyoda-cloud-cli
              </a>{' '}
              on GitHub instead — every star is a vote to ship this sooner.
            </p>
            <a
              href="https://github.com/Cyoda-platform/cyoda-cloud-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border bg-card font-semibold text-sm text-foreground hover:border-primary/40 transition-colors"
            >
              <SiGithub className="w-4 h-4" />
              Star on GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default CyodaCloud;
```

- [ ] **Step 2: Add the route** — in `src/routes.tsx`, insert directly after the `/comparison` entry (above the catch-all comment):

```tsx
  { path: "/cloud", component: lazy(() => import("./pages/CyodaCloud")), prerender: true },
```

- [ ] **Step 3: Verify**

Run: `npm run test:run && npm run typecheck && npm run build`
Expected: all green (route-table tests are count-agnostic). Then a quick visual check: `npm run dev`, open `http://localhost:8080/cloud` — hero, form, cards, star block render; submit the form with a junk email → inline validation; stop the dev server. (Do NOT test a real submission here — that happens once, in Task 8.)

- [ ] **Step 4: Commit**

```bash
git add src/pages/CyodaCloud.tsx src/routes.tsx
git commit -m "feat: /cloud coming-soon page with waitlist and star CTA

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Re-target conversion tracking from ai.cyoda.net to the waitlist

**Files:**
- Modify: `src/utils/conversion-tracking.ts`
- Modify: `src/utils/analytics.ts`
- Modify: `tests/unit/utils/conversion-tracking.test.ts`

- [ ] **Step 1: Update the failing tests first.** In `tests/unit/utils/conversion-tracking.test.ts`, the import changes from `isAiCyodaNetDestination` to `isWaitlistDestination`, and the URL-classification describe block becomes:

```ts
  describe('isWaitlistDestination', () => {
    it('returns true for waitlist URLs', () => {
      expect(isWaitlistDestination('/cloud')).toBe(true);
      expect(isWaitlistDestination('https://cyoda.com/cloud')).toBe(true);
    });

    it('returns false for non-waitlist URLs', () => {
      expect(isWaitlistDestination('https://github.com/cyoda')).toBe(false);
      expect(isWaitlistDestination('https://cyoda.com/contact')).toBe(false);
      expect(isWaitlistDestination('/cloudy')).toBe(false);
      expect(isWaitlistDestination('not a url')).toBe(false);
    });
  });
```

Keep all other tests in the file; replace any remaining `ai.cyoda.net` fixture URLs with `/cloud` or `https://cyoda.com/cloud` so they exercise the same code paths (the enhanced-conversion behavior is destination-triggered). Run `npx vitest run tests/unit/utils/conversion-tracking.test.ts` — expect FAIL (function not exported yet).

- [ ] **Step 2: Implement in `src/utils/conversion-tracking.ts`.** Replace `isAiCyodaNetDestination` with:

```ts
/**
 * Check if a URL is the Cyoda Cloud waitlist destination (/cloud) —
 * the site's primary conversion goal while the managed platform is pre-launch.
 */
export function isWaitlistDestination(url: string): boolean {
    if (url === '/cloud') return true;
    try {
        const urlObj = new URL(url, 'https://cyoda.com');
        return urlObj.hostname === 'cyoda.com' && urlObj.pathname === '/cloud';
    } catch {
        return false;
    }
}
```

Update the module doc comment and all in-file JSDoc: the module tracks "Cyoda Cloud waitlist conversions" (was "ai.cyoda.net Clicks"); example destinations become `/cloud`. No other logic changes — `trackAdConversion`, UTM enrichment, and time-to-conversion stay as they are.

- [ ] **Step 3: Update `src/utils/analytics.ts`.** Replace every `isAiCyodaNetDestination` import/call with `isWaitlistDestination`, and update the doc comments (`ai.cyoda.net (product/demo access)` → `/cloud (waitlist signup)` etc.). The branching logic in `trackCtaConversion` is unchanged — only the predicate.

- [ ] **Step 4: Verify**

Run: `npx vitest run tests/unit/utils/conversion-tracking.test.ts && npm run test:run && npm run typecheck`
Expected: all green. Then: `grep -n "isAiCyodaNetDestination" -r src tests` → no output.

- [ ] **Step 5: Commit**

```bash
git add src/utils/conversion-tracking.ts src/utils/analytics.ts tests/unit/utils/conversion-tracking.test.ts
git commit -m "refactor: conversion tracking targets the /cloud waitlist, not ai.cyoda.net

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Header + Footer nav swap

**Files:**
- Modify: `src/components/Header.tsx` (desktop ~:222-234, mobile ~:366-374)
- Modify: `src/components/Footer.tsx` (~:25)

- [ ] **Step 1: Desktop nav.** In `Header.tsx`, replace the "Cyoda Cloud — external top-level link" block:

old:
```tsx
            {/* Cyoda Cloud — external top-level link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  href="https://ai.cyoda.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors font-medium text-sm"
                >
                  Cyoda Cloud
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
```

new:
```tsx
            {/* Cyoda Cloud — internal coming-soon/waitlist page */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/cloud"
                  className="text-foreground hover:text-primary transition-colors font-medium text-sm"
                >
                  Cyoda Cloud
                  <span className="ml-1.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-primary border border-primary/30 rounded px-1 py-0.5">
                    Soon
                  </span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
```

(`Link` is already imported in Header.tsx.)

- [ ] **Step 2: Mobile nav.** Replace the mobile `<a href="https://ai.cyoda.net/" ...>Cyoda Cloud</a>` block (under the "Cyoda Web" heading) with:

```tsx
              <Link
                to="/cloud"
                className="block py-1.5 pl-3 text-sm text-foreground hover:text-primary transition-colors"
              >
                Cyoda Cloud
                <span className="ml-1.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-primary border border-primary/30 rounded px-1 py-0.5">
                  Soon
                </span>
              </Link>
```

If the surrounding mobile links close the menu via an `onClick` handler, copy that prop from the adjacent internal links (e.g. the `/dev` link) so behavior matches.

- [ ] **Step 3: Footer.** In `Footer.tsx`, `cyodaWebLinks`:

old: `{ name: "Cyoda Cloud", href: "https://ai.cyoda.net/", external: true },`
new: `{ name: "Cyoda Cloud", href: "/cloud" },`

(The renderer already branches on `external` — verify the internal branch renders a router `<Link>`, as it does for "Enterprise Cyoda".)

- [ ] **Step 4: Verify + commit**

Run: `npm run typecheck && npm run build`. Quick dev-server check: nav item navigates to `/cloud` with the Soon badge, desktop + mobile + footer.

```bash
git add src/components/Header.tsx src/components/Footer.tsx
git commit -m "feat: nav and footer point Cyoda Cloud at the internal /cloud waitlist page

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Homepage sections — OSS-on-ramp rewrite

Binding rule for every edit in Tasks 5–6: **no surviving sentence may promise live, self-serve hosted capability** (AI assistant, free tier, prototype-in-first-session). cyoda.dev and docs.cyoda.net links stay.

**Files:**
- Modify: `src/components/ThreeStepSection.tsx`
- Modify: `src/components/PersonaSwitcher.tsx`
- Modify: `src/components/CyodaPathsSection.tsx`
- Modify: `src/components/AINativeSection.tsx`
- Modify: `src/components/DeveloperReliabilitySection.tsx`

- [ ] **Step 1: `ThreeStepSection.tsx`.**

(a) The click handler (~:20-28) — re-target to the internal page:

old:
```tsx
    trackCtaConversion({
      location: "cta_section",
      page_variant: getPageVariant(),
      cta: "try_now",
      url: "https://ai.cyoda.net"
    });
    window.open('https://ai.cyoda.net', '_blank');
```
new:
```tsx
    trackCtaConversion({
      location: "cta_section",
      page_variant: getPageVariant(),
      cta: "join_waitlist",
      url: "/cloud"
    });
    navigate('/cloud');
```
Add `import { useNavigate } from 'react-router-dom';` (or extend an existing react-router import) and `const navigate = useNavigate();` at the top of the component function.

(b) Step 1 of the `steps` array — retire the AI-assistant claim:

old title/description:
```
"1. Let AI build your prototype"
"Describe your application requirements in natural language at ai.cyoda.net. The AI generates entity models, state machine configurations, and API scaffolding. You get a running prototype with full workflow state from the first session."
```
new:
```tsx
      title: "1. Start with open source",
      description: "Self-host open-source Cyoda from cyoda.dev and model your application as entities with explicit workflows. Start with in-memory or SQLite, grow to PostgreSQL without changing your model.",
```

(c) Step 3 description — first sentence only:

old: `Deploy to Cyoda Cloud or your own Kubernetes cluster.`
new: `Deploy to your own Kubernetes cluster today — or to the fully managed Cyoda Cloud when it arrives.`
(Keep the rest of the sentence block and the footnote markup unchanged.)

(d) Section intro paragraph (~:75) — retire the generation claim:

old: `Describe your application. Cyoda generates the data model, workflow configuration, and API. The platform handles consistency, audit, and state. Your code handles the business logic.`
new: `Model your application as entities with explicit workflows. The platform handles consistency, audit, and state. Your code handles the business logic.`

(e) CTA button label: `Try Now` → `Join the Cyoda Cloud waitlist`.

- [ ] **Step 2: `PersonaSwitcher.tsx`** (developer card ~:40-45):

old:
```tsx
    title: 'Start at ai.cyoda.net, clone into your IDE',
    description:
      'Describe your application. The AI generates entity models, state machine config, and gRPC scaffolding. Deploy to Cyoda Cloud or your own Kubernetes cluster.',
```
new:
```tsx
    title: 'Start at cyoda.dev, build in your IDE',
    description:
      'Self-host the open-source EDBMS, model entities and workflows in configuration, and run your business logic in your code via gRPC. The fully managed Cyoda Cloud is coming — join the waitlist.',
```

- [ ] **Step 3: `CyodaPathsSection.tsx`** (the "Cyoda Cloud" card ~:120-148):

old description: `Hosted Cyoda with a free evaluation tier. Managed control plane, your business logic runs in your code via gRPC.`
new description: `The fully managed Cyoda platform — coming soon. Managed control plane, your business logic runs in your code via gRPC.`

old link block:
```tsx
              <a
                href="https://ai.cyoda.net/"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                ai.cyoda.net
              </a>
```
new (add `import { Link } from 'react-router-dom';` if not present):
```tsx
              <Link
                to="/cloud"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Join the waitlist
              </Link>
```

- [ ] **Step 4: `AINativeSection.tsx`** (CTA paragraph ~:19-29). First read the whole file (34 lines) and confirm the section body describes the platform's AI-readiness (acceptable) rather than the live assistant; then replace the closing paragraph:

old:
```tsx
        <p className="mt-8 text-muted-foreground">
          <a
            href="https://ai.cyoda.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline underline-offset-2"
          >
            Start at ai.cyoda.net
          </a>{' '}
          and describe what you want to build.
        </p>
```
new (add the `Link` import if not present):
```tsx
        <p className="mt-8 text-muted-foreground">
          The fully managed Cyoda Cloud is on its way —{' '}
          <Link
            to="/cloud"
            className="text-primary hover:text-primary/80 underline underline-offset-2"
          >
            join the waitlist
          </Link>
          , or self-host today from{' '}
          <a
            href="https://cyoda.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline underline-offset-2"
          >
            cyoda.dev
          </a>
          .
        </p>
```
If the section body DOES make live-assistant claims, report it (DONE_WITH_CONCERNS) with the text — do not improvise larger rewrites.

- [ ] **Step 5: `DeveloperReliabilitySection.tsx`** (~:69-71):

old: `For the technical detail, the architecture is below. For a working prototype, go to <a href="https://ai.cyoda.net" ...>ai.cyoda.net</a>.`
new:
```tsx
            For the technical detail, the architecture is below. To build one yourself, start from{' '}
            <a href="https://cyoda.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline underline-offset-2">cyoda.dev</a>.
```

- [ ] **Step 6: Verify + commit**

Run: `npm run test:run && npm run typecheck && npm run build`, then `grep -n "ai.cyoda.net" src/components/` → no output.

```bash
git add src/components/ThreeStepSection.tsx src/components/PersonaSwitcher.tsx src/components/CyodaPathsSection.tsx src/components/AINativeSection.tsx src/components/DeveloperReliabilitySection.tsx
git commit -m "feat: homepage sections tell the OSS-on-ramp story; CTAs point at /cloud waitlist

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Pages — OSS-on-ramp rewrite

**Files:**
- Modify: `src/pages/Dev.tsx`
- Modify: `src/pages/Comparison.tsx`
- Modify: `src/pages/Support.tsx`
- Modify: `src/pages/UseCaseGovernedAiActions.tsx`
- Modify: `src/pages/About.tsx`

- [ ] **Step 1: `Dev.tsx`** (four spots):

(a) SEO description (~:70):
old: `Building with Cyoda? Start on the open-source project at cyoda.dev or try Cyoda Cloud free at ai.cyoda.net. Come to cyoda.com when you need commercial support.`
new: `Building with Cyoda? Start on the open-source project at cyoda.dev — the fully managed Cyoda Cloud is coming. Come to cyoda.com when you need commercial support.`

(b) The Cloud card in the paths array (~:28-35):
old:
```tsx
    description:
      "Free evaluation tier. Managed control plane. Your business logic runs in your code via gRPC.",
    link: { label: "Go to ai.cyoda.net", href: "https://ai.cyoda.net/" },
```
new:
```tsx
    description:
      "Fully managed Cyoda — coming soon. Managed control plane, your business logic runs in your code via gRPC.",
    link: { label: "Join the waitlist", href: "/cloud", internal: true },
```
(The Enterprise card already uses `internal: true` — the renderer supports it.)

(c) Both hero/footer CTA buttons (~:118-127 and ~:334-343):
old:
```tsx
              <a href="https://ai.cyoda.net/" rel="noopener noreferrer">
                Try Cyoda Cloud
              </a>
```
new (both occurrences; `Link` is already imported):
```tsx
              <Link to="/cloud">Join the Cloud waitlist</Link>
```

(d) The numbered step 2 (~:279-293):
old: the `<>Build or test on <a href="https://ai.cyoda.net/" ...>ai.cyoda.net</a></>` JSX fragment
new:
```tsx
                content:
                  "Build or test on your own infrastructure — or join the Cyoda Cloud waitlist for the managed platform.",
```

- [ ] **Step 2: `Comparison.tsx`** (closing CTA ~:195-211):

old paragraph: `Free tier available at ai.cyoda.net. No credit card required.`
new: `The fully managed Cyoda Cloud is coming. Join the waitlist for early access — or self-host the open-source platform today from cyoda.dev.`

old button:
```tsx
              <a
                href="https://ai.cyoda.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Start Evaluating for Free
              </a>
```
new (add `import { Link } from 'react-router-dom';` if not present):
```tsx
              <Link
                to="/cloud"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Join the Cyoda Cloud waitlist
              </Link>
```

- [ ] **Step 3: `Support.tsx`** (FAQ answer ~:81):

old: `Sign up for a free Cyoda Cloud account at ai.cyoda.net and try the AI Assistant. The documentation and how-to guides at docs.cyoda.net cover the underlying entity model.`
new: `Start with the open-source platform at cyoda.dev — the documentation and how-to guides at docs.cyoda.net cover the underlying entity model. The fully managed Cyoda Cloud is coming soon; join the waitlist at cyoda.com/cloud.`

Also scan the rest of Support.tsx for AI-assistant/generated-code claims tied to the hosted product (e.g. the "Can I export my code from Cyoda?" FAQ): if any other FAQ promises live hosted capability, report DONE_WITH_CONCERNS quoting it — do not rewrite beyond the spec'd line.

- [ ] **Step 4: `UseCaseGovernedAiActions.tsx`** (~:221):

old: `<a href="https://ai.cyoda.net">Start an evaluation</a>`
new: `<Link to="/cloud">Join the Cloud waitlist</Link>`
(`Link` is already imported — verify; the sibling button uses `<Link to="/contact">`.)

- [ ] **Step 5: `About.tsx`** (timeline ~:26): the 2025 entry is historical fact — keep the event, drop the dead pointer:

old: `{ year: '2025', event: 'Cyoda Cloud live beta launched (free tier at ai.cyoda.net)' },`
new: `{ year: '2025', event: 'Cyoda Cloud live beta launched' },`

- [ ] **Step 6: Verify + commit**

Run: `npm run test:run && npm run typecheck && npm run build`, then `grep -rn "ai.cyoda.net" src/` → **no output at all**.

```bash
git add src/pages/Dev.tsx src/pages/Comparison.tsx src/pages/Support.tsx src/pages/UseCaseGovernedAiActions.tsx src/pages/About.tsx
git commit -m "feat: pages adopt the OSS-on-ramp story; evaluations route to the /cloud waitlist

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: llms.txt + project docs

**Files:**
- Modify: `public/llms.txt` (3 occurrences)
- Modify: `CLAUDE.md`, `AGENTS.md`, `README.md`

- [ ] **Step 1: `public/llms.txt`** — grep for `ai.cyoda.net` (3 hits) and fix each:

(a) Core capabilities line:
old: `- Deploys on PostgreSQL (default), Cassandra (scale-out), or as managed service (ai.cyoda.net)`
new: `- Deploys on PostgreSQL (default), Cassandra (scale-out), or as a managed service (Cyoda Cloud — coming soon)`
(Adapt to the actual line text if it differs slightly; the rule is: managed-service mention survives, the live URL does not.)

(b) Web-estate line:
old: `- ai.cyoda.net — Cyoda Cloud. Hosted SaaS Cyoda. Free tier available.`
new: `- cyoda.com/cloud — Cyoda Cloud. Fully managed Cyoda platform, coming soon. Join the waitlist.`

(c) Any remaining occurrence: replace with `https://cyoda.com/cloud` waitlist phrasing following the same rule.

- [ ] **Step 2: `CLAUDE.md`** — two spots in the "Three-site context" section:

old bullet: `- **ai.cyoda.net** — Cyoda Cloud, hosted SaaS.`
new bullet: `- **cyoda.com/cloud** — Cyoda Cloud, fully managed platform (coming soon — waitlist page on this site).`

old convention line: `Convention: CTA buttons that go to \`cyoda.dev\` / \`ai.cyoda.net\` open in the **same tab**; only header/footer nav links to those properties use \`target="_blank"\`.`
new: `Convention: CTA buttons that go to \`cyoda.dev\` open in the **same tab**; only header/footer nav links to external Cyoda properties use \`target="_blank"\`. Cyoda Cloud links are internal (\`/cloud\` — the waitlist page).`

(Adapt old-string matching to the file's exact current text.)

- [ ] **Step 3: `AGENTS.md` and `README.md`** — grep each for `ai.cyoda.net` and apply the same two substitution patterns (estate description → cyoda.com/cloud coming-soon; CTA convention → cyoda.dev only). Quote-match the actual lines.

- [ ] **Step 4: Acceptance sweep + verify**

```bash
grep -rn "ai.cyoda.net" src/ public/ tests/ index.html CLAUDE.md AGENTS.md README.md docs/DESIGN.md docs/REQUIREMENTS.md docs/TASKS.md
```
Expected: **no output**. (`docs/superpowers/` and `docs/cyoda-go-paas-design.md` are exempt records — not in the sweep.)
Run: `npm run test:run && npm run typecheck`.

- [ ] **Step 5: Commit**

```bash
git add public/llms.txt CLAUDE.md AGENTS.md README.md
git commit -m "docs: estate descriptions point at the /cloud waitlist; ai.cyoda.net fully retired

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Full-pipeline verification

**Files:** none (verification only). NOTE: a zombie socket may hold port 4173 on this machine — use `PRERENDER_PORT=4175` if the default port fails.

- [ ] **Step 1: Gates**

```bash
npm run lint        # pre-existing failures only (17 errors in old test files on main) — no NEW errors
npm run typecheck
npm run test:run
rm -rf dist && npm run build:static     # now 26 routes (25 + /cloud)
```

- [ ] **Step 2: `/cloud` in the pipeline output**

```bash
grep -o '<title>[^<]*</title>' dist/cloud.html          # Cyoda Cloud — Coming Soon | Join the Waitlist
grep -c 'rel="canonical" href="https://cyoda.com/cloud"' dist/cloud.html   # 1
head -8 dist/cloud.md                                   # frontmatter + markdown sibling exists
grep -c 'cyoda.com/cloud' dist/sitemap.xml              # 1
grep -c 'Join the waitlist' dist/cloud.html             # >= 1 (form prerendered)
grep -rn 'ai.cyoda.net' dist --include='*.html' | grep -v 'docs/blogs'   # no output (blog post bodies are historical content — if a blog .md mentions it, report rather than edit)
```

- [ ] **Step 3: One real end-to-end submission** (the check automation can't do): start `npx vite preview --port 4175`, open `http://localhost:4175/cloud` in a real browser, submit the form with email `e2e-test@cyoda.com`, company `E2E TEST — delete me`. Confirm with Paul that the row arrived in the Google Form response sheet, then he deletes it. Kill the preview.

- [ ] **Step 4: Commit any stragglers; report**

`git status` must be clean (except the two pre-existing untracked hero SVGs). Report the branch state: `git log --oneline main..feat/prerender | head -30`.

---

## Spec-coverage checklist (self-review)

| Spec requirement | Task |
|---|---|
| `/cloud` route, prerender:true, SEO values, page structure (hero/inline form/4 cards/strip/star block), approved copy verbatim | 2 |
| `CloudWaitlistForm` as discrete swap boundary; Google Form POST, no-cors, fire-and-forget; honeypot + min-time silent fake success; email validation; success/error states; option strings byte-for-byte; consent-gated `waitlist_signup` via existing utils; unit tests | 1 (+3 predicate) |
| Nav: Header desktop+mobile internal Link + Soon badge; Footer swap | 4 |
| Category A mechanical: analytics/conversion utils + tests re-target; About estate mention | 3, 6 |
| Category B narrative (OSS-on-ramp, binding no-live-capability rule): ThreeStepSection, PersonaSwitcher, CyodaPathsSection, AINativeSection, DeveloperReliabilitySection, Dev, Comparison, Support, UseCaseGovernedAiActions | 5, 6 |
| llms.txt + CLAUDE/AGENTS/README estate + CTA convention | 7 |
| Acceptance: `grep -r ai.cyoda.net src/ public/ tests/` empty | 6 (src), 7 (full) |
| Pipeline: build:static green, cloud.html + cloud.md + sitemap entry | 8 |
| Manual real-submission check | 8 |
| Out of scope honored: no IdP work, no ai.cyoda.net shutdown, privacy-policy flagged not implemented | all |
