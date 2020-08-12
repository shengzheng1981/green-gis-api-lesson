import {Bound} from "../util/bound";
import {Projection} from "../projection/projection";
import {
    SimplePointSymbol,
    Symbol
} from "../symbol/symbol";
import {WebMercator} from "../projection/web-mercator";

export enum CoordinateType {
    Latlng = 1,
    Projection = 2,
    Screen = 3
}

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

    intersect(projection: Projection = new WebMercator(), extent: Bound = projection.bound): boolean {
        if (!this._projected) this.project(projection);
        return extent.intersect(this._bound);
    }

    getCenter(type: CoordinateType = CoordinateType.Latlng, projection: Projection = new WebMercator()) {};

    getBound(projection: Projection = new WebMercator()) {
        if (!this._projected) this.project(projection);
        return this._bound;
    };

    distance(geometry: Geometry, type: CoordinateType, ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator()) {
        const center = this.getCenter(type == CoordinateType.Screen ? CoordinateType.Projection : type, projection);
        const point = geometry.getCenter(type == CoordinateType.Screen ? CoordinateType.Projection : type, projection);
        if (type == CoordinateType.Screen) {
            const matrix = (ctx as any).getTransform();
            const screenX1 = (matrix.a * center[0] + matrix.e), screenY1 = (matrix.d * center[1] + matrix.f);
            const screenX2 = (matrix.a * point[0] + matrix.e), screenY2 = (matrix.d * point[1] + matrix.f);
            return Math.sqrt((screenX2-screenX1) * (screenX2-screenX1) + (screenY2-screenY1) * (screenY2-screenY1));
        } else if (type == CoordinateType.Projection) {
            return Math.sqrt((point[0]-center[0]) * (point[0]-center[0]) + (point[1]-center[1]) * (point[1]-center[1]));
        }
    }

}