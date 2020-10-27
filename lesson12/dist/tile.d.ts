import { Map } from "./map";
import { Subject } from "./util/subject";
/**
 * 动画效果的管理器
 * 已内置于map，可通过map的接口进行添加删除的维护操作
 */
export declare class Tile extends Subject {
    private _container;
    private _map;
    /**
     * 图层url
     */
    protected _url: string;
    /**
     * 图层url
     */
    get url(): string;
    /**
     * 图层url
     */
    set url(value: string);
    /**
     * 创建Animator
     * 不应自主创建，map内部创建
     * @param {Map} map - 地图容器
     */
    constructor(map: Map);
    _extentChange(event: any): void;
    /**
     * 重绘
     */
    redraw(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
