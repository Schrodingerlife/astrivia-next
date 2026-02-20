"use client";

/**
 * Ecosystem-themed SVG backgrounds for Astrivia.
 *
 * Visual concept: three nested ecosystems converging toward the patient —
 *   Outer:  Industry sectors (field, regulatory, marketing, post-market)
 *   Middle: Astrivia tools (PharmaRoleplay, Social Vigilante, MedSafe…)
 *   Core:   Google infrastructure connecting everything
 *   Center: The patient — the purpose of it all
 *
 * All pure SVG + CSS, zero JS animation overhead.
 */

/* ══ ECOSYSTEM CONVERGENCE FLOW ═════════════════════════════════════════════
 * Multiple streams flowing from the edges toward a glowing center.
 * Represents industry sectors + tools all pointing at the patient outcome.
 */
export function ConvergeFlowSVG({ className = "" }: { className?: string }) {
    // Sources: positions around the canvas edges
    const W = 600, H = 500;
    const cx = W * 0.55, cy = H * 0.48; // "patient" focus point (slightly off-center)

    const sources = [
        { x: 20,  y: 60,   color: "#00D9FF", label: "Campo",       delay: "0s"    },
        { x: 60,  y: 200,  color: "#A855F7", label: "Regulatório", delay: "0.4s"  },
        { x: 30,  y: 370,  color: "#10B981", label: "Pós-mercado", delay: "0.9s"  },
        { x: 180, y: 470,  color: "#00D9FF", label: "Compliance",  delay: "1.3s"  },
        { x: 400, y: 490,  color: "#A855F7", label: "Marketing",   delay: "0.2s"  },
        { x: 560, y: 420,  color: "#10B981", label: "Safety",      delay: "1.1s"  },
        { x: 590, y: 200,  color: "#00D9FF", label: "MedSafe",     delay: "0.7s"  },
        { x: 490, y: 30,   color: "#A855F7", label: "Roleplay",    delay: "1.6s"  },
        { x: 280, y: 10,   color: "#10B981", label: "Vigilante",   delay: "0.5s"  },
        { x: 120, y: 20,   color: "#00D9FF", label: "Letterfix",   delay: "1.8s"  },
    ];

    // Generate a curved bezier path from source to focus, with a natural arc
    function curveTo(sx: number, sy: number, i: number): string {
        // Control point: midpoint offset to create natural curve
        const mx = (sx + cx) / 2;
        const my = (sy + cy) / 2;
        const offset = (i % 2 === 0 ? 1 : -1) * 40;
        const cpx = mx + (sy - cy) * 0.2 + offset;
        const cpy = my - (sx - cx) * 0.2 + offset;
        return `M ${sx} ${sy} Q ${cpx} ${cpy} ${cx} ${cy}`;
    }

    return (
        <svg
            className={className}
            viewBox={`0 0 ${W} ${H}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                {sources.map((s, i) => (
                    <linearGradient key={`cg-${i}`} id={`cg-${i}`}
                        x1={s.x} y1={s.y} x2={cx} y2={cy} gradientUnits="userSpaceOnUse">
                        <stop offset="0%"   stopColor={s.color} stopOpacity="0" />
                        <stop offset="40%"  stopColor={s.color} stopOpacity="0.35" />
                        <stop offset="100%" stopColor={s.color} stopOpacity="0.7" />
                    </linearGradient>
                ))}
                {/* Center glow */}
                <radialGradient id="cg-center" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#00D9FF" stopOpacity="0.9" />
                    <stop offset="40%"  stopColor="#00D9FF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="cg-halo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
                <filter id="cf-glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>

            {/* Flow paths */}
            {sources.map((s, i) => (
                <g key={i}>
                    <path
                        d={curveTo(s.x, s.y, i)}
                        stroke={`url(#cg-${i})`}
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />
                    {/* Animated dot flowing along each path */}
                    <circle r="2.5" fill={s.color} opacity="0.8" filter="url(#cf-glow)">
                        <animateMotion
                            dur={`${2.8 + (i % 4) * 0.5}s`}
                            repeatCount="indefinite"
                            begin={s.delay}
                        >
                            <mpath href={`#flow-path-${i}`} />
                        </animateMotion>
                    </circle>
                    <path id={`flow-path-${i}`} d={curveTo(s.x, s.y, i)} style={{ display: "none" }} />
                    {/* Source node */}
                    <circle cx={s.x} cy={s.y} r="3" fill={s.color} opacity="0.4" />
                    <circle cx={s.x} cy={s.y} r="5" fill={s.color} opacity="0.08" />
                </g>
            ))}

            {/* Center "patient" node */}
            <circle cx={cx} cy={cy} r="40" fill="url(#cg-center)" />
            <circle cx={cx} cy={cy} r="20" fill="url(#cg-center)" />
            <circle cx={cx} cy={cy} r="8"  fill="url(#cg-halo)" filter="url(#cf-glow)" />
            <circle cx={cx} cy={cy} r="3"  fill="white" opacity="0.9" />

            {/* Pulse rings on center */}
            <circle cx={cx} cy={cy} r="14" stroke="#00D9FF" strokeWidth="0.8" strokeOpacity="0.3">
                <animate attributeName="r" values="14;30;14" dur="3s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
            </circle>
        </svg>
    );
}

