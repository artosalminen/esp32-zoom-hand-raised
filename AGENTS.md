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
- The console joins as the technician's own signed-in Zoom user (ZAK), because meetings are
  hosted on another Zoom account. Not OBF.
- The console is a page served at localhost by a program on the technician's PC. No cloud
  server. The developer app's secret and the technician's Zoom tokens stay in that program and
  are never sent to the browser page.
- The console joins the saved meeting automatically, with no microphone or camera, and never
  unmutes. It retries every 30 s before the meeting starts and waits in the waiting room.
- The program and the device talk over Wi-Fi. The device shows **not watching** on power-on and
  after 10 s without a message.
- Device states are three distinct steady LED colours, no blinking (`TERM-DEVICE-STATE`).

## Layout

No code yet. When adding it, keep the two programs apart, for example `console/` (technician's
PC: localhost program and web page) and `firmware/` (ESP32), each with its own build and run
instructions in a `README.md`.

## Working rules

- Don't commit, push or open pull requests unless asked.
- Never commit secrets: Zoom developer app credentials, Zoom tokens, Wi-Fi credentials, device
  addresses or meeting IDs and passcodes. Keep them in local, git-ignored config.
