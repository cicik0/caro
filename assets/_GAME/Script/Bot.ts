import { _decorator, CCString, Component, math, Node } from 'cc';
import { Constant } from './Constant';
import { BoardController } from './BoardController';
import { Cell } from './Cell';
const { ccclass, property } = _decorator;

@ccclass('Bot')
export class Bot extends Component {

    @property({
        type: BoardController
    })
    board: BoardController = null;

    botCellType: String|null = null;
    isBotTurn: number;

    onLoad(){
        this.OnInit();
        //this.node.on('botTurn', this.BotPlayInTurn, this);
        //let isBotTurnEventRegistered = this.node.hasEventListener('botTurn');
        //console.log('Sự kiện botTurn có được đăng ký để lắng nghe: ', isBotTurnEventRegistered);
    }

    OnInit(){
        if(GateUserInfor.typeOfCell === Constant.CELL_X){
            //console.info(GateUserInfor.typeOfCell);
            this.botCellType = Constant.CELL_O;
        }
        else{
            this.botCellType = Constant.CELL_X;
        }
        //console.info('bot cellType: ' + this.botCellType);

        this.isBotTurn = -GateUserInfor.isTurn;
        //console.info('bot turn: ' + this.isBotTurn);

    }

    start() {
        //this.BotPlayInTurn();    
        this.RandomCell();    
    }
    
    onDestroy(){
        //this.node.off('botTurn', this.BotPlayInTurn, this);
    }

    update(deltaTime: number) {
        
    }

    BotPlayInTurn():void{
        if(this.isBotTurn === 1 && winGame === false){
            //console.log('turn of bot_________________________________________', winGame);
            this.ChooseBestMove();
            //this.RandomCell();
        }
    }

    //chon cell
    ChooseCell(row: number, col: number){
        console.log('bot touch on a cell', row, col);
        if(row < this.board.row && row >= 0 && col>=0 && col < this.board.colum){
            const cell = this.board.boardArray[row][col];    
            const cellControll = cell.getComponent(Cell);
            if(cellControll){
                console.log(`bot type: ${this.botCellType}, ${this.isBotTurn}`);
                cellControll.HideAllSprites();
                for(let i = 0; i<cellControll.cellSprites.length; i++){
                    if(cellControll.cellSprites[i].name === this.botCellType){
                        //console.log(`dmm bang roi day`);
                        cellControll.ShowOneSprite(i);
                        cellControll.currentType = this.botCellType;
                        //console.log('dmm hien len cho tao  ', cellControll.currentType);
                        cellControll.isClick = true;
                        cellControll.node.emit('finishTurn', cellControll.rowIndex, cellControll.colIndex);
                        //this.isBotTurn = -this.isBotTurn;
                        return;
                    }
                }
            }        
        }
    }
//#region SCORE
    //tinh diem tren toan ban co
    EvaluateBoard(): number{
        let score = 0;

        //evalute row, column, diagonal
        for(let row =0; row<this.board.row; row++){
            for(let col = 0; col < this.board.colum; col++){
                score += this.EvaluateCell(row, col);
            }
        }
        return score;
    }

    //score with each cell
    EvaluateCell(row: number, col: number): number{
        const cell = this.board.boardArray[row][col];
        const cellControll = cell.getComponent(Cell);

        if(cellControll.currentType === null){
            return 0; //no check null cell
        }

        const cellType = cellControll.currentType;
        let cellScore = 0;

        //4 director: row, clo, up_diagonal_left, up_digonal_right
        const directions = [
            {rowOffset: 0, colOffset: 1}, //row
            {rowOffset: 1, colOffset: 0}, //column
            {rowOffset: -1, colOffset: 1}, //up_diagonal_left
            {rowOffset: 1, colOffset: 1}, //up_digonal_right
        ]

        for(let direction of directions){
            let count = 1 //count current cell
            let openEnds = 0; //count open cell

            //check with a direction
            count += this.CountInDirection(row, col, direction.rowOffset, direction.colOffset, cellType);
            openEnds += this.IsEndOpen(row, col, direction.rowOffset, direction.colOffset, cellType);

            //check with reverse direction
            count += this.CountInDirection(row, col, -direction.rowOffset, -direction.colOffset, cellType);
            openEnds += this.IsEndOpen(row, col, -direction.rowOffset, -direction.colOffset, cellType);

            if(count >= 5){
                //win
                cellScore += (cellType === this.botCellType) ? 2000: 3000;
            }else if(count === 4){
                switch(openEnds){
                    case 1: 
                        cellScore += (cellType === this.botCellType) ? 1000: 1500;
                        break;
                    case 2: 
                        cellScore += (cellType === this.botCellType) ? 500: 1000;
                        break;
                }               
            }else if(count === 3){
                switch(openEnds){
                    case 2: 
                        cellScore += (cellType === this.botCellType) ? 100: 500;
                        break;
                    case 1: 
                        cellScore += (cellType === this.botCellType) ? 10: 300;
                        break;
                } 
            }else if(count === 2 && openEnds > 0){
                cellScore += (cellType === this.botCellType) ? 2: 50    ;
            }else if(count === 1 && openEnds > 0){
                cellScore += (cellType === this.botCellType) ? 1 : 20;
            }
        }
        //console.log('cellScore: ', cellScore);
        return cellScore;
    }

