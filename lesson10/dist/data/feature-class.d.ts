import { Field } from "./field";
import { Feature } from "../element/feature";
import { GeometryType } from "../geometry/geometry";
/**
 * 要素类（要素集合）
 * @remarks
 * TODO: a lot of things to be done
 */
export declare class FeatureClass {
    /**
     * 要素集合名称
     */
    name: string;
    /**
     * 要素集合别名
     */
    alias: string;
    /**
     * 要素集合描述
     */
    description: string;
    /**
     * 空间数据类型：点/线/面
     */
    private _type;
    /**
     * 属性字段集合
     */
    private _fields;
    /**
     * 要素集合
     */
    private _features;
    /**
     * 空间数据类型：点/线/面
     */
    get type(): GeometryType;
    /**
     * 要素集合
     */
    get features(): Feature[];
    /**
     * 属性字段集合
     */
    get fields(): Field[];
    /**
     * 创建要素集合
     * @param {GeometryType} type - 空间数据类型：点/线/面
     */
    constructor(type: GeometryType);
    /**
     * 添加要素
     * @param {Feature} feature - 空间矢量要素
     */
    addFeature(feature: Feature): void;
    /**
     * 删除要素
     * @param {Feature} feature - 空间矢量要素
     */
    removeFeature(feature: Feature): void;
    /**
     * 清空要素集合
     */
    clearFeatures(): void;
    /**
     * 添加字段
     * @param {Field} field - 字段
     */
    addField(field: Field): void;
    /**
    * 删除字段
    * @param {Field} field - 字段
    */
    removeField(field: Field): void;
    /**
    * 清空字段集合
    */
    clearFields(): void;
    /**
     * 加载GeoJSON数据格式
     * @remarks
     * TODO: multiple point line polygon is not supported
     * @param {Object} data - GeoJSON数据
     */
    loadGeoJSON(data: any): void;
}
