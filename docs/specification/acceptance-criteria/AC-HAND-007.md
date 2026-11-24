---
id: AC-HAND-007
type: acceptance-criterion
title: The console joins the saved meeting by itself once it starts
summary: A console started before the meeting joins on its own, and the device goes from not watching to lowered within 33 seconds of the console being admitted.
status: agreed
verifies:
  - UC-HAND-001
  - CON-ZOOM-WEBSDK
checked-at: ui
verifiability: verifiable
given:
  - The usual meeting ID and passcode are saved in the console
  - The meeting, hosted on the account the console's Zoom app belongs to, hasn't started
  - The console has been started and the device shows not watching
when: The host starts the meeting and admits the console from the waiting room as soon as it appears there
then:
  - The console appears in the meeting under its configured name, with no microphone and no camera
  - The device shows lowered within 33 s of the meeting starting
uses-terms:
  - TERM-DEVICE-STATE
  - TERM-TECHNICIAN-CONSOLE
sources:
  - kind: document
    ref: Spec review finding R2, technician console intention
    date: 2026-11-24
---

## Intent

Pins down joining without the technician's help: one 30-second retry at most, then 3 s to show the current state. It also proves the console joins without anyone signing in.
