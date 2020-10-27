
import {Geometry} from "./geometry/geometry";
import {Bound} from "./util/bound";
import {Projection} from "./projection/projection";
import {WebMercator} from "./projection/web-mercator";
import {Layer} from "./layer/layer";
import {FeatureLayer} from "./layer/feature-layer";
import {GraphicLayer} from "./layer/graphic-layer";
import {Graphic} from "./element/graphic";
import {Subject} from "./util/subject";
import {Animator} from "./animator";
import {Tile} from "./tile";
 /**
 * 地图
 */
export class Map extends Subject {
    //最外层的DOM，canvas的容器
    private _container: HTMLDivElement;
    //canvas element
    private _canvas: HTMLCanvasElement;
    //canvas的上下文
    private _ctx: CanvasRenderingContext2D;

    //默认为地图添加一个图形图层，为地图添加图形接口提供便捷，语法糖而已，无他
    private _defaultGraphicLayer: GraphicLayer = new GraphicLayer();
    //图层集合
    private _layers: Layer[] = [];

    //地图缩放等级
    private _zoom: number = 1;
    //地图视图中心
    private _center: number[] = [0,0];
    //地图视图范围
    private _extent: Bound;
    //地图投影方式
    private _projection: Projection;

    //地图漫游操作相关私有变量及标记
    //辅助响应mousedown mouseup，完成地图漫游（平移）
    private _drag: any = {
        //是否处于漫游状态
        flag: false,
        //漫游起始坐标
        start: {
            x: 0,
            y: 0
        },
        //漫游结束坐标
        end: {
            x: 0,
            y: 0
        }
    };

    //动画控制
    private _animator: Animator;
    //切片管理
    private _tile: Tile;

    /**
     * DIV容器
     */
    get container(): HTMLDivElement{
        return this._container;
    }
    /**
     * 视图中心
     */
    get center(): number[]{
        return this._center;
    }
    /**
     * 可视范围
     */
    get extent(): Bound{
        return this._extent;
    }
    /**
     * 缩放级别
     */
    get zoom(): number{
        return this._zoom;
    }
    /**
     * 坐标投影变换
     * @type {Projection}
     * @readonly
     */
    get projection(): Projection {
        return this._projection;
    }

    /**
     * 创建地图
     * @param {string | HTMLDivElement} id - HTMLDivElement | id
     */
    constructor(id: string | HTMLDivElement) {
        //extent: 视图范围更新时
        //click:  单击地图时
        //dblclick: 双击地图时
        //mousemove: 鼠标移动时
        //resize: 视图容器尺寸调整时
        super(["extent", "click", "dblclick", "mousemove", "resize"]);
        this._container = id instanceof HTMLDivElement ? id : document.getElementById(id) as HTMLDivElement;
        //create canvas
        this._canvas = document.createElement("canvas");
        this._canvas.style.cssText = "position: absolute; height: 100%; width: 100%; z-index: 100";
        this._canvas.width = this._container.clientWidth ;
        this._canvas.height = this._container.clientHeight;
        this._container.appendChild(this._canvas);
        this._ctx = this._canvas.getContext("2d");

        //bind this，请参考js中this相关知识
        this._onClick = this._onClick.bind(this);
        this._onDoubleClick = this._onDoubleClick.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onWheel = this._onWheel.bind(this);

        //添加canvas listener
        this._canvas.addEventListener("click", this._onClick);
        this._canvas.addEventListener("dblclick", this._onDoubleClick);
        this._canvas.addEventListener("mousedown", this._onMouseDown);
        this._canvas.addEventListener("mousemove", this._onMouseMove);
        this._canvas.addEventListener("mouseup", this._onMouseUp);
        this._canvas.addEventListener("wheel", this._onWheel);

        //animator
        this._animator = new Animator(this);
        //tile
        this._tile = new Tile(this);

        //初始化
        this._projection = new WebMercator();
        this.setView([0,0], 10);

        //响应窗体resize
        //非常重要，resize后响应，完成重绘
        this._onResize = this._onResize.bind(this);
        window.addEventListener("resize", this._onResize);
    }

