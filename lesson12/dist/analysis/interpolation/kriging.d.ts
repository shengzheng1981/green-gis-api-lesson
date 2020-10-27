import { Bound } from "../../util/bound";
import { Projection } from "../../projection/projection";
import { Raster } from "../../element/raster";
export declare class Kriging extends Raster {
    private _kriging_matrix_diag;
    private _kriging_matrix_transpose;
    private _kriging_matrix_scale;
    private _kriging_matrix_add;
    private _kriging_matrix_multiply;
    private _kriging_matrix_chol;
    private _kriging_matrix_chol2inv;
    private _kriging_matrix_solve;
    private _kriging_variogram_gaussian;
    private _kriging_variogram_exponential;
    private _kriging_variogram_spherical;
    train(t: any, x: any, y: any, model: any, sigma2: any, alpha: any): {
        t: any;
        x: any;
        y: any;
        nugget: number;
        range: number;
        sill: number;
        A: number;
        n: number;
        model: any;
        K: any;
        M: any;
    };
    predict(x: any, y: any, variogram: any): any;
    variance(x: any, y: any, variogram: any): any;
    grid(polygons: any, variogram: any, width: any): {
        A: any[];
        xlim: any[];
        ylim: any[];
        zlim: number[];
        width: any;
    };
    contour(value: any, polygons: any, variogram: any): void;
    plot(grid: any, xlim: any, ylim: any, colors: any): void;
    colors: string[];
    model: string;
    cellSize: number;
    /**
     * 创建克里金插值
     * @param {number} xmin - 经度左值
     * @param {number} ymin - 纬度下值
     * @param {number} xmax - 经度右值
     * @param {number} ymax - 纬度上值
     * @param {number} width - 栅格宽度
     * @param {number} height - 栅格高度
     * @param {number} cellsize - 栅格大小
     */
    constructor(xmin: any, ymin: any, xmax: any, ymax: any, width?: number, height?: number, cellsize?: number);
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
