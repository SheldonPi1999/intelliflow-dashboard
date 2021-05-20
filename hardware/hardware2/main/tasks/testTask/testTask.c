#include "testTask.h"
#include "main.h"

#include <stdio.h>
#include <string.h>
#include <inttypes.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

typedef struct{
    char topic[50];
    uint32_t raw_data;
} Data; 

void testTask(void *pvParameter){
  Data data_send;
  TaskHandle_t xHandle;

  int data = 0;

  while(1)
  {
    xHandle = xTaskGetCurrentTaskHandle();
    sprintf(data_send.topic, "%s", "");
    
    printf("%s is running.\n", pcTaskGetTaskName(xHandle));

    data += 10;

    strcat(data_send.topic, "intelliflow>");
    strcat(data_send.topic, CONFIG_TAG);
    strcat(data_send.topic, ">");
    strcat(data_send.topic, pcTaskGetTaskName(xHandle));
    strcat(data_send.topic, ">data>");
    
    data_send.raw_data = data;

    Data * const data_send_address = &data_send;

    xQueueSend(q, (void *)&data_send_address, (TickType_t )0);
    
    printf("%u\n", data_send.raw_data);


    vTaskDelay(5000/portTICK_PERIOD_MS);
  }
}