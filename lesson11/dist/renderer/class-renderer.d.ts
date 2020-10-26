import { Symbol } from "../symbol/symbol";
import { Field } from "../data/field";
import { FeatureClass } from "../data/feature-class";
/**
* 分级渲染项
* @remarks
* 分级区间一般为( ]: 即下开上闭
*/
export declare class ClassRendererItem {
    /**
     * 分级的级别下限
     */
    low: number;
    /**
     * 分级的级别上限
     */
    high: number;
    /**
     * 分级渲染符号
     */
    symbol: Symbol;
    /**
     * 分级标题（常用于图例中）
     */
    label: string;
}
/**
* 分级渲染
* @remarks
* 一般可通过设置分级字段，再调用generate自动生成分级渲染项
* 也可通过手动添加和定义分级渲染项，完成分级渲染设置，通过items.push()
*/
export declare class ClassRenderer {
    /**
     * 分级字段
     * @remarks
     * 必须为数值型
     */
    private _field;
    /**
     * 所有分级渲染项集合
     */
    private _items;
    /**
     * 分级字段
     * @remarks
     * 必须为数值型
     */
    get field(): Field;
    /**
     * 所有分级渲染项集合
     */
    get items(): ClassRendererItem[];
    /**
     * 自动生成分级渲染项
     * @remarks
     * TODO: 分级有多种方式，目前只实现均分
     */
    generate(featureClass: FeatureClass, field: Field, breaks: number): void;
}
