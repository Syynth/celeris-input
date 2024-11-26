import { GamepadState } from "../devices";
import { InputAdapter } from "./InputAdapter";
import { GamepadButtons } from "../devices/StandardGamepad";

export class GamepadButtonAdapter
  implements InputAdapter<GamepadState, GamepadEvent, boolean>
{
  constructor(
    private gamepadIndex: number,
    private button: GamepadButtons,
  ) {}

  match(event: Event): boolean {
    return (
      event instanceof GamepadEvent &&
      (event.type === "gamepadbuttondown" || event.type === "gamepadbuttonup")
    );
  }

  adapt(_: GamepadEvent, state: GamepadState): boolean {
    return state.isButtonDown(this.gamepadIndex, this.button);
  }
}
