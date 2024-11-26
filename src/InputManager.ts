import { ActionDefinition } from "./actions";
import {
  DeviceState,
  KeyboardState,
  DeviceType,
  GamepadState,
  MouseState,
} from "./devices";
import { ActionBinding } from "./ActionBinding";
import invariant from "tiny-invariant";

export interface ActionState<TValue = unknown> {
  isDown: boolean;
  justPressed: boolean;
  justReleased: boolean;
  value: TValue;
}

export class InputManager {
  private id: string;
  private disposed: boolean = false;
  private actionBindings: ActionBinding[];
  private actionStates: { [actionName: string]: ActionState<unknown> };
  private subscribers: {
    [actionName: string]: Array<(state: ActionState<unknown>) => void>;
  };
  private eventQueue: Event[];
  private deviceStates: Map<DeviceType, DeviceState<DeviceType>> = new Map();

  private static _instance?: InputManager;

  public static lazyInstance(actionBindings: ActionBinding[]): InputManager {
    if (!InputManager._instance) {
      this._instance = new InputManager(actionBindings);
    }
    return this._instance!;
  }

  constructor(actionBindings: ActionBinding[]) {
    this.id = Math.random().toString(36).substr(2, 5);
    this.log("InputManager created!");
    this.actionBindings = actionBindings;
    this.actionStates = {};
    this.subscribers = {};
    this.eventQueue = [];

    // Initialize action states and subscribers
    for (const actionBinding of actionBindings) {
      const action = actionBinding.action;
      if (!this.actionStates[action.name]) {
        this.actionStates[action.name] = {
          isDown: false,
          justPressed: false,
          justReleased: false,
          value: action.initialValue,
        };
        this.subscribers[action.name] = [];
      }
    }

    // Initialize device states based on devices used in bindings
    this.initializeDeviceStates();

    // Attach listeners
    this.attachListeners();
  }

  private initializeDeviceStates() {
    // Collect all devices used in the bindings
    const devices = new Set<DeviceType>(
      this.actionBindings.flatMap((ab) => ab.bindings.map((b) => b.device)),
    );

    for (const device of devices) {
      let deviceState: DeviceState<typeof device> | undefined;
      switch (device) {
        case DeviceType.Keyboard:
          deviceState = new KeyboardState();
          break;
        case DeviceType.Mouse:
          deviceState = new MouseState();
          break;
        case DeviceType.Gamepad:
          deviceState = new GamepadState();
          break;
        // Add other devices as needed
        default:
          console.warn(`Unknown device type: ${device}`);
          continue;
      }
      this.deviceStates.set(device, deviceState);
    }
  }

  private attachListeners = () => {
    this.log("Attaching listeners");
    // Attach handleEvent to each deviceState
    for (const deviceState of this.deviceStates.values()) {
      deviceState.addEventListener(this.handleEvent);
    }
  };

  private detachListeners = () => {
    this.log("Detaching listeners");
    // Remove handleEvent from each deviceState
    for (const deviceState of this.deviceStates.values()) {
      deviceState.removeEventListener(this.handleEvent);
    }
  };

  private handleEvent = (event: Event) => {
    this.log("handleEvent", { event });
    this.eventQueue.push(event);
  };

  public processEvents = () => {
    // First, process events in all device states, so they can update their internal state and call handleEvent
    for (const deviceState of this.deviceStates.values()) {
      deviceState.processEvents();
    }

    // Then, process the events collected in our eventQueue
    while (this.eventQueue.length > 0 && !this.disposed) {
      const event = this.eventQueue.shift()!;
      this.processEvent(event);
    }

    // Reset transient states
    for (const state of Object.values(this.actionStates)) {
      state.justPressed = false;
      state.justReleased = false;
    }
  };

  private processEvent(event: Event) {
    this.log("processing device event");
    for (const actionBinding of this.actionBindings) {
      const action = actionBinding.action;
      for (const binding of actionBinding.bindings) {
        if (binding.adapter.match(event)) {
          this.log("Matched event to binding!", { event, binding });

          const deviceState = this.deviceStates.get(binding.device);
          if (!deviceState) {
            invariant(
              deviceState,
              `Device state not found for ${binding.device}`,
            );
            continue;
          }

          const adaptedValue = binding.adapter.adapt(event, deviceState);
          this.updateActionState(action, adaptedValue);
        }
      }
    }
  }

  private updateActionState<TDef extends ActionDefinition>(
    action: TDef,
    value: TDef["initialValue"],
  ) {
    this.log("updateActionState", { action, value });
    const state = this.actionStates[action.name] as ActionState<
      TDef["initialValue"]
    >;
    const previousIsDown = state.isDown;

    state.value = value;

    // Determine isDown based on action type and value
    if (action.type === "button") {
      const isDown = value as unknown as boolean;
      state.isDown = isDown;
    } else if (action.type === "axis") {
      const axisValue = value as unknown as number;
      state.isDown = axisValue !== 0;
    } else if (action.type === "vector") {
      const vectorValue = value as unknown as { x: number; y: number };
      state.isDown = vectorValue.x !== 0 || vectorValue.y !== 0;
    }

    // Update justPressed and justReleased
    state.justPressed = state.isDown && !previousIsDown;
    state.justReleased = !state.isDown && previousIsDown;

    // Notify subscribers
    this.notifySubscribers(action, state);
  }

  private notifySubscribers<TDef extends ActionDefinition>(
    action: TDef,
    state: ActionState<TDef["initialValue"]>,
  ) {
    invariant(action, "Action must be defined");
    const subscribers = this.subscribers[action.name];
    if (subscribers) {
      subscribers.forEach((callback) => callback(state));
    }
  }

  public getActionState<TDef extends ActionDefinition>(
    action: TDef,
  ): ActionState<TDef["initialValue"]> {
    return this.actionStates[action.name] as ActionState<TDef["initialValue"]>;
  }

  public subscribe<TDef extends ActionDefinition>(
    action: TDef,
    callback: (state: ActionState<TDef["initialValue"]>) => void,
  ) {
    this.subscribers[action.name].push(
      callback as (state: ActionState<unknown>) => void,
    );
    return () => {
      this.subscribers[action.name] = this.subscribers[action.name].filter(
        (cb) => cb !== callback,
      );
    };
  }

  public dispose() {
    this.log("InputManager disposed!");
    this.disposed = true;
    this.detachListeners();

    // Dispose of device states
    for (const deviceState of this.deviceStates.values()) {
      deviceState.dispose();
    }
    this.deviceStates.clear();
  }

  private log(...args: Parameters<typeof console.info>) {
    // eslint-disable-next-line no-constant-condition
    if (true) {
      console.info(`InputManager#${this.id}`, ...args);
    }
  }
}
