const EXAMPLES = [
  {
    label: 'Microservices',
    prompt:
      'Design a microservices architecture with an API gateway, authentication service, user service, order service, and a PostgreSQL database. Show the request flow from client to services.',
  },
  {
    label: 'Event-Driven',
    prompt:
      'Create an event-driven architecture with a producer publishing events to a Kafka topic, two consumers (order processor and notification service), and a Redis cache and MySQL database as sinks.',
  },
  {
    label: 'CI/CD Pipeline',
    prompt:
      'Show a CI/CD pipeline from developer commit through GitHub, triggering GitHub Actions, running tests, building a Docker image, pushing to ECR, and deploying to ECS production.',
  },
  {
    label: '3-Tier Web App',
    prompt:
      'Diagram a classic 3-tier web application: React frontend served via CloudFront CDN, Node.js REST API on EC2 behind an ALB, and RDS PostgreSQL database with a Redis cache layer.',
  },
]

interface ExamplePromptsProps {
  onSelect: (prompt: string) => void
}

export function ExamplePrompts({ onSelect }: ExamplePromptsProps) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
        Examples
      </p>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => onSelect(ex.prompt)}
            className="text-xs px-3 py-1.5 rounded-full border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400/50 transition-all"
          >
            {ex.label}
          </button>
        ))}
      </div>
    </div>
  )
}
