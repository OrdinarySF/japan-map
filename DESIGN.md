# Design System: Japan Trip Map

## 1. Visual Theme & Atmosphere

**Mood**: Night-time travel tool under street light and subway light — calm, dense with information but quiet, zero tourism brochure energy.

**Metaphor**: A folded day plan clipped to a dark map, not a travel magazine.

**Density**: Comfortable density on phone; header collapses; primary surface is map + day sheet.

## 2. Color Palette & Roles (OKLCH)

| Token | Value | Role |
|-------|--------|------|
| `--bg` | `oklch(0.16 0.02 250)` | App canvas / map chrome |
| `--surface` | `oklch(0.22 0.025 250)` | Panels, header, footer |
| `--surface-2` | `oklch(0.28 0.03 250)` | Cards, inputs |
| `--border` | `oklch(0.38 0.02 250)` | Hairlines |
| `--ink` | `oklch(0.96 0.01 250)` | Primary text |
| `--ink-muted` | `oklch(0.72 0.02 250)` | Secondary text (≥4.5:1 on surface) |
| `--accent` | `oklch(0.62 0.16 255)` | Primary actions, selection |
| `--accent-2` | `oklch(0.72 0.14 200)` | Secondary / links |
| `--ok` | `oklch(0.72 0.14 150)` | Hotel / success chips |
| `--warn` | `oklch(0.78 0.12 75)` | Offline banner |
| `--danger` | `oklch(0.68 0.14 25)` | Errors |

**Strategy**: Restrained dark — neutrals tinted slightly cool-blue; one accent for actions.

## 3. Typography

- **Family**: system-ui / -apple-system / "PingFang SC" / "Hiragino Sans GB" / "Microsoft YaHei"
- **Scale** (rem): 0.65 / 0.72 / 0.78 / 0.88 / 1.05 / 1.15
- **Weights**: 500 labels, 600 titles, 400 body
- No display fonts; no fluid hero type

## 4. Layout

- **Shell**: header (collapsible) → map flex 1 → footer version
- **Floating**: day sheet (bottom-right, primary), nav sheet (top-left, secondary)
- **Safe areas**: `env(safe-area-inset-*)` on header/footer/floaters
- **Z-index**: map 0 · float 10 · header 20 · unlock 50

## 5. Components

- **Day sheet cards**: expand for tip + nav origins + actions
- **Seg tips**: compact transit lines between stops (no left stripe >1px)
- **Buttons**: solid accent primary; ghost secondary; no border+huge shadow
- **Unlock**: centered card, single password field
- **Radius**: 10–12px cards, 999 pills; never 24px+ on panels

## 6. Elevation & Depth

Prefer border + slight surface step over heavy blur glass. Backdrop blur only on float sheets if needed.

## 7. Do's and Don'ts

**Do**: high-contrast muted text; one accent for CTA; today timeline first  
**Don't**: tourism gradients, side-stripe cards, glassmorphism everywhere, hero metrics
