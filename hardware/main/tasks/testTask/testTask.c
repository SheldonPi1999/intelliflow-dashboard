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

void testTask(void *pvParameter){
  int data = 0;

  while(1)
  {
    xHandle = xTaskGetCurrentTaskHandle();
    
    printf("%s is running.\n", pcTaskGetTaskName(xHandle));

    if(strcmp(pcTaskGetTaskName(xHandle), "testTask0") == 0){
      data += 10;
    } else {
      data += 20;
    }

    packageAndSend(xHandle, data);

    vTaskDelay(5000/portTICK_PERIOD_MS);
  }
}