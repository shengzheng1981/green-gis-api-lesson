import { WebMercator } from "../projection/web-mercator";
export class Layer {
    constructor() {
        this._visible = true;
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
    }
    draw(ctx, projection = new WebMercator(), extent = projection.bound, zoom = 10) { }
    ;
}
