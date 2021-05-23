#include "lightSensor.h"
#include "main.h"

#include <stdio.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

#include "../build/config/sdkconfig.h"

#include "./components/packageAndSend.h"

TaskHandle_t xHandleLightSensor;
Data data_send;

enum {
  AS726x_VIOLET = 0,
  AS726x_BLUE,
  AS726x_GREEN,
  AS726x_YELLOW,
  AS726x_ORANGE,
  AS726x_RED,
};

/*!
    @brief gain settings. Default is 1x gain
*/
/**************************************************************************/
enum channel_gain {
  GAIN_1X = 0b00, // default
  GAIN_3X7 = 0b01,
  GAIN_16X = 0b10,
  GAIN_64X = 0b11,
};


uint32_t calibratedValues[AS726x_NUM_CHANNELS];


uint8_t unused = 1;

/* 1: data ready to be read, sets int active if int is enabled */
uint8_t DATA_RDY = 1;

/* conversion type
 *  0b00 = Mode 0
 *  0b01 = Mode 1
 *  0b10 = Mode 2
 *  0b11 = Mode 3 One shot
 */
uint8_t BANK = 2;


/* Channel gain setting (all channels)
 *  0b00 = 1x
 *  0b01 = 3.7x
 *  0b10 = 16x
 *  0b11 = 64x
 */
uint8_t GAIN = 2;

/* enable or disable interrupt */
uint8_t INT = 1;
uint8_t RST = 1;


static esp_err_t i2c_master_read_slave_reg(i2c_port_t i2c_num, uint8_t i2c_addr, uint8_t i2c_reg, uint8_t* data_rd, size_t size)
{
    if (size == 0) {
        return ESP_OK;
    }
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
    i2c_master_start(cmd);
    // first, send device address (indicating write) & register to be read
    i2c_master_write_byte(cmd, ( i2c_addr << 1 ), ACK_CHECK_EN);
    // send register we want
    i2c_master_write_byte(cmd, i2c_reg, ACK_CHECK_EN);
    // Send repeated start
    i2c_master_start(cmd);
    // now send device address (indicating read) & read data
    i2c_master_write_byte(cmd, ( i2c_addr << 1 ) | READ_BIT, ACK_CHECK_EN);
    if (size > 1) {
        i2c_master_read(cmd, data_rd, size - 1, ACK_VAL);
    }
    i2c_master_read_byte(cmd, data_rd + size - 1, NACK_VAL);
    i2c_master_stop(cmd);
    esp_err_t ret = i2c_master_cmd_begin(i2c_num, cmd, 1000 / portTICK_RATE_MS);
    i2c_cmd_link_delete(cmd);
    return ret;
}

static esp_err_t i2c_master_write_slave_reg(i2c_port_t i2c_num, uint8_t i2c_addr, uint8_t i2c_reg, uint8_t* data_wr, size_t size)
{
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
    i2c_master_start(cmd);
    // first, send device address (indicating write) & register to be written
    i2c_master_write_byte(cmd, ( i2c_addr << 1 ) | WRITE_BIT, ACK_CHECK_EN);
    // send register we want
    i2c_master_write_byte(cmd, i2c_reg, ACK_CHECK_EN);
    // write the data
    i2c_master_write(cmd, data_wr, size, ACK_CHECK_EN);
    i2c_master_stop(cmd);
    esp_err_t ret = i2c_master_cmd_begin(i2c_num, cmd, 1000 / portTICK_RATE_MS);
    i2c_cmd_link_delete(cmd);
    return ret;
}

/**
 * @brief i2c master initialization
 */
