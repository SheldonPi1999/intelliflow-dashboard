#include "pressureSensor.h"

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "driver/gpio.h"

#include "./components/packageAndSend.h"

#define GPIO_OUTPUT_IO  17
#define GPIO_OUTPUT_PIN_SEL (1ULL<<GPIO_OUTPUT_IO)
#define GPIO_INPUT_IO   22
#define GPIO_INPUT_PIN_SEL  (1ULL<<GPIO_INPUT_IO)
#define ESP_INTR_FLAG_DEFAULT 0

uint8_t counter = 0;
uint32_t value = 0;

TaskHandle_t xHandlePressure;

void pressureSensorTask(void) {
    int data = 0;

    while(1)
    {
        xHandlePressure = xTaskGetCurrentTaskHandle();
        
        printf("%s is running.\n", pcTaskGetTaskName(xHandlePressure));

        if(strcmp(pcTaskGetTaskName(xHandlePressure), "pressureSensor0") == 0){
        data += 5;
        } else {
        data += 7;
        }

        packageAndSend(xHandlePressure, data);

        vTaskDelay(5000/portTICK_PERIOD_MS);
    }
}
/*
void pressureSensorTask(void)
{
    gpio_config_t io_conf;
    // Disable interrupt
    io_conf.intr_type = GPIO_PIN_INTR_DISABLE;
    // Set as output mode
    io_conf.mode = GPIO_MODE_OUTPUT;
    //bit mask of the pins that you want to set,e.g.GPIO18/19
    io_conf.pin_bit_mask = GPIO_OUTPUT_PIN_SEL;
    //disable pull-down mode
    io_conf.pull_down_en = 0;
    //disable pull-up mode
    io_conf.pull_up_en = 0;
    //configure GPIO with the given settings
    gpio_config(&io_conf);

    //interrupt of rising edge
    io_conf.intr_type = GPIO_PIN_INTR_DISABLE;
    //set as input mode    
    io_conf.mode = GPIO_MODE_INPUT;
    //bit mask of the pins.
    io_conf.pin_bit_mask = GPIO_INPUT_PIN_SEL;
    //enable pull-up mode
    io_conf.pull_up_en = 1;

    gpio_config(&io_conf);

    while(1) {
        gpio_set_level(GPIO_OUTPUT_IO, 1);
        gpio_set_level(GPIO_OUTPUT_IO, 0);

        if(!gpio_get_level(GPIO_INPUT_IO)) {
            printf("Data Ready!\n");
            for(int i = 0; i < 24; i++) {
                printf("%u", ++counter);
                gpio_set_level(GPIO_OUTPUT_IO, 1);
                printf("Bit level: %x\n", gpio_get_level(GPIO_INPUT_IO));
                value = (value << 1) | gpio_get_level(GPIO_INPUT_IO);
                gpio_set_level(GPIO_OUTPUT_IO, 0);
                printf("Total value: %x\n\n", value);
            }
            gpio_set_level(GPIO_OUTPUT_IO, 1);
            printf("\n%u\n", value);

            packageAndSend(xHandlePressure, value);
            vTaskDelay(500);
        }
        value = 0;
        counter = 0;

        vTaskDelay(500);
    }
}
*/