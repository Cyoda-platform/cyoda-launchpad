# Support Page FAQ Rewrite — Design

**Date:** 2026-06-04
**Status:** Approved
**Scope:** `/support` FAQ section — `src/pages/Support.tsx` (`faqs` array) + new `FAQPage` JSON-LD helper in `src/data/schemas.ts`.

## Background

cyoda.com retired all references to the old hosted SaaS (ai.cyoda.net). The existing
/support FAQs date from that era — AI assistant, generated code, free tier — and several
are now untrue. They are replaced wholesale, not salvaged.

Current reality the copy must reflect:

- **cyoda.dev** — open-source platform, the self-serve path (download, run yourself).
- **docs.cyoda.net** — documentation.
- **Cyoda Cloud** — fully managed platform, **unlaunched**, waitlist-only at `/cloud`.
- **cyoda.com** (this site) — Enterprise Cyoda, the commercially supported offer.

**Binding copy rule:** nothing may promise live, self-serve hosted capability.

## Decisions (from brainstorming)

1. **Audience:** mixed, evaluator-first. The FAQ doubles as orientation for the
   three-site split, then covers practical support questions.
2. **Commercial questions:** acknowledge commercial support exists and defer to
   `/contact`. No tiers, SLAs, or pricing invented.
3. **Legacy:** no mention of ai.cyoda.net or the retired product. Present today's
   reality only; "Is there a hosted version?" answers the underlying question.
4. **Scope:** rewrite the `faqs` array **and** add `FAQPage` JSON-LD built from the
   same array (single source of truth).
5. **Framing:** evaluation-journey order — what is it → how do I try it → hosted? →
   which option fits → languages → compliance → help channels → commercial support.

## The FAQ set (final copy)

1. **What is Cyoda?**
   > Cyoda is a platform for building stateful, data-driven backends where state transitions, auditability, and consistency under failure matter — corporate lending, KYC, trade settlement, claims adjudication, and similar regulated workloads.

2. **How do I get started with Cyoda?**
   > Start with the open-source platform at cyoda.dev — download it and run it yourself. The documentation at docs.cyoda.net covers the entity model, workflow design, and the APIs. If you're evaluating Cyoda for a regulated production deployment, contact the team directly.

3. **Is there a hosted version of Cyoda?**
   > Cyoda Cloud — a fully managed Cyoda platform — is coming soon. It isn't live yet; join the waitlist at cyoda.com/cloud for early access. In the meantime, the open-source platform at cyoda.dev is the self-serve way to run Cyoda.

4. **What's the difference between open-source Cyoda, Cyoda Cloud, and Enterprise Cyoda?**
   > Open-source Cyoda (cyoda.dev) is self-hosted — you run and operate it yourself. Cyoda Cloud is the upcoming fully managed platform, currently waitlist-only. Enterprise Cyoda is the commercially supported offering for regulated production deployments. The difference is who operates the platform and what support stands behind it.

5. **What languages can I build with?**
   > Cyoda exposes HTTP and gRPC APIs, so application and compute code can be written in any language that speaks them.

   *(API claim confirmed by Paul, 2026-06-04.)*

6. **How does Cyoda handle audit and compliance requirements?**
   > Auditability is structural, not bolted on: every entity carries its complete state history by construction. For specific compliance requirements — SOC 2, GDPR, data residency — contact the team and we'll walk through how a supported deployment meets them.

   *(Deliberately makes no certification claims; the retired FAQ's "Cyoda Cloud is operated to SOC 2 standards" is exactly the live-capability claim that is now banned.)*

7. **Where do I go for help?**
   > The Discord community is the fastest place for hands-on questions. The documentation at docs.cyoda.net covers guides and API reference. For architecture or commercial questions, contact the team directly.

8. **Does Cyoda offer commercial support?**
   > Yes. Enterprise Cyoda is the commercially supported path for production deployments — architecture reviews, deployment guidance, and ongoing support from the engineers who build the platform. Get in touch to discuss your requirements.

Copy properties: one paragraph per answer; site references (cyoda.dev, docs.cyoda.net,
cyoda.com/cloud) remain plain text, as in the current FAQ; Q3 and Q6 are where the
binding rule bites and both defer to waitlist/contact.

## Implementation

### `src/data/schemas.ts`

Add a helper alongside `organizationSchema` and the breadcrumb builders:

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

(Double-quoted, quoted-key style matches the existing exports in `schemas.ts`.)

### `src/pages/Support.tsx`

- Extend the schemas import to
  `import { organizationSchema, faqPageSchema } from '@/data/schemas';`.
- Replace the `faqs` array contents with the eight Q&As above. Same shape
  (`{ question, answer }`, plain strings) — the Accordion rendering is untouched.
- Pass both schemas to the page's `<SEO>`:
  `jsonLd={[organizationSchema, faqPageSchema(faqs)]}`.
  `SEO.tsx` already accepts `object | object[]` (verified, `src/components/SEO.tsx:18`)
  and renders one `<script type="application/ld+json">` per entry — no component change.

### Out of scope

- The hero, channels, resources, and contact-CTA sections of `/support` are unchanged.
- No new routes, no `SEO.tsx` changes, no pricing/SLA content anywhere.

## Verification

- `npm run build && npm run typecheck && npm run lint` pass.
- Prerendered output (`npm run build:static`) → `dist/support.html` contains the new
  copy and a `FAQPage` JSON-LD block where each `Question` has `name` and
  `acceptedAnswer.text` (Google rich-results shape).
- Grep `dist/support.html` for retired-era terms (`ai.cyoda.net`, `AI Assistant`,
  `generated code`, `free tier`, `operated to SOC 2`) — none present. Note: "SOC 2"
  alone is fine; Q6 names it as a topic without claiming certification. The grep must
  run against **freshly built** output — the existing `dist/` predates the rewrite and
  still contains old-era copy.