esp_err_t i2c_master_init(void)
{
    int i2c_master_port = I2C_MASTER_NUM;
    i2c_config_t conf;
    conf.clk_flags = 0;
    conf.mode = I2C_MODE_MASTER;
    conf.sda_io_num = I2C_MASTER_SDA_IO;
    conf.sda_pullup_en = GPIO_PULLUP_ENABLE;
    conf.scl_io_num = I2C_MASTER_SCL_IO;
    conf.scl_pullup_en = GPIO_PULLUP_ENABLE;
    conf.master.clk_speed = I2C_MASTER_FREQ_HZ;
    i2c_param_config(i2c_master_port, &conf);
    return i2c_driver_install(i2c_master_port, conf.mode, I2C_MASTER_RX_BUF_DISABLE, I2C_MASTER_TX_BUF_DISABLE, 0);
}
/**
 * @brief i2c slave initialization
 */
esp_err_t i2c_slave_init(void)
{
    int i2c_slave_port = I2C_SLAVE_NUM;
    i2c_config_t conf_slave;
    conf_slave.clk_flags = 0;
    conf_slave.sda_io_num = I2C_SLAVE_SDA_IO;
    conf_slave.sda_pullup_en = GPIO_PULLUP_ENABLE;
    conf_slave.scl_io_num = I2C_SLAVE_SCL_IO;
    conf_slave.scl_pullup_en = GPIO_PULLUP_ENABLE;
    conf_slave.mode = I2C_MODE_SLAVE;
    conf_slave.slave.addr_10bit_en = 0;
    conf_slave.slave.slave_addr = 0x28; //ESP_SLAVE_ADDR;
    i2c_param_config(i2c_slave_port, &conf_slave);
    return i2c_driver_install(i2c_slave_port, conf_slave.mode, I2C_SLAVE_RX_BUF_LEN, I2C_SLAVE_TX_BUF_LEN, 0);
}

void virtualWrite(uint8_t addr, uint8_t value) {
  uint8_t REG_DATA;
  uint8_t ADDRR = (addr | 0x80);
  while (1) {
    // Read slave I²C status to see if the write buffer is ready.
    i2c_master_read_slave_reg(I2C_MASTER_NUM, ESP_SLAVE_ADDR, AS726X_SLAVE_STATUS_REG, &REG_DATA, 1);
    if ((REG_DATA & AS726X_SLAVE_TX_VALID) == 0)
      // No inbound TX pending at slave. Okay to write now.
      break;
  }
  // Send the virtual register address (setting bit 7 to indicate a pending
  // write).
  i2c_master_write_slave_reg(I2C_MASTER_NUM, ESP_SLAVE_ADDR, AS726X_SLAVE_WRITE_REG, &ADDRR, 1);
  // Serial.print("Address $"); Serial.print(addr, HEX);
  while (1) {
    // Read the slave I²C status to see if the write buffer is ready.
    i2c_master_read_slave_reg(I2C_MASTER_NUM, ESP_SLAVE_ADDR, AS726X_SLAVE_STATUS_REG, &REG_DATA, 1);
    if ((REG_DATA & AS726X_SLAVE_TX_VALID) == 0)
      // No inbound TX pending at slave. Okay to write data now.
      break;
  }
  // Send the data to complete the operation.
  i2c_master_write_slave_reg(I2C_MASTER_NUM, ESP_SLAVE_ADDR, AS726X_SLAVE_WRITE_REG, &value, 1);
  // Serial.print(" = 0x"); Serial.println(value, HEX);
}

uint8_t virtualRead(uint8_t addr) {
  uint8_t REG_DATA;
  while (1) {
    // Read slave I²C status to see if the read buffer is ready.
    i2c_master_read_slave_reg(I2C_MASTER_NUM, ESP_SLAVE_ADDR, AS726X_SLAVE_STATUS_REG, &REG_DATA, 1);
    if ((REG_DATA & AS726X_SLAVE_TX_VALID) == 0) {
      // No inbound TX pending at slave. Okay to write now.
      break;
    }

  }
  // Send the virtual register address (setting bit 7 to indicate a pending
  // write).
  i2c_master_write_slave_reg(I2C_MASTER_NUM, ESP_SLAVE_ADDR, AS726X_SLAVE_WRITE_REG, &addr, 1);
  while (1) {
    // Read the slave I²C status to see if our read data is available.
    i2c_master_read_slave_reg(I2C_MASTER_NUM, ESP_SLAVE_ADDR, AS726X_SLAVE_STATUS_REG, &REG_DATA, 1);
    if ((REG_DATA & AS726X_SLAVE_RX_VALID) != 0)
      // Read data is ready.
      break;
  }
  // Read the data to complete the operation.
  i2c_master_read_slave_reg(I2C_MASTER_NUM, ESP_SLAVE_ADDR, AS726X_SLAVE_READ_REG, &REG_DATA, 1);
  return REG_DATA;
}

