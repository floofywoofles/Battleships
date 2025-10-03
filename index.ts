import readline from "readline-sync"
import { Board } from "./src/board";
import { Carrier } from "./src/ships/carrier";
import { Battleship } from "./src/ships/battleship";
import { Cruiser } from "./src/ships/cruiser";
import { Destroyer } from "./src/ships/destroyer";
import { Submarine } from "./src/ships/submarine";
import type { Point } from "./src/types/point";
import type { Ship } from "./src/ships/ship";

const board: Board = new Board();

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const shipCycle: string[] = [
    "carrier",
    "battleship",
    "cruiser",
    "destroyer",
    "submarine",
];
const shipIndex: number = 0;
const shipMaxLength: number = shipCycle.length;

//TODO fix input
console.clear();
const position = readline.question(`Where do you want to place your ${shipCycle[shipIndex]}? (y,x)\n`);
// Draw the ship from x to the width of the ship
console.log(board.drawPlacingPosition());
