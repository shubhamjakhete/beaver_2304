# Beaver Project 2304 — IndianTown STP Water Monitoring

Dark, tabbed SCADA-style dashboard for IndianTown STP (Project 2304).  
Live: **https://bew-p2304.com/projects/2304/**

Visual language matches the Beaver EcoWorks 2403 dashboard (navy / cyan), while **all data fields and PHP APIs remain 2304-specific**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, **static export**) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + CSS variables (dark SCADA theme) |
| Fonts | Space Grotesk, IBM Plex Mono, Inter |
| Charts / gauges | Recharts + custom SVG radial gauges + CSS tank capsule |
| Data fetching | TanStack React Query v5 |
| Backend | PHP + MySQL on cPanel (**unchanged** by frontend deploys) |
| Deployment | GitHub Actions → FTPS → cPanel |

`basePath`: `/projects/2304` · `trailingSlash: true` · `images.unoptimized: true`

---

## Dashboard UI

### Tabs (bottom nav)

| Tab | Route | Content |
|---|---|---|
| **Overview** | `/` | Pressure gauges, water quality LCDs, process readouts, tank + flow sparklines, PS1–PS3 electrical tiles |
| **Trends** | `/trends/` | Per-sensor cards with MIN/MAX/AVG + sparkline; periods **12H / Weekly / Monthly / Yearly** |
| **Controls** | `/controls/` | Placeholder (“Coming soon”) |
| **Alarms** | `/alarms/` | Placeholder (“Coming soon”) |

### Overview panels

- **Pressure** — `pt100_1`, `pt100_2` as radial gauges  
- **Water Quality** — `ph`, `orp`, `tds`, `do_val`  
- **Process Readouts** — `flow`, `total_flow_mg`, `process_hour`, last-updated time  
- **Tank Levels** — vertical capsule + 12h sparkline for `tank_level`  
- **Flow Sensor** — current + delta + 12h sparkline  
- **Electrical Panels** — PS1/PS2/PS3 voltage (left) + current (right)

### Header

- Village + Beaver logos (`public/images/`)
- Live clock / date
- **LIVE** vs **Data Delayed** badge  
  - LIVE = `created_at` within **600 seconds** of browser time  
  - Comment in code: this is **browser-clock-dependent** (unlike 2403’s server-side `is_live`)

### Trends data sources

| Period | Source |
|---|---|
| **12H** | `data.php` → 48 × 15-minute buckets |
| **Weekly / Monthly / Yearly** | `sensor_history.php?sensor=…&period=…` |

History endpoint sensors: `ph`, `orp`, `tds`, `do_val`, `pt100_1`, `pt100_2`.  
12H Trends also includes `tank_level`, `flow`, `total_flow_mg`.

### Polling

- Dashboard: React Query every **15 minutes**; keeps last successful payload (`placeholderData`)
- Sensor history: fetched on demand when Trends period ≠ 12H

---

## Project Structure

```
beaver_2304/
├── api/                              # Upload manually to cPanel — NOT deployed by CI
│   ├── cors.php
│   ├── credentials.php               # gitignored — fill on server only
│   ├── data.php                      # latest snapshot + 12h series
│   └── sensor_history.php            # weekly / monthly / yearly averages
│
├── public/images/
│   ├── village.jpg
│   └── beaver-logo.png
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                # TitleBar + BottomNav chrome
│   │   ├── page.tsx                  # Overview
│   │   ├── trends/page.tsx
│   │   ├── controls/page.tsx
│   │   ├── alarms/page.tsx
│   │   ├── providers.tsx
│   │   └── globals.css               # Dark SCADA CSS variables
│   │
│   ├── components/dashboard/
│   │   ├── TitleBar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── PanelShell.tsx
│   │   ├── RadialGauge.tsx
│   │   ├── TankCapsule.tsx
│   │   ├── LcdCard.tsx
│   │   ├── ChartCard.tsx
│   │   ├── ElectricalPanelTile.tsx
│   │   └── PlaceholderPanel.tsx
│   │
│   ├── hooks/
│   │   ├── useDashboard.ts
│   │   └── useSensorHistory.ts
│   │
│   ├── lib/
│   │   ├── api.ts                    # fetch helpers → data.php / sensor_history.php
│   │   ├── format.ts
│   │   └── utils.ts
│   │
│   └── types/dashboard.ts            # Field types + SENSOR_META (do not rename keys)
│
├── .github/workflows/deploy.yml
├── .env.local.example
├── next.config.mjs
└── tailwind.config.ts
```

