import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Cookie Policy (EU)"
        description="Learn about how Cyoda uses cookies and other related technologies on our website. This policy covers our cookie usage, your rights, and how to manage your preferences."
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
                Cookie Policy (EU)
              </h1>
              <p className="legal-hero-subtitle mb-2 sm:mb-4">
                Last updated: March 31, 2024
              </p>
              <p className="legal-hero-subtitle mt-2 sm:mt-4 leading-relaxed">
                Applies to citizens and legal permanent residents of the European Economic Area and Switzerland
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="legal-section-spacing relative">
          <div className="legal-container">
            <div className="legal-content-width legal-document">

              <h2>1. Introduction</h2>
              <p>
                Our website, <a href="https://cyoda.com" className="text-primary hover:underline">https://cyoda.com</a> (hereinafter: "the website") uses cookies and other related technologies (for convenience all technologies are referred to as "cookies"). Cookies are also placed by third parties we have engaged. In the document below we inform you about the use of cookies on our website.
              </p>

              <h2>2. What are cookies?</h2>
              <p>
                A cookie is a small simple file that is sent along with pages of this website and stored by your browser on the hard drive of your computer or another device. The information stored therein may be returned to our servers or to the servers of the relevant third parties during a subsequent visit.
              </p>

              <h2>3. What are scripts?</h2>
              <p>
                A script is a piece of program code that is used to make our website function properly and interactively. This code is executed on our server or on your device.
              </p>

              <h2>4. What is a web beacon?</h2>
              <p>
                A web beacon (or a pixel tag) is a small, invisible piece of text or image on a website that is used to monitor traffic on a website. In order to do this, various data about you is stored using web beacons.
              </p>

              <h2>5. Cookies</h2>

              <h3>5.1 Technical or functional cookies</h3>
              <p>
                Some cookies ensure that certain parts of the website work properly and that your user preferences remain known. By placing functional cookies, we make it easier for you to visit our website. This way, you do not need to repeatedly enter the same information when visiting our website and, for example, the items remain in your shopping cart until you have paid. We may place these cookies without your consent.
              </p>

              <h3>5.2 Marketing/Tracking cookies</h3>
              <p>
                Marketing/Tracking cookies are cookies or any other form of local storage, used to create user profiles to display advertising or to track the user on this website or across several websites for similar marketing purposes.
              </p>

              <h2>6. Placed cookies</h2>

              <h3>6.1 Essential cookies</h3>
              <p>These are necessary for the website to function properly. Always On.</p>

              <h3>6.2 Analytics cookies</h3>
              <p>Measures usage and improves your experience. (e.g., Google Analytics).</p>

              <h3>6.3 Marketing cookies</h3>
              <p>These may be used to deliver personalized ads and track effectiveness across websites (e.g., Facebook Pixel, Google Ads).</p>

              <h3>6.4 Personalization</h3>
              <p>Remembers your preferences and provides enhanced features.</p>

              <h2>7. Consent</h2>
              <p>
                When you visit our website for the first time, we will show you a pop-up with an explanation about cookies. As soon as you click on "Save preferences", you consent to us using the categories of cookies and plug-ins you selected in the pop-up, as described in this Cookie Policy. You can disable the use of cookies via your browser, but please note that our website may no longer work properly.
              </p>

              <h3>7.1 Manage your consent settings</h3>
              <p>
                You can update your cookie settings at any time by clicking on the Cookie Preferences in the footer.
              </p>

              <h2>8. Enabling/disabling and deleting cookies</h2>
              <p>
                You can use your internet browser to automatically or manually delete cookies. You can also specify that certain cookies may not be placed. Another option is to change the settings of your internet browser so that you receive a message each time a cookie is placed. For more information about these options, please refer to the instructions in the Help section of your browser.
              </p>
              <p>
                Please note that our website may not work properly if all cookies are disabled. If you do delete the cookies in your browser, they will be placed again after your consent when you visit our website again.
              </p>

              <h2>9. Your rights with respect to personal data</h2>
              <p>You have the following rights with respect to your personal data:</p>
              <ul>
                <li>You have the right to know why your personal data is needed, what will happen to it, and how long it will be retained for.</li>
                <li><strong>Right of access:</strong> You have the right to access your personal data that is known to us.</li>
                <li><strong>Right to rectification:</strong> You have the right to supplement, correct, have deleted or blocked your personal data whenever you wish.</li>
                <li>If you give us your consent to process your data, you have the right to revoke that consent and to have your personal data deleted.</li>
                <li><strong>Right to transfer your data:</strong> You have the right to request all your personal data from the controller and transfer it in its entirety to another controller.</li>
                <li><strong>Right to object:</strong> You may object to the processing of your data. We comply with this, unless there are justified grounds for processing.</li>
              </ul>
              <p>
                To exercise these rights, please contact us. Please refer to the contact details at the bottom of this Cookie Policy. If you have a complaint about how we handle your data, we would like to hear from you, but you also have the right to submit a complaint to the supervisory authority (the Data Protection Authority).
              </p>

              <h2>10. Contact details</h2>
              <p>For questions and/or comments about our Cookie Policy and this statement, please contact us by using the following contact details:</p>
              <div className="legal-card page-break-inside-avoid">
                <p className="mb-2 sm:mb-3"><strong>Cyoda</strong></p>
                <p className="mb-2 sm:mb-3">1 Darell Road, Richmond, TW9 4LF, UK</p>
                <p className="mb-2 sm:mb-3">United Kingdom</p>
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

export default CookiePolicy;
