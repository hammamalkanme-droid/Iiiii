/* ============================================================
   استوديو شهادات النخبة — ستة أنظمة بصرية (Visual Systems)
   كل لقب له: لوحة ألوان + رمز هندسي + زخارف + توزيع + إضاءة مختلفة
   ============================================================ */

const ELITE_THEMES = {

  /* ==================== 1) ذُروة النخبة ====================
     القمة والتميّز — فاخر، ذهبي عميق، قمم هندسية متدرجة، توهج ذهبي */
  tharwa: {
    id: 'tharwa',
    label: 'ذُروة النخبة',
    short: 'ذروة-النخبة',
    badge: '#e7c98a',
    logoDefault: 'top-center',
    layout: { align: 'center', shiftX: 0, emblemY: 0.175 },
    pal: {
      bg0: '#0d1020', bg1: '#131a33', bg2: '#1a2342',
      ink: '#f5efdd', dim: '#b9a98a', faint: 'rgba(230,205,150,.55)',
      accent: '#e3c07c', accent2: '#f6e3b4', accent3: '#a8823f',
      glow: 'rgba(227,192,124,.30)', line: 'rgba(227,192,124,.45)',
      sealRing: '#e3c07c'
    },

    /* الرمز: قمة هندسية مجردة — ثلاث قمم متدرجة داخل معيّن */
    emblem(ctx, x, y, r, p) {
      ctx.save();
      ctx.translate(x, y);
      // هالة
      const g = ctx.createRadialGradient(0, 0, r * .1, 0, 0, r * 2.1);
      g.addColorStop(0, p.glow); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(-r * 2.2, -r * 2.2, r * 4.4, r * 4.4);
      // إطار معيّن مزدوج
      ctx.strokeStyle = p.line; ctx.lineWidth = r * .045;
      diamond(ctx, 0, 0, r * 1.28); ctx.stroke();
      ctx.lineWidth = r * .02; ctx.globalAlpha = .55;
      diamond(ctx, 0, 0, r * 1.5); ctx.stroke();
      ctx.globalAlpha = 1;
      // القمم الثلاث
      const peaks = [
        { w: 1.0, h: 1.0, a: 1 },
        { w: .72, h: .68, a: .6 },
        { w: .48, h: .42, a: .35 }
      ];
      peaks.forEach((pk, i) => {
        const gg = ctx.createLinearGradient(0, -r * pk.h, 0, r * .55);
        gg.addColorStop(0, p.accent2); gg.addColorStop(1, p.accent3);
        ctx.fillStyle = gg; ctx.globalAlpha = pk.a;
        ctx.beginPath();
        ctx.moveTo(-r * pk.w, r * .55);
        ctx.lineTo(0, -r * pk.h);
        ctx.lineTo(r * pk.w, r * .55);
        ctx.closePath(); ctx.fill();
        // شقّ ضوئي داخل القمة
        if (i === 0) {
          ctx.globalAlpha = .9; ctx.strokeStyle = 'rgba(255,255,255,.5)';
          ctx.lineWidth = r * .02;
          ctx.beginPath(); ctx.moveTo(0, -r * pk.h); ctx.lineTo(0, r * .45); ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;
      // نجمة القمة
      star4(ctx, 0, -r * 1.06, r * .14, p.accent2);
      ctx.restore();
    },

    /* الخلفية: قمم مجردة جانبية + نقش معينات دقيق + إطار مزدوج */
    decor(ctx, W, H, p) {
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, p.bg2); bg.addColorStop(.45, p.bg0); bg.addColorStop(1, p.bg1);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // توهج ذهبي علوي
      let g = ctx.createRadialGradient(W * .5, -H * .12, 0, W * .5, -H * .12, H * .85);
      g.addColorStop(0, 'rgba(227,192,124,.16)'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // قمم هندسية ضخمة باهتة أسفل الجانبين
      ctx.save();
      const mountain = (cx, base, h, w, alpha) => {
        const mg = ctx.createLinearGradient(0, base - h, 0, base);
        mg.addColorStop(0, `rgba(227,192,124,${alpha})`); mg.addColorStop(1, 'transparent');
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.moveTo(cx - w, base); ctx.lineTo(cx, base - h); ctx.lineTo(cx + w, base);
        ctx.closePath(); ctx.fill();
      };
      mountain(W * .06, H * 1.02, H * .5, W * .17, .10);
      mountain(W * .15, H * 1.04, H * .34, W * .13, .07);
      mountain(W * .94, H * 1.02, H * .5, W * .17, .10);
      mountain(W * .85, H * 1.04, H * .34, W * .13, .07);
      ctx.restore();

      // نقش معينات دقيق (watermark)
      ctx.save();
      ctx.strokeStyle = 'rgba(227,192,124,.05)'; ctx.lineWidth = 1;
      const s = H * .052;
      for (let row = 0; row * s * 1.4 < H; row++)
        for (let col = 0; col * s * 1.4 < W; col++) {
          const xx = col * s * 1.4 + (row % 2 ? s * .7 : 0);
          const yy = row * s * 1.4;
          diamond(ctx, xx, yy, s * .32); ctx.stroke();
        }
      ctx.restore();

      // إطار مزدوج مع زوايا معينية
      frameDouble(ctx, W, H, p, H * .028, H * .043);
      cornerDiamonds(ctx, W, H, p, H * .043, H * .02);
    },

    footerStyle: 'classic'
  },

  /* ==================== 2) هِمّة النخبة ====================
     العزم والمبادرة — طاقة، خطوط صاعدة قطريًا، توهج كهرماني نشط */
  himma: {
    id: 'himma',
    label: 'هِمّة النخبة',
    short: 'همة-النخبة',
    badge: '#ffb35c',
    logoDefault: 'top-left',
    layout: { align: 'right', shiftX: -0.07, emblemY: 0.185 },
    pal: {
      bg0: '#08131c', bg1: '#0c1e2c', bg2: '#123043',
      ink: '#f2f6f2', dim: '#9db8bd', faint: 'rgba(255,179,92,.6)',
      accent: '#ffb35c', accent2: '#ffd9a3', accent3: '#c26a1e',
      glow: 'rgba(255,160,70,.32)', line: 'rgba(255,179,92,.45)',
      sealRing: '#ffb35c'
    },

    /* الرمز: شيفرونات صاعدة (زخم نحو الأعلى) داخل قرص */
    emblem(ctx, x, y, r, p) {
      ctx.save(); ctx.translate(x, y);
      const g = ctx.createRadialGradient(0, 0, r * .1, 0, 0, r * 2.2);
      g.addColorStop(0, p.glow); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(-r * 2.2, -r * 2.2, r * 4.4, r * 4.4);

      ctx.strokeStyle = p.line; ctx.lineWidth = r * .04;
      ctx.beginPath(); ctx.arc(0, 0, r * 1.32, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = .5; ctx.lineWidth = r * .018;
      ctx.beginPath(); ctx.arc(0, 0, r * 1.52, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;

      // ثلاثة شيفرونات صاعدة
      for (let i = 0; i < 3; i++) {
        const yy = r * (.55 - i * .5), sc = 1 - i * .18;
        const gg = ctx.createLinearGradient(-r, yy, r, yy - r * .4);
        gg.addColorStop(0, p.accent3); gg.addColorStop(1, p.accent2);
        ctx.fillStyle = gg; ctx.globalAlpha = .45 + i * .27;
        ctx.beginPath();
        ctx.moveTo(-r * .85 * sc, yy);
        ctx.lineTo(0, yy - r * .52 * sc);
        ctx.lineTo(r * .85 * sc, yy);
        ctx.lineTo(r * .85 * sc, yy - r * .2 * sc);
        ctx.lineTo(0, yy - r * .72 * sc);
        ctx.lineTo(-r * .85 * sc, yy - r * .2 * sc);
        ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    },

    /* الخلفية: مسارات قطرية صاعدة + شريط ديناميكي يسار الشهادة */
    decor(ctx, W, H, p) {
      const bg = ctx.createLinearGradient(W, 0, 0, H);
      bg.addColorStop(0, p.bg2); bg.addColorStop(.55, p.bg0); bg.addColorStop(1, p.bg1);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // خطوط سرعة قطرية صاعدة
      ctx.save();
      ctx.translate(W * .5, H * .5); ctx.rotate(-Math.PI / 9.5); ctx.translate(-W * .5, -H * .5);
      for (let i = -6; i < 22; i++) {
        const yy = i * H * .085;
        const a = i % 4 === 0 ? .10 : .045;
        const lg = ctx.createLinearGradient(0, yy, W, yy);
        lg.addColorStop(0, 'transparent');
        lg.addColorStop(.5, `rgba(255,179,92,${a})`);
        lg.addColorStop(1, 'transparent');
        ctx.fillStyle = lg;
        ctx.fillRect(-W * .3, yy, W * 1.6, i % 4 === 0 ? 2.5 : 1.2);
      }
      ctx.restore();

      // الشريط الديناميكي الأيسر: أوتاد صاعدة
      ctx.save();
      const band = ctx.createLinearGradient(0, H, W * .22, 0);
      band.addColorStop(0, 'rgba(255,179,92,.16)'); band.addColorStop(1, 'rgba(255,179,92,.02)');
      ctx.fillStyle = band;
      ctx.beginPath();
      ctx.moveTo(0, H); ctx.lineTo(0, H * .25);
      ctx.lineTo(W * .17, 0); ctx.lineTo(W * .30, 0);
      ctx.lineTo(W * .08, H); ctx.closePath(); ctx.fill();
      // حافة مضيئة للشريط
      ctx.strokeStyle = 'rgba(255,200,130,.5)'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(W * .30, 0); ctx.lineTo(W * .08, H); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,200,130,.18)'; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(W * .315, 0); ctx.lineTo(W * .095, H); ctx.stroke();
      // شيفرونات صغيرة صاعدة على الشريط
      for (let i = 0; i < 5; i++) {
        const t = i / 4, bx = W * (.27 - t * .185), by = H * (.12 + t * .76);
        ctx.fillStyle = `rgba(255,220,170,${.18 + t * .3})`;
        ctx.beginPath();
        ctx.moveTo(bx - W * .016, by + H * .02);
        ctx.lineTo(bx, by - H * .014);
        ctx.lineTo(bx + W * .016, by + H * .02);
        ctx.lineTo(bx, by + H * .006);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();

      // توهج نشط أعلى اليمين
      let g = ctx.createRadialGradient(W * .88, H * .1, 0, W * .88, H * .1, W * .4);
      g.addColorStop(0, 'rgba(255,170,80,.14)'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // إطار غير متماثل: خط علوي سميك + زوايا
      ctx.strokeStyle = p.line; ctx.lineWidth = 2;
      ctx.strokeRect(W * .026, H * .042, W * .948, H * .916);
      ctx.strokeStyle = 'rgba(255,179,92,.85)'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(W * .026, H * .028); ctx.lineTo(W * .5, H * .028); ctx.stroke();
      cornerTicks(ctx, W, H, p, W * .026, H * .042, W * .948, H * .916);
    },

    footerStyle: 'band'
  },

  /* ==================== 3) أُلفة النخبة ====================
     التعاون والمودة — حلقات مترابطة، دفء وردي-ذهبي هادئ */
  ulfa: {
    id: 'ulfa',
    label: 'أُلفة النخبة',
    short: 'الفة-النخبة',
    badge: '#f0a8b8',
    logoDefault: 'top-center',
    layout: { align: 'center', shiftX: 0, emblemY: 0.18 },
    pal: {
      bg0: '#160f1c', bg1: '#1f1428', bg2: '#2b1a33',
      ink: '#f8f0ee', dim: '#c4a9b4', faint: 'rgba(240,168,184,.55)',
      accent: '#eda9b8', accent2: '#f8d8ce', accent3: '#b06477',
      glow: 'rgba(237,169,184,.28)', line: 'rgba(237,169,184,.42)',
      sealRing: '#eda9b8'
    },

    /* الرمز: ثلاث حلقات مترابطة (ائتلاف) */
    emblem(ctx, x, y, r, p) {
      ctx.save(); ctx.translate(x, y);
      const g = ctx.createRadialGradient(0, 0, r * .1, 0, 0, r * 2.2);
      g.addColorStop(0, p.glow); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(-r * 2.2, -r * 2.2, r * 4.4, r * 4.4);

      ctx.strokeStyle = p.line; ctx.lineWidth = r * .02; ctx.globalAlpha = .5;
      ctx.beginPath(); ctx.arc(0, 0, r * 1.55, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;

      const ring = (cx, cy, grad0, grad1, lw) => {
        const lg = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
        lg.addColorStop(0, grad0); lg.addColorStop(1, grad1);
        ctx.strokeStyle = lg; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.arc(cx, cy, r * .62, 0, Math.PI * 2); ctx.stroke();
      };
      ring(-r * .5, r * .18, p.accent3, p.accent, r * .075);
      ring(r * .5, r * .18, p.accent, p.accent2, r * .075);
      ring(0, -r * .42, p.accent2, p.accent, r * .075);
      // نقاط الالتقاء المضيئة
      [[-r * .02, r * .16], [-r * .26, -r * .2], [r * .26, -r * .2]].forEach(([px, py]) => {
        const dg = ctx.createRadialGradient(px, py, 0, px, py, r * .16);
        dg.addColorStop(0, 'rgba(255,240,235,.95)'); dg.addColorStop(1, 'transparent');
        ctx.fillStyle = dg;
        ctx.beginPath(); ctx.arc(px, py, r * .16, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
    },

    /* الخلفية: دوائر متداخلة واسعة + عُقد مضيئة ناعمة */
    decor(ctx, W, H, p) {
      const bg = ctx.createRadialGradient(W * .5, H * .42, H * .05, W * .5, H * .42, H);
      bg.addColorStop(0, p.bg2); bg.addColorStop(.6, p.bg1); bg.addColorStop(1, p.bg0);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // حلقات عملاقة باهتة خلف المحتوى
      ctx.save();
      const bigRing = (cx, cy, rr, a, lw) => {
        ctx.strokeStyle = `rgba(237,169,184,${a})`; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();
      };
      bigRing(W * .5, H * .46, H * .30, .10, 2);
      bigRing(W * .5, H * .46, H * .38, .06, 1.4);
      bigRing(W * .5, H * .46, H * .46, .04, 1.2);
      bigRing(W * .13, H * .12, H * .22, .07, 1.6);
      bigRing(W * .87, H * .88, H * .24, .07, 1.6);
      bigRing(W * .88, H * .14, H * .15, .05, 1.2);
      bigRing(W * .11, H * .86, H * .16, .05, 1.2);
      ctx.restore();

      // عُقد ضوئية ناعمة (bokeh راقٍ)
      ctx.save();
      const dots = [[.2,.3,.05],[.8,.32,.04],[.28,.72,.045],[.74,.68,.05],[.5,.1,.035],[.36,.14,.028],[.64,.86,.032],[.12,.55,.03],[.9,.52,.03]];
      dots.forEach(([dx, dy, da]) => {
        const dg = ctx.createRadialGradient(W*dx, H*dy, 0, W*dx, H*dy, H*.05);
        dg.addColorStop(0, `rgba(248,216,206,${da})`); dg.addColorStop(1, 'transparent');
        ctx.fillStyle = dg;
        ctx.beginPath(); ctx.arc(W*dx, H*dy, H*.05, 0, Math.PI*2); ctx.fill();
      });
      ctx.restore();

      // إطار منحني الزوايا بخطين
      ctx.save();
      const m = H * .036;
      ctx.strokeStyle = p.line; ctx.lineWidth = 2;
      roundRect(ctx, m, m, W - 2 * m, H - 2 * m, H * .05); ctx.stroke();
      ctx.strokeStyle = 'rgba(237,169,184,.18)'; ctx.lineWidth = 1;
      roundRect(ctx, m * 1.55, m * 1.55, W - 3.1 * m, H - 3.1 * m, H * .04); ctx.stroke();
      // أقواس زخرفية عند منتصف الأضلاع
      ctx.fillStyle = p.accent;
      [[W*.5, m],[W*.5, H-m],[m, H*.5],[W-m, H*.5]].forEach(([cx,cy])=>{
        ctx.beginPath(); ctx.arc(cx, cy, H*.007, 0, Math.PI*2); ctx.fill();
      });
      ctx.restore();
    },

    footerStyle: 'soft'
  },

  /* ==================== 4) عُمدة النخبة ====================
     الثقة والثبات — معماري رسمي، أعمدة جانبية، زمردي عميق وبرونز */
  umda: {
    id: 'umda',
    label: 'عُمدة النخبة',
    short: 'عمدة-النخبة',
    badge: '#7fc8a9',
    logoDefault: 'top-center',
    layout: { align: 'center', shiftX: 0, emblemY: 0.175 },
    pal: {
      bg0: '#0b1414', bg1: '#101f1e', bg2: '#16302c',
      ink: '#f0f2ea', dim: '#a3bcb0', faint: 'rgba(190,160,110,.6)',
      accent: '#c9a86a', accent2: '#e8d3a5', accent3: '#8a6f3e',
      glow: 'rgba(201,168,106,.22)', line: 'rgba(201,168,106,.5)',
      sealRing: '#c9a86a'
    },

    /* الرمز: عمود/دعامة مجردة — قاعدة + جذع خطّي + تاج مستطيل */
    emblem(ctx, x, y, r, p) {
      ctx.save(); ctx.translate(x, y);
      const g = ctx.createRadialGradient(0, 0, r * .1, 0, 0, r * 2);
      g.addColorStop(0, p.glow); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(-r * 2, -r * 2, r * 4, r * 4);

      // قاعدة مثمنة
      ctx.strokeStyle = p.line; ctx.lineWidth = r * .04;
      octagon(ctx, 0, 0, r * 1.35); ctx.stroke();
      ctx.globalAlpha = .45; ctx.lineWidth = r * .018;
      octagon(ctx, 0, 0, r * 1.55); ctx.stroke();
      ctx.globalAlpha = 1;

      const col = ctx.createLinearGradient(-r * .3, 0, r * .3, 0);
      col.addColorStop(0, p.accent3); col.addColorStop(.5, p.accent2); col.addColorStop(1, p.accent3);
      ctx.fillStyle = col;
      // تاج العمود
      ctx.fillRect(-r * .5, -r * .98, r * 1.0, r * .16);
      // جذع بثلاث قنوات
      ctx.fillRect(-r * .38, -r * .74, r * .76, r * 1.4);
      ctx.fillStyle = p.bg0;
      ctx.fillRect(-r * .22, -r * .68, r * .09, r * 1.28);
      ctx.fillRect(r * .13, -r * .68, r * .09, r * 1.28);
      // القاعدة
      ctx.fillStyle = col;
      ctx.fillRect(-r * .56, r * .72, r * 1.12, r * .15);
      ctx.fillRect(-r * .68, r * .9, r * 1.36, r * .12);
      ctx.restore();
    },

    /* الخلفية: أعمدة جانبية ضخمة + خطوط رأسية معمارية */
    decor(ctx, W, H, p) {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, p.bg2); bg.addColorStop(.5, p.bg0); bg.addColorStop(1, p.bg1);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // خطوط رأسية دقيقة (إيقاع معماري)
      ctx.save();
      ctx.strokeStyle = 'rgba(201,168,106,.05)'; ctx.lineWidth = 1;
      for (let x = W * .12; x < W; x += W * .045) {
        ctx.beginPath(); ctx.moveTo(x, H * .05); ctx.lineTo(x, H * .95); ctx.stroke();
      }
      ctx.restore();

      // عمودان جانبيان
      ctx.save();
      const pillar = (px) => {
        const pw = W * .052;
        const pg = ctx.createLinearGradient(px, 0, px + pw, 0);
        pg.addColorStop(0, 'rgba(201,168,106,.03)');
        pg.addColorStop(.5, 'rgba(201,168,106,.13)');
        pg.addColorStop(1, 'rgba(201,168,106,.03)');
        ctx.fillStyle = pg;
        ctx.fillRect(px, 0, pw, H);
        // تيجان وقواعد
        ctx.fillStyle = 'rgba(201,168,106,.3)';
        ctx.fillRect(px - pw * .12, H * .045, pw * 1.24, H * .012);
        ctx.fillRect(px - pw * .12, H * .943, pw * 1.24, H * .012);
        // قنوات
        ctx.strokeStyle = 'rgba(201,168,106,.16)'; ctx.lineWidth = 1.5;
        for (let i = 1; i <= 3; i++) {
          const lx = px + (pw / 4) * i;
          ctx.beginPath(); ctx.moveTo(lx, H * .08); ctx.lineTo(lx, H * .92); ctx.stroke();
        }
      };
      pillar(W * .045); pillar(W * .955 - W * .052);
      ctx.restore();

      // شريط علوي وسفلي رسمي
      ctx.fillStyle = 'rgba(201,168,106,.9)';
      ctx.fillRect(W * .12, H * .045, W * .76, 2.5);
      ctx.fillRect(W * .12, H * .9525, W * .76, 2.5);
      ctx.fillStyle = 'rgba(201,168,106,.25)';
      ctx.fillRect(W * .12, H * .056, W * .76, 1);
      ctx.fillRect(W * .12, H * .941, W * .76, 1);

      // زوايا معمارية
      cornerSquares(ctx, W, H, p, W * .12, H * .045);
    },

    footerStyle: 'arch'
  },

  /* ==================== 5) سَداد النخبة ====================
     الحكمة والاتزان — فاتح Editorial، شبكة دقيقة، نجمة اتجاه، محور واضح */
  sadad: {
    id: 'sadad',
    label: 'سَداد النخبة',
    short: 'سداد-النخبة',
    badge: '#2e5d4b',
    light: true,
    logoDefault: 'top-right',
    layout: { align: 'center', shiftX: 0, emblemY: 0.18 },
    pal: {
      bg0: '#f5f1e8', bg1: '#efe9db', bg2: '#e7dfcc',
      ink: '#1d2b26', dim: '#5d6f66', faint: 'rgba(46,93,75,.7)',
      accent: '#2e5d4b', accent2: '#487a63', accent3: '#b08d4f',
      glow: 'rgba(176,141,79,.20)', line: 'rgba(46,93,75,.45)',
      sealRing: '#2e5d4b'
    },

    /* الرمز: نجمة اتجاه ثمانية (بوصلة/اتزان) داخل دائرة مدرّجة */
    emblem(ctx, x, y, r, p) {
      ctx.save(); ctx.translate(x, y);
      const g = ctx.createRadialGradient(0, 0, r * .1, 0, 0, r * 2);
      g.addColorStop(0, p.glow); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(-r * 2, -r * 2, r * 4, r * 4);

      ctx.strokeStyle = p.line; ctx.lineWidth = r * .035;
      ctx.beginPath(); ctx.arc(0, 0, r * 1.3, 0, Math.PI * 2); ctx.stroke();
      // تدريج دقيق على المحيط
      ctx.lineWidth = r * .015; ctx.globalAlpha = .7;
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        const r1 = r * 1.3, r2 = r * (i % 6 === 0 ? 1.44 : 1.37);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // نجمة ثمانية هندسية
      ctx.fillStyle = p.accent;
      star8(ctx, 0, 0, r * 1.05, r * .34);
      ctx.fillStyle = p.bg0;
      ctx.beginPath(); ctx.arc(0, 0, r * .3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = p.accent3;
      ctx.beginPath(); ctx.arc(0, 0, r * .18, 0, Math.PI * 2); ctx.fill();
      // محاور ممتدة
      ctx.strokeStyle = p.accent3; ctx.lineWidth = r * .02; ctx.globalAlpha = .8;
      [[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx,dy])=>{
        ctx.beginPath();
        ctx.moveTo(dx * r * 1.1, dy * r * 1.1);
        ctx.lineTo(dx * r * 1.62, dy * r * 1.62);
        ctx.stroke();
      });
      ctx.restore();
    },

    /* الخلفية: ورق فاخر + شبكة مسطرة دقيقة + محور مركزي */
    decor(ctx, W, H, p) {
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, p.bg0); bg.addColorStop(.5, p.bg1); bg.addColorStop(1, p.bg0);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // شبكة دقيقة جدًا
      ctx.save();
      ctx.strokeStyle = 'rgba(46,93,75,.045)'; ctx.lineWidth = 1;
      const st = H * .05;
      for (let x = st; x < W; x += st) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = st; y < H; y += st) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.restore();

      // المحور الرأسي المركزي الدقيق
      ctx.save();
      ctx.strokeStyle = 'rgba(46,93,75,.22)'; ctx.lineWidth = 1.4;
      ctx.setLineDash([H * .012, H * .012]);
      ctx.beginPath(); ctx.moveTo(W * .5, H * .06); ctx.lineTo(W * .5, H * .94); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // زخرفة زاوية هندسية (مثلثات قائمة دقيقة)
      ctx.save();
      const corner = (cx, cy, sx, sy) => {
        ctx.strokeStyle = 'rgba(176,141,79,.55)'; ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const o = H * (.02 + i * .014);
          ctx.beginPath();
          ctx.moveTo(cx + sx * o, cy);
          ctx.lineTo(cx, cy + sy * o);
          ctx.stroke();
        }
      };
      corner(W * .045, H * .06, 1, 1);
      corner(W * .955, H * .06, -1, 1);
      corner(W * .045, H * .94, 1, -1);
      corner(W * .955, H * .94, -1, -1);
      ctx.restore();

      // إطار هندسي مزدوج حاد
      ctx.strokeStyle = p.accent; ctx.lineWidth = 3;
      ctx.strokeRect(W * .03, H * .048, W * .94, H * .904);
      ctx.strokeStyle = 'rgba(46,93,75,.3)'; ctx.lineWidth = 1;
      ctx.strokeRect(W * .042, H * .075, W * .916, H * .85);

      // شريط لوني رفيع علوي
      ctx.fillStyle = p.accent;
      ctx.fillRect(W * .03, H * .048, W * .94, H * .008);
    },

    footerStyle: 'grid'
  },

  /* ==================== 6) بَصيرة النخبة ====================
     الرؤية والفكرة — تقني مستقبلي، شبكة سداسية، عدسة ضوئية نيون */
  baseera: {
    id: 'baseera',
    label: 'بَصيرة النخبة',
    short: 'بصيرة-النخبة',
    badge: '#7db4ff',
    logoDefault: 'top-left',
    layout: { align: 'right', shiftX: -0.06, emblemY: 0.19 },
    pal: {
      bg0: '#070a18', bg1: '#0a1024', bg2: '#101736',
      ink: '#eef2ff', dim: '#8fa3d0', faint: 'rgba(125,180,255,.6)',
      accent: '#7db4ff', accent2: '#b7d4ff', accent3: '#8f7dff',
      glow: 'rgba(110,150,255,.32)', line: 'rgba(125,180,255,.45)',
      sealRing: '#7db4ff'
    },

    /* الرمز: فتحة عدسة مجردة (Aperture) — رؤية بدون عين */
    emblem(ctx, x, y, r, p) {
      ctx.save(); ctx.translate(x, y);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.3);
      g.addColorStop(0, 'rgba(140,170,255,.4)');
      g.addColorStop(.5, p.glow);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(-r * 2.3, -r * 2.3, r * 4.6, r * 4.6);

      // حلقة سداسية خارجية
      ctx.strokeStyle = p.line; ctx.lineWidth = r * .035;
      polygon(ctx, 0, 0, r * 1.45, 6, -Math.PI / 6); ctx.stroke();
      ctx.globalAlpha = .4; ctx.lineWidth = r * .015;
      polygon(ctx, 0, 0, r * 1.62, 6, 0); ctx.stroke();
      ctx.globalAlpha = 1;

      // شفرات الفتحة
      const blades = 6;
      for (let i = 0; i < blades; i++) {
        const a0 = (i / blades) * Math.PI * 2 - Math.PI / 2;
        const a1 = ((i + 1) / blades) * Math.PI * 2 - Math.PI / 2;
        const gg = ctx.createLinearGradient(Math.cos(a0) * r, Math.sin(a0) * r, 0, 0);
        gg.addColorStop(0, i % 2 ? p.accent3 : p.accent);
        gg.addColorStop(1, p.accent2);
        ctx.fillStyle = gg; ctx.globalAlpha = .85;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a0) * r * 1.08, Math.sin(a0) * r * 1.08);
        ctx.lineTo(Math.cos(a0 + .38) * r * .34, Math.sin(a0 + .38) * r * .34);
        ctx.lineTo(Math.cos(a1 + .38) * r * .34, Math.sin(a1 + .38) * r * .34);
        ctx.lineTo(Math.cos(a1) * r * 1.08, Math.sin(a1) * r * 1.08);
        ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // النواة المضيئة
      const core = ctx.createRadialGradient(0, 0, 0, 0, 0, r * .3);
      core.addColorStop(0, '#ffffff'); core.addColorStop(.4, p.accent2); core.addColorStop(1, 'transparent');
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(0, 0, r * .3, 0, Math.PI * 2); ctx.fill();
      // شرارات مدارية
      ctx.fillStyle = p.accent2;
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 + .7;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r * 1.45, Math.sin(a) * r * 1.45, r * .045, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },

    /* الخلفية: شبكة سداسية خافتة + خطوط ضوئية + عمود تقني جانبي */
    decor(ctx, W, H, p) {
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, p.bg2); bg.addColorStop(.5, p.bg0); bg.addColorStop(1, p.bg1);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // شبكة سداسية خفيفة
      ctx.save();
      ctx.strokeStyle = 'rgba(125,180,255,.05)'; ctx.lineWidth = 1;
      const hs = H * .055;
      for (let row = 0; row * hs * 1.5 < H * 1.1; row++)
        for (let col = 0; col * hs * 1.74 < W * 1.1; col++) {
          const cx = col * hs * 1.74 + (row % 2 ? hs * .87 : 0);
          const cy = row * hs * 1.5;
          polygon(ctx, cx, cy, hs * .58, 6, 0); ctx.stroke();
        }
      ctx.restore();

      // خطوط ضوئية (circuit traces) أفقية بزوايا 45°
      ctx.save();
      const trace = (pts, alpha, lw) => {
        ctx.strokeStyle = `rgba(125,180,255,${alpha})`; ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.moveTo(pts[0][0] * W, pts[0][1] * H);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0] * W, pts[i][1] * H);
        ctx.stroke();
        // عقدة نهائية مضيئة
        const [ex, ey] = pts[pts.length - 1];
        const ng = ctx.createRadialGradient(ex * W, ey * H, 0, ex * W, ey * H, H * .018);
        ng.addColorStop(0, 'rgba(183,212,255,.9)'); ng.addColorStop(1, 'transparent');
        ctx.fillStyle = ng;
        ctx.beginPath(); ctx.arc(ex * W, ey * H, H * .018, 0, Math.PI * 2); ctx.fill();
      };
      trace([[.02,.2],[.12,.2],[.17,.12],[.3,.12]], .5, 1.6);
      trace([[.02,.3],[.09,.3],[.13,.36],[.22,.36]], .3, 1.2);
      trace([[.98,.75],[.88,.75],[.82,.84],[.7,.84]], .4, 1.6);
      trace([[.98,.64],[.92,.64],[.87,.58],[.78,.58]], .28, 1.2);
      trace([[.55,.955],[.62,.9],[.75,.9]], .3, 1.2);
      ctx.restore();

      // عمود تقني أيسر متدرج
      ctx.save();
      const cg = ctx.createLinearGradient(0, 0, W * .2, 0);
      cg.addColorStop(0, 'rgba(125,180,255,.14)'); cg.addColorStop(1, 'transparent');
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, W * .2, H);
      ctx.strokeStyle = 'rgba(125,180,255,.55)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(W * .028, H * .06); ctx.lineTo(W * .028, H * .94); ctx.stroke();
      // مقاطع نيون على العمود
      ctx.fillStyle = 'rgba(143,125,255,.9)';
      [.2, .5, .8].forEach(t => ctx.fillRect(W * .028 - 4, H * t - H * .03, 8, H * .06));
      ctx.restore();

      // توهجات نيون
      let g1 = ctx.createRadialGradient(W * .8, H * .18, 0, W * .8, H * .18, W * .35);
      g1.addColorStop(0, 'rgba(143,125,255,.16)'); g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
      let g2 = ctx.createRadialGradient(W * .2, H * .9, 0, W * .2, H * .9, W * .3);
      g2.addColorStop(0, 'rgba(125,180,255,.12)'); g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

      // إطار تقني بزوايا مشطوفة
      ctx.strokeStyle = p.line; ctx.lineWidth = 2;
      const m = H * .04, ch = H * .045;
      ctx.beginPath();
      ctx.moveTo(m + ch, m); ctx.lineTo(W - m - ch, m); ctx.lineTo(W - m, m + ch);
      ctx.lineTo(W - m, H - m - ch); ctx.lineTo(W - m - ch, H - m);
      ctx.lineTo(m + ch, H - m); ctx.lineTo(m, H - m - ch);
      ctx.lineTo(m, m + ch); ctx.closePath(); ctx.stroke();
      ctx.strokeStyle = 'rgba(125,180,255,.15)'; ctx.lineWidth = 1;
      ctx.strokeRect(W * .045, H * .068, W * .91, H * .864);
    },

    footerStyle: 'tech'
  }
};

/* ---------------- أدوات رسم مشتركة ---------------- */
function diamond(ctx, x, y, r) {
  ctx.beginPath();
  ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y);
  ctx.closePath();
}
function polygon(ctx, x, y, r, n, rot = 0) {
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    i ? ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
      : ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.closePath();
}
function octagon(ctx, x, y, r) { polygon(ctx, x, y, r, 8, Math.PI / 8); }
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function star4(ctx, x, y, r, color) {
  ctx.save(); ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill(); ctx.restore();
}
function star8(ctx, x, y, rOut, rIn) {
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? rOut : rIn;
    i ? ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
      : ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.closePath(); ctx.fill();
}
function frameDouble(ctx, W, H, p, m1, m2) {
  ctx.strokeStyle = p.line; ctx.lineWidth = 2.2;
  ctx.strokeRect(m1, m1, W - 2 * m1, H - 2 * m1);
  ctx.strokeStyle = 'rgba(227,192,124,.22)'; ctx.lineWidth = 1;
  ctx.strokeRect(m2, m2, W - 2 * m2, H - 2 * m2);
}
function cornerDiamonds(ctx, W, H, p, m, s) {
  ctx.fillStyle = p.accent;
  [[m, m], [W - m, m], [m, H - m], [W - m, H - m]].forEach(([x, y]) => {
    diamond(ctx, x, y, s); ctx.fill();
  });
}
function cornerTicks(ctx, W, H, p, x, y, w, h) {
  const L = H * .07;
  ctx.strokeStyle = p.accent; ctx.lineWidth = 4;
  [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([cx, cy, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(cx + sx * L, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy * L);
    ctx.stroke();
  });
}
function cornerSquares(ctx, W, H, p, mx, my) {
  ctx.fillStyle = p.accent;
  const s = H * .011;
  [[mx, my], [W - mx, my], [mx, H - my], [W - mx, H - my]].forEach(([x, y]) => {
    ctx.fillRect(x - s / 2, y - s / 2, s, s);
  });
}
