import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SiLinkedin } from 'react-icons/si';

interface ContactFormData {
  name: string;
  company: string;
  email: string;
  message: string;
  referral?: string;
}

const referralOptions = [
  'LinkedIn',
  'Blog post',
  'Google search',
  'Word of mouth',
  'GitHub',
  'Conference/event',
  'Other',
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [referral, setReferral] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    console.log({ ...data, referral });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact | Cyoda"
        description="Talk to the Cyoda team about your use case. We respond within one business day."
        url="https://cyoda.com/contact"
        type="website"
        jsonLd={organizationSchema}
      />
      <Header />
      <main>
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl mb-12">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                CONTACT
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Talk to the Team
              </h1>
              <p className="text-lg text-muted-foreground">
                Tell us about your use case and we'll get back to you within one business day.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {/* Form column */}
              <div className="md:col-span-2">
                {submitted ? (
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
                    <p className="text-lg font-semibold text-foreground">
                      Thanks — we'll be in touch within one business day.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        {...register('name', { required: 'Name is required' })}
                        aria-invalid={!!errors.name}
                        className="focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                      <Label htmlFor="company">Company <span className="text-destructive">*</span></Label>
                      <Input
                        id="company"
                        placeholder="Your company name"
                        {...register('company', { required: 'Company is required' })}
                        aria-invalid={!!errors.company}
                        className="focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      {errors.company && (
                        <p className="text-sm text-destructive">{errors.company.message}</p>
                      )}
                    </div>

                    {/* Work Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email <span className="text-destructive">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        {...register('email', {
                          required: 'Work email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Please enter a valid email address',
                          },
                        })}
                        aria-invalid={!!errors.email}
                        className="focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your use case…"
                        rows={5}
                        {...register('message', { required: 'Message is required' })}
                        aria-invalid={!!errors.message}
                        className="focus-visible:ring-2 focus-visible:ring-primary resize-y"
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive">{errors.message.message}</p>
                      )}
                    </div>

                    {/* How did you hear about us — optional */}
                    <div className="space-y-2">
                      <Label htmlFor="referral">How did you hear about us?</Label>
                      <Select onValueChange={setReferral} value={referral}>
                        <SelectTrigger
                          id="referral"
                          className="focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <SelectValue placeholder="Select an option (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {referralOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="bg-primary text-primary-foreground px-8 font-semibold focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Send Message
                    </Button>
                  </form>
                )}
              </div>

              {/* Contact info column */}
              <div className="space-y-6">
                <div>
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mb-4">
                    PS
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">Patrick Stanton</h3>
                  <p className="text-sm text-primary mb-3">CEO & Co-Founder</p>
                  <a
                    href="https://www.linkedin.com/in/patrick-stanton-cyoda/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    <SiLinkedin className="w-4 h-4" />
                    Connect on LinkedIn
                  </a>
                </div>

                <div className="border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Used in production in the European private-debt market since 2017. We
                    understand the problems you're solving.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
