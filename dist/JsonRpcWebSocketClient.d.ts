import WebSocketClient from "./WebSocketClient";
import { JsonRpcRequest as Request, JsonRpcResponse as Response } from "./JsonRpcProtocol";
export default class JsonRpcWebSocketClient extends WebSocketClient {
    msgIdType: string;
    seq: Uint32Array;
    timeout: number;
    interval: number;
    requests: Map<string | number, Request>;
    responses: Map<string | number, Response>;
    constructor(url: string, msgIdType?: string, timeout?: number, interval?: number);
    generateMsgId(): string | number;
    createRequestAndSend(method: string, params: any[], id?: string | number): void;
    sendRequest(req: Request): void;
    onMessage(msgEvent: MessageEvent): void;
    handleRequest(req: Request): void;
    handleResponse(resp: Response): void;
    waitForResponse(msgId: string | number, reject: (reason?: any) => void, extractRespAndResolve: (resp: Response) => void): void;
}
