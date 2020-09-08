import { Projection } from "./projection/projection";
import { Layer } from "./layer/layer";
import { Graphic } from "./element/graphic";
import { Subject } from "./util/subject";
/**
* 地图
*/
export declare class Map extends Subject {
    private _container;
    private _canvas;
    private _ctx;
    private _defaultGraphicLayer;
    private _layers;
    private _zoom;
    private _center;
    private _extent;
    private _projection;
    private _drag;
    /**
     * 坐标投影变换
     * @type {Projection}
     * @readonly
     */
    get projection(): Projection;
    /**
     * 创建地图
     * @param {string | HTMLDivElement} id - HTMLDivElement | id
     */
    constructor(id: string | HTMLDivElement);
    /**
     * 设置坐标投影变换
     * @param {Projection} projection - 坐标投影变换
     */
    setProjection(projection: any): void;
    /**
     * 设置视图级别及视图中心
     * @param {number[]} center - 视图中心
     * @param {number} zoom - 视图级别
     */
    setView(center?: number[], zoom?: number): void;
    /**
     * 添加图层
     * @param {Layer} layer - 图层
     */
    addLayer(layer: Layer): void;
    /**
     * 插入图层
     * @param {Layer} layer - 图层
     * @param {number} index - 图层顺序
     */
    insertLayer(layer: Layer, index?: number): void;
    /**
     * 移除图层
     * @param {Layer} layer - 图层
     */
    removeLayer(layer: Layer): void;
    /**
     * 清空图层
     */
    clearLayers(): void;
    /**
     * 添加图形
     * 参考_defaultGraphicLayer定义处的说明
     * shortcut
     * @param {Graphic} graphic - 图形
     */
    addGraphic(graphic: Graphic): void;
    /**
     * 更新地图视图范围以及中心点
     */
    updateExtent(): void;
    /**
     * 重绘
     */
    redraw(): void;
    /**
     * 清空视图
     */
    clear(): void;
    _onResize(event: any): void;
    _onClick(event: any): void;
    _onDoubleClick(event: any): void;
    _onMouseDown(event: any): void;
    _onMouseMove(event: any): void;
    _onMouseUp(event: any): void;
    _onWheel(event: any): void;
    /**
     * 销毁
     */
    destroy(): void;
}
