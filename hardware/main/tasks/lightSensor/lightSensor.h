#ifndef LIGHTSENSOR_DOT_H
#define LIGHTSENSOR_DOT_H

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

#include <stdio.h>
#include <math.h> 
#include "esp_log.h"
#include "driver/i2c.h"
#include "sdkconfig.h"
#include <string.h>
#include <inttypes.h>

// Extra defines you can enable or disable when needed.
#define AS7262_LED

#define _I2C_NUMBER(num) I2C_NUM_##num
#define I2C_NUMBER(num) _I2C_NUMBER(num)

#define DATA_LENGTH 512                  /*!< Data buffer length of test buffer */
#define RW_TEST_LENGTH 128               /*!< Data length for r/w test, [0,DATA_LENGTH] */
#define DELAY_TIME_BETWEEN_ITEMS_MS 1000 /*!< delay time between different test items */

#define I2C_SLAVE_SCL_IO CONFIG_I2C_SLAVE_SCL               /*!< gpio number for i2c slave clock */
#define I2C_SLAVE_SDA_IO CONFIG_I2C_SLAVE_SDA               /*!< gpio number for i2c slave data */
#define I2C_SLAVE_NUM I2C_NUMBER(CONFIG_I2C_SLAVE_PORT_NUM) /*!< I2C port number for slave dev */
#define I2C_SLAVE_TX_BUF_LEN (2 * DATA_LENGTH)              /*!< I2C slave tx buffer size */
#define I2C_SLAVE_RX_BUF_LEN (2 * DATA_LENGTH)              /*!< I2C slave rx buffer size */

#define I2C_MASTER_SCL_IO CONFIG_I2C_MASTER_SCL               /*!< gpio number for I2C master clock */
#define I2C_MASTER_SDA_IO CONFIG_I2C_MASTER_SDA               /*!< gpio number for I2C master data  */
#define I2C_MASTER_NUM I2C_NUMBER(CONFIG_I2C_MASTER_PORT_NUM) /*!< I2C port number for master dev */
#define I2C_MASTER_FREQ_HZ CONFIG_I2C_MASTER_FREQUENCY        /*!< I2C master clock frequency */
#define I2C_MASTER_TX_BUF_DISABLE 0                           /*!< I2C master doesn't need buffer */
#define I2C_MASTER_RX_BUF_DISABLE 0                           /*!< I2C master doesn't need buffer */

#define BH1750_SENSOR_ADDR CONFIG_BH1750_ADDR   /*!< slave address for BH1750 sensor */
#define BH1750_CMD_START CONFIG_BH1750_OPMODE   /*!< Operation mode */
#define ESP_SLAVE_ADDR 0x49 /*!< ESP32 slave address, you can set any 7bit value */
#define WRITE_BIT I2C_MASTER_WRITE              /*!< I2C master write */
#define READ_BIT I2C_MASTER_READ                /*!< I2C master read */
#define ACK_CHECK_EN 0x1                        /*!< I2C master will check ack from slave*/
#define ACK_CHECK_DIS 0x0                       /*!< I2C master will not check ack from slave */
#define ACK_VAL 0x0                             /*!< I2C ack value */
#define NACK_VAL 0x1                            /*!< I2C nack value */

#define AS726X_HW_VERSION 0x00
#define AS726X_CONTROL_SETUP 0x04
#define AS726X_DEVICE_TEMP 0x06
#define AS726X_DEVICE_LED 0x07

#define AS726X_SLAVE_STATUS_REG 0x00
#define AS726X_SLAVE_WRITE_REG 0x01
#define AS726X_SLAVE_READ_REG 0x02
#define AS726X_SLAVE_TX_VALID 0x02
#define AS726X_SLAVE_RX_VALID 0x01
#define AS726x_NUM_CHANNELS 6   

#define AS7262_VIOLET_CALIBRATED 0x14
#define AS7262_BLUE_CALIBRATED 0x18
#define AS7262_GREEN_CALIBRATED 0x1C
#define AS7262_YELLOW_CALIBRATED 0x20
#define AS7262_ORANGE_CALIBRATED 0x24
#define AS7262_RED_CALIBRATED 0x28

static esp_err_t i2c_master_read_slave_reg(i2c_port_t i2c_num, uint8_t i2c_addr, uint8_t i2c_reg, uint8_t* data_rd, size_t size);
static esp_err_t i2c_master_write_slave_reg(i2c_port_t i2c_num, uint8_t i2c_addr, uint8_t i2c_reg, uint8_t* data_wr, size_t size);

esp_err_t i2c_master_init(void);
esp_err_t i2c_slave_init(void);

void virtualWrite(uint8_t addr, uint8_t value);
uint8_t virtualRead(uint8_t addr);

uint32_t readCalibratedValue(uint8_t channel);

uint32_t readCalibratedViolet();
uint32_t readCalibratedBlue();
uint32_t readCalibratedGreen();
uint32_t readCalibratedYellow();
uint32_t readCalibratedOrange();
uint32_t readCalibratedRed();

void readCalibratedValues(uint32_t *buf, uint8_t num);

bool dataReady(void);

bool setupLightSensor(void);

void lightSensorTask(void *pvParameter);

#endif