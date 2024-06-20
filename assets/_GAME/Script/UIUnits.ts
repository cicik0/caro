import { _decorator, Component, director, instantiate, Node, Prefab, resources } from 'cc';
const { ccclass, property } = _decorator;

export namespace UIUnits {
    export function loadPopUp(path, cbFinish){
        resources.load(path, (err, asset) => {
            var nodeLoading = instantiate(asset as Prefab);
            director.getScene().getChildByName("Canvas").addChild(nodeLoading);
            if (!err) cbFinish?.(nodeLoading);
        });
    }
}


