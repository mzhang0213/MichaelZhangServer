"use client";

import { motion } from "framer-motion";

/* ---------- individual SVG critters & flora ---------- */

function LilyPad({ size = 90 }: { size?: number }) {
    return (
        <svg width={size} height={size * 0.78} viewBox="0 0 100 78" fill="none">
            <path
                d="M50 4C74 4 96 22 96 42c0 22-22 32-46 32S4 64 4 42C4 24 18 8 38 5l5 14a3 3 0 0 0 6-1L50 4Z"
                fill="var(--lily-green)"
            />
            <path
                d="M50 9C71 9 91 25 91 42c0 19-20 28-41 28S9 61 9 42C9 27 21 13 39 10"
                fill="var(--lily-green-dark)"
                opacity="0.25"
            />
            <path d="M50 40 L80 26 M50 40 L84 50 M50 40 L66 70 M50 40 L30 68" stroke="var(--lily-green-dark)" strokeWidth="1.5" opacity="0.4" />
        </svg>
    );
}

function Flower({ size = 34 }: { size?: number }) {
    const petals = [0, 45, 90, 135, 180, 225, 270, 315];
    return (
        <svg width={size} height={size} viewBox="0 0 40 40">
            {petals.map((deg) => (
                <ellipse
                    key={deg}
                    cx="20"
                    cy="9"
                    rx="5"
                    ry="9"
                    fill="var(--flower-pink)"
                    transform={`rotate(${deg} 20 20)`}
                />
            ))}
            <circle cx="20" cy="20" r="6" fill="var(--flower-yellow)" />
        </svg>
    );
}

function Duck({ size = 84 }: { size?: number }) {
    return (
        <svg width={size} height={size * 0.7} viewBox="0 0 120 84" fill="none">
            {/* body */}
            <ellipse cx="58" cy="58" rx="46" ry="22" fill="var(--duck-body)" />
            {/* tail */}
            <path d="M12 54c-8-4-10-10-6-14 4 2 10 6 12 12Z" fill="var(--duck-body)" />
            {/* neck + head */}
            <path d="M86 60c-4-16 0-30 12-34 12-4 18 6 14 16-3 8-10 10-10 18Z" fill="var(--duck-body)" />
            <circle cx="98" cy="26" r="13" fill="var(--duck-body)" />
            {/* beak */}
            <path d="M108 24c10-2 14 2 13 6-1 4-8 5-14 3Z" fill="var(--duck-beak)" />
            {/* eye */}
            <circle cx="101" cy="22" r="2.2" fill="#22323a" />
            {/* wing */}
            <path d="M40 50c14-8 32-8 44 0-8 10-32 12-44 0Z" fill="#e6e0d0" />
        </svg>
    );
}

function Frog({ size = 60 }: { size?: number }) {
    return (
        <svg width={size} height={size * 0.8} viewBox="0 0 80 64" fill="none">
            {/* legs */}
            <path d="M8 50c6-6 16-6 22 0M72 50c-6-6-16-6-22 0" stroke="var(--frog-green)" strokeWidth="9" strokeLinecap="round" />
            {/* body */}
            <ellipse cx="40" cy="44" rx="26" ry="18" fill="var(--frog-green)" />
            {/* eyes */}
            <circle cx="28" cy="20" r="10" fill="var(--frog-green)" />
            <circle cx="52" cy="20" r="10" fill="var(--frog-green)" />
            <circle cx="28" cy="19" r="5" fill="#fff" />
            <circle cx="52" cy="19" r="5" fill="#fff" />
            <circle cx="29" cy="20" r="2.4" fill="#13310f" />
            <circle cx="53" cy="20" r="2.4" fill="#13310f" />
            {/* smile */}
            <path d="M28 46c8 6 16 6 24 0" stroke="#1f4a17" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
    );
}

function Cattail({ height = 130 }: { height?: number }) {
    return (
        <svg width={48} height={height} viewBox={`0 0 48 ${height}`} fill="none">
            <path d={`M24 ${height} C 18 ${height * 0.5}, 14 ${height * 0.35}, 22 40`} stroke="var(--reed)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d={`M30 ${height} C 34 ${height * 0.55}, 36 ${height * 0.4}, 30 60`} stroke="var(--reed)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <rect x="17" y="18" width="11" height="34" rx="5.5" fill="#8a5a2b" />
            <path d="M22 18c0-10 4-14 4-14s4 4 4 14" stroke="var(--reed)" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
    );
}

