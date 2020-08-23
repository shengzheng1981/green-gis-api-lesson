import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {Bound} from "../util/bound";
import {Subject} from "../util/subject";

export class Layer extends Subject{
    name: string;
    description: string;
    protected _visible: boolean = true;
    get visible() : boolean {
        return this._visible;
    }
    set visible(value: boolean) {
        this._visible = value;
    }
    //是否可交互
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

    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10) {};

    contain(screenX: number, screenY: number, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10, event: string = undefined): boolean { return false; }
}