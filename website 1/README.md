# Wedding Invitation Website

A Pakistani Muslim wedding invitation (Barat + Valima) built with plain HTML, CSS and JavaScript. No build step, no backend.

## Run it

Open `index.html` in a browser. To test on your phone, or to publish it, upload the whole `wedding-invitation` folder to any static host (Netlify Drop, GitHub Pages, Vercel, etc.).

## How to customise

**Almost everything is in one place: the `weddingConfig` object at the top of `js/script.js`.**

| What | Where |
|---|---|
| Bride / groom name | `brideName`, `groomName` |
| Barat date & time | `barat.start` — format `"2027-01-15T18:30:00"` (24-hour). Day name, date, time, countdown and calendar file all update automatically |
| Valima date & time | `valima.start` |
| Event length (calendar file) | `durationHours` |
| Venues & addresses | `venue`, `address` |
| Google Maps links | `mapLink`. Open your venue in Google Maps → Share → Copy link → paste. Leave `""` to auto-generate a link from the address |
| Timeline | `timeline` lists — edit the `time` and `label`, add or delete lines |
| WhatsApp RSVP replies (optional) | `rsvpWhatsApp: "923001234567"` |

Also update the **page title, description and Open Graph tags** at the top of `index.html` (social previews read them directly). For link previews, set `og:image` to the full public URL of a photo after you upload the site.

**Images** — replace the files in `assets/` keeping the same names (`bride.jpg`, `groom.jpg`, `gallery-1.jpg` … `gallery-6.jpg`), or edit the `src` / `data-full` paths in the gallery section of `index.html`. Square photos work best for bride/groom. To add more gallery photos, copy one `<li class="gallery__item">` block.

**Music** — put your song at `assets/wedding-music.mp3` (keep the file small, ~2–4 MB). It starts after the guest clicks *Open Invitation*; until you add the file, the music button just does nothing. Only use music you have the right to use.

**Colours** — the `:root` block at the top of `css/style.css` (`--gold`, `--emerald`, `--ivory`, …).

**Fonts** — change the Google Fonts `<link>` in `index.html` and the `--font-display`, `--font-serif`, `--font-sans` variables in `css/style.css`.

**Dress code, quote, intro text** — edit directly in `index.html`.

## Notes

- The RSVP form is front-end only: nothing is stored or sent. If you set `rsvpWhatsApp`, guests get a button to send their reply to you on WhatsApp; otherwise ask guests to reply directly, or connect a free form service later.
- The "Share Invitation" button uses the phone's native share sheet when available, otherwise a WhatsApp link containing the page URL. Share works properly once the site is hosted online.
- Calendar files use the clock time you set, with no time-zone conversion.
