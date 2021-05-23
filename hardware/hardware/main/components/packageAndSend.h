#ifndef PACKAGEANDSEND_DOT_H
#define PACKAGEANDSEND_DOT_H

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

typedef struct{
    char topic[50];
    uint32_t raw_data;
} Data; 

void packageAndSend(TaskHandle_t xHandle, Data data_send);
void packageAndSendExtraConf(TaskHandle_t xHandle, Data data_send, char extraConfig[]);

#endif