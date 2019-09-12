'use strict'

const Model = require('./model');
const View = require('./view');
const Control = require('./control');

if (typeof window !== 'undefined') {
    
    var target = document.createElement("div");

    var model = new Model(XMLHttpRequest);
    var view = new View(target);
    var control = new Control(view, model);

    control.initialize();
    control.onClickGet({
    currentTarget: { dataset: { index: 0 } }
    });

    document.body.onload = function() { 
    document.body.appendChild(target); 
    }

}