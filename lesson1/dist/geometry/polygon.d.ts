import { Geometry } from "./geometry";
export declare class Polygon extends Geometry {
    private _coordinates;
    constructor(coordinates: number[][][]);
    draw(ctx: CanvasRenderingContext2D): void;
}
