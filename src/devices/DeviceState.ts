export enum DeviceType {
  Keyboard = "keyboard",
  Mouse = "mouse",
  Gamepad = "gamepad",
  Virtual = "virtual",
}

export type DeviceState<TDevice extends DeviceType = any> = {
  getDeviceType(): TDevice;
  dispose(): void;
  processEvents(): void;
  addEventListener(fn: (event: Event) => void): void;
  removeEventListener(fn: (event: Event) => void): void;
};
