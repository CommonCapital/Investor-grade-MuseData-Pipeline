"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Custom cursor ─── */
function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const move = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", move);
    let raf: number;
    const tick = () => {
      if (dotRef.current)  { dotRef.current.style.left  = mx + "px"; dotRef.current.style.top  = my + "px"; }
      rx += (mx - rx) * 0.09; ry += (my - ry) * 0.09;
      if (ringRef.current) { ringRef.current.style.left = rx + "px"; ringRef.current.style.top = ry + "px"; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { document.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef}  id="cur" />
      <div ref={ringRef} id="cur-r" />
    </>
  );
}

/* ─── Logo mark ─── */
function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" style={{ background: "#fff", padding: 4 }}>
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
  );
}

const STATS = [
  { n: "$3–25", sup: "M", l: "Target ARR Stage"   },
  { n: "$5–25", sup: "M", l: "Minority Checks"     },
  { n: "$5–100",sup: "M", l: "Portfolio ARR Scale" },
];

export default function CompaniesPage() {
  const [mobOpen,  setMobOpen]  = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@200;300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-size: 16px; }

        :root {
          --deep:   #0A2F42;
          --mid:    #1B5E7B;
          --slate:  #4A6B7C;
          --bright: #3BA3CB;
          --main:   #2A7FA0;
          --white:  #fff;
          --ghost:  #F2F8FB;
          --border: rgba(42,127,160,.13);
          --nav-h:  68px;
          --ff:     'Montserrat', sans-serif;
          --ff-d:   'Cormorant Garamond', Georgia, serif;
        }

        body { font-family: var(--ff); font-size: 1rem; line-height: 1.6; background: var(--white); color: var(--deep); cursor: none; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        @media(max-width:768px){ body { cursor: auto; } #cur, #cur-r { display: none; } }

        /* CURSOR */
        #cur   { position:fixed; z-index:9999; width:7px; height:7px; border-radius:50%; background:var(--bright); pointer-events:none; transform:translate(-50%,-50%); }
        #cur-r { position:fixed; z-index:9998; width:36px; height:36px; border-radius:50%; border:1.5px solid rgba(42,127,160,.28); pointer-events:none; transform:translate(-50%,-50%); transition:width .3s,height .3s; }
        body:has(a:hover) #cur-r, body:has(button:hover) #cur-r { width:52px; height:52px; }

        /* NAV */
        #co-nav { position:fixed; inset:0 0 auto; z-index:500; height:var(--nav-h); background:rgba(255,255,255,.97); backdrop-filter:blur(18px); border-bottom:1px solid var(--border); display:flex; align-items:center; transition:box-shadow .3s; }
        #co-nav.scrolled { box-shadow:0 4px 24px rgba(10,47,66,.08); }
        .nav-in  { width:100%; max-width:1440px; margin:0 auto; padding:0 3rem; display:flex; align-items:center; justify-content:space-between; }
        .nav-logo { display:flex; align-items:center; gap:.8rem; text-decoration:none; }
        .nav-name { font-size:1rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--deep); }
        .nav-links { display:flex; list-style:none; }
        .nav-links a { display:block; padding:0 .9rem; height:var(--nav-h); line-height:var(--nav-h); font-size:.75rem; letter-spacing:.12em; text-transform:uppercase; color:var(--slate); text-decoration:none; border-bottom:2px solid transparent; transition:color .2s,border-color .2s; white-space:nowrap; }
        .nav-links a:hover, .nav-links a.on { color:var(--deep); border-bottom-color:var(--bright); }
        .nav-cta { padding:.5rem 1.6rem; border:1.5px solid var(--deep); color:var(--deep); font-size:.75rem; letter-spacing:.13em; text-transform:uppercase; text-decoration:none; transition:background .2s,color .2s; font-family:var(--ff); }
        .nav-cta:hover { background:var(--deep); color:var(--white); }
        .ham { display:none; flex-direction:column; gap:5px; cursor:pointer; margin-left:16px; }
        .ham span { width:22px; height:1.5px; background:var(--deep); display:block; }
        @media(max-width:1100px){ .nav-links a { padding:0 .6rem; font-size:.7rem; } }
        @media(max-width:860px)  { .nav-links { display:none; } .ham { display:flex; } }

        .mob-menu { display:none; position:fixed; top:var(--nav-h); left:0; right:0; z-index:499; background:rgba(255,255,255,.98); backdrop-filter:blur(18px); border-bottom:1px solid var(--border); padding:24px; flex-direction:column; }
        .mob-menu.open { display:flex; }
        .mob-menu a { font-size:.85rem; font-weight:400; letter-spacing:.1em; text-transform:uppercase; color:var(--slate); text-decoration:none; padding:14px 0; border-bottom:1px solid var(--border); transition:color .2s; }
        .mob-menu a:hover, .mob-menu a.on { color:var(--deep); }

        /* INTRO */
        @keyframes rise { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .intro { background:var(--deep); padding:calc(var(--nav-h) + 6rem) 3rem 0; position:relative; overflow:hidden; }
        .intro::after { content:''; position:absolute; inset:0; pointer-events:none; background: radial-gradient(ellipse 65% 55% at 90% 5%,rgba(59,163,203,.13),transparent 55%), radial-gradient(ellipse 45% 60% at 5% 95%,rgba(42,127,160,.09),transparent 55%); }
        .intro-inner { max-width:1440px; margin:0 auto; display:grid; grid-template-columns:3fr 2fr; gap:6rem; align-items:end; padding-bottom:5rem; position:relative; z-index:1; }

        .intro-tag { font-size:.7rem; letter-spacing:.34em; text-transform:uppercase; color:var(--bright); display:inline-flex; align-items:center; gap:.7rem; margin-bottom:2.4rem; opacity:0; animation:rise .6s .1s ease forwards; }
        .intro-tag::before { content:''; width:22px; height:1px; background:var(--bright); }
        .intro-h { font-family:var(--ff-d); font-size:clamp(2rem,3.2vw,3.75rem); font-weight:400; line-height:1.18; color:var(--white); opacity:0; animation:rise .8s .22s ease forwards; }
        .intro-h em { font-style:italic; color:var(--bright); }
        .intro-sub { margin-top:2.4rem; font-size:1rem; line-height:1.8; color:rgba(255,255,255,.48); max-width:480px; opacity:0; animation:rise .8s .38s ease forwards; font-weight:300; }
        .intro-sub em { color:rgba(255,255,255,.65); font-style:normal; }

        .intro-stats { display:flex; flex-direction:column; gap:0; border-left:1px solid rgba(255,255,255,.1); opacity:0; animation:rise .8s .3s ease forwards; }
        .istat { padding:2rem 2.2rem; border-bottom:1px solid rgba(255,255,255,.07); transition:background .3s; }
        .istat:last-child { border-bottom:none; }
        .istat:hover { background:rgba(42,127,160,.1); }
        .istat-n { font-family:var(--ff-d); font-size:clamp(1.75rem,2.6vw,2.6rem); font-weight:300; color:var(--white); line-height:1; }
        .istat-n sup { font-size:.7rem; color:var(--bright); vertical-align:super; }
        .istat-l { font-size:.65rem; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.3); margin-top:.5rem; }

        .intro-bar { max-width:1440px; margin:0 auto; border-top:1px solid rgba(255,255,255,.08); padding:1.4rem 0; display:flex; align-items:center; justify-content:space-between; position:relative; z-index:1; }
        .intro-bar-note { font-size:.72rem; letter-spacing:.07em; color:rgba(255,255,255,.22); font-weight:300; }
        .intro-bar-dot  { width:6px; height:6px; border-radius:50%; background:var(--bright); box-shadow:0 0 10px rgba(59,163,203,.5); flex-shrink:0; }

        /* STATEMENT */
        .statement-sec { background:var(--ghost); padding:7rem 3rem; border-bottom:1px solid var(--border); }
        .statement-inner { max-width:1440px; margin:0 auto; display:grid; grid-template-columns:1fr 2.2fr; gap:6rem; align-items:start; }
        .stmt-label { font-size:.68rem; letter-spacing:.3em; text-transform:uppercase; color:var(--main); padding-top:.4rem; display:flex; align-items:center; gap:.6rem; }
        .stmt-label::before { content:''; width:18px; height:1px; background:var(--main); }
        .stmt-text { font-family:var(--ff-d); font-size:clamp(1.2rem,1.6vw,1.75rem); font-weight:400; line-height:1.6; color:var(--deep); }
        .stmt-text em { font-style:italic; color:var(--main); }
        .stmt-ref { margin-top:2.2rem; padding-top:1.6rem; border-top:1px solid var(--border); font-size:.9rem; line-height:1.8; color:var(--slate); font-weight:300; }

        /* CTA */
        .cta-sec { background:var(--white); padding:9rem 3rem; text-align:center; position:relative; overflow:hidden; }
        .cta-sec::before { content:''; position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 50% 70% at 50% 50%,rgba(42,127,160,.04),transparent 60%); }
        .cta-h { font-family:var(--ff-d); font-size:clamp(1.75rem,2.8vw,3.5rem); font-weight:300; color:var(--deep); margin-bottom:2.6rem; letter-spacing:-.01em; }
        .cta-btn { display:inline-flex; align-items:center; gap:.8rem; padding:1rem 3rem; background:var(--deep); color:var(--white); font-family:var(--ff); font-size:.8rem; letter-spacing:.18em; text-transform:uppercase; text-decoration:none; transition:background .22s,transform .18s; }
        .cta-btn:hover { background:var(--main); transform:translateY(-2px); }

        /* FOOTER */
        footer { background:var(--deep); }
        .ft { max-width:1440px; margin:0 auto; padding:2.6rem 3rem; display:flex; align-items:center; justify-content:space-between; border-top:1px solid rgba(255,255,255,.06); flex-wrap:wrap; gap:1.6rem; }
        .ft-logo { display:flex; align-items:center; gap:.8rem; text-decoration:none; }
        .ft-name { font-size:.95rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--white); }
        .ft-links { display:flex; gap:2rem; list-style:none; flex-wrap:wrap; }
        .ft-links a { font-size:.72rem; letter-spacing:.09em; text-transform:uppercase; color:rgba(255,255,255,.26); text-decoration:none; transition:color .2s; }
        .ft-links a:hover { color:var(--bright); }
        .ft-copy { font-size:.72rem; letter-spacing:.04em; color:rgba(255,255,255,.16); }

        @media(max-width:1000px){
          .intro-inner { grid-template-columns:1fr; gap:4rem; }
          .intro-stats { flex-direction:row; flex-wrap:wrap; border-left:none; border-top:1px solid rgba(255,255,255,.1); }
          .istat { flex:1; min-width:160px; border-bottom:none; border-right:1px solid rgba(255,255,255,.07); }
          .statement-inner { grid-template-columns:1fr; }
        }
        @media(max-width:768px){
          .intro { padding-top:calc(var(--nav-h) + 3.5rem); }
          .ft { flex-direction:column; text-align:center; }
          .ft-links { justify-content:center; }
        }
        @media(max-width:600px){
          .intro { padding-left:1.5rem; padding-right:1.5rem; }
          .statement-sec { padding:4rem 1.5rem; }
          .cta-sec { padding:5rem 1.5rem; }
          .ft { padding:2rem 1.5rem; }
        }
      `}</style>

      <Cursor />

      {/* ── NAV ── */}
      <nav id="co-nav" className={scrolled ? "scrolled" : ""}>
        <div className="nav-in">
          <Link href="/" className="nav-logo">
            <LogoMark size={32} />
            <span className="nav-name">Musedata</span>
          </Link>

          <ul className="nav-links">
            <li><Link href="/companies" className="on">Companies</Link></li>
            <li><Link href="/people">People</Link></li>
            <li><Link href="/strategic-resource-group">Strategic Resource Group</Link></li>
            <li><a href="#about">About</a></li>

            <li><Link href="/jobs">Jobs</Link></li>
          </ul>

          <Link href="mailto:partners@musedata.ai" className="nav-cta">Connect</Link>
          <div className="ham" onClick={() => setMobOpen(o => !o)}>
            <span /><span /><span />
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mob-menu${mobOpen ? " open" : ""}`}>
        {[
          ["/companies","Companies","on"],
          ["/people","People"],
          ["/strategic-resource-group","Strategic Resource Group"],
          ["#about","About"],
      
          ["/jobs","Jobs"],
        ].map(([href, label, cls]) => (
          <Link key={href} href={href} className={cls || ""} onClick={() => setMobOpen(false)}>
            {label}
          </Link>
        ))}
      </div>

      {/* ── INTRO ── */}
      <section className="intro">
        <div className="intro-inner">

          <div>
            <div className="intro-tag">Portfolio</div>
            <h1 className="intro-h">
              Building <em>institutional-grade</em> finance infrastructure for the companies transforming enterprise software.
            </h1>
            <p className="intro-sub">
              We partner with VC-backed enterprise software and AI companies at the{" "}
              <em>$3–25M ARR</em> inflection point — when institutional infrastructure changes everything.
            </p>
          </div>

          <div className="intro-stats">
            {STATS.map(({ n, sup, l }) => (
              <div key={l} className="istat">
                <div className="istat-n">{n}<sup>{sup}</sup></div>
                <div className="istat-l">{l}</div>
              </div>
            ))}
          </div>

        </div>

        <div className="intro-bar">
          <span className="intro-bar-note">
            Portfolio companies backed by Y Combinator and other top-tier early-stage platforms
          </span>
          <span className="intro-bar-dot" />
        </div>
      </section>

      {/* ── STATEMENT ── */}
      <section className="statement-sec">
        <div className="statement-inner">
          <div className="stmt-label">Our Focus</div>
          <div>
            <p className="stmt-text">
              We partner with <em>VC-backed enterprise software and enterprise AI companies</em> at the moment institutional infrastructure changes everything — the <em>$3–25M ARR stage</em> — writing <em>$5–25M minority checks</em> and building the boardroom-ready finance operations that carry companies from <em>$5M to $100M ARR</em>.
            </p>
            <p className="stmt-ref">
              Portfolio companies backed by leading venture platforms including Y Combinator and other top-tier early-stage investors.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-sec">
        <h2 className="cta-h">We'd love to hear from you.</h2>
        <Link href="mailto:partners@musedata.ai" className="cta-btn">Connect →</Link>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="ft">
          <Link href="/" className="ft-logo">
            <LogoMark size={28} />
            <span className="ft-name">Musedata</span>
          </Link>
          <ul className="ft-links">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Disclosures</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
          <p className="ft-copy">© 2026 Musedata Growth Equity. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}