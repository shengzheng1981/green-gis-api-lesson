import { Geometry } from "./geometry";
import { Bound } from "../util/bound";
import { Projection } from "../projection/projection";
import { Symbol } from "../symbol/symbol";
export declare class Point extends Geometry {
    static RADIUS: number;
    private _lng;
    private _lat;
    private _x;
    private _y;
    constructor(lng: number, lat: number);
    project(projection: Projection): void;
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, symbol?: Symbol): Promise<void>;
}
