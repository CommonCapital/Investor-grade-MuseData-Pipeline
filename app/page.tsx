"use client";

import { useState, useEffect, useRef } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import Script from "next/script";

/* ─── Reveal hook: IntersectionObserver ─── */
function Reveal({
  children,
  delay = 0,
  style,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("on");
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}s`, ...style }}
    >
      {children}
    </div>
  );
}

const MARQUEE_ITEMS = [
  "Enterprise Software","Enterprise AI","Minority Equity","$5M–$25M Checks",
  "$3M–$25M ARR","New York","Los Angeles","London","Investing Globally","LP Co-Investment",
  "Proprietary Diligence","Sponsor Processes",
  "Enterprise Software","Enterprise AI","Minority Equity","$5M–$25M Checks",
  "$3M–$25M ARR","New York","Los Angeles","London","Investing Globally","LP Co-Investment",
  "Proprietary Diligence","Sponsor Processes",
];

const WHAT_TILES = [
  { n:"01", title:"Companies",              href:"/companies",               body:"Our portfolio of enterprise software and AI companies — each selected through proprietary diligence, backed with $5–25M minority equity.", link:"View Portfolio" },
  { n:"02", title:"Strategic Resource Group", href:"/strategic-resource-group", body:"Operational infrastructure for portfolio companies — governance, reporting cadence, and strategic advisory for founders scaling toward institutional capital.", link:"Learn More" },
  { n:"03", title:"Founders",               href:"/founders",                body:"A curated network of founders, operators, and investors sharing intelligence, access, and conviction across the MUSEDATA ecosystem.", link:"Explore" },
             
];

export default function MuseDataLanding() {
  const [mobOpen, setMobOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <Script
        src="https://www.buildmyagent.io/widget/69706ea5e966c51847e406ff/widget-professional.js?widgetId=69706ea5e966c51847e406ff"
        strategy="lazyOnload"
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Bodoni+Moda:ital,wght@0,400;1,400&family=Montserrat:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        :root {
          --void:      #ffffff;
          --deep:      #f7f9fa;
          --surface:   #eef4f7;
          --line:      rgba(26,78,102,0.1);
          --line-g:    rgba(26,78,102,0.2);
          --line-g2:   rgba(26,78,102,0.4);
          --gold:      #1a4e66;
          --gold-lt:   #2e7a96;
          --cream:     #0d1f2d;
          --cream-2:   #2c4a5c;
          --cream-3:   #4a6d80;
          --ff-d:      'Cormorant Garamond', Georgia, serif;
          --ff-b:      'Bodoni Moda', Georgia, serif;
          --ff-s:      'Montserrat', sans-serif;
        }
        body { background: var(--void); color: var(--cream); font-family: var(--ff-s); font-weight: 300; line-height: 1.6; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: var(--line-g); }

        .wrap { max-width: 1200px; margin: 0 auto; padding: 0 52px; position: relative; z-index: 1; }
        @media(max-width:640px){ .wrap { padding: 0 24px; } }

        .label { font-family: var(--ff-s); font-size: 11px; font-weight: 400; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); }
        .rule  { display: inline-block; width: 32px; height: 1px; background: var(--gold); vertical-align: middle; margin-right: 16px; }

        /* reveal */
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .reveal.on { opacity: 1; transform: none; }

        /* NAV */
        #museNav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; background: #0a2433; border-bottom: 1px solid rgba(26,78,102,0.4); transition: box-shadow 0.3s; }
        #museNav.scrolled { box-shadow: 0 4px 32px rgba(0,0,0,0.18); }
        .nav-wrap { display: flex; align-items: center; justify-content: space-between; height: 56px; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .nav-wordmark { font-family: var(--ff-s); font-size: 13px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #e8f4f8; }
        .nav-links { display: flex; align-items: center; list-style: none; margin-left: 24px; }
        .nav-links a { font-family: var(--ff-s); font-size: 11px; font-weight: 400; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(232,244,248,0.7); text-decoration: none; padding: 0 12px; height: 56px; display: flex; align-items: center; border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s; }
        .nav-links a:hover { color: #e8f4f8; border-bottom-color: #1a4e66; }
        .nav-links a.srg { color: #e8f4f8; font-weight: 500; border-bottom: 2px solid #2e7a96; }
        .nav-connect { flex-shrink: 0; margin-left: 16px; font-family: var(--ff-s); font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: #e8f4f8; background: #1a4e66; padding: 9px 22px; text-decoration: none; border: 1px solid #1a4e66; transition: background 0.2s; white-space: nowrap; }
        .nav-connect:hover { background: #2e7a96; border-color: #2e7a96; }
        .ham { display: none; flex-direction: column; gap: 5px; cursor: pointer; margin-left: 16px; }
        .ham span { width: 22px; height: 1.5px; background: #e8f4f8; display: block; }
        @media(max-width:860px){ .nav-links { display: none; } .ham { display: flex; } }
        .mob-menu { display: none; position: fixed; top: 56px; left: 0; right: 0; z-index: 199; background: rgba(5,5,8,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid var(--line); padding: 32px 24px 40px; flex-direction: column; }
        .mob-menu.open { display: flex; }
        .mob-menu a { font-size: 13px; font-weight: 300; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(232,244,248,0.7); text-decoration: none; padding: 16px 0; border-bottom: 1px solid var(--line); transition: color 0.2s; }
        .mob-menu a:hover { color: #e8f4f8; }
        .mob-apply { margin-top: 24px; text-align: center; border: 1px solid #1a4e66 !important; color: #2e7a96 !important; padding: 14px !important; font-size: 10px; letter-spacing: 0.2em; }

        /* HERO */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
        @keyframes pulse  { 0%,100%{opacity:1;box-shadow:0 0 12px #1a4e66;} 50%{opacity:0.4;box-shadow:0 0 4px #1a4e66;} }
        #hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding-top: 56px; overflow: hidden; background: #0a1e2c; }
        .hero-bg  { position: absolute; inset: 0; background-image: url('/background.png'); background-size: cover; background-position: center; opacity: 0.18; }
        .hero-ov  { position: absolute; inset: 0; background: linear-gradient(135deg,rgba(10,20,30,0.85),rgba(10,36,51,0.7)); }
        .hero-in  { padding: 120px 0 140px; position: relative; z-index: 1; }
        .hero-ol  { display: flex; align-items: center; margin-bottom: 56px; opacity: 0; animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.2s forwards; }
        .hero-dot { width:6px; height:6px; border-radius:50%; background:#2e7a96; margin-right:14px; box-shadow:0 0 12px #1a4e66; animation: pulse 3s ease-in-out infinite; }
        .hero-h1  { font-family: var(--ff-d); font-size: clamp(64px,10vw,130px); font-weight: 300; line-height: 0.9; letter-spacing: -0.03em; color: #e8f4f8; opacity: 0; animation: fadeUp 1.1s cubic-bezier(0.16,1,0.3,1) 0.35s forwards; }
        .hero-h1 .it  { font-style: italic; color: #2e7a96; }
        .hero-h1 .i1  { padding-left: clamp(40px,7vw,120px); display: block; }
        .hero-h1 .i2  { padding-left: clamp(80px,14vw,240px); display: block; }
        .hero-bot { display: flex; align-items: flex-end; justify-content: space-between; margin-top: 96px; gap: 60px; flex-wrap: wrap; opacity: 0; animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.65s forwards; }
        .hero-desc { max-width: 460px; font-size: 16px; font-weight: 300; line-height: 1.85; color: rgba(232,244,248,0.75); border-left: 2px solid #1a4e66; padding-left: 28px; }
        .hero-acts { display: flex; flex-direction: column; gap: 12px; align-items: flex-end; }

        /* BUTTONS */
        .btn-g  { display: inline-flex; align-items: center; gap: 16px; background: var(--gold); color: #fff; font-family: var(--ff-s); font-size: 11px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; padding: 18px 40px; text-decoration: none; transition: background 0.25s, gap 0.25s; border: none; cursor: pointer; }
        .btn-g:hover  { background: #1a5c7a; gap: 22px; }
        .btn-gh { display: inline-flex; align-items: center; gap: 14px; border: 1px solid var(--line-g2); color: rgba(232,244,248,0.7); font-family: var(--ff-s); font-size: 11px; font-weight: 400; letter-spacing: 0.18em; text-transform: uppercase; padding: 18px 40px; text-decoration: none; transition: border-color 0.25s, color 0.25s, gap 0.25s; background: transparent; cursor: pointer; }
        .btn-gh:hover { border-color: #1a4e66; color: #e8f4f8; gap: 20px; }
        .btn-gh-dark { border-color: var(--line-g2); color: var(--cream-2); }
        .btn-gh-dark:hover { border-color: var(--gold); color: var(--gold); }
        .arr { display:inline-block; width:18px; height:1px; background:currentColor; position:relative; flex-shrink:0; }
        .arr::after { content:''; position:absolute; right:-1px; top:-3px; border:3px solid transparent; border-left:5px solid currentColor; }

        /* MARQUEE */
        .mq-strip { border-top:1px solid var(--line); border-bottom:1px solid var(--line); overflow:hidden; padding:18px 0; background:var(--deep); }
        .mq-track { display:flex; animation: marquee 28s linear infinite; width:max-content; }
        .mq-item  { display:inline-flex; align-items:center; gap:28px; padding:0 40px; font-size:11px; font-weight:400; letter-spacing:0.2em; text-transform:uppercase; color:var(--cream-3); white-space:nowrap; }
        .mq-item::before { content:'✦'; font-size:6px; color:var(--gold); }
        @keyframes marquee { from{transform:translateX(0);} to{transform:translateX(-50%);} }

        /* GLANCE */
        .glance-grid { display:grid; grid-template-columns:repeat(3,1fr); border-top:1px solid var(--line); }
        .glance-cell { padding:64px 56px; border-right:1px solid var(--line); transition:background 0.3s; }
        .glance-cell:last-child { border-right:none; }
        .glance-cell:hover { background:var(--deep); }
        .g-num  { font-family:var(--ff-d); font-size:clamp(44px,5vw,72px); font-weight:300; line-height:1; color:var(--cream); letter-spacing:-0.03em; margin-bottom:12px; }
        .g-num em { font-style:italic; color:var(--gold); font-size:0.65em; }
        .g-lbl  { font-size:10px; font-weight:500; letter-spacing:0.28em; text-transform:uppercase; color:var(--cream-3); }
        @media(max-width:768px){ .glance-grid{grid-template-columns:1fr 1fr;} .glance-cell{border-bottom:1px solid var(--line);} }

        /* WHAT */
        #what { padding:120px 0; border-top:1px solid var(--line); }
        .what-hdr { display:flex; align-items:flex-end; justify-content:space-between; gap:40px; flex-wrap:wrap; margin-bottom:64px; }
        .what-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--line); }
        .what-tile { background:var(--deep); padding:40px 32px; text-decoration:none; display:flex; flex-direction:column; position:relative; overflow:hidden; transition:background 0.3s; }
        .what-tile::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform 0.35s ease; }
        .what-tile:hover { background:var(--surface); }
        .what-tile:hover::after { transform:scaleX(1); }
        .wt-n  { font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:var(--gold); margin-bottom:20px; }
        .wt-t  { font-family:var(--ff-d); font-size:22px; font-weight:400; color:var(--cream); margin-bottom:12px; line-height:1.2; }
        .wt-b  { font-size:14px; font-weight:300; color:var(--cream-2); line-height:1.75; flex:1; margin-bottom:24px; }
        .wt-lk { display:inline-flex; align-items:center; gap:8px; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:var(--gold); transition:gap 0.2s; }
        .what-tile:hover .wt-lk { gap:14px; }
        .wt-ar { display:inline-block; width:16px; height:1px; background:var(--gold); position:relative; }
        .wt-ar::after { content:''; position:absolute; right:0; top:-3px; border:3px solid transparent; border-left:5px solid var(--gold); }
        @media(max-width:900px){ .what-grid{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:540px){ .what-grid{grid-template-columns:1fr;} }

        /* PATHS */
        #paths { padding:120px 0; border-top:1px solid var(--line); background:var(--deep); }

        /* PHILOSOPHY */
        #philosophy { padding:120px 0; border-top:1px solid var(--line); }
        .phil-q { font-family:var(--ff-d); font-size:clamp(26px,3vw,42px); font-weight:400; font-style:italic; line-height:1.35; letter-spacing:-0.01em; color:var(--cream); margin-bottom:36px; }
        .phil-q em { color:var(--gold-lt); font-style:normal; }
        .phil-pills { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:36px; }
        .phil-pill { font-size:11px; font-weight:400; letter-spacing:0.14em; text-transform:uppercase; color:var(--cream-3); border:1px solid var(--line); padding:10px 20px; transition:border-color 0.2s, color 0.2s; }
        .phil-pill:hover { border-color:var(--line-g); color:var(--cream); }

        /* CTA */
        #cta { padding:160px 0; border-top:1px solid var(--line); text-align:center; position:relative; overflow:hidden; }
        #cta::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 80% 80% at 50% 50%,rgba(26,78,102,0.05) 0%,transparent 65%); pointer-events:none; }
        .cta-h2 { font-family:var(--ff-d); font-size:clamp(42px,6vw,80px); font-weight:400; line-height:1.05; letter-spacing:-0.025em; color:var(--cream); max-width:760px; margin:0 auto 28px; }
        .cta-h2 em { font-style:italic; color:var(--gold-lt); }

        /* SECTION TYPOGRAPHY */
        .sec-h2 { font-family:var(--ff-d); font-size:clamp(36px,4vw,54px); font-weight:400; line-height:1.1; letter-spacing:-0.02em; color:var(--cream); }
        .sec-h2 em { font-style:italic; color:var(--gold-lt); }
        .sec-sub { font-size:16px; font-weight:300; line-height:1.8; color:var(--cream-3); }

        /* FOOTER */
        footer { border-top:1px solid var(--line); background:#0a2433; }
        .foot-top { display:grid; grid-template-columns:1.8fr 1fr 1fr 1fr; gap:56px; padding:72px 0 64px; }
        .foot-wm  { font-family:var(--ff-s); font-size:12px; font-weight:500; letter-spacing:0.3em; text-transform:uppercase; color:#fff; margin-bottom:14px; }
        .foot-wm span { font-weight:200; color:#2e7a96; }
        .foot-tag { font-size:13px; font-weight:300; color:rgba(232,244,248,0.7); line-height:1.7; max-width:260px; margin-bottom:22px; }
        .foot-contact a { font-size:12px; letter-spacing:0.06em; color:#2e7a96; text-decoration:none; transition:color 0.2s; }
        .foot-contact a:hover { color:#5aa8c4; }
        .foot-ch { font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(232,244,248,0.45); margin-bottom:20px; font-weight:400; }
        .foot-list { list-style:none; display:flex; flex-direction:column; gap:11px; }
        .foot-list a { font-size:14px; font-weight:300; color:rgba(232,244,248,0.65); text-decoration:none; transition:color 0.25s; }
        .foot-list a:hover { color:#fff; }
        .foot-nl { display:flex; margin-top:16px; }
        .foot-nl input { flex:1; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-right:none; color:#fff; font-family:var(--ff-s); font-size:12px; font-weight:300; padding:10px 14px; outline:none; transition:border-color 0.2s; }
        .foot-nl input::placeholder { color:rgba(232,244,248,0.4); }
        .foot-nl input:focus { border-color:#2e7a96; }
        .foot-nl button { background:#1a4e66; border:1px solid #1a4e66; color:#fff; font-family:var(--ff-s); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; padding:10px 16px; cursor:pointer; transition:all 0.25s; }
        .foot-nl button:hover { background:#2e7a96; }
        .foot-bot { border-top:1px solid rgba(255,255,255,0.1); padding:22px 0; display:flex; justify-content:space-between; align-items:center; }
        .foot-copy { font-size:12px; letter-spacing:0.1em; color:rgba(232,244,248,0.3); font-weight:300; }
        .foot-legal { display:flex; gap:22px; }
        .foot-legal a { font-size:12px; letter-spacing:0.1em; color:rgba(232,244,248,0.3); text-decoration:none; transition:color 0.2s; }
        .foot-legal a:hover { color:rgba(232,244,248,0.6); }
        @media(max-width:900px){ .foot-top{grid-template-columns:1fr 1fr;gap:40px;} }
        @media(max-width:540px){ .foot-top{grid-template-columns:1fr;} .foot-bot{flex-direction:column;gap:14px;text-align:center;} }
      `}</style>

      {/* ── NAV ── */}
      <nav id="museNav" className={scrolled ? "scrolled" : ""}>
        <div className="wrap">
          <div className="nav-wrap">
            <a href="#" className="nav-logo">
              <svg width="32" height="32" viewBox="0 0 22 22" fill="none" style={{ background: "#fff", padding: 4 }}>
                <rect x="0"  y="0"  width="6" height="6" fill="#1a4e66"/>
                <rect x="8"  y="0"  width="6" height="6" fill="#0a2433"/>
                <rect x="16" y="0"  width="6" height="6" fill="#1a4e66"/>
                <rect x="0"  y="8"  width="6" height="6" fill="#1a4e66"/>
                <rect x="8"  y="8"  width="6" height="6" fill="#1a4e66"/>
                <rect x="16" y="8"  width="6" height="6" fill="#0a2433"/>
                <rect x="0"  y="16" width="6" height="6" fill="#1a4e66"/>
                <rect x="8"  y="16" width="6" height="6" fill="#1a4e66"/>
                <rect x="16" y="16" width="6" height="6" rx="3" fill="#000"/>
              </svg>
              <span className="nav-wordmark">MUSEDATA</span>
            </a>
            <ul className="nav-links">
              {[
                ["/companies","Companies"],["/people","People"],
                ["/strategic-resource-group","SRG","srg"],["/founders","Founders","srg"],
                ["#about","About"],["/apply","Jobs"],
              ].map(([href,label,cls]) => (
                <li key={href}><a href={href} className={cls || ""}>{label}</a></li>
              ))}
            </ul>
            <a href="mailto:partners@musedata.ai" className="nav-connect">Connect</a>
            <div className="ham" onClick={() => setMobOpen(o => !o)}>
              <span /><span /><span />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mob-menu${mobOpen ? " open" : ""}`}>
        {[["/companies","Companies"],["/people","People"],["/strategic-resource-group","SRG"],["/founders","Founders"],["#about","About"],["/apply","Jobs"]].map(([href,label]) => (
          <a key={href} href={href} onClick={() => setMobOpen(false)}>{label}</a>
        ))}
        <a href="/funding" className="mob-apply" onClick={() => setMobOpen(false)}>Apply for Capital</a>
      </div>

      {/* ── HERO ── */}
      <section id="hero">
        <div className="hero-bg" />
        <div className="hero-ov" />
        <div className="wrap">
          <div className="hero-in">
            <div className="hero-ol">
              <div className="hero-dot" />
              <span className="label" style={{ color: "rgba(232,244,248,0.8)" }}>
                Growth Equity &nbsp;•&nbsp; New York · Los Angeles · London &nbsp;•&nbsp; Investing Globally
              </span>
            </div>
            <h1 className="hero-h1">
              Conviction
              <span className="i1"><span className="it">Capital</span> for</span>
              <span className="i2">the Exceptional</span>
            </h1>
            <div className="hero-bot">
              <p className="hero-desc">
                MUSEDATA is a growth equity firm deploying minority capital into enterprise software and AI companies — backed by proprietary diligence, built around founders ready for their next chapter.
              </p>
              <div className="hero-acts">
                <Unauthenticated>
                  <SignInButton mode="modal" forceRedirectUrl="/funding">
                    <button className="btn-g">Apply for Capital <span className="arr" /></button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Link href="/funding" className="btn-g">Apply for Capital <span className="arr" /></Link>
                </Authenticated>
                <Link href="/sample-report" className="btn-gh">
                  View Evidence Pack <span className="arr" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="mq-strip">
        <div className="mq-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="mq-item">{item}</span>
          ))}
        </div>
      </div>

      {/* ── AT A GLANCE ── */}
      <section id="glance">
        <div className="glance-grid">
          {[
            { num: "$3–25", unit: "M",  lbl: "ARR at Entry" },
            { num: "$5–25", unit: "M",  lbl: "Check Size" },
            { num: "$100",  unit: "M+", lbl: "Portfolio Scale" },
          ].map(({ num, unit, lbl }, i) => (
            <Reveal key={lbl} delay={i * 0.1} className="glance-cell">
              <div className="g-num">{num}<em>{unit}</em></div>
              <div className="g-lbl">{lbl}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section id="what">
        <div className="wrap">
          <div className="what-hdr">
            <div>
              <Reveal delay={0}><span className="rule" /><span className="label">What We Do</span></Reveal>
              <Reveal delay={0.08}><h2 className="sec-h2" style={{ marginTop: 18 }}>One firm.<br /><em>Four disciplines.</em></h2></Reveal>
            </div>
            <Reveal delay={0.16}>
              <p className="sec-sub" style={{ maxWidth: 360 }}>
                From minority capital to portfolio intelligence — every part of MUSEDATA is built around the same principle: evidence before conviction.
              </p>
            </Reveal>
          </div>
          <div className="what-grid">
            {WHAT_TILES.map(({ n, title, href, body, link }, i) => (
              <Reveal key={n} delay={i * 0.08}>
                <Link href={href} className="what-tile">
                  <div className="wt-n">{n}</div>
                  <div className="wt-t">{title}</div>
                  <div className="wt-b">{body}</div>
                  <div className="wt-lk">{link} <span className="wt-ar" /></div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE PARTNER ── */}
      <section id="paths">
        <div className="wrap">
          <div style={{ maxWidth: 780 }}>
            <Reveal delay={0}><span className="rule" /><span className="label">How We Partner</span></Reveal>
            <Reveal delay={0.08}><h2 className="sec-h2" style={{ margin: "28px 0 36px" }}>Capital with<br /><em>operational depth.</em></h2></Reveal>
            <Reveal delay={0.16}>
              <p style={{ fontSize: 17, fontWeight: 300, color: "var(--cream-2)", lineHeight: 1.9, marginBottom: 20 }}>
                We deploy minority growth equity and work alongside founders as the company scales. The firm's operational capabilities — the SRG, the network, the institutional relationships — are part of how we invest, not an add-on to it.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <p style={{ fontSize: 17, fontWeight: 300, color: "var(--cream-2)", lineHeight: 1.9, marginBottom: 52 }}>
                The best partnerships are built on conviction, not checklists.
              </p>
            </Reveal>
            <Reveal delay={0.32}>
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/funding">
                  <button className="btn-g">Apply for Capital <span className="arr" /></button>
                </SignInButton>
              </Unauthenticated>
              <Authenticated>
                <Link href="/funding" className="btn-g">Apply for Capital <span className="arr" /></Link>
              </Authenticated>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section id="philosophy">
        <div className="wrap">
          <div style={{ maxWidth: 820 }}>
            <Reveal delay={0}><span className="rule" /><span className="label">Investment Philosophy</span></Reveal>
            <Reveal delay={0.08}>
              <p className="phil-q" style={{ marginTop: 28 }}>
                "The finest capital is not merely patient. It is{" "}
                <em>precise</em> — deployed at the moment when a company is ready to be something permanent."
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="phil-pills">
                {["Evidence before conviction","Minority by design","Capital as a signal","Global mandate"].map(p => (
                  <span key={p} className="phil-pill">{p}</span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <Link href="/about" className="btn-gh btn-gh-dark">Read Our Thesis <span className="arr" /></Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta">
        <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
          <Reveal delay={0}>
            <div style={{ marginBottom: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="rule" /><span className="label">Begin</span>
              <span className="rule" style={{ marginRight: 0, marginLeft: 14 }} />
            </div>
          </Reveal>
          <Reveal delay={0.08}><h2 className="cta-h2">Your next chapter<br />deserves <em>the right capital</em></h2></Reveal>
          <Reveal delay={0.16}>
            <p style={{ fontSize: 15, fontWeight: 300, color: "var(--cream-2)", maxWidth: 440, margin: "0 auto 52px", lineHeight: 1.8 }}>
              Apply directly — the process begins with evidence, not introductions.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/funding">
                  <button className="btn-g">Apply for Capital <span className="arr" /></button>
                </SignInButton>
              </Unauthenticated>
              <Authenticated>
                <Link href="/funding" className="btn-g">Apply for Capital <span className="arr" /></Link>
              </Authenticated>
              <a href="mailto:partners@musedata.ai" className="btn-gh btn-gh-dark">Contact the Team <span className="arr" /></a>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <p style={{ marginTop: 40, fontSize: 10, fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--cream-3)" }}>
              Minority equity · Enterprise software &amp; AI · New York · Los Angeles · London · Investing Globally
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div>
              <div className="foot-wm">Muse<span>data</span></div>
              <p className="foot-tag">Growth equity firm investing minority capital in enterprise software and AI companies.</p>
              <p style={{ fontSize: 11, fontWeight: 300, color: "rgba(232,244,248,0.35)", letterSpacing: "0.12em", marginBottom: 22 }}>
                New York &nbsp;·&nbsp; Los Angeles &nbsp;·&nbsp; London
              </p>
              <div className="foot-contact"><a href="mailto:partners@musedata.ai">partners@musedata.ai</a></div>
            </div>
            <div>
              <div className="foot-ch">Firm</div>
              <ul className="foot-list">
                <li><a href="#philosophy">Philosophy</a></li>
                <li><a href="#what">What We Do</a></li>
                <li><a href="#paths">How We Partner</a></li>
                <li><Link href="/sample-report">Evidence Pack</Link></li>
              </ul>
            </div>
            <div>
              <div className="foot-ch">Capital</div>
              <ul className="foot-list">
                <li><Link href="/funding">Apply for Capital</Link></li>
                <li><Link href="/funding">Equity + Services</Link></li>
                <li><Link href="/apply">Join the Firm</Link></li>
                <li><a href="mailto:partners@musedata.ai">LP Enquiries</a></li>
              </ul>
            </div>
            <div>
              <div className="foot-ch">Intelligence</div>
              <p style={{ fontSize: 12, fontWeight: 300, color: "rgba(232,244,248,0.5)", marginBottom: 14, lineHeight: 1.7 }}>
                Perspectives on growth equity, enterprise software, and capital markets.
              </p>
              <div className="foot-nl">
                <input type="email" placeholder="your@email.com" />
                <button>Subscribe</button>
              </div>
            </div>
          </div>
          <div className="foot-bot">
            <div className="foot-copy">© 2026 MUSEDATA. All rights reserved.</div>
            <div className="foot-legal">
              <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Disclosures</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}