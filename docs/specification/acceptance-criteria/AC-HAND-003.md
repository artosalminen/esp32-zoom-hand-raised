---
id: AC-HAND-003
type: acceptance-criterion
title: The device shows not watching when the PC goes silent
summary: When the device stops hearing from the PC, it shows not watching within 10 seconds, on its own.
status: draft
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The room PC is in a Zoom meeting with the Participants panel open and the watcher running
  - The device shows lowered
when: The watcher on the PC is stopped
then:
  - The device shows not watching within 10 s
uses-terms:
  - TERM-DEVICE-STATE
sources:
  - kind: idea
    ref: Capture session with the user, rounds 1 and 2 (Q3, Q10)
    date: 2026-11-24
---

## Intent

The chair must never trust a "lowered" that nobody is backing up. This tests only the watcher being stopped. The PC going to sleep and Wi-Fi being lost aren't tested here; the use case's 10-second rule covers them.
