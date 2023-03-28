export default class Logger {
    static readonly Root = "ROOT";
    private static instances;
    name: string;
    constructor(name?: string);
    static getLogger(name?: string): Logger;
    debug(msg: any, ...params: any[]): void;
    info(msg: any, ...params: any[]): void;
    trace(msg: any, ...params: any[]): void;
    warn(msg: any, ...params: any[]): void;
    error(msg: any, ...params: any[]): void;
    print(logFunc: any, level: string, msg: any, ...params: any[]): void;
}
