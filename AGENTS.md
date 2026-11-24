# AGENTS.md

Guidance for coding agents working in this repository.

## What this is

A technician console on the technician's PC joins a Zoom meeting through the Zoom Meeting SDK
for Web, detects raised hands, and signals an ESP32 device on the chair's table over Wi-Fi. See
[README.md](README.md) for the overview.

## Specification first

- The specification in `docs/specification/` is the source of truth for behaviour. Read
  `docs/specification/README.md` and the relevant element files before changing behaviour.
- One element per file. Edit the element files only; `README.md`, `STATUS.md` and `pages/` in
  that folder are generated and must not be edited by hand.
- Change the specification through the capture workflow
  (`/forge-planning-and-requirements:capture`), in the same pull request as the code.
- Ideas that come up but aren't in scope go to `docs/specification/parked.md`, one dated line each.
- Acceptance criteria (`AC-HAND-*`) define "done". Name tests after the criterion they verify.

## Fixed decisions

- Detection uses only the participant information from the Zoom Meeting SDK for Web in the
  technician console. No reading of the Zoom desktop client, screen capture, REST API or
  webhooks (`CON-ZOOM-WEBSDK`).
- The Zoom app lives in the Zoom account that hosts the meetings. The console joins with the
  app's SDK signature only, under a configured name: no user sign-in, ZAK or OBF. An app from
  another account is refused with error 4011 (tested; see `spikes/websdk-raise-hand/README.md`).
- Re-read the whole participant list at least every 500 ms; don't rely on `user-updated` events
  alone. "Lower all hands" can lower hands without sending an event for each. Events also arrive
  twice.
- The console is a page served at localhost by a program on the technician's PC. No cloud
  server. The Zoom app's secret stays in that program and is never sent to the browser page.
- The console joins the saved meeting automatically, with no microphone or camera, and never
  unmutes. It retries every 30 s before the meeting starts and waits in the waiting room.
- The program and the device talk over Wi-Fi. The device shows **not watching** on power-on and
  after 10 s without a message.
- Device states are three distinct steady colours (RGB LED) or symbols (monochrome display), no
  blinking, with one exception: the board's single-colour built-in LED blinks twice a second
  while raised (`BLINK_WHEN_RAISED`, on by default; `TERM-DEVICE-STATE`, `UC-HAND-001`).

## Layout

- `console/`: technician's PC, a localhost Node program (`server.mjs`, no dependencies) and the
  web page (`index.html`). Config in `config.local.json`.
- `firmware/`: ESP32-C3 with 0.42" OLED, PlatformIO (pioarduino platform, Arduino core 3.x).
  Wi-Fi networks and token in `include/secrets.h`.
- `spikes/`: throwaway tests; don't build on them.

Each folder's `README.md` has build, run and test instructions.

## Working rules

- Don't commit, push or open pull requests unless asked.
- Never commit secrets: Zoom app credentials, Zoom tokens, Wi-Fi credentials, device
  addresses or meeting IDs and passcodes. Keep them in local, git-ignored config.
