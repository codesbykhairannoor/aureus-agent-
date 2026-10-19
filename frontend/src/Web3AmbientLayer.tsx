import React from 'react'
import { StarField } from './ui'

/* ═════════════════════════════════════════════════════════════════
   Web3 Ambient Background Layer
   Delivers flagship Web3 aesthetic:
   1. Dynamic particle starfield (cosmic digital dust)
   2. Floating 3D isometric blockchain wireframes (Left & Right)
   3. BNB Smart Chain glowing validator node
   4. Multi-spectrum ambient orbs (BNB Gold, Cyber Blue, Quantum Violet)
   5. Cybernetic perspective circuit traces
   All elements are fixed, pointer-events: none, GPU-accelerated.
   ═════════════════════════════════════════════════════════════════ */

export default function Web3AmbientLayer() {
  return (
    <div className="cp-web3-ambient-layer" aria-hidden="true">
      {/* 1. Digital Starfield Rain */}
      <StarField count={36} tone="rgba(240, 185, 11, 0.65)" />

      {/* 2. Ambient Nebula / Aurora Orbs */}
      <div className="cp-ambient-orbs">
        {/* Top-Center Solar Beam */}
        <div className="cp-amb-orb cp-amb-solar" />
        {/* Left Cyber Violet Flare */}
        <div className="cp-amb-orb cp-amb-violet" />
        {/* Right Cyber Blue Liquidity Flare */}
        <div className="cp-amb-orb cp-amb-cyan" />
        {/* Bottom Emerald Execution Flare */}
        <div className="cp-amb-orb cp-amb-emerald" />
      </div>

      {/* 3. Floating 3D Isometric Blockchain Wireframe (Left Gutter) */}
      <div className="cp-float-geo cp-float-left">
        <svg width="220" height="220" viewBox="0 0 200 200" fill="none" style={{ opacity: 0.32 }}>
          <defs>
            <linearGradient id="goldWire" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0B90B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FCD535" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="cyanWire" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B99FC" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#F0B90B" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glowLeft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Isometric Cube */}
          <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" stroke="url(#goldWire)" strokeWidth="1.2" fill="rgba(240,185,11,0.015)" filter="url(#glowLeft)" />
          {/* Inner Cube Facet Lines */}
          <line x1="100" y1="20" x2="100" y2="100" stroke="url(#goldWire)" strokeWidth="1.2" />
          <line x1="170" y1="60" x2="100" y2="100" stroke="url(#goldWire)" strokeWidth="1.2" />
          <line x1="30" y1="60" x2="100" y2="100" stroke="url(#goldWire)" strokeWidth="1.2" />
          <line x1="100" y1="100" x2="100" y2="180" stroke="url(#goldWire)" strokeWidth="1.2" />

          {/* Inner Suspended Block / Concentric Core */}
          <polygon points="100,50 145,75 145,125 100,150 55,125 55,75" stroke="url(#cyanWire)" strokeWidth="1" strokeDasharray="3 3" fill="rgba(59,153,252,0.02)" />
          <circle cx="100" cy="100" r="5" fill="#F0B90B" filter="url(#glowLeft)" />

          {/* Satellite Validator Nodes */}
          <circle cx="100" cy="20" r="3.5" fill="#F0B90B" />
          <circle cx="170" cy="60" r="3.5" fill="#3B99FC" />
          <circle cx="170" cy="140" r="3.5" fill="#F0B90B" />
          <circle cx="100" cy="180" r="3.5" fill="#3B99FC" />
          <circle cx="30" cy="140" r="3.5" fill="#F0B90B" />
          <circle cx="30" cy="60" r="3.5" fill="#3B99FC" />
        </svg>
      </div>

      {/* 4. Floating BNB Hexagonal Shield Node (Right Gutter) */}
      <div className="cp-float-geo cp-float-right">
        <svg width="240" height="240" viewBox="0 0 200 200" fill="none" style={{ opacity: 0.35 }}>
          <defs>
            <linearGradient id="bnbShield" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0B90B" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FCD535" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0B0E11" stopOpacity="0.05" />
            </linearGradient>
            <filter id="glowRight" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Hexagon Shield */}
          <polygon points="100,15 175,55 175,145 100,185 25,145 25,55" stroke="url(#bnbShield)" strokeWidth="1.5" fill="rgba(240, 185, 11, 0.02)" filter="url(#glowRight)" />

          {/* Concentric Hexagon */}
          <polygon points="100,35 155,67 155,133 100,165 45,133 45,67" stroke="rgba(240, 185, 11, 0.25)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Central BNB Chain Diamond Rhombus */}
          <polygon points="100,68 126,94 100,120 74,94" fill="rgba(240, 185, 11, 0.15)" stroke="#F0B90B" strokeWidth="1.5" />
          <polygon points="100,45 115,60 100,75 85,60" fill="rgba(252, 213, 53, 0.3)" />
          <polygon points="100,113 115,128 100,143 85,128" fill="rgba(252, 213, 53, 0.3)" />
          <polygon points="56,94 71,79 86,94 71,109" fill="rgba(252, 213, 53, 0.3)" />
          <polygon points="114,94 129,79 144,94 129,109" fill="rgba(252, 213, 53, 0.3)" />

          {/* Circuit Trace Rings */}
          <circle cx="100" cy="15" r="3" fill="#F0B90B" />
          <circle cx="175" cy="55" r="3" fill="#F0B90B" />
          <circle cx="175" cy="145" r="3" fill="#F0B90B" />
          <circle cx="100" cy="185" r="3" fill="#F0B90B" />
          <circle cx="25" cy="145" r="3" fill="#F0B90B" />
          <circle cx="25" cy="55" r="3" fill="#F0B90B" />
        </svg>
      </div>

      {/* 5. Subtle High-Tech Circuit Traces along viewport sides */}
      <div className="cp-circuit-line cp-circuit-left" />
      <div className="cp-circuit-line cp-circuit-right" />
    </div>
  )
}
