import { Field } from "../data/field";
import { SimpleTextSymbol } from "../symbol/symbol";
import { Collision } from "./collision";
import { Projection } from "../projection/projection";
import { Feature } from "../element/feature";
/**
 * 图层标注设置
 */
export declare class Label {
    /**
     * 标注字段
     */
    field: Field;
    /**
     * 标注符号
     * @remarks
     * 参考Renderer和Feature中的相关重要说明
     */
    symbol: SimpleTextSymbol;
    /**
     * 标注冲突解决方式
     */
    collision: Collision;
    /**
     * 绘制图层标注
     * @param {Feature[]} features - 准备绘制标注的要素集合
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     */
    draw(features: Feature[], ctx: CanvasRenderingContext2D, projection?: Projection): void;
}
