import { _decorator, Component, director, instantiate, Label, Node, Prefab, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {
    private _gapSize: number = 20;
    private _blockSize: number;
    
    @property({ type: Prefab })
    private block: Prefab = null;
    private _scoreLabel: Label;
    private _score: number;
    private _bg: Node;

    start() {
        this.draw();
    }

    update(deltaTime: number) {

    }

    draw() {
        let width: number = view.getVisibleSize().width;
        this._blockSize = (width - this._gapSize * 5) / 4;
        let x = this._gapSize + this._blockSize / 2;
        let y = this._blockSize;
        let block = instantiate(this.block);
        this._bg.addChild(block);
        block.setPosition(x, y);
    }
}


