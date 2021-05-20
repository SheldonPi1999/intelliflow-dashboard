import Broker from './broker';

// https://github.com/kallqvist/rethinkdb-docker-cluster

const broker = new Broker();

(async () => {
    try {
        await broker.init();
        broker.run();
    } catch (error) {
        console.log(error);
    }
})();
