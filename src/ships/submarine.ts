import { ShipType } from "../types/shipType";
import { Ship } from "./ship";

class Submarine extends Ship {
    constructor(width: number = 3, type: ShipType = ShipType.SUBMARINE) {
        super(width, type);
    }
}

export {Submarine}