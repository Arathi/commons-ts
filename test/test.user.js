// ==UserScript==
// @name         TmUsCommons-dev
// @namespace    http://tampermonkey.net/
// @version      0.13.1
// @description  try to take over the world!
// @author       Arathi of Nebnizilla
// @match        https://telegra.ph/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://127.0.0.1:30327/dist/commons.umd.js?t=230328-1001
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

const {
    Logger,
    Config,
    Aria2Client,
    DynamicInjector,
    VueAppLoader,
} = TmUsCommons;

function loggetTests() {
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

    let msgLogger = new Logger("msgLog")
    msgLogger.trace("S->C CONNECT")
}

function configTests() {
    let logger = new Logger("config-tests");
    let config = new Config();

    // #region 同步
    config.initValueIfNotExists("aria2", {
        "url": "ws://127.0.0.1:6800/jsonrpc",
        "token": "47bfbcf3"
    });
    config.initValueIfNotExists("config-tests", {
        "manga": "E:\\Downloads\\Comics",
        "cosplay": "E:\\Downloads\\Cosplay"
    });

    let cfgTest = config.getValue("config-tests");
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
    let logger = new Logger();
    let config = new Config();
    let options = config.getValue("aria2", {});
    let aria2 = new Aria2Client(options);
    let connectTimeCost = await aria2.waitForOpen();
    logger.info("连接耗时%dms", connectTimeCost);
    let version = await aria2.getVersion();
    logger.info("获取版本信息：", version);
}

async function injectTests() {
    let logger = new Logger();
    let injector = new DynamicInjector();

    let lodash = await injector.inject("lodash", "4.17.21", "/lodash.js", (duration) => {
        if (typeof _ != 'undefined') {
            return _
        }
        return null;
    });
    logger.info("lodash version: ", lodash.VERSION);
}

let appOptions = {
    template: `
<el-button @click="countDown">DEC</el-button>
{{ counter }}
<el-button @click="countUp">INC</el-button>
`,
    data() { return {
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
        this.$logger.info("测试应用已挂载成功");
        this.$aria2.getVersion().then((resp) => {
            this.$logger.info("aria2版本获取成功：", resp);
        });
    }
};

let styles = `
div#test-app {
    position: fixed;
    top: 10px;
    left: 10px;
}
`;

async function loaderTest() {
    let logger = new Logger("loader-tests");
    let loggerPlugin = {
        install(app) {
            app.config.globalProperties.$logger = logger;
        }
    };

    let config = new Config();
    let aria2Config = config.getValue("aria2");
    let aria2 = new Aria2Client(aria2Config);
    let aria2Plugin = {
        install(app) {
            app.config.globalProperties.$aria2 = aria2;
        }
    }

    let loader = new VueAppLoader({
        mountPointId: "test-app",
        html: null,
        styles: styles,
        vueVersion: "3.2.47",
        elementVersion: "2.3.1",
        vueOptions: appOptions,
        plugins: [
            loggerPlugin,
            aria2Plugin
        ]
    });
    let app = await loader.load();
    logger.info("Vue App 加载完成：", app);
}

async function main() {
    loggetTests();
    configTests();
    aria2Tests();
    injectTests();
    loaderTest();
}

main();