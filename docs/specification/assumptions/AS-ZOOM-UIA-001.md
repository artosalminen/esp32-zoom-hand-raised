---
id: AS-ZOOM-UIA-001
type: assumption
title: The Participants panel exposes every raised hand and the own row through UI Automation
summary: Through UI Automation, the Zoom desktop client's Participants panel exposes every participant's row, including rows scrolled out of view, with an accessible name that marks a raised hand and marks the room PC's own row, in English and in Finnish.
status: retired
confidence: low
confirm-with: developers
affects:
  - CON-ZOOM-UIA
  - UC-HAND-001
sources:
  - kind: idea
    ref: Zoom's screen reader support, as recalled in the capture session; not checked on a real client
    date: 2026-11-24
  - kind: document
    ref: Spec review findings R2, capture session
    date: 2026-11-24
---

## Assumption

In the Zoom desktop client for Windows, through UI Automation:

1. Every participant row in the Participants panel can be read, including rows scrolled out of view.
2. A row's accessible name contains a fixed phrase while that participant's hand is raised (for example "raised hand"), and doesn't otherwise.
3. The room PC's own row can be recognised (for example by "(me)").
4. Points 2 and 3 hold with the client set to English and set to Finnish, each with its own known phrases.

## Basis

Zoom supports screen readers, which read out each participant's state, including a raised hand. Nobody has checked yet with inspect.exe or Accessibility Insights on the room's Zoom version, in either language.

## If wrong

- Point 1: Zoom lists raised hands first, so a raised hand would rarely be out of view. If rows out of view can't be read, the watcher can read only the visible rows, and the spec must say so. A hidden raised hand would show a false **lowered**.
- Point 2 or 3: look for another UI Automation property that carries the state (an icon element's name, help text) before giving up on CON-ZOOM-UIA. Otherwise reopen the choice of approach, with the Meeting SDK bot next in line.
- Point 4: support only the language that works, and require the technician to set the client to it.
