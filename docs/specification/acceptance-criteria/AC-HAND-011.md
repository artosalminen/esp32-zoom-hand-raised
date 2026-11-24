---
id: AC-HAND-011
type: acceptance-criterion
title: The built-in LED blinks while a hand is raised
summary: With blinking turned on, the built-in LED starts blinking about twice a second within 3 seconds of a hand going up.
status: agreed
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The device has a built-in LED and blinking is turned on in its firmware build setting
  - The technician console is in the Zoom meeting and the device is receiving its state
  - No remote participant has a raised hand and the built-in LED is off
when: A remote participant raises their hand in Zoom
then:
  - Within 3 s of the participant raising it, the built-in LED starts blinking
  - Counted over 5 s, it flashes 9 to 11 times
uses-terms:
  - TERM-DEVICE-STATE
  - TERM-TECHNICIAN-CONSOLE
sources:
  - kind: idea
    ref: Capture session, blinking built-in LED (Q1-Q4)
    date: 2026-11-24
---

## Intent

Noticing a raised hand comes first, and a blinking light catches the eye. AC-HAND-012 covers the LED stopping again.
