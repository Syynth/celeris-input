import { useInputManager } from "./context";
import { useEffect, useMemo, useRef } from "react";
import { ActionState } from "../InputManager";
import { ActionDefinition } from "../actions";

export function useActionState<const TDef extends ActionDefinition>(
  action: TDef,
): {
  get(): ActionState<TDef["initialValue"]>;
} {
  const inputManager = useInputManager();
  const stateRef = useRef(inputManager.getActionState(action));

  useEffect(() => {
    const unsubscribe = inputManager.subscribe(action, (newState) => {
      stateRef.current = newState;
    });
    return unsubscribe;
  }, [inputManager, action]);

  return useMemo(
    () => ({
      get() {
        return stateRef.current;
      },
    }),
    [],
  );
}
