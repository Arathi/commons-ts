import DynamicInjector from './DynamicInjector';
import Logger from './Logger';

interface VueAppLoaderOptions {
    mountPointId: string;
    html: string | null;
    styles: string | null;
    vueVersion: string | null;
    elementVersion: string | null;
    vueOptions: object | null;
    provides: object | null;
    plugins: object[]
}

let defaultOptions = {
    mountPointId: "app",
    html: null,
    styles: "",
    vueVersion: "3.2",
    elementVersion: "2.3",
    vueOptions: {},
    provides: {},
    plugins: []
} as VueAppLoaderOptions;

let logger = Logger.getLogger("vue-app-loader");

export default class VueAppLoader {
    injector: DynamicInjector;
    options: VueAppLoaderOptions;

    constructor(options: object) {
        this.injector = DynamicInjector.getInstance();
        this.options = { ...defaultOptions, ...options };
    }
    
    async load(opts?: object): Promise<any> {
        // step 0 重建options
        let options = (opts != null) ?
            { ...defaultOptions, ...opts } :
            this.options;

        // step 1 注入html
        let appNode = document.createElement("div");
        if (options.html != null && options.html.trim().length > 0) {
            appNode.outerHTML = options.html.trim();
        }
        else {
            appNode.id = options.mountPointId;
        }
        document.body.appendChild(appNode);

        // step 2 注入css
        if (options.styles != null) {
            GM_addStyle(options.styles);
        }

        do {
            if (options.vueVersion == null) break;

            // step 3 引入vue
            let vue = await this.injector.inject("vue", options.vueVersion, "/dist/vue.global.js", (duration) => {
                // @ts-ignore
                if (typeof Vue != 'undefined') {
                    // @ts-ignore
                    let vue = Vue;
                    logger.info(`Vue ${vue.version} 加载完成，耗时 ${duration} ms`);
                    return vue;
                }
                return null;
            });
            if (vue == null) break;

            // step 4 引入vue插件
            if (options.elementVersion == null) break;
            let element = await this.injector.inject("element-plus", options.elementVersion, "/dist/index.full.js", (duration) => {
                // @ts-ignore
                if (typeof ElementPlus != 'undefined') {
                    // @ts-ignore
                    let element = ElementPlus;
                    logger.info(`Element Plus ${element.version} 加载完成，耗时 ${duration} ms`);
                    return element;
                }
                return null;
            });
            this.injector.inject("element-plus", options.elementVersion, "/dist/index.css");

            // step 5 创建vueApp
            let app = vue.createApp(options.vueOptions);
            if (element != null) {
                app.use(element);
                // @ts-ignore
                app.provide("$message", element.ElMessage);
            }

            // step 6 加入plugins
            for (let plugin of options.plugins) {
                app.use(plugin)
            }

            // step 7 加入provide
            for (let key in options.provides) {
                if (key.startsWith("$")) {
                    // @ts-ignore
                    let provide = options.provides[key];
                    logger.info("正在注入provide：%s = ", key, provide);
                    app.provide(key, provide);
                }
            }

            // step 8 挂载
            app.mount(`#${options.mountPointId}`);

            return app;
        }
        while (false);

        return null;
    }
}