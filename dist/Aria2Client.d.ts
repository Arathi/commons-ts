import { JsonRpcRequest as Request } from "./JsonRpcProtocol";
import JsonRpcWebSocketClient from "./JsonRpcWebSocketClient";
export declare class Aria2Client extends JsonRpcWebSocketClient {
    token?: string | null;
    eventTarget: EventTarget;
    constructor(options?: object);
    addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;
    on: (type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean) => void;
    getSecret(): string | null;
    reconnect(url?: string, token?: string): void;
    generateParams(): any[];
    handleRequest(req: Request): void;
    getVersion(): Promise<Aria2Version>;
    addUri(uris: string[], options?: object | null, position?: number | null): Promise<string>;
    tellStatus(gid: string, keys?: string[] | null): Promise<Aria2TaskStatus>;
}
export interface Aria2Version {
    enabledFeatures: string[];
    version: string;
}
export interface Aria2TaskStatus {
    gid?: string;
    status?: string;
    totalLength?: number;
    completedLength?: number;
}
