import { SimplePointSymbol } from "../symbol/symbol";
import { WebMercator } from "../projection/web-mercator";
export var CoordinateType;
(function (CoordinateType) {
    CoordinateType[CoordinateType["Latlng"] = 1] = "Latlng";
    CoordinateType[CoordinateType["Projection"] = 2] = "Projection";
    CoordinateType[CoordinateType["Screen"] = 3] = "Screen";
})(CoordinateType || (CoordinateType = {}));
export var GeometryType;
(function (GeometryType) {
    GeometryType[GeometryType["Point"] = 1] = "Point";
    GeometryType[GeometryType["Polyline"] = 2] = "Polyline";
    GeometryType[GeometryType["Polygon"] = 3] = "Polygon";
})(GeometryType || (GeometryType = {}));
export class Geometry {
    get bound() {
        return this._bound;
    }
    project(projection) { }
    ;
    draw(ctx, projection = new WebMercator(), extent = projection.bound, symbol = new SimplePointSymbol()) { }
    ;
    intersect(projection = new WebMercator(), extent = projection.bound) {
        if (!this._projected)
            this.project(projection);
        return extent.intersect(this._bound);
    }
    getCenter(type = CoordinateType.Latlng, projection = new WebMercator()) { }
    ;
    getBound(projection = new WebMercator()) {
        if (!this._projected)
            this.project(projection);
        return this._bound;
    }
    ;
    distance(geometry, type, ctx, projection = new WebMercator()) {
        const center = this.getCenter(type == CoordinateType.Screen ? CoordinateType.Projection : type, projection);
        const point = geometry.getCenter(type == CoordinateType.Screen ? CoordinateType.Projection : type, projection);
        if (type == CoordinateType.Screen) {
            const matrix = ctx.getTransform();
            const screenX1 = (matrix.a * center[0] + matrix.e), screenY1 = (matrix.d * center[1] + matrix.f);
            const screenX2 = (matrix.a * point[0] + matrix.e), screenY2 = (matrix.d * point[1] + matrix.f);
            return Math.sqrt((screenX2 - screenX1) * (screenX2 - screenX1) + (screenY2 - screenY1) * (screenY2 - screenY1));
        }
        else {
            return Math.sqrt((point[0] - center[0]) * (point[0] - center[0]) + (point[1] - center[1]) * (point[1] - center[1]));
        }
    }
}
