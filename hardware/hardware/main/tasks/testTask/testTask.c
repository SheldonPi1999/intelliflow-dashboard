#include "testTask.h"
#include "main.h"

#include <stdio.h>
#include <string.h>
#include <inttypes.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

#include "./components/packageAndSend.h"

TaskHandle_t xHandle;
Data data_send;

void testTask(void *pvParameter){
  int data = 0;

  while(1)
  {
    xHandle = xTaskGetCurrentTaskHandle();
    sprintf(data_send.topic, "%s", "");
    
    printf("%s is running.\n", pcTaskGetTaskName(xHandle));

    if(strcmp(pcTaskGetTaskName(xHandle), "testTask0") == 0){
      data += 10;
    } else {
      data += 20;
    }

    data_send.raw_data = data;

    packageAndSend(xHandle, data_send);

    vTaskDelay(5000/portTICK_PERIOD_MS);
  }
}