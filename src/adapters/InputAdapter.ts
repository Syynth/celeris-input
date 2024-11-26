export interface InputAdapter<TDeviceState, TEvent, TOutput> {
  adapt(input: TEvent, state: TDeviceState): TOutput;
  match(input: Event): boolean;
}
