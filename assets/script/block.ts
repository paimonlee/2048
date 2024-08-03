import { _decorator, Color, Component, Label, log, Sprite } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('Block')
export class Block extends Component {
    @property({ type: Label })
    private numLabel: Label;

    start() {

    }

    update(deltaTime: number) {

    }

    setNumber(num: number) {
        if (num == undefined) num = 0;
        this.numLabel.node.active = (num == 0) ? false : true;
        this.numLabel.string = num.toString();
        this.node.getComponent(Sprite).color = colors.searchColor(num);
    }

    getNumber(): number {
        return Number.parseInt(this.numLabel.string);
    }
}

class ColorHolder {
    private color = new Map<number, Color>();
    private maxKey: number = 2048;
    private defaultColor: Color = new Color(198, 184, 172, 255);

    constructor() {
        this.color.set(0, new Color(198, 184, 172, 255));
        this.color.set(2, new Color(235, 224, 213, 255));
        this.color.set(4, new Color(234, 219, 193, 255));
        this.color.set(8, new Color(240, 167, 110, 255));
        this.color.set(16, new Color(244, 138, 89, 255));
        this.color.set(32, new Color(245, 112, 85, 255));
        this.color.set(64, new Color(245, 83, 52, 255));
        this.color.set(128, new Color(234, 200, 103, 255));
        this.color.set(256, new Color(234, 197, 87, 255));
        this.color.set(512, new Color(234, 192, 71, 255));
        this.color.set(1024, new Color(146, 208, 80, 255));
        this.color.set(2048, new Color(0, 176, 240, 255));
    }

    searchColor(num: number) {
        while (num > this.maxKey) {
            num - this.maxKey;
        }
        if (this.color.has(num)) {
            return this.color.get(num);
        }
        return this.defaultColor;
    }
}

var colors: ColorHolder = new ColorHolder();