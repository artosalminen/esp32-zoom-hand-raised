---
id: UC-HAND-001
type: use-case
title: Show a raised hand on the chair's device
summary: While the technician console is in the Zoom meeting, the device on the chair's table shows whether any remote participant has a raised hand, and shows plainly when the system can't tell.
status: agreed
system-area: BC-HAND-SIGNAL
primary-actor: ACT-CHAIR
supporting-actors:
  - ACT-TECHNICIAN
  - ACT-AV-TECHNICIAN
governed-by:
  - CON-ZOOM-WEBSDK
uses-terms:
  - TERM-DEVICE-STATE
  - TERM-TECHNICIAN-CONSOLE
open-questions: []
sources:
  - kind: idea
    ref: Capture session with the user, rounds 1-4, review, and Web SDK test results
    date: 2026-11-24
---

## Goal

The chair notices a raised hand in Zoom without watching a screen, so remote participants get the floor as reliably as people in the room.

## Trigger

A remote participant raises their hand with Zoom's "Raise hand" feature.

## Preconditions

- The meeting is hosted on the Zoom account the console's Zoom app belongs to (CON-ZOOM-WEBSDK).
- The usual meeting ID and passcode are saved in the console, and the console is running.
- The console has joined the meeting, with no microphone and no camera, and has been admitted from the waiting room. It doesn't need to be co-host.
- The technician's PC and the device are on a Wi-Fi network where they can reach each other, and the device is powered on the chair's table.

## Main flow

1. A remote participant raises their hand in Zoom.
2. Within 3 s, the device shows **raised**.
3. The chair gives the floor; the participant lowers their hand, or a host or co-host lowers it in Zoom.
4. Within 3 s of the last raised hand being lowered, the device shows **lowered**.

## Alternative flows

- Before 1, joining: when the console starts, it joins the saved meeting by itself, and the device shows **not watching** until the console is in the meeting. If the meeting hasn't started, the console tries again every 30 s. If it's in the waiting room, it waits there. Once admitted, the device shows the current state within 3 s.
- At 2, more hands go up while the device shows **raised**: it stays **raised**. At 4, it shows **lowered** only when no remote participant's hand is raised.
- At 3, a participant leaves the meeting with their hand raised: their hand no longer counts.

## Failure handling

- After power-on, the device shows **not watching** until it receives a state from the technician's PC.
- If Zoom refuses the join (wrong saved meeting ID or passcode, meeting locked, meeting hosted on another account, Meeting SDK turned off in the Zoom app), the console shows the technician the reason, and the device shows **not watching**.
- If the console leaves the meeting, is removed, or the meeting ends, the device shows **not watching** within 3 s.
- If the device hears nothing from the technician's PC for 10 s (console stopped, PC off or asleep, Wi-Fi lost, the network blocks the two from reaching each other), the device shows **not watching** on its own.
- If the device loses power, it's dark, which the chair can see is not **lowered**.

## Out of scope

- Zoom reactions other than "Raise hand", and hands raised on camera.
- How many hands are raised, or whose.
- Dismissing the signal from the device; it follows Zoom only.
- Breakout rooms: the console stays in the main meeting room.
