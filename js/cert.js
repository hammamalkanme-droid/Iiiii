/* ============================================================
   استوديو شهادات النخبة — محرك رسم الشهادة (Canvas Renderer)
   يعمل بالكامل Client-side — المعاينة 1600×1000 والتصدير 3200×2000
   ============================================================ */

const CERT = (() => {

  const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

  /* ---------- نص مع تصغير تلقائي ليناسب العرض ---------- */
  function fitText(ctx, text, maxW, baseSize, weight, family) {
    let size = baseSize;
    ctx.font = `${weight} ${size}px ${family}`;
    while (ctx.measureText(text).width > maxW && size > baseSize * .45) {
      size -= 2;
      ctx.font = `${weight} ${size}px ${family}`;
    }
    return size;
  }

  /* ---------- التفاف نص عربي ---------- */
  function wrapText(ctx, text, maxW, size, weight, family) {
    ctx.font = `${weight} ${size}px ${family}`;
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    words.forEach(w => {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
      else line = test;
    });
    if (line) lines.push(line);
    return lines.slice(0, 4);
  }

  /* ---------- الشعار الافتراضي (علامة النخبة الهندسية) ---------- */
  function defaultLogo(size = 400, color = '#d4af6a') {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const x = c.getContext('2d'), s = size;
    x.strokeStyle = color; x.lineWidth = s * .045;
    x.beginPath();
    x.moveTo(s/2, s*.06); x.lineTo(s*.94, s/2); x.lineTo(s/2, s*.94); x.lineTo(s*.06, s/2);
    x.closePath(); x.stroke();
    x.fillStyle = color;
    x.beginPath();
    x.moveTo(s/2, s*.24); x.lineTo(s*.76, s/2); x.lineTo(s/2, s*.76); x.lineTo(s*.24, s/2);
    x.closePath(); x.fill();
    x.fillStyle = 'rgba(0,0,0,.28)';
    x.beginPath();
    x.moveTo(s/2, s*.24); x.lineTo(s*.76, s/2); x.lineTo(s/2, s/2);
    x.closePath(); x.fill();
    return c;
  }

  /* ---------- توقيع افتراضي مرسوم (Placeholder أنيق) ---------- */
  function defaultSignature() {
    const c = document.createElement('canvas');
    c.width = 600; c.height = 260;
    const x = c.getContext('2d');
    x.strokeStyle = '#2c3550'; x.lineWidth = 7; x.lineCap = 'round';
    x.beginPath();
    x.moveTo(520, 60);
    x.bezierCurveTo(480, 200, 420, 40, 380, 160);
    x.bezierCurveTo(350, 240, 320, 90, 280, 150);
    x.bezierCurveTo(240, 210, 210, 110, 170, 170);
    x.stroke();
    x.beginPath();
    x.moveTo(430, 210);
    x.bezierCurveTo(340, 250, 220, 200, 90, 215);
    x.stroke();
    x.lineWidth = 4;
    x.beginPath(); x.moveTo(120, 70); x.quadraticCurveTo(150, 40, 180, 78); x.stroke();
    return c;
  }

  /* ---------- إزالة الخلفية البيضاء من التوقيع ---------- */
  function removeWhiteBg(img, cb) {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth || img.width;
    c.height = img.naturalHeight || img.height;
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    try {
      const d = x.getImageData(0, 0, c.width, c.height);
      const px = d.data;
      for (let i = 0; i < px.length; i += 4) {
        const r = px[i], g = px[i+1], b = px[i+2];
        const lum = (r + g + b) / 3;
        if (lum > 242) px[i+3] = 0;
        else if (lum > 218) px[i+3] = Math.min(px[i+3], 255 * (242 - lum) / 24);
      }
      x.putImageData(d, 0, 0);
    } catch (e) { /* CORS أو غيره — نعيد الأصل */ }
    cb(c);
  }

  /* ---------- ختم دائري صغير بجانب الاعتماد ---------- */
  function drawSeal(ctx, x, y, r, p) {
    ctx.save();
    ctx.globalAlpha = .85;
    ctx.strokeStyle = p.sealRing; ctx.lineWidth = r * .09;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = r * .03; ctx.globalAlpha = .5;
    ctx.beginPath(); ctx.arc(x, y, r * .82, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = .85;
    diamond(ctx, x, y, r * .45); ctx.stroke();
    diamond(ctx, x, y, r * .22);
    ctx.fillStyle = p.sealRing; ctx.fill();
    ctx.restore();
  }

  /* ---------- رسم صورة داخل حاوية ثابتة مع الحفاظ على النسبة ---------- */
  function drawContained(ctx, img, cx, cy, boxW, boxH) {
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;
    const sc = Math.min(boxW / iw, boxH / ih);
    const w = iw * sc, h = ih * sc;
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  }

  /* ================================================================
     المُصيِّر الرئيسي
     S = { name, titleId, month, year, text, certNo,
           logo(img), logoPos, logoSize, sig(img), sigSize, sigX, sigY,
           nameSize, textSize }
     ================================================================ */
  function render(ctx, W, H, S) {
    const T = ELITE_THEMES[S.titleId] || ELITE_THEMES.tharwa;
    const p = T.pal;
    const u = H / 1000; // وحدة قياس نسبية

    ctx.save();
    ctx.clearRect(0, 0, W, H);
    ctx.direction = 'rtl';
    ctx.textBaseline = 'middle';

    /* ---- 1) الخلفية والزخارف ---- */
    T.decor(ctx, W, H, p);

    /* ---- 2) موضع المحتوى حسب نظام اللقب ---- */
    const align = T.layout.align;
    const cx = W * (align === 'center' ? .5 : (T.layout.shiftX < 0 ? .565 : .435));
    const textX = cx + W * (align === 'center' ? 0 : (T.layout.shiftX || 0) * 0);
    const contentW = W * (T.footerStyle === 'classic' ? .62 : .6);
    ctx.textAlign = align === 'center' ? 'center' : 'right';
    const anchorX = align === 'center' ? cx : cx + contentW / 2;

    /* ---- 3) ترويسة هوية الفريق ---- */
    const headY = H * .102;
    ctx.fillStyle = p.faint;
    ctx.font = `600 ${26 * u}px Cairo, Tajawal, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('فريق النخبة', W * .5, headY);
    // خطّا الترويسة
    ctx.strokeStyle = p.line; ctx.lineWidth = 1.2;
    const hw = ctx.measureText('فريق النخبة').width;
    ctx.beginPath();
    ctx.moveTo(W * .5 - hw / 2 - W * .07, headY); ctx.lineTo(W * .5 - hw / 2 - W * .015, headY);
    ctx.moveTo(W * .5 + hw / 2 + W * .015, headY); ctx.lineTo(W * .5 + hw / 2 + W * .07, headY);
    ctx.stroke();
    ctx.fillStyle = p.accent;
    diamond(ctx, W * .5 - hw / 2 - W * .012, headY, 4.5 * u); ctx.fill();
    diamond(ctx, W * .5 + hw / 2 + W * .012, headY, 4.5 * u); ctx.fill();

    /* ---- 4) رمز اللقب ---- */
    const embR = H * .058;
    T.emblem(ctx, cx, H * (T.layout.emblemY - .012) + embR * .35, embR, p);

    /* ---- 5) «شهادة تكريم» ---- */
    ctx.textAlign = align === 'center' ? 'center' : 'right';
    let y = H * .29;
    ctx.fillStyle = p.dim;
    ctx.font = `600 ${30 * u}px Cairo, sans-serif`;
    const sub = 'شهادة تكريم';
    ctx.save();
    // تباعد أحرف يدوي خفيف
    ctx.fillText(sub, anchorX, y);
    ctx.restore();

    /* ---- 6) اسم اللقب ---- */
    y += H * .072;
    const titleSize = fitText(ctx, T.label, contentW, 92 * u, 900, 'Cairo, sans-serif');
    const tGrad = ctx.createLinearGradient(anchorX - contentW/2, y - titleSize/2, anchorX + contentW/2, y + titleSize/2);
    tGrad.addColorStop(0, p.accent); tGrad.addColorStop(.5, p.accent2); tGrad.addColorStop(1, p.accent);
    ctx.fillStyle = tGrad;
    ctx.font = `900 ${titleSize}px Cairo, sans-serif`;
    ctx.shadowColor = p.glow; ctx.shadowBlur = 26 * u;
    ctx.fillText(T.label, anchorX, y);
    ctx.shadowBlur = 0;

    // فاصل زخرفي تحت اللقب
    y += H * .048;
    ctx.strokeStyle = p.line; ctx.lineWidth = 1.4;
    const fw = W * .11;
    ctx.beginPath();
    ctx.moveTo(anchorX - fw, y); ctx.lineTo(anchorX - 16 * u, y);
    ctx.moveTo(anchorX + 16 * u, y); ctx.lineTo(anchorX + fw, y);
    ctx.stroke();
    ctx.fillStyle = p.accent;
    diamond(ctx, anchorX, y, 7 * u); ctx.fill();

    /* ---- 7) «تُمنح إلى» ---- */
    y += H * .05;
    ctx.fillStyle = p.dim;
    ctx.font = `500 ${28 * u}px Tajawal, Cairo, sans-serif`;
    ctx.fillText('تُمنح إلى', anchorX, y);

    /* ---- 8) اسم المستحق (أبرز نص) ---- */
    y += H * .075;
    const nameBase = S.nameSize * u;
    const nameSize = fitText(ctx, S.name || '—', contentW * 1.05, nameBase, 900, 'Cairo, sans-serif');
    ctx.fillStyle = p.ink;
    ctx.font = `900 ${nameSize}px Cairo, sans-serif`;
    ctx.fillText(S.name || '—', anchorX, y);
    // خط سفلي مضيء قصير
    const nw = Math.min(ctx.measureText(S.name || '—').width, contentW * 1.05);
    ctx.strokeStyle = p.line; ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(anchorX - nw / 2 * .6, y + nameSize * .62);
    ctx.lineTo(anchorX + nw / 2 * .6, y + nameSize * .62);
    ctx.stroke();

    /* ---- 9) نص التكريم ---- */
    y += nameSize * .62 + H * .02;
    const tSize = S.textSize * u;
    const lines = wrapText(ctx, S.text || '', contentW, tSize, 500, 'Tajawal, Cairo, sans-serif');
    ctx.fillStyle = p.light ? p.dim : mixDim(p);
    ctx.font = `500 ${tSize}px Tajawal, Cairo, sans-serif`;
    lines.forEach((ln, i) => ctx.fillText(ln, anchorX, y + i * tSize * 1.6));
    y += (lines.length - 1) * tSize * 1.6;

    /* ---- 10) الشهر والسنة ---- */
    y = Math.min(y + tSize * 1.6 + H * .012, H * .795);
    ctx.fillStyle = p.accent;
    ctx.font = `700 ${30 * u}px Cairo, sans-serif`;
    const dateStr = `${S.month} ${S.year}`;
    ctx.fillText(dateStr, anchorX, y);
    ctx.strokeStyle = p.line; ctx.lineWidth = 1.2;
    const dw = ctx.measureText(dateStr).width;
    ctx.beginPath();
    ctx.moveTo(anchorX - dw/2 - W*.04, y); ctx.lineTo(anchorX - dw/2 - W*.012, y);
    ctx.moveTo(anchorX + dw/2 + W*.012, y); ctx.lineTo(anchorX + dw/2 + W*.04, y);
    ctx.stroke();

    /* ---- 11) التذييل: شعار / رقم / توقيع ---- */
    drawFooter(ctx, W, H, S, T, p, u);

    /* ---- 12) الشعار حسب الموضع المختار ---- */
    drawLogo(ctx, W, H, S, T, p, u);

    ctx.restore();
  }

  function mixDim(p){ return p.dim; }

  /* ---------- التذييل ---------- */
  function drawFooter(ctx, W, H, S, T, p, u) {
    const fy = H * .885;
    const sigCX = W * .815;   // يمين التذييل
    const certCX = W * .5;    // وسط
    const logoCX = W * .185;  // يسار

    // خط التذييل العلوي الرقيق
    ctx.strokeStyle = p.line; ctx.lineWidth = 1;
    ctx.globalAlpha = .7;
    ctx.beginPath(); ctx.moveTo(W * .09, H * .815); ctx.lineTo(W * .91, H * .815); ctx.stroke();
    ctx.globalAlpha = 1;

    /* --- التوقيع (يمين) --- */
    const sigBoxW = W * .16 * (S.sigSize / 100);
    const sigBoxH = H * .085 * (S.sigSize / 100);
    const sx = sigCX + (S.sigX || 0) * u;
    const sy = fy - H * .028 + (S.sigY || 0) * u;
    if (S.sig) drawContained(ctx, S.sig, sx, sy, sigBoxW, sigBoxH);

    // خط التوقيع
    ctx.strokeStyle = p.line; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(sigCX - W * .085, fy + H * .012); ctx.lineTo(sigCX + W * .085, fy + H * .012); ctx.stroke();
    // الاسم والصفة
    ctx.textAlign = 'center';
    ctx.fillStyle = p.ink;
    ctx.font = `700 ${25 * u}px Cairo, sans-serif`;
    ctx.fillText('همّام الكانمي', sigCX, fy + H * .045);
    ctx.fillStyle = p.dim;
    ctx.font = `500 ${19 * u}px Tajawal, Cairo, sans-serif`;
    ctx.fillText('رئيس فريق النخبة', sigCX, fy + H * .075);

    /* --- ختم الاعتماد + عبارة (وسط-يمين قرب التوقيع) --- */
    drawSeal(ctx, W * .635, fy + H * .01, H * .035, p);
    ctx.fillStyle = p.dim;
    ctx.font = `600 ${17 * u}px Tajawal, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('اعتماد فريق النخبة', W * .635, fy + H * .072);

    /* --- رقم الشهادة (وسط — Micro Typography) --- */
    ctx.direction = 'ltr';
    ctx.fillStyle = p.light ? 'rgba(46,93,75,.5)' : 'rgba(200,205,220,.42)';
    ctx.font = `500 ${15 * u}px 'IBM Plex Sans Arabic', Cairo, monospace`;
    ctx.fillText(S.certNo, certCX, fy + H * .048);
    ctx.direction = 'rtl';

    /* --- الشعار في التذييل (يسار) إن كان موضعه footer --- */
    if (effectiveLogoPos(S, T) === 'footer' && S.logo) {
      const lb = H * .085 * (S.logoSize / 100);
      drawContained(ctx, S.logo, logoCX, fy + H * .01, lb * 1.4, lb);
    } else {
      // مكان الشعار: عبارة تعريفية صغيرة
      ctx.fillStyle = p.dim;
      ctx.font = `600 ${20 * u}px Cairo, sans-serif`;
      ctx.fillText('فريق النخبة', logoCX, fy + H * .012);
      ctx.fillStyle = p.light ? 'rgba(46,93,75,.4)' : 'rgba(200,205,220,.35)';
      ctx.direction = 'ltr';
      ctx.font = `500 ${13 * u}px Cairo, sans-serif`;
      ctx.fillText('ELITE TEAM', logoCX, fy + H * .048);
      ctx.direction = 'rtl';
    }
  }

  /* ---------- موضع الشعار الفعلي ---------- */
  function effectiveLogoPos(S, T) {
    return S.logoPos === 'auto' ? T.logoDefault : S.logoPos;
  }

  function drawLogo(ctx, W, H, S, T, p, u) {
    if (!S.logo) return;
    const pos = effectiveLogoPos(S, T);
    if (pos === 'footer') return; // رُسم في التذييل
    let size = H * .095 * (S.logoSize / 100);
    if (pos === 'top-center') size *= .82;
    let x, y;
    if (pos === 'top-center') { x = W * .5; y = Math.max(H * .06, size * .5 + H * .014); }
    else if (pos === 'top-right') { x = W * .885; y = Math.max(H * .085, size * .5 + H * .014); }
    else { x = W * .115; y = Math.max(H * .085, size * .5 + H * .014); }
    // هالة خفيفة خلف الشعار
    const g = ctx.createRadialGradient(x, y, 0, x, y, size * .9);
    g.addColorStop(0, p.glow); g.addColorStop(1, 'transparent');
    ctx.save();
    ctx.globalAlpha = .5;
    ctx.fillStyle = g;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
    ctx.globalAlpha = 1;
    drawContained(ctx, S.logo, x, y, size * 1.25, size);
    ctx.restore();
  }

  /* ---------- التصدير عالي الدقة ---------- */
  function exportPNG(S, W = 3200, H = 2000) {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    render(c.getContext('2d'), W, H, S);
    return c;
  }

  return { render, exportPNG, defaultLogo, defaultSignature, removeWhiteBg, MONTHS };
})();
