"use client";

import { useState, useEffect, useRef } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

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

/* ─── Logo mark (grid SVG matching landing page) ─── */
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

export default function FoundersCollective() {
  const [mobOpen,  setMobOpen]  = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [consent,  setConsent]  = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  function handleApply() {
   redirect('/funding')
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@200;300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        :root {
          --deep:   #0A2F42;
          --mid:    #1B5E7B;
          --slate:  #4A6B7C;
          --bright: #3BA3CB;
          --main:   #2A7FA0;
          --white:  #fff;
          --ghost:  #F2F8FB;
          --wash:   #E3F1F8;
          --border: rgba(42,127,160,.13);
          --nav-h:  68px;
          --ff:     'Montserrat', sans-serif;
          --ff-d:   'Cormorant Garamond', Georgia, serif;
        }

        body { font-family: var(--ff); background: var(--white); color: var(--deep); cursor: none; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        @media(max-width:768px){ body { cursor: auto; } #cur, #cur-r { display: none; } }

        /* CURSOR */
        #cur   { position:fixed; z-index:9999; width:7px; height:7px; border-radius:50%; background:var(--bright); pointer-events:none; transform:translate(-50%,-50%); }
        #cur-r { position:fixed; z-index:9998; width:36px; height:36px; border-radius:50%; border:1.5px solid rgba(42,127,160,.28); pointer-events:none; transform:translate(-50%,-50%); transition:width .3s,height .3s; }
        body:has(a:hover) #cur-r, body:has(button:hover) #cur-r { width:52px; height:52px; }

        /* NAV */
        #fc-nav { position:fixed; inset:0 0 auto; z-index:500; height:var(--nav-h); background:rgba(255,255,255,.97); backdrop-filter:blur(18px); border-bottom:1px solid var(--border); display:flex; align-items:center; transition:box-shadow .3s; }
        #fc-nav.scrolled { box-shadow: 0 4px 24px rgba(10,47,66,.08); }
        .nav-in { width:100%; max-width:1440px; margin:0 auto; padding:0 3rem; display:flex; align-items:center; justify-content:space-between; }
        .nav-logo { display:flex; align-items:center; gap:.8rem; text-decoration:none; }
        .nav-name  { font-size:1.05rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--deep); }
        .nav-links { display:flex; list-style:none; }
        .nav-links a { display:block; padding:0 .9rem; height:var(--nav-h); line-height:var(--nav-h); font-size:.8rem; letter-spacing:.12em; text-transform:uppercase; color:var(--slate); text-decoration:none; border-bottom:2px solid transparent; transition:color .2s, border-color .2s; white-space:nowrap; }
        .nav-links a:hover, .nav-links a.on { color:var(--deep); border-bottom-color:var(--bright); }
        .nav-cta { padding:.48rem 1.5rem; border:1.5px solid var(--deep); color:var(--deep); font-size:.8rem; letter-spacing:.13em; text-transform:uppercase; text-decoration:none; transition:background .2s,color .2s; font-family:var(--ff); }
        .nav-cta:hover { background:var(--deep); color:var(--white); }
        .ham { display:none; flex-direction:column; gap:5px; cursor:pointer; margin-left:16px; }
        .ham span { width:22px; height:1.5px; background:var(--deep); display:block; }
        @media(max-width:1100px){ .nav-links a { padding:0 .6rem; font-size:.72rem; } }
        @media(max-width:860px)  { .nav-links { display:none; } .ham { display:flex; } }

        .mob-menu { display:none; position:fixed; top:var(--nav-h); left:0; right:0; z-index:499; background:rgba(255,255,255,.98); backdrop-filter:blur(18px); border-bottom:1px solid var(--border); padding:24px; flex-direction:column; }
        .mob-menu.open { display:flex; }
        .mob-menu a { font-size:.85rem; font-weight:400; letter-spacing:.1em; text-transform:uppercase; color:var(--slate); text-decoration:none; padding:14px 0; border-bottom:1px solid var(--border); }
        .mob-menu a:hover, .mob-menu a.on { color:var(--deep); }

        /* PAGE HEADER */
        .page-header { background:var(--deep); padding:calc(var(--nav-h) + 5rem) 3rem 5rem; position:relative; overflow:hidden; }
        .page-header::after { content:''; position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 60% 50% at 90% 10%,rgba(59,163,203,.12),transparent 55%),radial-gradient(ellipse 40% 60% at 5% 90%,rgba(42,127,160,.08),transparent 55%); }
        .ph-inner { max-width:1440px; margin:0 auto; position:relative; z-index:1; }
        .ph-tag { font-size:.75rem; letter-spacing:.3em; text-transform:uppercase; color:var(--bright); display:inline-flex; align-items:center; gap:.7rem; margin-bottom:1.8rem; opacity:0; animation:rise .6s .1s ease forwards; }
        .ph-tag::before { content:''; width:22px; height:1px; background:var(--bright); }
        .ph-h   { font-family:var(--ff-d); font-size:clamp(2.8rem,4vw,4.8rem); font-weight:300; color:var(--white); line-height:1.08; letter-spacing:-.02em; opacity:0; animation:rise .8s .2s ease forwards; }
        .ph-sub { margin-top:1.4rem; font-size:1.05rem; line-height:1.75; color:rgba(255,255,255,.55); max-width:560px; font-weight:300; opacity:0; animation:rise .8s .35s ease forwards; }
        @keyframes rise { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        /* PAGE BODY */
        .page-body { max-width:1100px; margin:0 auto; padding:5rem 3rem; }
        @media(max-width:768px){ .page-body { padding:3rem 1.5rem; } }

        /* SIDEBAR */
        .sidebar { background:var(--ghost); border:1px solid var(--border); border-left:3px solid var(--bright); padding:2.4rem 3rem; margin-bottom:3.5rem; display:grid; grid-template-columns:1fr 1fr 1fr; gap:2rem; align-items:start; }
        .sb-tag  { font-size:.7rem; letter-spacing:.28em; text-transform:uppercase; color:var(--main); margin-bottom:.6rem; grid-column:span 3; }
        .sb-title { font-size:1.2rem; font-weight:600; color:var(--deep); line-height:1.3; margin-bottom:.7rem; }
        .sb-body  { font-size:.95rem; line-height:1.8; color:var(--slate); }
        .sb-list  { list-style:none; margin-top:.8rem; }
        .sb-list li { font-size:.9rem; color:var(--slate); padding:.4rem 0; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:.7rem; }
        .sb-list li::before { content:''; width:4px; height:4px; border-radius:50%; background:var(--bright); flex-shrink:0; }
        .sb-note  { font-size:.82rem; color:var(--slate); opacity:.65; line-height:1.7; padding:.9rem 1.2rem; background:var(--wash); border-left:2px solid var(--bright); grid-column:span 3; }
        @media(max-width:900px){ .sidebar{grid-template-columns:1fr 1fr;} .sb-tag,.sb-note{grid-column:span 2;} }
        @media(max-width:600px){ .sidebar{grid-template-columns:1fr;padding:1.6rem;} .sb-tag,.sb-note{grid-column:span 1;} }

        /* CTA BLOCK */
        .cta-block { background:var(--deep); position:relative; overflow:hidden; padding:3.6rem 3.2rem; }
        .cta-block::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 70% 80% at 100% 50%,rgba(59,163,203,.13),transparent 60%),radial-gradient(ellipse 40% 60% at 0% 100%,rgba(42,127,160,.1),transparent 55%); pointer-events:none; }
        .cta-inner { position:relative; z-index:1; display:flex; align-items:center; justify-content:space-between; gap:3rem; flex-wrap:wrap; }
        .cta-eyebrow { font-size:.7rem; letter-spacing:.34em; text-transform:uppercase; color:var(--bright); display:inline-flex; align-items:center; gap:.6rem; margin-bottom:1rem; }
        .cta-eyebrow::before { content:''; width:18px; height:1px; background:var(--bright); }
        .cta-headline { font-family:var(--ff-d); font-size:clamp(1.7rem,2.5vw,2.6rem); font-weight:300; color:var(--white); line-height:1.12; letter-spacing:-.01em; margin-bottom:.8rem; }
        .cta-headline strong { font-weight:500; color:var(--bright); font-style:italic; }
        .cta-sub { font-size:.95rem; line-height:1.75; color:rgba(255,255,255,.45); max-width:440px; font-weight:300; }
        .cta-actions { display:flex; flex-direction:column; align-items:flex-end; gap:1rem; flex-shrink:0; }
        .cta-consent { display:flex; align-items:flex-start; gap:.7rem; max-width:320px; }
        .cta-consent input[type=checkbox] { width:14px; height:14px; flex-shrink:0; margin-top:3px; accent-color:var(--bright); cursor:pointer; }
        .cta-consent label { font-size:.76rem; line-height:1.65; color:rgba(255,255,255,.4); text-transform:none; letter-spacing:0; cursor:pointer; }
        .cta-consent label a { color:rgba(59,163,203,.75); text-decoration:none; }
        .cta-consent label a:hover { color:var(--bright); }
        .cta-btn { display:inline-flex; align-items:center; gap:1rem; padding:1.1rem 2.4rem; background:var(--bright); color:var(--deep); border:none; font-family:var(--ff); font-size:.82rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; cursor:pointer; transition:background .22s,transform .18s,box-shadow .22s; white-space:nowrap; }
        .cta-btn:hover { background:var(--white); transform:translateY(-2px); box-shadow:0 12px 36px rgba(59,163,203,.22); }
        .cta-btn .arr { font-size:1rem; display:inline-block; transition:transform .2s; }
        .cta-btn:hover .arr { transform:translateX(4px); }
        .cta-guarantee { font-size:.7rem; letter-spacing:.09em; text-transform:uppercase; color:rgba(255,255,255,.2); text-align:right; }
        @media(max-width:768px){ .cta-inner{flex-direction:column;align-items:flex-start;} .cta-actions{align-items:flex-start;width:100%;} .cta-btn{width:100%;justify-content:center;} .cta-guarantee{text-align:left;} }

        /* SUCCESS */
        .success-wrap { text-align:center; padding:4rem 2rem; max-width:1100px; margin:0 auto; }
        .success-icon  { font-size:2.6rem; color:var(--bright); margin-bottom:1.2rem; }
        .success-title { font-family:var(--ff-d); font-size:1.9rem; font-weight:300; color:var(--deep); margin-bottom:.8rem; }
        .success-sub   { font-size:1.05rem; color:var(--slate); line-height:1.75; font-weight:300; }

        /* FOOTER */
        footer { background:var(--deep); }
        .ft { max-width:1440px; margin:0 auto; padding:2.6rem 3rem; display:flex; align-items:center; justify-content:space-between; border-top:1px solid rgba(255,255,255,.06); flex-wrap:wrap; gap:1.6rem; }
        .ft-logo { display:flex; align-items:center; gap:.8rem; text-decoration:none; }
        .ft-name { font-size:1rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--white); }
        .ft-links { display:flex; gap:2rem; list-style:none; flex-wrap:wrap; }
        .ft-links a { font-size:.75rem; letter-spacing:.09em; text-transform:uppercase; color:rgba(255,255,255,.26); text-decoration:none; transition:color .2s; }
        .ft-links a:hover { color:var(--bright); }
        .ft-copy { font-size:.72rem; letter-spacing:.04em; color:rgba(255,255,255,.16); }
        @media(max-width:768px){ .ft{flex-direction:column;text-align:center;} .ft-links{justify-content:center;} }
      `}</style>

      <Cursor />

      {/* ── NAV ── */}
      <nav id="fc-nav" className={scrolled ? "scrolled" : ""}>
        <div className="nav-in">
          <Link href="/" className="nav-logo">
            <LogoMark size={32} />
            <span className="nav-name">Musedata</span>
          </Link>

          <ul className="nav-links">
            <li><Link href="/companies">Companies</Link></li>
            <li><Link href="/people">People</Link></li>
            <li><Link href="/strategic-resource-group">Strategic Resource Group</Link></li>
            <li><Link href="/founders" className="on">Founders Collective</Link></li>
            <li><a href="#about">About</a></li>
        
            <li><Link href="/apply">Jobs</Link></li>
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
          ["/companies","Companies"],["/people","People"],
          ["/strategic-resource-group","Strategic Resource Group"],
          ["/founders","Founders Collective","on"],
          ["#about","About"],["/apply","Jobs"],
        ].map(([href,label,cls]) => (
          <Link key={href} href={href} className={cls || ""} onClick={() => setMobOpen(false)}>{label}</Link>
        ))}
      </div>

      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div className="ph-inner">
          <div className="ph-tag">Founders Collective</div>
          <h1 className="ph-h">Partner with<br />Musedata.</h1>
          <p className="ph-sub">We back exceptional founders building the next generation of transformative companies. Tell us about your vision.</p>
        </div>
      </div>

      {/* ── PAGE BODY ── */}
      <div className="page-body">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sb-tag">Why Musedata</div>

          <div>
            <div className="sb-title">More than capital.</div>
            <div className="sb-body">Musedata embeds seasoned operators directly inside portfolio companies to build the financial, data, and GTM infrastructure that earns institutional trust.</div>
          </div>

          <div>
            <div className="sb-title">What you get.</div>
            <ul className="sb-list">
              {["CFO & finance infrastructure layer","Private deal flow and co-investment","Vetted peer founder network","Direct advisory from leadership","Exclusive events & off-record briefings"].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="sb-title">Who we back.</div>
            <ul className="sb-list">
              {["Enterprise software founders","Series A to pre-exit stage","Global. Remote-first.","Selective. Application-based."].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="sb-note">
            All information provided is kept strictly confidential and used solely for investment evaluation purposes. Our team will respond within 2 weeks.
          </div>
        </aside>

        {/* FORM / CTA */}
        {!submitted ? (
          <div className="cta-block">
            <div className="cta-inner">
              <div>
                <div className="cta-eyebrow">Founders Collective</div>
                <div className="cta-headline">
                  Ready to build<br />something <strong>extraordinary?</strong>
                </div>
                <p className="cta-sub">
                  Join a curated network of founders who don't just raise capital — they build institutions. Selective by design. Transformative by intent.
                </p>
              </div>

              <div className="cta-actions">
                <div className="cta-consent">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                  />
                  <label htmlFor="consent">
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. All information is kept strictly confidential and used solely for investment evaluation.
                  </label>
                </div>

                {/* Auth-gated apply button */}
                <Unauthenticated>
                  <SignInButton mode="modal" forceRedirectUrl="/founders">
                    <button className="cta-btn">
                      Apply Your Startup <span className="arr">→</span>
                    </button>
                  </SignInButton>
                </Unauthenticated>

                <Authenticated>
                  <button className="cta-btn" onClick={handleApply}>
                    Apply Your Startup <span className="arr">→</span>
                  </button>
                </Authenticated>

                <p className="cta-guarantee">Reviewed within 14 business days &nbsp;•&nbsp; No obligation</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="success-wrap">
            <div className="success-icon">✦</div>
            <div className="success-title">Application Received.</div>
            <div className="success-sub">
              Thank you for applying to the Musedata Founders Collective.<br />
              Our investment team will review your application and reach out within 2 weeks.
            </div>
          </div>
        )}

      </div>{/* /page-body */}

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