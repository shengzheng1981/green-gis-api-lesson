/**
 * 边界类，用在包络矩形，以及投影的平面坐标边界
 * @remarks
 * 考虑此处代码影响较多内容，故暂不大变动，沿用设计时的定义：
 * 屏幕坐标系的设定：x正方向为自左向右，y正方向为自上向下，因此与常规笛卡尔坐标系中的y正方向相反，请重点注意
 * 故，如传入常规笛卡尔坐标系的坐标，请将ymin与ymax颠倒(即y坐标的最大值传给ymin，最小值传给ymax)，以便于程序设置yscale为-1
 * 当然，如表示的是屏幕坐标范围与边界，正常传入：ymin最小值，ymax最大值。
 */
export declare class Bound {
    private _xmin;
    private _ymin;
    private _xmax;
    private _ymax;
    private _xscale;
    private _yscale;
    /**
     * x方向最小值（应为靠左极值）
     * @return {number} x方向靠左极值
     */
    get xmin(): number;
    /**
     * y方向最小值（应为上方极值）
     * @return {number} y方向上方极值
     */
    get ymin(): number;
    /**
     * x方向最大值（应为靠右极值）
     * @return {number} x方向靠右极值
     */
    get xmax(): number;
    /**
    * y方向最大值（应为下方极值）
    * @return {number} y方向下方极值
    */
    get ymax(): number;
    /**
     * +1代表 x方向为自左向右，-1则反之
     * @return {number} x方向
     */
    get xscale(): number;
    /**
     * +1代表 y方向为自上向下，-1则反之
     * @return {number} y方向
     */
    get yscale(): number;
    /**
     * 包络矩形中心点坐标数组
     * @return {number[]} 中心点坐标数组[x,y]
     */
    getCenter(): number[];
    /**
     * 创建包络矩形
     * @param {number} xmin - x方向靠左极值
     * @param {number} ymin - y方向上方极值
     * @param {number} xmax - x方向靠右极值
     * @param {number} ymax - y方向下方极值
     */
    constructor(xmin: any, ymin: any, xmax: any, ymax: any);
    /**
     * 是否交叉叠盖
     * @param {Bound} bound - 交叉叠盖检测对象
     * @return {boolean} 是否交叉叠盖
     */
    intersect(bound: Bound): boolean;
    /**
     * 缩放整个边界
     * @param {number} s - 缩放倍数
     */
    scale(s: number): void;
    /**
     * 缓冲整个边界，类似拓宽
     * @param {number} size - 拓宽相应尺寸
     */
    buffer(size: number): void;
}
