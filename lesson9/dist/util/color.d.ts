/**
 * 颜色工具类
 * @remarks
 * 此处有太多可扩展内容，如更优雅的生成色带，给色带更多的配置项等等
 * 但由于相关内容，并非GIS API的关注重点，故未花太多精力扩展此内容
 * 各位可根据项目需求，自行发挥，达到更优雅美观的颜色渲染效果。
 * TODO: a lot of things to be done
 */
export declare class Color {
    /**
     * red
     */
    r: number;
    /**
     * green
     */
    g: number;
    /**
     * blue
     */
    b: number;
    /**
     * alpha
     */
    a: number;
    /**
     * 创建颜色
     * @param {number} r - red
     * @param {number} g - green
     * @param {number} b - blue
     * @param {number} a - alpha
     */
    constructor(r: any, g: any, b: any, a?: number);
    /**
    * 输出rgba值
    * @return {string} rgba
    */
    toString(): string;
    /**
     * 16进制表示法颜色 转十进制 R G B
     * @param {string} hex - 十六进制 #ffffff
     * @return {string} 十进制 R G B
     */
    static fromHex(hex: string): Color;
    /**
     * 生成随机色带
     * @param {Color} start - 色带起始色
     * @param {Color} end - 色带终止色
     * @param {number} count - 随机颜色数，默认值10个
     * @return {Color} 生成随机色带
     */
    static ramp(start: Color, end: Color, count?: number): Color[];
    /**
     * 生成随机色
     * @return {Color} 生成随机色
     */
    static random(): Color;
}
