import { Symbol } from "../symbol/symbol";
import { Field } from "../data/field";
import { FeatureClass } from "../data/feature-class";
/**
* 分类渲染项
*/
export declare class CategoryRendererItem {
    /**
     * 分类值
     */
    value: any;
    /**
     * 渲染符号
     */
    symbol: Symbol;
    /**
     * 分类标题（常用于图例中）
     */
    label: string;
    /**
     * 该类总数
     */
    count: number;
}
/**
* 分类渲染
* @remarks
* 一般可通过设置分类字段，再调用generate自动生成分类渲染项
* 也可通过手动添加和定义分类渲染项，完成分类渲染设置，通过items.push()
*/
export declare class CategoryRenderer {
    /**
     * 分类字段
     * @remarks
     * 一般为字符串字段，也可为枚举域值，或是非布尔值
     */
    _field: Field;
    /**
     * 所有分类集合
     */
    _items: CategoryRendererItem[];
    /**
     * 分类字段
     * @remarks
     * 一般为字符串字段，也可为枚举域值，或是非布尔值
     */
    get field(): Field;
    /**
     * 所有分类集合
     */
    get items(): CategoryRendererItem[];
    /**
     * 根据分类字段，自动生成分类渲染项
     * @param {FeatureClass} featureClass - 要素类（要素集合）
     * @param {Field} field - 分类字段
     */
    generate(featureClass: FeatureClass, field: Field): void;
}
