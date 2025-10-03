import { Board } from "./src/board";
import type { Point } from "./src/types/point";

const board: Board = new Board();

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

board.placingPosition[0] = {y: 8, x: 0};
board.placingPosition[1] = {y: 8, x: 1}

process.stdin.setEncoding("utf-8");
process.stdin.setRawMode(true);
process.stdin.resume();

console.clear();
console.log(board.drawPlacingPosition());
while(true){
    process.stdin.on("data", (key: string)=>{
        switch(key){
        case "w":
            board.placingPosition.map((point: Point) => {
                if(point.y -1 !== -1){
                    point.y -= 1;
                }
            })
            break;
        case "d":
            board.placingPosition.map((point: Point)=> {
                if(point.x + 1 <= board.width){
                    point.x += 1;
                }
            })
            break;
        case "s":
            board.placingPosition.map((point: Point)=>{
                if(point.y+1 < board.height){
                    point.y += 1;
                }
            })
            break;
        case "a":
            board.placingPosition.map((point: Point)=>{
                if(point.x-1 >= 0){
                    point.x -= 1
                }
            })
            break;
        case "q":
            process.exit(0);
            break;
        }
        board.placingPosition.map((value: Point)=>{
            console.info(`x: ${value.x} | y: ${value.y}`);
        })

    })
    console.clear();
    console.log(board.drawPlacingPosition());
    await sleep(500);
}