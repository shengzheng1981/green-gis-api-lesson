import {Layer} from "./layer";
import {Bound} from "../util/bound";
import {Feature} from "../element/feature";
import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {FeatureClass} from "../data/feature-class";
import {Renderer} from "../renderer/renderer";
import {SimpleRenderer} from "../renderer/simple-renderer";
import {CategoryRenderer} from "../renderer/category-renderer";
import {ClassRenderer} from "../renderer/class-renderer";

export class FeatureLayer extends Layer{
    private _featureClass: FeatureClass;
    private _renderer: Renderer;
    private _zoom: number[] = [3, 20];

    get featureClass(): FeatureClass {
        return this._featureClass;
    }
    set featureClass(value: FeatureClass) {
        this._featureClass = value;
    }

    set renderer(value: Renderer) {
        this._renderer = value;
    }

    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10) {
        if (this.visible && this._zoom[0] <= zoom && this._zoom[1] >= zoom) {
            this._featureClass.features.forEach( (feature: Feature) => {
                feature.draw(ctx, projection, extent, this._getSymbol(feature));
            });
        }
    }

    _getSymbol(feature) {
        if (this._renderer instanceof SimpleRenderer) {
            return (this._renderer as SimpleRenderer).symbol;
        } else if (this._renderer instanceof CategoryRenderer) {
            const renderer: CategoryRenderer = this._renderer;
            const item = renderer.items.find( item => item.value == feature.properties[renderer.field.name]);
            return item.symbol;
        } else if (this._renderer instanceof ClassRenderer) {
            const renderer: ClassRenderer = this._renderer;
            const item = renderer.items.find( item => item.low <= feature.properties[renderer.field.name] && item.high >= feature.properties[renderer.field.name]);
            return item.symbol;
        }
    }

}