import { _decorator, Component, Node, size, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('reponsive_1')
export class reponsive_1 extends Component {

    @property({
        type: Node
    })
    public BotNode: Node = null;

    @property({
        type: Node
    })
    public TopNode: Node = null;

    onLoad() {
        this.updatecanvas();
        // bắt sự kiện thay đổi kích thước màn hình
        view.on("canvas-resize", this.updatecanvas, this);
    }

    updatecanvas() {
        const canvas = view.getDesignResolutionSize();
        let deviceResolution = view.getResolutionPolicy();
        let designRatio = canvas.width / canvas.height;
        let deviceRatio =
            deviceResolution.canvasSize.width /
            deviceResolution.canvasSize.height;

        let newWidth, newHeight;
        if (deviceRatio < designRatio) {
            newWidth = canvas.width;
            newHeight = canvas.width / deviceRatio;
        } else {
            newWidth = canvas.height * deviceRatio;
            newHeight = canvas.height;
        }

        this.node.getComponent(UITransform).contentSize = size(newWidth, newHeight);

        this.UpdateChildNodes(newWidth, newHeight);
    }

    //update kich thuoc con
    UpdateChildNodes(parentWidth: number, parentHeight: number) {
        const BotNodeTranform = this.BotNode.getComponent(UITransform);
        const TopNodeTranfrom = this.TopNode.getComponent(UITransform);

        const halfHeight = parentHeight / 2;
        const margin_bot = 360  ;
        const margin_top = 360  ;

        BotNodeTranform.contentSize = size(parentWidth, halfHeight - margin_bot);
        TopNodeTranfrom.contentSize = size(parentWidth, halfHeight - margin_top);

        //reset vi tri node con de full man hinh
        this.BotNode.setPosition(0, -(halfHeight-margin_bot)/2);
        this.TopNode.setPosition(0, (halfHeight-margin_bot)/2);
    }
}


