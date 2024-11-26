export enum ActionType {
  Button = "button",
  Axis = "axis",
  Vector = "vector",
}

export interface ButtonActionDefinition {
  name: string;
  type: ActionType.Button;
  initialValue?: boolean;
}

export interface AxisActionDefinition {
  name: string;
  type: ActionType.Axis;
  initialValue?: number;
}

export interface VectorActionDefinition {
  name: string;
  type: ActionType.Vector;
  initialValue?: { x: number; y: number };
}

export type ActionDefinition =
  | ButtonActionDefinition
  | AxisActionDefinition
  | VectorActionDefinition;

export type ActionMap = Record<string, ActionDefinition>;
