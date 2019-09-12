"use strict";

var View = function View(element) {
  this.element = element;
  this.onClickGet = null;
};

View.prototype.render = function render(data) {
    
    this.element.innerHTML =`<div>
        <p>${Object.keys(data).map((key)=>{
            console.log(Object.keys(data));
        return key})}</p>
        <h3>${data.name}</h3>
        <img 
            class="penguin-image" 
            src="${data.imageUrl}" 
            alt="${data.name}"
        />
        <p><b>Size:</b>${data.size}</p>
        <p><b>Favorite food:</b>${data.favoriteFood}</p>
        <a id="previous" 
            class="control previous button" 
            href="javascript:void(0);"
            data-index="${data.previousIndex}"
        >Previous</a>
        <a id="next" 
            class="control next button" 
            href="javascript:void(0);" 
            data-index="${data.nextIndex}">Next</a></div>`;

  this.previousIndex = data.previousIndex;
  this.nextIndex = data.nextIndex;

  var previous = this.element.querySelector("#previous");
  previous.addEventListener("click", this.onClickGet);

  var next = this.element.querySelector("#next");
  next.addEventListener("click", this.onClickGet);
};

if (typeof module !== "undefined") {
  module.exports = View;
}
