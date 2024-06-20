import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Constant')
export class Constant extends Component {
    static readonly CELL_X: string = 'x';
    static readonly CELL_O: string = 'o';
    static readonly CELL_CELL_BG: string = 'cell_bg';
}


