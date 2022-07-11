/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2);
var $entries = (__webpack_require__(66).entries);

// `Object.entries` method
// https://tc39.es/ecma262/#sec-object.entries
$({ target: 'Object', stat: true }, {
  entries: function entries(O) {
    return $entries(O);
  }
});


/***/ }),
/* 2 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var getOwnPropertyDescriptor = (__webpack_require__(4).f);
var createNonEnumerableProperty = __webpack_require__(41);
var defineBuiltIn = __webpack_require__(45);
var defineGlobalProperty = __webpack_require__(35);
var copyConstructorProperties = __webpack_require__(53);
var isForced = __webpack_require__(65);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),
/* 3 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es-x/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var call = __webpack_require__(7);
var propertyIsEnumerableModule = __webpack_require__(9);
var createPropertyDescriptor = __webpack_require__(10);
var toIndexedObject = __webpack_require__(11);
var toPropertyKey = __webpack_require__(16);
var hasOwn = __webpack_require__(36);
var IE8_DOM_DEFINE = __webpack_require__(39);

// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),
/* 5 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(6);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),
/* 6 */
/***/ (function(module) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),
/* 7 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(8);

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),
/* 8 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(6);

module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),
/* 10 */
/***/ (function(module) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 11 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(12);
var requireObjectCoercible = __webpack_require__(15);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),
/* 12 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var uncurryThis = __webpack_require__(13);
var fails = __webpack_require__(6);
var classof = __webpack_require__(14);

var Object = global.Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : Object(it);
} : Object;


/***/ }),
/* 13 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(8);

var FunctionPrototype = Function.prototype;
var bind = FunctionPrototype.bind;
var call = FunctionPrototype.call;
var uncurryThis = NATIVE_BIND && bind.bind(call, call);

module.exports = NATIVE_BIND ? function (fn) {
  return fn && uncurryThis(fn);
} : function (fn) {
  return fn && function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),
/* 14 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(13);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),
/* 15 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);

var TypeError = global.TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),
/* 16 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toPrimitive = __webpack_require__(17);
var isSymbol = __webpack_require__(20);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),
/* 17 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var call = __webpack_require__(7);
var isObject = __webpack_require__(18);
var isSymbol = __webpack_require__(20);
var getMethod = __webpack_require__(27);
var ordinaryToPrimitive = __webpack_require__(30);
var wellKnownSymbol = __webpack_require__(31);

var TypeError = global.TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),
/* 18 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(19);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),
/* 19 */
/***/ (function(module) {

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = function (argument) {
  return typeof argument == 'function';
};


/***/ }),
/* 20 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var getBuiltIn = __webpack_require__(21);
var isCallable = __webpack_require__(19);
var isPrototypeOf = __webpack_require__(22);
var USE_SYMBOL_AS_UID = __webpack_require__(23);

var Object = global.Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, Object(it));
};


/***/ }),
/* 21 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var isCallable = __webpack_require__(19);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),
/* 22 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(13);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),
/* 23 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es-x/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(24);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),
/* 24 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es-x/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(25);
var fails = __webpack_require__(6);

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),
/* 25 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var userAgent = __webpack_require__(26);

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),
/* 26 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(21);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),
/* 27 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var aCallable = __webpack_require__(28);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};


/***/ }),
/* 28 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var isCallable = __webpack_require__(19);
var tryToString = __webpack_require__(29);

var TypeError = global.TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),
/* 29 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);

var String = global.String;

module.exports = function (argument) {
  try {
    return String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),
/* 30 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var call = __webpack_require__(7);
var isCallable = __webpack_require__(19);
var isObject = __webpack_require__(18);

var TypeError = global.TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 31 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var shared = __webpack_require__(32);
var hasOwn = __webpack_require__(36);
var uid = __webpack_require__(38);
var NATIVE_SYMBOL = __webpack_require__(24);
var USE_SYMBOL_AS_UID = __webpack_require__(23);

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};


/***/ }),
/* 32 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var IS_PURE = __webpack_require__(33);
var store = __webpack_require__(34);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.22.7',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.22.7/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),
/* 33 */
/***/ (function(module) {

module.exports = false;


/***/ }),
/* 34 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var defineGlobalProperty = __webpack_require__(35);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),
/* 35 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);

// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),
/* 36 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(13);
var toObject = __webpack_require__(37);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es-x/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),
/* 37 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var requireObjectCoercible = __webpack_require__(15);

var Object = global.Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),
/* 38 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(13);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),
/* 39 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var fails = __webpack_require__(6);
var createElement = __webpack_require__(40);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),
/* 40 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var isObject = __webpack_require__(18);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),
/* 41 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var definePropertyModule = __webpack_require__(42);
var createPropertyDescriptor = __webpack_require__(10);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var DESCRIPTORS = __webpack_require__(5);
var IE8_DOM_DEFINE = __webpack_require__(39);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(43);
var anObject = __webpack_require__(44);
var toPropertyKey = __webpack_require__(16);

var TypeError = global.TypeError;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 43 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var fails = __webpack_require__(6);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),
/* 44 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var isObject = __webpack_require__(18);

var String = global.String;
var TypeError = global.TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw TypeError(String(argument) + ' is not an object');
};


/***/ }),
/* 45 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(19);
var createNonEnumerableProperty = __webpack_require__(41);
var makeBuiltIn = __webpack_require__(46);
var defineGlobalProperty = __webpack_require__(35);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    if (!options.unsafe) delete O[key];
    else if (O[key]) simple = true;
    if (simple) O[key] = value;
    else createNonEnumerableProperty(O, key, value);
  } return O;
};


/***/ }),
/* 46 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(6);
var isCallable = __webpack_require__(19);
var hasOwn = __webpack_require__(36);
var DESCRIPTORS = __webpack_require__(5);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(47).CONFIGURABLE);
var inspectSource = __webpack_require__(48);
var InternalStateModule = __webpack_require__(49);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (String(name).slice(0, 7) === 'Symbol(') {
    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    defineProperty(value, 'name', { value: name, configurable: true });
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),
/* 47 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var hasOwn = __webpack_require__(36);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),
/* 48 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(13);
var isCallable = __webpack_require__(19);
var store = __webpack_require__(34);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),
/* 49 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(50);
var global = __webpack_require__(3);
var uncurryThis = __webpack_require__(13);
var isObject = __webpack_require__(18);
var createNonEnumerableProperty = __webpack_require__(41);
var hasOwn = __webpack_require__(36);
var shared = __webpack_require__(34);
var sharedKey = __webpack_require__(51);
var hiddenKeys = __webpack_require__(52);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = uncurryThis(store.get);
  var wmhas = uncurryThis(store.has);
  var wmset = uncurryThis(store.set);
  set = function (it, metadata) {
    if (wmhas(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget(store, it) || {};
  };
  has = function (it) {
    return wmhas(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),
/* 50 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var isCallable = __webpack_require__(19);
var inspectSource = __webpack_require__(48);

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));


/***/ }),
/* 51 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var shared = __webpack_require__(32);
var uid = __webpack_require__(38);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),
/* 52 */
/***/ (function(module) {

module.exports = {};


/***/ }),
/* 53 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var hasOwn = __webpack_require__(36);
var ownKeys = __webpack_require__(54);
var getOwnPropertyDescriptorModule = __webpack_require__(4);
var definePropertyModule = __webpack_require__(42);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),
/* 54 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(21);
var uncurryThis = __webpack_require__(13);
var getOwnPropertyNamesModule = __webpack_require__(55);
var getOwnPropertySymbolsModule = __webpack_require__(64);
var anObject = __webpack_require__(44);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(56);
var enumBugKeys = __webpack_require__(63);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es-x/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),
/* 56 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(13);
var hasOwn = __webpack_require__(36);
var toIndexedObject = __webpack_require__(11);
var indexOf = (__webpack_require__(57).indexOf);
var hiddenKeys = __webpack_require__(52);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),
/* 57 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(11);
var toAbsoluteIndex = __webpack_require__(58);
var lengthOfArrayLike = __webpack_require__(61);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),
/* 58 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(59);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),
/* 59 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var trunc = __webpack_require__(60);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),
/* 60 */
/***/ (function(module) {

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es-x/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),
/* 61 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toLength = __webpack_require__(62);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),
/* 62 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(59);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),
/* 63 */
/***/ (function(module) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports) {

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 65 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(6);
var isCallable = __webpack_require__(19);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),
/* 66 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var uncurryThis = __webpack_require__(13);
var objectKeys = __webpack_require__(67);
var toIndexedObject = __webpack_require__(11);
var $propertyIsEnumerable = (__webpack_require__(9).f);

var propertyIsEnumerable = uncurryThis($propertyIsEnumerable);
var push = uncurryThis([].push);

// `Object.{ entries, values }` methods implementation
var createMethod = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || propertyIsEnumerable(O, key)) {
        push(result, TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

module.exports = {
  // `Object.entries` method
  // https://tc39.es/ecma262/#sec-object.entries
  entries: createMethod(true),
  // `Object.values` method
  // https://tc39.es/ecma262/#sec-object.values
  values: createMethod(false)
};


/***/ }),
/* 67 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(56);
var enumBugKeys = __webpack_require__(63);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es-x/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2);
var from = __webpack_require__(69);
var checkCorrectnessOfIteration = __webpack_require__(81);

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es-x/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),
/* 69 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(3);
var bind = __webpack_require__(70);
var call = __webpack_require__(7);
var toObject = __webpack_require__(37);
var callWithSafeIterationClosing = __webpack_require__(71);
var isArrayIteratorMethod = __webpack_require__(73);
var isConstructor = __webpack_require__(75);
var lengthOfArrayLike = __webpack_require__(61);
var createProperty = __webpack_require__(78);
var getIterator = __webpack_require__(79);
var getIteratorMethod = __webpack_require__(80);

var Array = global.Array;

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var IS_CONSTRUCTOR = isConstructor(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod && !(this == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    result = IS_CONSTRUCTOR ? new this() : [];
    for (;!(step = call(next, iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = lengthOfArrayLike(O);
    result = IS_CONSTRUCTOR ? new this(length) : Array(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};


/***/ }),
/* 70 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(13);
var aCallable = __webpack_require__(28);
var NATIVE_BIND = __webpack_require__(8);

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 71 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var anObject = __webpack_require__(44);
var iteratorClose = __webpack_require__(72);

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};


/***/ }),
/* 72 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(7);
var anObject = __webpack_require__(44);
var getMethod = __webpack_require__(27);

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};


/***/ }),
/* 73 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(31);
var Iterators = __webpack_require__(74);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),
/* 74 */
/***/ (function(module) {

module.exports = {};


/***/ }),
/* 75 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(13);
var fails = __webpack_require__(6);
var isCallable = __webpack_require__(19);
var classof = __webpack_require__(76);
var getBuiltIn = __webpack_require__(21);
var inspectSource = __webpack_require__(48);

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ }),
/* 76 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var TO_STRING_TAG_SUPPORT = __webpack_require__(77);
var isCallable = __webpack_require__(19);
var classofRaw = __webpack_require__(14);
var wellKnownSymbol = __webpack_require__(31);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var Object = global.Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),
/* 77 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(31);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),
/* 78 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toPropertyKey = __webpack_require__(16);
var definePropertyModule = __webpack_require__(42);
var createPropertyDescriptor = __webpack_require__(10);

module.exports = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),
/* 79 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var call = __webpack_require__(7);
var aCallable = __webpack_require__(28);
var anObject = __webpack_require__(44);
var tryToString = __webpack_require__(29);
var getIteratorMethod = __webpack_require__(80);

var TypeError = global.TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw TypeError(tryToString(argument) + ' is not iterable');
};


/***/ }),
/* 80 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(76);
var getMethod = __webpack_require__(27);
var Iterators = __webpack_require__(74);
var wellKnownSymbol = __webpack_require__(31);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};


/***/ }),
/* 81 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(31);

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es-x/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var charAt = (__webpack_require__(83).charAt);
var toString = __webpack_require__(84);
var InternalStateModule = __webpack_require__(49);
var defineIterator = __webpack_require__(85);

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 83 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(13);
var toIntegerOrInfinity = __webpack_require__(59);
var toString = __webpack_require__(84);
var requireObjectCoercible = __webpack_require__(15);

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),
/* 84 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var classof = __webpack_require__(76);

var String = global.String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return String(argument);
};


/***/ }),
/* 85 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var call = __webpack_require__(7);
var IS_PURE = __webpack_require__(33);
var FunctionName = __webpack_require__(47);
var isCallable = __webpack_require__(19);
var createIteratorConstructor = __webpack_require__(86);
var getPrototypeOf = __webpack_require__(91);
var setPrototypeOf = __webpack_require__(94);
var setToStringTag = __webpack_require__(93);
var createNonEnumerableProperty = __webpack_require__(41);
var defineBuiltIn = __webpack_require__(45);
var wellKnownSymbol = __webpack_require__(31);
var Iterators = __webpack_require__(74);
var IteratorsCore = __webpack_require__(87);

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  }
  Iterators[NAME] = defaultIterator;

  return methods;
};


/***/ }),
/* 86 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IteratorPrototype = (__webpack_require__(87).IteratorPrototype);
var create = __webpack_require__(88);
var createPropertyDescriptor = __webpack_require__(10);
var setToStringTag = __webpack_require__(93);
var Iterators = __webpack_require__(74);

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),
/* 87 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(6);
var isCallable = __webpack_require__(19);
var create = __webpack_require__(88);
var getPrototypeOf = __webpack_require__(91);
var defineBuiltIn = __webpack_require__(45);
var wellKnownSymbol = __webpack_require__(31);
var IS_PURE = __webpack_require__(33);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es-x/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),
/* 88 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(44);
var definePropertiesModule = __webpack_require__(89);
var enumBugKeys = __webpack_require__(63);
var hiddenKeys = __webpack_require__(52);
var html = __webpack_require__(90);
var documentCreateElement = __webpack_require__(40);
var sharedKey = __webpack_require__(51);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es-x/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(43);
var definePropertyModule = __webpack_require__(42);
var anObject = __webpack_require__(44);
var toIndexedObject = __webpack_require__(11);
var objectKeys = __webpack_require__(67);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es-x/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),
/* 90 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(21);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),
/* 91 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var hasOwn = __webpack_require__(36);
var isCallable = __webpack_require__(19);
var toObject = __webpack_require__(37);
var sharedKey = __webpack_require__(51);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(92);

var IE_PROTO = sharedKey('IE_PROTO');
var Object = global.Object;
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof Object ? ObjectPrototype : null;
};


/***/ }),
/* 92 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(6);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es-x/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),
/* 93 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var defineProperty = (__webpack_require__(42).f);
var hasOwn = __webpack_require__(36);
var wellKnownSymbol = __webpack_require__(31);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG)) {
    defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),
/* 94 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable no-proto -- safe */
var uncurryThis = __webpack_require__(13);
var anObject = __webpack_require__(44);
var aPossiblePrototype = __webpack_require__(95);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es-x/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
    setter = uncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),
