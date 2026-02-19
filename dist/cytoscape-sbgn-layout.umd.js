(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("cose-base"));
	else if(typeof define === 'function' && define.amd)
		define(["cose-base"], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeSbgnLayout"] = factory(require("cose-base"));
	else
		root["cytoscapeSbgnLayout"] = factory(root["coseBase"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 70);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var core = __webpack_require__(0);
var ctx = __webpack_require__(9);
var hide = __webpack_require__(10);
var has = __webpack_require__(17);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(57)('wks');
var uid = __webpack_require__(43);
var Symbol = __webpack_require__(3).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(11)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(8);
var IE8_DOM_DEFINE = __webpack_require__(103);
var toPrimitive = __webpack_require__(119);
var dP = Object.defineProperty;

exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(5);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(14);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(7);
var createDesc = __webpack_require__(38);
module.exports = __webpack_require__(6) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(87), __esModule: true };

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(9);
var call = __webpack_require__(50);
var isArrayIter = __webpack_require__(49);
var anObject = __webpack_require__(8);
var toLength = __webpack_require__(22);
var getIterFn = __webpack_require__(44);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(29);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(117)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(32)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(15);
var TAG = __webpack_require__(4)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(7).f;
var has = __webpack_require__(17);
var TAG = __webpack_require__(4)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(41);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(124);
var global = __webpack_require__(3);
var hide = __webpack_require__(10);
var Iterators = __webpack_require__(12);
var TO_STRING_TAG = __webpack_require__(4)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var CoSEConstants = __webpack_require__(1).CoSEConstants;

function SBGNConstants() {}

//CoSEPConstants inherits static props in FDLayoutConstants
for (var prop in CoSEConstants) {
  SBGNConstants[prop] = CoSEConstants[prop];
}

module.exports = SBGNConstants;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _create = __webpack_require__(13);

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CoSENode = __webpack_require__(1).CoSENode;
var IMath = __webpack_require__(137).IMath;

function SBGNNode(gm, loc, size, vNode) {
  // the constructor of LNode handles alternative constructors
  CoSENode.call(this, gm, loc, size, vNode);

  // SBGN class of node (such as macromolecule, simple chemical etc.)
  this.class = null;
  // pseudoClass is used to add temporary class (other than SBGN class) for a node
  this.pseudoClass = null;
}

SBGNNode.prototype = (0, _create2.default)(CoSENode.prototype);
for (var prop in CoSENode) {
  SBGNNode[prop] = CoSENode[prop];
}

SBGNNode.prototype.getOutgoerNodes = function () {
  var nodeList = [];
  var self = this;

  self.edges.forEach(function (edge) {

    if (edge.source == self) {
      nodeList.push(edge.target);
    }
  });

  return nodeList;
};

SBGNNode.prototype.getIncomerNodes = function () {
  var nodeList = [];
  var self = this;

  self.edges.forEach(function (edge) {

    if (edge.target == self) {
      nodeList.push(edge.source);
    }
  });

  return nodeList;
};

SBGNNode.prototype.isProcess = function () {
  var self = this;
  if (self.class == "process" || self.class == "omitted process" || self.class == "uncertain process" || self.class == "association" || self.class == "dissociation") return true;else return false;
};

SBGNNode.prototype.isLogicalOperator = function () {
  var self = this;
  if (self.class == "and" || self.class == "or" || self.class == "not") return true;else return false;
};

// for nodes in components
SBGNNode.prototype.isConnectedToRing = function () {
  var self = this;

  var neighbors = self.getNeighborsList();
  var isConnectedToRing = false;

  neighbors.forEach(function (neighbor) {
    if (neighbor.pseudoClass == "ring") {
      isConnectedToRing = true;
      return true;
    }
  });

  return isConnectedToRing;
};

module.exports = SBGNNode;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(83), __esModule: true };

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(26);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(5);
var document = __webpack_require__(3).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(15);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(33);
var $export = __webpack_require__(2);
var redefine = __webpack_require__(114);
var hide = __webpack_require__(10);
var Iterators = __webpack_require__(12);
var $iterCreate = __webpack_require__(106);
var setToStringTag = __webpack_require__(21);
var getPrototypeOf = __webpack_require__(111);
var ITERATOR = __webpack_require__(4)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(43)('meta');
var isObject = __webpack_require__(5);
var has = __webpack_require__(17);
var setDesc = __webpack_require__(7).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(11)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(14);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(8);
var dPs = __webpack_require__(109);
var enumBugKeys = __webpack_require__(47);
var IE_PROTO = __webpack_require__(40)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(30)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(48).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(112);
var enumBugKeys = __webpack_require__(47);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(10);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(57)('keys');
var uid = __webpack_require__(43);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 41 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(31);
var defined = __webpack_require__(29);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 43 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(20);
var ITERATOR = __webpack_require__(4)('iterator');
var Iterators = __webpack_require__(12);
module.exports = __webpack_require__(0).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _from = __webpack_require__(26);

var _from2 = _interopRequireDefault(_from);

var _toConsumableArray2 = __webpack_require__(27);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _set = __webpack_require__(46);

var _set2 = _interopRequireDefault(_set);

var _create = __webpack_require__(13);

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CoSELayout = __webpack_require__(1).CoSELayout;
var SBGNGraphManager = __webpack_require__(65);
var SBGNGraph = __webpack_require__(64);
var SBGNNode = __webpack_require__(25);
var SBGNEdge = __webpack_require__(63);

// Constructor
function SBGNLayout() {
  CoSELayout.call(this);
}

SBGNLayout.prototype = (0, _create2.default)(CoSELayout.prototype);

for (var property in CoSELayout) {
  SBGNLayout[property] = CoSELayout[property];
}

// -----------------------------------------------------------------------------
// Section: Class methods related to Graph Manager
// -----------------------------------------------------------------------------
SBGNLayout.prototype.newGraphManager = function () {
  this.graphManager = new SBGNGraphManager(this);
  return this.graphManager;
};

SBGNLayout.prototype.newGraph = function (vGraph) {
  return new SBGNGraph(null, this.graphManager, vGraph);
};

SBGNLayout.prototype.newNode = function (vNode) {
  return new SBGNNode(this.graphManager, vNode);
};

SBGNLayout.prototype.newEdge = function (vEdge) {
  return new SBGNEdge(null, null, vEdge);
};

SBGNLayout.prototype.getAllProcessNodes = function () {
  return this.graphManager.getAllProcessNodes();
};

///////////////////////////////////////////////////////

SBGNLayout.prototype.constructSkeleton = function () {
  var _this = this;

  var queue = [];
  var allNodes = this.getAllNodes();
  var processNodes = this.getAllProcessNodes();

  // find process nodes that are suitable to be source of DFS
  processNodes.forEach(function (process) {
    var neighbors = process.getNeighborsList();
    var count = 0;
    neighbors.forEach(function (neighbor) {
      if (neighbor.getEdges().length > 1 && !neighbor.getEdgesBetween(process)[0].isModulation()) {
        count++;
      }
    });
    if (count < 2) {
      var outgoers = process.getOutgoerNodes();
      for (var i = 0; i < outgoers.length; i++) {
        if (outgoers[i].getOutgoerNodes().length > 0) {
          queue.push(process);
          break;
        }
      }
    }
  });
  console.log(queue);

  var components = [];
  var visited = new _set2.default();
  var visitedProcessNodeIds = new _set2.default();

  // run DFS on graph and find components (in skeleton format)
  while (queue.length > 0) {
    var cmpt = this.DFS(queue[0], visited, visitedProcessNodeIds, queue);
    components.push(cmpt);
    queue = queue.filter(function (element) {
      return !visitedProcessNodeIds.has(element.id);
    });
  }

  var unvisitedProcessNodes = processNodes.filter(function (process) {
    return !visitedProcessNodeIds.has(process.id);
  });

  // TO DO: put these to queue, because there may be nodes added to the beginning of queue during DFS
  // in other words, make it similar to original traversal.
  unvisitedProcessNodes.forEach(function (node) {
    var cmpt = _this.DFS(node, visited, visitedProcessNodeIds, queue);
    components.push(cmpt);
  });

  // remove components with only one node that has ring class
  for (var i = components.length - 1; i >= 0; i--) {
    if (components[i].length == 1 && components[i][0].pseudoClass == "ring") {
      components.splice(i, 1);
    }
  }

  // some postprocessing to shape components better
  var componentIndexesToBeExpanded = new _set2.default();
  components.forEach(function (component, i) {
    if (component.length == 1 && component[0].isProcess()) {
      componentIndexesToBeExpanded.add(i);
    }
  });

  componentIndexesToBeExpanded.forEach(function (index) {
    var component = components[index];
    var process = component[0];
    var candidateNode = null;
    var otherProcess = null;
    process.getIncomerNodes().forEach(function (node) {
      if (node.getOutgoerNodes().filter(function (node) {
        return node.isProcess();
      }).length > 1) {
        candidateNode = node;
      }
    });
    if (candidateNode) {
      components[index].unshift(candidateNode);
      otherProcess = candidateNode.getOutgoerNodes().filter(function (node) {
        return node.isProcess();
      }).filter(function (node) {
        return node.id != process.id;
      })[0];
      components.forEach(function (component, i) {
        if (component.includes(otherProcess)) {
          components[i].unshift(candidateNode);
        }
      });
    }
  });

  var nodesWithRingClass = new _set2.default(allNodes.filter(function (node) {
    return node.pseudoClass == "ring";
  }));
  // process components to separate ring nodes
  var componentsInfo = this.processComponents(components, nodesWithRingClass);
  components = componentsInfo.components;
  var ringNodes = componentsInfo.ringNodes;
  var directions = componentsInfo.directions;
  var verticalAlignments = componentsInfo.verticalAlignments;
  var horizontalAlignments = componentsInfo.horizontalAlignments;
  var relativePlacementConstraints = componentsInfo.relativePlacementConstraints;
  ringNodes.forEach(function (ringNode) {
    ringNode.pseudoClass = "ring";
  });
  console.log(ringNodes);
  console.log(components);

  var componentsExtended = this.extendComponents(components);

  console.log(componentsExtended);
  console.log(directions);

  var constraintInfo = this.addPerComponentConstraints(components, directions);
  verticalAlignments = verticalAlignments.concat(constraintInfo.verticalAlignments);
  horizontalAlignments = horizontalAlignments.concat(constraintInfo.horizontalAlignments);
  verticalAlignments = this.mergeArrays(verticalAlignments);
  horizontalAlignments = this.mergeArrays(horizontalAlignments);
  /*   let verticalAlignments = constraintInfo.verticalAlignments.length > 0 ? constraintInfo.verticalAlignments: undefined;
    let horizontalAlignments = constraintInfo.horizontalAlignments.length > 0 ? constraintInfo.horizontalAlignments : undefined; */
  relativePlacementConstraints = relativePlacementConstraints.concat(constraintInfo.relativePlacementConstraints);

  var constraints = { alignmentConstraint: { vertical: verticalAlignments, horizontal: horizontalAlignments }, relativePlacementConstraint: relativePlacementConstraints };
  console.log(constraints);
  return { components: components, componentsExtended: componentsExtended, ringNodes: ringNodes, constraints: constraints, directions: directions };
};

// A function used by DFS
SBGNLayout.prototype.DFSUtil = function (currentNode, component, visited, visitedProcessNodeIds, queue) {

  visited.add(currentNode.id);
  if (currentNode.isProcess()) {
    visitedProcessNodeIds.add(currentNode.id);
  }

  // Traverse all outgoer neigbors of this node
  var neighborNodes = [];
  currentNode.getOutgoerNodes().forEach(function (node) {
    if (node.getEdges().length != 1) {
      neighborNodes.push(node);
    }
  });

  if (neighborNodes.length == 1) {
    var neighbor = neighborNodes[0];
    if (neighbor.isLogicalOperator() || currentNode.getEdgesBetween(neighbor)[0].isModulation() || !neighbor.isProcess() && neighbor.getIncomerNodes().length > 1) {
      neighbor.pseudoClass = "ring";
      if (!neighbor.isProcess() && neighbor.getIncomerNodes().length > 1) {
        component.push(neighbor);
        if (!visited.has(neighbor.id)) {
          queue.unshift(neighbor);
        }
      }
    } else {
      //if (!visited.has(neighbor.id())) {
      component.push(neighbor);
      this.DFSUtil(neighbor, component, visited, visitedProcessNodeIds, queue);
      //}
    }
  } else if (neighborNodes.length > 1) {
    currentNode.pseudoClass = "ring";
    neighborNodes.forEach(function (neighbor) {
      if (neighbor.pseudoClass == "ringCandidate") {
        neighbor.pseudoClass = "ring";
      } else {
        neighbor.pseudoClass = "ringCandidate";
      }
      if (!visited.has(neighbor.id)) {
        queue.unshift(neighbor);
      }
    });
  }
};

SBGNLayout.prototype.DFS = function (node, visited, visitedProcessNodeIds, queue) {
  var cmpt = [];
  cmpt.push(node);
  queue.shift(node);
  this.DFSUtil(node, cmpt, visited, visitedProcessNodeIds, queue);
  return cmpt;
};

SBGNLayout.prototype.processComponents = function (components, nodesWithRingClass) {
  // ring nodes with 'ring' class
  var ringNodes1 = new _set2.default();
  var verticalAlignments = [];
  var horizontalAlignments = [];
  var relativePlacementConstraints = [];
  var directions = [];
  // first, process components with nodes that have ring class
  components.forEach(function (component, i) {
    if (component.length > 1) {
      var direction = [null, null];
      if (component[0].pseudoClass == "ring") {
        ringNodes1.add(component[0]);
        if (Math.abs(component[1].getCenterX() - component[0].getCenterX()) > Math.abs(component[1].getCenterY() - component[0].getCenterY())) {
          direction[0] = "horizontal";
          horizontalAlignments.push([component[0].id, component[1].id]);
          /*           if(component[1].getCenterX() > component[0].getCenterX())
                      relativePlacementConstraints.push({left: component[0].id, right: component[1].id});
                    else
                      relativePlacementConstraints.push({left: component[1].id, right: component[0].id}); */
        } else {
          direction[0] = "vertical";
          verticalAlignments.push([component[0].id, component[1].id]);
          /*           if(component[1].getCenterY() > component[0].getCenterY())
                      relativePlacementConstraints.push({top: component[0].id, bottom: component[1].id});
                    else
                      relativePlacementConstraints.push({top: component[1].id, bottom: component[0].id}); */
        }
        component = component.filter(function (node) {
          return node.id != component[0].id;
        });
        components[i] = component;
      }
      if (component[component.length - 1].pseudoClass == "ring") {
        ringNodes1.add(component[component.length - 1]);
        if (Math.abs(component[component.length - 2].getCenterX() - component[component.length - 1].getCenterX()) > Math.abs(component[component.length - 2].getCenterY() - component[component.length - 1].getCenterY())) {
          direction[1] = "horizontal";
          horizontalAlignments.push([component[component.length - 1].id, component[component.length - 2].id]);
          /*           if(component[component.length - 2].getCenterX() > component[component.length - 1].getCenterX())
                      relativePlacementConstraints.push({left: component[component.length - 1].id, right: component[component.length - 2].id});
                    else
                      relativePlacementConstraints.push({left: component[component.length - 2].id, right: component[component.length - 1].id}); */
        } else {
          direction[1] = "vertical";
          verticalAlignments.push([component[component.length - 1].id, component[component.length - 2].id]);
          /*           if(component[component.length - 2].getCenterY() > component[component.length - 1].getCenterY())
                      relativePlacementConstraints.push({top: component[component.length - 1].id, bottom: component[component.length - 2].id});
                    else
                      relativePlacementConstraints.push({top: component[component.length - 2].id, bottom: component[component.length - 1].id}); */
        }
        components[i] = component.filter(function (node) {
          return node.id != component[component.length - 1].id;
        });
      }
      if (direction[0] != null) {
        directions[i] = direction[0];
      } else if (direction[1] != null) {
        directions[i] = direction[1];
      }
    } else {
      //ringNodes1.add(component[0]);
      directions[i] = "horizontal";
    }
  });

  // ring nodes without 'ring' class
  var ringNodes2 = new _set2.default();
  // second, process components with ring nodes that doesn't have ring class
  for (var i = 0; i < components.length; i++) {
    var component = components[i];
    for (var j = i + 1; j < components.length; j++) {
      var componentToCompare = components[j];
      if (component[0].id == componentToCompare[0].id || component[0].id == componentToCompare[componentToCompare.length - 1].id) {
        var commonNode = component[0];
        ringNodes2.add(commonNode);
      }
      if (component[component.length - 1].id == componentToCompare[0].id || component[component.length - 1].id == componentToCompare[componentToCompare.length - 1].id) {
        var _commonNode = component[component.length - 1];
        ringNodes2.add(_commonNode);
      }
    }
  }

  components.forEach(function (component, i) {
    var direction = [null, null];
    if (ringNodes2.has(component[0])) {
      if (Math.abs(component[1].getCenterX() - component[0].getCenterX()) > Math.abs(component[1].getCenterY() - component[0].getCenterY())) {
        direction[0] = "horizontal";
        horizontalAlignments.push([component[0].id, component[1].id]);
        /*         if(component[1].getCenterX() > component[0].getCenterX())
                  relativePlacementConstraints.push({left: component[0].id, right: component[1].id});
                else
                  relativePlacementConstraints.push({left: component[1].id, right: component[0].id}); */
      } else {
        direction[0] = "vertical";
        verticalAlignments.push([component[0].id, component[1].id]);
        /*         if(component[1].getCenterY() > component[0].getCenterY())
                  relativePlacementConstraints.push({top: component[0].id, bottom: component[1].id});
                else
                  relativePlacementConstraints.push({top: component[1].id, bottom: component[0].id}); */
      }
      component = component.filter(function (node) {
        return node.id != component[0].id;
      });
      components[i] = component;
    }
    if (ringNodes2.has(component[component.length - 1])) {
      if (Math.abs(component[component.length - 2].getCenterX() - component[component.length - 1].getCenterX()) > Math.abs(component[component.length - 2].getCenterY() - component[component.length - 1].getCenterY())) {
        direction[1] = "horizontal";
        horizontalAlignments.push([component[component.length - 1].id, component[component.length - 2].id]);
        /*         if(component[component.length - 2].getCenterX() > component[component.length - 1].getCenterX())
                  relativePlacementConstraints.push({left: component[component.length - 1].id, right: component[component.length - 2].id});
                else
                  relativePlacementConstraints.push({left: component[component.length - 2].id, right: component[component.length - 1].id}); */
      } else {
        direction[1] = "vertical";
        verticalAlignments.push([component[component.length - 1].id, component[component.length - 2].id]);
        /*         if(component[component.length - 2].getCenterY() > component[component.length - 1].getCenterY())
                  relativePlacementConstraints.push({top: component[component.length - 1].id, bottom: component[component.length - 2].id});
                else
                  relativePlacementConstraints.push({top: component[component.length - 2].id, bottom: component[component.length - 1].id}); */
      }
      components[i] = component.filter(function (node) {
        return node.id != component[component.length - 1].id;
      });
    }
    if (!directions[i]) {
      if (direction[0] != null) {
        directions[i] = direction[0];
      } else if (direction[1] != null) {
        directions[i] = direction[1];
      } else {
        if (Math.abs(component[component.length - 1].getCenterX() - component[0].getCenterX()) > Math.abs(component[component.length - 1].getCenterY() - component[0].getCenterY())) {
          directions[i] = "horizontal";
        } else {
          directions[i] = "vertical";
        }
      }
    }
  });
  return { components: components, ringNodes: new _set2.default([].concat((0, _toConsumableArray3.default)(nodesWithRingClass), (0, _toConsumableArray3.default)(ringNodes1), (0, _toConsumableArray3.default)(ringNodes2))), directions: directions, horizontalAlignments: horizontalAlignments, verticalAlignments: verticalAlignments, relativePlacementConstraints: relativePlacementConstraints };
};

// Extend components (reaction chains) with one degree neighbors
SBGNLayout.prototype.extendComponents = function (components) {
  var componentsExtended = [];
  components.forEach(function (component, i) {
    var componentExtended = [];
    component.forEach(function (node) {
      componentExtended.push(node);
      var neighbors = node.getNeighborsList();
      neighbors.forEach(function (neighbor) {
        var edgeBetween = node.getEdgesBetween(neighbor)[0];
        if (neighbor.getEdges().length == 1) {
          componentExtended.push(neighbor);
        } else if (edgeBetween.isModulation() && edgeBetween.getSource().isLogicalOperator() && edgeBetween.getSource().pseudoClass != "ring") {
          componentExtended.push(neighbor);
          neighbor.getIncomerNodes().forEach(function (incomer) {
            componentExtended.push(incomer);
          });
        }
      });
    });
    //componentExtended.move({parent: componentParent.id()});
    //componentExtended.css('background-color', getRandomColor());
    componentsExtended.push(componentExtended);
  });
  return componentsExtended;
};

SBGNLayout.prototype.addPerComponentConstraints = function (components, directions) {
  var horizontalAlignments = [];
  var verticalAlignments = [];
  var relativePlacementConstraints = [];

  directions.forEach(function (direction, i) {
    if (direction == "horizontal" && components[i].length > 1) {
      horizontalAlignments.push(components[i].map(function (node) {
        return node.id;
      }));

      var isLeftToRight = true;
      if (components[i][0].getCenterX() > components[i][1].getCenterX()) isLeftToRight = false;

      if (isLeftToRight) {
        components[i].forEach(function (node, j) {
          if (j != components[i].length - 1) {
            relativePlacementConstraints.push({ left: node.id, right: components[i][j + 1].id });
          }
        });
      } else {
        components[i].forEach(function (node, j) {
          if (j != components[i].length - 1) {
            relativePlacementConstraints.push({ left: components[i][j + 1].id, right: node.id });
          }
        });
      }
    } else if (direction == "vertical" && components[i].length > 1) {
      verticalAlignments.push(components[i].map(function (node) {
        return node.id;
      }));

      var isTopToBottom = true;
      if (components[i][0].getCenterY() > components[i][1].getCenterY()) isTopToBottom = false;

      if (isTopToBottom) {
        components[i].forEach(function (node, j) {
          if (j != components[i].length - 1) {
            relativePlacementConstraints.push({ top: node.id, bottom: components[i][j + 1].id });
          }
        });
      } else {
        components[i].forEach(function (node, j) {
          if (j != components[i].length - 1) {
            relativePlacementConstraints.push({ top: components[i][j + 1].id, bottom: node.id });
          }
        });
      }
    }
  });

  return { horizontalAlignments: horizontalAlignments, verticalAlignments: verticalAlignments, relativePlacementConstraints: relativePlacementConstraints };
};

// auxuliary function to merge arrays with duplicates
SBGNLayout.prototype.mergeArrays = function (arrays) {
  // Function to check if two arrays have common items
  function haveCommonItems(arr1, arr2) {
    return arr1.some(function (item) {
      return arr2.includes(item);
    });
  }

  // Function to merge two arrays and remove duplicates
  function mergeAndRemoveDuplicates(arr1, arr2) {
    return (0, _from2.default)(new _set2.default([].concat((0, _toConsumableArray3.default)(arr1), (0, _toConsumableArray3.default)(arr2))));
  }

  // Loop until no more merges are possible
  var merged = false;
  do {
    merged = false;
    for (var i = 0; i < arrays.length; i++) {
      for (var j = i + 1; j < arrays.length; j++) {
        if (haveCommonItems(arrays[i], arrays[j])) {
          // Merge the arrays
          arrays[i] = mergeAndRemoveDuplicates(arrays[i], arrays[j]);
          // Remove the merged array
          arrays.splice(j, 1);
          // Set merged to true to indicate a merge has occurred
          merged = true;
          break;
        }
      }
      if (merged) {
        break;
      }
    }
  } while (merged);

  return arrays;
};

module.exports = SBGNLayout;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(92), __esModule: true };

