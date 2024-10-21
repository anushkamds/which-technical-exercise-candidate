export type Direction = 'north' | 'south' | 'east' | 'west';

export type Instruction = 'forward' | 'right' | 'left';

export type Status = 'ok' | 'error' | 'crash';

export type Coordinates = {
  x: number;
  y: number;
};

export type Arena = { corner1: Coordinates; corner2: Coordinates };

export type Input = {
  arena: Arena;
  location: Coordinates;
  heading: Direction;
  directions: Instruction[];
};

export type Output = {
  status: Status;
  location: Coordinates;
  heading: Direction;
  path: Instruction[];
};