    //check combo cell in director
    CountInDirection(row: number, col: number, rowOffset: number, colOffset: number, cellType: string): number{
        let count = 0;
        let r = row + rowOffset;
        let c = col + colOffset;

        while(this.IsValidCell(r,c) && this.board.boardArray[r][c].getComponent(Cell).currentType === cellType){
            count++;
            r += rowOffset;
            c += colOffset;
        }

        return count;
    }

    //when end combo is a null cell?
    IsEndOpen(row: number, col: number, rowOffset: number, colOffset: number, cellType: string): number{
        let r = row + rowOffset;
        let c = col + colOffset;

        if(this.IsValidCell(r, c) && this.board.boardArray[r][c].getComponent(Cell).currentType === cellType){
            return 1;
        }

        return 0;
    }

    //check cell in board
    IsValidCell(row: number, col: number): boolean{
        return row >= 0 && row < this.board.row && col >= 0 && col < this.board.colum;
    }
//#endregion

//#region minmax
    MiniMax(depth: number, isMaximizing: boolean, alpha: number, beta: number):number{
        if(depth === 0 || this.IsGameOver()){
            return this.EvaluateBoard();
        }

        if(isMaximizing){
            let maxEval = -Infinity;
            for(let row = 0; row < this.board.row; row++){
                for(let col = 0; col < this.board.colum; col++){
                    const cell = this.board.boardArray[row][col].getComponent(Cell);
                    if(cell.currentType === null){
                        cell.currentType === this.botCellType;
                        let _eval = this.MiniMax(depth-1, false, alpha, beta);
                        cell.currentType = null;
                        maxEval = Math.max(maxEval, _eval);
                        alpha = Math.max(alpha, _eval);
                        if(beta <= alpha){
                            break;
                        }
                    }
                }
            }
            return maxEval;
        }else{
            let minEval = Infinity;
            for(let row = 0; row<this.board.row; row++){
                for(let col = 0; col<this.board.colum; col++){
                    const cell = this.board.boardArray[row][col].getComponent(Cell);
                    if(cell.currentType === null){
                        cell.currentType = this.OpponentCellType();
                        let _eval = this.MiniMax(depth-1, true, alpha, beta);
                        cell.currentType = null;
                        minEval = Math.min(minEval, _eval);
                        beta = Math.min(beta, _eval);
                        if(beta <= alpha){
                            break;
                        }
                    }
                }
            }
            return minEval;
        }
        
    }

    //Choose cell with hightest score
    ChooseBestMove():void{
        console.info('choose best move_______');
        //let bestMove = null;
        let bestMoves = [];
        let bestValue = -Infinity;

        for(let row = 0; row<this.board.row; row++){
            for(let col = 0; col<this.board.colum; col++){
                const cell = this.board.boardArray[row][col].getComponent(Cell);
                if(cell.currentType === null){

                    //tinh diem theo bot
                    cell.currentType = this.botCellType;
                    let botMoveValue = this.EvaluateBoard() //this.MiniMax(1, false, -Infinity, Infinity);
                    cell.currentType = null;

                    //tinh diem theo player
                    cell.currentType = this.OpponentCellType();
                    let opponentMoveValue = this.EvaluateBoard();
                    cell.currentType = null;

                    //uu tien phong thu
                    let moveValue = Math.max(botMoveValue, opponentMoveValue);

                    if(moveValue > bestValue){
                        //bestMove = {row, col};
                        bestValue = moveValue;
                        bestMoves = [{row, col}];
                    }else if(moveValue === bestValue){
                        bestMoves.push({row, col});
                    }
                }
            }
        }

        if(bestMoves.length > 0){
            const bestMove = bestMoves[(Math.floor(Math.random() * bestMoves.length))];
            console.log('show cell ', bestMove.row ,  bestMove.col);
            this.ChooseCell(bestMove.row, bestMove.col);
        }
    }

    //check bot win or lose
    IsGameOver(): boolean{
        return winGame;
    }

    //take cell type of opponent
    OpponentCellType():string{
        return this.board.player.PlayerCellType;
    }
//#endregion

    RandomCell(){
        let row = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
        let col = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
        console.log('show bot r and c', row , col);
        this.ChooseCell(row, col);
    }
}


