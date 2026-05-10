tailwind = window.tailwind || {};
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ["Space Grotesk", "sans-serif"],
                mono: ["IBM Plex Mono", "monospace"],
                display: ["IBM Plex Mono", "monospace"]
            },
            colors: {
                bg: {
                    base: "var(--bg-base)",
                    deep: "var(--bg-deep)",
                    panel: "var(--bg-panel)"
                },
                ink: "var(--ink)",
                "ink-dim": "var(--ink-dim)",
                line: "var(--line)",
                violet: "var(--violet)",
                "violet-soft": "var(--violet-soft)",
                ember: "var(--ember)",
                glow: "var(--glow)"
            },
            keyframes: {
                "bento-rise": {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(22px) scale(0.95)",
                        filter: "blur(6px)"
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0) scale(1)",
                        filter: "blur(0)"
                    }
                },
                "float-slow": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-12px)" }
                },
                "float-medium": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-8px)" }
                },
                "float-fast": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-16px)" }
                },
                "beam-spin": {
                    from: { "--beam-angle": "0deg" },
                    to: { "--beam-angle": "360deg" }
                },
                "nav-drop-in": {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(-14px)"
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)"
                    }
                }
            },
            animation: {
                "bento-rise": "bento-rise 900ms cubic-bezier(0.2, 0.7, 0, 1) both",
                "float-slow": "float-slow 6s ease-in-out infinite",
                "float-medium": "float-medium 4.5s ease-in-out infinite",
                "float-fast": "float-fast 3.5s ease-in-out infinite",
                "beam-spin": "beam-spin 3.5s linear infinite",
                "nav-drop-in": "nav-drop-in 740ms cubic-bezier(0.2, 0.7, 0, 1) both"
            }
        }
    }
};
