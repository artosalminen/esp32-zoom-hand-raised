---
id: AC-HAND-010
type: acceptance-criterion
title: On a monochrome display, a raised hand lights the whole screen
summary: Without an RGB LED, a raised hand turns the mostly unlit display into a fully lit one with the count dark on it, within 3 seconds.
status: agreed
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The device has a monochrome display and no RGB LED
  - The technician console is in the Zoom meeting and the device is receiving its state
  - No remote participant has a raised hand
  - The display shows a light "0" on an otherwise unlit screen
when: A remote participant raises their hand in Zoom
then:
  - Within 3 s of the participant raising it, the whole display is lit
  - The number 1 shows dark on the lit background
uses-terms:
  - TERM-DEVICE-STATE
  - TERM-TECHNICIAN-CONSOLE
sources:
  - kind: document
    ref: Spec review finding R1, symbols on a monochrome display
    date: 2026-11-24
---

## Intent

Noticing that someone has raised a hand is the most important thing the device does. Without colours, the change from a mostly unlit to a fully lit screen is what makes it noticeable.
