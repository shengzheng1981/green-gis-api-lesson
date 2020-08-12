import {Map, Point, Polyline, Polygon} from "../dist"; //此引用方式归功于index.ts,如没有需单独引用到文件

window.load = () => {
    const map = new Map("foo");
    const point = new Point(100, 100);
    map.addGeometry(point);

    const polyline = new Polyline([[150, 100], [250, 200]]);
    map.addGeometry(polyline);

    const polygon = new Polygon([[[150, 300], [250, 400], [180, 450]]]);
    map.addGeometry(polygon);
}