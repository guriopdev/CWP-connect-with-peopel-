"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import anime from "animejs";
export default function InteractiveBackground() {
    const gridRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const handleResize = useCallback(() => {
        if (typeof window !== "undefined") {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
    }, []);

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    useEffect(() => {
        if (!gridRef.current || dimensions.width === 0) return;

        const wrapper = gridRef.current;
        wrapper.innerHTML = ""; // Clear existing blocks

        // Calculate tile sizes dynamically based on screen real estate
        const blockSize = Math.max(window.innerWidth / 20, 60);
        const columns = Math.ceil(window.innerWidth / blockSize);
        const rows = Math.ceil(window.innerHeight / blockSize);
        const totalBlocks = columns * rows;

        // Populate the grid
        for (let i = 0; i < totalBlocks; i++) {
            const el = document.createElement("div");
            el.classList.add("bg-interactive-tile");
            el.style.width = `${blockSize}px`;
            el.style.height = `${blockSize}px`;
            el.style.border = "1px solid rgba(255, 255, 255, 0.02)";
            el.style.transition = "background-color 0.8s ease-out, transform 0.3s ease";
            el.style.cursor = "crosshair";
            
            // Hover effect
            el.addEventListener("mouseenter", () => {
                el.style.backgroundColor = "rgba(168, 85, 247, 0.25)";
                el.style.borderColor = "rgba(168, 85, 247, 0.5)";
                
                // Clear after delay
                setTimeout(() => {
                    el.style.backgroundColor = "transparent";
                    el.style.borderColor = "rgba(255, 255, 255, 0.02)";
                }, 1000);
            });

            // Click ripple effect via anime.js
            el.addEventListener("click", () => {
                anime({
                    targets: '.bg-interactive-tile',
                    backgroundColor: [
                        { value: 'rgba(139, 92, 246, 0.5)', easing: 'easeOutSine', duration: 150 },
                        { value: 'rgba(0, 0, 0, 0)', easing: 'easeInOutQuad', duration: 1200 }
                    ],
                    borderColor: [
                        { value: 'rgba(168, 85, 247, 0.8)', easing: 'easeOutSine', duration: 150 },
                        { value: 'rgba(255, 255, 255, 0.02)', easing: 'easeInOutQuad', duration: 1200 }
                    ],
                    scale: [
                        { value: 0.85, easing: 'easeOutSine', duration: 250 },
                        { value: 1, easing: 'easeInOutQuad', duration: 900 }
                    ],
                    delay: anime.stagger(80, {
                        grid: [columns, rows],
                        from: i // start ripple from clicked element
                    })
                });
            });

            wrapper.appendChild(el);
        }

        // Entrance animation
        anime({
            targets: '.bg-interactive-tile',
            opacity: [0, 1],
            scale: [0.5, 1],
            delay: anime.stagger(40, { grid: [columns, rows], from: 'center' }),
            easing: 'easeOutElastic(1, .8)',
            duration: 1200
        });

    }, [dimensions]);

    return (
        <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-auto">
            {/* Ambient Animated Glows using pure CSS animations */}
            <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[160px] animate-pulse pointer-events-none" style={{ animationDuration: '10s' }} />
            <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[180px] animate-pulse pointer-events-none" style={{ animationDuration: '8s', animationDelay: '2s' }} />
            <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-fuchsia-600/15 rounded-full blur-[140px] animate-pulse pointer-events-none" style={{ animationDuration: '12s', animationDelay: '4s' }} />

            {/* Interactive Grid */}
            <div 
                ref={gridRef}
                className="absolute inset-0 flex flex-wrap content-start items-start w-screen h-screen opacity-70"
                style={{ width: "100%", height: "100%" }}
            />
            
            {/* Cinematic Noise/Gradient Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            
            {/* Edge fade to black so grid doesn't abruptly end, creating a vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
        </div>
    );
}
