---
id: CON-ZOOM-UIA
type: constraint
title: Detect raised hands from the Zoom desktop client's accessibility information
summary: Raised hands are detected only by reading the accessibility information (Windows UI Automation) that the Zoom desktop client exposes on the user's own PC.
status: retired
constraint-kind: technical
imposed-by: Design decision made by the project owner
applies-to: []
uses-terms: []
sources:
  - kind: idea
    ref: Approach chosen by the user from three options (Meeting SDK bot, UI Automation, screen reading)
    date: 2026-11-24
---

## Constraint

The system shall learn which participants have a raised hand only from the accessibility information that the Zoom desktop client for Windows exposes through Windows UI Automation, on the meeting room's PC that the technician has in the meeting.

## Rationale

It runs locally, needs no Zoom developer app, account approval or extra participant in the meeting, and can be built quickly. A Meeting SDK bot would be more robust but is visible to everyone in the meeting and much more work to build. Reading pixels from the screen breaks with themes, scaling and overlapping windows.

## Consequences

- Rules out a Zoom Meeting SDK bot, Zoom REST APIs or webhooks, and screen capture or OCR.
- The Participants panel has to be open (docked or popped out) for raised hands to be visible.
- The Zoom client may be set to English or Finnish, so the watcher recognises the raised-hand and own-row text in both.
- Zoom updates may change that text. The technician can change it in a configuration file, without a new version of the watcher.
- Works only with the Zoom desktop client on Windows.
