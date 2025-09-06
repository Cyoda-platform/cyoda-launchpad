import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Alpha/Beta Terms of Service"
        description="Terms of Service for Cyoda's alpha and beta versions. Learn about your rights and responsibilities when using our experimental services."
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
                Alpha/Beta Terms of Service
              </h1>
              <p className="legal-hero-subtitle mb-4 sm:mb-6">
                Effective Date: June 2, 2025
              </p>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 sm:p-6 lg:p-8 mt-6 sm:mt-8 text-left page-break-inside-avoid">
                <p className="text-sm sm:text-base font-medium text-yellow-200 mb-2 sm:mb-3">IMPORTANT NOTICE</p>
                <p className="text-sm sm:text-base text-yellow-100 leading-relaxed">
                  PLEASE READ THESE TERMS OF SERVICE CAREFULLY. BY ACCESSING OR USING THE SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE TO ALL OF THESE TERMS, DO NOT ACCESS OR USE THE SERVICES.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="legal-section-spacing relative">
          <div className="legal-container">
            <div className="legal-content-width legal-document">
              
              <p className="lead">
                Welcome to Cyoda! These Terms of Service ("Terms") govern your access to and use of the alpha or beta versions (the "Alpha/Beta Period") of Cyoda's products and services, including the Cyoda Cloud, Cyoda Platform, and AI Assistant (collectively, the "Services"). These Services are provided by Cyoda Limited, a company registered in the United Kingdom ("Cyoda", "we", "us", or "our").
              </p>
              <p>
                These Terms constitute a legally binding agreement between you ("User", "you", or "your") and Cyoda.
              </p>

              <h2>1. Definitions</h2>
              <div className="space-y-4">
                <div className="bg-card/20 backdrop-blur border border-border/50 p-4 rounded-lg">
                  <p><strong>AI Assistant:</strong> Cyoda's artificial intelligence tool designed to assist users in building applications, accessed via a cloud-hosted interface provided by Cyoda.</p>
                </div>
                <div className="bg-card/20 backdrop-blur border border-border/50 p-4 rounded-lg">
                  <p><strong>Alpha/Beta Period:</strong> The current experimental phase during which the Services are offered for testing and feedback purposes before a general commercial release.</p>
                </div>
                <div className="bg-card/20 backdrop-blur border border-border/50 p-4 rounded-lg">
                  <p><strong>Cyoda Cloud:</strong> The managed cloud environment provided by Cyoda where users can host applications built on the Cyoda Platform.</p>
                </div>
                <div className="bg-card/20 backdrop-blur border border-border/50 p-4 rounded-lg">
                  <p><strong>Services:</strong> Collectively, the Cyoda Cloud, Cyoda Platform, and AI Assistant as offered during the Alpha/Beta Period.</p>
                </div>
              </div>

              <h2>2. Acceptance of Terms</h2>
              <p>
                By creating an account, accessing, or using any part of the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you are using the Services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms, and "you" and "your" will refer to that organization.
              </p>

              <h2>3. Scope of Services & Alpha/Beta Nature</h2>
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 my-6">
                <h3 className="text-red-200 mt-0">Important Alpha/Beta Limitations</h3>
                <ul className="text-red-100 space-y-2">
                  <li><strong>Experimental Services:</strong> You acknowledge that the Services are provided during an Alpha/Beta Period and are experimental, pre-release versions. They may contain bugs, errors, and defects, and may not operate correctly or continuously.</li>
                  <li><strong>"AS IS" and "AS AVAILABLE":</strong> The Services are provided strictly on an "AS IS" and "AS AVAILABLE" basis, without any warranties or representations of any kind, express or implied.</li>
                  <li><strong>No Service Level Agreement (SLA):</strong> Cyoda provides NO SERVICE LEVEL AGREEMENT (SLA) during the Alpha/Beta Period.</li>
                  <li><strong>Not for Production Use:</strong> The Services, in their current Alpha/Beta state, are NOT INTENDED OR WARRANTED FOR PRODUCTION USE.</li>
                </ul>
              </div>

              <h2>4. Account Registration and Eligibility</h2>
              <ul>
                <li><strong>Account Requirement:</strong> While contributing to Cyoda's open-source repositories may not require an account, accessing and using the Cyoda Platform to run applications requires you to register for an account.</li>
                <li><strong>Accurate Information:</strong> You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</li>
                <li><strong>Account Security:</strong> You are responsible for safeguarding your account password and for any activities or actions under your account.</li>
                <li><strong>Eligibility:</strong> You must have the legal capacity to enter into a binding agreement to use the Services.</li>
              </ul>

              <h2>5. Use Rights and Restrictions</h2>
              <h3>Limited License</h3>
              <p>
                Subject to your compliance with these Terms, Cyoda grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Services during the Alpha/Beta Period solely for internal evaluation and testing purposes.
              </p>
              
              <h3>Prohibited Uses</h3>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Services for any illegal, harmful, or fraudulent activities.</li>
                <li>Reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code or underlying ideas or algorithms of the non-open-source components of the Services.</li>
                <li>Conduct performance testing, benchmarking, or vulnerability scanning on the Services without prior written consent from Cyoda.</li>
                <li>Use the Services in a manner that infringes upon the intellectual property rights of Cyoda or any third party.</li>
                <li>Interfere with or disrupt the integrity or performance of the Services or the data contained therein.</li>
                <li>Attempt to gain unauthorized access to the Services or their related systems or networks.</li>
                <li>Use the Services for any production or commercial purposes during the Alpha/Beta period without explicit written agreement from Cyoda.</li>
              </ul>

              <h2>6. User Content Data Management</h2>
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6 my-6">
                <h3 className="text-blue-200 mt-0">Data We Use for AI Assistant Improvement</h3>
                <p className="text-blue-100">
                  To continuously develop, improve, and enhance the functionality, accuracy, safety, and overall performance of Our AI Assistant, Cyoda may use:
                </p>
                <ul className="text-blue-100">
                  <li><strong>User Input Prompts:</strong> We may use Your User Input Prompts to understand user needs and refine the AI Assistant's ability to generate relevant and accurate responses.</li>
                  <li><strong>AI-Generated Code:</strong> We may use the AI-Generated Code produced by Our AI Assistant to further teach, train, evaluate, and improve the AI Assistant.</li>
                  <li><strong>Open Source Repository Contributions:</strong> If You voluntarily contribute to our designated open-source repositories, we may use these contributions for AI Assistant Improvement.</li>
                </ul>
              </div>

              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 my-6">
                <h3 className="text-green-200 mt-0">Data We Do Not Access or Use</h3>
                <p className="text-green-100">
                  <strong>User Application Data in Your Running System:</strong> Cyoda will not retrieve, copy, or use Your User Application Data that is located, stored, and managed within Your Running System for the purposes of AI Assistant Improvement, or for training, fine-tuning, or evaluating any of Cyoda's AI models or algorithms.
                </p>
              </div>

              <h2>7. Intellectual Property</h2>
              <p>
                Except for the limited license granted in Section 5, Cyoda and its licensors retain all right, title, and interest in and to the Services, including all related intellectual property rights. These Terms do not grant you any rights to use Cyoda's trademarks, logos, domain names, or other brand features.
              </p>

              <h2>8. Disclaimers of Warranties</h2>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6 my-6">
                <p className="text-yellow-100 font-medium">
                  THE SERVICES ARE PROVIDED "AS IS," "AS AVAILABLE," AND WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CYODA EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT.
                </p>
              </div>

              <h2>9. Limitation of Liability</h2>
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 my-6">
                <p className="text-red-100 font-medium">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL CYODA, ITS AFFILIATES, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE OF, OR INABILITY TO ACCESS OR USE, THE SERVICES DURING THE ALPHA/BETA PERIOD.
                </p>
                <p className="text-red-100 mt-4">
                  <strong>CYODA'S TOTAL CUMULATIVE LIABILITY TO YOU FOR ANY AND ALL CLAIMS ARISING FROM OR RELATING TO THESE TERMS OR YOUR USE OF THE SERVICES DURING THE ALPHA/BETA PERIOD SHALL NOT EXCEED TEN POUNDS STERLING (£10.00 GBP).</strong>
                </p>
              </div>

              <h2>12. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms and any dispute or claim arising out of or in connection with them or their subject matter or formation (including non-contractual disputes or claims) shall be governed by and construed in accordance with the laws of England and Wales, without giving effect to any choice or conflict of law provision or rule.
              </p>
              <p>
                Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Services shall be instituted exclusively in the courts of England and Wales. You waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.
              </p>

              <h2>14. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact Cyoda.</p>
              
              <div className="legal-card page-break-inside-avoid">
                <p className="mb-2 sm:mb-3"><strong>Cyoda Limited</strong></p>
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

export default TermsOfService;