uint32_t readCalibratedValue(uint8_t channel) {
  uint32_t val = 0;
  /*
  uint8_t val1 = virtualRead(channel);
  uint8_t val2 = virtualRead(channel + 1);
  uint8_t val3 = virtualRead(channel + 2);
  uint8_t val4 = virtualRead(channel + 3);
*/
  val = ((uint32_t)virtualRead(channel) << 24) |
        ((uint32_t)virtualRead(channel + 1) << 16) |
        ((uint32_t)virtualRead(channel + 2) << 8) |
        (uint32_t)virtualRead(channel + 3);
  
  /*
  if((val >> 31) == 0)
  {
    printf("Sign is positive");
    printf("%x\n", (val << 1 >> 24));
  }
  */
  return val;
}

uint32_t readCalibratedViolet() {
    return (readCalibratedValue(AS7262_VIOLET_CALIBRATED));
  }
  /*!
      @brief  Read calibrated blue color value (AS7262 only)
      @return the blue reading as a 32-bit floating point number
  */
uint32_t readCalibratedBlue() {
    return (readCalibratedValue(AS7262_BLUE_CALIBRATED));
  }
  /*!
      @brief  Read calibrated green color value (AS7262 only)
      @return the green reading as a 32-bit floating point number
  */
uint32_t readCalibratedGreen() {
    return (readCalibratedValue(AS7262_GREEN_CALIBRATED));
  }
  /*!
      @brief  Read calibrated yellow color value (AS7262 only)
      @return the yellow reading as a 32-bit floating point number
  */
uint32_t readCalibratedYellow() {
    return (readCalibratedValue(AS7262_YELLOW_CALIBRATED));
  }
  /*!
      @brief  Read calibrated orange color value (AS7262 only)
      @return the orange reading as a 32-bit floating point number
  */
uint32_t readCalibratedOrange() {
    return (readCalibratedValue(AS7262_ORANGE_CALIBRATED));
  }
  /*!
      @brief  Read calibrated red color value (AS7262 only)
      @return the red reading as a 32-bit floating point number
  */
uint32_t readCalibratedRed() {
    return (readCalibratedValue(AS7262_RED_CALIBRATED));
  }

void startMeasurement() {
  DATA_RDY = 0;
  virtualWrite(AS726X_CONTROL_SETUP, ((DATA_RDY << 1) | (BANK << 2) | (GAIN << 4) | (INT << 6) | (RST << 7)));
  BANK = 0b11;
  virtualWrite(AS726X_CONTROL_SETUP, ((DATA_RDY << 1) | (BANK << 2) | (GAIN << 4) | (INT << 6) | (RST << 7)));
}

void readCalibratedValues(uint32_t *buf, uint8_t num) {
  for (int i = 0; i < num; i++) {
    switch (i) {
    case AS726x_VIOLET:
      buf[i] = readCalibratedViolet();
      break;
    case AS726x_BLUE:
      buf[i] = readCalibratedBlue();
      break;
    case AS726x_GREEN:
      buf[i] = readCalibratedGreen();
      break;
    case AS726x_YELLOW:
      buf[i] = readCalibratedYellow();
      break;
    case AS726x_ORANGE:
      buf[i] = readCalibratedOrange();
      break;
    case AS726x_RED:
      buf[i] = readCalibratedRed();
      break;
    default:
      break;
    }
  }
}

  /*!
      @brief  Check if the sensor is ready to return data
      @return true if data is ready to be read, false otherwise.
  */
  bool dataReady(void) { 
    printf("---Checking if data is ready [in function.]---\n");
    bool temporary = virtualRead(AS726X_CONTROL_SETUP);
    return temporary; 
  }

