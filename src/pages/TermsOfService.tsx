import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Website Terms of Use"
        description="Terms of use for the cyoda.com website, operated by Cyoda Limited (UK). Covers acceptable use, intellectual property, disclaimers, and governing law."
        type="website"
      />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20 bg-gradient-to-br from-background via-card to-secondary/20 relative">
          <div className="absolute inset-0 texture-overlay opacity-30 no-print" />

          <div className="legal-container relative z-10">
            <div className="text-center legal-content-width">
              <h1 className="legal-hero-title mb-4 sm:mb-6 lg:mb-8">
                Website Terms of Use
              </h1>
              <p className="legal-hero-subtitle mb-4 sm:mb-6">
                Effective Date: June 6, 2026
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="legal-section-spacing relative">
          <div className="legal-container">
            <div className="legal-content-width legal-document">

              <p className="lead">
                These terms of use ("Terms") govern your access to and use of the website at{' '}
                <a href="https://cyoda.com" className="text-primary hover:underline">https://cyoda.com</a>{' '}
                (the "Site"). The Site is operated by Cyoda Limited ("Cyoda", "we", "us", or "our").
                By using the Site, you confirm that you accept these Terms and agree to comply with them.
                If you do not agree to these Terms, do not use the Site.
              </p>

              <h2>1. Who We Are</h2>
              <p>
                Cyoda Limited is a company registered in England and Wales under company number 09755017,
                with its registered office at 1 Darell Road, Richmond, London, TW9 4LF, United Kingdom.
                Our VAT registration number is GB314619905. You can contact us using the details in
                Section 14 below.
              </p>

              <h2>2. Changes to These Terms</h2>
              <p>
                We may revise these Terms at any time by amending this page. The "Effective Date" above
                indicates when these Terms were last updated. Please check this page from time to time,
                as the version in force at the time you use the Site is the version that applies.
              </p>

              <h2>3. Changes to the Site</h2>
              <p>
                We may update and change the Site and its content at any time and without notice. The Site
                is made available free of charge. We do not guarantee that the Site, or any content on it,
                will always be available, uninterrupted, or error-free, and we may suspend, withdraw, or
                restrict the availability of all or any part of the Site for business or operational reasons.
              </p>

              <h2>4. Acceptable Use</h2>
              <p>You may use the Site only for lawful purposes. You agree not to:</p>
              <ul>
                <li>Use the Site in any way that breaches applicable local, national, or international law or regulation.</li>
                <li>Use the Site in any way that is fraudulent or has any fraudulent or harmful purpose or effect.</li>
                <li>Knowingly transmit any data or material that contains viruses or any other harmful programs or code.</li>
                <li>Attempt to gain unauthorised access to the Site, the server on which it is hosted, or any server, computer, or database connected to it.</li>
                <li>Attack the Site via a denial-of-service attack or similar, or otherwise interfere with or disrupt its integrity or performance.</li>
                <li>Use automated systems to access the Site in a manner that sends more requests than a human could reasonably produce, except for reasonable use of search engine crawlers, AI agents, and similar tools accessing publicly available content.</li>
              </ul>

              <h2>5. Your Submissions</h2>
              <p>
                The Site includes forms through which you can contact us or register interest in future
                products (for example, the Cyoda Cloud waitlist). Personal data you submit through the Site
                is handled as described in our Privacy Policy. You confirm that any information you submit
                is accurate and that you are entitled to provide it, and you must not submit any material
                that is unlawful, infringing, or harmful. We may use your submissions to respond to you and
                to provide what you have requested (for example, contacting you about a waitlist place).
              </p>

              <h2>6. Intellectual Property</h2>
              <p>
                Unless otherwise stated, we are the owner or licensee of all intellectual property rights in
                the Site and in the material published on it, including text, graphics, logos, and software.
                Those works are protected by copyright and other intellectual property laws and treaties
                around the world. All such rights are reserved.
              </p>
              <p>
                You may view, download, and print pages or content from the Site for your personal or
                internal business use, provided you do not modify the materials and do not remove any
                copyright or other proprietary notices. You must not use any part of the content on the Site
                for commercial purposes without obtaining a licence to do so from us. Nothing in this section
                restricts any use permitted by applicable law (for example, fair dealing for the purposes of
                criticism, review, or quotation).
              </p>
              <p>
                Nothing in these Terms grants you any rights to use Cyoda's trademarks, logos, or domain
                names. Open-source Cyoda software is made available separately (for example via our public
                repositories) and is governed by the open-source licence accompanying that software, not by
                these Terms.
              </p>

              <h2>7. Information on the Site Is Not Advice</h2>
              <p>
                The content on the Site, including blog posts, comparisons, and technical documentation, is
                provided for general information only. It is not intended to amount to advice on which you
                should rely. You must obtain professional or specialist advice before taking, or refraining
                from, any action on the basis of the content on the Site. Although we make reasonable efforts
                to keep the information on the Site up to date, we make no representations, warranties, or
                guarantees, whether express or implied, that the content is accurate, complete, or current.
              </p>

              <h2>8. Third-Party Links</h2>
              <p>
                Where the Site contains links to other sites and resources provided by third parties, these
                links are provided for your information only. Such links should not be interpreted as approval
                by us of those linked websites or of any information you may obtain from them. We have no
                control over the contents of those sites or resources.
              </p>

              <h2>9. Privacy and Cookies</h2>
              <p>
                Our{' '}
                <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>{' '}
                describes how we collect and use personal data in connection with the Site, and our{' '}
                <a href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</a>{' '}
                describes the cookies the Site uses. Our use of non-essential cookies is based on the consent
                you give or refuse through the cookie banner on the Site, as described in the Cookie Policy.
                By using the Site, you acknowledge the Privacy Policy and the Cookie Policy.
              </p>

              <h2>10. Disclaimer and Limitation of Liability</h2>
              <p>
                Nothing in these Terms excludes or limits our liability for death or personal injury arising
                from our negligence, for fraud or fraudulent misrepresentation, or for any other liability
                that cannot be excluded or limited under the law of England and Wales. If you are a consumer,
                nothing in these Terms affects your statutory rights.
              </p>
              <p>
                The Site is provided free of charge for general information. To the fullest extent permitted
                by applicable law, we exclude all conditions, warranties, and other terms that may be implied
                into these Terms by statute or common law, and we do not guarantee that the Site will be
                secure or free from bugs or viruses. You are responsible for configuring your own technology
                to access the Site and should use your own virus protection software.
              </p>
              <p>
                <strong>If you are a business user:</strong> we will not be liable to you for any loss or
                damage, whether in contract, tort (including negligence), breach of statutory duty, or
                otherwise, even if foreseeable, arising under or in connection with your use of (or inability
                to use) the Site or your reliance on any content on it. In particular, we will not be liable
                for loss of profits, sales, business, or revenue; business interruption; loss of anticipated
                savings; loss of business opportunity, goodwill, or reputation; or any indirect or
                consequential loss or damage.
              </p>
              <p>
                <strong>If you are a consumer:</strong> you agree to use the Site only for domestic and
                private purposes, and we will not be liable to you for any loss of profit, loss of business,
                business interruption, or loss of business opportunity. We are responsible only for loss or
                damage you suffer that is a foreseeable result of our breach of these Terms or our failure to
                use reasonable care and skill.
              </p>

              <h2>11. Products and Services</h2>
              <p>
                These Terms govern use of the Site only. They do not govern the supply of any Cyoda product
                or service. Any current or future Cyoda products or services — including any managed cloud
                offering — will be governed by separate terms made available when you register for or
                purchase that product or service.
              </p>

              <h2>12. General</h2>
              <ul>
                <li>
                  <strong>Severability:</strong> Each section of these Terms operates separately. If any court
                  or competent authority decides that any of them is unlawful or unenforceable, the remaining
                  sections will remain in full force and effect.
                </li>
                <li>
                  <strong>No waiver:</strong> If we fail to insist that you perform any of your obligations
                  under these Terms, or if we do not enforce our rights against you, or delay in doing so,
                  that will not mean that we have waived our rights against you.
                </li>
                <li>
                  <strong>Third-party rights:</strong> These Terms are between you and us. No other person has
                  any rights under the Contracts (Rights of Third Parties) Act 1999 to enforce any of these
                  Terms.
                </li>
              </ul>

              <h2>13. Governing Law and Jurisdiction</h2>
              <p>
                These Terms, their subject matter, and their formation (and any non-contractual disputes or
                claims) are governed by the law of England and Wales. If you are a business, you and we agree
                that the courts of England and Wales will have exclusive jurisdiction. If you are a consumer,
                you may also bring proceedings in the courts of the part of the United Kingdom in which you
                live.
              </p>

              <h2>14. Contact</h2>
              <p>
                If you have any questions about these Terms, please contact us using the details below or via
                our <a href="/contact" className="text-primary hover:underline">contact form</a>.
              </p>

              <div className="legal-card page-break-inside-avoid">
                <p className="mb-2 sm:mb-3"><strong>Cyoda Limited</strong></p>
                <p className="mb-2 sm:mb-3">Company number 09755017 (England and Wales)</p>
                <p className="mb-2 sm:mb-3">VAT registration number: GB314619905</p>
                <p className="mb-2 sm:mb-3">1 Darell Road, Richmond, London, TW9 4LF, United Kingdom</p>
                <p className="mb-2 sm:mb-3">Email: <a href="mailto:info@cyoda.com" className="text-primary hover:underline">info@cyoda.com</a></p>
                <p>Website: <a href="https://cyoda.com" className="text-primary hover:underline">https://cyoda.com</a></p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
