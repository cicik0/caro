import { _decorator, CCFloat, Color, Component, Details, Label, math, Node, tween, Vec3 } from 'cc';
import { BoardController } from './BoardController';
import { Bot } from './Bot';
import { PlayerController } from './PlayerController';
import { Cell } from './Cell';
import { UIUnits } from './UIUnits';
const { ccclass, property } = _decorator;

@ccclass('Match')
export class Match extends Component {

    @property({
        type: BoardController
    })
    Board: BoardController = null;

    @property({
        type: Bot
    })
    bot: Bot = null;

    @property({
        type: CCFloat
    })
    timeToChangeTurn:number = 5;

    @property({
        type:PlayerController
    })
    player: PlayerController = null;

    @property({
        type: Label
    })
    timeLabel: Label = null;

    //isFinisTurn: boolean = false;
    isPlayerTurn: boolean = true;
    isUpdate: boolean = true;

    DURATION = 0.1;

    private switchTurnCallBack: () => void;
    private timeElapsed: number = this.timeToChangeTurn;
    private curentTime: number = this.timeToChangeTurn;

    onLoad(){
        this.node.on('finishTurn', this.OnFinishTurn, this);
        this.switchTurnCallBack = this.SwitchTurn.bind(this);
    }

    start() {
        console.log(`1---playe turn: ${this.player.isPlaylerTurn}, bot turn: ${this.bot.isBotTurn}\n`);
        this.RegisterOnFinishTurn();
        this.UpDateTurnForCell();
        this.schedule(this.switchTurnCallBack, this.timeToChangeTurn);

    }

    update(deltaTime: number) {
        if(this.isUpdate){
            this.timeElapsed -= deltaTime;
            this.ShowTime();
        }

        if(this.timeElapsed <= 0){
            if(this.player.isPlaylerTurn === 1){
                //console.log('in update');
                UIUnits.loadPopUp("Prefabs/UI_Lose", (nodeLoading) => {
                    // setTimeout(()=>{
                    //     if(nodeLoading instanceof Node){
                    //         nodeLoading.active = false;
                    //     }
                    // }, 2000);
                });
            }
            else{
                UIUnits.loadPopUp("Prefabs/UI_Win", (nodeLoading) => {
                    // setTimeout(()=>{
                    //     if(nodeLoading instanceof Node){
                    //         nodeLoading.active = false;
                    //     }
                    // }, 2000);
                });
            }
            this.timeElapsed = this.timeToChangeTurn;
            this.unschedule(this.switchTurnCallBack);
            this.isUpdate = false;
        }
    }

    onDestroy(){
        this.unschedule(this.switchTurnCallBack);
        this.node.off('finishTurn', this.OnFinishTurn, this);
    }

//#region Switch Turn
    //doi luot
    SwitchTurn(){
        //console.log(`before playe turn: ${this.player.isPlaylerTurn}, bot turn: ${this.bot.isBotTurn}`)
        this.player.isPlaylerTurn = -this.player.isPlaylerTurn;
        this.bot.isBotTurn = -this.bot.isBotTurn;    
        this.UpDateTurnForCell();
        //console.log(`after playe turn: ${this.player.isPlaylerTurn}, bot turn: ${this.bot.isBotTurn}\n`)
    }

    OnFinishTurn(rowIndex, colIndex){
        console.info('event swith turn');
        //this.isFinisTurn = true;
        this.CheckWin(rowIndex, colIndex);
        this.ResetSchdule();
        console.log('bot turn ', this.bot.isBotTurn, winGame);
        if(this.bot.isBotTurn === 1 && winGame == false){
            //this.node.emit('botTurn');
            console.log('emit bot');
            // setTimeout(() => {
                
            // }, 5000 );
            // this.bot.BotPlayInTurn();

            this.bot.scheduleOnce(this.bot.BotPlayInTurn,1);
        }
        this.timeElapsed = this.timeToChangeTurn;
        this.timeLabel.color  = new Color(0, 82, 20);
    }

