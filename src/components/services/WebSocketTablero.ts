// WebSocketTablero.ts
export interface WebSocketMessage {
    type: string;
    [key: string]: any;
}

export type MessageHandler = (data: WebSocketMessage) => void;

class WebSocketTablero {
    private socket: WebSocket | null = null;
    private _connected: boolean = false;
    private reconnectAttempts: number = 0;
    private readonly maxReconnectAttempts: number = 8;
    private readonly reconnectInterval: number = 2000;
    private messageHandlers: Map<string, MessageHandler[]> = new Map();

    constructor() {
        this.socket = null;
        this._connected = false;
        this.reconnectAttempts = 0;
        this.messageHandlers = new Map();
    }

    connect(): void {
        // Usar la variable de entorno para tableros o fallback
        const wsUrl = import.meta.env.VITE_API_URL_WS_TABLEROS || 
                     `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/tableros/`;
        
        console.log('Intentando conectar WebSocket a:', wsUrl);
        
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
            console.log('WebSocket conectado exitosamente');
            this._connected = true;
            this.reconnectAttempts = 0;
        };

        this.socket.onmessage = (event: MessageEvent) => {
            try {
                const data: WebSocketMessage = JSON.parse(event.data);
                this.handleMessage(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        this.socket.onclose = (event: CloseEvent) => {
            console.log('WebSocket cerrado:', event.code, event.reason);
            this._connected = false;
            
            if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
                setTimeout(() => {
                    this.reconnectAttempts++;
                    console.log(`Reconectando (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
                    this.connect();
                }, this.reconnectInterval);
            }
        };

        this.socket.onerror = (error: Event) => {
            console.error('WebSocket error:', error);
            this._connected = false;
        };
    }

    private handleReconnection(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                console.log(`Intentando reconectar (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
                this.connect();
            }, this.reconnectInterval);
        }
    }

    private handleMessage(data: WebSocketMessage): void {
        // Ejecutar todos los handlers registrados para este tipo de mensaje
        if (this.messageHandlers.has(data.type)) {
            const handlers = this.messageHandlers.get(data.type);
            if (handlers) {
                handlers.forEach(handler => handler(data));
            }
        }
    }

    on(messageType: string, handler: MessageHandler): void {
        if (!this.messageHandlers.has(messageType)) {
            this.messageHandlers.set(messageType, []);
        }
        const handlers = this.messageHandlers.get(messageType);
        if (handlers) {
            handlers.push(handler);
        }
    }

    off(messageType: string, handler: MessageHandler): void {
        if (this.messageHandlers.has(messageType)) {
            const handlers = this.messageHandlers.get(messageType);
            if (handlers) {
                const index = handlers.indexOf(handler);
                if (index > -1) {
                    handlers.splice(index, 1);
                }
            }
        }
    }

    send(message: any): void {
        if (this._connected && this.socket) {
            this.socket.send(JSON.stringify(message));
        }
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this._connected = false;
    }

    // Getter público para el estado de conexión
    get connected(): boolean {
        return this._connected;
    }
}

// Crear una instancia única
export const webSocketTableroInstance = new WebSocketTablero();