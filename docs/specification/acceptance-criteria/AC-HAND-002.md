---
id: AC-HAND-002
type: acceptance-criterion
title: The device returns to lowered within 3 s of the last hand going down
summary: When the only raised hand is lowered, the device changes from raised to lowered within 3 seconds.
status: agreed
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The technician console is in the Zoom meeting and the device is receiving its state
  - Exactly one remote participant has a raised hand
  - The device shows raised
when: That remote participant lowers their hand in Zoom
then:
  - The device shows lowered within 3 s of the participant lowering it
uses-terms:
  - TERM-DEVICE-STATE
  - TERM-TECHNICIAN-CONSOLE
sources:
  - kind: idea
    ref: Capture session with the user, round 1 (Q3)
    date: 2026-11-24
---

## Intent

Shows the signal follows Zoom back down, so the chair isn't left with a stale "raised".
