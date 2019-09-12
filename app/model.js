var Model = function Model(XMLHttpRequest) {
  this.XMLHttpRequest = XMLHttpRequest;
};

Model.prototype.getJSON = function get(index, fn) {
  var oReq = new this.XMLHttpRequest();

  oReq.onload = function onLoad(e) {
    var ajaxResponse = JSON.parse(e.currentTarget.responseText);
    var data = ajaxResponse[index];

    data.index = index;
    data.count = ajaxResponse.length;

    fn(data);
  };

  oReq.open("GET", "https://codepen.io/beautifulcoder/pen/vmOOLr.js", true);
  oReq.send();
};

if (typeof module !== "undefined") {
  module.exports = Model;
}
