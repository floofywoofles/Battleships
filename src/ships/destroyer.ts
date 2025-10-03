import { ShipType } from "../types/shipType";
import { Ship } from "./ship";

class Destroyer extends Ship {
    constructor(width: number = 2, type: ShipType = ShipType.DESTROYER) {
        super(width, type);
    }
}