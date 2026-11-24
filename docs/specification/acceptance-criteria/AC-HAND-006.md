---
id: AC-HAND-006
type: acceptance-criterion
title: The console's own raised hand is ignored
summary: A hand raised by the console's own participant doesn't change the device from lowered.
status: retired
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The technician console is in the Zoom meeting and the device is receiving its state
  - No hand is raised in the meeting
  - The device shows lowered
when: The technician raises the console's own hand in Zoom
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

Only remote participants' hands count; the console's own hand would otherwise light the device for a hand nobody in Zoom is waiting with.
