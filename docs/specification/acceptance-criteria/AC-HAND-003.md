---
id: AC-HAND-003
type: acceptance-criterion
title: The device shows not watching when the PC goes silent
summary: When the device stops hearing from the PC, it shows not watching within 10 seconds, on its own.
status: agreed
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The technician console is in the Zoom meeting and the device is receiving its state
  - The device shows lowered
when: The program on the technician's PC is stopped
then:
  - The device shows not watching within 10 s
uses-terms:
  - TERM-DEVICE-STATE
  - TERM-TECHNICIAN-CONSOLE
sources:
  - kind: idea
    ref: Capture session with the user, rounds 1 and 2 (Q3, Q10)
    date: 2026-11-24
---

## Intent

The chair must never trust a "lowered" that nobody is backing up. This tests only the console program being stopped. The PC going to sleep and Wi-Fi being lost aren't tested here; the use case's 10-second rule covers them.
