import { Bound } from "../util/bound";
import { Projection } from "../projection/projection";
import { Layer } from "./layer";
import { Raster } from "../element/raster";
/**
 * 栅格图层
 */
export declare class RasterLayer extends Layer {
    /**
     * 图层可交互设置
     */
    protected _interactive: boolean;
    raster: Raster;
    /**
     * 绘制图层
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, zoom?: number): void;
}
