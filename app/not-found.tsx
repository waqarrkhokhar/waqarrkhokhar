"use client";

import { useEffect, useRef } from "react";

const CSS = `
:root{
    --navy:#0F1D35;
    --navy-deep:#0a1426;
    --gold:#C9A84C;
    --gold-soft:#dcc079;
    --cream:#F7F4EE;
    --charcoal:#2C2C2C;
    --spot-x:50%;
    --spot-y:42%;
    --spot-r:260px;
  }
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html,body{height:100%;}
  body{
    font-family:var(--font-jost),'Jost',sans-serif;
    background:var(--navy-deep);
    color:var(--cream);
    overflow:hidden;
    -webkit-font-smoothing:antialiased;
  }
  .stage{
    position:fixed;
    inset:0;
    overflow:hidden;
    background:
      radial-gradient(ellipse 120% 80% at 50% -10%, #16294a 0%, var(--navy) 45%, var(--navy-deep) 100%);
    cursor:none;
  }
  .floor{
    position:absolute;
    left:0;right:0;
    bottom:0;
    height:34%;
    background:linear-gradient(to bottom, rgba(255,255,255,0.015), rgba(0,0,0,0.25));
    border-top:1px solid rgba(201,168,76,0.07);
  }
  .ghost-404{
    position:absolute;
    top:50%;left:50%;
    transform:translate(-50%,-50%);
    font-family:var(--font-jost),'Jost',sans-serif;
    font-weight:600;
    font-size:clamp(190px,44vw,420px);
    line-height:0.82;
    letter-spacing:-0.02em;
    color:transparent;
    -webkit-text-stroke:1.5px rgba(201,168,76,0.30);
    text-stroke:1.5px rgba(201,168,76,0.30);
    user-select:none;
    z-index:2;
    transition:transform 0.18s ease-out;
    white-space:nowrap;
  }
  .chair{
    position:absolute;
    top:50%;left:50%;
    width:clamp(120px,20vw,205px);
    transform:translate(-50%,-48%);
    transition:transform 0.25s ease-out;
    pointer-events:none;
  }
  .chair svg{width:100%;height:auto;display:block;overflow:visible;}
  .chair path,.chair line,.chair ellipse{
    stroke:var(--gold);
    stroke-width:2.2;
    fill:none;
    stroke-linecap:round;
    stroke-linejoin:round;
    vector-effect:non-scaling-stroke;
  }
  .chair .seat-fill{fill:rgba(201,168,76,0.06);stroke:none;}
  .eyebrow{
    font-size:13px;
    letter-spacing:5px;
    text-transform:uppercase;
    color:var(--gold);
    margin-bottom:16px;
    animation:rise 0.9s 0.05s both;
  }
  .headline{
    font-family:var(--font-jost),'Jost',sans-serif;
    font-weight:600;
    font-size:clamp(28px,5.2vw,46px);
    color:var(--cream);
    line-height:1.12;
    max-width:18ch;
    margin:0 auto 14px;
    animation:rise 0.9s 0.12s both;
  }
  .sub{
    font-size:clamp(14px,2vw,16px);
    color:rgba(247,244,238,0.62);
    line-height:1.6;
    max-width:46ch;
    margin:0 auto 30px;
    font-weight:300;
    animation:rise 0.9s 0.19s both;
  }
  .actions{
    display:flex;
    flex-wrap:wrap;
    gap:12px;
    justify-content:center;
    animation:rise 0.9s 0.26s both;
  }
  .btn{
    font-family:var(--font-jost),'Jost',sans-serif;
    font-size:14px;
    font-weight:500;
    letter-spacing:0.4px;
    padding:13px 26px;
    border-radius:2px;
    text-decoration:none;
    cursor:pointer;
    border:1px solid transparent;
    transition:transform 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    display:inline-flex;
    align-items:center;
    gap:9px;
  }
  .btn-gold{background:var(--gold);color:var(--navy);}
  .btn-gold:hover{background:var(--gold-soft);transform:translateY(-2px);}
  .btn-ghost{background:transparent;color:var(--cream);border-color:rgba(247,244,238,0.25);}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold);transform:translateY(-2px);}
  .btn-wa{background:#25D366;color:#fff;}
  .btn-wa:hover{filter:brightness(1.06);transform:translateY(-2px);}
  .btn svg{width:17px;height:17px;}
  .quick{
    margin-top:34px;
    animation:rise 0.9s 0.33s both;
  }
  .quick-label{
    font-size:11px;letter-spacing:2.5px;text-transform:uppercase;
    color:rgba(247,244,238,0.4);margin-bottom:12px;
  }
  .chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;}
  .chip{
    font-size:13px;color:rgba(247,244,238,0.8);text-decoration:none;
    padding:7px 15px;border:1px solid rgba(201,168,76,0.25);border-radius:30px;
    transition:all 0.2s ease;
  }
  .chip:hover{background:rgba(201,168,76,0.12);border-color:var(--gold);color:var(--gold);}
  .content{
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    z-index:8;
    width:calc(100% - 48px);
    max-width:560px;
    text-align:center;
  }
  .card{
    pointer-events:auto;
    width:100%;
    padding:40px 40px 36px;
    border-radius:6px;
    background:linear-gradient(180deg, rgba(24,40,68,0.96), rgba(15,26,46,0.96));
    border:1px solid rgba(201,168,76,0.35);
    box-shadow:0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,168,76,0.06), inset 0 1px 0 rgba(255,255,255,0.06);
  }
  .spotlight{
    position:fixed;
    inset:0;
    z-index:5;
    pointer-events:none;
    background:radial-gradient(
      circle var(--spot-r) at var(--spot-x) var(--spot-y),
      rgba(10,20,38,0) 0%,
      rgba(10,20,38,0.18) 38%,
      rgba(10,20,38,0.72) 66%,
      rgba(8,16,30,0.93) 100%
    );
    transition:background 0.05s linear;
  }
  .lampglow{
    position:fixed;
    inset:0;
    z-index:6;
    pointer-events:none;
    background:radial-gradient(
      circle calc(var(--spot-r) * 0.72) at var(--spot-x) var(--spot-y),
      rgba(201,168,76,0.10) 0%,
      rgba(201,168,76,0.03) 45%,
      rgba(201,168,76,0) 72%
    );
    mix-blend-mode:screen;
  }
  .lamp{
    position:fixed;
    z-index:7;
    width:14px;height:14px;
    border-radius:50%;
    background:radial-gradient(circle, #fff6e0 0%, var(--gold) 60%, rgba(201,168,76,0) 100%);
    box-shadow:0 0 22px 6px rgba(201,168,76,0.45);
    transform:translate(-50%,-50%);
    pointer-events:none;
    transition:opacity 0.3s ease;
  }
  .brand{
    position:fixed;
    top:26px;left:0;right:0;
    text-align:center;
    z-index:8;
    pointer-events:none;
  }
  .brand .word{
    font-family:var(--font-jost),'Jost',sans-serif;
    font-weight:600;
    font-size:22px;
    letter-spacing:4px;
    text-transform:uppercase;
    color:var(--gold);
  }
  .brand .tag{
    display:block;
    font-family:var(--font-jost),'Jost',sans-serif;
    font-size:9.5px;
    letter-spacing:3px;
    text-transform:uppercase;
    color:rgba(247,244,238,0.32);
    margin-top:3px;
  }
  .hint{
    position:fixed;
    bottom:24px;left:0;right:0;
    text-align:center;
    z-index:8;
    pointer-events:none;
    font-size:12px;
    letter-spacing:1px;
    color:rgba(247,244,238,0.4);
    transition:opacity 0.6s ease;
    display:flex;align-items:center;justify-content:center;gap:8px;
  }
  .hint svg{width:15px;height:15px;opacity:0.6;}
  .hint.gone{opacity:0;}
  .dust{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden;}
  .mote{
    position:absolute;
    width:3px;height:3px;border-radius:50%;
    background:rgba(201,168,76,0.5);
    animation:float linear infinite;
  }
  @keyframes rise{
    from{transform:translateY(16px);}
    to{transform:translateY(0);}
  }
  @keyframes float{
    0%{transform:translateY(20px);opacity:0;}
    10%{opacity:0.6;}
    90%{opacity:0.4;}
    100%{transform:translateY(-110vh);opacity:0;}
  }
  @media (max-height:760px){
    .hint{display:none;}
  }
  @media (max-width:600px){
    .stage{cursor:auto;}
    .lamp{display:none;}
    :root{--spot-r:200px;}
    .ghost-404{-webkit-text-stroke-width:1.2px;}
    .actions{flex-direction:column;width:100%;max-width:300px;}
    .btn{justify-content:center;width:100%;}
  }
  @media (prefers-reduced-motion:reduce){
    .mote{display:none;}
    .eyebrow,.headline,.sub,.actions,.quick{animation:none;opacity:1;}
  }
`;

