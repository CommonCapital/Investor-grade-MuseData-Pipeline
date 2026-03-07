"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Types ─── */
interface Person {
  init: string;
  name: string;
  title: string;
  logos: string[];
  tags: string[];
  bio: string;
}

/* ─── People data ─── */
const PEOPLE: Record<string, Person> = {
  lead1: {
    init: "CA", name: "Collin Assam", title: "Co-Founder & Managing Partner",
    logos: ["arrowrootcapital.com","rothcapital.com","db.com"], tags: [],
    bio: "Founder of Musedata Growth Equity. Brings experience across Arrowroot Capital Management, ROTH Capital Partners, and Deutsche Bank, with a focus on private equity, investment banking, and strategic capital advisory. Leads Musedata's overall investment strategy and portfolio company engagement.",
  },
  lead2: {
    init: "NK", name: "Nico Knutzen", title: "COO and Partner",
    logos: ["mckinsey.com","deloitte.com","alvarezandmarsal.com"], tags: [],
    bio: "Held strategic roles at McKinsey & Company, Deloitte and Alvarez & Marsal. Drives business technology transformation, digital operations, and operational excellence across the Musedata portfolio. Oversees day-to-day operations and portfolio infrastructure delivery.",
  },
  lead10: {
    init: "AL", name: "Alex Lee", title: "Legal Strategy Advisor",
    logos: [], tags: ["WashU Law","cg/"],
    bio: "Legal Strategy Advisor at Musedata Growth Equity. Brings deep legal expertise and strategic counsel to the Musedata team and portfolio companies.",
  },
  lead6: {
    init: "SS", name: "Stavan Shah", title: "Strategic Growth Advisor",
    logos: ["mckinsey.com","deloitte.com"], tags: ["Kellogg"],
    bio: "Experience in VC-level investing and early-stage technology, with consulting roles at McKinsey & Company and Deloitte. Currently completing an MBA at Northwestern's Kellogg School of Management. Advises portfolio companies on growth strategy, GTM execution, and venture positioning.",
  },
  lead7: {
    init: "NA", name: "Noor Ul Ain", title: "Investment Analyst",
    logos: [], tags: ["Oxford Brookes"],
    bio: "Investment Analyst at Musedata Growth Equity. Oxford Brookes University alumna bringing analytical rigor and investment research capabilities to the Musedata team.",
  },
  lead8: {
    init: "NO", name: "Nursan Omarov", title: "Lead Developer",
    logos: [], tags: ["HRAI"],
    bio: "Brings deep technical expertise in AI-driven HR systems and enterprise software development to the Musedata team, advising portfolio companies on technology architecture and AI product strategy.",
  },
  lead9: {
    init: "AB", name: "Arjun Bhattarai", title: "Private Equity Intern",
    logos: [], tags: ["Harvard"],
    bio: "Private Equity Intern at Musedata Growth Equity. Brings academic rigor and analytical depth from Harvard University to support the team across deal evaluation, portfolio research, and financial analysis.",
  },
};

const PEOPLE_ORDER = ["lead1","lead2","lead10","lead6","lead7","lead8","lead9"];

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

