#ifndef WIFI_DOT_H
#define WIFI_DOT_H

#include "esp_wifi.h"
#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_event.h"

#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
// #include <iostream>
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


static EventGroupHandle_t wifi_event_group;
const static int CONNECTED_BIT = BIT0;

void testf(void);
static esp_err_t wifi_event_handler(void *ctx, system_event_t *event);
void wifi_init(void);

#endif