// =====================================================
//    WEDDING INVITATION — SCRIPT
//    ★ EDIT ONLY THE weddingConfig OBJECT BELOW ★
//    Everything on the page is filled in from this object.
//    ===================================================== 

const weddingConfig = {
  // Couple (shown on the cover, the invitation page and the thank-you page)
  brideName: "Mahnoor Fatima",
  groomName: "Haris Pervaiz",

  // Parents' names (shown on the invitation page)
  // brideParents = the family that invites (top line), groomParents = shown after "Son of ..."
  brideParents: "MR. & MRS. Mahmood Ahmed",
  groomParents: "Mr. & Mrs. Pervaiz",

  // "Download Card" button: leave "" and the site draws a card picture (PNG) from the details below,
  // or put the path of your own designed card here, e.g. "assets/wedding-card.jpg", and that file is downloaded instead.
  cardFile: "assets/Wedding-Card-Sample.png",

  barat: {
    // Start date & time in 24-hour format: "YYYY-MM-DDTHH:MM:SS"
    // This one value drives the date, day and time.
    start: "2026-12-28T20:30:00",
    // OPTIONAL display text. Leave "" to fill in automatically from `start`.
    // e.g. date: "Monday, 28 Dec 2026", time: "8:30 PM"
    date: "",
    day: "",
    time: "",
    // Small line under the time, e.g. "(After Maghrib)". Leave "" to hide it.
    timeNote: "(After Maghrib)",
    // Islamic date line under the date. "" = worked out automatically (can differ by a day from
    // the local moon sighting), or type your own e.g. "(Rajab 17, 1448 H)", or "off" to hide it.
    hijri: "",
    venue: "Rabiya lawn",
    address: "Rabia lawn, Hijri Rd, Quetta Town, Lawyers' Colony Sector 18 A Gulzar E Hijri Scheme 33, Karachi, Pakistan",
    // Paste a Google Maps link (Share → Copy link), or leave "" to auto-create one from the address.
    mapLink: "https://maps.app.goo.gl/9wf8tpiQxdERiCHM8"
  }
};

/* =====================================================
   Everything below this line is the site's behaviour.
   You do not need to change it.
   ===================================================== */
