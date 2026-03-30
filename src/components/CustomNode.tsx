import { useState } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { motion, AnimatePresence } from 'framer-motion'


export interface CustomNodeData {
  label: string
  color: string
  description: string
  animIndex: number
}

export function NodeIcon({ label, color }: { label: string; color: string }) {
  const l = (label ?? '').toLowerCase()

  // Client / browser / user / frontend
  if (/client|browser|user|frontend|mobile|app$/.test(l)) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    )
  }

  // Gateway / proxy / load balancer
  if (/gateway|proxy|load.?balanc|ingress|nginx|reverse/.test(l)) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    )
  }

  // Auth / security / identity
  if (/auth|security|identity|sso|oauth|jwt|login|permission/.test(l)) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  }

  // Database / storage / postgres / mysql / mongo / redis / s3
  if (/database|db|postgres|mysql|mongo|redis|dynamo|storage|s3|bucket|blob|sql/.test(l)) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    )
  }

  // Queue / broker / kafka / rabbitmq / pubsub / event / stream / bus
  if (/queue|broker|kafka|rabbit|pubsub|event|stream|bus|topic|sns|sqs/.test(l)) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M3 12h18M3 18h18" />
        <rect x="2" y="4" width="4" height="4" rx="1" fill={color} opacity="0.4" />
        <rect x="2" y="10" width="4" height="4" rx="1" fill={color} opacity="0.4" />
        <rect x="2" y="16" width="4" height="4" rx="1" fill={color} opacity="0.4" />
      </svg>
    )
  }

  // Cache / cdn / memcache
  if (/cache|cdn|memcache|varnish/.test(l)) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  }

  // API / REST / GraphQL / endpoint
  if (/\bapi\b|rest|graphql|endpoint|grpc/.test(l)) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="15" y1="9" x2="9" y2="15" />
      </svg>
    )
  }

  // Worker / job / scheduler / cron / processor
  if (/worker|job|scheduler|cron|processor|task/.test(l)) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    )
  }

  // Default: generic service / server
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <circle cx="6" cy="6" r="1" fill={color} />
      <circle cx="6" cy="18" r="1" fill={color} />
    </svg>
  )
}

export function CustomNode({ data }: NodeProps<CustomNodeData>) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
      style={{
        animation: `node-enter 0.4s ease-out ${data.animIndex * 0.12}s both`,
      }}
    >
      <div
        className="rounded-xl px-5 py-3 shadow-lg border-2 min-w-[140px] cursor-grab active:cursor-grabbing"
        style={{
          background: `${data.color}15`,
          borderColor: `${data.color}99`,
          boxShadow: hovered ? `0 0 16px ${data.color}44` : `0 2px 8px #0008`,
          transition: 'box-shadow 0.15s, border-color 0.15s, transform 0.15s',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-2">
          <NodeIcon label={data.label} color={data.color} />
        </div>

        {/* Label */}
        <div
          className="text-xs font-semibold leading-tight text-center whitespace-nowrap"
          style={{ color: data.color }}
        >
          {data.label}
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && data.description && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 rounded-lg px-3 py-2 text-xs text-white shadow-xl pointer-events-none"
            style={{ background: '#1e1e2e', border: `1px solid ${data.color}44` }}
          >
            <div className="font-medium mb-0.5" style={{ color: data.color }}>
              {data.label}
            </div>
            <div className="text-gray-300 leading-snug">{data.description}</div>
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '5px solid #1e1e2e',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-3 !h-3" />
    </div>
  )
}
