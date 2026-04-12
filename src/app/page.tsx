"use client";
import { useState, useEffect, useCallback, useRef } from "react";

/* ─── Shared slide background blobs ─── */
function Blobs({ configs }: { configs: { w: number; h: number; top?: string; bottom?: string; left?: string; right?: string; color: string; opacity: number; anim: string }[] }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {configs.map((b, i) => (
        <div key={i} className={`blob ${b.anim}`} style={{
          width: b.w, height: b.h,
          top: b.top, bottom: b.bottom, left: b.left, right: b.right,
          background: b.color, opacity: b.opacity,
        }} />
      ))}
    </div>
  );
}

/* ─── Particle canvas ─── */
function Particles({ interactive = false }: { interactive?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    let mx = -1000, my = -1000;
    const pts = Array.from({ length: interactive ? 45 : 18 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 1.8 + 0.5, alpha: Math.random() * 0.22 + 0.05,
    }));
    if (interactive) {
      canvas.addEventListener("mousemove", e => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
      canvas.addEventListener("mouseleave", () => { mx = -1000; my = -1000; });
    }
    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        if (interactive) { const dx = p.x - mx, dy = p.y - my, d = Math.sqrt(dx * dx + dy * dy); if (d < 110) { const f = (110 - d) / 110 * 2; p.vx += dx / d * f * 0.08; p.vy += dy / d * f * 0.08; } }
        p.vx *= 0.98; p.vy *= 0.98; p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${p.alpha})`; ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [interactive]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: interactive ? "auto" : "none" }} />;
}

/* ─── Slide wrapper ─── */
function Slide({ children, active, blobs, particles = false }: {
  children: React.ReactNode; active: boolean;
  blobs?: { w: number; h: number; top?: string; bottom?: string; left?: string; right?: string; color: string; opacity: number; anim: string }[];
  particles?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const els = ref.current.querySelectorAll<HTMLElement>(".r");
    els.forEach((el, i) => {
      el.classList.remove("shown");
      el.style.animationDelay = `${i * 0.06}s`;
      void el.offsetHeight;
      el.classList.add("shown");
    });
  }, [active]);

  return (
    <div style={{
      position: "absolute", inset: 0, background: "var(--bg)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: active ? 1 : 0, transform: active ? "scale(1) translateY(0)" : "scale(0.97) translateY(10px)",
      transition: "opacity 0.45s ease, transform 0.45s ease",
      pointerEvents: active ? "all" : "none", overflow: "hidden",
    }} className="noise">
      {blobs && <Blobs configs={blobs} />}
      {particles && <Particles interactive />}
      <div ref={ref} style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "1200px", padding: "clamp(1rem,3vw,2.5rem)" }}>
        {children}
      </div>
    </div>
  );
}

/* ── small helpers ── */
const SL = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div className="section-label r" style={{ marginBottom: "0.35rem", color: "#3b82f6", ...style }}>{children}</div>
);
const H2 = ({ children, cls = "grad-text-2" }: { children: React.ReactNode; cls?: string }) => (
  <h2 className={`font-display r ${cls}`} style={{ fontSize: "clamp(1.6rem,3.2vw,2.4rem)", fontWeight: 700, margin: "0 0 0.15rem" }}>{children}</h2>
);
const Rule = () => <hr className="accent-rule r" />;
const Card = ({ children, style = {}, className = "" }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) => (
  <div className={`card ${className}`} style={style}>{children}</div>
);
const Badge = ({ children, cls = "" }: { children: React.ReactNode; cls?: string }) => <span className={`badge ${cls}`}>{children}</span>;

/* ══════════════════════════════════════════════════════════════
   ALL SLIDES
══════════════════════════════════════════════════════════════ */

/* 1 – Title */
function Slide1({ active }: { active: boolean }) {
  return (
    <Slide active={active} particles
      blobs={[
        { w: 500, h: 500, top: "-160px", right: "-140px", color: "#1d4ed8", opacity: 0.18, anim: "anim-float-slow" },
        { w: 360, h: 360, bottom: "-110px", left: "-100px", color: "#7c3aed", opacity: 0.12, anim: "anim-float-drift" },
        { w: 220, h: 220, top: "42%", left: "8%", color: "#0ea5e9", opacity: 0.08, anim: "anim-float-slow-rev" },
      ]}>
      <div style={{ textAlign: "center" }}>
        {/* Logos */}
        <div className="r" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "24px", marginBottom: "1.4rem", flexWrap: "wrap" }}>
          <img src="/IDFC-FIRST-Bank-logobase.svg" alt="IDFC FIRST Bank" style={{ maxHeight: 48, maxWidth: 170, objectFit: "contain" }} />
          <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.12)" }} />
          <img src="/iiit_surat_logo.png" alt="IIIT Surat" style={{ maxHeight: 60, maxWidth: 75, objectFit: "contain" }} />
        </div>

        <div className="section-label r" style={{ marginBottom: "0.6rem", color: "#60a5fa" }}>
          Mid-Semester Internship Report · April 2026
        </div>

        <h1 className="font-display r anim-glow grad-text" style={{ fontSize: "clamp(2rem,5vw,3.6rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 0.6rem" }}>
          Mid-Semester Internship<br />Progress Report
        </h1>

        <p className="r" style={{ fontSize: "clamp(0.82rem,1.2vw,0.95rem)", color: "var(--text-secondary)", margin: "0.6rem 0 1.8rem" }}>
          Application Engineer Intern &nbsp;·&nbsp; IDFC FIRST Bank &nbsp;·&nbsp; Technology Division
        </p>

        <div className="r" style={{
          display: "inline-grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 2.5rem",
          textAlign: "left", background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12,
          padding: "1.2rem 2rem"
        }}>
          {[
            ["Student", "Ajay Mali (UI22CS43)"],
            ["Semester", "6th Sem – B.Tech CSE"],
            ["Role", "Application Engineer Intern"],
            ["Faculty Supervisor", "Dr. Nidhi Desai"],
          ].map(([label, value], i) => (
            <div key={i}>
              <div className="section-label" style={{ marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* 2 – About IDFC */
function Slide2({ active }: { active: boolean }) {
  return (
    <Slide active={active} blobs={[
      { w: 400, h: 400, top: "-90px", left: "-90px", color: "#1d4ed8", opacity: 0.12, anim: "anim-float-slow" },
      { w: 280, h: 280, bottom: "-70px", right: "-60px", color: "#7c3aed", opacity: 0.08, anim: "anim-float-drift" },
    ]}>
      <SL>Organization</SL>

      {/* Logo + Title row */}
      <div className="r" style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.15rem" }}>
        <img src="/IDFC-FIRST-Bank-logobase.svg" alt="IDFC FIRST Bank" style={{ maxHeight: 36, maxWidth: 130, objectFit: "contain", flexShrink: 0 }} />
        <h2 className="font-display grad-text-2" style={{ fontSize: "clamp(1.6rem,3.2vw,2.4rem)", fontWeight: 700, margin: 0 }}>About IDFC FIRST Bank</h2>
      </div>
      <Rule />

      {/* Merger origin callout */}
      <div className="r" style={{ display: "flex", alignItems: "center", gap: "0.6rem", margin: "0.5rem 0 0.9rem", background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.18)", borderRadius: 10, padding: "0.55rem 1rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
        <span style={{ fontSize: "1.1rem" }}>🔀</span>
        <span><strong style={{ color: "#60a5fa" }}>IDFC FIRST Bank</strong> = <strong>IDFC Bank</strong> + <strong>Capital First Bank</strong> &nbsp;—&nbsp; merged <strong style={{ color: "#a78bfa" }}>December 2018</strong></span>
      </div>

      <div className="g2 r" style={{ gap: "1.4rem" }}>
        {/* Left: key facts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {[
            ["📍", "Headquarters", "Mumbai, India · NSE/BSE Listed"],
            ["🌐", "1000+ Branches", "Pan-India presence, 37M+ customers"],
            ["💻", "Tech-First Culture", "Strong engineering & digital-first teams"],
            ["🏙️", "Software Engineering Offices", "Bengaluru · Mumbai · Chennai · Hyderabad"],
            ["🎓", "Neev Bootcamp Location", "Hyderabad"],
          ].map(([icon, title, sub]) => (
            <div key={title as string} style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
              <span style={{ color: "#60a5fa", width: 20, flexShrink: 0, marginTop: 1 }}>{icon}</span>
              <div>
                <div style={{ fontSize: "0.83rem", fontWeight: 600 }}>{title}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: stat grid */}
        <div className="g2" style={{ alignContent: "start" }}>
          {[
            { num: "37M+", color: "#3b82f6", label: "Customers" },
            { num: "1000+", color: "#a78bfa", label: "Branches" },
            { num: "2L+ Cr", color: "#60a5fa", label: "AUM (FY25)" },
            { num: "7th", color: "#818cf8", label: "Largest PVT Bank" },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: "center" }}>
              <div className="stat-num" style={{ color: s.color }}>{s.num}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* 3 – Training Overview */
function Slide3({ active }: { active: boolean }) {
  return (
    <Slide active={active} blobs={[
      { w: 400, h: 400, top: "-80px", right: "-80px", color: "#1d4ed8", opacity: 0.11, anim: "anim-float-slow" },
      { w: 270, h: 270, bottom: "-60px", left: "-55px", color: "#7c3aed", opacity: 0.08, anim: "anim-float-drift" },
    ]}>
      <SL>Neev 2026 · IDFC FIRST Bank</SL>
      <H2>Training Overview</H2>
      <Rule />
      <p className="r" style={{ fontSize: "0.83rem", color: "var(--text-secondary)", margin: "0.4rem 0 1rem" }}>
        8-week intensive training (27 Jan 2026 to 27 Mar 2026) — first stage of the internship programme.
      </p>
      <div className="g3 r">
        {[
          { color: "#3b82f6", title: "Week 1: Orientation", text: "Introduction to IDFC FIRST Bank's tech ecosystem, tools, security norms, and org culture." },
          { color: "#a78bfa", title: "Weeks 2–5: Bootcamp", text: "Deep-dive technical training across Go, React, Docker, CI/CD, Kafka, TDD, Pair Programming, and engineering principles (SOLID, DRY, KISS, YAGNI)." },
          { color: "#60a5fa", title: "Weeks 6–8: Project Simulation", text: "Agile sprint simulation — 3 sprints of 1 week each: with standups, kick-off, showcase, desk-checks, bug bash, code freeze & introspect ceremonies." },
        ].map(c => (
          <Card key={c.title} style={{ borderLeft: `3px solid ${c.color}` }}>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.title}</div>
            <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{c.text}</p>
          </Card>
        ))}
      </div>
      <div className="g2 r" style={{ marginTop: "0.9rem" }}>
        <Card style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
          <span style={{ fontSize: "1.3rem" }}>🎙️</span>
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>Tech Talk &amp; Pecha Kucha</div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Tech Talk: <em>Payment Gateway</em><br />Pecha Kucha: <em>Anime vs Cartoon</em></div>
          </div>
        </Card>
        <Card style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
          <span style={{ fontSize: "1.3rem" }}>📅</span>
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>Duration &amp; Format</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>27 Jan – 27 Mar 2026 &nbsp;·&nbsp; 8 Weeks &nbsp;·&nbsp; On-site</div>
          </div>
        </Card>
      </div>
    </Slide>
  );
}

/* 4 – Technical Bootcamp */
function Slide4({ active }: { active: boolean }) {
  const tracks = [
    { color: "#3b82f6", title: "Golang Track", badges: ["Go Fundamentals", "OOPs in Go", "Interfaces", "Go Concurrency", "Goroutines", "Channels"] },
    { color: "#a78bfa", title: "Quality & Testing", badges: ["TDD", "Pair Programming", "Mocks & Stubs", "Unit Testing", "Integration Testing"], gold: true },
    { color: "#60a5fa", title: "Frontend", badges: ["React.js", "Component Design", "Hooks", "MUI"] },
    { color: "#3b82f6", title: "DevOps", badges: ["Docker", "Docker Compose", "CI/CD Basics", "Kafka Basics", "Migrations"] },
    { color: "#a78bfa", title: "Principles", badges: ["SOLID", "DRY", "KISS", "YAGNI"], gold: true },
    { color: "#60a5fa", title: "Emerging Tech", badges: ["Intro to GenAI", "DB Migrations"] },
  ];
  return (
    <Slide active={active} blobs={[
      { w: 420, h: 420, top: "-100px", right: "-100px", color: "#1d4ed8", opacity: 0.10, anim: "anim-float-slow" },
      { w: 270, h: 270, bottom: "-65px", left: "-55px", color: "#7c3aed", opacity: 0.08, anim: "anim-float-drift" },
    ]}>
      <SL>Weeks 2–5 · Skill Building</SL>
      <H2>Technical Bootcamp</H2>
      <Rule />
      <div className="g3 r" style={{ marginTop: "0.9rem" }}>
        {tracks.map(t => (
          <Card key={t.title} style={{ borderLeft: `3px solid ${t.color}` }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: t.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>{t.title}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {t.badges.map(b => <Badge key={b} cls={t.gold ? "gold" : ""}>{b}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
      <div className="r" style={{ marginTop: "0.9rem", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.16)", borderRadius: 10, padding: "0.6rem 1rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
        💡 Each topic included either <strong>Dojos</strong> (hands-on practice sessions after theory), <strong>Assignments</strong>, or both — reinforcing concepts through building.
      </div>
    </Slide>
  );
}

/* 5 – Project Overview: SkyFox */
function Slide5({ active }: { active: boolean }) {
  return (
    <Slide active={active} particles blobs={[
      { w: 480, h: 480, top: "-110px", left: "-100px", color: "#1d4ed8", opacity: 0.13, anim: "anim-float-slow" },
      { w: 300, h: 300, bottom: "-80px", right: "-70px", color: "#7c3aed", opacity: 0.09, anim: "anim-float-drift" },
    ]}>
      <SL>Project Simulation · Weeks 6–8 · Team: Thunderian</SL>
      <h2 className="font-display r grad-text" style={{ fontSize: "clamp(1.6rem,3.2vw,2.4rem)", fontWeight: 700, margin: "0 0 0.15rem" }}>
        SkyFox – Movie Booking Platform
      </h2>
      <Rule />
      <div className="g2 r" style={{ marginTop: "0.9rem", gap: "1.4rem" }}>
        <div>
          <div style={{ marginBottom: "0.9rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>⚠️ Problem Statement</div>
            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
              SkyFox is a privately held, third-generation, family-owned film distribution business in Rajnandgaon, Chhattisgarh. Younger audiences expect digital booking, smartphones are ubiquitous, competing cinemas are going paperless, and OTT platforms are rapidly changing how people consume entertainment.
            </p>
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>🎯 Project Overview</div>
            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
              In partnership with IDFC FIRST, SkyFox aims to upgrade its internal system into a production-grade cinema platform enabling online discovery and booking of shows, while managing taxes and finances through software — scalable to multiple cinemas.
            </p>
          </div>
        </div>
        <div>
          <div className="g2" style={{ gap: "0.6rem" }}>
            {[
              ["🔐", "Auth & OTP", "CAPTCHA + TOTP"],
              ["🎟️", "Seat Booking", "Concurrent locking"],
              ["💳", "Payments", "Full checkout flow"],
              ["👤", "User Profiles", "CRUD + history"],
              ["🧪", "Test Suite", "TDD – Vitest + Go"],
              ["🐳", "Docker", "Containerized"],
            ].map(([icon, title, sub]) => (
              <Card key={title as string} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem", marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: "0.83rem", fontWeight: 600 }}>{title}</div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{sub}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* 6 – Tech Stack */
function Slide6({ active }: { active: boolean }) {
  const groups = [
    { color: "#3b82f6", title: "Frontend", badges: ["React.js", "Material-UI", "Vite"] },
    { color: "#a78bfa", title: "Backend", badges: ["Go (Golang)", "Gin", "REST APIs", "JWT Auth"], gold: true },
    { color: "#60a5fa", title: "Database", badges: ["PostgreSQL", "SQL Migrations"] },
    { color: "#3b82f6", title: "DevOps", badges: ["Docker", "Docker Compose", "GOCD", "Bitbucket"] },
    { color: "#a78bfa", title: "Testing", badges: ["Vitest", "Go Testing", "Mocks/Stubs"], gold: true },
    { color: "#60a5fa", title: "Auth & Security", badges: ["hCaptcha", "TOTP / OTP", "JWT", "bcrypt"] },
  ];
  return (
    <Slide active={active} blobs={[
      { w: 380, h: 380, top: "-90px", right: "-80px", color: "#1d4ed8", opacity: 0.10, anim: "anim-float-slow" },
      { w: 250, h: 250, bottom: "-60px", left: "-50px", color: "#7c3aed", opacity: 0.08, anim: "anim-float-drift" },
    ]}>
      <SL>SkyFox · Tools &amp; Technologies</SL>
      <H2>Tech Stack</H2><Rule />
      <div className="g3 r" style={{ marginTop: "0.9rem" }}>
        {groups.map(g => (
          <Card key={g.title} style={{ borderLeft: `3px solid ${g.color}` }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: g.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{g.title}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {g.badges.map(b => <Badge key={b} cls={g.gold ? "gold" : ""}>{b}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </Slide>
  );
}

/* 7 – System Architecture — fixed: uniform boxes, clean layout */
function Slide7({ active }: { active: boolean }) {
  const layers = [
    { color: "#3b82f6", icon: "🖥️", title: "CLIENT", items: ["React.js", "Axios HTTP calls", "Material-UI", "Vite (Build)", "Vitest (tests)"] },
    { color: "#a78bfa", icon: "⚙️", title: "API LAYER", items: ["Go / Gin", "REST Endpoints", "JWT Middleware", "CAPTCHA & TOTP", "DTO binding"] },
    { color: "#60a5fa", icon: "🛠️", title: "SERVICE LAYER", items: ["Business logic", "Orchestration"] },
    { color: "#818cf8", icon: "🗄️", title: "DATA LAYER", items: ["PostgreSQL / GORM", "SQL Migrations", "Seed Data"] },
    { color: "#38bdf8", icon: "🐳", title: "INFRA", items: ["Docker", "Compose", "GoCD", "Kubernetes"] },
  ];
  return (
    <Slide active={active} blobs={[
      { w: 350, h: 350, top: "-80px", right: "-70px", color: "#1d4ed8", opacity: 0.09, anim: "anim-float-slow" },
      { w: 250, h: 250, bottom: "-60px", left: "-50px", color: "#7c3aed", opacity: 0.07, anim: "anim-float-drift" },
    ]}>
      <SL>SkyFox · System Design</SL>
      <H2>System Architecture</H2>
      <Rule />

      {/* Architecture boxes — equal widths, equal heights */}
      <div className="r" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: "0.9rem", alignItems: "stretch" }}>
        {layers.map((b, i) => (
          <div key={b.title} style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              background: "rgba(17,24,39,0.8)",
              border: `1px solid ${b.color}30`,
              borderTop: `3px solid ${b.color}`,
              borderRadius: 10,
              padding: "0.8rem 0.7rem",
              textAlign: "center",
              flex: 1,
              minHeight: 160,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
            }}>
              <div style={{ fontSize: "1.2rem", marginBottom: 6 }}>{b.icon}</div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: b.color, marginBottom: 8, letterSpacing: "0.06em" }}>{b.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {b.items.map(item => (
                  <div key={item} style={{ fontSize: "0.68rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{item}</div>
                ))}
              </div>
            </div>
            {i < layers.length - 1 && (
              <div style={{ color: "#3b82f6", fontSize: "0.9rem", padding: "0 3px", flexShrink: 0, opacity: 0.7 }}>⇄</div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="g3 r" style={{ marginTop: "0.8rem" }}>
        {[
          ["🔐", "#3b82f6", "Security", "hCaptcha on login/signup, TOTP-based OTP 2FA, JWT middleware on all protected routes, bcrypt password hashing"],
          ["⚡", "#a78bfa", "Performance", "Go goroutines for concurrency; PostgreSQL row-level locking to prevent race conditions"],
          ["🧪", "#60a5fa", "Quality", "TDD-first approach, Vitest for frontend, Go testing package for backend — all critical paths covered"],
        ].map(([icon, color, title, desc]) => (
          <Card key={title as string} style={{ borderLeft: `3px solid ${color}` }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
              <span style={{ color: color as string }}>{icon}</span>
              <span style={{ fontSize: "0.83rem", fontWeight: 600 }}>{title}</span>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{desc}</p>
          </Card>
        ))}
      </div>
    </Slide>
  );
}

/* ── Reusable screenshot slide with margin ── */
function ScreenshotSlide({ active, src, counter }: { active: boolean; src: string; counter: string }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      opacity: active ? 1 : 0,
      transform: active ? "scale(1)" : "scale(0.97)",
      transition: "opacity 0.45s ease, transform 0.45s ease",
      pointerEvents: active ? "all" : "none",
      background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "48px 40px 56px",
    }}>
      <img
        src={`/${src}`}
        alt={src}
        style={{
          maxWidth: "100%", maxHeight: "100%",
          objectFit: "contain", display: "block",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
        }}
      />
      <div style={{
        position: "absolute", bottom: 24, right: 24,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: "3px 12px",
        fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em",
      }}>{counter}</div>
    </div>
  );
}

/* 8a – About / Brand page FIRST */
function Slide8({ active }: { active: boolean }) {
  return <ScreenshotSlide active={active} src="screenshot5.png" counter="SkyFox · 1 / 5" />;
}

/* 8b – Landing Page */
function Slide8b({ active }: { active: boolean }) {
  return <ScreenshotSlide active={active} src="screenshot1.png" counter="SkyFox · 2 / 5" />;
}

/* 8c – Login Page */
function Slide8c({ active }: { active: boolean }) {
  return <ScreenshotSlide active={active} src="screenshot2.png" counter="SkyFox · 3 / 5" />;
}

/* 8d – Seat Map */
function Slide8d({ active }: { active: boolean }) {
  return <ScreenshotSlide active={active} src="screenshot3.png" counter="SkyFox · 4 / 5" />;
}

/* 8e – Genre Browser */
function Slide8e({ active }: { active: boolean }) {
  return <ScreenshotSlide active={active} src="screenshot4.png" counter="SkyFox · 5 / 5" />;
}

/* 9 – Key Features */
function Slide9({ active }: { active: boolean }) {
  const features = [
    ["🔐", "#3b82f6", "OTP-Based Signup Authentication", "TOTP secret generated at signup and stored in memory for up to 15 minutes; OTP is verified server-side in Go before account activation."],
    ["🤖", "#a78bfa", "CAPTCHA Login Protection", "Integrated hCaptcha on login and signup — token passed with form, verified server-side in Go middleware before JWT issuance."],
    ["🎟️", "#60a5fa", "Concurrent Seat Booking Engine", "Interactive seat map with real-time selection. Goroutine-based seat locking in Go to prevent concurrent booking conflicts."],
    ["💳", "#3b82f6", "Multi-Step Checkout", "Seat confirmation → payment details → booking confirmation. Transactional integrity with PostgreSQL rollbacks on failure."],
    ["👤", "#a78bfa", "Profile Management", "Full CRUD for user profiles — update name, mobile, profile photo or avatar, view complete booking history."],
    ["🛠️", "#60a5fa", "Admin & Window Booking", "Admin can configure screens with different seat layouts, schedule shows, detect showtime conflicts, and support box office ticket booking."],
  ];
  return (
    <Slide active={active} blobs={[
      { w: 420, h: 420, bottom: "-110px", right: "-90px", color: "#1d4ed8", opacity: 0.11, anim: "anim-float-slow" },
      { w: 270, h: 270, top: "-70px", left: "-60px", color: "#7c3aed", opacity: 0.08, anim: "anim-float-drift" },
    ]}>
      <SL>What We Built</SL>
      <H2>Key Features Developed</H2>
      <Rule />
      <div className="g2 r" style={{ marginTop: "0.9rem" }}>
        {features.map(([icon, color, title, desc]) => (
          <Card key={title as string} style={{ borderLeft: `3px solid ${color}` }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 600, margin: "0 0 5px", display: "flex", gap: 7, alignItems: "center" }}>
              <span>{icon}</span> {title}
            </h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.55 }}>{desc}</p>
          </Card>
        ))}
      </div>
    </Slide>
  );
}

/* 10 – Challenges & Solutions */
function Slide10({ active }: { active: boolean }) {
  const items = [
    ["Concurrency in Seat Selection", "Race condition: two users simultaneously selecting the same seat led to double-bookings. Non-deterministic bug only appearing under concurrent load.", "Implemented goroutine-based seat locking in Go. If a user abandons the flow, the lock is released automatically after a timeout."],
    ["OTP Secret for Signup", "Generating a secure, unique TOTP secret per user during signup — ensuring it's stored securely and correctly tied to time-based OTPs for 2FA flows.", "Used Go's crypto/rand + base32 encoding to generate secret on signup, stored encrypted in DB. QR code sent to client for authenticator app setup."],
    ["Seat Selection Algorithm", "Users may request seats in a preferred row/block, but if enough continuous seats are not available on one side, the system must intelligently suggest alternatives.", "Algorithm prioritizes continuous seats first. If unavailable together, it suggests the best available continuous block and lets the customer choose remaining seats manually."],
  ];
  return (
    <Slide active={active} blobs={[
      { w: 380, h: 380, top: "-85px", left: "-80px", color: "#1d4ed8", opacity: 0.10, anim: "anim-float-slow" },
      { w: 260, h: 260, bottom: "-65px", right: "-55px", color: "#7c3aed", opacity: 0.08, anim: "anim-float-drift" },
    ]}>
      <SL>Problem Solving</SL>
      <H2>Challenges &amp; Solutions</H2>
      <Rule />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.9rem" }}>
        {items.map(([title, challenge, solution], i) => (
          <Card key={title} className="r">
            <div className="g2" style={{ gap: "1.2rem" }}>
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#ef4444", marginBottom: "0.25rem" }}>⚠️ Challenge {i + 1} – {title}</div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{challenge}</p>
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#22c55e", marginBottom: "0.25rem" }}>✅ Solution</div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{solution}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Slide>
  );
}

/* 11 – Agile Practices */
function Slide11({ active }: { active: boolean }) {
  return (
    <Slide active={active} blobs={[
      { w: 420, h: 420, top: "-95px", right: "-85px", color: "#1d4ed8", opacity: 0.10, anim: "anim-float-slow" },
      { w: 260, h: 260, bottom: "-60px", left: "-55px", color: "#7c3aed", opacity: 0.08, anim: "anim-float-drift" },
    ]}>
      <SL>Weeks 6–8 · Project Simulation</SL>
      <H2>Agile Practices</H2><Rule />
      <div className="g2 r" style={{ marginTop: "0.9rem", gap: "1.2rem" }}>
        <div>
          <div style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.7rem" }}>Sprint Structure — 3 × 1-Week Sprints</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              ["Sprint 1", "Core auth, API setup, DB schema, DB Migrations"],
              ["Sprint 2", "Seat booking engine, Admin panel, Docker environment, Bug bash, Deployment"],
              ["Sprint 3", "User profile, Revenue dashboard, Payment integration, Bug bash, Final showcase"],
            ].map(([sprint, desc], i) => (
              <Card key={sprint} style={{ display: "flex", gap: "0.8rem", alignItems: "center", padding: "0.65rem 1rem" }}>
                <div style={{ background: "linear-gradient(135deg,#3b82f6,#a78bfa)", color: "#fff", width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: "0.84rem", fontWeight: 600 }}>{sprint}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{desc}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.7rem" }}>Agile Ceremonies Practiced</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {["📋 Iteration Planning", "🚦 Daily Standups", "🏁 Kick-Off", "🖊️ Sign-Off", "🔍 Desk Check", "🐛 Bug Bash", "🧊 Code Freeze", "🎯 Dev", "🎤 Showcase", "🪞 Introspect"].map((b, i) => (
              <Badge key={b} cls={i > 3 ? "gold" : ""}>{b}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* 12 – Test-Driven Development — Fixed TDD cycle: Red → Green → Refactor */
function Slide12({ active }: { active: boolean }) {
  return (
    <Slide active={active} blobs={[
      { w: 400, h: 400, bottom: "-100px", right: "-90px", color: "#1d4ed8", opacity: 0.11, anim: "anim-float-slow" },
      { w: 280, h: 280, top: "-70px", left: "-60px", color: "#7c3aed", opacity: 0.09, anim: "anim-float-drift" },
    ]}>
      <SL>Quality Engineering</SL>
      <H2>Test-Driven Development</H2>
      <Rule />
      <div className="g2 r" style={{ marginTop: "0.9rem", gap: "1.4rem" }}>
        <div>
          {/* TDD Cycle — correct order: Red → Green → Refactor */}
          <Card style={{ marginBottom: "0.75rem", borderLeft: "3px solid #ef4444" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: "0.9rem" }}>
                <span style={{ color: "#ef4444" }}>🔴 Red</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>→</span>
                <span style={{ color: "#22c55e" }}>🟢 Green</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>→</span>
                <span style={{ color: "#facc15" }}>🟡 Refactor</span>
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
              <strong style={{ color: "#ef4444" }}>Red:</strong> Write a failing test first.&nbsp;
              <strong style={{ color: "#22c55e" }}>Green:</strong> Implement minimal code to make it pass.&nbsp;
              <strong style={{ color: "#facc15" }}>Refactor:</strong> Clean and improve code without breaking tests. Enforced during Pair Programming sessions.
            </p>
          </Card>
          <Card style={{ borderLeft: "3px solid #a78bfa" }}>
            <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#a78bfa", marginBottom: 5 }}>Mocks &amp; Stubs</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>Used Go interfaces to mock the DB layer in handler tests — no actual DB calls during unit tests. Frontend uses mock API responses to test components in isolation from the backend.</p>
          </Card>
        </div>
        <div>
          <div style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.65rem" }}>Test Coverage Areas</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              ["⚛️", "#3b82f6", "React Components (Vitest)", "Login, Seat Map, Checkout, Profile — all critical UI paths"],
              ["🐹", "#a78bfa", "Go API Handlers", "Auth endpoints, booking logic, payment — mocked DB layer"],
              ["⚡", "#60a5fa", "Concurrency & Edge Cases", "Seat race conditions, OTP expiry, invalid token scenarios"],
              ["🔗", "#818cf8", "Integration Tests", "End-to-end booking flow — signup → seat → checkout → confirm"],
            ].map(([icon, color, title, sub]) => (
              <Card key={title as string} style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.65rem 0.9rem", borderLeft: `3px solid ${color}` }}>
                <span style={{ fontSize: "1rem" }}>{icon}</span>
                <div>
                  <div style={{ fontSize: "0.83rem", fontWeight: 600 }}>{title}</div>
                  <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>{sub}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* 13 – Challenges & Learnings */
function Slide13({ active }: { active: boolean }) {
  return (
    <Slide active={active} particles blobs={[
      { w: 440, h: 440, bottom: "-110px", right: "-100px", color: "#1d4ed8", opacity: 0.12, anim: "anim-float-slow" },
      { w: 280, h: 280, top: "-70px", left: "-60px", color: "#7c3aed", opacity: 0.09, anim: "anim-float-drift" },
    ]}>
      <SL>Growth &amp; Insights</SL>
      <H2>Challenges &amp; Learnings</H2>
      <Rule />
      <div className="g2 r" style={{ marginTop: "0.9rem", gap: "1.2rem" }}>
        <div>
          <div style={{ fontSize: "0.76rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.65rem", color: "#60a5fa" }}>Technical Skills Gained</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {[
              ["#3b82f6", "Advanced Go patterns — goroutines, channels, interfaces, production-scale idiomatic error handling"],
              ["#a78bfa", "React performance optimization with hooks — memoization, clean component architecture"],
              ["#60a5fa", "Test-driven development — writing tests before implementation, achieving coverage on all critical paths"],
              ["#818cf8", "Docker containerization — writing Dockerfiles, multi-service Compose, networking, volumes"],
            ].map(([color, text], i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: color as string, flexShrink: 0, marginTop: 2 }}>▸</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.76rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.65rem", color: "#60a5fa" }}>Professional &amp; Soft Skills</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              ["🤝", "#3b82f6", "Collaborative Engineering", "Pair programming, code reviews, async communication in a corporate engineering team"],
              ["⏱️", "#a78bfa", "Sprint Planning & Delivery", "Estimating tasks, breaking features, iterating quickly within agile sprint cycles"],
              ["🏦", "#60a5fa", "Fintech Domain Knowledge", "Banking security standards, compliance thinking, customer-centric product design"],
            ].map(([icon, color, title, desc]) => (
              <Card key={title as string} style={{ padding: "0.65rem 0.9rem", borderLeft: `3px solid ${color}` }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}><span>{icon}</span><span style={{ fontSize: "0.84rem", fontWeight: 600 }}>{title}</span></div>
                <p style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* 14 – Summary */
function Slide14({ active }: { active: boolean }) {
  return (
    <Slide active={active} blobs={[
      { w: 500, h: 500, top: "-120px", right: "-110px", color: "#1d4ed8", opacity: 0.15, anim: "anim-float-slow" },
      { w: 350, h: 350, bottom: "-100px", left: "-90px", color: "#7c3aed", opacity: 0.10, anim: "anim-float-drift" },
      { w: 220, h: 220, top: "38%", left: "12%", color: "#0ea5e9", opacity: 0.07, anim: "anim-float-slow-rev" },
    ]}>
      <SL style={{ textAlign: "center" }}>Reflection</SL>
      <H2>Summary &amp; Transition to Working Professional</H2>
      <Rule />
      <div className="g3 r" style={{ marginTop: "0.9rem" }}>
        {[
          { color: "#3b82f6", icon: "🎓", title: "As a Student", text: "Learned concepts theoretically. Projects were isolated, self-paced, and graded individually." },
          { color: "#a78bfa", icon: "🔄", title: "The Transition", text: "8 weeks of real infrastructure, real deadlines, real teams, agile ceremonies, and code reviews." },
          { color: "#60a5fa", icon: "💼", title: "As a Professional", text: "Apply engineering principles, collaborate across teams, own outcomes and communicate proactively." },
        ].map(c => (
          <Card key={c.title} style={{ textAlign: "center", borderTop: `2px solid ${c.color}` }}>
            <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{c.icon}</div>
            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.title}</div>
            <p style={{ fontSize: "0.79rem", color: "var(--text-muted)", lineHeight: 1.55 }}>{c.text}</p>
          </Card>
        ))}
      </div>
      <Card className="r" style={{ marginTop: "0.9rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 700, margin: "0 auto" }}>
          This 8-week training at IDFC FIRST Bank bridged the gap between campus and corporate — from theory to TDD, from solo code to team standups, from assignment deadlines to sprint showcases. The Neev programme has transformed my approach from a student building features to a professional owning features.
        </p>
      </Card>
      <div className="r" style={{ marginTop: "0.9rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
        {["React.js", "Go (Golang)", "PostgreSQL", "Docker", "TDD", "Agile Sprints", "SkyFox"].map((b, i) => (
          <Badge key={b} cls={i > 4 ? "gold" : ""}>{b}</Badge>
        ))}
      </div>
    </Slide>
  );
}

/* 15 – Thank You */
function Slide15({ active }: { active: boolean }) {
  return (
    <Slide active={active} particles blobs={[
      { w: 550, h: 550, top: "-140px", right: "-130px", color: "#1d4ed8", opacity: 0.18, anim: "anim-float-slow" },
      { w: 380, h: 380, bottom: "-110px", left: "-100px", color: "#7c3aed", opacity: 0.12, anim: "anim-float-drift" },
      { w: 240, h: 240, top: "35%", left: "10%", color: "#0ea5e9", opacity: 0.07, anim: "anim-float-slow-rev" },
    ]}>
      <div style={{ textAlign: "center" }}>
        <div className="r" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "24px", marginBottom: "1.4rem", flexWrap: "wrap" }}>
          <img src="/IDFC-FIRST-Bank-logobase.svg" alt="IDFC FIRST Bank" className="anim-float" style={{ maxHeight: 44, maxWidth: 150, objectFit: "contain" }} />
          <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.12)" }} />
          <img src="/iiit_surat_logo.png" alt="IIIT Surat" className="anim-float" style={{ maxHeight: 56, maxWidth: 65, objectFit: "contain", animationDelay: "0.3s" }} />
        </div>
        <h1 className="font-display r anim-glow grad-text" style={{ fontSize: "clamp(2.5rem,6vw,4.2rem)", fontWeight: 800, margin: "0 0 0.3rem" }}>
          Q &amp; A
        </h1>
        <h1 className="font-display r" style={{ fontSize: "clamp(1.4rem,3.5vw,2.2rem)", fontWeight: 600, margin: "0 0 0.8rem", color: "var(--text-secondary)" }}>
          Thank You
        </h1>
        <p className="r" style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: "0.5rem 0 0.3rem" }}>
          Grateful to the mentors and IDFC FIRST Bank for this extraordinary learning experience.
        </p>
        <p className="r" style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: "0.3rem 0", letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Ajay Mali · Application Engineer Intern · Neev 2026
        </p>
        <div className="r" style={{ marginTop: "1.4rem", display: "inline-block", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "0.9rem 2rem" }}>
          <div style={{ display: "flex", gap: "2.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[["Student", "Ajay Mali (UI22CS43)"], ["Semester", "6th Sem – B.Tech CSE"], ["Faculty Supervisor", "Dr. Nidhi Desai"]].map(([label, val]) => (
              <div key={label}>
                <div className="section-label" style={{ marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: "0.84rem", fontWeight: 600 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN DECK
══════════════════════════════════════════════════════════════ */
const SLIDE_COMPONENTS = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide8b, Slide8c, Slide8d, Slide8e, Slide9, Slide10, Slide11, Slide12, Slide13, Slide14, Slide15];
const TOTAL = SLIDE_COMPONENTS.length;

export default function Home() {
  const [current, setCurrent] = useState(0);

  const go = useCallback((n: number) => {
    if (n < 0 || n >= TOTAL) return;
    setCurrent(n);
  }, []);

  const prev = useCallback(() => go(current - 1), [current, go]);
  const next = useCallback(() => go(current + 1), [current, go]);

  // Keyboard + touch
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    let tx = 0;
    const onTouchStart = (e: TouchEvent) => { tx = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => { const d = tx - e.changedTouches[0].clientX; if (Math.abs(d) > 50) d > 0 ? next() : prev(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("touchstart", onTouchStart); window.removeEventListener("touchend", onTouchEnd); };
  }, [next, prev]);

  // Mouse spotlight
  useEffect(() => {
    const el = document.getElementById("spotlight");
    const onMove = (e: MouseEvent) => {
      if (el) el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(59,130,246,0.05), transparent 40%)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        {SLIDE_COMPONENTS.map((SlideComp, i) => (
          <SlideComp key={i} active={i === current} />
        ))}
      </div>

      {/* Spotlight overlay */}
      <div id="spotlight" style={{ position: "fixed", inset: 0, zIndex: 99, pointerEvents: "none" }} />

      {/* Nav */}
      <nav className="nav-pill">
        <button className="nav-btn" onClick={prev} disabled={current === 0}>&#8249;</button>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxWidth: 320, justifyContent: "center" }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button key={i} className={`dot${i === current ? " active" : ""}`} onClick={() => go(i)} />
          ))}
        </div>
        <button className="nav-btn" onClick={next} disabled={current === TOTAL - 1}>&#8250;</button>
        <span className="counter">{current + 1} / {TOTAL}</span>
      </nav>
    </>
  );
}