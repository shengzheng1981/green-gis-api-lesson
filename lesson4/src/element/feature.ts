import {Bound} from "../util/bound";
import {Geometry} from "../geometry/geometry";
import {Symbol, SimplePointSymbol} from "../symbol/symbol";
import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";

export class Feature {
    private _geometry: Geometry;
    private _properties: any;
    private _symbol: Symbol;

    public visible: boolean = true;

    get symbol(): Symbol {
        return this._symbol;
    }
    set symbol(value: Symbol) {
        this._symbol = value;
    }
    get geometry(): Geometry {
        return this._geometry;
    }

    get properties(): any {
        return this._properties;
    }

    get bound(): Bound {
        return this._geometry ? this._geometry.bound: null;
    }


    constructor(geometry, properties, symbol?) {
        this._geometry = geometry;
        this._properties = properties;
        this._symbol = symbol;
    }

    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, symbol: Symbol = new SimplePointSymbol()) {
        if (this.visible) this._geometry.draw(ctx, projection, extent, (this._symbol || symbol));
    }

}