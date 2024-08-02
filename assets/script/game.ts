import { _decorator, Color, Component, director, EventTouch, Input, instantiate, Label, log, Node, Prefab, Size, UIRenderer, UITransform, Vec2, view } from 'cc';
import { Block } from './block';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    private level: number = 4;

    private _gapSize: number = 20;
    private _blockSize: number;

    @property({ type: Prefab })
    private block: Prefab = null;

    @property({ type: Label })
    private scoreLabel: Label;

    private _score: number;

    private blocks: Array<Array<Node>>;

    start() {
        this.draw();
        this.init();
        this.addTouchHandler();
    }

    update(deltaTime: number) {

    }

    draw() {
        let width: number = view.getVisibleSize().width;
        let height: number = view.getVisibleSize().height;
        let bottom = -height / 2
        let left = -width / 2
        this._blockSize = (width - this._gapSize * 5) / 4;

        this.blocks = new Array<Array<Node>>(this.level);
        for (let row = 0; row < this.level; row++) {
            if (this.blocks[row] == undefined) {
                this.blocks[row] = new Array<Node>(4);
            }
            for (let col = 0; col < this.level; col++) {
                this.blocks[row][col] = instantiate(this.block);
                let blockUI = this.blocks[row][col].getComponent(UITransform)
                let blockSize = new Size(this._blockSize, this._blockSize);
                blockUI.setContentSize(blockSize)

                let x = this._gapSize * (col + 1) + this._blockSize * col + left + this._blockSize / 2;
                let y = this._gapSize * (row + 1) + this._blockSize * row + bottom + this._blockSize / 2;

                this.blocks[row][col].setPosition(x, y);
                this.node.addChild(this.blocks[row][col]);
                let block = this.blocks[row][col].getComponent(Block);
                block.setNumber(0);
            }
        }
    }

    /**
     * 旋转二维数组
     * @param blocks 二维数组
     */
    rotateBlocks(blocks: Array<Array<Node>>, direction) {

    }

    move() {

    }

    addTouchHandler() {
        let startPoint: Vec2;
        this.node.on(Input.EventType.TOUCH_START, (event: EventTouch) => {
            startPoint = event.getLocation()
        }, this)
        this.node.on(Input.EventType.TOUCH_END, (event: EventTouch) => {
            let endPoint = event.getLocation()
            let moveDistance = Vec2.distance(endPoint, startPoint);

            // TODO: 优化防抖
            if (moveDistance > 50) {
                if (Math.abs(startPoint.y - endPoint.y) < 50) {
                    if (startPoint.x > endPoint.x) {
                        log("向左")
                    } else if (startPoint.x < endPoint.x) {
                        log("向右")
                    }
                } else if (Math.abs(startPoint.x - endPoint.x) < 50) {
                    if (startPoint.y > endPoint.y) {
                        log("向下")
                    } else if (startPoint.y < endPoint.y) {
                        log("向上")
                    }
                }
            }
        }, this)
    }

    init() {
        let initNumbers = [2, 4]
        let initBlock: number = Math.round(Math.random() * (this.level - 1));
        if (initBlock == 0) initBlock++;
        for (let i = 0; i < initBlock; i++) {
            let x = Math.round(Math.random() * (this.level - 1));
            let y = Math.round(Math.random() * (this.level - 1));
            while (this.blocks[x][y].getComponent(Block).getNumber() != 0) {
                x = Math.round(Math.random() * this.level);
                y = Math.round(Math.random() * this.level);
            }

            let number = initNumbers[Math.round(Math.random() * (initNumbers.length - 1))];
            this.blocks[x][y].getComponent(Block).setNumber(number)
        }
    }
}

enum Direction {
    LEFT, RIGHT
}
