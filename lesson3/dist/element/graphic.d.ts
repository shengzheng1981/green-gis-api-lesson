import { Bound } from "../util/bound";
import { Projection } from "../projection/projection";
export declare class Graphic {
    private _geometry;
    private _symbol;
    visible: boolean;
    get bound(): Bound;
    constructor(geometry: any, symbol: any);
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound): void;
}
