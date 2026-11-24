<!-- Generated from the element files. Do not edit. -->

# Actors

[Contents](../README.md)

<a id="act-av-technician"></a>

## ACT-AV-TECHNICIAN AV technician

*The person who runs the meeting room's audio and video in Zoom on the room PC with the standard Zoom desktop client.*

Status: agreed

<details><summary>Details</summary>

**Goals**

Get the room's camera, microphone, speakers and shared video into the meeting, and keep them working.

**Responsibilities**

- Runs the room PC with the standard Zoom desktop client: shares video and audio.
- Admits people from the waiting room, including the technician's console.
- Makes the technician co-host (needed for managing participants, not for detecting hands).
- Doesn't use the technician console or the device.

Referenced by: [UC-HAND-001](hand-signal.md#uc-hand-001)

Source: [actors/ACT-AV-TECHNICIAN.md](../actors/ACT-AV-TECHNICIAN.md)

</details>

<a id="act-chair"></a>

## ACT-CHAIR Chair

*The person chairing a hybrid meeting from the front of the room, who gives the floor to both the in-person audience and the participants in Zoom.*

Status: agreed

<details><summary>Details</summary>

**Goals**

Notice promptly when a participant in Zoom raises a hand, without having to keep watching a screen, so remote participants get the floor as fairly as people in the room.

**Responsibilities**

- Chairs the meeting and decides who speaks; the system only signals that a hand is raised.
- Doesn't operate the technician console or the room PC.

Referenced by: [UC-HAND-001](hand-signal.md#uc-hand-001)

Source: [actors/ACT-CHAIR.md](../actors/ACT-CHAIR.md)

</details>

<a id="act-technician"></a>

## ACT-TECHNICIAN Technician

*The person who runs the technician console on their own PC and sets up the device for the chair.*

Status: agreed

<details><summary>Details</summary>

**Goals**

Set up the console and the device once, and then have them work for every meeting without thinking about it.

**Responsibilities**

- Saves the usual meeting ID and passcode, and the name the console shows in the meeting, in the console's configuration.
- Starts the console before the meeting; it joins on its own.
- Connects their PC and the device to a Wi-Fi network on which they can reach each other: sets the device's Wi-Fi details and the console's device address before the meeting.
- Places the device on the chair's table, powered and facing the chair, so the chair can see it from their seat.
- Doesn't run the room's audio or video; the AV technician does.

Referenced by: [UC-HAND-001](hand-signal.md#uc-hand-001)

Source: [actors/ACT-TECHNICIAN.md](../actors/ACT-TECHNICIAN.md)

</details>
