import { _decorator, Component, log, Node } from 'cc';
import { Constant } from './Constant';
const { ccclass, property } = _decorator;

export namespace DataPlayer{
    
}

declare global{
    var GateUserInfor:{
        typeOfCell: string,
        isTurn: number,
    }
}

export namespace GateGlobal{
    export function resetUserInfor(){
        console.log("resetUserInfor");
        window.GateUserInfor = {
            typeOfCell: Constant.CELL_X,
            isTurn: -1,
        }
    }
}

GateGlobal.resetUserInfor();