    /**
     * 设置坐标投影变换
     * @param {Projection} projection - 坐标投影变换
     */
    setProjection(projection) {
        this._projection = projection;
        //const bound: Bound = this._projection.bound;
        //this._ctx.setTransform(256 * Math.pow(2, this._zoom) / (bound.xmax - bound.xmin) * bound.xscale , 0, 0, 256 * Math.pow(2, this._zoom) / (bound.ymax - bound.ymin) * bound.yscale, this._canvas.width / 2, this._canvas.height / 2);
        //center为经纬度，转化为平面坐标
        const origin = this._projection.project(this._center as any);
        const bound: Bound = this._projection.bound;
        //已知：地理坐标origin，转换后屏幕坐标 即canvas的中心 [this._canvas.width / 2, this._canvas.height / 2]
        //求：平面坐标转换矩阵=Map初始矩阵:  地理坐标——屏幕坐标
        //解法如下：
        const a = 256 * Math.pow(2, this._zoom) / (bound.xmax - bound.xmin) * bound.xscale;
        const d = 256 * Math.pow(2, this._zoom) / (bound.ymax - bound.ymin) * bound.yscale;
        const e = this._canvas.width / 2 - a * origin[0];
        const f = this._canvas.height / 2 - d * origin[1];
        this._ctx.setTransform(a , 0, 0, d, e, f);
    }

    /**
     * 设置视图级别及视图中心
     * @param {number[]} center - 视图中心
     * @param {number} zoom - 视图级别
     */
    setView(center: number[] = [0,0], zoom: number = 3) {
        this._center = center;
        this._zoom = Math.max(3, Math.min(20, zoom));
        //center为经纬度，转化为平面坐标
        const origin = this._projection.project(center as any);
        const bound: Bound = this._projection.bound;
        //已知：地理坐标origin，转换后屏幕坐标 即canvas的中心 [this._canvas.width / 2, this._canvas.height / 2]
        //求：平面坐标转换矩阵=Map初始矩阵:  地理坐标——屏幕坐标
        //解法如下：
        const a = 256 * Math.pow(2, this._zoom) / (bound.xmax - bound.xmin) * bound.xscale;
        const d = 256 * Math.pow(2, this._zoom) / (bound.ymax - bound.ymin) * bound.yscale;
        const e = this._canvas.width / 2 - a * origin[0];
        const f = this._canvas.height / 2 - d * origin[1];
        this._ctx.setTransform(a , 0, 0, d, e, f);
        this.redraw();
    }

    /**
     * 添加图层
     * @param {Layer} layer - 图层
     */
    addLayer(layer: Layer) {
        this._layers.push(layer);
        layer.draw(this._ctx, this._projection, this._extent);
    }

    /**
     * 插入图层
     * @param {Layer} layer - 图层
     * @param {number} index - 图层顺序
     */
    insertLayer(layer: Layer, index: number = -1){
        index = index > this._layers.length ? -1 : index;
        if (index == -1) {
            this.addLayer(layer);
        } else {
            this._layers.splice(index, 0, layer);
            this.redraw();
        }
    }

    /**
     * 移除图层
     * @param {Layer} layer - 图层
     */
    removeLayer(layer: Layer) {
        const index = this._layers.findIndex(item => item === layer);
        index != -1 && this._layers.splice(index, 1);
        this.redraw();
    }

    /**
     * 清空图层
     */
    clearLayers() {
        this._layers = [];
        this.redraw();
    }

    /**
     * 添加图形
     * 参考_defaultGraphicLayer定义处的说明
     * shortcut
     * @param {Graphic} graphic - 图形
     */
    addGraphic(graphic: Graphic) {
        this._defaultGraphicLayer.add(graphic);
        graphic.draw(this._ctx, this._projection, this._extent);
    }

    /**
     * 添加动画
     * @param {Animation} animation - 动画
     */
    addAnimation(animation) {
        this._animator.addAnimation(animation);
    }
    /**
     * 删除动画
     * @param {Animation} animation - 动画
     */
    removeAnimation(animation) {
        this._animator.removeAnimation(animation);
    }
    /**
     * 清除动画
     */
    clearAnimations() {
        this._animator.clearAnimations();
    }

    /**
     * 设置切片url
     */
    setTileUrl(url) {
        this._tile.url = url;
    }

    /**
     * 更新地图视图范围以及中心点
     */
    updateExtent() {
        const matrix = (this._ctx as any).getTransform();
        const x1 = (0 - matrix.e)/matrix.a, y1 = (0-matrix.f)/matrix.d, x2 = (this._canvas.width - matrix.e)/matrix.a, y2 = (this._canvas.height-matrix.f)/matrix.d;
        this._extent = new Bound(Math.min(x1,x2), Math.min(y1,y2), Math.max(x1,x2), Math.max(y1,y2));
        this._center = this._projection.unproject([(x1+x2)/2, (y1+y2)/2]);
        //this._events.extent.forEach(handler => handler({extent: this._extent, center: this._center, zoom: this._zoom, matrix: matrix}));
        this.emit("extent", {extent: this._extent, center: this._center, zoom: this._zoom, matrix: matrix});
    }

