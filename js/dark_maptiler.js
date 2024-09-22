import "../style.css";
import { Map, View } from "ol";
import { OSM, XYZ, Vector as VectorSource, Vector, Cluster, TileJSON } from "ol/source";
import { Vector as VectorLayer, Tile as TileLayer } from "ol/layer";
import { apply } from "ol-mapbox-style";

const rootTieleLayer = new TileLayer({
  source: new OSM(),
  visible: true,
  preload: Infinity, //  preload: 0, // default value || Infinity
});

// ================================== MAP  ==================================
const map = new Map({
  target: "map",
  layers: [
    rootTieleLayer,

    // new TileLayer({
    //     source: new XYZ({
    //         url: "https://api.maptiler.com/maps/nl-cartiqo-dark/{z}/{x}/{y}.png?key=17YhaUehJVmGcqQaZ2up",
    //         crossOrigin: "anonymous",
    //     }),
    // }),

    //   new TileLayer({
    //     source: new XYZ({
    //         url: "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    //         crossOrigin: "anonymous",
    //     }),
    // }),

    // new TileLayer({
    //   source: new TileJSON({
    //     url: `https://api.maptiler.com/maps/dataviz-dark/tiles.json?key=17YhaUehJVmGcqQaZ2up`, // source URL
    //     tileSize: 512,
    //     crossOrigin: 'anonymous'
    //   })
    // })

    // https://api.maptiler.com/maps/32543d98-5fec-45af-99e0-86792d294462/style.json?key=17YhaUehJVmGcqQaZ2up
  ],

  view: new View({
    center: [0, 0], // --> Default
    zoom: 2,
    maxZoom: 22,
  }),
});

apply(map, "https://api.maptiler.com/maps/dataviz-dark/style.json?key=17YhaUehJVmGcqQaZ2up"); // &mtsid=1e09752d-9dc6-4282-9814-e987fe25d9ff

// // 'https://api.mapbox.com/styles/v1/mapbox/bright-v9?access_token=O7VbOY3zrXxBupgrQtdE'

// map.getLayers().getArray()[0].on('postcompose', function (evt) {
//   evt.context.globalCompositeOperation = 'color';
//   evt.context.fillStyle = 'rgba(0,0,0,' + 1.0 + ')';
//   evt.context.fillRect(0, 0, evt.context.canvas.width, evt.context.canvas.height);
//   evt.context.globalCompositeOperation = 'overlay';
//   evt.context.fillStyle = 'rgb(' + [200, 200, 200].toString() + ')';
//   evt.context.fillRect(0, 0, evt.context.canvas.width, evt.context.canvas.height);
//   evt.context.globalCompositeOperation = 'source-over';
//   document.querySelector('canvas').style.filter = "invert(99%)";
// });

// function animate() {
//     map.render();
//     window.requestAnimationFrame(animate);
// }
// animate();
// const xGray = 90;
// const xxBG = 175;
