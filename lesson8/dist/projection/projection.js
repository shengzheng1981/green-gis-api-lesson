export var LatLngType;
(function (LatLngType) {
    LatLngType[LatLngType["GPS"] = 1] = "GPS";
    LatLngType[LatLngType["GCJ02"] = 2] = "GCJ02";
    LatLngType[LatLngType["BD09"] = 3] = "BD09"; //Just For China, BaiduMap
})(LatLngType || (LatLngType = {}));
//TODO: only support web mecator
export class Projection {
    //经纬度转平面坐标
    project([lng, lat]) { return []; }
    ;
    //平面坐标转经纬度
    unproject([x, y]) { return []; }
    ;
    //投影后的平面坐标范围
    get bound() { return null; }
    ;
}
