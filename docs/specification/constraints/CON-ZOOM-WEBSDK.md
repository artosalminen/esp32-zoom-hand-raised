---
id: CON-ZOOM-WEBSDK
type: constraint
title: Detect raised hands with the Zoom Meeting SDK for Web in the technician console
summary: Raised hands are detected only by the technician console, built on the Zoom Meeting SDK for Web and joined as the technician's own signed-in Zoom user, with no cloud server.
status: draft
constraint-kind: technical
imposed-by: Design decision made by the project owner, after the Web SDK investigation
applies-to: []
uses-terms:
  - TERM-TECHNICIAN-CONSOLE
sources:
  - kind: document
    ref: Zoom Meeting SDK for Web reference and Zoom developer blog on Meeting SDK authorization (OBF/ZAK, enforced from 2026-03-02)
    date: 2026-11-24
  - kind: idea
    ref: Capture session, technician console intention (Q15, Q16) and review (R6, R9)
    date: 2026-11-24
---

## Constraint

The system shall learn which participants have a raised hand only from the participant information the Zoom Meeting SDK for Web gives the technician console. The console runs on the technician's own PC and joins the meeting as the technician's own signed-in Zoom user (ZAK token).

## Rationale

The participant information carries a raised-hand flag, so detection doesn't depend on the Zoom client's display language, an open panel or rows in view. The meetings are hosted on a Zoom account other than the one the developer app is created in. Since 2026-03-02, Zoom requires SDK apps joining such meetings to be attributed to a signed-in user. An OBF token only works while that user is already in the meeting on another client, which the technician isn't, so the console joins as the technician themselves.

## Consequences

- Rules out reading the Zoom desktop client's screen-reader information or the screen, and Zoom REST APIs or webhooks.
- The console is a web page served at localhost by a small program on the technician's PC. There's no cloud server.
- The program keeps the technician's Zoom sign-in, renews it, and gets the token the page joins with.
- A Zoom developer app signs the join requests. Its secret is never sent to the browser page; only the program on the technician's PC holds it.
- The program, not the page, talks to the device over Wi-Fi.
- The technician needs a Zoom account.
- The console is a participant in the meeting, visible to everyone under the technician's name.
- The room's own audio and video stay on the Zoom desktop client, run by the AV technician.
