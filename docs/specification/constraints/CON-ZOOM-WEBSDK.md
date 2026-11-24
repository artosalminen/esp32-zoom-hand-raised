---
id: CON-ZOOM-WEBSDK
type: constraint
title: Detect raised hands with the Zoom Meeting SDK for Web in the technician console
summary: Raised hands are detected only by the technician console, built on the Zoom Meeting SDK for Web with a Zoom app created in the account that hosts the meetings, joined under a configured name with no user sign-in and no cloud server.
status: agreed
constraint-kind: technical
imposed-by: Design decision made by the project owner, confirmed by the Web SDK test on 2026-11-24
applies-to: []
uses-terms:
  - TERM-TECHNICIAN-CONSOLE
sources:
  - kind: document
    ref: Zoom Meeting SDK for Web reference and Zoom developer blog on Meeting SDK authorization (OBF/ZAK, enforced from 2026-03-02)
    date: 2026-11-24
  - kind: document
    ref: Web SDK test results, spikes/websdk-raise-hand/README.md
    date: 2026-11-24
  - kind: idea
    ref: Capture session, technician console intention (Q15, Q16) and review (R6, R9)
    date: 2026-11-24
---

## Constraint

The system shall learn which participants have a raised hand only from the participant information the Zoom Meeting SDK for Web gives the technician console. The console uses a Zoom app created in the Zoom account that hosts the meetings, and joins with that app's SDK signature under a name set in its configuration, without signing in a Zoom user.

## Rationale

The participant information carries a raised-hand flag, so detection doesn't depend on the Zoom client's display language, an open panel or rows in view. The test showed that an unpublished app from another account is refused with error 4011 ("cross account join error"), whether it joins with the technician's ZAK or with an OBF token. An app created in the hosting account joins that account's meetings with only its signature. Publishing the app on the Zoom Marketplace was rejected as too much for a single-room device.

## Consequences

- Rules out reading the Zoom desktop client's screen-reader information or the screen, and Zoom REST APIs or webhooks.
- The project owner creates and looks after the Zoom app in the hosting account, and keeps Meeting SDK enabled in it. Meetings hosted on any other account can't be watched.
- The technician needs no Zoom account and doesn't sign in.
- The console is a web page served at localhost by a small program on the technician's PC. There's no cloud server.
- The app's secret is never sent to the browser page; only the program on the technician's PC holds it.
- The program, not the page, talks to the device over Wi-Fi.
- The console re-reads the whole participant list at least every 500 ms instead of relying on change events alone: in the test, "Lower all hands" lowered two hands but sent an event for only one.
- The console is a participant in the meeting, visible to everyone under its configured name.
- The room's own audio and video stay on the Zoom desktop client, run by the AV technician.
