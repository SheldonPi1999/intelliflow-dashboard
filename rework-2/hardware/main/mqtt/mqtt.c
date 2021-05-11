#include "mqtt.h"
#include "main.h"

#include "../build/config/sdkconfig.h"

static esp_err_t mqtt_event_handler(esp_mqtt_event_handle_t event)
{
    client = event->client;
    int msg_id;
    
    switch (event->event_id) {
        case MQTT_EVENT_CONNECTED:
            ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");
            msg_id = esp_mqtt_client_publish(client, "datapixel>connected>hub>", CONFIG_TAG, 0, 1, 0);
            ESP_LOGI(TAG, "sent publish successful, msg_id=%d", msg_id);
            break;
        case MQTT_EVENT_PUBLISHED:
            ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_DISCONNECTED:
            ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
            break;
        case MQTT_EVENT_ERROR:
            ESP_LOGI(TAG, "MQTT_EVENT_ERROR");
            break;
        default:
            ESP_LOGI(TAG, "Other event id:%d", event->event_id);
            break;
    }
    return ESP_OK;
}

void mqtt_app_start(void)
{
    esp_mqtt_client_config_t mqtt_cfg = {
        .uri = CONFIG_BROKER_URL,
        .event_handle = mqtt_event_handler,
        // .user_context = (void *)your_context
    };

    client = esp_mqtt_client_init(&mqtt_cfg);
    esp_mqtt_client_start(client);
}