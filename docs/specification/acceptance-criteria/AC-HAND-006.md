---
id: AC-HAND-006
type: acceptance-criterion
title: The room PC's own raised hand is ignored
summary: A hand raised by the room PC's own Zoom user doesn't change the device from lowered.
status: draft
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The room PC is in a Zoom meeting with the Participants panel open and the watcher running
  - No hand is raised in the meeting
  - The device shows lowered
when: The technician raises the room PC's own hand in Zoom
then:
  - The device still shows lowered 5 s later
uses-terms:
  - TERM-DEVICE-STATE
sources:
  - kind: idea
    ref: Capture session with the user, round 1 (Q1)
    date: 2026-11-24
---

## Intent

Only remote participants' hands count; the room PC's own hand would otherwise light the device for a hand nobody in Zoom is waiting with.