/* 95 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var isCallable = __webpack_require__(19);

var String = global.String;
var TypeError = global.TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw TypeError("Can't set " + String(argument) + ' as a prototype');
};


/***/ }),
/* 96 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var global = __webpack_require__(3);
var isArray = __webpack_require__(97);
var isConstructor = __webpack_require__(75);
var isObject = __webpack_require__(18);
var toAbsoluteIndex = __webpack_require__(58);
var lengthOfArrayLike = __webpack_require__(61);
var toIndexedObject = __webpack_require__(11);
var createProperty = __webpack_require__(78);
var wellKnownSymbol = __webpack_require__(31);
var arrayMethodHasSpeciesSupport = __webpack_require__(98);
var un$Slice = __webpack_require__(99);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES = wellKnownSymbol('species');
var Array = global.Array;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = lengthOfArrayLike(O);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (isConstructor(Constructor) && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return un$Slice(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),
/* 97 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(14);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es-x/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};


/***/ }),
/* 98 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(6);
var wellKnownSymbol = __webpack_require__(31);
var V8_VERSION = __webpack_require__(25);

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),
/* 99 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(13);

module.exports = uncurryThis([].slice);


/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(77);
var defineBuiltIn = __webpack_require__(45);
var toString = __webpack_require__(101);

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  defineBuiltIn(Object.prototype, 'toString', toString, { unsafe: true });
}


/***/ }),
/* 101 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(77);
var classof = __webpack_require__(76);

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var DOMIterables = __webpack_require__(103);
var DOMTokenListPrototype = __webpack_require__(104);
var forEach = __webpack_require__(105);
var createNonEnumerableProperty = __webpack_require__(41);

var handlePrototype = function (CollectionPrototype) {
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  if (DOMIterables[COLLECTION_NAME]) {
    handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype);
  }
}

handlePrototype(DOMTokenListPrototype);


/***/ }),
/* 103 */
/***/ (function(module) {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),
/* 104 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = __webpack_require__(40);

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

module.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;


/***/ }),
/* 105 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $forEach = (__webpack_require__(106).forEach);
var arrayMethodIsStrict = __webpack_require__(109);

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es-x/no-array-prototype-foreach -- safe
} : [].forEach;


/***/ }),
/* 106 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var bind = __webpack_require__(70);
var uncurryThis = __webpack_require__(13);
var IndexedObject = __webpack_require__(12);
var toObject = __webpack_require__(37);
var lengthOfArrayLike = __webpack_require__(61);
var arraySpeciesCreate = __webpack_require__(107);

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};


/***/ }),
/* 107 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var arraySpeciesConstructor = __webpack_require__(108);

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};


/***/ }),
/* 108 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var isArray = __webpack_require__(97);
var isConstructor = __webpack_require__(75);
var isObject = __webpack_require__(18);
var wellKnownSymbol = __webpack_require__(31);

var SPECIES = wellKnownSymbol('species');
var Array = global.Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 109 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(6);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


/***/ }),
/* 110 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(5);
var FUNCTION_NAME_EXISTS = (__webpack_require__(47).EXISTS);
var uncurryThis = __webpack_require__(13);
var defineProperty = (__webpack_require__(42).f);

var FunctionPrototype = Function.prototype;
var functionToString = uncurryThis(FunctionPrototype.toString);
var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
var regExpExec = uncurryThis(nameRE.exec);
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return regExpExec(nameRE, functionToString(this))[1];
      } catch (error) {
        return '';
      }
    }
  });
}


/***/ }),
/* 111 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var exec = __webpack_require__(112);

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ }),
/* 112 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var call = __webpack_require__(7);
var uncurryThis = __webpack_require__(13);
var toString = __webpack_require__(84);
var regexpFlags = __webpack_require__(113);
var stickyHelpers = __webpack_require__(114);
var shared = __webpack_require__(32);
var create = __webpack_require__(88);
var getInternalState = (__webpack_require__(49).get);
var UNSUPPORTED_DOT_ALL = __webpack_require__(115);
var UNSUPPORTED_NCG = __webpack_require__(116);

var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt = uncurryThis(''.charAt);
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  call(nativeExec, re1, 'a');
  call(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

if (PATCH) {
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = call(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = call(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = replace(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }

      strCopy = stringSlice(str, re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = call(nativeExec, sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = stringSlice(match.input, charsAdded);
        match[0] = stringSlice(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      call(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = create(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),
/* 113 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(44);

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),
/* 114 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(6);
var global = __webpack_require__(3);

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = global.RegExp;

var UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

// UC Browser bug
// https://github.com/zloirock/core-js/issues/1008
var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
  return !$RegExp('a', 'y').sticky;
});

var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

module.exports = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY,
  UNSUPPORTED_Y: UNSUPPORTED_Y
};


/***/ }),
/* 115 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(6);
var global = __webpack_require__(3);

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('.', 's');
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});


/***/ }),
/* 116 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(6);
var global = __webpack_require__(3);

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});


/***/ }),
/* 117 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__(118);
__webpack_require__(125);
__webpack_require__(127);
__webpack_require__(128);
__webpack_require__(130);


/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var global = __webpack_require__(3);
var call = __webpack_require__(7);
var uncurryThis = __webpack_require__(13);
var IS_PURE = __webpack_require__(33);
var DESCRIPTORS = __webpack_require__(5);
var NATIVE_SYMBOL = __webpack_require__(24);
var fails = __webpack_require__(6);
var hasOwn = __webpack_require__(36);
var isPrototypeOf = __webpack_require__(22);
var anObject = __webpack_require__(44);
var toIndexedObject = __webpack_require__(11);
var toPropertyKey = __webpack_require__(16);
var $toString = __webpack_require__(84);
var createPropertyDescriptor = __webpack_require__(10);
var nativeObjectCreate = __webpack_require__(88);
var objectKeys = __webpack_require__(67);
var getOwnPropertyNamesModule = __webpack_require__(55);
var getOwnPropertyNamesExternal = __webpack_require__(119);
var getOwnPropertySymbolsModule = __webpack_require__(64);
var getOwnPropertyDescriptorModule = __webpack_require__(4);
var definePropertyModule = __webpack_require__(42);
var definePropertiesModule = __webpack_require__(89);
var propertyIsEnumerableModule = __webpack_require__(9);
var defineBuiltIn = __webpack_require__(45);
var shared = __webpack_require__(32);
var sharedKey = __webpack_require__(51);
var hiddenKeys = __webpack_require__(52);
var uid = __webpack_require__(38);
var wellKnownSymbol = __webpack_require__(31);
var wrappedWellKnownSymbolModule = __webpack_require__(121);
var defineWellKnownSymbol = __webpack_require__(122);
var defineSymbolToPrimitive = __webpack_require__(124);
var setToStringTag = __webpack_require__(93);
var InternalStateModule = __webpack_require__(49);
var $forEach = (__webpack_require__(106).forEach);

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';

var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);

var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
var TypeError = global.TypeError;
var QObject = global.QObject;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var push = uncurryThis([].push);

var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var WellKnownSymbolsStore = shared('wks');

// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPropertyKey(P);
  anObject(Attributes);
  if (hasOwn(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!hasOwn(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (hasOwn(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || call($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPropertyKey(V);
  var enumerable = call(nativePropertyIsEnumerable, this, P);
  if (this === ObjectPrototype && hasOwn(AllSymbols, P) && !hasOwn(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !hasOwn(this, P) || !hasOwn(AllSymbols, P) || hasOwn(this, HIDDEN) && this[HIDDEN][P]
    ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype && hasOwn(AllSymbols, key) && !hasOwn(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && hasOwn(AllSymbols, key) && !(hasOwn(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!hasOwn(AllSymbols, key) && !hasOwn(hiddenKeys, key)) push(result, key);
  });
  return result;
};

var $getOwnPropertySymbols = function (O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (hasOwn(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn(ObjectPrototype, key))) {
      push(result, AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (isPrototypeOf(SymbolPrototype, this)) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) call(setter, ObjectPrototypeSymbols, value);
      if (hasOwn(this, HIDDEN) && hasOwn(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  SymbolPrototype = $Symbol[PROTOTYPE];

  defineBuiltIn(SymbolPrototype, 'toString', function toString() {
    return getInternalState(this).tag;
  });

  defineBuiltIn($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  definePropertiesModule.f = $defineProperties;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty(SymbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      defineBuiltIn(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, constructor: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
defineSymbolToPrimitive();

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;


/***/ }),
/* 119 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es-x/no-object-getownpropertynames -- safe */
var classof = __webpack_require__(14);
var toIndexedObject = __webpack_require__(11);
var $getOwnPropertyNames = (__webpack_require__(55).f);
var arraySlice = __webpack_require__(120);

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return arraySlice(windowNames);
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && classof(it) == 'Window'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};