(function () {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const events = ["barat"];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Helpers: dates & text ---------- */
  const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const dayFmt  = new Intl.DateTimeFormat("en-GB", { weekday: "long" });
  const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
  const shortDateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

  // Islamic (Hijri) date, e.g. "(Rajab 17, 1448 H)"
  const hijriMonths = ["Muharram", "Safar", "Rabi ul Awal", "Rabi ul Akhir", "Jumada ul Awal", "Jumada ul Akhir",
    "Rajab", "Shaban", "Ramadan", "Shawwal", "Zul Qadah", "Zul Hijjah"];
  function hijriText(d) {
    try {
      const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", { day: "numeric", month: "numeric", year: "numeric" }).formatToParts(d);
      const get = (t) => (parts.find((p) => p.type === t) || {}).value || "";
      const name = hijriMonths[parseInt(get("month"), 10) - 1];
      if (!name) return "";
      return "(" + name + " " + parseInt(get("day"), 10) + ", " + get("year").replace(/\D/g, "") + "\u00a0H)";
    } catch (e) { return ""; }
  }

  function mapUrl(ev) {
    const link = (weddingConfig[ev].mapLink || "").trim();
    if (/^https?:\/\//i.test(link)) return link;
    const q = weddingConfig[ev].venue + ", " + weddingConfig[ev].address;
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  }

  // Values used for data-bind="..." elements
  function buildView() {
    const view = {
      brideName: weddingConfig.brideName,
      groomName: weddingConfig.groomName,
      groomParents: weddingConfig.groomParents,
      brideParents: weddingConfig.brideParents
    };
    events.forEach((ev) => {
      const c = weddingConfig[ev];
      const d = new Date(c.start);
      // Use the optional text from the config if given, otherwise build it from `start`
      view[ev + ".date"] = c.date || dateFmt.format(d);
      view[ev + ".day"] = c.day || dayFmt.format(d);
      view[ev + ".time"] = c.time || timeFmt.format(d);
      view[ev + ".dateLine"] = c.date || ((c.day || dayFmt.format(d)) + ", " + shortDateFmt.format(d));
      view[ev + ".timeNote"] = c.timeNote || "";
      view[ev + ".hijri"] = c.hijri === "off" ? "" : (c.hijri || hijriText(d));
      view[ev + ".venue"] = c.venue;
      view[ev + ".address"] = c.address;
    });
    view.heroDateRange = dateFmt.format(new Date(weddingConfig.barat.start));
    view.footerDate = view.heroDateRange;
    return view;
  }

  /* ---------- Fill the pages from the config ---------- */
  function populate() {
    const view = buildView();
    $$("[data-bind]").forEach((el) => {
      const key = el.getAttribute("data-bind");
      if (key in view) el.textContent = view[key];
    });

    // Page title
    document.title = weddingConfig.brideName + " & " + weddingConfig.groomName + " — Wedding Invitation";
    renderVenue("barat");
  }

  /* ---------- Falling petals (background) ---------- */
  function createPetals() {
    if (prefersReducedMotion) return;
    const box = $("#petals");
    const count = window.innerWidth < 640 ? 14 : 24;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      const size = 8 + Math.random() * 12;
      p.className = "petal";
      p.style.cssText =
        "left:" + Math.random() * 100 + "%;" +
        "width:" + size + "px;height:" + size + "px;" +
        "animation-duration:" + (9 + Math.random() * 10) + "s;" +
        "animation-delay:-" + Math.random() * 16 + "s;" +
        "--drift:" + (Math.random() * 120 - 60) + "px;";
      box.appendChild(p);
    }
  }

  /* ---------- Music ---------- */
  const audio = $("#weddingAudio");
  const musicBtn = $("#musicBtn");
  const musicIcon = $("#musicIcon");

  function setMusicUi(playing) {
    musicBtn.classList.toggle("is-playing", playing);
    musicBtn.setAttribute("aria-pressed", String(playing));
    musicBtn.setAttribute("aria-label", playing ? "Pause music" : "Play music");
    musicIcon.setAttribute("href", playing ? "#i-pause" : "#i-music");
  }
  function startMusic() {
    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(() => setMusicUi(true)).catch(() => setMusicUi(false)); // file missing or blocked: fail silently
    }
  }
  musicBtn.addEventListener("click", () => {
    if (audio.paused) {
      const p = audio.play();
      if (p && p.catch) {
        p.then(() => setMusicUi(true)).catch(() => {
          musicBtn.setAttribute("aria-label", "Music file not found");
          musicBtn.title = "Music file not found in the assets folder";
        });
      }
    } else {
      audio.pause();
      setMusicUi(false);
    }
  });

  /* =====================================================
     THE BOOK
     Desktop: two pages side by side (each leaf has a front and a back page).
     Phone:   one page at a time (each leaf is one page).
     ===================================================== */
  const stage = $("#stage");
  const book = $("#book");
  const store = $("#pageStore");
  const dotsBox = $("#dots");
  const pageLabel = $("#pageLabel");
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");

  // Order of the pages = order in the book
  const pageIds = ["cover", "bismillah", "intro", "event", "venue", "closing"];
  const pageTitles = ["Cover", "Bismillah", "Invitation", "Barat", "Venue", "Thank You"];
  const pages = pageIds.map((id) => $("#page-" + id));

  const mq = window.matchMedia("(max-width: 819px)");
  let single = mq.matches;
  let leaves = [];
  let state = 0;          // how many leaves are turned
  let opened = false;

  // Phone: last leaf = last page. Desktop: with an even number of pages the last spread is "Thank You | back cover"
  const maxState = () => (single || pages.length % 2 === 1 ? leaves.length - 1 : leaves.length);

  function buildBook() {
    pages.forEach((p) => store.appendChild(p));            // park the pages
    $$(".leaf", book).forEach((l) => l.remove());
    leaves = [];
    const count = single ? pages.length : Math.ceil(pages.length / 2);
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement("div");
      leaf.className = "leaf";
      const front = document.createElement("div");
      front.className = "face face--front";
      const back = document.createElement("div");
      back.className = "face face--back";
      if (single) {
        front.appendChild(pages[i]);
        back.classList.add("face--blank");
      } else {
        front.appendChild(pages[2 * i]);
        if (pages[2 * i + 1]) back.appendChild(pages[2 * i + 1]);
        else back.classList.add("face--blank");
      }
      leaf.append(front, back);
      book.appendChild(leaf);
      leaves.push(leaf);
    }
    book.classList.toggle("book--single", single);
  }

  function buildDots() {
    dotsBox.innerHTML = "";
    for (let s = 0; s <= maxState(); s++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dot";
      b.setAttribute("aria-label", "Go to page " + (s + 1));
      b.addEventListener("click", () => goTo(s));
      dotsBox.appendChild(b);
    }
  }

  function labelFor(s) {
    if (single) return pageTitles[s];
    if (s === 0) return pageTitles[0];
    return 2 * s < pages.length ? pageTitles[2 * s - 1] + " · " + pageTitles[2 * s] : pageTitles[2 * s - 1];
  }

  function render(instant) {
    leaves.forEach((leaf, i) => {
      const flipped = i < state;
      const was = leaf.classList.contains("is-flipped");
      leaf.classList.toggle("is-flipped", flipped);
      clearTimeout(leaf._zt);
      if (flipped) {
        leaf.style.zIndex = 100 + i;                         // turning leaf stays on top
      } else if (was && !instant) {
        leaf.style.zIndex = 100 + i;
        leaf._zt = setTimeout(() => {
          if (!leaf.classList.contains("is-flipped")) leaf.style.zIndex = 100 - i;
        }, 1250);
      } else {
        leaf.style.zIndex = 100 - i;
      }
    });
    book.dataset.state = state === 0 ? "closed" : "open";
    prevBtn.disabled = state <= 0;
    nextBtn.disabled = state >= maxState();
    $$(".dot", dotsBox).forEach((d, i) => d.classList.toggle("is-active", i === state));
    pageLabel.textContent = labelFor(state);
  }

  function setState(s) {
    state = Math.max(0, Math.min(maxState(), s));
    render(false);
  }
  function next() { if (opened) setState(state + 1); }
  function prev() { if (opened) setState(state - 1); }

  // Jump to a page: turn the leaves one after another
  function goTo(target) {
    clearTimeout(goTo._t);
    target = Math.max(0, Math.min(maxState(), target));
    const step = () => {
      if (state === target) return;
      setState(state + (target > state ? 1 : -1));
      goTo._t = setTimeout(step, prefersReducedMotion ? 0 : 260);
    };
    step();
  }

  function openBook() {
    if (opened) return;
    opened = true;
    stage.classList.add("is-open");
    musicBtn.hidden = false;
    startMusic();                                            // music starts after the user's click
    setTimeout(() => setState(1), prefersReducedMotion ? 0 : 150);
  }

  // Switching between phone and desktop layout
  function onModeChange() {
    if (mq.matches === single) return;
    single = mq.matches;
    state = single ? (state === 0 ? 0 : 2 * state - 1) : (state === 0 ? 0 : Math.ceil(state / 2));
    rebuild();
  }
  function rebuild() {
    book.classList.add("no-anim");
    buildBook();
    buildDots();
    render(true);
    void book.offsetWidth;                                   // apply without animating
    book.classList.remove("no-anim");
  }
  if (mq.addEventListener) mq.addEventListener("change", onModeChange);
  else if (mq.addListener) mq.addListener(onModeChange);

  $("#openBtn").addEventListener("click", openBook);
  book.addEventListener("click", () => { if (!opened) openBook(); });
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  document.addEventListener("keydown", (e) => {
    if (!opened) {
      if (e.key === "Enter" && (document.activeElement === document.body)) openBook();
      return;
    }
    if (e.key === "ArrowRight" || e.key === "PageDown") next();
    else if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
  });

  // Swipe to turn pages on touch screens
  let touchX = null, touchY = null;
  stage.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) next(); else prev(); }
    touchX = touchY = null;
  });

  /* ---------- Venue ---------- */
  function renderVenue(ev) {
    const c = weddingConfig[ev];
    const d = new Date(c.start);
    $("#venue-name").textContent = c.venue;
    $("#venue-address").textContent = c.address;
    $("#venue-when").textContent = ev.charAt(0).toUpperCase() + ev.slice(1) + " · " + dateFmt.format(d) + " · " + timeFmt.format(d);
    $("#venue-directions").href = mapUrl(ev);
  }

  /* ---------- Download card (offline copy of the invitation) ---------- */
  function triggerDownload(href, filename) {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function wrapLines(ctx, text, maxW) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach((w) => {
      const t = line ? line + " " + w : w;
      if (line && ctx.measureText(t).width > maxW) { lines.push(line); line = w; } else { line = t; }
    });
    if (line) lines.push(line);
    return lines;
  }

  // Turns one of the page's SVG flower drawings into a picture the canvas can draw
  function loadSprite(symbolId, size) {
    return new Promise((resolve) => {
      try {
        const sprite = document.querySelector('svg[width="0"]');
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="' + size + '" height="' + size + '">' +
          sprite.innerHTML + '<use href="#' + symbolId + '"/></svg>';
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      } catch (e) { resolve(null); }
    });
  }

  function drawCard(ctx, W, H, v, flower) {
    const GOLD = "#D6B27A", ROSE = "#8E4A56", GOLD_DEEP = "#8F6B2E", MUTED = "#75616A", DARK = "#3F3033";
    const cx = W / 2;
    const SERIF = '"Cormorant Garamond", Georgia, serif';
    const SCRIPT = '"Great Vibes", "Cormorant Garamond", cursive';
    const ARABIC = '"Amiri", "Traditional Arabic", serif';

    // paper + flowers + double border
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#FFFDF9"); g.addColorStop(1, "#FBEBEC");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (flower) {
      ctx.drawImage(flower, -50, -50, 420, 420);
      ctx.save(); ctx.translate(W, H); ctx.scale(-1, -1); ctx.drawImage(flower, -50, -50, 420, 420); ctx.restore();
    }
    ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.strokeRect(36, 36, W - 72, H - 72);
    ctx.globalAlpha = 0.6; ctx.lineWidth = 1.5; ctx.strokeRect(56, 56, W - 112, H - 112); ctx.globalAlpha = 1;

    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    let y = 210;
    const line = (str, font, color, dy) => { ctx.font = font; ctx.fillStyle = color; ctx.fillText(str, cx, y); y += dy; };
    const para = (str, font, color, lh, maxW) => {
      ctx.font = font; ctx.fillStyle = color;
      wrapLines(ctx, str, maxW || 800).forEach((l) => { ctx.fillText(l, cx, y); y += lh; });
    };
    const ornament = () => {
      ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(cx - 200, y); ctx.lineTo(cx - 26, y); ctx.moveTo(cx + 26, y); ctx.lineTo(cx + 200, y); ctx.stroke();
      ctx.fillStyle = GOLD; ctx.beginPath();
      ctx.moveTo(cx, y - 10); ctx.lineTo(cx + 10, y); ctx.lineTo(cx, y + 10); ctx.lineTo(cx - 10, y); ctx.closePath(); ctx.fill();
    };

    // Bismillah
    ctx.direction = "rtl";
    line("بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", "64px " + ARABIC, ROSE, 62);
    ctx.direction = "ltr";
    ornament(); y += 80;

    // Invitation text
    line(v.brideParents, "700 48px " + SERIF, ROSE, 64);
    para("With hearts full of joy and a home filled with blessings, we invite you to celebrate the beautiful beginning of a new journey as our beloved daughter", "400 35px " + SERIF, MUTED, 49);
    y += 72;
    line(v.brideName, "100px " + SCRIPT, GOLD_DEEP, 62);
    line("joins hands and hearts with", "italic 400 36px " + SERIF, MUTED, 96);
    line(v.groomName, "100px " + SCRIPT, GOLD_DEEP, 66);
    line("Son of " + v.groomParents, "italic 600 40px " + SERIF, DARK, 56);
    ornament(); y += 72;
    para("As two souls unite in love and commitment, your gracious presence will make this cherished occasion even more memorable.", "400 35px " + SERIF, MUTED, 49);
    y += 24;
    para("We look forward to celebrating this special day with you.", "700 40px " + SERIF, ROSE, 54);
    y += 10;

    // Barat ceremony details
    ornament(); y += 92;
    line("Barat Ceremony", "italic 700 64px " + SERIF, ROSE, 44);
    ornament(); y += 92;

    const cols = [
      { label: "Date", value: v["barat.dateLine"], note: v["barat.hijri"] },
      { label: "Time", value: v["barat.time"], note: v["barat.timeNote"] },
      { label: "Venue", value: v["barat.venue"], note: v["barat.address"] }
    ];
    const colW = 290, gap = 10, x0 = cx - (3 * colW + 2 * gap) / 2;
    ctx.font = "600 33px " + SERIF;
    const prepared = cols.map((c) => {
      ctx.font = "600 33px " + SERIF; const vl = wrapLines(ctx, c.value || "", colW - 30);
      ctx.font = "400 29px " + SERIF; const nl = c.note ? wrapLines(ctx, c.note, colW - 30) : [];
      return { c, vl, nl, h: 58 + vl.length * 44 + (nl.length ? 12 + nl.length * 38 : 0) };
    });
    const colH = Math.max.apply(null, prepared.map((p) => p.h));
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.globalAlpha = 0.8;
    [1, 2].forEach((i) => { const lx = x0 + i * (colW + gap) - gap / 2 - 0; ctx.beginPath(); ctx.moveTo(lx, y - 40); ctx.lineTo(lx, y - 40 + colH + 10); ctx.stroke(); });
    ctx.globalAlpha = 1;
    prepared.forEach((p, i) => {
      const x = x0 + colW / 2 + i * (colW + gap);
      let yy = y;
      ctx.fillStyle = ROSE; ctx.font = "700 42px " + SERIF; ctx.fillText(p.c.label, x, yy); yy += 58;
      ctx.fillStyle = DARK; ctx.font = "600 33px " + SERIF;
      p.vl.forEach((l) => { ctx.fillText(l, x, yy); yy += 44; });
      if (p.nl.length) {
        yy += 12; ctx.fillStyle = MUTED; ctx.font = "400 29px " + SERIF;
        p.nl.forEach((l) => { ctx.fillText(l, x, yy); yy += 38; });
      }
    });
    y += colH + 40;
    para("Your gracious presence will be an honour for our family.", "700 38px " + SERIF, ROSE, 52, 760);
    return y;
  }

  async function buildCardBlob() {
    const view = buildView();
    try {
      if (document.fonts && document.fonts.load) {
        await Promise.all(['700 40px "Cormorant Garamond"', 'italic 600 40px "Cormorant Garamond"', '40px "Great Vibes"', '40px "Amiri"'].map((f) => document.fonts.load(f)));
      }
    } catch (e) { /* use fallback fonts */ }
    const flower = await loadSprite("floral-corner", 420);
    const W = 1080;
    // first pass: find out how tall the card needs to be
    const probe = document.createElement("canvas");
    probe.width = W; probe.height = 3200;
    const endY = drawCard(probe.getContext("2d"), W, 3200, view, null);
    const H = Math.round(Math.max(1700, endY + 150));
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    drawCard(cv.getContext("2d"), W, H, view, flower);
    return new Promise((resolve, reject) => cv.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"));
  }

  const dlBtn = $("#downloadCard");
  dlBtn.addEventListener("click", async () => {
    const file = (weddingConfig.cardFile || "").trim();
    if (file) { triggerDownload(file, file.split("/").pop()); return; }   // your own designed card
    const label = $(".dl-label", dlBtn);
    const original = label.textContent;
    dlBtn.disabled = true;
    label.textContent = "Preparing…";
    try {
      const blob = await buildCardBlob();
      const url = URL.createObjectURL(blob);
      const name = (weddingConfig.groomName + "-" + weddingConfig.brideName).replace(/[^A-Za-z0-9]+/g, "-") + "-Wedding-Card.png";
      triggerDownload(url, name);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      label.textContent = "Card Downloaded";
    } catch (e) {
      label.textContent = "Try Again";
    }
    setTimeout(() => { label.textContent = original; dlBtn.disabled = false; }, 2200);
  });

  /* ---------- Init ---------- */
  populate();
  createPetals();
  rebuild();
})();
