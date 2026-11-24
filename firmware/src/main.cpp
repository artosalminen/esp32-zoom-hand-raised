// Hand signal device, version 1 (UC-HAND-001, TERM-DEVICE-STATE).
//
// Receives the state from the technician console over Wi-Fi and shows it:
//   lowered       "0"            normal display, green RGB LED (if fitted)
//   raised        "1".."9","9+"  inverted display, red RGB LED
//   not watching  "-"            normal display, amber RGB LED
// Shows "not watching" on power-on and after 10 s without a message.
//
// HTTP API (port 80):
//   POST /state   form fields: state=lowered|raised|not_watching, count=<n>, token=<DEVICE_TOKEN>
//   GET  /        current state as JSON

#include <Arduino.h>
#include <ESPmDNS.h>
#include <U8g2lib.h>
#include <WebServer.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <Wire.h>

#include "secrets.h"

#ifndef OLED_SDA
#define OLED_SDA 5
#endif
#ifndef OLED_SCL
#define OLED_SCL 6
#endif
#ifndef RGB_LED_PIN
#define RGB_LED_PIN -1  // -1: no external RGB LED
#endif
#ifndef RGB_BRIGHTNESS
#define RGB_BRIGHTNESS 60
#endif

#if RGB_LED_PIN >= 0
#include <Adafruit_NeoPixel.h>
static Adafruit_NeoPixel pixel(1, RGB_LED_PIN, NEO_GRB + NEO_KHZ800);
#endif

static constexpr uint32_t STATE_TIMEOUT_MS = 10000;  // UC-HAND-001: 10 s without a message

enum class HandState { NotWatching, Lowered, Raised };

static U8G2_SSD1306_72X40_ER_F_HW_I2C oled(U8G2_R0, U8X8_PIN_NONE);
static WiFiMulti wifiMulti;
static WebServer server(80);

static HandState state = HandState::NotWatching;
static int raisedCount = 0;
static uint32_t lastMessageAt = 0;
static bool wifiUp = false;
static bool dirty = true;

static const char *stateName(HandState s) {
  switch (s) {
    case HandState::Lowered: return "lowered";
    case HandState::Raised: return "raised";
    default: return "not_watching";
  }
}

static void setLed() {
#if RGB_LED_PIN >= 0
  uint32_t c;
  switch (state) {
    case HandState::Lowered: c = pixel.Color(0, 160, 0); break;
    case HandState::Raised: c = pixel.Color(255, 0, 0); break;
    default: c = pixel.Color(255, 110, 0); break;
  }
  pixel.setPixelColor(0, c);
  pixel.show();
#endif
}

static void drawCentered(const char *text, int baseline) {
  int w = oled.getStrWidth(text);
  oled.drawStr((oled.getDisplayWidth() - w) / 2, baseline, text);
}

static void render() {
  char big[4];
  char top[20];

  switch (state) {
    case HandState::Lowered:
      strcpy(big, "0");
      strcpy(top, "lowered");
      break;
    case HandState::Raised:
      if (raisedCount > 9) strcpy(big, "9+");
      else snprintf(big, sizeof big, "%d", raisedCount < 1 ? 1 : raisedCount);
      strcpy(top, "RAISED");
      break;
    default:
      strcpy(big, "-");
      // While not watching, show the address so the technician can find the device.
      if (wifiUp) snprintf(top, sizeof top, "%s", WiFi.localIP().toString().c_str());
      else strcpy(top, "no wifi");
      break;
  }

  const bool inverted = state == HandState::Raised;
  oled.clearBuffer();
  if (inverted) {
    oled.setDrawColor(1);
    oled.drawBox(0, 0, oled.getDisplayWidth(), oled.getDisplayHeight());
    oled.setDrawColor(0);
  } else {
    oled.setDrawColor(1);
  }
  oled.setFontMode(1);
  oled.setFont(u8g2_font_4x6_tr);
  drawCentered(top, 6);
  oled.setFont(u8g2_font_logisoso28_tr);
  drawCentered(big, 39);
  oled.sendBuffer();

  setLed();
}

static void setState(HandState s, int count) {
  if (s != state || count != raisedCount) dirty = true;
  state = s;
  raisedCount = count;
}

static void handleState() {
  if (strlen(DEVICE_TOKEN) > 0 && server.arg("token") != DEVICE_TOKEN) {
    server.send(403, "text/plain", "bad token");
    return;
  }
  const String s = server.arg("state");
  const int count = server.arg("count").toInt();
  if (s == "lowered") setState(HandState::Lowered, 0);
  else if (s == "raised") setState(HandState::Raised, count);
  else if (s == "not_watching") setState(HandState::NotWatching, 0);
  else {
    server.send(400, "text/plain", "state must be lowered, raised or not_watching");
    return;
  }
  lastMessageAt = millis();
  server.send(204);
}

static void handleRoot() {
  char body[160];
  snprintf(body, sizeof body,
           "{\"state\":\"%s\",\"count\":%d,\"msSinceMessage\":%lu,\"ssid\":\"%s\"}",
           stateName(state), raisedCount, (unsigned long)(millis() - lastMessageAt),
           WiFi.SSID().c_str());
  server.send(200, "application/json", body);
}

void setup() {
  Serial.begin(115200);

  Wire.begin(OLED_SDA, OLED_SCL);
  oled.begin();
  oled.setContrast(255);

#if RGB_LED_PIN >= 0
  pixel.begin();
  pixel.setBrightness(RGB_BRIGHTNESS);
#endif

  render();  // power-on: not watching (UC-HAND-001 failure handling)

  WiFi.mode(WIFI_STA);
  WiFi.setHostname(DEVICE_HOSTNAME);
  for (const auto &n : WIFI_NETWORKS) wifiMulti.addAP(n.ssid, n.password);

  server.on("/", HTTP_GET, handleRoot);
  server.on("/state", HTTP_POST, handleState);
  server.begin();
}

void loop() {
  const bool connected = wifiMulti.run() == WL_CONNECTED;
  if (connected != wifiUp) {
    wifiUp = connected;
    dirty = true;
    if (connected) {
      MDNS.end();
      if (MDNS.begin(DEVICE_HOSTNAME)) MDNS.addService("http", "tcp", 80);
      Serial.printf("Wi-Fi %s, IP %s, http://%s.local/\n", WiFi.SSID().c_str(),
                    WiFi.localIP().toString().c_str(), DEVICE_HOSTNAME);
    } else {
      setState(HandState::NotWatching, 0);
      Serial.println("Wi-Fi lost");
    }
  }

  if (connected) server.handleClient();

  if (state != HandState::NotWatching && millis() - lastMessageAt > STATE_TIMEOUT_MS) {
    setState(HandState::NotWatching, 0);
    Serial.println("No message for 10 s: not watching");
  }

  if (dirty) {
    dirty = false;
    render();
  }
  delay(5);
}