/***/ }),
/* 47 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(3).document;
module.exports = document && document.documentElement;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(12);
var ITERATOR = __webpack_require__(4)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(8);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(4)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(2);
var core = __webpack_require__(0);
var fails = __webpack_require__(11);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(8);
var isObject = __webpack_require__(5);
var newPromiseCapability = __webpack_require__(35);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(3);
var core = __webpack_require__(0);
var dP = __webpack_require__(7);
var DESCRIPTORS = __webpack_require__(6);
var SPECIES = __webpack_require__(4)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(0);
var global = __webpack_require__(3);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(33) ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(8);
var aFunction = __webpack_require__(14);
var SPECIES = __webpack_require__(4)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(9);
var invoke = __webpack_require__(104);
var html = __webpack_require__(48);
var cel = __webpack_require__(30);
var global = __webpack_require__(3);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(15)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(5);
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};


/***/ }),
/* 61 */
/***/ (function(module, exports) {



/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(82);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(78);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = __webpack_require__(79);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(80);

var _createClass3 = _interopRequireDefault(_createClass2);

var _freeze = __webpack_require__(75);

var _freeze2 = _interopRequireDefault(_freeze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  The implementation of the sbgn layout algorithm
*/

var HashMap = __webpack_require__(1).layoutBase.HashMap;
var PointD = __webpack_require__(1).layoutBase.PointD;
var DimensionD = __webpack_require__(1).layoutBase.DimensionD;
var RectangleD = __webpack_require__(1).layoutBase.RectangleD;
var Integer = __webpack_require__(1).layoutBase.Integer;
var LayoutConstants = __webpack_require__(1).layoutBase.LayoutConstants;
var SBGNConstants = __webpack_require__(24);
var CoSEConstants = __webpack_require__(1).CoSEConstants;
var FDLayoutConstants = __webpack_require__(1).layoutBase.FDLayoutConstants;
var SBGNLayout = __webpack_require__(45);
var SBGNNode = __webpack_require__(25);
var SBGNPolishing = __webpack_require__(66);
var SBGNPolishingNew = __webpack_require__(67);
var sketchLay = __webpack_require__(140);

var assign = __webpack_require__(69);
var glyphMapping = __webpack_require__(68);
var isFn = function isFn(fn) {
  return typeof fn === 'function';
};

var optFn = function optFn(opt, ele) {
  if (isFn(opt)) {
    return opt(ele);
  } else {
    return opt;
  }
};

var defaults = (0, _freeze2.default)({
  animate: 'end', // whether to show the layout as it's running; special 'end' value makes the layout animate like a discrete layout
  animationDuration: 1000,
  refresh: 30, // number of ticks per frame; higher is faster but more jerky
  //maxIterations: 2500, // max iterations before the layout will bail out
  //maxSimulationTime: 5000, // max length in ms to run the layout
  ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  fit: true, // on every layout reposition of nodes, fit the viewport
  padding: 30, // padding around the simulation
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  // infinite layout options
  infinite: false, // overrides all other options for a forces-all-the-time mode

  // map type - PD or AF
  mapType: "PD",
  // slope threshold to decide orientation during polishing
  slopeThreshold: 0.5,
  // positioning options
  randomize: true, // use random node positions at beginning of layout
  // Include labels in node dimensions
  nodeDimensionsIncludeLabels: false,
  // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
  uniformNodeDimensions: false,
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: 4500,
  // Ideal edge (non nested) length
  idealEdgeLength: 75,
  // Divisor to compute edge forces
  edgeElasticity: 0.45,
  // Nesting factor (multiplier) to compute ideal edge length for nested edges
  nestingFactor: 0.1,
  // For enabling tiling
  tile: true,
  // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingVertical: 10,
  // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingHorizontal: 10,
  // Gravity force (constant)
  gravity: 0.25,
  // Gravity range (constant) for compounds
  gravityRangeCompound: 1.5,
  // Gravity force (constant) for compounds
  gravityCompound: 1.0,
  // Gravity range (constant)
  gravityRange: 3.8,
  // Initial cooling factor for incremental layout
  initialEnergyOnIncremental: 0.5,

  // layout event callbacks
  ready: function ready() {}, // on layoutready
  stop: function stop() {}, // on layoutstop

  // sketchlay option
  imageData: undefined,
  subset: undefined
});

var getUserOptions = function getUserOptions(options) {
  if (options.nestingFactor != null) SBGNConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = CoSEConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = options.nestingFactor;
  if (options.numIter != null) SBGNConstants.MAX_ITERATIONS = FDLayoutConstants.MAX_ITERATIONS = options.numIter;
  if (options.gravity != null) SBGNConstants.DEFAULT_GRAVITY_STRENGTH = CoSEConstants.DEFAULT_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH = options.gravity;
  if (options.gravityRange != null) SBGNConstants.DEFAULT_GRAVITY_RANGE_FACTOR = CoSEConstants.DEFAULT_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR = options.gravityRange;
  if (options.gravityCompound != null) SBGNConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = CoSEConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = options.gravityCompound;
  if (options.gravityRangeCompound != null) SBGNConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = CoSEConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = options.gravityRangeCompound;
  if (options.initialEnergyOnIncremental != null) SBGNConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = CoSEConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = options.initialEnergyOnIncremental;

  SBGNConstants.TILE = CoSEConstants.TILE = options.tile;
  if (options.tilingCompareBy != null) SBGNConstants.TILING_COMPARE_BY = CoSEConstants.TILING_COMPARE_BY = options.tilingCompareBy;

  SBGNConstants.TILING_PADDING_VERTICAL = CoSEConstants.TILING_PADDING_VERTICAL = typeof options.tilingPaddingVertical === 'function' ? options.tilingPaddingVertical.call() : options.tilingPaddingVertical;
  SBGNConstants.TILING_PADDING_HORIZONTAL = CoSEConstants.TILING_PADDING_HORIZONTAL = typeof options.tilingPaddingHorizontal === 'function' ? options.tilingPaddingHorizontal.call() : options.tilingPaddingHorizontal;

  SBGNConstants.NODE_DIMENSIONS_INCLUDE_LABELS = CoSEConstants.NODE_DIMENSIONS_INCLUDE_LABELS = FDLayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = options.nodeDimensionsIncludeLabels;
  SBGNConstants.DEFAULT_INCREMENTAL = CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = !options.randomize;
  SBGNConstants.ANIMATE = CoSEConstants.ANIMATE = FDLayoutConstants.ANIMATE = LayoutConstants.ANIMATE = options.animate;
  SBGNConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = options.idealEdgeLength;
  LayoutConstants.DEFAULT_UNIFORM_LEAF_NODE_SIZES = options.uniformNodeDimensions;
};

var Layout = function () {
  function Layout(options) {
    (0, _classCallCheck3.default)(this, Layout);

    this.options = assign({}, defaults, options);
    getUserOptions(this.options);
  }

  (0, _createClass3.default)(Layout, [{
    key: 'run',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var layout, options, cy, eles, nodes, edges, self, sbgnLayout, graphManager, randomize, sketchConstraints, sketchLayResult, constraints, getPositions;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                layout = this;
                options = this.options;
                cy = options.cy;
                eles = options.eles;
                nodes = eles.nodes();
                edges = eles.edges();
                self = this;


                this.idToLNode = {};
                //Initialize SBGN elements
                sbgnLayout = this.sbgnLayout = new SBGNLayout();
                graphManager = this.graphManager = sbgnLayout.newGraphManager();

                this.root = graphManager.addRoot();

                // Establishing node relations in the GraphManager object
                this.processChildrenList(this.root, this.getTopMostNodes(nodes), sbgnLayout);
                this.processEdges(this.options, sbgnLayout, graphManager, edges);

                randomize = false;
                sketchConstraints = undefined;

                if (!this.options.imageData) {
                  _context.next = 23;
                  break;
                }

                _context.next = 18;
                return sketchLay.generateConstraints({ cy: this.options.cy, imageData: this.options.imageData, subset: this.options.subset, idealEdgeLength: this.options.idealEdgeLength });

              case 18:
                sketchLayResult = _context.sent;

                sketchConstraints = sketchLayResult.constraints;
                if (sketchConstraints.alignmentConstraint && sketchConstraints.relativePlacementConstraint) {
                  randomize = false; // so no tree reduction is applied
                } else {
                  randomize = options.randomize;
                }
                _context.next = 24;
                break;

              case 23:
                randomize = options.randomize;

              case 24:

                if (!randomize) {
                  CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = true;
                } else {
                  CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = false;
                }

                if (!randomize) {
                  if (sketchConstraints && sketchConstraints.alignmentConstraint && sketchConstraints.relativePlacementConstraint) {
                    sbgnLayout.constraints["alignmentConstraint"] = sketchConstraints.alignmentConstraint;
                    sbgnLayout.constraints["relativePlacementConstraint"] = sketchConstraints.relativePlacementConstraint;
                    graphManager.allNodesToApplyGravitation = undefined;
                    sbgnLayout.initParameters();
                    sbgnLayout.initSpringEmbedder();
                    CoSEConstants.TREE_REDUCTION_ON_INCREMENTAL = false;
                    CoSEConstants.TILE = false;
                    sbgnLayout.runLayout();
                  }
                } else {
                  sbgnLayout.initParameters();
                  sbgnLayout.initSpringEmbedder();
                  CoSEConstants.TILE = false;
                  sbgnLayout.runLayout();
                }

                // polishment phase
                constraints = SBGNPolishingNew.generateConstraints(sbgnLayout, this.options.mapType, this.options.slopeThreshold);

                sbgnLayout.constraints["alignmentConstraint"] = constraints.alignmentConstraint;
                sbgnLayout.constraints["relativePlacementConstraint"] = constraints.relativePlacementConstraint;

                graphManager.allNodesToApplyGravitation = undefined;
                sbgnLayout.initParameters();
                sbgnLayout.initSpringEmbedder();
                CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = true;
                CoSEConstants.TREE_REDUCTION_ON_INCREMENTAL = false;
                CoSEConstants.TILE = false;
                sbgnLayout.runLayout();
                if (this.options.mapType == "PD") {
                  SBGNPolishingNew.polish(sbgnLayout);
                }
                //sbgnLayout.repopulateCompounds();

                getPositions = function getPositions(ele, i) {
                  if (typeof ele === "number") {
                    ele = i;
                  }
                  var theId = ele.data('id');
                  var lNode = self.idToLNode[theId];

                  return {
                    x: lNode.getRect().getCenterX(),
                    y: lNode.getRect().getCenterY()
                  };
                };

                eles.nodes().not(":parent").layoutPositions(layout, options, getPositions);

              case 39:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function run() {
        return _ref.apply(this, arguments);
      }

      return run;
    }()

    // Note: Taken from CoSE-Bilkent !!

  }, {
    key: 'processChildrenList',
    value: function processChildrenList(parent, children, layout) {
      var size = children.length;
      for (var i = 0; i < size; i++) {
        var theChild = children[i];
        var children_of_children = theChild.children();
        var theNode = void 0;

        var dimensions = theChild.layoutDimensions({
          nodeDimensionsIncludeLabels: false
        });

        if (theChild.outerWidth() != null && theChild.outerHeight() != null) {
          theNode = parent.add(new SBGNNode(layout.graphManager, new PointD(theChild.position('x') - dimensions.w / 2, theChild.position('y') - dimensions.h / 2), new DimensionD(parseFloat(dimensions.w), parseFloat(dimensions.h))));
        } else {
          theNode = parent.add(new SBGNNode(this.graphManager));
        }
        // Attach id and class to the layout node
        theNode.id = theChild.data("id");
        theNode.class = theChild.data("class") && glyphMapping.isSbgnGlyph(theChild.data("class")) ? theChild.data("class") : theChild.classes() ? glyphMapping.getGlyph(theChild.classes()) : undefined;

        // Attach the paddings of cy node to layout node
        theNode.paddingLeft = parseInt(theChild.css('padding'));
        theNode.paddingTop = parseInt(theChild.css('padding'));
        theNode.paddingRight = parseInt(theChild.css('padding'));
        theNode.paddingBottom = parseInt(theChild.css('padding'));

        // Map the layout node
        this.idToLNode[theChild.data("id")] = theNode;

        if (isNaN(theNode.rect.x)) {
          theNode.rect.x = 0;
        }

        if (isNaN(theNode.rect.y)) {
          theNode.rect.y = 0;
        }

        if (children_of_children != null && children_of_children.length > 0) {
          var theNewGraph = void 0;
          theNewGraph = layout.getGraphManager().add(layout.newGraph(), theNode);
          this.processChildrenList(theNewGraph, children_of_children, layout);
        }
      }
    }
  }, {
    key: 'processEdges',
    value: function processEdges(options, layout, gm, edges) {
      var idealLengthTotal = 0;
      var edgeCount = 0;
      for (var i = 0; i < edges.length; i++) {
        var edge = edges[i];
        var sourceNode = this.idToLNode[edge.data("source")];
        var targetNode = this.idToLNode[edge.data("target")];
        if (sourceNode && targetNode && sourceNode !== targetNode && sourceNode.getEdgesBetween(targetNode).length == 0) {
          var e1 = gm.add(layout.newEdge(), sourceNode, targetNode);
          e1.id = edge.id();
          e1.idealLength = optFn(options.idealEdgeLength, edge);
          e1.edgeElasticity = optFn(options.edgeElasticity, edge);
          e1.class = edge.data("class");
          idealLengthTotal += e1.idealLength;
          edgeCount++;
        }
      }
      // we need to update the ideal edge length constant with the avg. ideal length value after processing edges
      // in case there is no edge, use other options
      if (options.idealEdgeLength != null) {
        if (edgeCount > 0) SBGNConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = idealLengthTotal / edgeCount;else if (!isFn(options.idealEdgeLength)) // in case there is no edge, but option gives a value to use
          SBGNConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = options.idealEdgeLength;else // in case there is no edge and we cannot get a value from option (because it's a function)
          SBGNConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = 50;
        // we need to update these constant values based on the ideal edge length constant
        SBGNConstants.MIN_REPULSION_DIST = CoSEConstants.MIN_REPULSION_DIST = FDLayoutConstants.MIN_REPULSION_DIST = FDLayoutConstants.DEFAULT_EDGE_LENGTH / 10.0;
        SBGNConstants.DEFAULT_RADIAL_SEPARATION = CoSEConstants.DEFAULT_RADIAL_SEPARATION = FDLayoutConstants.DEFAULT_EDGE_LENGTH;
      }
    }

    // Get the top most ones of a list of nodes
    // Note: Taken from CoSE-Bilkent !!

  }, {
    key: 'getTopMostNodes',
    value: function getTopMostNodes(nodes) {
      var nodesMap = {};
      for (var i = 0; i < nodes.length; i++) {
        nodesMap[nodes[i].id()] = true;
      }
      return nodes.filter(function (ele, i) {
        if (typeof ele === "number") {
          ele = i;
        }
        var parent = ele.parent()[0];
        while (parent != null) {
          if (nodesMap[parent.id()]) {
            return false;
          }
          parent = parent.parent()[0];
        }
        return true;
      });
    }
  }]);
  return Layout;
}();

module.exports = Layout;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _create = __webpack_require__(13);

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CoSEEdge = __webpack_require__(1).CoSEEdge;

function SBGNEdge(source, target, vEdge) {
  CoSEEdge.call(this, source, target, vEdge);

  // SBGN class of edge (such as consumption, production etc.)
  this.class = null;
}

SBGNEdge.prototype = (0, _create2.default)(CoSEEdge.prototype);
for (var prop in CoSEEdge) {
  SBGNEdge[prop] = CoSEEdge[prop];
}

SBGNEdge.prototype.isModulation = function () {
  var self = this;
  if (self.class == "modulation" || self.class == "stimulation" || self.class == "catalysis" || self.class == "inhibition" || self.class == "necessary stimulation") return true;else return false;
};

module.exports = SBGNEdge;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _create = __webpack_require__(13);

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CoSEGraph = __webpack_require__(1).CoSEGraph;

function SBGNGraph(parent, graphMgr, vGraph) {
  CoSEGraph.call(this, parent, graphMgr, vGraph);
}

SBGNGraph.prototype = (0, _create2.default)(CoSEGraph.prototype);

for (var prop in CoSEGraph) {
  SBGNGraph[prop] = CoSEGraph[prop];
}

module.exports = SBGNGraph;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _create = __webpack_require__(13);

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CoSEGraphManager = __webpack_require__(1).CoSEGraphManager;

function SBGNGraphManager(layout) {
  CoSEGraphManager.call(this, layout);
}

SBGNGraphManager.prototype = (0, _create2.default)(CoSEGraphManager.prototype);

for (var prop in CoSEGraphManager) {
  SBGNGraphManager[prop] = CoSEGraphManager[prop];
}

SBGNGraphManager.prototype.getAllProcessNodes = function () {
  var nodeList = [];
  var graphs = this.getGraphs();
  var s = graphs.length;
  for (var i = 0; i < s; i++) {
    nodeList = nodeList.concat(graphs[i].getNodes());
  }
  var processNodeList = nodeList.filter(function (node) {
    if (node.isProcess()) return true;else return false;
  });
  this.processNodes = processNodeList;

  return this.processNodes;
};

module.exports = SBGNGraphManager;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _toConsumableArray2 = __webpack_require__(27);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SBGNConstants = __webpack_require__(24);

function SBGNPolishing() {}

SBGNPolishing.addPerComponentPolishment = function (components, directions) {
  var horizontalAlignments = [];
  var verticalAlignments = [];
  var relativePlacementConstraints = [];

  var idealEdgeLength = SBGNConstants.DEFAULT_EDGE_LENGTH;

  var calculatePosition = function calculatePosition(nodeA, nodeB, idealEdgeLength, degree) {
    if (degree == 0) {
      return { x: nodeA.getCenterX() + (nodeA.getWidth() / 2 + nodeB.getWidth() / 2 + idealEdgeLength), y: nodeA.getCenterY() };
    } else if (degree == 90) {
      return { x: nodeA.getCenterX(), y: nodeA.getCenterY() - (nodeA.getHeight() / 2 + nodeB.getHeight() / 2 + idealEdgeLength) };
    } else if (degree == 180) {
      return { x: nodeA.getCenterX() - (nodeA.getWidth() / 2 + nodeB.getWidth() / 2 + idealEdgeLength), y: nodeA.getCenterY() };
    } else if (degree == 270) {
      return { x: nodeA.getCenterX(), y: nodeA.getCenterY() + (nodeA.getHeight() / 2 + nodeB.getHeight() / 2 + idealEdgeLength) };
    } else {
      var radian = degree * Math.PI / 180;
      var radius = idealEdgeLength / 2 + (nodeA.getDiagonal() / 2 + nodeB.getDiagonal() / 2);
      return { x: nodeA.getCenterX() + radius * Math.cos(radian), y: nodeA.getCenterY() - radius * Math.sin(radian) };
    }
  };

  var placeLogicalOperators = function placeLogicalOperators(modulator, a1, a2, a3) {
    var incomers = modulator.getIncomerNodes();
    if (incomers.length == 1) {
      var position = calculatePosition(modulator, incomers[0], idealEdgeLength, a1);
      incomers[0].setCenter(position.x, position.y);
    } else if (incomers.length == 2) {
      var _position = calculatePosition(modulator, incomers[0], idealEdgeLength, a2);
      incomers[0].setCenter(_position.x, _position.y);
      _position = calculatePosition(modulator, incomers[1], idealEdgeLength, a3);
      incomers[1].setCenter(_position.x, _position.y);
    }
  };

  var findOrientation = function findOrientation(direction, edgeBetween) {
    if (edgeBetween) {
      var source = edgeBetween.getSource();
      var target = edgeBetween.getTarget();
      if (direction == "horizontal") {
        if (source.getCenterX() > target.getCenterX()) return "right-to-left";else return "left-to-right";
      } else {
        if (source.getCenterY() > target.getCenterY()) return "bottom-to-top";else return "top-to-bottom";
      }
    } else {
      if (direction == "horizontal") {
        return "left-to-right";
      } else {
        return "top-to-bottom";
      }
    }
  };

  // first process input nodes (except modulators)
  components.forEach(function (component, i) {
    var orientation = "";
    if (component.length > 1) {
      var edgeBetween = component[0].getEdgesBetween(component[1])[0];
      orientation = findOrientation(directions[i], edgeBetween);
    } else if (component.length == 1) {
      var ringNeighbors = [].concat((0, _toConsumableArray3.default)(component[0].getNeighborsList())).filter(function (neighbor) {
        return neighbor.pseudoClass == "ring";
      });
      if (ringNeighbors.length == 0) {
        orientation = findOrientation(directions[i]);
      } else if (ringNeighbors.length == 1) {
        var ringNeighbor = ringNeighbors[0];
        var _edgeBetween = component[0].getEdgesBetween(ringNeighbor)[0];
        orientation = findOrientation(directions[i], _edgeBetween);
      }
    }

    component.forEach(function (node, j) {
      var incomers = node.getIncomerNodes();
      var outgoers = node.getOutgoerNodes();
      // find input nodes (filter ring nodes, modulator nodes and input with degree higher than 1)
      var inputs = incomers.filter(function (input) {
        var edgeBetween = node.getEdgesBetween(input)[0];
        if (input.pseudoClass == "ring" || edgeBetween.class == "modulation" || edgeBetween.class == "stimulation" || edgeBetween.class == "catalysis" || edgeBetween.class == "inhibition" || edgeBetween.class == "necessary stimulation" || input.getNeighborsList().size > 1) {
          return false;
        } else {
          return true;
        }
      });
      // find modulator nodes (filter ring nodes, non-modulator nodes and input with degree higher than 1)
      var modulators = incomers.filter(function (input) {
        var edgeBetween = node.getEdgesBetween(input)[0];
        if (input.pseudoClass != "ring" && (edgeBetween.class == "modulation" || edgeBetween.class == "stimulation" || edgeBetween.class == "catalysis" || edgeBetween.class == "inhibition" || edgeBetween.class == "necessary stimulation") && (input.getNeighborsList().size == 1 || input.isLogicalOperator())) {
          return true;
        } else {
          return false;
        }
      });
      // find output nodes (filter ring nodes, modulator nodes and output with degree higher than 1)
      var outputs = outgoers.filter(function (output) {
        var edgeBetween = node.getEdgesBetween(output)[0];
        if (output.pseudoClass == "ring" || edgeBetween.class == "modulation" || edgeBetween.class == "stimulation" || edgeBetween.class == "catalysis" || edgeBetween.class == "inhibition" || edgeBetween.class == "necessary stimulation" || output.getNeighborsList().size > 1) {
          return false;
        } else {
          return true;
        }
      });
      if (j == 0 && !node.isConnectedToRing()) {
        // first node and not connected to ring
        if (orientation == "left-to-right") {
          // process inputs
          if (inputs.length == 1) {
            var position = calculatePosition(node, inputs[0], idealEdgeLength, 180);
            inputs[0].setCenter(position.x, position.y);
            horizontalAlignments.push([node, inputs[0]]);
          } else if (inputs.length == 2) {
            var _position2 = calculatePosition(node, inputs[0], idealEdgeLength, 135);
            inputs[0].setCenter(_position2.x, _position2.y);
            _position2 = calculatePosition(node, inputs[1], idealEdgeLength, 225);
            inputs[1].setCenter(_position2.x, _position2.y);
          } else if (inputs.length == 3) {
            var _position3 = calculatePosition(node, inputs[0], idealEdgeLength, 135);
            inputs[0].setCenter(_position3.x, _position3.y);
            _position3 = calculatePosition(node, inputs[1], idealEdgeLength, 180);
            inputs[1].setCenter(_position3.x, _position3.y);
            _position3 = calculatePosition(node, inputs[2], idealEdgeLength, 225);
            inputs[2].setCenter(_position3.x, _position3.y);
            horizontalAlignments.push([node, inputs[1]]);
          } else if (inputs.length > 3) {
            var _position4 = calculatePosition(node, inputs[0], idealEdgeLength, 126);
            inputs[0].setCenter(_position4.x, _position4.y);
            _position4 = calculatePosition(node, inputs[1], idealEdgeLength, 162);
            inputs[1].setCenter(_position4.x, _position4.y);
            _position4 = calculatePosition(node, inputs[2], idealEdgeLength, 198);
            inputs[2].setCenter(_position4.x, _position4.y);
            _position4 = calculatePosition(node, inputs[3], idealEdgeLength, 234);
            inputs[3].setCenter(_position4.x, _position4.y);
            inputs.forEach(function (input) {
              relativePlacementConstraints.push({ left: input.id, right: node.id });
            });
          }
          // process modulators
          if (modulators.length == 1) {
            var _position5 = calculatePosition(node, modulators[0], idealEdgeLength, 90);
            modulators[0].setCenter(_position5.x, _position5.y);
            verticalAlignments.push([node, modulators[0]]);
          } else if (modulators.length >= 2) {
            var _position6 = calculatePosition(node, modulators[0], idealEdgeLength, 90);
            modulators[0].setCenter(_position6.x, _position6.y);
            _position6 = calculatePosition(node, modulators[1], idealEdgeLength, 270);
            modulators[1].setCenter(_position6.x, _position6.y);
            if (modulators[2]) {
              if (inputs.length == 1) {
                _position6 = calculatePosition(node, modulators[2], idealEdgeLength, 135);
                modulators[2].setCenter(_position6.x, _position6.y);
              }
              if (inputs.length == 2) {
                _position6 = calculatePosition(node, modulators[2], idealEdgeLength, 180);
                modulators[2].setCenter(_position6.x, _position6.y);
              }
            }
          }
          // process outputs
          if (outputs.length == 1) {
            var _position7 = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(_position7.x, _position7.y);
          } else if (outputs.length == 2) {
            var _position8 = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(_position8.x, _position8.y);
            _position8 = calculatePosition(node, outputs[1], idealEdgeLength, 45);
            outputs[1].setCenter(_position8.x, _position8.y);
          } else if (outputs.length > 2) {
            var _position9 = calculatePosition(node, outputs[0], idealEdgeLength, 330);
            outputs[0].setCenter(_position9.x, _position9.y);
            _position9 = calculatePosition(node, outputs[1], idealEdgeLength, 30);
            outputs[1].setCenter(_position9.x, _position9.y);
            if (outputs[2]) {
              _position9 = calculatePosition(node, outputs[2], idealEdgeLength, 310);
              outputs[2].setCenter(_position9.x, _position9.y);
              if (outputs[3]) {
                _position9 = calculatePosition(node, outputs[3], idealEdgeLength, 60);
                outputs[3].setCenter(_position9.x, _position9.y);
              }
            }
          }
        }
        if (orientation == "right-to-left") {
          // process inputs
          if (inputs.length == 1) {
            var _position10 = calculatePosition(node, inputs[0], idealEdgeLength, 0);
            inputs[0].setCenter(_position10.x, _position10.y);
            horizontalAlignments.push([node, inputs[0]]);
          } else if (inputs.length == 2) {
            var _position11 = calculatePosition(node, inputs[0], idealEdgeLength, 45);
            inputs[0].setCenter(_position11.x, _position11.y);
            _position11 = calculatePosition(node, inputs[1], idealEdgeLength, 315);
            inputs[1].setCenter(_position11.x, _position11.y);
          } else if (inputs.length == 3) {
            var _position12 = calculatePosition(node, inputs[0], idealEdgeLength, 45);
            inputs[0].setCenter(_position12.x, _position12.y);
            _position12 = calculatePosition(node, inputs[1], idealEdgeLength, 0);
            inputs[1].setCenter(_position12.x, _position12.y);
            _position12 = calculatePosition(node, inputs[2], idealEdgeLength, 315);
            inputs[2].setCenter(_position12.x, _position12.y);
            horizontalAlignments.push([node, inputs[1]]);
          } else if (inputs.length > 3) {
            var _position13 = calculatePosition(node, inputs[0], idealEdgeLength, 36);
            inputs[0].setCenter(_position13.x, _position13.y);
            _position13 = calculatePosition(node, inputs[1], idealEdgeLength, 324);
            inputs[1].setCenter(_position13.x, _position13.y);
            _position13 = calculatePosition(node, inputs[2], idealEdgeLength, 72);
            inputs[2].setCenter(_position13.x, _position13.y);
            _position13 = calculatePosition(node, inputs[3], idealEdgeLength, 288);
            inputs[3].setCenter(_position13.x, _position13.y);
            inputs.forEach(function (input) {
              relativePlacementConstraints.push({ left: input.id, right: node.id });
            });
          }
          // process modulators
          if (modulators.length == 1) {
            var _position14 = calculatePosition(node, modulators[0], idealEdgeLength, 270);
            modulators[0].setCenter(_position14.x, _position14.y);
            verticalAlignments.push([node, modulators[0]]);
          } else if (modulators.length >= 2) {
            var _position15 = calculatePosition(node, modulators[0], idealEdgeLength, 90);
            modulators[0].setCenter(_position15.x, _position15.y);
            _position15 = calculatePosition(node, modulators[1], idealEdgeLength, 270);
            modulators[1].setCenter(_position15.x, _position15.y);
            if (modulators[2]) {
              if (inputs.length == 1) {
                _position15 = calculatePosition(node, modulators[2], idealEdgeLength, 45);
                modulators[2].setCenter(_position15.x, _position15.y);
              }
              if (inputs.length == 2) {
                _position15 = calculatePosition(node, modulators[2], idealEdgeLength, 0);
                modulators[2].setCenter(_position15.x, _position15.y);
              }
            }
          }
          // process outputs
          if (outputs.length == 1) {

            var _position16 = calculatePosition(node, outputs[0], idealEdgeLength, 225);
            outputs[0].setCenter(_position16.x, _position16.y);
          } else if (outputs.length == 2) {
            var _position17 = calculatePosition(node, outputs[0], idealEdgeLength, 135);
            outputs[0].setCenter(_position17.x, _position17.y);
            _position17 = calculatePosition(node, outputs[1], idealEdgeLength, 225);
            outputs[1].setCenter(_position17.x, _position17.y);
          } else if (outputs.length > 2) {
            var _position18 = calculatePosition(node, outputs[0], idealEdgeLength, 210);
            outputs[0].setCenter(_position18.x, _position18.y);
            _position18 = calculatePosition(node, outputs[1], idealEdgeLength, 150);
            outputs[1].setCenter(_position18.x, _position18.y);
            if (outputs[2]) {
              _position18 = calculatePosition(node, outputs[2], idealEdgeLength, 240);
              outputs[2].setCenter(_position18.x, _position18.y);
              if (outputs[3]) {
                _position18 = calculatePosition(node, outputs[3], idealEdgeLength, 120);
                outputs[3].setCenter(_position18.x, _position18.y);
              }
            }
          }
        }
        if (orientation == "top-to-bottom") {
          // process inputs
          if (inputs.length == 1) {
            var _position19 = calculatePosition(node, inputs[0], idealEdgeLength, 90);
            inputs[0].setCenter(_position19.x, _position19.y);
            verticalAlignments.push([node, inputs[0]]);
          } else if (inputs.length == 2) {
            var _position20 = calculatePosition(node, inputs[0], idealEdgeLength, 45);
            inputs[0].setCenter(_position20.x, _position20.y);
            _position20 = calculatePosition(node, inputs[1], idealEdgeLength, 135);
            inputs[1].setCenter(_position20.x, _position20.y);
          } else if (inputs.length == 3) {
            var _position21 = calculatePosition(node, inputs[0], idealEdgeLength, 45);
            inputs[0].setCenter(_position21.x, _position21.y);
            _position21 = calculatePosition(node, inputs[1], idealEdgeLength, 90);
            inputs[1].setCenter(_position21.x, _position21.y);
            _position21 = calculatePosition(node, inputs[2], idealEdgeLength, 135);
            inputs[2].setCenter(_position21.x, _position21.y);
            horizontalAlignments.push([node, inputs[1]]);
          } else if (inputs.length > 3) {
            var _position22 = calculatePosition(node, inputs[0], idealEdgeLength, 72);
            inputs[0].setCenter(_position22.x, _position22.y);
            _position22 = calculatePosition(node, inputs[1], idealEdgeLength, 108);
            inputs[1].setCenter(_position22.x, _position22.y);
            _position22 = calculatePosition(node, inputs[2], idealEdgeLength, 36);
            inputs[2].setCenter(_position22.x, _position22.y);
            _position22 = calculatePosition(node, inputs[3], idealEdgeLength, 144);
            inputs[3].setCenter(_position22.x, _position22.y);
            inputs.forEach(function (input) {
              relativePlacementConstraints.push({ left: input.id, right: node.id });
            });
          }
          // process modulators
          if (modulators.length == 1) {
            var _position23 = calculatePosition(node, modulators[0], idealEdgeLength, 0);
            modulators[0].setCenter(_position23.x, _position23.y);
            horizontalAlignments.push([node, modulators[0]]);
          } else if (modulators.length >= 2) {
            var _position24 = calculatePosition(node, modulators[0], idealEdgeLength, 180);
            modulators[0].setCenter(_position24.x, _position24.y);
            _position24 = calculatePosition(node, modulators[1], idealEdgeLength, 0);
            modulators[1].setCenter(_position24.x, _position24.y);
            if (modulators[2]) {
              if (inputs.length == 1) {
                _position24 = calculatePosition(node, modulators[2], idealEdgeLength, 135);
                modulators[2].setCenter(_position24.x, _position24.y);
              }
              if (inputs.length == 2) {
                _position24 = calculatePosition(node, modulators[2], idealEdgeLength, 90);
                modulators[2].setCenter(_position24.x, _position24.y);
              }
            }
          }
          // process outputs
          if (outputs.length == 1) {
            var _position25 = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(_position25.x, _position25.y);
          } else if (outputs.length == 2) {
            var _position26 = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(_position26.x, _position26.y);
            _position26 = calculatePosition(node, outputs[1], idealEdgeLength, 225);
            outputs[1].setCenter(_position26.x, _position26.y);
          } else if (outputs.length > 2) {
            var _position27 = calculatePosition(node, outputs[0], idealEdgeLength, 300);
            outputs[0].setCenter(_position27.x, _position27.y);
            _position27 = calculatePosition(node, outputs[1], idealEdgeLength, 240);
            outputs[1].setCenter(_position27.x, _position27.y);
            if (outputs[2]) {
              _position27 = calculatePosition(node, outputs[2], idealEdgeLength, 330);
              outputs[2].setCenter(_position27.x, _position27.y);
              if (outputs[3]) {
                _position27 = calculatePosition(node, outputs[3], idealEdgeLength, 210);
                outputs[3].setCenter(_position27.x, _position27.y);
              }
            }
          }
        }
        if (orientation == "bottom-to-top") {
          // process inputs
          if (inputs.length == 1) {
            var _position28 = calculatePosition(node, inputs[0], idealEdgeLength, 270);
            inputs[0].setCenter(_position28.x, _position28.y);
            verticalAlignments.push([node, inputs[0]]);
          } else if (inputs.length == 2) {
            var _position29 = calculatePosition(node, inputs[0], idealEdgeLength, 315);
            inputs[0].setCenter(_position29.x, _position29.y);
            _position29 = calculatePosition(node, inputs[1], idealEdgeLength, 225);
            inputs[1].setCenter(_position29.x, _position29.y);
          } else if (inputs.length == 3) {
            var _position30 = calculatePosition(node, inputs[0], idealEdgeLength, 315);
            inputs[0].setCenter(_position30.x, _position30.y);
            _position30 = calculatePosition(node, inputs[1], idealEdgeLength, 270);
            inputs[1].setCenter(_position30.x, _position30.y);
            _position30 = calculatePosition(node, inputs[2], idealEdgeLength, 225);
            inputs[2].setCenter(_position30.x, _position30.y);
            verticalAlignments.push([node, inputs[1]]);
          } else if (inputs.length > 3) {
            var _position31 = calculatePosition(node, inputs[0], idealEdgeLength, 288);
            inputs[0].setCenter(_position31.x, _position31.y);
            _position31 = calculatePosition(node, inputs[1], idealEdgeLength, 252);
            inputs[1].setCenter(_position31.x, _position31.y);
            _position31 = calculatePosition(node, inputs[2], idealEdgeLength, 324);
            inputs[2].setCenter(_position31.x, _position31.y);
            _position31 = calculatePosition(node, inputs[3], idealEdgeLength, 216);
            inputs[3].setCenter(_position31.x, _position31.y);
          }
          // process modulators
          if (modulators.length == 1) {
            var _position32 = calculatePosition(node, modulators[0], idealEdgeLength, 180);
            modulators[0].setCenter(_position32.x, _position32.y);
            horizontalAlignments.push([node, modulators[0]]);
          } else if (modulators.length >= 2) {
            var _position33 = calculatePosition(node, modulators[0], idealEdgeLength, 180);
            modulators[0].setCenter(_position33.x, _position33.y);
            _position33 = calculatePosition(node, modulators[1], idealEdgeLength, 0);
            modulators[1].setCenter(_position33.x, _position33.y);
            if (modulators[2]) {
              if (inputs.length == 1) {
                _position33 = calculatePosition(node, modulators[2], idealEdgeLength, 225);
                modulators[2].setCenter(_position33.x, _position33.y);
              }
              if (inputs.length == 2) {
                _position33 = calculatePosition(node, modulators[2], idealEdgeLength, 270);
                modulators[2].setCenter(_position33.x, _position33.y);
              }
            }
          }
          // process outputs
          if (outputs.length == 1) {
            var _position34 = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(_position34.x, _position34.y);
          } else if (outputs.length == 2) {
            var _position35 = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(_position35.x, _position35.y);
            _position35 = calculatePosition(node, outputs[1], idealEdgeLength, 135);
            outputs[1].setCenter(_position35.x, _position35.y);
          } else if (outputs.length > 2) {
            var _position36 = calculatePosition(node, outputs[0], idealEdgeLength, 60);
            outputs[0].setCenter(_position36.x, _position36.y);
            _position36 = calculatePosition(node, outputs[1], idealEdgeLength, 120);
            outputs[1].setCenter(_position36.x, _position36.y);
            if (outputs[2]) {
              _position36 = calculatePosition(node, outputs[2], idealEdgeLength, 30);
              outputs[2].setCenter(_position36.x, _position36.y);
              if (outputs[3]) {
                _position36 = calculatePosition(node, outputs[3], idealEdgeLength, 150);
                outputs[3].setCenter(_position36.x, _position36.y);
              }
            }
          }
        }
      } else {
        // an intermediate node - think about if connected to ring
        if (orientation == "left-to-right") {
          // process inputs
          if (inputs.length == 1) {
            var _position37 = calculatePosition(node, inputs[0], idealEdgeLength, 225);
            inputs[0].setCenter(_position37.x, _position37.y);
          } else if (inputs.length == 2) {
            var _position38 = calculatePosition(node, inputs[0], idealEdgeLength, 225);
            inputs[0].setCenter(_position38.x, _position38.y);
            _position38 = calculatePosition(node, inputs[1], idealEdgeLength, 135);
            inputs[1].setCenter(_position38.x, _position38.y);
          } else if (inputs.length > 2) {
            var _position39 = calculatePosition(node, inputs[0], idealEdgeLength, 210);
            inputs[0].setCenter(_position39.x, _position39.y);
            _position39 = calculatePosition(node, inputs[1], idealEdgeLength, 150);
            inputs[1].setCenter(_position39.x, _position39.y);
            if (inputs[2]) {
              _position39 = calculatePosition(node, inputs[2], idealEdgeLength, 240);
              inputs[2].setCenter(_position39.x, _position39.y);
              if (inputs[3]) {
                _position39 = calculatePosition(node, inputs[3], idealEdgeLength, 120);
                inputs[3].setCenter(_position39.x, _position39.y);
              }
            }
          }
          // process modulators
          if (modulators.length == 1) {
            var _position40 = calculatePosition(node, modulators[0], idealEdgeLength, 90);
            modulators[0].setCenter(_position40.x, _position40.y);
            if (modulators[0].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[0], 90, 45, 135);
            }
          } else if (modulators.length == 2) {
            var _position41 = calculatePosition(node, modulators[0], idealEdgeLength, 90);
            modulators[0].setCenter(_position41.x, _position41.y);
            if (modulators[0].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[0], 90, 45, 135);
            }
            _position41 = calculatePosition(node, modulators[1], idealEdgeLength, 270);
            modulators[1].setCenter(_position41.x, _position41.y);
            if (modulators[1].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[1], 270, 225, 315);
            }
          } else if (modulators.length > 2) {
            var _position42 = calculatePosition(node, modulators[0], idealEdgeLength, 60);
            modulators[0].setCenter(_position42.x, _position42.y);
            if (modulators[0].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[0], 90, 45, 135);
            }
            _position42 = calculatePosition(node, modulators[1], idealEdgeLength, 120);
            modulators[1].setCenter(_position42.x, _position42.y);
            if (modulators[1].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[1], 90, 45, 135);
            }
            _position42 = calculatePosition(node, modulators[2], idealEdgeLength, 270);
            modulators[2].setCenter(_position42.x, _position42.y);
            if (modulators[2].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[2], 270, 225, 315);
            }
          }
          // process outputs
          if (outputs.length == 1) {
            var _position43 = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(_position43.x, _position43.y);
          } else if (outputs.length == 2) {
            var _position44 = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(_position44.x, _position44.y);
            _position44 = calculatePosition(node, outputs[1], idealEdgeLength, 45);
            outputs[1].setCenter(_position44.x, _position44.y);
          } else if (outputs.length > 2) {
            var _position45 = calculatePosition(node, outputs[0], idealEdgeLength, 330);
            outputs[0].setCenter(_position45.x, _position45.y);
            _position45 = calculatePosition(node, outputs[1], idealEdgeLength, 30);
            outputs[1].setCenter(_position45.x, _position45.y);
            if (outputs[2]) {
              _position45 = calculatePosition(node, outputs[2], idealEdgeLength, 300);
              outputs[2].setCenter(_position45.x, _position45.y);
              if (outputs[3]) {
                _position45 = calculatePosition(node, outputs[3], idealEdgeLength, 60);
                outputs[3].setCenter(_position45.x, _position45.y);
              }
            }
          }
        }
        if (orientation == "right-to-left") {
          // process inputs
          if (inputs.length == 1) {
            var _position46 = calculatePosition(node, inputs[0], idealEdgeLength, 45);
            inputs[0].setCenter(_position46.x, _position46.y);
          } else if (inputs.length == 2) {
            var _position47 = calculatePosition(node, inputs[0], idealEdgeLength, 45);
            inputs[0].setCenter(_position47.x, _position47.y);
            _position47 = calculatePosition(node, inputs[1], idealEdgeLength, 315);
            inputs[1].setCenter(_position47.x, _position47.y);
          } else if (inputs.length > 2) {
            var _position48 = calculatePosition(node, inputs[0], idealEdgeLength, 330);
            inputs[0].setCenter(_position48.x, _position48.y);
            _position48 = calculatePosition(node, inputs[1], idealEdgeLength, 30);
            inputs[1].setCenter(_position48.x, _position48.y);
            if (inputs[2]) {
              _position48 = calculatePosition(node, inputs[2], idealEdgeLength, 300);
              inputs[2].setCenter(_position48.x, _position48.y);
              if (inputs[3]) {
                _position48 = calculatePosition(node, inputs[3], idealEdgeLength, 60);
                inputs[3].setCenter(_position48.x, _position48.y);
              }
            }
            inputs.forEach(function (input) {
              relativePlacementConstraints.push({ left: node.id, right: input.id });
            });
          }
          // process modulators
          if (modulators.length == 1) {
            var _position49 = calculatePosition(node, modulators[0], idealEdgeLength, 270);
            modulators[0].setCenter(_position49.x, _position49.y);
            if (modulators[0].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[0], 270, 225, 315);
            }
          } else if (modulators.length == 2) {
            var _position50 = calculatePosition(node, modulators[0], idealEdgeLength, 90);
            modulators[0].setCenter(_position50.x, _position50.y);
            if (modulators[0].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[0], 90, 45, 135);
            }
            _position50 = calculatePosition(node, modulators[1], idealEdgeLength, 270);
            modulators[1].setCenter(_position50.x, _position50.y);
            if (modulators[0].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[0], 270, 225, 315);
            }
          } else if (modulators.length > 2) {
            var _position51 = calculatePosition(node, modulators[0], idealEdgeLength, 60);
            modulators[0].setCenter(_position51.x, _position51.y);
            if (modulators[0].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[0], 90, 45, 135);
            }
            _position51 = calculatePosition(node, modulators[1], idealEdgeLength, 120);
            modulators[1].setCenter(_position51.x, _position51.y);
            if (modulators[1].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[1], 90, 45, 135);
            }
            _position51 = calculatePosition(node, modulators[2], idealEdgeLength, 270);
            modulators[2].setCenter(_position51.x, _position51.y);
            if (modulators[2].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[2], 270, 225, 315);
            }
          }
          // process outputs
          if (outputs.length == 1) {
            var _position52 = calculatePosition(node, outputs[0], idealEdgeLength, 135);
            outputs[0].setCenter(_position52.x, _position52.y);
          } else if (outputs.length == 2) {
            var _position53 = calculatePosition(node, outputs[0], idealEdgeLength, 135);
            outputs[0].setCenter(_position53.x, _position53.y);
            _position53 = calculatePosition(node, outputs[1], idealEdgeLength, 225);
            outputs[1].setCenter(_position53.x, _position53.y);
          } else if (outputs.length > 2) {
            var _position54 = calculatePosition(node, outputs[0], idealEdgeLength, 210);
            outputs[0].setCenter(_position54.x, _position54.y);
            _position54 = calculatePosition(node, outputs[1], idealEdgeLength, 150);
            outputs[1].setCenter(_position54.x, _position54.y);
            if (outputs[2]) {
              _position54 = calculatePosition(node, outputs[2], idealEdgeLength, 240);
              outputs[2].setCenter(_position54.x, _position54.y);
              if (outputs[3]) {
                _position54 = calculatePosition(node, outputs[3], idealEdgeLength, 120);
                outputs[3].setCenter(_position54.x, _position54.y);
              }
            }
          }
        }
        if (orientation == "top-to-bottom") {
          // process inputs
          if (inputs.length == 1) {
            var _position55 = calculatePosition(node, inputs[0], idealEdgeLength, 135);
            inputs[0].setCenter(_position55.x, _position55.y);
          } else if (inputs.length == 2) {
            var _position56 = calculatePosition(node, inputs[0], idealEdgeLength, 135);
            inputs[0].setCenter(_position56.x, _position56.y);
            _position56 = calculatePosition(node, inputs[1], idealEdgeLength, 45);
            inputs[1].setCenter(_position56.x, _position56.y);
          } else if (inputs.length > 2) {
            var _position57 = calculatePosition(node, inputs[0], idealEdgeLength, 60);
            inputs[0].setCenter(_position57.x, _position57.y);
            _position57 = calculatePosition(node, inputs[1], idealEdgeLength, 120);
            inputs[1].setCenter(_position57.x, _position57.y);
            if (inputs[2]) {
              _position57 = calculatePosition(node, inputs[2], idealEdgeLength, 30);
              inputs[2].setCenter(_position57.x, _position57.y);
              if (inputs[3]) {
                _position57 = calculatePosition(node, inputs[3], idealEdgeLength, 150);
                inputs[3].setCenter(_position57.x, _position57.y);
              }
            }
            inputs.forEach(function (input) {
              relativePlacementConstraints.push({ top: input.id, bottom: node.id });
            });
          }
          // process modulators
          if (modulators.length == 1) {
            var _position58 = calculatePosition(node, modulators[0], idealEdgeLength, 0);
            modulators[0].setCenter(_position58.x, _position58.y);
            if (modulators[0].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[0], 0, 45, 315);
            }
          } else if (modulators.length == 2) {
            var _position59 = calculatePosition(node, modulators[0], idealEdgeLength, 180);
            modulators[0].setCenter(_position59.x, _position59.y);
            if (modulators[0].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[0], 180, 135, 225);
            }
            _position59 = calculatePosition(node, modulators[1], idealEdgeLength, 0);
            modulators[1].setCenter(_position59.x, _position59.y);
            if (modulators[1].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[1], 0, 45, 315);
            }
          } else if (modulators.length > 2) {
            var _position60 = calculatePosition(node, modulators[0], idealEdgeLength, 150);
            modulators[0].setCenter(_position60.x, _position60.y);
            if (modulators[0].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[0], 180, 135, 225);
            }
            _position60 = calculatePosition(node, modulators[1], idealEdgeLength, 210);
            modulators[1].setCenter(_position60.x, _position60.y);
            if (modulators[1].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[1], 180, 135, 225);
            }
            _position60 = calculatePosition(node, modulators[2], idealEdgeLength, 0);
            modulators[2].setCenter(_position60.x, _position60.y);
            if (modulators[2].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[2], 0, 45, 315);
            }
          }
          // process outputs
          if (outputs.length == 1) {
            var _position61 = calculatePosition(node, outputs[0], idealEdgeLength, 225);
            outputs[0].setCenter(_position61.x, _position61.y);
          } else if (outputs.length == 2) {
            var _position62 = calculatePosition(node, outputs[0], idealEdgeLength, 225);
            outputs[0].setCenter(_position62.x, _position62.y);
            _position62 = calculatePosition(node, outputs[1], idealEdgeLength, 315);
            outputs[1].setCenter(_position62.x, _position62.y);
          } else if (outputs.length > 2) {
            var _position63 = calculatePosition(node, outputs[0], idealEdgeLength, 300);
            outputs[0].setCenter(_position63.x, _position63.y);
            _position63 = calculatePosition(node, outputs[1], idealEdgeLength, 240);
            outputs[1].setCenter(_position63.x, _position63.y);
            if (outputs[2]) {
              _position63 = calculatePosition(node, outputs[2], idealEdgeLength, 330);
              outputs[2].setCenter(_position63.x, _position63.y);
              if (outputs[3]) {
                _position63 = calculatePosition(node, outputs[3], idealEdgeLength, 210);
                outputs[3].setCenter(_position63.x, _position63.y);
              }
            }
          }
        }
        if (orientation == "bottom-to-top") {
          // process inputs
          if (inputs.length == 1) {
            var _position64 = calculatePosition(node, inputs[0], idealEdgeLength, 315);
            inputs[0].setCenter(_position64.x, _position64.y);
          } else if (inputs.length == 2) {
            var _position65 = calculatePosition(node, inputs[0], idealEdgeLength, 315);
            inputs[0].setCenter(_position65.x, _position65.y);
            _position65 = calculatePosition(node, inputs[1], idealEdgeLength, 225);
            inputs[1].setCenter(_position65.x, _position65.y);
          } else if (inputs.length > 2) {
            var _position66 = calculatePosition(node, inputs[0], idealEdgeLength, 300);
            inputs[0].setCenter(_position66.x, _position66.y);
            _position66 = calculatePosition(node, inputs[1], idealEdgeLength, 240);
            inputs[1].setCenter(_position66.x, _position66.y);
            if (inputs[2]) {
              _position66 = calculatePosition(node, inputs[2], idealEdgeLength, 330);
              inputs[2].setCenter(_position66.x, _position66.y);
              if (inputs[3]) {
                _position66 = calculatePosition(node, inputs[3], idealEdgeLength, 210);
                inputs[3].setCenter(_position66.x, _position66.y);
              }
            }
            inputs.forEach(function (input) {
              relativePlacementConstraints.push({ top: node.id, bottom: input.id });
            });
          }
          // process modulators
          if (modulators.length == 1) {
            var _position67 = calculatePosition(node, modulators[0], idealEdgeLength, 180);
            modulators[0].setCenter(_position67.x, _position67.y);
            if (modulators[0].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[0], 180, 135, 225);
            }
          } else if (modulators.length == 2) {
            var _position68 = calculatePosition(node, modulators[0], idealEdgeLength, 180);
            modulators[0].setCenter(_position68.x, _position68.y);
            if (modulators[0].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[0], 180, 135, 225);
            }
            _position68 = calculatePosition(node, modulators[1], idealEdgeLength, 0);
            modulators[1].setCenter(_position68.x, _position68.y);
            if (modulators[1].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[1], 0, 45, 315);
            }
          } else if (modulators.length > 2) {
            var _position69 = calculatePosition(node, modulators[0], idealEdgeLength, 150);
            modulators[0].setCenter(_position69.x, _position69.y);
            if (modulators[0].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[0], 180, 135, 225);
            }
            _position69 = calculatePosition(node, modulators[1], idealEdgeLength, 210);
            modulators[1].setCenter(_position69.x, _position69.y);
            if (modulators[1].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[1], 180, 135, 225);
            }
            _position69 = calculatePosition(node, modulators[2], idealEdgeLength, 0);
            modulators[2].setCenter(_position69.x, _position69.y);
            if (modulators[1].isLogicalOperator()) {
              // if logical operator
              placeLogicalOperators(modulators[1], 0, 45, 315);
            }
          }
          // process outputs
          if (outputs.length == 1) {
            var _position70 = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(_position70.x, _position70.y);
          } else if (outputs.length == 2) {
            var _position71 = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(_position71.x, _position71.y);
            _position71 = calculatePosition(node, outputs[1], idealEdgeLength, 135);
            outputs[1].setCenter(_position71.x, _position71.y);
          } else if (outputs.length > 2) {
            var _position72 = calculatePosition(node, outputs[0], idealEdgeLength, 60);
            outputs[0].setCenter(_position72.x, _position72.y);
            _position72 = calculatePosition(node, outputs[1], idealEdgeLength, 120);
            outputs[1].setCenter(_position72.x, _position72.y);
            if (outputs[2]) {
              _position72 = calculatePosition(node, outputs[2], idealEdgeLength, 30);
              outputs[2].setCenter(_position72.x, _position72.y);
              if (outputs[3]) {
                _position72 = calculatePosition(node, outputs[3], idealEdgeLength, 150);
                outputs[3].setCenter(_position72.x, _position72.y);
              }
            }
          }
        }
      }
      if (j == component.length - 1 && !node.isConnectedToRing() || j == 0 && node.isConnectedToRing() && node.getIncomerNodes().filter(function (incomer) {
        return incomer.pseudoClass == "ring";
      }).length > 0) {
        //if last node and not connected to ring, or first node, connected to ring but connected as a target
        if (orientation == "left-to-right") {
          // process outputs
          if (outputs.length == 1) {
            var _position73 = calculatePosition(node, outputs[0], idealEdgeLength, 0);
            outputs[0].setCenter(_position73.x, _position73.y);
          } else if (outputs.length == 2) {
            var _position74 = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(_position74.x, _position74.y);
            _position74 = calculatePosition(node, outputs[1], idealEdgeLength, 315);
            outputs[1].setCenter(_position74.x, _position74.y);
          } else if (outputs.length == 3) {
            var _position75 = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(_position75.x, _position75.y);
            _position75 = calculatePosition(node, outputs[1], idealEdgeLength, 0);
            outputs[1].setCenter(_position75.x, _position75.y);
            _position75 = calculatePosition(node, outputs[2], idealEdgeLength, 315);
            outputs[2].setCenter(_position75.x, _position75.y);
          } else if (outputs.length == 4) {
            var _position76 = calculatePosition(node, outputs[0], idealEdgeLength, 54);
            outputs[0].setCenter(_position76.x, _position76.y);
            _position76 = calculatePosition(node, outputs[1], idealEdgeLength, 18);
            outputs[1].setCenter(_position76.x, _position76.y);
            _position76 = calculatePosition(node, outputs[2], idealEdgeLength, 342);
            outputs[2].setCenter(_position76.x, _position76.y);
            _position76 = calculatePosition(node, outputs[3], idealEdgeLength, 306);
            outputs[3].setCenter(_position76.x, _position76.y);
          }
        }
        if (orientation == "right-to-left") {
          // process outputs
          if (outputs.length == 1) {
            var _position77 = calculatePosition(node, outputs[0], idealEdgeLength, 180);
            outputs[0].setCenter(_position77.x, _position77.y);
          } else if (outputs.length == 2) {
            var _position78 = calculatePosition(node, outputs[0], idealEdgeLength, 135);
            outputs[0].setCenter(_position78.x, _position78.y);
            _position78 = calculatePosition(node, outputs[1], idealEdgeLength, 225);
            outputs[1].setCenter(_position78.x, _position78.y);
          } else if (outputs.length == 3) {
            var _position79 = calculatePosition(node, outputs[0], idealEdgeLength, 135);
            outputs[0].setCenter(_position79.x, _position79.y);
            _position79 = calculatePosition(node, outputs[1], idealEdgeLength, 180);
            outputs[1].setCenter(_position79.x, _position79.y);
            _position79 = calculatePosition(node, outputs[2], idealEdgeLength, 225);
            outputs[2].setCenter(_position79.x, _position79.y);
          } else if (outputs.length == 4) {
            var _position80 = calculatePosition(node, outputs[0], idealEdgeLength, 126);
            outputs[0].setCenter(_position80.x, _position80.y);
            _position80 = calculatePosition(node, outputs[1], idealEdgeLength, 162);
            outputs[1].setCenter(_position80.x, _position80.y);
            _position80 = calculatePosition(node, outputs[2], idealEdgeLength, 198);
            outputs[2].setCenter(_position80.x, _position80.y);
            _position80 = calculatePosition(node, outputs[3], idealEdgeLength, 234);
            outputs[3].setCenter(_position80.x, _position80.y);
          }
        }
        if (orientation == "top-to-bottom") {
          // process outputs
          if (outputs.length == 1) {
            var _position81 = calculatePosition(node, outputs[0], idealEdgeLength, 270);
            outputs[0].setCenter(_position81.x, _position81.y);
          } else if (outputs.length == 2) {
            var _position82 = calculatePosition(node, outputs[0], idealEdgeLength, 225);
            outputs[0].setCenter(_position82.x, _position82.y);
            _position82 = calculatePosition(node, outputs[1], idealEdgeLength, 315);
            outputs[1].setCenter(_position82.x, _position82.y);
          } else if (outputs.length == 3) {
            var _position83 = calculatePosition(node, outputs[0], idealEdgeLength, 225);
            outputs[0].setCenter(_position83.x, _position83.y);
            _position83 = calculatePosition(node, outputs[1], idealEdgeLength, 270);
            outputs[1].setCenter(_position83.x, _position83.y);
            _position83 = calculatePosition(node, outputs[2], idealEdgeLength, 315);
            outputs[2].setCenter(_position83.x, _position83.y);
          } else if (outputs.length == 4) {
            var _position84 = calculatePosition(node, outputs[0], idealEdgeLength, 216);
            outputs[0].setCenter(_position84.x, _position84.y);
            _position84 = calculatePosition(node, outputs[1], idealEdgeLength, 252);
            outputs[1].setCenter(_position84.x, _position84.y);
            _position84 = calculatePosition(node, outputs[2], idealEdgeLength, 288);
            outputs[2].setCenter(_position84.x, _position84.y);
            _position84 = calculatePosition(node, outputs[3], idealEdgeLength, 324);
            outputs[3].setCenter(_position84.x, _position84.y);
          }
        }
        if (orientation == "bottom-to-top") {
          // process outputs
          if (outputs.length == 1) {
            var _position85 = calculatePosition(node, outputs[0], idealEdgeLength, 90);
            outputs[0].setCenter(_position85.x, _position85.y);
          } else if (outputs.length == 2) {
            var _position86 = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(_position86.x, _position86.y);
            _position86 = calculatePosition(node, outputs[1], idealEdgeLength, 135);
            outputs[1].setCenter(_position86.x, _position86.y);
          } else if (outputs.length == 3) {
            var _position87 = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(_position87.x, _position87.y);
            _position87 = calculatePosition(node, outputs[1], idealEdgeLength, 90);
            outputs[1].setCenter(_position87.x, _position87.y);
            _position87 = calculatePosition(node, outputs[2], idealEdgeLength, 135);
            outputs[2].setCenter(_position87.x, _position87.y);
          } else if (outputs.length == 4) {
            var _position88 = calculatePosition(node, outputs[0], idealEdgeLength, 36);
            outputs[0].setCenter(_position88.x, _position88.y);
            _position88 = calculatePosition(node, outputs[1], idealEdgeLength, 72);
            outputs[1].setCenter(_position88.x, _position88.y);
            _position88 = calculatePosition(node, outputs[2], idealEdgeLength, 108);
            outputs[2].setCenter(_position88.x, _position88.y);
            _position88 = calculatePosition(node, outputs[3], idealEdgeLength, 144);
            outputs[3].setCenter(_position88.x, _position88.y);
          }
        }
      }
    });
  });

  return { horizontalAlignments: horizontalAlignments, verticalAlignments: verticalAlignments, relativePlacementConstraints: relativePlacementConstraints };
};

