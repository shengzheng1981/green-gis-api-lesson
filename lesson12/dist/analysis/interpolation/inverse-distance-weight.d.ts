import { Bound } from "../../util/bound";
import { Projection } from "../../projection/projection";
import { Raster } from "../../element/raster";
export declare class InverseDistanceWeight extends Raster {
    private _featureClass;
    private _field;
    private _min;
    private _max;
    private _ramp;
    /**
     * 衰减半径
     */
    radius: number;
    /**
     * 分辨率
     */
    resolution: number;
    /**
     * 渐变色
     */
    gradient: any[];
    /**
     * 反距离函数
     */
    decay: any;
    honey: boolean;
    honeySide: number;
    honeyColor: string;
    get dynamic(): boolean;
    get min(): number;
    set min(value: number);
    get max(): number;
    set max(value: number);
    /**
     * 创建插值
     */
    constructor();
    generate(featureClass: any, field: any): void;
    /**
     * 绘制栅格
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, zoom?: number): void;
}
