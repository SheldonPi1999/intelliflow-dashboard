import Broker from './broker';

const broker = new Broker();

(async () => {
    try {
        await broker.init();
        broker.run();
    } catch (error) {
        console.log(error);
    }
})();
