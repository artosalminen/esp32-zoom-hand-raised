# Technician console

Joins the Zoom meeting, watches every participant's raised hand, and keeps the device on the
chair's table up to date ([UC-HAND-001](../docs/specification/use-cases/UC-HAND-001.md),
[CON-ZOOM-WEBSDK](../docs/specification/constraints/CON-ZOOM-WEBSDK.md)).

- `server.mjs`: a small Node program (Node 18+, no dependencies). It serves the console page at
  `http://localhost:8787`, signs the Zoom join with the app secret, and sends the state to the
  device once a second. If the page goes quiet for 3 s (closed, crashed), it sends
  **not watching**.
- `index.html`: joins the saved meeting automatically with the Zoom Meeting SDK for Web 6.10.0,
  re-reads the participant list every 500 ms, and shows the state, the names of everyone with a
  raised hand, and whether the device is reachable.

## Set up (once)

1. The Zoom app must be created **in the Zoom account that hosts the meetings**, with Meeting SDK
   turned on. `../spikes/websdk-raise-hand/zoom-app-manifest.json` sets it up (Develop →
   Build from an app manifest). Nobody has to sign in.
2. Copy `config.example.json` to `config.local.json` (git-ignored) and fill in:

   | Key | Value |
   |---|---|
   | `clientId`, `clientSecret` | The Zoom app's credentials |
   | `meetingNumber`, `passcode` | The usual meeting |
   | `displayName` | The name the console shows in the meeting |
   | `deviceUrl` | `http://hand-signal.local`, or `http://<IP shown on the OLED>` |
   | `deviceToken` | Same as `DEVICE_TOKEN` in the firmware's `secrets.h` |

## Run

```sh
cd console
node server.mjs
```

Open `http://localhost:8787` in Chrome or Edge and leave the tab open. The console:

- joins the meeting by itself, and tries again every 30 s if it hasn't started;
- waits in the waiting room until someone admits it;
- shows Zoom's reason and a **Try again now** button if Zoom refuses the join (wrong ID or
  passcode, locked meeting, app from another account: error 4011, Meeting SDK off: error 3712);
- after the meeting ends, starts trying to join the next one 30 s later.

Don't join audio or start video in the "Zoom meeting view" section; the console only listens to
the participant list.

## Checking it

| Test | Expect on the device |
|---|---|
| Console running, meeting not started | `-` |
| Admitted, no hands | `0` (AC-HAND-007) |
| Someone raises a hand | `1`, inverted, within 3 s (AC-HAND-001) |
| Two hands, one lowered | `2` then `1`, stays raised (AC-HAND-005, AC-HAND-008) |
| Last hand lowered | `0` within 3 s (AC-HAND-002) |
| Host ends the meeting or removes the console | `-` within 3 s (AC-HAND-004, AC-HAND-009) |
| Stop `server.mjs` | `-` within 10 s (AC-HAND-003) |
