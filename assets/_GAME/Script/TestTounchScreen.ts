import { _decorator, Component, EventMouse, EventTouch, Input, input, log, Node, UITransform, Vec2, Vec3 } from 'cc';
import { BoardController } from './BoardController';
const { ccclass, property } = _decorator;

@ccclass('TestTounchScreen')
export class TestTounchScreen extends Component {

    private initDistance: number = 0;
    private initScale: Vec3 = new Vec3();
    private isPinching : boolean =  false;

    

    onLoad(){
        
    }

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.HandleTouch_Start, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.HandleTouch_Move, this);
        this.node.on(Node.EventType.TOUCH_END, this.HandleTouch_End, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.HandleTouch_End, this);

        this.node.on(Node.EventType.MOUSE_WHEEL,this.HandleMouse_Wheel, this);
    }

    update(deltaTime: number) {
        
    }

    onDestroy(){
        this.node.off(Node.EventType.TOUCH_START, this.HandleTouch_Start, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.HandleTouch_Move, this);
        this.node.off(Node.EventType.TOUCH_END, this.HandleTouch_End, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.HandleTouch_End, this);

        this.node.off(Node.EventType.MOUSE_WHEEL,this.HandleMouse_Wheel, this);
    }

    HandleTouch_Start(event:EventTouch){
        //console.log(event.getTouches().length);
        //console.log('start touch___________');
        if(event.getAllTouches().length === 2){
            console.log('start touch___________');
            const touches = event.getAllTouches();
            this.initDistance = this.getDistance(touches[0].getLocation(), touches[1].getLocation());
            this.initScale.set(this.node.scale);
            this.isPinching = true;
        }

        //let touches =  event.getAllTouches();
        //console.log(touches.length);
        // for(let touch of touches){           
        //     console.log(`touch start: ${touch.getLocation()}`, touches.length);
        // }        
    }

    HandleTouch_Move(event: EventTouch){
        if(this.isPinching && event.getAllTouches().length === 2){
            console.log('move touch___________');
            //console.log(this.initScale);
            const touches = event.getAllTouches();
            const currentDistance = this.getDistance(touches[0].getLocation(), touches[1].getLocation());
            let scaleFactor = currentDistance/this.initDistance;
            let newScale = this.initScale.clone().multiplyScalar(scaleFactor);

            newScale.x = Math.min(newScale.x, 2.5);
            newScale.y = Math.min(newScale.y, 2.5);

            this.node.setScale(newScale);

        }else if(!this.isPinching && event.getAllTouches().length === 1){
            const touch = event.getTouches()[0];
            const delta = touch.getDelta();
            const currentPosition = this.node.getPosition();
            const newPosition = currentPosition.add(new Vec3(delta.x, delta.y, 0));

            const minX = -360;
            const maxX = 360;
            const minY = -360;
            const maxY = 360;

            let clampedX = Math.min(Math.max(newPosition.x, minX), maxX);
            let clampedY = Math.min(Math.max(newPosition.y, minY), maxY);
            if(this.node.scale.x >1 && this.node.scale.y > 1){
                this.node.setPosition(clampedX, clampedY);
            }
            else{
                this.node.setPosition(0, 0, 0);
            }
        }
    }

    HandleTouch_End(event: EventTouch){
        if(event.getAllTouches().length < 2){
            this.isPinching = false;
            
            if(this.node.scale.x < 1 && this.node.scale.y < 1){
                this.node.setScale(new Vec3(1, 1, 1));
            }
        }  
    }

    HandleMouse_Wheel(event: EventMouse){
        // const scaleFactor = 1 + event.getScrollY() * 0.001;
        // const newScale = this.node.scale.clone().multiplyScalar(scaleFactor);
        // this.node.setScale(newScale);
 
    }

    getDistance(p1: Vec2, p2: Vec2): number{
        return Math.sqrt(Math.pow(p2.x-p1.x, 2) + Math.pow(p2.y-p1.y, 2));
    }
}


