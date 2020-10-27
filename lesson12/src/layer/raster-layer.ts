import {Bound} from "../util/bound";
import {Projection} from "../projection/projection";
import {CategoryRenderer} from "../renderer/category-renderer";
import {ClusterSymbol} from "../symbol/symbol";
import {Feature} from "../element/feature";
import {CoordinateType, GeometryType} from "../geometry/geometry";
import {WebMercator} from "../projection/web-mercator";
import {ClassRenderer} from "../renderer/class-renderer";
import {Point} from "../geometry/point";
import {SimpleRenderer} from "../renderer/simple-renderer";
import {Layer} from "./layer";
import {Raster} from "../element/raster";
/**
 * 栅格图层
 */
export class RasterLayer extends Layer{
    /**
     * 图层可交互设置
     */
    protected _interactive: boolean = false;
    /*
     * 栅格
     */
    public raster: Raster;

    /**
     * 绘制图层
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10) {
        if (this.visible) {
            this.raster && this.raster.draw(ctx, projection, extent, zoom);
        }
    }
}