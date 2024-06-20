import { _decorator, Component, find, Node } from 'cc';
import { UIUnits } from './UIUnits';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    onLoad(){
        UIUnits.loadPopUp("Prefabs/MainMenu", (nodeLoading) => {

        });
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    
}


