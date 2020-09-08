import { CoordinateType } from "../geometry/geometry";
import { WebMercator } from "../projection/web-mercator";
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
    test(features, field, symbol, ctx, projection = new WebMercator()) { return []; }
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
    test(features, field, symbol, ctx, projection = new WebMercator()) {
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
    constructor() {
        /**
         * 检测距离
         * @remarks
         * 单位 pixel
         */
        this.distance = 50;
    }
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features, field, symbol, ctx, projection = new WebMercator()) {
        //根据距离聚合
        return features.reduce((acc, cur) => {
            const item = acc.find((item) => {
                const distance = cur.geometry.distance(item.geometry, CoordinateType.Screen, ctx, projection);
                return distance <= this.distance;
            });
            if (!item)
                acc.push(cur);
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
    constructor() {
        /**
         * 已通过检测的标注的边界集合
         */
        this._bounds = [];
        /**
         * 判断边界碰撞时的buffer
         * @remarks
         * buffer越小，标注越密，单位：pixel
         */
        this.buffer = 10;
    }
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features, field, symbol, ctx, projection = new WebMercator()) {
        if (!field || !symbol)
            return [];
        this._bounds = [];
        //根据标注宽高的量算，得到标注的size，并和已通过检测的标注，进行边界的交叉判断，来决定是否可绘制该要素的标注
        return features.reduce((acc, cur) => {
            const bound = cur.geometry.measure(cur.properties[field.name], ctx, projection, symbol);
            if (bound) {
                bound.buffer(this.buffer);
                const item = this._bounds.find(item => item.intersect(bound));
                if (!item) {
                    acc.push(cur);
                    this._bounds.push(bound);
                }
            }
            return acc;
        }, []); // [feature]
    }
}
