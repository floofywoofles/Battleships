import { ShipType } from "../types/shipType";
import { Ship } from "./ship";

class Cruiser extends Ship {
    constructor(width: number = 3, type: ShipType = ShipType.CRUISER) {
        super(width, type);
    }
}