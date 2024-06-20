import { _decorator, CCString, Component, EventTouch, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {

    @property({
        type: Node
    })
    cellNode: Node | null = null;

    @property({
        type: Node
    })
    cellSprites: Node[] = [];

    @property({
        type: CCString
    })
    currentType: string|null = null;

    rowIndex: number = 0;
    colIndex: number = 0;
    isClick:boolean = false;
    isTouch: boolean = false;
    isPlayerTurn: boolean = null;

    onLoad(){
        this.HideAllSprites();
        this.ShowOneSprite(2);
    }   

    start() {
        this.node?.on(Node.EventType.TOUCH_START, this.OnStartTouchCell, this);
        this.node?.on(Node.EventType.TOUCH_MOVE, this.OnTouchMove, this);
        this.node?.on(Node.EventType.TOUCH_END, this.OnTouchCell, this);

    }

    onDisable(){
        this.node.off(Node.EventType.TOUCH_START, this.OnStartTouchCell, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.OnTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.OnTouchCell, this);
    }

    update(deltaTime: number) {
        
    }

    HideAllSprites(){
        for(let sprite of this.cellSprites){
            sprite.active = false;
        }
    }

    ShowOneSprite(i:number){
        this.cellSprites[i].active = true;
    }

    OnStartTouchCell(){
        if(!this.isClick && this.isPlayerTurn){
            this.isTouch = true;
        }
    }

    OnTouchMove(){
        if(!this.isClick && this.isPlayerTurn){
            this.isTouch = false;
        }
    }

    OnTouchCell(event: EventTouch){
        console.log('player touch on a cell', this.rowIndex, this.colIndex);
        if(this.isTouch && this.isPlayerTurn){
            if(!this.isClick){
                this.HideAllSprites();
                for(let i = 0; i<this.cellSprites.length; i++){
                    if(this.cellSprites[i].name == GateUserInfor.typeOfCell){
                        //console.log(this.cellSprites[i].name ,i);
                        this.ShowOneSprite(i);
                        this.isClick = true;
                        this.currentType = GateUserInfor.typeOfCell;
                        this.node.emit('finishTurn', this.rowIndex, this.colIndex);
                        return;
                    }
                }
            }
        }       
    }

    
}