const BODY = `
<div class="stage" id="stage">
    <div class="floor"></div>
    <div class="dust" id="dust"></div>

    <!-- giant 404 watermark, revealed by the lamp -->
    <div class="ghost-404" id="ghost">
      4<span style="position:relative;display:inline-block;">0<span class="chair" id="chair">
        <svg viewBox="0 0 100 110" aria-hidden="true">
          <!-- wingback chair line art -->
          <path class="seat-fill" d="M24 54 q-9 0 -9 -16 q0 -22 8 -28 q4 -3 22 -3 q18 0 22 3 q8 6 8 28 q0 16 -9 16 z"></path>
          <path d="M22 56 q-9 -1 -9 -17 q0 -23 9 -29 q5 -4 19 -4 q14 0 19 4 q9 6 9 29 q0 16 -9 17"></path>
          <path d="M24 50 q-4 -2 -4 -13 q0 -16 6 -22"></path>
          <path d="M58 50 q4 -2 4 -13 q0 -16 -6 -22"></path>
          <path d="M22 56 q19 7 38 0 l1 11 q-20 7 -40 0 z"></path>
          <path d="M21 67 q20 7 40 0"></path>
          <path d="M20 52 q-6 1 -6 8 l0 7 q0 3 4 3 q4 0 4 -3 l0 -10"></path>
          <path d="M62 52 q6 1 6 8 l0 7 q0 3 -4 3 q-4 0 -4 -3 l0 -10"></path>
          <line x1="22" y1="78" x2="20" y2="92"></line>
          <line x1="60" y1="78" x2="62" y2="92"></line>
          <line x1="30" y1="80" x2="29" y2="90"></line>
          <line x1="52" y1="80" x2="53" y2="90"></line>
        </svg>
      </span></span>4
    </div>
  </div>

  <div class="spotlight" id="spotlight"></div>
  <div class="lampglow" id="lampglow"></div>

  <!-- always-lit, actionable content -->
  <div class="content">
    <div class="card">
      <div class="eyebrow">Error 404</div>
      <h1 class="headline">You've wandered into an empty room</h1>
      <p class="sub">The page you're looking for has been moved, sold, or never existed. Let us help you find your way back.</p>

      <div class="actions">
        <a class="btn btn-gold" href="/">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><path d="M9 22V12h6v10"></path></svg>
          Back to Home
        </a>
        <a class="btn btn-ghost" href="/sofas/">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"></path><path d="M3 13a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5h-2v-2H5v2H3z"></path><line x1="6" y1="18" x2="6" y2="20"></line><line x1="18" y1="18" x2="18" y2="20"></line></svg>
          Browse Sofas
        </a>
        <a class="btn btn-wa" href="https://wa.me/923394100052?text=Hi%2C%20I%20landed%20on%20a%20missing%20page%20and%20need%20help%20finding%20a%20product." target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.553 4.185 1.607 6.013L.057 23.64a.75.75 0 0 0 .916.917l5.627-1.55A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.822-.537-5.445-1.543l-.39-.232-3.337.92.92-3.337-.232-.39A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path></svg>
          WhatsApp Us
        </a>
      </div>

      <div class="quick">
        <div class="quick-label">Popular Collections</div>
        <div class="chips">
          <a class="chip" href="/sofas/sofa-chair/">Sofa Chairs</a>
          <a class="chip" href="/seater-sofas/2-seater-sofas/">2 Seater Sofas</a>
          <a class="chip" href="/sofas/sofa-come-bed/">Sofa Cum Beds</a>
          <a class="chip" href="/sofas/l-shape-sofas/">L-Shape Sofas</a>
        </div>
      </div>
    </div>
  </div>

  <div class="lamp" id="lamp"></div>

  <div class="brand">
    <span class="word">ComfyClub</span>
    <span class="tag">Furniture Worth Keeping</span>
  </div>

  <div class="hint" id="hint">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 11.5a2.5 2.5 0 1 1 5 0c0 1.5-2.5 2-2.5 4"></path><circle cx="12" cy="12" r="10"></circle></svg>
    <span id="hint-text">Move your light to find your way</span>
  </div>
`;

