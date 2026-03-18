"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";

function InteractiveBackgroundComponent() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -100, y: -100 });
    const animRef = useRef<number>(0);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const mouse = mouseRef.current;

        ctx.clearRect(0, 0, w, h);

        // Draw subtle grid
        const blockSize = Math.max(w / 15, 80);
        const cols = Math.ceil(w / blockSize);
        const rows = Math.ceil(h / blockSize);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
        ctx.lineWidth = 1;

        for (let x = 0; x <= cols; x++) {
            ctx.beginPath();
            ctx.moveTo(x * blockSize, 0);
            ctx.lineTo(x * blockSize, h);
            ctx.stroke();
        }
        for (let y = 0; y <= rows; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * blockSize);
            ctx.lineTo(w, y * blockSize);
            ctx.stroke();
        }

        // Draw glow near mouse
        if (mouse.x > 0 && mouse.y > 0) {
            const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
            gradient.addColorStop(0, "rgba(168, 85, 247, 0.08)");
            gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.02)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(mouse.x - 200, mouse.y - 200, 400, 400);
        }

        animRef.current = requestAnimationFrame(draw);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMove);

        animRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMove);
            cancelAnimationFrame(animRef.current);
        };
    }, [draw]);

    return (
        <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
            {/* Ambient Glows - CSS only, GPU-accelerated */}
            <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-purple-600/15 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '10s' }} />
            <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-indigo-600/15 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />

            {/* Lightweight Canvas Grid + Mouse Glow */}
            <canvas ref={canvasRef} className="absolute inset-0 opacity-70 pointer-events-auto" style={{ cursor: "crosshair" }} />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
        </div>
    );
}

const InteractiveBackground = memo(InteractiveBackgroundComponent);
export default InteractiveBackground;
