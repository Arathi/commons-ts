export default class WebSocketClient {
    url: string;
    connectTimeout: number;
    connected: boolean;
    webSocket?: WebSocket;
    constructor(url: string, connectTimeout?: number, connectImmediately?: boolean);
    createWebSocket(): void;
    addWebSocketListeners(ws: WebSocket): void;
    send(req: string): boolean;
    waitForOpen(): Promise<number>;
    onOpen(event: Event): void;
    onMessage(msgEvent: MessageEvent): void;
    onClose(closeEvent: CloseEvent): void;
    onError(event: Event): void;
}
