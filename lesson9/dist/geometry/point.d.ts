import { Geometry, CoordinateType } from "./geometry";
import { Bound } from "../util/bound";
import { Projection } from "../projection/projection";
import { PointSymbol } from "../symbol/symbol";
export declare class Point extends Geometry {
    static RADIUS: number;
    private _lng;
    private _lat;
    private _x;
    private _y;
    private _screenX;
    private _screenY;
    private _symbol;
    constructor(lng: number, lat: number);
    project(projection: Projection): void;
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, symbol?: PointSymbol): Promise<void>;
    getCenter(type?: CoordinateType, projection?: Projection): number[];
    contain(screenX: number, screenY: number): boolean;
}
