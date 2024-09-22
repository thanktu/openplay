import "./style.css";
import { _createCircle, _createMousePosition } from "./help";
import { Map, View } from "ol";
import { OSM, TileDebug, DataTile, TileWMS, Vector as VectorSource, Vector, Cluster } from "ol/source";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style, Circle as CircleStyle, Fill, Stroke, Text } from "ol/style";
import { Vector as VectorLayer, Tile as TileLayer } from "ol/layer";
import Overlay from "ol/Overlay";
import { Circle, LineString, Polygon } from "ol/geom";
import { fromLonLat, toLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";

//
function clusterStyle(feature) {
  console.log(feature.get("features"));

  const size = feature.get("features").length;

  // Single Device
  const clusterMember = feature.get("features")[0];
  // console.log(">>>>>>> clusterMember:", clusterMember);

  if (size == 1) {
    return new Style({
      image:
        clusterMember.get("LEISTUNG") > 5
          ? new Icon({
              src: "icons/emoticon-cool.svg",
              width: 80,
            })
          : new Icon({
              src: "icons/icon.png",
              width: 20,
            }),
    });
  }

  return [
    new Style({
      image: new Icon({
        src: "https://www.svgrepo.com/show/530554/washing-machine.svg",
        width: 80,
      }),
    }),

    // Big Circle
    // new Style({
    //   image: new CircleStyle({
    //     radius: 1 * size > 40 ? 40 : size,
    //     fill: new Fill({
    //       color: "rgba(85, 13, 102, 0.2)",
    //     }),
    //   }),
    // }),

    // Small Circle
    new Style({
      //   image: new CircleStyle({
      //     radius: 12,
      //     fill: new Fill({
      //       color: "rgba(85, 15, 0, 0.7)",
      //     }),
      //   }),

      text: new Text({
        text: size.toString(),
        fill: new Fill({
          color: "#000",
        }),
        scale: 2,
      }),
    }),
  ];
}

// Layer displaying the clusters and individual features.
const clusters = new VectorLayer({
  source: new Cluster({
    distance: 80,
    source: new VectorSource({
      format: new GeoJSON(),
      url: "data/dynamic_cluster.json",
    }),
  }),

  style: clusterStyle,
});

// ================================== MAP  ==================================
const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),

    clusters,
  ],

  view: new View({
    center: fromLonLat([16.314977778, 48.178816489]),
    zoom: 11,
  }),
});

map
  .getLayers()
  .getArray()[0]
  .on("postrender", function (evt) {
    evt.context.globalCompositeOperation = "color";
    evt.context.fillStyle = "rgba(225,225,225," + 1.0 + ")";
    evt.context.fillRect(0, 0, evt.context.canvas.width, evt.context.canvas.height);
    evt.context.globalCompositeOperation = "overlay";
    evt.context.fillStyle = "rgb(" + [200, 200, 200].toString() + ")";
    evt.context.fillRect(0, 0, evt.context.canvas.width, evt.context.canvas.height);
    evt.context.globalCompositeOperation = "source-over";

    const canvasElement = document.querySelector("canvas");
  });
