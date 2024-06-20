import { _decorator, Button, Component, Node } from 'cc';
import { UIUnits } from './UIUnits';
const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {

    @property({
        type: Button
    })
    BtnVsCom: Button|null = null;

    @property({
        type: Button
    })
    BtnVsHumman: Button|null = null;

    start() {
        this.BtnVsCom.node.on('click', this.OnClickBtnVsCom, this);
    }

    OnClickBtnVsCom(){
        UIUnits.loadPopUp("Prefabs/Match", (nodeLoading) => {
            this.node.destroy();
        });

    }

    update(deltaTime: number) {
        
    }
}


