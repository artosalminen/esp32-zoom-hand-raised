---
id: AC-HAND-002
type: acceptance-criterion
title: The device returns to lowered within 3 s of the last hand going down
summary: When the only raised hand is lowered, the device changes from raised to lowered within 3 seconds.
status: draft
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The room PC is in a Zoom meeting with the Participants panel open and the watcher running
  - Exactly one remote participant has a raised hand
  - The device shows raised
when: That remote participant lowers their hand in Zoom
then:
  - The device shows lowered within 3 s of the hand appearing as lowered in the room PC's Participants panel
uses-terms:
  - TERM-DEVICE-STATE
sources:
  - kind: idea
    ref: Capture session with the user, round 1 (Q3)
    date: 2026-11-24
---

## Intent

Shows the signal follows Zoom back down, so the chair isn't left with a stale "raised".
