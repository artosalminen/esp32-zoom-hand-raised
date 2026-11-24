// Copy this file to secrets.h (git-ignored) and fill in your own values.
#pragma once

struct WifiNetwork {
  const char *ssid;
  const char *password;
};

// Every network the device may meet. It joins whichever is in range,
// so the same firmware works at home and at the meeting location.
static const WifiNetwork WIFI_NETWORKS[] = {
    {"home-wifi-name", "home-wifi-password"},
    {"venue-wifi-name", "venue-wifi-password"},
};

// The device answers at http://<DEVICE_HOSTNAME>.local/ on the network.
#define DEVICE_HOSTNAME "hand-signal"

// Shared secret: the console must send the same value. Empty string disables the check.
#define DEVICE_TOKEN "change-me-to-something-random"
