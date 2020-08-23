import { Projection } from "../projection/projection";
import { Bound } from "../util/bound";
import { Subject } from "../util/subject";
export declare class Layer extends Subject {
    name: string;
    description: string;
    protected _visible: boolean;
    get visible(): boolean;
    set visible(value: boolean);
    protected _interactive: boolean;
    get interactive(): boolean;
    set interactive(value: boolean);
    constructor();
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, zoom?: number): void;
    contain(screenX: number, screenY: number, projection?: Projection, extent?: Bound, zoom?: number, event?: string): boolean;
}