    ResetSchdule(){
        this.unschedule(this.switchTurnCallBack);
        //console.log(`before playe turn: ${this.player.isPlaylerTurn}, bot turn: ${this.bot.isBotTurn}`)
        this.player.isPlaylerTurn = -this.player.isPlaylerTurn;
        this.bot.isBotTurn = -this.bot.isBotTurn;       
        this.UpDateTurnForCell();    
        //console.log(`after playe turn: ${this.player.isPlaylerTurn}, bot turn: ${this.bot.isBotTurn}\n`) 
        this.schedule(this.switchTurnCallBack, this.timeToChangeTurn);
        console.log('reseted');       
    }

    //dang ki su kien khi switch turn
    RegisterOnFinishTurn(){
        for(let i=0; i< this.Board.row; i++){
            for(let j=0; j<this.Board.colum; j++){
                let cellControll = this.Board.boardArray[i][j].getComponent(Cell);
                if(cellControll){
                    cellControll.node.on('finishTurn', this.OnFinishTurn, this);
                }
            }
        }
    }

    //cap nhat player turn cho cell
    UpDateTurnForCell(){
        for(let i=0; i< this.Board.row; i++){
            for(let j=0; j<this.Board.colum; j++){
                let cellControll = this.Board.boardArray[i][j].getComponent(Cell);
                if(cellControll){
                    cellControll.isPlayerTurn = (this.player.isPlaylerTurn === 1);
                }
            }
        }
    }
//#endregion

//#region Check Win
    CheckWin(row:number, col: number){
        const cell = this.Board.boardArray[row][col];
        const cellControll = cell.getComponent(Cell);

        if(cellControll.currentType === null){
            return 0; //no check null cell
        }

        const cellType = cellControll.currentType;
        //let cellScore = 0;

        const directors = [
            {rowOffset: 0, colOffset: 1}, //doc
            {rowOffset: 1, colOffset: 0}, //ngang
            {rowOffset: 1, colOffset: 1}, //cheo_phai_tren
            {rowOffset: -1, colOffset: 1}, //cheo_phai_duoi
        ]

        for(let director of directors){
            let count = 1 //count current cell

            //check with a direction
            count += this.CountInDirection(row, col, director.rowOffset, director.colOffset, cellType);

            //check with reverse direction
            count += this.CountInDirection(row, col, -director.rowOffset, -director.colOffset, cellType);

            if(count >= 5){
                console.log('_______overgame________');
                if(this.player.isPlaylerTurn === 1){
                    UIUnits.loadPopUp("Prefabs/UI_Win", (nodeLoading) => {
                        // setTimeout(()=>{
                        //     if(nodeLoading instanceof Node){
                        //         nodeLoading.active = false;
                        //     }
                        // }, 2000);
                    });
                }
                else{
                    UIUnits.loadPopUp("Prefabs/UI_Lose", (nodeLoading) => {
                        // setTimeout(()=>{
                        //     if(nodeLoading instanceof Node){
                        //         nodeLoading.active = false;
                        //     }
                        // }, 2000);
                    });
                }
                winGame = true;
                return;
            }
        }

    }

    CountInDirection(row: number, col: number, rowOffset: number, colOffset: number, cellType: string): number{
        let count = 0;
        let r = row + rowOffset;
        let c = col + colOffset;

        while(this.IsValidCell(r,c) && this.Board.boardArray[r][c].getComponent(Cell).currentType === cellType){
            count++;
            r += rowOffset;
            c += colOffset;
        }

        return count;
    }

    IsValidCell(row: number, col: number): boolean{
        return row >= 0 && row < this.Board.row && col >= 0 && col < this.Board.colum;
    }
//#endregion

    //show time
    ShowTime(){
        const time = Math.floor(this.timeElapsed);
        if(time != this.curentTime && time>=0){
            this.timeLabel.string = time.toString();
            tween(this.timeLabel.node)
                    .to(this.DURATION, {scale: new Vec3(1, 1, 1)}, {easing: 'backOut'})
                    .start();

            if(time<=5){
                this.timeLabel.node.scale = new Vec3(0, 0, 0);
                this.timeLabel.color  = new Color(255, 0, 0);
                tween(this.timeLabel.node)
                    .to(this.DURATION, {scale: new Vec3(1, 1, 1)}, {easing(k){
                        var s = 3;
                        return --k * k * ( ( s + 1 ) * k + s ) + 1;
                    }})
                    .start();
            } 
            this.curentTime = time;
        }

               
    }
}


