import {
    Map,
    Point,
    Polyline,
    SimpleFillSymbol,
    FeatureClass,
    FeatureLayer,
    SimpleRenderer,
    CategoryRenderer,
    CategoryRendererItem,
    Field,
    FieldType,
    Label, NullCollision, SimpleCollision, CoverCollision, SimpleTextSymbol,
    Graphic, SimpleMarkerSymbol, Feature, LatLngType, GCJ02, SimplePointSymbol,
    PointAnimation, ParticleAnimation, LineAnimation
} from "../dist";

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

    map.setView([116.397411,39.909186], 4);

    const point = new Point(116.397411,39.909186);
    const animation = new ParticleAnimation(point);
    animation.radius = 40;
    animation.speed = 4;
    animation.alpha = 0.8;
    map.addAnimation(animation);

    const point2 = new Point(109.519, 18.271);
    const animation5 = new PointAnimation(point2);
    map.addAnimation(animation5);

    const point3 = new Point(119.519, 18.271);
    const animation6 = new PointAnimation(point3);
    animation6.color = "#00ffff";
    map.addAnimation(animation6);

    const point4 = new Point(119.519, 48.271);
    const animation7 = new ParticleAnimation(point4);
    animation7.radius = 20;
    animation7.speed = 4;
    animation7.alpha = 0.8;
    animation7.color = "#2d2d77";
    map.addAnimation(animation7);

    const point5 = new Point(109.519, 48.271);
    const animation8 = new ParticleAnimation(point5);
    animation8.radius = 20;
    animation8.speed = 8;
    animation8.alpha = 0.8;
    animation8.color = "#ff00ff";
    map.addAnimation(animation8);

    const polyline1 = new Polyline([[116.397411,39.909186],[109.519, 18.271]]);
    const polyline2 = new Polyline([[116.397411,39.909186],[119.519, 18.271]]);
    const polyline3 = new Polyline([[116.397411,39.909186],[119.519, 48.271]]);
    const polyline4 = new Polyline([[116.397411,39.909186],[109.519, 48.271]]);
    const animation1 = new LineAnimation(polyline1);
    const animation2 = new LineAnimation(polyline2);
    const animation3 = new LineAnimation(polyline3);
    const animation4 = new LineAnimation(polyline4);
    map.addAnimation(animation1);
    map.addAnimation(animation2);
    map.addAnimation(animation3);
    map.addAnimation(animation4);

}

//cause typescript tsc forget js suffix for geometry.js