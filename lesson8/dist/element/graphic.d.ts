import { Bound } from "../util/bound";
import { Projection } from "../projection/projection";
import { Subject } from "../util/subject";
export declare class Graphic extends Subject {
    private _geometry;
    private _symbol;
    private _contained;
    visible: boolean;
    get bound(): Bound;
    constructor(geometry: any, symbol: any);
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound): void;
    intersect(projection?: Projection, extent?: Bound): boolean;
    contain(screenX: number, screenY: number, event?: string): boolean;
}
