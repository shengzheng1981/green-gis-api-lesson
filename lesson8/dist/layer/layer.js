import { WebMercator } from "../projection/web-mercator";
import { Subject } from "../util/subject";
export class Layer extends Subject {
    constructor() {
        super([]);
        this._visible = true;
        //是否可交互
        this._interactive = true;
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
    }
    get interactive() {
        return this._interactive;
    }
    set interactive(value) {
        this._interactive = value;
    }
    draw(ctx, projection = new WebMercator(), extent = projection.bound, zoom = 10) { }
    ;
    contain(screenX, screenY, projection = new WebMercator(), extent = projection.bound, zoom = 10, event = undefined) { return false; }
}
