import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { organizationSchema, breadcrumbTradeSettlement } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const workflowHtml = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>One Trade entity, one workflow graph — Cyoda</title>
<meta name="viewport" content="width=1480" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root{
            --bg: #F6F4EF;
            --panel: #FFFFFF;
            --ink: #12272B;
            --ink-2: #3B5257;
            --ink-3: #6B8087;
            --ink-4: #9DAEB4;
            --rule: #E8E4D9;
            --rule-2: #EFEBDF;

            /* States */
            --state-fill: #E8F2EE;
            --state-stroke: #2F7A7B;
            --state-ink: #133E40;
            --state-active-fill: #CFE4DC;
            --state-active-stroke: #1F6061;

            /* Criteria */
            --crit-fill: #FBF1DC;
            --crit-stroke: #B87E1C;
            --crit-ink: #6E4A0E;

            /* Processes — quieter */
            --proc-fill: #F5F3ED;
            --proc-stroke: #BCC5C9;
            --proc-ink: #546268;

            /* Terminals */
            --term-fill: #F7EBE8;
            --term-stroke: #B05A4F;
            --term-ink: #6A2E26;

            /* Edges */
            --edge-main: #3E6269;
            --edge-soft: #A9B7BC;
            --edge-exc: #C99475;
            --edge-loop: #2F7A7B;
        }

        *{box-sizing:border-box}
        html,body{margin:0;padding:0;background:var(--bg);color:var(--ink);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;}
        .page{max-width:1480px;margin:0 auto;padding:56px 48px 72px}

        .eyebrow{font:600 11px/1 'Inter'; letter-spacing:.18em; text-transform:uppercase; color:#2F7A7B}
        h1{font:600 38px/1.1 'Inter'; letter-spacing:-0.02em; margin:14px 0 10px; color:var(--ink)}
        .sub{font:400 15.5px/1.55 'Inter'; color:var(--ink-2); max-width:780px; margin:0 0 32px}

        .layout{display:grid; grid-template-columns: minmax(0,1fr) 320px; gap:28px; align-items:start}

        .graphCard{
            background:var(--panel);
            border:1px solid var(--rule);
            border-radius:14px;
            box-shadow: 0 10px 24px -20px rgba(18,39,43,.22);
            padding:20px 22px 14px;
        }
        .cardHead{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px;padding:0 4px}
        .cardHead .title{display:flex;align-items:baseline;gap:10px}
        .cardHead .tag{font:600 10px/1 'Inter';letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3)}
        .cardHead .entity{font:600 14px/1 'Inter';color:var(--ink)}
        .legend{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
        .legend .chip{display:inline-flex;align-items:center;gap:7px;font:500 11px/1 'Inter';color:var(--ink-3)}
        .legend .sw{width:11px;height:11px;border-radius:3px;background:#fff;border:1.4px solid var(--ink-4)}
        .legend .sw.state{background:var(--state-fill);border-color:var(--state-stroke)}
        .legend .sw.crit{background:var(--crit-fill);border-color:var(--crit-stroke);transform:rotate(45deg);width:9px;height:9px;border-radius:1.5px}
        .legend .sw.proc{background:var(--proc-fill);border-color:var(--proc-stroke);border-style:dashed}
        .legend .sw.term{background:var(--term-fill);border-color:var(--term-stroke)}

        svg.graph{display:block;width:100%;height:auto;margin-top:4px}

        /* SVG text classes */
        .svg-state-label{font:600 14px/1 'Inter';fill:var(--state-ink)}
        .svg-state-sub{font:500 10.5px/1 'JetBrains Mono';fill:#3E6F66}
        .svg-crit-label{font:600 12px/1 'Inter';fill:var(--crit-ink)}
        .svg-proc-title{font:500 11.5px/1 'Inter';fill:var(--proc-ink)}
        .svg-proc-sub{font:500 10px/1.2 'JetBrains Mono';fill:#7E8A8F}
        .svg-term-label{font:600 13px/1 'Inter';fill:var(--term-ink)}
        .svg-edge-label{font:500 10.5px/1 'Inter';fill:#7B8C92}
        .svg-edge-label-exc{font:500 10.5px/1 'Inter';fill:#9A5F41}
        .svg-edge-label-loop{font:600 11px/1 'Inter';fill:#2F7A7B;letter-spacing:.02em}
        .svg-section{font:600 9.5px/1 'Inter';letter-spacing:.18em;text-transform:uppercase;fill:#A6B4B9}

        /* History panel (lighter chrome) */
        .historyCard{
            background:transparent;
            border:1px solid var(--rule);
            border-radius:12px;
            padding:20px 20px 18px;
        }
        .historyCard .htag{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
        .historyCard .htag .t{font:600 10px/1 'Inter';letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3)}
        .historyCard .htag .append{font:500 10px/1 'JetBrains Mono';color:#2F7A7B}
        .historyCard .trade{font:600 15px/1 'Inter';color:var(--ink);margin:2px 0 14px;letter-spacing:-0.01em}
        .histRow{display:grid;grid-template-columns:70px 1fr;gap:10px;padding:9px 0;border-top:1px solid var(--rule-2)}
        .histRow:first-of-type{border-top:none;padding-top:4px}
        .histRow .ts{font:500 11px/1.2 'JetBrains Mono';color:var(--ink-4)}
        .histRow .body .badge{display:inline-block;font:600 9.5px/1 'Inter';letter-spacing:.08em;padding:3px 6px;border-radius:3px;margin-bottom:4px;color:#1F6061;background:#E8F2EE}
        .histRow .body .badge.repair{color:#6E4A0E;background:#FBF1DC}
        .histRow .body .badge.settled{color:#0F4E3D;background:#D5E8DC}
        .histRow .body .txt{font:400 12px/1.4 'Inter';color:var(--ink-2)}
        .footnote{margin-top:14px;font:400 11px/1.5 'Inter';color:var(--ink-3)}
    </style>
</head>
<body>
<div class="page">
    <div class="eyebrow">How Cyoda models it</div>
    <h1>One Trade entity, one workflow graph</h1>
    <p class="sub">Trade settlement is not a straight line. Matching, repair, affirmation, instruction, settlement, failure, and cancellation live in one auditable workflow — with criteria, processes, and immutable history.</p>

    <div class="layout">
        <!-- GRAPH CARD -->
        <div class="graphCard">
            <div class="cardHead">
                <div class="title">
                    <span class="tag">Entity workflow</span>
                    <span class="entity">TradeSettlement</span>
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

                <!-- Lane labels (quiet) -->
                <text x="16" y="60"  class="svg-section">Intake</text>
                <text x="16" y="300" class="svg-section">Main lifecycle</text>
                <text x="16" y="590" class="svg-section">Instruction &amp; settlement</text>
                <text x="16" y="810" class="svg-section">Exceptions &amp; repair</text>

                <!-- ===================== PROCESSES (top row, quiet) ===================== -->
                <!-- Validate trade -->
                <g transform="translate(320,100)">
                    <rect width="160" height="50" rx="8" fill="#F5F3ED" stroke="#BCC5C9" stroke-width="1" stroke-dasharray="3.5 3"/>
                    <text x="14" y="20" class="svg-proc-title">Validate trade</text>
                    <text x="14" y="36" class="svg-proc-sub">schema · refs · rules</text>
                </g>
                <!-- Run matching -->
                <g transform="translate(660,100)">
                    <rect width="160" height="50" rx="8" fill="#F5F3ED" stroke="#BCC5C9" stroke-width="1" stroke-dasharray="3.5 3"/>
                    <text x="14" y="20" class="svg-proc-title">Run matching</text>
                    <text x="14" y="36" class="svg-proc-sub">counterparty · venue</text>
                </g>
                <!-- Publish report (top-right, attached to Settled by long arc) -->
                <g transform="translate(1120,100)">
                    <rect width="170" height="50" rx="8" fill="#F5F3ED" stroke="#BCC5C9" stroke-width="1" stroke-dasharray="3.5 3"/>
                    <text x="14" y="20" class="svg-proc-title">Publish report</text>
                    <text x="14" y="36" class="svg-proc-sub">MiFIR · EMIR · CAT</text>
                </g>
                <!-- Send instruction (mid row, above Instructed) -->
                <g transform="translate(660,460)">
                    <rect width="160" height="50" rx="8" fill="#F5F3ED" stroke="#BCC5C9" stroke-width="1" stroke-dasharray="3.5 3"/>
                    <text x="14" y="20" class="svg-proc-title">Send instruction</text>
                    <text x="14" y="36" class="svg-proc-sub">custodian · CSD</text>
                </g>
                <!-- Apply repair (bottom, attached to Manual review → Repaired) -->
                <g transform="translate(310,830)">
                    <rect width="160" height="50" rx="8" fill="#F5F3ED" stroke="#BCC5C9" stroke-width="1" stroke-dasharray="3.5 3"/>
                    <text x="14" y="20" class="svg-proc-title">Apply repair</text>
                    <text x="14" y="36" class="svg-proc-sub">amend · resubmit</text>
                </g>

                <!-- Process → state attach (very soft dashed ticks) -->
                <g stroke="#CBD4D8" stroke-width="1" stroke-dasharray="2.5 3" fill="none" marker-end="url(#arrSoft)">
                    <path d="M400 150 L400 200"/>
                    <path d="M740 150 L740 200"/>
                    <path d="M740 510 L740 555"/>
                    <!-- Publish report → Settled: long right-side arc, clear of everything -->
                    <path d="M1205 150 C 1380 150, 1380 590, 1290 590"/>
                    <!-- Apply repair upward to repair band -->
                    <path d="M390 830 L390 788"/>
                </g>

                <!-- ===================== TIER 1 — MAIN LIFECYCLE (y=210) ===================== -->
                <!-- Trade received -->
                <g transform="translate(70,210)" filter="url(#stateShadow)">
                    <rect width="150" height="54" rx="13" fill="#E8F2EE" stroke="#2F7A7B" stroke-width="1.4"/>
                    <text x="75" y="27" text-anchor="middle" class="svg-state-label">Trade received</text>
                    <text x="75" y="43" text-anchor="middle" class="svg-state-sub">entity created</text>
                </g>

                <!-- MAIN PATH edges (thicker, darker) -->
                <g fill="none" stroke="#3E6269" stroke-width="2" marker-end="url(#arrMain)">
                    <path d="M220 237 L320 237"/>
                    <path d="M470 237 L515 237"/>   <!-- Validating → Valid? -->
                    <path d="M625 237 L660 237"/>   <!-- Valid? → Matched -->
                    <path d="M810 237 L895 237"/>   <!-- Matched → Match ok? -->
                    <path d="M1005 237 L1060 237"/> <!-- Match ok? → Affirmed -->
                </g>

                <!-- Validating (active) -->
                <g transform="translate(320,210)" filter="url(#stateShadow)">
                    <rect width="150" height="54" rx="13" fill="#CFE4DC" stroke="#1F6061" stroke-width="1.6"/>
                    <text x="75" y="27" text-anchor="middle" class="svg-state-label">Validating</text>
                    <text x="75" y="43" text-anchor="middle" class="svg-state-sub">active</text>
                </g>

                <!-- Valid? -->
                <g transform="translate(515,210)">
                    <path d="M55 0 L110 27 L55 54 L0 27 Z" fill="#FBF1DC" stroke="#B87E1C" stroke-width="1.4"/>
                    <text x="55" y="31" text-anchor="middle" class="svg-crit-label">Valid?</text>
                </g>

                <!-- Matched -->
                <g transform="translate(660,210)" filter="url(#stateShadow)">
                    <rect width="150" height="54" rx="13" fill="#E8F2EE" stroke="#2F7A7B" stroke-width="1.4"/>
                    <text x="75" y="27" text-anchor="middle" class="svg-state-label">Matched</text>
                    <text x="75" y="43" text-anchor="middle" class="svg-state-sub">economics aligned</text>
                </g>

                <!-- Match ok? -->
                <g transform="translate(895,210)">
                    <path d="M55 0 L110 27 L55 54 L0 27 Z" fill="#FBF1DC" stroke="#B87E1C" stroke-width="1.4"/>
                    <text x="55" y="31" text-anchor="middle" class="svg-crit-label">Match ok?</text>
                </g>

                <!-- Affirmed -->
                <g transform="translate(1060,210)" filter="url(#stateShadow)">
                    <rect width="150" height="54" rx="13" fill="#E8F2EE" stroke="#2F7A7B" stroke-width="1.4"/>
                    <text x="75" y="27" text-anchor="middle" class="svg-state-label">Affirmed</text>
                    <text x="75" y="43" text-anchor="middle" class="svg-state-sub">counterparty confirmed</text>
                </g>

                <!-- Affirmed → Affirmed? (main path continues down via curve) -->
                <g fill="none" stroke="#3E6269" stroke-width="2" marker-end="url(#arrMain)">
                    <path d="M1135 264 C 1135 340, 890 340, 890 400"/>
                </g>

                <!-- Affirmed? diamond (moved left, clear of right column) -->
                <g transform="translate(830,400)">
                    <path d="M60 0 L120 28 L60 56 L0 28 Z" fill="#FBF1DC" stroke="#B87E1C" stroke-width="1.4"/>
                    <text x="60" y="32" text-anchor="middle" class="svg-crit-label">Affirmed?</text>
                </g>

                <!-- Affirmed? → Instructed (main path) -->
                <g fill="none" stroke="#3E6269" stroke-width="2" marker-end="url(#arrMain)">
                    <path d="M830 428 C 770 428, 740 555, 740 555"/>
                </g>

                <!-- ===================== TIER 2 — SETTLEMENT (y=555) ===================== -->
                <!-- Instructed -->
                <g transform="translate(660,555)" filter="url(#stateShadow)">
                    <rect width="160" height="54" rx="13" fill="#E8F2EE" stroke="#2F7A7B" stroke-width="1.4"/>
                    <text x="80" y="27" text-anchor="middle" class="svg-state-label">Instructed</text>
                    <text x="80" y="43" text-anchor="middle" class="svg-state-sub">custodian notified</text>
                </g>

                <!-- Instructed → Settle ok? → Settled (main path) -->
                <g fill="none" stroke="#3E6269" stroke-width="2" marker-end="url(#arrMain)">
                    <path d="M820 582 L895 582"/>
                    <path d="M1005 582 L1130 582"/>
                </g>

                <!-- Settle ok? -->
                <g transform="translate(895,555)">
                    <path d="M55 0 L110 27 L55 54 L0 27 Z" fill="#FBF1DC" stroke="#B87E1C" stroke-width="1.4"/>
                    <text x="55" y="31" text-anchor="middle" class="svg-crit-label">Settle ok?</text>
                </g>

                <!-- Settled (success terminal with subtle double-stroke) -->
                <g transform="translate(1130,555)" filter="url(#stateShadow)">
                    <rect width="180" height="54" rx="13" fill="#D5E8DC" stroke="#1F6061" stroke-width="1.8"/>
                    <rect x="3" y="3" width="174" height="48" rx="11" fill="none" stroke="#9EC9B2" stroke-width="0.8"/>
                    <text x="90" y="27" text-anchor="middle" class="svg-state-label" style="fill:#0F4E3D">Settled</text>
                    <text x="90" y="43" text-anchor="middle" class="svg-state-sub" style="fill:#1F6061">terminal · success</text>
                </g>

                <!-- ===================== EXCEPTION BRANCHES (soft orange, thinner) ===================== -->
                <!-- Valid? no → down to Repair requested -->
                <g fill="none" stroke="#C99475" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#arrExc)">
                    <path d="M570 264 L570 785"/>
                </g>

                <!-- Match ok? no → down -->
                <g fill="none" stroke="#C99475" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#arrExc)">
                    <path d="M950 264 L950 305 L745 305 L745 785"/>
                </g>
                <text x="755" y="298" class="svg-edge-label-exc">mismatch</text>

                <!-- Affirmed? no → down to Repair requested -->
                <g fill="none" stroke="#C99475" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#arrExc)">
                    <path d="M950 428 C 1010 428, 1010 785, 870 785"/>
                </g>
                <text x="1000" y="610" class="svg-edge-label-exc">not affirmed</text>

                <!-- Settle ok? no → Failed -->
                <g fill="none" stroke="#B05A4F" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#arrExc)">
                    <path d="M950 609 L950 700 L1130 700"/>
                </g>
                <text x="960" y="640" class="svg-edge-label-exc" style="fill:#8A4035">settlement fail</text>

                <!-- ===================== REPAIR LANE (y=785) ===================== -->
                <!-- Repair requested -->
                <g transform="translate(670,785)" filter="url(#stateShadow)">
                    <rect width="170" height="50" rx="12" fill="#FDEFE5" stroke="#C99475" stroke-width="1.4"/>
                    <text x="85" y="24" text-anchor="middle" class="svg-state-label" style="fill:#7A3F24">Repair requested</text>
                    <text x="85" y="40" text-anchor="middle" class="svg-state-sub" style="fill:#9A5F41">exception open</text>
                </g>

                <!-- Repair requested → Manual review -->
                <g fill="none" stroke="#C99475" stroke-width="1.3" marker-end="url(#arrExc)">
                    <path d="M670 810 L550 810"/>
                </g>

                <!-- Manual review -->
                <g transform="translate(390,785)" filter="url(#stateShadow)">
                    <rect width="160" height="50" rx="12" fill="#FDEFE5" stroke="#C99475" stroke-width="1.4"/>
                    <text x="80" y="24" text-anchor="middle" class="svg-state-label" style="fill:#7A3F24">Manual review</text>
                    <text x="80" y="40" text-anchor="middle" class="svg-state-sub" style="fill:#9A5F41">ops queue</text>
                </g>

                <!-- Manual review → Apply repair (down) -->
                <g fill="none" stroke="#CBD4D8" stroke-width="1" stroke-dasharray="2.5 3" marker-end="url(#arrSoft)">
                    <path d="M470 835 L390 830"/>
                </g>

                <!-- Apply repair → Repaired (long bottom arc) -->
                <g fill="none" stroke="#C99475" stroke-width="1.3" marker-end="url(#arrExc)">
                    <path d="M470 895 L140 895 L140 835"/>
                </g>

                <!-- Repaired -->
                <g transform="translate(60,785)" filter="url(#stateShadow)">
                    <rect width="160" height="50" rx="12" fill="#E8F2EE" stroke="#2F7A7B" stroke-width="1.4"/>
                    <text x="80" y="24" text-anchor="middle" class="svg-state-label">Repaired</text>
                    <text x="80" y="40" text-anchor="middle" class="svg-state-sub">ready to resubmit</text>
                </g>

                <!-- ===================== LOOP-BACK — Repaired → Validating (teal, clear) ===================== -->
                <g fill="none" stroke="#2F7A7B" stroke-width="1.6" marker-end="url(#arrLoop)">
                    <path d="M140 785 C 22 700, 22 300, 320 240"/>
                </g>
                <text transform="translate(18,520) rotate(-90)" class="svg-edge-label-loop">re-enter validation</text>

                <!-- ===================== TERMINALS ===================== -->
                <!-- Failed -->
                <g transform="translate(1130,680)" filter="url(#stateShadow)">
                    <rect width="180" height="48" rx="10" fill="#F7EBE8" stroke="#B05A4F" stroke-width="1.6"/>
                    <rect x="3" y="3" width="174" height="42" rx="8" fill="none" stroke="#B05A4F" stroke-width="0.8" stroke-dasharray="2 2"/>
                    <text x="90" y="24" text-anchor="middle" class="svg-term-label">Failed</text>
                    <text x="90" y="39" text-anchor="middle" class="svg-state-sub" style="fill:#8A4035">terminal · reported</text>
                </g>

                <!-- Cancelled -->
                <g transform="translate(1130,858)" filter="url(#stateShadow)">
                    <rect width="180" height="48" rx="10" fill="#F7EBE8" stroke="#B05A4F" stroke-width="1.6"/>
                    <rect x="3" y="3" width="174" height="42" rx="8" fill="none" stroke="#B05A4F" stroke-width="0.8" stroke-dasharray="2 2"/>
                    <text x="90" y="24" text-anchor="middle" class="svg-term-label">Cancelled</text>
                    <text x="90" y="39" text-anchor="middle" class="svg-state-sub" style="fill:#8A4035">terminal · by ops</text>
                </g>

                <!-- Manual review → Cancelled -->
                <g fill="none" stroke="#B05A4F" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#arrExc)">
                    <path d="M550 810 C 900 810, 900 882, 1130 882"/>
                </g>
                <text x="990" y="870" class="svg-edge-label-exc" style="fill:#8A4035">cancel</text>

            </svg>
        </div>

        <!-- HISTORY PANEL (secondary, lighter) -->
        <aside class="historyCard">
            <div class="htag">
                <span class="t">Immutable event history</span>
                <span class="append">append‑only</span>
            </div>
            <div class="trade">TRD‑48291</div>

            <div class="histRow">
                <div class="ts">09:14:02</div>
                <div class="body">
                    <span class="badge">RECEIVED</span>
                    <div class="txt">Trade captured from venue feed</div>
                </div>
            </div>
            <div class="histRow">
                <div class="ts">09:14:31</div>
                <div class="body">
                    <span class="badge">MATCHED</span>
                    <div class="txt">Counterparty and economics matched</div>
                </div>
            </div>
            <div class="histRow">
                <div class="ts">09:14:42</div>
                <div class="body">
                    <span class="badge repair">REPAIR_REQ</span>
                    <div class="txt">SSI mismatch detected</div>
                </div>
            </div>
            <div class="histRow">
                <div class="ts">09:17:10</div>
                <div class="body">
                    <span class="badge">REPAIRED</span>
                    <div class="txt">Corrected instructions submitted</div>
                </div>
            </div>
            <div class="histRow">
                <div class="ts">09:18:44</div>
                <div class="body">
                    <span class="badge settled">SETTLED</span>
                    <div class="txt">Confirmed · point‑in‑time reconstructable</div>
                </div>
            </div>

            <div class="footnote">Every transition appends a signed record. State at any <code style="font-family:'JetBrains Mono';color:var(--ink-2)">t</code> is reconstructable for replay or regulator.</div>
        </aside>
    </div>
</div>

  <script>
    // ----- Tweaks wiring -----
    const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
      "showSubtitle": true,
      "showLaneLabels": true,
      "accent": "teal",
      "density": "default"
    }/*EDITMODE-END*/;

    const state = Object.assign({}, TWEAK_DEFAULTS);

    function apply(){
      document.getElementById('subtitle').style.display = state.showSubtitle ? '' : 'none';
      document.querySelectorAll('.svg-section').forEach(el=>{
        el.style.display = state.showLaneLabels ? '' : 'none';
      });
      const accents = {
        teal:   {stroke:'#2F7A7B', ink:'#133E40', fill:'#E8F2EE', active:'#C9E3D9', activeStroke:'#1F6061'},
        forest: {stroke:'#2F6A47', ink:'#17402A', fill:'#E8F1EA', active:'#CFE4D4', activeStroke:'#24553A'},
        slate:  {stroke:'#405A63', ink:'#1B2B31', fill:'#ECF0F2', active:'#D5DEE2', activeStroke:'#2D434B'},
      };
      const a = accents[state.accent] || accents.teal;
      document.documentElement.style.setProperty('--state-stroke', a.stroke);
      document.documentElement.style.setProperty('--state-fill', a.fill);
      document.documentElement.style.setProperty('--state-ink', a.ink);
      document.documentElement.style.setProperty('--state-active-fill', a.active);
      document.documentElement.style.setProperty('--state-active-stroke', a.activeStroke);
      // re-paint SVG state rects
      document.querySelectorAll('svg.graph g > rect[fill="#E8F2EE"]').forEach(r=>r.setAttribute('fill', a.fill));
      document.querySelectorAll('svg.graph g > rect[stroke="#2F7A7B"]').forEach(r=>r.setAttribute('stroke', a.stroke));

      // density
      document.querySelector('.page').style.padding = state.density==='compact' ? '40px 36px 56px' : '';
    }
    apply();

    function toggleSw(id, key){
      const el = document.getElementById(id);
      el.addEventListener('click',()=>{
        state[key] = !state[key];
        el.classList.toggle('on', state[key]);
        apply();
        window.parent.postMessage({type:'__edit_mode_set_keys', edits:{[key]: state[key]}},'*');
      });
    }
    toggleSw('tw-sub','showSubtitle');
    toggleSw('tw-lanes','showLaneLabels');
    document.getElementById('tw-accent').value = state.accent;
    document.getElementById('tw-accent').addEventListener('change', e=>{
      state.accent = e.target.value; apply();
      window.parent.postMessage({type:'__edit_mode_set_keys', edits:{accent: state.accent}},'*');
    });
    document.getElementById('tw-density').value = state.density;
    document.getElementById('tw-density').addEventListener('change', e=>{
      state.density = e.target.value; apply();
      window.parent.postMessage({type:'__edit_mode_set_keys', edits:{density: state.density}},'*');
    });

    // edit-mode protocol
    window.addEventListener('message', (ev)=>{
      const t = ev.data && ev.data.type;
      if(t === '__activate_edit_mode') document.getElementById('tweaks').classList.add('on');
      if(t === '__deactivate_edit_mode') document.getElementById('tweaks').classList.remove('on');
    });
    window.parent.postMessage({type:'__edit_mode_available'}, '*');
  </script>
</body>
</html>
`;

const checkpoints = [
  'Every trade transition is an immutable, timestamped event in one workflow graph',
  'Point-in-time reconstruction of any trade at any historical moment without a data warehouse',
  'Distributed reporting runs directly against transactional history — no ETL pipeline required',
  'Repair, affirmation, failure, and cancellation stay inside one auditable entity lifecycle',
  'Concurrent write conflicts are resolved at the platform level, not in application code',
  'Regulator-ready history is generated directly from the entity workflow itself',
];

const UseCaseTradeSettlement = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Trade Settlement & Regulatory Reporting | Cyoda"
        description="Cyoda models trade settlement as one entity workflow with immutable, queryable history — so regulatory reconstruction does not depend on an ETL pipeline or warehouse copy."
        url="https://cyoda.com/use-cases/trade-settlement"
        type="website"
        jsonLd={[organizationSchema, breadcrumbTradeSettlement]}
      />
      <Header />
      <main>
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-4xl">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                USE CASE
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Trade settlement and regulatory reporting
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                Trade settlement is not a straight line. Cyoda keeps matching, repair, affirmation,
                instruction, settlement, failure, and cancellation in one auditable workflow with
                immutable history and point-in-time reconstruction.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              THE PROBLEM
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Every trade state is a regulatory event
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              Validation failures, matching exceptions, repair loops, affirmation, settlement,
              cancellation, and failure all matter for operations and reporting. Most teams split
              workflow, transactional state, and regulatory reconstruction across multiple systems,
              then depend on ETL and copied data to explain what happened.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              HOW CYODA SOLVES IT
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              One trade entity, one workflow graph
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl leading-relaxed mb-8">
              Each trade is a Cyoda entity. Its lifecycle is a real workflow graph with states,
              criteria, attached processes, exception branches, loop-backs, and immutable event
              history. Reporting runs directly on that transactional history — no ETL pipeline, no
              warehouse copy required.
            </p>

            <div className="rounded-2xl border border-border/60 overflow-hidden shadow-sm bg-card">
              <iframe
                title="Trade settlement workflow graph"
                srcDoc={workflowHtml}
                className="w-full"
                style={{ height: '980px', border: 0, background: 'transparent' }}
              />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-[hsl(var(--section-alt-bg))]">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              What changes when history is native
            </h2>
            <div className="max-w-3xl space-y-4">
              {checkpoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to eliminate the ETL pipeline?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Start with a free evaluation or talk to the team about your regulatory, reporting,
              and settlement workflow requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground px-8 font-semibold"
                onClick={() => window.open('https://ai.cyoda.net', '_blank')}
              >
                Start your evaluation
              </Button>
              <Button size="lg" variant="outline" className="px-8 font-semibold" asChild>
                <Link to="/contact">Talk to the team</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UseCaseTradeSettlement;
