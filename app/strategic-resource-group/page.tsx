"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Types ─── */
interface Card {
  n: string;
  tag: string;
  title: string;
  desc: string;
  list: string[];
}

/* ─── Data ─── */
const CARDS: Card[] = [
  {
    n: "01", tag: "Strategy", title: "Go-to-Market + Operator Coaching",
    desc: "We work directly with your CEO and executive team on the hardest questions in growth — how to position, how to scale, and when to push harder.",
    list: ["Revenue architecture & GTM design","Pricing strategy & packaging","Sales motion engineering","Executive coaching & OKR frameworks"],
  },
  {
    n: "02", tag: "People", title: "Talent + Recruiting",
    desc: "The right people change everything. We support hiring decisions at every level with a rigorous approach to fit, structure, and compensation.",
    list: ["C-suite & VP-level executive search","Compensation & equity benchmarking","Culture design & onboarding systems","Organizational design & team structuring"],
  },
  {
    n: "03", tag: "Growth", title: "Business Development",
    desc: "We connect your executives to strategic partners and enterprise customers who can change the trajectory of your business.",
    list: ["Strategic partnership facilitation","Enterprise customer introductions","Channel & reseller development","Market entry & expansion planning"],
  },
  {
    n: "04", tag: "Brand", title: "Marketing + Communications",
    desc: "From first product launch to category positioning, we work on the story and the signal — narratives that resonate, brands that endure.",
    list: ["Brand strategy & narrative systems","PR, media relations, thought leadership","Product launch & go-live support","Communications & repositioning"],
  },
  {
    n: "05", tag: "Operations", title: "Finance + Analytics",
    desc: "From diligence-grade evidence sprints and board-layer KPI governance to CFO advisory and M&A support, we deliver the full financial stack from $5M to $100M ARR.",
    list: ["Evidence sprints & diligence support","Board-layer KPI governance & cadence","CFO advisory & fundraising preparation","M&A advisory, deal structuring & integration","Financial operations & strategic planning"],
  },
  {
    n: "06", tag: "Intelligence", title: "Data Intelligence",
    desc: "Data is Musedata's core competency. We help teams instrument products, build pipelines, and surface the signals that drive sustainable advantage.",
    list: ["Data architecture & infrastructure","Product analytics & instrumentation","Competitive & market intelligence","AI/ML strategy & implementation"],
  },
];

const TICKER_ITEMS = [
  "Go-to-Market Strategy","Talent & Recruiting","Business Development",
  "Marketing & Communications","Finance & Analytics","Data Intelligence",
  "Operator Coaching","Boardroom Intelligence",
];

const NET_CARDS = [
  { title: "Operator Advisors",   desc: "Former founders and operators with deep experience building and scaling companies, available for targeted strategic counsel at the moments that matter most.",    lnk: "Meet the advisors" },
  { title: "Domain Specialists",  desc: "Deep functional experts across legal, finance, engineering, product, and marketing who provide targeted counsel exactly when your companies need it most.",     lnk: "Explore specialisms" },
  { title: "Growth Partners",     desc: "Revenue-focused partners who open doors to enterprise customers, distribution channels, and strategic alliances that accelerate commercial momentum.",           lnk: "See growth resources" },
];

