import { Geometry, CoordinateType } from "./geometry";
import { Bound } from "../util/bound";
import { Projection } from "../projection/projection";
import { FillSymbol } from "../symbol/symbol";
export declare class Polygon extends Geometry {
    private _lnglats;
    private _coordinates;
    private _screen;
    constructor(lnglats: number[][][]);
    project(projection: Projection): void;
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, symbol?: FillSymbol): void;
    getCenter(type?: CoordinateType, projection?: Projection): any;
}
