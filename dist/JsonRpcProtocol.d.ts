export declare class JsonRpcRequest {
    jsonrpc: string;
    method: string;
    params: any;
    id: string | number | null;
    constructor(method: string, params: any, id: string | number | null);
}
export declare class JsonRpcResponse {
    jsonrpc: string;
    result?: any;
    error?: any;
    id: string | number | null;
    constructor(result: any, id: string | number | null);
}