/* ─── Logo mark ─── */
function LogoMark({ size = 36 }: { size?: number }) {
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

/* ─── Reveal wrapper ─── */
function Rv({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("on"); io.disconnect(); }
    }, { threshold: 0.06 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`rv ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── Counter ─── */
function Counter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        io.disconnect();
        let t0: number | null = null;
        const step = (ts: number) => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / 1400, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.floor(ease * target));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return <span ref={ref}>{val}</span>;
}

/* ─── Page ─── */
export default function SRGPage() {
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Montserrat:wght@200;300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; overflow-x: hidden; }

        :root {
          --bd:   #0A2F42;
          --bm:   #1B5E7B;
          --sl:   #4A6B7C;
          --br:   #3BA3CB;
          --mn:   #2A7FA0;
          --bpl:  rgba(42,127,160,.12);
          --bln:  rgba(42,127,160,.22);
          --wh:   #FFFFFF;
          --gh:   #F0F9FC;
          --wa:   #E4F4FA;
          --dim:  rgba(30,52,67,.52);
          --bo:   rgba(42,127,160,.12);
          --nh:   80px;
          --ff:   'Montserrat', sans-serif;
          --ffd:  'Cormorant Garamond', Georgia, serif;
        }

        body { background: var(--wh); color: var(--bd); font-family: var(--ff); font-weight: 300; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        /* REVEAL */
        .rv { opacity:0; transform:translateY(32px); transition:opacity 1s cubic-bezier(.16,1,.3,1), transform 1s cubic-bezier(.16,1,.3,1); }
        .rv.on { opacity:1; transform:translateY(0); }

        /* NAV */
        #srg-nav { position:fixed; top:0; left:0; right:0; z-index:500; height:var(--nh); background:rgba(255,255,255,.96); backdrop-filter:blur(24px) saturate(1.6); border-bottom:1px solid var(--bo); display:flex; align-items:center; transition:box-shadow .3s; }
        #srg-nav.scrolled { box-shadow:0 4px 24px rgba(10,47,66,.08); }
        .nav-in { width:100%; max-width:1600px; margin:0 auto; padding:0 4rem; display:flex; align-items:center; justify-content:space-between; }
        .nav-logo { display:flex; align-items:center; gap:1rem; text-decoration:none; }
        .nav-logo-t { font-family:var(--ffd); font-size:1.35rem; font-weight:500; letter-spacing:.12em; text-transform:uppercase; color:var(--bd); }
        .nav-links { display:flex; list-style:none; }
        .nav-links a { display:block; padding:0 1.1rem; height:var(--nh); line-height:var(--nh); font-size:.75rem; letter-spacing:.18em; text-transform:uppercase; font-weight:400; color:var(--sl); text-decoration:none; border-bottom:2px solid transparent; transition:color .2s,border-color .2s; white-space:nowrap; }
        .nav-links a:hover, .nav-links a.on { color:var(--bd); border-bottom-color:var(--br); }
        .nav-cta { padding:.55rem 1.8rem; border:1px solid var(--bd); color:var(--bd); font-size:.72rem; letter-spacing:.18em; text-transform:uppercase; text-decoration:none; background:transparent; transition:background .25s,color .25s; font-family:var(--ff); }
        .nav-cta:hover { background:var(--bd); color:var(--wh); }
        .ham { display:none; flex-direction:column; gap:5px; cursor:pointer; margin-left:16px; }
        .ham span { width:22px; height:1.5px; background:var(--bd); display:block; }
        @media(max-width:1100px){ .nav-links a { padding:0 .7rem; font-size:.68rem; } }
        @media(max-width:860px)  { .nav-links { display:none; } .ham { display:flex; } }

        .mob-menu { display:none; position:fixed; top:var(--nh); left:0; right:0; z-index:499; background:rgba(255,255,255,.98); backdrop-filter:blur(18px); border-bottom:1px solid var(--bo); padding:24px; flex-direction:column; }
        .mob-menu.open { display:flex; }
        .mob-menu a { font-size:.85rem; letter-spacing:.1em; text-transform:uppercase; color:var(--sl); text-decoration:none; padding:14px 0; border-bottom:1px solid var(--bo); transition:color .2s; }
        .mob-menu a:hover, .mob-menu a.on { color:var(--bd); }

        /* HERO */
        @keyframes fu { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wr { to{opacity:1;transform:translateY(0)} }

        .hero { min-height:100vh; padding-top:var(--nh); display:grid; grid-template-rows:1fr auto; position:relative; overflow:hidden; background:var(--wh); }
        .hero-bg-word { position:absolute; right:-2vw; bottom:-4vh; font-family:var(--ffd); font-size:clamp(20rem,32vw,50rem); font-weight:600; line-height:1; color:rgba(10,47,66,.025); pointer-events:none; user-select:none; letter-spacing:-.04em; z-index:0; }
        .hero-body { position:relative; z-index:2; max-width:1600px; margin:0 auto; width:100%; padding:8vh 4rem 0; display:grid; grid-template-columns:1fr 400px; gap:5rem; align-items:end; }
        .hero-eyebrow { display:inline-flex; align-items:center; gap:1rem; font-size:.75rem; letter-spacing:.3em; text-transform:uppercase; color:var(--mn); margin-bottom:4rem; opacity:0; animation:fu .8s .1s ease forwards; }
        .hero-eyebrow::before { content:''; width:32px; height:1px; background:var(--mn); opacity:.7; }
        .hero-h1 { font-family:var(--ffd); font-size:clamp(5rem,9.5vw,13rem); font-weight:300; line-height:.85; letter-spacing:-.03em; color:var(--bd); }
        .hero-h1 .ln { display:block; overflow:hidden; }
        .hero-h1 .wd { display:inline-block; opacity:0; transform:translateY(115%); animation:wr 1.1s cubic-bezier(.16,1,.3,1) forwards; }
        .w1{animation-delay:.2s}.w2{animation-delay:.3s}
        .w3{animation-delay:.4s;font-style:italic;color:var(--br);}
        .w4{animation-delay:.5s}.w5{animation-delay:.6s}
        .hero-right { opacity:0; animation:fu 1s .7s ease forwards; border-left:1px solid var(--bo); padding-left:3rem; padding-bottom:1rem; display:flex; flex-direction:column; justify-content:flex-end; gap:2.5rem; }
        .hr-label { font-size:.72rem; letter-spacing:.24em; text-transform:uppercase; color:var(--sl); }
        .hr-stat  { font-family:var(--ffd); font-size:3.6rem; font-weight:300; line-height:.88; color:var(--bd); }
        .hr-stat sup { color:var(--br); font-size:1.2rem; }
        .hr-desc  { font-size:1rem; line-height:1.85; color:var(--dim); border-top:1px solid var(--bo); padding-top:1.8rem; }
        .hero-foot { position:relative; z-index:2; max-width:1600px; margin:0 auto; width:100%; display:grid; grid-template-columns:repeat(2,1fr) auto; border-top:1px solid var(--bo); margin-top:6vh; opacity:0; animation:fu 1s .9s ease forwards; }
        .hf-cell { padding:2.4rem 4rem; border-right:1px solid var(--bo); }
        .hf-cell:last-child { border-right:none; display:flex; align-items:center; padding:2rem 4rem; }
        .hf-label { font-size:.7rem; letter-spacing:.24em; text-transform:uppercase; color:var(--sl); margin-bottom:.5rem; }
        .hf-val   { font-family:var(--ffd); font-size:2.2rem; font-weight:300; line-height:1; color:var(--bd); }
        .hf-val sup { color:var(--mn); font-size:1rem; }
        .hf-cta   { display:inline-flex; align-items:center; gap:.9rem; padding:1rem 2.4rem; background:var(--mn); color:var(--wh); font-size:.75rem; letter-spacing:.18em; text-transform:uppercase; text-decoration:none; transition:background .3s; white-space:nowrap; font-family:var(--ff); }
        .hf-cta:hover { background:var(--bd); }
        .hf-arr   { transition:transform .3s; }
        .hf-cta:hover .hf-arr { transform:translateX(5px); }

        /* TICKER */
        .ticker { background:var(--bd); overflow:hidden; padding:.9rem 0; position:relative; z-index:2; }
        .ticker-track { display:flex; animation:ticker 40s linear infinite; width:max-content; }
        .ticker-item { display:flex; align-items:center; gap:2.5rem; padding:0 3rem; font-size:.7rem; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.3); white-space:nowrap; }
        .ticker-sep { color:var(--br); opacity:.7; }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        /* INTRO */
        .intro { background:var(--wh); border-top:1px solid var(--bo); border-bottom:1px solid var(--bo); }
        .intro-in { max-width:1600px; margin:0 auto; padding:10rem 4rem 9rem; display:grid; grid-template-columns:1fr 1fr; gap:14rem; align-items:start; }
        .sec-label { display:inline-flex; align-items:center; gap:.9rem; font-size:.72rem; letter-spacing:.28em; text-transform:uppercase; color:var(--br); margin-bottom:2rem; }
        .sec-label::before { content:''; width:24px; height:1px; background:var(--br); }
        .intro-h { font-family:var(--ffd); font-size:clamp(2.8rem,4vw,5.2rem); font-weight:300; line-height:1.06; letter-spacing:-.02em; color:var(--bd); }
        .intro-h em { font-style:italic; color:var(--mn); }
        .intro-right { padding-top:6rem; }
        .intro-body { font-size:1.05rem; line-height:1.95; color:var(--dim); }
        .intro-body p+p { margin-top:1.4rem; }

        /* CARDS */
        .cards-grid { max-width:1600px; margin:0 auto; padding:0 4rem 10rem; display:grid; grid-template-columns:repeat(3,1fr); gap:2rem; }
        .card { background:var(--wh); padding:4.5rem; position:relative; overflow:hidden; transition:background .5s; }
        .card:hover { background:var(--gh); }
        .card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--br),transparent); transform:scaleX(0); transform-origin:left; transition:transform .6s cubic-bezier(.25,1,.5,1); }
        .card:hover::before { transform:scaleX(1); }
        .card-ghost { position:absolute; bottom:2rem; right:3.5rem; font-family:var(--ffd); font-size:9rem; font-weight:300; line-height:1; color:rgba(10,47,66,.03); pointer-events:none; user-select:none; transition:color .4s,transform .5s; letter-spacing:-.05em; }
        .card:hover .card-ghost { color:rgba(42,127,160,.08); transform:scale(1.06); }
        .card-tag { font-size:.7rem; letter-spacing:.24em; text-transform:uppercase; color:var(--br); margin-bottom:1.2rem; display:flex; align-items:center; gap:.7rem; }
        .card-tag::before { content:''; width:14px; height:1px; background:var(--br); opacity:.7; }
        .card-title { font-family:var(--ffd); font-size:clamp(1.6rem,2vw,2.2rem); font-weight:400; line-height:1.12; color:var(--bd); margin-bottom:1.4rem; transition:color .3s; }
        .card:hover .card-title { color:var(--bm); }
        .card-desc { font-size:.95rem; line-height:1.85; color:var(--dim); margin-bottom:2.5rem; }
        .card-list { list-style:none; display:flex; flex-direction:column; gap:.55rem; margin-bottom:3rem; }
        .card-list li { display:flex; align-items:flex-start; gap:.8rem; font-size:.875rem; color:transparent; transition:color .45s; }
        .card:hover .card-list li { color:var(--sl); }
        .card-list li::before { content:''; display:block; width:12px; height:1px; background:var(--br); opacity:.5; margin-top:.58rem; flex-shrink:0; }
        .card-lnk { display:inline-flex; align-items:center; gap:.6rem; font-size:.72rem; letter-spacing:.2em; text-transform:uppercase; color:var(--br); text-decoration:none; position:relative; padding-bottom:2px; }
        .card-lnk::after { content:''; position:absolute; bottom:0; left:0; width:0; height:1px; background:var(--br); transition:width .4s cubic-bezier(.25,1,.5,1); }
        .card:hover .card-lnk::after { width:100%; }
        .card-arr { transition:transform .35s; }
        .card:hover .card-arr { transform:translateX(5px); }

        /* STATEMENT */
        .stmt { background:var(--bd); position:relative; overflow:hidden; }
        .stmt-in { max-width:1600px; margin:0 auto; padding:10rem 4rem; display:grid; grid-template-columns:3fr 2fr; gap:10rem; align-items:center; position:relative; z-index:1; }
        .stmt-mark { display:block; font-family:var(--ffd); font-size:14rem; line-height:.3; color:rgba(59,163,203,.12); margin-bottom:1rem; pointer-events:none; user-select:none; }
        .stmt-q { font-family:var(--ffd); font-size:clamp(1.9rem,3vw,3.6rem); font-weight:300; line-height:1.25; color:var(--wh); }
        .stmt-q em { font-style:italic; color:var(--br); }
        .stmt-attr { margin-top:3rem; font-size:.72rem; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.3); display:flex; align-items:center; gap:1rem; }
        .stmt-attr::before { content:''; width:24px; height:1px; background:var(--br); opacity:.5; }
        .stmt-stats { display:grid; grid-template-columns:1fr 1fr; gap:2rem; }
        .ss { background:rgba(255,255,255,.02); padding:3rem; transition:background .3s; }
        .ss:hover { background:rgba(42,127,160,.1); }
        .ss-n { font-family:var(--ffd); font-size:3.2rem; font-weight:300; line-height:1; color:var(--wh); }
        .ss-n sup { color:var(--br); font-size:1rem; }
        .ss-l { font-size:.7rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.3); margin-top:.7rem; }

        /* NETWORK */
        .net { background:var(--wh); }
        .net-in { max-width:1600px; margin:0 auto; padding:10rem 4rem; }
        .net-head { display:grid; grid-template-columns:5fr 4fr; gap:12rem; align-items:end; padding-bottom:6rem; border-bottom:1px solid var(--bo); margin-bottom:6rem; }
        .net-eyebrow { font-size:.72rem; letter-spacing:.28em; text-transform:uppercase; color:var(--br); margin-bottom:1.8rem; display:flex; align-items:center; gap:.9rem; }
        .net-eyebrow::before { content:''; width:24px; height:1px; background:var(--br); }
        .net-title { font-family:var(--ffd); font-size:clamp(2.5rem,4.5vw,5.5rem); font-weight:300; line-height:1.05; color:var(--bd); }
        .net-title em { font-style:italic; color:var(--mn); }
        .net-body { font-size:1rem; line-height:1.9; color:var(--dim); margin-bottom:3rem; }
        .net-btns { display:flex; gap:1.2rem; flex-wrap:wrap; }
        .btn-dark { display:inline-flex; align-items:center; gap:.8rem; padding:1.1rem 2.6rem; background:var(--mn); color:var(--wh); font-size:.75rem; letter-spacing:.18em; text-transform:uppercase; text-decoration:none; transition:background .3s; font-family:var(--ff); }
        .btn-dark:hover { background:var(--bd); }
        .btn-line { display:inline-flex; align-items:center; gap:.8rem; padding:1.1rem 2.6rem; border:1px solid var(--bln); color:var(--sl); font-size:.75rem; letter-spacing:.18em; text-transform:uppercase; text-decoration:none; transition:border-color .3s,color .3s; font-family:var(--ff); }
        .btn-line:hover { border-color:var(--br); color:var(--br); }
        .net-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:2rem; }
        .nc { background:var(--wh); padding:3.8rem; position:relative; overflow:hidden; transition:background .4s; }
        .nc:hover { background:var(--gh); }
        .nc::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:var(--br); transform:scaleX(0); transform-origin:left; transition:transform .5s cubic-bezier(.25,1,.5,1); }
        .nc:hover::after { transform:scaleX(1); }
        .nc-title { font-family:var(--ffd); font-size:1.7rem; font-weight:400; line-height:1.2; color:var(--bd); margin-bottom:1.2rem; }
        .nc-desc  { font-size:.95rem; line-height:1.85; color:var(--dim); margin-bottom:2rem; }
        .nc-lnk   { font-size:.72rem; letter-spacing:.18em; text-transform:uppercase; color:var(--br); text-decoration:none; }
        .nc-lnk:hover { opacity:.7; }

        /* FOOTER */
        footer { background:var(--bd); border-top:1px solid rgba(255,255,255,.06); }
        .ft-in { max-width:1600px; margin:0 auto; padding:3rem 4rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.6rem; }
        .ft-logo { display:flex; align-items:center; gap:1rem; text-decoration:none; }
        .ft-logo-t { font-family:var(--ffd); font-size:1.1rem; font-weight:400; letter-spacing:.14em; text-transform:uppercase; color:var(--wh); }
        .ft-links { display:flex; gap:2.5rem; list-style:none; flex-wrap:wrap; }
        .ft-links a { font-size:.7rem; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.3); text-decoration:none; transition:color .2s; }
        .ft-links a:hover { color:var(--br); }
        .ft-copy { font-size:.7rem; letter-spacing:.06em; color:rgba(255,255,255,.2); }

        /* RESPONSIVE */
        @media(max-width:1100px){
          .hero-body { grid-template-columns:1fr; gap:4rem; }
          .hero-right { border-left:none; padding-left:0; border-top:1px solid var(--bo); padding-top:2rem; }
          .hero-foot { grid-template-columns:1fr 1fr; }
          .intro-in { grid-template-columns:1fr; gap:3rem; }
          .intro-right { padding-top:0; }
          .cards-grid { grid-template-columns:1fr 1fr; }
          .stmt-in { grid-template-columns:1fr; gap:5rem; }
          .net-head { grid-template-columns:1fr; gap:3rem; }
          .net-cards { grid-template-columns:1fr 1fr; }
        }
        @media(max-width:768px){
          .hero-foot { grid-template-columns:1fr; }
          .hf-cell { border-right:none; border-bottom:1px solid var(--bo); }
          .cards-grid { grid-template-columns:1fr; padding:0 1.5rem 5rem; }
          .net-cards { grid-template-columns:1fr; }
          .ft-in { flex-direction:column; text-align:center; }
          .ft-links { justify-content:center; }
          .intro-in { padding:5rem 1.5rem; }
          .net-in { padding:5rem 1.5rem; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav id="srg-nav" className={scrolled ? "scrolled" : ""}>
        <div className="nav-in">
          <Link href="/" className="nav-logo">
            <LogoMark size={36} />
            <span className="nav-logo-t">Musedata</span>
          </Link>
          <ul className="nav-links">
            <li><Link href="/companies">Companies</Link></li>
            <li><Link href="/people">People</Link></li>
            <li><Link href="/strategic-resource-group" className="on">Strategic Resource Group</Link></li>
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
          ["/companies","Companies"],
          ["/people","People"],
          ["/strategic-resource-group","Strategic Resource Group","on"],
          ["#about","About"],
  
          ["/jobs","Jobs"],
        ].map(([href, label, cls]) => (
          <Link key={href} href={href} className={cls || ""} onClick={() => setMobOpen(false)}>{label}</Link>
        ))}
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-word" aria-hidden="true">SRG</div>

        <div className="hero-body">
          <div>
            <div className="hero-eyebrow">Strategic Resource Group</div>
            <h1 className="hero-h1">
              <span className="ln"><span className="wd w1">We</span>&nbsp;<span className="wd w2">build</span></span>
              <span className="ln"><span className="wd w3">alongside</span></span>
              <span className="ln"><span className="wd w4">you,</span>&nbsp;<span className="wd w5">always.</span></span>
            </h1>
          </div>

          <div className="hero-right">
            <div>
              <div className="hr-label">Check Size</div>
              <div className="hr-stat">$5<sup>–25M</sup></div>
            </div>
            <div>
              <div className="hr-label">Target ARR</div>
              <div className="hr-stat">$5<sup>–100M</sup></div>
            </div>
            <div className="hr-desc">Minority checks alongside aligned capital into VC-backed enterprise software and enterprise AI. A full strategic resource layer from day one.</div>
          </div>
        </div>

        <div className="hero-foot">
          <div className="hf-cell">
            <div className="hf-label">Disciplines</div>
            <div className="hf-val">6</div>
          </div>
          <div className="hf-cell">
            <div className="hf-label">Stage Focus</div>
            <div className="hf-val" style={{ fontSize: "1.3rem", letterSpacing: ".03em", fontFamily: "var(--ff)", fontWeight: 300 }}>
              Enterprise Software + AI
            </div>
          </div>
          <div className="hf-cell">
            <a href="#disciplines" className="hf-cta">Explore Group <span className="hf-arr">→</span></a>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="ticker-item">
              <span>{item}</span><span className="ticker-sep">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── INTRO ── */}
      <section className="intro" id="disciplines">
        <Rv>
          <div className="intro-in">
            <div>
              <div className="sec-label">Strategic Resource Group</div>
              <h2 className="intro-h">Six pillars of <em>exceptional</em><br />portfolio support</h2>
            </div>
            <div className="intro-right">
              <div className="intro-body">
                <p>Our strategic resource group doesn't advise from a distance. We embed directly into your growth story, working across every critical function alongside your team.</p>
                <p>Each discipline is led by operators and domain experts with deep functional experience, built to move at the speed your business demands.</p>
              </div>
            </div>
          </div>
        </Rv>
      </section>

      {/* ── CARDS ── */}
      <section>
        <div className="cards-grid">
          {CARDS.map((c, i) => (
            <Rv key={c.n} delay={[0,.08,.16,.24,.32,.4][i] || 0}>
              <div className="card">
                <div className="card-ghost" aria-hidden="true">{c.n}</div>
                <div className="card-tag">{c.tag}</div>
                <h3 className="card-title">{c.title}</h3>
                <p className="card-desc">{c.desc}</p>
                <ul className="card-list">
                  {c.list.map(item => <li key={item}>{item}</li>)}
                </ul>
                <a href="#" className="card-lnk">Learn more <span className="card-arr">→</span></a>
              </div>
            </Rv>
          ))}
        </div>
      </section>

      {/* ── STATEMENT ── */}
      <Rv>
        <div className="stmt">
          <div className="stmt-in">
            <div>
              <span className="stmt-mark" aria-hidden="true">"</span>
              <p className="stmt-q">We don't just back companies. We <em>build alongside them</em>, embedded in the work from the very first check.</p>
              <p className="stmt-attr">Musedata Growth Equity</p>
            </div>
            <div className="stmt-stats">
              <div className="ss">
                <div className="ss-n"><Counter target={6} /></div>
                <div className="ss-l">Disciplines</div>
              </div>
              <div className="ss">
                <div className="ss-n">$5<sup>–25M</sup></div>
                <div className="ss-l">Check Size</div>
              </div>
              <div className="ss">
                <div className="ss-n">$5<sup>–100M</sup></div>
                <div className="ss-l">Target ARR</div>
              </div>
              <div className="ss">
                <div className="ss-n" style={{ fontSize: "1.5rem", lineHeight: 1.3 }}>Enterprise<br />Software + AI</div>
                <div className="ss-l">Stage Focus</div>
              </div>
            </div>
          </div>
        </div>
      </Rv>

      {/* ── NETWORK ── */}
      <section className="net">
        <div className="net-in">
          <Rv className="net-head">
            <div>
              <div className="net-eyebrow">Catalyst Network</div>
              <h2 className="net-title">The Musedata<br /><em>Catalyst Network</em></h2>
            </div>
            <div>
              <p className="net-body">Alongside our core disciplines, Musedata is building an extended advisory network of senior operators, domain experts, and functional specialists — ready to be deployed into portfolio companies as the need arises.</p>
              <div className="net-btns">
                <Link href="/founders" className="btn-dark">Join the Network</Link>
                <Link href="mailto:partners@musedata.ai"  className="btn-line">Speak to Our Team</Link>
              </div>
            </div>
          </Rv>

          <Rv className="net-cards">
            {NET_CARDS.map((nc, i) => (
              <div key={nc.title} className="nc" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="nc-title">{nc.title}</div>
                <p className="nc-desc">{nc.desc}</p>
                <a href="#" className="nc-lnk">{nc.lnk} →</a>
              </div>
            ))}
          </Rv>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="ft-in">
          <Link href="/" className="ft-logo">
            <LogoMark size={32} />
            <span className="ft-logo-t">Musedata</span>
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