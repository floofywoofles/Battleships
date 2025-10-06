import readline from "readline-sync"
import { Board } from "./src/board";
import { Carrier } from "./src/ships/carrier";
import { Battleship } from "./src/ships/battleship";
import { Cruiser } from "./src/ships/cruiser";
import { Destroyer } from "./src/ships/destroyer";
import { Submarine } from "./src/ships/submarine";
import type { Point } from "./src/types/point";
import type { Ship } from "./src/ships/ship";
import { ShipType } from "./src/types/shipType";

const board: Board = new Board();

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const shipCycle = [
    { class: Carrier, width: 2, type: ShipType.CARRIER },
    { class: Battleship, width: 4, type: ShipType.BATTLESHIP },
    { class: Cruiser, width: 3, type: ShipType.CRUISER },
    { class: Destroyer, width: 2, type: ShipType.DESTROYER },
    { class: Submarine, width: 3, type: ShipType.SUBMARINE },
];
let shipIndex: number = 0;
const shipMaxLength: number = shipCycle.length;

let currentShip: Ship = new shipCycle[shipIndex]!.class(shipCycle[shipIndex]!.width, shipCycle[shipIndex]!.type);
let startPoint: Point = {x: 0, y: 0};
let isHorizontal: boolean = true;

board.placingPosition = board.calculateShipPositions(startPoint, currentShip.getWidth(), isHorizontal);

console.log(board.drawPlacingPosition());

process.stdin.setEncoding("utf8");
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on("data", (key: string) => {
    if(key === "q"){
        process.exit();
    }
    
    switch(key){
        case "w":
            startPoint.y--;
            break;
        case "s":
            startPoint.y++;
            break;
        case "a":
            startPoint.x--;
            break;
        case "d":
            startPoint.x++;
            break;
        case "r":
            isHorizontal = !isHorizontal;
            break;
        case " ":
            // Set the current ship's positions before adding it
            currentShip.positions = [...board.placingPosition];
            board.addShip(currentShip);
            
            shipIndex++;
            if(shipIndex >= shipMaxLength){
                process.exit();
            }
            
            // Create next ship and find empty position
            const nextShip = shipCycle[shipIndex]!;
            currentShip = new nextShip.class(nextShip.width, nextShip.type);
            
            // Find an empty spot that doesn't collide with placed ships
            startPoint = board.findEmptyPosition(currentShip.getWidth(), isHorizontal);
            
            board.placingPosition = board.calculateShipPositions(startPoint, currentShip.getWidth(), isHorizontal);
            break;
        case "q":
          process.exit();
          break;
    }
    
    // Boundary checks to keep entire ship on the board
    if(isHorizontal){
        startPoint.x = Math.max(0, Math.min(startPoint.x, board.width - currentShip.getWidth()));
        startPoint.y = Math.max(0, Math.min(startPoint.y, board.height - 1));
    } else {
        startPoint.x = Math.max(0, Math.min(startPoint.x, board.width - 1));
        startPoint.y = Math.max(0, Math.min(startPoint.y, board.height - currentShip.getWidth()));
    }
    
    // Recalculate ship positions and check for collision
    const newPositions: Point[] = board.calculateShipPositions(startPoint, currentShip.getWidth(), isHorizontal);
    
    // Only update if no collision with placed ships
    if(!board.wouldCollideWithPlacedShips(newPositions)){
        board.placingPosition = newPositions;
    } else {
        // Revert to previous valid position
        startPoint.x = board.placingPosition[0]!.x;
        startPoint.y = board.placingPosition[0]!.y;
    }
    
    // Clear console and redraw
    console.clear();
    console.log(board.drawPlacingPosition());
});
