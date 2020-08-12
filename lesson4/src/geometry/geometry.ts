import {Bound} from "../util/bound";
import {Projection} from "../projection/projection";
import {
    SimplePointSymbol,
    Symbol
} from "../symbol/symbol";
import {WebMercator} from "../projection/web-mercator";

export enum GeometryType {
    Point = 1,
    Polyline = 2,
    Polygon = 3
}

export class Geometry {
    protected _projected: boolean;
    protected _projection: Projection;
    protected _bound: Bound;

    get bound(): Bound {
        return this._bound;
    }

    project(projection: Projection) {};

    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, symbol: Symbol = new SimplePointSymbol()) {};
}