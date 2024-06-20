import { _decorator, Button, Component, log, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CellController')
export class CellController extends Component {

    @property({
        type: Button
    })
    cellButoon: Button | null = null;

    @property({
        type: Node
    })
    cellSprites: Node[] = [];

    rowIndex: number = 0;
    colIndex: number = 0;
    isClick:boolean = false;

    onLoad(){
        this.HideALlSprite();
        this.cellSprites[0].active = true;
    }

    start() {
        this.cellButoon?.node.on('click', this.OnClickCellButton, this);
    }

    update(deltaTime: number) {
        
    }

    HideALlSprite(){
        for(let child of this.cellSprites){
            child.active = false;
        }
    }

    OnClickCellButton(){
        this.HideALlSprite();
        for(let i = 0; i<this.cellSprites.length; i++){
            if(this.cellSprites[i].name == GateUserInfor.typeOfCell){
                this.cellSprites[i].active = true;
                this.cellButoon.interactable = false;
                this.isClick = true;
                //log('Emitting canCheck event');
                this.node.emit('canCheck', this.rowIndex, this.colIndex);
                log("position " + this.rowIndex, this.colIndex);
                return;
            }
        }
    }
}


