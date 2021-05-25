#include "packageAndSend.h"
#include "main.h"

#include <stdio.h>
#include <string.h>
#include <inttypes.h>

Data data_send;

void packageAndSend(TaskHandle_t xHandle, uint32_t data) {
  data_send.raw_data = -999;
  data_send.topic[0] = '\0';

  strcat(data_send.topic, "intelliflow>");
  strcat(data_send.topic, CONFIG_TAG);
  strcat(data_send.topic, ">");
  strcat(data_send.topic, pcTaskGetTaskName(xHandle));
  strcat(data_send.topic, ">data>");

  data_send.raw_data = data;

  Data * const data_send_address = &data_send;
  xQueueSend(q, (void *)&data_send_address, (TickType_t )0);
}

void packageAndSendExtraConf(TaskHandle_t xHandle, uint32_t data, char extraConfig[]) {
  data_send.raw_data = -999;
  data_send.topic[0] = '\0';

  strcat(data_send.topic, "intelliflow>");
  strcat(data_send.topic, CONFIG_TAG);
  strcat(data_send.topic, ">");
  strcat(data_send.topic, pcTaskGetTaskName(xHandle));
  strcat(data_send.topic, ">data>");

  strcat(data_send.topic, extraConfig);
  strcat(data_send.topic, ">");

  data_send.raw_data = data;

  Data * const data_send_address = &data_send;
  xQueueSend(q, (void *)&data_send_address, (TickType_t )0);
}