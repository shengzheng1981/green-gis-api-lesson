import { Geometry } from "./geometry";
import { Bound } from "../util/bound";
export declare class Point extends Geometry {
    static RADIUS: number;
    private _lng;
    private _lat;
    private _x;
    private _y;
    private _projection;
    private _bound;
    get bound(): Bound;
    constructor(lng: number, lat: number);
    addTo(map: any): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
