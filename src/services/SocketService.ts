import { io, Socket } from 'socket.io-client';
import { Player } from '../models/Player';
import { Session } from '../models/Session';

export class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private session: Session | null = null;
  private currentPlayer: Player | null = null;
  private serverUrl: string = 'http://localhost:3001'; // Default server URL

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initializeSession(session: Session): void {
    this.session = session;
  }

  public connect(serverUrl: string = this.serverUrl): void {
    if (this.socket) {
      this.disconnect();
    }

    this.serverUrl = serverUrl;
    this.socket = io(serverUrl, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.setupSocketListeners();
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public joinLobby(player: Player): void {
    if (!this.socket || !this.socket.connected) {
      console.error('Socket not connected');
      return;
    }

    this.currentPlayer = player;
    this.socket.emit('joinLobby', player.toObject());
  }

  public leaveLobby(): void {
    if (!this.socket || !this.socket.connected || !this.currentPlayer) {
      console.error('Socket not connected or no current player');
      return;
    }

    this.socket.emit('leaveLobby', { id: this.currentPlayer.id });
    this.currentPlayer = null;
  }

  public updatePosition(x: number, y: number, z: number): void {
    if (!this.socket || !this.socket.connected || !this.currentPlayer) {
      console.error('Socket not connected or no current player');
      return;
    }

    this.currentPlayer.move(x, y, z);
    this.socket.emit('updatePosition', {
      id: this.currentPlayer.id,
      position: [x, y, z]
    });
  }

  public startSpeaking(): void {
    if (!this.socket || !this.socket.connected || !this.currentPlayer) {
      console.error('Socket not connected or no current player');
      return;
    }

    this.currentPlayer.speak();
    this.socket.emit('startSpeaking', { id: this.currentPlayer.id });
  }

  public stopSpeaking(): void {
    if (!this.socket || !this.socket.connected || !this.currentPlayer) {
      console.error('Socket not connected or no current player');
      return;
    }

    this.currentPlayer.stopSpeaking();
    this.socket.emit('stopSpeaking', { id: this.currentPlayer.id });
  }

  public sendAudioData(audioData: ArrayBuffer): void {
    if (!this.socket || !this.socket.connected || !this.currentPlayer) {
      console.error('Socket not connected or no current player');
      return;
    }

    this.socket.emit('audioData', {
      id: this.currentPlayer.id,
      data: audioData
    });
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('playerJoined', (playerData) => {
      if (!this.session) return;
      
      const player = new Player(
        playerData.id,
        playerData.name,
        playerData.country
      );
      
      player.position.setPosition(
        playerData.position[0],
        playerData.position[1],
        playerData.position[2]
      );
      
      player.isReady = playerData.isReady;
      this.session.join(player);
    });

    this.socket.on('playerLeft', (data) => {
      if (!this.session) return;
      this.session.leave(data.id);
    });

    this.socket.on('positionUpdate', (data) => {
      if (!this.session) return;
      
      const player = this.session.getPlayer(data.id);
      if (player) {
        player.position.setPosition(
          data.position[0],
          data.position[1],
          data.position[2]
        );
      }
    });

    this.socket.on('playerStartedSpeaking', (data) => {
      if (!this.session) return;
      
      const player = this.session.getPlayer(data.id);
      if (player) {
        player.speak();
      }
    });

    this.socket.on('playerStoppedSpeaking', (data) => {
      if (!this.session) return;
      
      const player = this.session.getPlayer(data.id);
      if (player) {
        player.stopSpeaking();
      }
    });

    this.socket.on('incomingAudio', (data) => {
      // Handle incoming audio data
      // This would connect to the audio system which would need to be implemented
    });

    this.socket.on('lobbyState', (data) => {
      if (!this.session) return;
      
      // Clear existing players and add all current ones
      this.session.players.clear();
      
      data.players.forEach((playerData: any) => {
        const player = new Player(
          playerData.id,
          playerData.name,
          playerData.country
        );
        
        player.position.setPosition(
          playerData.position[0],
          playerData.position[1],
          playerData.position[2]
        );
        
        player.isReady = playerData.isReady;
        this.session.join(player);
      });
    });
  }
}