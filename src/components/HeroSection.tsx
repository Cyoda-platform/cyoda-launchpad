import { useState, useRef, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from 'next-themes';
import { useTypewriter } from '@/hooks/use-typewriter';
import { heroPhrases } from '@/data/HeroPhrases';
import { Sparkles } from 'lucide-react';
import heroBackgroundDark from '@/assets/hero-bg.jpg';
import heroBackgroundLight from '@/assets/hero-bg-lm.png';

const HeroSection = () => {
  const { theme } = useTheme();
  const prebakedExamples = [
    {
      name: "Order & Inventory Tracking",
      prompt: "Build an order and inventory tracking service for a multi-channel retailer. Capture structured orders, track product stock levels, manage fulfilment, and provide audit and reporting.\n" +
          "\n" +
          "Primary entity: Order\n" +
          "\t•\tIdentifiers: orderId, externalRef, channel (web, store, marketplace), createdTimestamp, status.\n" +
          "\t•\tCustomer: {customerId, name, contactDetails, addresses[]}\n" +
          "\t•\tLineItems: array of {productId, description, quantity, unitPrice, discount, tax, fulfilmentStatus}.\n" +
          "\t•\tPayments: {method, amount, currency, transactionRef, status, timestamps}.\n" +
          "\t•\tShipments: {shipmentId, carrier, serviceLevel, trackingNumber, estimatedDelivery, events[]}.\n" +
          "\t•\tState: {Draft, Submitted, Paid, Packed, Shipped, Delivered, Cancelled, Returned}.\n" +
          "\n" +
          "Secondary entity: InventoryItem\n" +
          "\t•\tproductId, sku, description, attributes {size, colour, batch, expiryDate}.\n" +
          "\t•\tstockByLocation: {locationId, available, reserved, damaged}.\n" +
          "\t•\treorderPoint, reorderQuantity, supplierRef.\n" +
          "\t•\tauditLog of adjustments {reason, actor, delta, timestamp}.\n" +
          "\n" +
          "Workflow:\n" +
          "\t•\tDraft → Submitted when mandatory fields and line items exist.\n" +
          "\t•\tSubmitted → Paid once payment status confirmed.\n" +
          "\t•\tPaid → Packed triggers inventory reservation, stock deduction, and fulfilment task.\n" +
          "\t•\tPacked → Shipped with carrier/tracking assignment.\n" +
          "\t•\tShipped → Delivered on carrier confirmation.\n" +
          "\t•\tAny → Cancelled/Returned with reason codes; inventory auto-adjusted.\n" +
          "\t•\tSLA timers: escalate if Packed but not Shipped > 24h.\n" +
          "\n" +
          "Validations & checks:\n" +
          "\t•\tOrder total = sum(lineItems × unitPrice − discounts + tax).\n" +
          "\t•\tInventoryItem availability must cover reserved quantities; prevent overselling.\n" +
          "\t•\tStock adjustments logged immutably with who/what/when.\n" +
          "\t•\tLocation-level checks: negative stock disallowed; expiry-dated items tracked.\n" +
          "\t•\tDuplicate order prevention by externalRef + channel.\n" +
          "\n" +
          "APIs & reports:\n" +
          "\t•\tCreate/Update Order; adjust Inventory; post shipment events; query stock.\n" +
          "\t•\tWebhooks on order status changes, low stock alerts, shipment updates.\n" +
          "\t•\tReports: order throughput, fulfilment cycle times, backorders, inventory by location, shrinkage, audit of adjustments."
    },
    {
      name: "Customer Onboarding Portal",
      prompt: "Goal: Build a customer onboarding portal for regulated businesses. Capture rich customer data, run validations and checks, and drive stateful workflows from submission to approval.\n" +
          "\n" +
          "Primary entity: CustomerProfile\n" +
          "\t•\tIdentity: legalName, tradingName, registrationId, taxId, countryOfIncorporation.\n" +
          "\t•\tOwnershipGraph: nested structure of beneficial owners (persons or entities), each with percentOwnership, controlFlags, residency, and optional children to represent multi-level ownership. Support cycles prevention and aggregate ownership by ultimate beneficiaries.\n" +
          "\t•\tContacts: emails[], phones[] with labels and verificationStatus.\n" +
          "\t•\tAddresses: array with type, lines[], locality, region, postalCode, country, geoCode.\n" +
          "\t•\tKYCArtifacts: documents[] with type, fileRef, hash, issuer, issueDate, expiryDate, verificationResult, and revision history.\n" +
          "\t•\tRisk: riskScore, riskFactors[], pepFlags[], sanctionsHits[] with dispositions.\n" +
          "\t•\tState: {Draft, Submitted, InReview, PendingDocs, Approved, Rejected, Archived} with timestamps and actor.\n" +
          "\n" +
          "Workflow:\n" +
          "\t•\tDraft → Submitted when mandatory fields and minimum documents are present.\n" +
          "\t•\tSubmitted → InReview auto-triggers checks (KYC, PEP/sanctions via external APIs, address verification, duplicate detection).\n" +
          "\t•\tInReview → PendingDocs on missing or expired documents; request specific artifacts.\n" +
          "\t•\tInReview → Approved requires: verified identity, ownership aggregation ≥ 75% coverage of ultimate owners, riskScore ≤ threshold, all sanctions hits dispositioned.\n" +
          "\t•\tAny → Rejected with reason codes; auto-notify and allow re-submission.\n" +
          "\t•\tSLA timers: escalate if InReview > 48h or PendingDocs > 7d.\n" +
          "\n" +
          "Validations & checks:\n" +
          "\t•\tStrong ID rules per country; VAT/tax number formats; address postal code by country.\n" +
          "\t•\tOwnershipGraph consistency: no circular references; total declared ownership ≥ 100% ± tolerance; UBO roll-up.\n" +
          "\t•\tDocument integrity via file hash; expiry alerts; revision audit.\n" +
          "\t•\tDuplicate detection by fuzzy match on legalName + registrationId + country.\n" +
          "\n" +
          "APIs & reports:\n" +
          "\t•\tCreate/Update CustomerProfile; upload documents; request decision.\n" +
          "\t•\tWebhook events on state changes.\n" +
          "\t•\tReports: onboarding throughput, time-to-approve by risk band, outstanding PendingDocs, UBO coverage, audit of decisions."
    },
    {
      name: "Loan Application Processing",
      prompt: "Build a loan application service for regulated lenders. Capture rich applicant data, evaluate risk, manage collateral, and drive stateful workflows from submission to funding with full audit.\n" +
          "\n" +
          "Primary entity: LoanApplication\n" +
          "\t•\tApplicant: personOrOrg, legalName, identifiers {taxId, regId}, incomeStreams[], expenses[], creditScore, residency.\n" +
          "\t•\tCollateralPool: heterogeneous assets (property, vehicles, accounts, guarantees). Each asset has type-specific attributes plus liens[], valuations[] with {value, provider, method, timestamp}, and cross-references to other assets to express senior/subordinate liens.\n" +
          "\t•\tCashflowProjection: schedule[] of {period, inflow, outflow, assumptions{rate, index, margin}}, supports scenario variants and revision history.\n" +
          "\t•\tTerms: productType, principal, currency, rateType (fixed/floating), index, margin, tenor, repaymentMethod, fees[].\n" +
          "\t•\tCompliance: KYCArtifacts[], AMLFlags[], disclosuresAck, consents[].\n" +
          "\t•\tState: {Draft, Submitted, Screening, Underwriting, PendingDocs, Approved, Declined, Funded, Withdrawn, Archived} with timestamps and actor.\n" +
          "\n" +
          "Workflow:\n" +
          "\t•\tDraft → Submitted when mandatory applicant, collateral, and terms exist.\n" +
          "\t•\tSubmitted → Screening triggers checks: KYC/AML, sanctions/PEP, bureau pull, fraud/dup detection.\n" +
          "\t•\tScreening → Underwriting on pass; auto-generate risk assessment from CashflowProjection (DSCR/LTV/LTI).\n" +
          "\t•\tUnderwriting → PendingDocs when missing/expired proofs (income, valuation, insurance).\n" +
          "\t•\tUnderwriting → Approved when policy thresholds met, collateral coverage and lien priority validated, and conditions precedent satisfied.\n" +
          "\t•\tApproved → Funded on execution of documents and final disbursement checklist.\n" +
          "\t•\tAny → Declined with reason codes; allow resubmission.\n" +
          "\n" +
          "Validations & checks:\n" +
          "\t•\tID formats by jurisdiction; address and bank detail validation.\n" +
          "\t•\tCollateralPool integrity: no circular lien references; valuations within staleness window; coverage ≥ policy threshold per product.\n" +
          "\t•\tCashflowProjection math and rate conventions; DSCR ≥ threshold; APR disclosure.\n" +
          "\t•\tDuplicate detection on applicant + identifiers.\n" +
          "\t•\tDocument hash verification and expiry alerts.\n" +
          "\n" +
          "APIs & reports:\n" +
          "\t•\tCreate/Update LoanApplication; upload artifacts; request decision; post funding.\n" +
          "\t•\tWebhooks for state changes and conditions requests.\n" +
          "\t•\tReports: pipeline by stage, approval rates by risk band, time-to-decision, collateral coverage, audit of decisions."
    }
  ];

  // Typewriter effect state
  const [userText, setUserText] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  const fixedPrefix = 'Build a ';

  // Typewriter hook with configuration - using very slow speeds for testing
  const [typewriterState, typewriterControls] = useTypewriter(
    heroPhrases,
    fixedPrefix,
    {
      typeSpeed: 80,
      deleteSpeed: 30,
      pauseDuration: 600,
      phrasesGap: 300,
      loop: true,
      autoStart: true,
    }
  );

  // Select background image based on theme
  const heroBackground = theme === 'light' ? heroBackgroundLight : heroBackgroundDark;

  // Handle user interaction with textarea
  const handleFocus = () => {
    setIsUserTyping(true);
    typewriterControls.stop();
    if (!userText) {
      setUserText('');
      if (textareaRef.current) {
        textareaRef.current.value = '';
      }
    }
  };

  const handleBlur = () => {
    const currentValue = textareaRef.current?.value || '';
    setUserText(currentValue);

    if (!currentValue.trim()) {
      // Empty input - resume animation
      setIsUserTyping(false);
      typewriterControls.reset();
      typewriterControls.start();
    } else {
      // User has content - keep it and don't resume animation
      setIsUserTyping(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserText(value);

    // If user clears the text while typing, we should be ready to resume animation on blur
    if (!value.trim() && isUserTyping) {
      // Don't resume animation yet, wait for blur
    }
  };

  // Determine what text to show in the textarea
  const displayValue = isUserTyping ? userText : typewriterState.displayText;

  // Handle example button clicks
  const handleExampleClick = (example: { name: string; prompt: string }) => {
    const encodedPrompt = encodeURIComponent(example.prompt);
    window.open(`https://ai.cyoda.net/?name=${encodedPrompt}`, '_blank');
  };

	  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
	    e.preventDefault();
	    const isTypewriterActive = typewriterState.isAnimating && !isUserTyping;
	    const valueToSubmit = isTypewriterActive
	      ? `${fixedPrefix}${heroPhrases[typewriterState.currentPhraseIndex] || ''}`
	      : (textareaRef.current?.value ?? displayValue);
	    const encoded = encodeURIComponent(valueToSubmit);
	    window.open(`https://ai.cyoda.net/?name=${encoded}`, '_blank');
	  };


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with texture overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat texture-overlay"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-dark opacity-70" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Hero headline */}
          <div className="space-y-4">
            <h1 className="mobile-text-4xl font-bold text-gradient-hero leading-tight">
                Problem → Prototype → Production
            </h1>

            {/* Subtext */}
            <p className="mobile-text-base text-foreground/90 leading-relaxed max-w-2xl mx-auto">
                Developer-first application platform for event-driven backends. <br />
                One developer. Enterprise outcomes.
            </p>
          </div>

          {/* Input section */}
          <div className="max-w-2xl mx-auto space-y-6">
            <form action="https://ai.cyoda.net" method="GET" target="_blank" id="start-form" className="relative" onSubmit={handleSubmit}>
              <Textarea
                ref={textareaRef}
                name="name"
                id="name"
                required
                minLength={1}
                maxLength={10000}
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                aria-label="Describe what you want to build..."
                placeholder={isUserTyping ? "Describe your application idea..." : ""}
                className="min-h-[120px] mobile-text-base bg-background/10 backdrop-blur border-2 border-primary/30 focus:border-primary glow-primary placeholder:text-foreground/60 pr-24 sm:pr-32"
              />
              <Button
                type="submit"
                id="start-btn"
                size="mobile-sm"
                className="absolute right-2 bottom-2 bg-gradient-primary text-white glow-primary min-h-[44px] min-w-[44px]"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              </Button>
            </form>

            {/* Pre-baked examples */}
            <div className="space-y-3">
              <p className="mobile-text-sm text-muted-foreground">Or try these examples:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {prebakedExamples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="mobile-sm"
                    onClick={() => handleExampleClick(example)}
                    className="bg-card/20 backdrop-blur border-primary/30 hover:bg-primary/10 hover:border-primary glow-hover mobile-btn-text-sm min-h-[44px]"
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-primary opacity-20 blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-accent opacity-15 blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-20 w-16 h-16 rounded-full bg-cyoda-purple opacity-25 blur-lg animate-pulse delay-500" />
    </section>
  );
};

export default HeroSection;