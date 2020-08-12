
import {Geometry} from "./geometry/geometry";
import {Bound} from "./util/bound";
import {Projection} from "./projection/projection";
import {WebMercator} from "./projection/web-mercator";
import {Layer} from "./layer/layer";
import {GraphicLayer} from "./layer/graphic-layer";
import {Graphic} from "./element/graphic";

export class Map {
    private _container: HTMLDivElement;
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    private _drag: any = {
        flag: false,
        start: {
            x: 0,
            y: 0
        },
        end: {
            x: 0,
            y: 0
        }
    };

     //private _geometries: Geometry[] = [];
    private _defaultGraphicLayer: GraphicLayer = new GraphicLayer();
    private _layers: Layer[] = [];

    //地图缩放等级
    private _zoom: number = 1;
    //地图视图中心
    private _center: number[] = [0,0];
    //地图视图范围
    private _extent: Bound;
    //地图投影方式
    private _projection: Projection;

    //地图事件的handlers
    private _events: any = {
        "move": [],    //漫游时，暂预留
        "extent": []   //视图范围更新时，当前关注该事件
    };

    get projection(): Projection {
        return this._projection;
    }

    constructor(id: string | HTMLDivElement) {
        this._container = id instanceof HTMLDivElement ? id : document.getElementById(id) as HTMLDivElement;
        //create canvas
        this._canvas = document.createElement("canvas");
        this._canvas.style.cssText = "position: absolute; height: 100%; width: 100%; z-index: 100";
        this._canvas.width = this._container.clientWidth ;
        this._canvas.height = this._container.clientHeight;
        this._container.appendChild(this._canvas);
        this._ctx = this._canvas.getContext("2d");

        this._onDoubleClick = this._onDoubleClick.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onWheel = this._onWheel.bind(this);

        this._canvas.addEventListener("dblclick", this._onDoubleClick);
        this._canvas.addEventListener("mousedown", this._onMouseDown);
        this._canvas.addEventListener("mousemove", this._onMouseMove);
        this._canvas.addEventListener("mouseup", this._onMouseUp);
        this._canvas.addEventListener("wheel", this._onWheel);

        //初始化
        this._projection = new WebMercator();
        this.setView([0, 0], 3)
    }

    //地图事件注册监听
    //TODO: need to off
    on(event, handler) {
        this._events[event].push(handler);
    }

    //设置视图级别及视图中心
    setView(center: number[] = [0,0], zoom: number = 3) {
        this._center = center;
        this._zoom = Math.max(3, Math.min(20, zoom));
        //center为经纬度，转化为平面坐标
        const origin = this._projection.project(center as any);
        const bound: Bound = this._projection.bound;
        //已知：matrix 转换前 坐标origin，转换后坐标 即canvas的中心 [this._canvas.width / 2, this._canvas.height / 2]
        //求：转换矩阵
        //解法如下：
        const a = 256 * Math.pow(2, this._zoom) / (bound.xmax - bound.xmin) * bound.xscale;
        const d = 256 * Math.pow(2, this._zoom) / (bound.ymax - bound.ymin) * bound.yscale;
        const e = this._canvas.width / 2 - a * origin[0];
        const f = this._canvas.height / 2 - d * origin[1];
        this._ctx.setTransform(a , 0, 0, d, e, f);
        this.redraw();
    }

    //TODO: manage geometry by layer
    /* addGeometry(geometry: Geometry) {
        geometry.draw(this._ctx);
        this._geometries.push(geometry);
    } */
    addLayer(layer: Layer) {
        this._layers.push(layer);
        layer.draw(this._ctx, this._projection, this._extent);
    }

    //shortcut
    addGraphic(graphic: Graphic) {
        this._defaultGraphicLayer.add(graphic);
        graphic.draw(this._ctx, this._projection, this._extent);
    }

    //更新地图视图范围以及中心点
    updateExtent() {
        const matrix = (this._ctx as any).getTransform();
        const x1 = (0 - matrix.e)/matrix.a, y1 = (0-matrix.f)/matrix.d, x2 = (this._canvas.width - matrix.e)/matrix.a, y2 = (this._canvas.height-matrix.f)/matrix.d;
        this._extent = new Bound(Math.min(x1,x2), Math.min(y1,y2), Math.max(x1,x2), Math.max(y1,y2));
        this._center = this._projection.unproject([(x1+x2)/2, (y1+y2)/2]);
        this._events.extent.forEach(handler => handler({extent: this._extent, center: this._center, zoom: this._zoom, matrix: matrix}));
    }

