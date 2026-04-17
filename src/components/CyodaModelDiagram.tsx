/**
 * CyodaModelDiagram
 *
 * Inline SVG diagram showing Cyoda EDBMS as a single integrated model.
 * Five outer nodes (Entity State, Workflows, Transactions, Events, History)
 * connect to a dominant central node via solid spokes.
 *
 * Radial pentagon layout. All positions hardcoded for precise control.
 * Responsive via viewBox scaling — no JS required.
 *
 * Geometry
 * ─────────
 * ViewBox  : 540 × 370
 * Center   : CX=270, CY=200
 * Radius   : 160  (increased from 112 to clear all node edges with ~29 px gap)
 *
 * Outer node positions (r=160, angles from 12 o'clock clockwise):
 *   Entity State   90°  → (270,  40)
 *   Workflows      18°  → (422, 151)
 *   Transactions  306°  → (364, 329)
 *   History       234°  → (176, 329)
 *   Events        162°  → (118, 151)
 *
 * Clearance verification (outer node half-width=54, center half-width=69):
 *   Events right    172  →  center left  201  gap = 29 px ✓
 *   Workflows left  368  →  center right 339  gap = 29 px ✓
 *   Entity State bottom 59  → center top 173  gap = 114 px ✓
 *   Transactions top   310  → center bottom 227  gap = 83 px ✓
 *   History top        310  → center bottom 227  gap = 83 px ✓
 *   History right      230  → Transactions left 310  gap = 80 px ✓
 */

const CX = 270;
const CY = 200;

const outerNodes = [
  { x: 270, y:  40, label: 'Entity State' },
  { x: 422, y: 151, label: 'Workflows'    },
  { x: 364, y: 329, label: 'Transactions' },
  { x: 176, y: 329, label: 'History'      },
  { x: 118, y: 151, label: 'Events'       },
];

// Outer node pill: 108 wide × 38 tall, rx=10  (unchanged)
const OW = 108;
const OH = 38;

// Center node rect: 138 wide × 54 tall, rx=12  (unchanged)
const NW = 138;
const NH = 54;

const CyodaModelDiagram = () => (
  <svg
    viewBox="0 0 540 370"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-labelledby="cyoda-model-title cyoda-model-desc"
    className="w-full max-w-2xl mx-auto"
    style={{ display: 'block' }}
  >
    <title id="cyoda-model-title">Cyoda EDBMS — one integrated model</title>
    <desc id="cyoda-model-desc">
      Diagram showing Cyoda EDBMS at the centre, connected to five integrated
      concerns: Entity State, Workflows, Transactions, Events, and History.
    </desc>

    {/* Subtle background ring at spoke radius */}
    <circle
      cx={CX}
      cy={CY}
      r="160"
      fill="none"
      stroke="hsl(175,40%,28%)"
      strokeWidth="1"
      strokeDasharray="3 6"
      opacity="0.35"
    />

    {/* Spokes — drawn first so nodes sit on top */}
    {outerNodes.map((node) => (
      <line
        key={`spoke-${node.label}`}
        x1={CX}
        y1={CY}
        x2={node.x}
        y2={node.y}
        stroke="hsl(175,55%,40%)"
        strokeWidth="1.75"
      />
    ))}

    {/* Outer nodes */}
    {outerNodes.map((node) => (
      <g key={node.label}>
        <rect
          x={node.x - OW / 2}
          y={node.y - OH / 2}
          width={OW}
          height={OH}
          rx="10"
          fill="hsl(175,35%,11%)"
          stroke="hsl(175,55%,36%)"
          strokeWidth="1.5"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="hsl(175,15%,85%)"
          fontSize="12.5"
          fontFamily="Montserrat, system-ui, sans-serif"
          fontWeight="500"
          letterSpacing="0.2"
        >
          {node.label}
        </text>
      </g>
    ))}

    {/* Center halo — subtle glow ring behind main node */}
    <rect
      x={CX - NW / 2 - 6}
      y={CY - NH / 2 - 6}
      width={NW + 12}
      height={NH + 12}
      rx="17"
      fill="hsl(175,60%,30%)"
      opacity="0.12"
    />

    {/* Center node */}
    <rect
      x={CX - NW / 2}
      y={CY - NH / 2}
      width={NW}
      height={NH}
      rx="12"
      fill="hsl(175,50%,13%)"
      stroke="hsl(175,60%,44%)"
      strokeWidth="2"
    />
    <text
      x={CX}
      y={CY - 8}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="hsl(175,10%,96%)"
      fontSize="15"
      fontFamily="Montserrat, system-ui, sans-serif"
      fontWeight="700"
      letterSpacing="0.3"
    >
      Cyoda EDBMS
    </text>
    <text
      x={CX}
      y={CY + 11}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="hsl(175,50%,60%)"
      fontSize="10.5"
      fontFamily="Montserrat, system-ui, sans-serif"
      fontWeight="400"
      letterSpacing="0.5"
    >
      one integrated model
    </text>
  </svg>
);

export default CyodaModelDiagram;
