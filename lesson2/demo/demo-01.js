import {Map, Point, Polyline, Polygon} from "../dist"; //此引用方式归功于index.ts,如没有需单独引用到文件

window.load = () => {
    const map = new Map("foo");

    //画经线
    for (let i = -180; i <= 180; i = i + 10){
        const line = new Polyline([[i, -80], [i, 80]]);
        line.addTo(map);
    }
    //画纬线
    for (let j = -80; j <= 80; j = j + 10){
        const line = new Polyline([[-180, j], [180, j]]);
        line.addTo(map);
    }
    //画经纬线交点
    for (let i = -180; i <= 180; i = i + 10){
        for (let j = -90; j <= 90; j = j + 10){
            const point = new Point(i, j);
            point.addTo(map);
        }
    }

    map.setView([0, 0], 5);
}