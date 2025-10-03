import { ShipType } from "../types/shipType";
import { Ship } from "./ship";

class Carrier extends Ship {
    constructor(width: number = 5, type: ShipType = ShipType.CARRIER) {
        super(width, type);
    }
}