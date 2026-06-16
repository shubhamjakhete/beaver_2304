# Beaver Project 2304 — IndianTown STP Water Monitoring

Real-time dashboard for the IndianTown Sewage Treatment Plant (Project 2304).  
Live at: **https://bew-p2304.com/projects/2304/**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Components | shadcn/ui (Radix UI primitives) |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Data fetching | TanStack React Query v5 |
| Backend | PHP 8 + MySQL (existing cPanel server, unchanged) |
| Deployment | GitHub Actions → FTPS → cPanel |

---

## Dashboard Features

- **Key Performance Indicators** — Total Flow, pH, TDS, ORP with 12-hour sparklines
- **Water Quality** — Dissolved Oxygen, Tank Level, PT1, PT2 with trend charts
- **Electrical Panels** — PS1–PS3 Voltage & Current with full 12-hour area charts
- **Process Status** — Live ON/OFF indicator (based on PT2 sensor threshold)
- **System Alerts** — Automatic threshold warnings for pH, TDS, ORP, DO, Tank Level
- **Sensor Detail Drawer** — Click any of ORP, pH, TDS, DO, PT1, PT2 to open a full historical chart with Weekly / Monthly / Yearly toggle
- **15-minute auto-refresh** via React Query polling
- **Skeleton loading states** on initial load

---

## Project Structure

```
beaver_2304/
├── api/                        # PHP API (lives on cPanel server, not deployed by CI)
│   ├── cors.php                # CORS headers include (for local dev)
│   ├── credentials.php         # DB credentials — NEVER committed, fill on server
│   ├── data.php                # Dashboard endpoint: 12h snapshot + 15-min series
│   └── sensor_history.php      # History endpoint: ?sensor=ph&period=weekly
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (Inter font, React Query provider)
│   │   ├── page.tsx            # Main dashboard page
│   │   ├── providers.tsx       # React Query QueryClientProvider
│   │   └── globals.css         # Tailwind base + shadcn CSS variables
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Header.tsx          # Top nav: logo, project title, Process ON/OFF
│   │   │   ├── KpiCard.tsx         # Mini sparkline KPI card (clickable)
│   │   │   ├── MiniSparkline.tsx   # Recharts area sparkline (auto Y-axis)
│   │   │   ├── ElectricalCard.tsx  # Full 12h electrical panel chart
│   │   │   ├── SensorDrawer.tsx    # Historical detail dialog (Weekly/Monthly/Yearly)
│   │   │   └── StatusAlerts.tsx    # Threshold alert list
│   │   └── ui/                 # shadcn/ui base components
│   │
│   ├── hooks/
│   │   ├── useDashboard.ts     # React Query: polls data.php every 15 min
│   │   └── useSensorHistory.ts # React Query: fetches sensor_history.php on demand
│   │
│   ├── lib/
│   │   ├── api.ts              # Typed fetch helpers (apiGet/Post/Put/Delete)
│   │   └── queryKeys.ts        # Centralised React Query key factory
│   │
│   └── types/
│       └── dashboard.ts        # All TypeScript interfaces + SENSOR_META config
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
│
├── .env.local.example          # Template — copy to .env.local for local dev
├── next.config.mjs             # Static export, basePath /projects/2304
└── tailwind.config.ts          # shadcn color tokens, tailwindcss-animate
```

---

## CI/CD Pipeline

```
Push to main
    │
    ▼
GitHub Actions (ubuntu-latest)
    ├── Checkout code
    ├── Setup Node.js 20
    ├── npm ci
    ├── npm run build          ← injects NEXT_PUBLIC_API_URL from GitHub Secrets
    │     └── Outputs /out/    ← static HTML/CSS/JS
    └── FTP-Deploy-Action
          └── FTPS upload /out/ → /projects/2304/ on cPanel server
```

**Required GitHub Secrets** (Settings → Secrets → Actions):

| Secret | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://bew-p2304.com/projects/2304/api` |
| `FTPS_HOST` | cPanel FTP hostname |
| `FTPS_USER` | cPanel FTP username |
| `FTPS_PASS` | cPanel FTP password |

---

## Database

- **Host:** localhost (cPanel MySQL)
- **Table:** `table20`
- **Credentials:** stored only in `api/credentials.php` on the server — never in this repo

### Column Mapping

| MySQL Column | API / TypeScript key |
|---|---|
| `PH` | `ph` |
| `ORP` | `orp` |
| `DO` | `do_val` |
| `TDS` | `tds` |
| `PT100 1` | `pt100_1` |
| `PT100 2` | `pt100_2` |
| `TANK LEVEL` | `tank_level` |
| `PS1 VOLTAGE` | `ps1_voltage` |
| `PS1 CURRENT` | `ps1_current` |
| `PS2 VOLTAGE` | `ps2_voltage` |
| `PS2 CURRENT` | `ps2_current` |
| `PS3 VOLTAGE` | `ps3_voltage` |
| `PS3 CURRENT` | `ps3_current` |
| `FLOW` | `flow` |
| `TOTAL FLOW MG` | `total_flow_mg` |
| `PROCESS HOURS` | `process_hour` |

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/shubhamjakhete/beaver_2304.git
cd beaver_2304

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.local.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL to your live API or local PHP server

# 4. Run dev server
npm run dev
# → http://localhost:3000/projects/2304

# 5. Build static export
npm run build
# → /out directory ready for upload
```

> The PHP API must be running and accessible at `NEXT_PUBLIC_API_URL` for data to load.  
> During local dev, make sure `api/cors.php` is included in your PHP endpoints (already done).

---

## Sensor Alert Thresholds

| Sensor | Condition | Severity |
|---|---|---|
| pH | < 6.5 or > 8.5 | Warning |
| TDS | > 500 ppm | Warning |
| ORP | < 200 mV | Warning |
| Dissolved Oxygen | < 5 mg/L | Critical |
| Tank Level | < 20 % | Critical |

---

© 2025 IndianTown Water Monitoring System