/* ══ ORBITAL ECOSYSTEM ══════════════════════════════════════════════════════
 * Three concentric elliptical orbits, each tilted at a different angle.
 * Outer = industry sectors, Middle = Astrivia tools, Inner = Google infra.
 * Nodes orbit each ring. Center glows.
 */
export function OrbitalEcosystemSVG({ className = "" }: { className?: string }) {
    const cx = 250, cy = 250;

    const orbits = [
        // [rx, ry, rotation, color, nodeCount, duration, orbitOpacity]
        [160, 55,  -15, "#00D9FF", 4, "28s", 0.18],
        [110, 40,   30, "#A855F7", 3, "20s", 0.22],
        [ 65, 25,  -45, "#10B981", 3, "14s", 0.28],
    ] as const;

    // Points evenly distributed on an ellipse, rotated by angle
    function ellipsePoint(rx: number, ry: number, angleDeg: number, t: number): [number, number] {
        const a = (t * 2 * Math.PI) + (angleDeg * Math.PI / 180);
        const rotRad = angleDeg * Math.PI / 180;
        const x0 = rx * Math.cos(a);
        const y0 = ry * Math.sin(a);
        return [
            cx + x0 * Math.cos(rotRad) - y0 * Math.sin(rotRad),
            cy + x0 * Math.sin(rotRad) + y0 * Math.cos(rotRad),
        ];
    }

    return (
        <svg
            className={className}
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="orb-center" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#00D9FF" stopOpacity="1" />
                    <stop offset="35%"  stopColor="#00D9FF" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
                </radialGradient>
                <filter id="orb-glow">
                    <feGaussianBlur stdDeviation="2" result="b" />
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                {orbits.map(([rx, ry, rot, color, , , ], i) => (
                    <linearGradient key={`og-${i}`} id={`og-${i}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%"   stopColor={color} stopOpacity="0" />
                        <stop offset="50%"  stopColor={color} stopOpacity="0.45" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                ))}
            </defs>

            {/* Orbit ellipses */}
            {orbits.map(([rx, ry, rot, color, , , opacity], i) => (
                <ellipse key={i}
                    cx={cx} cy={cy} rx={rx} ry={ry}
                    transform={`rotate(${rot} ${cx} ${cy})`}
                    stroke={color} strokeWidth="0.8" strokeOpacity={opacity}
                    strokeDasharray="4 8"
                />
            ))}

            {/* Orbiting nodes */}
            {orbits.map(([rx, ry, rot, color, count, duration], orbitIdx) =>
                Array.from({ length: count }, (_, ni) => {
                    const t0 = ni / count;
                    const [px, py] = ellipsePoint(rx, ry, rot as number, t0);
                    return (
                        <g key={`n-${orbitIdx}-${ni}`}>
                            {/* Glow halo */}
                            <circle cx={px} cy={py} r="10" fill={color} opacity="0.06" />
                            {/* Node */}
                            <circle cx={px} cy={py} r="3.5" fill={color} opacity="0.65" filter="url(#orb-glow)" />
                            <circle cx={px} cy={py} r="1.5" fill="white" opacity="0.8" />
                            {/* Line to center */}
                            <line x1={px} y1={py} x2={cx} y2={cy}
                                stroke={color} strokeWidth="0.5" strokeOpacity="0.12" />
                        </g>
                    );
                })
            )}

            {/* Center glow — "the patient" */}
            <circle cx={cx} cy={cy} r="45" fill="url(#orb-center)" />
            <circle cx={cx} cy={cy} r="20" fill="url(#orb-center)" opacity="0.7" />
            <circle cx={cx} cy={cy} r="7"  fill="white" opacity="0.8" filter="url(#orb-glow)" />
            <circle cx={cx} cy={cy} r="3"  fill="white" />

            {/* Pulse */}
            <circle cx={cx} cy={cy} stroke="#00D9FF" strokeWidth="0.8" fill="none">
                <animate attributeName="r" values="10;55;10" dur="4s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
            </circle>
        </svg>
    );
}

/* ══ INFRASTRUCTURE GRID ═════════════════════════════════════════════════════
 * Clean tech node-graph representing the Google Cloud backbone.
 * Nodes at grid intersections, some highlighted as hubs.
 * More architectural/tech, less biological.
 */
export function InfraGridSVG({ className = "" }: { className?: string }) {
    const COLS = 13, ROWS = 6;
    const SPACING = 70;
    const W = COLS * SPACING, H = ROWS * SPACING;

    // Hub nodes that glow — represent key connection points
    const hubs = new Set([
        `2-1`, `5-2`, `8-1`, `11-2`,
        `1-3`, `4-4`, `7-3`, `10-4`, `12-3`,
        `3-5`, `6-4`, `9-5`,
    ]);

    type Node = { x: number; y: number; key: string; isHub: boolean };
    const nodes: Node[] = [];

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            nodes.push({
                x: c * SPACING + SPACING / 2,
                y: r * SPACING + SPACING / 2,
                key: `${c}-${r}`,
                isHub: hubs.has(`${c}-${r}`),
            });
        }
    }

    // Edges: connect adjacent nodes (horizontal + vertical + some diagonals)
    const edges: Array<[Node, Node]> = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const n = nodes[r * COLS + c];
            if (c < COLS - 1) edges.push([n, nodes[r * COLS + c + 1]]);       // horizontal
            if (r < ROWS - 1) edges.push([n, nodes[(r + 1) * COLS + c]]);     // vertical
            if (c < COLS - 1 && r < ROWS - 1 && (c + r) % 3 === 0)            // selective diagonal
                edges.push([n, nodes[(r + 1) * COLS + c + 1]]);
        }
    }

    return (
        <svg
            className={className}
            viewBox={`0 0 ${W} ${H}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="ig-hub-c" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#00D9FF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="ig-hub-p" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#A855F7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
                </radialGradient>
                <filter id="ig-glow">
                    <feGaussianBlur stdDeviation="1.5" result="b" />
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>

            {/* Grid edges */}
            {edges.map(([a, b], i) => (
                <line key={i}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke="rgba(255,255,255,0.045)" strokeWidth="0.8"
                />
            ))}

            {/* Nodes */}
            {nodes.map((n, i) => (
                <g key={n.key}>
                    {n.isHub && (
                        <>
                            <circle cx={n.x} cy={n.y} r="14"
                                fill={i % 2 === 0 ? "url(#ig-hub-c)" : "url(#ig-hub-p)"}
                                style={{
                                    animation: `hexPulse ${2 + (i % 3)}s ease-in-out infinite`,
                                    animationDelay: `${(i % 5) * 0.5}s`,
                                }}
                            />
                            <circle cx={n.x} cy={n.y} r="3.5"
                                fill={i % 2 === 0 ? "#00D9FF" : "#A855F7"}
                                opacity="0.7"
                                filter="url(#ig-glow)"
                            />
                            <circle cx={n.x} cy={n.y} r="1.5" fill="white" opacity="0.8" />
                        </>
                    )}
                    {!n.isHub && (
                        <circle cx={n.x} cy={n.y} r="1.5"
                            fill="rgba(255,255,255,0.12)"
                        />
                    )}
                </g>
            ))}
        </svg>
    );
}