    redraw() {
        this._ctx.save();
        this._ctx.setTransform(1,0,0,1,0,0);
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.restore();
        this.updateExtent();
        //this._geometries.forEach(geometry => geometry.draw(this._ctx));
        this._defaultGraphicLayer.draw(this._ctx, this._projection, this._extent);
        this._layers.forEach(layer => {
            layer.draw(this._ctx, this._projection, this._extent);
        });
    }

    clear() {
        this._ctx.setTransform(1, 0, 0, 1, 0, 0);
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    _onDoubleClick(event) {
        if (this._zoom >= 20) return;
        const scale = 2;
        this._zoom += 1;
        const matrix = (this._ctx as any).getTransform();
        const a1 = matrix.a, e1 = matrix.e, x1 = event.x, x2 = x1; //放大到中心点 x2 = this._canvas.width / 2
        const e = (x2 - scale * (x1 - e1) - e1) / a1;
        const d1 = matrix.d, f1 = matrix.f, y1 = event.y, y2 = y1; //放大到中心点 y2 = this._canvas.height / 2
        const f = (y2 - scale * (y1 - f1) - f1) / d1;
        this._ctx.transform( scale, 0, 0, scale, e, f );
        this.redraw();
    }

    _onMouseDown(event) {
        this._drag.flag = true;
        this._drag.start.x = event.x;
        this._drag.start.y = event.y;
    }

    _onMouseMove(event) {

    }

    _onMouseUp(event) {
        if (this._drag.flag) {
            this._drag.end.x = event.x;
            this._drag.end.y = event.y;
            const matrix = (this._ctx as any).getTransform();
            this._ctx.translate((this._drag.end.x - this._drag.start.x)/matrix.a, (this._drag.end.y - this._drag.start.y)/matrix.d);
            this.redraw();
        }
        this._drag.flag = false;
    }

    _onWheel(event) {
        event.preventDefault();
        const sensitivity = 5;
        if (Math.abs(event.deltaY) <= sensitivity) return;
        //const sensitivity = 100;
        //const delta = event.deltaY / sensitivity;
        const delta = event.deltaY < 0 ? -1 : 1;
        let scale = 1;
        if (delta < 0) {
            // 放大
            scale *= delta * -2;
        }
        else {
            // 缩小
            scale /= delta * 2;
        }
        let zoom = Math.round(Math.log(scale));
        if (zoom > 0) {
            // 放大
            zoom = this._zoom + zoom >= 20 ? 20 - this._zoom : zoom;
        } else if (zoom < 0) {
            // 缩小
            zoom = this._zoom + zoom <= 3 ? 3 - this._zoom : zoom;
        }
        if (zoom == 0) return;
        this._zoom += zoom;
        scale = Math.pow(2, zoom);
        //交互表现为 鼠标当前位置 屏幕坐标不变 进行缩放 即x2 = x1

        //第一种方案，坐标系不变，变坐标值
        //1.将原屏幕坐标 x1 转成 初始坐标 x0 = (x1 - e1) / a1  初始矩阵 (1,0,0,1,0,0)
        //2.初始坐标x0 转成 现屏幕坐标x2  a2 * x0 + e2 = x2    e2 = x2 - a2 * x0  代入1式 e2 = x2 - a2 * (x1 - e1) / a1
        //3.已知scale = a2 / a1  故 e2 = x2 - scale * (x1 - e1)
        //4.另矩阵变换 a1 * e + e1 = e2
        //5.联立3和4  求得 e = (x2 - scale * (x1 - e1) - e1) / a1
        const matrix = (this._ctx as any).getTransform();
        const a1 = matrix.a, e1 = matrix.e, x1 = event.x, x2 = x1; //放大到中心点 x2 = this._canvas.width / 2
        const e = (x2 - scale * (x1 - e1) - e1) / a1;
        const d1 = matrix.d, f1 = matrix.f, y1 = event.y, y2 = y1; //放大到中心点 y2 = this._canvas.height / 2
        const f = (y2 - scale * (y1 - f1) - f1) / d1;
        this._ctx.transform( scale, 0, 0, scale, e, f );

        this.redraw();
    }

    destroy() {
        this._canvas.removeEventListener("dblclick", this._onDoubleClick);
        this._canvas.removeEventListener("mousedown", this._onMouseDown);
        this._canvas.removeEventListener("mousemove", this._onMouseMove);
        this._canvas.removeEventListener("mouseup", this._onMouseUp);
        this._canvas.removeEventListener("wheel", this._onWheel);
    }
}