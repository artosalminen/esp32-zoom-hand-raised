---
id: UC-HAND-001
type: use-case
title: Show a raised hand on the chair's device
summary: While the meeting room's PC is in a Zoom meeting, the device on the chair's table shows whether any remote participant has a raised hand, and shows plainly when the system can't tell.
status: draft
system-area: BC-HAND-SIGNAL
primary-actor: ACT-CHAIR
supporting-actors:
  - ACT-TECHNICIAN
governed-by:
  - CON-ZOOM-UIA
uses-terms:
  - TERM-DEVICE-STATE
open-questions: []
sources:
  - kind: idea
    ref: Capture session with the user, rounds 1-3 and review
    date: 2026-11-24
---

## Goal

The chair notices a raised hand in Zoom without watching a screen, so remote participants get the floor as reliably as people in the room.

## Trigger

A remote participant raises their hand with Zoom's "Raise hand" feature.

## Preconditions

- The technician has joined the meeting with the Zoom desktop client on the room's Windows PC, has the Participants panel open, and has the watcher running.
- The PC and the device are on a Wi-Fi network where they can reach each other, and the device is powered on the chair's table.

## Main flow

1. A remote participant raises their hand in Zoom.
2. Within 3 s of the hand showing as raised in the room PC's Participants panel, the device shows **raised**.
3. The chair gives the floor; the participant lowers their hand, or the technician or host lowers it in Zoom.
4. Within 3 s of the last raised hand being lowered, the device shows **lowered**.

## Alternative flows

- At 1, a hand raised by the room PC's own Zoom user is ignored; the device stays as it was.
- At 2, more hands go up while the device shows **raised**: it stays **raised**. At 4, it shows **lowered** only when no remote participant's hand is raised.
- At 3, a participant leaves the meeting with their hand raised: their hand no longer counts.

## Failure handling

- After power-on, the device shows **not watching** until it receives a state from the PC.
- If the Participants panel is closed, the meeting ends, or Zoom stops running, the device shows **not watching** within 3 s. When the panel is open again in a meeting, the device shows the current state within 3 s.
- If the device hears nothing from the PC for 10 s (watcher stopped, PC off or asleep, Wi-Fi lost, the network blocks the two from reaching each other), the device shows **not watching** on its own.
- If the device loses power, it's dark, which the chair can see is not **lowered**.

## Out of scope

- Zoom reactions other than "Raise hand", and hands raised on camera.
- How many hands are raised, or whose.
- Dismissing the signal from the device; it follows Zoom only.
- Breakout rooms: the room PC stays in the main meeting room.
