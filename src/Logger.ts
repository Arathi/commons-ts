export default class Logger {
    static readonly Root = "ROOT";

    private static instances: Map<string, Logger> = new Map<string, Logger>();

    name: string = Logger.Root;

    constructor(name?: string) {
        if (name != null) {
            this.name = name;
        }
    }

    public static getLogger(name?: string) {
        if (name == null) {
            name = Logger.Root;
        }
        let logger = Logger.instances.get(name);
        if (!logger) {
            console.info("正在创建logger: " + name);
            logger = new Logger(name);
            Logger.instances.set(name, logger);
        }
        return logger;
    }

    debug(msg: any, ...params: any[]) {
        this.print(console.debug, "DEBUG", msg, ...params);
    }

    info(msg: any, ...params: any[]) {
        this.print(console.info, "INFO", msg, ...params);
    }

    trace(msg: any, ...params: any[]) {
        this.print(console.trace, "TRACE", msg, ...params);
    }

    warn(msg: any, ...params: any[]) {
        this.print(console.warn, "WARN", msg, ...params);
    }

    error(msg: any, ...params: any[]) {
        this.print(console.error, "ERROR", msg, ...params);
    }

    print(logFunc: any, level: string, msg: any, ...params: any[]) {
        let now = new Date();
        let format = `${now.toJSON()} [${level}] [${this.name}] ${msg} `;
        if (params != null && params.length > 0) {
            logFunc(format, ...params);
        }
        else {
            logFunc(format)
        }
    }
}