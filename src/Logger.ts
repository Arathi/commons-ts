export default class Logger {
    name: string = "ROOT";

    constructor(name?: string) {
        if (name != null) {
            this.name = name;
        }
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