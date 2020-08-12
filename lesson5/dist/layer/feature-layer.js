import { Layer } from "./layer";
import { WebMercator } from "../projection/web-mercator";
import { SimpleRenderer } from "../renderer/simple-renderer";
import { CategoryRenderer } from "../renderer/category-renderer";
import { ClassRenderer } from "../renderer/class-renderer";
export class FeatureLayer extends Layer {
    constructor() {
        super(...arguments);
        this._zoom = [3, 20];
    }
    get featureClass() {
        return this._featureClass;
    }
    set featureClass(value) {
        this._featureClass = value;
    }
    set renderer(value) {
        this._renderer = value;
    }
    draw(ctx, projection = new WebMercator(), extent = projection.bound, zoom = 10) {
        if (this.visible && this._zoom[0] <= zoom && this._zoom[1] >= zoom) {
            this._featureClass.features.forEach((feature) => {
                feature.draw(ctx, projection, extent, this._getSymbol(feature));
            });
        }
    }
    _getSymbol(feature) {
        if (this._renderer instanceof SimpleRenderer) {
            return this._renderer.symbol;
        }
        else if (this._renderer instanceof CategoryRenderer) {
            const renderer = this._renderer;
            const item = renderer.items.find(item => item.value == feature.properties[renderer.field.name]);
            return item.symbol;
        }
        else if (this._renderer instanceof ClassRenderer) {
            const renderer = this._renderer;
            const item = renderer.items.find(item => item.low <= feature.properties[renderer.field.name] && item.high >= feature.properties[renderer.field.name]);
            return item.symbol;
        }
    }
}
