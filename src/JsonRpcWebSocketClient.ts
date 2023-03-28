import WebSocketClient from "./WebSocketClient";
import { 
    JsonRpcRequest as Request, 
    JsonRpcResponse as Response
} from "./JsonRpcProtocol";
import Logger from "./Logger";

let logger = Logger.getLogger("jsonrpc-websocket-client");

export default class JsonRpcWebSocketClient extends WebSocketClient {
    msgIdType: string;
    seq: Uint32Array;

    timeout: number;
    interval: number;

    requests: Map<string|number, Request>;
    responses: Map<string|number, Response>;
    
    constructor(url: string, msgIdType: string = "number", timeout: number = 5000, interval: number = 1) {
        super(url);
        
        this.msgIdType = msgIdType;
        this.timeout = timeout;
        this.interval = interval;

        this.seq = new Uint32Array(1);
        this.seq[0] = 0;

        this.requests = new Map<string|number, Request>();
        this.responses = new Map<string|number, Response>();
    }

    generateMsgId() : string | number {
        if (this.msgIdType == "string") {
            return crypto.randomUUID();
        }
        return Atomics.add(this.seq, 0, 1);
    }

    createRequestAndSend(method: string, params: any[], id?: string | number) {
        if (id == null) id = this.generateMsgId()
        let req = new Request(
            method,
            params,
            id
        );
        this.sendRequest(req);
    }

    sendRequest(req: Request) {
        if (req.id == null) {
            logger.warn("无效的JSON-RPC请求报文，缺少id字段: ", req);
            return
        }

        let json = JSON.stringify(req);
        this.requests.set(req.id, req);
        super.send(json);
    }

    onMessage(msgEvent: MessageEvent) {
        // super.onMessage(msgEvent);
        let recvMsg = JSON.parse(msgEvent.data);
        if (recvMsg == null) {
            logger.warn(`接收到来自${msgEvent.origin}的报文，无法转换为JSON对象：${msgEvent.data}`);
            return;
        }

        if (recvMsg.jsonrpc == null) {
            logger.warn("报文中未找到jsonrpc字段");
            return;
        }

        if (recvMsg.jsonrpc != "2.0") {
            logger.warn("JSON-RPC版本不为2.0");
            return;
        }

        if (recvMsg.method != null) {
            this.handleRequest(recvMsg as Request);
            return;
        }

        if (recvMsg.id != null) {
            this.handleResponse(recvMsg as Response);
            return;
        }

        logger.warn("接收到无法处理的报文：", recvMsg);
    }

    handleRequest(req: Request) {
        logger.debug(`接收到请求报文：`, req);
    }

    handleResponse(resp: Response) {
        logger.debug(`接收到响应报文：`, resp);
        this.responses.set(resp.id!, resp);
    }

    waitForResponse(
        msgId: string | number, 
        reject: (reason?: any) => void,
        extractRespAndResolve: (resp: Response) => void) : void {
        let startAt = new Date().valueOf();
        let intervalId = setInterval(() => {
            let duration = new Date().valueOf() - startAt;
            if (duration >= this.timeout) {
                clearInterval(intervalId);
                logger.error("获取响应报文超时");
                reject("获取响应报文超时");
                return;
            }

            if (this.responses.has(msgId)) {
                clearInterval(intervalId);
                
                let resp = this.responses.get(msgId);
                if (resp != null && resp.result != null) {
                    logger.debug(`获取到请求${msgId}的响应报文，耗时${duration}ms`);
                    extractRespAndResolve(resp);
                    return;
                }

                logger.error("抽取响应报文失败: ", resp);
                reject("抽取响应报文失败");
            }
        }, this.interval);
    }
}