module.exports = SBGNPolishing;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray2 = __webpack_require__(81);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = __webpack_require__(27);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _from = __webpack_require__(26);

var _from2 = _interopRequireDefault(_from);

var _set = __webpack_require__(46);

var _set2 = _interopRequireDefault(_set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SBGNConstants = __webpack_require__(24);
var SBGNNode = __webpack_require__(25);
var SBGNLayout = __webpack_require__(45);

function SBGNPolishingNew() {}

SBGNPolishingNew.polish = function (sbgnLayout) {
  var allNodes = sbgnLayout.getAllNodes();
  var processNodes = sbgnLayout.getAllProcessNodes();
  processNodes.forEach(function (process) {
    var edges = process.edges.filter(function (edge) {
      return edge.direction;
    });
    for (var i = 0; i < edges.length; i++) {
      if (edges[i].direction && (edges[i].direction == 'l-r' || edges[i].direction == 'r-l' || edges[i].direction == 't-b' || edges[i].direction == 'b-t')) {
        process.direction = edges[i].direction;
        break;
      } else if (edges[i].direction == 'tl-br' || edges[i].direction == 'tr-bl' || edges[i].direction == 'br-tl' || edges[i].direction == 'bl-tr') {
        process.direction = 't-b';
      }
    };
    var predecessors = [];
    var incomers = process.getIncomerNodes();
    incomers.forEach(function (incomer) {
      predecessors = predecessors.concat(incomer.getIncomerNodes());
    });
    var successors = [];
    var outgoers = process.getOutgoerNodes();
    outgoers.forEach(function (outgoer) {
      successors = successors.concat(outgoer.getOutgoerNodes());
    });
    var before = false;
    var after = false;
    predecessors.forEach(function (node) {
      if (node.isProcess()) {
        before = true;
      }
    });
    successors.forEach(function (node) {
      if (node.isProcess()) {
        after = true;
      }
    });
    if (before && after) {
      process.status = "middle";
    } else if (before) {
      process.status = "last";
    } else if (after) {
      process.status = "first";
    }
    console.log(process.status);
  });

  this.addPerProcessPolishment(processNodes);
};

SBGNPolishingNew.generateConstraints = function (sbgnLayout, mapType, slopeThreshold) {
  var _this = this;

  var allNodes = sbgnLayout.getAllNodes();
  var oneDegreeNodes = new _set2.default();
  var multiDegreeNodes = new _set2.default();
  allNodes.forEach(function (node) {
    if (node.getNeighborsList().size == 1) {
      oneDegreeNodes.add(node);
    } else {
      multiDegreeNodes.add(node);
    }
  });

  var relativePlacementConstraints = [];
  var verticalAlignments = [];
  var horizontalAlignments = [];
  var allEdges = sbgnLayout.getAllEdges();
  allEdges.forEach(function (edge) {
    var source = edge.getSource();
    var target = edge.getTarget();
    if (!oneDegreeNodes.has(source) && !oneDegreeNodes.has(target) && mapType == "PD" || mapType == "AF") {
      var direction = _this.getDirection(source, target, slopeThreshold);
      edge.direction = direction;
      if (direction == "l-r") {
        var relativePlacement = [];
        relativePlacement.push({ left: source.id, right: target.id });
        horizontalAlignments.push([source.id, target.id]);
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);
      } else if (direction == "r-l") {
        var _relativePlacement = [];
        _relativePlacement.push({ left: target.id, right: source.id });
        horizontalAlignments.push([source.id, target.id]);
        relativePlacementConstraints = relativePlacementConstraints.concat(_relativePlacement);
      } else if (direction == "t-b") {
        var _relativePlacement2 = [];
        _relativePlacement2.push({ top: source.id, bottom: target.id });
        verticalAlignments.push([source.id, target.id]);
        relativePlacementConstraints = relativePlacementConstraints.concat(_relativePlacement2);
      } else if (direction == "b-t") {
        var _relativePlacement3 = [];
        _relativePlacement3.push({ top: target.id, bottom: source.id });
        verticalAlignments.push([source.id, target.id]);
        relativePlacementConstraints = relativePlacementConstraints.concat(_relativePlacement3);
      } else if (direction == "tl-br") {
        var _relativePlacement4 = [];
        _relativePlacement4.push({ left: source.id, right: target.id });
        _relativePlacement4.push({ top: source.id, bottom: target.id });
        relativePlacementConstraints = relativePlacementConstraints.concat(_relativePlacement4);
      } else if (direction == "br-tl") {
        var _relativePlacement5 = [];
        _relativePlacement5.push({ left: target.id, right: source.id });
        _relativePlacement5.push({ top: target.id, bottom: source.id });
        relativePlacementConstraints = relativePlacementConstraints.concat(_relativePlacement5);
      } else if (direction == "tr-bl") {
        var _relativePlacement6 = [];
        _relativePlacement6.push({ left: target.id, right: source.id });
        _relativePlacement6.push({ top: source.id, bottom: target.id });
        relativePlacementConstraints = relativePlacementConstraints.concat(_relativePlacement6);
      } else if (direction == "bl-tr") {
        var _relativePlacement7 = [];
        _relativePlacement7.push({ left: source.id, right: target.id });
        _relativePlacement7.push({ top: target.id, bottom: source.id });
        relativePlacementConstraints = relativePlacementConstraints.concat(_relativePlacement7);
      }
    }
  });

  if (verticalAlignments.length) {
    verticalAlignments = mergeArrays(verticalAlignments);
  }
  if (horizontalAlignments.length) {
    horizontalAlignments = mergeArrays(horizontalAlignments);
  }

  // remove conflicts between relative and alignment constraints
  // traverse relative constraints and if both nodes are found in 
  // opposite alignment constraints, remove that relative constraint

  var _loop = function _loop(i) {
    var constraint = relativePlacementConstraints[i];
    if (constraint.left) {
      var left = constraint.left;
      var right = constraint.right;
      verticalAlignments.forEach(function (verticalAlignment) {
        if (verticalAlignment.includes(left) && verticalAlignment.includes(right)) {
          relativePlacementConstraints.splice(i, 1);
        }
      });
    } else if (constraint.top) {
      var top = constraint.top;
      var bottom = constraint.bottom;
      horizontalAlignments.forEach(function (horizontalAlignment) {
        if (horizontalAlignment.includes(top) && horizontalAlignment.includes(bottom)) {
          relativePlacementConstraints.splice(i, 1);
        }
      });
    }
  };

  for (var i = relativePlacementConstraints.length - 1; i >= 0; i--) {
    _loop(i);
  }

  var alignmentConstraints = { vertical: verticalAlignments.length > 0 ? verticalAlignments : undefined, horizontal: horizontalAlignments.length > 0 ? horizontalAlignments : undefined };

  return { relativePlacementConstraint: relativePlacementConstraints, alignmentConstraint: alignmentConstraints };
};

// calculates line direction
SBGNPolishingNew.getDirection = function (source, target) {
  var slopeThreshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;

  var direction = "l-r";
  if (Math.abs(target.getCenterY() - source.getCenterY()) / Math.abs(target.getCenterX() - source.getCenterX()) < slopeThreshold) {
    if (target.getCenterX() - source.getCenterX() > 0) {
      direction = "l-r";
    } else {
      direction = "r-l";
    }
  } else if (Math.abs(target.getCenterX() - source.getCenterX()) / Math.abs(target.getCenterY() - source.getCenterY()) < slopeThreshold) {
    if (target.getCenterY() - source.getCenterY() > 0) {
      direction = "t-b";
    } else {
      direction = "b-t";
    }
  } else if (target.getCenterY() - source.getCenterY() > 0 && target.getCenterX() - source.getCenterX() > 0) {
    direction = "tl-br";
  } else if (target.getCenterY() - source.getCenterY() < 0 && target.getCenterX() - source.getCenterX() < 0) {
    direction = "br-tl";
  } else if (target.getCenterY() - source.getCenterY() > 0 && target.getCenterX() - source.getCenterX() < 0) {
    direction = "tr-bl";
  } else if (target.getCenterY() - source.getCenterY() < 0 && target.getCenterX() - source.getCenterX() > 0) {
    direction = "bl-tr";
  }
  return direction;
};

// auxuliary function to merge arrays with duplicates
var mergeArrays = function mergeArrays(arrays) {
  // Function to check if two arrays have common items
  function haveCommonItems(arr1, arr2) {
    return arr1.some(function (item) {
      return arr2.includes(item);
    });
  }

  // Function to merge two arrays and remove duplicates
  function mergeAndRemoveDuplicates(arr1, arr2) {
    return (0, _from2.default)(new _set2.default([].concat((0, _toConsumableArray3.default)(arr1), (0, _toConsumableArray3.default)(arr2))));
  }

  // Loop until no more merges are possible
  var merged = false;
  do {
    merged = false;
    for (var i = 0; i < arrays.length; i++) {
      for (var j = i + 1; j < arrays.length; j++) {
        if (haveCommonItems(arrays[i], arrays[j])) {
          // Merge the arrays
          arrays[i] = mergeAndRemoveDuplicates(arrays[i], arrays[j]);
          // Remove the merged array
          arrays.splice(j, 1);
          // Set merged to true to indicate a merge has occurred
          merged = true;
          break;
        }
      }
      if (merged) {
        break;
      }
    }
  } while (merged);

  return arrays;
};

var calculatePosition = function calculatePosition(nodeA, nodeB, idealEdgeLength, degree) {
  if (degree == 0) {
    return { x: nodeA.getCenterX() + (nodeA.getWidth() / 2 + nodeB.getWidth() / 2 + idealEdgeLength), y: nodeA.getCenterY() };
  } else if (degree == 90) {
    return { x: nodeA.getCenterX(), y: nodeA.getCenterY() - (nodeA.getHeight() / 2 + nodeB.getHeight() / 2 + idealEdgeLength) };
  } else if (degree == 180) {
    return { x: nodeA.getCenterX() - (nodeA.getWidth() / 2 + nodeB.getWidth() / 2 + idealEdgeLength), y: nodeA.getCenterY() };
  } else if (degree == 270) {
    return { x: nodeA.getCenterX(), y: nodeA.getCenterY() + (nodeA.getHeight() / 2 + nodeB.getHeight() / 2 + idealEdgeLength) };
  } else {
    var radian = degree * Math.PI / 180;
    var radius = idealEdgeLength / 2 + (nodeA.getDiagonal() / 2 + nodeB.getDiagonal() / 2);
    return { x: nodeA.getCenterX() + radius * Math.cos(radian), y: nodeA.getCenterY() - radius * Math.sin(radian) };
  }
};

var placeInputs = function placeInputs(node, inputs) {
  var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'l-r';
  var idealEdgeLength = arguments[3];
  var isFirstNode = arguments[4];
  var horizontalAlignments = arguments[5];
  var verticalAlignments = arguments[6];
  var relativePlacementConstraints = arguments[7];

  var n = inputs.length;
  if (n === 0) return;

  // Direction configuration
  var directionConfig = {
    'l-r': { start: 270, end: 90, center: 180 }, // left side
    'r-l': { start: -90, end: 90, center: 0 }, // right side
    't-b': { start: 180, end: 0, center: 90 }, // above
    'b-t': { start: 180, end: 360, center: 270 } // below
  };

  var _directionConfig$dire = directionConfig[direction],
      start = _directionConfig$dire.start,
      end = _directionConfig$dire.end,
      center = _directionConfig$dire.center;

  // Spread scaling: narrower when few inputs, full range when many

  var maxSpread = Math.abs(end - start);
  var spread = n === 1 ? 0 : Math.min(maxSpread, 90 + (n - 2) * 22.5); // grows smoothly

  var startAngle = center + spread / 2;
  var endAngle = center - spread / 2;
  var step = n === 1 ? 0 : (endAngle - startAngle) / (n - 1);

  for (var i = 0; i < n; i++) {
    var angle = void 0;

    if (n === 1) {
      // single input special cases
      if (isFirstNode) {
        angle = center; // perfectly centered
      } else {
        // place at first-position angle (as if there were 2 inputs)
        angle = direction === 'l-r' ? 225 : direction === 'r-l' ? -45 : direction === 't-b' ? 135 : 225; // fallback
      }
    } else {
      angle = startAngle + step * i;
    }

    // Normalize to [0, 360)
    angle = (angle + 360) % 360;

    var position = calculatePosition(node, inputs[i], idealEdgeLength, angle);
    inputs[i].setCenter(position.x, position.y);

    var alignedAngle = Math.round(angle); // avoid float precision
    if (alignedAngle === 0 || alignedAngle === 180) {
      horizontalAlignments.push([node, inputs[i]]);
    } else if (alignedAngle === 90 || alignedAngle === 270) {
      verticalAlignments.push([node, inputs[i]]);
    }
  }

  // Add relative constraints if many inputs
  if (n > 3) {
    inputs.forEach(function (input) {
      if (direction == "l-r") relativePlacementConstraints.push({ left: input.id, right: node.id });else if (direction == "r-l") relativePlacementConstraints.push({ right: input.id, left: node.id });else if (direction == "t-b") relativePlacementConstraints.push({ top: input.id, bottom: node.id });else if (direction == "r-l") relativePlacementConstraints.push({ bottom: input.id, top: node.id });
    });
  }
};

var placeOutputs = function placeOutputs(node, outputs) {
  var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'l-r';
  var idealEdgeLength = arguments[3];
  var isLastNode = arguments[4];
  var horizontalAlignments = arguments[5];
  var verticalAlignments = arguments[6];
  var relativePlacementConstraints = arguments[7];

  var n = outputs.length;
  if (n === 0) return;

  // Direction configuration
  var directionConfig = {
    'l-r': { start: -90, end: 90, center: 0 }, // right side
    'r-l': { start: 270, end: 90, center: 180 }, // left side
    't-b': { start: 180, end: 360, center: 270 }, // below
    'b-t': { start: 180, end: 0, center: 90 } // above
  };

  var _directionConfig$dire2 = directionConfig[direction],
      start = _directionConfig$dire2.start,
      end = _directionConfig$dire2.end,
      center = _directionConfig$dire2.center;

  // Spread scaling: narrower when few inputs, full range when many

  var maxSpread = Math.abs(end - start);
  var spread = n === 1 ? 0 : Math.min(maxSpread, 90 + (n - 2) * 22.5); // grows smoothly

  var startAngle = center + spread / 2;
  var endAngle = center - spread / 2;
  var step = n === 1 ? 0 : (endAngle - startAngle) / (n - 1);

  for (var i = 0; i < n; i++) {
    var angle = void 0;

    if (n === 1) {
      // single input special cases
      if (isLastNode) {
        angle = center; // perfectly centered
      } else {
        // place at first-position angle (as if there were 2 inputs)
        angle = direction === 'l-r' ? -45 : direction === 'r-l' ? 225 : direction === 't-b' ? 225 : 135; // fallback
      }
    } else {
      angle = startAngle + step * i;
    }

    // Normalize to [0, 360)
    angle = (angle + 360) % 360;

    var position = calculatePosition(node, outputs[i], idealEdgeLength, angle);
    outputs[i].setCenter(position.x, position.y);

    var alignedAngle = Math.round(angle); // avoid float precision
    if (alignedAngle === 0 || alignedAngle === 180) {
      horizontalAlignments.push([node, outputs[i]]);
    } else if (alignedAngle === 90 || alignedAngle === 270) {
      verticalAlignments.push([node, outputs[i]]);
    }
  }

  // Add relative constraints if many inputs
  if (n > 3) {
    outputs.forEach(function (output) {
      if (direction == "l-r") relativePlacementConstraints.push({ right: output.id, left: node.id });else if (direction == "r-l") relativePlacementConstraints.push({ left: output.id, right: node.id });else if (direction == "t-b") relativePlacementConstraints.push({ bottom: output.id, top: node.id });else if (direction == "r-l") relativePlacementConstraints.push({ top: output.id, bottom: node.id });
    });
  }
};

var placeModulators = function placeModulators(node, modulators) {
  var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'l-r';
  var idealEdgeLength = arguments[3];
  var horizontalAlignments = arguments[4];
  var verticalAlignments = arguments[5];

  var n = modulators.length;
  if (n === 0) return;

  // Define angle bands depending on direction (supports all 4)
  var directionConfig = {
    'l-r': { belowRange: [225, 315], aboveRange: [45, 135] },
    'r-l': { belowRange: [225, 315], aboveRange: [45, 135] },
    't-b': { belowRange: [135, 225], aboveRange: [-45, 45] },
    'b-t': { belowRange: [135, 225], aboveRange: [-45, 45] }
  };

  var _directionConfig$dire3 = directionConfig[direction],
      belowRange = _directionConfig$dire3.belowRange,
      aboveRange = _directionConfig$dire3.aboveRange;


  var aboveCount = Math.ceil(n / 2);
  var belowCount = n - aboveCount;

  var aboveNodes = modulators.slice(0, aboveCount);
  var belowNodes = modulators.slice(aboveCount);

  // Helper: distribute within a range
  var distribute = function distribute(nodes, _ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        start = _ref2[0],
        end = _ref2[1];

    var count = nodes.length;
    if (count === 0) return [];
    if (count === 1) return [(start + end) / 2];

    var step = (end - start) / (count - 1);
    return (0, _from2.default)({ length: count }, function (_, i) {
      return start + step * i;
    });
  };

  var belowAngles = distribute(belowNodes, belowRange);
  var aboveAngles = distribute(aboveNodes, aboveRange);

  // Combine (above first, then below)
  var allAngles = [].concat((0, _toConsumableArray3.default)(aboveAngles), (0, _toConsumableArray3.default)(belowAngles));

  // Apply placement
  allAngles.forEach(function (angle, i) {
    var position = calculatePosition(node, modulators[i], idealEdgeLength, angle);
    modulators[i].setCenter(position.x, position.y);

    // Alignment tagging
    var alignedAngle = Math.round(angle % 360);
    if (alignedAngle === 0 || alignedAngle === 180) horizontalAlignments.push([node, modulators[i]]);else if (alignedAngle === 90 || alignedAngle === 270) verticalAlignments.push([node, modulators[i]]);
  });
};

SBGNPolishingNew.addPerProcessPolishment = function (processes, directions) {
  var horizontalAlignments = [];
  var verticalAlignments = [];
  var relativePlacementConstraints = [];

  var idealEdgeLength = SBGNConstants.DEFAULT_EDGE_LENGTH;

  var placeLogicalOperators = function placeLogicalOperators(modulator, a1, a2, a3) {
    var incomers = modulator.getIncomerNodes();
    if (incomers.length == 1) {
      var position = calculatePosition(modulator, incomers[0], idealEdgeLength, a1);
      incomers[0].setCenter(position.x, position.y);
    } else if (incomers.length == 2) {
      var _position = calculatePosition(modulator, incomers[0], idealEdgeLength, a2);
      incomers[0].setCenter(_position.x, _position.y);
      _position = calculatePosition(modulator, incomers[1], idealEdgeLength, a3);
      incomers[1].setCenter(_position.x, _position.y);
    }
  };

  // first process input nodes (except modulators)
  processes.forEach(function (node, j) {
    var incomers = node.getIncomerNodes();
    var outgoers = node.getOutgoerNodes();
    // find input nodes (filter ring nodes, modulator nodes and input with degree higher than 1)
    var inputs = incomers.filter(function (input) {
      var edgeBetween = node.getEdgesBetween(input)[0];
      if (input.pseudoClass == "ring" || edgeBetween.class == "modulation" || edgeBetween.class == "stimulation" || edgeBetween.class == "catalysis" || edgeBetween.class == "inhibition" || edgeBetween.class == "necessary stimulation" || input.getNeighborsList().size > 1) {
        return false;
      } else {
        return true;
      }
    });
    // find modulator nodes (filter ring nodes, non-modulator nodes and input with degree higher than 1)
    var modulators = incomers.filter(function (input) {
      var edgeBetween = node.getEdgesBetween(input)[0];
      if (input.pseudoClass != "ring" && (edgeBetween.class == "modulation" || edgeBetween.class == "stimulation" || edgeBetween.class == "catalysis" || edgeBetween.class == "inhibition" || edgeBetween.class == "necessary stimulation") && (input.getNeighborsList().size == 1 || input.isLogicalOperator())) {
        return true;
      } else {
        return false;
      }
    });
    // find output nodes (filter ring nodes, modulator nodes and output with degree higher than 1)
    var outputs = outgoers.filter(function (output) {
      var edgeBetween = node.getEdgesBetween(output)[0];
      if (output.pseudoClass == "ring" || edgeBetween.class == "modulation" || edgeBetween.class == "stimulation" || edgeBetween.class == "catalysis" || edgeBetween.class == "inhibition" || edgeBetween.class == "necessary stimulation" || output.getNeighborsList().size > 1) {
        return false;
      } else {
        return true;
      }
    });

    var isFirstNode = node.status === 'first';
    var isLastNode = node.status === 'last';
    placeInputs(node, inputs, node.direction, idealEdgeLength, isFirstNode, horizontalAlignments, verticalAlignments, relativePlacementConstraints);
    placeOutputs(node, outputs, node.direction, idealEdgeLength, isLastNode, horizontalAlignments, verticalAlignments, relativePlacementConstraints);
    placeModulators(node, modulators, node.direction, idealEdgeLength, horizontalAlignments, verticalAlignments, relativePlacementConstraints);
  });

  return { horizontalAlignments: horizontalAlignments, verticalAlignments: verticalAlignments, relativePlacementConstraints: relativePlacementConstraints };
};

module.exports = SBGNPolishingNew;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Mapping between SBGN glyps and Reactome element types
 */
var mapping = {};

mapping.isSbgnGlyph = function (glyph) {
  var sbgnGlyphs = ["unspecified entitiy", "simple chemical", "macromolecule", "nucleic acid feature", "complex", "empty set", "source and sink", "perturbing agent", "simple chemical multimer", "macromolecule multimer", "nucleic acid feature multimer", "complex multimer", "compartment", "process", "omitted process", "uncertain process", "association", "dissociation", "phenotype", "and", "or", "not", "equivalence", "tag", "submap"];
  return sbgnGlyphs.includes(glyph);
};

mapping.getGlyph = function (classes) {
  if (classes.includes("Protein")) return "macromolecule";
  if (classes.includes("Complex")) return "complex";
  if (classes.includes("Chemical")) return "simple chemical";
  if (classes.includes("Compartment")) return "compartment";
  if (classes.includes("dissociation")) return "dissociation";
  if (classes.includes("association")) return "association";
  if (classes.includes("transition")) return "process";

  return "unspecified entity";
};

module.exports = mapping;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _keys = __webpack_require__(76);

var _keys2 = _interopRequireDefault(_keys);

var _assign = __webpack_require__(73);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Simple, internal Object.assign() polyfill for options objects etc.

module.exports = _assign2.default != null ? _assign2.default.bind(Object) : function (tgt) {
  for (var _len = arguments.length, srcs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    srcs[_key - 1] = arguments[_key];
  }

  srcs.forEach(function (src) {
    (0, _keys2.default)(src).forEach(function (k) {
      return tgt[k] = src[k];
    });
  });

  return tgt;
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var impl = __webpack_require__(62);

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('layout', 'sbgn-layout', impl); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(84), __esModule: true };

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(85), __esModule: true };

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(86), __esModule: true };

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(88), __esModule: true };

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(89), __esModule: true };

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(90), __esModule: true };

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(91), __esModule: true };

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _promise = __webpack_require__(77);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(74);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _isIterable2 = __webpack_require__(72);

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = __webpack_require__(71);

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(138);


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(19);
__webpack_require__(123);
module.exports = __webpack_require__(0).Array.from;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(23);
__webpack_require__(19);
module.exports = __webpack_require__(121);


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(23);
__webpack_require__(19);
module.exports = __webpack_require__(122);


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(125);
module.exports = __webpack_require__(0).Object.assign;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(126);
var $Object = __webpack_require__(0).Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(127);
var $Object = __webpack_require__(0).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(128);
module.exports = __webpack_require__(0).Object.freeze;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(129);
module.exports = __webpack_require__(0).Object.keys;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(61);
__webpack_require__(19);
__webpack_require__(23);
__webpack_require__(130);
__webpack_require__(132);
__webpack_require__(133);
module.exports = __webpack_require__(0).Promise;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(61);
__webpack_require__(19);
__webpack_require__(23);
__webpack_require__(131);
__webpack_require__(136);
__webpack_require__(135);
__webpack_require__(134);
module.exports = __webpack_require__(0).Set;


