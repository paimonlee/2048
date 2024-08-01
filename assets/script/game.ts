import { _decorator, Color, Component, director, instantiate, Label, log, Node, Prefab, Size, UIRenderer, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {
    private _gapSize: number = 20;
    private _blockSize: number;

    @property({ type: Prefab })
    private block: Prefab = null;

    private _scoreLabel: Label;
    private _score: number;

    private color: Color[];

    start() {
        this.draw();
        this.color[0] = new Color(198, 184, 172, 255);
        this.color[2] = new Color(235, 224, 213, 255);
        this.color[4] = new Color(234, 219, 193, 255);
        this.color[8] = new Color(240, 167, 110, 255);
        this.color[16] = new Color(244, 138, 89, 255);
        this.color[32] = new Color(245, 112, 85, 255);
        this.color[64] = new Color(245, 83, 52, 255);
        this.color[128] = new Color(234, 200, 103, 255);
        this.color[256] = new Color(234, 197, 87, 255);
        this.color[512] = new Color(234, 192, 71, 255);
        this.color[1024] = new Color(146, 208, 80, 255);
        this.color[2048] = new Color(0, 176, 240, 255);
    }

    update(deltaTime: number) {

    }

    draw() {
        let width: number = view.getVisibleSize().width;
        this._blockSize = (width - this._gapSize * 5) / 4;
        let x = this._gapSize + this._blockSize / 2;
        let y = this._blockSize;
        // 初始化block
        let block = instantiate(this.block);
        let blockUI = block.getComponent(UITransform)
        let blockSize = new Size(y, y);
        blockUI.setContentSize(blockSize)
        // 添加block
        this.node.addChild(block);
        block.setPosition(x, y);
    }
}


