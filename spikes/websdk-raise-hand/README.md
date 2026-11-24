# Spike: Web SDK raise-hand detection

A throwaway test for [AS-WEBSDK-001](../../docs/specification/assumptions/AS-WEBSDK-001.md).
It answers whether the Zoom Meeting SDK for Web, joined as the technician's own Zoom user, can
tell reliably when someone raises a hand. Not production code; the real console comes later.

What it does:

- `server.mjs` (Node 18+, no dependencies) serves the page at `http://localhost:8787`. It signs
  the Meeting SDK JWT with the app secret, signs the technician in to Zoom (OAuth), and fetches
  their ZAK. The secret and tokens never reach the page. It binds to 127.0.0.1 only.
- `index.html` loads Meeting SDK 6.10.0 (Component View) from Zoom's CDN and joins the configured
  meeting. Every 500 ms it re-reads the participant list, and it also logs every `user-updated`
  event. It shows each participant's `bRaiseHand`, which row is "me", and the device state the
  real console would send.
- Everything is logged to `spike-log.local.jsonl` and can be downloaded from the page.

## 1. Create the Zoom app (once)

Do this in the **Zoom account that hosts the meetings**. An unpublished app can only join meetings
hosted on the account it was created in (error 4011 otherwise, see the results below). With
`"authMode": "none"` (the default) nobody signs in, and steps 2 and 4 below are only needed
for the `zak` and `obf` modes. `zoom-app-manifest.json` sets all of this up via Develop →
**Build from an app manifest**; make sure **Meeting SDK** is turned on afterwards (error 3712
"Signature is invalid" otherwise).

1. On [marketplace.zoom.us](https://marketplace.zoom.us) → Develop → Build App, create a
   **General App**, user-managed.
2. Under **Basic Information**, add the OAuth redirect URL
   `http://localhost:8787/oauth/callback`, and add the same URL to the allow list.
   - If Zoom refuses an `http://localhost` URL, that's a finding too. Note it in the results.
3. Under **Features → Embed**, turn on **Meeting SDK**.
4. Under **Scopes**, add the scope for reading the user's ZAK (`user:read:zak`) and for reading
   the user's profile (`user:read:user`). Scope names may differ slightly; pick the ZAK one.
5. Leave the app unpublished. Copy the **Client ID** and **Client Secret**.

## 2. Configure and run

```sh
cd spikes/websdk-raise-hand
cp config.example.json config.local.json   # git-ignored
# fill in clientId, clientSecret, meetingNumber, passcode (userName optional)
node server.mjs
```

Open `http://localhost:8787` in Chrome or Edge. Only in the `zak` or `obf` mode, click **Sign in
to Zoom** first.

## 3. Test

Use a test meeting **hosted on another Zoom account**, as the real meetings are. You need:

- the host (on another account, Zoom desktop),
- two participants on other devices, e.g. two phones,
- the spike PC with headphones. Don't join audio or start video in the spike.

Press **Mark** (or `M`) at the moment each hand goes up or down. The log then shows the
delay for each detection.

| # | Do | Expect | Checks |
|---|---|---|---|
| 1 | Click **Join meeting** before the host starts it | Join fails with a reason in the log (needed for UC-HAND-001's retry) | – |
| 2 | Host starts the meeting; click **Join**; host admits from the waiting room | Joins; "Waiting room" shows yes, then no; one row is "me" | 1, 4 |
| 3 | Make sure the spike is **not** co-host. Phone A raises a hand | Row shows ✋ and device preview turns **raised**; Δ < 2 s | 2, 3 |
| 4 | Phone B raises; phone A lowers | Stays **raised** | 2 |
| 5 | Phone B lowers | **lowered**; Δ < 2 s | 3 |
| 6 | A and B raise; host uses **Lower all hands** | Both rows clear; **lowered** | 3 |
| 7 | Host makes the spike co-host; repeat 3–5 | Same result | – |
| 8 | Host removes the spike, or ends the meeting | Connection change logged; **not watching** | – |
| 9 | Note whether the app is still unpublished during all of the above | – | 5 |

Watch the log for `user-updated (no bRaiseHand field)` lines. They show whether the event alone
is enough or the list has to be re-read.

## 4. Record the results

Download the log from the page, then fill in this table and update `AS-WEBSDK-001` (confirm and
retire it, or correct the elements it affects):

| Point | Result | Evidence |
|---|---|---|
| 1. Join outside meeting with ZAK | **No.** Error 4011 "cross account join error" for an app created in another account, with ZAK and with OBF (OBF token was issued; the authorising user was in the meeting). Installing that app in the host account as a local test app didn't help. | Run 2026-11-24 07:51–08:00 UTC |
| 1b. Join with an app created in the host account | **Yes**, with only the SDK signature: no sign-in, ZAK or OBF. Connected about 1.3 s after clicking Join. Error 3712 "Signature is invalid" until Meeting SDK was turned on in the app. | Run 2026-11-24 08:13–08:14 UTC |
| 2. Non-co-host sees others' hands | **Yes.** Two raise/lower cycles of an outside user seen before the console was made co-host; same after. | 08:17:07–08:18:21 UTC |
| 3. Changes visible within 2 s (event / poll) | **Partly.** `user-updated` with `bRaiseHand` arrived for every change, and the 500 ms re-read confirmed each within 0.5 s. Time from the click on the other device wasn't measured (no Mark presses). | 08:17–08:19 UTC |
| 4. Own row recognisable | **Probably.** `getCurrentUser()` returned the console's own user ID; the log doesn't record the "me" column. | 08:14:40 UTC |
| 5. Works with the app unpublished | **Only for meetings hosted on the app's own account.** See 1 and 1b. | – |

Also seen:

- Two hands at once handled correctly: a host-account user and an outside user raised; the
  first lowered while the second stayed up, and the state stayed **raised** until both were down.
- Every Zoom event arrived twice; the real console should de-duplicate.
- `user-updated` payloads carry no display name; names come from the participant list.
- The console was put on hold ("Reconnecting", reason "on hold") for about 2 s after joining and
  then admitted again.

Second run (08:22–08:23 UTC):

- **Lower all hands works**, but only through re-reading the list: two hands were lowered at once
  and `user-updated` came for only one of them. The 500 ms re-read caught both.
- **Meeting end works**: `connection-change` `Closed`, reason "ended by host"; state goes to
  **not watching**.
- Delay from a click on the other device looked very short to the tester; not measured.

Only one outside participant was available; a host-account user served as the second hand.

Also note: the Zoom Meeting SDK package says it is "reserved for human use cases and does not
support bots or AI notetakers". The console is operated by a person, but record anything in the
test that suggests Zoom treats it as a bot.