/* ─── Person card with scroll-reveal ─── */
function PersonCard({ id, person, index, onOpen }: { id: string; person: Person; index: number; onOpen: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = `opacity .5s ${index * 0.07}s ease, transform .5s ${index * 0.07}s ease`;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        io.disconnect();
      }
    }, { threshold: 0.06 });
    io.observe(el);
    return () => io.disconnect();
  }, [index]);

  return (
    <div ref={ref} className="lead-card" onClick={() => onOpen(id)}>
      <div className="lead-avatar">
        <span className="lead-avatar-init">{person.init}</span>
      </div>
      <div className="lead-info">
        <div className="lead-name">{person.name}</div>
        <div className="lead-title">{person.title}</div>
        <div className="lead-logos">
          {person.logos.map(domain => (
            <img
              key={domain}
              src={`https://logo.clearbit.com/${domain}`}
              alt={domain}
              style={{ height: 24, width: "auto", objectFit: "contain", filter: "grayscale(1) opacity(.5)" }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          ))}
          {person.tags.map(tag => (
            <span key={tag} className="logo-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Modal ─── */
function Modal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const person = id ? PEOPLE[id] : null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = id ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [id]);

  return (
    <div className={`modal-overlay${id ? " open" : ""}`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        {person && (
          <>
            <div className="modal-init">{person.init}</div>
            <div className="modal-name">{person.name}</div>
            <div className="modal-title">{person.title}</div>
            {(person.logos.length > 0 || person.tags.length > 0) && (
              <div style={{ display: "flex", gap: ".7rem", flexWrap: "wrap", marginTop: "1rem" }}>
                {person.logos.map(domain => (
                  <img
                    key={domain}
                    src={`https://logo.clearbit.com/${domain}`}
                    alt={domain}
                    style={{ height: 28, width: "auto", objectFit: "contain", filter: "grayscale(.2) opacity(.7)" }}
                    onError={e => { (e.currentTarget as HTMLImageElement).remove(); }}
                  />
                ))}
                {person.tags.map(tag => (
                  <span key={tag} className="logo-tag">{tag}</span>
                ))}
              </div>
            )}
            <div className="modal-bio">{person.bio}</div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function PeoplePage() {
  const [mobOpen,  setMobOpen]  = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalId,  setModalId]  = useState<string | null>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-size: 16px; }
        :root {
          --deep:   #0A2F42; --mid: #1B5E7B; --slate: #4A6B7C;
          --bright: #3BA3CB; --main: #2A7FA0;
          --white:  #fff; --ghost: #F2F8FB; --wash: #E3F1F8;
          --border: rgba(42,127,160,.13); --nav-h: 68px;
          --ff: 'Montserrat', sans-serif;
          --ff-d: 'Cormorant Garamond', Georgia, serif;
        }
        body { font-family: var(--ff); background: var(--white); color: var(--deep); cursor: none; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        @media(max-width:768px){ body { cursor: auto; } #cur, #cur-r { display: none; } }

        /* CURSOR */
        #cur   { position:fixed; z-index:9999; width:7px; height:7px; border-radius:50%; background:var(--bright); pointer-events:none; transform:translate(-50%,-50%); }
        #cur-r { position:fixed; z-index:9998; width:36px; height:36px; border-radius:50%; border:1.5px solid rgba(42,127,160,.28); pointer-events:none; transform:translate(-50%,-50%); transition:width .3s,height .3s; }
        body:has(a:hover) #cur-r, body:has(button:hover) #cur-r, body:has(.lead-card:hover) #cur-r { width:52px; height:52px; }

        /* NAV */
        #pp-nav { position:fixed; inset:0 0 auto; z-index:500; height:var(--nav-h); background:rgba(255,255,255,.97); backdrop-filter:blur(18px); border-bottom:1px solid var(--border); display:flex; align-items:center; transition:box-shadow .3s; }
        #pp-nav.scrolled { box-shadow:0 4px 24px rgba(10,47,66,.08); }
        .nav-in   { width:100%; max-width:1440px; margin:0 auto; padding:0 3rem; display:flex; align-items:center; justify-content:space-between; }
        .nav-logo { display:flex; align-items:center; gap:.75rem; text-decoration:none; }
        .nav-name { font-size:.8rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--deep); line-height:1; }
        .nav-links { display:flex; list-style:none; align-items:center; }
        .nav-links a { display:flex; align-items:center; padding:0 .85rem; height:var(--nav-h); font-size:.78rem; font-weight:500; letter-spacing:.07em; text-transform:uppercase; color:var(--slate); text-decoration:none; border-bottom:2px solid transparent; transition:color .2s,border-color .2s; white-space:nowrap; }
        .nav-links a:hover, .nav-links a.on { color:var(--deep); border-bottom-color:var(--bright); }
        .nav-cta { display:inline-flex; align-items:center; height:36px; padding:0 1.4rem; border:1.5px solid var(--deep); color:var(--deep); font-size:.78rem; font-weight:500; letter-spacing:.1em; text-transform:uppercase; text-decoration:none; transition:background .2s,color .2s; white-space:nowrap; font-family:var(--ff); }
        .nav-cta:hover { background:var(--deep); color:var(--white); }
        .ham { display:none; flex-direction:column; gap:5px; cursor:pointer; margin-left:16px; }
        .ham span { width:22px; height:1.5px; background:var(--deep); display:block; }
        @media(max-width:1100px){ .nav-links a { padding:0 .6rem; font-size:.7rem; } }
        @media(max-width:860px)  { .nav-links { display:none; } .ham { display:flex; } }

        .mob-menu { display:none; position:fixed; top:var(--nav-h); left:0; right:0; z-index:499; background:rgba(255,255,255,.98); backdrop-filter:blur(18px); border-bottom:1px solid var(--border); padding:24px; flex-direction:column; }
        .mob-menu.open { display:flex; }
        .mob-menu a { font-size:.85rem; letter-spacing:.1em; text-transform:uppercase; color:var(--slate); text-decoration:none; padding:14px 0; border-bottom:1px solid var(--border); transition:color .2s; }
        .mob-menu a:hover, .mob-menu a.on { color:var(--deep); }

        /* PAGE HEADER */
        @keyframes rise { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .page-header { background:var(--deep); padding:calc(var(--nav-h) + 5rem) 3rem 5rem; position:relative; overflow:hidden; }
        .page-header::after { content:''; position:absolute; inset:0; pointer-events:none; background: radial-gradient(ellipse 60% 50% at 90% 10%,rgba(59,163,203,.12),transparent 55%), radial-gradient(ellipse 40% 60% at 5% 90%,rgba(42,127,160,.08),transparent 55%); }
        .ph-inner { max-width:1440px; margin:0 auto; position:relative; z-index:1; }
        .ph-tag { font-size:.78rem; font-weight:500; letter-spacing:.26em; text-transform:uppercase; color:var(--bright); display:inline-flex; align-items:center; gap:.7rem; margin-bottom:1.8rem; opacity:0; animation:rise .6s .1s ease forwards; }
        .ph-tag::before { content:''; width:22px; height:1px; background:var(--bright); }
        .ph-h   { font-family:var(--ff-d); font-size:clamp(2.4rem,4vw,5rem); font-weight:300; color:var(--white); line-height:1.1; letter-spacing:-.02em; opacity:0; animation:rise .8s .2s ease forwards; }
        .ph-sub { margin-top:1.4rem; font-size:1.05rem; font-weight:300; line-height:1.7; color:rgba(255,255,255,.5); max-width:560px; opacity:0; animation:rise .8s .35s ease forwards; }

        /* SECTION */
        .section { max-width:1440px; margin:0 auto; padding:5rem 3rem; }
        .section-label { font-size:.82rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:var(--main); margin-bottom:3rem; display:flex; align-items:center; gap:.75rem; padding-bottom:1.4rem; border-bottom:1px solid var(--border); }
        .section-label::before { content:''; width:18px; height:1px; background:var(--main); }

        /* LEAD GRID */
        .lead-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border); border:1px solid var(--border); }
        .lead-card { background:var(--white); padding:2.4rem; display:flex; gap:1.6rem; align-items:flex-start; cursor:none; transition:background .3s; position:relative; overflow:hidden; }
        .lead-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--main),var(--bright)); transform:scaleX(0); transform-origin:left; transition:transform .5s cubic-bezier(.25,1,.5,1); }
        .lead-card:hover { background:var(--ghost); }
        .lead-card:hover::before { transform:scaleX(1); }
        .lead-avatar { width:56px; height:56px; flex-shrink:0; border-radius:50%; border:2px solid var(--border); background:var(--wash); display:flex; align-items:center; justify-content:center; }
        .lead-avatar-init { font-size:1.05rem; font-weight:500; color:var(--main); }
        .lead-info { display:flex; flex-direction:column; min-width:0; }
        .lead-name  { font-size:1.05rem; font-weight:600; color:var(--deep); line-height:1.4; }
        .lead-title { font-size:.78rem; font-weight:400; letter-spacing:.04em; text-transform:uppercase; color:var(--main); margin-top:.3rem; line-height:1.5; }
        .lead-logos { display:flex; align-items:center; gap:.75rem; margin-top:1rem; flex-wrap:wrap; }
        .lead-card:hover .lead-logos img { filter:grayscale(.3) opacity(.85) !important; }
        .logo-tag { font-size:.78rem; font-weight:400; letter-spacing:.03em; text-transform:uppercase; color:var(--slate); background:var(--wash); border:1px solid var(--border); padding:.22rem .6rem; border-radius:3px; line-height:1.5; }

        /* filler cells */
        .lead-filler { background:var(--white); }

        /* BAND */
        .band { background:var(--deep); padding:5rem 3rem; text-align:center; }
        .band-inner { max-width:900px; margin:0 auto; }
        .band-q { font-family:var(--ff-d); font-size:clamp(1.05rem,1.7vw,1.4rem); font-weight:400; color:var(--white); line-height:1.75; letter-spacing:-.01em; }
        .band-q em { font-style:italic; color:var(--bright); }

        /* CTA */
        .cta-sec { background:var(--white); padding:8rem 3rem; text-align:center; border-top:1px solid var(--border); position:relative; overflow:hidden; }
        .cta-sec::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 50% 70% at 50% 50%,rgba(42,127,160,.04),transparent 60%); pointer-events:none; }
        .cta-h   { font-family:var(--ff-d); font-size:clamp(1.8rem,3vw,3.5rem); font-weight:300; color:var(--deep); margin-bottom:2.4rem; letter-spacing:-.01em; }
        .cta-btn { display:inline-flex; align-items:center; gap:.8rem; height:48px; padding:0 2.4rem; background:var(--deep); color:var(--white); font-family:var(--ff); font-size:.82rem; font-weight:500; letter-spacing:.16em; text-transform:uppercase; text-decoration:none; transition:background .22s,transform .18s; }
        .cta-btn:hover { background:var(--main); transform:translateY(-2px); }

        /* FOOTER */
        footer { background:var(--deep); }
        .ft { max-width:1440px; margin:0 auto; padding:2.4rem 3rem; display:flex; align-items:center; justify-content:space-between; border-top:1px solid rgba(255,255,255,.06); flex-wrap:wrap; gap:1.4rem; }
        .ft-logo { display:flex; align-items:center; gap:.75rem; text-decoration:none; }
        .ft-name { font-size:.8rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--white); line-height:1; }
        .ft-links { display:flex; gap:2rem; list-style:none; flex-wrap:wrap; }
        .ft-links a { font-size:.78rem; letter-spacing:.07em; text-transform:uppercase; color:rgba(255,255,255,.3); text-decoration:none; transition:color .2s; }
        .ft-links a:hover { color:var(--bright); }
        .ft-copy { font-size:.75rem; color:rgba(255,255,255,.2); }

        /* MODAL */
        .modal-overlay { position:fixed; inset:0; background:rgba(10,47,66,.7); backdrop-filter:blur(8px); z-index:800; display:flex; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:opacity .3s; }
        .modal-overlay.open { opacity:1; pointer-events:all; }
        .modal { background:var(--white); max-width:640px; width:90%; max-height:80vh; overflow-y:auto; padding:3rem; position:relative; transform:translateY(20px); transition:transform .3s; }
        .modal-overlay.open .modal { transform:translateY(0); }
        .modal-close { position:absolute; top:1.4rem; right:1.4rem; width:32px; height:32px; border:1px solid var(--border); background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:.9rem; color:var(--slate); transition:background .2s; }
        .modal-close:hover { background:var(--ghost); }
        .modal-init  { width:60px; height:60px; border-radius:50%; background:var(--wash); border:2px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:400; color:var(--main); margin-bottom:1.4rem; }
        .modal-name  { font-size:1.45rem; font-weight:600; color:var(--deep); line-height:1.2; }
        .modal-title { font-size:.82rem; font-weight:400; letter-spacing:.09em; text-transform:uppercase; color:var(--main); margin-top:.4rem; }
        .modal-bio   { font-size:1.05rem; font-weight:300; line-height:1.72; color:var(--slate); margin-top:1.6rem; padding-top:1.6rem; border-top:1px solid var(--border); }

        @media(max-width:1100px){ .lead-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:768px)  { .ft { flex-direction:column; text-align:center; } .ft-links { flex-wrap:wrap; justify-content:center; } }
        @media(max-width:500px)  { .lead-card { flex-direction:column; gap:1.2rem; } .section { padding:3rem 1.5rem; } .lead-grid { grid-template-columns:1fr; } }
      `}</style>

      <Cursor />

      {/* ── NAV ── */}
      <nav id="pp-nav" className={scrolled ? "scrolled" : ""}>
        <div className="nav-in">
          <Link href="/" className="nav-logo">
            <LogoMark size={32} />
            <span className="nav-name">Musedata</span>
          </Link>
          <ul className="nav-links">
            <li><Link href="/companies">Companies</Link></li>
            <li><Link href="/people" className="on">People</Link></li>
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
          ["/companies","Companies"],
          ["/people","People","on"],
          ["/strategic-resource-group","Strategic Resource Group"],
          ["#about","About"],
          
          ["/jobs","Jobs"],
        ].map(([href, label, cls]) => (
          <Link key={href} href={href} className={cls || ""} onClick={() => setMobOpen(false)}>{label}</Link>
        ))}
      </div>

      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div className="ph-inner">
          <div className="ph-tag">Our People</div>
          <h1 className="ph-h">The team behind<br />the infrastructure.</h1>
          <p className="ph-sub">Capital markets veterans, AI founders, data engineers, and investment analysts. Built to grow enterprise value from within.</p>
        </div>
      </div>

      {/* ── LEAD GRID ── */}
      <div style={{ background: "var(--white)" }}>
        <div className="section">
          <div className="section-label">Executive Leadership</div>
          <div className="lead-grid">
            {PEOPLE_ORDER.map((id, i) => (
              <PersonCard key={id} id={id} person={PEOPLE[id]} index={i} onOpen={setModalId} />
            ))}
            {/* filler cells to complete the last row */}
            {Array.from({ length: (3 - (PEOPLE_ORDER.length % 3)) % 3 }).map((_, i) => (
              <div key={`filler-${i}`} className="lead-filler" />
            ))}
          </div>
        </div>
      </div>

      {/* ── BAND ── */}
      <div className="band">
        <div className="band-inner">
          <p className="band-q">
            We don't just write checks. We embed <em>seasoned operators</em> inside every portfolio company to build the infrastructure that earns institutional trust.
          </p>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="cta-sec">
        <h2 className="cta-h">We'd love to hear from you.</h2>
        <a href="mailto:partners@musedata.ai" className="cta-btn">Connect →</a>
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

      {/* ── MODAL ── */}
      <Modal id={modalId} onClose={() => setModalId(null)} />
    </>
  );
}