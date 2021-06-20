#include <stdio.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

#include "tasks/lightSensor/lightSensor.h"
#include "tasks/tempSensor/tempSensor.h"
#include "tasks/particleSensor/particleSensor.h"
#include "tasks/testTask/testTask.h"

#include "wifi/wifi.h"
#include "mqtt/mqtt.h"

#include "esp_log.h"

#include "esp_wifi.h"
#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_event.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/queue.h"
#include "freertos/event_groups.h"

#include "lwip/sockets.h"
#include "lwip/dns.h"
#include "lwip/netdb.h"
#include "esp_log.h"
#include "mqtt_client.h"

#include "../build/config/sdkconfig.h"

// configMAX_PRIORITIES -> 25
/*
    The FreeRTOS scheduler ensures that tasks in the Ready or Running state will always be given processor (CPU) 
    time in preference to tasks of a lower priority that are also in the ready state. In other words, the task 
    placed into the Running state is always the highest priority task that is able to run.
*/

#ifdef CONFIG_DEBUG_MODE
    #define CONFIG_TEST_TASK
#endif

// #define CONFIG_LIGHT_SENSOR_TASK
// #define CONFIG_TEMPERATURE_SENSOR_TASK
// #define CONFIG_PARTICLE_SENSOR_TASK

QueueHandle_t q = NULL;
esp_mqtt_client_handle_t client;
const char *TAG = CONFIG_TAG;

typedef struct{
    char topic[100];
    uint32_t raw_data;
} Data; 

void Queue(void *pvParameter)
{
    Data *data_received;
    char raw_data_string[30];

    while(1) {
        if(q == NULL){
            printf("Queue is not ready\n");
        } else {
            // Block for 10 ticks if amessage is not immediately available.
            if(xQueueReceive(q, &(data_received), (TickType_t ) 10)) {
                
                #ifdef CONFIG_DEBUG_MODE
                    printf("Amount of messages waiting in Queue: %u\n", uxQueueMessagesWaiting(q));
                    printf("Amount of space in Queue: %u\n", uxQueueSpacesAvailable(q));
                    printf("Topic received on queue: %s \n", data_received->topic);
                    printf("Data received on queue: %u \n", data_received->raw_data);
                #endif

                sprintf(raw_data_string, "%u", data_received->raw_data);

                // printf("String to send: %s\n", raw_data_string);
                // printf("SENDSEND: %s\n", data_received->topic);
                
                esp_mqtt_client_publish(client, data_received->topic, raw_data_string, 0, 1, 0);
            } else {
                // printf("No new data to be send.\n");
            }
        }
    }
}

void app_main(void)
{	
    // ESP Logging

    ESP_LOGI(TAG, "[APP] Startup..");
    ESP_LOGI(TAG, "[APP] Free memory: %d bytes", esp_get_free_heap_size());
    ESP_LOGI(TAG, "[APP] IDF version: %s", esp_get_idf_version());

    esp_log_level_set("*", ESP_LOG_INFO);
    esp_log_level_set("MQTT_CLIENT", ESP_LOG_VERBOSE);
    esp_log_level_set("TRANSPORT_TCP", ESP_LOG_VERBOSE);
    esp_log_level_set("TRANSPORT_SSL", ESP_LOG_VERBOSE);
    esp_log_level_set("TRANSPORT", ESP_LOG_VERBOSE);
    esp_log_level_set("OUTBOX", ESP_LOG_VERBOSE);
    
    // Uitzoeken wat dit is!
    nvs_flash_init();
    
    wifi_init();
    mqtt_app_start();

    vTaskDelay(10000 / portTICK_PERIOD_MS);

    // i2c init
    ESP_ERROR_CHECK(i2c_slave_init());
    printf("Slave init succeeded");
    ESP_ERROR_CHECK(i2c_master_init());
    printf("Master init succeeded");

    q = xQueueCreate(10, sizeof(struct Data*));
    // IF q == NULL -> Failed to create queue
    if(q != NULL){
        printf("Queue is created\n");
        vTaskDelay(1000/portTICK_PERIOD_MS); // Wait for a second

        xTaskCreate(&Queue,"queueTask", 2048, NULL, 5, NULL);
        printf("Queue task started!\n");

        #ifdef CONFIG_LIGHT_SENSOR_TASK
            for(uint i = 0; i < CONFIG_LIGHTSENSOR_AMOUNT; i++) {
                char taskname[20] = "lightSensorTask";
                char tasknumber[2];
                sprintf(tasknumber, "%u", i);
                strcat(taskname, tasknumber);
                xTaskCreate(&lightSensorTask, taskname, 2048, NULL, 5, NULL);
                printf("%s started!\n", taskname);

                sprintf(taskname, "%s", "");

                esp_mqtt_client_subscribe(client, "/task/test/light", 0);
            }
        #endif
        
        #ifdef CONFIG_TEMPERATURE_SENSOR_TASK
            for(uint i = 0; i < CONFIG_TEMPSENSOR_AMOUNT; i++) {
                char taskname[20] = "tempSensorTask";
                char tasknumber[2];
                sprintf(tasknumber, "%u", i);
                strcat(taskname, tasknumber);
                
                xTaskCreate(&tempSensorTask, taskname, 2048, NULL, 5, NULL);
                printf("%s started!\n", taskname);

                sprintf(taskname, "%s", "");

                esp_mqtt_client_subscribe(client, "/task/test/temperature", 0);
            }
        #endif

        #ifdef CONFIG_PARTICLE_SENSOR_TASK
            for(uint i = 0; i < CONFIG_PARTICLESENSOR_AMOUNT; i++) {
                char taskname[20] = "particleSensorTask";
                char tasknumber[2];
                sprintf(tasknumber, "%u", i);
                strcat(taskname, tasknumber);
                xTaskCreate(&particleSensorTask, taskname, 2048, NULL, 5, NULL);
                printf("%s started!\n", taskname);

                sprintf(taskname, "%s", "");

                esp_mqtt_client_subscribe(client, "/task/test/particle", 0);
            }
        #endif

        #ifdef CONFIG_TEST_TASK
            for(uint i = 0; i < CONFIG_TESTTASKS_AMOUNT; i++) {
                char taskname[20] = "testTask";
                char tasknumber[2];
                sprintf(tasknumber, "%u", i);
                strcat(taskname, tasknumber);
                xTaskCreate(&testTask, taskname, 2048, NULL, 5, NULL);
                printf("%s started!\n", taskname);

                sprintf(taskname, "%s", "");

                esp_mqtt_client_subscribe(client, "/task/test/priority", 0);
            }
        #endif

    } else {
        printf("Queue creation failed!");
    }    
}