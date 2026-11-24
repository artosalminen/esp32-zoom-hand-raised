---
id: AC-HAND-004
type: acceptance-criterion
title: The device shows not watching when the Participants panel is closed
summary: When the PC can no longer see the Participants panel, the device shows not watching within 3 seconds.
status: draft
verifies:
  - UC-HAND-001
  - CON-ZOOM-UIA
checked-at: ui
verifiability: verifiable
given:
  - The room PC is in a Zoom meeting with the Participants panel open and the watcher running
  - The device shows lowered
when: The technician closes the Participants panel
then:
  - The device shows not watching within 3 s
uses-terms:
  - TERM-DEVICE-STATE
sources:
  - kind: idea
    ref: Capture session with the user, round 2 (Q10)
    date: 2026-11-24
---

## Intent

Closing the panel is the likeliest way to lose detection without anything crashing. The meeting ending or Zoom closing should behave the same way.
