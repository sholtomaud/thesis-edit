"use strict";

var Control = function Control(view, model) {
  this.view = view;
  this.model = model;
};

Control.prototype.initialize = function initialize() {
  this.view.onClickGet = this.onClickGet.bind(this);
};

Control.prototype.onClickGet = function onClickGet(e) {
  var target = e.currentTarget;
  var index = parseInt(target.dataset.index, 10);

  this.model.getJSON(index, this.show.bind(this));
};

Control.prototype.show = function show(data) {
  var model = {
    name: data.name,
    imageUrl: data.imageUrl,
    size: data.size,
    favoriteFood: data.favoriteFood
  };

  model.previousIndex = data.index - 1;
  model.nextIndex = data.index + 1;

  if (data.index === 0) {
    model.previousIndex = data.count - 1;
  }

  if (data.index === data.count - 1) {
    model.nextIndex = 0;
  }
  this.view.render(model);
};

if (typeof module !== "undefined") {
  module.exports = Control;
}
