import { _decorator, CCInteger, Component, instantiate, Node, Prefab, Vec2, Vec3, Touch, EventTouch, UITransform, log, math, } from 'cc';
import { CellController } from './CellController';
import { Cell } from './Cell';
import { UIUnits } from './UIUnits';
import { PlayerController } from './PlayerController';
import { Constant } from './Constant';
const { ccclass, property } = _decorator;

@ccclass('BoardController')
export class BoardController extends Component {
    @property({
        type: CCInteger
    })
    row:number = 15;

    @property({
        type: CCInteger
    })
    colum: number = 15;

    @property({
        type: Prefab
    })     
    boxPrefab: Prefab | null = null;

    @property({
        type: PlayerController
    })
    player: PlayerController = null;

    boxSize: number = 48;

    boardArray: number[] = [];

    isWin:boolean =  false;

    onLoad(){
        this.boardArray = this.Create2DArray(this.row, this.colum);
        this.CreateChessBroad();
        //this.node.on('canCheck', this.CheckWin, this);       
        
    }

    onDisable(){
        
    }

    start() {
        
    }

    update(deltaTime: number) {
        //console.log('test log');
    }

//#region init map
    //init 2d array
    Create2DArray(row: number, col: number){
        let array = [];
        for(let i = 0; i<row; i++){
            array[i] = [];
            for(let j = 0; j<col; j++){
                array[i][j] = null;
            }
        }
        return array;
    }

    //init cell of chessboard
    CreateChessBroad(){
        const startX = -(this.colum/2) * this.boxSize + this.boxSize/2;
        const startY = -(this.row/2) * this.boxSize + this.boxSize/2;
        for(let i = 0; i<this.row; i++){
            for(let j = 0; j<this.colum; j++){
                let cell = instantiate(this.boxPrefab);
                this.node.addChild(cell);
                cell.setPosition(new Vec3(j*this.boxSize + startX, i*this.boxSize + startY, 0));
                this.boardArray[i][j] = cell;
                
                let cellcontroll = cell.getComponent(Cell);
                if(cellcontroll){
                    cellcontroll.rowIndex = i;
                    cellcontroll.colIndex = j;
                }
            }
        }
    }
//#endregion

}


