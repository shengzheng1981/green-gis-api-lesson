import {CoordinateType} from "../geometry/geometry";
import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {Feature} from "../element/feature";
import {SimpleTextSymbol} from "../symbol/symbol";
import {Field} from "../data/field";
import {Bound} from "../util/bound";

/**
 * 冲突检测基类
 */
export class Collision {
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator()): Feature[] { return []; }
}

/**
 * 无检测机制
 */
export class NullCollision {
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator()): Feature[] {
        //没有任何检测逻辑，直接原样返回
        return features;
    }
}


/**
 * 简单碰撞冲突
 * @remarks 
 * 类似聚合，距离判断，速度快
 */
export class SimpleCollision {
    /**
     * 检测距离
     * @remarks 
     * 单位 pixel
     */
    public distance: number = 50; 
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator()): Feature[] {
        //根据距离聚合
        return features.reduce( (acc, cur) => {
            const item: any = acc.find((item: any) => {
                const distance = cur.geometry.distance(item.geometry, CoordinateType.Screen, ctx, projection);
                return distance <= this.distance;
            });
            if (!item) acc.push(cur);
            return acc;
        }, []); // [feature]
    }
}


/**
 * 叠盖碰撞冲突
 * @remarks 
 * 试算标注宽高，并和已通过检测的标注，进行边界的交叉判断，速度慢
 */
export class CoverCollision {
    /**
     * 已通过检测的标注的边界集合
     */
    private _bounds: Bound[] = [];
    /**
     * 判断边界碰撞时的buffer
     * @remarks 
     * buffer越小，标注越密，单位：pixel
     */
    public buffer: number = 10; 
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator()): Feature[] {
        if (!field || !symbol) return [];
        this._bounds = [];
        //根据标注宽高的量算，得到标注的size，并和已通过检测的标注，进行边界的交叉判断，来决定是否可绘制该要素的标注
        return features.reduce( (acc, cur) => {
            const bound = cur.geometry.measure(cur.properties[field.name], ctx, projection, symbol);
            if (bound) {
                bound.buffer(this.buffer);
                const item = this._bounds.find( item => item.intersect(bound) );
                if (!item) {
                    acc.push(cur);
                    this._bounds.push(bound);
                }
            }
            return acc;
        }, []); // [feature]
    }
}