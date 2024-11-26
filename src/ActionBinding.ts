import { ActionDefinition } from "./actions";
import { InputBinding } from "./InputBinding";

export interface ActionBinding {
  action: ActionDefinition;
  bindings: InputBinding<any, any>[];
}
