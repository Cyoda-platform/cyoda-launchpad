import { useCallback, useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbLoanLifecycle } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const workflowHtml = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Loan workflow graph - Cyoda</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --bg: transparent;
    --panel: #FFFFFF;
    --ink: #12272B;
    --ink-2: #3B5257;
    --ink-3: #6B8087;
    --ink-4: #9DAEB4;
    --rule: #E8E4D9;
    --rule-2: #EFEBDF;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:var(--bg);color:var(--ink);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;}
  .page{max-width:none;margin:0;padding:8px 8px 0}
  .layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:28px;align-items:start}
  .graphCard{
    background:var(--panel);
    border:1px solid var(--rule);
    border-radius:14px;
    box-shadow:0 10px 24px -20px rgba(18,39,43,.22);
    padding:20px 22px 14px;
  }
  .cardHead{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px;padding:0 4px}
  .cardHead .title{display:flex;align-items:baseline;gap:10px}
  .cardHead .tag{font:600 10px/1 'Inter';letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3)}
  .cardHead .entity{font:600 14px/1 'Inter';color:var(--ink)}
  .legend{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
  .legend .chip{display:inline-flex;align-items:center;gap:7px;font:500 11px/1 'Inter';color:var(--ink-3)}
  .legend .sw{width:11px;height:11px;border-radius:3px;background:#fff;border:1.4px solid var(--ink-4)}
  .legend .sw.state{background:#E8F2EE;border-color:#2F7A7B}
  .legend .sw.crit{background:#FBF1DC;border-color:#B87E1C;transform:rotate(45deg);width:9px;height:9px;border-radius:1.5px}
  .legend .sw.proc{background:#F5F3ED;border-color:#BCC5C9;border-style:dashed}
  .legend .sw.term{background:#F7EBE8;border-color:#B05A4F}
  svg.graph{display:block;width:100%;height:auto;margin-top:4px}

  .svg-state-label{font:600 14px/1 'Inter';fill:#133E40}
  .svg-state-sub{font:500 10.5px/1 'JetBrains Mono';fill:#3E6F66}
  .svg-crit-label{font:600 12px/1 'Inter';fill:#6E4A0E}
  .svg-proc-title{font:500 11.5px/1 'Inter';fill:#546268}
  .svg-proc-sub{font:500 10px/1.2 'JetBrains Mono';fill:#7E8A8F}
  .svg-term-label{font:600 13px/1 'Inter';fill:#6A2E26}
  .svg-edge-label{font:500 10.5px/1 'Inter';fill:#7B8C92}
  .svg-edge-label-exc{font:500 10.5px/1 'Inter';fill:#9A5F41}
  .svg-edge-label-loop{font:600 11px/1 'Inter';fill:#2F7A7B;letter-spacing:.02em}
  .svg-section{font:600 9.5px/1 'Inter';letter-spacing:.18em;text-transform:uppercase;fill:#A6B4B9}

  .historyCard{background:transparent;border:1px solid var(--rule);border-radius:12px;padding:20px 20px 18px}
  .historyCard .htag{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
  .historyCard .htag .t{font:600 10px/1 'Inter';letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);white-space:nowrap}
  .historyCard .htag .append{font:500 10px/1 'JetBrains Mono';color:#2F7A7B}
  .historyCard .trade{font:600 15px/1 'Inter';color:var(--ink);margin:2px 0 14px;letter-spacing:-0.01em}
  .histRow{display:grid;grid-template-columns:70px 1fr;gap:10px;padding:9px 0;border-top:1px solid var(--rule-2)}
  .histRow:first-of-type{border-top:none;padding-top:4px}
  .histRow .ts{font:500 11px/1.2 'JetBrains Mono';color:var(--ink-4)}
  .histRow .body .badge{display:inline-block;font:600 9.5px/1 'Inter';letter-spacing:.08em;padding:3px 6px;border-radius:3px;margin-bottom:4px;color:#1F6061;background:#E8F2EE}
  .histRow .body .badge.warn{color:#6E4A0E;background:#FBF1DC}
  .histRow .body .badge.final{color:#0F4E3D;background:#D5E8DC}
  .histRow .body .txt{font:400 12px/1.4 'Inter';color:var(--ink-2)}
  .footnote{margin-top:14px;font:400 11px/1.5 'Inter';color:var(--ink-3)}

  @media (max-width: 1180px){
    .layout{grid-template-columns:1fr}
  }

  @media (max-width: 720px){
    .page{padding:8px 0 0}
    .graphCard,.historyCard{padding-left:16px;padding-right:16px}
    .cardHead{flex-direction:column;align-items:flex-start;gap:10px}
    .legend{gap:12px}
  }
</style>
</head>
<body>
  <div class="page">
    <div class="layout">
      <div class="graphCard">
        <div class="cardHead">
          <div class="title">
            <span class="tag">Entity workflow</span>
            <span class="entity">LoanApplication</span>
          </div>
          <div class="legend">
            <span class="chip"><span class="sw state"></span>State</span>
            <span class="chip"><span class="sw crit"></span>Criterion</span>
            <span class="chip"><span class="sw proc"></span>Process</span>
            <span class="chip"><span class="sw term"></span>Terminal</span>
          </div>
        </div>

        <svg class="graph" viewBox="0 0 1440 940" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="arrMain" viewBox="0 0 10 10" markerWidth="7" markerHeight="7" refX="9" refY="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#3E6269"/>
            </marker>
            <marker id="arrSoft" viewBox="0 0 10 10" markerWidth="7" markerHeight="7" refX="9" refY="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#A9B7BC"/>
            </marker>
            <marker id="arrExc" viewBox="0 0 10 10" markerWidth="7" markerHeight="7" refX="9" refY="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#C99475"/>
            </marker>
            <marker id="arrLoop" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="9" refY="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#2F7A7B"/>
            </marker>
            <filter id="stateShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.2" flood-color="#12272B" flood-opacity="0.07"/>
            </filter>
          </defs>

          <text x="16" y="60" class="svg-section">Intake &amp; review</text>
          <text x="16" y="300" class="svg-section">Main lifecycle</text>
          <text x="16" y="590" class="svg-section">Offer &amp; servicing</text>
          <text x="16" y="810" class="svg-section">Documents &amp; rework</text>

          <g transform="translate(320,100)">
            <rect width="160" height="50" rx="8" fill="#F5F3ED" stroke="#BCC5C9" stroke-width="1" stroke-dasharray="3.5 3"/>
            <text x="14" y="20" class="svg-proc-title">Request documents</text>
            <text x="14" y="36" class="svg-proc-sub">KYC · income · ID</text>
          </g>
          <g transform="translate(540,100)">
            <rect width="150" height="50" rx="8" fill="#F5F3ED" stroke="#BCC5C9" stroke-width="1" stroke-dasharray="3.5 3"/>
            <text x="14" y="20" class="svg-proc-title">Run KYC checks</text>
            <text x="14" y="36" class="svg-proc-sub">sanctions · PEP</text>
          </g>
          <g transform="translate(830,100)">
            <rect width="170" height="50" rx="8" fill="#F5F3ED" stroke="#BCC5C9" stroke-width="1" stroke-dasharray="3.5 3"/>
            <text x="14" y="20" class="svg-proc-title">Run underwriting</text>
            <text x="14" y="36" class="svg-proc-sub">credit · affordability</text>
          </g>
          <g transform="translate(1120,100)">
            <rect width="170" height="50" rx="8" fill="#F5F3ED" stroke="#BCC5C9" stroke-width="1" stroke-dasharray="3.5 3"/>
            <text x="14" y="20" class="svg-proc-title">Issue offer</text>
            <text x="14" y="36" class="svg-proc-sub">terms · APR · letter</text>
          </g>
          <g transform="translate(400,460)">
            <rect width="160" height="50" rx="8" fill="#F5F3ED" stroke="#BCC5C9" stroke-width="1" stroke-dasharray="3.5 3"/>
            <text x="14" y="20" class="svg-proc-title">Start servicing</text>
            <text x="14" y="36" class="svg-proc-sub">schedule · direct debit</text>
          </g>

          <g stroke="#CBD4D8" stroke-width="1" stroke-dasharray="2.5 3" fill="none" marker-end="url(#arrSoft)">
            <path d="M400 150 C 400 500, 400 720, 400 785"/>
            <path d="M615 150 L615 210"/>
            <path d="M915 150 L915 210"/>
            <path d="M1205 150 L1205 210"/>
            <path d="M480 510 C 480 540, 700 550, 740 555"/>
          </g>

          <g transform="translate(70,210)" filter="url(#stateShadow)">
            <rect width="140" height="54" rx="13" fill="#E8F2EE" stroke="#2F7A7B" stroke-width="1.4"/>
            <text x="70" y="27" text-anchor="middle" class="svg-state-label">Submitted</text>
            <text x="70" y="43" text-anchor="middle" class="svg-state-sub">entity created</text>
          </g>

          <g fill="none" stroke="#3E6269" stroke-width="2" marker-end="url(#arrMain)">
            <path d="M210 237 L325 237"/>
            <path d="M435 237 L540 237"/>
            <path d="M680 237 L720 237"/>
            <path d="M830 237 L870 237"/>
            <path d="M1010 237 L1050 237"/>
            <path d="M1160 237 L1200 237"/>
          </g>

          <g transform="translate(325,210)">
            <path d="M55 0 L110 27 L55 54 L0 27 Z" fill="#FBF1DC" stroke="#B87E1C" stroke-width="1.4"/>
            <text x="55" y="26" text-anchor="middle" class="svg-crit-label">Docs</text>
            <text x="55" y="40" text-anchor="middle" class="svg-crit-label">complete?</text>
          </g>

          <g transform="translate(540,210)" filter="url(#stateShadow)">
            <rect width="140" height="54" rx="13" fill="#CFE4DC" stroke="#1F6061" stroke-width="1.6"/>
            <text x="70" y="27" text-anchor="middle" class="svg-state-label">KYC check</text>
            <text x="70" y="43" text-anchor="middle" class="svg-state-sub">active</text>
          </g>

          <g transform="translate(720,210)">
            <path d="M55 0 L110 27 L55 54 L0 27 Z" fill="#FBF1DC" stroke="#B87E1C" stroke-width="1.4"/>
            <text x="55" y="26" text-anchor="middle" class="svg-crit-label">KYC</text>
            <text x="55" y="40" text-anchor="middle" class="svg-crit-label">passed?</text>
          </g>

          <g transform="translate(870,210)" filter="url(#stateShadow)">
            <rect width="140" height="54" rx="13" fill="#E8F2EE" stroke="#2F7A7B" stroke-width="1.4"/>
            <text x="70" y="27" text-anchor="middle" class="svg-state-label">Underwriting</text>
            <text x="70" y="43" text-anchor="middle" class="svg-state-sub">model + review</text>
          </g>

          <g transform="translate(1050,210)">
            <path d="M55 0 L110 27 L55 54 L0 27 Z" fill="#FBF1DC" stroke="#B87E1C" stroke-width="1.4"/>
            <text x="55" y="26" text-anchor="middle" class="svg-crit-label">Credit</text>
            <text x="55" y="40" text-anchor="middle" class="svg-crit-label">met?</text>
          </g>

          <g transform="translate(1200,210)" filter="url(#stateShadow)">
            <rect width="150" height="54" rx="13" fill="#E8F2EE" stroke="#2F7A7B" stroke-width="1.4"/>
            <text x="75" y="27" text-anchor="middle" class="svg-state-label">Offer issued</text>
            <text x="75" y="43" text-anchor="middle" class="svg-state-sub">awaiting borrower</text>
          </g>

          <g fill="none" stroke="#3E6269" stroke-width="2" marker-end="url(#arrMain)">
            <path d="M1275 264 L1275 400"/>
          </g>

          <g transform="translate(1215,400)">
            <path d="M60 0 L120 28 L60 56 L0 28 Z" fill="#FBF1DC" stroke="#B87E1C" stroke-width="1.4"/>
            <text x="60" y="24" text-anchor="middle" class="svg-crit-label">Offer</text>
            <text x="60" y="38" text-anchor="middle" class="svg-crit-label">accepted?</text>
          </g>

          <g fill="none" stroke="#3E6269" stroke-width="2" marker-end="url(#arrMain)">
            <path d="M1215 428 C 1000 428, 900 582, 820 582"/>
          </g>
          <text x="1020" y="470" class="svg-edge-label">accept</text>

          <g transform="translate(660,555)" filter="url(#stateShadow)">
            <rect width="160" height="54" rx="13" fill="#E8F2EE" stroke="#2F7A7B" stroke-width="1.4"/>
            <text x="80" y="27" text-anchor="middle" class="svg-state-label">Active loan</text>
            <text x="80" y="43" text-anchor="middle" class="svg-state-sub">servicing</text>
          </g>

          <g fill="none" stroke="#3E6269" stroke-width="2" marker-end="url(#arrMain)">
            <path d="M820 582 L870 582"/>
            <path d="M985 582 L1040 582"/>
          </g>

          <g transform="translate(870,555)">
            <path d="M55 0 L110 27 L55 54 L0 27 Z" fill="#FBF1DC" stroke="#B87E1C" stroke-width="1.4"/>
            <text x="55" y="26" text-anchor="middle" class="svg-crit-label">Payment</text>
            <text x="55" y="40" text-anchor="middle" class="svg-crit-label">missed?</text>
          </g>

          <g transform="translate(1040,555)" filter="url(#stateShadow)">
            <rect width="170" height="54" rx="13" fill="#D5E8DC" stroke="#1F6061" stroke-width="1.8"/>
            <rect x="3" y="3" width="164" height="48" rx="11" fill="none" stroke="#9EC9B2" stroke-width="0.8"/>
            <text x="85" y="27" text-anchor="middle" class="svg-state-label" style="fill:#0F4E3D">Settled</text>
            <text x="85" y="43" text-anchor="middle" class="svg-state-sub" style="fill:#1F6061">terminal · paid</text>
          </g>

          <g fill="none" stroke="#C99475" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#arrExc)">
            <path d="M925 609 L925 675"/>
          </g>
          <text x="932" y="648" class="svg-edge-label-exc">missed</text>

          <g transform="translate(860,675)" filter="url(#stateShadow)">
            <rect width="130" height="50" rx="12" fill="#FDEFE5" stroke="#C99475" stroke-width="1.4"/>
            <text x="65" y="24" text-anchor="middle" class="svg-state-label" style="fill:#7A3F24">Arrears</text>
            <text x="65" y="40" text-anchor="middle" class="svg-state-sub" style="fill:#9A5F41">collections</text>
          </g>

          <g fill="none" stroke="#C99475" stroke-width="1.3" marker-end="url(#arrExc)">
            <path d="M990 700 L1040 700"/>
          </g>
          <text x="995" y="692" class="svg-edge-label-exc">cure</text>

          <g transform="translate(1040,675)" filter="url(#stateShadow)">
            <rect width="150" height="50" rx="12" fill="#E8F2EE" stroke="#2F7A7B" stroke-width="1.4"/>
            <text x="75" y="24" text-anchor="middle" class="svg-state-label">Restructured</text>
            <text x="75" y="40" text-anchor="middle" class="svg-state-sub">new terms</text>
          </g>

          <g fill="none" stroke="#2F7A7B" stroke-width="1.6" marker-end="url(#arrLoop)">
            <path d="M1115 675 C 1115 540, 900 540, 820 568"/>
          </g>

          <g fill="none" stroke="#B05A4F" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#arrExc)">
            <path d="M925 725 L925 858"/>
          </g>
          <text x="932" y="800" class="svg-edge-label-exc" style="fill:#8A4035">default</text>

          <g transform="translate(860,858)" filter="url(#stateShadow)">
            <rect width="150" height="48" rx="10" fill="#F7EBE8" stroke="#B05A4F" stroke-width="1.6"/>
            <rect x="3" y="3" width="144" height="42" rx="8" fill="none" stroke="#B05A4F" stroke-width="0.8" stroke-dasharray="2 2"/>
            <text x="75" y="24" text-anchor="middle" class="svg-term-label">Defaulted</text>
            <text x="75" y="39" text-anchor="middle" class="svg-state-sub" style="fill:#8A4035">terminal</text>
          </g>

          <g fill="none" stroke="#C99475" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#arrExc)">
            <path d="M380 264 L380 785"/>
          </g>
          <text x="388" y="400" class="svg-edge-label-exc">docs missing</text>

          <g fill="none" stroke="#C99475" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#arrExc)">
            <path d="M775 264 L775 305 L620 305 L620 400"/>
          </g>
          <text x="632" y="298" class="svg-edge-label-exc">manual review</text>

          <g transform="translate(560,400)" filter="url(#stateShadow)">
            <rect width="140" height="50" rx="12" fill="#FDEFE5" stroke="#C99475" stroke-width="1.4"/>
            <text x="70" y="24" text-anchor="middle" class="svg-state-label" style="fill:#7A3F24">Manual review</text>
            <text x="70" y="40" text-anchor="middle" class="svg-state-sub" style="fill:#9A5F41">ops queue</text>
          </g>

          <g fill="none" stroke="#2F7A7B" stroke-width="1.4" stroke-dasharray="3 2" marker-end="url(#arrLoop)">
            <path d="M560 420 C 490 420, 490 275, 540 255"/>
          </g>
          <text x="480" y="365" class="svg-edge-label-loop">resume</text>

          <g fill="none" stroke="#B05A4F" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#arrExc)">
            <path d="M630 450 L630 555"/>
          </g>
          <text x="637" y="500" class="svg-edge-label-exc" style="fill:#8A4035">reject</text>

          <g transform="translate(500,555)" filter="url(#stateShadow)">
            <rect width="140" height="48" rx="10" fill="#F7EBE8" stroke="#B05A4F" stroke-width="1.6"/>
            <rect x="3" y="3" width="134" height="42" rx="8" fill="none" stroke="#B05A4F" stroke-width="0.8" stroke-dasharray="2 2"/>
            <text x="70" y="24" text-anchor="middle" class="svg-term-label">Declined</text>
            <text x="70" y="39" text-anchor="middle" class="svg-state-sub" style="fill:#8A4035">terminal</text>
          </g>

          <g fill="none" stroke="#B05A4F" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#arrExc)">
            <path d="M600 450 C 600 500, 570 520, 570 555"/>
          </g>

          <g fill="none" stroke="#B05A4F" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#arrExc)">
            <path d="M1105 264 C 1105 180, 570 180, 570 555"/>
          </g>
          <text x="780" y="170" class="svg-edge-label-exc" style="fill:#8A4035">criteria not met</text>

          <g fill="none" stroke="#B05A4F" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#arrExc)">
            <path d="M1275 456 L1275 555"/>
          </g>
          <text x="1282" y="500" class="svg-edge-label-exc" style="fill:#8A4035">expires</text>

          <g transform="translate(1210,555)" filter="url(#stateShadow)">
            <rect width="150" height="48" rx="10" fill="#F7EBE8" stroke="#B05A4F" stroke-width="1.6"/>
            <rect x="3" y="3" width="144" height="42" rx="8" fill="none" stroke="#B05A4F" stroke-width="0.8" stroke-dasharray="2 2"/>
            <text x="75" y="24" text-anchor="middle" class="svg-term-label">Offer expired</text>
            <text x="75" y="39" text-anchor="middle" class="svg-state-sub" style="fill:#8A4035">terminal</text>
          </g>

          <g transform="translate(320,785)" filter="url(#stateShadow)">
            <rect width="170" height="50" rx="12" fill="#FDEFE5" stroke="#C99475" stroke-width="1.4"/>
            <text x="85" y="24" text-anchor="middle" class="svg-state-label" style="fill:#7A3F24">Documents requested</text>
            <text x="85" y="40" text-anchor="middle" class="svg-state-sub" style="fill:#9A5F41">pending borrower</text>
          </g>

          <g fill="none" stroke="#C99475" stroke-width="1.3" marker-end="url(#arrExc)">
            <path d="M490 810 L590 810"/>
          </g>
          <text x="510" y="802" class="svg-edge-label-exc">resubmit</text>

          <g transform="translate(590,785)" filter="url(#stateShadow)">
            <rect width="150" height="50" rx="12" fill="#E8F2EE" stroke="#2F7A7B" stroke-width="1.4"/>
            <text x="75" y="24" text-anchor="middle" class="svg-state-label">Resubmitted</text>
            <text x="75" y="40" text-anchor="middle" class="svg-state-sub">ready to re-check</text>
          </g>

          <g fill="none" stroke="#2F7A7B" stroke-width="1.6" marker-end="url(#arrLoop)">
            <path d="M665 785 C 665 520, 610 275, 610 265"/>
          </g>
          <text transform="translate(675,530) rotate(-90)" class="svg-edge-label-loop">re-enter KYC</text>
        </svg>
      </div>

      <aside class="historyCard">
        <div class="htag">
          <span class="t">Event history</span>
          <span class="append">append-only</span>
        </div>
        <div class="trade">LN-20418</div>

        <div class="histRow">
          <div class="ts">Mon 09:02</div>
          <div class="body">
            <span class="badge">SUBMITTED</span>
            <div class="txt">Application received via broker portal</div>
          </div>
        </div>
        <div class="histRow">
          <div class="ts">Mon 09:04</div>
          <div class="body">
            <span class="badge warn">DOC_REQ</span>
            <div class="txt">Proof of income missing · notified borrower</div>
          </div>
        </div>
        <div class="histRow">
          <div class="ts">Tue 14:31</div>
          <div class="body">
            <span class="badge">RESUBMITTED</span>
            <div class="txt">Payslips &amp; ID uploaded</div>
          </div>
        </div>
        <div class="histRow">
          <div class="ts">Tue 14:42</div>
          <div class="body">
            <span class="badge">KYC_PASSED</span>
            <div class="txt">Sanctions &amp; PEP clear</div>
          </div>
        </div>
        <div class="histRow">
          <div class="ts">Tue 15:10</div>
          <div class="body">
            <span class="badge">APPROVED</span>
            <div class="txt">Underwriting model score 742 · terms generated</div>
          </div>
        </div>
        <div class="histRow">
          <div class="ts">Wed 11:04</div>
          <div class="body">
            <span class="badge">OFFER_ACCEPTED</span>
            <div class="txt">Signed e-agreement received</div>
          </div>
        </div>
        <div class="histRow">
          <div class="ts">Wed 11:05</div>
          <div class="body">
            <span class="badge final">ACTIVE</span>
            <div class="txt">Servicing started · direct debit scheduled</div>
          </div>
        </div>

        <div class="footnote">Every transition appends a signed record. State at any <code style="font-family:'JetBrains Mono';color:var(--ink-2)">t</code> is reconstructable for replay or regulator.</div>
      </aside>
    </div>
  </div>
</body>
</html>`;

const changes = [
  {
    title: 'Branching and re-entry are explicit',
    body: 'Document requests, exception review, and arrears re-entry are modelled as named transitions with criteria — not handled by application code.',
  },
  {
    title: 'No separate workflow engine',
    body: 'Orchestration, audit, and persistence share one consistency contract. There is no seam to reconcile between a workflow engine and a database.',
  },
  {
    title: 'History is queryable at any point in time',
    body: 'Every state transition is an appended record. Regulatory reconstruction at any timestamp is a query, not a rebuild.',
  },
  {
    title: 'Transitions are auditable by design',
    body: 'Criteria, processor results, and transition timestamps are stored as part of the entity record — not inferred from a log.',
  },
  {
    title: 'Processors run inside a consistent lifecycle',
    body: "External KYC calls, scoring processors, and servicer hooks attach to transitions. They run inside the entity's transactional boundary.",
  },
  {
    title: 'Less glue code across the stack',
    body: 'State, workflow, events, and audit collapse into one model. Outbox patterns, duplicate-event guards, and reconciliation pipelines are not needed.',
  },
];

const LoanWorkflowEmbed = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState(980);

  const syncIframeHeight = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;

    if (!iframe || !doc) {
      return;
    }

    const nextHeight = Math.max(
      doc.documentElement.scrollHeight,
      doc.body?.scrollHeight ?? 0,
      doc.documentElement.offsetHeight,
      doc.body?.offsetHeight ?? 0
    );

    if (nextHeight > 0) {
      setIframeHeight(nextHeight);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', syncIframeHeight);
    return () => window.removeEventListener('resize', syncIframeHeight);
  }, [syncIframeHeight]);

  return (
    <div className="overflow-hidden rounded-xl">
      <iframe
        ref={iframeRef}
        title="Loan origination workflow graph"
        srcDoc={workflowHtml}
        className="w-full"
        style={{ height: `${iframeHeight}px`, border: 0, background: 'transparent' }}
        scrolling="no"
        onLoad={syncIframeHeight}
      />
    </div>
  );
};

const UseCaseLoanLifecycle = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Loan Origination & Lifecycle Management | Cyoda"
      description="Model the full loan lifecycle as a Cyoda entity — branching, criteria-driven transitions, loop-back, and immutable event history in one consistency model."
      url="https://cyoda.com/use-cases/loan-lifecycle"
      type="website"
      jsonLd={[organizationSchema, breadcrumbLoanLifecycle]}
    />
    <Header />
    <main>

      {/* Hero */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Use case · Loan origination
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 max-w-3xl leading-tight">
            Model the full loan lifecycle in one entity
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Loan origination is not a straight line. It branches through identity checks, document
            requests, underwriting decisions, manual exceptions, and multiple end states — then
            continues into servicing, arrears, and settlement. Cyoda models all of it as a single
            entity with an explicit workflow: states, criteria-driven transitions, attached
            processors, and an immutable history of every step.
          </p>
        </div>
      </section>

      {/* Why this is hard */}
      <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                The problem
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
                Loan workflows don't fit a status column
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  A loan can return to document collection after KYC — then re-enter the
                  underwriting queue with a different set of documents. That is a loop-back.
                  Status flags in a database cannot model it without losing the history of the
                  original check.
                </p>
                <p>
                  Underwriting is a decision gate with three exits: approved, manual review, or
                  hard decline. Each exit is a different transition with different criteria. Manual
                  review is itself a state with its own transitions and attached processor.
                </p>
                <p>
                  Once the loan is active, the lifecycle continues through servicing cycles,
                  arrears, restructuring, and eventual settlement or default. These are not edge
                  cases — they are normal lifecycle events that share the same entity and the same
                  audit requirement as origination.
                </p>
                <p>
                  Conventional stacks split this across a status column, a workflow engine, an
                  event log, and a separate audit table. The seams between them are the source of
                  the bugs.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                The conventional assembly
              </h3>
              <ul className="space-y-4">
                {[
                  { system: 'Status column in PostgreSQL', problem: 'Cannot model loop-back or branching without losing transition history.' },
                  { system: 'Kafka or SQS for events', problem: 'Eventual consistency across services — state and events can diverge.' },
                  { system: 'Temporal or Camunda for workflow', problem: 'Separate consistency boundary from the database; reconciliation required.' },
                  { system: 'Audit table or event log', problem: 'Assembled after the fact — not an invariant of the write path.' },
                  { system: 'Glue code', problem: 'Outbox pattern, idempotency keys, saga orchestration across all of the above.' },
                ].map((item) => (
                  <li key={item.system} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-muted-foreground/50" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.system}</p>
                      <p className="text-xs text-muted-foreground leading-snug">{item.problem}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* The Cyoda workflow */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              How Cyoda models it
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              One LoanApplication entity, one workflow
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              The loan is a Cyoda entity. Its lifecycle is a workflow graph — states,
              criteria-driven transitions, attached processes, and an immutable event history all
              in one consistency model. The graph below shows branching, loop-back, terminal
              outcomes, and supporting audit history in one artifact.
            </p>
          </div>

          <LoanWorkflowEmbed />

          {/* Callouts */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Criteria on every transition',
                detail:
                  'KYC CHECK → UNDERWRITING only fires when the criteria — docs complete, identity verified — evaluate to true. The criteria are part of the workflow definition, not application code.',
              },
              {
                label: 'Processors attach to transitions',
                detail:
                  "kyc-svc runs when the entity enters KYC CHECK. The scoring processor runs on entry to UNDERWRITING. Both run inside the entity's transactional boundary — not as background jobs.",
              },
              {
                label: 'Loop-back is a first-class pattern',
                detail:
                  'DOC REQUESTED is a named state. The transition back to KYC CHECK is an explicit, criteria-guarded transition — not a flag reset or ad hoc state mutation.',
              },
            ].map((c) => (
              <div key={c.label} className="rounded-lg border border-primary/20 bg-primary/[0.03] p-4">
                <p className="text-sm font-semibold text-foreground mb-1.5">{c.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What changes when workflow is native */}
      <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            The outcome
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            What changes when workflow is native
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {changes.map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-background border-t border-border">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="mx-auto mb-6 w-10 h-0.5 bg-primary rounded" />
          <p className="text-xl font-medium text-foreground leading-relaxed mb-8">
            If you're modelling a stateful, auditable workflow and the current stack is the
            problem, we'd like to talk.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="px-8 font-semibold" asChild>
              <Link to="/contact">Talk to us</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 font-semibold" asChild>
              <Link to="/products">Read the architecture</Link>
            </Button>
          </div>
        </div>
      </section>

    </main>
    <Footer />
  </div>
);

export default UseCaseLoanLifecycle;
