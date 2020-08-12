import { SimplePointSymbol } from "../symbol/symbol";
import { WebMercator } from "../projection/web-mercator";
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
}
