import { Projection } from "../projection/projection";
import { Feature } from "../element/feature";
import { SimpleTextSymbol } from "../symbol/symbol";
import { Field } from "../data/field";
/**
 * 冲突检测基类
 */
export declare class Collision {
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection?: Projection): Feature[];
}
/**
 * 无检测机制
 */
export declare class NullCollision {
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection?: Projection): Feature[];
}
/**
 * 简单碰撞冲突
 * @remarks
 * 类似聚合，距离判断，速度快
 */
export declare class SimpleCollision {
    /**
     * 检测距离
     * @remarks
     * 单位 pixel
     */
    distance: number;
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection?: Projection): Feature[];
}
/**
 * 叠盖碰撞冲突
 * @remarks
 * 试算标注宽高，并和已通过检测的标注，进行边界的交叉判断，速度慢
 */
export declare class CoverCollision {
    /**
     * 已通过检测的标注的边界集合
     */
    private _bounds;
    /**
     * 判断边界碰撞时的buffer
     * @remarks
     * buffer越小，标注越密，单位：pixel
     */
    buffer: number;
    /**
     * 冲突检测
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {Field} field - 标注字段
     * @param {SimpleTextSymbol} symbol - 标注文本符号
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {Feature[]} 返回可绘制标注的要素集合
     */
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection?: Projection): Feature[];
}
