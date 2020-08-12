import { Geometry } from "./geometry";
import { Bound } from "../util/bound";
export declare class Polygon extends Geometry {
    private _lnglats;
    private _coordinates;
    private _projection;
    private _bound;
    get bound(): Bound;
    constructor(lnglats: number[][][]);
    addTo(map: any): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
