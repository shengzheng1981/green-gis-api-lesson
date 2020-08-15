import { SimplePointSymbol, SimpleTextSymbol } from "../symbol/symbol";
import { WebMercator } from "../projection/web-mercator";
export class Feature {
    constructor(geometry, properties, symbol) {
        this.visible = true;
        this._geometry = geometry;
        this._properties = properties;
        this._symbol = symbol;
    }
    get symbol() {
        return this._symbol;
    }
    set symbol(value) {
        this._symbol = value;
    }
    get geometry() {
        return this._geometry;
    }
    get properties() {
        return this._properties;
    }
    get bound() {
        return this._geometry ? this._geometry.bound : null;
    }
    get text() {
        return this._text;
    }
    set text(value) {
        this._text = value;
    }
    draw(ctx, projection = new WebMercator(), extent = projection.bound, symbol = new SimplePointSymbol()) {
        if (this.visible)
            this._geometry.draw(ctx, projection, extent, (this._symbol || symbol));
    }
    intersect(projection = new WebMercator(), extent = projection.bound) {
        if (this.visible)
            return this._geometry.intersect(projection, extent);
    }
    label(field, ctx, projection = new WebMercator(), symbol = new SimpleTextSymbol()) {
        if (this.visible)
            this._geometry.label(this._properties[field.name], ctx, projection, this._text || symbol);
    }
}
