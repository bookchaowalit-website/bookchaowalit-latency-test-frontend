---
title: "Latency Test — Round-Trip Instrument"
status: "active"
updated: "2026-08-24"
---

# Latency Test — Round-Trip Instrument

## Overview

Latency Test is a small browser instrument, not a monitoring SaaS. The design
makes the causal loop explicit: enter a target, send one request, read the
timing, and inspect the current tab's short trace.

## Colors

- **Midnight void** — `#101719`, the instrument ground.
- **Panel graphite** — `#172124`, grouped controls and primary readout.
- **Instrument cyan** — `#75E4D2`, live signal, active control, and healthy state.
- **Readout amber** — `#F2B866`, average/secondary numeric emphasis.
- **Failure red** — `#EF765E`, reserved for failed requests.
- **Technical line** — `#3A5150`, one-pixel grid and panel boundaries.

## Typography

- Avenir Next / Trebuchet MS handles labels and explanatory copy.
- A system monospace stack carries URLs, measurements, timestamps, and status
  labels.
- Large numerals are monospace so changing values keep their instrument
  character.

## Layout

- A restrained top bar labels the browser/local boundary.
- The hero pairs the question with a radar-like current-average readout.
- The target probe is the first functional panel.
- Current reading, average, and measurement log follow the request lifecycle.
- Mobile stacks panels and keeps the target control full width.

## Elevation & Depth

- Depth is made from dark panel steps and ring lines, not shadows.
- The radar is a flat instrument face with concentric rules and a single sweep.
- A live dot may pulse; reduced motion freezes it.

## Shapes

- Panels are square with one-pixel borders.
- Buttons are rectangular and technical.
- Signal tracks and log rows use straight edges; no decorative rounded cards.

## Components

- **Target probe** — URL input, ping action, and local preset targets.
- **Radar readout** — average timing shown as a visual instrument.
- **Current reading** — latest result, target host, and response status.
- **Measurement log** — capped to twelve in-memory browser readings.
- Failed requests remain visible and are labeled rather than hidden.

## Do's and Don'ts

- Do state that CORS and network conditions affect the result.
- Do keep this browser-only behavior honest.
- Do make waiting, success, and failure visible.
- Don't imply server-side uptime or global observability.
- Don't use a generic analytics dashboard for a timing tool.
- Don't make motion necessary to understand the measurement.