/***/ }),
/* 120 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var toAbsoluteIndex = __webpack_require__(58);
var lengthOfArrayLike = __webpack_require__(61);
var createProperty = __webpack_require__(78);

var Array = global.Array;
var max = Math.max;

module.exports = function (O, start, end) {
  var length = lengthOfArrayLike(O);
  var k = toAbsoluteIndex(start, length);
  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
  var result = Array(max(fin - k, 0));
  for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
  result.length = n;
  return result;
};


/***/ }),
/* 121 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(31);

exports.f = wellKnownSymbol;


/***/ }),
/* 122 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var path = __webpack_require__(123);
var hasOwn = __webpack_require__(36);
var wrappedWellKnownSymbolModule = __webpack_require__(121);
var defineProperty = (__webpack_require__(42).f);

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!hasOwn(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};


/***/ }),
/* 123 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);

module.exports = global;


/***/ }),
/* 124 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(7);
var getBuiltIn = __webpack_require__(21);
var wellKnownSymbol = __webpack_require__(31);
var defineBuiltIn = __webpack_require__(45);

module.exports = function () {
  var Symbol = getBuiltIn('Symbol');
  var SymbolPrototype = Symbol && Symbol.prototype;
  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    // eslint-disable-next-line no-unused-vars -- required for .length
    defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function (hint) {
      return call(valueOf, this);
    }, { arity: 1 });
  }
};


/***/ }),
/* 125 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2);
var getBuiltIn = __webpack_require__(21);
var hasOwn = __webpack_require__(36);
var toString = __webpack_require__(84);
var shared = __webpack_require__(32);
var NATIVE_SYMBOL_REGISTRY = __webpack_require__(126);

var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.for` method
// https://tc39.es/ecma262/#sec-symbol.for
$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  'for': function (key) {
    var string = toString(key);
    if (hasOwn(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = getBuiltIn('Symbol')(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  }
});


/***/ }),
/* 126 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_SYMBOL = __webpack_require__(24);

/* eslint-disable es-x/no-symbol -- safe */
module.exports = NATIVE_SYMBOL && !!Symbol['for'] && !!Symbol.keyFor;


