import { WebMercator } from "../projection/web-mercator";
export class Graphic {
    constructor(geometry, symbol) {
        this.visible = true;
        this._geometry = geometry;
        this._symbol = symbol;
    }
    get bound() {
        return this._geometry ? this._geometry.bound : null;
    }
    draw(ctx, projection = new WebMercator(), extent = projection.bound) {
        if (this.visible)
            this._geometry.draw(ctx, projection, extent, this._symbol);
    }
}
