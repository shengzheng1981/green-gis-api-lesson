/**
 * 边界类，用在包络矩形，以及投影的平面坐标边界
 * @remarks
 * 考虑此处代码影响较多内容，故暂不大变动，沿用设计时的定义：
 * 屏幕坐标系的设定：x正方向为自左向右，y正方向为自上向下，因此与常规笛卡尔坐标系中的y正方向相反，请重点注意
 * 故，如传入常规笛卡尔坐标系的坐标，请将ymin与ymax颠倒(即y坐标的最大值传给ymin，最小值传给ymax)，以便于程序设置yscale为-1
 * 当然，如表示的是屏幕坐标范围与边界，正常传入：ymin最小值，ymax最大值。
 */
export class Bound {
    private _xmin: number;
    private _ymin: number;
    private _xmax: number;
    private _ymax: number;

    //+1代表 x方向为自左向右，-1则反之
    private _xscale: number = 1;
    //+1代表 y方向为自上向下，-1则反之
    private _yscale: number = 1;
    /**
     * x方向最小值（应为靠左极值）
     * @return {number} x方向靠左极值
     */
    get xmin():number {
        return this._xmin;
    }
    /**
     * y方向最小值（应为上方极值）
     * @return {number} y方向上方极值
     */
    get ymin():number {
        return this._ymin;
    }
    /**
     * x方向最大值（应为靠右极值）
     * @return {number} x方向靠右极值
     */
    get xmax():number {
        return this._xmax;
    }
     /**
     * y方向最大值（应为下方极值）
     * @return {number} y方向下方极值
     */
    get ymax():number {
        return this._ymax;
    }
    /**
     * +1代表 x方向为自左向右，-1则反之
     * @return {number} x方向
     */
    get xscale():number {
        return this._xscale;
    }
    /**
     * +1代表 y方向为自上向下，-1则反之
     * @return {number} y方向
     */
    get yscale():number {
        return this._yscale;
    }

    /**
     * 包络矩形中心点坐标数组
     * @return {number[]} 中心点坐标数组[x,y]
     */
    getCenter(): number[] {
        return [(this._xmin + this._xmax)/2, (this._ymin + this._ymax)/2];
    }

    /**
     * 创建包络矩形
     * @param {number} xmin - x方向靠左极值
     * @param {number} ymin - y方向上方极值
     * @param {number} xmax - x方向靠右极值
     * @param {number} ymax - y方向下方极值
     */
    constructor(xmin, ymin, xmax, ymax) {
        this._xmin = Math.min(xmin, xmax);
        this._ymin = Math.min(ymin, ymax);
        this._xmax = Math.max(xmin, xmax);
        this._ymax = Math.max(ymin, ymax);
        this._xscale = xmin <= xmax ? 1 : -1;
        this._yscale = ymin <= ymax ? 1 : -1;
    }

    /**
     * 是否交叉叠盖
     * @param {Bound} bound - 交叉叠盖检测对象
     * @return {boolean} 是否交叉叠盖
     */
    intersect(bound: Bound) {
        return (bound.xmax >= this._xmin) && (bound.xmin <= this._xmax) && (bound.ymax >= this._ymin) && (bound.ymin <= this._ymax);
    }

    /**
     * 缩放整个边界
     * @param {number} s - 缩放倍数
     */
    scale(s: number) {
        this._xmin = this._xmin - (s - 1) * (this._xmax - this._xmin)/2;
        this._xmax = this._xmax + (s - 1) * (this._xmax - this._xmin)/2;
        this._ymin = this._ymin - (s - 1) * (this._ymax - this._ymin)/2;
        this._ymax = this._ymax + (s - 1) * (this._ymax - this._ymin)/2;
    }

    /**
     * 缓冲整个边界，类似拓宽
     * @param {number} size - 拓宽相应尺寸
     */   
    buffer(size: number) {
        this._xmin -= size;
        this._ymin -= size;
        this._xmax += size;
        this._ymax += size;
    }
}