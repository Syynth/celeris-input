import { InputAdapter } from "./adapters";
import { DeviceType } from "./devices";

export interface InputBinding<
  TEvent extends Event = Event,
  TAdapter extends InputAdapter<unknown, TEvent, unknown> = InputAdapter<
    unknown,
    TEvent,
    unknown
  >,
> {
  /** The device type (keyboard, mouse, gamepad, etc.) */
  device: DeviceType;
  /** Identifier for the input (e.g., key code, button number) */
  inputId: string | number;
  /** Adapter to convert input events to action values */
  adapter: TAdapter;
}
