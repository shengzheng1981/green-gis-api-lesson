import { Bound } from "../util/bound";
import { Projection } from "./projection";
//球体墨卡托
export class WebMercator extends Projection {
    //投影后的平面坐标范围
    get bound() {
        return new Bound(-Math.PI * WebMercator.R, Math.PI * WebMercator.R, Math.PI * WebMercator.R, -Math.PI * WebMercator.R);
    }
    //经纬度转平面坐标
    project([lng, lat]) {
        //from leaflet & wiki
        const d = Math.PI / 180, sin = Math.sin(lat * d);
        return [WebMercator.R * lng * d, WebMercator.R * Math.log((1 + sin) / (1 - sin)) / 2];
    }
    //平面坐标转经纬度
    unproject([x, y]) {
        const d = 180 / Math.PI;
        return [x * d / WebMercator.R, (2 * Math.atan(Math.exp(y / WebMercator.R)) - (Math.PI / 2)) * d];
    }
}
WebMercator.R = 6378137;
