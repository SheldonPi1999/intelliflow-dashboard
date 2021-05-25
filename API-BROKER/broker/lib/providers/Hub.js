"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hub = void 0;
class Hub {
    constructor(hub_id, sensors, ip_addr, status) {
        this.hubId = '';
        this.sensors = [];
        this.ipAddr = '';
        this.status = 'Online';
        this.hubId = hub_id;
        this.sensors = sensors || [];
        this.ipAddr = ip_addr || ' ';
        this.status = status || 'Online';
    }
}
exports.Hub = Hub;