---

## CI/CD Pipeline

```
Push to main  (or Actions → Run workflow)
    │
    ▼
GitHub Actions
    ├── npm ci
    ├── npm run build   ← NEXT_PUBLIC_API_URL from Secrets
    │     └── /out/
    └── FTPS upload /out/ → /bew-p2304.com/projects/2304/
```

**Important**

- CI uploads **only** the Next.js static `/out` folder.
- **PHP under `api/` is never deployed by Actions** — upload/edit those files on the server via cPanel File Manager.
- `api/credentials.php` is **gitignored**. Never commit DB passwords.

### Required GitHub Secrets

| Secret | Example / notes |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://bew-p2304.com/projects/2304/api` |
| `FTPS_HOST` | hostname only (no `https://`) |
| `FTPS_USER` | cPanel FTP user (try `kumarb` or `kumarb@domain`) |
| `FTPS_PASS` | current FTP password |

### FTPS path

```yaml
server-dir: /bew-p2304.com/projects/2304/
```

Paths are **FTP-root-relative** (not `/home/kumarb/...`). Wrong paths create folders in the wrong place.

### Common deploy error: `530 Login authentication failed`

Build succeeded; login failed. Update `FTPS_*` secrets and re-run the workflow. Test the same host/user/pass in FileZilla first.

---

## Database

| Setting | Value |
|---|---|
| Host | `localhost` |
| Table | `table20` |
| Credentials | `api/credentials.php` **on the server only** |

### Column → TypeScript keys

| MySQL column | API / TS key |
|---|---|
| `PH` | `ph` |
| `ORP` | `orp` |
| `DO` | `do_val` |
| `TDS` | `tds` |
| `PT100 1` | `pt100_1` |
| `PT100 2` | `pt100_2` |
| `TANK LEVEL` | `tank_level` |
| `PS1 VOLTAGE` / `PS1 CURRENT` | `ps1_voltage` / `ps1_current` |
| `PS2 VOLTAGE` / `PS2 CURRENT` | `ps2_voltage` / `ps2_current` |
| `PS3 VOLTAGE` / `PS3 CURRENT` | `ps3_voltage` / `ps3_current` |
| `FLOW` | `flow` |
| `TOTAL FLOW MG` | `total_flow_mg` |
| `PROCESS HOURS` | `process_hour` |

Spaced names must use backticks in SQL. Values are `number | null` (decimals / negatives allowed).

---

## Local Development

```bash
git clone https://github.com/shubhamjakhete/beaver_2304.git
cd beaver_2304
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL to the live API or a local PHP host

npm run dev
# → http://localhost:3000/projects/2304/

npm run build
# → ./out  (same artifact CI uploads)
```

Static assets under `public/` are referenced with **relative** paths (e.g. `images/village.jpg`) so they resolve correctly under `/projects/2304/` on cPanel.

---

## Server checklist (one-time / after PHP changes)

1. Ensure `bew-p2304.com/projects/2304/` exists on cPanel.  
2. Upload `api/cors.php`, `data.php`, `sensor_history.php`, and a filled `credentials.php`.  
3. Confirm Secrets are set; push to `main` or **Run workflow**.  
4. Smoke-test:  
   - UI: `https://bew-p2304.com/projects/2304/`  
   - API: `https://bew-p2304.com/projects/2304/api/data.php`

---

## Related project

Frontend styling is aligned with **beaver_2403** (Effluent Treatment Skid). Do **not** rename 2304 fields to 2403 names (`pt100_1` stays `pt100_1`, not `air_tank_pt1_psi`).

---

© IndianTown Water Monitoring System · Beaver EcoWorks
