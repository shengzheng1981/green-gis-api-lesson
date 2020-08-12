import {Bound} from "../util/bound";
import {LatLngType, Projection} from "./projection";
import {GCJ02} from "./gcj02";

declare var BMap;
//just for china
export class BD09 extends Projection{
    //百度平面坐标系的坐标原点与百度瓦片坐标原点相同，以瓦片等级18级为基准，规定18级时百度平面坐标的一个单位等于屏幕上的一个像素
    static TOTAL_PIXELS = 256 * Math.pow(2, 18);
    private _type: LatLngType;
    constructor(type: LatLngType = LatLngType.GPS) {
        super();
        this._type = type;
    }
    //投影后的平面坐标范围
    get bound(): Bound {
        return new Bound(- BD09.TOTAL_PIXELS/2, BD09.TOTAL_PIXELS/2, BD09.TOTAL_PIXELS/2, -BD09.TOTAL_PIXELS/2);
    }
    //经纬度转平面坐标
    project([lng, lat]): number[] {
        //from leaflet & wiki
        if (this._type == LatLngType.GPS) {
            [lng, lat] = GCJ02.wgs84togcj02(lng, lat);
            [lng, lat] = BD09.gcj02tobd09(lng, lat);
        } else if (this._type == LatLngType.GCJ02) {
            [lng, lat] = BD09.gcj02tobd09(lng, lat);
        }
        const projection =  new BMap.MercatorProjection();
        const pixel = projection.lngLatToPoint(new BMap.Point(lng, lat));
        return [pixel.x, pixel.y];
        /*const d = Math.PI / 180, sin = Math.sin(lat * d);
        return [WebMercator.R * lng * d,  WebMercator.R * Math.log((1 + sin) / (1 - sin)) / 2];*/
    }
    //平面坐标转经纬度
    unproject([x, y]): number[] {
        const projection =  new BMap.MercatorProjection();
        const point = projection.pointToLngLat(new BMap.Pixel(x, y));
        return [point.lng, point.lat];
        /*const d = 180 / Math.PI;
        return  [x * d / WebMercator.R, (2 * Math.atan(Math.exp(y / WebMercator.R)) - (Math.PI / 2)) * d];*/
    }

    //from https://github.com/wandergis/coordtransform
    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02) 的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lng
     * @param bd_lat
     * @returns {*[]}
     */
    static bd09togcj02(bd_lng, bd_lat) {
        var x = bd_lng - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI * 3000.0 / 180.0);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI * 3000.0 / 180.0);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat]
    };

    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即 谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    static gcj02tobd09(lng, lat) {
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * Math.PI * 3000.0 / 180.0);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * Math.PI * 3000.0 / 180.0);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat]
    };


}