/* ==========================================================================
   MNEMOS-87 · the room behind every page
   Fog and dust with a torch that follows the cursor, and binary rain with a
   cat walking through it. Shared by every page (imported in Base.astro).
   ========================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const body = document.body;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand = (a, b) => a + Math.random() * (b - a);
  /* ======================================================================
     ATMOSPHERE: dust motes drifting in the dark, a torch that follows you
     ====================================================================== */
  (function atmosphere() {
    const c = $('#motes'), torch = $('#torch');
    if (!c) return;
    const g = c.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    let W = 0, H = 0, motes = [];
    let lx = innerWidth / 2, ly = innerHeight * 0.4; // torch position
    function size() {
      W = innerWidth; H = innerHeight;
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (W * H) / 16000)); // fewer on small screens
      motes = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: rand(0.4, 1.6), z: rand(0.3, 1),            // z: nearer motes are bigger, brighter and faster
        vx: rand(-0.05, 0.05), vy: rand(-0.12, -0.02),  // dust rises slowly
        ph: Math.random() * Math.PI * 2
      }));
    }
    function draw(t) {
      g.clearRect(0, 0, W, H);
      for (const m of motes) {
        m.ph += 0.004;
        m.x += m.vx * m.z + Math.sin(m.ph) * 0.08 * m.z;
        m.y += m.vy * m.z;
        if (m.y < -4) { m.y = H + 4; m.x = Math.random() * W; }
        if (m.x < -4) m.x = W + 4; else if (m.x > W + 4) m.x = -4;
        // motes catch the light near the torch, and twinkle a little
        const d = Math.hypot(m.x - lx, m.y - ly);
        const lit = Math.max(0, 1 - d / (Math.max(W, H) * 0.32));
        const a = (0.08 + 0.1 * m.z + 0.45 * lit * lit) * (0.75 + 0.25 * Math.sin(m.ph * 3));
        g.beginPath();
        g.arc(m.x, m.y, m.r * (0.6 + m.z), 0, Math.PI * 2);
        g.fillStyle = `rgba(200, 214, 232, ${a.toFixed(3)})`;
        g.fill();
      }
    }
    size();
    addEventListener('resize', size);
    // the torch eases toward the cursor so it feels hand-held
    let tx = lx, ty = ly;
    addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') { tx = e.clientX; ty = e.clientY; } }, { passive: true });
    if (reduced) { draw(0); return; }
    (function loop(t) {
      if (!document.hidden) {
        lx += (tx - lx) * 0.06; ly += (ty - ly) * 0.06;
        torch.style.setProperty('--tx', lx.toFixed(1) + 'px');
        torch.style.setProperty('--ty', ly.toFixed(1) + 'px');
        draw(t);
      }
      requestAnimationFrame(loop);
    })(0);
  })();

  /* ======================================================================
     BINARY RAIN: a dim field of 0s and 1s, brighter streams falling
     through it, and a cat made of lit digits walking along the bottom
     ====================================================================== */
  (function binaryRain() {
    const c = $('#binary');
    if (!c) return;
    const g = c.getContext('2d');
    const CW = 11, CH = 16, FONT = '16px VT323, monospace';
    let W, H, cols, rows, grid, bg, bgx, drops, mask, mx, catX, catScale;

    const rgb = () => body.dataset.mood === 'dread' ? '255, 64, 96' : body.dataset.mood === 'numb' ? '176, 166, 178' : '255, 122, 192';

    function drawDigit(ctx, i, a) {
      const col = i % cols, row = (i / cols) | 0;
      ctx.fillStyle = `rgba(${rgb()}, ${a})`;
      ctx.fillText(grid[i] ? '1' : '0', col * CW + 2, row * CH + 13);
    }
    function paintBg() {
      bgx.clearRect(0, 0, W, H);
      bgx.font = FONT;
      for (let i = 0; i < grid.length; i++) drawDigit(bgx, i, 0.06 + (i * 7919 % 13) / 300);
    }
    function size() {
      W = innerWidth; H = innerHeight;
      c.width = W; c.height = H;
      cols = Math.ceil(W / CW); rows = Math.ceil(H / CH);
      grid = new Uint8Array(cols * rows).map(() => Math.random() < 0.5 ? 1 : 0);
      bg = document.createElement('canvas'); bg.width = W; bg.height = H; bgx = bg.getContext('2d');
      paintBg();
      drops = Array.from({ length: cols }, () => ({ y: Math.random() * rows * 2 - rows, v: rand(0.18, 0.5), len: (rand(6, 18)) | 0, on: Math.random() < 0.38 }));
      mask = document.createElement('canvas'); mask.width = cols; mask.height = rows; mx = mask.getContext('2d', { willReadFrequently: true });
      catScale = W < 700 ? 1.5 : 2.6;
      if (catX == null) catX = -120 * catScale;
    }

    // the cat, facing right, drawn in a 100 x 75 box with the ground at y = 0
    function cat(ctx, step) {
      ctx.fillStyle = ctx.strokeStyle = '#fff'; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.ellipse(48, -34, 30, 13, -0.04, 0, Math.PI * 2); ctx.fill();           // body
      ctx.beginPath(); ctx.ellipse(81, -50, 12, 11, 0, 0, Math.PI * 2); ctx.fill();               // head
      ctx.beginPath(); ctx.ellipse(91, -46, 6, 5, 0, 0, Math.PI * 2); ctx.fill();                 // muzzle
      ctx.beginPath(); ctx.moveTo(72, -56); ctx.lineTo(74, -71); ctx.lineTo(81, -59); ctx.fill(); // ears
      ctx.beginPath(); ctx.moveTo(83, -59); ctx.lineTo(89, -71); ctx.lineTo(91, -55); ctx.fill();
      ctx.lineWidth = 6;                                                                          // tail, curling up
      ctx.beginPath(); ctx.moveTo(20, -38); ctx.quadraticCurveTo(0, -48, 5, -70); ctx.quadraticCurveTo(8, -80, 16, -78); ctx.stroke();
      ctx.lineWidth = 7;                                                                          // legs, swinging in pairs
      const s = step ? 7 : -7;
      [[26, s], [37, -s], [64, -s], [74, s]].forEach(([x, o]) => { ctx.beginPath(); ctx.moveTo(x, -28); ctx.lineTo(x + o, -1); ctx.stroke(); });
    }
    function catCells(step) {
      mx.clearRect(0, 0, cols, rows);
      mx.save();
      mx.scale(1 / CW, 1 / CH);                                    // draw in pixels, sample per cell
      mx.translate(catX, H - (W < 700 ? 30 : 46));
      mx.scale(catScale, catScale);
      cat(mx, step);
      mx.restore();
      return mx.getImageData(0, 0, cols, rows).data;
    }

    function frame(t, still) {
      g.clearRect(0, 0, W, H);
      g.drawImage(bg, 0, 0);
      g.font = FONT;
      // falling streams: a bright head with a fading tail
      for (let x = 0; x < cols; x++) {
        const d = drops[x];
        if (!d.on) continue;
        if (!still) d.y += d.v;
        const head = d.y | 0;
        for (let k = 0; k < d.len; k++) {
          const r = head - k;
          if (r < 0 || r >= rows) continue;
          drawDigit(g, r * cols + x, k === 0 ? 0.5 : 0.28 * (1 - k / d.len));
        }
        if (head - d.len > rows) { d.y = -rand(0, rows * 0.6); d.v = rand(0.18, 0.5); d.on = Math.random() < 0.55; }
      }
      // the cat: digits under its silhouette glow
      const step = ((t / 320) | 0) % 2;
      const m = catCells(step);
      for (let i = 0; i < cols * rows; i++) {
        if (m[i * 4 + 3] > 90) drawDigit(g, i, 0.42 + Math.random() * 0.2);
      }
    }

    size();
    addEventListener('resize', size);
    const start = () => {
      if (reduced) { catX = W * 0.62; frame(0, true); return; }
      let last = 0, lastFlip = 0;
      (function loop(t) {
        if (!document.hidden && t - last > 50) {                  // about 20 frames a second is plenty for rain
          const dt = Math.min(100, t - last); last = t;
          catX += dt * 0.024 * (W < 700 ? 0.7 : 1);             // a slow, unbothered walk
          if (catX > W + 40) catX = -110 * catScale;
          if (t - lastFlip > 260) {                               // the field keeps changing its mind
            lastFlip = t;
            bgx.font = FONT;
            for (let n = 0; n < 50; n++) {
              const i = (Math.random() * grid.length) | 0;
              grid[i] ^= 1;
              const col = i % cols, row = (i / cols) | 0;
              bgx.clearRect(col * CW, row * CH, CW, CH);
              drawDigit(bgx, i, 0.06 + (i * 7919 % 13) / 300);
            }
          }
          frame(t);
        }
        requestAnimationFrame(loop);
      })(0);
    };
    // wait for VT323 so the digits are drawn in the screen font
    (document.fonts && document.fonts.load ? document.fonts.load(FONT) : Promise.resolve()).then(() => { paintBg(); start(); }, start);
    // repaint the field when the mood changes colour
    new MutationObserver(paintBg).observe(body, { attributes: true, attributeFilter: ['data-mood'] });
  })();

