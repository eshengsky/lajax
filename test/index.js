describe('lajax', () => {
    let logger;

    before(() => {
        logger = new Lajax('http://baidu.com');
    });

    beforeEach(() => {
        // 先手动清空队列，以方便测试
        logger.queue = [];
    });

    describe('信息日志', () => {
        const log = ['Hello!', '这是一条info日志'];
        it('能在控制台打印info日志', () => {
            const info = sinon.stub(console, 'info');
            const error = sinon.stub(console, 'error');
            logger.info(...log);
            sinon.assert.notCalled(console.error);
            sinon.assert.calledOnce(console.info);

            // 时间没法精确预测，这里模糊处理
            sinon.assert.calledWithExactly(console.info, sinon.match(/%c\[\d{2}:\d{2}:\d{2}.\d{3}\] \[INFO\] -/), 'color: DodgerBlue', ...log);
            info.restore();
            error.restore();
        });

        it('能将info日志添加到队列', () => {
            // 这里没办法判断队列中是否有日志，因为logger.info是同步方法，一旦执行成功队列会被清空。这里仅测试该方法是否被调用过
            const pushToQueue = sinon.stub(logger, '_pushToQueue');
            logger.info(...log);
            sinon.assert.calledOnce(logger._pushToQueue);
            pushToQueue.restore();
        });

        it('能够通过ajax发送符合预期的日志', () => {
            const xhrSend = sinon.stub(logger, 'xhrSend');
            logger.info(...log);
            logger._send();
            log.unshift(`{${logger.reqId}}`);
            let expectedSend = JSON.stringify([{
                time: '',
                level: 'info',
                messages: log,
                url: window.location.href,
                agent: navigator.userAgent
            }]);

            // 将前面的 [{"time":" 移除，只验证其后的子字符串是否匹配
            expectedSend = expectedSend.substring(10);
            sinon.assert.calledWith(xhrSend, sinon.match(expectedSend));
            xhrSend.restore();
        });
    });

    describe('警告日志', () => {
        const log = ['Hello!', '这是一条warn日志'];
        it('能在控制台打印warn日志', () => {
            const warn = sinon.stub(console, 'warn');
            const error = sinon.stub(console, 'error');
            logger.warn(...log);
            sinon.assert.notCalled(console.error);
            sinon.assert.calledOnce(console.warn);

            // 时间没法精确预测，这里模糊处理
            sinon.assert.calledWithExactly(console.warn, sinon.match(/%c\[\d{2}:\d{2}:\d{2}.\d{3}\] \[WARN\] -/), 'color: orange', ...log);
            warn.restore();
            error.restore();
        });

        it('能将warn日志添加到队列', () => {
            // 这里没办法判断队列中是否有日志，因为logger.warn是同步方法，一旦执行成功队列会被清空。这里仅测试方法是否被调用了
            const pushToQueue = sinon.stub(logger, '_pushToQueue');
            logger.warn(...log);
            sinon.assert.calledOnce(logger._pushToQueue);
            pushToQueue.restore();
        });

        it('能够通过ajax发送符合预期的日志', () => {
            const xhrSend = sinon.stub(logger, 'xhrSend');
            logger.warn(...log);
            logger._send();
            log.unshift(`{${logger.reqId}}`);
            let expectedSend = JSON.stringify([{
                time: '',
                level: 'warn',
                messages: log,
                url: window.location.href,
                agent: navigator.userAgent
            }]);

            // 将前面的 [{"time":" 移除，只验证其后的子字符串是否匹配
            expectedSend = expectedSend.substring(10);
            sinon.assert.calledWith(xhrSend, sinon.match(expectedSend));
            xhrSend.restore();
        });
    });

    describe('错误日志', () => {
        const log = ['这是一条error日志', new Error('发生了一个错误')];
        it('能在控制台打印error日志', () => {
            const error = sinon.stub(console, 'error');
            logger.error(...log);
            sinon.assert.calledOnce(console.error);

            // 时间没法精确预测，这里模糊处理
            sinon.assert.calledWithExactly(console.error, sinon.match(/%c\[\d{2}:\d{2}:\d{2}.\d{3}\] \[ERROR\] -/), 'color: red', ...log);
            error.restore();
            error.restore();
        });

        it('能将error日志添加到队列', () => {
            // 这里没办法判断队列中是否有日志，因为logger.error是同步方法，一旦执行成功队列会被清空。这里仅测试方法是否被调用了
            const pushToQueue = sinon.stub(logger, '_pushToQueue');
            logger.error(...log);
            sinon.assert.calledOnce(logger._pushToQueue);
            pushToQueue.restore();
        });

        it('能够通过ajax发送符合预期的日志', () => {
            const xhrSend = sinon.stub(logger, 'xhrSend');
            logger.error(...log);
            logger._send();
            log.unshift(`{${logger.reqId}}`);
            let expectedSend = JSON.stringify([{
                time: '',
                level: 'error',
                messages: log,
                url: window.location.href,
                agent: navigator.userAgent
            }]);

            // 将前面的 [{"time":" 移除，只验证其后的子字符串是否匹配
            expectedSend = expectedSend.substring(10);
            sinon.assert.calledWith(xhrSend, sinon.match(expectedSend));
            xhrSend.restore();
        });
    });
});
