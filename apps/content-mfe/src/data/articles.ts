export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  readTime: number
}

export interface Category {
  id: string
  name: string
  slug: string
  count: number
}

export const categories: Category[] = [
  { id: '1', name: 'All', slug: 'all', count: 6 },
  { id: '2', name: 'Cloud', slug: 'cloud', count: 2 },
  {
    id: '3',
    name: 'Digital Transformation',
    slug: 'digital-transformation',
    count: 2,
  },
  { id: '4', name: 'AI & Data', slug: 'ai-data', count: 2 },
]

export const articles: Article[] = [
  {
    id: '1',
    slug: 'cloud-migration-strategy',
    title: 'Cloud Migration Strategy for Enterprise Applications',
    excerpt:
      'A comprehensive guide to migrating enterprise workloads to the cloud with minimal disruption and maximum ROI.',
    body: `Cloud migration is one of the most significant undertakings for any enterprise. The process involves moving data, applications, and workloads from on-premises infrastructure to cloud-based environments.\n\nAssessment Phase: Before migrating, organizations must conduct a thorough assessment of their existing infrastructure. This includes cataloging all applications, understanding dependencies, and evaluating cloud readiness.\n\nPlanning Phase: A detailed migration plan should account for application prioritization, resource requirements, timeline, and risk mitigation strategies.\n\nMigration Phase: The actual migration can follow several patterns — rehost (lift and shift), replatform, refactor, or retire. The choice depends on each application business value and technical complexity.\n\nOptimization Phase: Post-migration, continuous optimization ensures cost efficiency and performance improvements.`,
    category: 'cloud',
    tags: ['cloud', 'migration', 'enterprise', 'AWS', 'Azure'],
    author: 'Priya Sharma',
    publishedAt: '2025-01-15',
    readTime: 8,
  },
  {
    id: '2',
    slug: 'microservices-architecture-patterns',
    title: 'Microservices Architecture Patterns in Practice',
    excerpt:
      'Explore proven patterns for building resilient microservices architectures that scale with your business.',
    body: `Microservices architecture has become the de facto standard for building scalable enterprise applications. By decomposing monolithic applications into smaller, independently deployable services, organizations gain flexibility and resilience.\n\nAPI Gateway Pattern: A single entry point for all client requests, handling routing, authentication, and rate limiting.\n\nCircuit Breaker Pattern: Prevents cascading failures by detecting when a service is unavailable and routing around it.\n\nEvent Sourcing: Capturing all changes to application state as a sequence of events, enabling audit trails and temporal queries.\n\nCQRS: Separating read and write operations for better scalability and performance optimization.`,
    category: 'cloud',
    tags: ['microservices', 'architecture', 'patterns', 'scalability'],
    author: 'Rahul Verma',
    publishedAt: '2025-01-22',
    readTime: 10,
  },
  {
    id: '3',
    slug: 'digital-transformation-roadmap',
    title: 'Building a Digital Transformation Roadmap',
    excerpt:
      'How enterprises can create actionable digital transformation roadmaps aligned with business objectives.',
    body: `Digital transformation is not just about technology — it is a fundamental shift in how organizations operate and deliver value to customers.\n\nVision and Strategy: Define what digital transformation means for your organization. Align technology investments with business outcomes.\n\nCustomer Experience: Map customer journeys and identify digital touchpoints where technology can enhance experiences.\n\nOperational Excellence: Automate repetitive processes, streamline workflows, and enable data-driven decision making.\n\nCulture and Change Management: Technology alone does not transform organizations. People, processes, and culture must evolve together.`,
    category: 'digital-transformation',
    tags: ['digital transformation', 'strategy', 'roadmap', 'enterprise'],
    author: 'Anita Desai',
    publishedAt: '2025-02-01',
    readTime: 7,
  },
  {
    id: '4',
    slug: 'headless-cms-enterprise',
    title: 'Headless CMS Adoption in Enterprise Web Platforms',
    excerpt:
      'Why enterprises are moving to headless CMS architectures and how to evaluate the right solution.',
    body: `The headless CMS approach decouples content management from content presentation, providing flexibility for omnichannel content delivery.\n\nChannel Agnostic: Content created once can be delivered to websites, mobile apps, digital signage, and any other digital touchpoint via APIs.\n\nDeveloper Freedom: Frontend teams can use any technology stack without being constrained by CMS templating systems.\n\nContent Governance: Structured content models ensure consistency across all channels while enabling editorial flexibility.\n\nEvaluation Criteria: When selecting a headless CMS, consider API performance, content modeling flexibility, editorial experience, and total cost of ownership.`,
    category: 'digital-transformation',
    tags: ['headless CMS', 'content management', 'API', 'omnichannel'],
    author: 'Vikram Singh',
    publishedAt: '2025-02-10',
    readTime: 9,
  },
  {
    id: '5',
    slug: 'rag-enterprise-knowledge',
    title: 'RAG Systems for Enterprise Knowledge Management',
    excerpt:
      'How Retrieval-Augmented Generation is transforming how enterprises access and utilize their knowledge assets.',
    body: `Retrieval-Augmented Generation (RAG) represents a significant advancement in how organizations can leverage their existing knowledge bases with AI.\n\nHow RAG Works: RAG combines two key components — a retrieval system that finds relevant documents from a knowledge base, and a generative model that synthesizes those documents into coherent, accurate responses.\n\nDocument Ingestion: Enterprise documents are chunked, embedded into vector representations, and stored in a vector database.\n\nSemantic Retrieval: User queries are embedded and compared against stored vectors to find semantically similar content.\n\nGrounded Generation: The LLM generates responses using retrieved context, ensuring accuracy and reducing hallucinations.\n\nEnterprise Benefits: RAG enables organizations to build AI assistants that answer questions from internal documentation, policies, and knowledge bases accurately.`,
    category: 'ai-data',
    tags: ['RAG', 'AI', 'knowledge management', 'LLM', 'enterprise'],
    author: 'Deepa Nair',
    publishedAt: '2025-02-18',
    readTime: 11,
  },
  {
    id: '6',
    slug: 'data-mesh-architecture',
    title: 'Data Mesh Architecture for Modern Enterprises',
    excerpt:
      'Understanding data mesh principles and how they enable scalable, domain-oriented data management.',
    body: `Data mesh is an architectural paradigm that treats data as a product and distributes data ownership to domain teams.\n\nDomain Ownership: Each business domain owns and is responsible for its data products, including quality, availability, and documentation.\n\nData as a Product: Data is treated with the same rigor as software products — with clear ownership, SLAs, and consumer focus.\n\nSelf-serve Infrastructure: A platform team provides infrastructure that enables domain teams to build and share data products independently.\n\nFederated Governance: Standards and policies are set centrally but implemented and enforced locally by domain teams.`,
    category: 'ai-data',
    tags: ['data mesh', 'data architecture', 'domain driven', 'enterprise'],
    author: 'Arjun Mehta',
    publishedAt: '2025-02-25',
    readTime: 9,
  },
]
