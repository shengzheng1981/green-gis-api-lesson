import { Layer } from "./layer";
import { Graphic } from "../element/graphic";
import { Projection } from "../projection/projection";
import { Bound } from "../util/bound";
export declare class GraphicLayer extends Layer {
    private _graphics;
    add(graphic: Graphic): void;
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, zoom?: number): void;
}
