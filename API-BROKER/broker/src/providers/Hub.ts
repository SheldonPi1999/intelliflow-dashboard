class Hub {
    public hubId = '';
    public sensors: Array<String> = [];
    public ipAddr = '';
    public status = 'Online';

    constructor(
        hub_id: string,
        sensors?: Array<String>,
        ip_addr?: string,
        status?: string,
    ) {
        this.hubId = hub_id;
        this.sensors = sensors || [];
        this.ipAddr = ip_addr || ' ';
        this.status = status || 'Online';
    }
}

interface IHub {
    hubId: string;
    sensors: Array<String>;
    ipAddr: string;
    status: string;
}

export {
    IHub,
    Hub,
};
