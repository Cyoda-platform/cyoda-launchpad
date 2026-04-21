import { useCallback, useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbAgenticAi } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const workflowHtml = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Agentic AI RegulatedActionCase workflow graph</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --canvas: transparent;
    --panel: #ffffff;
    --hair: oklch(92% 0.006 230);
    --hair-2: oklch(88% 0.006 230);
    --ink: oklch(22% 0.012 230);
    --ink-muted: oklch(46% 0.012 230);
    --ink-soft: oklch(62% 0.012 230);
    --state-fill: oklch(96.5% 0.022 180);
    --state-border: oklch(72% 0.06 180);
    --state-ink: oklch(32% 0.05 190);
    --dec-fill: oklch(95.5% 0.04 85);
    --dec-border: oklch(74% 0.09 75);
    --dec-ink: oklch(38% 0.08 60);
    --proc-fill: oklch(99% 0.002 230);
    --proc-border: oklch(80% 0.008 230);
    --proc-ink: oklch(40% 0.012 230);
    --term-fill: oklch(96% 0.022 25);
    --term-border: oklch(74% 0.08 25);
    --term-ink: oklch(40% 0.09 25);
    --edge: oklch(72% 0.012 230);
    --edge-stp: oklch(55% 0.05 190);
    --edge-alt: oklch(68% 0.06 75);
    --edge-loop: oklch(60% 0.05 190);
  }

  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    background: var(--canvas);
    color: var(--ink);
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    font-feature-settings: "cv11","ss01","ss03";
    overflow: hidden;
  }

  .frame {
    max-width: none;
    margin: 0;
    padding: 0;
  }

  .stage {
    background: var(--panel);
    border: 1px solid var(--hair);
    border-radius: 14px;
    box-shadow: 0 1px 0 rgba(16,24,40,0.02), 0 24px 60px -40px rgba(16,24,40,0.12);
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    overflow: hidden;
  }

  .graph {
    position: relative;
    padding: 22px 22px 18px 22px;
    border-right: 1px solid var(--hair);
    background:
      radial-gradient(1100px 520px at 40% 40%, oklch(99% 0.003 230) 0%, transparent 70%),
      var(--panel);
  }

  .graph-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 2px 6px 14px;
  }
  .graph-header .title {
    display:flex;
    align-items:center;
    gap:10px;
    font-size: 12px;
    font-weight: 600;
    color: var(--ink);
    letter-spacing: 0.02em;
    white-space: nowrap;
  }
  .graph-header .title .sq {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background: var(--state-fill);
    border:1px solid var(--state-border);
  }
  .legend {
    display: flex;
    gap: 14px;
    font-size: 11px;
    color: var(--ink-muted);
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .legend .chip { display:inline-flex; align-items:center; gap:6px; }
  .legend .swatch { width:10px; height:10px; border-radius:3px; border:1px solid var(--hair-2); }
  .legend .swatch.state { background: var(--state-fill); border-color: var(--state-border); }
  .legend .swatch.dec { background: var(--dec-fill); border-color: var(--dec-border); transform: rotate(45deg); border-radius:1px;}
  .legend .swatch.proc { background: var(--proc-fill); border-color: var(--proc-border); border-style: dashed;}
  .legend .swatch.term { background: var(--term-fill); border-color: var(--term-border); }

  svg { display: block; width: 100%; height: auto; }
  .node text { font-family: 'Inter', sans-serif; fill: var(--ink); }
  .node .label { font-size: 12.5px; font-weight: 600; letter-spacing: -0.005em; }
  .state-rect { fill: var(--state-fill); stroke: var(--state-border); stroke-width: 1.25; }
  .state-rect.primary { stroke-width: 1.5; filter: url(#stateShadow); }
  .state-text { fill: var(--state-ink); }
  .state-tag { font-size: 9.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; fill: oklch(52% 0.05 190); }
  .dec-shape { fill: var(--dec-fill); stroke: var(--dec-border); stroke-width: 1.25; }
  .dec-text { fill: var(--dec-ink); font-size: 11px; font-weight: 600; }
  .proc-rect { fill: var(--proc-fill); stroke: var(--proc-border); stroke-width: 1; stroke-dasharray: 4 3;}
  .proc-text { fill: var(--proc-ink); font-size: 10.5px; font-weight: 500; }
  .proc-kicker { font-size: 9px; font-weight:600; letter-spacing: 0.1em; text-transform: uppercase; fill: var(--ink-soft);}
  .term-rect { fill: var(--term-fill); stroke: var(--term-border); stroke-width: 1.25; }
  .term-text { fill: var(--term-ink); font-size: 12px; font-weight: 600; }
  .term-tag { font-size: 9.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; fill: oklch(55% 0.08 25); }
  .edge { fill: none; stroke: var(--edge); stroke-width: 1.25; }
  .edge.stp { stroke: var(--edge-stp); stroke-width: 2; }
  .edge.alt { stroke: var(--edge-alt); stroke-width: 1.4; }
  .edge.term { stroke: oklch(70% 0.06 25); stroke-width: 1.3; }
  .edge.loop { stroke: var(--edge-loop); stroke-width: 1.4; stroke-dasharray: 5 4; }
  .edge-label {
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.02em;
    fill: var(--ink-muted);
  }
  .edge-label-bg { fill: #fff; stroke: var(--hair); stroke-width: 0.75;}

  .rail {
    padding: 22px;
    background: linear-gradient(180deg, #fff 0%, oklch(99% 0.003 230) 100%);
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 100%;
  }
  .rail h3 {
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .rail h3 .pulse {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--state-border);
    box-shadow: 0 0 0 0 oklch(72% 0.06 180 / 0.4);
    animation: pulse 2.4s infinite;
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 oklch(72% 0.06 180 / 0.35); }
    70% { box-shadow: 0 0 0 8px oklch(72% 0.06 180 / 0); }
    100% { box-shadow: 0 0 0 0 oklch(72% 0.06 180 / 0); }
  }
  .rail .lede {
    font-size: 12.5px;
    line-height: 1.5;
    color: var(--ink-muted);
    margin: -4px 0 6px;
  }
  .entity-card {
    border: 1px solid var(--hair);
    border-radius: 10px;
    padding: 12px 14px;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .entity-card .k { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); font-weight: 600;}
  .entity-card .v {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    color: var(--ink);
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid var(--hair);
    background: oklch(98% 0.003 230);
    font-size: 10.5px;
    color: var(--ink-muted);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-family: 'Inter', sans-serif;
  }
  .log .head .count {
    color: var(--ink);
    background: #fff;
    border: 1px solid var(--hair);
    border-radius: 4px;
    padding: 2px 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    letter-spacing: 0.02em;
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
  .log li.ev-edd .g { background: var(--dec-border); }
  .log li.ev-warn .g { background: var(--term-border); }
  .log li.ev-ok .g { background: oklch(66% 0.09 160); }
  .log li .e { color: var(--ink); font-weight: 600; letter-spacing: 0.02em; }
  .log li .e .meta-l { color: var(--ink-soft); font-weight: 500; letter-spacing: 0; }
  .log li::before {
    content: "";
    position: absolute;
    left: calc(62px + 10px + 5px - 0.5px);
    top: 0;
    bottom: -1px;
    width: 1px;
    background: var(--hair-2);
  }
  .log li:first-child::before { top: 50%; }
  .log li:last-child::before { bottom: 50%; }
  .principles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .principles .p {
    border: 1px solid var(--hair);
    border-radius: 8px;
    padding: 10px 12px;
    background: #fff;
  }
  .principles .p .k {
    font-size: 9.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-soft);
    font-weight: 700;
    margin-bottom: 4px;
  }
  .principles .p .v {
    font-size: 11.5px;
    color: var(--ink);
    font-weight: 500;
    line-height: 1.35;
  }
  .boundary-tag {
    font-family: 'Inter', sans-serif;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    fill: var(--ink-soft);
  }

  @media (max-width: 1180px) {
    .stage { grid-template-columns: 1fr; }
    .graph { border-right: 0; border-bottom: 1px solid var(--hair); }
  }

  @media (max-width: 720px) {
    .graph, .rail { padding: 16px; }
    .graph-header { align-items: flex-start; flex-direction: column; }
    .legend { justify-content: flex-start; }
    .principles { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<div class="frame">
  <section class="stage">
    <div class="graph">
      <div class="graph-header">
        <div class="title"><span class="sq"></span> Workflow graph · operational view</div>
        <div class="legend">
          <span class="chip"><span class="swatch state"></span> State</span>
          <span class="chip"><span class="swatch dec"></span> Criterion</span>
          <span class="chip"><span class="swatch proc"></span> Process</span>
          <span class="chip"><span class="swatch term"></span> Terminal</span>
        </div>
      </div>

      <svg viewBox="0 0 1120 760" role="img" aria-labelledby="graph-title">
        <title id="graph-title">Agentic AI RegulatedActionCase workflow graph</title>

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

        <rect x="0" y="0" width="1120" height="760" fill="url(#grid)"/>

        <g font-family="Inter" font-size="9.5" letter-spacing="0.14em" font-weight="600" fill="var(--ink-soft)">
          <text x="16" y="120" style="text-transform:uppercase">AI PROPOSAL · PROBABILISTIC</text>
          <text x="16" y="310" style="text-transform:uppercase">CYODA-GOVERNED DETERMINISTIC PATH</text>
          <text x="16" y="560" style="text-transform:uppercase">HUMAN OVERSIGHT · EXCEPTIONS · TERMINALS</text>
        </g>
        <line x1="12" y1="126" x2="1104" y2="126" stroke="var(--hair-2)" stroke-dasharray="2 4"/>
        <line x1="12" y1="316" x2="1104" y2="316" stroke="var(--hair)" stroke-dasharray="2 4"/>
        <line x1="12" y1="566" x2="1104" y2="566" stroke="var(--hair-2)" stroke-dasharray="2 4"/>
        <rect x="12" y="130" width="1092" height="80" fill="oklch(99% 0.006 85)" opacity="0.55"/>
        <text class="boundary-tag" x="1094" y="150" text-anchor="end">AI does not mutate production state</text>

        <path class="edge stp" d="M 140,360 L 170,360" marker-end="url(#arrow-stp)"/>
        <path class="edge stp" d="M 310,360 L 314,360"/>
        <path class="edge stp" d="M 386,360 L 400,360" marker-end="url(#arrow-stp)"/>
        <path class="edge stp" d="M 530,360 L 534,360"/>
        <path class="edge stp" d="M 596,360 L 610,360" marker-end="url(#arrow-stp)"/>
        <path class="edge stp" d="M 720,360 L 750,360" marker-end="url(#arrow-stp)"/>
        <path class="edge stp" d="M 860,360 L 864,360"/>
        <path class="edge stp" d="M 926,360 L 940,360" marker-end="url(#arrow-stp)"/>
        <path class="edge" d="M 1015,330 C 1015,280 1015,240 1015,220" marker-end="url(#arrow)"/>
        <path class="edge alt" d="M 350,384 L 350,470 L 350,620 L 360,620" marker-end="url(#arrow-alt)"/>
        <path class="edge alt" d="M 565,384 L 565,470 L 540,470 L 540,620" marker-end="url(#arrow-alt)"/>
        <path class="edge term" d="M 565,336 L 565,310 L 610,310 L 1015,310 L 1015,620" marker-end="url(#arrow-term)"/>
        <path class="edge alt" d="M 640,620 L 720,620 L 720,470 L 655,470 L 655,390" marker-end="url(#arrow-alt)"/>
        <path class="edge term" d="M 500,650 L 500,700 L 880,700" marker-end="url(#arrow-term)"/>
        <path class="edge term" d="M 895,384 L 895,475 L 910,475 L 910,620" marker-end="url(#arrow-term)"/>
        <path class="edge loop" d="M 930,185 C 820,185 700,110 465,110 L 465,330" marker-end="url(#arrow-loop)"/>

        <g class="node" transform="translate(30,330)">
          <rect class="state-rect primary" x="0" y="0" width="110" height="60" rx="10"/>
          <text class="state-tag" x="12" y="18">State · Start</text>
          <text class="state-text label" x="12" y="42">Case Opened</text>
        </g>
        <g class="node" transform="translate(152,156)">
          <rect class="proc-rect" x="0" y="0" width="176" height="40" rx="6"/>
          <text class="proc-kicker" x="12" y="15">AI · Probabilistic</text>
          <text class="proc-text" x="12" y="30">Generate action proposal</text>
        </g>
        <path d="M 240,196 L 240,260 L 240,260 L 240,330" fill="none" stroke="var(--dec-border)" stroke-width="1" stroke-dasharray="3 3" opacity="0.8"/>
        <circle cx="240" cy="196" r="2.5" fill="var(--dec-border)"/>
        <g class="node" transform="translate(170,330)">
          <rect class="state-rect primary" x="0" y="0" width="140" height="60" rx="10"/>
          <text class="state-tag" x="12" y="18">State · Captured</text>
          <text class="state-text label" x="12" y="42">Action Proposed</text>
        </g>
        <g class="node" transform="translate(350,360)">
          <polygon class="dec-shape" points="0,-24 36,0 0,24 -36,0"/>
          <text class="dec-text" text-anchor="middle" dy="-1" font-size="10">Proposal</text>
          <text class="dec-text" text-anchor="middle" dy="11" font-size="10">credible?</text>
        </g>
        <g class="node" transform="translate(400,330)">
          <rect class="state-rect primary" x="0" y="0" width="130" height="60" rx="10"/>
          <text class="state-tag" x="12" y="18">State · Gate</text>
          <text class="state-text label" x="12" y="42">Policy Validation</text>
        </g>
        <g class="node" transform="translate(404,396)">
          <rect class="proc-rect" x="0" y="0" width="122" height="18" rx="4"/>
          <text class="proc-kicker" x="61" y="12" text-anchor="middle">VALIDATE POLICY · AUTHORITY</text>
        </g>
        <g class="node" transform="translate(565,360)">
          <polygon class="dec-shape" points="0,-24 31,0 0,24 -31,0"/>
          <text class="dec-text" text-anchor="middle" dy="-1" font-size="10">Policy</text>
          <text class="dec-text" text-anchor="middle" dy="11" font-size="10">clear?</text>
        </g>
        <g class="node" transform="translate(610,330)">
          <rect class="state-rect primary" x="0" y="0" width="110" height="60" rx="10"/>
          <text class="state-tag" x="12" y="18">State · Cleared</text>
          <text class="state-text label" x="12" y="42">Authorized</text>
        </g>
        <g class="node" transform="translate(750,330)">
          <rect class="state-rect primary" x="0" y="0" width="110" height="60" rx="10"/>
          <text class="state-tag" x="12" y="18">State · Deterministic</text>
          <text class="state-text label" x="12" y="42">Executing</text>
        </g>
        <g class="node" transform="translate(754,396)">
          <rect class="proc-rect" x="0" y="0" width="102" height="18" rx="4"/>
          <text class="proc-kicker" x="51" y="12" text-anchor="middle">EXECUTE APPROVED ACTION</text>
        </g>
        <g class="node" transform="translate(895,360)">
          <polygon class="dec-shape" points="0,-24 31,0 0,24 -31,0"/>
          <text class="dec-text" text-anchor="middle" dy="-1" font-size="10">Execution</text>
          <text class="dec-text" text-anchor="middle" dy="11" font-size="10">succeeded?</text>
        </g>
        <g class="node" transform="translate(940,330)">
          <rect class="state-rect primary" x="0" y="0" width="150" height="60" rx="10"/>
          <text class="state-tag" x="12" y="18">State · Committed</text>
          <text class="state-text label" x="12" y="42">Outcome Recorded</text>
        </g>
        <g class="node" transform="translate(945,396)">
          <rect class="proc-rect" x="0" y="0" width="140" height="18" rx="4"/>
          <text class="proc-kicker" x="70" y="12" text-anchor="middle">RECORD IMMUTABLE OUTCOME</text>
        </g>
        <g class="node" transform="translate(930,150)">
          <rect class="state-rect primary" x="0" y="0" width="160" height="70" rx="12" stroke-width="1.8"/>
          <text class="state-tag" x="12" y="18" fill="oklch(40% 0.09 190)">State · Persistent</text>
          <text class="state-text label" x="12" y="38">Monitoring /</text>
          <text class="state-text label" x="12" y="54">Reassessment</text>
          <circle cx="142" cy="22" r="4" fill="oklch(70% 0.12 160)"/>
          <circle cx="142" cy="22" r="7" fill="none" stroke="oklch(70% 0.12 160 / 0.4)" stroke-width="1"/>
        </g>
        <g class="node" transform="translate(360,590)">
          <rect class="state-rect" x="0" y="0" width="280" height="60" rx="10" fill="var(--dec-fill)" stroke="var(--dec-border)"/>
          <text class="state-tag" x="14" y="18" fill="var(--dec-ink)">State · Human-in-the-loop</text>
          <text class="state-text label" x="14" y="38" fill="var(--dec-ink)">Escalated Review</text>
          <text class="state-text" x="14" y="53" font-size="10" fill="var(--dec-ink)" opacity="0.8">maker-checker workbench · policy &amp; authority review</text>
        </g>
        <g class="node" transform="translate(398,656)">
          <rect class="proc-rect" x="0" y="0" width="204" height="18" rx="4"/>
          <text class="proc-kicker" x="102" y="12" text-anchor="middle">REQUEST HUMAN AUTHORIZATION</text>
        </g>
        <g class="node" transform="translate(880,620)">
          <rect class="term-rect" x="0" y="0" width="150" height="56" rx="10"/>
          <text class="term-tag" x="14" y="18">Terminal</text>
          <text class="term-text" x="14" y="40">Blocked / Rejected</text>
        </g>
        <g class="node" transform="translate(840,448)">
          <rect class="term-rect" x="0" y="0" width="140" height="54" rx="10" fill="oklch(97% 0.012 40)" stroke="oklch(78% 0.05 50)"/>
          <text class="term-tag" x="14" y="18" fill="oklch(48% 0.06 50)">Terminal</text>
          <text class="term-text" x="14" y="40" fill="oklch(42% 0.06 50)">Rolled Back</text>
        </g>
        <g class="node" transform="translate(842,508)">
          <rect class="proc-rect" x="0" y="0" width="136" height="18" rx="4" stroke="oklch(78% 0.05 50)"/>
          <text class="proc-kicker" x="68" y="12" text-anchor="middle" fill="oklch(48% 0.06 50)">ROLLBACK · COMPENSATE</text>
        </g>

        <g font-family="Inter">
          <g transform="translate(735,350)"><rect class="edge-label-bg" x="-38" y="-10" width="76" height="18" rx="9"/><text class="edge-label" text-anchor="middle" dy="3">authorized</text></g>
          <g transform="translate(1015,275)"><rect class="edge-label-bg" x="-36" y="-10" width="72" height="18" rx="9"/><text class="edge-label" text-anchor="middle" dy="3">persist</text></g>
          <g transform="translate(350,470)"><rect class="edge-label-bg" x="-44" y="-10" width="88" height="18" rx="9"/><text class="edge-label" text-anchor="middle" dy="3">low confidence</text></g>
          <g transform="translate(565,470)"><rect class="edge-label-bg" x="-48" y="-10" width="96" height="18" rx="9"/><text class="edge-label" text-anchor="middle" dy="3">manual approval</text></g>
          <g transform="translate(720,528)"><rect class="edge-label-bg" x="-36" y="-10" width="72" height="18" rx="9"/><text class="edge-label" text-anchor="middle" dy="3">approved</text></g>
          <g transform="translate(650,300)"><rect class="edge-label-bg" x="-44" y="-10" width="88" height="18" rx="9"/><text class="edge-label" text-anchor="middle" dy="3">policy reject</text></g>
          <g transform="translate(700,692)"><rect class="edge-label-bg" x="-34" y="-10" width="68" height="18" rx="9"/><text class="edge-label" text-anchor="middle" dy="3">blocked</text></g>
          <g transform="translate(895,440)"><rect class="edge-label-bg" x="-48" y="-10" width="96" height="18" rx="9"/><text class="edge-label" text-anchor="middle" dy="3">execution failed</text></g>
          <g transform="translate(700,100)"><rect class="edge-label-bg" x="-56" y="-10" width="112" height="18" rx="9"/><text class="edge-label" text-anchor="middle" dy="3">monitoring alert · reassess</text></g>
        </g>

        <g font-family="Inter">
          <text x="1094" y="76" text-anchor="end" font-size="10.5" font-weight="600" fill="var(--edge-loop)" letter-spacing="0.04em" style="text-transform:uppercase">reassessment loop</text>
          <text x="1094" y="92" text-anchor="end" font-size="10" fill="var(--ink-soft)">Outcomes remain observable. Signals reopen evaluation.</text>
          <text x="16" y="248" font-size="10" font-weight="600" fill="var(--ink-soft)" letter-spacing="0.02em">Proposal is captured as an immutable case payload — never a direct mutation.</text>
        </g>
      </svg>
    </div>

    <aside class="rail">
      <h3><span class="pulse"></span> Immutable event history</h3>
      <p class="lede">Every transition is recorded as a point-in-time event against the <b>RegulatedActionCase</b> entity. Proposal, policy gates, authorization path, and execution result are reconstructable at any historical moment.</p>

      <div class="entity-card">
        <div class="r"><span class="k">Entity</span><span class="v">RegulatedActionCase</span></div>
        <div class="r"><span class="k">ID</span><span class="v">rac_01JR8T…M29P</span></div>
        <div class="r"><span class="k">Current state</span><span class="v" style="color:var(--state-ink)">monitoring_reassessment</span></div>
        <div class="r"><span class="k">Action</span><span class="v">hold &amp; escalate · AML-L2</span></div>
      </div>

      <div class="log" aria-label="Event log">
        <div class="head"><span>Event stream</span><span class="count">10 · v0.1</span></div>
        <ol>
          <li><span class="t">T+00:00</span><span class="g"></span><span class="e">CASE_OPENED <span class="meta-l">· alert.txn_monitor</span></span></li>
          <li class="ev-edd"><span class="t">T+00:02</span><span class="g"></span><span class="e">ACTION_PROPOSED <span class="meta-l">· ai.agent v4 · conf 0.82</span></span></li>
          <li class="ev-ok"><span class="t">T+00:04</span><span class="g"></span><span class="e">POLICY_VALIDATED <span class="meta-l">· rulebook AML-2026.03</span></span></li>
          <li class="ev-edd"><span class="t">T+00:06</span><span class="g"></span><span class="e">ESCALATED_REVIEW <span class="meta-l">· threshold &gt; €100k</span></span></li>
          <li class="ev-ok"><span class="t">T+04:41</span><span class="g"></span><span class="e">AUTHORIZED <span class="meta-l">· reviewer.ortiz</span></span></li>
          <li><span class="t">T+04:42</span><span class="g"></span><span class="e">EXECUTION_STARTED <span class="meta-l">· hold.apply</span></span></li>
          <li class="ev-ok"><span class="t">T+04:44</span><span class="g"></span><span class="e">EXECUTION_COMPLETED <span class="meta-l">· deterministic</span></span></li>
          <li class="ev-ok"><span class="t">T+04:44</span><span class="g"></span><span class="e">OUTCOME_RECORDED <span class="meta-l">· snapshot sha‑256</span></span></li>
          <li class="ev-warn"><span class="t">D+21</span><span class="g"></span><span class="e">MONITORING_ALERT <span class="meta-l">· linked party · SAR draft</span></span></li>
          <li><span class="t">D+21</span><span class="g"></span><span class="e">CASE_REASSESSED <span class="meta-l">· re‑entered policy</span></span></li>
        </ol>
      </div>

      <div class="principles">
        <div class="p"><div class="k">AI proposes</div><div class="v">Probabilistic rationale captured as payload — never a direct mutation.</div></div>
        <div class="p"><div class="k">Cyoda governs</div><div class="v">Deterministic execution behind policy, authority, and maker‑checker gates.</div></div>
        <div class="p"><div class="k">Append-only</div><div class="v">Events are never mutated; corrections are new events.</div></div>
        <div class="p"><div class="k">Point-in-time</div><div class="v">Re‑derive proposal, gate, and outcome from the event prefix.</div></div>
      </div>
    </aside>
  </section>
</div>
</body>
</html>`;

const workflowNativeChanges = [
  'Agent output becomes a proposal, not an uncontrolled side effect.',
  'Every proposed action is evaluated against policy before execution.',
  'Low-risk actions can flow through without sacrificing auditability.',
  'Human approval is built into the lifecycle where risk or policy requires it.',
  'Execution, rollback, exception handling, and escalation live in one case history.',
  'The action record is reconstructable at any point in time.',
];

const productionControls = [
  {
    title: 'Snapshot reconstruction for explainability',
    body:
      'Teams can reconstruct the exact case state, evidence, model proposal, policy result, and operator decision at the moment an action was proposed or executed.',
  },
  {
    title: 'Governed authorization',
    body:
      'An AI recommendation does not equal direct production mutation. Permissions, approvals, segregation of duties, and operator override remain part of the write path.',
  },
  {
    title: 'Rollback, exception, and retry discipline',
    body:
      'Failed or contested actions move through explicit states. Retries, rollbacks, escalations, and reassessment are workflow behavior, not scattered log analysis.',
  },
  {
    title: 'Less custom governance plumbing',
    body:
      'Firms do not need to build a bespoke event-sourced control layer around every promising agentic prototype just to make it safe for production.',
  },
];

const AgenticWorkflowEmbed = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState(900);

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
    <div className="overflow-hidden rounded-[14px]">
      <iframe
        ref={iframeRef}
        title="Agentic AI regulated action case workflow graph"
        srcDoc={workflowHtml}
        className="w-full"
        style={{ height: `${iframeHeight}px`, border: 0, background: 'transparent' }}
        scrolling="no"
        onLoad={syncIframeHeight}
      />
    </div>
  );
};

const UseCaseAgenticAi = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Agentic AI for Regulated Industries | Cyoda"
        description="AI agent actions need platform-level consistency. Cyoda gives every agent action an immutable audit trail within the same entity consistency model."
        url="https://cyoda.com/use-cases/agentic-ai"
        type="website"
        jsonLd={[organizationSchema, breadcrumbAgenticAi]}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Use case · Agentic AI
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 max-w-4xl leading-tight">
              Govern agentic actions before they touch regulated production
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              AI can classify, prioritize, explain, and propose. In regulated systems, the action
              still needs deterministic execution: policy gates, approval paths, controlled
              processes, immutable history, and point-in-time reconstruction. Cyoda provides that
              governed action layer.
            </p>
          </div>
        </section>

        {/* The production bottleneck */}
        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                  The problem
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
                  Prototypes can suggest actions. Production must govern them.
                </h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Agentic prototypes are easy to demo: a model reads an AML or
                    transaction-monitoring case, drafts a rationale, and recommends closure,
                    escalation, outreach, or remediation.
                  </p>
                  <p>
                    The hard part starts when that recommendation could affect production state.
                    The write path needs policy gating, maker-checker controls, permissions,
                    safe retries, rollback behavior, and human oversight where risk requires it.
                  </p>
                  <p>
                    Chat logs, prompt traces, and tool-call transcripts are not the same as
                    regulator-grade reconstruction. Teams need to know what the case looked like,
                    what evidence was available, who authorized the action, and what state changed.
                  </p>
                </div>
              </div>

              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Where teams get stuck
                  </h3>
                  <ul className="space-y-4">
                    {[
                      'Model output sits outside the system-of-record lifecycle.',
                      'Approvals and segregation of duties are bolted on after the prototype.',
                      'Retries and rollbacks live in queues, logs, scripts, or manual runbooks.',
                      'Audit requires stitching together prompts, tool traces, database state, and operator notes.',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Workflow framing */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-8">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                How Cyoda models it
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                One RegulatedActionCase, one governed workflow
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
                In an agent-assisted AML or transaction-monitoring workflow, the model can propose
                a classification, rationale, or next action. Cyoda records that proposal inside a
                case entity, evaluates criteria, routes authorization, executes approved actions
                through attached processes, and appends immutable history for reconstruction.
              </p>
            </div>

            <AgenticWorkflowEmbed />
          </div>
        </section>

        {/* Workflow-native outcomes */}
        <section className="py-16 md:py-20 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              The outcome
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              What changes when action is workflow-native
            </h2>
            <div className="max-w-3xl space-y-4">
              {workflowNativeChanges.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Regulated production */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Regulated production
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Why this matters once agents leave the pilot
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {productionControls.map((item) => (
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
              If you are moving an agentic workflow from demo to regulated production, we can help
              map the action lifecycle, control points, and audit requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="px-8 font-semibold" asChild>
                <Link to="/contact">Talk to us</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 font-semibold" asChild>
                <a href="https://ai.cyoda.net">Start an evaluation</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UseCaseAgenticAi;
