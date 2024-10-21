import * as fs from 'fs';
import { Coordinates, Instruction, Arena, Direction, Output, Input } from './types';

const directions: Direction[] = ['north', 'east', 'south', 'west'];

// Writing conent to given file name
const writeOutput = (output: Output, filePath: string) => {
  fs.writeFileSync(filePath, JSON.stringify(output));
};

// read given file
const readInputFromStdin = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    let input = '';
    process.stdin.on('data', (chunk) => {
      input += chunk;
    });
    process.stdin.on('end', () => resolve(input));
    process.stdin.on('error', (error) => reject(error));
  });
};

const parseInput = (data: string): Input => {
  return JSON.parse(data);
};

const getNextDirection = (heading: Direction, turn: string): Direction => {
  const currentIndex = directions.indexOf(heading);
  return turn === 'left' ? directions[(currentIndex + 3) % 4] : directions[(currentIndex + 1) % 4]; // turning right
};

const moveForward = (location: Coordinates, heading: string): Coordinates => {
  switch (heading) {
    case 'north':
      return { x: location.x, y: location.y + 1 };
    case 'south':
      return { x: location.x, y: location.y - 1 };
    case 'east':
      return { x: location.x + 1, y: location.y };
    case 'west':
      return { x: location.x - 1, y: location.y };
    default:
      return location;
  }
};

const isWithinArena = (location: Coordinates, arena: Arena): boolean => {
  const { corner1, corner2 } = arena;
  const minX = Math.min(corner1.x, corner2.x);
  const maxX = Math.max(corner1.x, corner2.x);
  const minY = Math.min(corner1.y, corner2.y);
  const maxY = Math.max(corner1.y, corner2.y);

  return location.x >= minX && location.x <= maxX && location.y >= minY && location.y <= maxY;
};

export const runWith = (input: Input): Output => {
  let location: Coordinates = { ...input.location };
  let heading: Direction = input.heading;
  const path: Instruction[] = [];

  for (const direction of input.directions) {
    path.push(direction);

    if (direction === 'forward') {
      const newLocation = moveForward(location, heading);
      if (!isWithinArena(newLocation, input.arena)) {
        return {
          status: 'crash',
          location,
          heading,
          path,
        };
      }
      location = newLocation;
    } else if (direction === 'left' || direction === 'right') {
      heading = getNextDirection(heading, direction);
    } else {
      return {
        status: 'error',
        location,
        heading,
        path,
      };
    }
  }

  return {
    status: 'ok',
    location,
    heading,
    path,
  };
};

// Main function
const main = async () => {
  try {
    const inputData = await readInputFromStdin();
    const input = parseInput(inputData);
    const result = runWith(input);
    writeOutput(result, 'expected.json');
  } catch (error) {
    console.error('Error processing instructions:', error);
  }
};

main();