/***/ }),
/* 127 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2);
var hasOwn = __webpack_require__(36);
var isSymbol = __webpack_require__(20);
var tryToString = __webpack_require__(29);
var shared = __webpack_require__(32);
var NATIVE_SYMBOL_REGISTRY = __webpack_require__(126);

var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.keyFor` method
// https://tc39.es/ecma262/#sec-symbol.keyfor
$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(tryToString(sym) + ' is not a symbol');
    if (hasOwn(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  }
});


/***/ }),
/* 128 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2);
var getBuiltIn = __webpack_require__(21);
var apply = __webpack_require__(129);
var call = __webpack_require__(7);
var uncurryThis = __webpack_require__(13);
var fails = __webpack_require__(6);
var isArray = __webpack_require__(97);
var isCallable = __webpack_require__(19);
var isObject = __webpack_require__(18);
var isSymbol = __webpack_require__(20);
var arraySlice = __webpack_require__(99);
var NATIVE_SYMBOL = __webpack_require__(24);

var $stringify = getBuiltIn('JSON', 'stringify');
var exec = uncurryThis(/./.exec);
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var replace = uncurryThis(''.replace);
var numberToString = uncurryThis(1.0.toString);

var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function () {
  var symbol = getBuiltIn('Symbol')();
  // MS Edge converts symbol values to JSON as {}
  return $stringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || $stringify({ a: symbol }) != '{}'
    // V8 throws on boxed symbols
    || $stringify(Object(symbol)) != '{}';
});

// https://github.com/tc39/proposal-well-formed-stringify
var ILL_FORMED_UNICODE = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

var stringifyWithSymbolsFix = function (it, replacer) {
  var args = arraySlice(arguments);
  var $replacer = replacer;
  if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
  if (!isArray(replacer)) replacer = function (key, value) {
    if (isCallable($replacer)) value = call($replacer, this, key, value);
    if (!isSymbol(value)) return value;
  };
  args[1] = replacer;
  return apply($stringify, null, args);
};

var fixIllFormed = function (match, offset, string) {
  var prev = charAt(string, offset - 1);
  var next = charAt(string, offset + 1);
  if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
    return '\\u' + numberToString(charCodeAt(match, 0), 16);
  } return match;
};

if ($stringify) {
  // `JSON.stringify` method
  // https://tc39.es/ecma262/#sec-json.stringify
  $({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice(arguments);
      var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
    }
  });
}


/***/ }),
/* 129 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(8);

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es-x/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),
/* 130 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2);
var NATIVE_SYMBOL = __webpack_require__(24);
var fails = __webpack_require__(6);
var getOwnPropertySymbolsModule = __webpack_require__(64);
var toObject = __webpack_require__(37);

// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FORCED = !NATIVE_SYMBOL || fails(function () { getOwnPropertySymbolsModule.f(1); });

// `Object.getOwnPropertySymbols` method
// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
$({ target: 'Object', stat: true, forced: FORCED }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    var $getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
  }
});


/***/ }),
/* 131 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";
// `Symbol.prototype.description` getter
// https://tc39.es/ecma262/#sec-symbol.prototype.description

var $ = __webpack_require__(2);
var DESCRIPTORS = __webpack_require__(5);
var global = __webpack_require__(3);
var uncurryThis = __webpack_require__(13);
var hasOwn = __webpack_require__(36);
var isCallable = __webpack_require__(19);
var isPrototypeOf = __webpack_require__(22);
var toString = __webpack_require__(84);
var defineProperty = (__webpack_require__(42).f);
var copyConstructorProperties = __webpack_require__(53);

var NativeSymbol = global.Symbol;
var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

if (DESCRIPTORS && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString(arguments[0]);
    var result = isPrototypeOf(SymbolPrototype, this)
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };

  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  SymbolWrapper.prototype = SymbolPrototype;
  SymbolPrototype.constructor = SymbolWrapper;

  var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
  var symbolToString = uncurryThis(SymbolPrototype.toString);
  var symbolValueOf = uncurryThis(SymbolPrototype.valueOf);
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  var replace = uncurryThis(''.replace);
  var stringSlice = uncurryThis(''.slice);

  defineProperty(SymbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = symbolValueOf(this);
      var string = symbolToString(symbol);
      if (hasOwn(EmptyStringDescriptionStore, symbol)) return '';
      var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace(string, regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, constructor: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}


/***/ }),
/* 132 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(122);

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/ }),
/* 133 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(11);
var addToUnscopables = __webpack_require__(134);
var Iterators = __webpack_require__(74);
var InternalStateModule = __webpack_require__(49);
var defineProperty = (__webpack_require__(42).f);
var defineIterator = __webpack_require__(85);
var IS_PURE = __webpack_require__(33);
var DESCRIPTORS = __webpack_require__(5);

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', { value: 'values' });
} catch (error) { /* empty */ }


/***/ }),
/* 134 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(31);
var create = __webpack_require__(88);
var defineProperty = (__webpack_require__(42).f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),
/* 135 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(3);
var DOMIterables = __webpack_require__(103);
var DOMTokenListPrototype = __webpack_require__(104);
var ArrayIteratorMethods = __webpack_require__(133);
var createNonEnumerableProperty = __webpack_require__(41);
var wellKnownSymbol = __webpack_require__(31);

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype, COLLECTION_NAME);
}

handlePrototype(DOMTokenListPrototype, 'DOMTokenList');


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_object_entries_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var core_js_modules_es_object_entries_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_entries_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(68);
/* harmony import */ var core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(82);
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(96);
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(100);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(102);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(110);
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(111);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(117);
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(131);
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(132);
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(133);
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(135);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_12__);
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }














var charsArr = Object.entries({
  "ackbar": "./img/cards/ackbar.png",
  "amidala": "./img/cards/amidala.png",
  "bb8": "./img/cards/bb8.png",
  "ben_kenobi": "./img/cards/ben_kenobi.png",
  "ben_solo": "./img/cards/ben_solo.png",
  "binks": "./img/cards/binks.png",
  "boba_fett": "./img/cards/boba_fett.png",
  "c3po": "./img/cards/c3po.png",
  "chewbacca": "./img/cards/chewbacca.png",
  "darth_maul_alt": "./img/cards/darth_maul_alt.png",
  "darth_maul": "./img/cards/darth_maul.png",
  "droid": "./img/cards/droid.png",
  "grievous": "./img/cards/grievous.png",
  "gunray": "./img/cards/gunray.png",
  "jabba": "./img/cards/jabba.png",
  "jango": "./img/cards/jango.png",
  "kylo": "./img/cards/kylo.png",
  "lando": "./img/cards/lando.png",
  "leia": "./img/cards/leia.png",
  "mandalorian": "./img/cards/mandalorian.png",
  "nunb": "./img/cards/nunb.png",
  "obiwan_kenobi": "./img/cards/obiwan_kenobi.png",
  "old_luke": "./img/cards/old_luke.png",
  "palpatine": "./img/cards/palpatine.png",
  "phasma": "./img/cards/phasma.png",
  "pilot": "./img/cards/pilot.png",
  "quigon_jinn": "./img/cards/quigon_jinn.png",
  "r2d2": "./img/cards/r2d2.png",
  "rey": "./img/cards/rey.png",
  "rune": "./img/cards/rune.png",
  "scout": "./img/cards/scout.png",
  "sidious": "./img/cards/sidious.png",
  "solo": "./img/cards/solo.png",
  "stormtrooper": "./img/cards/stormtrooper.png",
  "trooper": "./img/cards/trooper.png",
  "tusken_raider": "./img/cards/tusken_raider.png",
  "vader": "./img/cards/vader.png",
  "war_padme": "./img/cards/war_padme.png",
  "warrick": "./img/cards/warrick.png",
  "watto": "./img/cards/watto.png",
  "windu": "./img/cards/windu.png",
  "yoda": "./img/cards/yoda.png",
  "young_anakin": "./img/cards/young_anakin.png",
  "young_luke": "./img/cards/young_luke.png"
});

