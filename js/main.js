jQuery(document).ready(function() {
  jQuery('#filters').jcarousel();
});

var init = function () {
  canvas = document.getElementById('canvas');

  stage = new createjs.Stage(canvas);
  createjs.Touch.enable(stage);

  stage.enableMouseOver(10);
  stage.mouseMoveOutside = true;
}

var stop = function () {
  Ticker.removeListener(window);
}

var handleFilterClick = function (event) {
  if (mainImage) {
    if (currentFilter) {
      container.removeChild(currentFilter);
    }

    var image = new Image();
    image.src = "img/" + event.currentTarget.id + ".png";
    image.onload = handleFilterLoad;
  }
}

var handleUploadImage = function (event) {
  var reader = new FileReader();

  reader.onload = function(event) {
    mainImage = new Image();

    mainImage.onload = function(event) {
      init();
      handleMainImageLoad(event);
      $(saveButton).parent().removeClass('disabled');
      saveButton.removeAttribute('disabled');
    }

    mainImage.src = event.target.result;
  }

  reader.readAsDataURL(event.target.files[0]);
}

var handleSaveImage = function (event) {
  var url = canvas.toDataURL();
  window.location.href = url.replace('image/png', 'image/octet-stream');
}

var handleMainImageLoad = function (event) {
  var image = event.target;

  container = new createjs.Container();
  stage.addChild(container);

  var mainImageBitmap = new createjs.Bitmap(image);
  mainImageBitmap.scaleX = 500 / image.width;
  mainImageBitmap.scaleY = 500 / image.height;

  container.addChild(mainImageBitmap);

  createjs.Ticker.addListener(window);
}

var handleFilterLoad = function (event) {
  var image = event.target;

  currentFilter = new createjs.Bitmap(image);
  container.addChild(currentFilter);

  currentFilter.x = image.width / 2;
  currentFilter.y = image.height / 2;
  currentFilter.regX = image.width / 2 | 0;
  currentFilter.regY = image.height / 2 | 0;

  (function(target) {
    console.log(currentFilter);
    currentFilter.onPress = function(evt) {
      container.addChild(target);
      var offset = {x:target.x-evt.stageX, y:target.y-evt.stageY};

      evt.onMouseMove = function(ev) {
        target.x = ev.stageX+offset.x;
        target.y = ev.stageY+offset.y;
        update = true;
      }
    }
  })(currentFilter);

  stage.update();
}

var tick = function () {
  if (update) {
    update = false;
    stage.update();
  }
}

var canvas, stage, container;

var mouseTarget;
var dragStarted;
var offset;
var update = true;

var mainImage, currentFilter;

var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleUploadImage, false);

var saveButton = document.getElementById('saveImage');
    saveButton.addEventListener('click', handleSaveImage, false);

var filters = $('ul#filters li');
    filters.on('click', handleFilterClick);
