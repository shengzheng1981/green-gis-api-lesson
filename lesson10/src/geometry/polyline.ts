import {Geometry, CoordinateType} from "./geometry";
import {Bound} from "../util/bound";
import {Projection} from "../projection/projection";
import {
    LineSymbol,
    SimpleLineSymbol,
    Symbol
} from "../symbol/symbol";
import {WebMercator} from "../projection/web-mercator";

/**
 * 线
 * @remarks
 * 数据结构：such as [[1,1],[2,2],[1,2]]
 */
export class Polyline extends Geometry{
    /**
     * 容差
     * @remarks
     * 用于交互（线宽较小的情况下，难以选中）
     * screen pixel
     */
    static TOLERANCE: number = 4; 
    /**
     * 交互鼠标坐标到线垂直距离的可选范围
     * @remarks
     * 可选范围 = 容差 + 线宽
     * TOLERANCE + symbol.lineWidth
     */
    private _tolerance: number = 4; 

    /**
     * 经纬度
     */
    private _lnglats: number[][];
    /**
     * 平面坐标
     */
    private _coordinates: number[][];
    /**
     * 屏幕坐标
     */
    private _screen: number[][];
    /**
     * 经纬度
     */
    get lnglats(): number[][] {
        return this._lnglats;
    }
    /**
     * 平面坐标
     */
    get coordinates(): number[][] {
        return this._coordinates;
    }
    /**
     * 创建线
     * @param {number[][]} lnglats - 坐标集合，二维数组
     */
    constructor(lnglats: number[][]) {
        super();
        this._lnglats = lnglats;
    };

    /**
     * 投影变换
     * @param {Projection} projection - 坐标投影转换
     */
    project(projection: Projection) {
        this._projection = projection;
        //经纬度转平面坐标
        this._coordinates = this._lnglats.map( (point: any) => this._projection.project(point));
        //提取包络矩形
        let xmin = Number.MAX_VALUE, ymin = Number.MAX_VALUE, xmax = -Number.MAX_VALUE, ymax = -Number.MAX_VALUE;
        this._coordinates.forEach( point => {
            xmin = Math.min(xmin, point[0]);
            ymin = Math.min(ymin, point[1]);
            xmax = Math.max(xmax, point[0]);
            ymax = Math.max(ymax, point[1]);
        });
        this._bound = new Bound(xmin, ymin, xmax, ymax);
    }

    /**
     * 绘制线
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {Symbol} symbol - 渲染符号
     */
    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, symbol: LineSymbol = new SimpleLineSymbol()) {
        //如第一次绘制，没有经过投影，则先完成投影，以后可跳过
        if (!this._projected) this.project(projection);
        //再判断是否在可视范围内
        if (!extent.intersect(this._bound)) return;
        this._tolerance = Polyline.TOLERANCE + symbol.lineWidth;
        const matrix = (ctx as any).getTransform();
        this._screen = this._coordinates.map( (point: any,index) => {
            const screenX = (matrix.a * point[0] + matrix.e), screenY = (matrix.d * point[1] + matrix.f);
            return [screenX, screenY];
        });
        //TODO: cache screenXY & symbol for redraw.
        symbol.draw(ctx, this._screen);
    }

    /**
     * 获取线的中心点
     * @remarks
     * from Leaflet
     * @param {CoordinateType} type - 坐标类型
     * @param {Projection} projection - 坐标投影转换
     * @return {number[]} 中心点坐标
     */
    getCenter(type: CoordinateType = CoordinateType.Latlng, projection: Projection = new WebMercator()) {
        if (!this._projected) this.project(projection);
        let i, halfDist, segDist, dist, p1, p2, ratio,
            points = this._coordinates,
            len = points.length;

        if (!len) { return null; }

        // polyline centroid algorithm; only uses the first ring if there are multiple

        for (i = 0, halfDist = 0; i < len - 1; i++) {
            halfDist += Math.sqrt((points[i + 1][0] - points[i][0]) * (points[i + 1][0] - points[i][0]) + (points[i + 1][1] - points[i][1]) * (points[i + 1][1] - points[i][1])) / 2;
        }

        let center;
        // The line is so small in the current view that all points are on the same pixel.
        if (halfDist === 0) {
            center = points[0];
        }

        for (i = 0, dist = 0; i < len - 1; i++) {
            p1 = points[i];
            p2 = points[i + 1];
            segDist = Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1]));
            dist += segDist;

            if (dist > halfDist) {
                ratio = (dist - halfDist) / segDist;
                center = [
                    p2[0] - ratio * (p2[0] - p1[0]),
                    p2[1] - ratio * (p2[1] - p1[1])
                ];
            }
        }

        if (type === CoordinateType.Latlng) {
            return projection.unproject(center);
        } else {
            return center;
        }
    }

    /**
     * 是否包含传入坐标
     * @remarks
     * 线是1维，所以要设置一个tolerance容差，来判断坐标是否落到线上
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @return {boolean} 是否落入
     */
    contain(screenX: number, screenY: number): boolean {
        let p2;
        //from Leaflet
        //点到线段的距离，垂直距离
        const _distanceToSegment = (p, p1, p2) => {
            let x = p1[0],
                y = p1[1],
                dx = p2[0] - x,
                dy = p2[1] - y,
                dot = dx * dx + dy * dy,
                t;
    
            if (dot > 0) {
                t = ((p[0] - x) * dx + (p[1] - y) * dy) / dot;
    
                if (t > 1) {
                    x = p2[0];
                    y = p2[1];
                } else if (t > 0) {
                    x += dx * t;
                    y += dy * t;
                }
            }
    
            dx = p[0] - x;
            dy = p[1] - y;
    
            return Math.sqrt(dx * dx + dy * dy);
        }
        const distance = this._screen.reduce( (acc, cur) => {
            if (p2) {
                const p1 = p2;
                p2 = cur;
                return Math.min(acc, _distanceToSegment([screenX, screenY], p1, p2));
            } else {
                p2 = cur;
                return acc;
            }
        }, Number.MAX_VALUE);
        return distance <= this._tolerance;
    }

}