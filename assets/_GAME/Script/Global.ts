import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

declare global{
    var winGame;
}

export namespace Global {
    export function resetWinGame(){
        console.log('resetWinGame');
        window.winGame = false;
    }
}

Global.resetWinGame();


