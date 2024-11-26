import { DeviceState, DeviceType } from "./DeviceState";
import { GamepadButtons, GamepadAxis } from "./StandardGamepad";

export class GamepadState implements DeviceState<DeviceType.Gamepad> {
  private static readonly events = [
    "gamepadconnected",
    "gamepaddisconnected",
  ] as const;

  private id: string = Math.random().toString(36).substr(2, 5);
  private gamepads: Map<number, Gamepad> = new Map();
  private buttons: Map<number, Set<GamepadButtons>> = new Map();
  private axes: Map<number, number[]> = new Map();
  private eventQueue: GamepadEvent[] = [];
  private listeners: Array<(event: GamepadEvent) => void> = [];

  constructor() {
    this.log("Constructing GamepadState");
    for (const event of GamepadState.events) {
      window.addEventListener(event, this.handleEvent);
    }
  }

  getDeviceType(): DeviceType.Gamepad {
    return DeviceType.Gamepad;
  }

  private handleEvent = (event: GamepadEvent): void => {
    this.log("handleEvent", { event });
    this.eventQueue.push(event);
  };

  dispose(): void {
    this.log("Disposing GamepadState");
    for (const event of GamepadState.events) {
      window.removeEventListener(event, this.handleEvent);
    }
    this.listeners = [];
  }

  addEventListener(fn: (event: GamepadEvent) => void): void {
    this.log("addEventListener", { fn });
    this.listeners.push(fn);
  }

  removeEventListener(fn: (event: GamepadEvent) => void): void {
    this.log("removeEventListener", { fn });
    this.listeners = this.listeners.filter((listener) => listener !== fn);
  }

  processEvents(): void {
    // Process connection and disconnection events
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;
      if (event.type === "gamepadconnected") {
        this.gamepads.set(event.gamepad.index, event.gamepad);
        this.buttons.set(event.gamepad.index, new Set<GamepadButtons>());
        this.axes.set(event.gamepad.index, event.gamepad.axes.slice());
      } else if (event.type === "gamepaddisconnected") {
        this.gamepads.delete(event.gamepad.index);
        this.buttons.delete(event.gamepad.index);
        this.axes.delete(event.gamepad.index);
      }
      // Notify listeners
      this.notifyListeners(event);
    }

    // Update the state of each connected gamepad
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const index of this.gamepads.keys()) {
      const gp = gamepads[index];
      if (!gp) continue;

      // Update buttons
      const pressedButtons = this.buttons.get(index) ?? new Set();
      if (pressedButtons) {
        gp.buttons.forEach((button, idx: GamepadButtons) => {
          if (button.pressed) {
            const hadPressed = pressedButtons.has(idx);
            pressedButtons.add(idx);
            if (!hadPressed) {
              const event = new GamepadEvent("gamepadbuttondown", {
                gamepad: gp,
              });
              this.notifyListeners(event);
            }
          } else {
            const hadPressed = pressedButtons.has(idx);
            pressedButtons.delete(idx);
            if (hadPressed) {
              const event = new GamepadEvent("gamepadbuttonup", {
                gamepad: gp,
              });
              this.notifyListeners(event);
            }
          }
        });
      }
      this.buttons.set(index, pressedButtons);

      // Update axes
      this.axes.set(index, gp.axes.slice());
    }
  }

  private notifyListeners(event: GamepadEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  isButtonDown(gamepadIndex: number, button: GamepadButtons): boolean {
    const buttons = this.buttons.get(gamepadIndex);
    console.log("isButtonDown", {
      gamepadIndex,
      button,
      buttons: Array.from(buttons ?? []).join(", "),
      has: buttons?.has(button),
    });
    return buttons ? buttons.has(button) : false;
  }

  getAxisValue(gamepadIndex: number, axis: GamepadAxis): number {
    const axes = this.axes.get(gamepadIndex);
    return axes ? axes[axis] || 0 : 0;
  }

  getConnectedGamepadIndices(): number[] {
    return Array.from(this.gamepads.keys());
  }

  private log(...args: Parameters<typeof console.info>) {
    // eslint-disable-next-line no-constant-condition
    if (true) {
      console.info(`GamepadState#${this.id}`, ...args);
    }
  }
}
