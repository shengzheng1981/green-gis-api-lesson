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
    Graphic, SimpleMarkerSymbol, Feature, LatLngType, GCJ02, SimplePointSymbol
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

    const req = new XMLHttpRequest();
    req.onload = (event) => {
        const featureClass = new FeatureClass();
        featureClass.loadGeoJSON(JSON.parse(req.responseText));
        const featureLayer = new FeatureLayer();
        featureLayer.featureClass = featureClass;
        const field = new Field();
        field.name = "name";
        field.type = FieldType.String;
        const renderer = new CategoryRenderer();
        renderer.generate(featureClass, field);
        featureLayer.renderer = renderer;
        featureLayer.zoom = [5, 20];
        featureLayer.on("click", (event) => {
            alert(event.feature.properties["name"]);
        });

        let highlight = new SimpleFillSymbol();
        highlight.fillStyle = "#00ffff";
        let old;

        featureLayer.on("mouseover", (event) => {
            old = event.feature.symbol;
            event.feature.symbol = highlight;
            map.redraw();
        });
        featureLayer.on("mouseout", (event) => {
            event.feature.symbol = old;
            map.redraw();
        });
        map.addLayer(featureLayer);

        map.setView([107.411, 29.89], 7);
    };
    req.open("GET", "assets/geojson/chongqing.json", true);
    req.send(null);

}

//cause typescript tsc forget js suffix for geometry.js