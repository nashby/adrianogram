jQuery(document).ready(function() {
  jQuery('#filters').jcarousel();
  placeholder();
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

var placeholder = function() {
  mainImage = new Image();

  mainImage.onload = function(event) {
    init();
    handleMainImageLoad(event);
    $(saveButton).parent().removeClass('disabled');
    saveButton.removeAttribute('disabled');
  }

  mainImage.src = "img/placeholder.jpg";
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
  ctx = canvas.getContext("2d");

  canvas.toBlob(function(blob) {
    saveAs(blob, "adrianov.png");
  });
}

var handleMainImageLoad = function (event) {
  var image = event.target;

  if (container) {
    container.removeChild(currentFilter);
    stage.removeChild(container);
  }

  container = new createjs.Container();
  stage.addChild(container);

  var min;
  if (image.width < image.height) {
    min = image.width;
  } else {
    min = image.height;
  }

  mainImageBitmap = new createjs.Bitmap(image);
  mainImageBitmap.sourceRect = new createjs.Rectangle(0, 0, min, min);
  mainImageBitmap.scaleX = 500 / min;
  mainImageBitmap.scaleY = 500 / min;

  container.addChild(mainImageBitmap);
  stage.update();
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

var mainImage, mainImageBitmap, currentFilter;

var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleUploadImage, false);

var saveButton = document.getElementById('saveImage');
    saveButton.addEventListener('click', handleSaveImage, false);

var filters = $('ul#filters li');
    filters.on('click', handleFilterClick);
