import { Layer } from "./layer";
import { Bound } from "../util/bound";
import { Projection } from "../projection/projection";
import { FeatureClass } from "../data/feature-class";
import { Renderer } from "../renderer/renderer";
export declare class FeatureLayer extends Layer {
    private _featureClass;
    private _renderer;
    private _zoom;
    get featureClass(): FeatureClass;
    set featureClass(value: FeatureClass);
    set renderer(value: Renderer);
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, zoom?: number): void;
    _getSymbol(feature: any): import("../index").Symbol;
}
