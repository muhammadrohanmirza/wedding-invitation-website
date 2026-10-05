/* =====================================================
   WEDDING INVITATION — SCRIPT
   ★ EDIT ONLY THE weddingConfig OBJECT BELOW ★
   Everything on the page is filled in from this object.
   ===================================================== */

const weddingConfig = {
  brideName: "Ayesha",
  groomName: "Ahmed",

  // Optional: WhatsApp number (with country code, digits only, e.g. "923001234567").
  // If set, guests get a button after RSVP to send their reply to you on WhatsApp.
  // Leave "" to disable. (RSVPs are NOT stored anywhere — there is no backend.)
  rsvpWhatsApp: "",

  barat: {
    // Start date & time in 24-hour format: "YYYY-MM-DDTHH:MM:SS"
    // This one value drives the date, day, time, countdown and calendar file.
    start: "2027-01-15T18:30:00",
    durationHours: 4.5,                    // used for the calendar file
    venue: "The Grand Emerald Banquet",
    address: "Main Boulevard, Gulberg, Lahore",
    // Paste a Google Maps share link, or leave "" to auto-create one from the address.
    mapLink: "",
    // Timeline: edit, add or remove lines freely.
    timeline: [
      { time: "6:30 PM",  label: "Guests Arrival" },
      { time: "7:30 PM",  label: "Barat Arrival" },
      { time: "8:00 PM",  label: "Nikah" },
      { time: "8:30 PM",  label: "Dinner" },
      { time: "10:00 PM", label: "Farewell" }
    ]
  },

  valima: {
    start: "2027-01-16T19:00:00",
    durationHours: 4,
    venue: "Royal Garden Marquee",
    address: "DHA Phase 5, Lahore",
    mapLink: "",
    timeline: [
      { time: "7:00 PM",  label: "Guests Arrival" },
      { time: "8:00 PM",  label: "Reception" },
      { time: "8:30 PM",  label: "Dinner" },
      { time: "10:30 PM", label: "Celebration" }
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
  const events = ["barat", "valima"];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Helpers: dates & text ---------- */
  const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const dayFmt  = new Intl.DateTimeFormat("en-GB", { weekday: "long" });
  const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
  const shortFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" });

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
      monogram: weddingConfig.brideName.charAt(0) + " & " + weddingConfig.groomName.charAt(0)
    };
    events.forEach((ev) => {
      const c = weddingConfig[ev];
      const d = new Date(c.start);
      view[ev + ".date"] = dateFmt.format(d);
      view[ev + ".day"] = dayFmt.format(d);
      view[ev + ".time"] = timeFmt.format(d);
      view[ev + ".venue"] = c.venue;
      view[ev + ".address"] = c.address;
    });
    const b = new Date(weddingConfig.barat.start);
    const v = new Date(weddingConfig.valima.start);
    const sameDay = b.toDateString() === v.toDateString();
    view.heroDateRange = sameDay
      ? dateFmt.format(b)
      : shortFmt.format(b) + " & " + dateFmt.format(v);
    view.footerDate = view.heroDateRange;
    return view;
  }

  /* ---------- Fill the page from the config ---------- */
  function populate() {
    const view = buildView();
    $$("[data-bind]").forEach((el) => {
      const key = el.getAttribute("data-bind");
      if (key in view) el.textContent = view[key];
    });

    // Map links
    $$("[data-map]").forEach((a) => { a.href = mapUrl(a.getAttribute("data-map")); });

    // Timelines
    events.forEach((ev) => {
      const list = $("#timeline-" + ev);
      list.innerHTML = "";
      weddingConfig[ev].timeline.forEach((item) => {
        const li = document.createElement("li");
        li.className = "timeline__item";
        const t = document.createElement("span");
        t.className = "timeline__time";
        t.textContent = item.time;
        const l = document.createElement("span");
        l.className = "timeline__label";
        l.textContent = item.label;
        li.append(t, l);
        list.appendChild(li);
      });
    });

    // Page title
    document.title = weddingConfig.brideName + " & " + weddingConfig.groomName + " — Wedding Invitation";
    renderVenue("barat");
  }

  /* ---------- Falling petals ---------- */
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

  /* ---------- Open invitation ---------- */
  const audio = $("#weddingAudio");
  const musicBtn = $("#musicBtn");
  const musicIcon = $("#musicIcon");

  function openInvitation() {
    const main = $("#main");
    document.body.classList.remove("is-locked");
    ["#siteHeader", "#main", "#siteFooter", "#musicBtn"].forEach((s) => { $(s).hidden = false; });
    main.classList.add("is-revealing");
    setupReveal();
    onScroll();

    // Music starts only now, after a user click (browsers block autoplay otherwise)
    startMusic();

    $("#openBtn").hidden = true;
    requestAnimationFrame(() => {
      main.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    });
  }

  /* ---------- Music ---------- */
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
          musicBtn.setAttribute("aria-label", "Music file not found — add assets/wedding-music.mp3");
          musicBtn.title = "Add your music file at assets/wedding-music.mp3";
        });
      }
    } else {
      audio.pause();
      setMusicUi(false);
    }
  });

  /* ---------- Scroll reveal ---------- */
  function setupReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Nav (mobile menu) ---------- */
  const navToggle = $("#navToggle");
  const siteNav = $("#siteNav");
  function closeNav() {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
  navToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  siteNav.addEventListener("click", (e) => { if (e.target.closest("a")) closeNav(); });

  /* ---------- Back to top ---------- */
  const topBtn = $("#topBtn");
  function onScroll() {
    if (!$("#main").hidden) topBtn.hidden = window.scrollY < 600;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------- Countdown ---------- */
  let countdownEvent = "barat";
  const cd = {
    days: $("#cd-days"), hours: $("#cd-hours"),
    minutes: $("#cd-minutes"), seconds: $("#cd-seconds"),
    box: $("#countdown-display"), done: $("#cd-done")
  };
  const pad = (n) => String(n).padStart(2, "0");

  function tickCountdown() {
    const target = new Date(weddingConfig[countdownEvent].start).getTime();
    const diff = target - Date.now();
    if (isNaN(target) || diff <= 0) {
      cd.box.hidden = true;
      cd.done.hidden = false;
      return;
    }
    cd.box.hidden = false;
    cd.done.hidden = true;
    const s = Math.floor(diff / 1000);
    cd.days.textContent = pad(Math.floor(s / 86400));
    cd.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    cd.seconds.textContent = pad(s % 60);
  }
  $$("[data-countdown-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      countdownEvent = btn.getAttribute("data-countdown-tab");
      $$("[data-countdown-tab]").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
      });
      tickCountdown();
    });
  });

  /* ---------- Venue tabs ---------- */
  function renderVenue(ev) {
    const c = weddingConfig[ev];
    const d = new Date(c.start);
    $("#venue-name").textContent = c.venue;
    $("#venue-address").textContent = c.address;
    $("#venue-when").textContent = ev.charAt(0).toUpperCase() + ev.slice(1) + " · " + dateFmt.format(d) + " · " + timeFmt.format(d);
    $("#venue-directions").href = mapUrl(ev);
  }
  $$("[data-venue-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("[data-venue-tab]").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
      });
      renderVenue(btn.getAttribute("data-venue-tab"));
    });
  });

  /* ---------- Gallery lightbox ---------- */
  const lightbox = $("#lightbox");
  const lbImage = $("#lbImage");
  const lbCaption = $("#lbCaption");
  const galleryImgs = $$("#gallery-grid img");
  let lbIndex = 0;
  let lastFocus = null;

  function showPhoto(i) {
    lbIndex = (i + galleryImgs.length) % galleryImgs.length;
    const img = galleryImgs[lbIndex];
    lbImage.src = img.getAttribute("data-full") || img.src;
    lbImage.alt = img.alt;
    lbCaption.textContent = (lbIndex + 1) + " / " + galleryImgs.length;
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    showPhoto(i);
    lightbox.hidden = false;
    document.body.classList.add("is-locked");
    $("#lbClose").focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("is-locked");
    if (lastFocus) lastFocus.focus();
  }
  galleryImgs.forEach((img, i) => {
    img.closest("button").addEventListener("click", () => openLightbox(i));
  });
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => showPhoto(lbIndex - 1));
  $("#lbNext").addEventListener("click", () => showPhoto(lbIndex + 1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") showPhoto(lbIndex - 1);
    else if (e.key === "ArrowRight") showPhoto(lbIndex + 1);
    else if (e.key === "Tab") {
      // keep keyboard focus inside the lightbox
      const f = $$("button", lightbox);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Swipe support on touch screens
  let touchX = null;
  lightbox.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showPhoto(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ---------- RSVP form (front-end only — nothing is stored) ---------- */
  const form = $("#rsvpForm");
  const success = $("#rsvpSuccess");

  function setError(inputEl, errId, msg) {
    $("#" + errId).textContent = msg;
    if (inputEl) inputEl.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name;
    const guests = form.elements.guests;
    const eventSel = form.elements.event.value;
    const attendance = form.elements.attendance.value;
    let firstBad = null;
    const fail = (el) => { if (!firstBad) firstBad = el; };

    const nameVal = name.value.trim();
    if (nameVal.length < 2) { setError(name, "rsvpNameError", "Please enter your full name."); fail(name); }
    else setError(name, "rsvpNameError", "");

    const g = Number(guests.value);
    const needsGuests = attendance !== "Regretfully Decline";
    if (needsGuests && (!Number.isInteger(g) || g < 1 || g > 10)) {
      setError(guests, "rsvpGuestsError", "Please enter a number of guests from 1 to 10."); fail(guests);
    } else setError(guests, "rsvpGuestsError", "");

    if (!eventSel) { setError(null, "rsvpEventError", "Please choose an event."); fail($("input[name=event]")); }
    else setError(null, "rsvpEventError", "");

    if (!attendance) { setError(null, "rsvpAttendanceError", "Please let us know if you can attend."); fail($("input[name=attendance]")); }
    else setError(null, "rsvpAttendanceError", "");

    if (firstBad) { firstBad.focus(); return; }

    // Success: purely a front-end message. Nothing is sent or saved.
    form.hidden = true;
    success.hidden = false;

    const waBtn = $("#rsvpWhatsAppBtn");
    const number = String(weddingConfig.rsvpWhatsApp || "").replace(/\D/g, "");
    if (number) {
      const msg = "RSVP for " + weddingConfig.brideName + " & " + weddingConfig.groomName + "\n" +
        "Name: " + nameVal + "\n" +
        "Event: " + eventSel + "\n" +
        "Response: " + attendance +
        (needsGuests ? "\nGuests: " + g : "");
      waBtn.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(msg);
      waBtn.hidden = false;
    }
    success.focus();
    success.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
  });

  /* ---------- Add to calendar (.ics) ---------- */
  function icsStamp(date) {
    // "floating" local time: the event shows at the same clock time in the guest's calendar
    return date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()) +
      "T" + pad(date.getHours()) + pad(date.getMinutes()) + "00";
  }
  function icsEscape(s) {
    return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  }
  function downloadIcs(ev) {
    const c = weddingConfig[ev];
    const start = new Date(c.start);
    const end = new Date(start.getTime() + c.durationHours * 3600 * 1000);
    const label = ev.charAt(0).toUpperCase() + ev.slice(1);
    const title = label + " — " + weddingConfig.brideName + " & " + weddingConfig.groomName;
    const now = new Date();
    const stamp = now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate()) +
      "T" + pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds()) + "Z";

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding Invitation//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:" + ev + "-" + icsStamp(start) + "@wedding-invitation",
      "DTSTAMP:" + stamp,
      "DTSTART:" + icsStamp(start),
      "DTEND:" + icsStamp(end),
      "SUMMARY:" + icsEscape(title),
      "LOCATION:" + icsEscape(c.venue + ", " + c.address),
      "DESCRIPTION:" + icsEscape("You are invited to the " + label + ". Directions: " + mapUrl(ev)),
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:" + icsEscape(label + " is tomorrow"),
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ];
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ev + "-invitation.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $$("[data-ics]").forEach((btn) => {
    btn.addEventListener("click", () => downloadIcs(btn.getAttribute("data-ics")));
  });

  /* ---------- Share ---------- */
  const shareBtn = $("#shareBtn");
  const waShare = $("#whatsappShare");
  function shareData() {
    return {
      title: weddingConfig.brideName + " & " + weddingConfig.groomName + " — Wedding Invitation",
      text: "You are warmly invited to the wedding of " + weddingConfig.brideName + " & " + weddingConfig.groomName + ".",
      url: window.location.href.split("#")[0]
    };
  }
  if (navigator.share) {
    shareBtn.hidden = false;
    shareBtn.addEventListener("click", () => {
      navigator.share(shareData()).catch(() => { /* user cancelled */ });
    });
  } else {
    waShare.hidden = false;
    const d = shareData();
    waShare.href = "https://wa.me/?text=" + encodeURIComponent(d.text + " " + d.url);
  }

  /* ---------- Init ---------- */
  $("#openBtn").addEventListener("click", openInvitation);
  populate();
  createPetals();
  tickCountdown();
  setInterval(tickCountdown, 1000);

  // Smooth in-page links are handled by CSS (scroll-behavior); offset for the fixed header:
  document.documentElement.style.scrollPaddingTop = "64px";
})();
