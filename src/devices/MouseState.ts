import { DeviceState, DeviceType } from "./DeviceState";

export class MouseState implements DeviceState<DeviceType.Mouse> {
  private static readonly events = [
    "mousedown",
    "mouseup",
    "mousemove",
    "wheel",
  ] as const;

  private buttons = new Set<number>();
  private position: { x: number; y: number } = { x: 0, y: 0 };
  private wheelDelta: number = 0;
  private eventQueue: (MouseEvent | WheelEvent)[] = [];
  private listeners: Array<(event: MouseEvent | WheelEvent) => void> = [];

  constructor() {
    for (const event of MouseState.events) {
      window.addEventListener(event, this.handleEvent);
    }
  }

  getDeviceType(): DeviceType.Mouse {
    return DeviceType.Mouse;
  }

  isButtonDown(button: number): boolean {
    return this.buttons.has(button);
  }

  getPosition(): { x: number; y: number } {
    return { ...this.position };
  }

  getWheelDelta(): number {
    return this.wheelDelta;
  }

  private handleEvent = (event: MouseEvent | WheelEvent): void => {
    this.eventQueue.push(event);
  };

  dispose(): void {
    for (const event of MouseState.events) {
      window.removeEventListener(event, this.handleEvent);
    }
    this.listeners = [];
  }

  addEventListener(fn: (event: MouseEvent | WheelEvent) => void): void {
    this.listeners.push(fn);
  }

  removeEventListener(fn: (event: MouseEvent | WheelEvent) => void): void {
    this.listeners = this.listeners.filter((listener) => listener !== fn);
  }

  processEvents(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;
      if (event.type === "mousedown") {
        this.buttons.add(event.button);
      } else if (event.type === "mouseup") {
        this.buttons.delete(event.button);
      } else if (event.type === "mousemove") {
        this.position = { x: event.clientX, y: event.clientY };
      } else if (event.type === "wheel") {
        this.wheelDelta = (event as WheelEvent).deltaY;
      }
      // Notify listeners
      for (const listener of this.listeners) {
        listener(event);
      }
    }
    // Optionally reset wheelDelta after processing if needed
    this.wheelDelta = 0;
  }
}