export default function NotFound() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prevBg = document.body.style.background;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let raf = 0;
    const cleanups: Array<() => void> = [];
    const root = document.documentElement;
    const $ = (id: string) => document.getElementById(id);
    const stage = $("stage"), lamp = $("lamp"), hint = $("hint"), ghost = $("ghost"), chair = $("chair"), dust = $("dust");
    if (!stage || !ghost || !chair) return;

    let w = window.innerWidth, h = window.innerHeight;
    let tx = w * 0.5, ty = h * 0.42, cx = tx, cy = ty;
    let hasInteracted = false, idleT = 0;
    const isTouch = window.matchMedia("(max-width:600px)").matches;

    const onResize = () => { w = window.innerWidth; h = window.innerHeight; };
    window.addEventListener("resize", onResize);
    cleanups.push(() => window.removeEventListener("resize", onResize));

    const setTarget = (x: number, y: number) => {
      tx = x; ty = y;
      if (!hasInteracted) { hasInteracted = true; hint?.classList.add("gone"); }
    };
    const onMove = (e: MouseEvent) => setTarget(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => { if (e.touches?.[0]) setTarget(e.touches[0].clientX, e.touches[0].clientY); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    cleanups.push(() => window.removeEventListener("mousemove", onMove));
    cleanups.push(() => window.removeEventListener("touchmove", onTouch));
    cleanups.push(() => window.removeEventListener("touchstart", onTouch));

    const tick = () => {
      if (!hasInteracted) {
        idleT += 0.012;
        tx = w * 0.5 + Math.sin(idleT) * w * 0.22;
        ty = h * 0.42 + Math.sin(idleT * 2) * h * 0.12;
      }
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      root.style.setProperty("--spot-x", cx + "px");
      root.style.setProperty("--spot-y", cy + "px");
      if (lamp) { lamp.style.left = cx + "px"; lamp.style.top = cy + "px"; }
      const dx = (cx - w / 2) / w, dy = (cy - h / 2) / h;
      ghost.style.transform = "translate(" + dx * 14 + "px," + dy * 10 + "px)";
      chair.style.transform = "translate(-50%,-48%) translate(" + dx * -18 + "px," + dy * -10 + "px) rotate(" + dx * 4 + "deg)";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onLeave = () => { if (lamp) lamp.style.opacity = "0"; };
    const onEnter = () => { if (lamp) lamp.style.opacity = "1"; };
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    cleanups.push(() => document.removeEventListener("mouseleave", onLeave));
    cleanups.push(() => document.removeEventListener("mouseenter", onEnter));

    if (isTouch) { const ht = $("hint-text"); if (ht) ht.textContent = "Drag your finger to light the room"; }

    if (dust) {
      const count = isTouch ? 10 : 22;
      for (let i = 0; i < count; i++) {
        const m = document.createElement("div");
        m.className = "mote";
        m.style.left = Math.random() * 100 + "%";
        m.style.bottom = "-10px";
        const dur = 9 + Math.random() * 12;
        m.style.animationDuration = dur + "s";
        m.style.animationDelay = -Math.random() * dur + "s";
        const sz = 1.5 + Math.random() * 2.5;
        m.style.width = sz + "px"; m.style.height = sz + "px";
        m.style.opacity = String(0.3 + Math.random() * 0.4);
        dust.appendChild(m);
      }
    }

    const hintTimer = window.setTimeout(() => { if (!hasInteracted) hint?.classList.add("gone"); }, 8000);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hintTimer);
      cleanups.forEach((fn) => fn());
      document.body.style.background = prevBg;
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div className="cc404-root" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dangerouslySetInnerHTML={{ __html: BODY }} />
    </div>
  );
}
