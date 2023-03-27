import Logger from '../src/Logger';
import Config from '../src/Config';
import { Aria2Client, Aria2Version } from '../src/Aria2Client';
import DynamicInjector from '../src/DynamicInjector';
import VueAppLoader from '../src/VueAppLoader';

function loggerTests() {
    let logger = new Logger("logger-tests");
    logger.debug("无参数【调试】级");
    logger.debug("有参数【%s】级：%d", "调试", 1);
    logger.debug("过量参数【%s】级：", "调试", { level: 1 });
    logger.info("无参数【信息】级");
    logger.info("有参数【%s】级：%d", "信息", 2);
    logger.info("过量参数【%s】级：", "信息", { level: 2 });
    logger.trace("无参数【跟踪】级");
    logger.trace("有参数【%s】级：%d", "跟踪", 3);
    logger.trace("过量参数【%s】级：", "信息", { level: 3 });
    logger.warn("无参数【警告】级");
    logger.warn("有参数【%s】级：%d", "警告", 4);
    logger.warn("过量参数【%s】级：", "警告", { level: 4 });
    logger.error("无参数【错误】级");
    logger.error("有参数【%s】级：%d", "错误", 5);
    logger.error("过量参数【%s】级：", "错误", { level: 5 });
}

async function configTests() {
    let logger = new Logger("config-tests");
    let config = new Config();
    
    // #region 同步
    config.initValueIfNotExists("config-tests", {
        "manga": "E:\\Downloads\\Comics",
        "cosplay": "E:\\Downloads\\Cosplay"
    });
    
    let cfgTest: any = config.getValue("config-tests");
    logger.info("manga: %s", cfgTest.manga);
    
    cfgTest.cosplay = "E:\\Downloads\\CosplayCopy";
    config.setValue("config-tests-copy", cfgTest);
    
    config.deleteValue("config-tests");
    
    let keys = config.listValues();
    logger.info("keys: ", keys);
    // #endregion

    // #region 异步
    // #endregion
}

async function aria2Tests() {
    let logger = new Logger("config-tests");
    let aria2 = new Aria2Client({
        url: "ws://127.0.0.1:6800/jsonrpc",
        msgIdType: "number",
        token: "47bfbcf3",
        timeout: 30000,
        interval: 10
    });
    let resp = await aria2.getVersion();
    logger.info("aria2.getVersion 响应报文：", resp);
}

async function injectTests() {
    let injector = new DynamicInjector();
    injector.inject("lodash", "4.17.21", "/lodash.js", (duration) => {
        // @ts-ignore
        if (typeof _ != 'undefined') {
            // @ts-ignore
            return _
        }
        return null;
    });
}

// #region VueAppLoader
let appOptions = {
    template: `
<el-button @click="countDown">DEC</el-button>
{{ counter }}
<el-button @click="countUp">INC</el-button>
`,
    data() { return {
        logger: new Logger("test-app"),
        counter: 0
    }},
    methods: {
        countUp() {
            this.counter++;
        },
        countDown() {
            if (this.counter > 0) {
                this.counter--;
            }
        }
    },
    mounted() {
        this.logger.info("测试应用已挂载成功");
    }
};

let styles = `
#test-app {
    position: fixed;
    top: 10px;
    left: 10px;
}
`;

async function loaderTest() {
    let logger = new Logger("loader-tests");
    let loader = new VueAppLoader({
        mountPointId: "test-app",
        html: null,
        style: styles,
        vueVersion: "3.2.47",
        elementVersion: "2.3.1",
        vueOptions: appOptions
    });
    let app = await loader.load();
    logger.info("Vue App 加载完成：", app);
}
// #endregion

async function main() {
    // loggerTests();
    // configTests();
    // aria2Tests();
    // injectTests();
    loaderTest();
}

main();
