import { useState } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { formatCategoryLabel, formatLaneLabel } from '../lib/presentation'
import type { NodeCategory, NodeImportance, NodeLane, NodeShape } from '../lib/types'

export interface CustomNodeData {
  label: string
  color: string
  description: string
  animIndex: number
  category?: NodeCategory
  lane?: NodeLane
  importance?: NodeImportance
  shape?: NodeShape
}

export function NodeIcon({
  label,
  color,
  category,
  shape,
}: {
  label: string
  color: string
  category?: NodeCategory
  shape?: NodeShape
}) {
  const l = (label ?? '').toLowerCase()

  // Client / browser / user / frontend
  if (shape === 'screen' || category === 'client' || /client|browser|user|frontend|mobile|app$/.test(l)) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    )
  }

  // Gateway / proxy / load balancer
  if (shape === 'shield' || category === 'gateway' || /gateway|proxy|load.?balanc|ingress|nginx|reverse/.test(l)) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
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
  if (shape === 'cylinder' || category === 'database' || /database|db|postgres|mysql|mongo|redis|dynamo|storage|s3|bucket|blob|sql/.test(l)) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    )
  }

  // Queue / broker / kafka / rabbitmq / pubsub / event / stream / bus
  if (shape === 'queue' || category === 'queue' || /queue|broker|kafka|rabbit|pubsub|event|stream|bus|topic|sns|sqs/.test(l)) {
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
  if (shape === 'pill' || category === 'cache' || /cache|cdn|memcache|varnish/.test(l)) {
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

function getNodeShell(shape?: NodeShape, importance?: NodeImportance) {
  const density = importance === 'primary' ? 'min-w-[210px]' : 'min-w-[180px]'

  switch (shape) {
    case 'screen':
      return `${density} rounded-[24px] border shadow-[0_18px_40px_rgba(118,91,36,0.10)]`
    case 'shield':
      return `${density} rounded-[22px] border-[1.5px] shadow-[0_18px_34px_rgba(145,71,44,0.12)]`
    case 'queue':
      return `${density} rounded-[26px] border shadow-[0_18px_34px_rgba(181,116,28,0.12)]`
    case 'cylinder':
      return `${density} rounded-[24px] border shadow-[0_20px_38px_rgba(25,104,88,0.14)]`
    case 'pill':
      return `${density} rounded-[999px] border shadow-[0_16px_28px_rgba(47,95,44,0.12)]`
    case 'external':
      return `${density} rounded-[20px] border border-dashed shadow-[0_16px_30px_rgba(111,95,69,0.10)]`
    case 'service':
    default:
      return `${density} rounded-[22px] border shadow-[0_20px_38px_rgba(106,83,54,0.11)]`
  }
}

export function CustomNode({ data }: NodeProps<CustomNodeData>) {
  const [hovered, setHovered] = useState(false)
  const shellClass = getNodeShell(data.shape, data.importance)
  const badgeLabel = data.category && data.lane
    ? `${formatCategoryLabel(data.category)} · ${formatLaneLabel(data.lane)}`
    : undefined

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
        className={`${shellClass} px-4 py-3.5 cursor-grab active:cursor-grabbing`}
        style={{
          background: hovered
            ? `linear-gradient(180deg, #fffefd 0%, ${data.color}14 100%)`
            : `linear-gradient(180deg, #fffdfa 0%, ${data.color}11 100%)`,
          borderColor: hovered ? `${data.color}66` : `${data.color}40`,
          transition: 'box-shadow 0.18s, border-color 0.18s, transform 0.18s, background 0.18s',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border"
            style={{
              color: data.color,
              background: `${data.color}10`,
              borderColor: `${data.color}30`,
            }}
          >
            <NodeIcon label={data.label} color={data.color} category={data.category} shape={data.shape} />
          </div>
          <div className="min-w-0 flex-1">
            {badgeLabel && (
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#8a7861]">
                  {badgeLabel}
                </span>
                {data.importance && (
                  <span
                    className="rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em]"
                    style={{
                      color: data.color,
                      background: `${data.color}10`,
                      borderColor: `${data.color}30`,
                    }}
                  >
                    {data.importance}
                  </span>
                )}
              </div>
            )}
            <div className="text-[14px] font-semibold leading-tight text-[#231d16]">
              {data.label}
            </div>
            {data.description && (
              <div className="mt-1 text-[11px] leading-relaxed text-[#7a6856]">
                {data.description}
              </div>
            )}
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-3 !h-3" />
    </div>
  )
}
