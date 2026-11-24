---
id: AC-HAND-009
type: acceptance-criterion
title: The display shows a dash, not a number, when not watching
summary: When the console leaves the meeting while a hand is raised, the display replaces the count with a dash within 3 seconds.
status: agreed
verifies:
  - UC-HAND-001
checked-at: ui
verifiability: verifiable
given:
  - The device has a display
  - The technician console is in the Zoom meeting and the device is receiving its state
  - One remote participant has a raised hand
  - The device shows raised and the display shows 1
when: A host or co-host removes the technician console from the meeting
then:
  - The device shows not watching within 3 s
  - The display shows "–" and no number
uses-terms:
  - TERM-DEVICE-STATE
  - TERM-TECHNICIAN-CONSOLE
sources:
  - kind: document
    ref: Spec review finding R3, hand count on a display
    date: 2026-11-24
---

## Intent

A count left on the display after the system stopped watching would look current and mislead the chair; this pins down that it's cleared.
