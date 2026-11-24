---
id: TERM-TECHNICIAN-CONSOLE
type: glossary-term
title: Technician console
summary: The part of the system on the technician's own PC that joins the Zoom meeting under a configured name, watches for raised hands and tells the device what to show.
status: agreed
synonyms:
  - console
defined-in: BC-HAND-SIGNAL
uses-terms: []
sources:
  - kind: idea
    ref: Capture session, technician console intention, and review finding R10
    date: 2026-11-24
---

## Definition

What the technician runs on their own PC. It joins the meeting under the name set in its configuration, with no microphone and no camera, and never unmutes. It reads which participants have a raised hand and tells the device the current state over Wi-Fi. In the meeting it's one participant.

## Distinguish from

- The room PC: the AV technician's computer running the standard Zoom desktop client for the room's audio and video. It's an ordinary participant to the console.
- The device: the ESP32 on the chair's table, which only shows the state the console sends.
