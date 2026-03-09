'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

// Node positions in percent of container (matching LaunchpadCanvas layout)
// These match the absolute positions set in LaunchpadCanvas
const NODES = [
  { cx: 160, cy: 240 },  // scan
  { cx: 420, cy: 380 },  // target
  { cx: 700, cy: 200 },  // engine
  { cx: 940, cy: 340 },  // takeoff
]

// Build a smooth cubic bezier path through all 4 nodes
function buildPath(nodes: { cx: number; cy: number }[]) {
  if (nodes.length < 2) return ''
  let d = `M ${nodes[0].cx} ${nodes[0].cy}`
  for (let i = 0; i < nodes.length - 1; i++) {
    const p1 = nodes[i]
    const p2 = nodes[i + 1]
    const cpx1 = p1.cx + (p2.cx - p1.cx) * 0.5
    const cpy1 = p1.cy
    const cpx2 = p1.cx + (p2.cx - p1.cx) * 0.5
    const cpy2 = p2.cy
    d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${p2.cx} ${p2.cy}`
  }
  return d
}

const PATH = buildPath(NODES)
const PATH_LENGTH = 1200 // approximate total path length for animation

interface Props {
  completedCount: number
}

export function FlightPath({ completedCount }: Props) {
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      strokeDashoffset: 0,
      transition: { duration: 1.5, ease: 'easeInOut' },
    })
  }, [controls])

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="1100"
      height="480"
      viewBox="0 0 1100 480"
      aria-hidden="true"
    >
      {/* Background path (full, dimmed) */}
      <path
        d={PATH}
        fill="none"
        stroke="#3f3f46"
        strokeWidth="2"
        strokeDasharray="8 6"
        opacity="0.4"
      />

      {/* Animated foreground path (draw-on) */}
      <motion.path
        d={PATH}
        fill="none"
        stroke="#6366f1"
        strokeWidth="2"
        strokeDasharray={`8 6`}
        strokeDashoffset={PATH_LENGTH}
        animate={controls}
        opacity="0.7"
      />

      {/* Dots at each node */}
      {NODES.map((node, i) => (
        <circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r="4"
          fill={i < completedCount ? '#6366f1' : '#3f3f46'}
          opacity="0.6"
        />
      ))}
    </svg>
  )
}
