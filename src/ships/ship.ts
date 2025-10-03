import type { ShipType } from "../types/shipType";
import type { Point } from "../types/point";

class Ship {
    width: number;
    type: ShipType;
    hitPositions: Point[];
    positions: Point[];

    constructor(width: number, type: ShipType){
        this.width = width;
        this.type = type;
        this.hitPositions = [];
        this.positions = [];
    }

    getWidth(): number {
        return this.width;
    }

    getType(): ShipType {
        return this.type;
    }

    addHitPosition(point: Point): boolean {
        const firstInst: boolean = this.hitPositions.some((p: Point)=>{
            p.x === point.x && p.y === point.y
        });

        if(firstInst){
            return false;
        }

        this.hitPositions.push(point);

        return true;
    }

    getPositions(): Point[] {
        return this.positions;
    }
}

export {Ship}