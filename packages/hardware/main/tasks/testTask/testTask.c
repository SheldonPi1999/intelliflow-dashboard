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
  bool setupCompleted;

  int data = 0;

  while(1)
  {
    data += 10;
    
    if(q == NULL){
        printf("Queue is not ready \n");
        return;
    } else {
      Data data_send = {
        .topic = "datapixel>sensors>testTask>",
        .raw_data = data,
      };

      Data * const data_send_address = &data_send;

      xQueueSend(q, (void *)&data_send_address, (TickType_t )0);
      
      // Delay 5s
      vTaskDelay(500);
    }
  }
}