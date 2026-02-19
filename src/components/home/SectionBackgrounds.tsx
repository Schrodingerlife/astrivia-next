"use client";

/**
 * Life Sciences themed SVG background components.
 * Pure SVG + CSS — zero extra dependencies.
 */

/* ══ MOLECULAR NETWORK ══════════════════════════════════════════════════════ */
// Floating nodes connected like a pharma/biotech molecular graph

const MOL_NODES = [
    { id: "a", cx: 80,  cy: 100, r: 6,  color: "#00D9FF", delay: "0s"   },
    { id: "b", cx: 220, cy: 50,  r: 4,  color: "#A855F7", delay: "0.8s" },
    { id: "c", cx: 340, cy: 130, r: 8,  color: "#00D9FF", delay: "1.4s" },
    { id: "d", cx: 170, cy: 200, r: 5,  color: "#10B981", delay: "0.3s" },
    { id: "e", cx: 55,  cy: 290, r: 4,  color: "#A855F7", delay: "1.1s" },
    { id: "f", cx: 290, cy: 260, r: 6,  color: "#00D9FF", delay: "1.9s" },
    { id: "g", cx: 420, cy: 190, r: 5,  color: "#10B981", delay: "0.5s" },
    { id: "h", cx: 140, cy: 360, r: 4,  color: "#00D9FF", delay: "2.1s" },
    { id: "i", cx: 370, cy: 360, r: 7,  color: "#A855F7", delay: "0.7s" },
    { id: "j", cx: 240, cy: 430, r: 4,  color: "#10B981", delay: "1.6s" },
    { id: "k", cx: 460, cy: 310, r: 3,  color: "#00D9FF", delay: "1.3s" },
    { id: "l", cx: 30,  cy: 180, r: 3,  color: "#10B981", delay: "0.9s" },
];

const MOL_EDGES = [
    ["a","b"],["b","c"],["a","d"],["c","g"],["d","e"],["d","f"],
    ["f","g"],["e","h"],["f","i"],["i","j"],["h","j"],["b","d"],
    ["c","f"],["g","i"],["g","k"],["a","l"],["l","e"],["c","i"],
];

export function MolecularNetworkSVG({ className = "" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 500 480"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                {MOL_NODES.map(n => (
                    <radialGradient key={`mg-${n.id}`} id={`mg-${n.id}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={n.color} stopOpacity="0.6" />
                        <stop offset="100%" stopColor={n.color} stopOpacity="0" />
                    </radialGradient>
                ))}
                <filter id="mol-glow">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>

            {/* Connection lines */}
            {MOL_EDGES.map(([from, to], i) => {
                const a = MOL_NODES.find(n => n.id === from)!;
                const b = MOL_NODES.find(n => n.id === to)!;
                return (
                    <line key={i}
                        x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
                        stroke="rgba(0,217,255,0.10)" strokeWidth="1"
                    />
                );
            })}

            {/* Nodes */}
            {MOL_NODES.map(n => (
                <g key={n.id} style={{ animationDelay: n.delay }} className="mol-node-float">
                    {/* Outer glow halo */}
                    <circle cx={n.cx} cy={n.cy} r={n.r * 5} fill={`url(#mg-${n.id})`} />
                    {/* Main node */}
                    <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.color} opacity="0.55" filter="url(#mol-glow)" />
                    {/* Bright center */}
                    <circle cx={n.cx} cy={n.cy} r={n.r * 0.45} fill="white" opacity="0.7" />
                </g>
            ))}
        </svg>
    );
}

/* ══ DNA HELIX ══════════════════════════════════════════════════════════════ */
// Vertical double helix — pharma's most iconic visual

function buildHelixPath(cx: number, amp: number, cycleH: number, cycles: number, phase: number): string {
    // One full sine cycle = two cubic bezier segments
    let d = `M ${cx + amp * Math.sin(phase)} 0`;
    for (let i = 0; i < cycles; i++) {
        const y0 = i * cycleH;
        const y1 = y0 + cycleH / 2;
        const y2 = y0 + cycleH;
        // Up half
        d += ` C ${cx + amp * 1.5 * Math.cos(phase)} ${y0 + cycleH * 0.25},`;
        d += ` ${cx + amp * 1.5 * Math.cos(phase)} ${y0 + cycleH * 0.25 * 3},`;
        d += ` ${cx - amp * Math.sin(phase)} ${y1}`;
        // Down half
        d += ` C ${cx - amp * 1.5 * Math.cos(phase)} ${y1 + cycleH * 0.25},`;
        d += ` ${cx - amp * 1.5 * Math.cos(phase)} ${y1 + cycleH * 0.25 * 3},`;
        d += ` ${cx + amp * Math.sin(phase)} ${y2}`;
    }
    return d;
}

