#include "particleSensor.h"
#include "main.h"

#include <stdio.h>
#include <inttypes.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

#include "driver/gpio.h"
#include <driver/adc.h>

#include "./components/packageAndSend.h"

TaskHandle_t xHandle;
Data data_send;

#define GPIO_OUTPUT_RED     15
#define GPIO_OUTPUT_GREEN   13
#define GPIO_OUTPUT_BLUE    2
#define GPIO_OUTPUT_PIN_SEL ((1ULL<<GPIO_OUTPUT_RED) | (1ULL<<GPIO_OUTPUT_GREEN) | (1ULL<<GPIO_OUTPUT_BLUE))
#define GPIO_INPUT_LDR_TOP  32
#define GPIO_INPUT_LDR_SIDE 33
#define GPIO_INPUT_PIN_SEL  ((1ULL<<GPIO_INPUT_LDR_TOP) | (1ULL<<GPIO_INPUT_LDR_SIDE))

void particleSensorTask(void)
{
    gpio_config_t io_conf;
    //disable interrupt
    io_conf.intr_type = GPIO_PIN_INTR_DISABLE;
    //set as output mode
    io_conf.mode = GPIO_MODE_OUTPUT;
    //bit mask of the pins that you want to set,e.g.GPIO18/19
    io_conf.pin_bit_mask = GPIO_OUTPUT_PIN_SEL;
    //disable pull-down mode
    io_conf.pull_down_en = 0;
    //disable pull-up mode
    io_conf.pull_up_en = 0;
    //configure GPIO with the given settings
    gpio_config(&io_conf);

    io_conf.intr_type = GPIO_PIN_INTR_DISABLE;
    //set as input mode    
    io_conf.mode = GPIO_MODE_INPUT;
    //bit mask of the pins that you want to set,e.g.GPIO18/19
    io_conf.pin_bit_mask = GPIO_INPUT_PIN_SEL;
    //disable pull-down mode
    io_conf.pull_down_en = 0;
    //disable pull-up mode
    io_conf.pull_up_en = 0;
    //configure GPIO with the given settings
    gpio_config(&io_conf);

    uint32_t value;

    adc1_config_width(ADC_WIDTH_BIT_12);

    // ADC - TOP
    adc1_config_channel_atten(ADC1_CHANNEL_4, ADC_ATTEN_DB_0);

    while(1) {
        gpio_set_level(GPIO_OUTPUT_RED, 1);
        vTaskDelay(100);
        gpio_set_level(GPIO_OUTPUT_RED, 0);
        vTaskDelay(100);
        gpio_set_level(GPIO_OUTPUT_GREEN, 1);
        vTaskDelay(100);
        gpio_set_level(GPIO_OUTPUT_GREEN, 0);
        vTaskDelay(100);
        gpio_set_level(GPIO_OUTPUT_BLUE, 1);
        vTaskDelay(100);
        gpio_set_level(GPIO_OUTPUT_BLUE, 0);
        vTaskDelay(100);

        // TOP
        value = adc1_get_raw(ADC1_CHANNEL_4);
        printf("TOP: %u\n", value);

        data_send.raw_data = value;
        packageAndSendExtraConf(xHandle, data_send, "Top");

        vTaskDelay(100);
        
        // SIDE
        adc1_config_channel_atten(ADC1_CHANNEL_5, ADC_ATTEN_DB_0);
        value = adc1_get_raw(ADC1_CHANNEL_5);
        printf("SIDE: %u\n", value);

        data_send.raw_data = value;
        packageAndSendExtraConf(xHandle, data_send, "Side");
        
        vTaskDelay(100);        
    }
}