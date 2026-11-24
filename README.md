# ESP32 Zoom raise-hand signal

A light on the chair's table that shows when someone in a Zoom meeting has raised their hand.

In a hybrid meeting, the chair runs the room and the in-person audience, and can easily miss a
raised hand in Zoom. A small watcher program on the meeting room's Windows PC reads the Zoom
desktop client's Participants panel and tells an ESP32 device on the chair's table, over Wi-Fi,
what to show:

| Device state | Meaning |
|---|---|
| **lowered** | Watching; no remote participant has a raised hand. |
| **raised** | At least one remote participant has a raised hand. |
| **not watching** | The system can't tell: Participants panel closed, meeting ended, or the PC isn't reachable. |

Each state is a different steady LED colour. A dark device has no power.

## Status

Specification only, no code yet. Start with [the specification](docs/specification/README.md).

The approach rests on one unconfirmed assumption: that Zoom's Participants panel exposes raised
hands through Windows UI Automation, in English and in Finnish
([AS-ZOOM-UIA-001](docs/specification/assumptions/AS-ZOOM-UIA-001.md)). Checking it with
`inspect.exe` or Accessibility Insights on the room PC is the first task.

## How it works

- **Watcher** (Windows PC): reads the Zoom desktop client through Windows UI Automation; no Zoom
  bot, API or screen capture ([CON-ZOOM-UIA](docs/specification/constraints/CON-ZOOM-UIA.md)).
- **Device** (ESP32 with LEDs): shows the state it receives, and falls back to **not watching**
  if it hears nothing for 10 s.

Later versions may add a display or a servo-driven mechanical arm; see
[parked ideas](docs/specification/parked.md).

## Contributing

See [CONTRIBUTION.md](CONTRIBUTION.md).

## License

[MIT](LICENSE.md)
