import { Projection } from "../projection/projection";
import { Bound } from "../util/bound";
export declare class Layer {
    name: string;
    description: string;
    protected _visible: boolean;
    get visible(): boolean;
    set visible(value: boolean);
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, zoom?: number): void;
}
