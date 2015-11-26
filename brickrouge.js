var Brickrouge={};!function(a){a.run=function(){a.Widget.parse();a.Widget.monitor()}}(Brickrouge);!function(a){var f=0;a.uidOf=function(b){return b.uniqueNumber||(b.uniqueNumber=++f)};a.camelCase=function(b){return String(b).replace(/-\D/g,function(b){return b.charAt(1).toUpperCase()})};a.Dataset={from:function(b){var d={};b=b.attributes;for(var c=0,g=b.length,e;c<g;c++)e=b[c],e.name.match(/^data-/)&&(d[a.camelCase(e.name.substring(5))]=e.value);return d}}}(Brickrouge);
!function(a){function f(){}f.prototype={getObservers:function(b){var a;"$brickrouge:observers"in this||(this["$brickrouge:observers"]=[]);a=this["$brickrouge:observers"];if(!b)return a;b in a||(a[b]=[]);return a[b]},attachObserver:function(a,d){var c=this.getObservers(a);if(-1!==c.indexOf(d))throw Error('Observer already attached for type "'+a+'"');c.push(d)},detachObserver:function(a){var d=this.getObservers(),c,g,e;for(c in d)d.hasOwnProperty(c)&&(g=d[c],e=g.indexOf(a),-1!==e&&g.splice(e,1))},notifyObservers:function(a,
d){var c=this.getObservers(a),g,e;if(c.length)for(g=0,e=c.length;g<e;g++)try{c[g].apply(null,d)}catch(f){console.error(f)}}};a.Subject=f;a.attachObserver=f.prototype.attachObserver;a.detachObserver=f.prototype.detachObserver;a.notifyObservers=f.prototype.notifyObservers;a.getObservers=f.prototype.getObservers}(Brickrouge);
!function(a){function f(a){return"object"==typeof a&&"getAttribute"in a&&!!a.getAttribute("brickrouge-is")}function b(b){var c=a.uidOf(b);if(c in e)return e[c];var f=b.getAttribute("brickrouge-is");if(!f)throw Error("The brickrouge-is attribute is not defined.");if(!(f in g))throw Error("There is no widget factory for type "+f);var d=g[f],h;h=b.hasAttribute("brickrouge-options")?JSON.parse(b.getAttribute("brickrouge-options")):a.Dataset.from(b);b=d(b,h);if(!b)throw Error("The widget factory "+f+" failed to instantiate widget.");
try{a.notifyObservers("widget",[b])}catch(k){console.error(k)}return e[c]=b}function d(c){var d,e=0,g,h=[];c=c||document.body;f(c)&&h.push(b(c));d=c.querySelectorAll("[brickrouge-is]");for(g=d.length;e<g;e++)h.push(b(d[e]));a.notifyObservers("parse",[c,h]);return h}function c(a,b){g[a]=b}var g=[],e=[],k=null;a.isWidget=f;a.register=c;a.parse=d;a.Widget={IS_ATTRIBUTE:"brickrouge-is",OPTIONS_ATTRIBUTE:"brickrouge-options",SELECTOR:"[brickrouge-is]",from:b,parse:d,register:c,monitor:function(){k||(k=
new MutationObserver(function(a){a.forEach(function(a){var c,d,e=a.addedNodes;a=0;for(c=e.length;a<c;a++)d=e[a],f(d)&&b(d)})}),k.observe(document.body,{childList:!0}))}}}(Brickrouge);
