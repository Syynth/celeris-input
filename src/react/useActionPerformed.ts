// useActionPerformed.ts
import { ActionDefinition } from "./actions";
import { useInputManager } from "./context";
import { useEffect, useLayoutEffect, useRef } from "react";

export function useActionPerformed(
  action: ActionDefinition,
  callback: () => void,
  triggerOn: "justPressed" | "justReleased" = "justPressed",
) {
  const inputManager = useInputManager();
  const cbRef = useRef(callback);

  useLayoutEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const unsubscribe = inputManager.subscribe(action, (state) => {
      if (state[triggerOn]) {
        cbRef.current();
      }
    });
    return unsubscribe;
  }, [inputManager, action, triggerOn]);
}
