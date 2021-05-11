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

#ifdef CONFIG_DEBUG_MODE
    #define CONFIG_TEST_TASK
#endif

// #define LIGHT_SENSOR_TASK
// #define TEMPERATURE_SENSOR_TASK
// #define PARTICLE_SENSOR_TASK

QueueHandle_t q = NULL;
esp_mqtt_client_handle_t client;
static const char *TAG = CONFIG_TAG;

typedef struct{
    char topic[50];
    uint32_t raw_data;
} Data; 

void Queue(void *pvParameter)
{
    Data *data_received;
    char raw_data_string[20]; 
    if(q == NULL){
        printf("Queue is not ready");
        return;
    }
    while(1){
        raw_data_string[20] = "";

        xQueueReceive(q, &(data_received),(TickType_t )(1000/portTICK_PERIOD_MS)); 

        #ifdef CONFIG_DEBUG_MODE
            printf("String received on queue: %s \n", data_received->topic);
            printf("String received on queue: %u \n", data_received->raw_data);
        #endif

        sprintf(raw_data_string, "%u", data_received->raw_data);

        printf("String to send: %s\n", raw_data_string);
        
        esp_mqtt_client_publish(client, data_received->topic, raw_data_string, 0, 1, 0);
        
        vTaskDelay(1000/portTICK_PERIOD_MS); // Wait for a second
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

    // Task 1 
    ESP_ERROR_CHECK(i2c_slave_init());
    ESP_ERROR_CHECK(i2c_master_init());

    q = xQueueCreate(20, sizeof(struct Data*));
    if(q != NULL){
        printf("Queue is created\n");
        vTaskDelay(1000/portTICK_PERIOD_MS); // Wait for a second

        #ifdef CONFIG_LIGHT_SENSOR_TASK
            xTaskCreate(&lightSensorTask,"lightSensorTask",2048,NULL,5,NULL);
            printf("lightSensorTask started!\n");
        #endif
        
        #ifdef CONFIG_TEMPERATURE_SENSOR_TASK
            xTaskCreate(&tempSensorTask,"tempSensorTask",2048,NULL,5,NULL);
            printf("tempSensorTask started!\n");
        #endif

        #ifdef CONFIG_PARTICLE_SENSOR_TASK
            xTaskCreate(&particleSensorTask,"particleSensorTask",2048,NULL,5,NULL);
            printf("particleSensorTask started!\n");
        #endif

        #ifdef CONFIG_TEST_TASK
            xTaskCreate(&testTask,"testTask", 2048, NULL, 5, NULL);
            printf("test Task started!\n");
        #endif

        xTaskCreate(&Queue,"queueTask", 2048, NULL, 5, NULL);
        printf("Queue task started!\n");

    } else {
        printf("Queue creation failed!");
    }    
}