// bool dataReady() { return virtualRead(AS726X_CONTROL_SETUP) & 0x02; }

bool setupLightSensor(void) {
  RST = 1;
  virtualWrite(AS726X_CONTROL_SETUP, ((DATA_RDY << 1) | (BANK << 2) | (GAIN << 4) | (INT << 6) | (RST << 7)));
  RST = 0;
  
  // wait for it to boot up
  vTaskDelay(200);

  // try to read the version reg to make sure we can connect
  uint8_t version = virtualRead(AS726X_HW_VERSION);

  if (version != 0x40) {
    return false;
  }

  GAIN = GAIN_64X;
  virtualWrite(AS726X_CONTROL_SETUP, ((DATA_RDY << 1) | (BANK << 2) | (GAIN << 4) | (INT << 6) | (RST << 7)));

  return true;
}

void lightSensorTask(void *pvParameter){
  xHandleLightSensor = xTaskGetCurrentTaskHandle();

  bool setupCompleted;

  setupCompleted = setupLightSensor();

  if(setupCompleted == false) {
    printf("Could not connect to the sensor!");
  } else {
    printf("Sensor detected!\n");
  }

  while(1)
  {
    // startMeasurement();

    bool rdy = false;
    
    while(!rdy){
      vTaskDelay(5);
      rdy = dataReady();
    } 

    #ifdef AS7262_LED
      virtualWrite(AS726X_DEVICE_LED, 0b00001000);
    #endif

    readCalibratedValues(&calibratedValues, AS726x_NUM_CHANNELS);

    if(q == NULL){
        printf("Queue is not ready \n");
        return;
    } else {
        printf("What is the tasknameeeeeee?????: %s", pcTaskGetTaskName(xHandleLightSensor));

        data_send.raw_data = calibratedValues[AS726x_VIOLET];
        packageAndSendExtraConf(xHandleLightSensor, data_send, "AS726x_VIOLET");
        
        data_send.raw_data = calibratedValues[AS726x_BLUE];
        packageAndSendExtraConf(xHandleLightSensor, data_send, "AS726x_BLUE");
        
        data_send.raw_data = calibratedValues[AS726x_GREEN];
        packageAndSendExtraConf(xHandleLightSensor, data_send, "AS726x_GREEN");

        data_send.raw_data = calibratedValues[AS726x_YELLOW];
        packageAndSendExtraConf(xHandleLightSensor, data_send, "AS726x_YELLOW");

        data_send.raw_data = calibratedValues[AS726x_ORANGE];
        packageAndSendExtraConf(xHandleLightSensor, data_send, "AS726x_ORANGE");

        data_send.raw_data = calibratedValues[AS726x_RED];
        packageAndSendExtraConf(xHandleLightSensor, data_send, "AS726x_RED");

    }

    printf(" Violet: %x\n", calibratedValues[AS726x_VIOLET]);
    printf(" Blue: %x\n", calibratedValues[AS726x_BLUE]);    
    printf(" Green: %x\n", calibratedValues[AS726x_GREEN]);    
    printf(" Yellow: %x\n", calibratedValues[AS726x_YELLOW]);
    printf(" Orange: %x\n", calibratedValues[AS726x_ORANGE]); 
    printf(" Red: %x\n\n", calibratedValues[AS726x_RED]);

    #ifdef AS7262_LED
      virtualWrite(AS726X_DEVICE_LED, 0b00000000);
    #endif

    // Delay 5s
    vTaskDelay(500);
  }  
}