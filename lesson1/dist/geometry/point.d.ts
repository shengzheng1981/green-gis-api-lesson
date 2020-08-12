import { Geometry } from "./geometry";
export declare class Point extends Geometry {
    static RADIUS: number;
    private _x;
    private _y;
    constructor(x: number, y: number);
    draw(ctx: CanvasRenderingContext2D): void;
}
