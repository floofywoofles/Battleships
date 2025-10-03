import { ShipType } from "../types/shipType";
import { Ship } from "./ship";

class Battleship extends Ship {
    constructor(width: number = 4, type: ShipType = ShipType.BATTLESHIP) {
        super(width, type);
    }
}

export {Battleship}