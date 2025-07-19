import { Player } from './Player';

export class Session {
  private _players: Map<string, Player>;
  private _idleCheckIntervalId: number | null;

  constructor() {
    this._players = new Map<string, Player>();
    this._idleCheckIntervalId = null;
  }

  get players(): Map<string, Player> {
    return this._players;
  }

  getPlayer(id: string): Player | undefined {
    return this._players.get(id);
  }

  join(player: Player): void {
    this._players.set(player.id, player);

    if (this._idleCheckIntervalId === null && this._players.size > 0) {
      this.startIdleCheck();
    }
  }

  leave(playerId: string): void {
    this._players.delete(playerId);

    if (this._players.size === 0 && this._idleCheckIntervalId !== null) {
      this.stopIdleCheck();
    }
  }

  startIdleCheck(): void {
    if (this._idleCheckIntervalId !== null) {
      return;
    }

    // Check for idle players every minute
    this._idleCheckIntervalId = window.setInterval(() => {
      this.checkIdlePlayers();
    }, 60 * 1000); // 60 seconds
  }

  stopIdleCheck(): void {
    if (this._idleCheckIntervalId !== null) {
      window.clearInterval(this._idleCheckIntervalId);
      this._idleCheckIntervalId = null;
    }
  }

  checkIdlePlayers(): void {
    const idlePlayers: string[] = [];

    this._players.forEach((player, id) => {
      if (player.isIdle()) {
        idlePlayers.push(id);
      }
    });

    // Remove idle players
    idlePlayers.forEach(id => {
      this.leave(id);
    });

    return;
  }

  getAllPlayers(): Player[] {
    return Array.from(this._players.values());
  }

  getPlayersAsObjects(): any[] {
    return this.getAllPlayers().map(player => player.toObject());
  }
}