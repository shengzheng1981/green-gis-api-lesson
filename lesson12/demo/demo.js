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
    Tile
} from "../dist";

window.load = async () => {
    const map = new Map("foo");
    //map.setTileUrl("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png");
    map.setTileUrl("http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7");
    map.setView([116.397411,39.909186], 12);
    const marker = new SimpleMarkerSymbol();
    marker.width = 32;
    marker.height = 32;
    marker.offsetX = -16;
    marker.offsetY = -32;
    marker.url = "assets/img/marker.svg";
    await marker.load();
    const point = new Point(116.397411,39.909186);
    const graphic = new Graphic(point, marker);
    map.addGraphic(graphic);

}

//cause typescript tsc forget js suffix for geometry.js