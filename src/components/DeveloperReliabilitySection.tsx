import { ScrollArea } from '@/components/ui/scroll-area';

const DeveloperReliabilitySection = () => {
  const complexEntityJson = `{
  "sku": "string",                     // required, unique
  "name": "string",                    // required
  "description": "string",             // required
  "price": 0,                          // required: default/base price (fallback)
  "quantityAvailable": 0,              // required: quick projection field
  "category": "string",                // required
  "warehouseId": "string|null",        // optional default primary node

  "attributes": {
    "brand": "string",
    "model": "string",
    "dimensions": { "l": "number", "w": "number", "h": "number", "unit": "cm" },
    "weight": { "value": "number", "unit": "kg" },
    "hazards": [{ "class": "UN3481", "transportNotes": "string" }],
    "custom": { "any": "json" }        // open extension bag for teams
  },

  "localizations": {
    "defaultLocale": "en-GB",
    "content": [
      { "locale": "en-GB", "name": "string", "description": "string", "regulatory": { "ukca": true } },
      { "locale": "de-DE", "name": "string", "description": "string", "regulatory": { "ce": true }, "salesRestrictions": ["noLithiumBatteries"] }
    ]
  },

  "media": [
    { "type": "image", "url": "https://...", "alt": "string", "tags": ["hero"], "sha256": "..." },
    { "type": "doc",   "url": "https://...", "title": "MSDS", "regionScope": ["EU"] }
  ],

  "options": {
    "axes": [
      { "code": "color", "values": ["black","silver","blue"] },
      { "code": "capacity", "values": ["128GB","256GB","512GB"] }
    ],
    "constraints": [
      { "if": { "color": "blue" }, "then": { "forbid": { "capacity": ["512GB"] } } },
      { "requires": [{ "option": "capacity", "oneOf": ["256GB","512GB"] }], "whenRegionIn": ["US","CA"] }
    ]
  },

  "variants": [
    {
      "variantSku": "string",          // unique within product
      "optionValues": { "color": "black", "capacity": "256GB" },
      "attributes": { "weight": { "value": 0.02, "unit": "kg" } },  // overrides
      "barcodes": ["EAN:...","UPC:..."],
      "priceOverrides": {
        "base": 0,                     // optional override of product.price
        "priceBooks": ["pb:consumer-eu-tiered-2025"]
      },
      "inventoryPolicy": { "backorder": true, "maxBackorderDays": 30 }
    }
  ],

  "bundles": [
    {
      "type": "kit",                   // "kit" (shipped together) or "bundle" (virtual)
      "sku": "KIT-STARTER-01",
      "components": [
        { "ref": { "sku": "CASE-XL" }, "qty": 1, "optional": true, "defaultSelected": true,
          "constraints": [{ "ifVariant": { "option": "capacity", "in": ["512GB"] }, "then": { "forbid": true } }]
        },
        { "ref": { "sku": "CHARGER-45W" }, "qty": 1, "substitutions": [{ "sku": "CHARGER-65W", "whenRegionIn": ["US"] }] }
      ]
    }
  ],

  "inventory": {
    "nodes": [
      {
        "nodeId": "LON-01",
        "type": "Warehouse",
        "capacity": { "maxUnits": 100000 },
        "lots": [
          { "lotId": "LOT-A1", "mfgDate": "2025-01-10", "expires": "2027-01-10",
            "qty": 500, "serials": ["S100..."], "quality": "Released"
          },
          { "lotId": "LOT-Q1", "qty": 80, "quality": "Quarantine", "reason": "inspection" }
        ],
        "reservations": [
          { "ref": "order:O-12345", "variantSku": "…", "qty": 20, "until": "2025-09-15T18:00:00Z" }
        ],
        "inTransit": [
          { "po": "PO-998", "eta": "2025-09-05T12:00:00Z", "qty": 1000, "status": "Scheduled" }
        ]
      },
      { "nodeId": "AMS-3PL", "type": "3PL", "qtyOnHand": 320 }
    ],
    "policies": {
      "allocation": "earliest-expiry-first",
      "oversellGuard": { "maxPercent": 5 }
    }
  },

  "compliance": {
    "docs": [
      { "id": "MSDS-2025-01", "regions": ["EU","US"], "url": "https://..." },
      { "id": "UKCA-2025", "regions": ["UK"], "approved": true }
    ],
    "restrictions": [
      { "region": "CA", "rules": ["noAirTransport"], "reason": "Lithium content" }
    ]
  },

  "relationships": {
    "suppliers": [
      { "partyId": "SUP-FOXLINK", "contract": { "id": "C-2025-07", "incoterm": "DAP", "leadTimeDays": 21 } }
    ],
    "relatedProducts": [
      { "type": "accessory", "sku": "CASE-XL" },
      { "type": "replacement", "sku": "BAT-002" }
    ]
  },

  "events": [
    { "type": "ProductCreated", "at": "2025-08-20T09:00:00Z", "payload": { "sku": "…" } },
    { "type": "InventoryReceived", "at": "2025-08-25T16:30:00Z", "payload": { "nodeId": "LON-01", "lotId": "LOT-A1", "qty": 500 } },
    { "type": "ReservationCreated", "at": "2025-08-28T11:00:00Z", "payload": { "orderRef": "O-12345", "qty": 20 } }
  ]
}`;

  return (
    <section className="py-24 bg-gradient-to-br from-background via-card to-secondary/20 relative">
      <div className="absolute inset-0 texture-overlay opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-accent mb-6">
            Built for Developers Who Demand Reliability
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Handle complex entities, relationships, and business logic with confidence. 
            Cyoda excels at modeling intricate data structures that real enterprises depend on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* LEFT: JSON example */}
          <div className="w-full">
            <div className="bg-card/10 backdrop-blur border border-border/50 rounded-2xl p-6 glow-primary h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Complex Entity Model (Example)</h3>
                <div className="text-xs text-muted-foreground">cyoda: entity-first • event-sourced • audited</div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-muted-foreground">/models/entity.json</span>
              </div>
              <ScrollArea className="h-96 w-full md:h-[28rem]">
                <pre className="code-block text-[10px] md:text-[11px] leading-tight">
                  <code
                    dangerouslySetInnerHTML={{
                      __html: complexEntityJson
                        .replace(/"([^"]+)":/g, '<span class="key">"$1":</span>')
                        .replace(/: "([^"]+)"/g, ': <span class="string">"$1"</span>')
                        .replace(/: (\d+)(?![^<]*>)/g, ': <span class="number">$1</span>')
                        .replace(/: (true|false)/g, ': <span class="boolean">$1</span>')
                    }}
                  />
                </pre>
              </ScrollArea>
            </div>
          </div>

          {/* RIGHT: Why Cyoda */}
          <div className="w-full">
            <div className="bg-card/10 backdrop-blur border border-border/50 rounded-2xl p-6 h-full">
              <h3 className="text-lg font-semibold text-foreground mb-4">Why Cyoda for Complex Data Models</h3>
              <ul className="space-y-3 text-sm text-muted-foreground text-left">
                <li>
                  <span className="font-medium text-foreground">Entity-first modeling:</span>
                  &nbsp;capture rich entities, nested attributes & relationships without schema pain.
                </li>
                <li>
                  <span className="font-medium text-foreground">Event-sourced history:</span>
                  &nbsp;every change is auditable and replayable.
                </li>
                <li>
                  <span className="font-medium text-foreground">Built-in workflow & rules:</span>
                  &nbsp;encode state machines, approvals and business rules close to data.
                </li>
                <li>
                  <span className="font-medium text-foreground">Query how you think:</span>
                  &nbsp;flexible filters across current state and historic events.
                </li>
                <li>
                  <span className="font-medium text-foreground">Scale & reliability:</span>
                  &nbsp;designed for high-volume, high-integrity enterprise data flows.
                </li>
                <li>
                  <span className="font-medium text-foreground">Prototype → production:</span>
                  &nbsp;move fast without re-platforming when you need to scale.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperReliabilitySection;