#ifndef MAIN_DOT_H
#define MAIN_DOT_H

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

#include "mqtt_client.h"

extern QueueHandle_t q;
extern esp_mqtt_client_handle_t client;
extern const char *TAG;

#endif
