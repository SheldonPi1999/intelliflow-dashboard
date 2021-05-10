set(COMPONENT_SRCS "main.c" 
                   "tasks/lightSensor/lightSensor.c" 
                   "tasks/tempSensor/tempSensor.c"
                   "tasks/particleSensor/particleSensor.c"
                   "tasks/testTask/testTask.c"
                   "wifi/wifi.c" 
                   "mqtt/mqtt.c")
set(COMPONENT_ADD_INCLUDEDIRS ".")

register_component()
