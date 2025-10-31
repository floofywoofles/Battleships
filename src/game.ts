import { Board } from "./board";
import type { Point } from "./types/point";
import type { Ship } from "./ships/ship";

type GamePhase = "placement" | "playing" | "finished";
type Player = 1 | 2;

class Game {
    player1Board: Board;
    player2Board: Board;
    currentPlayer: Player;
    gamePhase: GamePhase;
    player1ShipsPlaced: boolean;
    player2ShipsPlaced: boolean;
    winner: Player | null;
    targetPosition: Point;

    constructor(){
        this.player1Board = new Board();
        this.player2Board = new Board();
        this.currentPlayer = 1;
        this.gamePhase = "placement";
        this.player1ShipsPlaced = false;
        this.player2ShipsPlaced = false;
        this.winner = null;
        this.targetPosition = {x: 0, y: 0};
    }

    getCurrentBoard(): Board {
        return this.currentPlayer === 1 ? this.player1Board : this.player2Board;
    }

    getOpponentBoard(): Board {
        return this.currentPlayer === 1 ? this.player2Board : this.player1Board;
    }

    isPlacementPhase(): boolean {
        return this.gamePhase === "placement";
    }

    isPlayingPhase(): boolean {
        return this.gamePhase === "playing";
    }

    isFinished(): boolean {
        return this.gamePhase === "finished";
    }

    allShipsPlaced(): boolean {
        return this.player1ShipsPlaced && this.player2ShipsPlaced;
    }

    completePlacement(): void {
        if(this.currentPlayer === 1){
            this.player1ShipsPlaced = true;
            this.currentPlayer = 2;
        } else {
            this.player2ShipsPlaced = true;
            if(this.allShipsPlaced()){
                this.gamePhase = "playing";
                this.currentPlayer = 1;
                this.targetPosition = {x: 0, y: 0};
            }
        }
    }

    fireShot(): boolean {
        if(!this.isPlayingPhase()){
            return false;
        }

        const opponentBoard: Board = this.getOpponentBoard();
        
        if(opponentBoard.hasShotAt(this.targetPosition)){
            return false;
        }

        const isHit: boolean = opponentBoard.hitPosition(this.targetPosition);
        
        if(opponentBoard.allShipsSunk()){
            this.winner = this.currentPlayer;
            this.gamePhase = "finished";
            return true;
        }

        if(!isHit){
            this.switchPlayer();
        }

        return true;
    }

    switchPlayer(): void {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.targetPosition = {x: 0, y: 0};
    }

    drawGame(): string {
        if(this.isPlacementPhase()){
            return this.drawPlacementPhase();
        } else if(this.isPlayingPhase()){
            return this.drawPlayingPhase();
        } else {
            return this.drawFinishedPhase();
        }
    }

    drawPlacementPhase(): string {
        const board: Board = this.getCurrentBoard();
        let out: string = `\n=== Player ${this.currentPlayer} - Place Your Ships ===\n\n`;
        out += "Controls: WASD to move, R to rotate, SPACE to place, Q to quit\n";
        out += "Legend: # = Ship, - = Empty\n\n";
        out += board.drawPlacingPosition();
        out += `\nShips placed: ${board.getShips().length}/5\n`;
        return out;
    }

    drawPlayingPhase(): string {
        const ownBoard: Board = this.getCurrentBoard();
        const opponentBoard: Board = this.getOpponentBoard();
        let out: string = `\n=== Player ${this.currentPlayer}'s Turn ===\n\n`;
        out += "Controls: WASD to move cursor, SPACE to fire, Q to quit\n";
        out += "Legend: # = Your Ship, X = Hit, O = Miss, - = Unknown\n\n";
        out += "Your Board:\n";
        out += ownBoard.drawOwnBoard();
        out += "\nOpponent Board (Target here):\n";
        out += this.drawOpponentBoardWithCursor(opponentBoard);
        out += `\nTarget: (${this.targetPosition.x}, ${this.targetPosition.y})\n`;
        return out;
    }

    drawOpponentBoardWithCursor(board: Board): string {
        let out: string = "";
        for(let y = 0; y < board.height; ++y){
            for(let x = 0; x < board.width; ++x){
                const point: Point = {x, y};
                const isCursor: boolean = this.targetPosition.x === x && this.targetPosition.y === y;

                if(board.isHit(point)){
                    out += isCursor ? "[X]" : " X ";
                } else if(board.isMiss(point)){
                    out += isCursor ? "[O]" : " O ";
                } else {
                    out += isCursor ? "[ ]" : " - ";
                }
            }
            out += "\n";
        }
        return out;
    }

    drawFinishedPhase(): string {
        const ownBoard: Board = this.getCurrentBoard();
        const opponentBoard: Board = this.getOpponentBoard();
        let out: string = `\n=== GAME OVER ===\n\n`;
        out += `Player ${this.winner} Wins!\n\n`;
        out += "Player 1 Board:\n";
        out += this.player1Board.drawOwnBoard();
        out += "\nPlayer 2 Board:\n";
        out += this.player2Board.drawOwnBoard();
        return out;
    }
}

export {Game};
export type {GamePhase, Player};
