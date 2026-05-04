import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const data = [
  // ================= DATABASES =================
  {
    title: "SQL vs NoSQL: The Architectural Divide",
    topic: "Databases",
    content: `
Relational databases (SQL) such as PostgreSQL and MySQL are built on the bedrock of ACID guarantees—Atomicity, Consistency, Isolation, and Durability. This makes them indispensable for systems where data accuracy is non-negotiable, such as banking ledgers or inventory management. In these environments, every transaction must either succeed in its entirety or fail without leaving a trace, ensuring the database remains in a valid state. However, this strict adherence to consistency creates a bottleneck when it comes to horizontal scaling. SQL databases are traditionally designed to scale vertically by adding more CPU or RAM to a single machine. While horizontal scaling via sharding is possible, it introduces immense complexity, as maintaining relational joins across different physical servers significantly increases latency. This is often referred to as the 'Scaling Tax' of relational systems.

In contrast, NoSQL databases like MongoDB and Cassandra prioritize availability and horizontal growth. They follow the BASE model: Basically Available, Soft state, and Eventual consistency. Instead of a rigid schema, NoSQL uses flexible formats like JSON-like documents or key-value pairs. This allows developers to iterate quickly without performing expensive migrations. The trade-off is governed by the CAP Theorem, which states that a distributed system can only provide two of three guarantees: Consistency, Availability, and Partition Tolerance. While SQL systems usually choose Consistency and Availability, NoSQL systems typically opt for Availability and Partition Tolerance. This means that during a network split, a NoSQL system stays online but may return 'stale' data—a result that is acceptable for a social media feed but catastrophic for a financial transaction. Ultimately, the decision depends on whether the application requires a single Source of Truth or Massive Scalability.
    `,
    createdAt: new Date()
  },

  // ================= APIs =================
  {
    title: "REST vs GraphQL: Data Fetching Efficiency",
    topic: "APIs",
    content: `
REST (Representational State Transfer) has been the industry standard for over a decade, utilizing standard HTTP verbs and stateless communication. One of its greatest strengths is its native compatibility with web infrastructure like CDNs and browser caches, which can reduce server load by up to 80%. However, REST suffers from two primary inefficiencies: over-fetching and under-fetching. Over-fetching occurs when a client requests a resource (like /users/1) and receives a massive JSON object containing 50 fields when it only needed the username. This wastes bandwidth and slows down mobile users on weak connections. Under-fetching is the opposite; a client might need to hit three different endpoints (/user, /posts, /comments) to render a single page, causing high latency due to multiple network round-trips.

GraphQL was developed to solve these exact problems by allowing the client to define the shape of the response. In a single request, a frontend developer can ask for specific fields across multiple related resources. While this drastically improves frontend performance and developer experience, it shifts a significant burden to the backend. GraphQL servers are harder to cache because every request is a POST to a single endpoint. Furthermore, poorly optimized GraphQL resolvers can lead to the 'N+1 problem,' where the server makes a separate database call for every item in a list, potentially crashing the database. Security is also a concern, as malicious users can craft deeply nested queries that exhaust server CPU. Therefore, while GraphQL offers unparalleled flexibility for complex UIs, REST remains the safer, simpler choice for standard CRUD applications and public-facing APIs.
    `,
    createdAt: new Date()
  },

  // ================= ARCHITECTURE =================
  {
    title: "Monolith vs Microservices: The Operational Reality",
    topic: "Architecture",
    content: `
A Monolithic architecture bundles all application logic into a single codebase and a single deployment unit. For startups and small teams, this is often the superior choice because it minimizes operational overhead. Communication between modules happens in-memory, resulting in near-zero latency, and debugging is straightforward since the entire execution flow is contained within one process. However, as an organization grows, the Monolith becomes a bottleneck. Deployment cycles slow down because every small change requires a full rebuild and re-test of the entire system. Scaling is also inefficient; if only the 'image processing' part of your app is slow, you still have to scale the entire monolith, wasting expensive server resources.

Microservices address these issues by breaking the application into small, independent services that communicate over a network. This enables 'Team Autonomy,' where one team can update the 'Billing' service without even talking to the team managing the 'Catalog.' It also allows for 'Fault Isolation'; if the recommendation service crashes, the rest of the store stays online. However, these benefits come at a high 'Network Tax.' Every service-to-service call adds 10-50ms of latency, and managing data consistency across multiple databases requires complex patterns like Sagas or Two-Phase Commits. Monitoring also becomes a nightmare, requiring distributed tracing tools like Jaeger or Zipkin to understand why a request is failing. For most companies, the transition to Microservices should only happen when the organizational pain of a Monolith outweighs the technical complexity of a distributed system.
    `,
    createdAt: new Date()
  },

  // ================= WEB RENDERING =================
  {
    title: "Rendering Strategies: SSR and CSR Performance",
    topic: "Web Rendering",
    content: `
The debate between Server-Side Rendering (SSR) and Client-Side Rendering (CSR) is central to modern web performance. SSR, popularized by frameworks like Next.js, generates the full HTML for a page on the server for every request. This is excellent for SEO, as search engine crawlers receive a fully populated page immediately. It also provides a faster 'First Contentful Paint,' as the user sees the content as soon as the HTML arrives. The downside is increased server load and higher Time to First Byte (TTFB), as the server must fetch data and render the page before sending anything to the client. Under heavy traffic, SSR servers can become a bottleneck unless aggressive caching strategies are used.

CSR, common in standard React or Vue apps, sends a nearly empty HTML file and a large JavaScript bundle to the browser. The browser then executes the JS to build the UI and fetch data. This shifts the rendering cost from your server to the user's device, which is great for your infrastructure budget. Once the initial JS is loaded, navigating between pages is nearly instantaneous, creating a smooth, app-like experience. However, the initial load can be painfully slow on low-end devices or slow networks, leading to 'Blank Screen' syndrome. Moreover, SEO can suffer if crawlers struggle to execute the JavaScript properly. Many modern applications now use a hybrid approach, such as Incremental Static Regeneration (ISR), which attempts to combine the SEO benefits of SSR with the scalability of static hosting.
    `,
    createdAt: new Date()
  },

  // ================= REAL-TIME =================
  {
    title: "Real-time Models: WebSockets vs HTTP Polling",
    topic: "Communication",
    content: `
Real-time communication is essential for applications like chat, live sports updates, and collaborative editing. The simplest method is HTTP Polling, where the client repeatedly asks the server 'Is there new data?' at fixed intervals. While easy to implement and firewall-friendly, polling is incredibly inefficient. Approximately 90% of requests often return empty, wasting server resources and battery life on mobile devices. Long Polling improves on this by keeping the connection open until the server has new data, but it still suffers from the overhead of repeated HTTP headers and the latency of establishing new connections.

WebSockets provide a more robust solution by establishing a persistent, full-duplex TCP connection between the client and server. Once the initial handshake is complete, data can flow freely in both directions with minimal overhead. This is the gold standard for high-frequency updates like online gaming or stock tickers. However, WebSockets are stateful, which makes them significantly harder to scale. Unlike stateless REST calls, you cannot easily load balance WebSockets without using sticky sessions or a pub/sub backplane like Redis to sync messages across multiple server instances. Additionally, maintaining thousands of open connections requires substantial memory and specialized server configurations. For many 'near-real-time' needs, Server-Sent Events (SSE) offer a lighter alternative, but for true bi-directional interactivity, WebSockets remain the primary architectural choice.
    `
  }
];

async function seed() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ ERROR: MONGO_URI is missing from .env");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const col = db.collection('researchdocuments');

    console.log("🗑️  Cleaning existing records...");
    await col.deleteMany({});

    console.log(`🚀 Seeding ${data.length} high-density technical documents...`);
    await col.insertMany(data);

    console.log("✅ Success: Database seeded with simplified schema and full-length content.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seed();