# Wedding Invitation Website — Pink Rose Edition

A Pakistani Muslim wedding invitation (Barat + Valima) built with plain HTML, CSS and JavaScript. No build step, no backend, no RSVP, no sharing features.

## Run it

Open `index.html` in a browser. To publish it, upload the whole `wedding-invitation` folder to any static host (Netlify Drop, GitHub Pages, Vercel, etc.).

## How to customise

**Almost everything is in one place: the `weddingConfig` object at the top of `js/script.js`.**

| What | Where |
|---|---|
| Bride / groom name | `brideName`, `groomName` |
| Barat date & time | `barat.start` — format `"2027-01-15T18:30:00"` (24-hour). Date, day name, time, countdown and calendar file all follow from it |
| Valima date & time | `valima.start` |
| Custom wording for date / day / time | optional `date`, `day`, `time` fields (e.g. `time: "6:30 PM Onwards"`). Leave `""` to auto-fill |
| Event length (calendar end time) | `durationHours` |
| Venues & addresses | `venue`, `address` |
| Google Maps links | `mapLink`. Open your venue in Google Maps → Share → Copy link → paste. Leave `""` to auto-generate a link from the address |
| Calendar event description | optional `description`. Leave `""` for a default message |
| Timeline | `timeline` lists — edit `time` and `label`, add or delete lines |
| Developer WhatsApp contact (footer) | `contact.whatsapp` — digits only, with country code |

Also update the **page title, description and Open Graph tags** at the top of `index.html` (social previews read them directly). For link previews, set `og:image` to the full public URL of a photo after you upload the site.

**Images** — replace the files in `assets/` keeping the same names (`bride.jpg`, `groom.jpg`, `gallery-1.jpg` … `gallery-6.jpg`), or edit the `src` / `data-full` paths in the gallery section of `index.html`. Square photos work best for bride/groom. To add more gallery photos, copy one `<li class="gallery__item">` block.

**Music** — put your song at `assets/wedding-music.mp3` (keep it small, ~2–4 MB). It starts after the guest clicks *Open Invitation*. Only use music you have the right to use.

**Colours** — the `:root` block at the top of `css/style.css` (`--rose`, `--blush`, `--champagne`, …).

**Fonts** — change the Google Fonts `<link>` in `index.html` and the `--font-display`, `--font-script`, `--font-sans` variables in `css/style.css`.

**Flowers** — the roses, leaves and blossoms are drawn as SVG in the sprite at the top of `index.html` (no image files). Their pink shades are the `g-p1`, `g-p2`, `g-p3` gradients there.

**Dress code, quote, intro text** — edit directly in `index.html`.

## Notes

- *Save Barat Date* / *Save Valima Date* download `.ics` calendar files built from `weddingConfig` (title, start, end, venue, address, description). They use the clock time you set, with no time-zone conversion.
- The footer credit and its WhatsApp contact link are in the `<footer>` of `index.html`.
