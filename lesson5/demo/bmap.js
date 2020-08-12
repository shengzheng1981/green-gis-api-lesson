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
    Graphic, SimpleMarkerSymbol, Feature, LatLngType, GCJ02, BD09
} from "../dist";

window.load = () => {
    const bmap = new BMap.Map(document.getElementById('bmap'), {
        enableMapClick: false
    });

    const map = new Map("foo");
    map.on("extent", (event) => {
        bmap.centerAndZoom(new BMap.Point(event.center[0], event.center[1]), event.zoom);
    });

    map.setProjection(new BD09(LatLngType.GCJ02));

    map.setView([116.397411,39.909186], 12);
    
    const marker = new SimpleMarkerSymbol();
    marker.width = 32;
    marker.height = 32;
    marker.offsetX = 16;
    marker.offsetY = 32;
    marker.url = "assets/img/marker.svg";
    //await marker.load();
    const point = new Point(116.397411,39.909186);
    const graphic = new Graphic(point, marker);
    map.addGraphic(graphic);

   
}

//cause typescript tsc forget js suffix for geometry.js