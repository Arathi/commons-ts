export default class Logger {
    name: string;
    constructor(name?: string);
    debug(msg: any, ...params: any[]): void;
    info(msg: any, ...params: any[]): void;
    trace(msg: any, ...params: any[]): void;
    warn(msg: any, ...params: any[]): void;
    error(msg: any, ...params: any[]): void;
    print(logFunc: any, level: string, msg: any, ...params: any[]): void;
}