export function DNAHelixSVG({ className = "" }: { className?: string }) {
    const cx = 60, amp = 32, cycleH = 80, cycles = 6;
    const totalH = cycleH * cycles;

    // Generate crossbar points (one per half-cycle, alternating sides)
    const crossbars: Array<{ y: number; x1: number; x2: number; opacity: number }> = [];
    for (let i = 0; i < cycles * 2; i++) {
        const y = i * (cycleH / 2) + cycleH / 4;
        const side = i % 2 === 0 ? 1 : -1;
        crossbars.push({
            y,
            x1: cx + amp * 0.9 * side,
            x2: cx - amp * 0.9 * side,
            opacity: 0.25 + (Math.abs(Math.sin(i * 0.9)) * 0.35),
        });
    }

    return (
        <svg
            className={className}
            viewBox={`0 0 120 ${totalH}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="dna-grad-1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D9FF" stopOpacity="0" />
                    <stop offset="20%" stopColor="#00D9FF" stopOpacity="0.5" />
                    <stop offset="80%" stopColor="#A855F7" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="dna-grad-2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0" />
                    <stop offset="20%" stopColor="#A855F7" stopOpacity="0.5" />
                    <stop offset="80%" stopColor="#00D9FF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
                </linearGradient>
                <filter id="dna-glow">
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>

            {/* Crossbars */}
            {crossbars.map((cb, i) => (
                <line key={i}
                    x1={cb.x1} y1={cb.y} x2={cb.x2} y2={cb.y}
                    stroke="#00D9FF" strokeWidth="1.5"
                    strokeOpacity={cb.opacity}
                />
            ))}

            {/* Strand 1 */}
            <path
                d={buildHelixPath(cx, amp, cycleH, cycles, 0)}
                stroke="url(#dna-grad-1)"
                strokeWidth="2"
                filter="url(#dna-glow)"
            />
            {/* Strand 2 */}
            <path
                d={buildHelixPath(cx, amp, cycleH, cycles, Math.PI)}
                stroke="url(#dna-grad-2)"
                strokeWidth="2"
                filter="url(#dna-glow)"
            />

            {/* Node dots at crossbar intersections — strand 1 side */}
            {crossbars.map((cb, i) => (
                <g key={`dot-${i}`}>
                    <circle cx={cb.x1} cy={cb.y} r="3" fill={i % 2 === 0 ? "#00D9FF" : "#A855F7"} opacity="0.6" />
                    <circle cx={cb.x2} cy={cb.y} r="3" fill={i % 2 === 0 ? "#A855F7" : "#00D9FF"} opacity="0.6" />
                </g>
            ))}
        </svg>
    );
}

/* ══ HEXAGON GRID ═══════════════════════════════════════════════════════════ */
// Honeycomb / molecular lattice pattern

export function HexagonGridSVG({ className = "" }: { className?: string }) {
    const hexSize = 28;
    const cols = 16, rows = 7;
    const hexW = hexSize * 2;
    const hexH = Math.sqrt(3) * hexSize;
    const hexagons: Array<{ x: number; y: number; id: number; lit: boolean }> = [];
    let id = 0;

    // Highlight some hexagons thematically
    const litSet = new Set([2, 7, 15, 22, 31, 38, 45, 55, 60, 68, 75]);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * hexW * 0.75 + hexSize;
            const y = r * hexH + (c % 2 === 0 ? 0 : hexH / 2) + hexSize;
            hexagons.push({ x, y, id: id++, lit: litSet.has(id) });
        }
    }

    function hexPoints(cx: number, cy: number, size: number): string {
        return Array.from({ length: 6 }, (_, i) => {
            const angle = (Math.PI / 180) * (60 * i - 30);
            return `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`;
        }).join(" ");
    }

    return (
        <svg
            className={className}
            viewBox={`0 0 ${hexW * cols * 0.75 + hexSize} ${hexH * rows + hexH}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="hex-lit-1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="hex-lit-2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
                </radialGradient>
            </defs>
            {hexagons.map((h, i) => (
                <polygon
                    key={h.id}
                    points={hexPoints(h.x, h.y, hexSize - 1)}
                    fill={h.lit ? (i % 3 === 0 ? "url(#hex-lit-1)" : "url(#hex-lit-2)") : "none"}
                    stroke={h.lit ? "rgba(0,217,255,0.15)" : "rgba(255,255,255,0.04)"}
                    strokeWidth="0.8"
                    style={h.lit ? {
                        animation: `hexPulse ${2.5 + (i % 3)}s ease-in-out infinite`,
                        animationDelay: `${(i % 7) * 0.4}s`,
                    } : undefined}
                />
            ))}
        </svg>
    );
}
