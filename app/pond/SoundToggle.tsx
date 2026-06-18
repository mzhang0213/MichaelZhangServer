"use client";

import { useEffect, useRef, useState } from "react";

// Ambient waterfall sound. Browsers block autoplay, so playback starts only on
// the user's click. Drop an mp3 at /public/sounds/waterfall.mp3 — until then the
// toggle is harmless (play() just rejects quietly).
export default function SoundToggle() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [on, setOn] = useState(false);

    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        if (on) {
            a.volume = 0.4;
            a.play().catch(() => setOn(false));
        } else {
            a.pause();
        }
    }, [on]);

    return (
        <>
            <audio ref={audioRef} src="/sounds/waterfall.mp3" loop preload="none" />
            <button
                className="pond-sound"
                onClick={() => setOn((v) => !v)}
                title={on ? "Mute ambient waterfall" : "Play ambient waterfall"}
                aria-label={on ? "Mute ambient waterfall" : "Play ambient waterfall"}
            >
                {on ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 5 6 9H2v6h4l5 4z" />
                        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                        <path d="M19 5a9 9 0 0 1 0 14" />
                    </svg>
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 5 6 9H2v6h4l5 4z" />
                        <line x1="22" y1="9" x2="16" y2="15" />
                        <line x1="16" y1="9" x2="22" y2="15" />
                    </svg>
                )}
            </button>
        </>
    );
}
