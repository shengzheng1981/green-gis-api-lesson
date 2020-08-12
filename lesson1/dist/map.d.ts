import { Geometry } from "./geometry/geometry";
export declare class Map {
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _drag: any;
    _geometries: Geometry[];
    constructor(id: string);
    addGeometry(geometry: Geometry): void;
    redraw(): void;
    clear(): void;
    _onDoubleClick(event: any): void;
    _onMouseDown(event: any): void;
    _onMouseMove(event: any): void;
    _onMouseUp(event: any): void;
    _onWheel(event: any): void;
    destroy(): void;
}
