---
id: AS-WEBSDK-001
type: assumption
title: The Web SDK shows every raised hand to an ordinary participant joined with ZAK
summary: A console joined to an outside meeting as the technician's signed-in user, without co-host rights, sees every participant's raised hand through the SDK within a second or two of each change.
status: draft
confidence: low
confirm-with: developers
affects:
  - CON-ZOOM-WEBSDK
  - UC-HAND-001
sources:
  - kind: document
    ref: Zoom Meeting SDK for Web reference (bRaiseHand on ParticipantPropertiesPayload; onUserUpdate / user-updated fire on raise hand) and Zoom developer forum threads 8933, 59248, 97727, 131245
    date: 2026-11-24
---

## Assumption

1. A Meeting SDK for Web client can join a meeting hosted on another Zoom account using the technician's ZAK token.
2. Joined as an ordinary participant (not host or co-host), it receives every other participant's raised-hand flag (`bRaiseHand`) in the participant list.
3. A raise or lower is visible to the console within 2 s, either through the participant-update event or by re-reading the participant list.
4. The console's own participant can be told apart from the others.
5. A developer app that isn't published or approved on the Zoom Marketplace may join meetings on another account with ZAK; if approval is needed, it can be obtained for an internal-only app.

## Basis

Zoom documents `bRaiseHand` and says the participant-update event fires on raise hand. Developers have counted raised hands with `bRaiseHand` since 2020. Nothing found says whether non-hosts see others' hands. Forum reports show bugs: "Lower all hands" updating only one hand (2021, SDK 2.0.0) and disconnects tied to the update listener (2025, SDK 3.12.0); neither is confirmed fixed. Nobody has tested this.

## If wrong

- Point 1: the console can't join; reconsider OBF with the technician also on Zoom desktop, or a meeting on the app's own account.
- Point 2: the console must be co-host before it detects hands; until then the device shows **not watching**.
- Point 3: re-read the participant list on a timer and accept a longer limit than 3 s in UC-HAND-001.
- Point 4: recognise the console's own participant by the name it joins with.
- Point 5: the console can't join outside meetings until the app is approved; if approval isn't available, reconsider the approach.
