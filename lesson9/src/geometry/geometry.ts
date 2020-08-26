import {Bound} from "../util/bound";
import {Projection} from "../projection/projection";
import {
    SimplePointSymbol,
    SimpleTextSymbol,
    Symbol
} from "../symbol/symbol";
import {WebMercator} from "../projection/web-mercator";

//坐标类型
export enum CoordinateType {
    //经纬度坐标
    Latlng = 1,
    //地理平面坐标
    Projection = 2,
    //屏幕平面坐标
    Screen = 3
}

//图形类型
export enum GeometryType {
    //点
    Point = 1,
    //线
    Polyline = 2,
    //面
    Polygon = 3
}

//图形基类
export class Geometry {
    //是否已经过投影
    //优化用
    protected _projected: boolean;
    //投影变换方式
    protected _projection: Projection;
    //包络矩形
    //注意bound的坐标类型：一般为地理平面坐标，即投影后坐标
    protected _bound: Bound;

    //投影变换虚函数
    project(projection: Projection) {};

    //图形绘制虚函数
    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, symbol: Symbol = new SimplePointSymbol()) {};

    //图形包络矩形与可见视图范围是否包含或相交
    intersect(projection: Projection = new WebMercator(), extent: Bound = projection.bound): boolean {
        if (!this._projected) this.project(projection);
        return extent.intersect(this._bound);
    }

    //图形中心点
    getCenter(type: CoordinateType = CoordinateType.Latlng, projection: Projection = new WebMercator()) {};

    //两个图形间距离
    //当前为两图形中心点间的直线距离
    //多用于聚合判断
    distance(geometry: Geometry, type: CoordinateType, ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator()) {
        const center = this.getCenter(type == CoordinateType.Screen ? CoordinateType.Projection : type, projection);
        const point = geometry.getCenter(type == CoordinateType.Screen ? CoordinateType.Projection : type, projection);
        if (type == CoordinateType.Screen) {
            const matrix = (ctx as any).getTransform();
            const screenX1 = (matrix.a * center[0] + matrix.e), screenY1 = (matrix.d * center[1] + matrix.f);
            const screenX2 = (matrix.a * point[0] + matrix.e), screenY2 = (matrix.d * point[1] + matrix.f);
            return Math.sqrt((screenX2-screenX1) * (screenX2-screenX1) + (screenY2-screenY1) * (screenY2-screenY1));
        } else if (type == CoordinateType.Projection) {
            return Math.sqrt((point[0]-center[0]) * (point[0]-center[0]) + (point[1]-center[1]) * (point[1]-center[1]));
        }
    }

    //标注绘制
    //标注文本支持多行，/r/n换行
    label(text: string, ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), symbol: SimpleTextSymbol = new SimpleTextSymbol()) {
        if (!text) return;
        if (!this._projected) this.project(projection);
        ctx.save();
        ctx.strokeStyle = symbol.strokeStyle;
        ctx.fillStyle = symbol.fillStyle;
        ctx.lineWidth = symbol.lineWidth;
        ctx.lineJoin = "round";
        ctx.font = symbol.fontSize + "px/1 " + symbol.fontFamily +  " " + symbol.fontWeight;
        const center = this.getCenter(CoordinateType.Projection, projection);
        const matrix = (ctx as any).getTransform();
        ctx.setTransform(1,0,0,1,0,0);
        //标注文本多行分割
        const array = text.split("/r/n");
        //计算每一行宽度
        let widths = array.map(str => ctx.measureText(str).width + symbol.padding * 2);
        //取最大宽度，作为标注宽度
        let width = Math.max(...widths);
        //高度取决于：字体大小，以及行数*行距，以及标注框上下的留白padding
        let height = symbol.fontSize * array.length + symbol.padding * 2 + symbol.padding * (array.length - 1);
        const screenX = (matrix.a * center[0] + matrix.e);
        const screenY = (matrix.d * center[1] + matrix.f);
        //画标注外框
        ctx.strokeRect(screenX + symbol.offsetX - symbol.padding, screenY + symbol.offsetY - symbol.padding, width, height);
        //填充标注背景
        ctx.fillRect(screenX + symbol.offsetX - symbol.padding, screenY + symbol.offsetY - symbol.padding, width, height);
        ctx.textBaseline = "top";
        ctx.fillStyle = symbol.fontColor;
        //多行文本绘制
        array.forEach((str,index) => {
            ctx.fillText(str, screenX + symbol.offsetX + (width - widths[index]) / 2, screenY + symbol.offsetY + index * (symbol.fontSize + symbol.padding));
        });
        ctx.restore();
    };

    //标注量算
    //标注文本支持多行，/r/n换行
    //目前用于寻找自动标注最合适的方位：top bottom left right 
    measure(text: string, ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), symbol: SimpleTextSymbol = new SimpleTextSymbol()) {
        if (!text) return;
        ctx.save();
        ctx.font = symbol.fontSize + "px/1 " + symbol.fontFamily +  " " + symbol.fontWeight;
        const center = this.getCenter(CoordinateType.Projection, projection);
        const matrix = (ctx as any).getTransform();
        ctx.setTransform(1,0,0,1,0,0);
        //标注文本多行分割
        const array = text.split("/r/n");
        //计算每一行宽度
        let widths = array.map(str => ctx.measureText(str).width + symbol.padding * 2);
        //取最大宽度，作为标注宽度
        let width = Math.max(...widths);
        //高度取决于：字体大小，以及行数*行距，以及标注框上下的留白padding
        let height = symbol.fontSize * array.length + symbol.padding * 2 + symbol.padding * (array.length - 1);
        const screenX = (matrix.a * center[0] + matrix.e);
        const screenY = (matrix.d * center[1] + matrix.f);
        ctx.restore();
        return new Bound(screenX + symbol.offsetX - symbol.padding, screenY + symbol.offsetY - symbol.padding, screenX + symbol.offsetX - symbol.padding + width,  screenY + symbol.offsetY - symbol.padding + height);
    };

    //是否包含传入坐标
    //主要用于鼠标交互
    contain(screenX: number, screenY: number): boolean { return false; }
}