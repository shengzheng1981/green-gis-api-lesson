import {Bound} from "../util/bound";
import {Geometry} from "../geometry/geometry";
import {Symbol} from "../symbol/symbol";
import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";

export class Graphic {
    private _geometry: Geometry;
    private _symbol: Symbol;

    public visible: boolean = true;

    get bound(): Bound {
        return this._geometry ? this._geometry.bound: null;
    }

    constructor(geometry, symbol) {
        this._geometry = geometry;
        this._symbol = symbol;
    }

    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound) {
        if (this.visible) this._geometry.draw(ctx, projection, extent, this._symbol);
    }

}