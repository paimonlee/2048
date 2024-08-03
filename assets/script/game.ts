import { _decorator, Component, tween, EventTouch, Input, instantiate, Label, log, Node, Prefab, Size, UITransform, Vec2, view, Vec3, color } from 'cc';
import { Block } from './block';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    private level: number = 4;

    private tweenDuration: number = 0.1;

    private gapSize: number = 20;

    @property({ type: Prefab })
    private blockPrefab: Prefab = null;

    @property({ type: Label })
    private scoreLabel: Label;

    private score: number;

    private blockSize: number = (view.getVisibleSize().width - this.gapSize * 5) / 4;

    private bottom: number = -view.getVisibleSize().height / 2;

    private left: number = -view.getVisibleSize().width / 2;

    private blockList: Array<Array<Node>>;

    start() {
        let zeros = this.init();
        this.randomFillZeroBlock(zeros);
        this.activeTouchHandler(true);
    }

    private init() {
        let zeros = new Array<Node>();
        this.blockList = new Array<Array<Node>>(this.level);
        for (let row = 0; row < this.level; row++) {
            if (this.blockList[row] == undefined) {
                this.blockList[row] = new Array<Node>(4);
            }
            for (let col = 0; col < this.level; col++) {
                let block = this.buildBlock()
                let x = this.gapSize * (col + 1) + this.blockSize * col + this.left + this.blockSize / 2;
                let y = this.gapSize * (row + 1) + this.blockSize * row + this.bottom + this.blockSize / 2;
                block.setPosition(x, y);
                this.node.addChild(block);
                zeros.push(block);
                this.blockList[row][col] = block
            }
        }
        return zeros;
    }

    private doMove(block: Node, position: Vec3, callback: Function) {
        log("block: %s move to %s", block.getPosition(), position)
        tween(block.getPosition()).to(this.tweenDuration, position, {
            onUpdate: (target: Vec3) => {
                block.setPosition(target);
            }
        }).call(callback).start();
    }

    private moveBottom() {
        this.activeTouchHandler(false)
        let moved: boolean = false

        for (let col = 0; col < this.level; col++) {
            for (let row = 0; row < this.level; row++) {
                if (this.blockList[row][col].getComponent(Block).getNumber() != 0) {
                    let blow = row - 1;
                    let curr = row;
                    while (blow >= 0) {
                        if (this.blockList[blow][col].getComponent(Block).getNumber() == this.blockList[curr][col].getComponent(Block).getNumber()
                            || this.blockList[blow][col].getComponent(Block).getNumber() == 0) {

                            let oldNode = this.blockList[curr][col]
                            let newNode = this.blockList[blow][col]
                            // 当前节点直接下移
                            let oldPosition = oldNode.getPosition();
                            let newPosition = newNode.getPosition();

                            this.node.removeChild(newNode);

                            this.doMove(oldNode, newPosition, () => {
                                oldNode.getComponent(Block).setNumber(newNode.getComponent(Block).getNumber()
                                    + oldNode.getComponent(Block).getNumber())
                            });
                            this.blockList[blow][col] = oldNode;


                            // 新建组件填充当前组件位置
                            this.blockList[curr][col] = this.buildBlock()
                            this.blockList[curr][col].setPosition(oldPosition)
                            this.node.addChild(this.blockList[curr][col]);

                            curr = blow;
                            moved = true;
                            blow--;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        if (moved) {
            log("moved:" + moved)
            let zeros = this.collectZeroBlock()
            if (zeros.length != 0) {
                this.randomFillZeroBlock(zeros)
            }
        }
        this.activeTouchHandler(true)
    }

    private activeTouchHandler(active: boolean) {
        let startPoint: Vec2;
        let endPoint: Vec2;
        if (active) {
            this.node.on(Input.EventType.TOUCH_START, (event: EventTouch) => {
                startPoint = event.getLocation()
            }, this)
            this.node.on(Input.EventType.TOUCH_END, (event: EventTouch) => {
                endPoint = event.getLocation()
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
                            this.moveBottom()
                        } else if (startPoint.y < endPoint.y) {
                            log("向上")
                        }
                    }
                }
            }, this)
        } else {
            this.node.off(Input.EventType.TOUCH_START);
            this.node.off(Input.EventType.TOUCH_END);
        }
    }

    private collectZeroBlock(): Array<Node> {
        let zeros = new Array<Node>();
        for (let i = 0; i < this.level; i++) {
            for (let j = 0; j < this.level; j++) {
                let currBlock = this.blockList[i][j]
                if (currBlock.getComponent(Block).getNumber() == 0) {
                    zeros.push(currBlock)
                }
            }
        }
        return zeros
    }

    private randomFillZeroBlock(zeros: Array<Node>) {
        let initNumbers = [2, 4]
        let initBlock: number = Math.round(Math.random() * (this.level - 2)) + 1;
        log("will create %d new block", initBlock);
        for (let i = 0; i < initBlock; i++) {
            let zeroNodeIndex = Math.round(Math.random() * (zeros.length - 1))
            let newNode = zeros[zeroNodeIndex];
            let number = initNumbers[Math.round(Math.random() * (initNumbers.length - 1))];
            log("create new block: %d", number);
            log("create new block position:%s", newNode.getPosition());
            newNode.getComponent(Block).setNumber(number)
            zeros.splice(zeroNodeIndex, 1);
        }
    }

    private buildBlock(): Node {
        let block = instantiate(this.blockPrefab);
        let blockUI = block.getComponent(UITransform);
        let size = new Size(this.blockSize, this.blockSize);
        blockUI.setContentSize(size);
        block.getComponent(Block).setNumber(0);
        return block;
    }
}