/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(16);

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(42);
var toLength = __webpack_require__(22);
var toAbsoluteIndex = __webpack_require__(118);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(9);
var IObject = __webpack_require__(31);
var toObject = __webpack_require__(18);
var toLength = __webpack_require__(22);
var asc = __webpack_require__(98);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(5);
var isArray = __webpack_require__(105);
var SPECIES = __webpack_require__(4)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(97);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP = __webpack_require__(7).f;
var create = __webpack_require__(36);
var redefineAll = __webpack_require__(39);
var ctx = __webpack_require__(9);
var anInstance = __webpack_require__(28);
var forOf = __webpack_require__(16);
var $iterDefine = __webpack_require__(32);
var step = __webpack_require__(52);
var setSpecies = __webpack_require__(56);
var DESCRIPTORS = __webpack_require__(6);
var fastKey = __webpack_require__(34).fastKey;
var validate = __webpack_require__(60);
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(20);
var from = __webpack_require__(94);
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(3);
var $export = __webpack_require__(2);
var meta = __webpack_require__(34);
var fails = __webpack_require__(11);
var hide = __webpack_require__(10);
var redefineAll = __webpack_require__(39);
var forOf = __webpack_require__(16);
var anInstance = __webpack_require__(28);
var isObject = __webpack_require__(5);
var setToStringTag = __webpack_require__(21);
var dP = __webpack_require__(7).f;
var each = __webpack_require__(96)(0);
var DESCRIPTORS = __webpack_require__(6);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
        anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    IS_WEAK || dP(C.prototype, 'size', {
      get: function () {
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(7);
var createDesc = __webpack_require__(38);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(6) && !__webpack_require__(11)(function () {
  return Object.defineProperty(__webpack_require__(30)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 104 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(15);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(36);
var descriptor = __webpack_require__(38);
var setToStringTag = __webpack_require__(21);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(10)(IteratorPrototype, __webpack_require__(4)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var macrotask = __webpack_require__(59).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(15)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var DESCRIPTORS = __webpack_require__(6);
var getKeys = __webpack_require__(37);
var gOPS = __webpack_require__(110);
var pIE = __webpack_require__(113);
var toObject = __webpack_require__(18);
var IObject = __webpack_require__(31);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(11)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(7);
var anObject = __webpack_require__(8);
var getKeys = __webpack_require__(37);

module.exports = __webpack_require__(6) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 110 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(17);
var toObject = __webpack_require__(18);
var IE_PROTO = __webpack_require__(40)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(17);
var toIObject = __webpack_require__(42);
var arrayIndexOf = __webpack_require__(95)(false);
var IE_PROTO = __webpack_require__(40)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 113 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(2);
var aFunction = __webpack_require__(14);
var ctx = __webpack_require__(9);
var forOf = __webpack_require__(16);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(2);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = new Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(41);
var defined = __webpack_require__(29);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(41);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(5);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(8);
var get = __webpack_require__(44);
module.exports = __webpack_require__(0).getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(20);
var ITERATOR = __webpack_require__(4)('iterator');
var Iterators = __webpack_require__(12);
module.exports = __webpack_require__(0).isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(9);
var $export = __webpack_require__(2);
var toObject = __webpack_require__(18);
var call = __webpack_require__(50);
var isArrayIter = __webpack_require__(49);
var toLength = __webpack_require__(22);
var createProperty = __webpack_require__(102);
var getIterFn = __webpack_require__(44);

$export($export.S + $export.F * !__webpack_require__(51)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(93);
var step = __webpack_require__(52);
var Iterators = __webpack_require__(12);
var toIObject = __webpack_require__(42);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(32)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(2);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(108) });


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(2);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(36) });


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(2);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(6), 'Object', { defineProperty: __webpack_require__(7).f });


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(5);
var meta = __webpack_require__(34).onFreeze;

__webpack_require__(53)('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(18);
var $keys = __webpack_require__(37);

__webpack_require__(53)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(33);
var global = __webpack_require__(3);
var ctx = __webpack_require__(9);
var classof = __webpack_require__(20);
var $export = __webpack_require__(2);
var isObject = __webpack_require__(5);
var aFunction = __webpack_require__(14);
var anInstance = __webpack_require__(28);
var forOf = __webpack_require__(16);
var speciesConstructor = __webpack_require__(58);
var task = __webpack_require__(59).set;
var microtask = __webpack_require__(107)();
var newPromiseCapabilityModule = __webpack_require__(35);
var perform = __webpack_require__(54);
var userAgent = __webpack_require__(120);
var promiseResolve = __webpack_require__(55);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(4)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(39)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(21)($Promise, PROMISE);
__webpack_require__(56)(PROMISE);
Wrapper = __webpack_require__(0)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(51)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(99);
var validate = __webpack_require__(60);
var SET = 'Set';

// 23.2 Set Objects
module.exports = __webpack_require__(101)(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(2);
var core = __webpack_require__(0);
var global = __webpack_require__(3);
var speciesConstructor = __webpack_require__(58);
var promiseResolve = __webpack_require__(55);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(2);
var newPromiseCapability = __webpack_require__(35);
var perform = __webpack_require__(54);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
__webpack_require__(115)('Set');


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
__webpack_require__(116)('Set');


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(2);

$export($export.P + $export.R, 'Set', { toJSON: __webpack_require__(100)('Set') });


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["layoutBase"] = factory();
	else
		root["layoutBase"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 28);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function LayoutConstants() {}

/**
 * Layout Quality: 0:draft, 1:default, 2:proof
 */
LayoutConstants.QUALITY = 1;

/**
 * Default parameters
 */
LayoutConstants.DEFAULT_CREATE_BENDS_AS_NEEDED = false;
LayoutConstants.DEFAULT_INCREMENTAL = false;
LayoutConstants.DEFAULT_ANIMATION_ON_LAYOUT = true;
LayoutConstants.DEFAULT_ANIMATION_DURING_LAYOUT = false;
LayoutConstants.DEFAULT_ANIMATION_PERIOD = 50;
LayoutConstants.DEFAULT_UNIFORM_LEAF_NODE_SIZES = false;

// -----------------------------------------------------------------------------
// Section: General other constants
// -----------------------------------------------------------------------------
/*
 * Margins of a graph to be applied on bouding rectangle of its contents. We
 * assume margins on all four sides to be uniform.
 */
LayoutConstants.DEFAULT_GRAPH_MARGIN = 15;

/*
 * Whether to consider labels in node dimensions or not
 */
LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = false;

/*
 * Default dimension of a non-compound node.
 */
LayoutConstants.SIMPLE_NODE_SIZE = 40;

/*
 * Default dimension of a non-compound node.
 */
LayoutConstants.SIMPLE_NODE_HALF_SIZE = LayoutConstants.SIMPLE_NODE_SIZE / 2;

/*
 * Empty compound node size. When a compound node is empty, its both
 * dimensions should be of this value.
 */
LayoutConstants.EMPTY_COMPOUND_NODE_SIZE = 40;

/*
 * Minimum length that an edge should take during layout
 */
LayoutConstants.MIN_EDGE_LENGTH = 1;

/*
 * World boundaries that layout operates on
 */
LayoutConstants.WORLD_BOUNDARY = 1000000;

/*
 * World boundaries that random positioning can be performed with
 */
LayoutConstants.INITIAL_WORLD_BOUNDARY = LayoutConstants.WORLD_BOUNDARY / 1000;

/*
 * Coordinates of the world center
 */
LayoutConstants.WORLD_CENTER_X = 1200;
LayoutConstants.WORLD_CENTER_Y = 900;

module.exports = LayoutConstants;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LGraphObject = __webpack_require__(2);
var IGeometry = __webpack_require__(8);
var IMath = __webpack_require__(9);

function LEdge(source, target, vEdge) {
  LGraphObject.call(this, vEdge);

  this.isOverlapingSourceAndTarget = false;
  this.vGraphObject = vEdge;
  this.bendpoints = [];
  this.source = source;
  this.target = target;
}

LEdge.prototype = Object.create(LGraphObject.prototype);

for (var prop in LGraphObject) {
  LEdge[prop] = LGraphObject[prop];
}

LEdge.prototype.getSource = function () {
  return this.source;
};

LEdge.prototype.getTarget = function () {
  return this.target;
};

LEdge.prototype.isInterGraph = function () {
  return this.isInterGraph;
};

LEdge.prototype.getLength = function () {
  return this.length;
};

LEdge.prototype.isOverlapingSourceAndTarget = function () {
  return this.isOverlapingSourceAndTarget;
};

LEdge.prototype.getBendpoints = function () {
  return this.bendpoints;
};

LEdge.prototype.getLca = function () {
  return this.lca;
};

LEdge.prototype.getSourceInLca = function () {
  return this.sourceInLca;
};

LEdge.prototype.getTargetInLca = function () {
  return this.targetInLca;
};

LEdge.prototype.getOtherEnd = function (node) {
  if (this.source === node) {
    return this.target;
  } else if (this.target === node) {
    return this.source;
  } else {
    throw "Node is not incident with this edge";
  }
};

LEdge.prototype.getOtherEndInGraph = function (node, graph) {
  var otherEnd = this.getOtherEnd(node);
  var root = graph.getGraphManager().getRoot();

  while (true) {
    if (otherEnd.getOwner() == graph) {
      return otherEnd;
    }

    if (otherEnd.getOwner() == root) {
      break;
    }

    otherEnd = otherEnd.getOwner().getParent();
  }

  return null;
};

LEdge.prototype.updateLength = function () {
  var clipPointCoordinates = new Array(4);

  this.isOverlapingSourceAndTarget = IGeometry.getIntersection(this.target.getRect(), this.source.getRect(), clipPointCoordinates);

  if (!this.isOverlapingSourceAndTarget) {
    this.lengthX = clipPointCoordinates[0] - clipPointCoordinates[2];
    this.lengthY = clipPointCoordinates[1] - clipPointCoordinates[3];

    if (Math.abs(this.lengthX) < 1.0) {
      this.lengthX = IMath.sign(this.lengthX);
    }

    if (Math.abs(this.lengthY) < 1.0) {
      this.lengthY = IMath.sign(this.lengthY);
    }

    this.length = Math.sqrt(this.lengthX * this.lengthX + this.lengthY * this.lengthY);
  }
};

LEdge.prototype.updateLengthSimple = function () {
  this.lengthX = this.target.getCenterX() - this.source.getCenterX();
  this.lengthY = this.target.getCenterY() - this.source.getCenterY();

  if (Math.abs(this.lengthX) < 1.0) {
    this.lengthX = IMath.sign(this.lengthX);
  }

  if (Math.abs(this.lengthY) < 1.0) {
    this.lengthY = IMath.sign(this.lengthY);
  }

  this.length = Math.sqrt(this.lengthX * this.lengthX + this.lengthY * this.lengthY);
};

module.exports = LEdge;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function LGraphObject(vGraphObject) {
  this.vGraphObject = vGraphObject;
}

module.exports = LGraphObject;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LGraphObject = __webpack_require__(2);
var Integer = __webpack_require__(10);
var RectangleD = __webpack_require__(13);
var LayoutConstants = __webpack_require__(0);
var RandomSeed = __webpack_require__(16);
var PointD = __webpack_require__(5);

function LNode(gm, loc, size, vNode) {
  //Alternative constructor 1 : LNode(LGraphManager gm, Point loc, Dimension size, Object vNode)
  if (size == null && vNode == null) {
    vNode = loc;
  }

  LGraphObject.call(this, vNode);

  //Alternative constructor 2 : LNode(Layout layout, Object vNode)
  if (gm.graphManager != null) gm = gm.graphManager;

  this.estimatedSize = Integer.MIN_VALUE;
  this.inclusionTreeDepth = Integer.MAX_VALUE;
  this.vGraphObject = vNode;
  this.edges = [];
  this.graphManager = gm;

  if (size != null && loc != null) this.rect = new RectangleD(loc.x, loc.y, size.width, size.height);else this.rect = new RectangleD();
}

LNode.prototype = Object.create(LGraphObject.prototype);
for (var prop in LGraphObject) {
  LNode[prop] = LGraphObject[prop];
}

LNode.prototype.getEdges = function () {
  return this.edges;
};

LNode.prototype.getChild = function () {
  return this.child;
};

LNode.prototype.getOwner = function () {
  //  if (this.owner != null) {
  //    if (!(this.owner == null || this.owner.getNodes().indexOf(this) > -1)) {
  //      throw "assert failed";
  //    }
  //  }

  return this.owner;
};

LNode.prototype.getWidth = function () {
  return this.rect.width;
};

LNode.prototype.setWidth = function (width) {
  this.rect.width = width;
};

LNode.prototype.getHeight = function () {
  return this.rect.height;
};

LNode.prototype.setHeight = function (height) {
  this.rect.height = height;
};

LNode.prototype.getCenterX = function () {
  return this.rect.x + this.rect.width / 2;
};

LNode.prototype.getCenterY = function () {
  return this.rect.y + this.rect.height / 2;
};

LNode.prototype.getCenter = function () {
  return new PointD(this.rect.x + this.rect.width / 2, this.rect.y + this.rect.height / 2);
};

LNode.prototype.getLocation = function () {
  return new PointD(this.rect.x, this.rect.y);
};

LNode.prototype.getRect = function () {
  return this.rect;
};

LNode.prototype.getDiagonal = function () {
  return Math.sqrt(this.rect.width * this.rect.width + this.rect.height * this.rect.height);
};

/**
 * This method returns half the diagonal length of this node.
 */
LNode.prototype.getHalfTheDiagonal = function () {
  return Math.sqrt(this.rect.height * this.rect.height + this.rect.width * this.rect.width) / 2;
};

LNode.prototype.setRect = function (upperLeft, dimension) {
  this.rect.x = upperLeft.x;
  this.rect.y = upperLeft.y;
  this.rect.width = dimension.width;
  this.rect.height = dimension.height;
};

LNode.prototype.setCenter = function (cx, cy) {
  this.rect.x = cx - this.rect.width / 2;
  this.rect.y = cy - this.rect.height / 2;
};

LNode.prototype.setLocation = function (x, y) {
  this.rect.x = x;
  this.rect.y = y;
};

LNode.prototype.moveBy = function (dx, dy) {
  this.rect.x += dx;
  this.rect.y += dy;
};

LNode.prototype.getEdgeListToNode = function (to) {
  var edgeList = [];
  var edge;
  var self = this;

  self.edges.forEach(function (edge) {

    if (edge.target == to) {
      if (edge.source != self) throw "Incorrect edge source!";

      edgeList.push(edge);
    }
  });

  return edgeList;
};

LNode.prototype.getEdgesBetween = function (other) {
  var edgeList = [];
  var edge;

  var self = this;
  self.edges.forEach(function (edge) {

    if (!(edge.source == self || edge.target == self)) throw "Incorrect edge source and/or target";

    if (edge.target == other || edge.source == other) {
      edgeList.push(edge);
    }
  });

  return edgeList;
};

LNode.prototype.getNeighborsList = function () {
  var neighbors = new Set();

  var self = this;
  self.edges.forEach(function (edge) {

    if (edge.source == self) {
      neighbors.add(edge.target);
    } else {
      if (edge.target != self) {
        throw "Incorrect incidency!";
      }

      neighbors.add(edge.source);
    }
  });

  return neighbors;
};

LNode.prototype.withChildren = function () {
  var withNeighborsList = new Set();
  var childNode;
  var children;

  withNeighborsList.add(this);

  if (this.child != null) {
    var nodes = this.child.getNodes();
    for (var i = 0; i < nodes.length; i++) {
      childNode = nodes[i];
      children = childNode.withChildren();
      children.forEach(function (node) {
        withNeighborsList.add(node);
      });
    }
  }

  return withNeighborsList;
};

LNode.prototype.getNoOfChildren = function () {
  var noOfChildren = 0;
  var childNode;

  if (this.child == null) {
    noOfChildren = 1;
  } else {
    var nodes = this.child.getNodes();
    for (var i = 0; i < nodes.length; i++) {
      childNode = nodes[i];

      noOfChildren += childNode.getNoOfChildren();
    }
  }

  if (noOfChildren == 0) {
    noOfChildren = 1;
  }
  return noOfChildren;
};

LNode.prototype.getEstimatedSize = function () {
  if (this.estimatedSize == Integer.MIN_VALUE) {
    throw "assert failed";
  }
  return this.estimatedSize;
};

LNode.prototype.calcEstimatedSize = function () {
  if (this.child == null) {
    return this.estimatedSize = (this.rect.width + this.rect.height) / 2;
  } else {
    this.estimatedSize = this.child.calcEstimatedSize();
    this.rect.width = this.estimatedSize;
    this.rect.height = this.estimatedSize;

    return this.estimatedSize;
  }
};

LNode.prototype.scatter = function () {
  var randomCenterX;
  var randomCenterY;

  var minX = -LayoutConstants.INITIAL_WORLD_BOUNDARY;
  var maxX = LayoutConstants.INITIAL_WORLD_BOUNDARY;
  randomCenterX = LayoutConstants.WORLD_CENTER_X + RandomSeed.nextDouble() * (maxX - minX) + minX;

  var minY = -LayoutConstants.INITIAL_WORLD_BOUNDARY;
  var maxY = LayoutConstants.INITIAL_WORLD_BOUNDARY;
  randomCenterY = LayoutConstants.WORLD_CENTER_Y + RandomSeed.nextDouble() * (maxY - minY) + minY;

  this.rect.x = randomCenterX;
  this.rect.y = randomCenterY;
};

LNode.prototype.updateBounds = function () {
  if (this.getChild() == null) {
    throw "assert failed";
  }
  if (this.getChild().getNodes().length != 0) {
    // wrap the children nodes by re-arranging the boundaries
    var childGraph = this.getChild();
    childGraph.updateBounds(true);

    this.rect.x = childGraph.getLeft();
    this.rect.y = childGraph.getTop();

    this.setWidth(childGraph.getRight() - childGraph.getLeft());
    this.setHeight(childGraph.getBottom() - childGraph.getTop());

    // Update compound bounds considering its label properties    
    if (LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS) {

      var width = childGraph.getRight() - childGraph.getLeft();
      var height = childGraph.getBottom() - childGraph.getTop();

      if (this.labelWidth) {
        if (this.labelPosHorizontal == "left") {
          this.rect.x -= this.labelWidth;
          this.setWidth(width + this.labelWidth);
        } else if (this.labelPosHorizontal == "center" && this.labelWidth > width) {
          this.rect.x -= (this.labelWidth - width) / 2;
          this.setWidth(this.labelWidth);
        } else if (this.labelPosHorizontal == "right") {
          this.setWidth(width + this.labelWidth);
        }
      }

      if (this.labelHeight) {
        if (this.labelPosVertical == "top") {
          this.rect.y -= this.labelHeight;
          this.setHeight(height + this.labelHeight);
        } else if (this.labelPosVertical == "center" && this.labelHeight > height) {
          this.rect.y -= (this.labelHeight - height) / 2;
          this.setHeight(this.labelHeight);
        } else if (this.labelPosVertical == "bottom") {
          this.setHeight(height + this.labelHeight);
        }
      }
    }
  }
};

LNode.prototype.getInclusionTreeDepth = function () {
  if (this.inclusionTreeDepth == Integer.MAX_VALUE) {
    throw "assert failed";
  }
  return this.inclusionTreeDepth;
};

LNode.prototype.transform = function (trans) {
  var left = this.rect.x;

  if (left > LayoutConstants.WORLD_BOUNDARY) {
    left = LayoutConstants.WORLD_BOUNDARY;
  } else if (left < -LayoutConstants.WORLD_BOUNDARY) {
    left = -LayoutConstants.WORLD_BOUNDARY;
  }

  var top = this.rect.y;

  if (top > LayoutConstants.WORLD_BOUNDARY) {
    top = LayoutConstants.WORLD_BOUNDARY;
  } else if (top < -LayoutConstants.WORLD_BOUNDARY) {
    top = -LayoutConstants.WORLD_BOUNDARY;
  }

  var leftTop = new PointD(left, top);
  var vLeftTop = trans.inverseTransformPoint(leftTop);

  this.setLocation(vLeftTop.x, vLeftTop.y);
};

LNode.prototype.getLeft = function () {
  return this.rect.x;
};

LNode.prototype.getRight = function () {
  return this.rect.x + this.rect.width;
};

LNode.prototype.getTop = function () {
  return this.rect.y;
};

LNode.prototype.getBottom = function () {
  return this.rect.y + this.rect.height;
};

LNode.prototype.getParent = function () {
  if (this.owner == null) {
    return null;
  }

  return this.owner.getParent();
};

module.exports = LNode;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LayoutConstants = __webpack_require__(0);

function FDLayoutConstants() {}

//FDLayoutConstants inherits static props in LayoutConstants
for (var prop in LayoutConstants) {
  FDLayoutConstants[prop] = LayoutConstants[prop];
}

FDLayoutConstants.MAX_ITERATIONS = 2500;

FDLayoutConstants.DEFAULT_EDGE_LENGTH = 50;
FDLayoutConstants.DEFAULT_SPRING_STRENGTH = 0.45;
FDLayoutConstants.DEFAULT_REPULSION_STRENGTH = 4500.0;
FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH = 0.4;
FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = 1.0;
FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR = 3.8;
FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = 1.5;
FDLayoutConstants.DEFAULT_USE_SMART_IDEAL_EDGE_LENGTH_CALCULATION = true;
FDLayoutConstants.DEFAULT_USE_SMART_REPULSION_RANGE_CALCULATION = true;
FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = 0.3;
FDLayoutConstants.COOLING_ADAPTATION_FACTOR = 0.33;
FDLayoutConstants.ADAPTATION_LOWER_NODE_LIMIT = 1000;
FDLayoutConstants.ADAPTATION_UPPER_NODE_LIMIT = 5000;
FDLayoutConstants.MAX_NODE_DISPLACEMENT_INCREMENTAL = 100.0;
FDLayoutConstants.MAX_NODE_DISPLACEMENT = FDLayoutConstants.MAX_NODE_DISPLACEMENT_INCREMENTAL * 3;
FDLayoutConstants.MIN_REPULSION_DIST = FDLayoutConstants.DEFAULT_EDGE_LENGTH / 10.0;
FDLayoutConstants.CONVERGENCE_CHECK_PERIOD = 100;
FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = 0.1;
FDLayoutConstants.MIN_EDGE_LENGTH = 1;
FDLayoutConstants.GRID_CALCULATION_CHECK_PERIOD = 10;

module.exports = FDLayoutConstants;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function PointD(x, y) {
  if (x == null && y == null) {
    this.x = 0;
    this.y = 0;
  } else {
    this.x = x;
    this.y = y;
  }
}

PointD.prototype.getX = function () {
  return this.x;
};

PointD.prototype.getY = function () {
  return this.y;
};

PointD.prototype.setX = function (x) {
  this.x = x;
};

PointD.prototype.setY = function (y) {
  this.y = y;
};

PointD.prototype.getDifference = function (pt) {
  return new DimensionD(this.x - pt.x, this.y - pt.y);
};

PointD.prototype.getCopy = function () {
  return new PointD(this.x, this.y);
};

PointD.prototype.translate = function (dim) {
  this.x += dim.width;
  this.y += dim.height;
  return this;
};

module.exports = PointD;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LGraphObject = __webpack_require__(2);
var Integer = __webpack_require__(10);
var LayoutConstants = __webpack_require__(0);
var LGraphManager = __webpack_require__(7);
var LNode = __webpack_require__(3);
var LEdge = __webpack_require__(1);
var RectangleD = __webpack_require__(13);
var Point = __webpack_require__(12);
var LinkedList = __webpack_require__(11);

function LGraph(parent, obj2, vGraph) {
  LGraphObject.call(this, vGraph);
  this.estimatedSize = Integer.MIN_VALUE;
  this.margin = LayoutConstants.DEFAULT_GRAPH_MARGIN;
  this.edges = [];
  this.nodes = [];
  this.isConnected = false;
  this.parent = parent;

  if (obj2 != null && obj2 instanceof LGraphManager) {
    this.graphManager = obj2;
  } else if (obj2 != null && obj2 instanceof Layout) {
    this.graphManager = obj2.graphManager;
  }
}

LGraph.prototype = Object.create(LGraphObject.prototype);
for (var prop in LGraphObject) {
  LGraph[prop] = LGraphObject[prop];
}

LGraph.prototype.getNodes = function () {
  return this.nodes;
};

LGraph.prototype.getEdges = function () {
  return this.edges;
};

LGraph.prototype.getGraphManager = function () {
  return this.graphManager;
};

LGraph.prototype.getParent = function () {
  return this.parent;
};

LGraph.prototype.getLeft = function () {
  return this.left;
};

LGraph.prototype.getRight = function () {
  return this.right;
};

LGraph.prototype.getTop = function () {
  return this.top;
};

LGraph.prototype.getBottom = function () {
  return this.bottom;
};

LGraph.prototype.isConnected = function () {
  return this.isConnected;
};

LGraph.prototype.add = function (obj1, sourceNode, targetNode) {
  if (sourceNode == null && targetNode == null) {
    var newNode = obj1;
    if (this.graphManager == null) {
      throw "Graph has no graph mgr!";
    }
    if (this.getNodes().indexOf(newNode) > -1) {
      throw "Node already in graph!";
    }
    newNode.owner = this;
    this.getNodes().push(newNode);

    return newNode;
  } else {
    var newEdge = obj1;
    if (!(this.getNodes().indexOf(sourceNode) > -1 && this.getNodes().indexOf(targetNode) > -1)) {
      throw "Source or target not in graph!";
    }

    if (!(sourceNode.owner == targetNode.owner && sourceNode.owner == this)) {
      throw "Both owners must be this graph!";
    }

    if (sourceNode.owner != targetNode.owner) {
      return null;
    }

    // set source and target
    newEdge.source = sourceNode;
    newEdge.target = targetNode;

    // set as intra-graph edge
    newEdge.isInterGraph = false;

    // add to graph edge list
    this.getEdges().push(newEdge);

    // add to incidency lists
    sourceNode.edges.push(newEdge);

    if (targetNode != sourceNode) {
      targetNode.edges.push(newEdge);
    }

    return newEdge;
  }
};

LGraph.prototype.remove = function (obj) {
  var node = obj;
  if (obj instanceof LNode) {
    if (node == null) {
      throw "Node is null!";
    }
    if (!(node.owner != null && node.owner == this)) {
      throw "Owner graph is invalid!";
    }
    if (this.graphManager == null) {
      throw "Owner graph manager is invalid!";
    }
    // remove incident edges first (make a copy to do it safely)
    var edgesToBeRemoved = node.edges.slice();
    var edge;
    var s = edgesToBeRemoved.length;
    for (var i = 0; i < s; i++) {
      edge = edgesToBeRemoved[i];

      if (edge.isInterGraph) {
        this.graphManager.remove(edge);
      } else {
        edge.source.owner.remove(edge);
      }
    }

    // now the node itself
    var index = this.nodes.indexOf(node);
    if (index == -1) {
      throw "Node not in owner node list!";
    }

    this.nodes.splice(index, 1);
  } else if (obj instanceof LEdge) {
    var edge = obj;
    if (edge == null) {
      throw "Edge is null!";
    }
    if (!(edge.source != null && edge.target != null)) {
      throw "Source and/or target is null!";
    }
    if (!(edge.source.owner != null && edge.target.owner != null && edge.source.owner == this && edge.target.owner == this)) {
      throw "Source and/or target owner is invalid!";
    }

    var sourceIndex = edge.source.edges.indexOf(edge);
    var targetIndex = edge.target.edges.indexOf(edge);
    if (!(sourceIndex > -1 && targetIndex > -1)) {
      throw "Source and/or target doesn't know this edge!";
    }

    edge.source.edges.splice(sourceIndex, 1);

    if (edge.target != edge.source) {
      edge.target.edges.splice(targetIndex, 1);
    }

    var index = edge.source.owner.getEdges().indexOf(edge);
    if (index == -1) {
      throw "Not in owner's edge list!";
    }

    edge.source.owner.getEdges().splice(index, 1);
  }
};

LGraph.prototype.updateLeftTop = function () {
  var top = Integer.MAX_VALUE;
  var left = Integer.MAX_VALUE;
  var nodeTop;
  var nodeLeft;
  var margin;

  var nodes = this.getNodes();
  var s = nodes.length;

  for (var i = 0; i < s; i++) {
    var lNode = nodes[i];
    nodeTop = lNode.getTop();
    nodeLeft = lNode.getLeft();

    if (top > nodeTop) {
      top = nodeTop;
    }

    if (left > nodeLeft) {
      left = nodeLeft;
    }
  }

  // Do we have any nodes in this graph?
  if (top == Integer.MAX_VALUE) {
    return null;
  }

  if (nodes[0].getParent().paddingLeft != undefined) {
    margin = nodes[0].getParent().paddingLeft;
  } else {
    margin = this.margin;
  }

  this.left = left - margin;
  this.top = top - margin;

  // Apply the margins and return the result
  return new Point(this.left, this.top);
};

LGraph.prototype.updateBounds = function (recursive) {
  // calculate bounds
  var left = Integer.MAX_VALUE;
  var right = -Integer.MAX_VALUE;
  var top = Integer.MAX_VALUE;
  var bottom = -Integer.MAX_VALUE;
  var nodeLeft;
  var nodeRight;
  var nodeTop;
  var nodeBottom;
  var margin;

  var nodes = this.nodes;
  var s = nodes.length;
  for (var i = 0; i < s; i++) {
    var lNode = nodes[i];

    if (recursive && lNode.child != null) {
      lNode.updateBounds();
    }
    nodeLeft = lNode.getLeft();
    nodeRight = lNode.getRight();
    nodeTop = lNode.getTop();
    nodeBottom = lNode.getBottom();

    if (left > nodeLeft) {
      left = nodeLeft;
    }

    if (right < nodeRight) {
      right = nodeRight;
    }

    if (top > nodeTop) {
      top = nodeTop;
    }

    if (bottom < nodeBottom) {
      bottom = nodeBottom;
    }
  }

  var boundingRect = new RectangleD(left, top, right - left, bottom - top);
  if (left == Integer.MAX_VALUE) {
    this.left = this.parent.getLeft();
    this.right = this.parent.getRight();
    this.top = this.parent.getTop();
    this.bottom = this.parent.getBottom();
  }

  if (nodes[0].getParent().paddingLeft != undefined) {
    margin = nodes[0].getParent().paddingLeft;
  } else {
    margin = this.margin;
  }

  this.left = boundingRect.x - margin;
  this.right = boundingRect.x + boundingRect.width + margin;
  this.top = boundingRect.y - margin;
  this.bottom = boundingRect.y + boundingRect.height + margin;
};

LGraph.calculateBounds = function (nodes) {
  var left = Integer.MAX_VALUE;
  var right = -Integer.MAX_VALUE;
  var top = Integer.MAX_VALUE;
  var bottom = -Integer.MAX_VALUE;
  var nodeLeft;
  var nodeRight;
  var nodeTop;
  var nodeBottom;

  var s = nodes.length;

  for (var i = 0; i < s; i++) {
    var lNode = nodes[i];
    nodeLeft = lNode.getLeft();
    nodeRight = lNode.getRight();
    nodeTop = lNode.getTop();
    nodeBottom = lNode.getBottom();

    if (left > nodeLeft) {
      left = nodeLeft;
    }

    if (right < nodeRight) {
      right = nodeRight;
    }

    if (top > nodeTop) {
      top = nodeTop;
    }

    if (bottom < nodeBottom) {
      bottom = nodeBottom;
    }
  }

  var boundingRect = new RectangleD(left, top, right - left, bottom - top);

  return boundingRect;
};

LGraph.prototype.getInclusionTreeDepth = function () {
  if (this == this.graphManager.getRoot()) {
    return 1;
  } else {
    return this.parent.getInclusionTreeDepth();
  }
};

LGraph.prototype.getEstimatedSize = function () {
  if (this.estimatedSize == Integer.MIN_VALUE) {
    throw "assert failed";
  }
  return this.estimatedSize;
};

LGraph.prototype.calcEstimatedSize = function () {
  var size = 0;
  var nodes = this.nodes;
  var s = nodes.length;

  for (var i = 0; i < s; i++) {
    var lNode = nodes[i];
    size += lNode.calcEstimatedSize();
  }

  if (size == 0) {
    this.estimatedSize = LayoutConstants.EMPTY_COMPOUND_NODE_SIZE;
  } else {
    this.estimatedSize = size / Math.sqrt(this.nodes.length);
  }

  return this.estimatedSize;
};

LGraph.prototype.updateConnected = function () {
  var self = this;
  if (this.nodes.length == 0) {
    this.isConnected = true;
    return;
  }

  var queue = new LinkedList();
  var visited = new Set();
  var currentNode = this.nodes[0];
  var neighborEdges;
  var currentNeighbor;
  var childrenOfNode = currentNode.withChildren();
  childrenOfNode.forEach(function (node) {
    queue.push(node);
    visited.add(node);
  });

  while (queue.length !== 0) {
    currentNode = queue.shift();

    // Traverse all neighbors of this node
    neighborEdges = currentNode.getEdges();
    var size = neighborEdges.length;
    for (var i = 0; i < size; i++) {
      var neighborEdge = neighborEdges[i];
      currentNeighbor = neighborEdge.getOtherEndInGraph(currentNode, this);

      // Add unvisited neighbors to the list to visit
      if (currentNeighbor != null && !visited.has(currentNeighbor)) {
        var childrenOfNeighbor = currentNeighbor.withChildren();

        childrenOfNeighbor.forEach(function (node) {
          queue.push(node);
          visited.add(node);
        });
      }
    }
  }

  this.isConnected = false;

  if (visited.size >= this.nodes.length) {
    var noOfVisitedInThisGraph = 0;

    visited.forEach(function (visitedNode) {
      if (visitedNode.owner == self) {
        noOfVisitedInThisGraph++;
      }
    });

    if (noOfVisitedInThisGraph == this.nodes.length) {
      this.isConnected = true;
    }
  }
};

module.exports = LGraph;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LGraph;
var LEdge = __webpack_require__(1);

function LGraphManager(layout) {
  LGraph = __webpack_require__(6); // It may be better to initilize this out of this function but it gives an error (Right-hand side of 'instanceof' is not callable) now.
  this.layout = layout;

  this.graphs = [];
  this.edges = [];
}

LGraphManager.prototype.addRoot = function () {
  var ngraph = this.layout.newGraph();
  var nnode = this.layout.newNode(null);
  var root = this.add(ngraph, nnode);
  this.setRootGraph(root);
  return this.rootGraph;
};

LGraphManager.prototype.add = function (newGraph, parentNode, newEdge, sourceNode, targetNode) {
  //there are just 2 parameters are passed then it adds an LGraph else it adds an LEdge
  if (newEdge == null && sourceNode == null && targetNode == null) {
    if (newGraph == null) {
      throw "Graph is null!";
    }
    if (parentNode == null) {
      throw "Parent node is null!";
    }
    if (this.graphs.indexOf(newGraph) > -1) {
      throw "Graph already in this graph mgr!";
    }

    this.graphs.push(newGraph);

    if (newGraph.parent != null) {
      throw "Already has a parent!";
    }
    if (parentNode.child != null) {
      throw "Already has a child!";
    }

    newGraph.parent = parentNode;
    parentNode.child = newGraph;

    return newGraph;
  } else {
    //change the order of the parameters
    targetNode = newEdge;
    sourceNode = parentNode;
    newEdge = newGraph;
    var sourceGraph = sourceNode.getOwner();
    var targetGraph = targetNode.getOwner();

    if (!(sourceGraph != null && sourceGraph.getGraphManager() == this)) {
      throw "Source not in this graph mgr!";
    }
    if (!(targetGraph != null && targetGraph.getGraphManager() == this)) {
      throw "Target not in this graph mgr!";
    }

    if (sourceGraph == targetGraph) {
      newEdge.isInterGraph = false;
      return sourceGraph.add(newEdge, sourceNode, targetNode);
    } else {
      newEdge.isInterGraph = true;

      // set source and target
      newEdge.source = sourceNode;
      newEdge.target = targetNode;

      // add edge to inter-graph edge list
      if (this.edges.indexOf(newEdge) > -1) {
        throw "Edge already in inter-graph edge list!";
      }

      this.edges.push(newEdge);

      // add edge to source and target incidency lists
      if (!(newEdge.source != null && newEdge.target != null)) {
        throw "Edge source and/or target is null!";
      }

      if (!(newEdge.source.edges.indexOf(newEdge) == -1 && newEdge.target.edges.indexOf(newEdge) == -1)) {
        throw "Edge already in source and/or target incidency list!";
      }

      newEdge.source.edges.push(newEdge);
      newEdge.target.edges.push(newEdge);

      return newEdge;
    }
  }
};

LGraphManager.prototype.remove = function (lObj) {
  if (lObj instanceof LGraph) {
    var graph = lObj;
    if (graph.getGraphManager() != this) {
      throw "Graph not in this graph mgr";
    }
    if (!(graph == this.rootGraph || graph.parent != null && graph.parent.graphManager == this)) {
      throw "Invalid parent node!";
    }

    // first the edges (make a copy to do it safely)
    var edgesToBeRemoved = [];

    edgesToBeRemoved = edgesToBeRemoved.concat(graph.getEdges());

    var edge;
    var s = edgesToBeRemoved.length;
    for (var i = 0; i < s; i++) {
      edge = edgesToBeRemoved[i];
      graph.remove(edge);
    }

    // then the nodes (make a copy to do it safely)
    var nodesToBeRemoved = [];

    nodesToBeRemoved = nodesToBeRemoved.concat(graph.getNodes());

    var node;
    s = nodesToBeRemoved.length;
    for (var i = 0; i < s; i++) {
      node = nodesToBeRemoved[i];
      graph.remove(node);
    }

    // check if graph is the root
    if (graph == this.rootGraph) {
      this.setRootGraph(null);
    }

    // now remove the graph itself
    var index = this.graphs.indexOf(graph);
    this.graphs.splice(index, 1);

    // also reset the parent of the graph
    graph.parent = null;
  } else if (lObj instanceof LEdge) {
    edge = lObj;
    if (edge == null) {
      throw "Edge is null!";
    }
    if (!edge.isInterGraph) {
      throw "Not an inter-graph edge!";
    }
    if (!(edge.source != null && edge.target != null)) {
      throw "Source and/or target is null!";
    }

    // remove edge from source and target nodes' incidency lists

    if (!(edge.source.edges.indexOf(edge) != -1 && edge.target.edges.indexOf(edge) != -1)) {
      throw "Source and/or target doesn't know this edge!";
    }

    var index = edge.source.edges.indexOf(edge);
    edge.source.edges.splice(index, 1);
    index = edge.target.edges.indexOf(edge);
    edge.target.edges.splice(index, 1);

    // remove edge from owner graph manager's inter-graph edge list

    if (!(edge.source.owner != null && edge.source.owner.getGraphManager() != null)) {
      throw "Edge owner graph or owner graph manager is null!";
    }
    if (edge.source.owner.getGraphManager().edges.indexOf(edge) == -1) {
      throw "Not in owner graph manager's edge list!";
    }

    var index = edge.source.owner.getGraphManager().edges.indexOf(edge);
    edge.source.owner.getGraphManager().edges.splice(index, 1);
  }
};

LGraphManager.prototype.updateBounds = function () {
  this.rootGraph.updateBounds(true);
};

LGraphManager.prototype.getGraphs = function () {
  return this.graphs;
};

LGraphManager.prototype.getAllNodes = function () {
  if (this.allNodes == null) {
    var nodeList = [];
    var graphs = this.getGraphs();
    var s = graphs.length;
    for (var i = 0; i < s; i++) {
      nodeList = nodeList.concat(graphs[i].getNodes());
    }
    this.allNodes = nodeList;
  }
  return this.allNodes;
};

LGraphManager.prototype.resetAllNodes = function () {
  this.allNodes = null;
};

LGraphManager.prototype.resetAllEdges = function () {
  this.allEdges = null;
};

LGraphManager.prototype.resetAllNodesToApplyGravitation = function () {
  this.allNodesToApplyGravitation = null;
};

LGraphManager.prototype.getAllEdges = function () {
  if (this.allEdges == null) {
    var edgeList = [];
    var graphs = this.getGraphs();
    var s = graphs.length;
    for (var i = 0; i < graphs.length; i++) {
      edgeList = edgeList.concat(graphs[i].getEdges());
    }

    edgeList = edgeList.concat(this.edges);

    this.allEdges = edgeList;
  }
  return this.allEdges;
};

LGraphManager.prototype.getAllNodesToApplyGravitation = function () {
  return this.allNodesToApplyGravitation;
};

LGraphManager.prototype.setAllNodesToApplyGravitation = function (nodeList) {
  if (this.allNodesToApplyGravitation != null) {
    throw "assert failed";
  }

  this.allNodesToApplyGravitation = nodeList;
};

LGraphManager.prototype.getRoot = function () {
  return this.rootGraph;
};

LGraphManager.prototype.setRootGraph = function (graph) {
  if (graph.getGraphManager() != this) {
    throw "Root not in this graph mgr!";
  }

  this.rootGraph = graph;
  // root graph must have a root node associated with it for convenience
  if (graph.parent == null) {
    graph.parent = this.layout.newNode("Root node");
  }
};

LGraphManager.prototype.getLayout = function () {
  return this.layout;
};

LGraphManager.prototype.isOneAncestorOfOther = function (firstNode, secondNode) {
  if (!(firstNode != null && secondNode != null)) {
    throw "assert failed";
  }

  if (firstNode == secondNode) {
    return true;
  }
  // Is second node an ancestor of the first one?
  var ownerGraph = firstNode.getOwner();
  var parentNode;

  do {
    parentNode = ownerGraph.getParent();

    if (parentNode == null) {
      break;
    }

    if (parentNode == secondNode) {
      return true;
    }

    ownerGraph = parentNode.getOwner();
    if (ownerGraph == null) {
      break;
    }
  } while (true);
  // Is first node an ancestor of the second one?
  ownerGraph = secondNode.getOwner();

  do {
    parentNode = ownerGraph.getParent();

    if (parentNode == null) {
      break;
    }

    if (parentNode == firstNode) {
      return true;
    }

    ownerGraph = parentNode.getOwner();
    if (ownerGraph == null) {
      break;
    }
  } while (true);

  return false;
};

LGraphManager.prototype.calcLowestCommonAncestors = function () {
  var edge;
  var sourceNode;
  var targetNode;
  var sourceAncestorGraph;
  var targetAncestorGraph;

  var edges = this.getAllEdges();
  var s = edges.length;
  for (var i = 0; i < s; i++) {
    edge = edges[i];

    sourceNode = edge.source;
    targetNode = edge.target;
    edge.lca = null;
    edge.sourceInLca = sourceNode;
    edge.targetInLca = targetNode;

    if (sourceNode == targetNode) {
      edge.lca = sourceNode.getOwner();
      continue;
    }

    sourceAncestorGraph = sourceNode.getOwner();

    while (edge.lca == null) {
      edge.targetInLca = targetNode;
      targetAncestorGraph = targetNode.getOwner();

      while (edge.lca == null) {
        if (targetAncestorGraph == sourceAncestorGraph) {
          edge.lca = targetAncestorGraph;
          break;
        }

        if (targetAncestorGraph == this.rootGraph) {
          break;
        }

        if (edge.lca != null) {
          throw "assert failed";
        }
        edge.targetInLca = targetAncestorGraph.getParent();
        targetAncestorGraph = edge.targetInLca.getOwner();
      }

      if (sourceAncestorGraph == this.rootGraph) {
        break;
      }

      if (edge.lca == null) {
        edge.sourceInLca = sourceAncestorGraph.getParent();
        sourceAncestorGraph = edge.sourceInLca.getOwner();
      }
    }

    if (edge.lca == null) {
      throw "assert failed";
    }
  }
};

LGraphManager.prototype.calcLowestCommonAncestor = function (firstNode, secondNode) {
  if (firstNode == secondNode) {
    return firstNode.getOwner();
  }
  var firstOwnerGraph = firstNode.getOwner();

  do {
    if (firstOwnerGraph == null) {
      break;
    }
    var secondOwnerGraph = secondNode.getOwner();

    do {
      if (secondOwnerGraph == null) {
        break;
      }

      if (secondOwnerGraph == firstOwnerGraph) {
        return secondOwnerGraph;
      }
      secondOwnerGraph = secondOwnerGraph.getParent().getOwner();
    } while (true);

    firstOwnerGraph = firstOwnerGraph.getParent().getOwner();
  } while (true);

  return firstOwnerGraph;
};

LGraphManager.prototype.calcInclusionTreeDepths = function (graph, depth) {
  if (graph == null && depth == null) {
    graph = this.rootGraph;
    depth = 1;
  }
  var node;

  var nodes = graph.getNodes();
  var s = nodes.length;
  for (var i = 0; i < s; i++) {
    node = nodes[i];
    node.inclusionTreeDepth = depth;

    if (node.child != null) {
      this.calcInclusionTreeDepths(node.child, depth + 1);
    }
  }
};

LGraphManager.prototype.includesInvalidEdge = function () {
  var edge;
  var edgesToRemove = [];

  var s = this.edges.length;
  for (var i = 0; i < s; i++) {
    edge = this.edges[i];

    if (this.isOneAncestorOfOther(edge.source, edge.target)) {
      edgesToRemove.push(edge);
    }
  }

  // Remove invalid edges from graph manager
  for (var i = 0; i < edgesToRemove.length; i++) {
    this.remove(edgesToRemove[i]);
  }

  // Invalid edges are cleared, so return false
  return false;
};

module.exports = LGraphManager;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This class maintains a list of static geometry related utility methods.
 *
 *
 * Copyright: i-Vis Research Group, Bilkent University, 2007 - present
 */

var Point = __webpack_require__(12);

function IGeometry() {}

/**
 * This method calculates *half* the amount in x and y directions of the two
 * input rectangles needed to separate them keeping their respective
 * positioning, and returns the result in the input array. An input
 * separation buffer added to the amount in both directions. We assume that
 * the two rectangles do intersect.
 */
IGeometry.calcSeparationAmount = function (rectA, rectB, overlapAmount, separationBuffer) {
  if (!rectA.intersects(rectB)) {
    throw "assert failed";
  }

  var directions = new Array(2);

  this.decideDirectionsForOverlappingNodes(rectA, rectB, directions);

  overlapAmount[0] = Math.min(rectA.getRight(), rectB.getRight()) - Math.max(rectA.x, rectB.x);
  overlapAmount[1] = Math.min(rectA.getBottom(), rectB.getBottom()) - Math.max(rectA.y, rectB.y);

  // update the overlapping amounts for the following cases:
  if (rectA.getX() <= rectB.getX() && rectA.getRight() >= rectB.getRight()) {
    /* Case x.1:
    *
    * rectA
    * 	|                       |
    * 	|        _________      |
    * 	|        |       |      |
    * 	|________|_______|______|
    * 			 |       |
    *           |       |
    *        rectB
    */
    overlapAmount[0] += Math.min(rectB.getX() - rectA.getX(), rectA.getRight() - rectB.getRight());
  } else if (rectB.getX() <= rectA.getX() && rectB.getRight() >= rectA.getRight()) {
    /* Case x.2:
    *
    * rectB
    * 	|                       |
    * 	|        _________      |
    * 	|        |       |      |
    * 	|________|_______|______|
    * 			 |       |
    *           |       |
    *        rectA
    */
    overlapAmount[0] += Math.min(rectA.getX() - rectB.getX(), rectB.getRight() - rectA.getRight());
  }
  if (rectA.getY() <= rectB.getY() && rectA.getBottom() >= rectB.getBottom()) {
    /* Case y.1:
     *          ________ rectA
     *         |
     *         |
     *   ______|____  rectB
     *         |    |
     *         |    |
     *   ______|____|
     *         |
     *         |
     *         |________
     *
     */
    overlapAmount[1] += Math.min(rectB.getY() - rectA.getY(), rectA.getBottom() - rectB.getBottom());
  } else if (rectB.getY() <= rectA.getY() && rectB.getBottom() >= rectA.getBottom()) {
    /* Case y.2:
    *          ________ rectB
    *         |
    *         |
    *   ______|____  rectA
    *         |    |
    *         |    |
    *   ______|____|
    *         |
    *         |
    *         |________
    *
    */
    overlapAmount[1] += Math.min(rectA.getY() - rectB.getY(), rectB.getBottom() - rectA.getBottom());
  }

  // find slope of the line passes two centers
  var slope = Math.abs((rectB.getCenterY() - rectA.getCenterY()) / (rectB.getCenterX() - rectA.getCenterX()));
  // if centers are overlapped
  if (rectB.getCenterY() === rectA.getCenterY() && rectB.getCenterX() === rectA.getCenterX()) {
    // assume the slope is 1 (45 degree)
    slope = 1.0;
  }

  var moveByY = slope * overlapAmount[0];
  var moveByX = overlapAmount[1] / slope;
  if (overlapAmount[0] < moveByX) {
    moveByX = overlapAmount[0];
  } else {
    moveByY = overlapAmount[1];
  }
  // return half the amount so that if each rectangle is moved by these
  // amounts in opposite directions, overlap will be resolved
  overlapAmount[0] = -1 * directions[0] * (moveByX / 2 + separationBuffer);
  overlapAmount[1] = -1 * directions[1] * (moveByY / 2 + separationBuffer);
};

/**
 * This method decides the separation direction of overlapping nodes
 *
 * if directions[0] = -1, then rectA goes left
 * if directions[0] = 1,  then rectA goes right
 * if directions[1] = -1, then rectA goes up
 * if directions[1] = 1,  then rectA goes down
 */
IGeometry.decideDirectionsForOverlappingNodes = function (rectA, rectB, directions) {
  if (rectA.getCenterX() < rectB.getCenterX()) {
    directions[0] = -1;
  } else {
    directions[0] = 1;
  }

  if (rectA.getCenterY() < rectB.getCenterY()) {
    directions[1] = -1;
  } else {
    directions[1] = 1;
  }
};

/**
 * This method calculates the intersection (clipping) points of the two
 * input rectangles with line segment defined by the centers of these two
 * rectangles. The clipping points are saved in the input double array and
 * whether or not the two rectangles overlap is returned.
 */
IGeometry.getIntersection2 = function (rectA, rectB, result) {
  //result[0-1] will contain clipPoint of rectA, result[2-3] will contain clipPoint of rectB
  var p1x = rectA.getCenterX();
  var p1y = rectA.getCenterY();
  var p2x = rectB.getCenterX();
  var p2y = rectB.getCenterY();

  //if two rectangles intersect, then clipping points are centers
  if (rectA.intersects(rectB)) {
    result[0] = p1x;
    result[1] = p1y;
    result[2] = p2x;
    result[3] = p2y;
    return true;
  }
  //variables for rectA
  var topLeftAx = rectA.getX();
  var topLeftAy = rectA.getY();
  var topRightAx = rectA.getRight();
  var bottomLeftAx = rectA.getX();
  var bottomLeftAy = rectA.getBottom();
  var bottomRightAx = rectA.getRight();
  var halfWidthA = rectA.getWidthHalf();
  var halfHeightA = rectA.getHeightHalf();
  //variables for rectB
  var topLeftBx = rectB.getX();
  var topLeftBy = rectB.getY();
  var topRightBx = rectB.getRight();
  var bottomLeftBx = rectB.getX();
  var bottomLeftBy = rectB.getBottom();
  var bottomRightBx = rectB.getRight();
  var halfWidthB = rectB.getWidthHalf();
  var halfHeightB = rectB.getHeightHalf();

  //flag whether clipping points are found
  var clipPointAFound = false;
  var clipPointBFound = false;

  // line is vertical
  if (p1x === p2x) {
    if (p1y > p2y) {
      result[0] = p1x;
      result[1] = topLeftAy;
      result[2] = p2x;
      result[3] = bottomLeftBy;
      return false;
    } else if (p1y < p2y) {
      result[0] = p1x;
      result[1] = bottomLeftAy;
      result[2] = p2x;
      result[3] = topLeftBy;
      return false;
    } else {
      //not line, return null;
    }
  }
  // line is horizontal
  else if (p1y === p2y) {
      if (p1x > p2x) {
        result[0] = topLeftAx;
        result[1] = p1y;
        result[2] = topRightBx;
        result[3] = p2y;
        return false;
      } else if (p1x < p2x) {
        result[0] = topRightAx;
        result[1] = p1y;
        result[2] = topLeftBx;
        result[3] = p2y;
        return false;
      } else {
        //not valid line, return null;
      }
    } else {
      //slopes of rectA's and rectB's diagonals
      var slopeA = rectA.height / rectA.width;
      var slopeB = rectB.height / rectB.width;

      //slope of line between center of rectA and center of rectB
      var slopePrime = (p2y - p1y) / (p2x - p1x);
      var cardinalDirectionA = void 0;
      var cardinalDirectionB = void 0;
      var tempPointAx = void 0;
      var tempPointAy = void 0;
      var tempPointBx = void 0;
      var tempPointBy = void 0;

      //determine whether clipping point is the corner of nodeA
      if (-slopeA === slopePrime) {
        if (p1x > p2x) {
          result[0] = bottomLeftAx;
          result[1] = bottomLeftAy;
          clipPointAFound = true;
        } else {
          result[0] = topRightAx;
          result[1] = topLeftAy;
          clipPointAFound = true;
        }
      } else if (slopeA === slopePrime) {
        if (p1x > p2x) {
          result[0] = topLeftAx;
          result[1] = topLeftAy;
          clipPointAFound = true;
        } else {
          result[0] = bottomRightAx;
          result[1] = bottomLeftAy;
          clipPointAFound = true;
        }
      }

      //determine whether clipping point is the corner of nodeB
      if (-slopeB === slopePrime) {
        if (p2x > p1x) {
          result[2] = bottomLeftBx;
          result[3] = bottomLeftBy;
          clipPointBFound = true;
        } else {
          result[2] = topRightBx;
          result[3] = topLeftBy;
          clipPointBFound = true;
        }
      } else if (slopeB === slopePrime) {
        if (p2x > p1x) {
          result[2] = topLeftBx;
          result[3] = topLeftBy;
          clipPointBFound = true;
        } else {
          result[2] = bottomRightBx;
          result[3] = bottomLeftBy;
          clipPointBFound = true;
        }
      }

      //if both clipping points are corners
      if (clipPointAFound && clipPointBFound) {
        return false;
      }

      //determine Cardinal Direction of rectangles
      if (p1x > p2x) {
        if (p1y > p2y) {
          cardinalDirectionA = this.getCardinalDirection(slopeA, slopePrime, 4);
          cardinalDirectionB = this.getCardinalDirection(slopeB, slopePrime, 2);
        } else {
          cardinalDirectionA = this.getCardinalDirection(-slopeA, slopePrime, 3);
          cardinalDirectionB = this.getCardinalDirection(-slopeB, slopePrime, 1);
        }
      } else {
        if (p1y > p2y) {
          cardinalDirectionA = this.getCardinalDirection(-slopeA, slopePrime, 1);
          cardinalDirectionB = this.getCardinalDirection(-slopeB, slopePrime, 3);
        } else {
          cardinalDirectionA = this.getCardinalDirection(slopeA, slopePrime, 2);
          cardinalDirectionB = this.getCardinalDirection(slopeB, slopePrime, 4);
        }
      }
      //calculate clipping Point if it is not found before
      if (!clipPointAFound) {
        switch (cardinalDirectionA) {
          case 1:
            tempPointAy = topLeftAy;
            tempPointAx = p1x + -halfHeightA / slopePrime;
            result[0] = tempPointAx;
            result[1] = tempPointAy;
            break;
          case 2:
            tempPointAx = bottomRightAx;
            tempPointAy = p1y + halfWidthA * slopePrime;
            result[0] = tempPointAx;
            result[1] = tempPointAy;
            break;
          case 3:
            tempPointAy = bottomLeftAy;
            tempPointAx = p1x + halfHeightA / slopePrime;
            result[0] = tempPointAx;
            result[1] = tempPointAy;
            break;
          case 4:
            tempPointAx = bottomLeftAx;
            tempPointAy = p1y + -halfWidthA * slopePrime;
            result[0] = tempPointAx;
            result[1] = tempPointAy;
            break;
        }
      }
      if (!clipPointBFound) {
        switch (cardinalDirectionB) {
          case 1:
            tempPointBy = topLeftBy;
            tempPointBx = p2x + -halfHeightB / slopePrime;
            result[2] = tempPointBx;
            result[3] = tempPointBy;
            break;
          case 2:
            tempPointBx = bottomRightBx;
            tempPointBy = p2y + halfWidthB * slopePrime;
            result[2] = tempPointBx;
            result[3] = tempPointBy;
            break;
          case 3:
            tempPointBy = bottomLeftBy;
            tempPointBx = p2x + halfHeightB / slopePrime;
            result[2] = tempPointBx;
            result[3] = tempPointBy;
            break;
          case 4:
            tempPointBx = bottomLeftBx;
            tempPointBy = p2y + -halfWidthB * slopePrime;
            result[2] = tempPointBx;
            result[3] = tempPointBy;
            break;
        }
      }
    }
  return false;
};

/**
 * This method returns in which cardinal direction does input point stays
 * 1: North
 * 2: East
 * 3: South
 * 4: West
 */
IGeometry.getCardinalDirection = function (slope, slopePrime, line) {
  if (slope > slopePrime) {
    return line;
  } else {
    return 1 + line % 4;
  }
};

/**
 * This method calculates the intersection of the two lines defined by
 * point pairs (s1,s2) and (f1,f2).
 */
IGeometry.getIntersection = function (s1, s2, f1, f2) {
  if (f2 == null) {
    return this.getIntersection2(s1, s2, f1);
  }

  var x1 = s1.x;
  var y1 = s1.y;
  var x2 = s2.x;
  var y2 = s2.y;
  var x3 = f1.x;
  var y3 = f1.y;
  var x4 = f2.x;
  var y4 = f2.y;
  var x = void 0,
      y = void 0; // intersection point
  var a1 = void 0,
      a2 = void 0,
      b1 = void 0,
      b2 = void 0,
      c1 = void 0,
      c2 = void 0; // coefficients of line eqns.
  var denom = void 0;

  a1 = y2 - y1;
  b1 = x1 - x2;
  c1 = x2 * y1 - x1 * y2; // { a1*x + b1*y + c1 = 0 is line 1 }

  a2 = y4 - y3;
  b2 = x3 - x4;
  c2 = x4 * y3 - x3 * y4; // { a2*x + b2*y + c2 = 0 is line 2 }

  denom = a1 * b2 - a2 * b1;

  if (denom === 0) {
    return null;
  }

  x = (b1 * c2 - b2 * c1) / denom;
  y = (a2 * c1 - a1 * c2) / denom;

  return new Point(x, y);
};

/**
 * This method finds and returns the angle of the vector from the + x-axis
 * in clockwise direction (compatible w/ Java coordinate system!).
 */
IGeometry.angleOfVector = function (Cx, Cy, Nx, Ny) {
  var C_angle = void 0;

  if (Cx !== Nx) {
    C_angle = Math.atan((Ny - Cy) / (Nx - Cx));

    if (Nx < Cx) {
      C_angle += Math.PI;
    } else if (Ny < Cy) {
      C_angle += this.TWO_PI;
    }
  } else if (Ny < Cy) {
    C_angle = this.ONE_AND_HALF_PI; // 270 degrees
  } else {
    C_angle = this.HALF_PI; // 90 degrees
  }

  return C_angle;
};

/**
 * This method checks whether the given two line segments (one with point
 * p1 and p2, the other with point p3 and p4) intersect at a point other
 * than these points.
 */
IGeometry.doIntersect = function (p1, p2, p3, p4) {
  var a = p1.x;
  var b = p1.y;
  var c = p2.x;
  var d = p2.y;
  var p = p3.x;
  var q = p3.y;
  var r = p4.x;
  var s = p4.y;
  var det = (c - a) * (s - q) - (r - p) * (d - b);

  if (det === 0) {
    return false;
  } else {
    var lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    var gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
  }
};

/**
 * This method checks and calculates the intersection of 
 * a line segment and a circle.
 */
IGeometry.findCircleLineIntersections = function (Ex, Ey, Lx, Ly, Cx, Cy, r) {

  // E is the starting point of the ray,
  // L is the end point of the ray,
  // C is the center of sphere you're testing against
  // r is the radius of that sphere

  // Compute:
  // d = L - E ( Direction vector of ray, from start to end )
  // f = E - C ( Vector from center sphere to ray start )

  // Then the intersection is found by..
  // P = E + t * d
  // This is a parametric equation:
  // Px = Ex + tdx
  // Py = Ey + tdy

  // get a, b, c values
  var a = (Lx - Ex) * (Lx - Ex) + (Ly - Ey) * (Ly - Ey);
  var b = 2 * ((Ex - Cx) * (Lx - Ex) + (Ey - Cy) * (Ly - Ey));
  var c = (Ex - Cx) * (Ex - Cx) + (Ey - Cy) * (Ey - Cy) - r * r;

  // get discriminant
  var disc = b * b - 4 * a * c;
  if (disc >= 0) {
    // insert into quadratic formula
    var t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    var t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    var intersections = null;
    if (t1 >= 0 && t1 <= 1) {
      // t1 is the intersection, and it's closer than t2
      // (since t1 uses -b - discriminant)
      // Impale, Poke
      return [t1];
    }

    // here t1 didn't intersect so we are either started
    // inside the sphere or completely past it
    if (t2 >= 0 && t2 <= 1) {
      // ExitWound
      return [t2];
    }

    return intersections;
  } else return null;
};

// -----------------------------------------------------------------------------
// Section: Class Constants
// -----------------------------------------------------------------------------
/**
 * Some useful pre-calculated constants
 */
IGeometry.HALF_PI = 0.5 * Math.PI;
IGeometry.ONE_AND_HALF_PI = 1.5 * Math.PI;
IGeometry.TWO_PI = 2.0 * Math.PI;
IGeometry.THREE_PI = 3.0 * Math.PI;

module.exports = IGeometry;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function IMath() {}

/**
 * This method returns the sign of the input value.
 */
IMath.sign = function (value) {
  if (value > 0) {
    return 1;
  } else if (value < 0) {
    return -1;
  } else {
    return 0;
  }
};

IMath.floor = function (value) {
  return value < 0 ? Math.ceil(value) : Math.floor(value);
};

IMath.ceil = function (value) {
  return value < 0 ? Math.floor(value) : Math.ceil(value);
};

module.exports = IMath;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Integer() {}

Integer.MAX_VALUE = 2147483647;
Integer.MIN_VALUE = -2147483648;

module.exports = Integer;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nodeFrom = function nodeFrom(value) {
  return { value: value, next: null, prev: null };
};

var add = function add(prev, node, next, list) {
  if (prev !== null) {
    prev.next = node;
  } else {
    list.head = node;
  }

  if (next !== null) {
    next.prev = node;
  } else {
    list.tail = node;
  }

  node.prev = prev;
  node.next = next;

  list.length++;

  return node;
};

var _remove = function _remove(node, list) {
  var prev = node.prev,
      next = node.next;


  if (prev !== null) {
    prev.next = next;
  } else {
    list.head = next;
  }

  if (next !== null) {
    next.prev = prev;
  } else {
    list.tail = prev;
  }

  node.prev = node.next = null;

  list.length--;

  return node;
};

var LinkedList = function () {
  function LinkedList(vals) {
    var _this = this;

    _classCallCheck(this, LinkedList);

    this.length = 0;
    this.head = null;
    this.tail = null;

    if (vals != null) {
      vals.forEach(function (v) {
        return _this.push(v);
      });
    }
  }

  _createClass(LinkedList, [{
    key: "size",
    value: function size() {
      return this.length;
    }
  }, {
    key: "insertBefore",
    value: function insertBefore(val, otherNode) {
      return add(otherNode.prev, nodeFrom(val), otherNode, this);
    }
  }, {
    key: "insertAfter",
    value: function insertAfter(val, otherNode) {
      return add(otherNode, nodeFrom(val), otherNode.next, this);
    }
  }, {
    key: "insertNodeBefore",
    value: function insertNodeBefore(newNode, otherNode) {
      return add(otherNode.prev, newNode, otherNode, this);
    }
  }, {
    key: "insertNodeAfter",
    value: function insertNodeAfter(newNode, otherNode) {
      return add(otherNode, newNode, otherNode.next, this);
    }
  }, {
    key: "push",
    value: function push(val) {
      return add(this.tail, nodeFrom(val), null, this);
    }
  }, {
    key: "unshift",
    value: function unshift(val) {
      return add(null, nodeFrom(val), this.head, this);
    }
  }, {
    key: "remove",
    value: function remove(node) {
      return _remove(node, this);
    }
  }, {
    key: "pop",
    value: function pop() {
      return _remove(this.tail, this).value;
    }
  }, {
    key: "popNode",
    value: function popNode() {
      return _remove(this.tail, this);
    }
  }, {
    key: "shift",
    value: function shift() {
      return _remove(this.head, this).value;
    }
  }, {
    key: "shiftNode",
    value: function shiftNode() {
      return _remove(this.head, this);
    }
  }, {
    key: "get_object_at",
    value: function get_object_at(index) {
      if (index <= this.length()) {
        var i = 1;
        var current = this.head;
        while (i < index) {
          current = current.next;
          i++;
        }
        return current.value;
      }
    }
  }, {
    key: "set_object_at",
    value: function set_object_at(index, value) {
      if (index <= this.length()) {
        var i = 1;
        var current = this.head;
        while (i < index) {
          current = current.next;
          i++;
        }
        current.value = value;
      }
    }
  }]);

  return LinkedList;
}();

module.exports = LinkedList;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 *This class is the javascript implementation of the Point.java class in jdk
 */
function Point(x, y, p) {
  this.x = null;
  this.y = null;
  if (x == null && y == null && p == null) {
    this.x = 0;
    this.y = 0;
  } else if (typeof x == 'number' && typeof y == 'number' && p == null) {
    this.x = x;
    this.y = y;
  } else if (x.constructor.name == 'Point' && y == null && p == null) {
    p = x;
    this.x = p.x;
    this.y = p.y;
  }
}

Point.prototype.getX = function () {
  return this.x;
};

Point.prototype.getY = function () {
  return this.y;
};

Point.prototype.getLocation = function () {
  return new Point(this.x, this.y);
};

Point.prototype.setLocation = function (x, y, p) {
  if (x.constructor.name == 'Point' && y == null && p == null) {
    p = x;
    this.setLocation(p.x, p.y);
  } else if (typeof x == 'number' && typeof y == 'number' && p == null) {
    //if both parameters are integer just move (x,y) location
    if (parseInt(x) == x && parseInt(y) == y) {
      this.move(x, y);
    } else {
      this.x = Math.floor(x + 0.5);
      this.y = Math.floor(y + 0.5);
    }
  }
};

Point.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;
};

Point.prototype.translate = function (dx, dy) {
  this.x += dx;
  this.y += dy;
};

Point.prototype.equals = function (obj) {
  if (obj.constructor.name == "Point") {
    var pt = obj;
    return this.x == pt.x && this.y == pt.y;
  }
  return this == obj;
};

Point.prototype.toString = function () {
  return new Point().constructor.name + "[x=" + this.x + ",y=" + this.y + "]";
};

module.exports = Point;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function RectangleD(x, y, width, height) {
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;

  if (x != null && y != null && width != null && height != null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

RectangleD.prototype.getX = function () {
  return this.x;
};

RectangleD.prototype.setX = function (x) {
  this.x = x;
};

RectangleD.prototype.getY = function () {
  return this.y;
};

RectangleD.prototype.setY = function (y) {
  this.y = y;
};

RectangleD.prototype.getWidth = function () {
  return this.width;
};

RectangleD.prototype.setWidth = function (width) {
  this.width = width;
};

RectangleD.prototype.getHeight = function () {
  return this.height;
};

RectangleD.prototype.setHeight = function (height) {
  this.height = height;
};

RectangleD.prototype.getRight = function () {
  return this.x + this.width;
};

RectangleD.prototype.getBottom = function () {
  return this.y + this.height;
};

RectangleD.prototype.intersects = function (a) {
  if (this.getRight() < a.x) {
    return false;
  }

  if (this.getBottom() < a.y) {
    return false;
  }

  if (a.getRight() < this.x) {
    return false;
  }

  if (a.getBottom() < this.y) {
    return false;
  }

  return true;
};

RectangleD.prototype.getCenterX = function () {
  return this.x + this.width / 2;
};

RectangleD.prototype.getMinX = function () {
  return this.getX();
};

RectangleD.prototype.getMaxX = function () {
  return this.getX() + this.width;
};

RectangleD.prototype.getCenterY = function () {
  return this.y + this.height / 2;
};

RectangleD.prototype.getMinY = function () {
  return this.getY();
};

RectangleD.prototype.getMaxY = function () {
  return this.getY() + this.height;
};

RectangleD.prototype.getWidthHalf = function () {
  return this.width / 2;
};

RectangleD.prototype.getHeightHalf = function () {
  return this.height / 2;
};

module.exports = RectangleD;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function UniqueIDGeneretor() {}

UniqueIDGeneretor.lastID = 0;

UniqueIDGeneretor.createID = function (obj) {
  if (UniqueIDGeneretor.isPrimitive(obj)) {
    return obj;
  }
  if (obj.uniqueID != null) {
    return obj.uniqueID;
  }
  obj.uniqueID = UniqueIDGeneretor.getString();
  UniqueIDGeneretor.lastID++;
  return obj.uniqueID;
};

UniqueIDGeneretor.getString = function (id) {
  if (id == null) id = UniqueIDGeneretor.lastID;
  return "Object#" + id + "";
};

UniqueIDGeneretor.isPrimitive = function (arg) {
  var type = typeof arg === "undefined" ? "undefined" : _typeof(arg);
  return arg == null || type != "object" && type != "function";
};

module.exports = UniqueIDGeneretor;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var LayoutConstants = __webpack_require__(0);
var LGraphManager = __webpack_require__(7);
var LNode = __webpack_require__(3);
var LEdge = __webpack_require__(1);
var LGraph = __webpack_require__(6);
var PointD = __webpack_require__(5);
var Transform = __webpack_require__(17);
var Emitter = __webpack_require__(29);

function Layout(isRemoteUse) {
  Emitter.call(this);

  //Layout Quality: 0:draft, 1:default, 2:proof
  this.layoutQuality = LayoutConstants.QUALITY;
  //Whether layout should create bendpoints as needed or not
  this.createBendsAsNeeded = LayoutConstants.DEFAULT_CREATE_BENDS_AS_NEEDED;
  //Whether layout should be incremental or not
  this.incremental = LayoutConstants.DEFAULT_INCREMENTAL;
  //Whether we animate from before to after layout node positions
  this.animationOnLayout = LayoutConstants.DEFAULT_ANIMATION_ON_LAYOUT;
  //Whether we animate the layout process or not
  this.animationDuringLayout = LayoutConstants.DEFAULT_ANIMATION_DURING_LAYOUT;
  //Number iterations that should be done between two successive animations
  this.animationPeriod = LayoutConstants.DEFAULT_ANIMATION_PERIOD;
  /**
   * Whether or not leaf nodes (non-compound nodes) are of uniform sizes. When
   * they are, both spring and repulsion forces between two leaf nodes can be
   * calculated without the expensive clipping point calculations, resulting
   * in major speed-up.
   */
  this.uniformLeafNodeSizes = LayoutConstants.DEFAULT_UNIFORM_LEAF_NODE_SIZES;
  /**
   * This is used for creation of bendpoints by using dummy nodes and edges.
   * Maps an LEdge to its dummy bendpoint path.
   */
  this.edgeToDummyNodes = new Map();
  this.graphManager = new LGraphManager(this);
  this.isLayoutFinished = false;
  this.isSubLayout = false;
  this.isRemoteUse = false;

  if (isRemoteUse != null) {
    this.isRemoteUse = isRemoteUse;
  }
}

Layout.RANDOM_SEED = 1;

Layout.prototype = Object.create(Emitter.prototype);

Layout.prototype.getGraphManager = function () {
  return this.graphManager;
};

Layout.prototype.getAllNodes = function () {
  return this.graphManager.getAllNodes();
};

Layout.prototype.getAllEdges = function () {
  return this.graphManager.getAllEdges();
};

Layout.prototype.getAllNodesToApplyGravitation = function () {
  return this.graphManager.getAllNodesToApplyGravitation();
};

Layout.prototype.newGraphManager = function () {
  var gm = new LGraphManager(this);
  this.graphManager = gm;
  return gm;
};

Layout.prototype.newGraph = function (vGraph) {
  return new LGraph(null, this.graphManager, vGraph);
};

Layout.prototype.newNode = function (vNode) {
  return new LNode(this.graphManager, vNode);
};

Layout.prototype.newEdge = function (vEdge) {
  return new LEdge(null, null, vEdge);
};

Layout.prototype.checkLayoutSuccess = function () {
  return this.graphManager.getRoot() == null || this.graphManager.getRoot().getNodes().length == 0 || this.graphManager.includesInvalidEdge();
};

Layout.prototype.runLayout = function () {
  this.isLayoutFinished = false;

  if (this.tilingPreLayout) {
    this.tilingPreLayout();
  }

  this.initParameters();
  var isLayoutSuccessfull;

  if (this.checkLayoutSuccess()) {
    isLayoutSuccessfull = false;
  } else {
    isLayoutSuccessfull = this.layout();
  }

  if (LayoutConstants.ANIMATE === 'during') {
    // If this is a 'during' layout animation. Layout is not finished yet. 
    // We need to perform these in index.js when layout is really finished.
    return false;
  }

  if (isLayoutSuccessfull) {
    if (!this.isSubLayout) {
      this.doPostLayout();
    }
  }

  if (this.tilingPostLayout) {
    this.tilingPostLayout();
  }

  this.isLayoutFinished = true;

  return isLayoutSuccessfull;
};

/**
 * This method performs the operations required after layout.
 */
Layout.prototype.doPostLayout = function () {
  //assert !isSubLayout : "Should not be called on sub-layout!";
  // Propagate geometric changes to v-level objects
  if (!this.incremental) {
    this.transform();
  }
  this.update();
};

/**
 * This method updates the geometry of the target graph according to
 * calculated layout.
 */
Layout.prototype.update2 = function () {
  // update bend points
  if (this.createBendsAsNeeded) {
    this.createBendpointsFromDummyNodes();

    // reset all edges, since the topology has changed
    this.graphManager.resetAllEdges();
  }

  // perform edge, node and root updates if layout is not called
  // remotely
  if (!this.isRemoteUse) {
    // update all edges
    var edge;
    var allEdges = this.graphManager.getAllEdges();
    for (var i = 0; i < allEdges.length; i++) {
      edge = allEdges[i];
      //      this.update(edge);
    }

    // recursively update nodes
    var node;
    var nodes = this.graphManager.getRoot().getNodes();
    for (var i = 0; i < nodes.length; i++) {
      node = nodes[i];
      //      this.update(node);
    }

    // update root graph
    this.update(this.graphManager.getRoot());
  }
};

Layout.prototype.update = function (obj) {
  if (obj == null) {
    this.update2();
  } else if (obj instanceof LNode) {
    var node = obj;
    if (node.getChild() != null) {
      // since node is compound, recursively update child nodes
      var nodes = node.getChild().getNodes();
      for (var i = 0; i < nodes.length; i++) {
        update(nodes[i]);
      }
    }

    // if the l-level node is associated with a v-level graph object,
    // then it is assumed that the v-level node implements the
    // interface Updatable.
    if (node.vGraphObject != null) {
      // cast to Updatable without any type check
      var vNode = node.vGraphObject;

      // call the update method of the interface
      vNode.update(node);
    }
  } else if (obj instanceof LEdge) {
    var edge = obj;
    // if the l-level edge is associated with a v-level graph object,
    // then it is assumed that the v-level edge implements the
    // interface Updatable.

    if (edge.vGraphObject != null) {
      // cast to Updatable without any type check
      var vEdge = edge.vGraphObject;

      // call the update method of the interface
      vEdge.update(edge);
    }
  } else if (obj instanceof LGraph) {
    var graph = obj;
    // if the l-level graph is associated with a v-level graph object,
    // then it is assumed that the v-level object implements the
    // interface Updatable.

    if (graph.vGraphObject != null) {
      // cast to Updatable without any type check
      var vGraph = graph.vGraphObject;

      // call the update method of the interface
      vGraph.update(graph);
    }
  }
};

/**
 * This method is used to set all layout parameters to default values
 * determined at compile time.
 */
Layout.prototype.initParameters = function () {
  if (!this.isSubLayout) {
    this.layoutQuality = LayoutConstants.QUALITY;
    this.animationDuringLayout = LayoutConstants.DEFAULT_ANIMATION_DURING_LAYOUT;
    this.animationPeriod = LayoutConstants.DEFAULT_ANIMATION_PERIOD;
    this.animationOnLayout = LayoutConstants.DEFAULT_ANIMATION_ON_LAYOUT;
    this.incremental = LayoutConstants.DEFAULT_INCREMENTAL;
    this.createBendsAsNeeded = LayoutConstants.DEFAULT_CREATE_BENDS_AS_NEEDED;
    this.uniformLeafNodeSizes = LayoutConstants.DEFAULT_UNIFORM_LEAF_NODE_SIZES;
  }

  if (this.animationDuringLayout) {
    this.animationOnLayout = false;
  }
};

Layout.prototype.transform = function (newLeftTop) {
  if (newLeftTop == undefined) {
    this.transform(new PointD(0, 0));
  } else {
    // create a transformation object (from Eclipse to layout). When an
    // inverse transform is applied, we get upper-left coordinate of the
    // drawing or the root graph at given input coordinate (some margins
    // already included in calculation of left-top).

    var trans = new Transform();
    var leftTop = this.graphManager.getRoot().updateLeftTop();

    if (leftTop != null) {
      trans.setWorldOrgX(newLeftTop.x);
      trans.setWorldOrgY(newLeftTop.y);

      trans.setDeviceOrgX(leftTop.x);
      trans.setDeviceOrgY(leftTop.y);

      var nodes = this.getAllNodes();
      var node;

      for (var i = 0; i < nodes.length; i++) {
        node = nodes[i];
        node.transform(trans);
      }
    }
  }
};

Layout.prototype.positionNodesRandomly = function (graph) {

  if (graph == undefined) {
    //assert !this.incremental;
    this.positionNodesRandomly(this.getGraphManager().getRoot());
    this.getGraphManager().getRoot().updateBounds(true);
  } else {
    var lNode;
    var childGraph;

    var nodes = graph.getNodes();
    for (var i = 0; i < nodes.length; i++) {
      lNode = nodes[i];
      childGraph = lNode.getChild();

      if (childGraph == null) {
        lNode.scatter();
      } else if (childGraph.getNodes().length == 0) {
        lNode.scatter();
      } else {
        this.positionNodesRandomly(childGraph);
        lNode.updateBounds();
      }
    }
  }
};

/**
 * This method returns a list of trees where each tree is represented as a
 * list of l-nodes. The method returns a list of size 0 when:
 * - The graph is not flat or
 * - One of the component(s) of the graph is not a tree.
 */
Layout.prototype.getFlatForest = function () {
  var flatForest = [];
  var isForest = true;

  // Quick reference for all nodes in the graph manager associated with
  // this layout. The list should not be changed.
  var allNodes = this.graphManager.getRoot().getNodes();

  // First be sure that the graph is flat
  var isFlat = true;

  for (var i = 0; i < allNodes.length; i++) {
    if (allNodes[i].getChild() != null) {
      isFlat = false;
    }
  }

  // Return empty forest if the graph is not flat.
  if (!isFlat) {
    return flatForest;
  }

  // Run BFS for each component of the graph.

  var visited = new Set();
  var toBeVisited = [];
  var parents = new Map();
  var unProcessedNodes = [];

  unProcessedNodes = unProcessedNodes.concat(allNodes);

  // Each iteration of this loop finds a component of the graph and
  // decides whether it is a tree or not. If it is a tree, adds it to the
  // forest and continued with the next component.

  while (unProcessedNodes.length > 0 && isForest) {
    toBeVisited.push(unProcessedNodes[0]);

    // Start the BFS. Each iteration of this loop visits a node in a
    // BFS manner.
    while (toBeVisited.length > 0 && isForest) {
      //pool operation
      var currentNode = toBeVisited[0];
      toBeVisited.splice(0, 1);
      visited.add(currentNode);

      // Traverse all neighbors of this node
      var neighborEdges = currentNode.getEdges();

      for (var i = 0; i < neighborEdges.length; i++) {
        var currentNeighbor = neighborEdges[i].getOtherEnd(currentNode);

        // If BFS is not growing from this neighbor.
        if (parents.get(currentNode) != currentNeighbor) {
          // We haven't previously visited this neighbor.
          if (!visited.has(currentNeighbor)) {
            toBeVisited.push(currentNeighbor);
            parents.set(currentNeighbor, currentNode);
          }
          // Since we have previously visited this neighbor and
          // this neighbor is not parent of currentNode, given
          // graph contains a component that is not tree, hence
          // it is not a forest.
          else {
              isForest = false;
              break;
            }
        }
      }
    }

    // The graph contains a component that is not a tree. Empty
    // previously found trees. The method will end.
    if (!isForest) {
      flatForest = [];
    }
    // Save currently visited nodes as a tree in our forest. Reset
    // visited and parents lists. Continue with the next component of
    // the graph, if any.
    else {
        var temp = [].concat(_toConsumableArray(visited));
        flatForest.push(temp);
        //flatForest = flatForest.concat(temp);
        //unProcessedNodes.removeAll(visited);
        for (var i = 0; i < temp.length; i++) {
          var value = temp[i];
          var index = unProcessedNodes.indexOf(value);
          if (index > -1) {
            unProcessedNodes.splice(index, 1);
          }
        }
        visited = new Set();
        parents = new Map();
      }
  }

  return flatForest;
};

/**
 * This method creates dummy nodes (an l-level node with minimal dimensions)
 * for the given edge (one per bendpoint). The existing l-level structure
 * is updated accordingly.
 */
Layout.prototype.createDummyNodesForBendpoints = function (edge) {
  var dummyNodes = [];
  var prev = edge.source;

  var graph = this.graphManager.calcLowestCommonAncestor(edge.source, edge.target);

  for (var i = 0; i < edge.bendpoints.length; i++) {
    // create new dummy node
    var dummyNode = this.newNode(null);
    dummyNode.setRect(new Point(0, 0), new Dimension(1, 1));

    graph.add(dummyNode);

    // create new dummy edge between prev and dummy node
    var dummyEdge = this.newEdge(null);
    this.graphManager.add(dummyEdge, prev, dummyNode);

    dummyNodes.add(dummyNode);
    prev = dummyNode;
  }

  var dummyEdge = this.newEdge(null);
  this.graphManager.add(dummyEdge, prev, edge.target);

  this.edgeToDummyNodes.set(edge, dummyNodes);

  // remove real edge from graph manager if it is inter-graph
  if (edge.isInterGraph()) {
    this.graphManager.remove(edge);
  }
  // else, remove the edge from the current graph
  else {
      graph.remove(edge);
    }

  return dummyNodes;
};

/**
 * This method creates bendpoints for edges from the dummy nodes
 * at l-level.
 */
Layout.prototype.createBendpointsFromDummyNodes = function () {
  var edges = [];
  edges = edges.concat(this.graphManager.getAllEdges());
  edges = [].concat(_toConsumableArray(this.edgeToDummyNodes.keys())).concat(edges);

  for (var k = 0; k < edges.length; k++) {
    var lEdge = edges[k];

    if (lEdge.bendpoints.length > 0) {
      var path = this.edgeToDummyNodes.get(lEdge);

      for (var i = 0; i < path.length; i++) {
        var dummyNode = path[i];
        var p = new PointD(dummyNode.getCenterX(), dummyNode.getCenterY());

        // update bendpoint's location according to dummy node
        var ebp = lEdge.bendpoints.get(i);
        ebp.x = p.x;
        ebp.y = p.y;

        // remove the dummy node, dummy edges incident with this
        // dummy node is also removed (within the remove method)
        dummyNode.getOwner().remove(dummyNode);
      }

      // add the real edge to graph
      this.graphManager.add(lEdge, lEdge.source, lEdge.target);
    }
  }
};

Layout.transform = function (sliderValue, defaultValue, minDiv, maxMul) {
  if (minDiv != undefined && maxMul != undefined) {
    var value = defaultValue;

    if (sliderValue <= 50) {
      var minValue = defaultValue / minDiv;
      value -= (defaultValue - minValue) / 50 * (50 - sliderValue);
    } else {
      var maxValue = defaultValue * maxMul;
      value += (maxValue - defaultValue) / 50 * (sliderValue - 50);
    }

    return value;
  } else {
    var a, b;

    if (sliderValue <= 50) {
      a = 9.0 * defaultValue / 500.0;
      b = defaultValue / 10.0;
    } else {
      a = 9.0 * defaultValue / 50.0;
      b = -8 * defaultValue;
    }

    return a * sliderValue + b;
  }
};

/**
 * This method finds and returns the center of the given nodes, assuming
 * that the given nodes form a tree in themselves.
 */
Layout.findCenterOfTree = function (nodes) {
  var list = [];
  list = list.concat(nodes);

  var removedNodes = [];
  var remainingDegrees = new Map();
  var foundCenter = false;
  var centerNode = null;

  if (list.length == 1 || list.length == 2) {
    foundCenter = true;
    centerNode = list[0];
  }

  for (var i = 0; i < list.length; i++) {
    var node = list[i];
    var degree = node.getNeighborsList().size;
    remainingDegrees.set(node, node.getNeighborsList().size);

    if (degree == 1) {
      removedNodes.push(node);
    }
  }

  var tempList = [];
  tempList = tempList.concat(removedNodes);

  while (!foundCenter) {
    var tempList2 = [];
    tempList2 = tempList2.concat(tempList);
    tempList = [];

    for (var i = 0; i < list.length; i++) {
      var node = list[i];

      var index = list.indexOf(node);
      if (index >= 0) {
        list.splice(index, 1);
      }

      var neighbours = node.getNeighborsList();

      neighbours.forEach(function (neighbour) {
        if (removedNodes.indexOf(neighbour) < 0) {
          var otherDegree = remainingDegrees.get(neighbour);
          var newDegree = otherDegree - 1;

          if (newDegree == 1) {
            tempList.push(neighbour);
          }

          remainingDegrees.set(neighbour, newDegree);
        }
      });
    }

    removedNodes = removedNodes.concat(tempList);

    if (list.length == 1 || list.length == 2) {
      foundCenter = true;
      centerNode = list[0];
    }
  }

  return centerNode;
};

/**
 * During the coarsening process, this layout may be referenced by two graph managers
 * this setter function grants access to change the currently being used graph manager
 */
Layout.prototype.setGraphManager = function (gm) {
  this.graphManager = gm;
};

module.exports = Layout;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function RandomSeed() {}
// adapted from: https://stackoverflow.com/a/19303725
RandomSeed.seed = 1;
RandomSeed.x = 0;

RandomSeed.nextDouble = function () {
  RandomSeed.x = Math.sin(RandomSeed.seed++) * 10000;
  return RandomSeed.x - Math.floor(RandomSeed.x);
};

module.exports = RandomSeed;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var PointD = __webpack_require__(5);

function Transform(x, y) {
  this.lworldOrgX = 0.0;
  this.lworldOrgY = 0.0;
  this.ldeviceOrgX = 0.0;
  this.ldeviceOrgY = 0.0;
  this.lworldExtX = 1.0;
  this.lworldExtY = 1.0;
  this.ldeviceExtX = 1.0;
  this.ldeviceExtY = 1.0;
}

Transform.prototype.getWorldOrgX = function () {
  return this.lworldOrgX;
};

Transform.prototype.setWorldOrgX = function (wox) {
  this.lworldOrgX = wox;
};

Transform.prototype.getWorldOrgY = function () {
  return this.lworldOrgY;
};

Transform.prototype.setWorldOrgY = function (woy) {
  this.lworldOrgY = woy;
};

Transform.prototype.getWorldExtX = function () {
  return this.lworldExtX;
};

Transform.prototype.setWorldExtX = function (wex) {
  this.lworldExtX = wex;
};

Transform.prototype.getWorldExtY = function () {
  return this.lworldExtY;
};

Transform.prototype.setWorldExtY = function (wey) {
  this.lworldExtY = wey;
};

/* Device related */

Transform.prototype.getDeviceOrgX = function () {
  return this.ldeviceOrgX;
};

Transform.prototype.setDeviceOrgX = function (dox) {
  this.ldeviceOrgX = dox;
};

Transform.prototype.getDeviceOrgY = function () {
  return this.ldeviceOrgY;
};

Transform.prototype.setDeviceOrgY = function (doy) {
  this.ldeviceOrgY = doy;
};

Transform.prototype.getDeviceExtX = function () {
  return this.ldeviceExtX;
};

Transform.prototype.setDeviceExtX = function (dex) {
  this.ldeviceExtX = dex;
};

Transform.prototype.getDeviceExtY = function () {
  return this.ldeviceExtY;
};

Transform.prototype.setDeviceExtY = function (dey) {
  this.ldeviceExtY = dey;
};

Transform.prototype.transformX = function (x) {
  var xDevice = 0.0;
  var worldExtX = this.lworldExtX;
  if (worldExtX != 0.0) {
    xDevice = this.ldeviceOrgX + (x - this.lworldOrgX) * this.ldeviceExtX / worldExtX;
  }

  return xDevice;
};

Transform.prototype.transformY = function (y) {
  var yDevice = 0.0;
  var worldExtY = this.lworldExtY;
  if (worldExtY != 0.0) {
    yDevice = this.ldeviceOrgY + (y - this.lworldOrgY) * this.ldeviceExtY / worldExtY;
  }

  return yDevice;
};

Transform.prototype.inverseTransformX = function (x) {
  var xWorld = 0.0;
  var deviceExtX = this.ldeviceExtX;
  if (deviceExtX != 0.0) {
    xWorld = this.lworldOrgX + (x - this.ldeviceOrgX) * this.lworldExtX / deviceExtX;
  }

  return xWorld;
};

Transform.prototype.inverseTransformY = function (y) {
  var yWorld = 0.0;
  var deviceExtY = this.ldeviceExtY;
  if (deviceExtY != 0.0) {
    yWorld = this.lworldOrgY + (y - this.ldeviceOrgY) * this.lworldExtY / deviceExtY;
  }
  return yWorld;
};

Transform.prototype.inverseTransformPoint = function (inPoint) {
  var outPoint = new PointD(this.inverseTransformX(inPoint.x), this.inverseTransformY(inPoint.y));
  return outPoint;
};

module.exports = Transform;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Layout = __webpack_require__(15);
var FDLayoutConstants = __webpack_require__(4);
var LayoutConstants = __webpack_require__(0);
var IGeometry = __webpack_require__(8);
var IMath = __webpack_require__(9);

function FDLayout() {
  Layout.call(this);

  this.useSmartIdealEdgeLengthCalculation = FDLayoutConstants.DEFAULT_USE_SMART_IDEAL_EDGE_LENGTH_CALCULATION;
  this.gravityConstant = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH;
  this.compoundGravityConstant = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH;
  this.gravityRangeFactor = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR;
  this.compoundGravityRangeFactor = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR;
  this.displacementThresholdPerNode = 3.0 * FDLayoutConstants.DEFAULT_EDGE_LENGTH / 100;
  this.coolingFactor = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL;
  this.initialCoolingFactor = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL;
  this.totalDisplacement = 0.0;
  this.oldTotalDisplacement = 0.0;
  this.maxIterations = FDLayoutConstants.MAX_ITERATIONS;
}

FDLayout.prototype = Object.create(Layout.prototype);

for (var prop in Layout) {
  FDLayout[prop] = Layout[prop];
}

FDLayout.prototype.initParameters = function () {
  Layout.prototype.initParameters.call(this, arguments);

  this.totalIterations = 0;
  this.notAnimatedIterations = 0;

  this.useFRGridVariant = FDLayoutConstants.DEFAULT_USE_SMART_REPULSION_RANGE_CALCULATION;

  this.grid = [];
};

FDLayout.prototype.calcIdealEdgeLengths = function () {
  var edge;
  var originalIdealLength;
  var lcaDepth;
  var source;
  var target;
  var sizeOfSourceInLca;
  var sizeOfTargetInLca;

  var allEdges = this.getGraphManager().getAllEdges();
  for (var i = 0; i < allEdges.length; i++) {
    edge = allEdges[i];

    originalIdealLength = edge.idealLength;

    if (edge.isInterGraph) {
      source = edge.getSource();
      target = edge.getTarget();

      sizeOfSourceInLca = edge.getSourceInLca().getEstimatedSize();
      sizeOfTargetInLca = edge.getTargetInLca().getEstimatedSize();

      if (this.useSmartIdealEdgeLengthCalculation) {
        edge.idealLength += sizeOfSourceInLca + sizeOfTargetInLca - 2 * LayoutConstants.SIMPLE_NODE_SIZE;
      }

      lcaDepth = edge.getLca().getInclusionTreeDepth();

      edge.idealLength += originalIdealLength * FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR * (source.getInclusionTreeDepth() + target.getInclusionTreeDepth() - 2 * lcaDepth);
    }
  }
};

FDLayout.prototype.initSpringEmbedder = function () {

  var s = this.getAllNodes().length;
  if (this.incremental) {
    if (s > FDLayoutConstants.ADAPTATION_LOWER_NODE_LIMIT) {
      this.coolingFactor = Math.max(this.coolingFactor * FDLayoutConstants.COOLING_ADAPTATION_FACTOR, this.coolingFactor - (s - FDLayoutConstants.ADAPTATION_LOWER_NODE_LIMIT) / (FDLayoutConstants.ADAPTATION_UPPER_NODE_LIMIT - FDLayoutConstants.ADAPTATION_LOWER_NODE_LIMIT) * this.coolingFactor * (1 - FDLayoutConstants.COOLING_ADAPTATION_FACTOR));
    }
    this.maxNodeDisplacement = FDLayoutConstants.MAX_NODE_DISPLACEMENT_INCREMENTAL;
  } else {
    if (s > FDLayoutConstants.ADAPTATION_LOWER_NODE_LIMIT) {
      this.coolingFactor = Math.max(FDLayoutConstants.COOLING_ADAPTATION_FACTOR, 1.0 - (s - FDLayoutConstants.ADAPTATION_LOWER_NODE_LIMIT) / (FDLayoutConstants.ADAPTATION_UPPER_NODE_LIMIT - FDLayoutConstants.ADAPTATION_LOWER_NODE_LIMIT) * (1 - FDLayoutConstants.COOLING_ADAPTATION_FACTOR));
    } else {
      this.coolingFactor = 1.0;
    }
    this.initialCoolingFactor = this.coolingFactor;
    this.maxNodeDisplacement = FDLayoutConstants.MAX_NODE_DISPLACEMENT;
  }

  this.maxIterations = Math.max(this.getAllNodes().length * 5, this.maxIterations);

  // Reassign this attribute by using new constant value
  this.displacementThresholdPerNode = 3.0 * FDLayoutConstants.DEFAULT_EDGE_LENGTH / 100;
  this.totalDisplacementThreshold = this.displacementThresholdPerNode * this.getAllNodes().length;

  this.repulsionRange = this.calcRepulsionRange();
};

FDLayout.prototype.calcSpringForces = function () {
  var lEdges = this.getAllEdges();
  var edge;

  for (var i = 0; i < lEdges.length; i++) {
    edge = lEdges[i];

    this.calcSpringForce(edge, edge.idealLength);
  }
};

FDLayout.prototype.calcRepulsionForces = function () {
  var gridUpdateAllowed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var forceToNodeSurroundingUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var i, j;
  var nodeA, nodeB;
  var lNodes = this.getAllNodes();
  var processedNodeSet;

  if (this.useFRGridVariant) {
    if (this.totalIterations % FDLayoutConstants.GRID_CALCULATION_CHECK_PERIOD == 1 && gridUpdateAllowed) {
      this.updateGrid();
    }

    processedNodeSet = new Set();

    // calculate repulsion forces between each nodes and its surrounding
    for (i = 0; i < lNodes.length; i++) {
      nodeA = lNodes[i];
      this.calculateRepulsionForceOfANode(nodeA, processedNodeSet, gridUpdateAllowed, forceToNodeSurroundingUpdate);
      processedNodeSet.add(nodeA);
    }
  } else {
    for (i = 0; i < lNodes.length; i++) {
      nodeA = lNodes[i];

      for (j = i + 1; j < lNodes.length; j++) {
        nodeB = lNodes[j];

        // If both nodes are not members of the same graph, skip.
        if (nodeA.getOwner() != nodeB.getOwner()) {
          continue;
        }

        this.calcRepulsionForce(nodeA, nodeB);
      }
    }
  }
};

FDLayout.prototype.calcGravitationalForces = function () {
  var node;
  var lNodes = this.getAllNodesToApplyGravitation();

  for (var i = 0; i < lNodes.length; i++) {
    node = lNodes[i];
    this.calcGravitationalForce(node);
  }
};

FDLayout.prototype.moveNodes = function () {
  var lNodes = this.getAllNodes();
  var node;

  for (var i = 0; i < lNodes.length; i++) {
    node = lNodes[i];
    node.move();
  }
};

FDLayout.prototype.calcSpringForce = function (edge, idealLength) {
  var sourceNode = edge.getSource();
  var targetNode = edge.getTarget();

  var length;
  var springForce;
  var springForceX;
  var springForceY;

  // Update edge length
  if (this.uniformLeafNodeSizes && sourceNode.getChild() == null && targetNode.getChild() == null) {
    edge.updateLengthSimple();
  } else {
    edge.updateLength();

    if (edge.isOverlapingSourceAndTarget) {
      return;
    }
  }

  length = edge.getLength();

  if (length == 0) return;

  // Calculate spring forces
  springForce = edge.edgeElasticity * (length - idealLength);

  // Project force onto x and y axes
  springForceX = springForce * (edge.lengthX / length);
  springForceY = springForce * (edge.lengthY / length);

  // Apply forces on the end nodes
  sourceNode.springForceX += springForceX;
  sourceNode.springForceY += springForceY;
  targetNode.springForceX -= springForceX;
  targetNode.springForceY -= springForceY;
};

FDLayout.prototype.calcRepulsionForce = function (nodeA, nodeB) {
  var rectA = nodeA.getRect();
  var rectB = nodeB.getRect();
  var overlapAmount = new Array(2);
  var clipPoints = new Array(4);
  var distanceX;
  var distanceY;
  var distanceSquared;
  var distance;
  var repulsionForce;
  var repulsionForceX;
  var repulsionForceY;

  if (rectA.intersects(rectB)) // two nodes overlap
    {
      // calculate separation amount in x and y directions
      IGeometry.calcSeparationAmount(rectA, rectB, overlapAmount, FDLayoutConstants.DEFAULT_EDGE_LENGTH / 2.0);

      repulsionForceX = 2 * overlapAmount[0];
      repulsionForceY = 2 * overlapAmount[1];

      var childrenConstant = nodeA.noOfChildren * nodeB.noOfChildren / (nodeA.noOfChildren + nodeB.noOfChildren);

      // Apply forces on the two nodes
      nodeA.repulsionForceX -= childrenConstant * repulsionForceX;
      nodeA.repulsionForceY -= childrenConstant * repulsionForceY;
      nodeB.repulsionForceX += childrenConstant * repulsionForceX;
      nodeB.repulsionForceY += childrenConstant * repulsionForceY;
    } else // no overlap
    {
      // calculate distance

      if (this.uniformLeafNodeSizes && nodeA.getChild() == null && nodeB.getChild() == null) // simply base repulsion on distance of node centers
        {
          distanceX = rectB.getCenterX() - rectA.getCenterX();
          distanceY = rectB.getCenterY() - rectA.getCenterY();
        } else // use clipping points
        {
          IGeometry.getIntersection(rectA, rectB, clipPoints);

          distanceX = clipPoints[2] - clipPoints[0];
          distanceY = clipPoints[3] - clipPoints[1];
        }

      // No repulsion range. FR grid variant should take care of this.
      if (Math.abs(distanceX) < FDLayoutConstants.MIN_REPULSION_DIST) {
        distanceX = IMath.sign(distanceX) * FDLayoutConstants.MIN_REPULSION_DIST;
      }

      if (Math.abs(distanceY) < FDLayoutConstants.MIN_REPULSION_DIST) {
        distanceY = IMath.sign(distanceY) * FDLayoutConstants.MIN_REPULSION_DIST;
      }

      distanceSquared = distanceX * distanceX + distanceY * distanceY;
      distance = Math.sqrt(distanceSquared);

      // Here we use half of the nodes' repulsion values for backward compatibility
      repulsionForce = (nodeA.nodeRepulsion / 2 + nodeB.nodeRepulsion / 2) * nodeA.noOfChildren * nodeB.noOfChildren / distanceSquared;

      // Project force onto x and y axes
      repulsionForceX = repulsionForce * distanceX / distance;
      repulsionForceY = repulsionForce * distanceY / distance;

      // Apply forces on the two nodes    
      nodeA.repulsionForceX -= repulsionForceX;
      nodeA.repulsionForceY -= repulsionForceY;
      nodeB.repulsionForceX += repulsionForceX;
      nodeB.repulsionForceY += repulsionForceY;
    }
};

FDLayout.prototype.calcGravitationalForce = function (node) {
  var ownerGraph;
  var ownerCenterX;
  var ownerCenterY;
  var distanceX;
  var distanceY;
  var absDistanceX;
  var absDistanceY;
  var estimatedSize;
  ownerGraph = node.getOwner();

  ownerCenterX = (ownerGraph.getRight() + ownerGraph.getLeft()) / 2;
  ownerCenterY = (ownerGraph.getTop() + ownerGraph.getBottom()) / 2;
  distanceX = node.getCenterX() - ownerCenterX;
  distanceY = node.getCenterY() - ownerCenterY;
  absDistanceX = Math.abs(distanceX) + node.getWidth() / 2;
  absDistanceY = Math.abs(distanceY) + node.getHeight() / 2;

  if (node.getOwner() == this.graphManager.getRoot()) // in the root graph
    {
      estimatedSize = ownerGraph.getEstimatedSize() * this.gravityRangeFactor;

      if (absDistanceX > estimatedSize || absDistanceY > estimatedSize) {
        node.gravitationForceX = -this.gravityConstant * distanceX;
        node.gravitationForceY = -this.gravityConstant * distanceY;
      }
    } else // inside a compound
    {
      estimatedSize = ownerGraph.getEstimatedSize() * this.compoundGravityRangeFactor;

      if (absDistanceX > estimatedSize || absDistanceY > estimatedSize) {
        node.gravitationForceX = -this.gravityConstant * distanceX * this.compoundGravityConstant;
        node.gravitationForceY = -this.gravityConstant * distanceY * this.compoundGravityConstant;
      }
    }
};

FDLayout.prototype.isConverged = function () {
  var converged;
  var oscilating = false;

  if (this.totalIterations > this.maxIterations / 3) {
    oscilating = Math.abs(this.totalDisplacement - this.oldTotalDisplacement) < 2;
  }

  converged = this.totalDisplacement < this.totalDisplacementThreshold;

  this.oldTotalDisplacement = this.totalDisplacement;

  return converged || oscilating;
};

FDLayout.prototype.animate = function () {
  if (this.animationDuringLayout && !this.isSubLayout) {
    if (this.notAnimatedIterations == this.animationPeriod) {
      this.update();
      this.notAnimatedIterations = 0;
    } else {
      this.notAnimatedIterations++;
    }
  }
};

//This method calculates the number of children (weight) for all nodes
FDLayout.prototype.calcNoOfChildrenForAllNodes = function () {
  var node;
  var allNodes = this.graphManager.getAllNodes();

  for (var i = 0; i < allNodes.length; i++) {
    node = allNodes[i];
    node.noOfChildren = node.getNoOfChildren();
  }
};

// -----------------------------------------------------------------------------
// Section: FR-Grid Variant Repulsion Force Calculation
// -----------------------------------------------------------------------------

FDLayout.prototype.calcGrid = function (graph) {

  var sizeX = 0;
  var sizeY = 0;

  sizeX = parseInt(Math.ceil((graph.getRight() - graph.getLeft()) / this.repulsionRange));
  sizeY = parseInt(Math.ceil((graph.getBottom() - graph.getTop()) / this.repulsionRange));

  var grid = new Array(sizeX);

  for (var i = 0; i < sizeX; i++) {
    grid[i] = new Array(sizeY);
  }

  for (var i = 0; i < sizeX; i++) {
    for (var j = 0; j < sizeY; j++) {
      grid[i][j] = new Array();
    }
  }

  return grid;
};

FDLayout.prototype.addNodeToGrid = function (v, left, top) {

  var startX = 0;
  var finishX = 0;
  var startY = 0;
  var finishY = 0;

  startX = parseInt(Math.floor((v.getRect().x - left) / this.repulsionRange));
  finishX = parseInt(Math.floor((v.getRect().width + v.getRect().x - left) / this.repulsionRange));
  startY = parseInt(Math.floor((v.getRect().y - top) / this.repulsionRange));
  finishY = parseInt(Math.floor((v.getRect().height + v.getRect().y - top) / this.repulsionRange));

  for (var i = startX; i <= finishX; i++) {
    for (var j = startY; j <= finishY; j++) {
      this.grid[i][j].push(v);
      v.setGridCoordinates(startX, finishX, startY, finishY);
    }
  }
};

FDLayout.prototype.updateGrid = function () {
  var i;
  var nodeA;
  var lNodes = this.getAllNodes();

  this.grid = this.calcGrid(this.graphManager.getRoot());

  // put all nodes to proper grid cells
  for (i = 0; i < lNodes.length; i++) {
    nodeA = lNodes[i];
    this.addNodeToGrid(nodeA, this.graphManager.getRoot().getLeft(), this.graphManager.getRoot().getTop());
  }
};

FDLayout.prototype.calculateRepulsionForceOfANode = function (nodeA, processedNodeSet, gridUpdateAllowed, forceToNodeSurroundingUpdate) {

  if (this.totalIterations % FDLayoutConstants.GRID_CALCULATION_CHECK_PERIOD == 1 && gridUpdateAllowed || forceToNodeSurroundingUpdate) {
    var surrounding = new Set();
    nodeA.surrounding = new Array();
    var nodeB;
    var grid = this.grid;

    for (var i = nodeA.startX - 1; i < nodeA.finishX + 2; i++) {
      for (var j = nodeA.startY - 1; j < nodeA.finishY + 2; j++) {
        if (!(i < 0 || j < 0 || i >= grid.length || j >= grid[0].length)) {
          for (var k = 0; k < grid[i][j].length; k++) {
            nodeB = grid[i][j][k];

            // If both nodes are not members of the same graph, 
            // or both nodes are the same, skip.
            if (nodeA.getOwner() != nodeB.getOwner() || nodeA == nodeB) {
              continue;
            }

            // check if the repulsion force between
            // nodeA and nodeB has already been calculated
            if (!processedNodeSet.has(nodeB) && !surrounding.has(nodeB)) {
              var distanceX = Math.abs(nodeA.getCenterX() - nodeB.getCenterX()) - (nodeA.getWidth() / 2 + nodeB.getWidth() / 2);
              var distanceY = Math.abs(nodeA.getCenterY() - nodeB.getCenterY()) - (nodeA.getHeight() / 2 + nodeB.getHeight() / 2);

              // if the distance between nodeA and nodeB 
              // is less then calculation range
              if (distanceX <= this.repulsionRange && distanceY <= this.repulsionRange) {
                //then add nodeB to surrounding of nodeA
                surrounding.add(nodeB);
              }
            }
          }
        }
      }
    }

    nodeA.surrounding = [].concat(_toConsumableArray(surrounding));
  }
  for (i = 0; i < nodeA.surrounding.length; i++) {
    this.calcRepulsionForce(nodeA, nodeA.surrounding[i]);
  }
};

FDLayout.prototype.calcRepulsionRange = function () {
  return 0.0;
};

module.exports = FDLayout;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LEdge = __webpack_require__(1);
var FDLayoutConstants = __webpack_require__(4);

function FDLayoutEdge(source, target, vEdge) {
  LEdge.call(this, source, target, vEdge);

  // Ideal length and elasticity value for this edge
  this.idealLength = FDLayoutConstants.DEFAULT_EDGE_LENGTH;
  this.edgeElasticity = FDLayoutConstants.DEFAULT_SPRING_STRENGTH;
}

FDLayoutEdge.prototype = Object.create(LEdge.prototype);

for (var prop in LEdge) {
  FDLayoutEdge[prop] = LEdge[prop];
}

module.exports = FDLayoutEdge;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LNode = __webpack_require__(3);
var FDLayoutConstants = __webpack_require__(4);

function FDLayoutNode(gm, loc, size, vNode) {
  // alternative constructor is handled inside LNode
  LNode.call(this, gm, loc, size, vNode);

  // Repulsion value of this node
  this.nodeRepulsion = FDLayoutConstants.DEFAULT_REPULSION_STRENGTH;

  //Spring, repulsion and gravitational forces acting on this node
  this.springForceX = 0;
  this.springForceY = 0;
  this.repulsionForceX = 0;
  this.repulsionForceY = 0;
  this.gravitationForceX = 0;
  this.gravitationForceY = 0;
  //Amount by which this node is to be moved in this iteration
  this.displacementX = 0;
  this.displacementY = 0;

  //Start and finish grid coordinates that this node is fallen into
  this.startX = 0;
  this.finishX = 0;
  this.startY = 0;
  this.finishY = 0;

  //Geometric neighbors of this node
  this.surrounding = [];
}

FDLayoutNode.prototype = Object.create(LNode.prototype);

for (var prop in LNode) {
  FDLayoutNode[prop] = LNode[prop];
}

FDLayoutNode.prototype.setGridCoordinates = function (_startX, _finishX, _startY, _finishY) {
  this.startX = _startX;
  this.finishX = _finishX;
  this.startY = _startY;
  this.finishY = _finishY;
};

module.exports = FDLayoutNode;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function DimensionD(width, height) {
  this.width = 0;
  this.height = 0;
  if (width !== null && height !== null) {
    this.height = height;
    this.width = width;
  }
}

DimensionD.prototype.getWidth = function () {
  return this.width;
};

DimensionD.prototype.setWidth = function (width) {
  this.width = width;
};

DimensionD.prototype.getHeight = function () {
  return this.height;
};

DimensionD.prototype.setHeight = function (height) {
  this.height = height;
};

module.exports = DimensionD;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var UniqueIDGeneretor = __webpack_require__(14);

function HashMap() {
  this.map = {};
  this.keys = [];
}

HashMap.prototype.put = function (key, value) {
  var theId = UniqueIDGeneretor.createID(key);
  if (!this.contains(theId)) {
    this.map[theId] = value;
    this.keys.push(key);
  }
};

HashMap.prototype.contains = function (key) {
  var theId = UniqueIDGeneretor.createID(key);
  return this.map[key] != null;
};

HashMap.prototype.get = function (key) {
  var theId = UniqueIDGeneretor.createID(key);
  return this.map[theId];
};

HashMap.prototype.keySet = function () {
  return this.keys;
};

module.exports = HashMap;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var UniqueIDGeneretor = __webpack_require__(14);

function HashSet() {
  this.set = {};
}
;

HashSet.prototype.add = function (obj) {
  var theId = UniqueIDGeneretor.createID(obj);
  if (!this.contains(theId)) this.set[theId] = obj;
};

HashSet.prototype.remove = function (obj) {
  delete this.set[UniqueIDGeneretor.createID(obj)];
};

HashSet.prototype.clear = function () {
  this.set = {};
};

HashSet.prototype.contains = function (obj) {
  return this.set[UniqueIDGeneretor.createID(obj)] == obj;
};

HashSet.prototype.isEmpty = function () {
  return this.size() === 0;
};

HashSet.prototype.size = function () {
  return Object.keys(this.set).length;
};

//concats this.set to the given list
HashSet.prototype.addAllTo = function (list) {
  var keys = Object.keys(this.set);
  var length = keys.length;
  for (var i = 0; i < length; i++) {
    list.push(this.set[keys[i]]);
  }
};

HashSet.prototype.size = function () {
  return Object.keys(this.set).length;
};

HashSet.prototype.addAll = function (list) {
  var s = list.length;
  for (var i = 0; i < s; i++) {
    var v = list[i];
    this.add(v);
  }
};

module.exports = HashSet;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Some matrix (1d and 2d array) operations
function Matrix() {}

/**
 * matrix multiplication
 * array1, array2 and result are 2d arrays
 */
Matrix.multMat = function (array1, array2) {
  var result = [];

  for (var i = 0; i < array1.length; i++) {
    result[i] = [];
    for (var j = 0; j < array2[0].length; j++) {
      result[i][j] = 0;
      for (var k = 0; k < array1[0].length; k++) {
        result[i][j] += array1[i][k] * array2[k][j];
      }
    }
  }
  return result;
};

/**
 * matrix transpose
 * array and result are 2d arrays
 */
Matrix.transpose = function (array) {
  var result = [];

  for (var i = 0; i < array[0].length; i++) {
    result[i] = [];
    for (var j = 0; j < array.length; j++) {
      result[i][j] = array[j][i];
    }
  }

  return result;
};

/**
 * multiply array with constant
 * array and result are 1d arrays
 */
Matrix.multCons = function (array, constant) {
  var result = [];

  for (var i = 0; i < array.length; i++) {
    result[i] = array[i] * constant;
  }

  return result;
};

/**
 * substract two arrays
 * array1, array2 and result are 1d arrays
 */
Matrix.minusOp = function (array1, array2) {
  var result = [];

  for (var i = 0; i < array1.length; i++) {
    result[i] = array1[i] - array2[i];
  }

  return result;
};

/**
 * dot product of two arrays with same size
 * array1 and array2 are 1d arrays
 */
Matrix.dotProduct = function (array1, array2) {
  var product = 0;

  for (var i = 0; i < array1.length; i++) {
    product += array1[i] * array2[i];
  }

  return product;
};

/**
 * magnitude of an array
 * array is 1d array
 */
Matrix.mag = function (array) {
  return Math.sqrt(this.dotProduct(array, array));
};

/**
 * normalization of an array
 * array and result are 1d array
 */
Matrix.normalize = function (array) {
  var result = [];
  var magnitude = this.mag(array);

  for (var i = 0; i < array.length; i++) {
    result[i] = array[i] / magnitude;
  }

  return result;
};

/**
 * multiply an array with centering matrix
 * array and result are 1d array
 */
Matrix.multGamma = function (array) {
  var result = [];
  var sum = 0;

  for (var i = 0; i < array.length; i++) {
    sum += array[i];
  }

  sum *= -1 / array.length;

  for (var _i = 0; _i < array.length; _i++) {
    result[_i] = sum + array[_i];
  }
  return result;
};

/**
 * a special matrix multiplication
 * result = 0.5 * C * INV * C^T * array
 * array and result are 1d, C and INV are 2d arrays
 */
Matrix.multL = function (array, C, INV) {
  var result = [];
  var temp1 = [];
  var temp2 = [];

  // multiply by C^T
  for (var i = 0; i < C[0].length; i++) {
    var sum = 0;
    for (var j = 0; j < C.length; j++) {
      sum += -0.5 * C[j][i] * array[j];
    }
    temp1[i] = sum;
  }
  // multiply the result by INV
  for (var _i2 = 0; _i2 < INV.length; _i2++) {
    var _sum = 0;
    for (var _j = 0; _j < INV.length; _j++) {
      _sum += INV[_i2][_j] * temp1[_j];
    }
    temp2[_i2] = _sum;
  }
  // multiply the result by C
  for (var _i3 = 0; _i3 < C.length; _i3++) {
    var _sum2 = 0;
    for (var _j2 = 0; _j2 < C[0].length; _j2++) {
      _sum2 += C[_i3][_j2] * temp2[_j2];
    }
    result[_i3] = _sum2;
  }

  return result;
};

module.exports = Matrix;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A classic Quicksort algorithm with Hoare's partition
 * - Works also on LinkedList objects
 *
 * Copyright: i-Vis Research Group, Bilkent University, 2007 - present
 */

var LinkedList = __webpack_require__(11);

var Quicksort = function () {
    function Quicksort(A, compareFunction) {
        _classCallCheck(this, Quicksort);

        if (compareFunction !== null || compareFunction !== undefined) this.compareFunction = this._defaultCompareFunction;

        var length = void 0;
        if (A instanceof LinkedList) length = A.size();else length = A.length;

        this._quicksort(A, 0, length - 1);
    }

    _createClass(Quicksort, [{
        key: '_quicksort',
        value: function _quicksort(A, p, r) {
            if (p < r) {
                var q = this._partition(A, p, r);
                this._quicksort(A, p, q);
                this._quicksort(A, q + 1, r);
            }
        }
    }, {
        key: '_partition',
        value: function _partition(A, p, r) {
            var x = this._get(A, p);
            var i = p;
            var j = r;
            while (true) {
                while (this.compareFunction(x, this._get(A, j))) {
                    j--;
                }while (this.compareFunction(this._get(A, i), x)) {
                    i++;
                }if (i < j) {
                    this._swap(A, i, j);
                    i++;
                    j--;
                } else return j;
            }
        }
    }, {
        key: '_get',
        value: function _get(object, index) {
            if (object instanceof LinkedList) return object.get_object_at(index);else return object[index];
        }
    }, {
        key: '_set',
        value: function _set(object, index, value) {
            if (object instanceof LinkedList) object.set_object_at(index, value);else object[index] = value;
        }
    }, {
        key: '_swap',
        value: function _swap(A, i, j) {
            var temp = this._get(A, i);
            this._set(A, i, this._get(A, j));
            this._set(A, j, temp);
        }
    }, {
        key: '_defaultCompareFunction',
        value: function _defaultCompareFunction(a, b) {
            return b > a;
        }
    }]);

    return Quicksort;
}();

module.exports = Quicksort;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Singular Value Decomposition implementation
function SVD() {};

/* Below singular value decomposition (svd) code including hypot function is adopted from https://github.com/dragonfly-ai/JamaJS
   Some changes are applied to make the code compatible with the fcose code and to make it independent from Jama.
   Input matrix is changed to a 2D array instead of Jama matrix. Matrix dimensions are taken according to 2D array instead of using Jama functions.
   An object that includes singular value components is created for return. 
   The types of input parameters of the hypot function are removed. 
   let is used instead of var for the variable initialization.
*/
/*
                               Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "{}"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright {yyyy} {name of copyright owner}

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

SVD.svd = function (A) {
  this.U = null;
  this.V = null;
  this.s = null;
  this.m = 0;
  this.n = 0;
  this.m = A.length;
  this.n = A[0].length;
  var nu = Math.min(this.m, this.n);
  this.s = function (s) {
    var a = [];
    while (s-- > 0) {
      a.push(0);
    }return a;
  }(Math.min(this.m + 1, this.n));
  this.U = function (dims) {
    var allocate = function allocate(dims) {
      if (dims.length == 0) {
        return 0;
      } else {
        var array = [];
        for (var i = 0; i < dims[0]; i++) {
          array.push(allocate(dims.slice(1)));
        }
        return array;
      }
    };
    return allocate(dims);
  }([this.m, nu]);
  this.V = function (dims) {
    var allocate = function allocate(dims) {
      if (dims.length == 0) {
        return 0;
      } else {
        var array = [];
        for (var i = 0; i < dims[0]; i++) {
          array.push(allocate(dims.slice(1)));
        }
        return array;
      }
    };
    return allocate(dims);
  }([this.n, this.n]);
  var e = function (s) {
    var a = [];
    while (s-- > 0) {
      a.push(0);
    }return a;
  }(this.n);
  var work = function (s) {
    var a = [];
    while (s-- > 0) {
      a.push(0);
    }return a;
  }(this.m);
  var wantu = true;
  var wantv = true;
  var nct = Math.min(this.m - 1, this.n);
  var nrt = Math.max(0, Math.min(this.n - 2, this.m));
  for (var k = 0; k < Math.max(nct, nrt); k++) {
    if (k < nct) {
      this.s[k] = 0;
      for (var i = k; i < this.m; i++) {
        this.s[k] = SVD.hypot(this.s[k], A[i][k]);
      }
      ;
      if (this.s[k] !== 0.0) {
        if (A[k][k] < 0.0) {
          this.s[k] = -this.s[k];
        }
        for (var _i = k; _i < this.m; _i++) {
          A[_i][k] /= this.s[k];
        }
        ;
        A[k][k] += 1.0;
      }
      this.s[k] = -this.s[k];
    }
    for (var j = k + 1; j < this.n; j++) {
      if (function (lhs, rhs) {
        return lhs && rhs;
      }(k < nct, this.s[k] !== 0.0)) {
        var t = 0;
        for (var _i2 = k; _i2 < this.m; _i2++) {
          t += A[_i2][k] * A[_i2][j];
        }
        ;
        t = -t / A[k][k];
        for (var _i3 = k; _i3 < this.m; _i3++) {
          A[_i3][j] += t * A[_i3][k];
        }
        ;
      }
      e[j] = A[k][j];
    }
    ;
    if (function (lhs, rhs) {
      return lhs && rhs;
    }(wantu, k < nct)) {
      for (var _i4 = k; _i4 < this.m; _i4++) {
        this.U[_i4][k] = A[_i4][k];
      }
      ;
    }
    if (k < nrt) {
      e[k] = 0;
      for (var _i5 = k + 1; _i5 < this.n; _i5++) {
        e[k] = SVD.hypot(e[k], e[_i5]);
      }
      ;
      if (e[k] !== 0.0) {
        if (e[k + 1] < 0.0) {
          e[k] = -e[k];
        }
        for (var _i6 = k + 1; _i6 < this.n; _i6++) {
          e[_i6] /= e[k];
        }
        ;
        e[k + 1] += 1.0;
      }
      e[k] = -e[k];
      if (function (lhs, rhs) {
        return lhs && rhs;
      }(k + 1 < this.m, e[k] !== 0.0)) {
        for (var _i7 = k + 1; _i7 < this.m; _i7++) {
          work[_i7] = 0.0;
        }
        ;
        for (var _j = k + 1; _j < this.n; _j++) {
          for (var _i8 = k + 1; _i8 < this.m; _i8++) {
            work[_i8] += e[_j] * A[_i8][_j];
          }
          ;
        }
        ;
        for (var _j2 = k + 1; _j2 < this.n; _j2++) {
          var _t = -e[_j2] / e[k + 1];
          for (var _i9 = k + 1; _i9 < this.m; _i9++) {
            A[_i9][_j2] += _t * work[_i9];
          }
          ;
        }
        ;
      }
      if (wantv) {
        for (var _i10 = k + 1; _i10 < this.n; _i10++) {
          this.V[_i10][k] = e[_i10];
        };
      }
    }
  };
  var p = Math.min(this.n, this.m + 1);
  if (nct < this.n) {
    this.s[nct] = A[nct][nct];
  }
  if (this.m < p) {
    this.s[p - 1] = 0.0;
  }
  if (nrt + 1 < p) {
    e[nrt] = A[nrt][p - 1];
  }
  e[p - 1] = 0.0;
  if (wantu) {
    for (var _j3 = nct; _j3 < nu; _j3++) {
      for (var _i11 = 0; _i11 < this.m; _i11++) {
        this.U[_i11][_j3] = 0.0;
      }
      ;
      this.U[_j3][_j3] = 1.0;
    };
    for (var _k = nct - 1; _k >= 0; _k--) {
      if (this.s[_k] !== 0.0) {
        for (var _j4 = _k + 1; _j4 < nu; _j4++) {
          var _t2 = 0;
          for (var _i12 = _k; _i12 < this.m; _i12++) {
            _t2 += this.U[_i12][_k] * this.U[_i12][_j4];
          };
          _t2 = -_t2 / this.U[_k][_k];
          for (var _i13 = _k; _i13 < this.m; _i13++) {
            this.U[_i13][_j4] += _t2 * this.U[_i13][_k];
          };
        };
        for (var _i14 = _k; _i14 < this.m; _i14++) {
          this.U[_i14][_k] = -this.U[_i14][_k];
        };
        this.U[_k][_k] = 1.0 + this.U[_k][_k];
        for (var _i15 = 0; _i15 < _k - 1; _i15++) {
          this.U[_i15][_k] = 0.0;
        };
      } else {
        for (var _i16 = 0; _i16 < this.m; _i16++) {
          this.U[_i16][_k] = 0.0;
        };
        this.U[_k][_k] = 1.0;
      }
    };
  }
  if (wantv) {
    for (var _k2 = this.n - 1; _k2 >= 0; _k2--) {
      if (function (lhs, rhs) {
        return lhs && rhs;
      }(_k2 < nrt, e[_k2] !== 0.0)) {
        for (var _j5 = _k2 + 1; _j5 < nu; _j5++) {
          var _t3 = 0;
          for (var _i17 = _k2 + 1; _i17 < this.n; _i17++) {
            _t3 += this.V[_i17][_k2] * this.V[_i17][_j5];
          };
          _t3 = -_t3 / this.V[_k2 + 1][_k2];
          for (var _i18 = _k2 + 1; _i18 < this.n; _i18++) {
            this.V[_i18][_j5] += _t3 * this.V[_i18][_k2];
          };
        };
      }
      for (var _i19 = 0; _i19 < this.n; _i19++) {
        this.V[_i19][_k2] = 0.0;
      };
      this.V[_k2][_k2] = 1.0;
    };
  }
  var pp = p - 1;
  var iter = 0;
  var eps = Math.pow(2.0, -52.0);
  var tiny = Math.pow(2.0, -966.0);
  while (p > 0) {
    var _k3 = void 0;
    var kase = void 0;
    for (_k3 = p - 2; _k3 >= -1; _k3--) {
      if (_k3 === -1) {
        break;
      }
      if (Math.abs(e[_k3]) <= tiny + eps * (Math.abs(this.s[_k3]) + Math.abs(this.s[_k3 + 1]))) {
        e[_k3] = 0.0;
        break;
      }
    };
    if (_k3 === p - 2) {
      kase = 4;
    } else {
      var ks = void 0;
      for (ks = p - 1; ks >= _k3; ks--) {
        if (ks === _k3) {
          break;
        }
        var _t4 = (ks !== p ? Math.abs(e[ks]) : 0.0) + (ks !== _k3 + 1 ? Math.abs(e[ks - 1]) : 0.0);
        if (Math.abs(this.s[ks]) <= tiny + eps * _t4) {
          this.s[ks] = 0.0;
          break;
        }
      };
      if (ks === _k3) {
        kase = 3;
      } else if (ks === p - 1) {
        kase = 1;
      } else {
        kase = 2;
        _k3 = ks;
      }
    }
    _k3++;
    switch (kase) {
      case 1:
        {
          var f = e[p - 2];
          e[p - 2] = 0.0;
          for (var _j6 = p - 2; _j6 >= _k3; _j6--) {
            var _t5 = SVD.hypot(this.s[_j6], f);
            var cs = this.s[_j6] / _t5;
            var sn = f / _t5;
            this.s[_j6] = _t5;
            if (_j6 !== _k3) {
              f = -sn * e[_j6 - 1];
              e[_j6 - 1] = cs * e[_j6 - 1];
            }
            if (wantv) {
              for (var _i20 = 0; _i20 < this.n; _i20++) {
                _t5 = cs * this.V[_i20][_j6] + sn * this.V[_i20][p - 1];
                this.V[_i20][p - 1] = -sn * this.V[_i20][_j6] + cs * this.V[_i20][p - 1];
                this.V[_i20][_j6] = _t5;
              };
            }
          };
        };
        break;
      case 2:
        {
          var _f = e[_k3 - 1];
          e[_k3 - 1] = 0.0;
          for (var _j7 = _k3; _j7 < p; _j7++) {
            var _t6 = SVD.hypot(this.s[_j7], _f);
            var _cs = this.s[_j7] / _t6;
            var _sn = _f / _t6;
            this.s[_j7] = _t6;
            _f = -_sn * e[_j7];
            e[_j7] = _cs * e[_j7];
            if (wantu) {
              for (var _i21 = 0; _i21 < this.m; _i21++) {
                _t6 = _cs * this.U[_i21][_j7] + _sn * this.U[_i21][_k3 - 1];
                this.U[_i21][_k3 - 1] = -_sn * this.U[_i21][_j7] + _cs * this.U[_i21][_k3 - 1];
                this.U[_i21][_j7] = _t6;
              };
            }
          };
        };
        break;
      case 3:
        {
          var scale = Math.max(Math.max(Math.max(Math.max(Math.abs(this.s[p - 1]), Math.abs(this.s[p - 2])), Math.abs(e[p - 2])), Math.abs(this.s[_k3])), Math.abs(e[_k3]));
          var sp = this.s[p - 1] / scale;
          var spm1 = this.s[p - 2] / scale;
          var epm1 = e[p - 2] / scale;
          var sk = this.s[_k3] / scale;
          var ek = e[_k3] / scale;
          var b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2.0;
          var c = sp * epm1 * (sp * epm1);
          var shift = 0.0;
          if (function (lhs, rhs) {
            return lhs || rhs;
          }(b !== 0.0, c !== 0.0)) {
            shift = Math.sqrt(b * b + c);
            if (b < 0.0) {
              shift = -shift;
            }
            shift = c / (b + shift);
          }
          var _f2 = (sk + sp) * (sk - sp) + shift;
          var g = sk * ek;
          for (var _j8 = _k3; _j8 < p - 1; _j8++) {
            var _t7 = SVD.hypot(_f2, g);
            var _cs2 = _f2 / _t7;
            var _sn2 = g / _t7;
            if (_j8 !== _k3) {
              e[_j8 - 1] = _t7;
            }
            _f2 = _cs2 * this.s[_j8] + _sn2 * e[_j8];
            e[_j8] = _cs2 * e[_j8] - _sn2 * this.s[_j8];
            g = _sn2 * this.s[_j8 + 1];
            this.s[_j8 + 1] = _cs2 * this.s[_j8 + 1];
            if (wantv) {
              for (var _i22 = 0; _i22 < this.n; _i22++) {
                _t7 = _cs2 * this.V[_i22][_j8] + _sn2 * this.V[_i22][_j8 + 1];
                this.V[_i22][_j8 + 1] = -_sn2 * this.V[_i22][_j8] + _cs2 * this.V[_i22][_j8 + 1];
                this.V[_i22][_j8] = _t7;
              };
            }
            _t7 = SVD.hypot(_f2, g);
            _cs2 = _f2 / _t7;
            _sn2 = g / _t7;
            this.s[_j8] = _t7;
            _f2 = _cs2 * e[_j8] + _sn2 * this.s[_j8 + 1];
            this.s[_j8 + 1] = -_sn2 * e[_j8] + _cs2 * this.s[_j8 + 1];
            g = _sn2 * e[_j8 + 1];
            e[_j8 + 1] = _cs2 * e[_j8 + 1];
            if (wantu && _j8 < this.m - 1) {
              for (var _i23 = 0; _i23 < this.m; _i23++) {
                _t7 = _cs2 * this.U[_i23][_j8] + _sn2 * this.U[_i23][_j8 + 1];
                this.U[_i23][_j8 + 1] = -_sn2 * this.U[_i23][_j8] + _cs2 * this.U[_i23][_j8 + 1];
                this.U[_i23][_j8] = _t7;
              };
            }
          };
          e[p - 2] = _f2;
          iter = iter + 1;
        };
        break;
      case 4:
        {
          if (this.s[_k3] <= 0.0) {
            this.s[_k3] = this.s[_k3] < 0.0 ? -this.s[_k3] : 0.0;
            if (wantv) {
              for (var _i24 = 0; _i24 <= pp; _i24++) {
                this.V[_i24][_k3] = -this.V[_i24][_k3];
              };
            }
          }
          while (_k3 < pp) {
            if (this.s[_k3] >= this.s[_k3 + 1]) {
              break;
            }
            var _t8 = this.s[_k3];
            this.s[_k3] = this.s[_k3 + 1];
            this.s[_k3 + 1] = _t8;
            if (wantv && _k3 < this.n - 1) {
              for (var _i25 = 0; _i25 < this.n; _i25++) {
                _t8 = this.V[_i25][_k3 + 1];
                this.V[_i25][_k3 + 1] = this.V[_i25][_k3];
                this.V[_i25][_k3] = _t8;
              };
            }
            if (wantu && _k3 < this.m - 1) {
              for (var _i26 = 0; _i26 < this.m; _i26++) {
                _t8 = this.U[_i26][_k3 + 1];
                this.U[_i26][_k3 + 1] = this.U[_i26][_k3];
                this.U[_i26][_k3] = _t8;
              };
            }
            _k3++;
          };
          iter = 0;
          p--;
        };
        break;
    }
  };
  var result = { U: this.U, V: this.V, S: this.s };
  return result;
};

// sqrt(a^2 + b^2) without under/overflow.
SVD.hypot = function (a, b) {
  var r = void 0;
  if (Math.abs(a) > Math.abs(b)) {
    r = b / a;
    r = Math.abs(a) * Math.sqrt(1 + r * r);
  } else if (b != 0) {
    r = a / b;
    r = Math.abs(b) * Math.sqrt(1 + r * r);
  } else {
    r = 0.0;
  }
  return r;
};

module.exports = SVD;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *   Needleman-Wunsch algorithm is an procedure to compute the optimal global alignment of two string
 *   sequences by S.B.Needleman and C.D.Wunsch (1970).
 *
 *   Aside from the inputs, you can assign the scores for,
 *   - Match: The two characters at the current index are same.
 *   - Mismatch: The two characters at the current index are different.
 *   - Insertion/Deletion(gaps): The best alignment involves one letter aligning to a gap in the other string.
 */

var NeedlemanWunsch = function () {
    function NeedlemanWunsch(sequence1, sequence2) {
        var match_score = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var mismatch_penalty = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;
        var gap_penalty = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;

        _classCallCheck(this, NeedlemanWunsch);

        this.sequence1 = sequence1;
        this.sequence2 = sequence2;
        this.match_score = match_score;
        this.mismatch_penalty = mismatch_penalty;
        this.gap_penalty = gap_penalty;

        // Just the remove redundancy
        this.iMax = sequence1.length + 1;
        this.jMax = sequence2.length + 1;

        // Grid matrix of scores
        this.grid = new Array(this.iMax);
        for (var i = 0; i < this.iMax; i++) {
            this.grid[i] = new Array(this.jMax);

            for (var j = 0; j < this.jMax; j++) {
                this.grid[i][j] = 0;
            }
        }

        // Traceback matrix (2D array, each cell is an array of boolean values for [`Diag`, `Up`, `Left`] positions)
        this.tracebackGrid = new Array(this.iMax);
        for (var _i = 0; _i < this.iMax; _i++) {
            this.tracebackGrid[_i] = new Array(this.jMax);

            for (var _j = 0; _j < this.jMax; _j++) {
                this.tracebackGrid[_i][_j] = [null, null, null];
            }
        }

        // The aligned sequences (return multiple possibilities)
        this.alignments = [];

        // Final alignment score
        this.score = -1;

        // Calculate scores and tracebacks
        this.computeGrids();
    }

    _createClass(NeedlemanWunsch, [{
        key: "getScore",
        value: function getScore() {
            return this.score;
        }
    }, {
        key: "getAlignments",
        value: function getAlignments() {
            return this.alignments;
        }

        // Main dynamic programming procedure

    }, {
        key: "computeGrids",
        value: function computeGrids() {
            // Fill in the first row
            for (var j = 1; j < this.jMax; j++) {
                this.grid[0][j] = this.grid[0][j - 1] + this.gap_penalty;
                this.tracebackGrid[0][j] = [false, false, true];
            }

            // Fill in the first column
            for (var i = 1; i < this.iMax; i++) {
                this.grid[i][0] = this.grid[i - 1][0] + this.gap_penalty;
                this.tracebackGrid[i][0] = [false, true, false];
            }

            // Fill the rest of the grid
            for (var _i2 = 1; _i2 < this.iMax; _i2++) {
                for (var _j2 = 1; _j2 < this.jMax; _j2++) {
                    // Find the max score(s) among [`Diag`, `Up`, `Left`]
                    var diag = void 0;
                    if (this.sequence1[_i2 - 1] === this.sequence2[_j2 - 1]) diag = this.grid[_i2 - 1][_j2 - 1] + this.match_score;else diag = this.grid[_i2 - 1][_j2 - 1] + this.mismatch_penalty;

                    var up = this.grid[_i2 - 1][_j2] + this.gap_penalty;
                    var left = this.grid[_i2][_j2 - 1] + this.gap_penalty;

                    // If there exists multiple max values, capture them for multiple paths
                    var maxOf = [diag, up, left];
                    var indices = this.arrayAllMaxIndexes(maxOf);

                    // Update Grids
                    this.grid[_i2][_j2] = maxOf[indices[0]];
                    this.tracebackGrid[_i2][_j2] = [indices.includes(0), indices.includes(1), indices.includes(2)];
                }
            }

            // Update alignment score
            this.score = this.grid[this.iMax - 1][this.jMax - 1];
        }

        // Gets all possible valid sequence combinations

    }, {
        key: "alignmentTraceback",
        value: function alignmentTraceback() {
            var inProcessAlignments = [];

            inProcessAlignments.push({ pos: [this.sequence1.length, this.sequence2.length],
                seq1: "",
                seq2: ""
            });

            while (inProcessAlignments[0]) {
                var current = inProcessAlignments[0];
                var directions = this.tracebackGrid[current.pos[0]][current.pos[1]];

                if (directions[0]) {
                    inProcessAlignments.push({ pos: [current.pos[0] - 1, current.pos[1] - 1],
                        seq1: this.sequence1[current.pos[0] - 1] + current.seq1,
                        seq2: this.sequence2[current.pos[1] - 1] + current.seq2
                    });
                }
                if (directions[1]) {
                    inProcessAlignments.push({ pos: [current.pos[0] - 1, current.pos[1]],
                        seq1: this.sequence1[current.pos[0] - 1] + current.seq1,
                        seq2: '-' + current.seq2
                    });
                }
                if (directions[2]) {
                    inProcessAlignments.push({ pos: [current.pos[0], current.pos[1] - 1],
                        seq1: '-' + current.seq1,
                        seq2: this.sequence2[current.pos[1] - 1] + current.seq2
                    });
                }

                if (current.pos[0] === 0 && current.pos[1] === 0) this.alignments.push({ sequence1: current.seq1,
                    sequence2: current.seq2
                });

                inProcessAlignments.shift();
            }

            return this.alignments;
        }

        // Helper Functions

    }, {
        key: "getAllIndexes",
        value: function getAllIndexes(arr, val) {
            var indexes = [],
                i = -1;
            while ((i = arr.indexOf(val, i + 1)) !== -1) {
                indexes.push(i);
            }
            return indexes;
        }
    }, {
        key: "arrayAllMaxIndexes",
        value: function arrayAllMaxIndexes(array) {
            return this.getAllIndexes(array, Math.max.apply(null, array));
        }
    }]);

    return NeedlemanWunsch;
}();

module.exports = NeedlemanWunsch;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var layoutBase = function layoutBase() {
  return;
};

layoutBase.FDLayout = __webpack_require__(18);
layoutBase.FDLayoutConstants = __webpack_require__(4);
layoutBase.FDLayoutEdge = __webpack_require__(19);
layoutBase.FDLayoutNode = __webpack_require__(20);
layoutBase.DimensionD = __webpack_require__(21);
layoutBase.HashMap = __webpack_require__(22);
layoutBase.HashSet = __webpack_require__(23);
layoutBase.IGeometry = __webpack_require__(8);
layoutBase.IMath = __webpack_require__(9);
layoutBase.Integer = __webpack_require__(10);
layoutBase.Point = __webpack_require__(12);
layoutBase.PointD = __webpack_require__(5);
layoutBase.RandomSeed = __webpack_require__(16);
layoutBase.RectangleD = __webpack_require__(13);
layoutBase.Transform = __webpack_require__(17);
layoutBase.UniqueIDGeneretor = __webpack_require__(14);
layoutBase.Quicksort = __webpack_require__(25);
layoutBase.LinkedList = __webpack_require__(11);
layoutBase.LGraphObject = __webpack_require__(2);
layoutBase.LGraph = __webpack_require__(6);
layoutBase.LEdge = __webpack_require__(1);
layoutBase.LGraphManager = __webpack_require__(7);
layoutBase.LNode = __webpack_require__(3);
layoutBase.Layout = __webpack_require__(15);
layoutBase.LayoutConstants = __webpack_require__(0);
layoutBase.NeedlemanWunsch = __webpack_require__(27);
layoutBase.Matrix = __webpack_require__(24);
layoutBase.SVD = __webpack_require__(26);

module.exports = layoutBase;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Emitter() {
  this.listeners = [];
}

var p = Emitter.prototype;

p.addListener = function (event, callback) {
  this.listeners.push({
    event: event,
    callback: callback
  });
};

p.removeListener = function (event, callback) {
  for (var i = this.listeners.length; i >= 0; i--) {
    var l = this.listeners[i];

    if (l.event === event && l.callback === callback) {
      this.listeners.splice(i, 1);
    }
  }
};

p.emit = function (event, data) {
  for (var i = 0; i < this.listeners.length; i++) {
    var l = this.listeners[i];

    if (event === l.event) {
      l.callback(data);
    }
  }
};

module.exports = Emitter;

/***/ })
/******/ ]);
});

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(139);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 139 */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.uggly = factory());
})(this, (function () { 'use strict';

  let computeConstraints = function (cy, placement, isLoop, idealEdgeLength, slopeThreshold) {
    let relativePlacementConstraints = [];
    let verticalAlignments = [];
    let horizontalAlignments = [];

    placement.forEach(line => {
      let directionInfo = getLineDirection(line, slopeThreshold);
      let direction = directionInfo.direction;
      let angle = directionInfo.angle;
      if (direction == "l-r") {
        // generate appropriate constraints
        let relativePlacement = [];
        if (isLoop) {
          line.nodes.forEach((node, i) => {
            if (i != line.nodes.length - 1) {
              relativePlacement.push({left: node, right: line.nodes[i+1]});
            }
          });
          horizontalAlignments.push(line.nodes); 
        } else {
          line.nodesAll.forEach((node, i) => {
            if (line.parent[node] != null && i != 0) {
              relativePlacement.push({left: line.parent[node], right: node});
            }
          });
          horizontalAlignments.push(line.nodesAll); 
        }
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);    
      } else if (direction == "r-l") {
        // generate appropriate constraints
        let relativePlacement = [];
        if (isLoop) {
          line.nodes.forEach((node, i) => {
            if (i != line.nodes.length - 1) {
              relativePlacement.push({right: node, left: line.nodes[i+1]});
            }
          });
          horizontalAlignments.push(line.nodes);
        } else {
          line.nodesAll.forEach((node, i) => {
            if (line.parent[node] != null && i != 0) {
              relativePlacement.push({right: line.parent[node], left: node});
            }
          });
          horizontalAlignments.push(line.nodesAll);
        }
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);
      } else if (direction == "t-b") {
        // generate appropriate constraints
        let relativePlacement = [];
        if (isLoop) {
          line.nodes.forEach((node, i) => {
            if (i != line.nodes.length - 1) {
              relativePlacement.push({top: node, bottom: line.nodes[i+1]});
            }
          });
          verticalAlignments.push(line.nodes);
        } else {
          line.nodesAll.forEach((node, i) => {
            if (line.parent[node] != null && i != 0) {
              relativePlacement.push({top: line.parent[node], bottom: node});
            }
          });
          verticalAlignments.push(line.nodesAll);
        }
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement); 
      } else if (direction == "b-t") {
        // generate appropriate constraints
        let relativePlacement = [];
        if (isLoop) {
          line.nodes.forEach((node, i) => {
            if (i != line.nodes.length - 1) {
              relativePlacement.push({bottom: node, top: line.nodes[i+1]});
            }
          });
          verticalAlignments.push(line.nodes);
        } else {
          line.nodesAll.forEach((node, i) => {
            if (line.parent[node] != null && i != 0) {
              relativePlacement.push({bottom: line.parent[node], top: node});
            }
          });
          verticalAlignments.push(line.nodesAll);
        }
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);
      } else if (direction == "tl-br") {
        // generate appropriate constraints
        let relativePlacement = [];
        if (isLoop) {
          line.nodes.forEach((nodeId, i) => {
            if (i != line.nodes.length - 1) {
              let node = cy.getElementById(nodeId);
              let nextNode = cy.getElementById(line.nodes[i+1]);
              let gapResult = calculateGaps(node, nextNode, idealEdgeLength, angle);
              relativePlacement.push({left: nodeId, right: line.nodes[i+1], gap: gapResult[0]});
              relativePlacement.push({top: nodeId, bottom: line.nodes[i+1], gap: gapResult[1]});
            }
          });
        } else {
          line.nodesAll.forEach((nodeId, i) => {
            if (line.parent[nodeId] != null && i != 0) {
              let node = cy.getElementById(line.parent[nodeId]);
              let nextNode = cy.getElementById(nodeId);
              let gapResult = calculateGaps(node, nextNode, idealEdgeLength, angle);
              relativePlacement.push({left: line.parent[nodeId], right: nodeId, gap: gapResult[0]});
              relativePlacement.push({top: line.parent[nodeId], bottom: nodeId, gap: gapResult[1]});
            }
          });
        }
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);
      } else if (direction == "br-tl") {
        // generate appropriate constraints
        let relativePlacement = [];
        if (isLoop) {
          line.nodes.forEach((nodeId, i) => {
            if (i != line.nodes.length - 1) {
              let node = cy.getElementById(nodeId);
              let nextNode = cy.getElementById(line.nodes[i+1]);
              let gapResult = calculateGaps(node, nextNode, idealEdgeLength, angle);
              relativePlacement.push({right: nodeId, left: line.nodes[i+1], gap: gapResult[0]});
              relativePlacement.push({bottom: nodeId, top: line.nodes[i+1], gap: gapResult[1]});
            }
          });
        } else {
          line.nodesAll.forEach((nodeId, i) => {
            if (line.parent[nodeId] != null && i != 0) {
              let node = cy.getElementById(line.parent[nodeId]);
              let nextNode = cy.getElementById(nodeId);
              let gapResult = calculateGaps(node, nextNode, idealEdgeLength, angle);
              relativePlacement.push({right: line.parent[nodeId], left: nodeId, gap: gapResult[0]});
              relativePlacement.push({bottom: line.parent[nodeId], top: nodeId, gap: gapResult[1]});
            }
          });
        }
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);
      } else if (direction == "tr-bl") {
        // generate appropriate constraints
        let relativePlacement = [];
        if (isLoop) {
          line.nodes.forEach((nodeId, i) => {
            if (i != line.nodes.length - 1) {
              let node = cy.getElementById(nodeId);
              let nextNode = cy.getElementById(line.nodes[i+1]);
              let gapResult = calculateGaps(node, nextNode, idealEdgeLength, angle);
              relativePlacement.push({right: nodeId, left: line.nodes[i+1], gap: gapResult[0]});
              relativePlacement.push({top: nodeId, bottom: line.nodes[i+1], gap: gapResult[1]});
            }
          });
        } else {
          line.nodesAll.forEach((nodeId, i) => {
            if (line.parent[nodeId] != null && i != 0) {
              let node = cy.getElementById(line.parent[nodeId]);
              let nextNode = cy.getElementById(nodeId);
              let gapResult = calculateGaps(node, nextNode, idealEdgeLength, angle);
              relativePlacement.push({right: line.parent[nodeId], left: nodeId, gap: gapResult[0]});
              relativePlacement.push({top: line.parent[nodeId], bottom: nodeId, gap: gapResult[1]});
            }
          });
        }
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);
      } else if (direction == "bl-tr") {
        direction = "bl-tr";
        // generate appropriate constraints
        let relativePlacement = [];
        if (isLoop) {
          line.nodes.forEach((nodeId, i) => {
            if (i != line.nodes.length - 1) {
              let node = cy.getElementById(nodeId);
              let nextNode = cy.getElementById(line.nodes[i+1]);
              let gapResult = calculateGaps(node, nextNode, idealEdgeLength, angle);
              relativePlacement.push({left: nodeId, right: line.nodes[i+1], gap: gapResult[0]});
              relativePlacement.push({bottom: nodeId, top: line.nodes[i+1], gap: gapResult[1]});
            }
          });
        } else {
          line.nodesAll.forEach((nodeId, i) => {
            if (line.parent[nodeId] != null && i != 0) {
              let node = cy.getElementById(line.parent[nodeId]);
              let nextNode = cy.getElementById(nodeId);
              let gapResult = calculateGaps(node, nextNode, idealEdgeLength, angle);
              relativePlacement.push({left: line.parent[nodeId], right: nodeId, gap: gapResult[0]});
              relativePlacement.push({bottom: line.parent[nodeId], top: nodeId, gap: gapResult[1]});
            }
          });
        }
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);
      }
    });
    if (verticalAlignments.length) {
      verticalAlignments = mergeArrays(verticalAlignments);
    }
    if (horizontalAlignments.length) {
      horizontalAlignments = mergeArrays(horizontalAlignments);
    }

    let alignmentConstraints = { vertical: verticalAlignments.length > 0 ? verticalAlignments : undefined, horizontal: horizontalAlignments.length > 0 ? horizontalAlignments : undefined };

    return { relativePlacementConstraint: relativePlacementConstraints, alignmentConstraint: alignmentConstraints }
  };

  // calculates line direction
  let getLineDirection = function(line, slopeThreshold = 0.15) {
    let direction = "l-r";
    let angle = Math.atan(Math.abs(line.end[1] - line.start[1]) / Math.abs(line.end[0] - line.start[0]));
    if (Math.abs(line.end[1] - line.start[1]) / Math.abs(line.end[0] - line.start[0]) < slopeThreshold) {
      if (line.end[0] - line.start[0] > 0) {
        direction = "l-r";
      } else {
        direction = "r-l";
      }
    } else if (Math.abs(line.end[0] - line.start[0]) / Math.abs(line.end[1] - line.start[1]) < slopeThreshold) {
      if (line.end[1] - line.start[1] > 0) {
        direction = "t-b";
      } else {
        direction = "b-t";
      }
    } else if (line.end[1] - line.start[1] > 0 && line.end[0] - line.start[0] > 0) {
      direction = "tl-br";
    } else if (line.end[1] - line.start[1] < 0 && line.end[0] - line.start[0] < 0) {
      direction = "br-tl";
    } else if (line.end[1] - line.start[1] > 0 && line.end[0] - line.start[0] < 0) {
      direction = "tr-bl";
    } else if (line.end[1] - line.start[1] < 0 && line.end[0] - line.start[0] > 0) {
      direction = "bl-tr";
    }
    return {direction, angle};
  };

  let calculateGaps = function(node1, node2, idealEdgeLength, angle) {
    let r1 = Math.min((node1.width() / 2) / Math.cos(angle), (node1.height() / 2) / Math.sin(angle));
    let r2 = Math.min((node2.width() / 2) / Math.cos(angle), (node2.height() / 2) / Math.sin(angle));
    let gapX = (r1 + r2 + idealEdgeLength) * Math.cos(angle);
    let gapY = (r1 + r2 + idealEdgeLength) * Math.sin(angle);

    return [gapX, gapY];
  };

  // auxuliary function to merge arrays with duplicates
  let mergeArrays = function (arrays) {
    // Function to check if two arrays have common items
    function haveCommonItems(arr1, arr2) {
      return arr1.some(item => arr2.includes(item));
    }

    // Function to merge two arrays and remove duplicates
    function mergeAndRemoveDuplicates(arr1, arr2) {
      return Array.from(new Set([...arr1, ...arr2]));
    }

    // Loop until no more merges are possible
    let merged = false;
    do {
      merged = false;
      for (let i = 0; i < arrays.length; i++) {
        for (let j = i + 1; j < arrays.length; j++) {
          if (haveCommonItems(arrays[i], arrays[j])) {
            // Merge the arrays
            arrays[i] = mergeAndRemoveDuplicates(arrays[i], arrays[j]);
            // Remove the merged array
            arrays.splice(j, 1);
            // Set merged to true to indicate a merge has occurred
            merged = true;
            break;
          }
        }
        if (merged) {
          break;
        }
      }
    } while (merged);

    return arrays;
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var trace_skeleton_min = {exports: {}};

  (function (module, exports) {
  	!function(t,r){module.exports=r();}(commonjsGlobal,(function(){return new function(){var t=this;function r(t,r,e,n){for(var o=0,a=1;a<e-1;a++)for(var i=1;i<r-1;i++){var f=1&t[(a-1)*r+i],h=1&t[(a-1)*r+i+1],l=1&t[a*r+i+1],u=1&t[(a+1)*r+i+1],c=1&t[(a+1)*r+i],s=1&t[(a+1)*r+i-1],v=1&t[a*r+i-1],g=1&t[(a-1)*r+i-1],d=f+h+l+u+c+s+v+g;1==(0==f&&1==h)+(0==h&&1==l)+(0==l&&1==u)+(0==u&&1==c)+(0==c&&1==s)+(0==s&&1==v)+(0==v&&1==g)+(0==g&&1==f)&&d>=2&&d<=6&&0==(0==n?f*l*c:f*l*v)&&0==(0==n?l*c*v:f*c*v)&&(t[a*r+i]|=2);}for(a=0;a<e*r;a++){var p=t[a]>>1,M=1&t[a];t[a]=M&!p,o||t[a]==M||(o=1);}return o}function e(t,r,e,n,o,a,i){for(var f=o;f<o+i;f++)for(var h=n;h<n+a;h++)if(t[f*r+h])return  true;return  false}function n(t,r,e,n,o,a){var i=(a>>1&1)>0,f=(a>>0&1)>0,h=-1,l=4,u=r[e].length-1,c=r[e][f?0:u];if(Math.abs(c[o?1:0]-n)>0)return  false;for(var s=0;s<t.length;s++){var v=t[s].length-1,g=t[s][i?0:v];if(!(Math.abs(g[o?1:0]-n)>1)){var d=Math.abs(g[o?0:1]-c[o?0:1]);d<l&&(h=s,l=d);}}return  -1!=h&&(i&&f?(r[e].reverse(),t[h]=r[e].concat(t[h])):!i&&f?t[h]=t[h].concat(r[e]):i&&!f?t[h]=r[e].concat(t[h]):(r[e].reverse(),t[h]=t[h].concat(r[e])),r.splice(e,1),true)}t.thinningZS=function(t,e,n){var o=true;do{o&=r(t,e,n,0),o&=r(t,e,n,1);}while(o)};function o(t,r,e,o){for(var a=r.length-1;a>=0;a--)if(1==o){if(n(t,r,a,e,false,1))continue;if(n(t,r,a,e,false,3))continue;if(n(t,r,a,e,false,0))continue;if(n(t,r,a,e,false,2))continue}else {if(n(t,r,a,e,true,1))continue;if(n(t,r,a,e,true,3))continue;if(n(t,r,a,e,true,0))continue;if(n(t,r,a,e,true,2))continue}r.map(r=>t.push(r));}function a(t,r,e,n,o,a,i){for(var f=[],h=false,l=-1,u=-1,c=0;c<i+i+a+a-4;c++){c<a?(d=o+0,p=n+c):c<a+i-1?(d=o+c-a+1,p=n+a-1):c<a+i+a-2?(d=o+i-1,p=n+a-(c-a-i+3)):(d=o+i-(c-a-i-a+4),p=n+0),t[d*r+p]?h||(h=true,f.push([[p,d],[Math.floor(n+a/2),Math.floor(o+i/2)]])):h&&(f[f.length-1][0][0]=Math.floor((f[f.length-1][0][0]+u)/2),f[f.length-1][0][1]=Math.floor((f[f.length-1][0][1]+l)/2),h=false),l=d,u=p;}if(2==f.length)f=[[f[0][0],f[1][0]]];else if(f.length>2){for(var s=0,v=-1,g=-1,d=o+1;d<o+i-1;d++)for(var p=n+1;p<n+a-1;p++){var M=t[d*r-r+p-1]+t[d*r-r+p]+t[d*r-r+p-1+1]+t[d*r+p-1]+t[d*r+p]+t[d*r+p+1]+t[d*r+r+p-1]+t[d*r+r+p]+t[d*r+r+p+1];(M>s||M==s&&Math.abs(p-(n+a/2))+Math.abs(d-(o+i/2))<Math.abs(g-(n+a/2))+Math.abs(v-(o+i/2)))&&(v=d,g=p,s=M);}if(-1!=v)for(d=0;d<f.length;d++)f[d][1]=[g,v];}return f}t.traceSkeleton=function(r,n,i,f,h,l,u,c,s,v){var g=[];if(0==s)return g;if(l<=c&&u<=c)return a(r,n,0,f,h,l,u);var d=n+i,p=-1,M=-1;if(u>c)for(var m=h+3;m<h+u-3;m++)if(!(r[m*n+f]||r[(m-1)*n+f]||r[m*n+f+l-1]||r[(m-1)*n+f+l-1])){for(var k=0,w=f;w<f+l;w++)k+=r[m*n+w],k+=r[(m-1)*n+w];(k<d||k==d&&Math.abs(m-(h+u/2))<Math.abs(p-(h+u/2)))&&(d=k,p=m);}if(l>c)for(w=f+3;w<f+l-3;w++)if(!(r[n*h+w]||r[n*(h+u)-n+w]||r[n*h+w-1]||r[n*(h+u)-n+w-1])){for(k=0,m=h;m<h+u;m++)k+=r[m*n+w],k+=r[m*n+w-1];(k<d||k==d&&Math.abs(w-(f+l/2))<Math.abs(M-(f+l/2)))&&(d=k,p=-1,M=w);}if(u>c&&-1!=p){var b=[f,p,l,h+u-p];e(r,n,0,($=[f,h,l,p-h])[0],$[1],$[2],$[3])&&(null!=v&&v.push($),g=t.traceSkeleton(r,n,i,$[0],$[1],$[2],$[3],c,s-1,v)),e(r,n,0,b[0],b[1],b[2],b[3])&&(null!=v&&v.push(b),o(g,t.traceSkeleton(r,n,i,b[0],b[1],b[2],b[3],c,s-1,v),p,2));}else if(l>c&&-1!=M){var $;b=[M,h,f+l-M,u];e(r,n,0,($=[f,h,M-f,u])[0],$[1],$[2],$[3])&&(null!=v&&v.push($),g=t.traceSkeleton(r,n,i,$[0],$[1],$[2],$[3],c,s-1,v)),e(r,n,0,b[0],b[1],b[2],b[3])&&(null!=v&&v.push(b),o(g,t.traceSkeleton(r,n,i,b[0],b[1],b[2],b[3],c,s-1,v),M,1));}return  -1==p&&-1==M&&(g=a(r,n,0,f,h,l,u)),g},t.trace=function(r,e,n,o){t.thinningZS(r,e,n);var a=[];return {rects:a,polylines:t.traceSkeleton(r,e,n,0,0,e,n,o,999,a),width:e,height:n}},t.onload=function(t){t();},t.fromBoolArray=function(r,e,n){return t.trace(r.map(t=>t?1:0),e,n,10)},t.fromCharString=function(r,e,n){return t.trace(r.split("").map(t=>t.charCodeAt(0)),e,n,10)},t.fromImageData=function(r){for(var e=r.width,n=r.height,o=r.data,a=[],i=0;i<o.length;i+=4)o[i]?a.push(1):a.push(0);return t.trace(a,e,n,10)},t.fromCanvas=function(r){var e=r.getContext("2d").getImageData(0,0,r.width,r.height);return t.fromImageData(e)},t.visualize=function(t,r){var e=t.rects,n=t.polylines;null==r&&(r={});var o=null==r.scale?1:r.scale,a=null==r.strokeWidth?1:r.strokeWidth,i=null==r.rects?1:0,f=r.keypoints=1,h=`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${t.width*o}" height="${t.height*o}">`;if(i)for(var l=0;l<e.length;l++)h+=`<rect fill="none" stroke="gray" x="${e[l][0]*o}" y="${e[l][1]*o}" width="${e[l][2]*o}" height="${e[l][3]*o}" />`;for(l=0;l<n.length;l++)h+=`<path fill="none" stroke-width="${a}" stroke="rgb(${Math.floor(200*Math.random())},${Math.floor(200*Math.random())},${Math.floor(200*Math.random())})" d="M${n[l].map(t=>t[0]*o+","+t[1]*o).join(" L")}"/>`;if(f)for(l=0;l<n.length;l++)for(var u=0;u<n[l].length;u++)h+=`<rect fill="none" stroke="red" x="${n[l][u][0]*o-1}" y="${n[l][u][1]*o-1}" width="2" height="2"/>`;return h+="</svg>"};}})); 
  } (trace_skeleton_min));

  var trace_skeleton_minExports = trace_skeleton_min.exports;
  var tracer = /*@__PURE__*/getDefaultExportFromCjs(trace_skeleton_minExports);

  var simplify$1 = {exports: {}};

  /*
   (c) 2017, Vladimir Agafonkin
   Simplify.js, a high-performance JS polyline simplification library
   mourner.github.io/simplify-js
  */

  (function (module) {
  	(function () {
  	// to suit your point format, run search/replace for '.x' and '.y';
  	// for 3D version, see 3d branch (configurability would draw significant performance overhead)

  	// square distance between 2 points
  	function getSqDist(p1, p2) {

  	    var dx = p1.x - p2.x,
  	        dy = p1.y - p2.y;

  	    return dx * dx + dy * dy;
  	}

  	// square distance from a point to a segment
  	function getSqSegDist(p, p1, p2) {

  	    var x = p1.x,
  	        y = p1.y,
  	        dx = p2.x - x,
  	        dy = p2.y - y;

  	    if (dx !== 0 || dy !== 0) {

  	        var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

  	        if (t > 1) {
  	            x = p2.x;
  	            y = p2.y;

  	        } else if (t > 0) {
  	            x += dx * t;
  	            y += dy * t;
  	        }
  	    }

  	    dx = p.x - x;
  	    dy = p.y - y;

  	    return dx * dx + dy * dy;
  	}
  	// rest of the code doesn't care about point format

  	// basic distance-based simplification
  	function simplifyRadialDist(points, sqTolerance) {

  	    var prevPoint = points[0],
  	        newPoints = [prevPoint],
  	        point;

  	    for (var i = 1, len = points.length; i < len; i++) {
  	        point = points[i];

  	        if (getSqDist(point, prevPoint) > sqTolerance) {
  	            newPoints.push(point);
  	            prevPoint = point;
  	        }
  	    }

  	    if (prevPoint !== point) newPoints.push(point);

  	    return newPoints;
  	}

  	function simplifyDPStep(points, first, last, sqTolerance, simplified) {
  	    var maxSqDist = sqTolerance,
  	        index;

  	    for (var i = first + 1; i < last; i++) {
  	        var sqDist = getSqSegDist(points[i], points[first], points[last]);

  	        if (sqDist > maxSqDist) {
  	            index = i;
  	            maxSqDist = sqDist;
  	        }
  	    }

  	    if (maxSqDist > sqTolerance) {
  	        if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
  	        simplified.push(points[index]);
  	        if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
  	    }
  	}

  	// simplification using Ramer-Douglas-Peucker algorithm
  	function simplifyDouglasPeucker(points, sqTolerance) {
  	    var last = points.length - 1;

  	    var simplified = [points[0]];
  	    simplifyDPStep(points, 0, last, sqTolerance, simplified);
  	    simplified.push(points[last]);

  	    return simplified;
  	}

  	// both algorithms combined for awesome performance
  	function simplify(points, tolerance, highestQuality) {

  	    if (points.length <= 2) return points;

  	    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

  	    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
  	    points = simplifyDouglasPeucker(points, sqTolerance);

  	    return points;
  	}

  	// export as AMD module / Node module / browser or worker variable
  	{
  	    module.exports = simplify;
  	    module.exports.default = simplify;
  	}

  	})(); 
  } (simplify$1));

  var simplifyExports = simplify$1.exports;
  var simplify = /*@__PURE__*/getDefaultExportFromCjs(simplifyExports);

  function bfsFarthestNode(graph, start, isSubset) {
    const visited = new Set();
    const queue = [[start, null]];
    const parent = {};
    let farthest = start;

    while (queue.length) {
        const [node, from] = queue.shift();
        if (visited.has(node.id())) continue;
        visited.add(node.id());
        parent[node.id()] = from;
        farthest = node;

        let neighborEdges;
        if (isSubset) {
          neighborEdges = node.edgesWith(graph);
        } else {
          neighborEdges = node.neighborhood().edges();
        }

        for (let i = 0; i < neighborEdges.length; i++) {
          let neighborEdge = neighborEdges[i];
          let currentNeighbor;
          if (node.id() == neighborEdge.source().id()) {
            currentNeighbor = neighborEdge.target();
          } else {
            currentNeighbor = neighborEdge.source();
          }
          if (!visited.has(currentNeighbor.id())) {
            queue.push([currentNeighbor, node.id()]);
          }
        }
    }

    return { farthest, parent };
  }

  function bfsSplitGraph(graph, start, sizeRatios) {
    const visited = new Set();
    const queue = [start];
    const order = []; // Visit order
    const parent = {}; // node.id() => parent.id() or null
    parent[start.id()] = null;

    while (queue.length) {
      const node = queue.shift();
      if (visited.has(node.id())) continue;

      visited.add(node.id());
      order.push(node.id());

      let neighborEdges;
  /*     if(fullGraph){
        neighborEdges = node.connectedEdges();
      } else { */
        neighborEdges = node.edgesWith(graph);
  /*     } */
      for (const edge of neighborEdges) {
        const neighbor = (node.id() === edge.source().id()) ? edge.target() : edge.source();
        if (!visited.has(neighbor.id()) && !(neighbor.id() in parent)) {
          queue.push(neighbor);
          parent[neighbor.id()] = node.id();
        }
      }
    }

    const totalSize = order.length;
    let totalRatio = sizeRatios.reduce((a, b) => a + b, 0);
    const chunks = [];

    let startIdx = 0;
    let oldChunkSize = 0;
    let oldRatio = 0;
    let remaining = totalSize;
    for (let i = 0; i < sizeRatios.length; i++) {
      const ratio = sizeRatios[i];
      const chunkSize = Math.round((ratio / totalRatio) * remaining);
      let chunk;
      if(i == 0) {
        chunk = order.slice(startIdx, startIdx + chunkSize);     
      } else {
        if(chunkSize > oldChunkSize) {
          chunks[i-1] = chunks[i-1].concat(order.slice(startIdx, startIdx + 1));
          chunk = order.slice(startIdx, startIdx + chunkSize); 
        } else if(chunkSize == oldChunkSize) {
          if (ratio > oldRatio) {
            chunk = order.slice(startIdx - 1, startIdx + chunkSize);
          } else {
            chunks[i-1] = chunks[i-1].concat(order.slice(startIdx, startIdx + 1));
            chunk = order.slice(startIdx, startIdx + chunkSize);
          }
        } else {
          chunk = order.slice(startIdx - 1, startIdx + chunkSize);
        }
      }
      chunks.push(chunk);
      remaining -= chunkSize;
      totalRatio -= ratio;
      startIdx += chunkSize;
      oldChunkSize = chunkSize;
      oldRatio = ratio;
    }

    // In case of rounding issues, ensure all nodes are included
    if (startIdx < totalSize) {
      chunks[chunks.length - 1].push(...order.slice(startIdx));
    }

    return { chunks, parent };
  }

  function findCoverage(graph, startNode, sizeRatios, isSubset) {
    const { farthest: end1 } = bfsFarthestNode(graph, startNode, isSubset);
    const { chunks, parent } = bfsSplitGraph(graph, end1, sizeRatios);
    return { chunks, parent };
  }

  // splits the given array to chunks proportional to the given sizes in sizes array
  function splitArrayProportionally(array, sizes) {
    if (!sizes.length) return [];
    
    const totalSize = sizes.reduce((sum, size) => sum + size, 0);
    const n = array.length + sizes.length - 1;
    
    if (sizes.length > n) {
      throw new Error("More chunks requested than elements in the array.");
    }
    
    const result = [];
    let start = 0;
    
    for (let i = 0; i < sizes.length; i++) {
      let chunkSize = Math.max(1, Math.round((sizes[i] / totalSize) * n)); // Ensure at least one element per chunk
      
      if (i === sizes.length - 1) {
        chunkSize = Math.max(1, n - start); // Ensure the last chunk gets remaining elements
      }
      
      const chunk = array.slice(start, start + chunkSize);
      result.push(chunk);
      
      // Next chunk starts from the last item of this one
      start = start + chunkSize - 1;
    }
    
    return result;
  }

  // calculates the lengths of the given lines
  function calculateLineLengths(lines) {
    let sizes = [];
    lines.forEach(line => {
      let length = Math.sqrt(Math.pow(Math.abs(line.start[0] - line.end[0]), 2) + Math.pow(Math.abs(line.start[1] - line.end[1]), 2));
      sizes.push(length);
    });
    return sizes;
  }

  // find node at bottom of the graph
  function findNodeBottom (prunedGraph) {
    let nodes = prunedGraph.nodes();
    let maxYIndex = 0;
    let maxY = nodes[0].position().y; // y is index 1

    for (let i = 1; i < nodes.length; i++) {
      let y = nodes[i].position().y;
      if (y > maxY) {
        maxY = y;
        maxYIndex = i;
      }
    }
    return nodes[maxYIndex];
  }

  // rotates line array so that the line whose start point is at top (lowest y value) comes first
  function reorderLines(lines) {
    if (lines.length === 0) return lines;

    if (lines[0].start[1] > lines[lines.length - 1].end[1]) {
      lines = lines
        .map(line => ({ start: line.end, end: line.start })) // flip each line
        .reverse(); // reverse order
    }
    return lines;
  }

  // rotates line array so that the line whose start point is at top (lowest y value) comes first
  function rotateLinesClockwise(lines) {
    if (lines.length === 0) return lines;

    // find index of line whose start has the lowest y
    let minYIndex = 0;
    let minY = lines[0].start[1]; // y is index 1

    for (let i = 1; i < lines.length; i++) {
      let y = lines[i].start[1];
      if (y < minY) {
        minY = y;
        minYIndex = i;
      }
    }

    // rotate array so that line with lowest start.y comes first
    let rotated = lines.slice(minYIndex).concat(lines.slice(0, minYIndex));

    // check polygon orientation (using start points)
    let points = rotated.map(line => line.start);
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      let [x1, y1] = points[i];
      let [x2, y2] = points[(i + 1) % points.length];
      area += (x1 * y2 - x2 * y1);
    }

    // if counter-clockwise, reverse to make clockwise
    if (area < 0) {
      rotated = rotated
        .map(line => ({ start: line.end, end: line.start })) // flip each line
        .reverse(); // reverse order
    }

    return rotated;
  }

  function findLongestCycle(graph, cy, isSubset) {
    let longestCycleLength = 0;
    let longestCycle = [];
    let visited = new Set();

    function dfs(nodeId, start, path, pathSet) {
        if (pathSet.has(nodeId)) {
            let cycleStartIndex = path.indexOf(nodeId);
            let cycle = path.slice(cycleStartIndex);
            if (cycle.length > longestCycleLength) {
                longestCycleLength = cycle.length;
                longestCycle = [...cycle];
            }
            return;
        }

        if (visited.has(nodeId)) return;
        visited.add(nodeId);
        path.push(nodeId);
        pathSet.add(nodeId);
        
        let neighborEdges;
        if (isSubset) {
          neighborEdges = cy.getElementById(nodeId).edgesWith(graph);
        } else {
          neighborEdges = cy.getElementById(nodeId).neighborhood().edges();
        }

        for (let i = 0; i < neighborEdges.length; i++) {
          let neighborEdge = neighborEdges[i];
          let currentNeighbor;
          if (nodeId == neighborEdge.source().id()) {
            currentNeighbor = neighborEdge.target();
          } else {
            currentNeighbor = neighborEdge.source();
          }
          dfs(currentNeighbor.id(), start, path, pathSet);
        }

        path.pop();
        pathSet.delete(nodeId);
    }

    graph.nodes().forEach(node => {
      let nodeId = node.id();
      dfs(nodeId, nodeId, [], new Set());
    });

    // Rotate cycle so the node with lowest y (top node) is first
    if (longestCycle.length > 0) {
      let minYIndex = 0;
      let minY = cy.getElementById(longestCycle[0]).position('y');

      for (let i = 1; i < longestCycle.length; i++) {
        let y = cy.getElementById(longestCycle[i]).position('y');
        if (y < minY) {
          minY = y;
          minYIndex = i;
        }
      }

      // Rotate cycle so minY node comes first
      longestCycle = longestCycle.slice(minYIndex).concat(longestCycle.slice(0, minYIndex));

      // Check orientation using shoelace formula
      let points = longestCycle.map(id => {
        let pos = cy.getElementById(id).position();
        return [pos.x, pos.y];
      });

      let area = 0;
      for (let i = 0; i < points.length; i++) {
        let [x1, y1] = points[i];
        let [x2, y2] = points[(i + 1) % points.length];
        area += (x1 * y2 - x2 * y1);
      }

      // For screen coords (y grows downward):
      // area > 0 → CW, area < 0 → CCW
      longestCycle.push(longestCycle[0]); 
      if (area < 0) {
        longestCycle.reverse();
      }
      longestCycle.pop(longestCycle[longestCycle.length - 1]); 
    }

    return longestCycle;
  }

  async function extractLinesWithVision(imageData, connectionTolerance) {
    // reverse the coloring for skeleton generation
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // Invert each color channel
      data[i]     = 255 - data[i];     // Red
      data[i + 1] = 255 - data[i + 1]; // Green
      data[i + 2] = 255 - data[i + 2]; // Blue
    }
    // generate skeleton
    let s = tracer.fromImageData(imageData);
    let polylines = s.polylines;
    let filteredPolylines = polylines.filter(polyline => polyline.length >= 10);
    //console.log(filteredPolylines);
    tracer.visualize(s,{scale:1, strokeWidth: 6, rects: false, keypoints: false});
    //console.log(v);
    // simplify the generated lines
    let tolerance = 5; // Try 1 to 5 depending on how aggressively you want to merge
    let highQuality = true; // Set to true for highest quality simplification
    // Convert, simplify, and revert back to [x, y]
    let simplifiedPolylines = filteredPolylines.map(polyline => {
      const points = polyline.map(([x, y]) => ({ x, y }));
      const simplified = simplify(points, tolerance, highQuality);
      return simplified.map(p => [p.x, p.y]);
    });
    s.polylines = simplifiedPolylines;
    tracer.visualize(s,{scale:1, strokeWidth: 6, rects: false});
    //console.log(v2);
    //console.log(simplifiedPolylines);
    let tempLines = [];
    simplifiedPolylines.forEach(polylines => {
      polylines.forEach((polyline, i) => {
        if (i != polylines.length - 1) {
          let line = {
            "start": [polyline[0], polyline[1]],
            "end": [polylines[i+1][0], polylines[i+1][1]]
          };
          tempLines.push(line);
        }
      });
    });

    let lines = orderLines(tempLines, connectionTolerance);
    //console.log(lines);
    return lines;
  }

  function orderLines(edges, connectionTolerance = 5) {
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

    const uniquePoints = [];
    function findOrCreateNode(pt) {
      for (let i = 0; i < uniquePoints.length; i++) {
        if (dist(pt, uniquePoints[i]) <= connectionTolerance) return i;
      }
      uniquePoints.push(pt);
      return uniquePoints.length - 1;
    }

    // Build graph
    const graph = new Map();
    for (const { start, end } of edges) {
      const a = findOrCreateNode(start);
      const b = findOrCreateNode(end);
      if (a === b) continue; // skip self-loop
      if (!graph.has(a)) graph.set(a, []);
      if (!graph.has(b)) graph.set(b, []);
      graph.get(a).push(b);
      graph.get(b).push(a);
    }

    // DFS traversal
    let visited = new Set();
    let path = [];
    let foundLoop = false;

    function dfs(current, parent) {
      visited.add(current);
      path.push(current);

      for (const neighbor of graph.get(current) || []) {
        if (neighbor === parent) continue; // don't backtrack
        if (!visited.has(neighbor)) {
          dfs(neighbor, current);
          if (foundLoop) return; // early exit if loop is closed
        } else if (neighbor === path[0] && path.length > 2) {
          // loop detected
          path.push(neighbor); // close loop if needed
          foundLoop = true;
          return;
        }
      }
    }

    dfs(0, -1); // start DFS from first node
    if (!foundLoop) {
      let startNode = path[path.length - 1];
      visited = new Set();
      path = [];
      foundLoop = false;
      dfs(startNode, -1);
    }

    // Convert path from indices to coordinates
    let orderedPoints = path.map((i) => uniquePoints[i]);
    let lines = [];
    orderedPoints.forEach((point, i) => {
      if (i != orderedPoints.length - 1) {
        let line = {
          "start": [point[0], point[1]],
          "end": [orderedPoints[i+1][0], orderedPoints[i+1][1]]
        };
        lines.push(line);
      }
    });

    return lines;
  }

  let extractLines = async function (imageData, connectionTolerance) {

    let lines = await extractLinesWithVision(imageData, connectionTolerance);

    return lines;
  };

  let assignNodesToLines = function(cy, prunedGraph, lines, cycleThreshold, isSubset ){
    let lineCount = lines.length;
    let lineSizes = calculateLineLengths(lines);
    let applyIncremental = false;
    let isLoop = false;

    if (lines[0].start[0] == lines[lineCount - 1].end[0] && lines[0].start[1] == lines[lineCount - 1].end[1]) { // in case the drawing is a loop
      let graphPath = findLongestCycle(prunedGraph, cy, isSubset);
      let cycleThold = cycleThreshold ? cycleThreshold : 2 * Math.sqrt(prunedGraph.nodes().length);
      if (graphPath.length < cycleThold) {
        let { chunks: newDistribution, parent } = findCoverage(prunedGraph, prunedGraph.nodes()[0], lineSizes, isSubset);
        let lastLine = newDistribution[newDistribution.length - 1];
        lastLine.push(newDistribution[0][0]);
        lines.forEach((line, i) => {
          line.nodesAll = newDistribution[i];
          line.parent = parent;
        });
        applyIncremental = false;
        return {lines, applyIncremental}; 
      }
      isLoop = true;
      lines = rotateLinesClockwise(lines);
      lineSizes = calculateLineLengths(lines);
      let newDistribution = splitArrayProportionally(graphPath, lineSizes);
      let lastLine = newDistribution[newDistribution.length - 1];
      lastLine.push(newDistribution[0][0]);

      lines.forEach((line, i) => {
        line.nodes = newDistribution[i];
      });

    } else { // in case the drawing is a path consisting segments
      lines = reorderLines(lines);
      lineSizes = calculateLineLengths(lines);
      let nodeAtBottom = findNodeBottom(prunedGraph);
      let { chunks: newDistribution, parent } = findCoverage(prunedGraph, nodeAtBottom, lineSizes, isSubset);
      lines.forEach((line, i) => {
        line.nodesAll = newDistribution[i];
        line.parent = parent;
      });
      applyIncremental = true;
    }
    // we added nodes array to each line and now returning
    return {lines, applyIncremental, isLoop}; 
  };

  let generateConstraints = async function(cy, imageData, subset, idealEdgeLength, slopeThreshold, cycleThreshold, connectionTolerance){
    let graph = cy.elements();
    let isSubset = false;
    let fixedNodeConstraints = [];
    // if there are selected elements, apply incremental layout on selected elements
    if (subset) {
      graph = subset;
      let unselectedNodes = cy.nodes().difference(graph);
      unselectedNodes.forEach(node => {
        fixedNodeConstraints.push({nodeId: node.id(), position: {x: node.position().x, y: node.position().y}});
      });
      isSubset = true;
    }

    let pruneResult = pruneGraph(cy, graph, isSubset);
    let prunedGraph = pruneResult.prunedGraph;

    // extract lines either using vision techniques or llms
    let lines = await extractLines(imageData, connectionTolerance);

    if (lines.length > 0) {
      // lines now have assigned nodes
      let assignment = assignNodesToLines(cy, prunedGraph, lines, cycleThreshold, isSubset);

      let constraints = computeConstraints(cy, assignment.lines, assignment.isLoop, idealEdgeLength, slopeThreshold);
      constraints.fixedNodeConstraint = fixedNodeConstraints;

      return {constraints: constraints, applyIncremental: assignment.applyIncremental};
    } else {
      return {constraints: {fixedNodeConstraint: fixedNodeConstraints, relativePlacementConstraints: undefined, alignmentConstraints: undefined}, applyIncremental: false};
    }
  };

  // remove one degree nodes from graph to make it simpler
  let pruneGraph = function (cy, graph, isSubset) {
    let prunedGraph = cy.collection();
    let oneDegreeNodes = cy.collection();
    if (!isSubset){ 
      graph.nodes().forEach(node => {
        if (node.degree() == 1) {
          oneDegreeNodes.merge(node);
        }
      });
      if ((oneDegreeNodes.length == 2 && graph.nodes().length == 3) || (graph.nodes().length == 2)) {  // in case it is a 3-node or 2-node line graph
        prunedGraph = graph;
      } else {
        graph.nodes().forEach(node => {
          if (node.degree() > 1) {
            prunedGraph.merge(node);
          }
        });
      }
    } else {
      graph.nodes().forEach(node => {
        if (node.edgesWith(graph).length == 1) {
          oneDegreeNodes.merge(node);
        }
      });
      if (oneDegreeNodes.length == 2) {  // in case it is a 3-node or 2-node line graph
        prunedGraph = graph;
      } else {
        graph.nodes().forEach(node => {
          if (!oneDegreeNodes.has(node)) {
            prunedGraph.merge(node);
          }
        });
      }
    }

    let edgesBetween = prunedGraph.edgesWith(prunedGraph);
    prunedGraph.merge(edgesBetween);
    let ignoredGraph = cy.elements().difference(prunedGraph);

    return { prunedGraph, ignoredGraph };
  };

  //import { runTest } from "./test_runtime";
  let uggly = function () {

  };

  uggly.generateConstraints = function(options){
    let cy = options.cy;
    let imageData = options.imageData;
    let subset = options.subset || undefined;
    let idealEdgeLength = options.idealEdgeLength || 50;
    let slopeThreshold = options.slopeThreshold || 0.15;
    let cycleThreshold = optFn( options.cycleThreshold, cy ) || undefined;
    let connectionTolerance = options.connectionTolerance || 20;
    return generateConstraints(cy, imageData, subset, idealEdgeLength, slopeThreshold, cycleThreshold, connectionTolerance);
  };

  //uggly.runTest = runTest; // for test purposes

  // Make uggly available globally if running in browser
  if (typeof window !== 'undefined') {
    window.uggly = uggly;
  }

  const isFn = fn => typeof fn === 'function';

  const optFn = ( opt, cy ) => {
    if( isFn( opt ) ){
      return opt( cy );
    } else {
      return opt;
    }
  };

  /*!
   * uggly.js
   * License: CC0 1.0 Universal
   *
   * This project uses simplify.js, licensed under the BSD-2-Clause License:
   *
   * Copyright (c) 2017, Vladimir Agafonkin
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without modification, are
   * permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this list of
   *    conditions and the following disclaimer.
   * 
   * 2. Redistributions in binary form must reproduce the above copyright notice, this list
   *    of conditions and the following disclaimer in the documentation and/or other materials
   *    provided with the distribution.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
   * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
   * COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
   * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
   * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */

  return uggly;

}));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(141)))

/***/ }),
/* 141 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);
});