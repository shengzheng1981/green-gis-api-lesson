export declare class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: any, g: any, b: any, a?: number);
    toString(): string;
    static fromHex(hex: string): Color;
    static ramp(start: Color, end: Color, count?: number): Color[];
    static random(): Color;
}
