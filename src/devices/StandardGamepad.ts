export enum GamepadButtons {
  // Right cluster buttons (East, South, West, North)
  South = 0, // Bottom button in right cluster (e.g., A on Xbox, Cross on PlayStation)
  East = 1, // Right button in right cluster (e.g., B on Xbox, Circle on PlayStation)
  West = 2, // Left button in right cluster (e.g., X on Xbox, Square on PlayStation)
  North = 3, // Top button in right cluster (e.g., Y on Xbox, Triangle on PlayStation)

  // Shoulder buttons
  L1 = 4, // Top left front button (Left bumper)
  R1 = 5, // Top right front button (Right bumper)
  L2 = 6, // Bottom left front button (Left trigger)
  R2 = 7, // Bottom right front button (Right trigger)

  // Center cluster buttons
  Select = 8, // Left button in center cluster (e.g., Back on Xbox, Share on PlayStation)
  Start = 9, // Right button in center cluster (e.g., Start on Xbox, Options on PlayStation)

  // Stick buttons
  L3 = 10, // Left stick pressed button
  R3 = 11, // Right stick pressed button

  // D-pad buttons (Left cluster)
  DpadUp = 12, // Top button in left cluster
  DpadDown = 13, // Bottom button in left cluster
  DpadLeft = 14, // Left button in left cluster
  DpadRight = 15, // Right button in left cluster

  // Center button
  Home = 16, // Center button in center cluster (e.g., Xbox button, PS button)
}

export enum GamepadAxis {
  LeftStickX = 0, // Horizontal axis for left stick
  LeftStickY = 1, // Vertical axis for left stick
  RightStickX = 2, // Horizontal axis for right stick
  RightStickY = 3, // Vertical axis for right stick
}
