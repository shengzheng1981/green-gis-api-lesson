import { Geometry } from "./geometry/geometry";
import { Projection } from "./projection/projection";
export declare class Map {
    private _container;
    private _canvas;
    private _ctx;
    private _drag;
    private _geometries;
    private _zoom;
    private _center;
    private _extent;
    private _projection;
    private _events;
    get projection(): Projection;
    constructor(id: string | HTMLDivElement);
    on(event: any, handler: any): void;
    setView(center?: number[], zoom?: number): void;
    addGeometry(geometry: Geometry): void;
    updateExtent(): void;
    redraw(): void;
    clear(): void;
    _onDoubleClick(event: any): void;
    _onMouseDown(event: any): void;
    _onMouseMove(event: any): void;
    _onMouseUp(event: any): void;
    _onWheel(event: any): void;
    destroy(): void;
}
