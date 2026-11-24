---
id: AC-HAND-008
type: acceptance-criterion
title: A device with a display shows how many hands are raised
summary: With two remote hands raised the display shows 2, and after one is lowered it shows 1, each within 3 seconds.
status: agreed
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The device has a display
  - The technician console is in the Zoom meeting and the device is receiving its state
  - Two remote participants have a raised hand
  - The device shows raised and the display shows 2
when: One of the two remote participants lowers their hand in Zoom
then:
  - The display shows 1 within 3 s of the participant lowering their hand
  - The device still shows raised
uses-terms:
  - TERM-DEVICE-STATE
  - TERM-TECHNICIAN-CONSOLE
sources:
  - kind: idea
    ref: Capture session, hand count on a display
    date: 2026-11-24
---

## Intent

Proves the display shows the count, not just "any hand raised": an "any hand" signal would still show something non-zero, but not change from 2 to 1.
