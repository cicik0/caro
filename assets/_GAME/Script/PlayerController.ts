import { _decorator, Component, EventTouch, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    PlayerCellType: string;
    isPlaylerTurn: number;

    onLoad(){
        this.OnInit();
    }

    OnInit(){
        this.PlayerCellType = GateUserInfor.typeOfCell;
        this.isPlaylerTurn = GateUserInfor.isTurn;
    }

    onDisable(){
        
    }
    start() {

    }

    update(deltaTime: number) {
        
    }

}


