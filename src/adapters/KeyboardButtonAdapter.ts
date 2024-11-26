import { KeyboardState } from "../devices";
import { InputAdapter } from "./InputAdapter";

export class KeyboardButtonAdapter
  implements InputAdapter<KeyboardState, KeyboardEvent, boolean>
{
  constructor(private key: string) {}

  match(event: Event): boolean {
    return event instanceof KeyboardEvent && event.code === this.key;
  }

  adapt(_input: KeyboardEvent, state: KeyboardState): boolean {
    return state.isKeyDown(this.key);
  }
}
