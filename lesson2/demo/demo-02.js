import {Map, Point, Polyline, Polygon} from "../dist";

window.load = () => {
    const amap = new AMap.Map("amap", {
        fadeOnZoom: false,
        navigationMode: 'classic',
        optimizePanAnimation: false,
        animateEnable: false,
        dragEnable: false,
        zoomEnable: false,
        resizeEnable: true,
        doubleClickZoom: false,
        keyboardEnable: false,
        scrollWheel: false,
        expandZoomRange: true,
        zooms: [1, 20],
        mapStyle: 'normal',
        features: ['road', 'point', 'bg'],
        viewMode: '2D'
    });

    const map = new Map("foo");
    map.on("extent", (event) => {
        amap.setZoomAndCenter(event.zoom, event.center);
    });

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

    const point = new Point(116.397411,39.909186);
    point.addTo(map);

    map.setView([0, 0], 5);
}

//cause typescript tsc forget js suffix for geometry.js