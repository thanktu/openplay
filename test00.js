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
import { setTheme } from "./testLib";

var tooltipDIV = document.getElementById("popup");

// Create an array to hold the overlays
let overlays = [];

function createClusterOverlay(feature) {
  const size = feature.get("features").length; //

  const w = 30 + size > 150 ? 150 : 80;
  const h = 20 + size > 80 ? 30 : 20;

  // height: ${h}px;
  // width: ${w}px;

  let content = "";
  if (size > 1) {
    content = `
    <div class="cluster-label" style="border-radius: 15px;">
        <div class="boxCanvasLeft">
          ${size}
        </div>

        <div class="boxCanvasRight">
          <div class="itemCanvasRight">
            <span class="itemCanvasTextLeft"> ONS </span>
            <span class="itemCanvasTextRight"> 261 </span>
          </div>

          <div class="itemCanvasRight">
            <span class="itemCanvasTextLeft"> ONS </span>
            <span class="itemCanvasTextRight"> 261 </span>
          </div>

          <div class="itemCanvasRight">
            <span class="itemCanvasTextLeft"> Pending </span>
            <span class="itemCanvasTextRight"> 261 </span>
          </div>

        </div>
      </div>
    `;
  } else {
    content = `
        <div class="detail-label" style="">
            <i class="fa-solid fa-car-side"></i>
        </div>
    `;
  }

  // Create a new div element for the overlay
  const elementHTML = document.createElement("div");
  elementHTML.className = "overlay";
  elementHTML.innerHTML = content;

  elementHTML.addEventListener("click", function () {
    if (size > 1) {
      console.log(`Cluster clicked with ${size} features.`); // zoomToCluster(feature);

      const singleFeature = feature.get("features")[0];
      showPopup(singleFeature.getGeometry().getCoordinates(), `Feature: ${singleFeature.get("name")}`);
    } else {
      const singleFeature = feature.get("features")[0];
      console.log(`Single feature clicked: ${singleFeature.get("name")}`);
      // showPopup(singleFeature.getGeometry().getCoordinates(), `Feature: ${singleFeature.get('name')}`);
    }
  });

  // Create the overlay using ol.Overlay
  const overlay = new Overlay({
    element: elementHTML,
    position: feature.getGeometry().getCoordinates(), // Position the overlay at the cluster point
    positioning: "bottom-center", // Center the overlay at the point
    stopEvent: false, // ZoomIn, Out still working on div Overlay
  });

  return overlay;
}

// Function to update overlays for all features
function updateOverlays(clusterSource) {
  // Remove previous overlays
  overlays.forEach((overlay) => map.removeOverlay(overlay));
  overlays = [];

  // Get the features from the cluster source
  const features = clusterSource.getFeatures();

  features.forEach((feature) => {
    const overlay = createClusterOverlay(feature);
    overlays.push(overlay);
    map.addOverlay(overlay); // Add the overlay to the map
  });
}

// Cluster source
const clusterSource = new Cluster({
  distance: 200,
  minDistance: 10,
  source: new VectorSource({
    format: new GeoJSON(),
    url: "data/dynamic_cluster.json",
  }),
});

// Layer for the clusters (we're not using a style here, since overlays will handle it)
const vectorLayer = new VectorLayer({
  source: clusterSource,
  style: [],

  //style: [
  // new Style({
  //   image: new Icon({
  //     src: "https://www.svgrepo.com/show/530554/washing-machine.svg",
  //     width: 80,
  //   }),
  // }),
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
  //new Style({
  // image: new CircleStyle({
  //   radius: 12,
  //   fill: new Fill({
  //     color: "rgba(85, 15, 0, 0.7)",
  //   }),
  // }),

  // text: new Text({
  //   text: "xxx",
  //   fill: new Fill({
  //     color: "#000",
  //   }),
  //   scale: 2,
  // }),
  //}),
  // ],
});

// ================================== MAP  ==================================
const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),

    vectorLayer,
  ],

  view: new View({
    center: fromLonLat([16.314977778, 48.178816489]),
    zoom: 12,
  }),
});

setTheme(map, updateOverlays, clusterSource);

// ================================= Handle =================================

map.on("moveend", function () {
  console.log(">>>>>> Moveendddd");
  updateOverlays(clusterSource);
});

function showPopup(coordinate, content) {
  // const popupElement = document.createElement("div");

  // popupElement.className = "popup";
  // popupElement.innerHTML = content;

  // const popupOverlay = new Overlay({
  //   element: popupElement,
  //   position: coordinate,
  //   positioning: "bottom-center",
  //   stopEvent: true,
  //   offset: [0, -10],
  // });

  // map.addOverlay(popupOverlay);

  var tooltipPopOver = $(".popup").popover({
    placement: "auto top",
    html: true,
    title: "xxxxxx",
    content: content,
    viewport: { selector: "#map_canvas", padding: 10 },
  });

  tooltipPopOver.popover("show");

  // if (!previousHitValue) {
  //   tooltipPopOver.popover("show");
  //   currentlyShowing = feature.get("name");
  //   jTarget.css("cursor", cursorHoverStyle);
  // } else if (currentlyPointingTo != currentlyShowing) {
  //   // handle cases of dynamically changing content of tooltip
  //   var dataObj = tooltipPopOver.data("bs.popover");
  //   dataObj.options.title = titleHTML;
  //   dataObj.options.content = contentHTML;
  //   tooltipPopOver.popover("show"); // Trigger refresh.

  //   // update reference
  //   currentlyShowing = currentlyPointingTo;
  // }
}
