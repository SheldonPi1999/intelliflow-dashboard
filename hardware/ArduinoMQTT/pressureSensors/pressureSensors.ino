#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>

#include <Q2HX711.h>

// Replace the next variables with your SSID/Password combination.
const char* ssid = "FD-34";
const char* password = "aaa222333";

// Add your MQTT Broker IP address.
const char* mqtt_server = "192.168.114.225";

const byte MPS_OUT_pin = 2; // OUT data pin
const byte MPS_SCK_pin = 13; // clock data pin

const byte MPS_OUT_pin2 = 3; // OUT data pin
const byte MPS_SCK_pin2 = 26; // clock data pin

WiFiClient espClient;
PubSubClient client(espClient);

Q2HX711 Sensor_1(MPS_OUT_pin, MPS_SCK_pin); // start comm with the HX710B
Q2HX711 Sensor_2(MPS_OUT_pin2, MPS_SCK_pin2); // start comm with the HX710B

long lastMsg = 0;
char msg[50];
int value = 0;
bool boot = true;

float Pressure_0 = 0;
float Pressure_1 = 0;

// LED Pin
const int ledPin = 4;

void setup() {
  Serial.begin(9600);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  pinMode(ledPin, OUTPUT);
}

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();

  // Feel free to add more if statements to control more GPIOs with MQTT

  // If a message is received on the topic esp32/output, you check if the message is either "on" or "off". 
  // Changes the output state according to the message
  if (String(topic) == "esp32/output") {
    Serial.print("Changing output to ");
    if(messageTemp == "on"){
      Serial.println("on");
      digitalWrite(ledPin, HIGH);
    }
    else if(messageTemp == "off"){
      Serial.println("off");
      digitalWrite(ledPin, LOW);
    }
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if(boot == true) {
    client.publish("intelliflow>connected>hub>", "ESP_ARDUINO_PRESSURE");
    boot = false;
  }

  long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;
    
    Pressure_1 = Sensor_1.read()*1013.25/8650000*100;
  
    // Convert the value to a char array
    char pressureString0[20];
    dtostrf(Pressure_0, 1, 2, pressureString0);
    Serial.print("Pressure 0: ");
    Serial.println(pressureString0);
    client.publish("intelliflow>ESP_ARDUINO_PRESSURE>pressureSensor0>data>", pressureString0);

    Pressure_0 = Sensor_2.read()*1013.25/160000000*100;
    
    // Convert the value to a char array
    char pressureString1[20];
    dtostrf(Pressure_1, 1, 2, pressureString1);
    Serial.print("Pressure 1: ");
    Serial.println(pressureString1);
    client.publish("intelliflow>ESP_ARDUINO_PRESSURE>pressureSensor1>data>", pressureString1);
  }
}
