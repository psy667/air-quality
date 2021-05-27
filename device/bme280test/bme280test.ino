#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <LiquidCrystal.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

//#define BME_SCK 18
//#define BME_MISO 19
//#define BME_MOSI 23
#define BME_CS 5

//Senseair Sensor UART pins
#define TXD2 17
#define RXD2 16

byte Celsius[] = {
  B00000,
  B00000,
  B10000,
  B00111,
  B00100,
  B00100,
  B00100,
  B00111
};

byte Humidity[] = {
  B00100,
  B01110,
  B01110,
  B10111,
  B11111,
  B11111,
  B01110,
  B00000
};

byte Two[] = {
  B00000,
  B00000,
  B11100,
  B00100,
  B11100,
  B10000,
  B11100,
  B00000,
};

byte Cube[] = {
  B11110,
  B00010,
  B01110,
  B00010,
  B11110,
  B10000,
  B00100,
  B00000,
};


LiquidCrystal lcd(33, 32, 13, 12, 14, 27);

//Adafruit_BME280 bme; // I2C
Adafruit_BME280 bme(BME_CS); // hardware SPI
//Adafruit_BME280 bme(BME_CS, BME_MOSI, BME_MISO, BME_SCK); // software SPI



WiFiClient espClient;
PubSubClient client(espClient);



unsigned long delayTime = 4000;

byte CO2req[] = {0xFE, 0X44, 0X00, 0X08, 0X02, 0X9F, 0X25};
byte CO2out[] = {0, 0, 0, 0, 0, 0, 0};

const char* ssid = "hyggerkrog";
const char* password = "perforator";

const char* mqtt_server = "ovz1.arseniyoguzov.n03kn.vps.myjino.ru";
int mqtt_port = 49352;
const char* device_id = "2f0d295f-9cf5-4959-897a-7b7970dae938";

char temp_topic [50];
char hum_topic [50];
char co2_topic [50];
char pm2_topic [50];


float temperature = 0;
float humidity = 0;
float pm2 = 0;
unsigned long CO2 = 0;

void setup() {
    lcd.clear();
    lcd.print("Connecting to BME280");
    
    Serial.begin(9600);
    Serial1.begin(9600, SERIAL_8N1, RXD2, TXD2);    // UART to Sensair CO2 Sensor
    while(!Serial);    // time to get serial running
    
    // <BME>
    unsigned status;
    status = bme.begin();  
    

    if (!status) {
        Serial.println("Could not find a valid BME280 sensor, check wiring, address, sensor ID!");
        Serial.print("SensorID was: 0x"); Serial.println(bme.sensorID(),16);
        Serial.print("        ID of 0xFF probably means a bad address, a BMP 180 or BMP 085\n");
        Serial.print("   ID of 0x56-0x58 represents a BMP 280,\n");
        Serial.print("        ID of 0x60 represents a BME 280.\n");
        Serial.print("        ID of 0x61 represents a BME 680.\n");
        while (1) delay(10);
    }
    Serial.println();
    // </BME>

    // <LCD>

    lcd.begin(16, 2);
    lcd.createChar(0, Celsius);
    lcd.createChar(1, Humidity);
    lcd.createChar(2, Two);
    lcd.createChar(3, Cube);
    lcd.clear();
    
    // </LCD>
    lcd.clear();
    lcd.print("Connecting to WiFi");
    setup_wifi();
    lcd.clear();
    lcd.print("Connecting to MQTT broker");
    // configure the MQTT server with IPaddress and port
    client.setServer(mqtt_server, mqtt_port);
}


void loop() {
  if (!client.connected()) {
    mqttconnect();
  }
  printValues();
  delay(delayTime);
}

void printValues() {
    requestCO2();
    CO2 = CO2count();
    temperature = bme.readTemperature();
    humidity = bme.readHumidity();
    
    lcd.clear();
    lcd.print("t ");
    lcd.print(temperature, 1);
    lcd.write(byte(0));
    lcd.print(" ");

    lcd.print("CO");
    lcd.write(byte(2));
    lcd.print(String(CO2));
    lcd.print("ppm");
    
    lcd.setCursor(0, 1);

    lcd.write(byte(1));
    lcd.print(" ");
    lcd.print(humidity, 0);
    lcd.print("%");

    lcd.print("   ");

    lcd.print("PM2.5 ");
    lcd.print(pm2, 0);
    lcd.print("ug/m");
    lcd.write(byte(0));
    
    Serial.print("Temperature:");
    Serial.print(temperature);
    Serial.print(", ");

    Serial.print("Humidity:");
    Serial.print(humidity);
    Serial.print(", ");
    
    Serial.print("CO2:");
    Serial.print(String(CO2));
    Serial.print(", ");

    Serial.print("PM2.5:");
    Serial.print(String(pm2));
    
    Serial.println();

    
    char tempString[8];
    dtostrf(temperature, 1, 2, tempString);
    

    char humString[8];
    dtostrf(humidity, 1, 2, humString);

    char co2String[8];
    dtostrf(CO2, 1, 2, co2String);

    char pm2String[8];
    dtostrf(pm2, 1, 2, pm2String);



    StaticJsonDocument<256> doc;

    
    doc["temperature"] = tempString;
    doc["humidity"] = humString;
    doc["co2"] = co2String;
    doc["pm2"] = pm2String;

    char out[128];
    serializeJson(doc, out);
    
    client.publish(device_id, out);
}

void requestCO2 ()
{
  while (!Serial1.available())
  {
    Serial1.write(CO2req, 7);
    delay(50);
  }

  int timeout = 0;
  while (Serial1.available() < 7 )
  {
    timeout++;
    if (timeout > 10)
    {
      while (Serial1.available())
        Serial1.read();
      break;
    }
    delay(50);
  }

  for (int i = 0; i < 7; i++)
  {
    CO2out[i] = Serial1.read();
  }
}

unsigned long CO2count()
{
  int high = CO2out[3];
  int low = CO2out[4];
  unsigned long val = high * 256 + low;
  return val;
}

void mqttconnect() {
  /* Loop until reconnected */
  while (!client.connected()) {
    Serial.print("MQTT connecting ...");
    /* client ID */
    String clientId = "ESP32Client";
    /* connect now */
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      /* subscribe topic with default QoS 0*/
      //client.subscribe(LED_TOPIC);
    } else {
      Serial.print("failed, status code =");
      Serial.print(client.state());
      Serial.println("try again in 5 seconds");
      /* Wait 5 seconds before retrying */
      delay(5000);
    }
  }
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

 
