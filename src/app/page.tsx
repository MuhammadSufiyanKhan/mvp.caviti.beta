"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";


export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 3;

    // Globe
    const globeGeo = new THREE.BufferGeometry();
    const count = 4000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = Math.cos(phi);
    }
    globeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const globe = new THREE.Points(globeGeo, new THREE.PointsMaterial({ color: 0x8b5cf6, size: 0.012, transparent: true, opacity: 0.9 }));
    scene.add(globe);

    // Rings
    [
      { r: 1.5, color: 0x8b5cf6, opacity: 0.4, rx: Math.PI / 3 },
      { r: 1.8, color: 0x3b82f6, opacity: 0.2, rx: Math.PI / 5 },
      { r: 2.1, color: 0x6366f1, opacity: 0.15, rx: Math.PI / 7 },
    ].forEach(({ r, color, opacity, rx }) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.003, 16, 200),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
      );
      ring.rotation.x = rx;
      scene.add(ring);
    });

    // BG particles
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(800 * 3);
    for (let i = 0; i < 800 * 3; i++) bgPos[i] = (Math.random() - 0.5) * 25;
    bgGeo.setAttribute("position", new THREE.BufferAttribute(bgPos, 3));
    const bgParticles = new THREE.Points(bgGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.015, transparent: true, opacity: 0.15 }));
    scene.add(bgParticles);

    let mouseX = 0, mouseY = 0;
    window.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
    });

    let frameId: number;
    const rings: THREE.Mesh[] = [];
    scene.children.forEach((c) => {
      if (c instanceof THREE.Mesh) rings.push(c);
    });


    const animate = () => {
      frameId = requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      globe.rotation.x += mouseY * 0.01;
      globe.rotation.y += mouseX * 0.01;
      rings.forEach((r, i) => { r.rotation.z += 0.002 * (i % 2 === 0 ? 1 : -1); });
      bgParticles.rotation.y += 0.0001;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(frameId); window.removeEventListener("resize", handleResize); renderer.dispose(); };
  }, []);

  const features = [
    {
      icon: "🛑",
      title: "Vulnerabilities",
      desc: "Find the real reasons products fail (negative points, friction, and weak claims) before you sell them.",
    },
    {
      icon: "🛠️",
      title: "Factory Fix",
      desc: "Get copy‑paste ready technical instructions to send to suppliers and close the gaps.",
    },
    {
      icon: "📣",
      title: "Ad Hooks",
      desc: "Turn vulnerabilities into high‑intent creative angles that increase conversion from day one.",
    },
  ];


  return (
    <div style={{ background: "#050508", minHeight: "100vh", color: "white", fontFamily: "var(--font-geist-sans)", overflowX: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }} />

      {/* Gradient overlays */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 60%)", pointerEvents: "none", zIndex: 1 }} />

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 48px", height: "68px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(5,5,8,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div className="flex items-center gap-2" style={{ cursor: "pointer" }}>
          <Image
            src="/logo.png"
            alt="Caviti Logo"
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-white font-bold text-xl" style={{ fontSize: 20 }}>
            caviti
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "32px", fontSize: "14px" }}>

          <a href="#features" style={{ color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}>Features</a>
          <a href="#how-it-works" style={{ color: "#64748b", textDecoration: "none" }}>How It Works</a>
          <a href="#pricing" style={{ color: "#64748b", textDecoration: "none" }}>Pricing</a>
          <Link href="/login" style={{ color: "#94a3b8", textDecoration: "none" }}>Sign In</Link>
          <Link href="/signup" style={{
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "white", padding: "9px 22px", borderRadius: "10px",
            fontSize: "14px", fontWeight: 600, textDecoration: "none",
            boxShadow: "0 0 20px rgba(59,130,246,0.25)",
          }}>Sign Up Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <motion.div style={{ y: heroY, position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "100px", padding: "6px 18px", marginBottom: "28px", backdropFilter: "blur(10px)" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#93c5fd", fontSize: "13px", fontWeight: 500 }}>AI-Powered Market Intelligence</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: "clamp(44px, 8vw, 88px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-3px", marginBottom: "28px" }}>
          Discover Your<br />
          <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Market Gap
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ fontSize: "18px", color: "#475569", maxWidth: "520px", lineHeight: 1.8, marginBottom: "48px" }}>
          AI-powered competitor analysis for ambitious founders. Find gaps your competitors missed using real market data.
        </motion.p>

        {/* Hero CTA (single button only) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "80px" }}
        >
          <Link
            href="/signup"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "white",
              padding: "18px 44px",
              borderRadius: "14px",
              fontSize: "16px",
              fontWeight: 800,
              textDecoration: "none",
              boxShadow:
                "0 0 60px rgba(59,130,246,0.35), 0 0 0 1px rgba(59,130,246,0.2)",
              letterSpacing: "-0.2px",
            }}
          >
            Get Started Free →
          </Link>
        </motion.div>
      </motion.div>

      {/* Features */}
      <div id="features" style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "0 auto", padding: "96px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "44px", fontWeight: 900, letterSpacing: "-2px", marginBottom: "16px" }}>
            Find the failure points that stop sales
          </h2>
          <p style={{ color: "#475569", fontSize: "16px", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            Three focused outputs—so you can fix the product, the story, and the hooks before you launch.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
                padding: "32px",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "18px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "10px" }}>{f.title}</h3>
              <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.75 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "0 auto", padding: "0 24px 120px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "44px", fontWeight: 900, letterSpacing: "-2px", marginBottom: "16px" }}>
            Pricing
          </h2>
          <p style={{ color: "#475569", fontSize: "16px" }}>Free to start—Pro to keep winning</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          <motion.div
            whileHover={{ y: -6 }}
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "20px",
              padding: "36px",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "8px", fontWeight: 700 }}>Free</p>
            <p style={{ fontSize: "48px", fontWeight: 900, marginBottom: "18px", letterSpacing: "-2px" }}>
              $0
              <span style={{ fontSize: "14px", color: "#475569", fontWeight: 500 }}>/mo</span>
            </p>
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "3 analyses", locked: false },
                { label: "Vulnerabilities", locked: false },
                { label: "Factory Fix", locked: true },
                { label: "Ad Hooks", locked: true },
              ].map((f, j) => (
                <li key={j} style={{ fontSize: "14px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "10px" }}>
                  {f.locked ? (
                    <span aria-hidden style={{ color: "#64748b", fontSize: "16px" }}>🔒</span>
                  ) : (
                    <span style={{ color: "#3b82f6", fontSize: "16px" }}>✓</span>
                  )}
                  {f.label}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              style={{
                display: "block",
                textAlign: "center",
                background: "rgba(255,255,255,0.06)",
                color: "white",
                padding: "14px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Start Free Analysis
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))",
              border: "1px solid rgba(99,102,241,0.4)",
              borderRadius: "20px",
              padding: "36px",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 60px rgba(59,130,246,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <div style={{
              fontSize: "11px",
              color: "#818cf8",
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
              padding: "4px 12px",
              borderRadius: "100px",
              display: "inline-block",
              marginBottom: "16px",
              fontWeight: 800,
              letterSpacing: "0.2px",
            }}>PRO</div>

            <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "8px", fontWeight: 700 }}>Pro</p>
            <p style={{ fontSize: "48px", fontWeight: 900, marginBottom: "18px", letterSpacing: "-2px" }}>
              $29
              <span style={{ fontSize: "14px", color: "#475569", fontWeight: 500 }}>/month</span>
            </p>

            <ul style={{ listStyle: "none", padding: 0, marginBottom: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                "Unlimited analyses",
                "All 3 boxes unlocked",
                "Priority access",
                "Deeper gap breakdown",
              ].map((f, j) => (
                <li key={j} style={{ fontSize: "14px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#818cf8", fontSize: "16px" }}>✓</span> {f}
                </li>
              ))}
            </ul>

            <Link
              href="https://gumroad.com"
              style={{
                display: "block",
                textAlign: "center",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white",
                padding: "14px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 800,
                textDecoration: "none",
                border: "none",
                boxShadow: "0 0 30px rgba(59,130,246,0.3)",
              }}
            >
              Start Pro Analysis
            </Link>

            <p style={{ marginTop: 10, fontSize: 12, color: "#94a3b8" }}>
              *Billing per your plan settings.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Caviti Logo"
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-white font-bold text-xl" style={{ fontSize: 20 }}>
            caviti
          </span>
        </div>
        <p style={{ fontSize: "13px", color: "#94a3b8" }}>© {new Date().getFullYear()} Caviti.io. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(59,130,246,0); }
        }
      `}</style>
    </div>
  );
}
