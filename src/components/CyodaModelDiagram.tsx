const CX = 270;
const CY = 195;

const outerNodes = [
  { x: 270, y:  45, label: 'Entity State'    },
  { x: 400, y: 120, label: 'Workflows'        },
  { x: 400, y: 270, label: 'Transactions'     },
  { x: 270, y: 345, label: 'History'          },
  { x: 140, y: 270, label: 'Events'           },
  { x: 140, y: 120, label: 'Business Logic'   },
];

const OW = 108;
const OH = 38;
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
      Diagram showing Cyoda EDBMS at the centre, connected to six integrated
      concerns: Entity State, Workflows, Transactions, Events, History, and Business Logic.
    </desc>

    {/* Background ring */}
    <circle
      cx={CX}
      cy={CY}
      r="150"
      fill="none"
      stroke="hsl(175,35%,75%)"
      strokeWidth="1"
      strokeDasharray="3 6"
      opacity="0.6"
    />

    {/* Spokes */}
    {outerNodes.map((node) => (
      <line
        key={`spoke-${node.label}`}
        x1={CX}
        y1={CY}
        x2={node.x}
        y2={node.y}
        stroke="hsl(175,50%,55%)"
        strokeWidth="1.5"
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
          fill="hsl(175,50%,94%)"
          stroke="hsl(175,55%,50%)"
          strokeWidth="1.5"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="hsl(175,40%,20%)"
          fontSize="12"
          fontFamily="Montserrat, system-ui, sans-serif"
          fontWeight="600"
          letterSpacing="0.2"
        >
          {node.label}
        </text>
      </g>
    ))}

    {/* Center halo */}
    <rect
      x={CX - NW / 2 - 7}
      y={CY - NH / 2 - 7}
      width={NW + 14}
      height={NH + 14}
      rx="18"
      fill="hsl(175,60%,55%)"
      opacity="0.15"
    />

    {/* Center node */}
    <rect
      x={CX - NW / 2}
      y={CY - NH / 2}
      width={NW}
      height={NH}
      rx="12"
      fill="hsl(175,55%,92%)"
      stroke="hsl(175,60%,38%)"
      strokeWidth="2.5"
    />
    <text
      x={CX}
      y={CY - 8}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="hsl(175,45%,18%)"
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
      fill="hsl(175,50%,35%)"
      fontSize="10.5"
      fontFamily="Montserrat, system-ui, sans-serif"
      fontWeight="500"
      letterSpacing="0.5"
    >
      one integrated model
    </text>
  </svg>
);

export default CyodaModelDiagram;
