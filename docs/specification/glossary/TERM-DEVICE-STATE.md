---
id: TERM-DEVICE-STATE
type: glossary-term
title: Device state
summary: One of the three things the device on the chair's table can show - lowered, raised or not watching.
status: agreed
synonyms: []
defined-in: BC-HAND-SIGNAL
uses-terms: []
sources:
  - kind: idea
    ref: Capture session with the user, rounds 2-3 (Q10, Q11) and review (R4, R5)
    date: 2026-11-24
  - kind: idea
    ref: Capture session, hand count on a display (Q1-Q5)
    date: 2026-11-24
  - kind: idea
    ref: Capture session, symbols on a monochrome display (Q1-Q3)
    date: 2026-11-24
---

## Definition

What the device shows the chair, always exactly one of:

- **lowered**: the technician console is in the meeting and no remote participant has a raised hand.
- **raised**: at least one remote participant has a raised hand.
- **not watching**: the system can't tell, because the console isn't in the meeting (not started, in the waiting room, left or removed), or the device isn't hearing from the technician's PC, or the device has just powered on.

The device shows the state with at least one of: an RGB LED, a colour display, or a monochrome display. Nothing blinks, and the chair can tell the three states apart from their seat. No state is **dark**: dark means nothing lit at all, which happens only when the device has no power. A lit symbol on an otherwise unlit screen isn't dark.

With an RGB LED or a colour display, each state is a different steady colour; the exact colours are a hardware choice. How a display shows the states and the number of raised hands is set in UC-HAND-001.

A **display** is a screen on the device, separate from the LEDs, that can show at least "9+" and "–". Its type is a hardware choice. Where there is one, it also shows the number of raised remote hands (UC-HAND-001); that number isn't part of the state.

A **remote participant** is anyone in the Zoom meeting other than the technician console itself, including the room PC.

## Distinguish from

- A dark device: it has no power; that isn't a device state.
- Zoom's own raised-hand status: the device state follows it, but only as seen by the technician console.
