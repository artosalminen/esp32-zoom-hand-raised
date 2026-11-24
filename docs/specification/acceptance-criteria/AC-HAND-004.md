---
id: AC-HAND-004
type: acceptance-criterion
title: The device shows not watching when the meeting ends
summary: When the host ends the meeting, the device shows not watching within 3 seconds.
status: draft
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The technician console is in the Zoom meeting and the device is receiving its state
  - The device shows lowered
when: The host ends the meeting for all
then:
  - The device shows not watching within 3 s
uses-terms:
  - TERM-DEVICE-STATE
  - TERM-TECHNICIAN-CONSOLE
sources:
  - kind: idea
    ref: Capture session with the user, round 2 (Q10) and round 4 (Q14)
    date: 2026-11-24
---

## Intent

The meeting ends every time, while the console keeps running; the chair must not be left with a "lowered" nobody is backing up. The console being removed or sent back to the waiting room is covered by UC-HAND-001's failure handling and should behave the same way.
