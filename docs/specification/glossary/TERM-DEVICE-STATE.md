---
id: TERM-DEVICE-STATE
type: glossary-term
title: Device state
summary: One of the three things the device on the chair's table can show - lowered, raised or not watching.
status: draft
synonyms: []
defined-in: BC-HAND-SIGNAL
uses-terms: []
sources:
  - kind: idea
    ref: Capture session with the user, rounds 2-3 (Q10, Q11) and review (R4, R5)
    date: 2026-11-24
---

## Definition

What the device shows the chair, always exactly one of:

- **lowered**: the PC can see the meeting's Participants panel and no remote participant has a raised hand.
- **raised**: at least one remote participant has a raised hand.
- **not watching**: the system can't tell, because the PC can't see the Participants panel, or the device isn't hearing from the PC, or the device has just powered on.

Each state is a different steady LED colour, with nothing blinking. The chair can tell the three apart from their seat, and none of them is dark. The exact colours are a hardware choice.

A **remote participant** is anyone in the Zoom meeting other than the room PC's own Zoom user.

## Distinguish from

- A dark device: it has no power; that isn't a device state.
- Zoom's own raised-hand status: the device state follows it, but only as seen by the room PC.
