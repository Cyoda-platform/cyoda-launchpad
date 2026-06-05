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
