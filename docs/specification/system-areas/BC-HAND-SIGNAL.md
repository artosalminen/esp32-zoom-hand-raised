---
id: BC-HAND-SIGNAL
type: system-area
title: Hand signal
summary: Notices raised hands in a Zoom meeting through the technician console, and shows them on a device on the chair's table.
status: agreed
sources:
  - kind: idea
    ref: Intention stated by the user in the capture session
    date: 2026-11-24
  - kind: idea
    ref: Capture session, technician console intention
    date: 2026-11-24
---

## Responsibility

In a hybrid meeting, tell the chair through a device on their table that someone in Zoom has raised a hand, stop once every hand is lowered, and make it evident when the system can't tell.

## Boundaries

- Raising and lowering hands, and running the meeting, belong to Zoom.
- The room's audio and video belong to the AV technician's Zoom desktop client on the room PC.
- Detection works only through the technician console (CON-ZOOM-WEBSDK).
- Hands raised by the in-person audience aren't detected.
- The chair's tablet isn't part of the system.

## Interfaces

- **Zoom:** the technician console joins the meeting under its configured name and receives each participant's raised-hand status.
- **Device (ESP32), over Wi-Fi:** the technician console repeatedly tells the device the current state; the device shows it.
