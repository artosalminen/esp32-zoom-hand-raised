# AGENTS.md

Guidance for coding agents working in this repository.

## What this is

A watcher on a Windows PC detects raised hands in the Zoom desktop client and signals an ESP32
device on the chair's table over Wi-Fi. See [README.md](README.md) for the overview.

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

- Detection reads the Zoom desktop client through Windows UI Automation only. No Zoom Meeting
  SDK bot, REST API, webhooks, screen capture or OCR (`CON-ZOOM-UIA`).
- The text that marks a raised hand and the room PC's own row lives in a configuration file,
  with English and Finnish values, never hard-coded.
- PC and device talk over Wi-Fi. The device shows **not watching** on power-on and after 10 s
  without a message from the PC.
- Device states are three distinct steady LED colours, no blinking (`TERM-DEVICE-STATE`).

## Layout

No code yet. When adding it, keep the two programs apart, for example `watcher/` (Windows PC)
and `firmware/` (ESP32), each with its own build and run instructions in a `README.md`.

## Working rules

- Don't commit, push or open pull requests unless asked.
- Never commit Wi-Fi credentials or device addresses; keep them in local, git-ignored config.
