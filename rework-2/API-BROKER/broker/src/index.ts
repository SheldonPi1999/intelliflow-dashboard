import Broker from './broker';

const broker = new Broker();

(async () => {
    try {
        await broker.init();
        console.log('Kasper was here!!!!!!!!!!!!!!!!!!!');
        broker.run();
    } catch (error) {
        console.log(error);
    }
})();