var Game = /*#__PURE__*/function () {
  function Game(content, cardsPerGame, cardsPerLevel) {
    var _this = this;

    _classCallCheck(this, Game);

    this.content = content;
    this.cardsPerGame = cardsPerGame;
    this.cardsPerLevel = cardsPerLevel;
    this.audioController = new AudioController();
    this.introState = new IntroState(this);
    this.playState = new PlayState(this);
    this.endGame = new EndGame(this);
    this.intro = document.querySelector(".intro");
    this.game = document.querySelector(".game");
    this.messages = document.querySelector(".messages-container");
    this.counters = {
      timer: document.querySelector("[data-counter=\"timer\"]"),
      bonus: document.querySelector("[data-counter=\"bonus\"]"),
      cardsInDeck: document.querySelector("[data-counter=\"cards\"]"),
      lives: document.querySelector("[data-counter=\"lives\"]")
    };
    this.skyboxGame = this.game.querySelector(".skybox");
    this.timings = {
      toFlipCard: 400,
      toFadeCard: 500,
      toShowGameField: 1000,
      toFadeGameField: 1400,
      toShowCard: 100,
      toCheckMatch: 700
    };
    this.isLocked = true;
    this.cards = [];
    this.cachedCards = [];
    this.timer = null;
    this.timePoints = 30; //30

    this.additionalTime = 25;
    this.initialTime = this.timePoints;
    this.checkpointTime = this.initialTime;
    this.lives = 2;
    this.initialLives = this.lives;
    this.scrollBarObserver = new ResizeObserver(function (rec) {
      return _this._checkScrollVisibility(false, rec);
    });
  }

  _createClass(Game, [{
    key: "start",
    value: function start() {
      var _this2 = this;

      this._preloadCards();

      this.playState.observer.observe(this.game, {
        attributes: true,
        attributeFilter: ["data-is-active", "data-unmatched-cards", "data-time-left"]
      });
      this.endGame.observer.observe(this.messages, {
        attributes: true,
        attributeFilter: ["data-is-active", "data-game-result"]
      });
      this.scrollBarObserver.observe(document.body);
      this.updateGameValue("lives");
      this.counters.bonus.textContent = this.additionalTime;

      this._generateStars(100, this.intro);

      this._generateStars(100, this.game);

      window.onload = function (e) {
        _this2.isLocked = false;

        _this2.introState.removeLoader();
      };

      document.documentElement.ondragstart = function () {
        return false;
      };

      document.documentElement.onselectstart = function () {
        return false;
      };

      document.documentElement.addEventListener("dblclick", toggleFullScreen);
      this.intro.addEventListener("pointerup", function (e) {
        return _this2.introState.start(e);
      }, {
        passive: true
      });
      this.game.addEventListener("pointerup", function (e) {
        return _this2.playState.flipCard(e);
      }, {
        passive: true
      });
      this.messages.addEventListener("pointerup", function (e) {
        return _this2.endGame.action(e);
      }, {
        passive: true
      });
    }
  }, {
    key: "toOriginalCondition",
    value: function toOriginalCondition(elem) {
      var css = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (css) elem.setAttribute("class", elem.dataset.originalClass);
      if (style) elem.removeAttribute("style");
    }
  }, {
    key: "updateGameValue",
    value: function updateGameValue(type) {
      var _this3 = this;

      var modify = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      switch (true) {
        case type === "timer":
          if (modify) {
            this.timePoints += this.additionalTime;
            this.checkpointTime = this.timePoints;
            this.counters.timer.nextElementSibling.classList.add("multiplier--animate");
            setTimeout(function () {
              _this3.counters.timer.nextElementSibling.classList.remove("multiplier--animate");
            }, 1000);
          }

          this.counters.timer.textContent = this.timePoints;
          this.game.dataset.timeLeft = this.timePoints;
          break;

        case type === "cards":
          var result = this.cards.length * 2;
          this.counters.cardsInDeck.textContent = result;
          break;

        case type === "lives":
          this.counters.lives.textContent = this.lives;
          this.messages.dataset.lives = this.lives;
          break;
      }
    }
  }, {
    key: "startTimer",
    value: function startTimer() {
      var _this4 = this;

      this.updateGameValue("timer");
      return setInterval(function () {
        _this4.timePoints--;

        _this4.updateGameValue("timer");

        if (_this4.timePoints === 0) clearInterval(_this4.timer);
      }, 1000);
    }
  }, {
    key: "clearPlayableField",
    value: function clearPlayableField() {
      this.playState.isCheckpoint = false;

      for (var _i = 0, _Array$from = Array.from(this.playState.playableField.children); _i < _Array$from.length; _i++) {
        var card = _Array$from[_i];
        card.remove();
      }
    }
  }, {
    key: "_preloadCards",
    value: function _preloadCards() {
      var _iterator = _createForOfIteratorHelper(this.content),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var char = _step.value;
          var backface = document.createElement("img");
          backface.src = "./img/cards/card_back.png";
          var imgPreload = document.createElement("img");
          imgPreload.src = char[1];
          var cardBody = createCard(char, "card");
          var cardBack = createCard(char, "card__back", cardBody, backface);
          var cardFace = createCard(char, "card__face", cardBody, imgPreload);
          this.cachedCards.push(cardBody);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.updateCardsDeck();

      function createCard(char, CSSclass) {
        var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var newDIV = document.createElement("div");
        newDIV.classList.add(CSSclass);

        if (!body) {
          newDIV.dataset.side = "back";
          newDIV.dataset.char = char[0];
        } else {
          newDIV.appendChild(arguments.length <= 3 ? undefined : arguments[3]);
          body.appendChild(newDIV);
        }

        return newDIV;
      }
    }
  }, {
    key: "updateCardsDeck",
    value: function updateCardsDeck() {
      this.shuffle(this.cachedCards);
      this.cards = this.cachedCards.slice(0, this.cardsPerGame);
    }
  }, {
    key: "_generateStars",
    value: function _generateStars(amount, target) {
      var skybox = target.querySelector(".skybox");
      resizeSkybox();

      for (var i = 0; i < amount; i++) {
        var star = document.createElement("div");
        star.classList.add("skybox__star");
        star.style.opacity = Math.random();
        skybox.appendChild(star);
        star.style.top = this.getRandomInt(0, 100) + "%";
        star.style.left = this.getRandomInt(0, 100) + "%";
      }

      var throttle = false;
      var resizeObserver = new ResizeObserver(function (rec) {
        if (throttle) {
          clearTimeout(throttle);
          throttle = false;
        }

        throttle = setTimeout(function () {
          resizeSkybox();
        }, 100);
      });
      resizeObserver.observe(document.documentElement);

      function resizeSkybox() {
        skybox.style.width = document.documentElement.clientWidth + "px";
        skybox.style.height = document.documentElement.clientHeight + "px";
      }
    }
  }, {
    key: "shuffle",
    value: function shuffle(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var _ref = [array[j], array[i]];
        array[i] = _ref[0];
        array[j] = _ref[1];
      }
    }
  }, {
    key: "getRandomInt",
    value: function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
  }, {
    key: "_checkScrollVisibility",
    value: function _checkScrollVisibility(throttle, rec) {
      var _this5 = this;

      // let scrollerWidth = document.body.offsetWidth - document.body.clientWidth;
      // document.querySelector(".scroll-bar-hidder").style.width = scrollerWidth + "px";
      // this.playState.playableField.style.transform = "translateX(" + (scrollerWidth / 2) + "px)";
      if (throttle) {
        clearTimeout(throttle);
        throttle = false;
      }

      throttle = setTimeout(function () {
        var scrollerWidth = document.body.offsetWidth - document.body.clientWidth;
        document.querySelector(".scroll-bar-hidder").style.width = scrollerWidth + "px";
        _this5.playState.playableField.style.transform = "translateX(" + scrollerWidth / 2 + "px)";
      }, 100);
    }
  }]);

  return Game;
}();

