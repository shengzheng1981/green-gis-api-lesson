import {Bound} from "../util/bound";

export enum LatLngType {
    GPS = 1,           //Default
    GCJ02 = 2,         //Just For China, AMap aka GaoDe
    BD09 = 3           //Just For China, BaiduMap
}

//TODO: only support web mecator
export class Projection {
    //经纬度转平面坐标
    project([lng, lat]): number[] { return [] };
    //平面坐标转经纬度
    unproject([x, y]): number[] { return []};
    //投影后的平面坐标范围
    get bound(): Bound { return null };
}




