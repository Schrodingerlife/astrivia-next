"use client";

/* ============== 3D-STYLE PRODUCT LOGOS ============== */
/* Premium SVG logos with gradients, shadows, and 3D effects */

export function PharmaRoleplayLogo({ size = 48 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="pr-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00E5FF" />
                    <stop offset="1" stopColor="#0091EA" />
                </linearGradient>
                <linearGradient id="pr-shine" x1="0" y1="0" x2="40" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.3" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <filter id="pr-shadow" x="-4" y="-2" width="72" height="72">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#00D9FF" floodOpacity="0.3" />
                </filter>
            </defs>
            {/* Base shape with 3D shadow */}
            <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#pr-bg)" filter="url(#pr-shadow)" />
            {/* Glass shine overlay */}
            <rect x="4" y="4" width="56" height="28" rx="16" fill="url(#pr-shine)" />
            {/* Microphone body */}
            <rect x="26" y="16" width="12" height="20" rx="6" fill="white" fillOpacity="0.95" />
            {/* Microphone stand arc */}
            <path d="M22 30C22 37.18 27.82 43 35 43H29C21.82 43 22 36 22 30" stroke="white" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M42 30C42 37.18 36.18 43 29 43H35C42.18 43 42 36 42 30" stroke="white" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Stand line */}
            <line x1="32" y1="43" x2="32" y2="49" stroke="white" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="26" y1="49" x2="38" y2="49" stroke="white" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" />
            {/* Sound waves */}
            <path d="M18 26C16 28 16 33 18 36" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M46 26C48 28 48 33 46 36" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
    );
}

