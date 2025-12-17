---
author: "Patrick Stanton"
category: "AI"
date: "2025-09-05"
excerpt: "Cyoda's online platform enables developers to create agentic AI
  applications faster, safer, and with greater reliability. By combining
  entity-centric design, workflows, and transactional consistency, Cyoda
  provides a powerful alternative to traditional AI development stacks."
featured: false
published: true
tags: ["agentic AI","Cyoda","platform","AI Assistant","workflows"]
title: "Building Agentic AI Applications with Cyoda Online Platform"
---

# Building Agentic AI Applications with Cyoda Online Platform

This guide walks through creating a **demo Order Management System (OMS)** using:

- **Cyoda Online Platform + AI Assistant** to generate the **backend**  
- **Lovable AI** to generate the **frontend** against the local backend REST APIs  

The OMS demonstrates **products, carts, checkout, dummy payment, orders, and shipment states**, showing how quickly you can build an end-to-end application.

---

## 1. Backend (Cyoda AI Assistant)

The backend is generated on the **Cyoda Online Platform** using Cyoda’s **AI Assistant**. It creates entities, workflows, processors, and an app-hosted REST API layer.

### Backend Prompt (for Cyoda AI)

Copy this entire prompt into Cyoda AI Assistant:

```
Build a Spring Boot client application that exposes simple REST APIs for a browser UI (no login in the browser).  
The app holds server-side Cyoda credentials and talks to Cyoda’s standard `/entity/<Entity>` APIs and workflows on behalf of the UI.

Key demo rules:
- Anonymous checkout only (no user accounts)
- Dummy payment auto-approves after ~3 seconds
- Stock policy: decrement `Product.quantityAvailable` on order creation
- Shipping: single shipment per order
- Order numbers: short ULID
- Catalog filters: category, free-text (name/description), price range
- Product must use the following schema:

{
  "name": "string",
  "sku": "string",
  "price": 0,
  "quantityAvailable": 0,
  "category": "string",
  "description": "string",
  "warehouseId": "string",
  "media": ["string"],
  "bundles": [],
  "variants": [],
  "events": [],
  "attributes": {},
  "compliance": {},
  "inventory": {},
  "options": {},
  "relationships": {},
  "localizations": {}
}

Entities:
- Product (schema above, persisted in full)
- Cart (status, lines[], totals, guestContact)
- Payment (dummy; INITIATED → auto PAID after 3s)
- Order (short ULID, lines[], totals, guestContact, status workflow)
- Shipment (one per order, status workflow)

Workflows:
- CartFlow: NEW → ACTIVE → CHECKING_OUT → CONVERTED
- PaymentFlow: INITIATED → PAID (auto after 3s)
- OrderLifecycle: WAITING_TO_FULFILL → PICKING → WAITING_TO_SEND → SENT → DELIVERED

App-hosted REST APIs under `/ui/**`:
- Products: `GET /ui/products` (filters), `GET /ui/products/{sku}`
- Cart: create/get, add line, update qty/remove, open checkout
- Checkout: post guestContact to cart
- Payment: start dummy, poll status
- Order: create from cart+payment, get by id

Acceptance:
1. Product list with filters
2. Add to cart creates/updates cart
3. Checkout collects guest info
4. Payment auto-approves after 3s
5. Order created with decremented stock, single shipment
6. Order lifecycle can progress to DELIVERED
```

---

## 2. Frontend (Lovable AI)

The frontend is built using **Lovable AI**, which generates a React app against the **local backend REST API**.

### Frontend Prompt (for Lovable)

Copy this prompt into Lovable:

```
Generate a React + TypeScript front-end that consumes the local backend at `http://localhost:8080` using the attached OpenAPI (openAPI.json).  
Do not call Cyoda directly. Do not add browser authentication. All requests go through `/ui/**` endpoints.

Pages:
1. Product List
   - `GET /ui/products` with filters: search, category, minPrice, maxPrice
   - Show name, price, category, quantityAvailable, image
   - Add button adds item to cart
2. Product Detail
   - `GET /ui/products/{sku}`
   - Show full details (description, media)
   - Add to cart
3. Cart
   - `POST /ui/cart` to create
   - `GET /ui/cart/{id}`
   - `POST /ui/cart/{id}/lines` add
   - `PATCH /ui/cart/{id}/lines` update/remove
   - `POST /ui/cart/{id}/open-checkout`
   - Show totals, increment/decrement/remove items
4. Checkout
   - `POST /ui/checkout/{id}` with guestContact {name,email,phone,address}
   - On success, start payment
5. Payment
   - `POST /ui/payment/start` with cartId
   - Poll `GET /ui/payment/{id}` until PAID (~3s)
   - When paid, create order
6. Order Confirmation
   - `POST /ui/order/create`
   - `GET /ui/order/{id}` → show orderNumber, status, lines, totals, guestContact

Implementation notes:
- Keep `cartId` in localStorage
- Use Axios/fetch with baseURL = VITE_APP_API_BASE
- Set env: `VITE_APP_API_BASE=http://localhost:8080`
- Show cart badge with total items
- Use React Router for navigation
```

---

## 3. Running the System

### Backend (Cyoda client app)
1. Generate the backend with Cyoda AI (as per prompt above).  
2. Build and run the Spring Boot app:
   ```bash
   ./mvnw spring-boot:run
   ```
   By default it runs on `http://localhost:8080`.

3. Verify endpoints:
   ```bash
   curl http://localhost:8080/ui/products
   ```

### Frontend (Lovable UI)
1. Generate the React app with Lovable using the prompt above.  
2. Set env in `.env.local`:
   ```
   VITE_APP_API_BASE=http://localhost:8080
   ```
3. Run the dev server:
   ```bash
   npm install
   npm run dev
   ```
   App is available at `http://localhost:5173`.

4. Test flow:
   - Browse products
   - Add to cart
   - Checkout with guest info
   - Payment auto-completes after ~3s
   - Order is created with an order number

---

## 4. Key Learnings

- **Entity-centric design**: All state (Product, Cart, Payment, Order, Shipment) is modeled as Cyoda entities with versioning and workflows.  
- **Event-driven workflows**: Transitions like `ADD_ITEM`, `CHECKOUT`, `AUTO_MARK_PAID` encapsulate business rules.  
- **UI simplicity**: The React frontend only calls local REST endpoints, keeping browser code simple and unauthenticated.  
- **Rapid prototyping**: Cyoda AI + Lovable AI combine to deliver a full OMS demo in hours, not weeks.

---
