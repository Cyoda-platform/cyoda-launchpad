# Support Page FAQ Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the retired-era FAQ copy on `/support` with the eight approved Q&As and emit matching `FAQPage` JSON-LD from the same array.

**Architecture:** A new pure helper `faqPageSchema(faqs)` in `src/data/schemas.ts` maps the page's `faqs` array to schema.org `FAQPage` JSON-LD. `src/pages/Support.tsx` keeps its existing `{ question, answer }[]` array (single source of truth for both the visible Accordion and the structured data) and passes `[organizationSchema, faqPageSchema(faqs)]` to the existing `<SEO jsonLd>` prop, which already accepts arrays (`src/components/SEO.tsx:18`) and renders one `<script type="application/ld+json">` per entry. No other component changes.

**Tech Stack:** Vite + React 18 + TypeScript, Vitest (unit tests in `tests/unit/`), react-helmet-async via `src/components/SEO.tsx`, prerendering via `scripts/prerender.mjs` (`npm run build:static`).

**Spec:** `docs/superpowers/specs/2026-06-04-support-faq-rewrite-design.md` — read it before starting. Binding copy rule: nothing may promise live, self-serve hosted capability. The FAQ copy in Task 2 is approved verbatim — do not edit, "improve", or reflow the wording.

**Branch:** work happens on `feat/support-faq-rewrite` (already created; spec committed there).

---

### Task 1: `faqPageSchema` helper in `src/data/schemas.ts`

**Files:**
- Modify: `src/data/schemas.ts` (append after `organizationSchema`, which ends at line 71)
- Test: `tests/unit/data/schemas.test.ts` (new file; `tests/unit/data/` doesn't exist yet — creating the file creates the directory)

- [ ] **Step 1: Write the failing test**

Create `tests/unit/data/schemas.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { faqPageSchema } from '@/data/schemas';

describe('faqPageSchema', () => {
  const faqs = [
    { question: 'What is Cyoda?', answer: 'A platform.' },
    { question: 'Is there a hosted version of Cyoda?', answer: 'Coming soon.' },
  ];

  it('produces a schema.org FAQPage envelope', () => {
    const schema = faqPageSchema(faqs);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
  });

  it('maps each FAQ to a Question with an acceptedAnswer (Google rich-results shape)', () => {
    const schema = faqPageSchema(faqs);
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]).toEqual({
      '@type': 'Question',
      name: 'What is Cyoda?',
      acceptedAnswer: { '@type': 'Answer', text: 'A platform.' },
    });
    expect(schema.mainEntity[1].name).toBe('Is there a hosted version of Cyoda?');
    expect(schema.mainEntity[1].acceptedAnswer.text).toBe('Coming soon.');
  });

  it('preserves input order', () => {
    const schema = faqPageSchema(faqs);
    expect(schema.mainEntity.map((q) => q.name)).toEqual([
      'What is Cyoda?',
      'Is there a hosted version of Cyoda?',
    ]);
  });
});
```

Note: `@` resolves to `src/` (Vite/Vitest alias — see `vite.config.ts`). The existing unit tests use relative imports for scripts outside `src/`; for `src/` modules the alias is the established pattern.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/unit/data/schemas.test.ts`
Expected: FAIL — `SyntaxError`/import error: `faqPageSchema` is not exported by `src/data/schemas.ts`.

- [ ] **Step 3: Implement the helper**

Append to the end of `src/data/schemas.ts` (after `organizationSchema`). Double-quoted, quoted-key style matches the file's existing exports:

```ts
export const faqPageSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/unit/data/schemas.test.ts`
Expected: PASS — 3 tests.

- [ ] **Step 5: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/data/schemas.ts tests/unit/data/schemas.test.ts
git commit -m "feat(seo): add faqPageSchema helper for FAQPage JSON-LD

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Rewrite the `/support` FAQ copy and wire the JSON-LD

**Files:**
- Modify: `src/pages/Support.tsx` — import at line 4, `faqs` array at lines 77–108, `<SEO>` `jsonLd` prop at line 118. (Line numbers refer to the file before this task's edits.)

No new unit test: the page change is static copy plus prop wiring, exercised end-to-end by Task 3's prerender verification. The schema logic is already covered by Task 1's tests.

- [ ] **Step 1: Extend the schemas import**

In `src/pages/Support.tsx` replace line 4:

```ts
import { organizationSchema } from '@/data/schemas';
```

with:

```ts
import { organizationSchema, faqPageSchema } from '@/data/schemas';
```

- [ ] **Step 2: Replace the `faqs` array**

Replace the entire `const faqs = [ ... ];` block (lines 77–108) with exactly:

```ts
const faqs = [
  {
    question: 'What is Cyoda?',
    answer:
      'Cyoda is a platform for building stateful, data-driven backends where state transitions, auditability, and consistency under failure matter — corporate lending, KYC, trade settlement, claims adjudication, and similar regulated workloads.',
  },
  {
    question: 'How do I get started with Cyoda?',
    answer:
      "Start with the open-source platform at cyoda.dev — download it and run it yourself. The documentation at docs.cyoda.net covers the entity model, workflow design, and the APIs. If you're evaluating Cyoda for a regulated production deployment, contact the team directly.",
  },
  {
    question: 'Is there a hosted version of Cyoda?',
    answer:
      "Cyoda Cloud — a fully managed Cyoda platform — is coming soon. It isn't live yet; join the waitlist at cyoda.com/cloud for early access. In the meantime, the open-source platform at cyoda.dev is the self-serve way to run Cyoda.",
  },
  {
    question:
      "What's the difference between open-source Cyoda, Cyoda Cloud, and Enterprise Cyoda?",
    answer:
      'Open-source Cyoda (cyoda.dev) is self-hosted — you run and operate it yourself. Cyoda Cloud is the upcoming fully managed platform, currently waitlist-only. Enterprise Cyoda is the commercially supported offering for regulated production deployments. The difference is who operates the platform and what support stands behind it.',
  },
  {
    question: 'What languages can I build with?',
    answer:
      'Cyoda exposes HTTP and gRPC APIs, so application and compute code can be written in any language that speaks them.',
  },
  {
    question: 'How does Cyoda handle audit and compliance requirements?',
    answer:
      "Auditability is structural, not bolted on: every entity carries its complete state history by construction. For specific compliance requirements — SOC 2, GDPR, data residency — contact the team and we'll walk through how a supported deployment meets them.",
  },
  {
    question: 'Where do I go for help?',
    answer:
      'The Discord community is the fastest place for hands-on questions. The documentation at docs.cyoda.net covers guides and API reference. For architecture or commercial questions, contact the team directly.',
  },
  {
    question: 'Does Cyoda offer commercial support?',
    answer:
      'Yes. Enterprise Cyoda is the commercially supported path for production deployments — architecture reviews, deployment guidance, and ongoing support from the engineers who build the platform. Get in touch to discuss your requirements.',
  },
];
```

This copy is approved verbatim — transcribe it exactly (em-dashes, apostrophes, and all). Quote style for the strings follows the file's existing single-quote convention; strings containing apostrophes use double quotes, matching how ESLint/the file already handles them.

- [ ] **Step 3: Wire the FAQPage JSON-LD**

In the `<SEO>` element, replace:

```tsx
        jsonLd={organizationSchema}
```

with:

```tsx
        jsonLd={[organizationSchema, faqPageSchema(faqs)]}
```

- [ ] **Step 4: Typecheck, lint, full unit suite, build**

Run: `npm run typecheck && npm run lint && npm run test:run && npm run build`
Expected: all exit 0; no test regressions.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Support.tsx
git commit -m "feat(support): rewrite FAQ for current positioning, emit FAQPage JSON-LD

Replace the retired-era FAQs (generated code, AI assistant, live-cloud
SOC 2 claim) with eight evaluator-first Q&As matching the three-site
reality: cyoda.dev self-serve, Cyoda Cloud waitlist-only, enterprise
support via contact. The same faqs array now also feeds FAQPage
structured data alongside organizationSchema.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Prerender verification

**Files:** none modified — verification only, against freshly built output.

- [ ] **Step 1: Build static output**

Run: `npm run build:static`
(This is `VITE_SITE_ORIGIN=https://cyoda.com npm run build && npm run prerender` — see `package.json:13`. The prerender requires the build from the same invocation; do not reuse a stale `dist/`.)
Expected: exits 0; output lists prerendered routes including `/support`.

- [ ] **Step 2: Verify the FAQPage JSON-LD landed**

Run:

```bash
grep -c 'application/ld+json' dist/support.html
grep -o '"@type":"FAQPage"' dist/support.html
grep -c '"@type":"Question"' dist/support.html
```

Expected: ld+json count ≥ 2 (Organization + FAQPage); `"@type":"FAQPage"` present once; Question count line shows the JSON-LD contains 8 questions (grep -c counts lines, not occurrences — if the JSON-LD is minified onto one line, instead run `grep -o '"@type":"Question"' dist/support.html | wc -l` and expect 8).

- [ ] **Step 3: Verify new copy is present and retired-era copy is gone**

Run:

```bash
grep -o 'Is there a hosted version of Cyoda?' dist/support.html | head -1
for t in 'ai.cyoda.net' 'AI Assistant' 'generated code' 'free tier' 'operated to SOC 2'; do
  grep -q "$t" dist/support.html && echo "FAIL: found '$t'" || echo "OK: '$t' absent"
done
```

Expected: the new question prints once; all five retired-era terms report `OK: ... absent`. ("SOC 2" alone appearing in the Q6 answer is correct and expected — only the capability claim `operated to SOC 2` must be absent.)

- [ ] **Step 4: Spot-check the rendered page (optional but recommended)**

Run: `npm run dev` and open `http://localhost:8080/support` — confirm the accordion shows the eight new questions and expands/collapses normally. Stop the dev server afterwards.

- [ ] **Step 5: Final full check**

Run: `npm run build && npm run typecheck && npm run lint && npm run test:run`
Expected: all exit 0. Nothing further to commit in this task (dist/ is build output, not tracked).

---

## Out of scope (do not touch)

- Hero, channels, resources, and contact-CTA sections of `Support.tsx`
- `src/components/SEO.tsx` (array support already exists)
- Routes, sitemap, pricing/SLA content, any other page
