export declare class Symbol {
    lineWidth: number;
    strokeStyle: string;
    fillStyle: string;
}
export declare class PointSymbol extends Symbol {
    draw(ctx: CanvasRenderingContext2D, screenX: any, screenY: any): void;
    contain(anchorX: any, anchorY: any, screenX: any, screenY: any): boolean;
}
export declare class LineSymbol extends Symbol {
    draw(ctx: CanvasRenderingContext2D, screen: number[][]): void;
}
export declare class FillSymbol extends Symbol {
    draw(ctx: CanvasRenderingContext2D, screen: number[][][]): void;
}
export declare class SimplePointSymbol extends PointSymbol {
    radius: number;
    draw(ctx: CanvasRenderingContext2D, screenX: any, screenY: any): void;
    contain(anchorX: any, anchorY: any, screenX: any, screenY: any): boolean;
}
export declare class SimpleLineSymbol extends LineSymbol {
    draw(ctx: CanvasRenderingContext2D, screen: number[][]): void;
}
export declare class SimpleFillSymbol extends Symbol {
    lineWidth: number;
    draw(ctx: CanvasRenderingContext2D, screen: number[][][]): void;
}
export declare class SimpleMarkerSymbol extends PointSymbol {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    icon: ImageBitmap;
    url: string;
    private _loaded;
    get loaded(): boolean;
    load(): Promise<any>;
    draw(ctx: CanvasRenderingContext2D, screenX: any, screenY: any): Promise<void>;
    contain(anchorX: any, anchorY: any, screenX: any, screenY: any): boolean;
}
export declare class ClusterSymbol extends PointSymbol {
    private _count;
    radius: number;
    strokeStyle: string;
    outerFillStyle: string;
    fontColor: string;
    fontFamily: string;
    fontWeight: string;
    get text(): string;
    get inner(): number;
    get outer(): number;
    get fontSize(): number;
    get innerFillStyle(): string;
    constructor(count: number);
    draw(ctx: CanvasRenderingContext2D, screenX: any, screenY: any): void;
}
