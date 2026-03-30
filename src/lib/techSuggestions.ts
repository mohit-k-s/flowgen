// Maps node color → suggested technologies
const COLOR_SUGGESTIONS: Record<string, string[]> = {
  '#4F46E5': ['Node.js', 'Go', 'Python (FastAPI)', 'Spring Boot', 'Rust (Axum)'],
  '#059669': ['PostgreSQL', 'MySQL', 'MongoDB', 'DynamoDB', 'CockroachDB'],
  '#D97706': ['Apache Kafka', 'RabbitMQ', 'AWS SQS', 'Redis Streams', 'NATS'],
  '#DC2626': ['Kong', 'AWS API Gateway', 'Nginx', 'Traefik', 'Envoy'],
  '#0EA5E9': ['React', 'Next.js', 'Vue', 'SvelteKit', 'iOS / Android'],
}

// Maps label keywords → suggested technologies
const LABEL_SUGGESTIONS: { pattern: RegExp; suggestions: string[] }[] = [
  { pattern: /auth|identity|sso|oauth/, suggestions: ['Auth0', 'Okta', 'Keycloak', 'AWS Cognito', 'Supabase Auth'] },
  { pattern: /cache|redis/, suggestions: ['Redis', 'Memcached', 'Dragonfly', 'KeyDB'] },
  { pattern: /database|db|postgres|mysql|mongo/, suggestions: ['PostgreSQL', 'MySQL', 'MongoDB', 'PlanetScale', 'Supabase'] },
  { pattern: /queue|kafka|broker|pubsub/, suggestions: ['Apache Kafka', 'RabbitMQ', 'AWS SQS/SNS', 'Google Pub/Sub'] },
  { pattern: /cdn/, suggestions: ['Cloudflare', 'AWS CloudFront', 'Fastly', 'Akamai'] },
  { pattern: /gateway|proxy/, suggestions: ['Kong', 'AWS API Gateway', 'Nginx', 'Traefik', 'Istio'] },
  { pattern: /search/, suggestions: ['Elasticsearch', 'Typesense', 'Meilisearch', 'Algolia'] },
  { pattern: /storage|s3|blob/, suggestions: ['AWS S3', 'Google Cloud Storage', 'Cloudflare R2', 'MinIO'] },
  { pattern: /monitor|observ|metric/, suggestions: ['Prometheus + Grafana', 'Datadog', 'New Relic', 'OpenTelemetry'] },
]

export function getTechSuggestions(label: string, color: string): string[] {
  const l = label.toLowerCase()

  // Label-based match first (more specific)
  for (const { pattern, suggestions } of LABEL_SUGGESTIONS) {
    if (pattern.test(l)) return suggestions
  }

  // Fall back to color-based
  return COLOR_SUGGESTIONS[color] ?? ['Docker', 'Kubernetes', 'AWS ECS', 'Railway', 'Render']
}
