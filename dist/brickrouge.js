var Brickrouge={};!function(a){var g=0;a.uidOf=function(e){return e.uniqueNumber||(e.uniqueNumber=++g)};a.camelCase=function(e){return String(e).replace(/-\D/g,function(e){return e.charAt(1).toUpperCase()})};a.Dataset={from:function(e){var h={};e=e.attributes;for(var d=0,f=e.length,c;d<f;d++)c=e[d],c.name.match(/^data-/)&&(h[a.camelCase(c.name.substring(5))]=c.value);return h}}}(Brickrouge);
!function(a){function g(){}g.prototype={getObservers:function(e){var a;"$brickrouge:observers"in this||(this["$brickrouge:observers"]=[]);a=this["$brickrouge:observers"];if(!e)return a;e in a||(a[e]=[]);return a[e]},observe:function(a,h){var d=this.getObservers(a);if(-1!==d.indexOf(h))throw Error("Observer already attached for type `"+a+"`");d.push(h)},unobserve:function(a){var h=this.getObservers(null),d,f,c;for(d in Object.keys(h))f=h[d],c=f.indexOf(a),-1!==c&&f.splice(c,1)},notify:function(a,h){var d=
this.getObservers(a),f,c;if(d.length)for(f=0,c=d.length;f<c;f++)try{d[f].apply(null,h)}catch(g){console.error(g)}}};a.Subject=g;a.observe=g.prototype.observe;a.unobserve=g.prototype.unobserve;a.notify=g.prototype.notify;a.getObservers=g.prototype.getObservers}(Brickrouge);
!function(a){function g(b){if(!(b in n))throw Error("There is no widget factory for type `"+b+"`");return n[b]}function e(b){return"object"==typeof b&&"getAttribute"in b&&!!b.getAttribute("brickrouge-is")}function h(b){return a.uidOf(b)in l}function d(b){console.info("invalidate:",b);b.setAttribute("brickrouge-invalid-is",b.getAttribute("brickrouge-is"));b.removeAttribute("brickrouge-is")}function f(b){var e=a.uidOf(b);if(e in l)return l[e];var f=b.getAttribute("brickrouge-is"),c=null;if(!f)throw d(b),
Error("The `brickrouge-is` attribute is not defined or empty.");try{var h=g(f),k;k=b.hasAttribute("brickrouge-options")?JSON.parse(b.getAttribute("brickrouge-options")):a.Dataset.from(b);c=h(b,k)}catch(q){console.error(q)}if(!c)throw d(b),Error("The widget factory `"+f+"` failed to build the widget.");b.setAttribute("brickrouge-built","");try{a.notify("widget",[c])}catch(q){console.error(q)}return l[e]=c}function c(b){var c,d=0,g,p=[];b=b||document.body;if(-1===m.indexOf(b)){m.push(b);if(e(b)&&!h(b))try{p.push(f(b))}catch(k){console.error(k)}c=
b.querySelectorAll("[brickrouge-is]:not([brickrouge-built])");for(g=c.length;d<g;d++)try{p.push(f(c[d]))}catch(k){console.error(k)}m.splice(m.indexOf(b),1);a.notify("update",[b,c,p])}}function t(){function b(a){(new a(function(a){a.forEach(function(a){var b,c,d=a.addedNodes;a=0;for(b=d.length;a<b;a++)c=d[a],e(c)&&f(c)})})).observe(document.body,{childList:!0})}function a(){var b=document.body.innerHTML;setInterval(function(){b!=document.body.innerHTML&&(b=document.body.innerHTML,c(document.body))},
1E3)}var d=MutationObserver||WebkitMutationObserver;d?b(d):a()}function r(a,c){n[a]=c}var n=[],l=[],m=[];a.isWidget=e;a.isBuilt=h;a.register=r;a.registered=g;a.from=f;a.run=function(){t();c(document.body);a.notify("running")};a.Widget={IS_ATTRIBUTE:"brickrouge-is",OPTIONS_ATTRIBUTE:"brickrouge-options",SELECTOR:"[brickrouge-is]",from:f,register:r,registered:g}}(Brickrouge);
