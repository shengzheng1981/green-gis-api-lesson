export class Color {

    public r: number;
    public g: number;
    public b: number;
    public a: number = 1;

    constructor(r, g, b, a: number = 1) {
       this.r = r;
       this.g = g;
       this.b = b;
       this.a = a;
    }

    toString() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }

    static fromHex(hex: string) {
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/;
        hex = hex.toLowerCase();
        if (hex && reg.test(hex)) {
            //处理三位的颜色值
            if (hex.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += hex.slice(i, i + 1).concat(hex.slice(i, i + 1));
                }
                hex = sColorNew;
            }
            //处理六位的颜色值
            if (hex.length === 4) {
                hex += "ff";
            }
            let sColorChange = [];
            for (let i = 1; i < 9; i += 2) {
                sColorChange.push(parseInt("0x" + hex.slice(i, i + 2)));
            }
            return new Color(sColorChange[0], sColorChange[1], sColorChange[2], sColorChange[3]/255);
        }
    }

    static ramp(start: Color, end: Color, count: number = 10): Color[]{
        const colors: Color[] = [];
        for (let i = 0; i < count; i += 1) {
            colors.push(new Color((end.r - start.r) * i / count + start.r, (end.g - start.g) * i / count + start.g, (end.b - start.b) * i / count + start.b, (end.a - start.a) * i / count + start.a ));
        }
        return colors;
    }

    static random(): Color {
        return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    }
}