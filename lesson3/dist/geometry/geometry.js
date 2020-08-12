import { SimplePointSymbol } from "../symbol/symbol";
import { WebMercator } from "../projection/web-mercator";
export class Geometry {
    get bound() {
        return this._bound;
    }
    project(projection) { }
    ;
    draw(ctx, projection = new WebMercator(), extent = projection.bound, symbol = new SimplePointSymbol()) { }
    ;
}
