function setTheme(map, updateOverlays, clusterSource) {
  map
    .getLayers()
    .getArray()[0]
    .on("postrender", function (evt) {
      updateOverlays(clusterSource);

      evt.context.globalCompositeOperation = "color";
      evt.context.fillStyle = "rgba(225,225,225," + 1.0 + ")";
      evt.context.fillRect(0, 0, evt.context.canvas.width, evt.context.canvas.height);
      evt.context.globalCompositeOperation = "overlay";
      evt.context.fillStyle = "rgb(" + [200, 200, 200].toString() + ")";
      evt.context.fillRect(0, 0, evt.context.canvas.width, evt.context.canvas.height);
      evt.context.globalCompositeOperation = "source-over";

      // document.getElementById("map").style.filter = "invert(99%)";
      const canvasElement = document.querySelector("canvas");
      if (canvasElement) canvasElement.style.filter = "brightness(0.65) invert(1) contrast(3) hue-rotate(2000deg) saturate(1) brightness(0.7)";
    });
}

export { setTheme };
