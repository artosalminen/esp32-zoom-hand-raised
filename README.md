# ESP32 Zoom hand-raised signal

A small device on the chair's table that shows when someone in a Zoom meeting has raised their
hand, and how many.

## The idea

In a hybrid meeting, the chair runs the room and the in-person audience, and easily misses a
hand raised in Zoom. Nobody should have to keep watching the participant list.

- The **technician console** runs on the technician's own PC. It joins the meeting as an
  ordinary participant, with no microphone or camera, and reads every participant's raised-hand
  status from the Zoom Meeting SDK for Web.
- It sends the state over Wi-Fi to an **ESP32-C3 with a small OLED** on the chair's table.
- The room's own audio and video stay on the normal Zoom desktop client. This system doesn't
  touch them.

The device shows one of three states. Noticing a raised hand matters most; the count comes second.

| State | OLED | Built-in LED | Meaning |
|---|---|---|---|
| **raised** | whole screen lit, dark `1`–`9` or `9+` | blinks twice a second | Someone in Zoom has a raised hand. |
| **lowered** | light `0` on a dark screen | off | Watching; no hands raised. |
| **not watching** | light `-` and the device's IP address (or "no wifi") | off | The system can't tell: the console isn't in the meeting, or the device isn't hearing from it. |

A completely dark device has no power. Optionally, an external WS2812 RGB LED shows the states
as colours (green, red, amber): three wires (5V, GND, data to GPIO4) and one build setting. See
[wiring the optional RGB LED](firmware/README.md#optional-rgb-led-ws2812).

```
Zoom meeting ──(Meeting SDK for Web)──▶ technician console (PC, localhost)
                                              │ Wi-Fi, HTTP, shared token, once a second
                                              ▼
                                   ESP32-C3 + OLED on the chair's table
```

## What you need

- An ESP32-C3 board with a 0.42" 72×40 SSD1306 OLED (e.g. the diymore "ESP32-C3 0.42 OLED").
  Other ESP32-C3 boards work with pin changes; see [firmware/README.md](firmware/README.md).
- A PC for the technician with Node.js 18+ and Chrome or Edge.
- A **Zoom app created in the Zoom account that hosts the meetings**, with Meeting SDK turned
  on. An unpublished app can't join meetings hosted on any other account (Zoom error 4011). The
  console joins with the app's signature only; nobody signs in.
- A **2.4 GHz** Wi-Fi network that both the PC and the device join, and that lets devices reach
  each other. A phone hotspot works too.

## Usage

### 1. Create the Zoom app (once)

On [marketplace.zoom.us](https://marketplace.zoom.us), signed in to the account that hosts the
meetings, choose Develop → **Build from an app manifest** and upload
[`spikes/websdk-raise-hand/zoom-app-manifest.json`](spikes/websdk-raise-hand/zoom-app-manifest.json).
Check that **Meeting SDK** is turned on (otherwise Zoom answers error 3712, "Signature is
invalid"). Note the app's Client ID and Client Secret.

### 2. Flash the device (once)

```sh
cd firmware
cp include/secrets.example.h include/secrets.h   # git-ignored
# list every Wi-Fi network the device may meet (home, meeting venue, …)
# and set DEVICE_TOKEN to a random string
pio run -t upload                                 # PlatformIO 6.2+
```

The device joins whichever listed network is in range, so the same firmware works at home and at
the venue. It answers at `http://hand-signal.local`. Details are in [firmware/README.md](firmware/README.md).

### 3. Configure and start the console

```sh
cd console
cp config.example.json config.local.json          # git-ignored
# fill in: Zoom clientId and clientSecret, meetingNumber, passcode,
#          displayName, deviceUrl (http://hand-signal.local), deviceToken (same as the firmware)
node server.mjs
```

Open `http://localhost:8787` and leave the tab open. The console joins the meeting by itself,
tries again every 30 s until it starts, waits in the waiting room until admitted, and joins the
next meeting after one ends. It shows the state, the names of everyone with a raised hand, and
whether the device is reachable. Details are in [console/README.md](console/README.md).

### 4. At the meeting

Put the device where the chair can see it and power it from USB. The OLED shows its IP address
until the console reaches it. If `hand-signal.local` doesn't resolve on the technician's PC, put
that IP address into `deviceUrl`.

## Secrets

Nothing secret is committed. These files hold your own values and are git-ignored:

| File | Holds |
|---|---|
| `firmware/include/secrets.h` | Wi-Fi networks and passwords, device token |
| `console/config.local.json` | Zoom app credentials, meeting number and passcode, device token |
| `spikes/websdk-raise-hand/*.local.*` | The same for the test page, plus its logs and Zoom tokens |

## Project layout

| Path | What |
|---|---|
| [`console/`](console/README.md) | Technician console: Node program and web page |
| [`firmware/`](firmware/README.md) | ESP32-C3 firmware (PlatformIO, Arduino core 3.x) |
| [`docs/specification/`](docs/specification/README.md) | The specification: use case, rules and acceptance criteria (`AC-HAND-*`) |
| [`spikes/websdk-raise-hand/`](spikes/websdk-raise-hand/README.md) | The throwaway Web SDK test and its results |

Planned next: managing participants from the console (admit, mute, rename, remove, lock), and a
servo-driven mechanical hand. See [parked ideas](docs/specification/parked.md).

## Contributing

See [CONTRIBUTION.md](CONTRIBUTION.md).

## License

[MIT](LICENSE.md)