var AudioController = /*#__PURE__*/function () {
  function AudioController() {
    _classCallCheck(this, AudioController);

    this.intro = new Audio("data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
    this.game = new Audio("data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
    this.lose = new Audio("data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
    this.win = new Audio("data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
    this.introSRC = "./sound/star-wars-main-theme-song.mp3";
    this.gameSRC = "./sound/duel-of-the-fates.mp3";
    this.loseSRC = "./sound/darth-vader-breathing-alt.mp3";
    this.winSRC = "./sound/the-throne-room.mp3";
    this.intro.autoplay = true;
    this.game.autoplay = true;
    this.lose.autoplay = true;
    this.win.autoplay = true;
    this.click = [1, //iterator
    new Audio("./sound/ls-on-1.mp3"), new Audio("./sound/ls-on-2.mp3"), new Audio("./sound/ls-on-3.mp3")];
    this.matched = [1, //iterator
    new Audio("./sound/hit-1.mp3"), new Audio("./sound/hit-2.mp3"), new Audio("./sound/hit-3.mp3")];
    this.unmatched = [1, //iterator
    new Audio("./sound/mis-1.mp3"), new Audio("./sound/mis-2.mp3")];

    for (var _i2 = 0, _arr = [this.click, this.matched, this.unmatched]; _i2 < _arr.length; _i2++) {
      var item = _arr[_i2];

      var _iterator2 = _createForOfIteratorHelper(item),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var sound = _step2.value;
          if (item.indexOf(sound) === 0) continue;
          sound.volume = 0.3;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    } // fix default prevention of autoplay


    var thisController = this;

    this._fixAutoplay = function () {
      thisController.intro.play();
      thisController.game.play();
      thisController.lose.play();
      thisController.win.play();
      setTimeout(function () {
        document.documentElement.removeEventListener("pointerup", thisController._fixAutoplay);
      }, 0);
    };

    document.documentElement.addEventListener("pointerup", thisController._fixAutoplay);
  }

  _createClass(AudioController, [{
    key: "play",
    value: function play(sfx) {
      if (Array.isArray(sfx)) {
        sfx[0]++;
        if (sfx[0] === sfx.length) sfx[0] = 1;
        sfx = sfx[sfx[0]];
      }

      switch (true) {
        case sfx === this.intro:
          sfx.src = this.introSRC;
          break;

        case sfx === this.game:
          sfx.src = this.gameSRC;
          sfx.loop = true;
          break;

        case sfx === this.lose:
          sfx.src = this.loseSRC;
          sfx.loop = true;
          break;

        case sfx === this.win:
          sfx.src = this.winSRC;
          sfx.loop = true;
          break;
      }

      sfx.play();
    }
  }, {
    key: "stop",
    value: function stop(sfx, type) {
      switch (true) {
        case type === "hard":
          fullStop(sfx);
          break;

        case type === "soft":
          var initialVolume = sfx.volume;
          var currentVolume = initialVolume;
          var interval = null;
          interval = setInterval(function () {
            currentVolume -= 0.1;

            if (currentVolume < 0) {
              sfx.volume = initialVolume;
              fullStop(sfx);
              clearInterval(interval);
            }

            if (currentVolume > 0) sfx.volume = currentVolume;
          }, arguments.length <= 2 ? undefined : arguments[2]);
          break;
      }

      function fullStop(sfx) {
        sfx.pause();
        sfx.currentTime = 0;
      }
    }
  }]);

  return AudioController;
}();

var IntroState = /*#__PURE__*/function () {
  function IntroState(parent) {
    _classCallCheck(this, IntroState);

    this.parent = parent;
    this.skipButton = document.querySelector(".intro__skip");
    this.firstScreen = document.querySelector(".intro__first-screen");
    this.logoScreen = document.querySelector(".intro__logo");
    this.scrollerScreen = document.querySelector(".intro__scroller");
    this.logoState = false;
    this.scrollerState = false;
    this.gameState = false;
    this.skipButtonIsActive = false;
  }

  _createClass(IntroState, [{
    key: "start",
    value: function start(e) {
      var _this6 = this;

      if (this.parent.isLocked) return;
      if (!e.target.closest(".intro__first-screen")) return;
      this.parent.isLocked = true;
      this.skipButtonIsActive = true;

      this.skipButton.onpointerup = function (e) {
        return _this6._skip(e);
      };

      this.skipButton.classList.add("intro__skip--show");
      this.firstScreen.classList.add("intro__first-screen--hide");
      this.firstScreen.lastElementChild.style.opacity = "0";
      this.logoState = this._iniciateLogoScreen(5000);
      this.scrollerState = this._iniciateScrollerScreen(10000);
      this.gameState = this._iniciateGameScreen(35000);
    }
  }, {
    key: "removeLoader",
    value: function removeLoader() {
      this.firstScreen.lastElementChild.children[0].classList.remove("loader--enabled");
      this.firstScreen.lastElementChild.children[1].classList.add("click--enabled");
      this.firstScreen.lastElementChild.children[2].classList.add("touch--enabled");
    }
  }, {
    key: "_skip",
    value: function _skip(e) {
      if (!this.skipButtonIsActive) return;
      if (!e.target.closest(".intro__skip")) return;
      this.skipButtonIsActive = false;
      if (this.logoState) clearTimeout(this.logoState);
      if (this.scrollerState) clearTimeout(this.scrollerState);
      if (this.gameState) clearTimeout(this.gameState);

      this._iniciateGameScreen(0);
    }
  }, {
    key: "_iniciateLogoScreen",
    value: function _iniciateLogoScreen(delay) {
      var _this7 = this;

      return setTimeout(function () {
        _this7.firstScreen.style.display = "none";

        _this7.logoScreen.classList.add("intro__logo--animate");

        _this7.parent.audioController.play(_this7.parent.audioController.intro);
      }, delay);
    }
  }, {
    key: "_iniciateScrollerScreen",
    value: function _iniciateScrollerScreen(delay) {
      var _this8 = this;

      return setTimeout(function () {
        _this8.logoScreen.classList.remove("intro__logo--animate");

        _this8.logoScreen.style.display = "none";
        _this8.scrollerScreen.style.display = "block";
      }, delay);
    }
  }, {
    key: "_iniciateGameScreen",
    value: function _iniciateGameScreen(delay) {
      var _this9 = this;

      return setTimeout(function () {
        _this9.parent.intro.classList.add("intro--hide");

        _this9.skipButton.classList.remove("intro__skip--show");

        _this9.skipButton.classList.add("intro__skip--hide");

        _this9.parent.audioController.stop(_this9.parent.audioController.intro, "soft", 500);

        setTimeout(function () {
          //document.documentElement.style.overflowY = "auto";
          //document.body.style.overflowY = "auto";
          setTimeout(function () {
            _this9.parent.toOriginalCondition(_this9.skipButton);

            _this9.parent.toOriginalCondition(_this9.parent.intro);

            _this9.parent.toOriginalCondition(_this9.firstScreen, true, true);

            _this9.parent.toOriginalCondition(_this9.firstScreen.lastElementChild, false, true);

            _this9.parent.toOriginalCondition(_this9.logoScreen, true, true);

            _this9.parent.toOriginalCondition(_this9.scrollerScreen, false, true);

            _this9.parent.intro.style.display = "none";
            _this9.parent.game.dataset.isActive = "true";
          }, 1000);
        }, 5000);
      }, delay);
    }
  }]);

  return IntroState;
}();

var PlayState = /*#__PURE__*/function () {
  function PlayState(parent) {
    var _this10 = this;

    _classCallCheck(this, PlayState);

    this.parent = parent;
    this.statsField = document.querySelector(".game__stats");
    this.playableField = document.querySelector(".game__mainfield");
    this.pointers = document.querySelectorAll(".game__pointer");
    this.lockScreen = document.querySelector(".lock");
    this.observer = new MutationObserver(function (rec) {
      return _this10._playStateChanges(rec);
    });
    this.pointersObserver = new IntersectionObserver(function (rec) {
      return _this10._pointersVisibility(rec);
    }, {
      rootMargin: "-65px 0px -10px 0px",
      threshold: 0
    });
    this.uniqCardsPerLevel = this.parent.cardsPerLevel;
    this.isCheckpoint = false;
    this.endGameInitiated = false;
    this.pickedCard = null;
    this.hand = [];
    this.eventThrottle = false;
    this.playableField.addEventListener("pointerover", this._hoverCard.bind(this));
    this.playableField.addEventListener("pointermove", this._hoverCard.bind(this));
    this.playableField.addEventListener("pointerout", this._hoverCard.bind(this));
  }

  _createClass(PlayState, [{
    key: "_hoverCard",
    value: function _hoverCard(e) {
      var _this11 = this;

      if (this.parent.isLocked) return;
      if (this.eventThrottle && e.type === "pointermove") return;
      if (!e.target.parentElement.classList.contains("card__back")) return;

      switch (true) {
        case e.type === "pointerover":
          e.target.closest(".card").classList.add("card--hovered");
          break;

        case e.type === "pointermove":
          e.target.closest(".card").classList.add("card--hovered");
          this.eventThrottle = true;
          setTimeout(function () {
            return _this11.eventThrottle = false;
          }, 1000);
          break;

        case e.type === "pointerout":
          e.target.closest(".card").classList.remove("card--hovered");
          break;
      }
    }
  }, {
    key: "_pointersVisibility",
    value: function _pointersVisibility(rec) {
      var _this12 = this;

      rec.forEach(function (item) {
        var index = Array.from(_this12.playableField.children).indexOf(item.target);

        if (index === 0) {
          _this12.pointers[0].style.top = _this12.statsField.offsetHeight + "px";
          if (!item.isIntersecting) _this12.pointers[0].classList.add("game__pointer--active");
          if (item.isIntersecting) _this12.pointers[0].classList.remove("game__pointer--active");
        }

        if (index > 0) {
          if (!item.isIntersecting) _this12.pointers[1].classList.add("game__pointer--active");
          if (item.isIntersecting) _this12.pointers[1].classList.remove("game__pointer--active");
        }
      });
    }
  }, {
    key: "_hidePointers",
    value: function _hidePointers() {
      this.pointersObserver.disconnect();
      this.pointers.forEach(function (pointer) {
        pointer.classList.remove("game__pointer--active");
      });
    }
  }, {
    key: "_playStateChanges",
    value: function _playStateChanges(rec) {
      var _this13 = this;

      switch (true) {
        case rec[0].attributeName === "data-is-active" && this.parent.game.dataset.isActive === "true":
          document.documentElement.style.overflowY = "auto";
          document.body.style.overflowY = "auto";
          this.parent.audioController.play(this.parent.audioController.game);
          this.parent.game.classList.add("game--active");
          this.statsField.classList.add("game--active");
          this.parent.skyboxGame.classList.add("game--active");
          this.parent.game.insertAdjacentElement("beforebegin", this.statsField);
          this.parent.game.insertAdjacentElement("beforebegin", this.parent.skyboxGame);
          this.parent.game.insertAdjacentElement("afterend", this.pointers[0]);
          this.parent.game.insertAdjacentElement("afterend", this.pointers[1]);
          this.parent.skyboxGame.classList.add("skybox--fixed");
          setTimeout(function () {
            if (_this13.isCheckpoint) {
              _this13._showCards(_this13.parent.timings.toShowCard);

              _this13._upateGameStats();
            } else {
              _this13.generateCards(_this13.uniqCardsPerLevel, _this13.playableField);
            }
          }, this.parent.timings.toShowGameField);
          break;

        case rec[0].attributeName === "data-is-active" && this.parent.game.dataset.isActive === "false":
          this.parent.toOriginalCondition(document.documentElement, false, true);
          this.parent.toOriginalCondition(document.body, false, true);
          this.parent.game.insertAdjacentElement("beforeend", this.statsField);
          this.parent.game.insertAdjacentElement("beforeend", this.parent.skyboxGame);
          this.parent.game.insertAdjacentElement("beforeend", this.pointers[0]);
          this.parent.game.insertAdjacentElement("beforeend", this.pointers[1]);
          break;

        case rec[0].attributeName === "data-unmatched-cards" && this.parent.game.dataset.unmatchedCards === "0":
          if (this.parent.cards.length === 0) this._endGame("win");else this._startNewLevel();
          break;

        case rec[0].attributeName === "data-time-left" && this.parent.game.dataset.timeLeft === "0":
          this.endGameInitiated = setTimeout(function () {
            _this13.isCheckpoint = true;

            _this13._endGame("lose");
          }, 1000);
          break;
      }
    }
  }, {
    key: "generateCards",
    value: function generateCards(amount, target) {
      if (this.parent.cards.length < this.uniqCardsPerLevel) amount = this.parent.cards.length;

      for (var i = 0; i < amount; i++) {
        var newCard = this.parent.cards.pop();
        target.appendChild(newCard);
        var newCardClone = newCard.cloneNode(true);
        target.appendChild(newCardClone);
      }

      this._shuffleCards(target);

      this._showCards(this.parent.timings.toShowCard);

      this._addNumberToCard();

      this.parent.updateGameValue("cards");

      this._upateGameStats();
    }
  }, {
    key: "_upateGameStats",
    value: function _upateGameStats() {
      var _this14 = this;

      this.lockScreen.classList.toggle("lock--visible");
      var cardsOnTable = this.playableField.children.length;
      setTimeout(function () {
        if (_this14.isCheckpoint) _this14.isCheckpoint = false;
        _this14.parent.isLocked = false;
        _this14.parent.timer = _this14.parent.startTimer();

        _this14.pointersObserver.observe(_this14.playableField.children[0]);

        _this14.pointersObserver.observe(_this14.playableField.children[_this14.playableField.children.length - 1]);

        _this14.lockScreen.classList.toggle("lock--visible");
      }, this.parent.timings.toShowCard * cardsOnTable);
      this.parent.game.dataset.unmatchedCards = cardsOnTable;
    }
  }, {
    key: "_addNumberToCard",
    value: function _addNumberToCard() {
      var cards = this.playableField.querySelectorAll(".card__back");
      var i = 0;

      var _iterator3 = _createForOfIteratorHelper(cards),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var card = _step3.value;
          i++;
          var isNumeric = card.querySelector(".card__number");

          switch (true) {
            case isNumeric !== null:
              isNumeric.textContent = i;
              break;

            case isNumeric === null:
              var number = document.createElement("div");
              number.classList.add("card__number");
              number.textContent = i;
              card.appendChild(number);
              break;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "_shuffleCards",
    value: function _shuffleCards(target) {
      var newArr = Array.from(target.children);
      this.parent.shuffle(newArr);

      for (var i = newArr.length; i >= 0; i--) {
        var randomIndex = this.parent.getRandomInt(0, i);
        target.appendChild(newArr[randomIndex]);
      }
    }
  }, {
    key: "_showCards",
    value: function _showCards(speed) {
      var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      Array.from(this.playableField.children).forEach(function (item) {
        setTimeout(function () {
          return item.classList.add("card--appear");
        }, i);
        i += speed;
      });
    }
  }, {
    key: "flipCard",
    value: function flipCard(e) {
      if (this.parent.isLocked) return;
      this.pickedCard = e.target.closest(".card");
      if (!this.pickedCard) return;
      if (this.pickedCard.dataset.side === "face") return;
      this.parent.audioController.play(this.parent.audioController.click);
      this.pickedCard.dataset.side = "face";
      this.pickedCard.classList.add("card--picked");
      var currentSuperCard = this.playableField.querySelector(".card--super");

      if (currentSuperCard) {
        currentSuperCard.classList.remove("card--super");
      }

      this.pickedCard.classList.add("card--super");
      Array.from(this.pickedCard.children).forEach(function (item) {
        item.classList.add("rotate");
      });

      this._fillHand();
    }
  }, {
    key: "_fillHand",
    value: function _fillHand() {
      this.hand.push(this.pickedCard.dataset.char);
      if (this.hand.length === 2) this._matchCards();
    }
  }, {
    key: "_matchCards",
    value: function _matchCards() {
      this.parent.isLocked = true;
      this.hand[0] === this.hand[1] ? this._cardsMatched() : this._cardsMismatched();
      this.hand = [];
    }
  }, {
    key: "_cardsMatched",
    value: function _cardsMatched() {
      var _this15 = this;

      if (this.endGameInitiated && this.parent.game.dataset.unmatchedCards === "2") {
        clearTimeout(this.endGameInitiated);
        this.endGameInitiated = false;
      }

      return setTimeout(function () {
        _this15.parent.audioController.play(_this15.parent.audioController.matched);

        _this15.parent.isLocked = false;

        _this15._disableCards();

        _this15.parent.game.dataset.unmatchedCards -= 2;
      }, this.parent.timings.toCheckMatch);
    }
  }, {
    key: "_disableCards",
    value: function _disableCards() {
      Array.from(document.querySelectorAll(".card--picked")).forEach(function (item) {
        item.classList.add("card--disabled");
        item.classList.remove("card--picked");
        item.classList.remove("card--hovered");
      });
    }
  }, {
    key: "_enableCards",
    value: function _enableCards() {
      var _this16 = this;

      this._flipCardsBack(".card--disabled");

      Array.from(document.querySelectorAll(".card--disabled")).forEach(function (item) {
        item.classList.remove("card--disabled");
        setTimeout(function () {
          item.classList.remove("card--appear");
          item.classList.add("card--disappear");
        }, _this16.parent.timings.toFlipCard);
        setTimeout(function () {
          item.classList.remove("card--disappear");
        }, _this16.parent.timings.toFlipCard + _this16.parent.timings.toFadeCard);
      });
    }
  }, {
    key: "_cardsMismatched",
    value: function _cardsMismatched() {
      var _this17 = this;

      return setTimeout(function () {
        _this17.parent.audioController.play(_this17.parent.audioController.unmatched);

        _this17.parent.isLocked = false;

        _this17._flipCardsBack(".card--picked");
      }, this.parent.timings.toCheckMatch);
    }
  }, {
    key: "_flipCardsBack",
    value: function _flipCardsBack(selector) {
      var _this18 = this;

      Array.from(document.querySelectorAll(selector)).forEach(function (item) {
        item.dataset.side = "back";
        item.classList.remove("card--hovered");

        var _iterator4 = _createForOfIteratorHelper(item.children),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var side = _step4.value;
            side.classList.remove("rotate");
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        setTimeout(function () {
          if (item.dataset.side === "back") item.classList.remove("card--picked");
        }, _this18.parent.timings.toFlipCard);
      });
    }
  }, {
    key: "_startNewLevel",
    value: function _startNewLevel() {
      var _this19 = this;

      this.parent.isLocked = true;
      clearInterval(this.parent.timer);

      this._enableCards();

      this._hidePointers();

      setTimeout(function () {
        _this19.parent.updateGameValue("timer", true);

        _this19.generateCards(_this19.uniqCardsPerLevel, _this19.playableField);

        _this19.parent.game.scrollIntoView();
      }, this.parent.timings.toFlipCard + this.parent.timings.toFadeCard);
    }
  }, {
    key: "_endGame",
    value: function _endGame(result) {
      var _this20 = this;

      this.parent.isLocked = true;
      this.hand = [];

      this._hidePointers();

      if (result === "win") clearInterval(this.parent.timer);
      this.parent.audioController.stop(this.parent.audioController.game, "soft", (this.parent.timings.toFlipCard + this.parent.timings.toFadeCard + this.parent.timings.toFadeGameField) / 10);
      Array.from(this.playableField.children).forEach(function (item) {
        item.classList.remove("card--picked");
        item.children[0].classList.remove("rotate");
        item.children[1].classList.remove("rotate");
        setTimeout(function () {
          item.classList.remove("card--disabled", "card--appear");
          item.classList.add("card--disappear");
          item.dataset.side = "back";
        }, _this20.parent.timings.toFlipCard);
        setTimeout(function () {
          item.classList.remove("card--disappear");
        }, _this20.parent.timings.toFlipCard + _this20.parent.timings.toFadeCard);
      });
      setTimeout(function () {
        _this20.parent.game.scrollIntoView();

        _this20.parent.game.classList.remove("game--active");

        _this20.statsField.classList.remove("game--active");

        _this20.parent.skyboxGame.classList.remove("game--active");

        _this20.parent.game.classList.add("game--hide");

        _this20.statsField.classList.add("game--hide");

        _this20.parent.skyboxGame.classList.add("game--hide");
      }, this.parent.timings.toFlipCard + this.parent.timings.toFadeCard);
      setTimeout(function () {
        _this20.parent.game.dataset.isActive = "false";

        _this20.parent.toOriginalCondition(_this20.parent.game);

        _this20.parent.toOriginalCondition(_this20.statsField);

        _this20.parent.toOriginalCondition(_this20.parent.skyboxGame);

        _this20.parent.isLocked = false;
        _this20.parent.messages.dataset.isActive = "true";
        setTimeout(function () {
          return _this20.parent.messages.dataset.gameResult = result;
        }, 0);
      }, this.parent.timings.toFadeCard + this.parent.timings.toFlipCard + this.parent.timings.toFadeGameField);
    }
  }]);

  return PlayState;
}();

var EndGame = /*#__PURE__*/function () {
  function EndGame(parent) {
    var _this21 = this;

    _classCallCheck(this, EndGame);

    this.parent = parent;
    this.messageVictory = document.querySelector(".message--victory");
    this.shadowMessageVictory = this.messageVictory.querySelector(".logo__shadow");
    this.messageLose = document.querySelector(".message--lose");
    this.shadowMessageLose = this.messageLose.querySelector(".logo__shadow");
    this.continueButton = document.querySelector("[data-role=\"continue\"]");
    this.observer = new MutationObserver(function (rec) {
      return _this21._messagesChanges(rec);
    });
  }

  _createClass(EndGame, [{
    key: "_messagesChanges",
    value: function _messagesChanges(rec) {
      switch (true) {
        case rec[0].attributeName === "data-is-active" && this.parent.messages.dataset.isActive === "true":
          this.parent.messages.classList.add("messages-container--active");
          break;

        case rec[0].attributeName === "data-is-active" && this.parent.messages.dataset.isActive === "false":
          this.parent.toOriginalCondition(this.parent.messages);
          this.parent.messages.dataset.gameResult = "pending";
          break;

        case rec[0].attributeName === "data-game-result" && this.parent.messages.dataset.gameResult === "win":
          this.messageVictory.classList.add("message--active");
          this.shadowMessageVictory.classList.add("logo__shadow--victory");
          this.parent.audioController.play(this.parent.audioController.win);
          break;

        case rec[0].attributeName === "data-game-result" && this.parent.messages.dataset.gameResult === "lose":
          this.messageLose.classList.add("message--active");
          this.shadowMessageLose.classList.add("logo__shadow--lose");
          this.parent.audioController.play(this.parent.audioController.lose);
          break;
      }
    }
  }, {
    key: "action",
    value: function action(e) {
      if (this.parent.isLocked) return;
      if (!e.target.classList.contains("message__button")) return;
      if (e.target.dataset.role === "restart") this._restart(e);
      if (e.target.dataset.role === "continue") this._continue(e);
      this.parent.audioController.stop(this.parent.audioController.lose, "soft", 150);
      this.parent.audioController.stop(this.parent.audioController.win, "soft", 150);
    }
  }, {
    key: "_restart",
    value: function _restart(e) {
      var _this22 = this;

      this.parent.isLocked = true;
      var currentMessage = e.target.closest(".message");
      currentMessage.classList.add("message--hiding");
      setTimeout(function () {
        _this22.parent.toOriginalCondition(currentMessage);

        _this22.parent.toOriginalCondition(_this22.shadowMessageVictory);

        _this22.parent.toOriginalCondition(_this22.shadowMessageLose);

        _this22.parent.messages.dataset.isActive = "false";
        _this22.parent.timePoints = _this22.parent.initialTime;
        _this22.parent.lives = _this22.parent.initialLives;

        _this22.parent.updateGameValue("lives");

        _this22.parent.counters.timer.textContent = "--";
        _this22.parent.counters.cardsInDeck.textContent = "--";
        _this22.parent.game.dataset.timeLeft = "pending";
        _this22.parent.game.dataset.unmatchedCards = "pending";

        _this22.parent.updateCardsDeck();

        _this22.parent.clearPlayableField();

        _this22.parent.toOriginalCondition(_this22.continueButton);

        _this22.parent.toOriginalCondition(_this22.parent.intro, false, true);

        _this22.parent.isLocked = false;
      }, 1500);
    }
  }, {
    key: "_continue",
    value: function _continue(e) {
      var _this23 = this;

      if (e.target.classList.contains("message__button--disabled")) return;
      this.parent.isLocked = true;
      this.parent.lives--;
      this.parent.updateGameValue("lives");
      this.messageLose.classList.add("message--hiding");
      setTimeout(function () {
        _this23.parent.toOriginalCondition(_this23.messageLose);

        _this23.parent.toOriginalCondition(_this23.shadowMessageLose);

        _this23.parent.messages.dataset.isActive = "false";
        _this23.parent.timePoints = _this23.parent.checkpointTime;
        _this23.parent.counters.timer.textContent = "--";
        _this23.parent.game.dataset.isActive = "true";
        _this23.parent.game.dataset.timeLeft = _this23.parent.timePoints;
        _this23.parent.game.dataset.unmatchedCards = "pending";
      }, 1500);
      if (this.parent.lives === 0) e.target.classList.add("message__button--disabled");
    }
  }]);

  return EndGame;
}();

var game = new Game(charsArr, 10, 2);
game.start();
}();
/******/ })()
;