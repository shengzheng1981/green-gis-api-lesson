import { Layer } from "./layer";
import { WebMercator } from "../projection/web-mercator";
import { SimpleRenderer } from "../renderer/simple-renderer";
import { CategoryRenderer } from "../renderer/category-renderer";
import { ClassRenderer } from "../renderer/class-renderer";
import { GeometryType, CoordinateType } from "../geometry/geometry";
import { Point } from "../geometry/point";
import { ClusterSymbol } from "../symbol/symbol";
/**
 * 矢量要素图层
 */
export class FeatureLayer extends Layer {
    constructor() {
        super(...arguments);
        /**
         * 图层可见缩放级别
         */
        this._zoom = [3, 20];
        /**
         * 是否显示标注
         */
        this.labeled = false;
        /**
         * 是否聚合
         */
        this.cluster = false;
    }
    /**
     * 矢量要素类（数据源）
     */
    get featureClass() {
        return this._featureClass;
    }
    /**
     * 矢量要素类（数据源）
     */
    set featureClass(value) {
        this._featureClass = value;
    }
    /**
     * 图层标注设置
     */
    set label(value) {
        this._label = value;
    }
    /**
     * 图层渲染方式设置
     */
    set renderer(value) {
        this._renderer = value;
    }
    /**
    * 重写事件注册监听
    * @remarks
    * 对图层的监听，重写为遍历对该图层下所有要素的监听
    * 该写法只是一种简写，无他。
    * @param {string} event - 事件名称
    * @param {Function} handler - 回调函数
    */
    on(event, handler) {
        this._featureClass.features.forEach((feature) => {
            feature.on(event, handler);
        });
    }
    /**
     * 重写事件取消监听
     * @param {string} event - 事件名称
     * @param {Function} handler - 回调函数
     */
    off(event, handler) {
        this._featureClass.features.forEach((feature) => {
            feature.off(event, handler);
        });
    }
    /**
     * 重写事件激发
     * @param {string} event - 事件名称
     * @param {Object} param - 事件参数
     */
    emit(event, param) {
        this._featureClass.features.forEach((feature) => {
            feature.emit(event, param);
        });
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
        if (this.visible && this._zoom[0] <= zoom && this._zoom[1] >= zoom) {
            //过滤可见视图范围内的要素
            const features = this._featureClass.features.filter((feature) => feature.intersect(projection, extent));
            //获取当前渲染方式下，某一要素对应的渲染符号
            const _getSymbol = (feature) => {
                if (this._renderer instanceof SimpleRenderer) {
                    return this._renderer.symbol;
                }
                else if (this._renderer instanceof CategoryRenderer) {
                    const renderer = this._renderer;
                    const item = renderer.items.find(item => item.value == feature.properties[renderer.field.name]);
                    return item.symbol;
                }
                else if (this._renderer instanceof ClassRenderer) {
                    const renderer = this._renderer;
                    const item = renderer.items.find(item => item.low <= feature.properties[renderer.field.name] && item.high >= feature.properties[renderer.field.name]);
                    return item.symbol;
                }
            };
            //如果是点图层，同时又设置为聚合显示时
            if (this._featureClass.type == GeometryType.Point && this.cluster) {
                //简单距离聚合
                const cluster = features.reduce((acc, cur) => {
                    if (cur.geometry instanceof Point) {
                        const point = cur.geometry;
                        const item = acc.find((item) => {
                            const distance = point.distance(item.feature.geometry, CoordinateType.Screen, ctx, projection);
                            return distance <= 50;
                        });
                        if (item) {
                            item.count += 1;
                        }
                        else {
                            acc.push({ feature: cur, count: 1 });
                        }
                        return acc;
                    }
                }, []); // [{feature, count}]
                cluster.forEach((item) => {
                    if (item.count == 1) {
                        item.feature.draw(ctx, projection, extent, _getSymbol(item.feature));
                    }
                    else {
                        item.feature.draw(ctx, projection, extent, new ClusterSymbol(item.count));
                    }
                });
            }
            else {
                //不是聚合时，正常绘制图层下各要素
                features.forEach((feature) => {
                    feature.draw(ctx, projection, extent, _getSymbol(feature));
                });
            }
        }
    }
    /**
     * 绘制标注
     * @remarks
     * 本应起名为label，但与属性中setter重名，故起名为drawLabel，无奈。。。
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    drawLabel(ctx, projection = new WebMercator(), extent = projection.bound, zoom = 10) {
        if (this.visible && !this.cluster && this._zoom[0] <= zoom && this._zoom[1] >= zoom) {
            const features = this._featureClass.features.filter((feature) => feature.intersect(projection, extent));
            this._label.draw(features, ctx, projection);
        }
    }
    /**
     * 图层交互
     * @remarks 当前鼠标是否落入该图层某要素
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     * @param {string} event - 当前事件名称
     * @return {boolean} 是否落入
     */
    contain(screenX, screenY, projection = new WebMercator(), extent = projection.bound, zoom = 10, event = undefined) {
        if (this.visible && this._zoom[0] <= zoom && this._zoom[1] >= zoom) {
            //if call Array.some, maybe abort mouseout last feature which mouseover!!! but filter maybe cause slow!!!no choice
            //return this._featureClass.features.filter((feature: Feature) => feature.intersect(projection, extent)).some( (feature: Feature) => {
            //遍历与当前视图与相交的要素，判断坐标是否落入相应要素
            const features = this._featureClass.features.filter((feature) => feature.intersect(projection, extent)).filter((feature) => {
                return feature.contain(screenX, screenY, event);
            });
            if (features.length > 0) {
                //如为dblclick、click，则触发该图形的对应事件
                //多个时，默认只触发第一个，该行为可被重写。
                if (event == "dblclick") {
                    features[0].emit("dblclick", { feature: features[0], screenX: screenX, screenY: screenY });
                }
                else if (event == "click") {
                    features[0].emit("click", { feature: features[0], screenX: screenX, screenY: screenY });
                }
                return true;
            }
            else {
                return false;
            }
        }
    }
}
