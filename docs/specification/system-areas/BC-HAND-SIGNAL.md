---
id: BC-HAND-SIGNAL
type: system-area
title: Hand signal
summary: Notices raised hands in a Zoom meeting, as seen by the meeting room's Windows PC, and shows them on a device on the chair's table.
status: draft
sources:
  - kind: idea
    ref: Intention stated by the user in the capture session
    date: 2026-11-24
---

## Responsibility

In a hybrid meeting, tell the chair through a device on their table that someone in Zoom has raised a hand, stop once every hand is lowered, and make it evident when the system can't tell.

## Boundaries

- Raising and lowering hands, and running the meeting, belong to Zoom.
- Detection works only through what the Zoom desktop client shows on the meeting room's Windows PC; it doesn't add a participant or use Zoom's servers (CON-ZOOM-UIA).
- Hands raised by the in-person audience aren't detected.
- The chair's tablet isn't part of the system.

## Interfaces

- **Zoom desktop client (Windows):** the watcher on the PC reads the meeting window and the Participants panel.
- **Device (ESP32), over Wi-Fi:** the watcher on the PC repeatedly tells the device the current state; the device shows it.
