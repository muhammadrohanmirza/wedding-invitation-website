// =====================================================
//    WEDDING INVITATION — SCRIPT
//    ★ EDIT ONLY THE weddingConfig OBJECT BELOW ★
//    Everything on the page is filled in from this object.
//    ===================================================== 

const weddingConfig = {
  brideName: "Mahnoor Fatima",
  groomName: "Haris Pervaiz",

  barat: {
    // Start date & time in 24-hour format: "YYYY-MM-DDTHH:MM:SS"
    // This one value drives the date, day and time.
    start: "2026-12-28T20:30:00",
    // OPTIONAL display text. Leave "" to fill in automatically from `start`.
    // e.g. date: "15 January 2027", day: "Friday", time: "6:30 PM Onwards"
    date: "",
    day: "",
    time: "",
    venue: "The Grand Rose Banquet",
    address: "Main Boulevard, Gulberg, Lahore",
    // Paste a Google Maps link (Share → Copy link), or leave "" to auto-create one from the address.
    mapLink: "",
    // Timeline: edit, add or remove lines freely.
    timeline: [
      { time: "8:30 PM",  label: "Guests Arrival" },
      { time: "9:30 PM",  label: "Barat Arrival" },
      { time: "9:00 PM",  label: "Nikah" },
      { time: "9:30 PM",  label: "Dinner" },
      { time: "10:00 PM", label: "Farewell" }
    ]
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
      groomName: weddingConfig.groomName
    };
    events.forEach((ev) => {
      const c = weddingConfig[ev];
      const d = new Date(c.start);
      // Use the optional text from the config if given, otherwise build it from `start`
      view[ev + ".date"] = c.date || dateFmt.format(d);
      view[ev + ".day"] = c.day || dayFmt.format(d);
      view[ev + ".time"] = c.time || timeFmt.format(d);
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

    // Timelines
    events.forEach((ev) => {
      const list = $("#timeline-" + ev);
      list.innerHTML = "";
      weddingConfig[ev].timeline.forEach((item) => {
        const li = document.createElement("li");
        li.className = "timeline__item";
        // small blossom marker for each entry
        const svgNS = "http://www.w3.org/2000/svg";
        const bloom = document.createElementNS(svgNS, "svg");
        bloom.setAttribute("class", "timeline__bloom");
        bloom.setAttribute("viewBox", "0 0 40 40");
        bloom.setAttribute("aria-hidden", "true");
        const use = document.createElementNS(svgNS, "use");
        use.setAttribute("href", "#blossom");
        bloom.appendChild(use);
        const t = document.createElement("span");
        t.className = "timeline__time";
        t.textContent = item.time;
        const l = document.createElement("span");
        l.className = "timeline__label";
        l.textContent = item.label;
        li.append(bloom, t, l);
        list.appendChild(li);
      });
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
  const pageIds = ["cover", "bismillah", "intro", "event", "timeline", "venue", "closing"];
  const pageTitles = ["Cover", "Bismillah", "Our Story", "Barat", "Timeline", "Venue", "Thank You"];
  const pages = pageIds.map((id) => $("#page-" + id));

  const mq = window.matchMedia("(max-width: 819px)");
  let single = mq.matches;
  let leaves = [];
  let state = 0;          // how many leaves are turned
  let opened = false;

  const maxState = () => leaves.length - 1;               // last spread = Venue | Thank You

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

  /* ---------- Init ---------- */
  populate();
  createPetals();
  rebuild();
})();
