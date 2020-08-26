import { Layer } from "./layer";
import { Graphic } from "../element/graphic";
import { Projection } from "../projection/projection";
import { Bound } from "../util/bound";
export declare class GraphicLayer extends Layer {
    private _graphics;
    on(event: any, handler: any): void;
    off(event: any, handler: any): void;
    emit(event: any, param: any): void;
    add(graphic: Graphic): void;
    remove(graphic: Graphic): void;
    clear(): void;
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, zoom?: number): void;
    contain(screenX: number, screenY: number, projection?: Projection, extent?: Bound, zoom?: number, event?: string): boolean;
}
