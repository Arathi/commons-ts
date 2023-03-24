export class JsonRpcRequest {
    jsonrpc: string
    method: string
    params: any
    id: string | number | null
    
    constructor(method: string, params: any, id: string | number | null) {
        this.jsonrpc = "2.0"
        this.method = method
        this.params = params
        this.id = id
    }
}

export class JsonRpcResponse {
    jsonrpc: string
    result?: any
    error?: any
    id: string | number | null

    constructor(result: any, id: string | number | null) {
        this.jsonrpc = "2.0"
        this.result = result
        this.error = null
        this.id = id
    }
}