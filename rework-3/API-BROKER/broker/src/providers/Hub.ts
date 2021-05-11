class Hub {
    public hubId = '';
    public sensors: Array<String> = [];
    public ipAddr = '192.14.15.65';
    public status = 'online';
    public new: Boolean = true;

    constructor(
        hub_id: string,
        sensors?: Array<String>,
        ip_addr?: string,
        status?: string,
        newSensor?: boolean,
    ) {
        this.hubId = hub_id;
        this.sensors = sensors || [];
        this.ipAddr = ip_addr || '192.14.15.65';
        this.status = status || 'online';
        this.new = newSensor || true;
    }
}

interface IHub {
    hubId: string;
    sensors: Array<String>;
    ipAddr: string;
    status: string;
    new: boolean;
}

export {
    IHub,
    Hub,
};
