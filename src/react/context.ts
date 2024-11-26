import { createContext, useContext } from "react";
import { InputManager } from "../InputManager";

interface InputContextProps {
  inputManager: InputManager;
}

export const InputContext = createContext<InputContextProps | null>(null);

export function useInputManager(): InputManager {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error("useInputManager must be used within an InputProvider");
  }
  return context.inputManager;
}
