(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sggWidgets = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var hyper = _interopDefault(require('hyperhtml/umd'));

const UPPER = /.[A-Z]/g;

function kebabCase(string) {
  return string.replace(UPPER, c => c[0] + '-' + c[1].toLowerCase())
}

function camelCase(string) {
  return string.replace(/-./g, c => c[1].toUpperCase())
}

function define(decorators=[], target = decorators.pop()) {
  for(const transform of decorators) {
    target = transform(target) || target;
  }
  return target
}

function middleware(done) {
  const middleware = [];

  Object.assign(pipeline, {
    use(...callbacks) {
      return middleware.push(...callbacks), this
    }
  });

  function pipeline(...args) {
    const context = { self: this, index: 0 };

    function next() {
      const method = middleware[context.index++];

      if(method) {
        return method.call(context.self, args, next)
      } else if(done) {
        return done.apply(context.self, args)
      }
    }

    return next()
  }

  return pipeline
}

function mixin(target, ...sources) {
  for(const source of sources) {
    for(const [ property, method ] of Object.entries(source)) {
      if(typeof method !== 'function') continue

      if(!target[property]) {
        target[property] = middleware();
      } else if(!target[property].use) {
        target[property] = middleware(target[property]);
      }

      target[property].use(method);
    }
  }
  return target
}

const COMPONENTS = [ ];

function Component(namespace) {
  return function define$$1(Class) {
    Class.namespace = namespace;

    COMPONENTS.push(Class);
  }
}

function bootstrap$1(plugins = []) {
  const registry = { };

  for(const component of COMPONENTS) {
    const name = component.className || component.name;
    const namespace = component.namespace;
    const tagName = component.tagName = kebabCase(namespace +  name);
    const Component = define(plugins, component);

    customElements.define(tagName, Component);

    registry[tagName] = Component;
  }

  return registry
}

function hyper$1({ bind }) {
  return function renderer(Class) {
    mixin(Class.prototype, {
      attributeChangedCallback(args, next) {
        this.render();
        return next()
      },
      connectedCallback(args, next) {
        if(this.html) return next()

        this.attachShadow({ mode: 'open' });
        this.html = bind(this.shadowRoot);

        this.render();

        return next()
      },
      render(args, next) {
        this.template(this.html);

        return next()
      }
    });
  }
}

function Attribute(name, type) {
  const property = camelCase(name);
  const attribute = kebabCase(name);

  return function define$$1(Class) {
    if(!Class.observedAttributes) {
      Class.observedAttributes = [];
    }

    Class.observedAttributes.push(attribute);

    Object.defineProperty(Class.prototype, property, {
      enumerable: true,
      configurable: true,
      get() {
        if(type === Boolean) {
          return this.hasAttribute(attribute)
        } else if(type.instance) {
          return type.instance(this.getAttribute(attribute))
        } else {
          return type(this.getAttribute(attribute))
        }
      },
      set(value) {
        if(type === Boolean) {
          if(value) {
            this.setAttribute(attribute, '');
          } else {
            this.removeAttribute(attribute);
          }
        } else {
          this.setAttribute(attribute, value);
        }
      }
    });
  }
}

function Template(template) {
  return function define(Class) {
    Class.prototype.template = template;
  }
}

function bootstrap(plugins=[]) {
  return bootstrap$1(plugins.concat([ hyper$1(hyper) ]))
}

exports.bootstrap = bootstrap;
exports.Component = Component;
exports.Attribute = Attribute;
exports.Template = Template;
exports.kebabCase = kebabCase;
exports.camelCase = camelCase;
exports.define = define;
exports.middleware = middleware;
exports.mixin = mixin;

},{"hyperhtml/umd":2}],2:[function(require,module,exports){
(function(A,G){if(typeof define=='function'&&define.amd)define([],G);else if(typeof module=='object'&&module.exports)module.exports=G();else A.hyperHTML=G()}(typeof self!='undefined'?self:this,function(){
/*! (c) Andrea Giammarchi (ISC) */var hyperHTML=function(e){"use strict";function t(){}function n(e){this.childNodes=e,this.length=e.length,this.first=e[0],this.last=e[this.length-1]}function r(){}function i(){var e=function(e,n){for(var r=new C(n),i=e.length,o=0;o<i;o++){var a=e[o];a.nodeType===g&&t(a,r)}},t=function r(e,t){if(he.has(e))e.dispatchEvent(t);else for(var n=e.children,i=n.length,o=0;o<i;o++)r(n[o],t)};try{new MutationObserver(function(t){for(var n=t.length,r=0;r<n;r++){var i=t[r];e(i.removedNodes,N),e(i.addedNodes,y)}}).observe(document,{subtree:!0,childList:!0})}catch(n){document.addEventListener("DOMNodeRemoved",function(t){e([t.target],N)},!1),document.addEventListener("DOMNodeInserted",function(t){e([t.target],y)},!1)}}function o(e){var t=Te.get(this);return t&&t.template===X(e)?l.apply(t.updates,arguments):a.apply(this,arguments),this}function a(e){e=X(e);var t=je.get(e)||u.call(this,e),n=Q(this.ownerDocument,t.fragment),r=Se.create(n,t.paths);Te.set(this,{template:e,updates:r}),l.apply(r,arguments),this.textContent="",this.appendChild(n)}function l(){for(var e=arguments.length,t=1;t<e;t++)this[t-1](arguments[t])}function u(e){var t=[],n=e.join(E).replace(Ae,Le),r=J(this,n);Se.find(r,t,e.slice());var i={fragment:r,paths:t};return je.set(e,i),i}function c(e){return arguments.length<2?null==e?$e("html"):"string"==typeof e?De(null,e):"raw"in e?$e("html")(e):"nodeType"in e?o.bind(e):Pe(e,"html"):("raw"in e?$e("html"):De).apply(null,arguments)}var s=function(e,t){var n="_"+e+"$";return{get:function(){return this[n]||(this[e]=t.call(this,e))},set:function(e){Object.defineProperty(this,n,{configurable:!0,value:e})}}},f={},d=[],h=f.hasOwnProperty,v=0,p={define:function(e,t){e in f||(v=d.push(e)),f[e]=t},invoke:function(e,t){for(var n=0;n<v;n++){var r=d[n];if(h.call(e,r))return f[r](e[r],t)}}},m=document.defaultView,g=1,b="http://www.w3.org/2000/svg",y="connected",N="dis"+y,w=/^style|textarea$/i,x="_hyper: "+(Math.random()*new Date|0)+";",E="\x3c!--"+x+"--\x3e",C=m.Event;try{new C("Event")}catch(_e){C=function(e){var t=document.createEvent("Event");return t.initEvent(e,!1,!1),t}}var S=m.Map||function(){var e=[],t=[];return{get:function(n){return t[e.indexOf(n)]},set:function(n,r){t[e.push(n)-1]=r}}},k=m.WeakMap||function(){return{get:function(e){return e[x]},set:function(e,t){Object.defineProperty(e,x,{configurable:!0,value:t})}}},T=m.WeakSet||function(){var e=new k;return{add:function(t){e.set(t,!0)},has:function(t){return!0===e.get(t)}}},j=Array.isArray||function(e){return function(t){return"[object Array]"===e.call(t)}}({}.toString),A=x.trim||function(){return this.replace(/^\s+|\s+$/g,"")},L=function(e,t){return M(e).createElement(t)},M=function(e){return e.ownerDocument||e},O=function(e){return M(e).createDocumentFragment()},D=function(e,t){return M(e).createTextNode(t)},$="[^\\S]+[^ \\f\\n\\r\\t\\/>\"'=]+",P="<([a-z]+[a-z0-9:_-]*)((?:",B="(?:=(?:'.*?'|\".*?\"|<.+?>|[^ \\f\\n\\r\\t\\/>\"'=]+))?)",R=new RegExp(P+$+B+"+)([^\\S]*/?>)","gi"),H=new RegExp(P+$+B+"*)([^\\S]*/>)","gi"),_=O(document),F="append"in _,z="content"in L(document,"template");_.appendChild(D(_,"g")),_.appendChild(D(_,""));var V=1===_.cloneNode(!0).childNodes.length,G="importNode"in document,I=F?function(e,t){e.append.apply(e,t)}:function(e,t){for(var n=t.length,r=0;r<n;r++)e.appendChild(t[r])},W=new RegExp("("+$+"=)(['\"]?)"+E+"\\2","gi"),Z=function(e,t,n,r){return"<"+t+n.replace(W,q)+r},q=function(e,t,n){return t+(n||'"')+x+(n||'"')},J=function(e,t){return("ownerSVGElement"in e?te:ee)(e,t.replace(R,Z))},K=V?function(e){for(var t=e.cloneNode(),n=e.childNodes||[],r=n.length,i=0;i<r;i++)t.appendChild(K(n[i]));return t}:function(e){return e.cloneNode(!0)},Q=G?function(e,t){return e.importNode(t,!0)}:function(e,t){return K(t)},U=[].slice,X=function(e){return Y(e)},Y=function(e){if(e.propertyIsEnumerable("raw")||/Firefox\/(\d+)/.test((m.navigator||{}).userAgent)&&parseFloat(RegExp.$1)<55){var t={};Y=function(e){var n="_"+e.join(x);return t[n]||(t[n]=e)}}else Y=function(e){return e};return Y(e)},ee=z?function(e,t){var n=L(e,"template");return n.innerHTML=t,n.content}:function(e,t){var n=L(e,"template"),r=O(e);if(/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(t)){var i=RegExp.$1;n.innerHTML="<table>"+t+"</table>",I(r,U.call(n.querySelectorAll(i)))}else n.innerHTML=t,I(r,U.call(n.childNodes));return r},te=z?function(e,t){var n=O(e),r=M(e).createElementNS(b,"svg");return r.innerHTML=t,I(n,U.call(r.childNodes)),n}:function(e,t){var n=O(e),r=L(e,"div");return r.innerHTML='<svg xmlns="'+b+'">'+t+"</svg>",I(n,U.call(r.firstChild.childNodes)),n};n.prototype.insert=function(){var e=O(this.first);return I(e,this.childNodes),e},n.prototype.remove=function(){var e=this.first,t=this.last;if(2===this.length)t.parentNode.removeChild(t);else{var n=M(e).createRange();n.setStartBefore(this.childNodes[1]),n.setEndAfter(t),n.deleteContents()}return e};var ne=function(e){var t=[],n=void 0;switch(e.nodeType){case g:case 11:n=e;break;case 8:n=e.parentNode,re(t,n,e);break;default:n=e.ownerElement}for(e=n;n=n.parentNode;e=n)re(t,n,e);return t},re=function(e,t,n){e.unshift(e.indexOf.call(t.childNodes,n))},ie={create:function(e,t,n){return{type:e,name:n,node:t,path:ne(t)}},find:function(e,t){for(var n=t.length,r=0;r<n;r++)e=e.childNodes[t[r]];return e}},oe=/acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i,ae=function(e,t,n){if(n){var r=t.cloneNode(!0);return r.value="",e.setAttributeNode(r),le(r,n)}return le(e.style,n)},le=function(e,t){var n=void 0,r=void 0;return function(i){switch(typeof i){case"object":if(i){if("object"===n){if(!t&&r!==i)for(var o in r)o in i||(e[o]="")}else t?e.value="":e.cssText="";var a=t?{}:e;for(var l in i){var u=i[l];a[l]="number"!=typeof u||oe.test(l)?u:u+"px"}n="object",t?e.value=se(r=a):r=i;break}default:r!=i&&(n="string",r=i,t?e.value=i||"":e.cssText=i||"")}}},ue=/([^A-Z])([A-Z]+)/g,ce=function(e,t,n){return t+"-"+n.toLowerCase()},se=function(e){var t=[];for(var n in e)t.push(n.replace(ue,ce),":",e[n],";");return t.join("")},fe=function(e){return e},de=function(e,t,n,r,i){for(var o=r||fe,a=null==i?null:o(i,0),l=0,u=0,c=t.length-1,s=t[0],f=t[c],d=n.length-1,h=n[0],v=n[d];l<=c&&u<=d;)if(null==s)s=t[++l];else if(null==f)f=t[--c];else if(null==h)h=n[++u];else if(null==v)v=n[--d];else if(s==h)s=t[++l],h=n[++u];else if(f==v)f=t[--c],v=n[--d];else if(s==v)e.insertBefore(o(s,1),o(f,-0).nextSibling),s=t[++l],v=n[--d];else if(f==h)e.insertBefore(o(f,1),o(s,0)),f=t[--c],h=n[++u];else{var p=t.indexOf(h);if(p<0)e.insertBefore(o(h,1),o(s,0)),h=n[++u];else{var m=t[p];t[p]=null,e.insertBefore(o(m,1),o(s,0)),h=n[++u]}}if(l<=c||u<=d)if(l>c){var g=n[d+1],b=null==g?a:o(g,0);if(u===d)e.insertBefore(o(n[u],1),b);else{for(var y=e.ownerDocument.createDocumentFragment();u<=d;)y.appendChild(o(n[u++],1));e.insertBefore(y,b)}}else if(null==t[l]&&l++,l===c)e.removeChild(o(t[l],-1));else{var N=e.ownerDocument.createRange();N.setStartBefore(o(t[l],-1)),N.setEndAfter(o(t[c],-1)),N.deleteContents()}return n},he=new T;r.prototype=Object.create(null);var ve=function(e){return{html:e}},pe=function Fe(e,t){return"ELEMENT_NODE"in e?e:e.constructor===n?1/t<0?t?e.remove():e.last:t?e.insert():e.first:Fe(e.render(),t)},me=function(e){return"ELEMENT_NODE"in e||e instanceof n||e instanceof t},ge=function(e,t){for(var n=[],r=t.length,i=0;i<r;i++){var o=t[i],a=ie.find(e,o.path);switch(o.type){case"any":n.push(xe(a,[]));break;case"attr":n.push(Ee(a,o.name,o.node));break;case"text":n.push(Ce(a))}}return n},be=function ze(e,t,n){for(var r=e.childNodes,i=r.length,o=0;o<i;o++){var a=r[o];switch(a.nodeType){case g:ye(a,t,n),ze(a,t,n);break;case 8:a.textContent===x&&(n.shift(),t.push(w.test(e.nodeName)?ie.create("text",e):ie.create("any",a)));break;case 3:w.test(e.nodeName)&&A.call(a.textContent)===E&&(n.shift(),t.push(ie.create("text",e)))}}},ye=function(e,t,n){for(var i=new r,o=e.attributes,a=U.call(o),l=[],u=a.length,c=0;c<u;c++){var s=a[c];if(s.value===x){var f=s.name;if(!(f in i)){var d=n.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)=['"]?$/,"$1");i[f]=o[d]||o[d.toLowerCase()],t.push(ie.create("attr",i[f],d))}l.push(s)}}for(var h=l.length,v=0;v<h;v++)e.removeAttributeNode(l[v]);var p=e.nodeName;if(/^script$/i.test(p)){for(var m=L(e,p),g=0;g<o.length;g++)m.setAttributeNode(o[g].cloneNode(!0));m.textContent=e.textContent,e.parentNode.replaceChild(m,e)}},Ne=function(e,t){t(e.placeholder),"text"in e?Promise.resolve(e.text).then(String).then(t):"any"in e?Promise.resolve(e.any).then(t):"html"in e?Promise.resolve(e.html).then(ve).then(t):Promise.resolve(p.invoke(e,t)).then(t)},we=function(e){return null!=e&&"then"in e},xe=function(e,t){var n=!1,r=void 0;return function i(o){switch(typeof o){case"string":case"number":case"boolean":n?r!==o&&(r=o,t[0].textContent=o):(n=!0,r=o,t=de(e.parentNode,t,[D(e,o)],pe,e));break;case"object":case"undefined":if(null==o){n=!1,t=de(e.parentNode,t,[],pe,e);break}default:if(n=!1,r=o,j(o))if(0===o.length)t.length&&(t=de(e.parentNode,t,[],pe,e));else switch(typeof o[0]){case"string":case"number":case"boolean":i({html:o});break;case"object":if(j(o[0])&&(o=o.concat.apply([],o)),we(o[0])){Promise.all(o).then(i);break}default:t=de(e.parentNode,t,o,pe,e)}else me(o)?t=de(e.parentNode,t,11===o.nodeType?U.call(o.childNodes):[o],pe,e):we(o)?o.then(i):"placeholder"in o?Ne(o,i):"text"in o?i(String(o.text)):"any"in o?i(o.any):"html"in o?t=de(e.parentNode,t,U.call(J(e,[].concat(o.html).join("")).childNodes),pe,e):i("length"in o?U.call(o):p.invoke(o,i))}}},Ee=function(e,t,n){var r="ownerSVGElement"in e,o=void 0;if("style"===t)return ae(e,n,r);if(/^on/.test(t)){var a=t.slice(2);return a===y||a===N?(ke&&(ke=!1,i()),he.add(e)):t.toLowerCase()in e&&(a=a.toLowerCase()),function(t){o!==t&&(o&&e.removeEventListener(a,o,!1),o=t,t&&e.addEventListener(a,t,!1))}}if("data"===t||!r&&t in e)return function(n){o!==n&&(o=n,e[t]!==n&&(e[t]=n,null==n&&e.removeAttribute(t)))};var l=!1,u=n.cloneNode(!0);return function(t){o!==t&&(o=t,u.value!==t&&(null==t?(l&&(l=!1,e.removeAttributeNode(u)),u.value=t):(u.value=t,l||(l=!0,e.setAttributeNode(u)))))}},Ce=function(e){var t=void 0;return function n(r){t!==r&&(t=r,"object"==typeof r&&r?we(r)?r.then(n):"placeholder"in r?Ne(r,n):n("text"in r?String(r.text):"any"in r?r.any:"html"in r?[].concat(r.html).join(""):"length"in r?U.call(r).join(""):p.invoke(r,n)):e.textContent=null==r?"":r)}},Se={create:ge,find:be},ke=!0,Te=new k,je=new S,Ae=H,Le=function(e,t,n){return Me.test(t)?e:"<"+t+n+"></"+t+">"},Me=/^area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr$/i,Oe=new k,De=function(e,t){return null==e?$e(t||"html"):Pe(e,t||"html")},$e=function(e){var t=void 0,n=void 0,r=void 0,i=void 0,a=void 0;return function(l){l=X(l);var u=i!==l;return u&&(i=l,r=O(document),n="svg"===e?document.createElementNS(b,"svg"):r,a=o.bind(n)),a.apply(null,arguments),u&&("svg"===e&&I(r,U.call(n.childNodes)),t=Be(r)),t}},Pe=function(e,t){var n=t.indexOf(":"),r=Oe.get(e),i=t;return-1<n&&(i=t.slice(n+1),t=t.slice(0,n)||"html"),r||Oe.set(e,r={}),r[i]||(r[i]=$e(t))},Be=function(e){for(var t=e.childNodes,r=t.length,i=[],o=0;o<r;o++){var a=t[o];a.nodeType!==g&&0===A.call(a.textContent).length||i.push(a)}return 1===i.length?i[0]:new n(i)},Re=function(e){return o.bind(e)},He=p.define;return c.Component=t,c.bind=Re,c.define=He,c.diff=de,c.hyper=c,c.wire=De,function(e){Object.defineProperties(t.prototype,{handleEvent:{value:function(e){var t=e.currentTarget;this["getAttribute"in t&&t.getAttribute("data-call")||"on"+e.type](e)}},html:s("html",e),svg:s("svg",e),state:s("state",function(){return this.defaultState}),defaultState:{get:function(){return{}}},setState:{value:function(e){var t=this.state,n="function"==typeof e?e.call(this,t):e;for(var r in n)t[r]=n[r];this.render()}}})}($e),c}(window);
return hyperHTML}));

},{}]},{},[1])(1)
});