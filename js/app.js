/* ============================================================
   استوديو شهادات النخبة — منطق التطبيق (كليًا Client-side)
   ============================================================ */
(() => {
  const $ = id => document.getElementById(id);
  const canvas = $('preview');
  const ctx = canvas.getContext('2d');

  /* ---------- الحالة ---------- */
  const state = {
    name: 'تقوى الغزالي',
    titleId: 'tharwa',
    month: 'أغسطس',
    monthIdx: 8,
    year: 2026,
    text: $('inText').value,
    certNo: '',
    logo: CERT.defaultLogo(400, '#d4af6a'),
    logoPos: 'auto',
    logoSize: 100,
    sig: CERT.defaultSignature(),
    sigSize: 100,
    sigX: 0,
    sigY: 0,
    nameSize: 120,
    textSize: 40
  };

  /* ---------- الشهور ---------- */
  const monthSel = $('inMonth');
  CERT.MONTHS.forEach((m, i) => {
    const o = document.createElement('option');
    o.value = i + 1; o.textContent = m;
    if (m === 'أغسطس') o.selected = true;
    monthSel.appendChild(o);
  });

  /* ---------- رقم الشهادة ---------- */
  function genCertNo() {
    const y = state.year || new Date().getFullYear();
    const m = String(state.monthIdx || 1).padStart(2, '0');
    const seq = String(Math.floor(Math.random() * 899) + 100);
    state.certNo = `ELITE-${y}-${m}-${seq}`;
    $('inCertNo').value = state.certNo;
  }

  /* ---------- الرسم ---------- */
  let raf = null;
  function draw() {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      CERT.render(ctx, canvas.width, canvas.height, state);
      const T = ELITE_THEMES[state.titleId];
      const badge = $('pvTheme');
      badge.textContent = T.label;
      badge.style.borderColor = T.badge + '66';
      badge.style.color = T.badge;
      badge.style.background = T.badge + '18';
    });
  }

  /* ---------- ربط الحقول ---------- */
  $('inName').addEventListener('input', e => { state.name = e.target.value; draw(); });
  $('inTitle').addEventListener('change', e => { state.titleId = e.target.value; draw(); });
  monthSel.addEventListener('change', e => {
    state.monthIdx = +e.target.value;
    state.month = CERT.MONTHS[state.monthIdx - 1];
    genCertNo(); draw();
  });
  $('inYear').addEventListener('input', e => {
    state.year = +e.target.value || 2026;
    genCertNo(); draw();
  });
  $('inText').addEventListener('input', e => { state.text = e.target.value; draw(); });
  $('btnCertNo').addEventListener('click', () => { genCertNo(); draw(); toast('تم توليد رقم شهادة جديد'); });

  /* ---------- Sliders ---------- */
  function bindSlider(id, valId, key, unit = '') {
    const el = $(id);
    const upd = () => {
      const min = +el.min, max = +el.max, v = +el.value;
      el.style.setProperty('--fill', ((v - min) / (max - min) * 100) + '%');
      $(valId).textContent = v + unit;
      state[key] = v;
      draw();
    };
    el.addEventListener('input', upd);
    upd();
  }
  bindSlider('inNameSize', 'vNameSize', 'nameSize');
  bindSlider('inTextSize', 'vTextSize', 'textSize');
  bindSlider('inLogoSize', 'vLogoSize', 'logoSize');
  bindSlider('inSigSize', 'vSigSize', 'sigSize');
  bindSlider('inSigX', 'vSigX', 'sigX');
  bindSlider('inSigY', 'vSigY', 'sigY');

  $('inLogoPos').addEventListener('change', e => { state.logoPos = e.target.value; draw(); });

  /* ---------- رفع الشعار (PNG / JPG / SVG) ---------- */
  $('inLogo').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      state.logo = img;
      $('logoName').textContent = f.name;
      const t = $('logoThumb');
      t.innerHTML = ''; t.appendChild(thumb(img)); t.classList.add('show');
      draw();
      toast('تم تحميل الشعار داخل الحاوية المعتمدة');
    };
    img.onerror = () => toast('تعذّر قراءة ملف الشعار');
    img.src = url;
  });

  /* ---------- رفع التوقيع + إزالة الخلفية البيضاء ---------- */
  let sigRaw = null;
  function processSignature() {
    if (!sigRaw) return;
    if ($('inSigRemoveBg').checked) {
      CERT.removeWhiteBg(sigRaw, cleaned => {
        state.sig = cleaned;
        const t = $('sigThumb');
        t.innerHTML = ''; t.appendChild(thumb(cleaned)); t.classList.add('show');
        draw();
      });
    } else {
      state.sig = sigRaw;
      const t = $('sigThumb');
      t.innerHTML = ''; t.appendChild(thumb(sigRaw)); t.classList.add('show');
      draw();
    }
  }
  $('inSig').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      sigRaw = img;
      $('sigName').textContent = f.name;
      processSignature();
      toast('تم تحميل التوقيع');
    };
    img.onerror = () => toast('تعذّر قراءة ملف التوقيع');
    img.src = url;
  });
  $('inSigRemoveBg').addEventListener('change', processSignature);

  function thumb(src) {
    const i = document.createElement('img');
    i.src = src.toDataURL ? src.toDataURL() : src.src;
    return i;
  }

  /* ---------- التصدير PNG عالي الدقة ---------- */
  $('btnExport').addEventListener('click', () => {
    const btn = $('btnExport');
    btn.disabled = true; btn.textContent = 'جارٍ التصدير…';
    // نضمن اكتمال الخطوط قبل التصدير
    document.fonts.ready.then(() => {
      setTimeout(() => {
        const T = ELITE_THEMES[state.titleId];
        const out = CERT.exportPNG(state, 3200, 2000);
        const a = document.createElement('a');
        const safeName = (state.name || 'مستحق').trim().replace(/\s+/g, '-');
        a.download = `شهادة-${T.short}-${safeName}.png`;
        a.href = out.toDataURL('image/png');
        a.click();
        btn.disabled = false; btn.textContent = 'تصدير الشهادة PNG عالي الجودة';
        toast('تم تصدير الشهادة بدقة 3200×2000');
      }, 60);
    });
  });

  /* ---------- إعادة ضبط / شهادة جديدة ---------- */
  function resetAll() {
    $('inName').value = 'تقوى الغزالي';
    $('inTitle').value = 'tharwa';
    monthSel.value = '8';
    $('inYear').value = 2026;
    $('inText').value = 'تقديرًا لتميّزها وإسهامها الفاعل، وما قدمته من جهدٍ تجاوز المهام الموكلة إليها، وأسهم في دفع العمل قدمًا خلال شهر أغسطس 2026.';
    $('inLogoPos').value = 'auto';
    $('inLogoSize').value = 100; $('inNameSize').value = 120; $('inTextSize').value = 40;
    $('inSigSize').value = 100; $('inSigX').value = 0; $('inSigY').value = 0;
    ['inLogoSize','inNameSize','inTextSize','inSigSize','inSigX','inSigY'].forEach(id =>
      $(id).dispatchEvent(new Event('input')));
    $('logoName').textContent = 'الشعار الافتراضي';
    $('sigName').textContent = 'توقيع افتراضي';
    $('logoThumb').classList.remove('show');
    $('sigThumb').classList.remove('show');
    state.name = 'تقوى الغزالي';
    state.titleId = 'tharwa';
    state.monthIdx = 8; state.month = 'أغسطس'; state.year = 2026;
    state.text = $('inText').value;
    state.logo = CERT.defaultLogo(400, '#d4af6a');
    state.logoPos = 'auto';
    sigRaw = null;
    state.sig = CERT.defaultSignature();
    genCertNo();
    draw();
  }
  $('btnReset').addEventListener('click', () => { resetAll(); toast('تمت إعادة الضبط'); });
  $('btnNew').addEventListener('click', () => { resetAll(); toast('شهادة جديدة جاهزة'); });

  /* ---------- Toast ---------- */
  let toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  /* ---------- معاينة سريعة عبر ?t= (اختبار الألقاب) ---------- */
  const qt = new URLSearchParams(location.search).get('t');
  if (qt && ELITE_THEMES[qt]) { state.titleId = qt; $('inTitle').value = qt; }

  /* ---------- تشغيل أولي بعد تحميل الخطوط ---------- */
  genCertNo();
  const fontLoads = [
    '900 90px Cairo', '700 30px Cairo', '600 26px Cairo',
    '500 28px Tajawal', '700 25px Cairo'
  ].map(f => document.fonts.load(f).catch(() => {}));
  Promise.all(fontLoads).then(draw);
  document.fonts.ready.then(draw);
  draw();
})();
