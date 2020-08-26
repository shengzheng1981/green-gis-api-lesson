import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {Bound} from "../util/bound";
import {Subject} from "../util/subject";
//图层基类
export class Layer extends Subject{
    //图层名称
    name: string;
    //图层描述
    description: string;
    //图层可见设置
    protected _visible: boolean = true;
    get visible() : boolean {
        return this._visible;
    }
    set visible(value: boolean) {
        this._visible = value;
    }
    //图层是否可交互
    protected _interactive: boolean = true;
    get interactive(): boolean {
        return this._interactive;
    }

    set interactive(value: boolean) {
        this._interactive = value;
    }

    constructor() {
        super([]);
    }
    //绘制图层
    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10) {};
    //图层交互：当前鼠标是否落入该图层某要素
    contain(screenX: number, screenY: number, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10, event: string = undefined): boolean { return false; }
}