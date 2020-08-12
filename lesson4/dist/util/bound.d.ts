export declare class Bound {
    private _xmin;
    private _ymin;
    private _xmax;
    private _ymax;
    private _xscale;
    private _yscale;
    get xmin(): number;
    get ymin(): number;
    get xmax(): number;
    get ymax(): number;
    get xscale(): number;
    get yscale(): number;
    getCenter(): number[];
    constructor(xmin: any, ymin: any, xmax: any, ymax: any);
    intersect(bound: Bound): boolean;
    scale(s: number): void;
}
