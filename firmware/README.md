# Device firmware (ESP32-C3 with 0.42" OLED)

Shows the state the technician console sends ([UC-HAND-001](../docs/specification/use-cases/UC-HAND-001.md)):

| State | OLED | Optional RGB LED |
|---|---|---|
| lowered | `0`, normal (dark background) | green |
| raised | `1`–`9` or `9+`, **inverted** (lit background), "RAISED" | red |
| not watching | `-`, with the device's IP address (or "no wifi") on top | amber |

It shows **not watching** on power-on and after 10 s without a message from the console.

The board's built-in LED (GPIO8, lit when the pin is low) blinks twice a second while the state
is **raised** and is off otherwise ([AC-HAND-011](../docs/specification/acceptance-criteria/AC-HAND-011.md),
[AC-HAND-012](../docs/specification/acceptance-criteria/AC-HAND-012.md)). To turn it off, uncomment
`-DBLINK_WHEN_RAISED=0` in `platformio.ini`. If it's lit when it should be off, set
`-DBUILTIN_LED_ACTIVE_LOW=0`.

## Hardware

Written for an ESP32-C3 board with a 0.42" 72×40 SSD1306 OLED (e.g. the diymore "ESP32-C3 0.42
OLED" board). The OLED is on I2C **SDA = GPIO5, SCL = GPIO6**. If your board uses other pins, add
`-DOLED_SDA=<n>` and `-DOLED_SCL=<n>` to `build_flags` in `platformio.ini`.

The board's OLED is monochrome. As the spec allows for a device without an RGB LED
([TERM-DEVICE-STATE](../docs/specification/glossary/TERM-DEVICE-STATE.md)), it tells the states
apart with symbols: **raised** lights the whole screen, so it's the easiest to notice; lowered
and not watching are a light `0` or `-` on a dark screen. To show the states as colours as well,
add the optional RGB LED below.

### Optional RGB LED (WS2812)

One addressable WS2812B ("NeoPixel") LED shows **green** for lowered, **red** for raised and
**amber** for not watching, steady, next to the OLED. Use a single-LED breakout board; it has
three or four pads: `5V`/`VCC`, `GND`, `DIN` (data in) and sometimes `DOUT`, which stays unused.

| LED pad | Board pin | Notes |
|---|---|---|
| `VCC` / `5V` | `5V` | Powered from USB. If the colours flicker or are wrong, use `3V3` instead: the LED is a bit dimmer, but the 3.3 V data signal is then within its spec. |
| `GND` | `G` / `GND` | |
| `DIN` | `GPIO4` | Through a 330 Ω resistor in series if you have one; it protects the LED's input. |

```
 ESP32-C3 board                 WS2812B breakout
 ┌──────────────┐               ┌─────────────┐
 │           5V ├───────────────┤ VCC         │
 │          GND ├───────────────┤ GND         │
 │        GPIO4 ├───[330 Ω]─────┤ DIN    DOUT ├── (unused)
 └──────────────┘               └─────────────┘
```

Then turn it on in `platformio.ini` by uncommenting this line in `build_flags`:

```ini
  -DRGB_LED_PIN=4
```

and flash again (`pio run -t upload`). Brightness defaults to 60 of 255; change it with
`-DRGB_BRIGHTNESS=<0-255>`. The board's own built-in LED keeps blinking while raised; the RGB LED
stays steady.

Use a different data pin only if GPIO4 is taken, and then avoid: GPIO5 and GPIO6 (OLED), GPIO8
(built-in LED), GPIO2 and GPIO9 (boot pins), GPIO18 and GPIO19 (USB), GPIO20 and GPIO21 (serial).
If you don't have a breakout board, a bare WS2812B also needs a 100 nF capacitor between its VCC
and GND, close to the LED.

## Set up

1. Install [PlatformIO](https://platformio.org/install): the VS Code extension, or PlatformIO Core
   6.2.0 or newer (Python 3.10–3.14).
2. Copy `include/secrets.example.h` to `include/secrets.h` (git-ignored) and fill in:
   - **every Wi-Fi network** the device will meet: home and the meeting location. It joins
     whichever is in range. The ESP32-C3 only does **2.4 GHz** Wi-Fi.
   - `DEVICE_TOKEN`: any random string; the console's `deviceToken` must match.
3. Connect the board by USB-C and flash:

   ```sh
   cd firmware
   pio run -t upload
   pio device monitor        # optional: shows the Wi-Fi network, IP and every state change
   ```

   If uploading fails to connect, hold the **BOOT** button while plugging the board in, then try
   again.

## Using it

- After power-on the OLED shows `-` and "no wifi", then the IP address once it's on Wi-Fi.
- The console reaches it at `http://hand-signal.local` (`DEVICE_HOSTNAME` in `secrets.h`). If that
  name doesn't resolve on the technician's PC, put the IP address shown on the OLED into the
  console's `deviceUrl` instead. The address can differ between home and the meeting location.
- Test without the console: `curl -X POST -d "state=raised&count=2&token=<token>" http://hand-signal.local/state`.
  It falls back to `-` after 10 s.
- `GET http://hand-signal.local/` shows the current state as JSON.

Guest and venue networks sometimes stop devices from reaching each other ("client isolation").
The console then reports the device as unreachable, and the device shows `-`. Use a network
without isolation, or a phone hotspot that both the PC and the device join.
