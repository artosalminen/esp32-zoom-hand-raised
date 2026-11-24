---
id: AC-HAND-012
type: acceptance-criterion
title: The built-in LED stops blinking when the last hand goes down
summary: With blinking turned on, the built-in LED is off within 3 seconds of the last raised hand being lowered, and stays off.
status: agreed
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The device has a built-in LED and blinking is turned on in its firmware build setting
  - The technician console is in the Zoom meeting and the device is receiving its state
  - Exactly one remote participant has a raised hand and the built-in LED is blinking
when: That remote participant lowers their hand in Zoom
then:
  - Within 3 s of the participant lowering it, the built-in LED is off
  - The built-in LED stays off for the next 10 s
uses-terms:
  - TERM-DEVICE-STATE
  - TERM-TECHNICIAN-CONSOLE
sources:
  - kind: document
    ref: Spec review finding R1, blinking built-in LED
    date: 2026-11-24
---

## Intent

A light that keeps blinking after every hand is down would make the chair look for a hand that isn't there.
