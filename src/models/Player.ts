import { Position } from './Position';

export class Player {
  private _id: string;
  private _name: string;
  private _country: string;
  private _position: Position;
  private _lastActivity: Date;
  private _isReady: boolean;
  private _isSpeaking: boolean;

  constructor(id: string, name: string, country: string) {
    this._id = id;
    this._name = name;
    this._country = country;
    this._position = new Position();
    this._lastActivity = new Date();
    this._isReady = false;
    this._isSpeaking = false;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get country(): string {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
  }

  get position(): Position {
    return this._position;
  }

  set position(value: Position) {
    this._position = value;
  }

  get lastActivity(): Date {
    return this._lastActivity;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  set isReady(value: boolean) {
    this._isReady = value;
    this.updateActivity();
  }

  get isSpeaking(): boolean {
    return this._isSpeaking;
  }

  set isSpeaking(value: boolean) {
    this._isSpeaking = value;
    this.updateActivity();
  }

  move(x: number, y: number, z: number): void {
    this._position.setPosition(x, y, z);
    this.updateActivity();
  }

  speak(): void {
    this._isSpeaking = true;
    this.updateActivity();
  }

  stopSpeaking(): void {
    this._isSpeaking = false;
  }

  updateActivity(): void {
    this._lastActivity = new Date();
  }

  isIdle(timeoutInMinutes: number = 5): boolean {
    const now = new Date();
    const idleTime = now.getTime() - this._lastActivity.getTime();
    const idleTimeInMinutes = idleTime / (1000 * 60);
    return idleTimeInMinutes >= timeoutInMinutes;
  }

  toObject(): any {
    return {
      id: this._id,
      name: this._name,
      country: this._country,
      position: this._position.toArray(),
      isReady: this._isReady,
      isSpeaking: this._isSpeaking
    };
  }
}