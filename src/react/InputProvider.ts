import {
  createElement,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { InputManager } from "../InputManager";
import { useTick } from "@pixi/react";
import { ActionMap } from "../actions";
import { ActionBinding } from "../ActionBinding";
import { InputContext } from "./context";

interface InputProviderProps {
  actions: ActionMap;
  bindings: ActionBinding[];
  enforceSingleton?: boolean;
}

export function InputProvider({
  actions,
  bindings,
  enforceSingleton = true,
  children,
}: PropsWithChildren<InputProviderProps>) {
  const [inputManager, setInputManager] = useState(() =>
    enforceSingleton
      ? InputManager.lazyInstance(bindings)
      : new InputManager(bindings),
  );

  useEffect(() => {
    setInputManager(
      enforceSingleton
        ? InputManager.lazyInstance(bindings)
        : new InputManager(bindings),
    );
  }, [actions, bindings, enforceSingleton]);

  // Process input events each frame
  useTick(() => {
    inputManager.processEvents();
  });

  useEffect(() => {
    return () => {
      inputManager.dispose();
    };
  }, [inputManager]);

  const value = useMemo(() => ({ inputManager }), [inputManager]);

  return createElement(InputContext.Provider, {
    value: value,
    children,
  });
}
