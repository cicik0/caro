import { _decorator, Component, find, Node } from 'cc';
import { UIUnits } from './UIUnits';
const { ccclass, property } = _decorator;

@ccclass('UI_gameOVer')
export class UI_gameOVer extends Component {

    OnRestartMath(){
        let canvas = find('Canvas');
        if(canvas){
            let PrefabMatch = canvas.getChildByName('Match');
            if(PrefabMatch){
                console.log('yes, reset for you');
                UIUnits.loadPopUp("Prefabs/Match", (nodeLoading) => {
                    PrefabMatch.destroy();
                    winGame = false;
                });
                this.node.destroy();
            }
            else{
                console.log('fuck, have bug');
            }
        }
        else{
            console.log('fucking bug');
        }
        
    }

    OnEditMainMenu(){
        let canvas = find('Canvas');
        if(canvas){
            let PrefabMatch = canvas.getChildByName('Match');
            if(PrefabMatch){
                console.log('yes, exit for you');
                UIUnits.loadPopUp("Prefabs/MainMenu", (nodeLoading) => {
                    PrefabMatch.destroy();
                    winGame = false;
                    this.node.destroy();
                });
            }
            else{
                console.log('fuck, have bug');
            }
        }else{
            console.log('fucking bug');
        }
        
    }
}


