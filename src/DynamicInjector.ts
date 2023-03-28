import Logger from "./Logger";

let logger = Logger.getLogger("dynamic-injector");

export default class DynamicInjector {
    private static instance: DynamicInjector;

    cdn: string = "https://cdn.jsdelivr.net/npm/";
    timeout: number = 5000;
    checkInterval: number = 1;

    constructor(cdn?: string, timeout?: number, checkInterval?: number) {
        logger = new Logger("dynamic-injector");
        if (cdn != null) this.cdn = cdn;
        if (timeout != null) this.timeout = timeout;
        if (checkInterval != null) this.checkInterval = checkInterval;
    }

    public static getInstance() {
        if (!DynamicInjector.instance) {
            logger.info("创建DynamicInjector实例");
            DynamicInjector.instance = new DynamicInjector();
        }
        return DynamicInjector.instance;
    }

    getExtName(urlStr: string) {
        let url = new URL(urlStr);
        let index = url.pathname.lastIndexOf(".");
        let extName = url.pathname.substring(index);
        return extName;
    }

    injectByUrl<T>(url: string, timeout: number, checkLoaded?: (payload?: any) => T|null) : Promise<T> {
        let extName = this.getExtName(url);
        if (extName == ".js") {
            let element = document.createElement("script");
            element.type = "application/javascript";
            element.src = url;
            document.body.appendChild(element);
            logger.info(`开始注入js: ${url}`);
        }
        else if (extName == ".css") {
            let element = document.createElement("link");
            element.rel = "stylesheet";
            element.href = url;
            document.head.appendChild(element);
            logger.info(`开始注入css: ${url}`);
        }
        else {
            logger.info(`无法注入元素的文件类型: ${extName}`);
        }

        return new Promise(((resolve: (value: T|PromiseLike<T>) => void, reject: (reason?: any) => void) => {
            if (checkLoaded == null) return;

            let startAt = (new Date()).valueOf();
            let intervalId = setInterval(() => {
                let duration = (new Date()).valueOf() - startAt;
                if (duration >= timeout) {
                    clearInterval(intervalId);
                    reject(`${url}加载超时`);
                    return;
                }

                let loaded = checkLoaded(duration);
                if (loaded != null) {
                    clearInterval(intervalId);
                    resolve(loaded);
                    return;
                }

            }, this.checkInterval);
        }));
    }

    injectFromCDN<T>(cdn: string, pkg: string, version: string, path: string, timeout: number, checkLoaded?: (payload?: any) => T|null) : Promise<T> {
        // https://cdn.jsdelivr.net/npm/vue@3.2/dist/vue.global.prod.js
        let url = `${cdn}${pkg}@${version}${path}`;
        return this.injectByUrl(url, timeout, checkLoaded);
    }

    inject<T>(pkg: string, version: string, path: string, checkLoaded?: (payload?: any) => T|null) : Promise<T> {
        return this.injectFromCDN(this.cdn, pkg, version, path, this.timeout, checkLoaded);
    }
}