/* ---------- animated wrappers ---------- */

function Floating({
    children,
    drift = 14,
    rotate = 4,
    duration = 7,
    delay = 0,
}: {
    children: React.ReactNode;
    drift?: number;
    rotate?: number;
    duration?: number;
    delay?: number;
}) {
    return (
        <motion.div
            initial={false}
            animate={{ y: [0, -drift, 0], rotate: [-rotate, rotate, -rotate] }}
            transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", transformOrigin: "center" }}
        >
            {children}
        </motion.div>
    );
}

function Ripple({ delay = 0, x, y, size = 120 }: { delay?: number; x: string; y: string; size?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0.5, scale: 0.2 }}
            animate={{ opacity: 0, scale: 1 }}
            transition={{ duration: 5, delay, repeat: Infinity, ease: "easeOut" }}
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: size,
                height: size * 0.4,
                marginLeft: -size / 2,
                marginTop: -size * 0.2,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.5)",
            }}
        />
    );
}

/* ---------- the full scene ---------- */

export default function PondScene() {
    return (
        <>
            <div className="pond-water-bg" />
            <div className="pond-caustics" />
            <div className="pond-scene">
                {/* ripples */}
                <Ripple x="22%" y="40%" delay={0} />
                <Ripple x="70%" y="30%" delay={1.6} size={150} />
                <Ripple x="55%" y="72%" delay={3} size={180} />
                <Ripple x="85%" y="60%" delay={2.2} />

                {/* lily pads */}
                <div style={{ position: "absolute", left: "8%", top: "62%" }}>
                    <Floating duration={8} drift={10}>
                        <LilyPad size={120} />
                    </Floating>
                </div>
                <div style={{ position: "absolute", left: "12%", top: "60%", zIndex: 1 }}>
                    <Floating duration={8} drift={10} delay={0.3}>
                        <div style={{ transform: "translate(40px,-26px)" }}>
                            <Flower size={40} />
                        </div>
                    </Floating>
                </div>

                <div style={{ position: "absolute", right: "6%", top: "20%" }}>
                    <Floating duration={9} drift={12} delay={1}>
                        <LilyPad size={96} />
                    </Floating>
                </div>

                <div style={{ position: "absolute", left: "46%", bottom: "8%" }}>
                    <Floating duration={7.5} drift={9} delay={0.6}>
                        <LilyPad size={80} />
                    </Floating>
                </div>

                {/* a frog on a pad bottom-left */}
                <div style={{ position: "absolute", left: "9%", top: "59%", zIndex: 2 }}>
                    <Floating duration={8} drift={10}>
                        <div style={{ transform: "translate(34px, -6px)" }}>
                            <Frog size={56} />
                        </div>
                    </Floating>
                </div>

                {/* drifting ducks */}
                <motion.div
                    initial={{ x: "-12vw" }}
                    animate={{ x: "112vw" }}
                    transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
                    style={{ position: "absolute", top: "28%" }}
                >
                    <Floating duration={5} drift={6} rotate={2}>
                        <Duck size={92} />
                    </Floating>
                </motion.div>
                <motion.div
                    initial={{ x: "108vw" }}
                    animate={{ x: "-16vw" }}
                    transition={{ duration: 64, repeat: Infinity, ease: "linear", delay: 4 }}
                    style={{ position: "absolute", top: "78%" }}
                >
                    <Floating duration={6} drift={5} rotate={2}>
                        <div style={{ transform: "scaleX(-1)" }}>
                            <Duck size={70} />
                        </div>
                    </Floating>
                </motion.div>

                {/* reeds in the corners */}
                <div style={{ position: "absolute", left: "-4px", bottom: 0 }}>
                    <Cattail height={170} />
                </div>
                <div style={{ position: "absolute", left: "30px", bottom: 0 }}>
                    <Cattail height={130} />
                </div>
                <div style={{ position: "absolute", right: "6px", bottom: 0, transform: "scaleX(-1)" }}>
                    <Cattail height={150} />
                </div>

                {/* scattered flowers */}
                <div style={{ position: "absolute", right: "20%", top: "48%" }}>
                    <Floating duration={6} drift={8} delay={1.2}>
                        <Flower size={28} />
                    </Floating>
                </div>
                <div style={{ position: "absolute", left: "62%", top: "16%" }}>
                    <Floating duration={6.5} drift={7} delay={0.4}>
                        <Flower size={24} />
                    </Floating>
                </div>
            </div>
        </>
    );
}
