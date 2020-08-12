export declare class Symbol {
}
export declare class SimplePointSymbol extends Symbol {
    radius: number;
    lineWidth: number;
    strokeStyle: string;
    fillStyle: string;
}
export declare class SimpleLineSymbol extends Symbol {
    lineWidth: number;
    strokeStyle: string;
}
export declare class SimpleFillSymbol extends Symbol {
    lineWidth: number;
    strokeStyle: string;
    fillStyle: string;
}
export declare class SimpleMarkerSymbol extends Symbol {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    icon: ImageBitmap;
    url: string;
    private _loaded;
    get loaded(): boolean;
    load(): Promise<any>;
}
