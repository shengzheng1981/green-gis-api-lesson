import { WebMercator } from "../projection/web-mercator";
import { Layer } from "./layer";
/**
 * 栅格图层
 */
export class RasterLayer extends Layer {
    constructor() {
        super(...arguments);
        /**
         * 图层可交互设置
         */
        this._interactive = false;
    }
    /**
     * 绘制图层
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx, projection = new WebMercator(), extent = projection.bound, zoom = 10) {
        if (this.visible) {
            this.raster && this.raster.draw(ctx, projection, extent, zoom);
        }
    }
}
