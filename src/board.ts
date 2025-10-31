import { Ship } from "./ships/ship";
import type { Point } from "./types/point";

class Board {
    ships: Ship[]
    turns: number;
    shots: number;
    shotPositions: Point[];
    width: number;
    height: number;
    placingPosition: Point[];

    constructor(){
        this.ships = [];
        this.shotPositions = [];
        this.placingPosition = [];
        this.turns = 0;
        this.shots = 0;
        this.width = 10;
        this.height = 10;
    }

    getShips(): Ship[] {
        return this.ships;
    }

    getTurns(): number {
        return this.turns;
    }

    getShots(): number {
        return this.shots;
    }

    addShip(sh: Ship): boolean {
        // Ugly code
        // Checks if a ship already has this position
        const hasShip: boolean = this.ships.some((ship: Ship)=>{
            const positions: Point[] = ship.getPositions();

            // Checks if any of the ships have a conflicting position which will return true if every value is true, meaning the full position is empty for a ship to be placed
           const posCheck: boolean[] = positions.map((p: Point) => {
                // Checks if any of the position value are conflicting
                const hasConflictingPoint: boolean = sh.getPositions().some((p2: Point) => {
                    p2.x === p.x && p2.y === p.y
                });

                return hasConflictingPoint;
            })

            // If every value is true, that means a ship is already there
            // if(posCheck.every((value: boolean) => value === true)){
            //     return false;
            // } else if(posCheck.some((value: boolean) => value === true)){
            //     // Doing this because not all tiles might be true
            //     return false;
            // }
            // We only really need to know if one tile is true
            if(posCheck.some((value: boolean) => value === true)){
                // Doing this because not all tiles might be true
                return true;
            }


            return false;
        })

        if(hasShip) {
            return false;
        }

        this.ships.push(sh);

        return true;
    }

    hitPosition(point: Point): boolean {
        if(this.hasShotAt(point)){
            return false;
        }

        const ship: Ship | undefined = this.ships.find((s: Ship) => s.hasPosition(point));

        if(ship){
            ship.addHitPosition(point);
            return true;
        } else {
            this.shotPositions.push(point);
            return false;
        }
    }

    hasShotAt(point: Point): boolean {
        if(this.shotPositions.some((p: Point) => p.x === point.x && p.y === point.y)){
            return true;
        }
        return this.ships.some((ship: Ship) => 
            ship.getHitPositions().some((p: Point) => p.x === point.x && p.y === point.y)
        );
    }

    isHit(point: Point): boolean {
        return this.ships.some((ship: Ship) => ship.hasPosition(point) && 
            ship.getHitPositions().some((p: Point) => p.x === point.x && p.y === point.y));
    }

    isMiss(point: Point): boolean {
        return this.shotPositions.some((p: Point) => p.x === point.x && p.y === point.y);
    }

    allShipsSunk(): boolean {
        return this.ships.length > 0 && this.ships.every((ship: Ship) => ship.isSunk());
    }

    hasShipAt(point: Point): boolean {
        return this.ships.some((ship: Ship) => ship.hasPosition(point));
    }

    draw(): string {
        let out: string = "";

        for(let y = 0; y < this.height; ++y){
            for(let x = 0; x < this.width; ++x){
                const point: Point = {x, y};
                let added: boolean = false;

                if(this.isHit(point)){
                    out += " X ";
                    added = true;
                } else if(this.isMiss(point)){
                    out += " O ";
                    added = true;
                }

                if(added === false){
                    out += " - ";
                }
            }

            out += "\n";
        }

        return out;
    }

    drawOwnBoard(): string {
        let out: string = "";

        for(let y = 0; y < this.height; ++y){
            for(let x = 0; x < this.width; ++x){
                const point: Point = {x, y};
                let added: boolean = false;

                if(this.isHit(point)){
                    out += " X ";
                    added = true;
                } else if(this.isMiss(point)){
                    out += " O ";
                    added = true;
                } else if(this.hasShipAt(point)){
                    out += " # ";
                    added = true;
                }

                if(added === false){
                    out += " - ";
                }
            }

            out += "\n";
        }

        return out;
    }

    drawOpponentBoard(): string {
        return this.draw();
    }
    
    drawPlacingPosition(): string {
        let out: string = "";

        for(let y = 0; y < this.height; ++y){
            for(let x = 0; x < this.width; ++x){
                let added: boolean = false;

                this.placingPosition.map((value: Point)=> {
                    if(value.y === y && value.x === x){
                        out += " # ";
                        added = true;
                    }
                })

                this.ships.map((ship: Ship)=>{
                    if(ship.getPositions().some((point: Point)=> point.y === y && point.x === x)){
                        out += " # ";
                        added = true;
                    }
                })

                if(added === false){
                    out += " - ";
                }
            }

            out += "\n"
        }

        return out;
    }

    hasShipAtPlacingPosition(point: Point): boolean {
        const hasShip: boolean = this.placingPosition.some((value: Point)=>{
            return value.y === point.y && value.x === point.x;
        });


        return hasShip;
    }

    calculateShipPositions(startPoint: Point, width: number, isHorizontal: boolean): Point[] {
        const positions: Point[] = [];
        for(let i = 0; i < width; i++){
            if(isHorizontal){
                positions.push({x: startPoint.x + i, y: startPoint.y});
            } else {
                positions.push({x: startPoint.x, y: startPoint.y + i});
            }
        }
        return positions;
    }

    wouldCollideWithPlacedShips(positions: Point[]): boolean {
        return positions.some((pos: Point) => 
            this.ships.some((ship: Ship) => 
                ship.getPositions().some((shipPos: Point) => 
                    shipPos.x === pos.x && shipPos.y === pos.y
                )
            )
        );
    }

    findEmptyPosition(width: number, isHorizontal: boolean): Point {
        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++){
                const testPositions: Point[] = this.calculateShipPositions({x, y}, width, isHorizontal);
                const outOfBounds: boolean = testPositions.some((pos: Point) => 
                    pos.x >= this.width || pos.y >= this.height || pos.x < 0 || pos.y < 0
                );
                if(!outOfBounds && !this.wouldCollideWithPlacedShips(testPositions)){
                    return {x, y};
                }
            }
        }
        return {x: 0, y: 0};
    }
    
}

export {Board}