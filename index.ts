import { Game } from "./src/game";
import { Carrier } from "./src/ships/carrier";
import { Battleship } from "./src/ships/battleship";
import { Cruiser } from "./src/ships/cruiser";
import { Destroyer } from "./src/ships/destroyer";
import { Submarine } from "./src/ships/submarine";
import type { Point } from "./src/types/point";
import type { Ship } from "./src/ships/ship";
import { ShipType } from "./src/types/shipType";
import { Board } from "./src/board";

const game: Game = new Game();

const shipCycle = [
    { class: Carrier, width: 5, type: ShipType.CARRIER },
    { class: Battleship, width: 4, type: ShipType.BATTLESHIP },
    { class: Cruiser, width: 3, type: ShipType.CRUISER },
    { class: Destroyer, width: 2, type: ShipType.DESTROYER },
    { class: Submarine, width: 3, type: ShipType.SUBMARINE },
];

let shipIndex: number = 0;
const shipMaxLength: number = shipCycle.length;

let currentShip: Ship | null = null;
let startPoint: Point = {x: 0, y: 0};
let isHorizontal: boolean = true;

function initializePlacement(): void {
    const board: Board = game.getCurrentBoard();
    currentShip = new shipCycle[shipIndex]!.class(shipCycle[shipIndex]!.width, shipCycle[shipIndex]!.type);
    startPoint = board.findEmptyPosition(currentShip.getWidth(), isHorizontal);
    board.placingPosition = board.calculateShipPositions(startPoint, currentShip.getWidth(), isHorizontal);
}

function handlePlacementKey(key: string): void {
    const board: Board = game.getCurrentBoard();
    
    if(!currentShip){
        return;
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
            const newOrientation: boolean = !isHorizontal;
            let rotatedStartPoint: Point = {...startPoint};
            
            if(newOrientation){
                rotatedStartPoint.x = Math.max(0, Math.min(rotatedStartPoint.x, board.width - 1));
                rotatedStartPoint.y = Math.max(0, Math.min(rotatedStartPoint.y, board.height - currentShip.getWidth()));
            } else {
                rotatedStartPoint.x = Math.max(0, Math.min(rotatedStartPoint.x, board.width - currentShip.getWidth()));
                rotatedStartPoint.y = Math.max(0, Math.min(rotatedStartPoint.y, board.height - 1));
            }
            
            const rotatedPositions: Point[] = board.calculateShipPositions(rotatedStartPoint, currentShip.getWidth(), newOrientation);
            if(!board.wouldCollideWithPlacedShips(rotatedPositions)){
                isHorizontal = newOrientation;
                startPoint = rotatedStartPoint;
                board.placingPosition = rotatedPositions;
            }
            break;
        case " ":
            currentShip.positions = [...board.placingPosition];
            board.addShip(currentShip);
            
            shipIndex++;
            if(shipIndex >= shipMaxLength){
                game.completePlacement();
                if(game.isPlacementPhase()){
                    shipIndex = 0;
                    isHorizontal = true;
                    initializePlacement();
                } else {
                    initializePlaying();
                }
                return;
            }
            
            const nextShip = shipCycle[shipIndex]!;
            currentShip = new nextShip.class(nextShip.width, nextShip.type);
            startPoint = board.findEmptyPosition(currentShip.getWidth(), isHorizontal);
            board.placingPosition = board.calculateShipPositions(startPoint, currentShip.getWidth(), isHorizontal);
            break;
    }
    
    if(!currentShip){
        return;
    }

    if(isHorizontal){
        // Ensure that the ship does not go out of the left or right edges of the board.
        // For horizontal placement, the rightmost allowed starting point for x is (board.width - currentShip.getWidth()).
        startPoint.x = Math.max(0, Math.min(startPoint.x, board.width - currentShip.getWidth()));
        // Keep the y position within the vertical bounds so the ship stays on the board.
        // Since the ship is horizontal, y can go from 0 to (board.height - 1).
        startPoint.y = Math.max(0, Math.min(startPoint.y, board.height - 1));
    } else {
        startPoint.x = Math.max(0, Math.min(startPoint.x, board.width - 1));
        startPoint.y = Math.max(0, Math.min(startPoint.y, board.height - currentShip.getWidth()));
    }
    
    const newPositions: Point[] = board.calculateShipPositions(startPoint, currentShip.getWidth(), isHorizontal);
    
    if(!board.wouldCollideWithPlacedShips(newPositions)){
        board.placingPosition = newPositions;
    } else {
        if(board.placingPosition.length > 0){
            startPoint.x = board.placingPosition[0]!.x;
            startPoint.y = board.placingPosition[0]!.y;
        } else {
            startPoint = board.findEmptyPosition(currentShip.getWidth(), isHorizontal);
            board.placingPosition = board.calculateShipPositions(startPoint, currentShip.getWidth(), isHorizontal);
        }
    }
}

function initializePlaying(): void {
    game.targetPosition = {x: 0, y: 0};
}

function handlePlayingKey(key: string): void {
    const opponentBoard: Board = game.getOpponentBoard();
    
    switch(key){
        case "w":
            game.targetPosition.y = Math.max(0, game.targetPosition.y - 1);
            break;
        case "s":
            game.targetPosition.y = Math.min(opponentBoard.height - 1, game.targetPosition.y + 1);
            break;
        case "a":
            game.targetPosition.x = Math.max(0, game.targetPosition.x - 1);
            break;
        case "d":
            game.targetPosition.x = Math.min(opponentBoard.width - 1, game.targetPosition.x + 1);
            break;
        case " ":
            if(!opponentBoard.hasShotAt(game.targetPosition)){
                game.fireShot();
                if(game.isFinished()){
                    return;
                }
            }
            break;
    }
}

function handleKeyPress(key: string): void {
    if(key === "q"){
        process.exit();
        return;
    }

    if(game.isFinished()){
        return;
    }

    if(game.isPlacementPhase()){
        handlePlacementKey(key);
    } else if(game.isPlayingPhase()){
        handlePlayingKey(key);
    }
    
    render();
}

function render(): void {
    console.clear();
    console.log(game.drawGame());
}

initializePlacement();
render();

process.stdin.setEncoding("utf8");
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on("data", handleKeyPress);
