---
id: AC-HAND-005
type: acceptance-criterion
title: The device stays raised while any hand is still up
summary: With two remote hands raised, lowering one keeps the device on raised; it shows lowered only after the second is lowered.
status: draft
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The technician console is in the Zoom meeting and the device is receiving its state
  - Two remote participants have a raised hand
  - The device shows raised
when: One of the two remote participants lowers their hand in Zoom
then:
  - The device still shows raised 5 s later
uses-terms:
  - TERM-DEVICE-STATE
  - TERM-TECHNICIAN-CONSOLE
sources:
  - kind: document
    ref: Spec review finding R1, capture session
    date: 2026-11-24
---

## Intent

The device must follow "any hand raised", not the last change, so a second waiting participant isn't dropped. AC-HAND-002 covers the device returning to lowered once the last hand goes down.
