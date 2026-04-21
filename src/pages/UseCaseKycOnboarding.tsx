import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbKycOnboarding } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// ─── Embedded workflow artifact ───────────────────────────────────────────────

const kycWorkflowArtifact = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=1440" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --canvas:        oklch(98.5% 0.003 230);
    --panel:         #ffffff;
    --hair:          oklch(92% 0.006 230);
    --hair-2:        oklch(88% 0.006 230);
    --ink:           oklch(22% 0.012 230);
    --ink-muted:     oklch(46% 0.012 230);
    --ink-soft:      oklch(62% 0.012 230);
    --state-fill:    oklch(96.5% 0.022 180);
    --state-border:  oklch(72% 0.06 180);
    --state-ink:     oklch(32% 0.05 190);
    --dec-fill:      oklch(95.5% 0.04 85);
    --dec-border:    oklch(74% 0.09 75);
    --dec-ink:       oklch(38% 0.08 60);
    --proc-fill:     oklch(99% 0.002 230);
    --proc-border:   oklch(80% 0.008 230);
    --proc-ink:      oklch(40% 0.012 230);
    --term-fill:     oklch(96% 0.022 25);
    --term-border:   oklch(74% 0.08 25);
    --term-ink:      oklch(40% 0.09 25);
    --edge:          oklch(72% 0.012 230);
    --edge-stp:      oklch(55% 0.05 190);
    --edge-alt:      oklch(68% 0.06 75);
    --edge-loop:     oklch(60% 0.05 190);
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    background: #ffffff;
    color: var(--ink);
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    font-feature-settings: "cv11","ss01","ss03";
  }

  /* Main artifact — stacked layout: graph above, rail below */
  .stage {
    background: var(--panel);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .graph {
    position: relative;
    padding: 22px 22px 18px 22px;
    border-bottom: 1px solid var(--hair);
    background:
      radial-gradient(1100px 520px at 40% 40%, oklch(99% 0.003 230) 0%, transparent 70%),
      var(--panel);
  }

  .graph-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 2px 6px 14px;
  }
  .graph-header .title {
    display:flex; align-items:center; gap:10px;
    font-size: 12px; font-weight: 600; color: var(--ink);
    letter-spacing: 0.02em;
  }
  .graph-header .title .sq {
    width: 10px; height: 10px; border-radius: 2px;
    background: var(--state-fill); border:1px solid var(--state-border);
  }
  .legend { display: flex; gap: 14px; font-size: 11px; color: var(--ink-muted); }
  .legend .chip { display:inline-flex; align-items:center; gap:6px; }
  .legend .swatch { width:10px; height:10px; border-radius:3px; border:1px solid var(--hair-2); }
  .legend .swatch.state { background: var(--state-fill); border-color: var(--state-border); }
  .legend .swatch.dec   { background: var(--dec-fill);   border-color: var(--dec-border); transform: rotate(45deg); border-radius:1px;}
  .legend .swatch.proc  { background: var(--proc-fill);  border-color: var(--proc-border); border-style: dashed;}
  .legend .swatch.term  { background: var(--term-fill);  border-color: var(--term-border); }

  svg { display: block; width: 100%; height: auto; }

  .node text { font-family: 'Inter', sans-serif; fill: var(--ink); }
  .node .label { font-size: 12.5px; font-weight: 600; letter-spacing: -0.005em; }
  .node .sub   { font-size: 10px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; fill: var(--ink-soft); }
  .state-rect { fill: var(--state-fill); stroke: var(--state-border); stroke-width: 1.25; }
  .state-rect.primary { stroke-width: 1.5; filter: url(#stateShadow); }
  .state-text  { fill: var(--state-ink); }
  .state-tag   { font-size: 9.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; fill: oklch(52% 0.05 190); }
  .dec-shape { fill: var(--dec-fill); stroke: var(--dec-border); stroke-width: 1.25; }
  .dec-text  { fill: var(--dec-ink); font-size: 11.5px; font-weight: 600; }
  .proc-rect { fill: var(--proc-fill); stroke: var(--proc-border); stroke-width: 1; stroke-dasharray: 4 3;}
  .proc-text { fill: var(--proc-ink); font-size: 10.5px; font-weight: 500; }
  .proc-kicker { font-size: 9px; font-weight:600; letter-spacing: 0.1em; text-transform: uppercase; fill: var(--ink-soft);}
  .term-rect { fill: var(--term-fill); stroke: var(--term-border); stroke-width: 1.25; }
  .term-text { fill: var(--term-ink); font-size: 12px; font-weight: 600; }
  .term-tag  { font-size: 9.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; fill: oklch(55% 0.08 25); }
  .edge { fill: none; stroke: var(--edge); stroke-width: 1.25; }
  .edge.stp { stroke: var(--edge-stp); stroke-width: 2; }
  .edge.alt { stroke: var(--edge-alt); stroke-width: 1.4; }
  .edge.term { stroke: oklch(70% 0.06 25); stroke-width: 1.3; }
  .edge.loop { stroke: var(--edge-loop); stroke-width: 1.4; stroke-dasharray: 5 4; }
  .edge-label {
    font-family: 'Inter', sans-serif;
    font-size: 10px; font-weight: 600; letter-spacing: 0.02em;
    fill: var(--ink-muted);
  }
  .edge-label-bg { fill: #fff; stroke: var(--hair); stroke-width: 0.75;}

  /* Audit rail — stacked below graph */
  .rail {
    padding: 22px 22px 22px 22px;
    background: linear-gradient(180deg, #fff 0%, oklch(99% 0.003 230) 100%);
    display: flex; flex-direction: column; gap: 16px;
  }
  .rail h3 {
    margin: 0; font-size: 12px; font-weight: 700; color: var(--ink);
    letter-spacing: 0.06em; text-transform: uppercase;
    display: flex; align-items: center; gap: 10px;
  }
  .rail h3 .pulse {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--state-border);
    box-shadow: 0 0 0 0 oklch(72% 0.06 180 / 0.4);
    animation: pulse 2.4s infinite;
  }
  @keyframes pulse {
    0%   { box-shadow: 0 0 0 0 oklch(72% 0.06 180 / 0.35); }
    70%  { box-shadow: 0 0 0 8px oklch(72% 0.06 180 / 0); }
    100% { box-shadow: 0 0 0 0 oklch(72% 0.06 180 / 0); }
  }
  .rail .lede {
    font-size: 12.5px; line-height: 1.5; color: var(--ink-muted);
    margin: -4px 0 6px;
  }

  /* Two-column row layout for entity card + principles */
  .rail-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .entity-card {
    border: 1px solid var(--hair);
    border-radius: 10px;
    padding: 12px 14px;
    background: #fff;
    display: flex; flex-direction: column; gap: 4px;
  }
  .entity-card .k { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); font-weight: 600;}
  .entity-card .v {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; font-weight: 600; color: var(--ink);
  }
  .entity-card .r { display: flex; justify-content: space-between; align-items: baseline; gap: 10px;}
  .entity-card .r + .r { margin-top: 6px; padding-top: 6px; border-top: 1px dashed var(--hair);}

  .log {
    font-family: 'JetBrains Mono', monospace;
    border: 1px solid var(--hair);
    border-radius: 10px;
    background: #fff;
    overflow: hidden;
  }
  .log .head {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid var(--hair);
    background: oklch(98% 0.003 230);
    font-size: 10.5px; color: var(--ink-muted); font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    font-family: 'Inter', sans-serif;
  }
  .log .head .count {
    color: var(--ink); background: #fff;
    border: 1px solid var(--hair);
    border-radius: 4px; padding: 2px 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px; letter-spacing: 0.02em;
  }
  .log ol { list-style: none; margin: 0; padding: 6px 0; }
  .log li {
    display: grid;
    grid-template-columns: 62px 10px 1fr;
    gap: 10px;
    padding: 7px 12px;
    font-size: 11px;
    align-items: baseline;
    position: relative;
  }
  .log li .t { color: var(--ink-soft); font-weight: 500; font-variant-numeric: tabular-nums; }
  .log li .g { width: 7px; height: 7px; border-radius: 50%; align-self: center; background: var(--state-border); box-shadow: 0 0 0 2px #fff, 0 0 0 3px var(--hair); }
  .log li.ev-edd   .g { background: var(--dec-border); }
  .log li.ev-warn  .g { background: var(--term-border); }
  .log li.ev-ok    .g { background: oklch(66% 0.09 160); }
  .log li .e { color: var(--ink); font-weight: 600; letter-spacing: 0.02em; }
  .log li .e .meta-l { color: var(--ink-soft); font-weight: 500; letter-spacing: 0; }
  .log li::before {
    content: ""; position: absolute;
    left: calc(62px + 10px + 5px - 0.5px);
    top: 0; bottom: -1px; width: 1px;
    background: var(--hair-2);
  }
  .log li:first-child::before { top: 50%; }
  .log li:last-child::before  { bottom: 50%; }

  .principles {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
  }
  .principles .p {
    border: 1px solid var(--hair);
    border-radius: 8px;
    padding: 10px 12px;
    background: #fff;
  }
  .principles .p .k {
    font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--ink-soft); font-weight: 700; margin-bottom: 4px;
  }
  .principles .p .v {
    font-size: 11.5px; color: var(--ink); font-weight: 500; line-height: 1.35;
  }
</style>
</head>
<body>
<div class="stage">

  <!-- GRAPH -->
  <div class="graph">
    <div class="graph-header">
      <div class="title"><span class="sq"></span> Workflow graph &middot; operational view</div>
      <div class="legend">
        <span class="chip"><span class="swatch state"></span> State</span>
        <span class="chip"><span class="swatch dec"></span> Criterion</span>
        <span class="chip"><span class="swatch proc"></span> Process</span>
        <span class="chip"><span class="swatch term"></span> Terminal</span>
      </div>
    </div>

    <svg viewBox="0 0 1060 720" role="img" aria-labelledby="graph-title">
      <title id="graph-title">KYC and Customer Onboarding workflow graph</title>
      <defs>
        <filter id="stateShadow" x="-20%" y="-30%" width="140%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1e2a35" flood-opacity="0.08"/>
        </filter>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="var(--edge)"/>
        </marker>
        <marker id="arrow-stp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="var(--edge-stp)"/>
        </marker>
        <marker id="arrow-alt" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="var(--edge-alt)"/>
        </marker>
        <marker id="arrow-term" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="oklch(70% 0.06 25)"/>
        </marker>
        <marker id="arrow-loop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="var(--edge-loop)"/>
        </marker>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="oklch(95% 0.004 230)" stroke-width="0.6"/>
        </pattern>
      </defs>

      <rect x="0" y="0" width="1060" height="720" fill="url(#grid)"/>

      <!-- Section labels (lanes) -->
      <g font-family="Inter" font-size="9.5" letter-spacing="0.14em" font-weight="600" fill="var(--ink-soft)">
        <text x="16" y="86"  style="text-transform:uppercase">LEGAL-ENTITY BRANCH</text>
        <text x="16" y="310" style="text-transform:uppercase">STRAIGHT-THROUGH PATH</text>
        <text x="16" y="530" style="text-transform:uppercase">EXCEPTIONS / TERMINALS</text>
      </g>
      <line x1="12" y1="92"  x2="1044" y2="92"  stroke="var(--hair-2)" stroke-dasharray="2 4"/>
      <line x1="12" y1="316" x2="1044" y2="316" stroke="var(--hair)"  stroke-dasharray="2 4"/>
      <line x1="12" y1="536" x2="1044" y2="536" stroke="var(--hair-2)" stroke-dasharray="2 4"/>

      <!-- ============= EDGES ============= -->
      <!-- t1 : intake -> idv (STP) -->
      <g>
        <path class="edge stp" d="M 210,360 L 260,360" marker-end="url(#arrow-stp)"/>
      </g>
      <!-- t3 : idv -> dynamic risk (STP, via automation_clear) -->
      <g>
        <path class="edge stp" d="M 420,360 L 472,360" marker-end="url(#arrow-stp)"/>
        <path class="edge stp" d="M 568,360 L 620,360" marker-end="url(#arrow-stp)"/>
      </g>
      <!-- after dynamic risk -> active monitoring (STP) -->
      <g>
        <path class="edge stp" d="M 780,360 L 832,360" marker-end="url(#arrow-stp)"/>
        <path class="edge stp" d="M 928,360 L 980,360 L 980,360" marker-end=""/>
      </g>
      <!-- t2 : idv -> ubo discovery (legal_entity branch, goes UP) -->
      <g>
        <path class="edge alt" d="M 520,336 L 520,230 L 462,230" marker-end="url(#arrow-alt)"/>
        <path class="edge alt" d="M 398,230 L 340,230" marker-end="url(#arrow-alt)"/>
        <path class="edge alt" d="M 250,258 L 250,360 L 620,360" stroke-linejoin="round" marker-end=""/>
      </g>
      <!-- t4 : idv -> EDD (exception, down) -->
      <g>
        <path class="edge alt" d="M 370,400 L 370,470 L 370,560 L 430,560" marker-end="url(#arrow-alt)"/>
      </g>
      <!-- t8 : dynamic risk -> EDD (high risk, down-left into EDD) -->
      <g>
        <path class="edge alt" d="M 690,400 L 690,470 L 690,560 L 630,560" marker-end="url(#arrow-alt)"/>
      </g>
      <!-- t5 : idv -> abandoned (response_timeout) -->
      <g>
        <path class="edge term" d="M 420,380 L 452,380 L 452,678 L 820,678" marker-end="url(#arrow-term)"/>
      </g>
      <!-- t9 : risk -> rejected (policy reject) -->
      <g>
        <path class="edge term" d="M 720,400 L 720,440 L 890,440 L 890,580" marker-end="url(#arrow-term)"/>
      </g>
      <!-- t11 : EDD -> rejected -->
      <g>
        <path class="edge term" d="M 630,580 L 760,580 L 820,580" marker-end="url(#arrow-term)"/>
      </g>
      <!-- t10 : EDD -> active monitoring (compliance approves) -->
      <g>
        <path class="edge alt" d="M 530,540 L 530,500 L 1010,500 L 1010,400" marker-end="url(#arrow-alt)"/>
      </g>
      <!-- t12 : EDD -> abandoned (timeout during EDD) -->
      <g>
        <path class="edge term" d="M 530,600 L 530,678 L 820,678" marker-end="url(#arrow-term)"/>
      </g>
      <!-- t13 : perpetual KYC loop: active_monitoring -> risk (over the top) -->
      <g>
        <path class="edge loop" d="M 1010,320 C 1010,200 900,140 770,140 C 720,140 700,180 700,260 L 700,320" marker-end="url(#arrow-loop)"/>
      </g>

      <!-- ================= NODES ================= -->
      <!-- INTAKE & TRIAGE -->
      <g class="node" transform="translate(100,330)">
        <rect class="state-rect primary" x="0" y="0" width="110" height="60" rx="10"/>
        <text class="state-tag" x="12" y="18">State &middot; Start</text>
        <text class="state-text label" x="12" y="36">Data Intake</text>
        <text class="state-text label" x="12" y="52">&amp; Triage</text>
      </g>
      <!-- PROCESS: capture_and_classify -->
      <g class="node" transform="translate(218,325)">
        <rect class="proc-rect" x="0" y="0" width="44" height="22" rx="5"/>
        <text class="proc-kicker" x="22" y="14" text-anchor="middle">CLASSIFY</text>
      </g>
      <!-- IDV & SCREENING -->
      <g class="node" transform="translate(260,330)">
        <rect class="state-rect primary" x="0" y="0" width="160" height="60" rx="10"/>
        <text class="state-tag" x="14" y="18">State &middot; Automated</text>
        <text class="state-text label" x="14" y="36">Automated ID&amp;V</text>
        <text class="state-text label" x="14" y="52">&amp; Screening</text>
      </g>
      <!-- PROCESS: run_idv_and_screening -->
      <g class="node" transform="translate(348,396)">
        <rect class="proc-rect" x="0" y="0" width="72" height="18" rx="4"/>
        <text class="proc-kicker" x="36" y="12" text-anchor="middle">ID&amp;V &middot; SANCTIONS &middot; PEP</text>
      </g>
      <!-- CRITERION: automation_clear -->
      <g class="node" transform="translate(520,360)">
        <polygon class="dec-shape" points="0,-24 48,0 0,24 -48,0"/>
        <text class="dec-text" text-anchor="middle" dy="4">Automation clear?</text>
      </g>
      <!-- CRITERION: is_legal_entity -->
      <g class="node" transform="translate(430,230)">
        <polygon class="dec-shape" points="0,-22 32,0 0,22 -32,0"/>
        <text class="dec-text" text-anchor="middle" dy="4" font-size="10">Legal entity?</text>
      </g>
      <!-- UBO DISCOVERY -->
      <g class="node" transform="translate(160,200)">
        <rect class="state-rect" x="0" y="0" width="180" height="58" rx="10"/>
        <text class="state-tag" x="14" y="18">State &middot; Conditional branch</text>
        <text class="state-text label" x="14" y="38">UBO &amp; Control Discovery</text>
      </g>
      <!-- PROCESS attached to UBO -->
      <g class="node" transform="translate(170,266)">
        <rect class="proc-rect" x="0" y="0" width="160" height="18" rx="4"/>
        <text class="proc-kicker" x="80" y="12" text-anchor="middle">DISCOVER UBO &amp; CONTROL</text>
      </g>
      <!-- DYNAMIC RISK ASSESSMENT -->
      <g class="node" transform="translate(620,330)">
        <rect class="state-rect primary" x="0" y="0" width="160" height="60" rx="10"/>
        <text class="state-tag" x="14" y="18">State &middot; Decisioning</text>
        <text class="state-text label" x="14" y="36">Dynamic Risk</text>
        <text class="state-text label" x="14" y="52">Assessment</text>
      </g>
      <g class="node" transform="translate(646,396)">
        <rect class="proc-rect" x="0" y="0" width="108" height="18" rx="4"/>
        <text class="proc-kicker" x="54" y="12" text-anchor="middle">SCORE RISK DYNAMICALLY</text>
      </g>
      <!-- CRITERION: low_risk -->
      <g class="node" transform="translate(832,360)">
        <polygon class="dec-shape" points="0,-22 48,0 0,22 -48,0"/>
        <text class="dec-text" text-anchor="middle" dy="4" font-size="10.5">Low risk?</text>
      </g>
      <!-- ACTIVE / ONGOING MONITORING -->
      <g class="node" transform="translate(930,320)">
        <rect class="state-rect primary" x="0" y="0" width="160" height="80" rx="12" stroke-width="1.8"/>
        <text class="state-tag" x="14" y="18" fill="oklch(40% 0.09 190)">State &middot; Persistent</text>
        <text class="state-text label" x="14" y="38">Active / Ongoing</text>
        <text class="state-text label" x="14" y="54">Monitoring</text>
        <text class="state-text" x="14" y="70" font-size="10" font-weight="500" fill="var(--ink-soft)" font-style="italic">perpetual KYC</text>
        <circle cx="142" cy="22" r="4" fill="oklch(70% 0.12 160)"/>
        <circle cx="142" cy="22" r="7" fill="none" stroke="oklch(70% 0.12 160 / 0.4)" stroke-width="1"/>
      </g>
      <!-- EXCEPTION HANDLING & EDD -->
      <g class="node" transform="translate(430,540)">
        <rect class="state-rect" x="0" y="0" width="200" height="60" rx="10"
              fill="var(--dec-fill)" stroke="var(--dec-border)"/>
        <text class="state-tag" x="14" y="18" fill="var(--dec-ink)">State &middot; Human-in-the-loop</text>
        <text class="state-text label" x="14" y="38" fill="var(--dec-ink)">Exception Handling &amp; EDD</text>
        <text class="state-text" x="14" y="53" font-size="10" fill="var(--dec-ink)" opacity="0.75">missing info &middot; SoF/SoW &middot; escalations</text>
      </g>
      <g class="node" transform="translate(456,606)">
        <rect class="proc-rect" x="0" y="0" width="148" height="18" rx="4"/>
        <text class="proc-kicker" x="74" y="12" text-anchor="middle">HANDLE EXCEPTION &middot; EDD</text>
      </g>
      <!-- TERMINALS -->
      <g class="node" transform="translate(820,580)">
        <rect class="term-rect" x="0" y="0" width="140" height="48" rx="10"/>
        <text class="term-tag" x="14" y="18">Terminal</text>
        <text class="term-text" x="14" y="38">Rejected</text>
      </g>
      <g class="node" transform="translate(820,654)">
        <rect class="term-rect" x="0" y="0" width="140" height="48" rx="10"
              fill="oklch(97% 0.012 40)" stroke="oklch(78% 0.05 50)"/>
        <text class="term-tag" x="14" y="18" fill="oklch(48% 0.06 50)">Terminal</text>
        <text class="term-text" x="14" y="38" fill="oklch(42% 0.06 50)">Abandoned</text>
      </g>

      <!-- ============= EDGE LABELS ============= -->
      <g font-family="Inter">
        <g transform="translate(500,215)">
          <rect class="edge-label-bg" x="-38" y="-10" width="76" height="18" rx="9"/>
          <text class="edge-label" text-anchor="middle" dy="3">legal entity</text>
        </g>
        <g transform="translate(594,350)">
          <rect class="edge-label-bg" x="-32" y="-10" width="64" height="18" rx="9"/>
          <text class="edge-label" text-anchor="middle" dy="3">yes</text>
        </g>
        <g transform="translate(370,460)">
          <rect class="edge-label-bg" x="-34" y="-10" width="68" height="18" rx="9"/>
          <text class="edge-label" text-anchor="middle" dy="3">exception</text>
        </g>
        <g transform="translate(690,460)">
          <rect class="edge-label-bg" x="-30" y="-10" width="60" height="18" rx="9"/>
          <text class="edge-label" text-anchor="middle" dy="3">high risk</text>
        </g>
        <g transform="translate(905,350)">
          <rect class="edge-label-bg" x="-28" y="-10" width="56" height="18" rx="9"/>
          <text class="edge-label" text-anchor="middle" dy="3">low risk</text>
        </g>
        <g transform="translate(810,432)">
          <rect class="edge-label-bg" x="-40" y="-10" width="80" height="18" rx="9"/>
          <text class="edge-label" text-anchor="middle" dy="3">policy reject</text>
        </g>
        <g transform="translate(452,508)">
          <rect class="edge-label-bg" x="-30" y="-10" width="60" height="18" rx="9"/>
          <text class="edge-label" text-anchor="middle" dy="3">timeout</text>
        </g>
        <g transform="translate(770,492)">
          <rect class="edge-label-bg" x="-44" y="-10" width="88" height="18" rx="9"/>
          <text class="edge-label" text-anchor="middle" dy="3">EDD approved</text>
        </g>
        <g transform="translate(860,130)">
          <rect class="edge-label-bg" x="-52" y="-10" width="104" height="18" rx="9"/>
          <text class="edge-label" text-anchor="middle" dy="3">monitoring alert</text>
        </g>
      </g>

      <!-- Callouts -->
      <g font-family="Inter">
        <text x="1040" y="196" text-anchor="end" font-size="10.5" font-weight="600" fill="var(--edge-loop)" letter-spacing="0.04em" style="text-transform:uppercase">perpetual KYC loop</text>
        <text x="1040" y="212" text-anchor="end" font-size="10" fill="var(--ink-soft)">Approval is not an endpoint.</text>
      </g>
    </svg>
  </div>

  <!-- AUDIT RAIL — below graph -->
  <aside class="rail">
    <h3><span class="pulse"></span> Immutable event history</h3>
    <p class="lede">Every transition is recorded as a point-in-time event against the <b>CustomerOnboardingCase</b> entity. State, evidence, and decision inputs are reconstructable at any historical moment.</p>

    <div class="rail-row">
      <div class="entity-card">
        <div class="r"><span class="k">Entity</span><span class="v">CustomerOnboardingCase</span></div>
        <div class="r"><span class="k">ID</span><span class="v">coc_01HG4Z&hellip;QF7N</span></div>
        <div class="r"><span class="k">Current state</span><span class="v" style="color:var(--state-ink)">active_monitoring</span></div>
        <div class="r"><span class="k">Risk tier</span><span class="v">tier_2 &middot; medium</span></div>
      </div>
      <div class="principles">
        <div class="p"><div class="k">Append-only</div><div class="v">Events are never mutated; corrections are new events.</div></div>
        <div class="p"><div class="k">Point-in-time</div><div class="v">Re-derive any prior state from its event prefix.</div></div>
        <div class="p"><div class="k">Criteria stored</div><div class="v">Decision inputs captured at the moment of each transition.</div></div>
        <div class="p"><div class="k">Perpetual KYC</div><div class="v">Monitoring alerts re-enter the same workflow.</div></div>
      </div>
    </div>

    <div class="log" aria-label="Event log">
      <div class="head"><span>Event stream</span><span class="count">10 &middot; v0.2</span></div>
      <ol>
        <li class="ev-ok"><span class="t">T+00:00</span><span class="g"></span><span class="e">CASE_INITIATED <span class="meta-l">&middot; intake.web</span></span></li>
        <li><span class="t">T+00:04</span><span class="g"></span><span class="e">DOCS_INGESTED <span class="meta-l">&middot; 4 artefacts</span></span></li>
        <li class="ev-ok"><span class="t">T+00:11</span><span class="g"></span><span class="e">IDV_PASSED <span class="meta-l">&middot; doc + liveness</span></span></li>
        <li class="ev-ok"><span class="t">T+00:13</span><span class="g"></span><span class="e">SCREENING_CLEAR <span class="meta-l">&middot; sanctions, PEP, adv-media</span></span></li>
        <li><span class="t">T+00:22</span><span class="g"></span><span class="e">UBO_DISCOVERED <span class="meta-l">&middot; 3 owners &ge;25%</span></span></li>
        <li><span class="t">T+00:29</span><span class="g"></span><span class="e">RISK_SCORED <span class="meta-l">&middot; 42 / medium</span></span></li>
        <li class="ev-edd"><span class="t">T+00:34</span><span class="g"></span><span class="e">EDD_OPENED <span class="meta-l">&middot; SoF review</span></span></li>
        <li class="ev-ok"><span class="t">T+06:12</span><span class="g"></span><span class="e">APPROVED <span class="meta-l">&middot; compliance.kaur</span></span></li>
        <li class="ev-warn"><span class="t">D+147</span><span class="g"></span><span class="e">MONITORING_ALERT <span class="meta-l">&middot; adverse-media hit</span></span></li>
        <li><span class="t">D+147</span><span class="g"></span><span class="e">RISK_REASSESSED <span class="meta-l">&middot; tier_2 held</span></span></li>
      </ol>
    </div>
  </aside>

</div>
</body>
</html>`;

// ─── What changes section ─────────────────────────────────────────────────────

const changes = [
  {
    title: 'STP without sacrificing auditability',
    body: 'Low-risk cases complete automated ID&V, sanctions, and PEP checks without human intervention. The immutable event history captures every check result regardless — not only when something goes wrong.',
  },
  {
    title: 'Exception handling inside the same lifecycle',
    body: 'EDD and manual casework are not a separate system. They are named states with their own criteria and attached processes — branching off the same entity, feeding back into the same workflow.',
  },
  {
    title: 'Decision-time evidence captured by default',
    body: 'The data available at each transition is recorded as part of the entity history. Point-in-time reconstruction for a regulatory exam or internal review is a query, not a rebuild.',
  },
  {
    title: 'UBO and legal-entity complexity in the workflow',
    body: 'Beneficial ownership discovery and control-structure verification are modelled as conditional states with their own criteria. The path is explicit, not hidden in application code.',
  },
  {
    title: 'Post-approval monitoring, not a dead end',
    body: 'Approval transitions into ongoing monitoring. Trigger-based reassessment and periodic review re-enter the workflow as first-class transitions — not polling jobs or background cron tasks.',
  },
  {
    title: 'No separate audit layer',
    body: 'Immutable history is how Cyoda stores state. There is no warehouse to load, no audit table to keep in sync, and no reconstruction needed to answer "what did we know at T?"',
  },
];

// ─── Production relevance section ────────────────────────────────────────────

const productionItems = [
  {
    title: 'Cleaner audit and compliance review',
    body: 'Every decision, check result, and exception is part of the entity record. Audit trails are structural, not reconstructed.',
  },
  {
    title: 'Fewer seams across systems',
    body: 'Onboarding, screening, casework, and evidence live in one consistency model. There is no reconciliation between an onboarding system and a separate audit store.',
  },
  {
    title: 'Explicit decision paths for policy review',
    body: 'Criteria on transitions make every routing decision inspectable. How a case reached EDD, or why it was rejected, is queryable directly from the entity history.',
  },
  {
    title: 'Lower operational burden for exceptions',
    body: 'Casework states, human-in-the-loop branches, and reassessment triggers are part of the workflow definition — not custom orchestration code that must be maintained separately.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const UseCaseKycOnboarding = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="KYC & Customer Onboarding | Cyoda"
        description="Model KYC and customer onboarding as a Cyoda entity workflow — STP, exception handling, EDD, ongoing monitoring, and immutable audit history in one consistency model."
        url="https://cyoda.com/use-cases/kyc-onboarding"
        type="website"
        jsonLd={[organizationSchema, breadcrumbKycOnboarding]}
      />
      <Header />
      <main>

        {/* Section 1 — Hero */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Use case · KYC &amp; customer onboarding
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 max-w-3xl leading-tight">
              KYC and customer onboarding in one auditable lifecycle
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Modern onboarding is not a one-time pass/fail check. Low-risk customers should pass
              quickly through automated screening. Higher-risk cases branch into enhanced due
              diligence. Legal entities require beneficial ownership discovery. Approved customers
              enter ongoing monitoring that can trigger reassessment. Cyoda models all of it as a
              single entity with an explicit workflow — states, criteria-driven transitions, attached
              processes, and an immutable history of every decision.
            </p>
          </div>
        </section>

        {/* Section 2 — The problem */}
        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                  The problem
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
                  Onboarding doesn't fit one system
                </h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Document and data checks, external screening, casework, and audit are typically
                    split across multiple systems with separate consistency models. A sanctions match
                    in one system has to propagate to the onboarding record in another before a
                    decision can be made — and the evidence of that propagation is rarely stored.
                  </p>
                  <p>
                    Asynchronous external checks — ID&amp;V, sanctions, PEP, adverse media — fail
                    intermittently and must be retried safely without duplicate side effects. Without
                    a durable state model, retries are either unsafe or require custom idempotency
                    logic to manage.
                  </p>
                  <p>
                    Low-risk cases should complete in seconds via straight-through processing. But
                    the same path must branch into enhanced due diligence for higher-risk cases
                    without losing the STP evidence. Legal entities add a second dimension:
                    beneficial ownership discovery is a conditional sub-workflow, not a checkbox.
                  </p>
                  <p>
                    Onboarding does not end at approval. Ongoing monitoring and trigger-based
                    reassessment are operational requirements — not optional add-ons. In conventional
                    stacks they are background jobs, disconnected from the onboarding record, with
                    no shared history.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  The conventional assembly
                </h3>
                <ul className="space-y-4">
                  {[
                    { system: 'Onboarding application / CRM', problem: 'Holds the record but cannot model complex branching, loop-back, or conditional sub-workflows.' },
                    { system: 'Screening API (sanctions, PEP, adverse media)', problem: 'Asynchronous results with retry logic written in application code; evidence not stored durably.' },
                    { system: 'Case management system for EDD', problem: 'Separate data model and consistency boundary; casework outcome must be reconciled back to the onboarding record.' },
                    { system: 'Audit log or compliance database', problem: 'Assembled separately — does not capture the data available at the exact moment of each decision.' },
                    { system: 'Monitoring jobs / cron tasks', problem: 'Disconnected from the onboarding lifecycle; trigger-based reassessment is custom code with no shared history.' },
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

        {/* Section 3 — How Cyoda models it */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-8">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                How Cyoda models it
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                One onboarding entity, one workflow
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                The customer case is a Cyoda entity. Its lifecycle is a workflow graph — states,
                criteria-driven transitions, attached processes, and an immutable event history all
                in one consistency model. The straight-through path stays fast; exceptions route into
                controlled case handling; approval transitions into ongoing monitoring rather than a
                dead end.
              </p>
            </div>

            {/* Workflow artifact */}
            <div className="rounded-xl overflow-hidden border border-border shadow-sm">
              <iframe
                srcDoc={kycWorkflowArtifact}
                style={{ width: '100%', height: '1380px', border: 'none', display: 'block' }}
                title="KYC Customer Onboarding Workflow"
                scrolling="no"
              />
            </div>

            {/* Callouts */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: 'Criteria on every transition',
                  detail:
                    'Each transition — ID&V pass, sanctions clear, risk threshold met — fires only when its criteria evaluate to true. The criteria are part of the workflow definition, not scattered across service code.',
                },
                {
                  label: 'Processes attach to states',
                  detail:
                    "The screening processor runs on entry to Automated ID&V. The risk-scoring processor runs on entry to Dynamic Risk Assessment. Both run inside the entity's transactional boundary — not as fire-and-forget calls.",
                },
                {
                  label: 'Ongoing monitoring is a state',
                  detail:
                    'Approval does not close the entity. It transitions into Active / Ongoing Monitoring. A monitoring alert re-enters the workflow as a named transition — not a background job reading a separate table.',
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

        {/* Section 4 — What changes when onboarding is native */}
        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              The outcome
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              What changes when onboarding is native
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

        {/* Section 5 — Why this matters in production */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                Production relevance
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Why the model matters for compliance and operations
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
                The architecture differences become concrete when a regulator asks questions, an
                internal review runs, or an exception case needs to be reconstructed.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productionItems.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6 — CTA */}
        <section className="py-20 md:py-28 bg-background border-t border-border">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="mx-auto mb-6 w-10 h-0.5 bg-primary rounded" />
            <p className="text-xl font-medium text-foreground leading-relaxed mb-8">
              If you're building or evaluating onboarding infrastructure that has to satisfy
              compliance, audit, and ongoing monitoring requirements, we'd like to talk.
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
};

export default UseCaseKycOnboarding;
