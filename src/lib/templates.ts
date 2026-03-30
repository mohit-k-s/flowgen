import type { DiagramSchema } from './types'

export interface Template {
  id: string
  name: string
  description: string
  prompt: string
  diagram: DiagramSchema
}

export const TEMPLATES: Template[] = [
  {
    id: 'microservices',
    name: 'Microservices',
    description: 'API gateway, auth, user & order services with a shared database',
    prompt: 'Design a microservices architecture with an API gateway, authentication service, user service, order service, and a PostgreSQL database.',
    diagram: {
      title: 'Microservices Architecture',
      nodes: [
        { id: 'client', label: 'Client', type: 'input', x: 0, y: 0, color: '#0EA5E9', description: 'Web or mobile client making API requests' },
        { id: 'gateway', label: 'API Gateway', type: 'default', x: 0, y: 0, color: '#DC2626', description: 'Routes requests, handles rate limiting and load balancing' },
        { id: 'auth', label: 'Auth Service', type: 'default', x: 0, y: 0, color: '#4F46E5', description: 'Handles authentication and issues JWT tokens' },
        { id: 'users', label: 'User Service', type: 'default', x: 0, y: 0, color: '#4F46E5', description: 'Manages user profiles and account data' },
        { id: 'orders', label: 'Order Service', type: 'default', x: 0, y: 0, color: '#4F46E5', description: 'Processes and tracks customer orders' },
        { id: 'db', label: 'PostgreSQL', type: 'output', x: 0, y: 0, color: '#059669', description: 'Shared relational database for persistent storage' },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 'gateway', label: 'HTTPS', animated: true, style: 'solid' },
        { id: 'e2', source: 'gateway', target: 'auth', label: 'verify', animated: true, style: 'solid' },
        { id: 'e3', source: 'gateway', target: 'users', label: 'user ops', animated: true, style: 'solid' },
        { id: 'e4', source: 'gateway', target: 'orders', label: 'order ops', animated: true, style: 'solid' },
        { id: 'e5', source: 'users', target: 'db', animated: false, style: 'solid' },
        { id: 'e6', source: 'orders', target: 'db', animated: false, style: 'solid' },
      ],
    },
  },
  {
    id: 'event-driven',
    name: 'Event-Driven',
    description: 'Producer, Kafka broker, and multiple consumer services',
    prompt: 'Design an event-driven architecture with a producer service, Kafka message broker, and three consumer services for analytics, notifications, and search indexing.',
    diagram: {
      title: 'Event-Driven Architecture',
      nodes: [
        { id: 'producer', label: 'Producer Service', type: 'input', x: 0, y: 0, color: '#0EA5E9', description: 'Publishes domain events to the message broker' },
        { id: 'kafka', label: 'Kafka Broker', type: 'default', x: 0, y: 0, color: '#D97706', description: 'Durable, distributed event log for async message passing' },
        { id: 'analytics', label: 'Analytics Consumer', type: 'output', x: 0, y: 0, color: '#4F46E5', description: 'Aggregates events for reporting and dashboards' },
        { id: 'notif', label: 'Notification Consumer', type: 'output', x: 0, y: 0, color: '#4F46E5', description: 'Sends emails and push notifications on key events' },
        { id: 'search', label: 'Search Indexer', type: 'output', x: 0, y: 0, color: '#4F46E5', description: 'Updates Elasticsearch index from event stream' },
      ],
      edges: [
        { id: 'e1', source: 'producer', target: 'kafka', label: 'publish', animated: true, style: 'solid' },
        { id: 'e2', source: 'kafka', target: 'analytics', label: 'consume', animated: true, style: 'dashed' },
        { id: 'e3', source: 'kafka', target: 'notif', label: 'consume', animated: true, style: 'dashed' },
        { id: 'e4', source: 'kafka', target: 'search', label: 'consume', animated: true, style: 'dashed' },
      ],
    },
  },
  {
    id: 'cicd',
    name: 'CI/CD Pipeline',
    description: 'Git push to automated build, test, and deploy stages',
    prompt: 'Design a CI/CD pipeline from a Git push through build, test, and deploy stages to production.',
    diagram: {
      title: 'CI/CD Pipeline',
      nodes: [
        { id: 'dev', label: 'Developer', type: 'input', x: 0, y: 0, color: '#0EA5E9', description: 'Pushes code changes to the repository' },
        { id: 'repo', label: 'Git Repository', type: 'default', x: 0, y: 0, color: '#4F46E5', description: 'Source of truth; triggers pipeline on push' },
        { id: 'build', label: 'Build Stage', type: 'default', x: 0, y: 0, color: '#4F46E5', description: 'Compiles code and builds Docker image' },
        { id: 'test', label: 'Test Stage', type: 'default', x: 0, y: 0, color: '#4F46E5', description: 'Runs unit, integration, and E2E tests' },
        { id: 'registry', label: 'Container Registry', type: 'default', x: 0, y: 0, color: '#059669', description: 'Stores versioned Docker images' },
        { id: 'staging', label: 'Staging', type: 'default', x: 0, y: 0, color: '#D97706', description: 'Pre-production environment for final validation' },
        { id: 'prod', label: 'Production', type: 'output', x: 0, y: 0, color: '#DC2626', description: 'Live environment serving end users' },
      ],
      edges: [
        { id: 'e1', source: 'dev', target: 'repo', label: 'git push', animated: true, style: 'solid' },
        { id: 'e2', source: 'repo', target: 'build', label: 'trigger', animated: true, style: 'solid' },
        { id: 'e3', source: 'build', target: 'test', animated: true, style: 'solid' },
        { id: 'e4', source: 'test', target: 'registry', label: 'push image', animated: true, style: 'solid' },
        { id: 'e5', source: 'registry', target: 'staging', label: 'deploy', animated: true, style: 'solid' },
        { id: 'e6', source: 'staging', target: 'prod', label: 'promote', animated: false, style: 'dashed' },
      ],
    },
  },
  {
    id: '3tier',
    name: '3-Tier Web App',
    description: 'Classic presentation, application, and data tiers',
    prompt: 'Design a classic 3-tier web application with a React frontend, Node.js API layer, and PostgreSQL database behind a load balancer.',
    diagram: {
      title: '3-Tier Web Application',
      nodes: [
        { id: 'browser', label: 'Browser', type: 'input', x: 0, y: 0, color: '#0EA5E9', description: 'User-facing React SPA served via CDN' },
        { id: 'cdn', label: 'CDN', type: 'default', x: 0, y: 0, color: '#D97706', description: 'Caches and serves static assets globally' },
        { id: 'lb', label: 'Load Balancer', type: 'default', x: 0, y: 0, color: '#DC2626', description: 'Distributes API traffic across multiple servers' },
        { id: 'api1', label: 'API Server 1', type: 'default', x: 0, y: 0, color: '#4F46E5', description: 'Node.js API handling business logic' },
        { id: 'api2', label: 'API Server 2', type: 'default', x: 0, y: 0, color: '#4F46E5', description: 'Node.js API handling business logic' },
        { id: 'cache', label: 'Redis Cache', type: 'default', x: 0, y: 0, color: '#D97706', description: 'In-memory cache for sessions and hot data' },
        { id: 'db', label: 'PostgreSQL', type: 'output', x: 0, y: 0, color: '#059669', description: 'Primary relational database' },
      ],
      edges: [
        { id: 'e1', source: 'browser', target: 'cdn', label: 'static assets', animated: false, style: 'solid' },
        { id: 'e2', source: 'browser', target: 'lb', label: 'API calls', animated: true, style: 'solid' },
        { id: 'e3', source: 'lb', target: 'api1', animated: true, style: 'solid' },
        { id: 'e4', source: 'lb', target: 'api2', animated: true, style: 'solid' },
        { id: 'e5', source: 'api1', target: 'cache', animated: false, style: 'dashed' },
        { id: 'e6', source: 'api2', target: 'cache', animated: false, style: 'dashed' },
        { id: 'e7', source: 'api1', target: 'db', animated: false, style: 'solid' },
        { id: 'e8', source: 'api2', target: 'db', animated: false, style: 'solid' },
      ],
    },
  },
  {
    id: 'oauth',
    name: 'OAuth Flow',
    description: 'Authorization code flow with identity provider',
    prompt: 'Design an OAuth 2.0 authorization code flow with a client app, authorization server, resource server, and identity provider.',
    diagram: {
      title: 'OAuth 2.0 Authorization Code Flow',
      nodes: [
        { id: 'user', label: 'User', type: 'input', x: 0, y: 0, color: '#0EA5E9', description: 'End user initiating the login flow' },
        { id: 'client', label: 'Client App', type: 'default', x: 0, y: 0, color: '#4F46E5', description: 'Application requesting access on behalf of the user' },
        { id: 'auth', label: 'Auth Server', type: 'default', x: 0, y: 0, color: '#DC2626', description: 'Issues authorization codes and access tokens' },
        { id: 'idp', label: 'Identity Provider', type: 'default', x: 0, y: 0, color: '#4F46E5', description: 'Verifies user identity (e.g. Google, Okta)' },
        { id: 'resource', label: 'Resource Server', type: 'output', x: 0, y: 0, color: '#059669', description: 'Protected API that validates access tokens' },
      ],
      edges: [
        { id: 'e1', source: 'user', target: 'client', label: 'login request', animated: true, style: 'solid' },
        { id: 'e2', source: 'client', target: 'auth', label: 'redirect + scope', animated: true, style: 'solid' },
        { id: 'e3', source: 'auth', target: 'idp', label: 'verify identity', animated: true, style: 'solid' },
        { id: 'e4', source: 'idp', target: 'auth', label: 'user confirmed', animated: true, style: 'solid' },
        { id: 'e5', source: 'auth', target: 'client', label: 'auth code', animated: true, style: 'dashed' },
        { id: 'e6', source: 'client', target: 'auth', label: 'exchange code', animated: true, style: 'solid' },
        { id: 'e7', source: 'auth', target: 'client', label: 'access token', animated: true, style: 'dashed' },
        { id: 'e8', source: 'client', target: 'resource', label: 'Bearer token', animated: true, style: 'solid' },
      ],
    },
  },
]
