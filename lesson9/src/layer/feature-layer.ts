import {Layer} from "./layer";
import {Bound} from "../util/bound";
import {Feature} from "../element/feature";
import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {FeatureClass} from "../data/feature-class";
import {Renderer} from "../renderer/renderer";
import {SimpleRenderer} from "../renderer/simple-renderer";
import {CategoryRenderer} from "../renderer/category-renderer";
import {ClassRenderer} from "../renderer/class-renderer";
import {GeometryType, CoordinateType} from "../geometry/geometry";
import {Point} from "../geometry/point";
import {Label} from "../label/label";
import {ClusterSymbol} from "../symbol/symbol";

//矢量要素图层
export class FeatureLayer extends Layer{
    //矢量要素类（数据源）
    private _featureClass: FeatureClass;
    //图层渲染方式
    private _renderer: Renderer;
    //图层可见缩放级别
    private _zoom: number[] = [3, 20];
    //图层标注设置
    private _label: Label;

    //是否显示标注
    public labeled: boolean = false;
    //是否聚合
    public cluster: boolean = false;

    get featureClass(): FeatureClass {
        return this._featureClass;
    }
    set featureClass(value: FeatureClass) {
        this._featureClass = value;
    }

    set label(value: Label) {
        this._label = value;
    }

    set renderer(value: Renderer) {
        this._renderer = value;
    }

    //重写事件注册监听
    //****************重要说明***************
    //对图层的监听，重写为遍历对该图层下所有要素的监听
    //该写法只是一种简写，无他。
    on(event, handler) {
        this._featureClass.features.forEach( (feature: Feature) => {
            feature.on(event, handler);
        });
    }
    //重写事件取消监听
    off(event, handler) {
        this._featureClass.features.forEach( (feature: Feature) => {
            feature.off(event, handler);
        });
    }
    //重写事件激发
    emit(event, param) {
        this._featureClass.features.forEach( (feature: Feature) => {
            feature.emit(event, param);
        });
    }

    //绘制图层
    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10) {
        if (this.visible && this._zoom[0] <= zoom && this._zoom[1] >= zoom) {
            //过滤可见视图范围内的要素
            const features = this._featureClass.features.filter((feature: Feature) => feature.intersect(projection, extent));
            //如果是点图层，同时又设置为聚合显示时
            if (this._featureClass.type == GeometryType.Point && this.cluster) {
                //简单距离聚合
                const cluster = features.reduce( (acc, cur) => {
                    if (cur.geometry instanceof Point) {
                        const point: Point = cur.geometry;
                        const item: any = acc.find((item: any) => {
                            const distance = point.distance(item.feature.geometry, CoordinateType.Screen, ctx, projection);
                            return distance <= 50;
                        });
                        if (item) {
                            item.count += 1;
                        } else {
                            acc.push({feature: cur, count: 1});
                        }
                        return acc;
                    }
                }, []); // [{feature, count}]
                cluster.forEach( (item: any) => {
                    if (item.count == 1) {
                        item.feature.draw(ctx, projection, extent, this._getSymbol(item.feature));
                    } else {
                        item.feature.draw(ctx, projection, extent, new ClusterSymbol(item.count));
                    }
                });
            } else {
                //不是聚合时，正常绘制图层下各要素
                features.forEach( (feature: Feature) => {
                    feature.draw(ctx, projection, extent, this._getSymbol(feature));
                });
            }
        }
    }
    //绘制标注
    //本应起名为label，但与属性中setter重名，故起名为drawLabel，无奈。。。
    drawLabel(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10) {
        if (this.visible && !this.cluster && this._zoom[0] <= zoom && this._zoom[1] >= zoom) {
            const features = this._featureClass.features.filter((feature: Feature) => feature.intersect(projection, extent));
            this._label.draw(features, ctx, projection);
        }
    }

    //获取当前渲染方式下，某一要素对应的渲染符号
    //注意：此为私有函数，不应外调！可直接写入draw函数。。。
    _getSymbol(feature) {
        if (this._renderer instanceof SimpleRenderer) {
            return (this._renderer as SimpleRenderer).symbol;
        } else if (this._renderer instanceof CategoryRenderer) {
            const renderer: CategoryRenderer = this._renderer;
            const item = renderer.items.find( item => item.value == feature.properties[renderer.field.name]);
            return item.symbol;
        } else if (this._renderer instanceof ClassRenderer) {
            const renderer: ClassRenderer = this._renderer;
            const item = renderer.items.find( item => item.low <= feature.properties[renderer.field.name] && item.high >= feature.properties[renderer.field.name]);
            return item.symbol;
        }
    }

    //图层交互：当前鼠标是否落入该图层某图形要素
    contain(screenX: number, screenY: number, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10, event: string = undefined): boolean {
        if (this.visible && this._zoom[0] <= zoom && this._zoom[1] >= zoom) {
            //if call Array.some, maybe abort mouseout last feature which mouseover!!! but filter maybe cause slow!!!no choice
            //return this._featureClass.features.filter((feature: Feature) => feature.intersect(projection, extent)).some( (feature: Feature) => {
            //遍历与当前视图与相交的要素，判断坐标是否落入相应要素
            const features = this._featureClass.features.filter((feature: Feature) => feature.intersect(projection, extent)).filter( (feature: Feature) => {
                return feature.contain(screenX, screenY, event);
            });
            if (features.length > 0) {
                //如为dblclick、click，则触发该图形的对应事件
                //多个时，默认只触发第一个，该行为可被重写。
                if (event == "dblclick") {
                    features[0].emit("dblclick", {feature: features[0], screenX: screenX, screenY: screenY});
                } else if (event == "click") {
                    features[0].emit("click", {feature: features[0], screenX: screenX, screenY: screenY});
                }
                return true;
            } else {
                return false;
            }
        }
    }

}