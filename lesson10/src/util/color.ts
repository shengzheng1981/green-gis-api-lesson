/**
 * 颜色工具类
 * @remarks
 * 此处有太多可扩展内容，如更优雅的生成色带，给色带更多的配置项等等
 * 但由于相关内容，并非GIS API的关注重点，故未花太多精力扩展此内容
 * 各位可根据项目需求，自行发挥，达到更优雅美观的颜色渲染效果。
 * TODO: a lot of things to be done
 */
export class Color {
    /**
     * red
     */
    public r: number;
    /**
     * green
     */
    public g: number;
    /**
     * blue
     */
    public b: number;
    /**
     * alpha
     */
    public a: number = 1;

    /**
     * 创建颜色
     * @param {number} r - red
     * @param {number} g - green
     * @param {number} b - blue
     * @param {number} a - alpha
     */
    constructor(r, g, b, a: number = 1) {
       this.r = r;
       this.g = g;
       this.b = b;
       this.a = a;
    }

     /**
     * 输出rgba值
     * @return {string} rgba
     */
    toString() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }

    /**
     * 16进制表示法颜色 转十进制 R G B
     * @param {string} hex - 十六进制 #ffffff
     * @return {string} 十进制 R G B
     */
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
            if (hex.length === 7) {
                hex += "ff";
            }
            let sColorChange = [];
            for (let i = 1; i < 9; i += 2) {
                sColorChange.push(parseInt("0x" + hex.slice(i, i + 2)));
            }
            return new Color(sColorChange[0], sColorChange[1], sColorChange[2], sColorChange[3]/255);
        }
    }

    /**
     * 生成随机色带
     * @param {Color} start - 色带起始色
     * @param {Color} end - 色带终止色
     * @param {number} count - 随机颜色数，默认值10个
     * @return {Color} 生成随机色带
     */
    static ramp(start: Color, end: Color, count: number = 10): Color[]{
        const colors: Color[] = [];
        for (let i = 0; i < count; i += 1) {
            colors.push(new Color((end.r - start.r) * i / count + start.r, (end.g - start.g) * i / count + start.g, (end.b - start.b) * i / count + start.b, (end.a - start.a) * i / count + start.a ));
        }
        return colors;
    }

    /**
     * 生成随机色
     * @return {Color} 生成随机色
     */
    static random(): Color {
        return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    }
}