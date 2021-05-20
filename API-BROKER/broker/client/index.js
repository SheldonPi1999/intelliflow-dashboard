const mqtt = require('mqtt');
const protobuf = require('protobufjs');

const HUB_ID = 'SENSOR_PATATEE';

const client = mqtt.connect('mqtt://192.168.0.21:1883', {
    clientId: HUB_ID,
});

client.on('connect', () => {
    protobuf.load('./proto/message.proto', (error, root) => {
        if (error) throw error;

        const type = root.lookupType('Sensors.Sensor');
        // Math.floor(Math.random() * Math.floor(50))

        setInterval(() => {
            const payload = type
                .encode({
                    value: Math.floor(Math.random() * Math.floor(50)),
                    id: 'SENSORKE',
                    type: 'TEMP',
                    hubId: HUB_ID,
                    topic: 'datapixel>sensors>SENSOR_001>',
                })
                .finish();
            // Encode a message to an Uint8Array (browser) or Buffer (node)
            client.publish('datapixel>sensors>', payload);
        }, 3000);
    });
});
