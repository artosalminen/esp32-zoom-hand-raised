# ESP32 Zoom raise-hand signal

A light on the chair's table that shows when someone in a Zoom meeting has raised their hand.

In a hybrid meeting, the chair runs the room and the in-person audience, and can easily miss a
raised hand in Zoom. The **technician console**, running on the technician's own PC, joins the
meeting as a participant, watches every participant's raised-hand status, and tells an ESP32
device on the chair's table, over Wi-Fi, what to show:

| Device state | Meaning |
|---|---|
| **lowered** | Watching; no remote participant has a raised hand. |
| **raised** | At least one remote participant has a raised hand. |
| **not watching** | The system can't tell: the console isn't in the meeting (not started, waiting room, ended) or the device isn't hearing from it. |

Each state is a different steady LED colour. A dark device has no power.

## Status

Specification, plus a tested throwaway spike in [spikes/websdk-raise-hand](spikes/websdk-raise-hand/README.md).
Start with [the specification](docs/specification/README.md).

The spike showed that the Zoom Meeting SDK for Web sees every raised hand without co-host rights,
but only joins meetings hosted on the Zoom account its Zoom app was created in. The app therefore
lives in the account that hosts the meetings.

## How it works

- **Technician console** (technician's PC): a web page built on the Zoom Meeting SDK for Web,
  served at localhost by a small program that holds the Zoom app's secret. It joins the saved
  meeting automatically under a configured name, with no sign-in, microphone or camera
  ([CON-ZOOM-WEBSDK](docs/specification/constraints/CON-ZOOM-WEBSDK.md)).
- **Device** (ESP32 with LEDs): shows the state it receives, and falls back to **not watching**
  if it hears nothing for 10 s.
- **Room PC**: the AV technician runs the room's audio and video on the standard Zoom desktop
  client; it isn't part of this system.

Next planned: managing participants from the console (admit, mute, rename, remove, lock).
Later device versions may add a display or a servo-driven mechanical arm. See
[parked ideas](docs/specification/parked.md).

## Contributing

See [CONTRIBUTION.md](CONTRIBUTION.md).

## License

[MIT](LICENSE.md)
