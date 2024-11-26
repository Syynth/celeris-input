// devices/KeyboardState.ts
import { DeviceState, DeviceType } from "./DeviceState";

export class KeyboardState implements DeviceState<DeviceType.Keyboard> {
  private static readonly events = ["keydown", "keyup"] as const;

  private id: string = Math.random().toString(36).substr(2, 5);
  private readonly keys = new Set<string>();
  private readonly eventQueue: KeyboardEvent[] = [];
  private listeners: Array<(event: KeyboardEvent) => void> = [];

  constructor() {
    this.log("KeyboardState created!");
    for (const event of KeyboardState.events) {
      window.addEventListener(event, this.handleEvent);
    }
  }

  getDeviceType(): DeviceType.Keyboard {
    return DeviceType.Keyboard;
  }

  isKeyDown(code: string): boolean {
    this.log("isKeyDown", { code, response: this.keys.has(code) });
    return this.keys.has(code);
  }

  private handleEvent = (event: KeyboardEvent): void => {
    this.log("handleEvent", { event });
    this.eventQueue.push(event);
  };

  dispose(): void {
    this.log("Disposing KeyboardState");
    for (const event of KeyboardState.events) {
      window.removeEventListener(event, this.handleEvent);
    }
    this.listeners = [];
  }

  addEventListener(fn: (event: KeyboardEvent) => void): void {
    this.log("addEventListener", { fn });
    this.listeners.push(fn);
  }

  removeEventListener(fn: (event: KeyboardEvent) => void): void {
    this.log("removeEventListener", { fn });
    this.listeners = this.listeners.filter((listener) => listener !== fn);
  }

  processEvents(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;
      if (event.type === "keydown") {
        this.log("Adding key to keys", { code: event.code });
        this.keys.add(event.code);
      } else if (event.type === "keyup") {
        this.keys.delete(event.code);
        this.log("Removing key from keys", { code: event.code });
      }
      for (const listener of this.listeners) {
        this.log("Publishing event to listener", { event, listener });
        listener(event);
      }
    }
  }

  private log(...args: Parameters<typeof console.info>) {
    // eslint-disable-next-line no-constant-condition
    if (false) {
      console.info(`KeyboardState#${this.id}`, ...args);
    }
  }
}
