
import {Geometry, CoordinateType} from "./geometry";
import {Bound} from "../util/bound";
import {Projection} from "../projection/projection";
import {
    FillSymbol,
    SimpleFillSymbol,
    Symbol
} from "../symbol/symbol";
import {WebMercator} from "../projection/web-mercator";

/**
 * 面
 * @remarks
 * 数据结构：[ring[point[x,y]]]：such as [[[1,1],[2,2],[1,2]], [[1.5,1.5],[1.9,1.9],[1.5,1.9]]]
 */
export class Polygon extends Geometry{

    /**
     * 经纬度
     */
    private _lnglats: number[][][];
    /**
     * 平面坐标
     */
    private _coordinates: number[][][];
    /**
     * 屏幕坐标
     */
    private _screen: number[][][];
    /**
     * 经纬度
     */
    get lnglats(): number[][][] {
        return this._lnglats;
    }
    /**
     * 平面坐标
     */
    get coordinates(): number[][][] {
        return this._coordinates;
    }
    /**
     * 创建面
     * @param {number[][][]} lnglats - 坐标集合，三维数组
     */
    constructor(lnglats: number[][][]) {
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
        this._coordinates = this._lnglats.map((ring:any) => ring.map((point: any) => this._projection.project(point)));
        //提取包络矩形
        let xmin = Number.MAX_VALUE, ymin = Number.MAX_VALUE, xmax = -Number.MAX_VALUE, ymax = -Number.MAX_VALUE;
        this._coordinates.forEach( ring => {
            ring.forEach(point =>{
                xmin = Math.min(xmin, point[0]);
                ymin = Math.min(ymin, point[1]);
                xmax = Math.max(xmax, point[0]);
                ymax = Math.max(ymax, point[1]);
            })
        });
        this._bound = new Bound(xmin, ymin, xmax, ymax);
    }

    /**
     * 绘制面
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {Symbol} symbol - 渲染符号
     */
    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, symbol: FillSymbol = new SimpleFillSymbol()) {
        //如第一次绘制，没有经过投影，则先完成投影，以后可跳过
        if (!this._projected) this.project(projection);
        //再判断是否在可视范围内
        if (!extent.intersect(this._bound)) return;
        const matrix = (ctx as any).getTransform();
        this._screen = this._coordinates.map( ring => {
            return ring.map((point: any,index) => {
                const screenX = (matrix.a * point[0] + matrix.e), screenY = (matrix.d * point[1] + matrix.f);
                return [screenX, screenY];
            });
        });
        //TODO: cache screenXY & symbol for redraw.
        symbol.draw(ctx, this._screen);
    }

    /**
     * 获取面的中心点
     * @remarks
     * from Leaflet
     * @param {CoordinateType} type - 坐标类型
     * @param {Projection} projection - 坐标投影转换
     * @return {number[]} 中心点坐标
     */
    getCenter(type: CoordinateType = CoordinateType.Latlng, projection: Projection = new WebMercator()) {
        if (!this._projected) this.project(projection);
        let i, j, p1, p2, f, area, x, y, center,
            points = this._coordinates[0],
            len = points.length;

        if (!len) { return null; }

        // polygon centroid algorithm; only uses the first ring if there are multiple

        area = x = y = 0;

        for (i = 0, j = len - 1; i < len; j = i++) {
            p1 = points[i];
            p2 = points[j];

            f = p1[1] * p2[0] - p2[1] * p1[0];
            x += (p1[0] + p2[0]) * f;
            y += (p1[1] + p2[1]) * f;
            area += f * 3;
        }

        if (area === 0) {
            // Polygon is so small that all points are on same pixel.
            center = points[0];
        } else {
            center = [x / area, y / area];
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
     * 点是不是落在面内
     * from https://github.com/substack/point-in-polygon
     * ray-casting algorithm based on
     * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @return {boolean} 是否落入
     */
    contain(screenX: number, screenY: number): boolean {
        const first = this._screen[0];
        const others = this._screen.slice(1);
        //first ring contained && others no contained
        const _pointInPolygon = (point, vs) => {
            let x = point[0], y = point[1];
    
            let inside = false;
            for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                let xi = vs[i][0], yi = vs[i][1];
                let xj = vs[j][0], yj = vs[j][1];
    
                let intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
    
            return inside;
        };
        return _pointInPolygon([screenX, screenY], first) && others.every(ring => !_pointInPolygon([screenX, screenY], ring));
        //return this._screen.some(ring => this._pointInPolygon([screenX, screenY], ring));
    }

}