export function SocialVigilanteLogo({ size = 48 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="sv-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#C084FC" />
                    <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
                <linearGradient id="sv-shine" x1="0" y1="0" x2="40" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.3" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <filter id="sv-shadow" x="-4" y="-2" width="72" height="72">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#A855F7" floodOpacity="0.3" />
                </filter>
            </defs>
            <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#sv-bg)" filter="url(#sv-shadow)" />
            <rect x="4" y="4" width="56" height="28" rx="16" fill="url(#sv-shine)" />
            {/* Shield */}
            <path d="M32 14L18 20V30C18 38.84 24 46 32 50C40 46 46 38.84 46 30V20L32 14Z" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.9" strokeWidth="2" />
            {/* Radar waves inside shield */}
            <circle cx="32" cy="30" r="4" fill="white" fillOpacity="0.9" />
            <circle cx="32" cy="30" r="8" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" fill="none" />
            <circle cx="32" cy="30" r="12" stroke="white" strokeOpacity="0.3" strokeWidth="1" fill="none" />
            {/* Scan line */}
            <line x1="32" y1="30" x2="40" y2="22" stroke="white" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function MedSafeLogo({ size = 48 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="ms-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#34D399" />
                    <stop offset="1" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="ms-shine" x1="0" y1="0" x2="40" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.3" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <filter id="ms-shadow" x="-4" y="-2" width="72" height="72">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10B981" floodOpacity="0.3" />
                </filter>
            </defs>
            <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#ms-bg)" filter="url(#ms-shadow)" />
            <rect x="4" y="4" width="56" height="28" rx="16" fill="url(#ms-shine)" />
            {/* Document body */}
            <rect x="20" y="14" width="24" height="32" rx="3" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.9" strokeWidth="2" />
            {/* Document fold */}
            <path d="M38 14L44 20" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
            {/* Check lines */}
            <line x1="25" y1="24" x2="35" y2="24" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="25" y1="29" x2="39" y2="29" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="25" y1="34" x2="33" y2="34" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
            {/* Checkmark circle */}
            <circle cx="38" cy="38" r="8" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.9" strokeWidth="2" />
            <path d="M34 38L37 41L43 35" stroke="white" strokeOpacity="0.95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

export function InternMatchLogo({ size = 48 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="im-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FBBF24" />
                    <stop offset="1" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="im-shine" x1="0" y1="0" x2="40" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.35" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <filter id="im-shadow" x="-4" y="-2" width="72" height="72">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#F59E0B" floodOpacity="0.3" />
                </filter>
            </defs>
            <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#im-bg)" filter="url(#im-shadow)" />
            <rect x="4" y="4" width="56" height="28" rx="16" fill="url(#im-shine)" />
            {/* Person left */}
            <circle cx="24" cy="24" r="5" fill="white" fillOpacity="0.9" />
            <path d="M16 38C16 33.58 19.58 30 24 30C28.42 30 32 33.58 32 38" stroke="white" strokeOpacity="0.9" strokeWidth="2" fill="none" />
            {/* Person right */}
            <circle cx="40" cy="24" r="5" fill="white" fillOpacity="0.9" />
            <path d="M32 38C32 33.58 35.58 30 40 30C44.42 30 48 33.58 48 38" stroke="white" strokeOpacity="0.9" strokeWidth="2" fill="none" />
            {/* Connection line with pulse */}
            <line x1="29" y1="24" x2="35" y2="24" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="2 2" />
            {/* Briefcase bottom */}
            <rect x="26" y="40" width="12" height="10" rx="2" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
            <path d="M30 40V38C30 37 31 36 32 36C33 36 34 37 34 38V40" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />
        </svg>
    );
}

export function SciGenLogo({ size = 48 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="sg-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F472B6" />
                    <stop offset="1" stopColor="#BE185D" />
                </linearGradient>
                <linearGradient id="sg-shine" x1="0" y1="0" x2="40" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.3" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <filter id="sg-shadow" x="-4" y="-2" width="72" height="72">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#EC4899" floodOpacity="0.3" />
                </filter>
            </defs>
            <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#sg-bg)" filter="url(#sg-shadow)" />
            <rect x="4" y="4" width="56" height="28" rx="16" fill="url(#sg-shine)" />
            {/* DNA Helix */}
            <path d="M24 16C24 16 28 22 32 22C36 22 40 16 40 16" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M24 24C24 24 28 30 32 30C36 30 40 24 40 24" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M24 32C24 32 28 38 32 38C36 38 40 32 40 32" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Connection rungs */}
            <line x1="27" y1="19" x2="37" y2="19" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
            <line x1="27" y1="27" x2="37" y2="27" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
            <line x1="27" y1="35" x2="37" y2="35" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
            {/* Book base */}
            <path d="M18 42H46C46 42 46 50 32 50C18 50 18 42 18 42Z" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
            <line x1="32" y1="42" x2="32" y2="50" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
        </svg>
    );
}

/* ============== HERO BACKGROUND SVG ============== */
export function HeroBackgroundSVG() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            {/* Molecular structure - large molecule */}
            <circle cx="300" cy="200" r="8" fill="#00D9FF" />
            <circle cx="380" cy="160" r="6" fill="#00D9FF" />
            <circle cx="350" cy="280" r="5" fill="#00D9FF" />
            <circle cx="420" cy="240" r="7" fill="#00D9FF" />
            <circle cx="260" cy="300" r="4" fill="#00D9FF" />
            <line x1="300" y1="200" x2="380" y2="160" stroke="#00D9FF" strokeWidth="1.5" />
            <line x1="300" y1="200" x2="350" y2="280" stroke="#00D9FF" strokeWidth="1.5" />
            <line x1="350" y1="280" x2="420" y2="240" stroke="#00D9FF" strokeWidth="1.5" />
            <line x1="380" y1="160" x2="420" y2="240" stroke="#00D9FF" strokeWidth="1.5" />
            <line x1="350" y1="280" x2="260" y2="300" stroke="#00D9FF" strokeWidth="1" />

            {/* DNA helix right side */}
            <path d="M1100 100C1100 100 1130 140 1160 140C1190 140 1220 100 1220 100" stroke="#A855F7" strokeWidth="1.5" opacity="0.6" />
            <path d="M1100 160C1100 160 1130 200 1160 200C1190 200 1220 160 1220 160" stroke="#A855F7" strokeWidth="1.5" opacity="0.6" />
            <path d="M1100 220C1100 220 1130 260 1160 260C1190 260 1220 220 1220 220" stroke="#A855F7" strokeWidth="1.5" opacity="0.6" />
            <path d="M1100 280C1100 280 1130 320 1160 320C1190 320 1220 280 1220 280" stroke="#A855F7" strokeWidth="1.5" opacity="0.6" />
            <line x1="1120" y1="120" x2="1200" y2="120" stroke="#A855F7" strokeWidth="1" opacity="0.3" />
            <line x1="1120" y1="180" x2="1200" y2="180" stroke="#A855F7" strokeWidth="1" opacity="0.3" />
            <line x1="1120" y1="240" x2="1200" y2="240" stroke="#A855F7" strokeWidth="1" opacity="0.3" />
            <line x1="1120" y1="300" x2="1200" y2="300" stroke="#A855F7" strokeWidth="1" opacity="0.3" />

            {/* Pills/capsules scattered */}
            <rect x="800" y="650" width="40" height="18" rx="9" fill="#10B981" opacity="0.5" transform="rotate(-30 800 650)" />
            <rect x="160" y="600" width="35" height="16" rx="8" fill="#00D9FF" opacity="0.4" transform="rotate(15 160 600)" />

            {/* Neural network bottom */}
            <circle cx="600" cy="750" r="5" fill="#F59E0B" opacity="0.5" />
            <circle cx="700" cy="720" r="4" fill="#F59E0B" opacity="0.5" />
            <circle cx="650" cy="800" r="6" fill="#F59E0B" opacity="0.5" />
            <circle cx="750" cy="780" r="3" fill="#F59E0B" opacity="0.5" />
            <circle cx="550" cy="770" r="4" fill="#F59E0B" opacity="0.5" />
            <line x1="600" y1="750" x2="700" y2="720" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
            <line x1="600" y1="750" x2="650" y2="800" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
            <line x1="700" y1="720" x2="750" y2="780" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
            <line x1="650" y1="800" x2="550" y2="770" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />

            {/* Hexagonal structures (organic chemistry) */}
            <polygon points="1000,400 1020,390 1040,400 1040,420 1020,430 1000,420" stroke="#10B981" strokeWidth="1.5" fill="none" opacity="0.4" />
            <polygon points="1040,400 1060,390 1080,400 1080,420 1060,430 1040,420" stroke="#10B981" strokeWidth="1.5" fill="none" opacity="0.3" />
            <polygon points="1020,430 1040,420 1060,430 1060,450 1040,460 1020,450" stroke="#10B981" strokeWidth="1.5" fill="none" opacity="0.35" />

            {/* Cross/medical */}
            <rect x="80" y="380" width="8" height="30" rx="2" fill="#00D9FF" opacity="0.3" />
            <rect x="69" y="391" width="30" height="8" rx="2" fill="#00D9FF" opacity="0.3" />

            {/* Floating dots - data particles */}
            {[
                [200, 450], [400, 100], [500, 350], [700, 200], [900, 150],
                [1050, 550], [150, 700], [850, 500], [1200, 450], [1300, 650],
                [450, 700], [950, 350], [250, 150], [650, 450], [1100, 700],
            ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r={1.5 + (i % 3)} fill="#fff" opacity={0.15 + (i % 5) * 0.05} />
            ))}
        </svg>
    );
}
