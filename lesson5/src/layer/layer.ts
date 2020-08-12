import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {Bound} from "../util/bound";

export class Layer{
    name: string;
    description: string;
    protected _visible: boolean = true;
    get visible() : boolean {
        return this._visible;
    }
    set visible(value: boolean) {
        this._visible = value;
    }

    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10) {};
}