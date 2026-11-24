---
id: AC-HAND-001
type: acceptance-criterion
title: A raised hand shows on the device within 3 s
summary: When a remote participant raises their hand, the device changes from lowered to raised within 3 seconds.
status: draft
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The technician console is in the Zoom meeting and the device is receiving its state
  - No hand is raised in the meeting
  - The device shows lowered
when: A remote participant raises their hand in Zoom
then:
  - The device shows raised within 3 s of the participant raising it
uses-terms:
  - TERM-DEVICE-STATE
  - TERM-TECHNICIAN-CONSOLE
sources:
  - kind: idea
    ref: Capture session with the user, round 1 (Q3)
    date: 2026-11-24
---

## Intent

Pins down the core promise and its 3-second limit.
