import { ActionMap, ActionType } from "./actions";
import { KeyboardButtonAdapter } from "./adapters";
import { GamepadButtonAdapter } from "./adapters/GamepadButtonAdapter";
import { DeviceType, GamepadButtons } from "./devices";
import { ActionBinding } from "./InputBinding";

export const Actions = {
  Fire: {
    name: "fire",
    type: ActionType.Button,
    initialValue: false,
  },
  Move: {
    name: "move",
    type: ActionType.Vector,
    initialValue: { x: 0, y: 0 },
  },
} satisfies ActionMap;

export const actionBindings: ActionBinding[] = [
  {
    action: Actions.Move,
    bindings: [],
  },
  {
    action: Actions.Fire,
    bindings: [
      {
        inputId: "fire/space",
        device: DeviceType.Keyboard,
        adapter: new KeyboardButtonAdapter("Space"),
      },
      {
        inputId: "fire/south",
        device: DeviceType.Gamepad,
        adapter: new GamepadButtonAdapter(0, GamepadButtons.South),
      },
    ],
  },
];
