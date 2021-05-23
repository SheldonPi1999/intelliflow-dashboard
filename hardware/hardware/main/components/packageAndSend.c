#include "packageAndSend.h"
#include "main.h"

#include <stdio.h>
#include <string.h>
#include <inttypes.h>

void packageAndSend(TaskHandle_t xHandle, Data data_send) {
  strcat(data_send.topic, "intelliflow>");
  strcat(data_send.topic, CONFIG_TAG);
  strcat(data_send.topic, ">");
  strcat(data_send.topic, pcTaskGetTaskName(xHandle));
  strcat(data_send.topic, ">data>");

  Data * const data_send_address = &data_send;
  xQueueSend(q, (void *)&data_send_address, (TickType_t )0);
}

void packageAndSendExtraConf(TaskHandle_t xHandle, Data data_send, char extraConfig[]) {
  strcat(data_send.topic, "intelliflow>");
  strcat(data_send.topic, CONFIG_TAG);
  strcat(data_send.topic, ">");
  strcat(data_send.topic, pcTaskGetTaskName(xHandle));
  strcat(data_send.topic, ">data>");

  strcat(data_send.topic, extraConfig);
  strcat(data_send.topic, ">");

  Data * const data_send_address = &data_send;
  xQueueSend(q, (void *)&data_send_address, (TickType_t )0);
}