    /**
     * 重绘
     */
    redraw() {
        this._ctx.save();
        this._ctx.setTransform(1,0,0,1,0,0);
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.restore();
        this.updateExtent();
        //this._geometries.forEach(geometry => geometry.draw(this._ctx));
        this._defaultGraphicLayer.draw(this._ctx, this._projection, this._extent, this._zoom);
        //重绘要素
        this._layers.forEach(layer => {
            layer.draw(this._ctx, this._projection, this._extent, this._zoom);
        });
        //重绘标注
        //分开的原因，一般标注在上！
        this._layers.filter(layer => layer instanceof FeatureLayer && layer.labeled).forEach((layer: FeatureLayer) => {
            layer.drawLabel(this._ctx, this._projection, this._extent, this._zoom);
        });
    }

    /**
     * 清空视图
     */
    clear() {
        this._ctx.setTransform(1, 0, 0, 1, 0, 0);
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    //响应窗体resize
    _onResize(event) {
        this._canvas.width = this._container.clientWidth ;
        this._canvas.height = this._container.clientHeight;
        this.emit("resize", event);
        this.setView(this._center, this._zoom);
    }

    //响应canvas被点击
    _onClick(event) {
        //this._handlers["click"].forEach(handler => handler(event));
        //探测是否有图层要素被点击
        this._layers.filter(layer => layer.interactive).some(layer => layer.contain(event.offsetX, event.offsetY, this.projection, this._extent, this._zoom, "click"));
        //地图点击响应
        this.emit("click", event);
    }

    //响应canvas被双击
    //默认交互，双击放大一倍
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
        this.emit("dblclick", event);
    }

    //响应canvas mousedown
    //漫游起始
    _onMouseDown(event) {
        //设置为漫游状态
        this._drag.flag = true;
        this._drag.start.x = event.x;
        this._drag.start.y = event.y;
    }

    _onMouseMove(event) {
        //在非漫游状态下，触发mousemove事件
        if (!this._drag.flag) {
            //探测鼠标是否悬停到某图层要素
            this._layers.filter(layer => layer.interactive).filter(layer => layer.contain(event.offsetX, event.offsetY, this.projection, this._extent, this._zoom, "mousemove"));
            //地图鼠标移动响应
            this.emit("mousemove", event);
        }
    }

    //响应canvas mouseup
    //漫游结束
    _onMouseUp(event) {
         //在漫游状态下
        if (this._drag.flag) {
            //记录漫游结束坐标，并进行平移
            this._drag.end.x = event.x;
            this._drag.end.y = event.y;
            const matrix = (this._ctx as any).getTransform();
            this._ctx.translate((this._drag.end.x - this._drag.start.x)/matrix.a, (this._drag.end.y - this._drag.start.y)/matrix.d);
            this.redraw();
        }
        this._drag.flag = false;
    }

    //响应滚轮缩放
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
        //交互表现为 鼠标当前位置 屏幕坐标不变 进行缩放 即x2 = x1，y2=y1
        //其它设定：变换前矩阵(a1,0,0,d1,e1,f1)   变换矩阵(a,0,0,d,e,f)  变换后矩阵(a2,0,0,d2,e2,f2) 
        //scale已通过滚轮变化，换算得到，且a=d=scale，求e和f
        //1.将原屏幕坐标 x1 转成 地理坐标 x0 = (x1 - e1) / a1 
        //2.地理坐标x0 转成 现屏幕坐标x2  a2 * x0 + e2 = x2 e2 = x2 - a2 * x0 代入1式 e2 = x2 - a2 * (x1 - e1) / a1
        //3.已知scale = a2 / a1 故 e2 = x2 - scale * (x1 - e1)
        //4.另矩阵变换 a1 * e + e1 = e2
        //5.联立3和4 求得 e = (x2 - scale * (x1 - e1) - e1) / a1
        const matrix = (this._ctx as any).getTransform();
        const a1 = matrix.a, e1 = matrix.e, x1 = event.x, x2 = x1; //放大到中心点 x2 = this._canvas.width / 2
        const e = (x2 - scale * (x1 - e1) - e1) / a1;
        const d1 = matrix.d, f1 = matrix.f, y1 = event.y, y2 = y1; //放大到中心点 y2 = this._canvas.height / 2
        const f = (y2 - scale * (y1 - f1) - f1) / d1;
        this._ctx.transform( scale, 0, 0, scale, e, f );

        this.redraw();
    }

    /**
     * 销毁
     */
    destroy() {
        window.removeEventListener("resize", this._onResize);
        
        this._canvas.removeEventListener("click", this._onClick);
        this._canvas.removeEventListener("dblclick", this._onDoubleClick);
        this._canvas.removeEventListener("mousedown", this._onMouseDown);
        this._canvas.removeEventListener("mousemove", this._onMouseMove);
        this._canvas.removeEventListener("mouseup", this._onMouseUp);
        this._canvas.removeEventListener("wheel", this._onWheel);
    }
}