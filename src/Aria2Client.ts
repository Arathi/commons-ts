import { 
    JsonRpcRequest as Request,
    // JsonRpcResponse as Response
} from "./JsonRpcProtocol";
import JsonRpcWebSocketClient from "./JsonRpcWebSocketClient";

interface Aria2ClientOptions {
    url: string,
    msgIdType: string,
    token?: string | null,
    timeout: number,
    interval: number
}

let defaultOptions = {
    url: "ws://127.0.0.1:6800/jsonrpc",
    msgIdType: "number",
    token: null,
    timeout: 30000,
    interval: 10
} as Aria2ClientOptions;

export class Aria2Client extends JsonRpcWebSocketClient {
    token?: string | null;
    eventTarget: EventTarget;

    constructor(options?: object) {
        let mergedOptions = {...defaultOptions, ...options};
        super(
            mergedOptions.url, 
            mergedOptions.msgIdType, 
            mergedOptions.timeout, 
            mergedOptions.interval
        );

        this.token = mergedOptions.token;
        this.eventTarget = new EventTarget();
    }

    addEventListener(
        type: string, 
        callback: EventListenerOrEventListenerObject | null, 
        options?: AddEventListenerOptions | boolean
    ) {
        this.eventTarget.addEventListener(type, callback, options);
    }

    on = this.addEventListener;
    
    getSecret() : string | null {
        return (this.token != null && this.token.trim() != "") ? `token:${this.token}` : null
    }

    reconnect(url?: string, token?: string) {
        if (url != null) {
            this.url = url;
        }
        if (token != null) {
            this.token = token;
        }
        this.createWebSocket();
    }

    generateParams() : any[] {
        let params = []
        let secret = this.getSecret()
        if (secret != null) params.push(secret)
        return params
    }

    handleRequest(req: Request) {
        super.handleRequest(req);

        let gid: string|null = null;
        let eventType: string|null = null;
        switch (req.method) {
            case "onDownloadStart":
                eventType = "downloadStart";
                gid = req.params[0].gid;
                break;
            case "onDownloadPause":
                eventType = "downloadPause";
                gid = req.params[0].gid;
                break;
            case "onDownloadStop":
                eventType = "downloadStop";
                gid = req.params[0].gid;
                break;
            case "onDownloadComplete":
                eventType = "downloadComplete";
                gid = req.params[0].gid;
                break;
            case "onDownloadError":
                eventType = "downloadError";
                gid = req.params[0].gid;
                break;
        }
        if (eventType != null && gid != null) {
            let event = new CustomEvent(eventType, {
                detail: gid
            });
            this.eventTarget.dispatchEvent(event);
        }
    }

    getVersion() : Promise<Aria2Version> {
        let method = "aria2.getVersion";

        let params = this.generateParams();

        let msgId = this.generateMsgId();
        this.createRequestAndSend(method, params, msgId);

        let self = this;
        return new Promise<Aria2Version>((resolve, reject) => {
            self.waitForResponse(msgId, reject, (resp) => {
                let result = resp.result as Aria2Version;
                resolve(result);
            });
        });
    }

    addUri(uris: string[], options: object | null = {}, position?: number | null) : Promise<string> {
        let method = "aria2.addUri";

        let params = this.generateParams();
        params.push(uris);
        if (options != null) params.push(options);
        if (position != null) params.push(position);

        let msgId = this.generateMsgId();
        this.createRequestAndSend(method, params, msgId);

        let self = this;
        return new Promise<string>((resolve, reject) => {
            self.waitForResponse(msgId, reject, (resp) => {
                let result = resp.result.gid as string;
                resolve(result);
            });
        });
    }

    tellStatus(gid: string, keys: string[] | null = ["gid", "status", "totalLength", "completedLength"]) : Promise<Aria2TaskStatus> {
        let method = "aria2.tellStatus";
        
        let params = this.generateParams();
        params.push(gid);
        if (keys != null) params.push(keys);
        
        let msgId = this.generateMsgId();
        this.createRequestAndSend(method, params);

        let self = this;
        return new Promise<Aria2TaskStatus>((resolve, reject) => {
            self.waitForResponse(msgId, reject, (resp) => {
                let result = resp.result as Aria2TaskStatus;
                resolve(result);
            });
        });
    }
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