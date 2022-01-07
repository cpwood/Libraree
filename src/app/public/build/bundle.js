
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn) {
	  var module = { exports: {} };
		return fn(module, module.exports), module.exports;
	}

	/*! *****************************************************************************
	Copyright (C) Microsoft. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */

	var Reflect$1;
	(function (Reflect) {
	    // Metadata Proposal
	    // https://rbuckton.github.io/reflect-metadata/
	    (function (factory) {
	        var root = typeof commonjsGlobal === "object" ? commonjsGlobal :
	            typeof self === "object" ? self :
	                typeof this === "object" ? this :
	                    Function("return this;")();
	        var exporter = makeExporter(Reflect);
	        if (typeof root.Reflect === "undefined") {
	            root.Reflect = Reflect;
	        }
	        else {
	            exporter = makeExporter(root.Reflect, exporter);
	        }
	        factory(exporter);
	        function makeExporter(target, previous) {
	            return function (key, value) {
	                if (typeof target[key] !== "function") {
	                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
	                }
	                if (previous)
	                    previous(key, value);
	            };
	        }
	    })(function (exporter) {
	        var hasOwn = Object.prototype.hasOwnProperty;
	        // feature test for Symbol support
	        var supportsSymbol = typeof Symbol === "function";
	        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
	        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
	        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
	        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
	        var downLevel = !supportsCreate && !supportsProto;
	        var HashMap = {
	            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
	            create: supportsCreate
	                ? function () { return MakeDictionary(Object.create(null)); }
	                : supportsProto
	                    ? function () { return MakeDictionary({ __proto__: null }); }
	                    : function () { return MakeDictionary({}); },
	            has: downLevel
	                ? function (map, key) { return hasOwn.call(map, key); }
	                : function (map, key) { return key in map; },
	            get: downLevel
	                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
	                : function (map, key) { return map[key]; },
	        };
	        // Load global or shim versions of Map, Set, and WeakMap
	        var functionPrototype = Object.getPrototypeOf(Function);
	        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
	        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
	        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
	        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
	        // [[Metadata]] internal slot
	        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
	        var Metadata = new _WeakMap();
	        /**
	         * Applies a set of decorators to a property of a target object.
	         * @param decorators An array of decorators.
	         * @param target The target object.
	         * @param propertyKey (Optional) The property key to decorate.
	         * @param attributes (Optional) The property descriptor for the target key.
	         * @remarks Decorators are applied in reverse order.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     Example = Reflect.decorate(decoratorsArray, Example);
	         *
	         *     // property (on constructor)
	         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     Object.defineProperty(Example, "staticMethod",
	         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
	         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
	         *
	         *     // method (on prototype)
	         *     Object.defineProperty(Example.prototype, "method",
	         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
	         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
	         *
	         */
	        function decorate(decorators, target, propertyKey, attributes) {
	            if (!IsUndefined(propertyKey)) {
	                if (!IsArray(decorators))
	                    throw new TypeError();
	                if (!IsObject(target))
	                    throw new TypeError();
	                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
	                    throw new TypeError();
	                if (IsNull(attributes))
	                    attributes = undefined;
	                propertyKey = ToPropertyKey(propertyKey);
	                return DecorateProperty(decorators, target, propertyKey, attributes);
	            }
	            else {
	                if (!IsArray(decorators))
	                    throw new TypeError();
	                if (!IsConstructor(target))
	                    throw new TypeError();
	                return DecorateConstructor(decorators, target);
	            }
	        }
	        exporter("decorate", decorate);
	        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
	        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
	        /**
	         * A default metadata decorator factory that can be used on a class, class member, or parameter.
	         * @param metadataKey The key for the metadata entry.
	         * @param metadataValue The value for the metadata entry.
	         * @returns A decorator function.
	         * @remarks
	         * If `metadataKey` is already defined for the target and target key, the
	         * metadataValue for that key will be overwritten.
	         * @example
	         *
	         *     // constructor
	         *     @Reflect.metadata(key, value)
	         *     class Example {
	         *     }
	         *
	         *     // property (on constructor, TypeScript only)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         static staticProperty;
	         *     }
	         *
	         *     // property (on prototype, TypeScript only)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         property;
	         *     }
	         *
	         *     // method (on constructor)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         static staticMethod() { }
	         *     }
	         *
	         *     // method (on prototype)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         method() { }
	         *     }
	         *
	         */
	        function metadata(metadataKey, metadataValue) {
	            function decorator(target, propertyKey) {
	                if (!IsObject(target))
	                    throw new TypeError();
	                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
	                    throw new TypeError();
	                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
	            }
	            return decorator;
	        }
	        exporter("metadata", metadata);
	        /**
	         * Define a unique metadata entry on the target.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param metadataValue A value that contains attached metadata.
	         * @param target The target object on which to define metadata.
	         * @param propertyKey (Optional) The property key for the target.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     Reflect.defineMetadata("custom:annotation", options, Example);
	         *
	         *     // property (on constructor)
	         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
	         *
	         *     // decorator factory as metadata-producing annotation.
	         *     function MyAnnotation(options): Decorator {
	         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
	         *     }
	         *
	         */
	        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
	        }
	        exporter("defineMetadata", defineMetadata);
	        /**
	         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.hasMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function hasMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("hasMetadata", hasMetadata);
	        /**
	         * Gets a value indicating whether the target object has the provided metadata key defined.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function hasOwnMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("hasOwnMetadata", hasOwnMetadata);
	        /**
	         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function getMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("getMetadata", getMetadata);
	        /**
	         * Gets the metadata value for the provided metadata key on the target object.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function getOwnMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("getOwnMetadata", getOwnMetadata);
	        /**
	         * Gets the metadata keys defined on the target object or its prototype chain.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns An array of unique metadata keys.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getMetadataKeys(Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
	         *
	         */
	        function getMetadataKeys(target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryMetadataKeys(target, propertyKey);
	        }
	        exporter("getMetadataKeys", getMetadataKeys);
	        /**
	         * Gets the unique metadata keys defined on the target object.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns An array of unique metadata keys.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getOwnMetadataKeys(Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
	         *
	         */
	        function getOwnMetadataKeys(target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryOwnMetadataKeys(target, propertyKey);
	        }
	        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
	        /**
	         * Deletes the metadata entry from the target object with the provided key.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.deleteMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function deleteMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                return false;
	            if (!metadataMap.delete(metadataKey))
	                return false;
	            if (metadataMap.size > 0)
	                return true;
	            var targetMetadata = Metadata.get(target);
	            targetMetadata.delete(propertyKey);
	            if (targetMetadata.size > 0)
	                return true;
	            Metadata.delete(target);
	            return true;
	        }
	        exporter("deleteMetadata", deleteMetadata);
	        function DecorateConstructor(decorators, target) {
	            for (var i = decorators.length - 1; i >= 0; --i) {
	                var decorator = decorators[i];
	                var decorated = decorator(target);
	                if (!IsUndefined(decorated) && !IsNull(decorated)) {
	                    if (!IsConstructor(decorated))
	                        throw new TypeError();
	                    target = decorated;
	                }
	            }
	            return target;
	        }
	        function DecorateProperty(decorators, target, propertyKey, descriptor) {
	            for (var i = decorators.length - 1; i >= 0; --i) {
	                var decorator = decorators[i];
	                var decorated = decorator(target, propertyKey, descriptor);
	                if (!IsUndefined(decorated) && !IsNull(decorated)) {
	                    if (!IsObject(decorated))
	                        throw new TypeError();
	                    descriptor = decorated;
	                }
	            }
	            return descriptor;
	        }
	        function GetOrCreateMetadataMap(O, P, Create) {
	            var targetMetadata = Metadata.get(O);
	            if (IsUndefined(targetMetadata)) {
	                if (!Create)
	                    return undefined;
	                targetMetadata = new _Map();
	                Metadata.set(O, targetMetadata);
	            }
	            var metadataMap = targetMetadata.get(P);
	            if (IsUndefined(metadataMap)) {
	                if (!Create)
	                    return undefined;
	                metadataMap = new _Map();
	                targetMetadata.set(P, metadataMap);
	            }
	            return metadataMap;
	        }
	        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
	        function OrdinaryHasMetadata(MetadataKey, O, P) {
	            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	            if (hasOwn)
	                return true;
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (!IsNull(parent))
	                return OrdinaryHasMetadata(MetadataKey, parent, P);
	            return false;
	        }
	        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
	        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                return false;
	            return ToBoolean(metadataMap.has(MetadataKey));
	        }
	        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
	        function OrdinaryGetMetadata(MetadataKey, O, P) {
	            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	            if (hasOwn)
	                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (!IsNull(parent))
	                return OrdinaryGetMetadata(MetadataKey, parent, P);
	            return undefined;
	        }
	        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
	        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                return undefined;
	            return metadataMap.get(MetadataKey);
	        }
	        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
	        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
	            metadataMap.set(MetadataKey, MetadataValue);
	        }
	        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
	        function OrdinaryMetadataKeys(O, P) {
	            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (parent === null)
	                return ownKeys;
	            var parentKeys = OrdinaryMetadataKeys(parent, P);
	            if (parentKeys.length <= 0)
	                return ownKeys;
	            if (ownKeys.length <= 0)
	                return parentKeys;
	            var set = new _Set();
	            var keys = [];
	            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
	                var key = ownKeys_1[_i];
	                var hasKey = set.has(key);
	                if (!hasKey) {
	                    set.add(key);
	                    keys.push(key);
	                }
	            }
	            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
	                var key = parentKeys_1[_a];
	                var hasKey = set.has(key);
	                if (!hasKey) {
	                    set.add(key);
	                    keys.push(key);
	                }
	            }
	            return keys;
	        }
	        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
	        function OrdinaryOwnMetadataKeys(O, P) {
	            var keys = [];
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                return keys;
	            var keysObj = metadataMap.keys();
	            var iterator = GetIterator(keysObj);
	            var k = 0;
	            while (true) {
	                var next = IteratorStep(iterator);
	                if (!next) {
	                    keys.length = k;
	                    return keys;
	                }
	                var nextValue = IteratorValue(next);
	                try {
	                    keys[k] = nextValue;
	                }
	                catch (e) {
	                    try {
	                        IteratorClose(iterator);
	                    }
	                    finally {
	                        throw e;
	                    }
	                }
	                k++;
	            }
	        }
	        // 6 ECMAScript Data Typ0es and Values
	        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
	        function Type(x) {
	            if (x === null)
	                return 1 /* Null */;
	            switch (typeof x) {
	                case "undefined": return 0 /* Undefined */;
	                case "boolean": return 2 /* Boolean */;
	                case "string": return 3 /* String */;
	                case "symbol": return 4 /* Symbol */;
	                case "number": return 5 /* Number */;
	                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
	                default: return 6 /* Object */;
	            }
	        }
	        // 6.1.1 The Undefined Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
	        function IsUndefined(x) {
	            return x === undefined;
	        }
	        // 6.1.2 The Null Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
	        function IsNull(x) {
	            return x === null;
	        }
	        // 6.1.5 The Symbol Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
	        function IsSymbol(x) {
	            return typeof x === "symbol";
	        }
	        // 6.1.7 The Object Type
	        // https://tc39.github.io/ecma262/#sec-object-type
	        function IsObject(x) {
	            return typeof x === "object" ? x !== null : typeof x === "function";
	        }
	        // 7.1 Type Conversion
	        // https://tc39.github.io/ecma262/#sec-type-conversion
	        // 7.1.1 ToPrimitive(input [, PreferredType])
	        // https://tc39.github.io/ecma262/#sec-toprimitive
	        function ToPrimitive(input, PreferredType) {
	            switch (Type(input)) {
	                case 0 /* Undefined */: return input;
	                case 1 /* Null */: return input;
	                case 2 /* Boolean */: return input;
	                case 3 /* String */: return input;
	                case 4 /* Symbol */: return input;
	                case 5 /* Number */: return input;
	            }
	            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
	            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
	            if (exoticToPrim !== undefined) {
	                var result = exoticToPrim.call(input, hint);
	                if (IsObject(result))
	                    throw new TypeError();
	                return result;
	            }
	            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
	        }
	        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
	        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
	        function OrdinaryToPrimitive(O, hint) {
	            if (hint === "string") {
	                var toString_1 = O.toString;
	                if (IsCallable(toString_1)) {
	                    var result = toString_1.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	                var valueOf = O.valueOf;
	                if (IsCallable(valueOf)) {
	                    var result = valueOf.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	            }
	            else {
	                var valueOf = O.valueOf;
	                if (IsCallable(valueOf)) {
	                    var result = valueOf.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	                var toString_2 = O.toString;
	                if (IsCallable(toString_2)) {
	                    var result = toString_2.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	            }
	            throw new TypeError();
	        }
	        // 7.1.2 ToBoolean(argument)
	        // https://tc39.github.io/ecma262/2016/#sec-toboolean
	        function ToBoolean(argument) {
	            return !!argument;
	        }
	        // 7.1.12 ToString(argument)
	        // https://tc39.github.io/ecma262/#sec-tostring
	        function ToString(argument) {
	            return "" + argument;
	        }
	        // 7.1.14 ToPropertyKey(argument)
	        // https://tc39.github.io/ecma262/#sec-topropertykey
	        function ToPropertyKey(argument) {
	            var key = ToPrimitive(argument, 3 /* String */);
	            if (IsSymbol(key))
	                return key;
	            return ToString(key);
	        }
	        // 7.2 Testing and Comparison Operations
	        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
	        // 7.2.2 IsArray(argument)
	        // https://tc39.github.io/ecma262/#sec-isarray
	        function IsArray(argument) {
	            return Array.isArray
	                ? Array.isArray(argument)
	                : argument instanceof Object
	                    ? argument instanceof Array
	                    : Object.prototype.toString.call(argument) === "[object Array]";
	        }
	        // 7.2.3 IsCallable(argument)
	        // https://tc39.github.io/ecma262/#sec-iscallable
	        function IsCallable(argument) {
	            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
	            return typeof argument === "function";
	        }
	        // 7.2.4 IsConstructor(argument)
	        // https://tc39.github.io/ecma262/#sec-isconstructor
	        function IsConstructor(argument) {
	            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
	            return typeof argument === "function";
	        }
	        // 7.2.7 IsPropertyKey(argument)
	        // https://tc39.github.io/ecma262/#sec-ispropertykey
	        function IsPropertyKey(argument) {
	            switch (Type(argument)) {
	                case 3 /* String */: return true;
	                case 4 /* Symbol */: return true;
	                default: return false;
	            }
	        }
	        // 7.3 Operations on Objects
	        // https://tc39.github.io/ecma262/#sec-operations-on-objects
	        // 7.3.9 GetMethod(V, P)
	        // https://tc39.github.io/ecma262/#sec-getmethod
	        function GetMethod(V, P) {
	            var func = V[P];
	            if (func === undefined || func === null)
	                return undefined;
	            if (!IsCallable(func))
	                throw new TypeError();
	            return func;
	        }
	        // 7.4 Operations on Iterator Objects
	        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
	        function GetIterator(obj) {
	            var method = GetMethod(obj, iteratorSymbol);
	            if (!IsCallable(method))
	                throw new TypeError(); // from Call
	            var iterator = method.call(obj);
	            if (!IsObject(iterator))
	                throw new TypeError();
	            return iterator;
	        }
	        // 7.4.4 IteratorValue(iterResult)
	        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
	        function IteratorValue(iterResult) {
	            return iterResult.value;
	        }
	        // 7.4.5 IteratorStep(iterator)
	        // https://tc39.github.io/ecma262/#sec-iteratorstep
	        function IteratorStep(iterator) {
	            var result = iterator.next();
	            return result.done ? false : result;
	        }
	        // 7.4.6 IteratorClose(iterator, completion)
	        // https://tc39.github.io/ecma262/#sec-iteratorclose
	        function IteratorClose(iterator) {
	            var f = iterator["return"];
	            if (f)
	                f.call(iterator);
	        }
	        // 9.1 Ordinary Object Internal Methods and Internal Slots
	        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
	        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
	        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
	        function OrdinaryGetPrototypeOf(O) {
	            var proto = Object.getPrototypeOf(O);
	            if (typeof O !== "function" || O === functionPrototype)
	                return proto;
	            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
	            // Try to determine the superclass constructor. Compatible implementations
	            // must either set __proto__ on a subclass constructor to the superclass constructor,
	            // or ensure each class has a valid `constructor` property on its prototype that
	            // points back to the constructor.
	            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
	            // This is the case when in ES6 or when using __proto__ in a compatible browser.
	            if (proto !== functionPrototype)
	                return proto;
	            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
	            var prototype = O.prototype;
	            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
	            if (prototypeProto == null || prototypeProto === Object.prototype)
	                return proto;
	            // If the constructor was not a function, then we cannot determine the heritage.
	            var constructor = prototypeProto.constructor;
	            if (typeof constructor !== "function")
	                return proto;
	            // If we have some kind of self-reference, then we cannot determine the heritage.
	            if (constructor === O)
	                return proto;
	            // we have a pretty good guess at the heritage.
	            return constructor;
	        }
	        // naive Map shim
	        function CreateMapPolyfill() {
	            var cacheSentinel = {};
	            var arraySentinel = [];
	            var MapIterator = /** @class */ (function () {
	                function MapIterator(keys, values, selector) {
	                    this._index = 0;
	                    this._keys = keys;
	                    this._values = values;
	                    this._selector = selector;
	                }
	                MapIterator.prototype["@@iterator"] = function () { return this; };
	                MapIterator.prototype[iteratorSymbol] = function () { return this; };
	                MapIterator.prototype.next = function () {
	                    var index = this._index;
	                    if (index >= 0 && index < this._keys.length) {
	                        var result = this._selector(this._keys[index], this._values[index]);
	                        if (index + 1 >= this._keys.length) {
	                            this._index = -1;
	                            this._keys = arraySentinel;
	                            this._values = arraySentinel;
	                        }
	                        else {
	                            this._index++;
	                        }
	                        return { value: result, done: false };
	                    }
	                    return { value: undefined, done: true };
	                };
	                MapIterator.prototype.throw = function (error) {
	                    if (this._index >= 0) {
	                        this._index = -1;
	                        this._keys = arraySentinel;
	                        this._values = arraySentinel;
	                    }
	                    throw error;
	                };
	                MapIterator.prototype.return = function (value) {
	                    if (this._index >= 0) {
	                        this._index = -1;
	                        this._keys = arraySentinel;
	                        this._values = arraySentinel;
	                    }
	                    return { value: value, done: true };
	                };
	                return MapIterator;
	            }());
	            return /** @class */ (function () {
	                function Map() {
	                    this._keys = [];
	                    this._values = [];
	                    this._cacheKey = cacheSentinel;
	                    this._cacheIndex = -2;
	                }
	                Object.defineProperty(Map.prototype, "size", {
	                    get: function () { return this._keys.length; },
	                    enumerable: true,
	                    configurable: true
	                });
	                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
	                Map.prototype.get = function (key) {
	                    var index = this._find(key, /*insert*/ false);
	                    return index >= 0 ? this._values[index] : undefined;
	                };
	                Map.prototype.set = function (key, value) {
	                    var index = this._find(key, /*insert*/ true);
	                    this._values[index] = value;
	                    return this;
	                };
	                Map.prototype.delete = function (key) {
	                    var index = this._find(key, /*insert*/ false);
	                    if (index >= 0) {
	                        var size = this._keys.length;
	                        for (var i = index + 1; i < size; i++) {
	                            this._keys[i - 1] = this._keys[i];
	                            this._values[i - 1] = this._values[i];
	                        }
	                        this._keys.length--;
	                        this._values.length--;
	                        if (key === this._cacheKey) {
	                            this._cacheKey = cacheSentinel;
	                            this._cacheIndex = -2;
	                        }
	                        return true;
	                    }
	                    return false;
	                };
	                Map.prototype.clear = function () {
	                    this._keys.length = 0;
	                    this._values.length = 0;
	                    this._cacheKey = cacheSentinel;
	                    this._cacheIndex = -2;
	                };
	                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
	                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
	                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
	                Map.prototype["@@iterator"] = function () { return this.entries(); };
	                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
	                Map.prototype._find = function (key, insert) {
	                    if (this._cacheKey !== key) {
	                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
	                    }
	                    if (this._cacheIndex < 0 && insert) {
	                        this._cacheIndex = this._keys.length;
	                        this._keys.push(key);
	                        this._values.push(undefined);
	                    }
	                    return this._cacheIndex;
	                };
	                return Map;
	            }());
	            function getKey(key, _) {
	                return key;
	            }
	            function getValue(_, value) {
	                return value;
	            }
	            function getEntry(key, value) {
	                return [key, value];
	            }
	        }
	        // naive Set shim
	        function CreateSetPolyfill() {
	            return /** @class */ (function () {
	                function Set() {
	                    this._map = new _Map();
	                }
	                Object.defineProperty(Set.prototype, "size", {
	                    get: function () { return this._map.size; },
	                    enumerable: true,
	                    configurable: true
	                });
	                Set.prototype.has = function (value) { return this._map.has(value); };
	                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
	                Set.prototype.delete = function (value) { return this._map.delete(value); };
	                Set.prototype.clear = function () { this._map.clear(); };
	                Set.prototype.keys = function () { return this._map.keys(); };
	                Set.prototype.values = function () { return this._map.values(); };
	                Set.prototype.entries = function () { return this._map.entries(); };
	                Set.prototype["@@iterator"] = function () { return this.keys(); };
	                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
	                return Set;
	            }());
	        }
	        // naive WeakMap shim
	        function CreateWeakMapPolyfill() {
	            var UUID_SIZE = 16;
	            var keys = HashMap.create();
	            var rootKey = CreateUniqueKey();
	            return /** @class */ (function () {
	                function WeakMap() {
	                    this._key = CreateUniqueKey();
	                }
	                WeakMap.prototype.has = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? HashMap.has(table, this._key) : false;
	                };
	                WeakMap.prototype.get = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
	                };
	                WeakMap.prototype.set = function (target, value) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
	                    table[this._key] = value;
	                    return this;
	                };
	                WeakMap.prototype.delete = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? delete table[this._key] : false;
	                };
	                WeakMap.prototype.clear = function () {
	                    // NOTE: not a real clear, just makes the previous data unreachable
	                    this._key = CreateUniqueKey();
	                };
	                return WeakMap;
	            }());
	            function CreateUniqueKey() {
	                var key;
	                do
	                    key = "@@WeakMap@@" + CreateUUID();
	                while (HashMap.has(keys, key));
	                keys[key] = true;
	                return key;
	            }
	            function GetOrCreateWeakMapTable(target, create) {
	                if (!hasOwn.call(target, rootKey)) {
	                    if (!create)
	                        return undefined;
	                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
	                }
	                return target[rootKey];
	            }
	            function FillRandomBytes(buffer, size) {
	                for (var i = 0; i < size; ++i)
	                    buffer[i] = Math.random() * 0xff | 0;
	                return buffer;
	            }
	            function GenRandomBytes(size) {
	                if (typeof Uint8Array === "function") {
	                    if (typeof crypto !== "undefined")
	                        return crypto.getRandomValues(new Uint8Array(size));
	                    if (typeof msCrypto !== "undefined")
	                        return msCrypto.getRandomValues(new Uint8Array(size));
	                    return FillRandomBytes(new Uint8Array(size), size);
	                }
	                return FillRandomBytes(new Array(size), size);
	            }
	            function CreateUUID() {
	                var data = GenRandomBytes(UUID_SIZE);
	                // mark as random - RFC 4122 § 4.4
	                data[6] = data[6] & 0x4f | 0x40;
	                data[8] = data[8] & 0xbf | 0x80;
	                var result = "";
	                for (var offset = 0; offset < UUID_SIZE; ++offset) {
	                    var byte = data[offset];
	                    if (offset === 4 || offset === 6 || offset === 8)
	                        result += "-";
	                    if (byte < 16)
	                        result += "0";
	                    result += byte.toString(16).toLowerCase();
	                }
	                return result;
	            }
	        }
	        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
	        function MakeDictionary(obj) {
	            obj.__ = undefined;
	            delete obj.__;
	            return obj;
	        }
	    });
	})(Reflect$1 || (Reflect$1 = {}));

	function noop$1() { }
	const identity$1 = x => x;
	function assign(tar, src) {
	    // @ts-ignore
	    for (const k in src)
	        tar[k] = src[k];
	    return tar;
	}
	function add_location(element, file, line, column, char) {
	    element.__svelte_meta = {
	        loc: { file, line, column, char }
	    };
	}
	function run(fn) {
	    return fn();
	}
	function blank_object() {
	    return Object.create(null);
	}
	function run_all(fns) {
	    fns.forEach(run);
	}
	function is_function(thing) {
	    return typeof thing === 'function';
	}
	function safe_not_equal(a, b) {
	    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}
	let src_url_equal_anchor;
	function src_url_equal(element_src, url) {
	    if (!src_url_equal_anchor) {
	        src_url_equal_anchor = document.createElement('a');
	    }
	    src_url_equal_anchor.href = url;
	    return element_src === src_url_equal_anchor.href;
	}
	function is_empty(obj) {
	    return Object.keys(obj).length === 0;
	}
	function validate_store(store, name) {
	    if (store != null && typeof store.subscribe !== 'function') {
	        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
	    }
	}
	function subscribe(store, ...callbacks) {
	    if (store == null) {
	        return noop$1;
	    }
	    const unsub = store.subscribe(...callbacks);
	    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
	}
	function component_subscribe(component, store, callback) {
	    component.$$.on_destroy.push(subscribe(store, callback));
	}
	function create_slot(definition, ctx, $$scope, fn) {
	    if (definition) {
	        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
	        return definition[0](slot_ctx);
	    }
	}
	function get_slot_context(definition, ctx, $$scope, fn) {
	    return definition[1] && fn
	        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
	        : $$scope.ctx;
	}
	function get_slot_changes(definition, $$scope, dirty, fn) {
	    if (definition[2] && fn) {
	        const lets = definition[2](fn(dirty));
	        if ($$scope.dirty === undefined) {
	            return lets;
	        }
	        if (typeof lets === 'object') {
	            const merged = [];
	            const len = Math.max($$scope.dirty.length, lets.length);
	            for (let i = 0; i < len; i += 1) {
	                merged[i] = $$scope.dirty[i] | lets[i];
	            }
	            return merged;
	        }
	        return $$scope.dirty | lets;
	    }
	    return $$scope.dirty;
	}
	function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
	    if (slot_changes) {
	        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
	        slot.p(slot_context, slot_changes);
	    }
	}
	function get_all_dirty_from_scope($$scope) {
	    if ($$scope.ctx.length > 32) {
	        const dirty = [];
	        const length = $$scope.ctx.length / 32;
	        for (let i = 0; i < length; i++) {
	            dirty[i] = -1;
	        }
	        return dirty;
	    }
	    return -1;
	}
	function exclude_internal_props(props) {
	    const result = {};
	    for (const k in props)
	        if (k[0] !== '$')
	            result[k] = props[k];
	    return result;
	}
	function compute_rest_props(props, keys) {
	    const rest = {};
	    keys = new Set(keys);
	    for (const k in props)
	        if (!keys.has(k) && k[0] !== '$')
	            rest[k] = props[k];
	    return rest;
	}
	function null_to_empty(value) {
	    return value == null ? '' : value;
	}
	function action_destroyer(action_result) {
	    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$1;
	}

	const is_client = typeof window !== 'undefined';
	let now$1 = is_client
	    ? () => window.performance.now()
	    : () => Date.now();
	let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

	const tasks = new Set();
	function run_tasks(now) {
	    tasks.forEach(task => {
	        if (!task.c(now)) {
	            tasks.delete(task);
	            task.f();
	        }
	    });
	    if (tasks.size !== 0)
	        raf(run_tasks);
	}
	/**
	 * Creates a new task that runs on each raf frame
	 * until it returns a falsy value or is aborted
	 */
	function loop(callback) {
	    let task;
	    if (tasks.size === 0)
	        raf(run_tasks);
	    return {
	        promise: new Promise(fulfill => {
	            tasks.add(task = { c: callback, f: fulfill });
	        }),
	        abort() {
	            tasks.delete(task);
	        }
	    };
	}
	function append(target, node) {
	    target.appendChild(node);
	}
	function get_root_for_style(node) {
	    if (!node)
	        return document;
	    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	    if (root && root.host) {
	        return root;
	    }
	    return node.ownerDocument;
	}
	function append_empty_stylesheet(node) {
	    const style_element = element('style');
	    append_stylesheet(get_root_for_style(node), style_element);
	    return style_element;
	}
	function append_stylesheet(node, style) {
	    append(node.head || node, style);
	}
	function insert(target, node, anchor) {
	    target.insertBefore(node, anchor || null);
	}
	function detach(node) {
	    node.parentNode.removeChild(node);
	}
	function destroy_each(iterations, detaching) {
	    for (let i = 0; i < iterations.length; i += 1) {
	        if (iterations[i])
	            iterations[i].d(detaching);
	    }
	}
	function element(name) {
	    return document.createElement(name);
	}
	function text(data) {
	    return document.createTextNode(data);
	}
	function space() {
	    return text(' ');
	}
	function empty() {
	    return text('');
	}
	function listen(node, event, handler, options) {
	    node.addEventListener(event, handler, options);
	    return () => node.removeEventListener(event, handler, options);
	}
	function prevent_default(fn) {
	    return function (event) {
	        event.preventDefault();
	        // @ts-ignore
	        return fn.call(this, event);
	    };
	}
	function attr(node, attribute, value) {
	    if (value == null)
	        node.removeAttribute(attribute);
	    else if (node.getAttribute(attribute) !== value)
	        node.setAttribute(attribute, value);
	}
	function set_attributes(node, attributes) {
	    // @ts-ignore
	    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
	    for (const key in attributes) {
	        if (attributes[key] == null) {
	            node.removeAttribute(key);
	        }
	        else if (key === 'style') {
	            node.style.cssText = attributes[key];
	        }
	        else if (key === '__value') {
	            node.value = node[key] = attributes[key];
	        }
	        else if (descriptors[key] && descriptors[key].set) {
	            node[key] = attributes[key];
	        }
	        else {
	            attr(node, key, attributes[key]);
	        }
	    }
	}
	function children(element) {
	    return Array.from(element.childNodes);
	}
	function set_input_value(input, value) {
	    input.value = value == null ? '' : value;
	}
	function set_style(node, key, value, important) {
	    node.style.setProperty(key, value, important ? 'important' : '');
	}
	function toggle_class(element, name, toggle) {
	    element.classList[toggle ? 'add' : 'remove'](name);
	}
	function custom_event(type, detail, bubbles = false) {
	    const e = document.createEvent('CustomEvent');
	    e.initCustomEvent(type, bubbles, false, detail);
	    return e;
	}

	const active_docs = new Set();
	let active = 0;
	// https://github.com/darkskyapp/string-hash/blob/master/index.js
	function hash$2(str) {
	    let hash = 5381;
	    let i = str.length;
	    while (i--)
	        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
	    return hash >>> 0;
	}
	function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
	    const step = 16.666 / duration;
	    let keyframes = '{\n';
	    for (let p = 0; p <= 1; p += step) {
	        const t = a + (b - a) * ease(p);
	        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
	    }
	    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
	    const name = `__svelte_${hash$2(rule)}_${uid}`;
	    const doc = get_root_for_style(node);
	    active_docs.add(doc);
	    const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
	    const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
	    if (!current_rules[name]) {
	        current_rules[name] = true;
	        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
	    }
	    const animation = node.style.animation || '';
	    node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
	    active += 1;
	    return name;
	}
	function delete_rule(node, name) {
	    const previous = (node.style.animation || '').split(', ');
	    const next = previous.filter(name
	        ? anim => anim.indexOf(name) < 0 // remove specific animation
	        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
	    );
	    const deleted = previous.length - next.length;
	    if (deleted) {
	        node.style.animation = next.join(', ');
	        active -= deleted;
	        if (!active)
	            clear_rules();
	    }
	}
	function clear_rules() {
	    raf(() => {
	        if (active)
	            return;
	        active_docs.forEach(doc => {
	            const stylesheet = doc.__svelte_stylesheet;
	            let i = stylesheet.cssRules.length;
	            while (i--)
	                stylesheet.deleteRule(i);
	            doc.__svelte_rules = {};
	        });
	        active_docs.clear();
	    });
	}

	let current_component;
	function set_current_component(component) {
	    current_component = component;
	}
	function get_current_component() {
	    if (!current_component)
	        throw new Error('Function called outside component initialization');
	    return current_component;
	}
	function onMount(fn) {
	    get_current_component().$$.on_mount.push(fn);
	}
	function afterUpdate(fn) {
	    get_current_component().$$.after_update.push(fn);
	}
	function onDestroy(fn) {
	    get_current_component().$$.on_destroy.push(fn);
	}
	function createEventDispatcher() {
	    const component = get_current_component();
	    return (type, detail) => {
	        const callbacks = component.$$.callbacks[type];
	        if (callbacks) {
	            // TODO are there situations where events could be dispatched
	            // in a server (non-DOM) environment?
	            const event = custom_event(type, detail);
	            callbacks.slice().forEach(fn => {
	                fn.call(component, event);
	            });
	        }
	    };
	}
	function setContext(key, context) {
	    get_current_component().$$.context.set(key, context);
	}
	function getContext(key) {
	    return get_current_component().$$.context.get(key);
	}
	// TODO figure out if we still want to support
	// shorthand events, or if we want to implement
	// a real bubbling mechanism
	function bubble(component, event) {
	    const callbacks = component.$$.callbacks[event.type];
	    if (callbacks) {
	        // @ts-ignore
	        callbacks.slice().forEach(fn => fn.call(this, event));
	    }
	}

	const dirty_components = [];
	const binding_callbacks = [];
	const render_callbacks = [];
	const flush_callbacks = [];
	const resolved_promise = Promise.resolve();
	let update_scheduled = false;
	function schedule_update() {
	    if (!update_scheduled) {
	        update_scheduled = true;
	        resolved_promise.then(flush);
	    }
	}
	function add_render_callback(fn) {
	    render_callbacks.push(fn);
	}
	let flushing = false;
	const seen_callbacks = new Set();
	function flush() {
	    if (flushing)
	        return;
	    flushing = true;
	    do {
	        // first, call beforeUpdate functions
	        // and update components
	        for (let i = 0; i < dirty_components.length; i += 1) {
	            const component = dirty_components[i];
	            set_current_component(component);
	            update(component.$$);
	        }
	        set_current_component(null);
	        dirty_components.length = 0;
	        while (binding_callbacks.length)
	            binding_callbacks.pop()();
	        // then, once components are updated, call
	        // afterUpdate functions. This may cause
	        // subsequent updates...
	        for (let i = 0; i < render_callbacks.length; i += 1) {
	            const callback = render_callbacks[i];
	            if (!seen_callbacks.has(callback)) {
	                // ...so guard against infinite loops
	                seen_callbacks.add(callback);
	                callback();
	            }
	        }
	        render_callbacks.length = 0;
	    } while (dirty_components.length);
	    while (flush_callbacks.length) {
	        flush_callbacks.pop()();
	    }
	    update_scheduled = false;
	    flushing = false;
	    seen_callbacks.clear();
	}
	function update($$) {
	    if ($$.fragment !== null) {
	        $$.update();
	        run_all($$.before_update);
	        const dirty = $$.dirty;
	        $$.dirty = [-1];
	        $$.fragment && $$.fragment.p($$.ctx, dirty);
	        $$.after_update.forEach(add_render_callback);
	    }
	}

	let promise;
	function wait() {
	    if (!promise) {
	        promise = Promise.resolve();
	        promise.then(() => {
	            promise = null;
	        });
	    }
	    return promise;
	}
	function dispatch(node, direction, kind) {
	    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
	}
	const outroing = new Set();
	let outros;
	function group_outros() {
	    outros = {
	        r: 0,
	        c: [],
	        p: outros // parent group
	    };
	}
	function check_outros() {
	    if (!outros.r) {
	        run_all(outros.c);
	    }
	    outros = outros.p;
	}
	function transition_in(block, local) {
	    if (block && block.i) {
	        outroing.delete(block);
	        block.i(local);
	    }
	}
	function transition_out(block, local, detach, callback) {
	    if (block && block.o) {
	        if (outroing.has(block))
	            return;
	        outroing.add(block);
	        outros.c.push(() => {
	            outroing.delete(block);
	            if (callback) {
	                if (detach)
	                    block.d(1);
	                callback();
	            }
	        });
	        block.o(local);
	    }
	}
	const null_transition = { duration: 0 };
	function create_in_transition(node, fn, params) {
	    let config = fn(node, params);
	    let running = false;
	    let animation_name;
	    let task;
	    let uid = 0;
	    function cleanup() {
	        if (animation_name)
	            delete_rule(node, animation_name);
	    }
	    function go() {
	        const { delay = 0, duration = 300, easing = identity$1, tick = noop$1, css } = config || null_transition;
	        if (css)
	            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
	        tick(0, 1);
	        const start_time = now$1() + delay;
	        const end_time = start_time + duration;
	        if (task)
	            task.abort();
	        running = true;
	        add_render_callback(() => dispatch(node, true, 'start'));
	        task = loop(now => {
	            if (running) {
	                if (now >= end_time) {
	                    tick(1, 0);
	                    dispatch(node, true, 'end');
	                    cleanup();
	                    return running = false;
	                }
	                if (now >= start_time) {
	                    const t = easing((now - start_time) / duration);
	                    tick(t, 1 - t);
	                }
	            }
	            return running;
	        });
	    }
	    let started = false;
	    return {
	        start() {
	            if (started)
	                return;
	            started = true;
	            delete_rule(node);
	            if (is_function(config)) {
	                config = config();
	                wait().then(go);
	            }
	            else {
	                go();
	            }
	        },
	        invalidate() {
	            started = false;
	        },
	        end() {
	            if (running) {
	                cleanup();
	                running = false;
	            }
	        }
	    };
	}
	function create_out_transition(node, fn, params) {
	    let config = fn(node, params);
	    let running = true;
	    let animation_name;
	    const group = outros;
	    group.r += 1;
	    function go() {
	        const { delay = 0, duration = 300, easing = identity$1, tick = noop$1, css } = config || null_transition;
	        if (css)
	            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
	        const start_time = now$1() + delay;
	        const end_time = start_time + duration;
	        add_render_callback(() => dispatch(node, false, 'start'));
	        loop(now => {
	            if (running) {
	                if (now >= end_time) {
	                    tick(0, 1);
	                    dispatch(node, false, 'end');
	                    if (!--group.r) {
	                        // this will result in `end()` being called,
	                        // so we don't need to clean up here
	                        run_all(group.c);
	                    }
	                    return false;
	                }
	                if (now >= start_time) {
	                    const t = easing((now - start_time) / duration);
	                    tick(1 - t, t);
	                }
	            }
	            return running;
	        });
	    }
	    if (is_function(config)) {
	        wait().then(() => {
	            // @ts-ignore
	            config = config();
	            go();
	        });
	    }
	    else {
	        go();
	    }
	    return {
	        end(reset) {
	            if (reset && config.tick) {
	                config.tick(1, 0);
	            }
	            if (running) {
	                if (animation_name)
	                    delete_rule(node, animation_name);
	                running = false;
	            }
	        }
	    };
	}

	const globals = (typeof window !== 'undefined'
	    ? window
	    : typeof globalThis !== 'undefined'
	        ? globalThis
	        : global);

	function get_spread_update(levels, updates) {
	    const update = {};
	    const to_null_out = {};
	    const accounted_for = { $$scope: 1 };
	    let i = levels.length;
	    while (i--) {
	        const o = levels[i];
	        const n = updates[i];
	        if (n) {
	            for (const key in o) {
	                if (!(key in n))
	                    to_null_out[key] = 1;
	            }
	            for (const key in n) {
	                if (!accounted_for[key]) {
	                    update[key] = n[key];
	                    accounted_for[key] = 1;
	                }
	            }
	            levels[i] = n;
	        }
	        else {
	            for (const key in o) {
	                accounted_for[key] = 1;
	            }
	        }
	    }
	    for (const key in to_null_out) {
	        if (!(key in update))
	            update[key] = undefined;
	    }
	    return update;
	}
	function create_component(block) {
	    block && block.c();
	}
	function mount_component(component, target, anchor, customElement) {
	    const { fragment, on_mount, on_destroy, after_update } = component.$$;
	    fragment && fragment.m(target, anchor);
	    if (!customElement) {
	        // onMount happens before the initial afterUpdate
	        add_render_callback(() => {
	            const new_on_destroy = on_mount.map(run).filter(is_function);
	            if (on_destroy) {
	                on_destroy.push(...new_on_destroy);
	            }
	            else {
	                // Edge case - component was destroyed immediately,
	                // most likely as a result of a binding initialising
	                run_all(new_on_destroy);
	            }
	            component.$$.on_mount = [];
	        });
	    }
	    after_update.forEach(add_render_callback);
	}
	function destroy_component(component, detaching) {
	    const $$ = component.$$;
	    if ($$.fragment !== null) {
	        run_all($$.on_destroy);
	        $$.fragment && $$.fragment.d(detaching);
	        // TODO null out other refs, including component.$$ (but need to
	        // preserve final state?)
	        $$.on_destroy = $$.fragment = null;
	        $$.ctx = [];
	    }
	}
	function make_dirty(component, i) {
	    if (component.$$.dirty[0] === -1) {
	        dirty_components.push(component);
	        schedule_update();
	        component.$$.dirty.fill(0);
	    }
	    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
	}
	function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
	    const parent_component = current_component;
	    set_current_component(component);
	    const $$ = component.$$ = {
	        fragment: null,
	        ctx: null,
	        // state
	        props,
	        update: noop$1,
	        not_equal,
	        bound: blank_object(),
	        // lifecycle
	        on_mount: [],
	        on_destroy: [],
	        on_disconnect: [],
	        before_update: [],
	        after_update: [],
	        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
	        // everything else
	        callbacks: blank_object(),
	        dirty,
	        skip_bound: false,
	        root: options.target || parent_component.$$.root
	    };
	    append_styles && append_styles($$.root);
	    let ready = false;
	    $$.ctx = instance
	        ? instance(component, options.props || {}, (i, ret, ...rest) => {
	            const value = rest.length ? rest[0] : ret;
	            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
	                if (!$$.skip_bound && $$.bound[i])
	                    $$.bound[i](value);
	                if (ready)
	                    make_dirty(component, i);
	            }
	            return ret;
	        })
	        : [];
	    $$.update();
	    ready = true;
	    run_all($$.before_update);
	    // `false` as a special case of no DOM component
	    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	    if (options.target) {
	        if (options.hydrate) {
	            const nodes = children(options.target);
	            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	            $$.fragment && $$.fragment.l(nodes);
	            nodes.forEach(detach);
	        }
	        else {
	            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	            $$.fragment && $$.fragment.c();
	        }
	        if (options.intro)
	            transition_in(component.$$.fragment);
	        mount_component(component, options.target, options.anchor, options.customElement);
	        flush();
	    }
	    set_current_component(parent_component);
	}
	/**
	 * Base class for Svelte components. Used when dev=false.
	 */
	class SvelteComponent {
	    $destroy() {
	        destroy_component(this, 1);
	        this.$destroy = noop$1;
	    }
	    $on(type, callback) {
	        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
	        callbacks.push(callback);
	        return () => {
	            const index = callbacks.indexOf(callback);
	            if (index !== -1)
	                callbacks.splice(index, 1);
	        };
	    }
	    $set($$props) {
	        if (this.$$set && !is_empty($$props)) {
	            this.$$.skip_bound = true;
	            this.$$set($$props);
	            this.$$.skip_bound = false;
	        }
	    }
	}

	function dispatch_dev(type, detail) {
	    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
	}
	function append_dev(target, node) {
	    dispatch_dev('SvelteDOMInsert', { target, node });
	    append(target, node);
	}
	function insert_dev(target, node, anchor) {
	    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
	    insert(target, node, anchor);
	}
	function detach_dev(node) {
	    dispatch_dev('SvelteDOMRemove', { node });
	    detach(node);
	}
	function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
	    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
	    if (has_prevent_default)
	        modifiers.push('preventDefault');
	    if (has_stop_propagation)
	        modifiers.push('stopPropagation');
	    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
	    const dispose = listen(node, event, handler, options);
	    return () => {
	        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
	        dispose();
	    };
	}
	function attr_dev(node, attribute, value) {
	    attr(node, attribute, value);
	    if (value == null)
	        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
	    else
	        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
	}
	function set_data_dev(text, data) {
	    data = '' + data;
	    if (text.wholeText === data)
	        return;
	    dispatch_dev('SvelteDOMSetData', { node: text, data });
	    text.data = data;
	}
	function validate_each_argument(arg) {
	    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
	        let msg = '{#each} only iterates over array-like objects.';
	        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
	            msg += ' You can use a spread to convert this iterable into an array.';
	        }
	        throw new Error(msg);
	    }
	}
	function validate_slots(name, slot, keys) {
	    for (const slot_key of Object.keys(slot)) {
	        if (!~keys.indexOf(slot_key)) {
	            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
	        }
	    }
	}
	/**
	 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
	 */
	class SvelteComponentDev extends SvelteComponent {
	    constructor(options) {
	        if (!options || (!options.target && !options.$$inline)) {
	            throw new Error("'target' is a required option");
	        }
	        super();
	    }
	    $destroy() {
	        super.$destroy();
	        this.$destroy = () => {
	            console.warn('Component was already destroyed'); // eslint-disable-line no-console
	        };
	    }
	    $capture_state() { }
	    $inject_state() { }
	}

	/* src/Credits.svelte generated by Svelte v3.44.2 */
	const file$p = "src/Credits.svelte";

	function create_fragment$p(ctx) {
		let div10;
		let nav;
		let div1;
		let div0;
		let img;
		let img_src_value;
		let t0;
		let button;
		let t1;
		let div5;
		let div4;
		let h2;
		let t3;
		let div3;
		let div2;
		let p0;
		let t5;
		let p1;
		let t7;
		let p2;
		let t8;
		let a0;
		let t10;
		let a1;
		let t12;
		let t13;
		let div9;
		let div8;
		let div7;
		let div6;
		let p3;
		let t14;
		let a2;
		let t16;
		let p4;
		let t17;
		let a3;
		let t19;
		let a4;
		let t21;
		let a5;
		let t23;
		let a6;
		let t25;
		let a7;
		let t27;
		let t28;
		let p5;
		let t29;
		let a8;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				div10 = element("div");
				nav = element("nav");
				div1 = element("div");
				div0 = element("div");
				img = element("img");
				t0 = space();
				button = element("button");
				t1 = space();
				div5 = element("div");
				div4 = element("div");
				h2 = element("h2");
				h2.textContent = "About Libraree";
				t3 = space();
				div3 = element("div");
				div2 = element("div");
				p0 = element("p");
				p0.textContent = "The Libraree web site and app was created by me, Chris Wood, as a\n                        personal project. I'm a software developer by profession, but also a lover\n                        of books and public libraries.";
				t5 = space();
				p1 = element("p");
				p1.textContent = "I live on the boundaries of several Local and Unitary Authorities so I'm\n                        a member of several different library services, including Wigan, Manchester and \n                        Lancashire. So whenever there's a book I'd like to read, I would end up searching\n                        each library service's catalogue individually.";
				t7 = space();
				p2 = element("p");
				t8 = text("Having discovered a ");
				a0 = element("a");
				a0.textContent = "code library";
				t10 = text(" written by the ");
				a1 = element("a");
				a1.textContent = "Libraries Hacked";
				t12 = text(" project that allows library catalogues to be\n                        searched by apps instead of humans, I realised that it would be possible to create\n                        an app that could search across all my local library services in one go. Libraree\n                        is that app!");
				t13 = space();
				div9 = element("div");
				div8 = element("div");
				div7 = element("div");
				div6 = element("div");
				p3 = element("p");
				t14 = text("Libraree was written with ");
				a2 = element("a");
				a2.textContent = "Svelte";
				t16 = space();
				p4 = element("p");
				t17 = text("It relies on the ");
				a3 = element("a");
				a3.textContent = "catalogues-library package";
				t19 = text(" written by the ");
				a4 = element("a");
				a4.textContent = "Libraries Hacked";
				t21 = text(" project\n                        for catalogue data, together with the ");
				a5 = element("a");
				a5.textContent = "Google Books API";
				t23 = text("\n                        for book information and cover images and the ");
				a6 = element("a");
				a6.textContent = "the ThingISBN API";
				t25 = text(" from ");
				a7 = element("a");
				a7.textContent = "LibraryThing";
				t27 = text(" for ISBN data.");
				t28 = space();
				p5 = element("p");
				t29 = text("Libraree is an open source project. ");
				a8 = element("a");
				a8.textContent = "Get involved over at GitHub!";
				if (!src_url_equal(img.src, img_src_value = "/images/Libraree-light.png")) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "Libraree");
				attr_dev(img, "class", "small-logo");
				add_location(img, file$p, 22, 16, 454);
				attr_dev(div0, "class", "col text-center");
				add_location(div0, file$p, 21, 12, 408);
				attr_dev(button, "type", "button");
				attr_dev(button, "class", "btn-close");
				attr_dev(button, "aria-label", "Close");
				add_location(button, file$p, 24, 12, 560);
				attr_dev(div1, "id", "header");
				attr_dev(div1, "class", "row p-2 svelte-1rdsuq8");
				add_location(div1, file$p, 20, 8, 362);
				attr_dev(nav, "class", "fixed-top");
				add_location(nav, file$p, 19, 4, 330);
				attr_dev(h2, "class", "text-center m-5");
				add_location(h2, file$p, 29, 12, 751);
				add_location(p0, file$p, 32, 20, 894);
				add_location(p1, file$p, 37, 20, 1187);
				attr_dev(a0, "class", "primary-link");
				attr_dev(a0, "href", "https://github.com/LibrariesHacked/catalogues-library");
				attr_dev(a0, "target", "_blank");
				add_location(a0, file$p, 44, 44, 1663);
				attr_dev(a1, "class", "primary-link");
				attr_dev(a1, "href", "https://www.librarieshacked.org/");
				attr_dev(a1, "target", "_blank");
				add_location(a1, file$p, 44, 177, 1796);
				add_location(p2, file$p, 43, 20, 1615);
				attr_dev(div2, "class", "card-body");
				add_location(div2, file$p, 31, 16, 850);
				attr_dev(div3, "class", "card m-2");
				add_location(div3, file$p, 30, 12, 811);
				attr_dev(div4, "class", "col");
				add_location(div4, file$p, 28, 8, 721);
				attr_dev(div5, "id", "main");
				attr_dev(div5, "class", "row svelte-1rdsuq8");
				add_location(div5, file$p, 27, 4, 685);
				attr_dev(a2, "class", "primary-link");
				attr_dev(a2, "href", "https://svelte.dev/");
				attr_dev(a2, "target", "_blank");
				add_location(a2, file$p, 57, 49, 2469);
				add_location(p3, file$p, 57, 20, 2440);
				attr_dev(a3, "class", "primary-link");
				attr_dev(a3, "href", "https://github.com/LibrariesHacked/catalogues-library");
				attr_dev(a3, "target", "_blank");
				add_location(a3, file$p, 59, 41, 2616);
				attr_dev(a4, "class", "primary-link");
				attr_dev(a4, "href", "https://www.librarieshacked.org/");
				attr_dev(a4, "target", "_blank");
				add_location(a4, file$p, 59, 188, 2763);
				attr_dev(a5, "class", "primary-link");
				attr_dev(a5, "href", "https://developers.google.com/books/docs/overview");
				attr_dev(a5, "target", "_blank");
				add_location(a5, file$p, 60, 62, 2934);
				attr_dev(a6, "class", "primary-link");
				attr_dev(a6, "href", "https://wiki.librarything.com/index.php/LibraryThing_APIs");
				attr_dev(a6, "target", "_blank");
				add_location(a6, file$p, 61, 70, 3122);
				attr_dev(a7, "class", "primary-link");
				attr_dev(a7, "href", "https://www.librarything.com/");
				attr_dev(a7, "target", "_blank");
				add_location(a7, file$p, 61, 202, 3254);
				add_location(p4, file$p, 58, 20, 2571);
				attr_dev(a8, "class", "primary-link");
				attr_dev(a8, "href", "https://github.com/cpwood/libraree/");
				attr_dev(a8, "target", "_blank");
				add_location(a8, file$p, 64, 60, 3472);
				add_location(p5, file$p, 63, 20, 3408);
				attr_dev(div6, "class", "card-body text-center");
				add_location(div6, file$p, 56, 16, 2384);
				attr_dev(div7, "class", "card m-2");
				add_location(div7, file$p, 55, 12, 2345);
				attr_dev(div8, "class", "col");
				add_location(div8, file$p, 54, 8, 2315);
				attr_dev(div9, "class", "row");
				add_location(div9, file$p, 53, 4, 2289);
				attr_dev(div10, "class", "container");
				add_location(div10, file$p, 18, 0, 302);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div10, anchor);
				append_dev(div10, nav);
				append_dev(nav, div1);
				append_dev(div1, div0);
				append_dev(div0, img);
				append_dev(div1, t0);
				append_dev(div1, button);
				append_dev(div10, t1);
				append_dev(div10, div5);
				append_dev(div5, div4);
				append_dev(div4, h2);
				append_dev(div4, t3);
				append_dev(div4, div3);
				append_dev(div3, div2);
				append_dev(div2, p0);
				append_dev(div2, t5);
				append_dev(div2, p1);
				append_dev(div2, t7);
				append_dev(div2, p2);
				append_dev(p2, t8);
				append_dev(p2, a0);
				append_dev(p2, t10);
				append_dev(p2, a1);
				append_dev(p2, t12);
				append_dev(div10, t13);
				append_dev(div10, div9);
				append_dev(div9, div8);
				append_dev(div8, div7);
				append_dev(div7, div6);
				append_dev(div6, p3);
				append_dev(p3, t14);
				append_dev(p3, a2);
				append_dev(div6, t16);
				append_dev(div6, p4);
				append_dev(p4, t17);
				append_dev(p4, a3);
				append_dev(p4, t19);
				append_dev(p4, a4);
				append_dev(p4, t21);
				append_dev(p4, a5);
				append_dev(p4, t23);
				append_dev(p4, a6);
				append_dev(p4, t25);
				append_dev(p4, a7);
				append_dev(p4, t27);
				append_dev(div6, t28);
				append_dev(div6, p5);
				append_dev(p5, t29);
				append_dev(p5, a8);

				if (!mounted) {
					dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false);
					mounted = true;
				}
			},
			p: noop$1,
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) detach_dev(div10);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$p.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$p($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Credits', slots, []);
		const dispatch = createEventDispatcher();

		function goHome() {
			dispatch('home');
		}

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Credits> was created with unknown prop '${key}'`);
		});

		const click_handler = () => goHome();
		$$self.$capture_state = () => ({ createEventDispatcher, dispatch, goHome });
		return [goHome, click_handler];
	}

	class Credits extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Credits",
				options,
				id: create_fragment$p.name
			});
		}
	}

	function getOriginalBodyPadding() {
	  const style = window ? window.getComputedStyle(document.body, null) : {};

	  return parseInt((style && style.getPropertyValue('padding-right')) || 0, 10);
	}

	function getScrollbarWidth() {
	  let scrollDiv = document.createElement('div');
	  // .modal-scrollbar-measure styles // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/scss/_modal.scss#L106-L113
	  scrollDiv.style.position = 'absolute';
	  scrollDiv.style.top = '-9999px';
	  scrollDiv.style.width = '50px';
	  scrollDiv.style.height = '50px';
	  scrollDiv.style.overflow = 'scroll';
	  document.body.appendChild(scrollDiv);
	  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	  document.body.removeChild(scrollDiv);
	  return scrollbarWidth;
	}

	function setScrollbarWidth(padding) {
	  document.body.style.paddingRight = padding > 0 ? `${padding}px` : null;
	}

	function isBodyOverflowing() {
	  return window ? document.body.clientWidth < window.innerWidth : false;
	}

	function conditionallyUpdateScrollbar() {
	  const scrollbarWidth = getScrollbarWidth();
	  // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/js/src/modal.js#L433
	  const fixedContent = document.querySelectorAll(
	    '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
	  )[0];
	  const bodyPadding = fixedContent
	    ? parseInt(fixedContent.style.paddingRight || 0, 10)
	    : 0;

	  if (isBodyOverflowing()) {
	    setScrollbarWidth(bodyPadding + scrollbarWidth);
	  }
	}

	function browserEvent(target, ...args) {
	  target.addEventListener(...args);

	  return () => target.removeEventListener(...args);
	}

	function toClassName(value) {
	  let result = '';

	  if (typeof value === 'string' || typeof value === 'number') {
	    result += value;
	  } else if (typeof value === 'object') {
	    if (Array.isArray(value)) {
	      result = value.map(toClassName).filter(Boolean).join(' ');
	    } else {
	      for (let key in value) {
	        if (value[key]) {
	          result && (result += ' ');
	          result += key;
	        }
	      }
	    }
	  }

	  return result;
	}

	function classnames(...args) {
	  return args.map(toClassName).filter(Boolean).join(' ');
	}

	function getTransitionDuration(element) {
	  if (!element) return 0;

	  // Get transition-duration of the element
	  let { transitionDuration, transitionDelay } =
	    window.getComputedStyle(element);

	  const floatTransitionDuration = Number.parseFloat(transitionDuration);
	  const floatTransitionDelay = Number.parseFloat(transitionDelay);

	  // Return 0 if element or transition duration is not found
	  if (!floatTransitionDuration && !floatTransitionDelay) {
	    return 0;
	  }

	  // If multiple durations are defined, take the first
	  transitionDuration = transitionDuration.split(',')[0];
	  transitionDelay = transitionDelay.split(',')[0];

	  return (
	    (Number.parseFloat(transitionDuration) +
	      Number.parseFloat(transitionDelay)) *
	    1000
	  );
	}

	const subscriber_queue = [];
	/**
	 * Create a `Writable` store that allows both updating and reading by subscription.
	 * @param {*=}value initial value
	 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
	 */
	function writable(value, start = noop$1) {
	    let stop;
	    const subscribers = new Set();
	    function set(new_value) {
	        if (safe_not_equal(value, new_value)) {
	            value = new_value;
	            if (stop) { // store is ready
	                const run_queue = !subscriber_queue.length;
	                for (const subscriber of subscribers) {
	                    subscriber[1]();
	                    subscriber_queue.push(subscriber, value);
	                }
	                if (run_queue) {
	                    for (let i = 0; i < subscriber_queue.length; i += 2) {
	                        subscriber_queue[i][0](subscriber_queue[i + 1]);
	                    }
	                    subscriber_queue.length = 0;
	                }
	            }
	        }
	    }
	    function update(fn) {
	        set(fn(value));
	    }
	    function subscribe(run, invalidate = noop$1) {
	        const subscriber = [run, invalidate];
	        subscribers.add(subscriber);
	        if (subscribers.size === 1) {
	            stop = start(set) || noop$1;
	        }
	        run(value);
	        return () => {
	            subscribers.delete(subscriber);
	            if (subscribers.size === 0) {
	                stop();
	                stop = null;
	            }
	        };
	    }
	    return { set, update, subscribe };
	}

	/* node_modules/sveltestrap/src/Accordion.svelte generated by Svelte v3.44.2 */
	const file$o = "node_modules/sveltestrap/src/Accordion.svelte";

	function create_fragment$o(ctx) {
		let div;
		let current;
		const default_slot_template = /*#slots*/ ctx[7].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
		let div_levels = [{ class: /*classes*/ ctx[0] }, /*$$restProps*/ ctx[2]];
		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		const block = {
			c: function create() {
				div = element("div");
				if (default_slot) default_slot.c();
				set_attributes(div, div_data);
				add_location(div, file$o, 29, 0, 643);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[6],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
							null
						);
					}
				}

				set_attributes(div, div_data = get_spread_update(div_levels, [
					(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] },
					dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$o.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$o($$self, $$props, $$invalidate) {
		let classes;
		const omit_props_names = ["flush","stayOpen","class"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let $open;
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Accordion', slots, ['default']);
		const dispatch = createEventDispatcher();
		let { flush = false } = $$props;
		let { stayOpen = false } = $$props;
		let { class: className = '' } = $$props;
		const open = writable();
		validate_store(open, 'open');
		component_subscribe($$self, open, value => $$invalidate(8, $open = value));

		setContext('accordion', {
			open,
			stayOpen,
			toggle: id => {
				if ($open === id) open.set(); else open.set(id);
				dispatch('toggle', { [id]: $open === id });
			}
		});

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('flush' in $$new_props) $$invalidate(3, flush = $$new_props.flush);
			if ('stayOpen' in $$new_props) $$invalidate(4, stayOpen = $$new_props.stayOpen);
			if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
			if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({
			classnames,
			createEventDispatcher,
			setContext,
			writable,
			dispatch,
			flush,
			stayOpen,
			className,
			open,
			classes,
			$open
		});

		$$self.$inject_state = $$new_props => {
			if ('flush' in $$props) $$invalidate(3, flush = $$new_props.flush);
			if ('stayOpen' in $$props) $$invalidate(4, stayOpen = $$new_props.stayOpen);
			if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
			if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*className, flush*/ 40) {
				$$invalidate(0, classes = classnames(className, 'accordion', { 'accordion-flush': flush }));
			}
		};

		return [classes, open, $$restProps, flush, stayOpen, className, $$scope, slots];
	}

	class Accordion extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$o, create_fragment$o, safe_not_equal, { flush: 3, stayOpen: 4, class: 5 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Accordion",
				options,
				id: create_fragment$o.name
			});
		}

		get flush() {
			throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set flush(value) {
			throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get stayOpen() {
			throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set stayOpen(value) {
			throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get class() {
			throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* node_modules/sveltestrap/src/AccordionHeader.svelte generated by Svelte v3.44.2 */
	const file$n = "node_modules/sveltestrap/src/AccordionHeader.svelte";

	function create_fragment$n(ctx) {
		let h2;
		let button;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[4].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
		let h2_levels = [{ class: "accordion-header" }, /*$$restProps*/ ctx[1]];
		let h2_data = {};

		for (let i = 0; i < h2_levels.length; i += 1) {
			h2_data = assign(h2_data, h2_levels[i]);
		}

		const block = {
			c: function create() {
				h2 = element("h2");
				button = element("button");
				if (default_slot) default_slot.c();
				attr_dev(button, "type", "button");
				attr_dev(button, "class", /*classes*/ ctx[0]);
				add_location(button, file$n, 9, 2, 219);
				set_attributes(h2, h2_data);
				add_location(h2, file$n, 8, 0, 170);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, h2, anchor);
				append_dev(h2, button);

				if (default_slot) {
					default_slot.m(button, null);
				}

				current = true;

				if (!mounted) {
					dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[3],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
							null
						);
					}
				}

				if (!current || dirty & /*classes*/ 1) {
					attr_dev(button, "class", /*classes*/ ctx[0]);
				}

				set_attributes(h2, h2_data = get_spread_update(h2_levels, [
					{ class: "accordion-header" },
					dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(h2);
				if (default_slot) default_slot.d(detaching);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$n.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$n($$self, $$props, $$invalidate) {
		let classes;
		const omit_props_names = ["class"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('AccordionHeader', slots, ['default']);
		let { class: className = '' } = $$props;

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
			if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({ classnames, className, classes });

		$$self.$inject_state = $$new_props => {
			if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
			if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*className*/ 4) {
				$$invalidate(0, classes = classnames(className, 'accordion-button'));
			}
		};

		return [classes, $$restProps, className, $$scope, slots, click_handler];
	}

	class AccordionHeader extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$n, create_fragment$n, safe_not_equal, { class: 2 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "AccordionHeader",
				options,
				id: create_fragment$n.name
			});
		}

		get class() {
			throw new Error("<AccordionHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<AccordionHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	function backdropIn(node) {
	  node.style.display = 'block';

	  const duration = getTransitionDuration(node);

	  return {
	    duration,
	    tick: (t) => {
	      if (t === 0) {
	        node.classList.add('show');
	      }
	    }
	  };
	}

	function backdropOut(node) {
	  node.classList.remove('show');
	  const duration = getTransitionDuration(node);

	  return {
	    duration,
	    tick: (t) => {
	      if (t === 0) {
	        node.style.display = 'none';
	      }
	    }
	  };
	}

	function collapseOut(node) {
	  node.style.height = `${node.getBoundingClientRect().height}px`;
	  node.classList.add('collapsing');
	  node.classList.remove('collapse', 'show');
	  const duration = getTransitionDuration(node);

	  return {
	    duration,
	    tick: (t) => {
	      if (t > 0) {
	        node.style.height = '';
	      } else if (t === 0) {
	        node.classList.remove('collapsing');
	        node.classList.add('collapse');
	      }
	    }
	  };
	}

	function collapseIn(node) {
	  node.classList.add('collapsing');
	  node.classList.remove('collapse', 'show');
	  node.style.height = 0;
	  const duration = getTransitionDuration(node);

	  return {
	    duration,
	    tick: (t) => {
	      if (t < 1) {
	        node.style.height = `${node.scrollHeight}px`;
	      } else {
	        node.classList.remove('collapsing');
	        node.classList.add('collapse', 'show');
	        node.style.height = '';
	      }
	    }
	  };
	}

	function modalIn(node) {
	  node.style.display = 'block';
	  const duration = getTransitionDuration(node);

	  return {
	    duration,
	    tick: (t) => {
	      if (t > 0) {
	        node.classList.add('show');
	      }
	    }
	  };
	}

	function modalOut(node) {
	  node.classList.remove('show');
	  const duration = getTransitionDuration(node);

	  return {
	    duration,
	    tick: (t) => {
	      if (t === 1) {
	        node.style.display = 'none';
	      }
	    }
	  };
	}

	const defaultToggleEvents = ['touchstart', 'click'];

	var toggle = (toggler, togglerFn) => {
	  let unbindEvents;

	  if (
	    typeof toggler === 'string' &&
	    typeof window !== 'undefined' &&
	    document &&
	    document.createElement
	  ) {
	    let selection = document.querySelectorAll(toggler);
	    if (!selection.length) {
	      selection = document.querySelectorAll(`#${toggler}`);
	    }
	    if (!selection.length) {
	      throw new Error(
	        `The target '${toggler}' could not be identified in the dom, tip: check spelling`
	      );
	    }

	    defaultToggleEvents.forEach((event) => {
	      selection.forEach((element) => {
	        element.addEventListener(event, togglerFn);
	      });
	    });

	    unbindEvents = () => {
	      defaultToggleEvents.forEach((event) => {
	        selection.forEach((element) => {
	          element.removeEventListener(event, togglerFn);
	        });
	      });
	    };
	  }

	  return () => {
	    if (typeof unbindEvents === 'function') {
	      unbindEvents();
	      unbindEvents = undefined;
	    }
	  };
	};

	/* node_modules/sveltestrap/src/Collapse.svelte generated by Svelte v3.44.2 */
	const file$m = "node_modules/sveltestrap/src/Collapse.svelte";

	// (57:0) {#if isOpen}
	function create_if_block$e(ctx) {
		let div;
		let div_style_value;
		let div_intro;
		let div_outro;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[15].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

		let div_levels = [
			{
				style: div_style_value = /*navbar*/ ctx[1] ? undefined : 'overflow: hidden;'
			},
			/*$$restProps*/ ctx[8],
			{ class: /*classes*/ ctx[7] }
		];

		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		const block = {
			c: function create() {
				div = element("div");
				if (default_slot) default_slot.c();
				set_attributes(div, div_data);
				add_location(div, file$m, 57, 2, 1471);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(div, "introstart", /*introstart_handler*/ ctx[16], false, false, false),
						listen_dev(div, "introend", /*introend_handler*/ ctx[17], false, false, false),
						listen_dev(div, "outrostart", /*outrostart_handler*/ ctx[18], false, false, false),
						listen_dev(div, "outroend", /*outroend_handler*/ ctx[19], false, false, false),
						listen_dev(
							div,
							"introstart",
							function () {
								if (is_function(/*onEntering*/ ctx[2])) /*onEntering*/ ctx[2].apply(this, arguments);
							},
							false,
							false,
							false
						),
						listen_dev(
							div,
							"introend",
							function () {
								if (is_function(/*onEntered*/ ctx[3])) /*onEntered*/ ctx[3].apply(this, arguments);
							},
							false,
							false,
							false
						),
						listen_dev(
							div,
							"outrostart",
							function () {
								if (is_function(/*onExiting*/ ctx[4])) /*onExiting*/ ctx[4].apply(this, arguments);
							},
							false,
							false,
							false
						),
						listen_dev(
							div,
							"outroend",
							function () {
								if (is_function(/*onExited*/ ctx[5])) /*onExited*/ ctx[5].apply(this, arguments);
							},
							false,
							false,
							false
						)
					];

					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;

				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[14],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
							null
						);
					}
				}

				set_attributes(div, div_data = get_spread_update(div_levels, [
					(!current || dirty & /*navbar*/ 2 && div_style_value !== (div_style_value = /*navbar*/ ctx[1] ? undefined : 'overflow: hidden;')) && { style: div_style_value },
					dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8],
					(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);

				add_render_callback(() => {
					if (div_outro) div_outro.end(1);
					div_intro = create_in_transition(div, collapseIn, {});
					div_intro.start();
				});

				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				if (div_intro) div_intro.invalidate();
				div_outro = create_out_transition(div, collapseOut, {});
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (default_slot) default_slot.d(detaching);
				if (detaching && div_outro) div_outro.end();
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$e.name,
			type: "if",
			source: "(57:0) {#if isOpen}",
			ctx
		});

		return block;
	}

	function create_fragment$m(ctx) {
		let if_block_anchor;
		let current;
		let mounted;
		let dispose;
		add_render_callback(/*onwindowresize*/ ctx[20]);
		let if_block = /*isOpen*/ ctx[0] && create_if_block$e(ctx);

		const block = {
			c: function create() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;

				if (!mounted) {
					dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[20]);
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (/*isOpen*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*isOpen*/ 1) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block$e(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (if_block) if_block.d(detaching);
				if (detaching) detach_dev(if_block_anchor);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$m.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$m($$self, $$props, $$invalidate) {
		let classes;

		const omit_props_names = [
			"isOpen","class","navbar","onEntering","onEntered","onExiting","onExited","expand","toggler"
		];

		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Collapse', slots, ['default']);
		const dispatch = createEventDispatcher();
		let { isOpen = false } = $$props;
		let { class: className = '' } = $$props;
		let { navbar = false } = $$props;
		let { onEntering = () => dispatch('opening') } = $$props;
		let { onEntered = () => dispatch('open') } = $$props;
		let { onExiting = () => dispatch('closing') } = $$props;
		let { onExited = () => dispatch('close') } = $$props;
		let { expand = false } = $$props;
		let { toggler = null } = $$props;

		onMount(() => toggle(toggler, e => {
			$$invalidate(0, isOpen = !isOpen);
			e.preventDefault();
		}));

		let windowWidth = 0;
		let _wasMaximized = false;

		// TODO wrong to hardcode these here - come from Bootstrap CSS only
		const minWidth = {};

		minWidth['xs'] = 0;
		minWidth['sm'] = 576;
		minWidth['md'] = 768;
		minWidth['lg'] = 992;
		minWidth['xl'] = 1200;

		function notify() {
			dispatch('update', isOpen);
		}

		function introstart_handler(event) {
			bubble.call(this, $$self, event);
		}

		function introend_handler(event) {
			bubble.call(this, $$self, event);
		}

		function outrostart_handler(event) {
			bubble.call(this, $$self, event);
		}

		function outroend_handler(event) {
			bubble.call(this, $$self, event);
		}

		function onwindowresize() {
			$$invalidate(6, windowWidth = window.innerWidth);
		}

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
			if ('class' in $$new_props) $$invalidate(9, className = $$new_props.class);
			if ('navbar' in $$new_props) $$invalidate(1, navbar = $$new_props.navbar);
			if ('onEntering' in $$new_props) $$invalidate(2, onEntering = $$new_props.onEntering);
			if ('onEntered' in $$new_props) $$invalidate(3, onEntered = $$new_props.onEntered);
			if ('onExiting' in $$new_props) $$invalidate(4, onExiting = $$new_props.onExiting);
			if ('onExited' in $$new_props) $$invalidate(5, onExited = $$new_props.onExited);
			if ('expand' in $$new_props) $$invalidate(10, expand = $$new_props.expand);
			if ('toggler' in $$new_props) $$invalidate(11, toggler = $$new_props.toggler);
			if ('$$scope' in $$new_props) $$invalidate(14, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({
			createEventDispatcher,
			onMount,
			collapseIn,
			collapseOut,
			classnames,
			toggle,
			dispatch,
			isOpen,
			className,
			navbar,
			onEntering,
			onEntered,
			onExiting,
			onExited,
			expand,
			toggler,
			windowWidth,
			_wasMaximized,
			minWidth,
			notify,
			classes
		});

		$$self.$inject_state = $$new_props => {
			if ('isOpen' in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
			if ('className' in $$props) $$invalidate(9, className = $$new_props.className);
			if ('navbar' in $$props) $$invalidate(1, navbar = $$new_props.navbar);
			if ('onEntering' in $$props) $$invalidate(2, onEntering = $$new_props.onEntering);
			if ('onEntered' in $$props) $$invalidate(3, onEntered = $$new_props.onEntered);
			if ('onExiting' in $$props) $$invalidate(4, onExiting = $$new_props.onExiting);
			if ('onExited' in $$props) $$invalidate(5, onExited = $$new_props.onExited);
			if ('expand' in $$props) $$invalidate(10, expand = $$new_props.expand);
			if ('toggler' in $$props) $$invalidate(11, toggler = $$new_props.toggler);
			if ('windowWidth' in $$props) $$invalidate(6, windowWidth = $$new_props.windowWidth);
			if ('_wasMaximized' in $$props) $$invalidate(12, _wasMaximized = $$new_props._wasMaximized);
			if ('classes' in $$props) $$invalidate(7, classes = $$new_props.classes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*className, navbar*/ 514) {
				$$invalidate(7, classes = classnames(className, navbar && 'navbar-collapse'));
			}

			if ($$self.$$.dirty & /*navbar, expand, windowWidth, minWidth, isOpen, _wasMaximized*/ 13379) {
				if (navbar && expand) {
					if (windowWidth >= minWidth[expand] && !isOpen) {
						$$invalidate(0, isOpen = true);
						$$invalidate(12, _wasMaximized = true);
						notify();
					} else if (windowWidth < minWidth[expand] && _wasMaximized) {
						$$invalidate(0, isOpen = false);
						$$invalidate(12, _wasMaximized = false);
						notify();
					}
				}
			}
		};

		return [
			isOpen,
			navbar,
			onEntering,
			onEntered,
			onExiting,
			onExited,
			windowWidth,
			classes,
			$$restProps,
			className,
			expand,
			toggler,
			_wasMaximized,
			minWidth,
			$$scope,
			slots,
			introstart_handler,
			introend_handler,
			outrostart_handler,
			outroend_handler,
			onwindowresize
		];
	}

	class Collapse extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance$m, create_fragment$m, safe_not_equal, {
				isOpen: 0,
				class: 9,
				navbar: 1,
				onEntering: 2,
				onEntered: 3,
				onExiting: 4,
				onExited: 5,
				expand: 10,
				toggler: 11
			});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Collapse",
				options,
				id: create_fragment$m.name
			});
		}

		get isOpen() {
			throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set isOpen(value) {
			throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get class() {
			throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get navbar() {
			throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set navbar(value) {
			throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get onEntering() {
			throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set onEntering(value) {
			throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get onEntered() {
			throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set onEntered(value) {
			throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get onExiting() {
			throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set onExiting(value) {
			throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get onExited() {
			throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set onExited(value) {
			throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get expand() {
			throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set expand(value) {
			throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get toggler() {
			throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set toggler(value) {
			throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* node_modules/sveltestrap/src/AccordionItem.svelte generated by Svelte v3.44.2 */
	const file$l = "node_modules/sveltestrap/src/AccordionItem.svelte";
	const get_header_slot_changes = dirty => ({});
	const get_header_slot_context = ctx => ({});

	// (31:2) <AccordionHeader     on:click={() => onToggle()}     class={!accordionOpen && 'collapsed'}   >
	function create_default_slot_1$4(ctx) {
		let t0;
		let t1;
		let current;
		const header_slot_template = /*#slots*/ ctx[9].header;
		const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[16], get_header_slot_context);

		const block = {
			c: function create() {
				if (header_slot) header_slot.c();
				t0 = space();
				t1 = text(/*header*/ ctx[0]);
			},
			m: function mount(target, anchor) {
				if (header_slot) {
					header_slot.m(target, anchor);
				}

				insert_dev(target, t0, anchor);
				insert_dev(target, t1, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (header_slot) {
					if (header_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
						update_slot_base(
							header_slot,
							header_slot_template,
							ctx,
							/*$$scope*/ ctx[16],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
							: get_slot_changes(header_slot_template, /*$$scope*/ ctx[16], dirty, get_header_slot_changes),
							get_header_slot_context
						);
					}
				}

				if (!current || dirty & /*header*/ 1) set_data_dev(t1, /*header*/ ctx[0]);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(header_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(header_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (header_slot) header_slot.d(detaching);
				if (detaching) detach_dev(t0);
				if (detaching) detach_dev(t1);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_1$4.name,
			type: "slot",
			source: "(31:2) <AccordionHeader     on:click={() => onToggle()}     class={!accordionOpen && 'collapsed'}   >",
			ctx
		});

		return block;
	}

	// (38:2) <Collapse     isOpen={accordionOpen}     class="accordion-collapse"     on:introstart     on:introend     on:outrostart     on:outroend   >
	function create_default_slot$4(ctx) {
		let div;
		let current;
		const default_slot_template = /*#slots*/ ctx[9].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

		const block = {
			c: function create() {
				div = element("div");
				if (default_slot) default_slot.c();
				attr_dev(div, "class", "accordion-body");
				add_location(div, file$l, 45, 4, 1133);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[16],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
							null
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot$4.name,
			type: "slot",
			source: "(38:2) <Collapse     isOpen={accordionOpen}     class=\\\"accordion-collapse\\\"     on:introstart     on:introend     on:outrostart     on:outroend   >",
			ctx
		});

		return block;
	}

	function create_fragment$l(ctx) {
		let div;
		let accordionheader;
		let t;
		let collapse;
		let current;

		accordionheader = new AccordionHeader({
				props: {
					class: !/*accordionOpen*/ ctx[2] && 'collapsed',
					$$slots: { default: [create_default_slot_1$4] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		accordionheader.$on("click", /*click_handler*/ ctx[10]);

		collapse = new Collapse({
				props: {
					isOpen: /*accordionOpen*/ ctx[2],
					class: "accordion-collapse",
					$$slots: { default: [create_default_slot$4] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		collapse.$on("introstart", /*introstart_handler*/ ctx[11]);
		collapse.$on("introend", /*introend_handler*/ ctx[12]);
		collapse.$on("outrostart", /*outrostart_handler*/ ctx[13]);
		collapse.$on("outroend", /*outroend_handler*/ ctx[14]);

		const block = {
			c: function create() {
				div = element("div");
				create_component(accordionheader.$$.fragment);
				t = space();
				create_component(collapse.$$.fragment);
				attr_dev(div, "class", /*classes*/ ctx[3]);
				add_location(div, file$l, 29, 0, 783);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				mount_component(accordionheader, div, null);
				append_dev(div, t);
				mount_component(collapse, div, null);
				/*div_binding*/ ctx[15](div);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				const accordionheader_changes = {};
				if (dirty & /*accordionOpen*/ 4) accordionheader_changes.class = !/*accordionOpen*/ ctx[2] && 'collapsed';

				if (dirty & /*$$scope, header*/ 65537) {
					accordionheader_changes.$$scope = { dirty, ctx };
				}

				accordionheader.$set(accordionheader_changes);
				const collapse_changes = {};
				if (dirty & /*accordionOpen*/ 4) collapse_changes.isOpen = /*accordionOpen*/ ctx[2];

				if (dirty & /*$$scope*/ 65536) {
					collapse_changes.$$scope = { dirty, ctx };
				}

				collapse.$set(collapse_changes);

				if (!current || dirty & /*classes*/ 8) {
					attr_dev(div, "class", /*classes*/ ctx[3]);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(accordionheader.$$.fragment, local);
				transition_in(collapse.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(accordionheader.$$.fragment, local);
				transition_out(collapse.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				destroy_component(accordionheader);
				destroy_component(collapse);
				/*div_binding*/ ctx[15](null);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$l.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$l($$self, $$props, $$invalidate) {
		let classes;
		let accordionOpen;
		let $open;
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('AccordionItem', slots, ['header','default']);
		let { class: className = '' } = $$props;
		let { header = '' } = $$props;
		let { active = false } = $$props;
		let accordionId;
		const dispatch = createEventDispatcher();
		const { stayOpen, toggle, open } = getContext('accordion');
		validate_store(open, 'open');
		component_subscribe($$self, open, value => $$invalidate(8, $open = value));

		onMount(() => {
			if (active) toggle(accordionId);
		});

		const onToggle = () => {
			if (stayOpen) $$invalidate(6, active = !active);
			toggle(accordionId);
			dispatch('toggle', !accordionOpen);
		};

		const writable_props = ['class', 'header', 'active'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AccordionItem> was created with unknown prop '${key}'`);
		});

		const click_handler = () => onToggle();

		function introstart_handler(event) {
			bubble.call(this, $$self, event);
		}

		function introend_handler(event) {
			bubble.call(this, $$self, event);
		}

		function outrostart_handler(event) {
			bubble.call(this, $$self, event);
		}

		function outroend_handler(event) {
			bubble.call(this, $$self, event);
		}

		function div_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				accordionId = $$value;
				$$invalidate(1, accordionId);
			});
		}

		$$self.$$set = $$props => {
			if ('class' in $$props) $$invalidate(7, className = $$props.class);
			if ('header' in $$props) $$invalidate(0, header = $$props.header);
			if ('active' in $$props) $$invalidate(6, active = $$props.active);
			if ('$$scope' in $$props) $$invalidate(16, $$scope = $$props.$$scope);
		};

		$$self.$capture_state = () => ({
			createEventDispatcher,
			getContext,
			onMount,
			classnames,
			Collapse,
			AccordionHeader,
			className,
			header,
			active,
			accordionId,
			dispatch,
			stayOpen,
			toggle,
			open,
			onToggle,
			accordionOpen,
			classes,
			$open
		});

		$$self.$inject_state = $$props => {
			if ('className' in $$props) $$invalidate(7, className = $$props.className);
			if ('header' in $$props) $$invalidate(0, header = $$props.header);
			if ('active' in $$props) $$invalidate(6, active = $$props.active);
			if ('accordionId' in $$props) $$invalidate(1, accordionId = $$props.accordionId);
			if ('accordionOpen' in $$props) $$invalidate(2, accordionOpen = $$props.accordionOpen);
			if ('classes' in $$props) $$invalidate(3, classes = $$props.classes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*className*/ 128) {
				$$invalidate(3, classes = classnames(className, 'accordion-item'));
			}

			if ($$self.$$.dirty & /*active, $open, accordionId*/ 322) {
				$$invalidate(2, accordionOpen = stayOpen ? active : $open === accordionId);
			}
		};

		return [
			header,
			accordionId,
			accordionOpen,
			classes,
			open,
			onToggle,
			active,
			className,
			$open,
			slots,
			click_handler,
			introstart_handler,
			introend_handler,
			outrostart_handler,
			outroend_handler,
			div_binding,
			$$scope
		];
	}

	class AccordionItem extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$l, create_fragment$l, safe_not_equal, { class: 7, header: 0, active: 6 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "AccordionItem",
				options,
				id: create_fragment$l.name
			});
		}

		get class() {
			throw new Error("<AccordionItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<AccordionItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get header() {
			throw new Error("<AccordionItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set header(value) {
			throw new Error("<AccordionItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get active() {
			throw new Error("<AccordionItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set active(value) {
			throw new Error("<AccordionItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* node_modules/sveltestrap/src/Badge.svelte generated by Svelte v3.44.2 */
	const file$k = "node_modules/sveltestrap/src/Badge.svelte";

	// (27:0) {:else}
	function create_else_block_1$2(ctx) {
		let span;
		let current_block_type_index;
		let if_block;
		let current;
		const if_block_creators = [create_if_block_2$8, create_else_block_2$1];
		const if_blocks = [];

		function select_block_type_2(ctx, dirty) {
			if (/*children*/ ctx[0]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type_2(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
		let span_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
		let span_data = {};

		for (let i = 0; i < span_levels.length; i += 1) {
			span_data = assign(span_data, span_levels[i]);
		}

		const block = {
			c: function create() {
				span = element("span");
				if_block.c();
				set_attributes(span, span_data);
				add_location(span, file$k, 27, 2, 500);
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
				if_blocks[current_block_type_index].m(span, null);
				current = true;
			},
			p: function update(ctx, dirty) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type_2(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(span, null);
				}

				set_attributes(span, span_data = get_spread_update(span_levels, [
					dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
					(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(span);
				if_blocks[current_block_type_index].d();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block_1$2.name,
			type: "else",
			source: "(27:0) {:else}",
			ctx
		});

		return block;
	}

	// (19:0) {#if href}
	function create_if_block$d(ctx) {
		let a;
		let current_block_type_index;
		let if_block;
		let current;
		const if_block_creators = [create_if_block_1$9, create_else_block$a];
		const if_blocks = [];

		function select_block_type_1(ctx, dirty) {
			if (/*children*/ ctx[0]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type_1(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		let a_levels = [
			/*$$restProps*/ ctx[3],
			{ href: /*href*/ ctx[1] },
			{ class: /*classes*/ ctx[2] }
		];

		let a_data = {};

		for (let i = 0; i < a_levels.length; i += 1) {
			a_data = assign(a_data, a_levels[i]);
		}

		const block = {
			c: function create() {
				a = element("a");
				if_block.c();
				set_attributes(a, a_data);
				add_location(a, file$k, 19, 2, 366);
			},
			m: function mount(target, anchor) {
				insert_dev(target, a, anchor);
				if_blocks[current_block_type_index].m(a, null);
				current = true;
			},
			p: function update(ctx, dirty) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type_1(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(a, null);
				}

				set_attributes(a, a_data = get_spread_update(a_levels, [
					dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
					(!current || dirty & /*href*/ 2) && { href: /*href*/ ctx[1] },
					(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(a);
				if_blocks[current_block_type_index].d();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$d.name,
			type: "if",
			source: "(19:0) {#if href}",
			ctx
		});

		return block;
	}

	// (31:4) {:else}
	function create_else_block_2$1(ctx) {
		let current;
		const default_slot_template = /*#slots*/ ctx[8].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

		const block = {
			c: function create() {
				if (default_slot) default_slot.c();
			},
			m: function mount(target, anchor) {
				if (default_slot) {
					default_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[7],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
							null
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block_2$1.name,
			type: "else",
			source: "(31:4) {:else}",
			ctx
		});

		return block;
	}

	// (29:4) {#if children}
	function create_if_block_2$8(ctx) {
		let t;

		const block = {
			c: function create() {
				t = text(/*children*/ ctx[0]);
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) detach_dev(t);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_2$8.name,
			type: "if",
			source: "(29:4) {#if children}",
			ctx
		});

		return block;
	}

	// (23:4) {:else}
	function create_else_block$a(ctx) {
		let current;
		const default_slot_template = /*#slots*/ ctx[8].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

		const block = {
			c: function create() {
				if (default_slot) default_slot.c();
			},
			m: function mount(target, anchor) {
				if (default_slot) {
					default_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[7],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
							null
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block$a.name,
			type: "else",
			source: "(23:4) {:else}",
			ctx
		});

		return block;
	}

	// (21:4) {#if children}
	function create_if_block_1$9(ctx) {
		let t;

		const block = {
			c: function create() {
				t = text(/*children*/ ctx[0]);
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) detach_dev(t);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1$9.name,
			type: "if",
			source: "(21:4) {#if children}",
			ctx
		});

		return block;
	}

	function create_fragment$k(ctx) {
		let current_block_type_index;
		let if_block;
		let if_block_anchor;
		let current;
		const if_block_creators = [create_if_block$d, create_else_block_1$2];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*href*/ ctx[1]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		const block = {
			c: function create() {
				if_block.c();
				if_block_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if_blocks[current_block_type_index].d(detaching);
				if (detaching) detach_dev(if_block_anchor);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$k.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$k($$self, $$props, $$invalidate) {
		let classes;
		const omit_props_names = ["class","children","color","href","pill"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Badge', slots, ['default']);
		let { class: className = '' } = $$props;
		let { children = undefined } = $$props;
		let { color = 'secondary' } = $$props;
		let { href = undefined } = $$props;
		let { pill = false } = $$props;

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
			if ('children' in $$new_props) $$invalidate(0, children = $$new_props.children);
			if ('color' in $$new_props) $$invalidate(5, color = $$new_props.color);
			if ('href' in $$new_props) $$invalidate(1, href = $$new_props.href);
			if ('pill' in $$new_props) $$invalidate(6, pill = $$new_props.pill);
			if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({
			classnames,
			className,
			children,
			color,
			href,
			pill,
			classes
		});

		$$self.$inject_state = $$new_props => {
			if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
			if ('children' in $$props) $$invalidate(0, children = $$new_props.children);
			if ('color' in $$props) $$invalidate(5, color = $$new_props.color);
			if ('href' in $$props) $$invalidate(1, href = $$new_props.href);
			if ('pill' in $$props) $$invalidate(6, pill = $$new_props.pill);
			if ('classes' in $$props) $$invalidate(2, classes = $$new_props.classes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*className, color, pill*/ 112) {
				$$invalidate(2, classes = classnames(className, 'badge', `bg-${color}`, pill ? 'rounded-pill' : false));
			}
		};

		return [children, href, classes, $$restProps, className, color, pill, $$scope, slots];
	}

	class Badge extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance$k, create_fragment$k, safe_not_equal, {
				class: 4,
				children: 0,
				color: 5,
				href: 1,
				pill: 6
			});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Badge",
				options,
				id: create_fragment$k.name
			});
		}

		get class() {
			throw new Error("<Badge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<Badge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get children() {
			throw new Error("<Badge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set children(value) {
			throw new Error("<Badge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get color() {
			throw new Error("<Badge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set color(value) {
			throw new Error("<Badge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get href() {
			throw new Error("<Badge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set href(value) {
			throw new Error("<Badge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get pill() {
			throw new Error("<Badge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set pill(value) {
			throw new Error("<Badge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* node_modules/sveltestrap/src/Button.svelte generated by Svelte v3.44.2 */
	const file$j = "node_modules/sveltestrap/src/Button.svelte";

	// (50:0) {:else}
	function create_else_block_1$1(ctx) {
		let button;
		let button_aria_label_value;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[18].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
		const default_slot_or_fallback = default_slot || fallback_block$2(ctx);

		let button_levels = [
			/*$$restProps*/ ctx[9],
			{ class: /*classes*/ ctx[7] },
			{ disabled: /*disabled*/ ctx[2] },
			{ value: /*value*/ ctx[5] },
			{
				"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
			},
			{ style: /*style*/ ctx[4] }
		];

		let button_data = {};

		for (let i = 0; i < button_levels.length; i += 1) {
			button_data = assign(button_data, button_levels[i]);
		}

		const block_1 = {
			c: function create() {
				button = element("button");
				if (default_slot_or_fallback) default_slot_or_fallback.c();
				set_attributes(button, button_data);
				add_location(button, file$j, 50, 2, 1044);
			},
			m: function mount(target, anchor) {
				insert_dev(target, button, anchor);

				if (default_slot_or_fallback) {
					default_slot_or_fallback.m(button, null);
				}

				if (button.autofocus) button.focus();
				/*button_binding*/ ctx[22](button);
				current = true;

				if (!mounted) {
					dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[20], false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[17],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
							null
						);
					}
				} else {
					if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*children, $$scope*/ 131074)) {
						default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
					}
				}

				set_attributes(button, button_data = get_spread_update(button_levels, [
					dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
					(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
					(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
					(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
					(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": button_aria_label_value },
					(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot_or_fallback, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot_or_fallback, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(button);
				if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
				/*button_binding*/ ctx[22](null);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: create_else_block_1$1.name,
			type: "else",
			source: "(50:0) {:else}",
			ctx
		});

		return block_1;
	}

	// (33:0) {#if href}
	function create_if_block$c(ctx) {
		let a;
		let current_block_type_index;
		let if_block;
		let a_aria_label_value;
		let current;
		let mounted;
		let dispose;
		const if_block_creators = [create_if_block_1$8, create_else_block$9];
		const if_blocks = [];

		function select_block_type_1(ctx, dirty) {
			if (/*children*/ ctx[1]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type_1(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		let a_levels = [
			/*$$restProps*/ ctx[9],
			{ class: /*classes*/ ctx[7] },
			{ disabled: /*disabled*/ ctx[2] },
			{ href: /*href*/ ctx[3] },
			{
				"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
			},
			{ style: /*style*/ ctx[4] }
		];

		let a_data = {};

		for (let i = 0; i < a_levels.length; i += 1) {
			a_data = assign(a_data, a_levels[i]);
		}

		const block_1 = {
			c: function create() {
				a = element("a");
				if_block.c();
				set_attributes(a, a_data);
				add_location(a, file$j, 33, 2, 786);
			},
			m: function mount(target, anchor) {
				insert_dev(target, a, anchor);
				if_blocks[current_block_type_index].m(a, null);
				/*a_binding*/ ctx[21](a);
				current = true;

				if (!mounted) {
					dispose = listen_dev(a, "click", /*click_handler*/ ctx[19], false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type_1(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(a, null);
				}

				set_attributes(a, a_data = get_spread_update(a_levels, [
					dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
					(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
					(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
					(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
					(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": a_aria_label_value },
					(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(a);
				if_blocks[current_block_type_index].d();
				/*a_binding*/ ctx[21](null);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: create_if_block$c.name,
			type: "if",
			source: "(33:0) {#if href}",
			ctx
		});

		return block_1;
	}

	// (64:6) {:else}
	function create_else_block_2(ctx) {
		let current;
		const default_slot_template = /*#slots*/ ctx[18].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

		const block_1 = {
			c: function create() {
				if (default_slot) default_slot.c();
			},
			m: function mount(target, anchor) {
				if (default_slot) {
					default_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[17],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
							null
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: create_else_block_2.name,
			type: "else",
			source: "(64:6) {:else}",
			ctx
		});

		return block_1;
	}

	// (62:6) {#if children}
	function create_if_block_2$7(ctx) {
		let t;

		const block_1 = {
			c: function create() {
				t = text(/*children*/ ctx[1]);
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) detach_dev(t);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: create_if_block_2$7.name,
			type: "if",
			source: "(62:6) {#if children}",
			ctx
		});

		return block_1;
	}

	// (61:10)        
	function fallback_block$2(ctx) {
		let current_block_type_index;
		let if_block;
		let if_block_anchor;
		let current;
		const if_block_creators = [create_if_block_2$7, create_else_block_2];
		const if_blocks = [];

		function select_block_type_2(ctx, dirty) {
			if (/*children*/ ctx[1]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type_2(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		const block_1 = {
			c: function create() {
				if_block.c();
				if_block_anchor = empty();
			},
			m: function mount(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type_2(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if_blocks[current_block_type_index].d(detaching);
				if (detaching) detach_dev(if_block_anchor);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: fallback_block$2.name,
			type: "fallback",
			source: "(61:10)        ",
			ctx
		});

		return block_1;
	}

	// (46:4) {:else}
	function create_else_block$9(ctx) {
		let current;
		const default_slot_template = /*#slots*/ ctx[18].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

		const block_1 = {
			c: function create() {
				if (default_slot) default_slot.c();
			},
			m: function mount(target, anchor) {
				if (default_slot) {
					default_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[17],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
							null
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: create_else_block$9.name,
			type: "else",
			source: "(46:4) {:else}",
			ctx
		});

		return block_1;
	}

	// (44:4) {#if children}
	function create_if_block_1$8(ctx) {
		let t;

		const block_1 = {
			c: function create() {
				t = text(/*children*/ ctx[1]);
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) detach_dev(t);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: create_if_block_1$8.name,
			type: "if",
			source: "(44:4) {#if children}",
			ctx
		});

		return block_1;
	}

	function create_fragment$j(ctx) {
		let current_block_type_index;
		let if_block;
		let if_block_anchor;
		let current;
		const if_block_creators = [create_if_block$c, create_else_block_1$1];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*href*/ ctx[3]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		const block_1 = {
			c: function create() {
				if_block.c();
				if_block_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if_blocks[current_block_type_index].d(detaching);
				if (detaching) detach_dev(if_block_anchor);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: create_fragment$j.name,
			type: "component",
			source: "",
			ctx
		});

		return block_1;
	}

	function instance$j($$self, $$props, $$invalidate) {
		let ariaLabel;
		let classes;
		let defaultAriaLabel;

		const omit_props_names = [
			"class","active","block","children","close","color","disabled","href","inner","outline","size","style","value"
		];

		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Button', slots, ['default']);
		let { class: className = '' } = $$props;
		let { active = false } = $$props;
		let { block = false } = $$props;
		let { children = undefined } = $$props;
		let { close = false } = $$props;
		let { color = 'secondary' } = $$props;
		let { disabled = false } = $$props;
		let { href = '' } = $$props;
		let { inner = undefined } = $$props;
		let { outline = false } = $$props;
		let { size = null } = $$props;
		let { style = '' } = $$props;
		let { value = '' } = $$props;

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		function click_handler_1(event) {
			bubble.call(this, $$self, event);
		}

		function a_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				inner = $$value;
				$$invalidate(0, inner);
			});
		}

		function button_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				inner = $$value;
				$$invalidate(0, inner);
			});
		}

		$$self.$$set = $$new_props => {
			$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
			$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
			if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
			if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
			if ('children' in $$new_props) $$invalidate(1, children = $$new_props.children);
			if ('close' in $$new_props) $$invalidate(13, close = $$new_props.close);
			if ('color' in $$new_props) $$invalidate(14, color = $$new_props.color);
			if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
			if ('href' in $$new_props) $$invalidate(3, href = $$new_props.href);
			if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
			if ('outline' in $$new_props) $$invalidate(15, outline = $$new_props.outline);
			if ('size' in $$new_props) $$invalidate(16, size = $$new_props.size);
			if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
			if ('value' in $$new_props) $$invalidate(5, value = $$new_props.value);
			if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({
			classnames,
			className,
			active,
			block,
			children,
			close,
			color,
			disabled,
			href,
			inner,
			outline,
			size,
			style,
			value,
			defaultAriaLabel,
			classes,
			ariaLabel
		});

		$$self.$inject_state = $$new_props => {
			$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
			if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
			if ('active' in $$props) $$invalidate(11, active = $$new_props.active);
			if ('block' in $$props) $$invalidate(12, block = $$new_props.block);
			if ('children' in $$props) $$invalidate(1, children = $$new_props.children);
			if ('close' in $$props) $$invalidate(13, close = $$new_props.close);
			if ('color' in $$props) $$invalidate(14, color = $$new_props.color);
			if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
			if ('href' in $$props) $$invalidate(3, href = $$new_props.href);
			if ('inner' in $$props) $$invalidate(0, inner = $$new_props.inner);
			if ('outline' in $$props) $$invalidate(15, outline = $$new_props.outline);
			if ('size' in $$props) $$invalidate(16, size = $$new_props.size);
			if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
			if ('value' in $$props) $$invalidate(5, value = $$new_props.value);
			if ('defaultAriaLabel' in $$props) $$invalidate(6, defaultAriaLabel = $$new_props.defaultAriaLabel);
			if ('classes' in $$props) $$invalidate(7, classes = $$new_props.classes);
			if ('ariaLabel' in $$props) $$invalidate(8, ariaLabel = $$new_props.ariaLabel);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			$$invalidate(8, ariaLabel = $$props['aria-label']);

			if ($$self.$$.dirty & /*className, close, outline, color, size, block, active*/ 130048) {
				$$invalidate(7, classes = classnames(className, close ? 'btn-close' : 'btn', close || `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'd-block w-100' : false, { active }));
			}

			if ($$self.$$.dirty & /*close*/ 8192) {
				$$invalidate(6, defaultAriaLabel = close ? 'Close' : null);
			}
		};

		$$props = exclude_internal_props($$props);

		return [
			inner,
			children,
			disabled,
			href,
			style,
			value,
			defaultAriaLabel,
			classes,
			ariaLabel,
			$$restProps,
			className,
			active,
			block,
			close,
			color,
			outline,
			size,
			$$scope,
			slots,
			click_handler,
			click_handler_1,
			a_binding,
			button_binding
		];
	}

	class Button extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance$j, create_fragment$j, safe_not_equal, {
				class: 10,
				active: 11,
				block: 12,
				children: 1,
				close: 13,
				color: 14,
				disabled: 2,
				href: 3,
				inner: 0,
				outline: 15,
				size: 16,
				style: 4,
				value: 5
			});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Button",
				options,
				id: create_fragment$j.name
			});
		}

		get class() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get active() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set active(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get block() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set block(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get children() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set children(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get close() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set close(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get color() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set color(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get disabled() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set disabled(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get href() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set href(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get inner() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set inner(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get outline() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set outline(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get size() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set size(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get style() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set style(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get value() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set value(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	function getWindow(node) {
	  if (node == null) {
	    return window;
	  }

	  if (node.toString() !== '[object Window]') {
	    var ownerDocument = node.ownerDocument;
	    return ownerDocument ? ownerDocument.defaultView || window : window;
	  }

	  return node;
	}

	function isElement$1(node) {
	  var OwnElement = getWindow(node).Element;
	  return node instanceof OwnElement || node instanceof Element;
	}

	function isHTMLElement(node) {
	  var OwnElement = getWindow(node).HTMLElement;
	  return node instanceof OwnElement || node instanceof HTMLElement;
	}

	function isShadowRoot(node) {
	  // IE 11 has no ShadowRoot
	  if (typeof ShadowRoot === 'undefined') {
	    return false;
	  }

	  var OwnElement = getWindow(node).ShadowRoot;
	  return node instanceof OwnElement || node instanceof ShadowRoot;
	}

	var max$1 = Math.max;
	var min$1 = Math.min;
	var round = Math.round;

	function getBoundingClientRect(element, includeScale) {
	  if (includeScale === void 0) {
	    includeScale = false;
	  }

	  var rect = element.getBoundingClientRect();
	  var scaleX = 1;
	  var scaleY = 1;

	  if (isHTMLElement(element) && includeScale) {
	    var offsetHeight = element.offsetHeight;
	    var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
	    // Fallback to 1 in case both values are `0`

	    if (offsetWidth > 0) {
	      scaleX = round(rect.width) / offsetWidth || 1;
	    }

	    if (offsetHeight > 0) {
	      scaleY = round(rect.height) / offsetHeight || 1;
	    }
	  }

	  return {
	    width: rect.width / scaleX,
	    height: rect.height / scaleY,
	    top: rect.top / scaleY,
	    right: rect.right / scaleX,
	    bottom: rect.bottom / scaleY,
	    left: rect.left / scaleX,
	    x: rect.left / scaleX,
	    y: rect.top / scaleY
	  };
	}

	function getWindowScroll(node) {
	  var win = getWindow(node);
	  var scrollLeft = win.pageXOffset;
	  var scrollTop = win.pageYOffset;
	  return {
	    scrollLeft: scrollLeft,
	    scrollTop: scrollTop
	  };
	}

	function getHTMLElementScroll(element) {
	  return {
	    scrollLeft: element.scrollLeft,
	    scrollTop: element.scrollTop
	  };
	}

	function getNodeScroll(node) {
	  if (node === getWindow(node) || !isHTMLElement(node)) {
	    return getWindowScroll(node);
	  } else {
	    return getHTMLElementScroll(node);
	  }
	}

	function getNodeName(element) {
	  return element ? (element.nodeName || '').toLowerCase() : null;
	}

	function getDocumentElement(element) {
	  // $FlowFixMe[incompatible-return]: assume body is always available
	  return ((isElement$1(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
	  element.document) || window.document).documentElement;
	}

	function getWindowScrollBarX(element) {
	  // If <html> has a CSS width greater than the viewport, then this will be
	  // incorrect for RTL.
	  // Popper 1 is broken in this case and never had a bug report so let's assume
	  // it's not an issue. I don't think anyone ever specifies width on <html>
	  // anyway.
	  // Browsers where the left scrollbar doesn't cause an issue report `0` for
	  // this (e.g. Edge 2019, IE11, Safari)
	  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
	}

	function getComputedStyle(element) {
	  return getWindow(element).getComputedStyle(element);
	}

	function isScrollParent(element) {
	  // Firefox wants us to check `-x` and `-y` variations as well
	  var _getComputedStyle = getComputedStyle(element),
	      overflow = _getComputedStyle.overflow,
	      overflowX = _getComputedStyle.overflowX,
	      overflowY = _getComputedStyle.overflowY;

	  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
	}

	function isElementScaled(element) {
	  var rect = element.getBoundingClientRect();
	  var scaleX = round(rect.width) / element.offsetWidth || 1;
	  var scaleY = round(rect.height) / element.offsetHeight || 1;
	  return scaleX !== 1 || scaleY !== 1;
	} // Returns the composite rect of an element relative to its offsetParent.
	// Composite means it takes into account transforms as well as layout.


	function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
	  if (isFixed === void 0) {
	    isFixed = false;
	  }

	  var isOffsetParentAnElement = isHTMLElement(offsetParent);
	  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
	  var documentElement = getDocumentElement(offsetParent);
	  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
	  var scroll = {
	    scrollLeft: 0,
	    scrollTop: 0
	  };
	  var offsets = {
	    x: 0,
	    y: 0
	  };

	  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
	    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
	    isScrollParent(documentElement)) {
	      scroll = getNodeScroll(offsetParent);
	    }

	    if (isHTMLElement(offsetParent)) {
	      offsets = getBoundingClientRect(offsetParent, true);
	      offsets.x += offsetParent.clientLeft;
	      offsets.y += offsetParent.clientTop;
	    } else if (documentElement) {
	      offsets.x = getWindowScrollBarX(documentElement);
	    }
	  }

	  return {
	    x: rect.left + scroll.scrollLeft - offsets.x,
	    y: rect.top + scroll.scrollTop - offsets.y,
	    width: rect.width,
	    height: rect.height
	  };
	}

	// means it doesn't take into account transforms.

	function getLayoutRect(element) {
	  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
	  // Fixes https://github.com/popperjs/popper-core/issues/1223

	  var width = element.offsetWidth;
	  var height = element.offsetHeight;

	  if (Math.abs(clientRect.width - width) <= 1) {
	    width = clientRect.width;
	  }

	  if (Math.abs(clientRect.height - height) <= 1) {
	    height = clientRect.height;
	  }

	  return {
	    x: element.offsetLeft,
	    y: element.offsetTop,
	    width: width,
	    height: height
	  };
	}

	function getParentNode(element) {
	  if (getNodeName(element) === 'html') {
	    return element;
	  }

	  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
	    // $FlowFixMe[incompatible-return]
	    // $FlowFixMe[prop-missing]
	    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
	    element.parentNode || ( // DOM Element detected
	    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
	    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
	    getDocumentElement(element) // fallback

	  );
	}

	function getScrollParent(node) {
	  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
	    // $FlowFixMe[incompatible-return]: assume body is always available
	    return node.ownerDocument.body;
	  }

	  if (isHTMLElement(node) && isScrollParent(node)) {
	    return node;
	  }

	  return getScrollParent(getParentNode(node));
	}

	/*
	given a DOM element, return the list of all scroll parents, up the list of ancesors
	until we get to the top window object. This list is what we attach scroll listeners
	to, because if any of these parent elements scroll, we'll need to re-calculate the
	reference element's position.
	*/

	function listScrollParents(element, list) {
	  var _element$ownerDocumen;

	  if (list === void 0) {
	    list = [];
	  }

	  var scrollParent = getScrollParent(element);
	  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
	  var win = getWindow(scrollParent);
	  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
	  var updatedList = list.concat(target);
	  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
	  updatedList.concat(listScrollParents(getParentNode(target)));
	}

	function isTableElement(element) {
	  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
	}

	function getTrueOffsetParent(element) {
	  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
	  getComputedStyle(element).position === 'fixed') {
	    return null;
	  }

	  return element.offsetParent;
	} // `.offsetParent` reports `null` for fixed elements, while absolute elements
	// return the containing block


	function getContainingBlock(element) {
	  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
	  var isIE = navigator.userAgent.indexOf('Trident') !== -1;

	  if (isIE && isHTMLElement(element)) {
	    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
	    var elementCss = getComputedStyle(element);

	    if (elementCss.position === 'fixed') {
	      return null;
	    }
	  }

	  var currentNode = getParentNode(element);

	  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
	    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
	    // create a containing block.
	    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

	    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
	      return currentNode;
	    } else {
	      currentNode = currentNode.parentNode;
	    }
	  }

	  return null;
	} // Gets the closest ancestor positioned element. Handles some edge cases,
	// such as table ancestors and cross browser bugs.


	function getOffsetParent(element) {
	  var window = getWindow(element);
	  var offsetParent = getTrueOffsetParent(element);

	  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
	    offsetParent = getTrueOffsetParent(offsetParent);
	  }

	  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
	    return window;
	  }

	  return offsetParent || getContainingBlock(element) || window;
	}

	var top = 'top';
	var bottom = 'bottom';
	var right = 'right';
	var left = 'left';
	var auto = 'auto';
	var basePlacements = [top, bottom, right, left];
	var start = 'start';
	var end = 'end';
	var clippingParents = 'clippingParents';
	var viewport = 'viewport';
	var popper = 'popper';
	var reference = 'reference';
	var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
	  return acc.concat([placement + "-" + start, placement + "-" + end]);
	}, []);
	var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
	  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
	}, []); // modifiers that need to read the DOM

	var beforeRead = 'beforeRead';
	var read = 'read';
	var afterRead = 'afterRead'; // pure-logic modifiers

	var beforeMain = 'beforeMain';
	var main = 'main';
	var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

	var beforeWrite = 'beforeWrite';
	var write = 'write';
	var afterWrite = 'afterWrite';
	var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

	function order(modifiers) {
	  var map = new Map();
	  var visited = new Set();
	  var result = [];
	  modifiers.forEach(function (modifier) {
	    map.set(modifier.name, modifier);
	  }); // On visiting object, check for its dependencies and visit them recursively

	  function sort(modifier) {
	    visited.add(modifier.name);
	    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
	    requires.forEach(function (dep) {
	      if (!visited.has(dep)) {
	        var depModifier = map.get(dep);

	        if (depModifier) {
	          sort(depModifier);
	        }
	      }
	    });
	    result.push(modifier);
	  }

	  modifiers.forEach(function (modifier) {
	    if (!visited.has(modifier.name)) {
	      // check for visited object
	      sort(modifier);
	    }
	  });
	  return result;
	}

	function orderModifiers(modifiers) {
	  // order based on dependencies
	  var orderedModifiers = order(modifiers); // order based on phase

	  return modifierPhases.reduce(function (acc, phase) {
	    return acc.concat(orderedModifiers.filter(function (modifier) {
	      return modifier.phase === phase;
	    }));
	  }, []);
	}

	function debounce$1(fn) {
	  var pending;
	  return function () {
	    if (!pending) {
	      pending = new Promise(function (resolve) {
	        Promise.resolve().then(function () {
	          pending = undefined;
	          resolve(fn());
	        });
	      });
	    }

	    return pending;
	  };
	}

	function getBasePlacement(placement) {
	  return placement.split('-')[0];
	}

	function mergeByName(modifiers) {
	  var merged = modifiers.reduce(function (merged, current) {
	    var existing = merged[current.name];
	    merged[current.name] = existing ? Object.assign({}, existing, current, {
	      options: Object.assign({}, existing.options, current.options),
	      data: Object.assign({}, existing.data, current.data)
	    }) : current;
	    return merged;
	  }, {}); // IE11 does not support Object.values

	  return Object.keys(merged).map(function (key) {
	    return merged[key];
	  });
	}

	function getViewportRect(element) {
	  var win = getWindow(element);
	  var html = getDocumentElement(element);
	  var visualViewport = win.visualViewport;
	  var width = html.clientWidth;
	  var height = html.clientHeight;
	  var x = 0;
	  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
	  // can be obscured underneath it.
	  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
	  // if it isn't open, so if this isn't available, the popper will be detected
	  // to overflow the bottom of the screen too early.

	  if (visualViewport) {
	    width = visualViewport.width;
	    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
	    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
	    // errors due to floating point numbers, so we need to check precision.
	    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
	    // Feature detection fails in mobile emulation mode in Chrome.
	    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
	    // 0.001
	    // Fallback here: "Not Safari" userAgent

	    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
	      x = visualViewport.offsetLeft;
	      y = visualViewport.offsetTop;
	    }
	  }

	  return {
	    width: width,
	    height: height,
	    x: x + getWindowScrollBarX(element),
	    y: y
	  };
	}

	// of the `<html>` and `<body>` rect bounds if horizontally scrollable

	function getDocumentRect(element) {
	  var _element$ownerDocumen;

	  var html = getDocumentElement(element);
	  var winScroll = getWindowScroll(element);
	  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
	  var width = max$1(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
	  var height = max$1(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
	  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
	  var y = -winScroll.scrollTop;

	  if (getComputedStyle(body || html).direction === 'rtl') {
	    x += max$1(html.clientWidth, body ? body.clientWidth : 0) - width;
	  }

	  return {
	    width: width,
	    height: height,
	    x: x,
	    y: y
	  };
	}

	function contains$1(parent, child) {
	  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

	  if (parent.contains(child)) {
	    return true;
	  } // then fallback to custom implementation with Shadow DOM support
	  else if (rootNode && isShadowRoot(rootNode)) {
	      var next = child;

	      do {
	        if (next && parent.isSameNode(next)) {
	          return true;
	        } // $FlowFixMe[prop-missing]: need a better way to handle this...


	        next = next.parentNode || next.host;
	      } while (next);
	    } // Give up, the result is false


	  return false;
	}

	function rectToClientRect(rect) {
	  return Object.assign({}, rect, {
	    left: rect.x,
	    top: rect.y,
	    right: rect.x + rect.width,
	    bottom: rect.y + rect.height
	  });
	}

	function getInnerBoundingClientRect(element) {
	  var rect = getBoundingClientRect(element);
	  rect.top = rect.top + element.clientTop;
	  rect.left = rect.left + element.clientLeft;
	  rect.bottom = rect.top + element.clientHeight;
	  rect.right = rect.left + element.clientWidth;
	  rect.width = element.clientWidth;
	  rect.height = element.clientHeight;
	  rect.x = rect.left;
	  rect.y = rect.top;
	  return rect;
	}

	function getClientRectFromMixedType(element, clippingParent) {
	  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement$1(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
	} // A "clipping parent" is an overflowable container with the characteristic of
	// clipping (or hiding) overflowing elements with a position different from
	// `initial`


	function getClippingParents(element) {
	  var clippingParents = listScrollParents(getParentNode(element));
	  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
	  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

	  if (!isElement$1(clipperElement)) {
	    return [];
	  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


	  return clippingParents.filter(function (clippingParent) {
	    return isElement$1(clippingParent) && contains$1(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body' && (canEscapeClipping ? getComputedStyle(clippingParent).position !== 'static' : true);
	  });
	} // Gets the maximum area that the element is visible in due to any number of
	// clipping parents


	function getClippingRect(element, boundary, rootBoundary) {
	  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
	  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
	  var firstClippingParent = clippingParents[0];
	  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
	    var rect = getClientRectFromMixedType(element, clippingParent);
	    accRect.top = max$1(rect.top, accRect.top);
	    accRect.right = min$1(rect.right, accRect.right);
	    accRect.bottom = min$1(rect.bottom, accRect.bottom);
	    accRect.left = max$1(rect.left, accRect.left);
	    return accRect;
	  }, getClientRectFromMixedType(element, firstClippingParent));
	  clippingRect.width = clippingRect.right - clippingRect.left;
	  clippingRect.height = clippingRect.bottom - clippingRect.top;
	  clippingRect.x = clippingRect.left;
	  clippingRect.y = clippingRect.top;
	  return clippingRect;
	}

	function getVariation(placement) {
	  return placement.split('-')[1];
	}

	function getMainAxisFromPlacement(placement) {
	  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
	}

	function computeOffsets(_ref) {
	  var reference = _ref.reference,
	      element = _ref.element,
	      placement = _ref.placement;
	  var basePlacement = placement ? getBasePlacement(placement) : null;
	  var variation = placement ? getVariation(placement) : null;
	  var commonX = reference.x + reference.width / 2 - element.width / 2;
	  var commonY = reference.y + reference.height / 2 - element.height / 2;
	  var offsets;

	  switch (basePlacement) {
	    case top:
	      offsets = {
	        x: commonX,
	        y: reference.y - element.height
	      };
	      break;

	    case bottom:
	      offsets = {
	        x: commonX,
	        y: reference.y + reference.height
	      };
	      break;

	    case right:
	      offsets = {
	        x: reference.x + reference.width,
	        y: commonY
	      };
	      break;

	    case left:
	      offsets = {
	        x: reference.x - element.width,
	        y: commonY
	      };
	      break;

	    default:
	      offsets = {
	        x: reference.x,
	        y: reference.y
	      };
	  }

	  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

	  if (mainAxis != null) {
	    var len = mainAxis === 'y' ? 'height' : 'width';

	    switch (variation) {
	      case start:
	        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
	        break;

	      case end:
	        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
	        break;
	    }
	  }

	  return offsets;
	}

	function getFreshSideObject() {
	  return {
	    top: 0,
	    right: 0,
	    bottom: 0,
	    left: 0
	  };
	}

	function mergePaddingObject(paddingObject) {
	  return Object.assign({}, getFreshSideObject(), paddingObject);
	}

	function expandToHashMap(value, keys) {
	  return keys.reduce(function (hashMap, key) {
	    hashMap[key] = value;
	    return hashMap;
	  }, {});
	}

	function detectOverflow(state, options) {
	  if (options === void 0) {
	    options = {};
	  }

	  var _options = options,
	      _options$placement = _options.placement,
	      placement = _options$placement === void 0 ? state.placement : _options$placement,
	      _options$boundary = _options.boundary,
	      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
	      _options$rootBoundary = _options.rootBoundary,
	      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
	      _options$elementConte = _options.elementContext,
	      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
	      _options$altBoundary = _options.altBoundary,
	      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
	      _options$padding = _options.padding,
	      padding = _options$padding === void 0 ? 0 : _options$padding;
	  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
	  var altContext = elementContext === popper ? reference : popper;
	  var popperRect = state.rects.popper;
	  var element = state.elements[altBoundary ? altContext : elementContext];
	  var clippingClientRect = getClippingRect(isElement$1(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
	  var referenceClientRect = getBoundingClientRect(state.elements.reference);
	  var popperOffsets = computeOffsets({
	    reference: referenceClientRect,
	    element: popperRect,
	    strategy: 'absolute',
	    placement: placement
	  });
	  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
	  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
	  // 0 or negative = within the clipping rect

	  var overflowOffsets = {
	    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
	    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
	    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
	    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
	  };
	  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

	  if (elementContext === popper && offsetData) {
	    var offset = offsetData[placement];
	    Object.keys(overflowOffsets).forEach(function (key) {
	      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
	      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
	      overflowOffsets[key] += offset[axis] * multiply;
	    });
	  }

	  return overflowOffsets;
	}

	var DEFAULT_OPTIONS = {
	  placement: 'bottom',
	  modifiers: [],
	  strategy: 'absolute'
	};

	function areValidElements() {
	  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  return !args.some(function (element) {
	    return !(element && typeof element.getBoundingClientRect === 'function');
	  });
	}

	function popperGenerator(generatorOptions) {
	  if (generatorOptions === void 0) {
	    generatorOptions = {};
	  }

	  var _generatorOptions = generatorOptions,
	      _generatorOptions$def = _generatorOptions.defaultModifiers,
	      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
	      _generatorOptions$def2 = _generatorOptions.defaultOptions,
	      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
	  return function createPopper(reference, popper, options) {
	    if (options === void 0) {
	      options = defaultOptions;
	    }

	    var state = {
	      placement: 'bottom',
	      orderedModifiers: [],
	      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
	      modifiersData: {},
	      elements: {
	        reference: reference,
	        popper: popper
	      },
	      attributes: {},
	      styles: {}
	    };
	    var effectCleanupFns = [];
	    var isDestroyed = false;
	    var instance = {
	      state: state,
	      setOptions: function setOptions(setOptionsAction) {
	        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
	        cleanupModifierEffects();
	        state.options = Object.assign({}, defaultOptions, state.options, options);
	        state.scrollParents = {
	          reference: isElement$1(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
	          popper: listScrollParents(popper)
	        }; // Orders the modifiers based on their dependencies and `phase`
	        // properties

	        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

	        state.orderedModifiers = orderedModifiers.filter(function (m) {
	          return m.enabled;
	        }); // Validate the provided modifiers so that the consumer will get warned

	        runModifierEffects();
	        return instance.update();
	      },
	      // Sync update – it will always be executed, even if not necessary. This
	      // is useful for low frequency updates where sync behavior simplifies the
	      // logic.
	      // For high frequency updates (e.g. `resize` and `scroll` events), always
	      // prefer the async Popper#update method
	      forceUpdate: function forceUpdate() {
	        if (isDestroyed) {
	          return;
	        }

	        var _state$elements = state.elements,
	            reference = _state$elements.reference,
	            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
	        // anymore

	        if (!areValidElements(reference, popper)) {

	          return;
	        } // Store the reference and popper rects to be read by modifiers


	        state.rects = {
	          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
	          popper: getLayoutRect(popper)
	        }; // Modifiers have the ability to reset the current update cycle. The
	        // most common use case for this is the `flip` modifier changing the
	        // placement, which then needs to re-run all the modifiers, because the
	        // logic was previously ran for the previous placement and is therefore
	        // stale/incorrect

	        state.reset = false;
	        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
	        // is filled with the initial data specified by the modifier. This means
	        // it doesn't persist and is fresh on each update.
	        // To ensure persistent data, use `${name}#persistent`

	        state.orderedModifiers.forEach(function (modifier) {
	          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
	        });

	        for (var index = 0; index < state.orderedModifiers.length; index++) {

	          if (state.reset === true) {
	            state.reset = false;
	            index = -1;
	            continue;
	          }

	          var _state$orderedModifie = state.orderedModifiers[index],
	              fn = _state$orderedModifie.fn,
	              _state$orderedModifie2 = _state$orderedModifie.options,
	              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
	              name = _state$orderedModifie.name;

	          if (typeof fn === 'function') {
	            state = fn({
	              state: state,
	              options: _options,
	              name: name,
	              instance: instance
	            }) || state;
	          }
	        }
	      },
	      // Async and optimistically optimized update – it will not be executed if
	      // not necessary (debounced to run at most once-per-tick)
	      update: debounce$1(function () {
	        return new Promise(function (resolve) {
	          instance.forceUpdate();
	          resolve(state);
	        });
	      }),
	      destroy: function destroy() {
	        cleanupModifierEffects();
	        isDestroyed = true;
	      }
	    };

	    if (!areValidElements(reference, popper)) {

	      return instance;
	    }

	    instance.setOptions(options).then(function (state) {
	      if (!isDestroyed && options.onFirstUpdate) {
	        options.onFirstUpdate(state);
	      }
	    }); // Modifiers have the ability to execute arbitrary code before the first
	    // update cycle runs. They will be executed in the same order as the update
	    // cycle. This is useful when a modifier adds some persistent data that
	    // other modifiers need to use, but the modifier is run after the dependent
	    // one.

	    function runModifierEffects() {
	      state.orderedModifiers.forEach(function (_ref3) {
	        var name = _ref3.name,
	            _ref3$options = _ref3.options,
	            options = _ref3$options === void 0 ? {} : _ref3$options,
	            effect = _ref3.effect;

	        if (typeof effect === 'function') {
	          var cleanupFn = effect({
	            state: state,
	            name: name,
	            instance: instance,
	            options: options
	          });

	          var noopFn = function noopFn() {};

	          effectCleanupFns.push(cleanupFn || noopFn);
	        }
	      });
	    }

	    function cleanupModifierEffects() {
	      effectCleanupFns.forEach(function (fn) {
	        return fn();
	      });
	      effectCleanupFns = [];
	    }

	    return instance;
	  };
	}

	var passive = {
	  passive: true
	};

	function effect$2(_ref) {
	  var state = _ref.state,
	      instance = _ref.instance,
	      options = _ref.options;
	  var _options$scroll = options.scroll,
	      scroll = _options$scroll === void 0 ? true : _options$scroll,
	      _options$resize = options.resize,
	      resize = _options$resize === void 0 ? true : _options$resize;
	  var window = getWindow(state.elements.popper);
	  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

	  if (scroll) {
	    scrollParents.forEach(function (scrollParent) {
	      scrollParent.addEventListener('scroll', instance.update, passive);
	    });
	  }

	  if (resize) {
	    window.addEventListener('resize', instance.update, passive);
	  }

	  return function () {
	    if (scroll) {
	      scrollParents.forEach(function (scrollParent) {
	        scrollParent.removeEventListener('scroll', instance.update, passive);
	      });
	    }

	    if (resize) {
	      window.removeEventListener('resize', instance.update, passive);
	    }
	  };
	} // eslint-disable-next-line import/no-unused-modules


	var eventListeners = {
	  name: 'eventListeners',
	  enabled: true,
	  phase: 'write',
	  fn: function fn() {},
	  effect: effect$2,
	  data: {}
	};

	function popperOffsets(_ref) {
	  var state = _ref.state,
	      name = _ref.name;
	  // Offsets are the actual position the popper needs to have to be
	  // properly positioned near its reference element
	  // This is the most basic placement, and will be adjusted by
	  // the modifiers in the next step
	  state.modifiersData[name] = computeOffsets({
	    reference: state.rects.reference,
	    element: state.rects.popper,
	    strategy: 'absolute',
	    placement: state.placement
	  });
	} // eslint-disable-next-line import/no-unused-modules


	var popperOffsets$1 = {
	  name: 'popperOffsets',
	  enabled: true,
	  phase: 'read',
	  fn: popperOffsets,
	  data: {}
	};

	var unsetSides = {
	  top: 'auto',
	  right: 'auto',
	  bottom: 'auto',
	  left: 'auto'
	}; // Round the offsets to the nearest suitable subpixel based on the DPR.
	// Zooming can change the DPR, but it seems to report a value that will
	// cleanly divide the values into the appropriate subpixels.

	function roundOffsetsByDPR(_ref) {
	  var x = _ref.x,
	      y = _ref.y;
	  var win = window;
	  var dpr = win.devicePixelRatio || 1;
	  return {
	    x: round(x * dpr) / dpr || 0,
	    y: round(y * dpr) / dpr || 0
	  };
	}

	function mapToStyles(_ref2) {
	  var _Object$assign2;

	  var popper = _ref2.popper,
	      popperRect = _ref2.popperRect,
	      placement = _ref2.placement,
	      variation = _ref2.variation,
	      offsets = _ref2.offsets,
	      position = _ref2.position,
	      gpuAcceleration = _ref2.gpuAcceleration,
	      adaptive = _ref2.adaptive,
	      roundOffsets = _ref2.roundOffsets,
	      isFixed = _ref2.isFixed;

	  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
	      _ref3$x = _ref3.x,
	      x = _ref3$x === void 0 ? 0 : _ref3$x,
	      _ref3$y = _ref3.y,
	      y = _ref3$y === void 0 ? 0 : _ref3$y;

	  var hasX = offsets.hasOwnProperty('x');
	  var hasY = offsets.hasOwnProperty('y');
	  var sideX = left;
	  var sideY = top;
	  var win = window;

	  if (adaptive) {
	    var offsetParent = getOffsetParent(popper);
	    var heightProp = 'clientHeight';
	    var widthProp = 'clientWidth';

	    if (offsetParent === getWindow(popper)) {
	      offsetParent = getDocumentElement(popper);

	      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
	        heightProp = 'scrollHeight';
	        widthProp = 'scrollWidth';
	      }
	    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


	    offsetParent = offsetParent;

	    if (placement === top || (placement === left || placement === right) && variation === end) {
	      sideY = bottom;
	      var offsetY = isFixed && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
	      offsetParent[heightProp];
	      y -= offsetY - popperRect.height;
	      y *= gpuAcceleration ? 1 : -1;
	    }

	    if (placement === left || (placement === top || placement === bottom) && variation === end) {
	      sideX = right;
	      var offsetX = isFixed && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
	      offsetParent[widthProp];
	      x -= offsetX - popperRect.width;
	      x *= gpuAcceleration ? 1 : -1;
	    }
	  }

	  var commonStyles = Object.assign({
	    position: position
	  }, adaptive && unsetSides);

	  if (gpuAcceleration) {
	    var _Object$assign;

	    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
	  }

	  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
	}

	function computeStyles(_ref4) {
	  var state = _ref4.state,
	      options = _ref4.options;
	  var _options$gpuAccelerat = options.gpuAcceleration,
	      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
	      _options$adaptive = options.adaptive,
	      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
	      _options$roundOffsets = options.roundOffsets,
	      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

	  var commonStyles = {
	    placement: getBasePlacement(state.placement),
	    variation: getVariation(state.placement),
	    popper: state.elements.popper,
	    popperRect: state.rects.popper,
	    gpuAcceleration: gpuAcceleration,
	    isFixed: state.options.strategy === 'fixed'
	  };

	  if (state.modifiersData.popperOffsets != null) {
	    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
	      offsets: state.modifiersData.popperOffsets,
	      position: state.options.strategy,
	      adaptive: adaptive,
	      roundOffsets: roundOffsets
	    })));
	  }

	  if (state.modifiersData.arrow != null) {
	    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
	      offsets: state.modifiersData.arrow,
	      position: 'absolute',
	      adaptive: false,
	      roundOffsets: roundOffsets
	    })));
	  }

	  state.attributes.popper = Object.assign({}, state.attributes.popper, {
	    'data-popper-placement': state.placement
	  });
	} // eslint-disable-next-line import/no-unused-modules


	var computeStyles$1 = {
	  name: 'computeStyles',
	  enabled: true,
	  phase: 'beforeWrite',
	  fn: computeStyles,
	  data: {}
	};

	// and applies them to the HTMLElements such as popper and arrow

	function applyStyles(_ref) {
	  var state = _ref.state;
	  Object.keys(state.elements).forEach(function (name) {
	    var style = state.styles[name] || {};
	    var attributes = state.attributes[name] || {};
	    var element = state.elements[name]; // arrow is optional + virtual elements

	    if (!isHTMLElement(element) || !getNodeName(element)) {
	      return;
	    } // Flow doesn't support to extend this property, but it's the most
	    // effective way to apply styles to an HTMLElement
	    // $FlowFixMe[cannot-write]


	    Object.assign(element.style, style);
	    Object.keys(attributes).forEach(function (name) {
	      var value = attributes[name];

	      if (value === false) {
	        element.removeAttribute(name);
	      } else {
	        element.setAttribute(name, value === true ? '' : value);
	      }
	    });
	  });
	}

	function effect$1(_ref2) {
	  var state = _ref2.state;
	  var initialStyles = {
	    popper: {
	      position: state.options.strategy,
	      left: '0',
	      top: '0',
	      margin: '0'
	    },
	    arrow: {
	      position: 'absolute'
	    },
	    reference: {}
	  };
	  Object.assign(state.elements.popper.style, initialStyles.popper);
	  state.styles = initialStyles;

	  if (state.elements.arrow) {
	    Object.assign(state.elements.arrow.style, initialStyles.arrow);
	  }

	  return function () {
	    Object.keys(state.elements).forEach(function (name) {
	      var element = state.elements[name];
	      var attributes = state.attributes[name] || {};
	      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

	      var style = styleProperties.reduce(function (style, property) {
	        style[property] = '';
	        return style;
	      }, {}); // arrow is optional + virtual elements

	      if (!isHTMLElement(element) || !getNodeName(element)) {
	        return;
	      }

	      Object.assign(element.style, style);
	      Object.keys(attributes).forEach(function (attribute) {
	        element.removeAttribute(attribute);
	      });
	    });
	  };
	} // eslint-disable-next-line import/no-unused-modules


	var applyStyles$1 = {
	  name: 'applyStyles',
	  enabled: true,
	  phase: 'write',
	  fn: applyStyles,
	  effect: effect$1,
	  requires: ['computeStyles']
	};

	function distanceAndSkiddingToXY(placement, rects, offset) {
	  var basePlacement = getBasePlacement(placement);
	  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

	  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
	    placement: placement
	  })) : offset,
	      skidding = _ref[0],
	      distance = _ref[1];

	  skidding = skidding || 0;
	  distance = (distance || 0) * invertDistance;
	  return [left, right].indexOf(basePlacement) >= 0 ? {
	    x: distance,
	    y: skidding
	  } : {
	    x: skidding,
	    y: distance
	  };
	}

	function offset(_ref2) {
	  var state = _ref2.state,
	      options = _ref2.options,
	      name = _ref2.name;
	  var _options$offset = options.offset,
	      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
	  var data = placements.reduce(function (acc, placement) {
	    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
	    return acc;
	  }, {});
	  var _data$state$placement = data[state.placement],
	      x = _data$state$placement.x,
	      y = _data$state$placement.y;

	  if (state.modifiersData.popperOffsets != null) {
	    state.modifiersData.popperOffsets.x += x;
	    state.modifiersData.popperOffsets.y += y;
	  }

	  state.modifiersData[name] = data;
	} // eslint-disable-next-line import/no-unused-modules


	var offset$1 = {
	  name: 'offset',
	  enabled: true,
	  phase: 'main',
	  requires: ['popperOffsets'],
	  fn: offset
	};

	var hash$1 = {
	  left: 'right',
	  right: 'left',
	  bottom: 'top',
	  top: 'bottom'
	};
	function getOppositePlacement(placement) {
	  return placement.replace(/left|right|bottom|top/g, function (matched) {
	    return hash$1[matched];
	  });
	}

	var hash = {
	  start: 'end',
	  end: 'start'
	};
	function getOppositeVariationPlacement(placement) {
	  return placement.replace(/start|end/g, function (matched) {
	    return hash[matched];
	  });
	}

	function computeAutoPlacement(state, options) {
	  if (options === void 0) {
	    options = {};
	  }

	  var _options = options,
	      placement = _options.placement,
	      boundary = _options.boundary,
	      rootBoundary = _options.rootBoundary,
	      padding = _options.padding,
	      flipVariations = _options.flipVariations,
	      _options$allowedAutoP = _options.allowedAutoPlacements,
	      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
	  var variation = getVariation(placement);
	  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
	    return getVariation(placement) === variation;
	  }) : basePlacements;
	  var allowedPlacements = placements$1.filter(function (placement) {
	    return allowedAutoPlacements.indexOf(placement) >= 0;
	  });

	  if (allowedPlacements.length === 0) {
	    allowedPlacements = placements$1;
	  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


	  var overflows = allowedPlacements.reduce(function (acc, placement) {
	    acc[placement] = detectOverflow(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      padding: padding
	    })[getBasePlacement(placement)];
	    return acc;
	  }, {});
	  return Object.keys(overflows).sort(function (a, b) {
	    return overflows[a] - overflows[b];
	  });
	}

	function getExpandedFallbackPlacements(placement) {
	  if (getBasePlacement(placement) === auto) {
	    return [];
	  }

	  var oppositePlacement = getOppositePlacement(placement);
	  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
	}

	function flip(_ref) {
	  var state = _ref.state,
	      options = _ref.options,
	      name = _ref.name;

	  if (state.modifiersData[name]._skip) {
	    return;
	  }

	  var _options$mainAxis = options.mainAxis,
	      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
	      _options$altAxis = options.altAxis,
	      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
	      specifiedFallbackPlacements = options.fallbackPlacements,
	      padding = options.padding,
	      boundary = options.boundary,
	      rootBoundary = options.rootBoundary,
	      altBoundary = options.altBoundary,
	      _options$flipVariatio = options.flipVariations,
	      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
	      allowedAutoPlacements = options.allowedAutoPlacements;
	  var preferredPlacement = state.options.placement;
	  var basePlacement = getBasePlacement(preferredPlacement);
	  var isBasePlacement = basePlacement === preferredPlacement;
	  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
	  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
	    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      padding: padding,
	      flipVariations: flipVariations,
	      allowedAutoPlacements: allowedAutoPlacements
	    }) : placement);
	  }, []);
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var checksMap = new Map();
	  var makeFallbackChecks = true;
	  var firstFittingPlacement = placements[0];

	  for (var i = 0; i < placements.length; i++) {
	    var placement = placements[i];

	    var _basePlacement = getBasePlacement(placement);

	    var isStartVariation = getVariation(placement) === start;
	    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
	    var len = isVertical ? 'width' : 'height';
	    var overflow = detectOverflow(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      altBoundary: altBoundary,
	      padding: padding
	    });
	    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

	    if (referenceRect[len] > popperRect[len]) {
	      mainVariationSide = getOppositePlacement(mainVariationSide);
	    }

	    var altVariationSide = getOppositePlacement(mainVariationSide);
	    var checks = [];

	    if (checkMainAxis) {
	      checks.push(overflow[_basePlacement] <= 0);
	    }

	    if (checkAltAxis) {
	      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
	    }

	    if (checks.every(function (check) {
	      return check;
	    })) {
	      firstFittingPlacement = placement;
	      makeFallbackChecks = false;
	      break;
	    }

	    checksMap.set(placement, checks);
	  }

	  if (makeFallbackChecks) {
	    // `2` may be desired in some cases – research later
	    var numberOfChecks = flipVariations ? 3 : 1;

	    var _loop = function _loop(_i) {
	      var fittingPlacement = placements.find(function (placement) {
	        var checks = checksMap.get(placement);

	        if (checks) {
	          return checks.slice(0, _i).every(function (check) {
	            return check;
	          });
	        }
	      });

	      if (fittingPlacement) {
	        firstFittingPlacement = fittingPlacement;
	        return "break";
	      }
	    };

	    for (var _i = numberOfChecks; _i > 0; _i--) {
	      var _ret = _loop(_i);

	      if (_ret === "break") break;
	    }
	  }

	  if (state.placement !== firstFittingPlacement) {
	    state.modifiersData[name]._skip = true;
	    state.placement = firstFittingPlacement;
	    state.reset = true;
	  }
	} // eslint-disable-next-line import/no-unused-modules


	var flip$1 = {
	  name: 'flip',
	  enabled: true,
	  phase: 'main',
	  fn: flip,
	  requiresIfExists: ['offset'],
	  data: {
	    _skip: false
	  }
	};

	function getAltAxis(axis) {
	  return axis === 'x' ? 'y' : 'x';
	}

	function within(min, value, max) {
	  return max$1(min, min$1(value, max));
	}
	function withinMaxClamp(min, value, max) {
	  var v = within(min, value, max);
	  return v > max ? max : v;
	}

	function preventOverflow(_ref) {
	  var state = _ref.state,
	      options = _ref.options,
	      name = _ref.name;
	  var _options$mainAxis = options.mainAxis,
	      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
	      _options$altAxis = options.altAxis,
	      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
	      boundary = options.boundary,
	      rootBoundary = options.rootBoundary,
	      altBoundary = options.altBoundary,
	      padding = options.padding,
	      _options$tether = options.tether,
	      tether = _options$tether === void 0 ? true : _options$tether,
	      _options$tetherOffset = options.tetherOffset,
	      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
	  var overflow = detectOverflow(state, {
	    boundary: boundary,
	    rootBoundary: rootBoundary,
	    padding: padding,
	    altBoundary: altBoundary
	  });
	  var basePlacement = getBasePlacement(state.placement);
	  var variation = getVariation(state.placement);
	  var isBasePlacement = !variation;
	  var mainAxis = getMainAxisFromPlacement(basePlacement);
	  var altAxis = getAltAxis(mainAxis);
	  var popperOffsets = state.modifiersData.popperOffsets;
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
	    placement: state.placement
	  })) : tetherOffset;
	  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
	    mainAxis: tetherOffsetValue,
	    altAxis: tetherOffsetValue
	  } : Object.assign({
	    mainAxis: 0,
	    altAxis: 0
	  }, tetherOffsetValue);
	  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
	  var data = {
	    x: 0,
	    y: 0
	  };

	  if (!popperOffsets) {
	    return;
	  }

	  if (checkMainAxis) {
	    var _offsetModifierState$;

	    var mainSide = mainAxis === 'y' ? top : left;
	    var altSide = mainAxis === 'y' ? bottom : right;
	    var len = mainAxis === 'y' ? 'height' : 'width';
	    var offset = popperOffsets[mainAxis];
	    var min = offset + overflow[mainSide];
	    var max = offset - overflow[altSide];
	    var additive = tether ? -popperRect[len] / 2 : 0;
	    var minLen = variation === start ? referenceRect[len] : popperRect[len];
	    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
	    // outside the reference bounds

	    var arrowElement = state.elements.arrow;
	    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
	      width: 0,
	      height: 0
	    };
	    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
	    var arrowPaddingMin = arrowPaddingObject[mainSide];
	    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
	    // to include its full size in the calculation. If the reference is small
	    // and near the edge of a boundary, the popper can overflow even if the
	    // reference is not overflowing as well (e.g. virtual elements with no
	    // width or height)

	    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
	    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
	    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
	    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
	    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
	    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
	    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
	    var tetherMax = offset + maxOffset - offsetModifierValue;
	    var preventedOffset = within(tether ? min$1(min, tetherMin) : min, offset, tether ? max$1(max, tetherMax) : max);
	    popperOffsets[mainAxis] = preventedOffset;
	    data[mainAxis] = preventedOffset - offset;
	  }

	  if (checkAltAxis) {
	    var _offsetModifierState$2;

	    var _mainSide = mainAxis === 'x' ? top : left;

	    var _altSide = mainAxis === 'x' ? bottom : right;

	    var _offset = popperOffsets[altAxis];

	    var _len = altAxis === 'y' ? 'height' : 'width';

	    var _min = _offset + overflow[_mainSide];

	    var _max = _offset - overflow[_altSide];

	    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

	    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

	    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

	    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

	    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

	    popperOffsets[altAxis] = _preventedOffset;
	    data[altAxis] = _preventedOffset - _offset;
	  }

	  state.modifiersData[name] = data;
	} // eslint-disable-next-line import/no-unused-modules


	var preventOverflow$1 = {
	  name: 'preventOverflow',
	  enabled: true,
	  phase: 'main',
	  fn: preventOverflow,
	  requiresIfExists: ['offset']
	};

	var toPaddingObject = function toPaddingObject(padding, state) {
	  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
	    placement: state.placement
	  })) : padding;
	  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
	};

	function arrow(_ref) {
	  var _state$modifiersData$;

	  var state = _ref.state,
	      name = _ref.name,
	      options = _ref.options;
	  var arrowElement = state.elements.arrow;
	  var popperOffsets = state.modifiersData.popperOffsets;
	  var basePlacement = getBasePlacement(state.placement);
	  var axis = getMainAxisFromPlacement(basePlacement);
	  var isVertical = [left, right].indexOf(basePlacement) >= 0;
	  var len = isVertical ? 'height' : 'width';

	  if (!arrowElement || !popperOffsets) {
	    return;
	  }

	  var paddingObject = toPaddingObject(options.padding, state);
	  var arrowRect = getLayoutRect(arrowElement);
	  var minProp = axis === 'y' ? top : left;
	  var maxProp = axis === 'y' ? bottom : right;
	  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
	  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
	  var arrowOffsetParent = getOffsetParent(arrowElement);
	  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
	  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
	  // outside of the popper bounds

	  var min = paddingObject[minProp];
	  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
	  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
	  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

	  var axisProp = axis;
	  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
	}

	function effect(_ref2) {
	  var state = _ref2.state,
	      options = _ref2.options;
	  var _options$element = options.element,
	      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

	  if (arrowElement == null) {
	    return;
	  } // CSS selector


	  if (typeof arrowElement === 'string') {
	    arrowElement = state.elements.popper.querySelector(arrowElement);

	    if (!arrowElement) {
	      return;
	    }
	  }

	  if (!contains$1(state.elements.popper, arrowElement)) {

	    return;
	  }

	  state.elements.arrow = arrowElement;
	} // eslint-disable-next-line import/no-unused-modules


	var arrow$1 = {
	  name: 'arrow',
	  enabled: true,
	  phase: 'main',
	  fn: arrow,
	  effect: effect,
	  requires: ['popperOffsets'],
	  requiresIfExists: ['preventOverflow']
	};

	function getSideOffsets(overflow, rect, preventedOffsets) {
	  if (preventedOffsets === void 0) {
	    preventedOffsets = {
	      x: 0,
	      y: 0
	    };
	  }

	  return {
	    top: overflow.top - rect.height - preventedOffsets.y,
	    right: overflow.right - rect.width + preventedOffsets.x,
	    bottom: overflow.bottom - rect.height + preventedOffsets.y,
	    left: overflow.left - rect.width - preventedOffsets.x
	  };
	}

	function isAnySideFullyClipped(overflow) {
	  return [top, right, bottom, left].some(function (side) {
	    return overflow[side] >= 0;
	  });
	}

	function hide(_ref) {
	  var state = _ref.state,
	      name = _ref.name;
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var preventedOffsets = state.modifiersData.preventOverflow;
	  var referenceOverflow = detectOverflow(state, {
	    elementContext: 'reference'
	  });
	  var popperAltOverflow = detectOverflow(state, {
	    altBoundary: true
	  });
	  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
	  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
	  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
	  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
	  state.modifiersData[name] = {
	    referenceClippingOffsets: referenceClippingOffsets,
	    popperEscapeOffsets: popperEscapeOffsets,
	    isReferenceHidden: isReferenceHidden,
	    hasPopperEscaped: hasPopperEscaped
	  };
	  state.attributes.popper = Object.assign({}, state.attributes.popper, {
	    'data-popper-reference-hidden': isReferenceHidden,
	    'data-popper-escaped': hasPopperEscaped
	  });
	} // eslint-disable-next-line import/no-unused-modules


	var hide$1 = {
	  name: 'hide',
	  enabled: true,
	  phase: 'main',
	  requiresIfExists: ['preventOverflow'],
	  fn: hide
	};

	var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
	var createPopper = /*#__PURE__*/popperGenerator({
	  defaultModifiers: defaultModifiers
	}); // eslint-disable-next-line import/no-unused-modules

	// Code derived from https://github.com/bryanmylee/svelte-popperjs/blob/master/src/index.ts
	function createPopperActions(initOptions) {
	  let contentNode;
	  let options = initOptions;
	  let popperInstance = null;
	  let referenceNode;

	  const initPopper = () => {
	    if (referenceNode && contentNode) {
	      popperInstance = createPopper(referenceNode, contentNode, options);
	    }
	  };

	  const deinitPopper = () => {
	    if (popperInstance) {
	      popperInstance.destroy();
	      popperInstance = null;
	    }
	  };

	  const referenceAction = (node) => {
	    referenceNode = node;
	    initPopper();
	    return {
	      destroy() {
	        deinitPopper();
	      }
	    };
	  };

	  const contentAction = (node, contentOptions) => {
	    contentNode = node;
	    options = Object.assign(Object.assign({}, initOptions), contentOptions);
	    initPopper();

	    return {
	      update(newContentOptions) {
	        options = Object.assign(
	          Object.assign({}, initOptions),
	          newContentOptions
	        );
	        if (popperInstance && options) {
	          popperInstance.setOptions(options);
	        }
	      },
	      destroy() {
	        deinitPopper();
	      }
	    };
	  };

	  return [referenceAction, contentAction, () => popperInstance];
	}

	const createContext = () => writable({});

	/* node_modules/sveltestrap/src/Dropdown.svelte generated by Svelte v3.44.2 */

	const { Error: Error_1 } = globals;
	const file$i = "node_modules/sveltestrap/src/Dropdown.svelte";

	// (124:0) {:else}
	function create_else_block$8(ctx) {
		let div;
		let current;
		const default_slot_template = /*#slots*/ ctx[19].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
		let div_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		const block = {
			c: function create() {
				div = element("div");
				if (default_slot) default_slot.c();
				set_attributes(div, div_data);
				add_location(div, file$i, 124, 2, 3186);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				/*div_binding*/ ctx[21](div);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[18],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
							null
						);
					}
				}

				set_attributes(div, div_data = get_spread_update(div_levels, [
					dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
					(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (default_slot) default_slot.d(detaching);
				/*div_binding*/ ctx[21](null);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block$8.name,
			type: "else",
			source: "(124:0) {:else}",
			ctx
		});

		return block;
	}

	// (120:0) {#if nav}
	function create_if_block$b(ctx) {
		let li;
		let current;
		const default_slot_template = /*#slots*/ ctx[19].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
		let li_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
		let li_data = {};

		for (let i = 0; i < li_levels.length; i += 1) {
			li_data = assign(li_data, li_levels[i]);
		}

		const block = {
			c: function create() {
				li = element("li");
				if (default_slot) default_slot.c();
				set_attributes(li, li_data);
				add_location(li, file$i, 120, 2, 3095);
			},
			m: function mount(target, anchor) {
				insert_dev(target, li, anchor);

				if (default_slot) {
					default_slot.m(li, null);
				}

				/*li_binding*/ ctx[20](li);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[18],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
							null
						);
					}
				}

				set_attributes(li, li_data = get_spread_update(li_levels, [
					dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
					(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(li);
				if (default_slot) default_slot.d(detaching);
				/*li_binding*/ ctx[20](null);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$b.name,
			type: "if",
			source: "(120:0) {#if nav}",
			ctx
		});

		return block;
	}

	function create_fragment$i(ctx) {
		let current_block_type_index;
		let if_block;
		let if_block_anchor;
		let current;
		const if_block_creators = [create_if_block$b, create_else_block$8];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*nav*/ ctx[0]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		const block = {
			c: function create() {
				if_block.c();
				if_block_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if_blocks[current_block_type_index].d(detaching);
				if (detaching) detach_dev(if_block_anchor);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$i.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$i($$self, $$props, $$invalidate) {
		let subItemIsActive;
		let classes;
		let handleToggle;

		const omit_props_names = [
			"class","active","addonType","direction","dropup","group","inNavbar","isOpen","nav","setActiveFromChild","size","toggle"
		];

		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Dropdown', slots, ['default']);
		const noop = () => undefined;
		let context = createContext();
		setContext('dropdownContext', context);
		let { class: className = '' } = $$props;
		let { active = false } = $$props;
		let { addonType = false } = $$props;
		let { direction = 'down' } = $$props;
		let { dropup = false } = $$props;
		let { group = false } = $$props;
		let { inNavbar = false } = $$props;
		let { isOpen = false } = $$props;
		let { nav = false } = $$props;
		let { setActiveFromChild = false } = $$props;
		let { size = '' } = $$props;
		let { toggle = undefined } = $$props;
		const [popperRef, popperContent] = createPopperActions();
		const validDirections = ['up', 'down', 'left', 'right', 'start', 'end'];

		if (validDirections.indexOf(direction) === -1) {
			throw new Error(`Invalid direction sent: '${direction}' is not one of 'up', 'down', 'left', 'right', 'start', 'end'`);
		}

		let component;
		let dropdownDirection;

		function handleDocumentClick(e) {
			if (e && (e.which === 3 || e.type === 'keyup' && e.which !== 9)) return;

			if (component.contains(e.target) && component !== e.target && (e.type !== 'keyup' || e.which === 9)) {
				return;
			}

			handleToggle(e);
		}

		onDestroy(() => {
			if (typeof document !== 'undefined') {
				['click', 'touchstart', 'keyup'].forEach(event => document.removeEventListener(event, handleDocumentClick, true));
			}
		});

		function li_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				component = $$value;
				$$invalidate(1, component);
			});
		}

		function div_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				component = $$value;
				$$invalidate(1, component);
			});
		}

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
			if ('active' in $$new_props) $$invalidate(6, active = $$new_props.active);
			if ('addonType' in $$new_props) $$invalidate(7, addonType = $$new_props.addonType);
			if ('direction' in $$new_props) $$invalidate(8, direction = $$new_props.direction);
			if ('dropup' in $$new_props) $$invalidate(9, dropup = $$new_props.dropup);
			if ('group' in $$new_props) $$invalidate(10, group = $$new_props.group);
			if ('inNavbar' in $$new_props) $$invalidate(11, inNavbar = $$new_props.inNavbar);
			if ('isOpen' in $$new_props) $$invalidate(4, isOpen = $$new_props.isOpen);
			if ('nav' in $$new_props) $$invalidate(0, nav = $$new_props.nav);
			if ('setActiveFromChild' in $$new_props) $$invalidate(12, setActiveFromChild = $$new_props.setActiveFromChild);
			if ('size' in $$new_props) $$invalidate(13, size = $$new_props.size);
			if ('toggle' in $$new_props) $$invalidate(14, toggle = $$new_props.toggle);
			if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({
			setContext,
			onDestroy,
			createPopperActions,
			classnames,
			createContext,
			noop,
			context,
			className,
			active,
			addonType,
			direction,
			dropup,
			group,
			inNavbar,
			isOpen,
			nav,
			setActiveFromChild,
			size,
			toggle,
			popperRef,
			popperContent,
			validDirections,
			component,
			dropdownDirection,
			handleDocumentClick,
			handleToggle,
			subItemIsActive,
			classes
		});

		$$self.$inject_state = $$new_props => {
			if ('context' in $$props) $$invalidate(23, context = $$new_props.context);
			if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
			if ('active' in $$props) $$invalidate(6, active = $$new_props.active);
			if ('addonType' in $$props) $$invalidate(7, addonType = $$new_props.addonType);
			if ('direction' in $$props) $$invalidate(8, direction = $$new_props.direction);
			if ('dropup' in $$props) $$invalidate(9, dropup = $$new_props.dropup);
			if ('group' in $$props) $$invalidate(10, group = $$new_props.group);
			if ('inNavbar' in $$props) $$invalidate(11, inNavbar = $$new_props.inNavbar);
			if ('isOpen' in $$props) $$invalidate(4, isOpen = $$new_props.isOpen);
			if ('nav' in $$props) $$invalidate(0, nav = $$new_props.nav);
			if ('setActiveFromChild' in $$props) $$invalidate(12, setActiveFromChild = $$new_props.setActiveFromChild);
			if ('size' in $$props) $$invalidate(13, size = $$new_props.size);
			if ('toggle' in $$props) $$invalidate(14, toggle = $$new_props.toggle);
			if ('component' in $$props) $$invalidate(1, component = $$new_props.component);
			if ('dropdownDirection' in $$props) $$invalidate(15, dropdownDirection = $$new_props.dropdownDirection);
			if ('handleToggle' in $$props) $$invalidate(16, handleToggle = $$new_props.handleToggle);
			if ('subItemIsActive' in $$props) $$invalidate(17, subItemIsActive = $$new_props.subItemIsActive);
			if ('classes' in $$props) $$invalidate(2, classes = $$new_props.classes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*setActiveFromChild, component*/ 4098) {
				$$invalidate(17, subItemIsActive = !!(setActiveFromChild && component && typeof component.querySelector === 'function' && component.querySelector('.active')));
			}

			if ($$self.$$.dirty & /*direction*/ 256) {
				{
					if (direction === 'left') $$invalidate(15, dropdownDirection = 'start'); else if (direction === 'right') $$invalidate(15, dropdownDirection = 'end'); else $$invalidate(15, dropdownDirection = direction);
				}
			}

			if ($$self.$$.dirty & /*toggle, isOpen*/ 16400) {
				$$invalidate(16, handleToggle = toggle || (() => $$invalidate(4, isOpen = !isOpen)));
			}

			if ($$self.$$.dirty & /*className, direction, dropdownDirection, nav, active, setActiveFromChild, subItemIsActive, addonType, group, size, isOpen*/ 177649) {
				$$invalidate(2, classes = classnames(className, direction !== 'down' && `drop${dropdownDirection}`, nav && active ? 'active' : false, setActiveFromChild && subItemIsActive ? 'active' : false, {
					[`input-group-${addonType}`]: addonType,
					'btn-group': group,
					[`btn-group-${size}`]: !!size,
					dropdown: !group && !addonType,
					show: isOpen,
					'nav-item': nav
				}));
			}

			if ($$self.$$.dirty & /*isOpen*/ 16) {
				{
					if (typeof document !== 'undefined') {
						if (isOpen) {
							['click', 'touchstart', 'keyup'].forEach(event => document.addEventListener(event, handleDocumentClick, true));
						} else {
							['click', 'touchstart', 'keyup'].forEach(event => document.removeEventListener(event, handleDocumentClick, true));
						}
					}
				}
			}

			if ($$self.$$.dirty & /*handleToggle, isOpen, direction, dropup, inNavbar, nav*/ 68369) {
				{
					context.update(() => {
						return {
							toggle: handleToggle,
							isOpen,
							direction: direction === 'down' && dropup ? 'up' : direction,
							inNavbar,
							popperRef: nav ? noop : popperRef,
							popperContent: nav ? noop : popperContent
						};
					});
				}
			}
		};

		return [
			nav,
			component,
			classes,
			$$restProps,
			isOpen,
			className,
			active,
			addonType,
			direction,
			dropup,
			group,
			inNavbar,
			setActiveFromChild,
			size,
			toggle,
			dropdownDirection,
			handleToggle,
			subItemIsActive,
			$$scope,
			slots,
			li_binding,
			div_binding
		];
	}

	class Dropdown extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance$i, create_fragment$i, safe_not_equal, {
				class: 5,
				active: 6,
				addonType: 7,
				direction: 8,
				dropup: 9,
				group: 10,
				inNavbar: 11,
				isOpen: 4,
				nav: 0,
				setActiveFromChild: 12,
				size: 13,
				toggle: 14
			});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Dropdown",
				options,
				id: create_fragment$i.name
			});
		}

		get class() {
			throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get active() {
			throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set active(value) {
			throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get addonType() {
			throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set addonType(value) {
			throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get direction() {
			throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set direction(value) {
			throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get dropup() {
			throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set dropup(value) {
			throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get group() {
			throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set group(value) {
			throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get inNavbar() {
			throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set inNavbar(value) {
			throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get isOpen() {
			throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set isOpen(value) {
			throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get nav() {
			throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set nav(value) {
			throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get setActiveFromChild() {
			throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set setActiveFromChild(value) {
			throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get size() {
			throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set size(value) {
			throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get toggle() {
			throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set toggle(value) {
			throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* node_modules/sveltestrap/src/DropdownItem.svelte generated by Svelte v3.44.2 */
	const file$h = "node_modules/sveltestrap/src/DropdownItem.svelte";

	// (49:0) {:else}
	function create_else_block$7(ctx) {
		let button;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[12].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
		let button_levels = [{ type: "button" }, /*$$restProps*/ ctx[6], { class: /*classes*/ ctx[3] }];
		let button_data = {};

		for (let i = 0; i < button_levels.length; i += 1) {
			button_data = assign(button_data, button_levels[i]);
		}

		const block = {
			c: function create() {
				button = element("button");
				if (default_slot) default_slot.c();
				set_attributes(button, button_data);
				add_location(button, file$h, 49, 2, 1086);
			},
			m: function mount(target, anchor) {
				insert_dev(target, button, anchor);

				if (default_slot) {
					default_slot.m(button, null);
				}

				if (button.autofocus) button.focus();
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(button, "click", /*click_handler_2*/ ctx[15], false, false, false),
						listen_dev(button, "click", /*handleItemClick*/ ctx[5], false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[11],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
							null
						);
					}
				}

				set_attributes(button, button_data = get_spread_update(button_levels, [
					{ type: "button" },
					dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
					(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(button);
				if (default_slot) default_slot.d(detaching);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block$7.name,
			type: "else",
			source: "(49:0) {:else}",
			ctx
		});

		return block;
	}

	// (45:15) 
	function create_if_block_2$6(ctx) {
		let a;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[12].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

		let a_levels = [
			/*$$restProps*/ ctx[6],
			{ click: "" },
			{ href: /*href*/ ctx[2] },
			{ class: /*classes*/ ctx[3] }
		];

		let a_data = {};

		for (let i = 0; i < a_levels.length; i += 1) {
			a_data = assign(a_data, a_levels[i]);
		}

		const block = {
			c: function create() {
				a = element("a");
				if (default_slot) default_slot.c();
				set_attributes(a, a_data);
				add_location(a, file$h, 45, 2, 979);
			},
			m: function mount(target, anchor) {
				insert_dev(target, a, anchor);

				if (default_slot) {
					default_slot.m(a, null);
				}

				current = true;

				if (!mounted) {
					dispose = listen_dev(a, "click", /*handleItemClick*/ ctx[5], false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[11],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
							null
						);
					}
				}

				set_attributes(a, a_data = get_spread_update(a_levels, [
					dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
					{ click: "" },
					(!current || dirty & /*href*/ 4) && { href: /*href*/ ctx[2] },
					(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(a);
				if (default_slot) default_slot.d(detaching);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_2$6.name,
			type: "if",
			source: "(45:15) ",
			ctx
		});

		return block;
	}

	// (41:18) 
	function create_if_block_1$7(ctx) {
		let div;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[12].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
		let div_levels = [/*$$restProps*/ ctx[6], { class: /*classes*/ ctx[3] }];
		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		const block = {
			c: function create() {
				div = element("div");
				if (default_slot) default_slot.c();
				set_attributes(div, div_data);
				add_location(div, file$h, 41, 2, 864);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(div, "click", /*click_handler_1*/ ctx[14], false, false, false),
						listen_dev(div, "click", /*handleItemClick*/ ctx[5], false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[11],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
							null
						);
					}
				}

				set_attributes(div, div_data = get_spread_update(div_levels, [
					dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
					(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (default_slot) default_slot.d(detaching);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1$7.name,
			type: "if",
			source: "(41:18) ",
			ctx
		});

		return block;
	}

	// (37:0) {#if header}
	function create_if_block$a(ctx) {
		let h6;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[12].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
		let h6_levels = [/*$$restProps*/ ctx[6], { class: /*classes*/ ctx[3] }];
		let h6_data = {};

		for (let i = 0; i < h6_levels.length; i += 1) {
			h6_data = assign(h6_data, h6_levels[i]);
		}

		const block = {
			c: function create() {
				h6 = element("h6");
				if (default_slot) default_slot.c();
				set_attributes(h6, h6_data);
				add_location(h6, file$h, 37, 2, 748);
			},
			m: function mount(target, anchor) {
				insert_dev(target, h6, anchor);

				if (default_slot) {
					default_slot.m(h6, null);
				}

				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(h6, "click", /*click_handler*/ ctx[13], false, false, false),
						listen_dev(h6, "click", /*handleItemClick*/ ctx[5], false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[11],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
							null
						);
					}
				}

				set_attributes(h6, h6_data = get_spread_update(h6_levels, [
					dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
					(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(h6);
				if (default_slot) default_slot.d(detaching);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$a.name,
			type: "if",
			source: "(37:0) {#if header}",
			ctx
		});

		return block;
	}

	function create_fragment$h(ctx) {
		let current_block_type_index;
		let if_block;
		let if_block_anchor;
		let current;
		const if_block_creators = [create_if_block$a, create_if_block_1$7, create_if_block_2$6, create_else_block$7];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*header*/ ctx[1]) return 0;
			if (/*divider*/ ctx[0]) return 1;
			if (/*href*/ ctx[2]) return 2;
			return 3;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		const block = {
			c: function create() {
				if_block.c();
				if_block_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if_blocks[current_block_type_index].d(detaching);
				if (detaching) detach_dev(if_block_anchor);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$h.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$h($$self, $$props, $$invalidate) {
		let classes;
		const omit_props_names = ["class","active","disabled","divider","header","toggle","href"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let $context;
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('DropdownItem', slots, ['default']);
		const context = getContext('dropdownContext');
		validate_store(context, 'context');
		component_subscribe($$self, context, value => $$invalidate(16, $context = value));
		let { class: className = '' } = $$props;
		let { active = false } = $$props;
		let { disabled = false } = $$props;
		let { divider = false } = $$props;
		let { header = false } = $$props;
		let { toggle = true } = $$props;
		let { href = '' } = $$props;

		function handleItemClick(e) {
			if (disabled || header || divider) {
				e.preventDefault();
				return;
			}

			if (toggle) {
				$context.toggle(e);
			}
		}

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		function click_handler_1(event) {
			bubble.call(this, $$self, event);
		}

		function click_handler_2(event) {
			bubble.call(this, $$self, event);
		}

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('class' in $$new_props) $$invalidate(7, className = $$new_props.class);
			if ('active' in $$new_props) $$invalidate(8, active = $$new_props.active);
			if ('disabled' in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
			if ('divider' in $$new_props) $$invalidate(0, divider = $$new_props.divider);
			if ('header' in $$new_props) $$invalidate(1, header = $$new_props.header);
			if ('toggle' in $$new_props) $$invalidate(10, toggle = $$new_props.toggle);
			if ('href' in $$new_props) $$invalidate(2, href = $$new_props.href);
			if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({
			getContext,
			classnames,
			context,
			className,
			active,
			disabled,
			divider,
			header,
			toggle,
			href,
			handleItemClick,
			classes,
			$context
		});

		$$self.$inject_state = $$new_props => {
			if ('className' in $$props) $$invalidate(7, className = $$new_props.className);
			if ('active' in $$props) $$invalidate(8, active = $$new_props.active);
			if ('disabled' in $$props) $$invalidate(9, disabled = $$new_props.disabled);
			if ('divider' in $$props) $$invalidate(0, divider = $$new_props.divider);
			if ('header' in $$props) $$invalidate(1, header = $$new_props.header);
			if ('toggle' in $$props) $$invalidate(10, toggle = $$new_props.toggle);
			if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
			if ('classes' in $$props) $$invalidate(3, classes = $$new_props.classes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*className, disabled, divider, header, active*/ 899) {
				$$invalidate(3, classes = classnames(className, {
					disabled,
					'dropdown-item': !divider && !header,
					active,
					'dropdown-header': header,
					'dropdown-divider': divider
				}));
			}
		};

		return [
			divider,
			header,
			href,
			classes,
			context,
			handleItemClick,
			$$restProps,
			className,
			active,
			disabled,
			toggle,
			$$scope,
			slots,
			click_handler,
			click_handler_1,
			click_handler_2
		];
	}

	class DropdownItem extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance$h, create_fragment$h, safe_not_equal, {
				class: 7,
				active: 8,
				disabled: 9,
				divider: 0,
				header: 1,
				toggle: 10,
				href: 2
			});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "DropdownItem",
				options,
				id: create_fragment$h.name
			});
		}

		get class() {
			throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get active() {
			throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set active(value) {
			throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get disabled() {
			throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set disabled(value) {
			throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get divider() {
			throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set divider(value) {
			throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get header() {
			throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set header(value) {
			throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get toggle() {
			throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set toggle(value) {
			throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get href() {
			throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set href(value) {
			throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* node_modules/sveltestrap/src/DropdownMenu.svelte generated by Svelte v3.44.2 */
	const file$g = "node_modules/sveltestrap/src/DropdownMenu.svelte";

	function create_fragment$g(ctx) {
		let div;
		let $context_popperContent_action;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[10].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
		let div_levels = [/*$$restProps*/ ctx[4], { class: /*classes*/ ctx[1] }];
		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		const block = {
			c: function create() {
				div = element("div");
				if (default_slot) default_slot.c();
				set_attributes(div, div_data);
				add_location(div, file$g, 41, 0, 933);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				current = true;

				if (!mounted) {
					dispose = action_destroyer($context_popperContent_action = /*$context*/ ctx[0].popperContent(div, /*popperOptions*/ ctx[2]));
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[9],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
							null
						);
					}
				}

				set_attributes(div, div_data = get_spread_update(div_levels, [
					dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4],
					(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
				]));

				if ($context_popperContent_action && is_function($context_popperContent_action.update) && dirty & /*popperOptions*/ 4) $context_popperContent_action.update.call(null, /*popperOptions*/ ctx[2]);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (default_slot) default_slot.d(detaching);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$g.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$g($$self, $$props, $$invalidate) {
		let popperOptions;
		let classes;
		const omit_props_names = ["class","dark","end","right"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let $context;
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('DropdownMenu', slots, ['default']);
		const context = getContext('dropdownContext');
		validate_store(context, 'context');
		component_subscribe($$self, context, value => $$invalidate(0, $context = value));
		let { class: className = '' } = $$props;
		let { dark = false } = $$props;
		let { end = false } = $$props;
		let { right = false } = $$props;

		const popperPlacement = (direction, end) => {
			let prefix = direction;
			if (direction === 'up') prefix = 'top'; else if (direction === 'down') prefix = 'bottom';
			let suffix = end ? 'end' : 'start';
			return `${prefix}-${suffix}`;
		};

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
			if ('dark' in $$new_props) $$invalidate(6, dark = $$new_props.dark);
			if ('end' in $$new_props) $$invalidate(7, end = $$new_props.end);
			if ('right' in $$new_props) $$invalidate(8, right = $$new_props.right);
			if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({
			getContext,
			classnames,
			context,
			className,
			dark,
			end,
			right,
			popperPlacement,
			classes,
			popperOptions,
			$context
		});

		$$self.$inject_state = $$new_props => {
			if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
			if ('dark' in $$props) $$invalidate(6, dark = $$new_props.dark);
			if ('end' in $$props) $$invalidate(7, end = $$new_props.end);
			if ('right' in $$props) $$invalidate(8, right = $$new_props.right);
			if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
			if ('popperOptions' in $$props) $$invalidate(2, popperOptions = $$new_props.popperOptions);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*$context, end, right*/ 385) {
				$$invalidate(2, popperOptions = {
					modifiers: [
						{ name: 'flip' },
						{
							name: 'offset',
							options: { offset: [0, 2] }
						}
					],
					placement: popperPlacement($context.direction, end || right)
				});
			}

			if ($$self.$$.dirty & /*className, dark, end, right, $context*/ 481) {
				$$invalidate(1, classes = classnames(className, 'dropdown-menu', {
					'dropdown-menu-dark': dark,
					'dropdown-menu-end': end || right,
					show: $context.isOpen
				}));
			}
		};

		return [
			$context,
			classes,
			popperOptions,
			context,
			$$restProps,
			className,
			dark,
			end,
			right,
			$$scope,
			slots
		];
	}

	class DropdownMenu extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$g, create_fragment$g, safe_not_equal, { class: 5, dark: 6, end: 7, right: 8 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "DropdownMenu",
				options,
				id: create_fragment$g.name
			});
		}

		get class() {
			throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get dark() {
			throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set dark(value) {
			throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get end() {
			throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set end(value) {
			throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get right() {
			throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set right(value) {
			throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* node_modules/sveltestrap/src/DropdownToggle.svelte generated by Svelte v3.44.2 */
	const file$f = "node_modules/sveltestrap/src/DropdownToggle.svelte";

	// (94:0) {:else}
	function create_else_block$6(ctx) {
		let button;
		let button_aria_expanded_value;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[20].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
		const default_slot_or_fallback = default_slot || fallback_block_3(ctx);

		let button_levels = [
			/*$$restProps*/ ctx[9],
			{ type: "button" },
			{
				"aria-expanded": button_aria_expanded_value = /*$context*/ ctx[6].isOpen
			},
			{ class: /*btnClasses*/ ctx[5] }
		];

		let button_data = {};

		for (let i = 0; i < button_levels.length; i += 1) {
			button_data = assign(button_data, button_levels[i]);
		}

		const block_1 = {
			c: function create() {
				button = element("button");
				if (default_slot_or_fallback) default_slot_or_fallback.c();
				set_attributes(button, button_data);
				add_location(button, file$f, 94, 2, 1948);
			},
			m: function mount(target, anchor) {
				insert_dev(target, button, anchor);

				if (default_slot_or_fallback) {
					default_slot_or_fallback.m(button, null);
				}

				if (button.autofocus) button.focus();
				/*button_binding*/ ctx[28](button);
				current = true;

				if (!mounted) {
					dispose = [
						action_destroyer(/*$context*/ ctx[6].popperRef(button)),
						listen_dev(button, "click", /*click_handler_3*/ ctx[24], false, false, false),
						listen_dev(button, "click", /*toggleButton*/ ctx[8], false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[19],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
							null
						);
					}
				} else {
					if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
						default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
					}
				}

				set_attributes(button, button_data = get_spread_update(button_levels, [
					dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
					{ type: "button" },
					(!current || dirty & /*$context*/ 64 && button_aria_expanded_value !== (button_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && {
						"aria-expanded": button_aria_expanded_value
					},
					(!current || dirty & /*btnClasses*/ 32) && { class: /*btnClasses*/ ctx[5] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot_or_fallback, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot_or_fallback, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(button);
				if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
				/*button_binding*/ ctx[28](null);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: create_else_block$6.name,
			type: "else",
			source: "(94:0) {:else}",
			ctx
		});

		return block_1;
	}

	// (80:25) 
	function create_if_block_2$5(ctx) {
		let span;
		let span_aria_expanded_value;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[20].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
		const default_slot_or_fallback = default_slot || fallback_block_2(ctx);

		let span_levels = [
			/*$$restProps*/ ctx[9],
			{
				"aria-expanded": span_aria_expanded_value = /*$context*/ ctx[6].isOpen
			},
			{ class: /*classes*/ ctx[4] }
		];

		let span_data = {};

		for (let i = 0; i < span_levels.length; i += 1) {
			span_data = assign(span_data, span_levels[i]);
		}

		const block_1 = {
			c: function create() {
				span = element("span");
				if (default_slot_or_fallback) default_slot_or_fallback.c();
				set_attributes(span, span_data);
				add_location(span, file$f, 80, 2, 1673);
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);

				if (default_slot_or_fallback) {
					default_slot_or_fallback.m(span, null);
				}

				/*span_binding*/ ctx[27](span);
				current = true;

				if (!mounted) {
					dispose = [
						action_destroyer(/*$context*/ ctx[6].popperRef(span)),
						listen_dev(span, "click", /*click_handler_2*/ ctx[23], false, false, false),
						listen_dev(span, "click", /*toggleButton*/ ctx[8], false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[19],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
							null
						);
					}
				} else {
					if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
						default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
					}
				}

				set_attributes(span, span_data = get_spread_update(span_levels, [
					dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
					(!current || dirty & /*$context*/ 64 && span_aria_expanded_value !== (span_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && {
						"aria-expanded": span_aria_expanded_value
					},
					(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot_or_fallback, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot_or_fallback, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(span);
				if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
				/*span_binding*/ ctx[27](null);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: create_if_block_2$5.name,
			type: "if",
			source: "(80:25) ",
			ctx
		});

		return block_1;
	}

	// (66:24) 
	function create_if_block_1$6(ctx) {
		let div;
		let div_aria_expanded_value;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[20].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
		const default_slot_or_fallback = default_slot || fallback_block_1(ctx);

		let div_levels = [
			/*$$restProps*/ ctx[9],
			{
				"aria-expanded": div_aria_expanded_value = /*$context*/ ctx[6].isOpen
			},
			{ class: /*classes*/ ctx[4] }
		];

		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		const block_1 = {
			c: function create() {
				div = element("div");
				if (default_slot_or_fallback) default_slot_or_fallback.c();
				set_attributes(div, div_data);
				add_location(div, file$f, 66, 2, 1382);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot_or_fallback) {
					default_slot_or_fallback.m(div, null);
				}

				/*div_binding*/ ctx[26](div);
				current = true;

				if (!mounted) {
					dispose = [
						action_destroyer(/*$context*/ ctx[6].popperRef(div)),
						listen_dev(div, "click", /*click_handler_1*/ ctx[22], false, false, false),
						listen_dev(div, "click", /*toggleButton*/ ctx[8], false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[19],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
							null
						);
					}
				} else {
					if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
						default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
					}
				}

				set_attributes(div, div_data = get_spread_update(div_levels, [
					dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
					(!current || dirty & /*$context*/ 64 && div_aria_expanded_value !== (div_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && { "aria-expanded": div_aria_expanded_value },
					(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot_or_fallback, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot_or_fallback, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
				/*div_binding*/ ctx[26](null);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: create_if_block_1$6.name,
			type: "if",
			source: "(66:24) ",
			ctx
		});

		return block_1;
	}

	// (51:0) {#if nav}
	function create_if_block$9(ctx) {
		let a;
		let a_aria_expanded_value;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[20].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
		const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

		let a_levels = [
			/*$$restProps*/ ctx[9],
			{ href: "#nav" },
			{
				"aria-expanded": a_aria_expanded_value = /*$context*/ ctx[6].isOpen
			},
			{ class: /*classes*/ ctx[4] }
		];

		let a_data = {};

		for (let i = 0; i < a_levels.length; i += 1) {
			a_data = assign(a_data, a_levels[i]);
		}

		const block_1 = {
			c: function create() {
				a = element("a");
				if (default_slot_or_fallback) default_slot_or_fallback.c();
				set_attributes(a, a_data);
				add_location(a, file$f, 51, 2, 1080);
			},
			m: function mount(target, anchor) {
				insert_dev(target, a, anchor);

				if (default_slot_or_fallback) {
					default_slot_or_fallback.m(a, null);
				}

				/*a_binding*/ ctx[25](a);
				current = true;

				if (!mounted) {
					dispose = [
						action_destroyer(/*$context*/ ctx[6].popperRef(a)),
						listen_dev(a, "click", /*click_handler*/ ctx[21], false, false, false),
						listen_dev(a, "click", /*toggleButton*/ ctx[8], false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[19],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
							null
						);
					}
				} else {
					if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
						default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
					}
				}

				set_attributes(a, a_data = get_spread_update(a_levels, [
					dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
					{ href: "#nav" },
					(!current || dirty & /*$context*/ 64 && a_aria_expanded_value !== (a_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && { "aria-expanded": a_aria_expanded_value },
					(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot_or_fallback, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot_or_fallback, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(a);
				if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
				/*a_binding*/ ctx[25](null);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: create_if_block$9.name,
			type: "if",
			source: "(51:0) {#if nav}",
			ctx
		});

		return block_1;
	}

	// (105:10)        
	function fallback_block_3(ctx) {
		let span;
		let t;

		const block_1 = {
			c: function create() {
				span = element("span");
				t = text(/*ariaLabel*/ ctx[1]);
				attr_dev(span, "class", "visually-hidden");
				add_location(span, file$f, 105, 6, 2165);
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
				append_dev(span, t);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*ariaLabel*/ 2) set_data_dev(t, /*ariaLabel*/ ctx[1]);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(span);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: fallback_block_3.name,
			type: "fallback",
			source: "(105:10)        ",
			ctx
		});

		return block_1;
	}

	// (90:10)        
	function fallback_block_2(ctx) {
		let span;
		let t;

		const block_1 = {
			c: function create() {
				span = element("span");
				t = text(/*ariaLabel*/ ctx[1]);
				attr_dev(span, "class", "visually-hidden");
				add_location(span, file$f, 90, 6, 1867);
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
				append_dev(span, t);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*ariaLabel*/ 2) set_data_dev(t, /*ariaLabel*/ ctx[1]);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(span);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: fallback_block_2.name,
			type: "fallback",
			source: "(90:10)        ",
			ctx
		});

		return block_1;
	}

	// (76:10)        
	function fallback_block_1(ctx) {
		let span;
		let t;

		const block_1 = {
			c: function create() {
				span = element("span");
				t = text(/*ariaLabel*/ ctx[1]);
				attr_dev(span, "class", "visually-hidden");
				add_location(span, file$f, 76, 6, 1575);
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
				append_dev(span, t);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*ariaLabel*/ 2) set_data_dev(t, /*ariaLabel*/ ctx[1]);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(span);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: fallback_block_1.name,
			type: "fallback",
			source: "(76:10)        ",
			ctx
		});

		return block_1;
	}

	// (62:10)        
	function fallback_block$1(ctx) {
		let span;
		let t;

		const block_1 = {
			c: function create() {
				span = element("span");
				t = text(/*ariaLabel*/ ctx[1]);
				attr_dev(span, "class", "visually-hidden");
				add_location(span, file$f, 62, 6, 1287);
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
				append_dev(span, t);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*ariaLabel*/ 2) set_data_dev(t, /*ariaLabel*/ ctx[1]);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(span);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: fallback_block$1.name,
			type: "fallback",
			source: "(62:10)        ",
			ctx
		});

		return block_1;
	}

	function create_fragment$f(ctx) {
		let current_block_type_index;
		let if_block;
		let if_block_anchor;
		let current;
		const if_block_creators = [create_if_block$9, create_if_block_1$6, create_if_block_2$5, create_else_block$6];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*nav*/ ctx[2]) return 0;
			if (/*tag*/ ctx[3] === 'div') return 1;
			if (/*tag*/ ctx[3] === 'span') return 2;
			return 3;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		const block_1 = {
			c: function create() {
				if_block.c();
				if_block_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if_blocks[current_block_type_index].d(detaching);
				if (detaching) detach_dev(if_block_anchor);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block: block_1,
			id: create_fragment$f.name,
			type: "component",
			source: "",
			ctx
		});

		return block_1;
	}

	function instance$f($$self, $$props, $$invalidate) {
		let classes;
		let btnClasses;

		const omit_props_names = [
			"class","ariaLabel","active","block","caret","color","disabled","inner","nav","outline","size","split","tag"
		];

		let $$restProps = compute_rest_props($$props, omit_props_names);
		let $context;
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('DropdownToggle', slots, ['default']);
		const context = getContext('dropdownContext');
		validate_store(context, 'context');
		component_subscribe($$self, context, value => $$invalidate(6, $context = value));
		let { class: className = '' } = $$props;
		let { ariaLabel = 'Toggle Dropdown' } = $$props;
		let { active = false } = $$props;
		let { block = false } = $$props;
		let { caret = false } = $$props;
		let { color = 'secondary' } = $$props;
		let { disabled = false } = $$props;
		let { inner = undefined } = $$props;
		let { nav = false } = $$props;
		let { outline = false } = $$props;
		let { size = '' } = $$props;
		let { split = false } = $$props;
		let { tag = null } = $$props;

		function toggleButton(e) {
			if (disabled) {
				e.preventDefault();
				return;
			}

			if (nav) {
				e.preventDefault();
			}

			$context.toggle(e);
		}

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		function click_handler_1(event) {
			bubble.call(this, $$self, event);
		}

		function click_handler_2(event) {
			bubble.call(this, $$self, event);
		}

		function click_handler_3(event) {
			bubble.call(this, $$self, event);
		}

		function a_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				inner = $$value;
				$$invalidate(0, inner);
			});
		}

		function div_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				inner = $$value;
				$$invalidate(0, inner);
			});
		}

		function span_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				inner = $$value;
				$$invalidate(0, inner);
			});
		}

		function button_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				inner = $$value;
				$$invalidate(0, inner);
			});
		}

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
			if ('ariaLabel' in $$new_props) $$invalidate(1, ariaLabel = $$new_props.ariaLabel);
			if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
			if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
			if ('caret' in $$new_props) $$invalidate(13, caret = $$new_props.caret);
			if ('color' in $$new_props) $$invalidate(14, color = $$new_props.color);
			if ('disabled' in $$new_props) $$invalidate(15, disabled = $$new_props.disabled);
			if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
			if ('nav' in $$new_props) $$invalidate(2, nav = $$new_props.nav);
			if ('outline' in $$new_props) $$invalidate(16, outline = $$new_props.outline);
			if ('size' in $$new_props) $$invalidate(17, size = $$new_props.size);
			if ('split' in $$new_props) $$invalidate(18, split = $$new_props.split);
			if ('tag' in $$new_props) $$invalidate(3, tag = $$new_props.tag);
			if ('$$scope' in $$new_props) $$invalidate(19, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({
			getContext,
			classnames,
			context,
			className,
			ariaLabel,
			active,
			block,
			caret,
			color,
			disabled,
			inner,
			nav,
			outline,
			size,
			split,
			tag,
			toggleButton,
			classes,
			btnClasses,
			$context
		});

		$$self.$inject_state = $$new_props => {
			if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
			if ('ariaLabel' in $$props) $$invalidate(1, ariaLabel = $$new_props.ariaLabel);
			if ('active' in $$props) $$invalidate(11, active = $$new_props.active);
			if ('block' in $$props) $$invalidate(12, block = $$new_props.block);
			if ('caret' in $$props) $$invalidate(13, caret = $$new_props.caret);
			if ('color' in $$props) $$invalidate(14, color = $$new_props.color);
			if ('disabled' in $$props) $$invalidate(15, disabled = $$new_props.disabled);
			if ('inner' in $$props) $$invalidate(0, inner = $$new_props.inner);
			if ('nav' in $$props) $$invalidate(2, nav = $$new_props.nav);
			if ('outline' in $$props) $$invalidate(16, outline = $$new_props.outline);
			if ('size' in $$props) $$invalidate(17, size = $$new_props.size);
			if ('split' in $$props) $$invalidate(18, split = $$new_props.split);
			if ('tag' in $$props) $$invalidate(3, tag = $$new_props.tag);
			if ('classes' in $$props) $$invalidate(4, classes = $$new_props.classes);
			if ('btnClasses' in $$props) $$invalidate(5, btnClasses = $$new_props.btnClasses);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*className, caret, split, nav*/ 271364) {
				$$invalidate(4, classes = classnames(className, {
					'dropdown-toggle': caret || split,
					'dropdown-toggle-split': split,
					'nav-link': nav
				}));
			}

			if ($$self.$$.dirty & /*classes, outline, color, size, block, active*/ 219152) {
				$$invalidate(5, btnClasses = classnames(classes, 'btn', `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'd-block w-100' : false, { active }));
			}
		};

		return [
			inner,
			ariaLabel,
			nav,
			tag,
			classes,
			btnClasses,
			$context,
			context,
			toggleButton,
			$$restProps,
			className,
			active,
			block,
			caret,
			color,
			disabled,
			outline,
			size,
			split,
			$$scope,
			slots,
			click_handler,
			click_handler_1,
			click_handler_2,
			click_handler_3,
			a_binding,
			div_binding,
			span_binding,
			button_binding
		];
	}

	class DropdownToggle extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance$f, create_fragment$f, safe_not_equal, {
				class: 10,
				ariaLabel: 1,
				active: 11,
				block: 12,
				caret: 13,
				color: 14,
				disabled: 15,
				inner: 0,
				nav: 2,
				outline: 16,
				size: 17,
				split: 18,
				tag: 3
			});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "DropdownToggle",
				options,
				id: create_fragment$f.name
			});
		}

		get class() {
			throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get ariaLabel() {
			throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set ariaLabel(value) {
			throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get active() {
			throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set active(value) {
			throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get block() {
			throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set block(value) {
			throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get caret() {
			throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set caret(value) {
			throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get color() {
			throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set color(value) {
			throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get disabled() {
			throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set disabled(value) {
			throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get inner() {
			throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set inner(value) {
			throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get nav() {
			throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set nav(value) {
			throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get outline() {
			throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set outline(value) {
			throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get size() {
			throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set size(value) {
			throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get split() {
			throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set split(value) {
			throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get tag() {
			throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set tag(value) {
			throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* node_modules/sveltestrap/src/Icon.svelte generated by Svelte v3.44.2 */
	const file$e = "node_modules/sveltestrap/src/Icon.svelte";

	function create_fragment$e(ctx) {
		let i;
		let i_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
		let i_data = {};

		for (let i = 0; i < i_levels.length; i += 1) {
			i_data = assign(i_data, i_levels[i]);
		}

		const block = {
			c: function create() {
				i = element("i");
				set_attributes(i, i_data);
				add_location(i, file$e, 10, 0, 189);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, i, anchor);
			},
			p: function update(ctx, [dirty]) {
				set_attributes(i, i_data = get_spread_update(i_levels, [
					dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
					dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
				]));
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) detach_dev(i);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$e.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$e($$self, $$props, $$invalidate) {
		let classes;
		const omit_props_names = ["class","name"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Icon', slots, []);
		let { class: className = '' } = $$props;
		let { name = '' } = $$props;

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
			if ('name' in $$new_props) $$invalidate(3, name = $$new_props.name);
		};

		$$self.$capture_state = () => ({ classnames, className, name, classes });

		$$self.$inject_state = $$new_props => {
			if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
			if ('name' in $$props) $$invalidate(3, name = $$new_props.name);
			if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*className, name*/ 12) {
				$$invalidate(0, classes = classnames(className, `bi-${name}`));
			}
		};

		return [classes, $$restProps, className, name];
	}

	class Icon extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$e, create_fragment$e, safe_not_equal, { class: 2, name: 3 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Icon",
				options,
				id: create_fragment$e.name
			});
		}

		get class() {
			throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get name() {
			throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set name(value) {
			throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* node_modules/sveltestrap/src/InlineContainer.svelte generated by Svelte v3.44.2 */

	const file$d = "node_modules/sveltestrap/src/InlineContainer.svelte";

	function create_fragment$d(ctx) {
		let div;
		let current;
		const default_slot_template = /*#slots*/ ctx[1].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

		const block = {
			c: function create() {
				div = element("div");
				if (default_slot) default_slot.c();
				add_location(div, file$d, 3, 0, 67);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[0],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
							null
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$d.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$d($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('InlineContainer', slots, ['default']);
		let x = 'wtf svelte?'; // eslint-disable-line
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InlineContainer> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
		};

		$$self.$capture_state = () => ({ x });

		$$self.$inject_state = $$props => {
			if ('x' in $$props) x = $$props.x;
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [$$scope, slots];
	}

	class InlineContainer extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "InlineContainer",
				options,
				id: create_fragment$d.name
			});
		}
	}

	/* node_modules/sveltestrap/src/ModalBackdrop.svelte generated by Svelte v3.44.2 */
	const file$c = "node_modules/sveltestrap/src/ModalBackdrop.svelte";

	// (12:0) {#if isOpen}
	function create_if_block$8(ctx) {
		let div;
		let div_intro;
		let div_outro;
		let current;
		let mounted;
		let dispose;
		let div_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		const block = {
			c: function create() {
				div = element("div");
				set_attributes(div, div_data);
				toggle_class(div, "fade", /*fade*/ ctx[1]);
				add_location(div, file$c, 12, 2, 350);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				current = true;

				if (!mounted) {
					dispose = listen_dev(div, "click", /*click_handler*/ ctx[5], false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				set_attributes(div, div_data = get_spread_update(div_levels, [
					dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
					(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
				]));

				toggle_class(div, "fade", /*fade*/ ctx[1]);
			},
			i: function intro(local) {
				if (current) return;

				add_render_callback(() => {
					if (div_outro) div_outro.end(1);
					div_intro = create_in_transition(div, backdropIn, {});
					div_intro.start();
				});

				current = true;
			},
			o: function outro(local) {
				if (div_intro) div_intro.invalidate();
				div_outro = create_out_transition(div, backdropOut, {});
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (detaching && div_outro) div_outro.end();
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$8.name,
			type: "if",
			source: "(12:0) {#if isOpen}",
			ctx
		});

		return block;
	}

	function create_fragment$c(ctx) {
		let if_block_anchor;
		let current;
		let if_block = /*isOpen*/ ctx[0] && create_if_block$8(ctx);

		const block = {
			c: function create() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (/*isOpen*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*isOpen*/ 1) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block$8(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (if_block) if_block.d(detaching);
				if (detaching) detach_dev(if_block_anchor);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$c.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$c($$self, $$props, $$invalidate) {
		let classes;
		const omit_props_names = ["class","isOpen","fade"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('ModalBackdrop', slots, []);
		let { class: className = '' } = $$props;
		let { isOpen = false } = $$props;
		let { fade = true } = $$props;

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
			if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
			if ('fade' in $$new_props) $$invalidate(1, fade = $$new_props.fade);
		};

		$$self.$capture_state = () => ({
			classnames,
			backdropIn,
			backdropOut,
			className,
			isOpen,
			fade,
			classes
		});

		$$self.$inject_state = $$new_props => {
			if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
			if ('isOpen' in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
			if ('fade' in $$props) $$invalidate(1, fade = $$new_props.fade);
			if ('classes' in $$props) $$invalidate(2, classes = $$new_props.classes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*className*/ 16) {
				$$invalidate(2, classes = classnames(className, 'modal-backdrop'));
			}
		};

		return [isOpen, fade, classes, $$restProps, className, click_handler];
	}

	class ModalBackdrop extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$c, create_fragment$c, safe_not_equal, { class: 4, isOpen: 0, fade: 1 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "ModalBackdrop",
				options,
				id: create_fragment$c.name
			});
		}

		get class() {
			throw new Error("<ModalBackdrop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<ModalBackdrop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get isOpen() {
			throw new Error("<ModalBackdrop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set isOpen(value) {
			throw new Error("<ModalBackdrop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get fade() {
			throw new Error("<ModalBackdrop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set fade(value) {
			throw new Error("<ModalBackdrop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* node_modules/sveltestrap/src/ModalBody.svelte generated by Svelte v3.44.2 */
	const file$b = "node_modules/sveltestrap/src/ModalBody.svelte";

	function create_fragment$b(ctx) {
		let div;
		let current;
		const default_slot_template = /*#slots*/ ctx[4].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
		let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		const block = {
			c: function create() {
				div = element("div");
				if (default_slot) default_slot.c();
				set_attributes(div, div_data);
				add_location(div, file$b, 9, 0, 165);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[3],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
							null
						);
					}
				}

				set_attributes(div, div_data = get_spread_update(div_levels, [
					dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
					(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$b.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$b($$self, $$props, $$invalidate) {
		let classes;
		const omit_props_names = ["class"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('ModalBody', slots, ['default']);
		let { class: className = '' } = $$props;

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
			if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({ classnames, className, classes });

		$$self.$inject_state = $$new_props => {
			if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
			if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*className*/ 4) {
				$$invalidate(0, classes = classnames(className, 'modal-body'));
			}
		};

		return [classes, $$restProps, className, $$scope, slots];
	}

	class ModalBody extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$b, create_fragment$b, safe_not_equal, { class: 2 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "ModalBody",
				options,
				id: create_fragment$b.name
			});
		}

		get class() {
			throw new Error("<ModalBody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<ModalBody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* node_modules/sveltestrap/src/ModalHeader.svelte generated by Svelte v3.44.2 */
	const file$a = "node_modules/sveltestrap/src/ModalHeader.svelte";
	const get_close_slot_changes = dirty => ({});
	const get_close_slot_context = ctx => ({});

	// (17:4) {:else}
	function create_else_block$5(ctx) {
		let current;
		const default_slot_template = /*#slots*/ ctx[7].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

		const block = {
			c: function create() {
				if (default_slot) default_slot.c();
			},
			m: function mount(target, anchor) {
				if (default_slot) {
					default_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[6],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
							null
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block$5.name,
			type: "else",
			source: "(17:4) {:else}",
			ctx
		});

		return block;
	}

	// (15:4) {#if children}
	function create_if_block_1$5(ctx) {
		let t;

		const block = {
			c: function create() {
				t = text(/*children*/ ctx[2]);
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*children*/ 4) set_data_dev(t, /*children*/ ctx[2]);
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) detach_dev(t);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1$5.name,
			type: "if",
			source: "(15:4) {#if children}",
			ctx
		});

		return block;
	}

	// (22:4) {#if typeof toggle === 'function'}
	function create_if_block$7(ctx) {
		let button;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				button = element("button");
				attr_dev(button, "type", "button");
				attr_dev(button, "class", "btn-close");
				attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
				add_location(button, file$a, 22, 6, 488);
			},
			m: function mount(target, anchor) {
				insert_dev(target, button, anchor);

				if (!mounted) {
					dispose = listen_dev(
						button,
						"click",
						function () {
							if (is_function(/*toggle*/ ctx[0])) /*toggle*/ ctx[0].apply(this, arguments);
						},
						false,
						false,
						false
					);

					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;

				if (dirty & /*closeAriaLabel*/ 2) {
					attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
				}
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(button);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$7.name,
			type: "if",
			source: "(22:4) {#if typeof toggle === 'function'}",
			ctx
		});

		return block;
	}

	// (21:21)      
	function fallback_block(ctx) {
		let if_block_anchor;
		let if_block = typeof /*toggle*/ ctx[0] === 'function' && create_if_block$7(ctx);

		const block = {
			c: function create() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},
			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
			},
			p: function update(ctx, dirty) {
				if (typeof /*toggle*/ ctx[0] === 'function') {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$7(ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			d: function destroy(detaching) {
				if (if_block) if_block.d(detaching);
				if (detaching) detach_dev(if_block_anchor);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: fallback_block.name,
			type: "fallback",
			source: "(21:21)      ",
			ctx
		});

		return block;
	}

	function create_fragment$a(ctx) {
		let div;
		let h5;
		let current_block_type_index;
		let if_block;
		let t;
		let current;
		const if_block_creators = [create_if_block_1$5, create_else_block$5];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*children*/ ctx[2]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
		const close_slot_template = /*#slots*/ ctx[7].close;
		const close_slot = create_slot(close_slot_template, ctx, /*$$scope*/ ctx[6], get_close_slot_context);
		const close_slot_or_fallback = close_slot || fallback_block(ctx);
		let div_levels = [/*$$restProps*/ ctx[4], { class: /*classes*/ ctx[3] }];
		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		const block = {
			c: function create() {
				div = element("div");
				h5 = element("h5");
				if_block.c();
				t = space();
				if (close_slot_or_fallback) close_slot_or_fallback.c();
				attr_dev(h5, "class", "modal-title");
				add_location(h5, file$a, 13, 2, 315);
				set_attributes(div, div_data);
				add_location(div, file$a, 12, 0, 274);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, h5);
				if_blocks[current_block_type_index].m(h5, null);
				append_dev(div, t);

				if (close_slot_or_fallback) {
					close_slot_or_fallback.m(div, null);
				}

				current = true;
			},
			p: function update(ctx, [dirty]) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(h5, null);
				}

				if (close_slot) {
					if (close_slot.p && (!current || dirty & /*$$scope*/ 64)) {
						update_slot_base(
							close_slot,
							close_slot_template,
							ctx,
							/*$$scope*/ ctx[6],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
							: get_slot_changes(close_slot_template, /*$$scope*/ ctx[6], dirty, get_close_slot_changes),
							get_close_slot_context
						);
					}
				} else {
					if (close_slot_or_fallback && close_slot_or_fallback.p && (!current || dirty & /*closeAriaLabel, toggle*/ 3)) {
						close_slot_or_fallback.p(ctx, !current ? -1 : dirty);
					}
				}

				set_attributes(div, div_data = get_spread_update(div_levels, [
					dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4],
					(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				transition_in(close_slot_or_fallback, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				transition_out(close_slot_or_fallback, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if_blocks[current_block_type_index].d();
				if (close_slot_or_fallback) close_slot_or_fallback.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$a.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$a($$self, $$props, $$invalidate) {
		let classes;
		const omit_props_names = ["class","toggle","closeAriaLabel","children"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('ModalHeader', slots, ['default','close']);
		let { class: className = '' } = $$props;
		let { toggle = undefined } = $$props;
		let { closeAriaLabel = 'Close' } = $$props;
		let { children = undefined } = $$props;

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
			if ('toggle' in $$new_props) $$invalidate(0, toggle = $$new_props.toggle);
			if ('closeAriaLabel' in $$new_props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
			if ('children' in $$new_props) $$invalidate(2, children = $$new_props.children);
			if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({
			classnames,
			className,
			toggle,
			closeAriaLabel,
			children,
			classes
		});

		$$self.$inject_state = $$new_props => {
			if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
			if ('toggle' in $$props) $$invalidate(0, toggle = $$new_props.toggle);
			if ('closeAriaLabel' in $$props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
			if ('children' in $$props) $$invalidate(2, children = $$new_props.children);
			if ('classes' in $$props) $$invalidate(3, classes = $$new_props.classes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*className*/ 32) {
				$$invalidate(3, classes = classnames(className, 'modal-header'));
			}
		};

		return [
			toggle,
			closeAriaLabel,
			children,
			classes,
			$$restProps,
			className,
			$$scope,
			slots
		];
	}

	class ModalHeader extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance$a, create_fragment$a, safe_not_equal, {
				class: 5,
				toggle: 0,
				closeAriaLabel: 1,
				children: 2
			});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "ModalHeader",
				options,
				id: create_fragment$a.name
			});
		}

		get class() {
			throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get toggle() {
			throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set toggle(value) {
			throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get closeAriaLabel() {
			throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set closeAriaLabel(value) {
			throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get children() {
			throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set children(value) {
			throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* node_modules/sveltestrap/src/Portal.svelte generated by Svelte v3.44.2 */
	const file$9 = "node_modules/sveltestrap/src/Portal.svelte";

	function create_fragment$9(ctx) {
		let div;
		let current;
		const default_slot_template = /*#slots*/ ctx[3].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
		let div_levels = [/*$$restProps*/ ctx[1]];
		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		const block = {
			c: function create() {
				div = element("div");
				if (default_slot) default_slot.c();
				set_attributes(div, div_data);
				add_location(div, file$9, 18, 0, 346);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				/*div_binding*/ ctx[4](div);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[2],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
							null
						);
					}
				}

				set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (default_slot) default_slot.d(detaching);
				/*div_binding*/ ctx[4](null);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$9.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$9($$self, $$props, $$invalidate) {
		const omit_props_names = [];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Portal', slots, ['default']);
		let ref;
		let portal;

		onMount(() => {
			portal = document.createElement('div');
			document.body.appendChild(portal);
			portal.appendChild(ref);
		});

		onDestroy(() => {
			if (typeof document !== 'undefined') {
				document.body.removeChild(portal);
			}
		});

		function div_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				ref = $$value;
				$$invalidate(0, ref);
			});
		}

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('$$scope' in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({ onMount, onDestroy, ref, portal });

		$$self.$inject_state = $$new_props => {
			if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
			if ('portal' in $$props) portal = $$new_props.portal;
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [ref, $$restProps, $$scope, slots, div_binding];
	}

	class Portal extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Portal",
				options,
				id: create_fragment$9.name
			});
		}
	}

	/* node_modules/sveltestrap/src/Modal.svelte generated by Svelte v3.44.2 */

	const file$8 = "node_modules/sveltestrap/src/Modal.svelte";
	const get_external_slot_changes = dirty => ({});
	const get_external_slot_context = ctx => ({});

	// (216:0) {#if _isMounted}
	function create_if_block_1$4(ctx) {
		let switch_instance;
		let switch_instance_anchor;
		let current;
		var switch_value = /*outer*/ ctx[13];

		function switch_props(ctx) {
			return {
				props: {
					$$slots: { default: [create_default_slot_1$3] },
					$$scope: { ctx }
				},
				$$inline: true
			};
		}

		if (switch_value) {
			switch_instance = new switch_value(switch_props(ctx));
		}

		const block = {
			c: function create() {
				if (switch_instance) create_component(switch_instance.$$.fragment);
				switch_instance_anchor = empty();
			},
			m: function mount(target, anchor) {
				if (switch_instance) {
					mount_component(switch_instance, target, anchor);
				}

				insert_dev(target, switch_instance_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const switch_instance_changes = {};

				if (dirty[0] & /*wrapClassName, $$restProps, labelledBy, modalClassName, fade, staticModal, classes, _dialog, contentClassName, body, toggle, header, isOpen*/ 1071039 | dirty[1] & /*$$scope*/ 8) {
					switch_instance_changes.$$scope = { dirty, ctx };
				}

				if (switch_value !== (switch_value = /*outer*/ ctx[13])) {
					if (switch_instance) {
						group_outros();
						const old_component = switch_instance;

						transition_out(old_component.$$.fragment, 1, 0, () => {
							destroy_component(old_component, 1);
						});

						check_outros();
					}

					if (switch_value) {
						switch_instance = new switch_value(switch_props(ctx));
						create_component(switch_instance.$$.fragment);
						transition_in(switch_instance.$$.fragment, 1);
						mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
					} else {
						switch_instance = null;
					}
				} else if (switch_value) {
					switch_instance.$set(switch_instance_changes);
				}
			},
			i: function intro(local) {
				if (current) return;
				if (switch_instance) transition_in(switch_instance.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				if (switch_instance) transition_out(switch_instance.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(switch_instance_anchor);
				if (switch_instance) destroy_component(switch_instance, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1$4.name,
			type: "if",
			source: "(216:0) {#if _isMounted}",
			ctx
		});

		return block;
	}

	// (219:6) {#if isOpen}
	function create_if_block_2$4(ctx) {
		let div2;
		let t0;
		let div1;
		let div0;
		let t1;
		let current_block_type_index;
		let if_block1;
		let div0_class_value;
		let div2_class_value;
		let div2_intro;
		let div2_outro;
		let current;
		let mounted;
		let dispose;
		const external_slot_template = /*#slots*/ ctx[30].external;
		const external_slot = create_slot(external_slot_template, ctx, /*$$scope*/ ctx[34], get_external_slot_context);
		let if_block0 = /*header*/ ctx[3] && create_if_block_4$1(ctx);
		const if_block_creators = [create_if_block_3$2, create_else_block$4];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*body*/ ctx[2]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		const block = {
			c: function create() {
				div2 = element("div");
				if (external_slot) external_slot.c();
				t0 = space();
				div1 = element("div");
				div0 = element("div");
				if (if_block0) if_block0.c();
				t1 = space();
				if_block1.c();
				attr_dev(div0, "class", div0_class_value = classnames('modal-content', /*contentClassName*/ ctx[9]));
				add_location(div0, file$8, 237, 12, 5557);
				attr_dev(div1, "class", /*classes*/ ctx[14]);
				attr_dev(div1, "role", "document");
				add_location(div1, file$8, 236, 10, 5487);
				attr_dev(div2, "arialabelledby", /*labelledBy*/ ctx[5]);

				attr_dev(div2, "class", div2_class_value = classnames('modal', /*modalClassName*/ ctx[8], {
					fade: /*fade*/ ctx[10],
					'position-static': /*staticModal*/ ctx[0]
				}));

				attr_dev(div2, "role", "dialog");
				add_location(div2, file$8, 219, 8, 4921);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div2, anchor);

				if (external_slot) {
					external_slot.m(div2, null);
				}

				append_dev(div2, t0);
				append_dev(div2, div1);
				append_dev(div1, div0);
				if (if_block0) if_block0.m(div0, null);
				append_dev(div0, t1);
				if_blocks[current_block_type_index].m(div0, null);
				/*div1_binding*/ ctx[31](div1);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(div2, "introstart", /*introstart_handler*/ ctx[32], false, false, false),
						listen_dev(div2, "introend", /*onModalOpened*/ ctx[17], false, false, false),
						listen_dev(div2, "outrostart", /*outrostart_handler*/ ctx[33], false, false, false),
						listen_dev(div2, "outroend", /*onModalClosed*/ ctx[18], false, false, false),
						listen_dev(div2, "click", /*handleBackdropClick*/ ctx[16], false, false, false),
						listen_dev(div2, "mousedown", /*handleBackdropMouseDown*/ ctx[19], false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (external_slot) {
					if (external_slot.p && (!current || dirty[1] & /*$$scope*/ 8)) {
						update_slot_base(
							external_slot,
							external_slot_template,
							ctx,
							/*$$scope*/ ctx[34],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[34])
							: get_slot_changes(external_slot_template, /*$$scope*/ ctx[34], dirty, get_external_slot_changes),
							get_external_slot_context
						);
					}
				}

				if (/*header*/ ctx[3]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);

						if (dirty[0] & /*header*/ 8) {
							transition_in(if_block0, 1);
						}
					} else {
						if_block0 = create_if_block_4$1(ctx);
						if_block0.c();
						transition_in(if_block0, 1);
						if_block0.m(div0, t1);
					}
				} else if (if_block0) {
					group_outros();

					transition_out(if_block0, 1, 1, () => {
						if_block0 = null;
					});

					check_outros();
				}

				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block1 = if_blocks[current_block_type_index];

					if (!if_block1) {
						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block1.c();
					} else {
						if_block1.p(ctx, dirty);
					}

					transition_in(if_block1, 1);
					if_block1.m(div0, null);
				}

				if (!current || dirty[0] & /*contentClassName*/ 512 && div0_class_value !== (div0_class_value = classnames('modal-content', /*contentClassName*/ ctx[9]))) {
					attr_dev(div0, "class", div0_class_value);
				}

				if (!current || dirty[0] & /*classes*/ 16384) {
					attr_dev(div1, "class", /*classes*/ ctx[14]);
				}

				if (!current || dirty[0] & /*labelledBy*/ 32) {
					attr_dev(div2, "arialabelledby", /*labelledBy*/ ctx[5]);
				}

				if (!current || dirty[0] & /*modalClassName, fade, staticModal*/ 1281 && div2_class_value !== (div2_class_value = classnames('modal', /*modalClassName*/ ctx[8], {
					fade: /*fade*/ ctx[10],
					'position-static': /*staticModal*/ ctx[0]
				}))) {
					attr_dev(div2, "class", div2_class_value);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(external_slot, local);
				transition_in(if_block0);
				transition_in(if_block1);

				add_render_callback(() => {
					if (div2_outro) div2_outro.end(1);
					div2_intro = create_in_transition(div2, modalIn, {});
					div2_intro.start();
				});

				current = true;
			},
			o: function outro(local) {
				transition_out(external_slot, local);
				transition_out(if_block0);
				transition_out(if_block1);
				if (div2_intro) div2_intro.invalidate();
				div2_outro = create_out_transition(div2, modalOut, {});
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div2);
				if (external_slot) external_slot.d(detaching);
				if (if_block0) if_block0.d();
				if_blocks[current_block_type_index].d();
				/*div1_binding*/ ctx[31](null);
				if (detaching && div2_outro) div2_outro.end();
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_2$4.name,
			type: "if",
			source: "(219:6) {#if isOpen}",
			ctx
		});

		return block;
	}

	// (239:14) {#if header}
	function create_if_block_4$1(ctx) {
		let modalheader;
		let current;

		modalheader = new ModalHeader({
				props: {
					toggle: /*toggle*/ ctx[4],
					$$slots: { default: [create_default_slot_3$3] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(modalheader.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(modalheader, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const modalheader_changes = {};
				if (dirty[0] & /*toggle*/ 16) modalheader_changes.toggle = /*toggle*/ ctx[4];

				if (dirty[0] & /*header*/ 8 | dirty[1] & /*$$scope*/ 8) {
					modalheader_changes.$$scope = { dirty, ctx };
				}

				modalheader.$set(modalheader_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(modalheader.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(modalheader.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(modalheader, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_4$1.name,
			type: "if",
			source: "(239:14) {#if header}",
			ctx
		});

		return block;
	}

	// (240:16) <ModalHeader {toggle}>
	function create_default_slot_3$3(ctx) {
		let t;

		const block = {
			c: function create() {
				t = text(/*header*/ ctx[3]);
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty[0] & /*header*/ 8) set_data_dev(t, /*header*/ ctx[3]);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(t);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_3$3.name,
			type: "slot",
			source: "(240:16) <ModalHeader {toggle}>",
			ctx
		});

		return block;
	}

	// (248:14) {:else}
	function create_else_block$4(ctx) {
		let current;
		const default_slot_template = /*#slots*/ ctx[30].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[34], null);

		const block = {
			c: function create() {
				if (default_slot) default_slot.c();
			},
			m: function mount(target, anchor) {
				if (default_slot) {
					default_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 8)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[34],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[34])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[34], dirty, null),
							null
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block$4.name,
			type: "else",
			source: "(248:14) {:else}",
			ctx
		});

		return block;
	}

	// (244:14) {#if body}
	function create_if_block_3$2(ctx) {
		let modalbody;
		let current;

		modalbody = new ModalBody({
				props: {
					$$slots: { default: [create_default_slot_2$3] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(modalbody.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(modalbody, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const modalbody_changes = {};

				if (dirty[1] & /*$$scope*/ 8) {
					modalbody_changes.$$scope = { dirty, ctx };
				}

				modalbody.$set(modalbody_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(modalbody.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(modalbody.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(modalbody, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_3$2.name,
			type: "if",
			source: "(244:14) {#if body}",
			ctx
		});

		return block;
	}

	// (245:16) <ModalBody>
	function create_default_slot_2$3(ctx) {
		let current;
		const default_slot_template = /*#slots*/ ctx[30].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[34], null);

		const block = {
			c: function create() {
				if (default_slot) default_slot.c();
			},
			m: function mount(target, anchor) {
				if (default_slot) {
					default_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 8)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[34],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[34])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[34], dirty, null),
							null
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_2$3.name,
			type: "slot",
			source: "(245:16) <ModalBody>",
			ctx
		});

		return block;
	}

	// (217:2) <svelte:component this={outer}>
	function create_default_slot_1$3(ctx) {
		let div;
		let current;
		let if_block = /*isOpen*/ ctx[1] && create_if_block_2$4(ctx);

		let div_levels = [
			{ class: /*wrapClassName*/ ctx[7] },
			{ tabindex: "-1" },
			/*$$restProps*/ ctx[20]
		];

		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		const block = {
			c: function create() {
				div = element("div");
				if (if_block) if_block.c();
				set_attributes(div, div_data);
				add_location(div, file$8, 217, 4, 4835);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				if (if_block) if_block.m(div, null);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (/*isOpen*/ ctx[1]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty[0] & /*isOpen*/ 2) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block_2$4(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(div, null);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}

				set_attributes(div, div_data = get_spread_update(div_levels, [
					(!current || dirty[0] & /*wrapClassName*/ 128) && { class: /*wrapClassName*/ ctx[7] },
					{ tabindex: "-1" },
					dirty[0] & /*$$restProps*/ 1048576 && /*$$restProps*/ ctx[20]
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (if_block) if_block.d();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_1$3.name,
			type: "slot",
			source: "(217:2) <svelte:component this={outer}>",
			ctx
		});

		return block;
	}

	// (258:0) {#if backdrop && !staticModal}
	function create_if_block$6(ctx) {
		let switch_instance;
		let switch_instance_anchor;
		let current;
		var switch_value = /*outer*/ ctx[13];

		function switch_props(ctx) {
			return {
				props: {
					$$slots: { default: [create_default_slot$3] },
					$$scope: { ctx }
				},
				$$inline: true
			};
		}

		if (switch_value) {
			switch_instance = new switch_value(switch_props(ctx));
		}

		const block = {
			c: function create() {
				if (switch_instance) create_component(switch_instance.$$.fragment);
				switch_instance_anchor = empty();
			},
			m: function mount(target, anchor) {
				if (switch_instance) {
					mount_component(switch_instance, target, anchor);
				}

				insert_dev(target, switch_instance_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const switch_instance_changes = {};

				if (dirty[0] & /*fade, isOpen*/ 1026 | dirty[1] & /*$$scope*/ 8) {
					switch_instance_changes.$$scope = { dirty, ctx };
				}

				if (switch_value !== (switch_value = /*outer*/ ctx[13])) {
					if (switch_instance) {
						group_outros();
						const old_component = switch_instance;

						transition_out(old_component.$$.fragment, 1, 0, () => {
							destroy_component(old_component, 1);
						});

						check_outros();
					}

					if (switch_value) {
						switch_instance = new switch_value(switch_props(ctx));
						create_component(switch_instance.$$.fragment);
						transition_in(switch_instance.$$.fragment, 1);
						mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
					} else {
						switch_instance = null;
					}
				} else if (switch_value) {
					switch_instance.$set(switch_instance_changes);
				}
			},
			i: function intro(local) {
				if (current) return;
				if (switch_instance) transition_in(switch_instance.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				if (switch_instance) transition_out(switch_instance.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(switch_instance_anchor);
				if (switch_instance) destroy_component(switch_instance, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$6.name,
			type: "if",
			source: "(258:0) {#if backdrop && !staticModal}",
			ctx
		});

		return block;
	}

	// (259:2) <svelte:component this={outer}>
	function create_default_slot$3(ctx) {
		let modalbackdrop;
		let current;

		modalbackdrop = new ModalBackdrop({
				props: {
					fade: /*fade*/ ctx[10],
					isOpen: /*isOpen*/ ctx[1]
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(modalbackdrop.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(modalbackdrop, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const modalbackdrop_changes = {};
				if (dirty[0] & /*fade*/ 1024) modalbackdrop_changes.fade = /*fade*/ ctx[10];
				if (dirty[0] & /*isOpen*/ 2) modalbackdrop_changes.isOpen = /*isOpen*/ ctx[1];
				modalbackdrop.$set(modalbackdrop_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(modalbackdrop.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(modalbackdrop.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(modalbackdrop, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot$3.name,
			type: "slot",
			source: "(259:2) <svelte:component this={outer}>",
			ctx
		});

		return block;
	}

	function create_fragment$8(ctx) {
		let t;
		let if_block1_anchor;
		let current;
		let if_block0 = /*_isMounted*/ ctx[11] && create_if_block_1$4(ctx);
		let if_block1 = /*backdrop*/ ctx[6] && !/*staticModal*/ ctx[0] && create_if_block$6(ctx);

		const block = {
			c: function create() {
				if (if_block0) if_block0.c();
				t = space();
				if (if_block1) if_block1.c();
				if_block1_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if (if_block0) if_block0.m(target, anchor);
				insert_dev(target, t, anchor);
				if (if_block1) if_block1.m(target, anchor);
				insert_dev(target, if_block1_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (/*_isMounted*/ ctx[11]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);

						if (dirty[0] & /*_isMounted*/ 2048) {
							transition_in(if_block0, 1);
						}
					} else {
						if_block0 = create_if_block_1$4(ctx);
						if_block0.c();
						transition_in(if_block0, 1);
						if_block0.m(t.parentNode, t);
					}
				} else if (if_block0) {
					group_outros();

					transition_out(if_block0, 1, 1, () => {
						if_block0 = null;
					});

					check_outros();
				}

				if (/*backdrop*/ ctx[6] && !/*staticModal*/ ctx[0]) {
					if (if_block1) {
						if_block1.p(ctx, dirty);

						if (dirty[0] & /*backdrop, staticModal*/ 65) {
							transition_in(if_block1, 1);
						}
					} else {
						if_block1 = create_if_block$6(ctx);
						if_block1.c();
						transition_in(if_block1, 1);
						if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
					}
				} else if (if_block1) {
					group_outros();

					transition_out(if_block1, 1, 1, () => {
						if_block1 = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block0);
				transition_in(if_block1);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block0);
				transition_out(if_block1);
				current = false;
			},
			d: function destroy(detaching) {
				if (if_block0) if_block0.d(detaching);
				if (detaching) detach_dev(t);
				if (if_block1) if_block1.d(detaching);
				if (detaching) detach_dev(if_block1_anchor);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$8.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	let openCount = 0;
	const dialogBaseClass = 'modal-dialog';

	function instance$8($$self, $$props, $$invalidate) {
		let classes;
		let outer;

		const omit_props_names = [
			"class","static","isOpen","autoFocus","body","centered","container","fullscreen","header","scrollable","size","toggle","labelledBy","backdrop","wrapClassName","modalClassName","contentClassName","fade","unmountOnClose","returnFocusAfterClose"
		];

		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Modal', slots, ['external','default']);
		const dispatch = createEventDispatcher();
		let { class: className = '' } = $$props;
		let { static: staticModal = false } = $$props;
		let { isOpen = false } = $$props;
		let { autoFocus = true } = $$props;
		let { body = false } = $$props;
		let { centered = false } = $$props;
		let { container = undefined } = $$props;
		let { fullscreen = false } = $$props;
		let { header = undefined } = $$props;
		let { scrollable = false } = $$props;
		let { size = '' } = $$props;
		let { toggle = undefined } = $$props;
		let { labelledBy = '' } = $$props;
		let { backdrop = true } = $$props;
		let { wrapClassName = '' } = $$props;
		let { modalClassName = '' } = $$props;
		let { contentClassName = '' } = $$props;
		let { fade = true } = $$props;
		let { unmountOnClose = true } = $$props;
		let { returnFocusAfterClose = true } = $$props;
		let hasOpened = false;
		let _isMounted = false;
		let _triggeringElement;
		let _originalBodyPadding;
		let _lastIsOpen = isOpen;
		let _lastHasOpened = hasOpened;
		let _dialog;
		let _mouseDownElement;
		let _removeEscListener;

		onMount(() => {
			if (isOpen) {
				init();
				hasOpened = true;
			}

			if (hasOpened && autoFocus) {
				setFocus();
			}
		});

		onDestroy(() => {
			destroy();

			if (hasOpened) {
				close();
			}
		});

		afterUpdate(() => {
			if (isOpen && !_lastIsOpen) {
				init();
				hasOpened = true;
			}

			if (autoFocus && hasOpened && !_lastHasOpened) {
				setFocus();
			}

			_lastIsOpen = isOpen;
			_lastHasOpened = hasOpened;
		});

		function setFocus() {
			if (_dialog && _dialog.parentNode && typeof _dialog.parentNode.focus === 'function') {
				_dialog.parentNode.focus();
			}
		}

		function init() {
			try {
				_triggeringElement = document.activeElement;
			} catch(err) {
				_triggeringElement = null;
			}

			if (!staticModal) {
				_originalBodyPadding = getOriginalBodyPadding();
				conditionallyUpdateScrollbar();

				if (openCount === 0) {
					document.body.className = classnames(document.body.className, 'modal-open');
				}

				++openCount;
			}

			$$invalidate(11, _isMounted = true);
		}

		function manageFocusAfterClose() {
			if (_triggeringElement) {
				if (typeof _triggeringElement.focus === 'function' && returnFocusAfterClose) {
					_triggeringElement.focus();
				}

				_triggeringElement = null;
			}
		}

		function destroy() {
			manageFocusAfterClose();
		}

		function close() {
			if (openCount <= 1) {
				document.body.classList.remove('modal-open');
			}

			manageFocusAfterClose();
			openCount = Math.max(0, openCount - 1);
			setScrollbarWidth(_originalBodyPadding);
		}

		function handleBackdropClick(e) {
			if (e.target === _mouseDownElement) {
				e.stopPropagation();

				if (!isOpen || !backdrop) {
					return;
				}

				const backdropElem = _dialog ? _dialog.parentNode : null;

				if (backdrop === true && backdropElem && e.target === backdropElem && toggle) {
					toggle(e);
				}
			}
		}

		function onModalOpened() {
			dispatch('open');

			_removeEscListener = browserEvent(document, 'keydown', event => {
				if (event.key && event.key === 'Escape') {
					if (toggle && backdrop === true) toggle(event);
				}
			});
		}

		function onModalClosed() {
			dispatch('close');

			if (_removeEscListener) {
				_removeEscListener();
			}

			if (unmountOnClose) {
				destroy();
			}

			close();

			if (_isMounted) {
				hasOpened = false;
			}

			$$invalidate(11, _isMounted = false);
		}

		function handleBackdropMouseDown(e) {
			_mouseDownElement = e.target;
		}

		function div1_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				_dialog = $$value;
				$$invalidate(12, _dialog);
			});
		}

		const introstart_handler = () => dispatch('opening');
		const outrostart_handler = () => dispatch('closing');

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(20, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('class' in $$new_props) $$invalidate(21, className = $$new_props.class);
			if ('static' in $$new_props) $$invalidate(0, staticModal = $$new_props.static);
			if ('isOpen' in $$new_props) $$invalidate(1, isOpen = $$new_props.isOpen);
			if ('autoFocus' in $$new_props) $$invalidate(22, autoFocus = $$new_props.autoFocus);
			if ('body' in $$new_props) $$invalidate(2, body = $$new_props.body);
			if ('centered' in $$new_props) $$invalidate(23, centered = $$new_props.centered);
			if ('container' in $$new_props) $$invalidate(24, container = $$new_props.container);
			if ('fullscreen' in $$new_props) $$invalidate(25, fullscreen = $$new_props.fullscreen);
			if ('header' in $$new_props) $$invalidate(3, header = $$new_props.header);
			if ('scrollable' in $$new_props) $$invalidate(26, scrollable = $$new_props.scrollable);
			if ('size' in $$new_props) $$invalidate(27, size = $$new_props.size);
			if ('toggle' in $$new_props) $$invalidate(4, toggle = $$new_props.toggle);
			if ('labelledBy' in $$new_props) $$invalidate(5, labelledBy = $$new_props.labelledBy);
			if ('backdrop' in $$new_props) $$invalidate(6, backdrop = $$new_props.backdrop);
			if ('wrapClassName' in $$new_props) $$invalidate(7, wrapClassName = $$new_props.wrapClassName);
			if ('modalClassName' in $$new_props) $$invalidate(8, modalClassName = $$new_props.modalClassName);
			if ('contentClassName' in $$new_props) $$invalidate(9, contentClassName = $$new_props.contentClassName);
			if ('fade' in $$new_props) $$invalidate(10, fade = $$new_props.fade);
			if ('unmountOnClose' in $$new_props) $$invalidate(28, unmountOnClose = $$new_props.unmountOnClose);
			if ('returnFocusAfterClose' in $$new_props) $$invalidate(29, returnFocusAfterClose = $$new_props.returnFocusAfterClose);
			if ('$$scope' in $$new_props) $$invalidate(34, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({
			openCount,
			classnames,
			browserEvent,
			createEventDispatcher,
			onDestroy,
			onMount,
			afterUpdate,
			modalIn,
			modalOut,
			InlineContainer,
			ModalBackdrop,
			ModalBody,
			ModalHeader,
			Portal,
			conditionallyUpdateScrollbar,
			getOriginalBodyPadding,
			setScrollbarWidth,
			dispatch,
			className,
			staticModal,
			isOpen,
			autoFocus,
			body,
			centered,
			container,
			fullscreen,
			header,
			scrollable,
			size,
			toggle,
			labelledBy,
			backdrop,
			wrapClassName,
			modalClassName,
			contentClassName,
			fade,
			unmountOnClose,
			returnFocusAfterClose,
			hasOpened,
			_isMounted,
			_triggeringElement,
			_originalBodyPadding,
			_lastIsOpen,
			_lastHasOpened,
			_dialog,
			_mouseDownElement,
			_removeEscListener,
			setFocus,
			init,
			manageFocusAfterClose,
			destroy,
			close,
			handleBackdropClick,
			onModalOpened,
			onModalClosed,
			handleBackdropMouseDown,
			dialogBaseClass,
			outer,
			classes
		});

		$$self.$inject_state = $$new_props => {
			if ('className' in $$props) $$invalidate(21, className = $$new_props.className);
			if ('staticModal' in $$props) $$invalidate(0, staticModal = $$new_props.staticModal);
			if ('isOpen' in $$props) $$invalidate(1, isOpen = $$new_props.isOpen);
			if ('autoFocus' in $$props) $$invalidate(22, autoFocus = $$new_props.autoFocus);
			if ('body' in $$props) $$invalidate(2, body = $$new_props.body);
			if ('centered' in $$props) $$invalidate(23, centered = $$new_props.centered);
			if ('container' in $$props) $$invalidate(24, container = $$new_props.container);
			if ('fullscreen' in $$props) $$invalidate(25, fullscreen = $$new_props.fullscreen);
			if ('header' in $$props) $$invalidate(3, header = $$new_props.header);
			if ('scrollable' in $$props) $$invalidate(26, scrollable = $$new_props.scrollable);
			if ('size' in $$props) $$invalidate(27, size = $$new_props.size);
			if ('toggle' in $$props) $$invalidate(4, toggle = $$new_props.toggle);
			if ('labelledBy' in $$props) $$invalidate(5, labelledBy = $$new_props.labelledBy);
			if ('backdrop' in $$props) $$invalidate(6, backdrop = $$new_props.backdrop);
			if ('wrapClassName' in $$props) $$invalidate(7, wrapClassName = $$new_props.wrapClassName);
			if ('modalClassName' in $$props) $$invalidate(8, modalClassName = $$new_props.modalClassName);
			if ('contentClassName' in $$props) $$invalidate(9, contentClassName = $$new_props.contentClassName);
			if ('fade' in $$props) $$invalidate(10, fade = $$new_props.fade);
			if ('unmountOnClose' in $$props) $$invalidate(28, unmountOnClose = $$new_props.unmountOnClose);
			if ('returnFocusAfterClose' in $$props) $$invalidate(29, returnFocusAfterClose = $$new_props.returnFocusAfterClose);
			if ('hasOpened' in $$props) hasOpened = $$new_props.hasOpened;
			if ('_isMounted' in $$props) $$invalidate(11, _isMounted = $$new_props._isMounted);
			if ('_triggeringElement' in $$props) _triggeringElement = $$new_props._triggeringElement;
			if ('_originalBodyPadding' in $$props) _originalBodyPadding = $$new_props._originalBodyPadding;
			if ('_lastIsOpen' in $$props) _lastIsOpen = $$new_props._lastIsOpen;
			if ('_lastHasOpened' in $$props) _lastHasOpened = $$new_props._lastHasOpened;
			if ('_dialog' in $$props) $$invalidate(12, _dialog = $$new_props._dialog);
			if ('_mouseDownElement' in $$props) _mouseDownElement = $$new_props._mouseDownElement;
			if ('_removeEscListener' in $$props) _removeEscListener = $$new_props._removeEscListener;
			if ('outer' in $$props) $$invalidate(13, outer = $$new_props.outer);
			if ('classes' in $$props) $$invalidate(14, classes = $$new_props.classes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty[0] & /*className, size, fullscreen, centered, scrollable*/ 245366784) {
				$$invalidate(14, classes = classnames(dialogBaseClass, className, {
					[`modal-${size}`]: size,
					'modal-fullscreen': fullscreen === true,
					[`modal-fullscreen-${fullscreen}-down`]: fullscreen && typeof fullscreen === 'string',
					[`${dialogBaseClass}-centered`]: centered,
					[`${dialogBaseClass}-scrollable`]: scrollable
				}));
			}

			if ($$self.$$.dirty[0] & /*container, staticModal*/ 16777217) {
				$$invalidate(13, outer = container === 'inline' || staticModal
				? InlineContainer
				: Portal);
			}
		};

		return [
			staticModal,
			isOpen,
			body,
			header,
			toggle,
			labelledBy,
			backdrop,
			wrapClassName,
			modalClassName,
			contentClassName,
			fade,
			_isMounted,
			_dialog,
			outer,
			classes,
			dispatch,
			handleBackdropClick,
			onModalOpened,
			onModalClosed,
			handleBackdropMouseDown,
			$$restProps,
			className,
			autoFocus,
			centered,
			container,
			fullscreen,
			scrollable,
			size,
			unmountOnClose,
			returnFocusAfterClose,
			slots,
			div1_binding,
			introstart_handler,
			outrostart_handler,
			$$scope
		];
	}

	class Modal extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(
				this,
				options,
				instance$8,
				create_fragment$8,
				safe_not_equal,
				{
					class: 21,
					static: 0,
					isOpen: 1,
					autoFocus: 22,
					body: 2,
					centered: 23,
					container: 24,
					fullscreen: 25,
					header: 3,
					scrollable: 26,
					size: 27,
					toggle: 4,
					labelledBy: 5,
					backdrop: 6,
					wrapClassName: 7,
					modalClassName: 8,
					contentClassName: 9,
					fade: 10,
					unmountOnClose: 28,
					returnFocusAfterClose: 29
				},
				null,
				[-1, -1]
			);

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Modal",
				options,
				id: create_fragment$8.name
			});
		}

		get class() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get static() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set static(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get isOpen() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set isOpen(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get autoFocus() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set autoFocus(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get body() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set body(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get centered() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set centered(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get container() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set container(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get fullscreen() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set fullscreen(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get header() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set header(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get scrollable() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set scrollable(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get size() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set size(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get toggle() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set toggle(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get labelledBy() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set labelledBy(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get backdrop() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set backdrop(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get wrapClassName() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set wrapClassName(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get modalClassName() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set modalClassName(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get contentClassName() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set contentClassName(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get fade() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set fade(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get unmountOnClose() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set unmountOnClose(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get returnFocusAfterClose() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set returnFocusAfterClose(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* node_modules/sveltestrap/src/ModalFooter.svelte generated by Svelte v3.44.2 */
	const file$7 = "node_modules/sveltestrap/src/ModalFooter.svelte";

	function create_fragment$7(ctx) {
		let div;
		let current;
		const default_slot_template = /*#slots*/ ctx[4].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
		let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		const block = {
			c: function create() {
				div = element("div");
				if (default_slot) default_slot.c();
				set_attributes(div, div_data);
				add_location(div, file$7, 9, 0, 167);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[3],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
							null
						);
					}
				}

				set_attributes(div, div_data = get_spread_update(div_levels, [
					dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
					(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
				]));
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$7.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$7($$self, $$props, $$invalidate) {
		let classes;
		const omit_props_names = ["class"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('ModalFooter', slots, ['default']);
		let { class: className = '' } = $$props;

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
			if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
		};

		$$self.$capture_state = () => ({ classnames, className, classes });

		$$self.$inject_state = $$new_props => {
			if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
			if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*className*/ 4) {
				$$invalidate(0, classes = classnames(className, 'modal-footer'));
			}
		};

		return [classes, $$restProps, className, $$scope, slots];
	}

	class ModalFooter extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$7, create_fragment$7, safe_not_equal, { class: 2 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "ModalFooter",
				options,
				id: create_fragment$7.name
			});
		}

		get class() {
			throw new Error("<ModalFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set class(value) {
			throw new Error("<ModalFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	window.addEventListener('beforeinstallprompt', (e) => {
	    // Prevent the mini-infobar from appearing on mobile
	    e.preventDefault();
	    // Stash the event so it can be triggered later.
	    PwaInstaller.set(e);
	});
	class PwaInstaller {
	    static addEventListener(func) {
	        PwaInstaller.handlers.push(func);
	    }
	    static set(prompt) {
	        PwaInstaller.deferredPrompt = prompt;
	        PwaInstaller.notify();
	    }
	    static notify() {
	        PwaInstaller.handlers.forEach(x => x(PwaInstaller.deferredPrompt == null));
	    }
	    static get isInstalled() {
	        return PwaInstaller.deferredPrompt == null;
	    }
	    static get isStandalone() {
	        return window.matchMedia('(display-mode: standalone)').matches;
	    }
	    static install() {
	        const temp = PwaInstaller.deferredPrompt;
	        PwaInstaller.deferredPrompt = null;
	        PwaInstaller.notify();
	        temp.prompt();
	    }
	}
	PwaInstaller.deferredPrompt = null;
	PwaInstaller.handlers = [];

	/* src/Menu.svelte generated by Svelte v3.44.2 */
	const file$6 = "src/Menu.svelte";

	// (35:8) <DropdownToggle caret>
	function create_default_slot_5(ctx) {
		let icon;
		let current;

		icon = new Icon({
				props: { name: "three-dots-vertical" },
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(icon.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(icon, target, anchor);
				current = true;
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(icon, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_5.name,
			type: "slot",
			source: "(35:8) <DropdownToggle caret>",
			ctx
		});

		return block;
	}

	// (37:12) <DropdownItem on:click={() => dispatch('my-libraries')}>
	function create_default_slot_4$1(ctx) {
		let t;

		const block = {
			c: function create() {
				t = text("My Libraries");
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(t);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_4$1.name,
			type: "slot",
			source: "(37:12) <DropdownItem on:click={() => dispatch('my-libraries')}>",
			ctx
		});

		return block;
	}

	// (38:12) {#if !PwaInstaller.isStandalone && !installed}
	function create_if_block$5(ctx) {
		let dropdownitem;
		let current;

		dropdownitem = new DropdownItem({
				props: {
					$$slots: { default: [create_default_slot_3$2] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		dropdownitem.$on("click", /*click_handler_1*/ ctx[5]);

		const block = {
			c: function create() {
				create_component(dropdownitem.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(dropdownitem, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const dropdownitem_changes = {};

				if (dirty & /*$$scope*/ 128) {
					dropdownitem_changes.$$scope = { dirty, ctx };
				}

				dropdownitem.$set(dropdownitem_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(dropdownitem.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(dropdownitem.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(dropdownitem, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$5.name,
			type: "if",
			source: "(38:12) {#if !PwaInstaller.isStandalone && !installed}",
			ctx
		});

		return block;
	}

	// (39:16) <DropdownItem on:click={() => installPwa()}>
	function create_default_slot_3$2(ctx) {
		let t;

		const block = {
			c: function create() {
				t = text("Install the App");
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(t);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_3$2.name,
			type: "slot",
			source: "(39:16) <DropdownItem on:click={() => installPwa()}>",
			ctx
		});

		return block;
	}

	// (42:12) <DropdownItem on:click={() => dispatch('credits')}>
	function create_default_slot_2$2(ctx) {
		let t;

		const block = {
			c: function create() {
				t = text("About Libraree");
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(t);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_2$2.name,
			type: "slot",
			source: "(42:12) <DropdownItem on:click={() => dispatch('credits')}>",
			ctx
		});

		return block;
	}

	// (36:8) <DropdownMenu end>
	function create_default_slot_1$2(ctx) {
		let dropdownitem0;
		let t0;
		let t1;
		let dropdownitem1;
		let t2;
		let dropdownitem2;
		let current;

		dropdownitem0 = new DropdownItem({
				props: {
					$$slots: { default: [create_default_slot_4$1] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		dropdownitem0.$on("click", /*click_handler*/ ctx[4]);
		let if_block = !PwaInstaller.isStandalone && !/*installed*/ ctx[1] && create_if_block$5(ctx);
		dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

		dropdownitem2 = new DropdownItem({
				props: {
					$$slots: { default: [create_default_slot_2$2] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		dropdownitem2.$on("click", /*click_handler_2*/ ctx[6]);

		const block = {
			c: function create() {
				create_component(dropdownitem0.$$.fragment);
				t0 = space();
				if (if_block) if_block.c();
				t1 = space();
				create_component(dropdownitem1.$$.fragment);
				t2 = space();
				create_component(dropdownitem2.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(dropdownitem0, target, anchor);
				insert_dev(target, t0, anchor);
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, t1, anchor);
				mount_component(dropdownitem1, target, anchor);
				insert_dev(target, t2, anchor);
				mount_component(dropdownitem2, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const dropdownitem0_changes = {};

				if (dirty & /*$$scope*/ 128) {
					dropdownitem0_changes.$$scope = { dirty, ctx };
				}

				dropdownitem0.$set(dropdownitem0_changes);

				if (!PwaInstaller.isStandalone && !/*installed*/ ctx[1]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*installed*/ 2) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block$5(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(t1.parentNode, t1);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}

				const dropdownitem2_changes = {};

				if (dirty & /*$$scope*/ 128) {
					dropdownitem2_changes.$$scope = { dirty, ctx };
				}

				dropdownitem2.$set(dropdownitem2_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(dropdownitem0.$$.fragment, local);
				transition_in(if_block);
				transition_in(dropdownitem1.$$.fragment, local);
				transition_in(dropdownitem2.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(dropdownitem0.$$.fragment, local);
				transition_out(if_block);
				transition_out(dropdownitem1.$$.fragment, local);
				transition_out(dropdownitem2.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(dropdownitem0, detaching);
				if (detaching) detach_dev(t0);
				if (if_block) if_block.d(detaching);
				if (detaching) detach_dev(t1);
				destroy_component(dropdownitem1, detaching);
				if (detaching) detach_dev(t2);
				destroy_component(dropdownitem2, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_1$2.name,
			type: "slot",
			source: "(36:8) <DropdownMenu end>",
			ctx
		});

		return block;
	}

	// (34:4) <Dropdown id="menu" group size="sm">
	function create_default_slot$2(ctx) {
		let dropdowntoggle;
		let t;
		let dropdownmenu;
		let current;

		dropdowntoggle = new DropdownToggle({
				props: {
					caret: true,
					$$slots: { default: [create_default_slot_5] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		dropdownmenu = new DropdownMenu({
				props: {
					end: true,
					$$slots: { default: [create_default_slot_1$2] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(dropdowntoggle.$$.fragment);
				t = space();
				create_component(dropdownmenu.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(dropdowntoggle, target, anchor);
				insert_dev(target, t, anchor);
				mount_component(dropdownmenu, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const dropdowntoggle_changes = {};

				if (dirty & /*$$scope*/ 128) {
					dropdowntoggle_changes.$$scope = { dirty, ctx };
				}

				dropdowntoggle.$set(dropdowntoggle_changes);
				const dropdownmenu_changes = {};

				if (dirty & /*$$scope, installed*/ 130) {
					dropdownmenu_changes.$$scope = { dirty, ctx };
				}

				dropdownmenu.$set(dropdownmenu_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(dropdowntoggle.$$.fragment, local);
				transition_in(dropdownmenu.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(dropdowntoggle.$$.fragment, local);
				transition_out(dropdownmenu.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(dropdowntoggle, detaching);
				if (detaching) detach_dev(t);
				destroy_component(dropdownmenu, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot$2.name,
			type: "slot",
			source: "(34:4) <Dropdown id=\\\"menu\\\" group size=\\\"sm\\\">",
			ctx
		});

		return block;
	}

	function create_fragment$6(ctx) {
		let div;
		let dropdown;
		let current;

		dropdown = new Dropdown({
				props: {
					id: "menu",
					group: true,
					size: "sm",
					$$slots: { default: [create_default_slot$2] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				div = element("div");
				create_component(dropdown.$$.fragment);
				set_style(div, "--menu-colour", /*colour*/ ctx[0]);
				add_location(div, file$6, 32, 0, 864);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				mount_component(dropdown, div, null);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				const dropdown_changes = {};

				if (dirty & /*$$scope, installed*/ 130) {
					dropdown_changes.$$scope = { dirty, ctx };
				}

				dropdown.$set(dropdown_changes);

				if (!current || dirty & /*colour*/ 1) {
					set_style(div, "--menu-colour", /*colour*/ ctx[0]);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(dropdown.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(dropdown.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				destroy_component(dropdown);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$6.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$6($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Menu', slots, []);
		const dispatch = createEventDispatcher();
		let installed = PwaInstaller.isInstalled;
		PwaInstaller.addEventListener(isInstalled => $$invalidate(1, installed = isInstalled));
		let { colour = '#333' } = $$props;

		function installPwa() {
			PwaInstaller.install();
		}

		const writable_props = ['colour'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
		});

		const click_handler = () => dispatch('my-libraries');
		const click_handler_1 = () => installPwa();
		const click_handler_2 = () => dispatch('credits');

		$$self.$$set = $$props => {
			if ('colour' in $$props) $$invalidate(0, colour = $$props.colour);
		};

		$$self.$capture_state = () => ({
			Icon,
			Dropdown,
			DropdownToggle,
			DropdownMenu,
			DropdownItem,
			createEventDispatcher,
			PwaInstaller,
			dispatch,
			installed,
			colour,
			installPwa
		});

		$$self.$inject_state = $$props => {
			if ('installed' in $$props) $$invalidate(1, installed = $$props.installed);
			if ('colour' in $$props) $$invalidate(0, colour = $$props.colour);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			colour,
			installed,
			dispatch,
			installPwa,
			click_handler,
			click_handler_1,
			click_handler_2
		];
	}

	class Menu extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$6, create_fragment$6, safe_not_equal, { colour: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Menu",
				options,
				id: create_fragment$6.name
			});
		}

		get colour() {
			throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set colour(value) {
			throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	var quagga_min = createCommonjsModule(function (module, exports) {
	!function(t,e){module.exports=e();}(window,(function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r});},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n(n.s=89)}([function(t,e){t.exports=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){t.exports=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){function n(e){return t.exports=n=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},t.exports.default=t.exports,t.exports.__esModule=!0,n(e)}t.exports=n,t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){t.exports=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}t.exports=function(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e,n){var r=n(19).default,o=n(1);t.exports=function(t,e){if(e&&("object"===r(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return o(t)},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e,n){var r=n(41);t.exports=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&r(t,e);},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e,n){t.exports={EPSILON:n(62),create:n(63),clone:n(156),fromValues:n(157),copy:n(158),set:n(159),equals:n(160),exactEquals:n(161),add:n(162),subtract:n(64),sub:n(163),multiply:n(65),mul:n(164),divide:n(66),div:n(165),inverse:n(166),min:n(167),max:n(168),rotate:n(169),floor:n(170),ceil:n(171),round:n(172),scale:n(173),scaleAndAdd:n(174),distance:n(67),dist:n(175),squaredDistance:n(68),sqrDist:n(176),length:n(69),len:n(177),squaredLength:n(70),sqrLen:n(178),negate:n(179),normalize:n(180),dot:n(181),cross:n(182),lerp:n(183),random:n(184),transformMat2:n(185),transformMat2d:n(186),transformMat3:n(187),transformMat4:n(188),forEach:n(189),limit:n(190)};},function(t,e,n){e.a={init:function(t,e){for(var n=t.length;n--;)t[n]=e;},shuffle:function(t){for(var e=t.length-1;e>=0;e--){var n=Math.floor(Math.random()*e),r=t[e];t[e]=t[n],t[n]=r;}return t},toPointList:function(t){var e=t.reduce((function(t,e){var n="[".concat(e.join(","),"]");return t.push(n),t}),[]);return "[".concat(e.join(",\r\n"),"]")},threshold:function(t,e,n){return t.reduce((function(r,o){return n.apply(t,[o])>=e&&r.push(o),r}),[])},maxIndex:function(t){for(var e=0,n=0;n<t.length;n++)t[n]>t[e]&&(e=n);return e},max:function(t){for(var e=0,n=0;n<t.length;n++)t[n]>e&&(e=t[n]);return e},sum:function(t){for(var e=t.length,n=0;e--;)n+=t[e];return n}};},function(t,e,n){n.d(e,"h",(function(){return l})),n.d(e,"i",(function(){return d})),n.d(e,"b",(function(){return p})),n.d(e,"j",(function(){return v})),n.d(e,"e",(function(){return y})),n.d(e,"c",(function(){return g})),n.d(e,"f",(function(){return x})),n.d(e,"g",(function(){return _})),n.d(e,"a",(function(){return b})),n.d(e,"d",(function(){return O}));var r=n(7),o=n(84),i={clone:r.clone,dot:r.dot},a=function(t,e){var n=[],r={rad:0,vec:i.clone([0,0])},o={};function a(t){o[t.id]=t,n.push(t);}function u(){var t,e=0;for(t=0;t<n.length;t++)e+=n[t].rad;r.rad=e/n.length,r.vec=i.clone([Math.cos(r.rad),Math.sin(r.rad)]);}return a(t),u(),{add:function(t){o[t.id]||(a(t),u());},fits:function(t){return Math.abs(i.dot(t.point.vec,r.vec))>e},getPoints:function(){return n},getCenter:function(){return r}}},u=function(t,e,n){return {rad:t[n],point:t,id:e}},c=n(8),s={clone:r.clone},f={clone:o.clone};function l(t,e){return {x:t,y:e,toVec2:function(){return s.clone([this.x,this.y])},toVec3:function(){return f.clone([this.x,this.y,1])},round:function(){return this.x=this.x>0?Math.floor(this.x+.5):Math.floor(this.x-.5),this.y=this.y>0?Math.floor(this.y+.5):Math.floor(this.y-.5),this}}}function h(t,e){e||(e=8);for(var n=t.data,r=n.length,o=8-e,i=new Int32Array(1<<e);r--;)i[n[r]>>o]++;return i}function d(t,e){var n=function(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:8,r=8-n;function o(t,n){for(var r=0,o=t;o<=n;o++)r+=e[o];return r}function i(t,n){for(var r=0,o=t;o<=n;o++)r+=o*e[o];return r}function a(){var r,a,u,s,f=[0],l=(1<<n)-1;e=h(t,n);for(var d=1;d<l;d++)0===(u=(r=o(0,d))*(a=o(d+1,l)))&&(u=1),s=i(0,d)*a-i(d+1,l)*r,f[d]=s*s/u;return c.a.maxIndex(f)}var u=a();return u<<r}(t);return function(t,e,n){n||(n=t);for(var r=t.data,o=r.length,i=n.data;o--;)i[o]=r[o]<e?1:0;}(t,n,e),n}function p(t,e,n){var r,o,i,c,s=[];function f(t){var e=!1;for(o=0;o<s.length;o++)(i=s[o]).fits(t)&&(i.add(t),e=!0);return e}for(n||(n="rad"),r=0;r<t.length;r++)f(c=u(t[r],r,n))||s.push(a(c,e));return s}function v(t,e,n){var r,o,i,a,u=0,c=0,s=[];for(r=0;r<e;r++)s[r]={score:0,item:null};for(r=0;r<t.length;r++)if((o=n.apply(this,[t[r]]))>c)for((i=s[u]).score=o,i.item=t[r],c=Number.MAX_VALUE,a=0;a<e;a++)s[a].score<c&&(c=s[a].score,u=a);return s}function y(t,e,n){for(var r,o=0,i=e.x,a=Math.floor(t.length/4),u=e.x/2,c=0,s=e.x;i<a;){for(r=0;r<u;r++)n[c]=(.299*t[4*o+0]+.587*t[4*o+1]+.114*t[4*o+2]+(.299*t[4*(o+1)+0]+.587*t[4*(o+1)+1]+.114*t[4*(o+1)+2])+(.299*t[4*i+0]+.587*t[4*i+1]+.114*t[4*i+2])+(.299*t[4*(i+1)+0]+.587*t[4*(i+1)+1]+.114*t[4*(i+1)+2]))/4,c++,o+=2,i+=2;o+=s,i+=s;}}function g(t,e,n){var r=t.length/4|0;if(n&&!0===n.singleChannel)for(var o=0;o<r;o++)e[o]=t[4*o+0];else for(var i=0;i<r;i++)e[i]=.299*t[4*i+0]+.587*t[4*i+1]+.114*t[4*i+2];}function x(t,e){for(var n=t.data,r=t.size.x,o=e.data,i=0,a=r,u=n.length,c=r/2,s=0;a<u;){for(var f=0;f<c;f++)o[s]=Math.floor((n[i]+n[i+1]+n[a]+n[a+1])/4),s++,i+=2,a+=2;i+=r,a+=r;}}function _(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[0,0,0],n=t[0],r=t[1],o=t[2],i=o*r,a=i*(1-Math.abs(n/60%2-1)),u=o-i,c=0,s=0,f=0;return n<60?(c=i,s=a):n<120?(c=a,s=i):n<180?(s=i,f=a):n<240?(s=a,f=i):n<300?(c=a,f=i):n<360&&(c=i,f=a),e[0]=255*(c+u)|0,e[1]=255*(s+u)|0,e[2]=255*(f+u)|0,e}function m(t){for(var e=[],n=[],r=1;r<Math.sqrt(t)+1;r++)t%r==0&&(n.push(r),r!==t/r&&e.unshift(Math.floor(t/r)));return n.concat(e)}function b(t,e){var n,r=m(e.x),o=m(e.y),i=Math.max(e.x,e.y),a=function(t,e){for(var n=0,r=0,o=[];n<t.length&&r<e.length;)t[n]===e[r]?(o.push(t[n]),n++,r++):t[n]>e[r]?r++:n++;return o}(r,o),u=[8,10,15,20,32,60,80],c={"x-small":5,small:4,medium:3,large:2,"x-large":1},s=c[t]||c.medium,f=u[s],l=Math.floor(i/f);function h(t){for(var e=0,n=t[Math.floor(t.length/2)];e<t.length-1&&t[e]<l;)e++;return e>0&&(n=Math.abs(t[e]-l)>Math.abs(t[e-1]-l)?t[e-1]:t[e]),l/n<u[s+1]/u[s]&&l/n>u[s-1]/u[s]?{x:n,y:n}:null}return (n=h(a))||(n=h(m(i)))||(n=h(m(l*f))),n}var w={top:function(t,e){return "%"===t.unit?Math.floor(e.height*(t.value/100)):null},right:function(t,e){return "%"===t.unit?Math.floor(e.width-e.width*(t.value/100)):null},bottom:function(t,e){return "%"===t.unit?Math.floor(e.height-e.height*(t.value/100)):null},left:function(t,e){return "%"===t.unit?Math.floor(e.width*(t.value/100)):null}};function O(t,e,n){var r={width:t,height:e},o=Object.keys(n).reduce((function(t,e){var o=function(t){return {value:parseFloat(t),unit:(t.indexOf("%"),t.length,"%")}}(n[e]),i=w[e](o,r);return t[e]=i,t}),{});return {sx:o.left,sy:o.top,sw:o.right-o.left,sh:o.bottom-o.top}}},function(t,e,n){var r=n(83),o=n.n(r),i=n(3),a=n.n(i),u=n(4),c=n.n(u),s=n(0),f=n.n(s),l=n(7),h=n(9),d=n(8),p={clone:l.clone};function v(t){if(t<0)throw new Error("expected positive number, received ".concat(t))}var y=function(){function t(e,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Uint8Array,o=arguments.length>3?arguments[3]:void 0;a()(this,t),f()(this,"data",void 0),f()(this,"size",void 0),f()(this,"indexMapping",void 0),n?this.data=n:(this.data=new r(e.x*e.y),o&&d.a.init(this.data,0)),this.size=e;}return c()(t,[{key:"inImageWithBorder",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return v(e),t.x>=0&&t.y>=0&&t.x<this.size.x+2*e&&t.y<this.size.y+2*e}},{key:"subImageAsCopy",value:function(t,e){v(e.x),v(e.y);for(var n=t.size,r=n.x,o=n.y,i=0;i<r;i++)for(var a=0;a<o;a++)t.data[a*r+i]=this.data[(e.y+a)*this.size.x+e.x+i];return t}},{key:"get",value:function(t,e){return this.data[e*this.size.x+t]}},{key:"getSafe",value:function(t,e){if(!this.indexMapping){this.indexMapping={x:[],y:[]};for(var n=0;n<this.size.x;n++)this.indexMapping.x[n]=n,this.indexMapping.x[n+this.size.x]=n;for(var r=0;r<this.size.y;r++)this.indexMapping.y[r]=r,this.indexMapping.y[r+this.size.y]=r;}return this.data[this.indexMapping.y[e+this.size.y]*this.size.x+this.indexMapping.x[t+this.size.x]]}},{key:"set",value:function(t,e,n){return this.data[e*this.size.x+t]=n,delete this.indexMapping,this}},{key:"zeroBorder",value:function(){for(var t=this.size,e=t.x,n=t.y,r=0;r<e;r++)this.data[r]=this.data[(n-1)*e+r]=0;for(var o=1;o<n-1;o++)this.data[o*e]=this.data[o*e+(e-1)]=0;return delete this.indexMapping,this}},{key:"moments",value:function(t){var e,n,r,o,i,a,u,c,s,f,l=this.data,h=this.size.y,d=this.size.x,v=[],y=[],g=Math.PI,x=g/4;if(t<=0)return y;for(i=0;i<t;i++)v[i]={m00:0,m01:0,m10:0,m11:0,m02:0,m20:0,theta:0,rad:0};for(n=0;n<h;n++)for(o=n*n,e=0;e<d;e++)(r=l[n*d+e])>0&&((a=v[r-1]).m00+=1,a.m01+=n,a.m10+=e,a.m11+=e*n,a.m02+=o,a.m20+=e*e);for(i=0;i<t;i++)a=v[i],isNaN(a.m00)||0===a.m00||(c=a.m10/a.m00,s=a.m01/a.m00,u=a.m11/a.m00-c*s,f=(a.m02/a.m00-s*s-(a.m20/a.m00-c*c))/(2*u),f=.5*Math.atan(f)+(u>=0?x:-x)+g,a.theta=(180*f/g+90)%180-90,a.theta<0&&(a.theta+=180),a.rad=f>g?f-g:f,a.vec=p.clone([Math.cos(f),Math.sin(f)]),y.push(a));return y}},{key:"getAsRGBA",value:function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,e=new Uint8ClampedArray(4*this.size.x*this.size.y),n=0;n<this.size.y;n++)for(var r=0;r<this.size.x;r++){var o=n*this.size.x+r,i=this.get(r,n)*t;e[4*o+0]=i,e[4*o+1]=i,e[4*o+2]=i,e[4*o+3]=255;}return e}},{key:"show",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=t.getContext("2d");if(!n)throw new Error("Unable to get canvas context");var r=n.getImageData(0,0,t.width,t.height),o=this.getAsRGBA(e);t.width=this.size.x,t.height=this.size.y;var i=new ImageData(o,r.width,r.height);n.putImageData(i,0,0);}},{key:"overlay",value:function(t,e,n){var r=e<0||e>360?360:e,i=[0,1,1],a=[0,0,0],u=[255,255,255],c=[0,0,0],s=t.getContext("2d");if(!s)throw new Error("Unable to get canvas context");for(var f=s.getImageData(n.x,n.y,this.size.x,this.size.y),l=f.data,d=this.data.length;d--;){i[0]=this.data[d]*r;var p=4*d,v=i[0]<=0?u:i[0]>=360?c:Object(h.g)(i,a),y=o()(v,3);l[p]=y[0],l[p+1]=y[1],l[p+2]=y[2],l[p+3]=255;}s.putImageData(f,n.x,n.y);}}]),t}();e.a=y;},function(t,e,n){t.exports=n(228);},function(t,e,n){var r=n(227);function o(e,n,i){return "undefined"!=typeof Reflect&&Reflect.get?(t.exports=o=Reflect.get,t.exports.default=t.exports,t.exports.__esModule=!0):(t.exports=o=function(t,e,n){var o=r(t,e);if(o){var i=Object.getOwnPropertyDescriptor(o,e);return i.get?i.get.call(n):i.value}},t.exports.default=t.exports,t.exports.__esModule=!0),o(e,n,i||e)}t.exports=o,t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){t.exports=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)};},function(t,e){var n=Array.isArray;t.exports=n;},function(t,e,n){e.a={drawRect:function(t,e,n,r){n.strokeStyle=r.color,n.fillStyle=r.color,n.lineWidth=r.lineWidth||1,n.beginPath(),n.strokeRect(t.x,t.y,e.x,e.y);},drawPath:function(t,e,n,r){n.strokeStyle=r.color,n.fillStyle=r.color,n.lineWidth=r.lineWidth,n.beginPath(),n.moveTo(t[0][e.x],t[0][e.y]);for(var o=1;o<t.length;o++)n.lineTo(t[o][e.x],t[o][e.y]);n.closePath(),n.stroke();},drawImage:function(t,e,n){var r=n.getImageData(0,0,e.x,e.y),o=r.data,i=o.length,a=t.length;if(i/a!=4)return !1;for(;a--;){var u=t[a];o[--i]=255,o[--i]=u,o[--i]=u,o[--i]=u;}return n.putImageData(r,0,0),!0}};},function(t,e,n){var r=n(90),o=n(145)((function(t,e,n){r(t,e,n);}));t.exports=o;},function(t,e,n){var r=n(45),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")();t.exports=i;},function(t,e){t.exports=function(t){return null!=t&&"object"==typeof t};},function(t,e){function n(e){return "function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?(t.exports=n=function(t){return typeof t},t.exports.default=t.exports,t.exports.__esModule=!0):(t.exports=n=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t.exports.default=t.exports,t.exports.__esModule=!0),n(e)}t.exports=n,t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){function n(t,e,n,r,o,i,a){try{var u=t[i](a),c=u.value;}catch(t){return void n(t)}u.done?e(c):Promise.resolve(c).then(r,o);}t.exports=function(t){return function(){var e=this,r=arguments;return new Promise((function(o,i){var a=t.apply(e,r);function u(t){n(a,o,i,u,c,"next",t);}function c(t){n(a,o,i,u,c,"throw",t);}u(void 0);}))}},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e,n){e.a={searchDirections:[[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]],create:function(t,e){var n,r=t.data,o=e.data,i=this.searchDirections,a=t.size.x;function u(t,e,u,c){var s,f,l;for(s=0;s<7;s++){if(f=t.cy+i[t.dir][0],l=t.cx+i[t.dir][1],r[n=f*a+l]===e&&(0===o[n]||o[n]===u))return o[n]=u,t.cy=f,t.cx=l,!0;0===o[n]&&(o[n]=c),t.dir=(t.dir+1)%8;}return !1}function c(t,e,n){return {dir:n,x:t,y:e,next:null,prev:null}}return {trace:function(t,e,n,r){return u(t,e,n,r)},contourTracing:function(t,e,n,r,o){return function(t,e,n,r,o){var i,a,s,f=null,l={cx:e,cy:t,dir:0};if(u(l,r,n,o)){i=f=c(e,t,l.dir),s=l.dir,(a=c(l.cx,l.cy,0)).prev=i,i.next=a,a.next=null,i=a;do{l.dir=(l.dir+6)%8,u(l,r,n,o),s!==l.dir?(i.dir=l.dir,(a=c(l.cx,l.cy,0)).prev=i,i.next=a,a.next=null,i=a):(i.dir=s,i.x=l.cx,i.y=l.cy),s=l.dir;}while(l.cx!==e||l.cy!==t);f.prev=i.prev,i.prev.next=f;}return f}(t,e,n,r,o)}}}};},function(t,e,n){var r=n(27),o=n(103),i=n(104),a=r?r.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":a&&a in Object(t)?o(t):i(t)};},function(t,e,n){(function(t){var r,o,i,a,u,c,s,f,l,h,d,p,v=n(7),y=n(34),g=n(10),x=n(9),_=n(8),m=(n(15),n(87)),b=n(21),w=n(88),O={ctx:{binary:null},dom:{binary:null}},R={x:0,y:0};function C(t){var e,n,o,i,a,u,c,s=l.size.x,f=l.size.y,h=-l.size.x,d=-l.size.y;for(e=0,n=0;n<t.length;n++)e+=(i=t[n]).rad;for((e=(180*(e/=t.length)/Math.PI+90)%180-90)<0&&(e+=180),e=(180-e)*Math.PI/180,a=y.copy(y.create(),[Math.cos(e),Math.sin(e),-Math.sin(e),Math.cos(e)]),n=0;n<t.length;n++){for(i=t[n],o=0;o<4;o++)v.transformMat2(i.box[o],i.box[o],a);}for(n=0;n<t.length;n++)for(i=t[n],o=0;o<4;o++)i.box[o][0]<s&&(s=i.box[o][0]),i.box[o][0]>h&&(h=i.box[o][0]),i.box[o][1]<f&&(f=i.box[o][1]),i.box[o][1]>d&&(d=i.box[o][1]);for(u=[[s,f],[h,f],[h,d],[s,d]],c=r.halfSample?2:1,a=y.invert(a,a),o=0;o<4;o++)v.transformMat2(u[o],u[o],a);for(o=0;o<4;o++)v.scale(u[o],u[o],c);return u}function E(t,e){l.subImageAsCopy(a,Object(x.h)(t,e)),p.skeletonize();}function M(t,e,n,r){var o,i,u,c,s=[],f=[],l=Math.ceil(h.x/3);if(t.length>=2){for(o=0;o<t.length;o++)t[o].m00>l&&s.push(t[o]);if(s.length>=2){for(u=function(t){var e=Object(x.b)(t,.9),n=Object(x.j)(e,1,(function(t){return t.getPoints().length})),r=[],o=[];if(1===n.length){r=n[0].item.getPoints();for(var i=0;i<r.length;i++)o.push(r[i].point);}return o}(s),i=0,o=0;o<u.length;o++)i+=u[o].rad;u.length>1&&u.length>=s.length/4*3&&u.length>t.length/4&&(i/=u.length,c={index:e[1]*R.x+e[0],pos:{x:n,y:r},box:[v.clone([n,r]),v.clone([n+a.size.x,r]),v.clone([n+a.size.x,r+a.size.y]),v.clone([n,r+a.size.y])],moments:u,rad:i,vec:v.clone([Math.cos(i),Math.sin(i)])},f.push(c));}}return f}e.a={init:function(e,n){r=n,d=e,function(){o=r.halfSample?new g.a({x:d.size.x/2|0,y:d.size.y/2|0}):d,h=Object(x.a)(r.patchSize,o.size),R.x=o.size.x/h.x|0,R.y=o.size.y/h.y|0,l=new g.a(o.size,void 0,Uint8Array,!1),u=new g.a(h,void 0,Array,!0);var e=new ArrayBuffer(65536);a=new g.a(h,new Uint8Array(e,0,h.x*h.y)),i=new g.a(h,new Uint8Array(e,h.x*h.y*3,h.x*h.y),void 0,!0),p=Object(w.a)("undefined"!=typeof window?window:"undefined"!=typeof self?self:t,{size:h.x},e),f=new g.a({x:o.size.x/a.size.x|0,y:o.size.y/a.size.y|0},void 0,Array,!0),c=new g.a(f.size,void 0,void 0,!0),s=new g.a(f.size,void 0,Int32Array,!0);}(),r.useWorker||"undefined"==typeof document||(O.dom.binary=document.createElement("canvas"),O.dom.binary.className="binaryBuffer",O.ctx.binary=O.dom.binary.getContext("2d"),O.dom.binary.width=l.size.x,O.dom.binary.height=l.size.y);},locate:function(){r.halfSample&&Object(x.f)(d,o),Object(x.i)(o,l),l.zeroBorder();var t=function(){var t,e,n,r,o,c,s=[];for(t=0;t<R.x;t++)for(e=0;e<R.y;e++)E(n=a.size.x*t,r=a.size.y*e),i.zeroBorder(),_.a.init(u.data,0),c=m.a.create(i,u).rasterize(0),o=u.moments(c.count),s=s.concat(M(o,[t,e],n,r));return s}();if(t.length<R.x*R.y*.05)return null;var e=function(t){var e,n,r=0,o=0;function i(){var t;for(t=0;t<s.data.length;t++)if(0===s.data[t]&&1===c.data[t])return t;return s.length}function a(t){var e,n,o,i,u,l=t%s.size.x,h=t/s.size.x|0;if(t<s.data.length)for(o=f.data[t],s.data[t]=r,u=0;u<b.a.searchDirections.length;u++)n=h+b.a.searchDirections[u][0],e=l+b.a.searchDirections[u][1],i=n*s.size.x+e,0!==c.data[i]?0===s.data[i]&&Math.abs(v.dot(f.data[i].vec,o.vec))>.95&&a(i):s.data[i]=Number.MAX_VALUE;}for(_.a.init(c.data,0),_.a.init(s.data,0),_.a.init(f.data,null),e=0;e<t.length;e++)n=t[e],f.data[n.index]=n,c.data[n.index]=1;for(c.zeroBorder();(o=i())<s.data.length;)r++,a(o);return r}(t);if(e<1)return null;var n=function(t){var e,n,r=[];for(e=0;e<t;e++)r.push(0);for(n=s.data.length;n--;)s.data[n]>0&&r[s.data[n]-1]++;return (r=r.map((function(t,e){return {val:t,label:e+1}}))).sort((function(t,e){return e.val-t.val})),r.filter((function(t){return t.val>=5}))}(e);return 0===n.length?null:function(t,e){var n,r,o,i,a=[],u=[];for(n=0;n<t.length;n++){for(r=s.data.length,a.length=0;r--;)s.data[r]===t[n].label&&(o=f.data[r],a.push(o));(i=C(a))&&u.push(i);}return u}(n)},checkImageConstraints:function(t,e){var n,r,o=t.getWidth(),i=t.getHeight(),a=e.halfSample?.5:1;t.getConfig().area&&(r=Object(x.d)(o,i,t.getConfig().area),t.setTopRight({x:r.sx,y:r.sy}),t.setCanvasSize({x:o,y:i}),o=r.sw,i=r.sh);var u={x:Math.floor(o*a),y:Math.floor(i*a)};if(n=Object(x.a)(e.patchSize,u),t.setWidth(Math.floor(Math.floor(u.x/n.x)*(1/a)*n.x)),t.setHeight(Math.floor(Math.floor(u.y/n.y)*(1/a)*n.y)),t.getWidth()%n.x==0&&t.getHeight()%n.y==0)return !0;throw new Error("Image dimensions do not comply with the current settings: Width (".concat(o," )and height (").concat(i,") must a multiple of ").concat(n.x))}};}).call(this,n(46));},function(t,e,n){var r=n(92),o=n(93),i=n(94),a=n(95),u=n(96);function c(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1]);}}c.prototype.clear=r,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=a,c.prototype.set=u,t.exports=c;},function(t,e,n){var r=n(26);t.exports=function(t,e){for(var n=t.length;n--;)if(r(t[n][0],e))return n;return -1};},function(t,e){t.exports=function(t,e){return t===e||t!=t&&e!=e};},function(t,e,n){var r=n(17).Symbol;t.exports=r;},function(t,e,n){var r=n(35)(Object,"create");t.exports=r;},function(t,e,n){var r=n(117);t.exports=function(t,e){var n=t.__data__;return r(e)?n["string"==typeof e?"string":"hash"]:n.map};},function(t,e,n){var r=n(132),o=n(18),i=Object.prototype,a=i.hasOwnProperty,u=i.propertyIsEnumerable,c=r(function(){return arguments}())?r:function(t){return o(t)&&a.call(t,"callee")&&!u.call(t,"callee")};t.exports=c;},function(t,e){var n=/^(?:0|[1-9]\d*)$/;t.exports=function(t,e){var r=typeof t;return !!(e=null==e?9007199254740991:e)&&("number"==r||"symbol"!=r&&n.test(t))&&t>-1&&t%1==0&&t<e};},function(t,e,n){var r=n(14),o=n(232),i=n(233),a=n(236);t.exports=function(t,e){return r(t)?t:o(t,e)?[t]:i(a(t))};},function(t,e,n){var r=n(224),o=n(225),i=n(60),a=n(226);t.exports=function(t){return r(t)||o(t)||i(t)||a()},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e,n){t.exports={determinant:n(251),transpose:n(252),multiply:n(253),identity:n(254),adjoint:n(255),rotate:n(256),invert:n(257),create:n(258),scale:n(259),copy:n(260),frob:n(261),ldu:n(262)};},function(t,e,n){var r=n(102),o=n(108);t.exports=function(t,e){var n=o(t,e);return r(n)?n:void 0};},function(t,e,n){var r=n(22),o=n(13);t.exports=function(t){if(!o(t))return !1;var e=r(t);return "[object Function]"==e||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e};},function(t,e,n){var r=n(49);t.exports=function(t,e,n){"__proto__"==e&&r?r(t,e,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[e]=n;};},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t};},function(t,e,n){var r=n(36),o=n(40);t.exports=function(t){return null!=t&&o(t.length)&&!r(t)};},function(t,e){t.exports=function(t){return "number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991};},function(t,e){function n(e,r){return t.exports=n=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},t.exports.default=t.exports,t.exports.__esModule=!0,n(e,r)}t.exports=n,t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e,n){var r=n(22),o=n(18);t.exports=function(t){return "symbol"==typeof t||o(t)&&"[object Symbol]"==r(t)};},function(t,e,n){var r=n(42);t.exports=function(t){if("string"==typeof t||r(t))return t;var e=t+"";return "0"==e&&1/t==-1/0?"-0":e};},function(t,e,n){var r=n(35)(n(17),"Map");t.exports=r;},function(t,e,n){(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.exports=n;}).call(this,n(46));},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")();}catch(t){"object"==typeof window&&(n=window);}t.exports=n;},function(t,e,n){var r=n(109),o=n(116),i=n(118),a=n(119),u=n(120);function c(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1]);}}c.prototype.clear=r,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=a,c.prototype.set=u,t.exports=c;},function(t,e,n){var r=n(37),o=n(26);t.exports=function(t,e,n){(void 0!==n&&!o(t[e],n)||void 0===n&&!(e in t))&&r(t,e,n);};},function(t,e,n){var r=n(35),o=function(){try{var t=r(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();t.exports=o;},function(t,e,n){var r=n(131)(Object.getPrototypeOf,Object);t.exports=r;},function(t,e){var n=Object.prototype;t.exports=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||n)};},function(t,e,n){(function(t){var r=n(17),o=n(134),i=e&&!e.nodeType&&e,a=i&&"object"==typeof t&&t&&!t.nodeType&&t,u=a&&a.exports===i?r.Buffer:void 0,c=(u?u.isBuffer:void 0)||o;t.exports=c;}).call(this,n(38)(t));},function(t,e,n){var r=n(136),o=n(137),i=n(138),a=i&&i.isTypedArray,u=a?o(a):r;t.exports=u;},function(t,e){t.exports=function(t,e){if(("constructor"!==e||"function"!=typeof t[e])&&"__proto__"!=e)return t[e]};},function(t,e,n){var r=n(37),o=n(26),i=Object.prototype.hasOwnProperty;t.exports=function(t,e,n){var a=t[e];i.call(t,e)&&o(a,n)&&(void 0!==n||e in t)||r(t,e,n);};},function(t,e,n){var r=n(141),o=n(143),i=n(39);t.exports=function(t){return i(t)?r(t,!0):o(t)};},function(t,e){t.exports=function(t){return t};},function(t,e,n){var r=n(147),o=Math.max;t.exports=function(t,e,n){return e=o(void 0===e?t.length-1:e,0),function(){for(var i=arguments,a=-1,u=o(i.length-e,0),c=Array(u);++a<u;)c[a]=i[e+a];a=-1;for(var s=Array(e+1);++a<e;)s[a]=i[a];return s[e]=n(c),r(t,this,s)}};},function(t,e,n){var r=n(148),o=n(150)(r);t.exports=o;},function(t,e,n){var r=n(61);t.exports=function(t,e){if(t){if("string"==typeof t)return r(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return "Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(t,e):void 0}},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){t.exports=function(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){t.exports=1e-6;},function(t,e){t.exports=function(){var t=new Float32Array(2);return t[0]=0,t[1]=0,t};},function(t,e){t.exports=function(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t};},function(t,e){t.exports=function(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t};},function(t,e){t.exports=function(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t};},function(t,e){t.exports=function(t,e){var n=e[0]-t[0],r=e[1]-t[1];return Math.sqrt(n*n+r*r)};},function(t,e){t.exports=function(t,e){var n=e[0]-t[0],r=e[1]-t[1];return n*n+r*r};},function(t,e){t.exports=function(t){var e=t[0],n=t[1];return Math.sqrt(e*e+n*n)};},function(t,e){t.exports=function(t){var e=t[0],n=t[1];return e*e+n*n};},function(t,e){t.exports=1e-6;},function(t,e){t.exports=function(){var t=new Float32Array(3);return t[0]=0,t[1]=0,t[2]=0,t};},function(t,e){t.exports=function(t,e,n){var r=new Float32Array(3);return r[0]=t,r[1]=e,r[2]=n,r};},function(t,e){t.exports=function(t,e){var n=e[0],r=e[1],o=e[2],i=n*n+r*r+o*o;i>0&&(i=1/Math.sqrt(i),t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i);return t};},function(t,e){t.exports=function(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]};},function(t,e){t.exports=function(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t};},function(t,e){t.exports=function(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t[2]=e[2]*n[2],t};},function(t,e){t.exports=function(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t[2]=e[2]/n[2],t};},function(t,e){t.exports=function(t,e){var n=e[0]-t[0],r=e[1]-t[1],o=e[2]-t[2];return Math.sqrt(n*n+r*r+o*o)};},function(t,e){t.exports=function(t,e){var n=e[0]-t[0],r=e[1]-t[1],o=e[2]-t[2];return n*n+r*r+o*o};},function(t,e){t.exports=function(t){var e=t[0],n=t[1],r=t[2];return Math.sqrt(e*e+n*n+r*r)};},function(t,e){t.exports=function(t){var e=t[0],n=t[1],r=t[2];return e*e+n*n+r*r};},function(t,e,n){var r=n(153),o=n(154),i=n(60),a=n(155);t.exports=function(t,e){return r(t)||o(t,e)||i(t,e)||a()},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e,n){t.exports={EPSILON:n(71),create:n(72),clone:n(191),angle:n(192),fromValues:n(73),copy:n(193),set:n(194),equals:n(195),exactEquals:n(196),add:n(197),subtract:n(76),sub:n(198),multiply:n(77),mul:n(199),divide:n(78),div:n(200),min:n(201),max:n(202),floor:n(203),ceil:n(204),round:n(205),scale:n(206),scaleAndAdd:n(207),distance:n(79),dist:n(208),squaredDistance:n(80),sqrDist:n(209),length:n(81),len:n(210),squaredLength:n(82),sqrLen:n(211),negate:n(212),inverse:n(213),normalize:n(74),dot:n(75),cross:n(214),lerp:n(215),random:n(216),transformMat4:n(217),transformMat3:n(218),transformQuat:n(219),rotateX:n(220),rotateY:n(221),rotateZ:n(222),forEach:n(223)};},function(t,e,n){var r=n(229),o=n(243)((function(t,e){return null==t?{}:r(t,e)}));t.exports=o;},function(t,e,n){var r=n(2),o=n(41),i=n(248),a=n(249);function u(e){var n="function"==typeof Map?new Map:void 0;return t.exports=u=function(t){if(null===t||!i(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(t))return n.get(t);n.set(t,e);}function e(){return a(t,arguments,r(this).constructor)}return e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),o(e,t)},t.exports.default=t.exports,t.exports.__esModule=!0,u(e)}t.exports=u,t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e,n){var r=n(21),o={createContour2D:function(){return {dir:null,index:null,firstVertex:null,insideContours:null,nextpeer:null,prevpeer:null}},CONTOUR_DIR:{CW_DIR:0,CCW_DIR:1,UNKNOWN_DIR:2},DIR:{OUTSIDE_EDGE:-32767,INSIDE_EDGE:-32766},create:function(t,e){var n=t.data,i=e.data,a=t.size.x,u=t.size.y,c=r.a.create(t,e);return {rasterize:function(t){var e,r,s,f,l,h,d,p,v,y,g,x,_=[],m=0;for(x=0;x<400;x++)_[x]=0;for(_[0]=n[0],v=null,h=1;h<u-1;h++)for(f=0,r=_[0],l=1;l<a-1;l++)if(0===i[g=h*a+l])if((e=n[g])!==r){if(0===f)_[s=m+1]=e,r=e,null!==(d=c.contourTracing(h,l,s,e,o.DIR.OUTSIDE_EDGE))&&(m++,f=s,(p=o.createContour2D()).dir=o.CONTOUR_DIR.CW_DIR,p.index=f,p.firstVertex=d,p.nextpeer=v,p.insideContours=null,null!==v&&(v.prevpeer=p),v=p);else if(null!==(d=c.contourTracing(h,l,o.DIR.INSIDE_EDGE,e,f))){for((p=o.createContour2D()).firstVertex=d,p.insideContours=null,p.dir=0===t?o.CONTOUR_DIR.CCW_DIR:o.CONTOUR_DIR.CW_DIR,p.index=t,y=v;null!==y&&y.index!==f;)y=y.nextpeer;null!==y&&(p.nextpeer=y.insideContours,null!==y.insideContours&&(y.insideContours.prevpeer=p),y.insideContours=p);}}else i[g]=f;else i[g]===o.DIR.OUTSIDE_EDGE||i[g]===o.DIR.INSIDE_EDGE?(f=0,r=i[g]===o.DIR.INSIDE_EDGE?n[g]:_[0]):r=_[f=i[g]];for(y=v;null!==y;)y.index=t,y=y.nextpeer;return {cc:v,count:m}},debug:{drawContour:function(t,e){var n,r,i,a=t.getContext("2d"),u=e;for(a.strokeStyle="red",a.fillStyle="red",a.lineWidth=1,n=null!==u?u.insideContours:null;null!==u;){switch(null!==n?(r=n,n=n.nextpeer):(r=u,n=null!==(u=u.nextpeer)?u.insideContours:null),r.dir){case o.CONTOUR_DIR.CW_DIR:a.strokeStyle="red";break;case o.CONTOUR_DIR.CCW_DIR:a.strokeStyle="blue";break;case o.CONTOUR_DIR.UNKNOWN_DIR:a.strokeStyle="green";}i=r.firstVertex,a.beginPath(),a.moveTo(i.x,i.y);do{i=i.next,a.lineTo(i.x,i.y);}while(i!==r.firstVertex);a.stroke();}}}}}};e.a=o;},function(t,e,n){/* @preserve ASM BEGIN */
	/* @preserve ASM END */e.a=function(t,e,n){"use asm";var r=new t.Uint8Array(n),o=e.size|0,i=t.Math.imul;function a(t,e){t|=0;e|=0;var n=0;var i=0;var a=0;var u=0;var c=0;var s=0;var f=0;var l=0;for(n=1;(n|0)<(o-1|0);n=n+1|0){l=l+o|0;for(i=1;(i|0)<(o-1|0);i=i+1|0){u=l-o|0;c=l+o|0;s=i-1|0;f=i+1|0;a=(r[t+u+s|0]|0)+(r[t+u+f|0]|0)+(r[t+l+i|0]|0)+(r[t+c+s|0]|0)+(r[t+c+f|0]|0)|0;if((a|0)==(5|0)){r[e+l+i|0]=1;}else {r[e+l+i|0]=0;}}}}function u(t,e,n){t|=0;e|=0;n|=0;var a=0;a=i(o,o)|0;while((a|0)>0){a=a-1|0;r[n+a|0]=(r[t+a|0]|0)-(r[e+a|0]|0)|0;}}function c(t,e,n){t|=0;e|=0;n|=0;var a=0;a=i(o,o)|0;while((a|0)>0){a=a-1|0;r[n+a|0]=r[t+a|0]|0|(r[e+a|0]|0)|0;}}function s(t){t|=0;var e=0;var n=0;n=i(o,o)|0;while((n|0)>0){n=n-1|0;e=(e|0)+(r[t+n|0]|0)|0;}return e|0}function f(t,e){t|=0;e|=0;var n=0;n=i(o,o)|0;while((n|0)>0){n=n-1|0;r[t+n|0]=e;}}function l(t,e){t|=0;e|=0;var n=0;var i=0;var a=0;var u=0;var c=0;var s=0;var f=0;var l=0;for(n=1;(n|0)<(o-1|0);n=n+1|0){l=l+o|0;for(i=1;(i|0)<(o-1|0);i=i+1|0){u=l-o|0;c=l+o|0;s=i-1|0;f=i+1|0;a=(r[t+u+s|0]|0)+(r[t+u+f|0]|0)+(r[t+l+i|0]|0)+(r[t+c+s|0]|0)+(r[t+c+f|0]|0)|0;if((a|0)>(0|0)){r[e+l+i|0]=1;}else {r[e+l+i|0]=0;}}}}function h(t,e){t|=0;e|=0;var n=0;n=i(o,o)|0;while((n|0)>0){n=n-1|0;r[e+n|0]=r[t+n|0]|0;}}function d(t){t|=0;var e=0;var n=0;for(e=0;(e|0)<(o-1|0);e=e+1|0){r[t+e|0]=0;r[t+n|0]=0;n=n+o-1|0;r[t+n|0]=0;n=n+1|0;}for(e=0;(e|0)<(o|0);e=e+1|0){r[t+n|0]=0;n=n+1|0;}}function p(){var t=0;var e=0;var n=0;var r=0;var p=0;var v=0;e=i(o,o)|0;n=e+e|0;r=n+e|0;f(r,0);d(t);do{a(t,e);l(e,n);u(t,n,n);c(r,n,r);h(e,t);p=s(t)|0;v=(p|0)==0|0;}while(!v)}return {skeletonize:p}};},function(t,e,n){t.exports=n(263);},function(t,e,n){var r=n(91),o=n(48),i=n(121),a=n(123),u=n(13),c=n(56),s=n(54);t.exports=function t(e,n,f,l,h){e!==n&&i(n,(function(i,c){if(h||(h=new r),u(i))a(e,n,c,f,t,l,h);else {var d=l?l(s(e,c),i,c+"",e,n,h):void 0;void 0===d&&(d=i),o(e,c,d);}}),c);};},function(t,e,n){var r=n(24),o=n(97),i=n(98),a=n(99),u=n(100),c=n(101);function s(t){var e=this.__data__=new r(t);this.size=e.size;}s.prototype.clear=o,s.prototype.delete=i,s.prototype.get=a,s.prototype.has=u,s.prototype.set=c,t.exports=s;},function(t,e){t.exports=function(){this.__data__=[],this.size=0;};},function(t,e,n){var r=n(25),o=Array.prototype.splice;t.exports=function(t){var e=this.__data__,n=r(e,t);return !(n<0)&&(n==e.length-1?e.pop():o.call(e,n,1),--this.size,!0)};},function(t,e,n){var r=n(25);t.exports=function(t){var e=this.__data__,n=r(e,t);return n<0?void 0:e[n][1]};},function(t,e,n){var r=n(25);t.exports=function(t){return r(this.__data__,t)>-1};},function(t,e,n){var r=n(25);t.exports=function(t,e){var n=this.__data__,o=r(n,t);return o<0?(++this.size,n.push([t,e])):n[o][1]=e,this};},function(t,e,n){var r=n(24);t.exports=function(){this.__data__=new r,this.size=0;};},function(t,e){t.exports=function(t){var e=this.__data__,n=e.delete(t);return this.size=e.size,n};},function(t,e){t.exports=function(t){return this.__data__.get(t)};},function(t,e){t.exports=function(t){return this.__data__.has(t)};},function(t,e,n){var r=n(24),o=n(44),i=n(47);t.exports=function(t,e){var n=this.__data__;if(n instanceof r){var a=n.__data__;if(!o||a.length<199)return a.push([t,e]),this.size=++n.size,this;n=this.__data__=new i(a);}return n.set(t,e),this.size=n.size,this};},function(t,e,n){var r=n(36),o=n(105),i=n(13),a=n(107),u=/^\[object .+?Constructor\]$/,c=Function.prototype,s=Object.prototype,f=c.toString,l=s.hasOwnProperty,h=RegExp("^"+f.call(l).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=function(t){return !(!i(t)||o(t))&&(r(t)?h:u).test(a(t))};},function(t,e,n){var r=n(27),o=Object.prototype,i=o.hasOwnProperty,a=o.toString,u=r?r.toStringTag:void 0;t.exports=function(t){var e=i.call(t,u),n=t[u];try{t[u]=void 0;var r=!0;}catch(t){}var o=a.call(t);return r&&(e?t[u]=n:delete t[u]),o};},function(t,e){var n=Object.prototype.toString;t.exports=function(t){return n.call(t)};},function(t,e,n){var r,o=n(106),i=(r=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+r:"";t.exports=function(t){return !!i&&i in t};},function(t,e,n){var r=n(17)["__core-js_shared__"];t.exports=r;},function(t,e){var n=Function.prototype.toString;t.exports=function(t){if(null!=t){try{return n.call(t)}catch(t){}try{return t+""}catch(t){}}return ""};},function(t,e){t.exports=function(t,e){return null==t?void 0:t[e]};},function(t,e,n){var r=n(110),o=n(24),i=n(44);t.exports=function(){this.size=0,this.__data__={hash:new r,map:new(i||o),string:new r};};},function(t,e,n){var r=n(111),o=n(112),i=n(113),a=n(114),u=n(115);function c(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1]);}}c.prototype.clear=r,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=a,c.prototype.set=u,t.exports=c;},function(t,e,n){var r=n(28);t.exports=function(){this.__data__=r?r(null):{},this.size=0;};},function(t,e){t.exports=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e};},function(t,e,n){var r=n(28),o=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;if(r){var n=e[t];return "__lodash_hash_undefined__"===n?void 0:n}return o.call(e,t)?e[t]:void 0};},function(t,e,n){var r=n(28),o=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;return r?void 0!==e[t]:o.call(e,t)};},function(t,e,n){var r=n(28);t.exports=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=r&&void 0===e?"__lodash_hash_undefined__":e,this};},function(t,e,n){var r=n(29);t.exports=function(t){var e=r(this,t).delete(t);return this.size-=e?1:0,e};},function(t,e){t.exports=function(t){var e=typeof t;return "string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t};},function(t,e,n){var r=n(29);t.exports=function(t){return r(this,t).get(t)};},function(t,e,n){var r=n(29);t.exports=function(t){return r(this,t).has(t)};},function(t,e,n){var r=n(29);t.exports=function(t,e){var n=r(this,t),o=n.size;return n.set(t,e),this.size+=n.size==o?0:1,this};},function(t,e,n){var r=n(122)();t.exports=r;},function(t,e){t.exports=function(t){return function(e,n,r){for(var o=-1,i=Object(e),a=r(e),u=a.length;u--;){var c=a[t?u:++o];if(!1===n(i[c],c,i))break}return e}};},function(t,e,n){var r=n(48),o=n(124),i=n(125),a=n(128),u=n(129),c=n(30),s=n(14),f=n(133),l=n(52),h=n(36),d=n(13),p=n(135),v=n(53),y=n(54),g=n(139);t.exports=function(t,e,n,x,_,m,b){var w=y(t,n),O=y(e,n),R=b.get(O);if(R)r(t,n,R);else {var C=m?m(w,O,n+"",t,e,b):void 0,E=void 0===C;if(E){var M=s(O),S=!M&&l(O),A=!M&&!S&&v(O);C=O,M||S||A?s(w)?C=w:f(w)?C=a(w):S?(E=!1,C=o(O,!0)):A?(E=!1,C=i(O,!0)):C=[]:p(O)||c(O)?(C=w,c(w)?C=g(w):d(w)&&!h(w)||(C=u(O))):E=!1;}E&&(b.set(O,C),_(C,O,x,m,b),b.delete(O)),r(t,n,C);}};},function(t,e,n){(function(t){var r=n(17),o=e&&!e.nodeType&&e,i=o&&"object"==typeof t&&t&&!t.nodeType&&t,a=i&&i.exports===o?r.Buffer:void 0,u=a?a.allocUnsafe:void 0;t.exports=function(t,e){if(e)return t.slice();var n=t.length,r=u?u(n):new t.constructor(n);return t.copy(r),r};}).call(this,n(38)(t));},function(t,e,n){var r=n(126);t.exports=function(t,e){var n=e?r(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.length)};},function(t,e,n){var r=n(127);t.exports=function(t){var e=new t.constructor(t.byteLength);return new r(e).set(new r(t)),e};},function(t,e,n){var r=n(17).Uint8Array;t.exports=r;},function(t,e){t.exports=function(t,e){var n=-1,r=t.length;for(e||(e=Array(r));++n<r;)e[n]=t[n];return e};},function(t,e,n){var r=n(130),o=n(50),i=n(51);t.exports=function(t){return "function"!=typeof t.constructor||i(t)?{}:r(o(t))};},function(t,e,n){var r=n(13),o=Object.create,i=function(){function t(){}return function(e){if(!r(e))return {};if(o)return o(e);t.prototype=e;var n=new t;return t.prototype=void 0,n}}();t.exports=i;},function(t,e){t.exports=function(t,e){return function(n){return t(e(n))}};},function(t,e,n){var r=n(22),o=n(18);t.exports=function(t){return o(t)&&"[object Arguments]"==r(t)};},function(t,e,n){var r=n(39),o=n(18);t.exports=function(t){return o(t)&&r(t)};},function(t,e){t.exports=function(){return !1};},function(t,e,n){var r=n(22),o=n(50),i=n(18),a=Function.prototype,u=Object.prototype,c=a.toString,s=u.hasOwnProperty,f=c.call(Object);t.exports=function(t){if(!i(t)||"[object Object]"!=r(t))return !1;var e=o(t);if(null===e)return !0;var n=s.call(e,"constructor")&&e.constructor;return "function"==typeof n&&n instanceof n&&c.call(n)==f};},function(t,e,n){var r=n(22),o=n(40),i=n(18),a={};a["[object Float32Array]"]=a["[object Float64Array]"]=a["[object Int8Array]"]=a["[object Int16Array]"]=a["[object Int32Array]"]=a["[object Uint8Array]"]=a["[object Uint8ClampedArray]"]=a["[object Uint16Array]"]=a["[object Uint32Array]"]=!0,a["[object Arguments]"]=a["[object Array]"]=a["[object ArrayBuffer]"]=a["[object Boolean]"]=a["[object DataView]"]=a["[object Date]"]=a["[object Error]"]=a["[object Function]"]=a["[object Map]"]=a["[object Number]"]=a["[object Object]"]=a["[object RegExp]"]=a["[object Set]"]=a["[object String]"]=a["[object WeakMap]"]=!1,t.exports=function(t){return i(t)&&o(t.length)&&!!a[r(t)]};},function(t,e){t.exports=function(t){return function(e){return t(e)}};},function(t,e,n){(function(t){var r=n(45),o=e&&!e.nodeType&&e,i=o&&"object"==typeof t&&t&&!t.nodeType&&t,a=i&&i.exports===o&&r.process,u=function(){try{var t=i&&i.require&&i.require("util").types;return t||a&&a.binding&&a.binding("util")}catch(t){}}();t.exports=u;}).call(this,n(38)(t));},function(t,e,n){var r=n(140),o=n(56);t.exports=function(t){return r(t,o(t))};},function(t,e,n){var r=n(55),o=n(37);t.exports=function(t,e,n,i){var a=!n;n||(n={});for(var u=-1,c=e.length;++u<c;){var s=e[u],f=i?i(n[s],t[s],s,n,t):void 0;void 0===f&&(f=t[s]),a?o(n,s,f):r(n,s,f);}return n};},function(t,e,n){var r=n(142),o=n(30),i=n(14),a=n(52),u=n(31),c=n(53),s=Object.prototype.hasOwnProperty;t.exports=function(t,e){var n=i(t),f=!n&&o(t),l=!n&&!f&&a(t),h=!n&&!f&&!l&&c(t),d=n||f||l||h,p=d?r(t.length,String):[],v=p.length;for(var y in t)!e&&!s.call(t,y)||d&&("length"==y||l&&("offset"==y||"parent"==y)||h&&("buffer"==y||"byteLength"==y||"byteOffset"==y)||u(y,v))||p.push(y);return p};},function(t,e){t.exports=function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r};},function(t,e,n){var r=n(13),o=n(51),i=n(144),a=Object.prototype.hasOwnProperty;t.exports=function(t){if(!r(t))return i(t);var e=o(t),n=[];for(var u in t)("constructor"!=u||!e&&a.call(t,u))&&n.push(u);return n};},function(t,e){t.exports=function(t){var e=[];if(null!=t)for(var n in Object(t))e.push(n);return e};},function(t,e,n){var r=n(146),o=n(151);t.exports=function(t){return r((function(e,n){var r=-1,i=n.length,a=i>1?n[i-1]:void 0,u=i>2?n[2]:void 0;for(a=t.length>3&&"function"==typeof a?(i--,a):void 0,u&&o(n[0],n[1],u)&&(a=i<3?void 0:a,i=1),e=Object(e);++r<i;){var c=n[r];c&&t(e,c,r,a);}return e}))};},function(t,e,n){var r=n(57),o=n(58),i=n(59);t.exports=function(t,e){return i(o(t,e,r),t+"")};},function(t,e){t.exports=function(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)};},function(t,e,n){var r=n(149),o=n(49),i=n(57),a=o?function(t,e){return o(t,"toString",{configurable:!0,enumerable:!1,value:r(e),writable:!0})}:i;t.exports=a;},function(t,e){t.exports=function(t){return function(){return t}};},function(t,e){var n=Date.now;t.exports=function(t){var e=0,r=0;return function(){var o=n(),i=16-(o-r);if(r=o,i>0){if(++e>=800)return arguments[0]}else e=0;return t.apply(void 0,arguments)}};},function(t,e,n){var r=n(26),o=n(39),i=n(31),a=n(13);t.exports=function(t,e,n){if(!a(n))return !1;var u=typeof e;return !!("number"==u?o(n)&&i(e,n.length):"string"==u&&e in n)&&r(n[e],t)};},function(t,e){"undefined"!=typeof window&&(window.requestAnimationFrame||(window.requestAnimationFrame=window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60);})),"function"!=typeof Math.imul&&(Math.imul=function(t,e){var n=65535&t,r=65535&e;return n*r+((t>>>16&65535)*r+n*(e>>>16&65535)<<16>>>0)|0}),"function"!=typeof Object.assign&&(Object.assign=function(t){if(null===t)throw new TypeError("Cannot convert undefined or null to object");for(var e=Object(t),n=1;n<arguments.length;n++){var r=arguments[n];if(null!==r)for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o]);}return e});},function(t,e){t.exports=function(t){if(Array.isArray(t))return t},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){t.exports=function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,i=[],a=!0,u=!1;try{for(n=n.call(t);!(a=(r=n.next()).done)&&(i.push(r.value),!e||i.length!==e);a=!0);}catch(t){u=!0,o=t;}finally{try{a||null==n.return||n.return();}finally{if(u)throw o}}return i}},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){t.exports=function(t){var e=new Float32Array(2);return e[0]=t[0],e[1]=t[1],e};},function(t,e){t.exports=function(t,e){var n=new Float32Array(2);return n[0]=t,n[1]=e,n};},function(t,e){t.exports=function(t,e){return t[0]=e[0],t[1]=e[1],t};},function(t,e){t.exports=function(t,e,n){return t[0]=e,t[1]=n,t};},function(t,e,n){t.exports=function(t,e){var n=t[0],o=t[1],i=e[0],a=e[1];return Math.abs(n-i)<=r*Math.max(1,Math.abs(n),Math.abs(i))&&Math.abs(o-a)<=r*Math.max(1,Math.abs(o),Math.abs(a))};var r=n(62);},function(t,e){t.exports=function(t,e){return t[0]===e[0]&&t[1]===e[1]};},function(t,e){t.exports=function(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t};},function(t,e,n){t.exports=n(64);},function(t,e,n){t.exports=n(65);},function(t,e,n){t.exports=n(66);},function(t,e){t.exports=function(t,e){return t[0]=1/e[0],t[1]=1/e[1],t};},function(t,e){t.exports=function(t,e,n){return t[0]=Math.min(e[0],n[0]),t[1]=Math.min(e[1],n[1]),t};},function(t,e){t.exports=function(t,e,n){return t[0]=Math.max(e[0],n[0]),t[1]=Math.max(e[1],n[1]),t};},function(t,e){t.exports=function(t,e,n){var r=Math.cos(n),o=Math.sin(n),i=e[0],a=e[1];return t[0]=i*r-a*o,t[1]=i*o+a*r,t};},function(t,e){t.exports=function(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t};},function(t,e){t.exports=function(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t};},function(t,e){t.exports=function(t,e){return t[0]=Math.round(e[0]),t[1]=Math.round(e[1]),t};},function(t,e){t.exports=function(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t};},function(t,e){t.exports=function(t,e,n,r){return t[0]=e[0]+n[0]*r,t[1]=e[1]+n[1]*r,t};},function(t,e,n){t.exports=n(67);},function(t,e,n){t.exports=n(68);},function(t,e,n){t.exports=n(69);},function(t,e,n){t.exports=n(70);},function(t,e){t.exports=function(t,e){return t[0]=-e[0],t[1]=-e[1],t};},function(t,e){t.exports=function(t,e){var n=e[0],r=e[1],o=n*n+r*r;o>0&&(o=1/Math.sqrt(o),t[0]=e[0]*o,t[1]=e[1]*o);return t};},function(t,e){t.exports=function(t,e){return t[0]*e[0]+t[1]*e[1]};},function(t,e){t.exports=function(t,e,n){var r=e[0]*n[1]-e[1]*n[0];return t[0]=t[1]=0,t[2]=r,t};},function(t,e){t.exports=function(t,e,n,r){var o=e[0],i=e[1];return t[0]=o+r*(n[0]-o),t[1]=i+r*(n[1]-i),t};},function(t,e){t.exports=function(t,e){e=e||1;var n=2*Math.random()*Math.PI;return t[0]=Math.cos(n)*e,t[1]=Math.sin(n)*e,t};},function(t,e){t.exports=function(t,e,n){var r=e[0],o=e[1];return t[0]=n[0]*r+n[2]*o,t[1]=n[1]*r+n[3]*o,t};},function(t,e){t.exports=function(t,e,n){var r=e[0],o=e[1];return t[0]=n[0]*r+n[2]*o+n[4],t[1]=n[1]*r+n[3]*o+n[5],t};},function(t,e){t.exports=function(t,e,n){var r=e[0],o=e[1];return t[0]=n[0]*r+n[3]*o+n[6],t[1]=n[1]*r+n[4]*o+n[7],t};},function(t,e){t.exports=function(t,e,n){var r=e[0],o=e[1];return t[0]=n[0]*r+n[4]*o+n[12],t[1]=n[1]*r+n[5]*o+n[13],t};},function(t,e,n){t.exports=function(t,e,n,o,i,a){var u,c;e||(e=2);n||(n=0);c=o?Math.min(o*e+n,t.length):t.length;for(u=n;u<c;u+=e)r[0]=t[u],r[1]=t[u+1],i(r,r,a),t[u]=r[0],t[u+1]=r[1];return t};var r=n(63)();},function(t,e){t.exports=function(t,e,n){var r=e[0]*e[0]+e[1]*e[1];if(r>n*n){var o=Math.sqrt(r);t[0]=e[0]/o*n,t[1]=e[1]/o*n;}else t[0]=e[0],t[1]=e[1];return t};},function(t,e){t.exports=function(t){var e=new Float32Array(3);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e};},function(t,e,n){t.exports=function(t,e){var n=r(t[0],t[1],t[2]),a=r(e[0],e[1],e[2]);o(n,n),o(a,a);var u=i(n,a);return u>1?0:Math.acos(u)};var r=n(73),o=n(74),i=n(75);},function(t,e){t.exports=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t};},function(t,e){t.exports=function(t,e,n,r){return t[0]=e,t[1]=n,t[2]=r,t};},function(t,e,n){t.exports=function(t,e){var n=t[0],o=t[1],i=t[2],a=e[0],u=e[1],c=e[2];return Math.abs(n-a)<=r*Math.max(1,Math.abs(n),Math.abs(a))&&Math.abs(o-u)<=r*Math.max(1,Math.abs(o),Math.abs(u))&&Math.abs(i-c)<=r*Math.max(1,Math.abs(i),Math.abs(c))};var r=n(71);},function(t,e){t.exports=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]};},function(t,e){t.exports=function(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t};},function(t,e,n){t.exports=n(76);},function(t,e,n){t.exports=n(77);},function(t,e,n){t.exports=n(78);},function(t,e){t.exports=function(t,e,n){return t[0]=Math.min(e[0],n[0]),t[1]=Math.min(e[1],n[1]),t[2]=Math.min(e[2],n[2]),t};},function(t,e){t.exports=function(t,e,n){return t[0]=Math.max(e[0],n[0]),t[1]=Math.max(e[1],n[1]),t[2]=Math.max(e[2],n[2]),t};},function(t,e){t.exports=function(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t[2]=Math.floor(e[2]),t};},function(t,e){t.exports=function(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t[2]=Math.ceil(e[2]),t};},function(t,e){t.exports=function(t,e){return t[0]=Math.round(e[0]),t[1]=Math.round(e[1]),t[2]=Math.round(e[2]),t};},function(t,e){t.exports=function(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t};},function(t,e){t.exports=function(t,e,n,r){return t[0]=e[0]+n[0]*r,t[1]=e[1]+n[1]*r,t[2]=e[2]+n[2]*r,t};},function(t,e,n){t.exports=n(79);},function(t,e,n){t.exports=n(80);},function(t,e,n){t.exports=n(81);},function(t,e,n){t.exports=n(82);},function(t,e){t.exports=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t};},function(t,e){t.exports=function(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t};},function(t,e){t.exports=function(t,e,n){var r=e[0],o=e[1],i=e[2],a=n[0],u=n[1],c=n[2];return t[0]=o*c-i*u,t[1]=i*a-r*c,t[2]=r*u-o*a,t};},function(t,e){t.exports=function(t,e,n,r){var o=e[0],i=e[1],a=e[2];return t[0]=o+r*(n[0]-o),t[1]=i+r*(n[1]-i),t[2]=a+r*(n[2]-a),t};},function(t,e){t.exports=function(t,e){e=e||1;var n=2*Math.random()*Math.PI,r=2*Math.random()-1,o=Math.sqrt(1-r*r)*e;return t[0]=Math.cos(n)*o,t[1]=Math.sin(n)*o,t[2]=r*e,t};},function(t,e){t.exports=function(t,e,n){var r=e[0],o=e[1],i=e[2],a=n[3]*r+n[7]*o+n[11]*i+n[15];return a=a||1,t[0]=(n[0]*r+n[4]*o+n[8]*i+n[12])/a,t[1]=(n[1]*r+n[5]*o+n[9]*i+n[13])/a,t[2]=(n[2]*r+n[6]*o+n[10]*i+n[14])/a,t};},function(t,e){t.exports=function(t,e,n){var r=e[0],o=e[1],i=e[2];return t[0]=r*n[0]+o*n[3]+i*n[6],t[1]=r*n[1]+o*n[4]+i*n[7],t[2]=r*n[2]+o*n[5]+i*n[8],t};},function(t,e){t.exports=function(t,e,n){var r=e[0],o=e[1],i=e[2],a=n[0],u=n[1],c=n[2],s=n[3],f=s*r+u*i-c*o,l=s*o+c*r-a*i,h=s*i+a*o-u*r,d=-a*r-u*o-c*i;return t[0]=f*s+d*-a+l*-c-h*-u,t[1]=l*s+d*-u+h*-a-f*-c,t[2]=h*s+d*-c+f*-u-l*-a,t};},function(t,e){t.exports=function(t,e,n,r){var o=n[1],i=n[2],a=e[1]-o,u=e[2]-i,c=Math.sin(r),s=Math.cos(r);return t[0]=e[0],t[1]=o+a*s-u*c,t[2]=i+a*c+u*s,t};},function(t,e){t.exports=function(t,e,n,r){var o=n[0],i=n[2],a=e[0]-o,u=e[2]-i,c=Math.sin(r),s=Math.cos(r);return t[0]=o+u*c+a*s,t[1]=e[1],t[2]=i+u*s-a*c,t};},function(t,e){t.exports=function(t,e,n,r){var o=n[0],i=n[1],a=e[0]-o,u=e[1]-i,c=Math.sin(r),s=Math.cos(r);return t[0]=o+a*s-u*c,t[1]=i+a*c+u*s,t[2]=e[2],t};},function(t,e,n){t.exports=function(t,e,n,o,i,a){var u,c;e||(e=3);n||(n=0);c=o?Math.min(o*e+n,t.length):t.length;for(u=n;u<c;u+=e)r[0]=t[u],r[1]=t[u+1],r[2]=t[u+2],i(r,r,a),t[u]=r[0],t[u+1]=r[1],t[u+2]=r[2];return t};var r=n(72)();},function(t,e,n){var r=n(61);t.exports=function(t){if(Array.isArray(t))return r(t)},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){t.exports=function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e,n){var r=n(2);t.exports=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=r(t)););return t},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e,n){var r=function(t){var e=Object.prototype,n=e.hasOwnProperty,r="function"==typeof Symbol?Symbol:{},o=r.iterator||"@@iterator",i=r.asyncIterator||"@@asyncIterator",a=r.toStringTag||"@@toStringTag";function u(t,e,n,r){var o=e&&e.prototype instanceof f?e:f,i=Object.create(o.prototype),a=new w(r||[]);return i._invoke=function(t,e,n){var r="suspendedStart";return function(o,i){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw i;return R()}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var u=_(a,n);if(u){if(u===s)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg);}else "return"===n.method&&n.abrupt("return",n.arg);r="executing";var f=c(t,e,n);if("normal"===f.type){if(r=n.done?"completed":"suspendedYield",f.arg===s)continue;return {value:f.arg,done:n.done}}"throw"===f.type&&(r="completed",n.method="throw",n.arg=f.arg);}}}(t,n,a),i}function c(t,e,n){try{return {type:"normal",arg:t.call(e,n)}}catch(t){return {type:"throw",arg:t}}}t.wrap=u;var s={};function f(){}function l(){}function h(){}var d={};d[o]=function(){return this};var p=Object.getPrototypeOf,v=p&&p(p(O([])));v&&v!==e&&n.call(v,o)&&(d=v);var y=h.prototype=f.prototype=Object.create(d);function g(t){["next","throw","return"].forEach((function(e){t[e]=function(t){return this._invoke(e,t)};}));}function x(t,e){var r;this._invoke=function(o,i){function a(){return new e((function(r,a){!function r(o,i,a,u){var s=c(t[o],t,i);if("throw"!==s.type){var f=s.arg,l=f.value;return l&&"object"==typeof l&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,a,u);}),(function(t){r("throw",t,a,u);})):e.resolve(l).then((function(t){f.value=t,a(f);}),(function(t){return r("throw",t,a,u)}))}u(s.arg);}(o,i,r,a);}))}return r=r?r.then(a,a):a()};}function _(t,e){var n=t.iterator[e.method];if(void 0===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,_(t,e),"throw"===e.method))return s;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method");}return s}var r=c(n,t.iterator,e.arg);if("throw"===r.type)return e.method="throw",e.arg=r.arg,e.delegate=null,s;var o=r.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,s):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,s)}function m(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e);}function b(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e;}function w(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(m,this),this.reset(!0);}function O(t){if(t){var e=t[o];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,i=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return i.next=i}}return {next:R}}function R(){return {value:void 0,done:!0}}return l.prototype=y.constructor=h,h.constructor=l,h[a]=l.displayName="GeneratorFunction",t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return !!e&&(e===l||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,h):(t.__proto__=h,a in t||(t[a]="GeneratorFunction")),t.prototype=Object.create(y),t},t.awrap=function(t){return {__await:t}},g(x.prototype),x.prototype[i]=function(){return this},t.AsyncIterator=x,t.async=function(e,n,r,o,i){void 0===i&&(i=Promise);var a=new x(u(e,n,r,o),i);return t.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},g(y),y[a]="Generator",y[o]=function(){return this},y.toString=function(){return "[object Generator]"},t.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},t.values=O,w.prototype={constructor:w,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(b),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0);},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(n,r){return a.type="throw",a.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),c=n.call(i,"finallyLoc");if(u&&c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else {if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,s):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return "break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),s},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),b(n),s}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;b(n);}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:O(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),s}},t}(t.exports);try{regeneratorRuntime=r;}catch(t){Function("r","regeneratorRuntime = r")(r);}},function(t,e,n){var r=n(230),o=n(240);t.exports=function(t,e){return r(t,e,(function(e,n){return o(t,n)}))};},function(t,e,n){var r=n(231),o=n(239),i=n(32);t.exports=function(t,e,n){for(var a=-1,u=e.length,c={};++a<u;){var s=e[a],f=r(t,s);n(f,s)&&o(c,i(s,t),f);}return c};},function(t,e,n){var r=n(32),o=n(43);t.exports=function(t,e){for(var n=0,i=(e=r(e,t)).length;null!=t&&n<i;)t=t[o(e[n++])];return n&&n==i?t:void 0};},function(t,e,n){var r=n(14),o=n(42),i=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,a=/^\w*$/;t.exports=function(t,e){if(r(t))return !1;var n=typeof t;return !("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=t&&!o(t))||(a.test(t)||!i.test(t)||null!=e&&t in Object(e))};},function(t,e,n){var r=n(234),o=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,i=/\\(\\)?/g,a=r((function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(o,(function(t,n,r,o){e.push(r?o.replace(i,"$1"):n||t);})),e}));t.exports=a;},function(t,e,n){var r=n(235);t.exports=function(t){var e=r(t,(function(t){return 500===n.size&&n.clear(),t})),n=e.cache;return e};},function(t,e,n){var r=n(47);function o(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new TypeError("Expected a function");var n=function(){var r=arguments,o=e?e.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var a=t.apply(this,r);return n.cache=i.set(o,a)||i,a};return n.cache=new(o.Cache||r),n}o.Cache=r,t.exports=o;},function(t,e,n){var r=n(237);t.exports=function(t){return null==t?"":r(t)};},function(t,e,n){var r=n(27),o=n(238),i=n(14),a=n(42),u=r?r.prototype:void 0,c=u?u.toString:void 0;t.exports=function t(e){if("string"==typeof e)return e;if(i(e))return o(e,t)+"";if(a(e))return c?c.call(e):"";var n=e+"";return "0"==n&&1/e==-1/0?"-0":n};},function(t,e){t.exports=function(t,e){for(var n=-1,r=null==t?0:t.length,o=Array(r);++n<r;)o[n]=e(t[n],n,t);return o};},function(t,e,n){var r=n(55),o=n(32),i=n(31),a=n(13),u=n(43);t.exports=function(t,e,n,c){if(!a(t))return t;for(var s=-1,f=(e=o(e,t)).length,l=f-1,h=t;null!=h&&++s<f;){var d=u(e[s]),p=n;if("__proto__"===d||"constructor"===d||"prototype"===d)return t;if(s!=l){var v=h[d];void 0===(p=c?c(v,d,h):void 0)&&(p=a(v)?v:i(e[s+1])?[]:{});}r(h,d,p),h=h[d];}return t};},function(t,e,n){var r=n(241),o=n(242);t.exports=function(t,e){return null!=t&&o(t,e,r)};},function(t,e){t.exports=function(t,e){return null!=t&&e in Object(t)};},function(t,e,n){var r=n(32),o=n(30),i=n(14),a=n(31),u=n(40),c=n(43);t.exports=function(t,e,n){for(var s=-1,f=(e=r(e,t)).length,l=!1;++s<f;){var h=c(e[s]);if(!(l=null!=t&&n(t,h)))break;t=t[h];}return l||++s!=f?l:!!(f=null==t?0:t.length)&&u(f)&&a(h,f)&&(i(t)||o(t))};},function(t,e,n){var r=n(244),o=n(58),i=n(59);t.exports=function(t){return i(o(t,void 0,r),t+"")};},function(t,e,n){var r=n(245);t.exports=function(t){return (null==t?0:t.length)?r(t,1):[]};},function(t,e,n){var r=n(246),o=n(247);t.exports=function t(e,n,i,a,u){var c=-1,s=e.length;for(i||(i=o),u||(u=[]);++c<s;){var f=e[c];n>0&&i(f)?n>1?t(f,n-1,i,a,u):r(u,f):a||(u[u.length]=f);}return u};},function(t,e){t.exports=function(t,e){for(var n=-1,r=e.length,o=t.length;++n<r;)t[o+n]=e[n];return t};},function(t,e,n){var r=n(27),o=n(30),i=n(14),a=r?r.isConcatSpreadable:void 0;t.exports=function(t){return i(t)||o(t)||!!(a&&t&&t[a])};},function(t,e){t.exports=function(t){return -1!==Function.toString.call(t).indexOf("[native code]")},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e,n){var r=n(41),o=n(250);function i(e,n,a){return o()?(t.exports=i=Reflect.construct,t.exports.default=t.exports,t.exports.__esModule=!0):(t.exports=i=function(t,e,n){var o=[null];o.push.apply(o,e);var i=new(Function.bind.apply(t,o));return n&&r(i,n.prototype),i},t.exports.default=t.exports,t.exports.__esModule=!0),i.apply(null,arguments)}t.exports=i,t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){t.exports=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}},t.exports.default=t.exports,t.exports.__esModule=!0;},function(t,e){t.exports=function(t){return t[0]*t[3]-t[2]*t[1]};},function(t,e){t.exports=function(t,e){if(t===e){var n=e[1];t[1]=e[2],t[2]=n;}else t[0]=e[0],t[1]=e[2],t[2]=e[1],t[3]=e[3];return t};},function(t,e){t.exports=function(t,e,n){var r=e[0],o=e[1],i=e[2],a=e[3],u=n[0],c=n[1],s=n[2],f=n[3];return t[0]=r*u+i*c,t[1]=o*u+a*c,t[2]=r*s+i*f,t[3]=o*s+a*f,t};},function(t,e){t.exports=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t};},function(t,e){t.exports=function(t,e){var n=e[0];return t[0]=e[3],t[1]=-e[1],t[2]=-e[2],t[3]=n,t};},function(t,e){t.exports=function(t,e,n){var r=e[0],o=e[1],i=e[2],a=e[3],u=Math.sin(n),c=Math.cos(n);return t[0]=r*c+i*u,t[1]=o*c+a*u,t[2]=r*-u+i*c,t[3]=o*-u+a*c,t};},function(t,e){t.exports=function(t,e){var n=e[0],r=e[1],o=e[2],i=e[3],a=n*i-o*r;return a?(a=1/a,t[0]=i*a,t[1]=-r*a,t[2]=-o*a,t[3]=n*a,t):null};},function(t,e){t.exports=function(){var t=new Float32Array(4);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t};},function(t,e){t.exports=function(t,e,n){var r=e[0],o=e[1],i=e[2],a=e[3],u=n[0],c=n[1];return t[0]=r*u,t[1]=o*u,t[2]=i*c,t[3]=a*c,t};},function(t,e){t.exports=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t};},function(t,e){t.exports=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2))};},function(t,e){t.exports=function(t,e,n,r){return t[2]=r[2]/r[0],n[0]=r[0],n[1]=r[1],n[3]=r[3]-t[2]*n[1],[t,e,n]};},function(t,e,n){n.r(e),n.d(e,"BarcodeDecoder",(function(){return Dt})),n.d(e,"Readers",(function(){return r})),n.d(e,"CameraAccess",(function(){return ee})),n.d(e,"ImageDebug",(function(){return d.a})),n.d(e,"ImageWrapper",(function(){return c.a})),n.d(e,"ResultCollector",(function(){return ne}));var r={};n.r(r),n.d(r,"BarcodeReader",(function(){return A})),n.d(r,"TwoOfFiveReader",(function(){return Ot})),n.d(r,"NewCodabarReader",(function(){return rt})),n.d(r,"Code128Reader",(function(){return P})),n.d(r,"Code32Reader",(function(){return kt})),n.d(r,"Code39Reader",(function(){return H})),n.d(r,"Code39VINReader",(function(){return K})),n.d(r,"Code93Reader",(function(){return Mt})),n.d(r,"EAN2Reader",(function(){return st})),n.d(r,"EAN5Reader",(function(){return ht})),n.d(r,"EAN8Reader",(function(){return ut})),n.d(r,"EANReader",(function(){return B})),n.d(r,"I2of5Reader",(function(){return gt})),n.d(r,"UPCEReader",(function(){return vt})),n.d(r,"UPCReader",(function(){return it}));var o=n(19),i=n.n(o),a=n(16),u=n.n(a),c=(n(152),n(10)),s={},f={UP:1,DOWN:-1};s.getBarcodeLine=function(t,e,n){var r,o,i,a,u,c=0|e.x,s=0|e.y,f=0|n.x,l=0|n.y,h=Math.abs(l-s)>Math.abs(f-c),d=[],p=t.data,v=t.size.x,y=255,g=0;function x(t,e){u=p[e*v+t],y=u<y?u:y,g=u>g?u:g,d.push(u);}h&&(i=c,c=s,s=i,i=f,f=l,l=i),c>f&&(i=c,c=f,f=i,i=s,s=l,l=i);var _=f-c,m=Math.abs(l-s);r=_/2|0,o=s;var b=s<l?1:-1;for(a=c;a<f;a++)h?x(o,a):x(a,o),(r-=m)<0&&(o+=b,r+=_);return {line:d,min:y,max:g}},s.toBinaryLine=function(t){var e,n,r,o,i,a,u=t.min,c=t.max,s=t.line,l=u+(c-u)/2,h=[],d=(c-u)/12,p=-d;for(r=s[0]>l?f.UP:f.DOWN,h.push({pos:0,val:s[0]}),i=0;i<s.length-2;i++)r!==(o=(e=s[i+1]-s[i])+(n=s[i+2]-s[i+1])<p&&s[i+1]<1.5*l?f.DOWN:e+n>d&&s[i+1]>.5*l?f.UP:r)&&(h.push({pos:i,val:s[i]}),r=o);for(h.push({pos:s.length,val:s[s.length-1]}),a=h[0].pos;a<h[1].pos;a++)s[a]=s[a]>l?0:1;for(i=1;i<h.length-1;i++)for(d=h[i+1].val>h[i].val?h[i].val+(h[i+1].val-h[i].val)/3*2|0:h[i+1].val+(h[i].val-h[i+1].val)/3|0,a=h[i].pos;a<h[i+1].pos;a++)s[a]=s[a]>d?0:1;return {line:s,threshold:d}},s.debug={printFrequency:function(t,e){var n,r=e.getContext("2d");for(e.width=t.length,e.height=256,r.beginPath(),r.strokeStyle="blue",n=0;n<t.length;n++)r.moveTo(n,255),r.lineTo(n,255-t[n]);r.stroke(),r.closePath();},printPattern:function(t,e){var n,r=e.getContext("2d");for(e.width=t.length,r.fillColor="black",n=0;n<t.length;n++)1===t[n]&&r.fillRect(n,0,1,100);}};var l,h=s,d=n(15),p=n(3),v=n.n(p),y=n(4),g=n.n(y),x=n(1),_=n.n(x),m=n(6),b=n.n(m),w=n(5),O=n.n(w),R=n(2),C=n.n(R),E=n(0),M=n.n(E),S=n(8);!function(t){t[t.Forward=1]="Forward",t[t.Reverse=-1]="Reverse";}(l||(l={}));var A=function(){function t(e,n){return v()(this,t),M()(this,"_row",[]),M()(this,"config",{}),M()(this,"supplements",[]),M()(this,"SINGLE_CODE_ERROR",0),M()(this,"FORMAT","unknown"),M()(this,"CONFIG_KEYS",{}),this._row=[],this.config=e||{},n&&(this.supplements=n),this}return g()(t,[{key:"_nextUnset",value:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=e;n<t.length;n++)if(!t[n])return n;return t.length}},{key:"_matchPattern",value:function(t,e,n){var r,o=0,i=0,a=0,u=0,c=0,s=0;n=n||this.SINGLE_CODE_ERROR||1;for(var f=0;f<t.length;f++)a+=t[f],u+=e[f];if(a<u)return Number.MAX_VALUE;n*=r=a/u;for(var l=0;l<t.length;l++){if(c=t[l],s=e[l]*r,(i=Math.abs(c-s)/s)>n)return Number.MAX_VALUE;o+=i;}return o/u}},{key:"_nextSet",value:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=e;n<t.length;n++)if(t[n])return n;return t.length}},{key:"_correctBars",value:function(t,e,n){for(var r=n.length,o=0;r--;)(o=t[n[r]]*(1-(1-e)/2))>1&&(t[n[r]]=o);}},{key:"decodePattern",value:function(t){this._row=t;var e=this.decode();return null===e?(this._row.reverse(),(e=this.decode())&&(e.direction=l.Reverse,e.start=this._row.length-e.start,e.end=this._row.length-e.end)):e.direction=l.Forward,e&&(e.format=this.FORMAT),e}},{key:"_matchRange",value:function(t,e,n){var r;for(r=t=t<0?0:t;r<e;r++)if(this._row[r]!==n)return !1;return !0}},{key:"_fillCounters",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this._nextUnset(this._row),e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this._row.length,n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r=[],o=0;r[o]=0;for(var i=t;i<e;i++)this._row[i]^(n?1:0)?r[o]++:(r[++o]=1,n=!n);return r}},{key:"_toCounters",value:function(t,e){var n=e.length,r=this._row.length,o=!this._row[t],i=0;S.a.init(e,0);for(var a=t;a<r;a++)if(this._row[a]^(o?1:0))e[i]++;else {if(++i===n)break;e[i]=1,o=!o;}return e}}],[{key:"Exception",get:function(){return {StartNotFoundException:"Start-Info was not found!",CodeNotFoundException:"Code could not be found!",PatternNotFoundException:"Pattern could not be found!"}}}]),t}();function k(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var P=function(t){b()(n,t);var e=k(n);function n(){var t;v()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),M()(_()(t),"CODE_SHIFT",98),M()(_()(t),"CODE_C",99),M()(_()(t),"CODE_B",100),M()(_()(t),"CODE_A",101),M()(_()(t),"START_CODE_A",103),M()(_()(t),"START_CODE_B",104),M()(_()(t),"START_CODE_C",105),M()(_()(t),"STOP_CODE",106),M()(_()(t),"CODE_PATTERN",[[2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],[1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],[2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],[1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],[2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],[3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],[2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],[1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],[2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1],[1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1],[2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3],[3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1],[3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2],[1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4],[1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1],[2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1],[1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2],[1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1],[2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1],[1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1],[1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4],[2,1,1,2,3,2],[2,3,3,1,1,1,2]]),M()(_()(t),"SINGLE_CODE_ERROR",.64),M()(_()(t),"AVG_CODE_ERROR",.3),M()(_()(t),"FORMAT","code_128"),M()(_()(t),"MODULE_INDICES",{bar:[0,2,4],space:[1,3,5]}),t}return g()(n,[{key:"_decodeCode",value:function(t,e){for(var n={error:Number.MAX_VALUE,code:-1,start:t,end:t,correction:{bar:1,space:1}},r=[0,0,0,0,0,0],o=t,i=!this._row[o],a=0,u=o;u<this._row.length;u++)if(this._row[u]^(i?1:0))r[a]++;else {if(a===r.length-1){e&&this._correct(r,e);for(var c=0;c<this.CODE_PATTERN.length;c++){var s=this._matchPattern(r,this.CODE_PATTERN[c]);s<n.error&&(n.code=c,n.error=s);}return n.end=u,-1===n.code||n.error>this.AVG_CODE_ERROR?null:(this.CODE_PATTERN[n.code]&&(n.correction.bar=this.calculateCorrection(this.CODE_PATTERN[n.code],r,this.MODULE_INDICES.bar),n.correction.space=this.calculateCorrection(this.CODE_PATTERN[n.code],r,this.MODULE_INDICES.space)),n)}r[++a]=1,i=!i;}return null}},{key:"_correct",value:function(t,e){this._correctBars(t,e.bar,this.MODULE_INDICES.bar),this._correctBars(t,e.space,this.MODULE_INDICES.space);}},{key:"_findStart",value:function(){for(var t=[0,0,0,0,0,0],e=this._nextSet(this._row),n={error:Number.MAX_VALUE,code:-1,start:0,end:0,correction:{bar:1,space:1}},r=!1,o=0,i=e;i<this._row.length;i++)if(this._row[i]^(r?1:0))t[o]++;else {if(o===t.length-1){for(var a=t.reduce((function(t,e){return t+e}),0),u=this.START_CODE_A;u<=this.START_CODE_C;u++){var c=this._matchPattern(t,this.CODE_PATTERN[u]);c<n.error&&(n.code=u,n.error=c);}if(n.error<this.AVG_CODE_ERROR)return n.start=i-a,n.end=i,n.correction.bar=this.calculateCorrection(this.CODE_PATTERN[n.code],t,this.MODULE_INDICES.bar),n.correction.space=this.calculateCorrection(this.CODE_PATTERN[n.code],t,this.MODULE_INDICES.space),n;for(var s=0;s<4;s++)t[s]=t[s+2];t[4]=0,t[5]=0,o--;}else o++;t[o]=1,r=!r;}return null}},{key:"decode",value:function(t,e){var n=this,r=this._findStart();if(null===r)return null;var o={code:r.code,start:r.start,end:r.end,correction:{bar:r.correction.bar,space:r.correction.space}},i=[];i.push(o);for(var a=o.code,u=function(t){switch(t){case n.START_CODE_A:return n.CODE_A;case n.START_CODE_B:return n.CODE_B;case n.START_CODE_C:return n.CODE_C;default:return null}}(o.code),c=!1,s=!1,f=s,l=!0,h=0,d=[],p=[];!c;){if(f=s,s=!1,null!==(o=this._decodeCode(o.end,o.correction)))switch(o.code!==this.STOP_CODE&&(l=!0),o.code!==this.STOP_CODE&&(d.push(o.code),a+=++h*o.code),i.push(o),u){case this.CODE_A:if(o.code<64)p.push(String.fromCharCode(32+o.code));else if(o.code<96)p.push(String.fromCharCode(o.code-64));else switch(o.code!==this.STOP_CODE&&(l=!1),o.code){case this.CODE_SHIFT:s=!0,u=this.CODE_B;break;case this.CODE_B:u=this.CODE_B;break;case this.CODE_C:u=this.CODE_C;break;case this.STOP_CODE:c=!0;}break;case this.CODE_B:if(o.code<96)p.push(String.fromCharCode(32+o.code));else switch(o.code!==this.STOP_CODE&&(l=!1),o.code){case this.CODE_SHIFT:s=!0,u=this.CODE_A;break;case this.CODE_A:u=this.CODE_A;break;case this.CODE_C:u=this.CODE_C;break;case this.STOP_CODE:c=!0;}break;case this.CODE_C:if(o.code<100)p.push(o.code<10?"0"+o.code:o.code);else switch(o.code!==this.STOP_CODE&&(l=!1),o.code){case this.CODE_A:u=this.CODE_A;break;case this.CODE_B:u=this.CODE_B;break;case this.STOP_CODE:c=!0;}}else c=!0;f&&(u=u===this.CODE_A?this.CODE_B:this.CODE_A);}return null===o?null:(o.end=this._nextUnset(this._row,o.end),this._verifyTrailingWhitespace(o)?(a-=h*d[d.length-1])%103!==d[d.length-1]?null:p.length?(l&&p.splice(p.length-1,1),{code:p.join(""),start:r.start,end:o.end,codeset:u,startInfo:r,decodedCodes:i,endInfo:o,format:this.FORMAT}):null:null)}},{key:"_verifyTrailingWhitespace",value:function(t){var e;return (e=t.end+(t.end-t.start)/2)<this._row.length&&this._matchRange(t.end,e,0)?t:null}},{key:"calculateCorrection",value:function(t,e,n){for(var r=n.length,o=0,i=0;r--;)i+=t[n[r]],o+=e[n[r]];return i/o}}]),n}(A);function D(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r);}return n}function T(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?D(Object(n),!0).forEach((function(e){M()(t,e,n[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):D(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e));}));}return t}function j(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var I=[1,1,1],z=[1,1,1,1,1],U=[1,1,2],L=[[3,2,1,1],[2,2,2,1],[2,1,2,2],[1,4,1,1],[1,1,3,2],[1,2,3,1],[1,1,1,4],[1,3,1,2],[1,2,1,3],[3,1,1,2],[1,1,2,3],[1,2,2,2],[2,2,1,2],[1,1,4,1],[2,3,1,1],[1,3,2,1],[4,1,1,1],[2,1,3,1],[3,1,2,1],[2,1,1,3]],N=[0,11,13,14,19,25,28,21,22,26],B=function(t){b()(n,t);var e=j(n);function n(t,r){var o;return v()(this,n),o=e.call(this,u()({supplements:[]},t),r),M()(_()(o),"FORMAT","ean_13"),M()(_()(o),"SINGLE_CODE_ERROR",.7),M()(_()(o),"STOP_PATTERN",[1,1,1]),o}return g()(n,[{key:"_findPattern",value:function(t,e,n,r){var o=new Array(t.length).fill(0),i={error:Number.MAX_VALUE,start:0,end:0},a=0;e||(e=this._nextSet(this._row));for(var u=!1,c=e;c<this._row.length;c++)if(this._row[c]^(n?1:0))o[a]+=1;else {if(a===o.length-1){var s=this._matchPattern(o,t);if(s<.48&&i.error&&s<i.error)return u=!0,i.error=s,i.start=c-o.reduce((function(t,e){return t+e}),0),i.end=c,i;if(r){for(var f=0;f<o.length-2;f++)o[f]=o[f+2];o[o.length-2]=0,o[o.length-1]=0,a--;}}else a++;o[a]=1,n=!n;}return u?i:null}},{key:"_decodeCode",value:function(t,e){var n=[0,0,0,0],r=t,o={error:Number.MAX_VALUE,code:-1,start:t,end:t},i=!this._row[r],a=0;e||(e=L.length);for(var u=r;u<this._row.length;u++)if(this._row[u]^(i?1:0))n[a]++;else {if(a===n.length-1){for(var c=0;c<e;c++){var s=this._matchPattern(n,L[c]);o.end=u,s<o.error&&(o.code=c,o.error=s);}return o.error>.48?null:o}n[++a]=1,i=!i;}return null}},{key:"_findStart",value:function(){for(var t=this._nextSet(this._row),e=null;!e;){if(!(e=this._findPattern(I,t,!1,!0)))return null;var n=e.start-(e.end-e.start);if(n>=0&&this._matchRange(n,e.start,0))return e;t=e.end,e=null;}return null}},{key:"_calculateFirstDigit",value:function(t){for(var e=0;e<N.length;e++)if(t===N[e])return e;return null}},{key:"_decodePayload",value:function(t,e,n){for(var r=T({},t),o=0,i=0;i<6;i++){if(!(r=this._decodeCode(r.end)))return null;r.code>=10?(r.code-=10,o|=1<<5-i):o|=0<<5-i,e.push(r.code),n.push(r);}var a=this._calculateFirstDigit(o);if(null===a)return null;e.unshift(a);var u=this._findPattern(z,r.end,!0,!1);if(null===u||!u.end)return null;n.push(u);for(var c=0;c<6;c++){if(!(u=this._decodeCode(u.end,10)))return null;n.push(u),e.push(u.code);}return u}},{key:"_verifyTrailingWhitespace",value:function(t){var e=t.end+(t.end-t.start);return e<this._row.length&&this._matchRange(t.end,e,0)?t:null}},{key:"_findEnd",value:function(t,e){var n=this._findPattern(this.STOP_PATTERN,t,e,!1);return null!==n?this._verifyTrailingWhitespace(n):null}},{key:"_checksum",value:function(t){for(var e=0,n=t.length-2;n>=0;n-=2)e+=t[n];e*=3;for(var r=t.length-1;r>=0;r-=2)e+=t[r];return e%10==0}},{key:"_decodeExtensions",value:function(t){var e=this._nextSet(this._row,t),n=this._findPattern(U,e,!1,!1);if(null===n)return null;for(var r=0;r<this.supplements.length;r++)try{var o=this.supplements[r].decode(this._row,n.end);if(null!==o)return {code:o.code,start:e,startInfo:n,end:o.end,decodedCodes:o.decodedCodes,format:this.supplements[r].FORMAT}}catch(t){console.error("* decodeExtensions error in ",this.supplements[r],": ",t);}return null}},{key:"decode",value:function(t,e){var n=new Array,r=new Array,o={},i=this._findStart();if(!i)return null;var a={start:i.start,end:i.end};if(r.push(a),!(a=this._decodePayload(a,n,r)))return null;if(!(a=this._findEnd(a.end,!1)))return null;if(r.push(a),!this._checksum(n))return null;if(this.supplements.length>0){var u=this._decodeExtensions(a.end);if(!u)return null;if(!u.decodedCodes)return null;var c=u.decodedCodes[u.decodedCodes.length-1],s={start:c.start+((c.end-c.start)/2|0),end:c.end};if(!this._verifyTrailingWhitespace(s))return null;o={supplement:u,code:n.join("")+u.code};}return T(T({code:n.join(""),start:i.start,end:a.end,startInfo:i,decodedCodes:r},o),{},{format:this.FORMAT})}}]),n}(A),W=n(33),F=n.n(W);function V(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var q=new Uint16Array(F()("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%").map((function(t){return t.charCodeAt(0)}))),G=new Uint16Array([52,289,97,352,49,304,112,37,292,100,265,73,328,25,280,88,13,268,76,28,259,67,322,19,274,82,7,262,70,22,385,193,448,145,400,208,133,388,196,148,168,162,138,42]),H=function(t){b()(n,t);var e=V(n);function n(){var t;v()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),M()(_()(t),"FORMAT","code_39"),t}return g()(n,[{key:"_findStart",value:function(){for(var t=this._nextSet(this._row),e=t,n=new Uint16Array([0,0,0,0,0,0,0,0,0]),r=0,o=!1,i=t;i<this._row.length;i++)if(this._row[i]^(o?1:0))n[r]++;else {if(r===n.length-1){if(148===this._toPattern(n)){var a=Math.floor(Math.max(0,e-(i-e)/4));if(this._matchRange(a,e,0))return {start:e,end:i}}e+=n[0]+n[1];for(var u=0;u<7;u++)n[u]=n[u+2];n[7]=0,n[8]=0,r--;}else r++;n[r]=1,o=!o;}return null}},{key:"_toPattern",value:function(t){for(var e=t.length,n=0,r=e,o=0;r>3;){n=this._findNextWidth(t,n),r=0;for(var i=0,a=0;a<e;a++)t[a]>n&&(i|=1<<e-1-a,r++,o+=t[a]);if(3===r){for(var u=0;u<e&&r>0;u++)if(t[u]>n&&(r--,2*t[u]>=o))return -1;return i}}return -1}},{key:"_findNextWidth",value:function(t,e){for(var n=Number.MAX_VALUE,r=0;r<t.length;r++)t[r]<n&&t[r]>e&&(n=t[r]);return n}},{key:"_patternToChar",value:function(t){for(var e=0;e<G.length;e++)if(G[e]===t)return String.fromCharCode(q[e]);return null}},{key:"_verifyTrailingWhitespace",value:function(t,e,n){var r=S.a.sum(n);return 3*(e-t-r)>=r}},{key:"decode",value:function(t,e){var n=new Uint16Array([0,0,0,0,0,0,0,0,0]),r=[];if(!(e=this._findStart()))return null;var o,i,a=this._nextSet(this._row,e.end);do{n=this._toCounters(a,n);var u=this._toPattern(n);if(u<0)return null;if(null===(o=this._patternToChar(u)))return null;r.push(o),i=a,a+=S.a.sum(n),a=this._nextSet(this._row,a);}while("*"!==o);return r.pop(),r.length&&this._verifyTrailingWhitespace(i,a,n)?{code:r.join(""),start:e.start,end:a,startInfo:e,decodedCodes:r,format:this.FORMAT}:null}}]),n}(A),X=n(12),Q=n.n(X);function Y(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var $=/[IOQ]/g,Z=/[A-Z0-9]{17}/,K=function(t){b()(n,t);var e=Y(n);function n(){var t;v()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),M()(_()(t),"FORMAT","code_39_vin"),t}return g()(n,[{key:"_checkChecksum",value:function(t){return !!t}},{key:"decode",value:function(t,e){var r=Q()(C()(n.prototype),"decode",this).call(this,t,e);if(!r)return null;var o=r.code;return o&&(o=o.replace($,"")).match(Z)&&this._checkChecksum(o)?(r.code=o,r):null}}]),n}(H);function J(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var tt=[48,49,50,51,52,53,54,55,56,57,45,36,58,47,46,43,65,66,67,68],et=[3,6,9,96,18,66,33,36,48,72,12,24,69,81,84,21,26,41,11,14],nt=[26,41,11,14],rt=function(t){b()(n,t);var e=J(n);function n(){var t;v()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),M()(_()(t),"_counters",[]),M()(_()(t),"FORMAT","codabar"),t}return g()(n,[{key:"_computeAlternatingThreshold",value:function(t,e){for(var n=Number.MAX_VALUE,r=0,o=0,i=t;i<e;i+=2)(o=this._counters[i])>r&&(r=o),o<n&&(n=o);return (n+r)/2|0}},{key:"_toPattern",value:function(t){var e=t+7;if(e>this._counters.length)return -1;for(var n=this._computeAlternatingThreshold(t,e),r=this._computeAlternatingThreshold(t+1,e),o=64,i=0,a=0,u=0;u<7;u++)i=0==(1&u)?n:r,this._counters[t+u]>i&&(a|=o),o>>=1;return a}},{key:"_isStartEnd",value:function(t){for(var e=0;e<nt.length;e++)if(nt[e]===t)return !0;return !1}},{key:"_sumCounters",value:function(t,e){for(var n=0,r=t;r<e;r++)n+=this._counters[r];return n}},{key:"_findStart",value:function(){for(var t=this._nextUnset(this._row),e=1;e<this._counters.length;e++){var n=this._toPattern(e);if(-1!==n&&this._isStartEnd(n))return {start:t+=this._sumCounters(0,e),end:t+this._sumCounters(e,e+8),startCounter:e,endCounter:e+8}}return null}},{key:"_patternToChar",value:function(t){for(var e=0;e<et.length;e++)if(et[e]===t)return String.fromCharCode(tt[e]);return null}},{key:"_calculatePatternLength",value:function(t){for(var e=0,n=t;n<t+7;n++)e+=this._counters[n];return e}},{key:"_verifyWhitespace",value:function(t,e){return (t-1<=0||this._counters[t-1]>=this._calculatePatternLength(t)/2)&&(e+8>=this._counters.length||this._counters[e+7]>=this._calculatePatternLength(e)/2)}},{key:"_charToPattern",value:function(t){for(var e=t.charCodeAt(0),n=0;n<tt.length;n++)if(tt[n]===e)return et[n];return 0}},{key:"_thresholdResultPattern",value:function(t,e){for(var n,r={space:{narrow:{size:0,counts:0,min:0,max:Number.MAX_VALUE},wide:{size:0,counts:0,min:0,max:Number.MAX_VALUE}},bar:{narrow:{size:0,counts:0,min:0,max:Number.MAX_VALUE},wide:{size:0,counts:0,min:0,max:Number.MAX_VALUE}}},o=e,i=0;i<t.length;i++){n=this._charToPattern(t[i]);for(var a=6;a>=0;a--){var u=2==(1&a)?r.bar:r.space,c=1==(1&n)?u.wide:u.narrow;c.size+=this._counters[o+a],c.counts++,n>>=1;}o+=8;}return ["space","bar"].forEach((function(t){var e=r[t];e.wide.min=Math.floor((e.narrow.size/e.narrow.counts+e.wide.size/e.wide.counts)/2),e.narrow.max=Math.ceil(e.wide.min),e.wide.max=Math.ceil((2*e.wide.size+1.5)/e.wide.counts);})),r}},{key:"_validateResult",value:function(t,e){for(var n,r=this._thresholdResultPattern(t,e),o=e,i=0;i<t.length;i++){n=this._charToPattern(t[i]);for(var a=6;a>=0;a--){var u=0==(1&a)?r.bar:r.space,c=1==(1&n)?u.wide:u.narrow,s=this._counters[o+a];if(s<c.min||s>c.max)return !1;n>>=1;}o+=8;}return !0}},{key:"decode",value:function(t,e){if(this._counters=this._fillCounters(),!(e=this._findStart()))return null;var n,r=e.startCounter,o=[];do{if((n=this._toPattern(r))<0)return null;var i=this._patternToChar(n);if(null===i)return null;if(o.push(i),r+=8,o.length>1&&this._isStartEnd(n))break}while(r<this._counters.length);if(o.length-2<4||!this._isStartEnd(n))return null;if(!this._verifyWhitespace(e.startCounter,r-8))return null;if(!this._validateResult(o,e.startCounter))return null;r=r>this._counters.length?this._counters.length:r;var a=e.start+this._sumCounters(e.startCounter,r-8);return {code:o.join(""),start:e.start,end:a,startInfo:e,decodedCodes:o,format:this.FORMAT}}}]),n}(A);function ot(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var it=function(t){b()(n,t);var e=ot(n);function n(){var t;v()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),M()(_()(t),"FORMAT","upc_a"),t}return g()(n,[{key:"decode",value:function(t,e){var n=B.prototype.decode.call(this);return n&&n.code&&13===n.code.length&&"0"===n.code.charAt(0)?(n.code=n.code.substring(1),n):null}}]),n}(B);function at(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var ut=function(t){b()(n,t);var e=at(n);function n(){var t;v()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),M()(_()(t),"FORMAT","ean_8"),t}return g()(n,[{key:"_decodePayload",value:function(t,e,n){for(var r=t,o=0;o<4;o++){if(!(r=this._decodeCode(r.end,10)))return null;e.push(r.code),n.push(r);}if(null===(r=this._findPattern(z,r.end,!0,!1)))return null;n.push(r);for(var i=0;i<4;i++){if(!(r=this._decodeCode(r.end,10)))return null;n.push(r),e.push(r.code);}return r}}]),n}(B);function ct(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var st=function(t){b()(n,t);var e=ct(n);function n(){var t;v()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),M()(_()(t),"FORMAT","ean_2"),t}return g()(n,[{key:"decode",value:function(t,e){t&&(this._row=t);var n=0,r=e,o=this._row.length,i=[],a=[],u=null;if(void 0===r)return null;for(var c=0;c<2&&r<o;c++){if(!(u=this._decodeCode(r)))return null;a.push(u),i.push(u.code%10),u.code>=10&&(n|=1<<1-c),1!==c&&(r=this._nextSet(this._row,u.end),r=this._nextUnset(this._row,r));}if(2!==i.length||parseInt(i.join(""))%4!==n)return null;var s=this._findStart();return {code:i.join(""),decodedCodes:a,end:u.end,format:this.FORMAT,startInfo:s,start:s.start}}}]),n}(B);function ft(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var lt=[24,20,18,17,12,6,3,10,9,5];var ht=function(t){b()(n,t);var e=ft(n);function n(){var t;v()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),M()(_()(t),"FORMAT","ean_5"),t}return g()(n,[{key:"decode",value:function(t,e){if(void 0===e)return null;t&&(this._row=t);for(var n=0,r=e,o=this._row.length,i=null,a=[],u=[],c=0;c<5&&r<o;c++){if(!(i=this._decodeCode(r)))return null;u.push(i),a.push(i.code%10),i.code>=10&&(n|=1<<4-c),4!==c&&(r=this._nextSet(this._row,i.end),r=this._nextUnset(this._row,r));}if(5!==a.length)return null;if(function(t){for(var e=t.length,n=0,r=e-2;r>=0;r-=2)n+=t[r];n*=3;for(var o=e-1;o>=0;o-=2)n+=t[o];return (n*=3)%10}(a)!==function(t){for(var e=0;e<10;e++)if(t===lt[e])return e;return null}(n))return null;var s=this._findStart();return {code:a.join(""),decodedCodes:u,end:i.end,format:this.FORMAT,startInfo:s,start:s.start}}}]),n}(B);function dt(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r);}return n}function pt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var vt=function(t){b()(n,t);var e=pt(n);function n(){var t;v()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),M()(_()(t),"CODE_FREQUENCY",[[56,52,50,49,44,38,35,42,41,37],[7,11,13,14,19,25,28,21,22,26]]),M()(_()(t),"STOP_PATTERN",[1/6*7,1/6*7,1/6*7,1/6*7,1/6*7,1/6*7]),M()(_()(t),"FORMAT","upc_e"),t}return g()(n,[{key:"_decodePayload",value:function(t,e,n){for(var r=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?dt(Object(n),!0).forEach((function(e){M()(t,e,n[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):dt(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e));}));}return t}({},t),o=0,i=0;i<6;i++){if(!(r=this._decodeCode(r.end)))return null;r.code>=10&&(r.code=r.code-10,o|=1<<5-i),e.push(r.code),n.push(r);}return this._determineParity(o,e)?r:null}},{key:"_determineParity",value:function(t,e){for(var n=0;n<this.CODE_FREQUENCY.length;n++)for(var r=0;r<this.CODE_FREQUENCY[n].length;r++)if(t===this.CODE_FREQUENCY[n][r])return e.unshift(n),e.push(r),!0;return !1}},{key:"_convertToUPCA",value:function(t){var e=[t[0]],n=t[t.length-2];return (e=n<=2?e.concat(t.slice(1,3)).concat([n,0,0,0,0]).concat(t.slice(3,6)):3===n?e.concat(t.slice(1,4)).concat([0,0,0,0,0]).concat(t.slice(4,6)):4===n?e.concat(t.slice(1,5)).concat([0,0,0,0,0,t[5]]):e.concat(t.slice(1,6)).concat([0,0,0,0,n])).push(t[t.length-1]),e}},{key:"_checksum",value:function(t){return Q()(C()(n.prototype),"_checksum",this).call(this,this._convertToUPCA(t))}},{key:"_findEnd",value:function(t,e){return Q()(C()(n.prototype),"_findEnd",this).call(this,t,!0)}},{key:"_verifyTrailingWhitespace",value:function(t){var e=t.end+(t.end-t.start)/2;return e<this._row.length&&this._matchRange(t.end,e,0)?t:null}}]),n}(B);function yt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var gt=function(t){b()(n,t);var e=yt(n);function n(t){var r;return v()(this,n),r=e.call(this,u()({normalizeBarSpaceWidth:!1},t)),M()(_()(r),"barSpaceRatio",[1,1]),M()(_()(r),"SINGLE_CODE_ERROR",.78),M()(_()(r),"AVG_CODE_ERROR",.38),M()(_()(r),"START_PATTERN",[1,1,1,1]),M()(_()(r),"STOP_PATTERN",[1,1,3]),M()(_()(r),"CODE_PATTERN",[[1,1,3,3,1],[3,1,1,1,3],[1,3,1,1,3],[3,3,1,1,1],[1,1,3,1,3],[3,1,3,1,1],[1,3,3,1,1],[1,1,1,3,3],[3,1,1,3,1],[1,3,1,3,1]]),M()(_()(r),"MAX_CORRECTION_FACTOR",5),M()(_()(r),"FORMAT","i2of5"),t.normalizeBarSpaceWidth&&(r.SINGLE_CODE_ERROR=.38,r.AVG_CODE_ERROR=.09),r.config=t,O()(r,_()(r))}return g()(n,[{key:"_matchPattern",value:function(t,e){if(this.config.normalizeBarSpaceWidth){for(var r=[0,0],o=[0,0],i=[0,0],a=this.MAX_CORRECTION_FACTOR,u=1/a,c=0;c<t.length;c++)r[c%2]+=t[c],o[c%2]+=e[c];i[0]=o[0]/r[0],i[1]=o[1]/r[1],i[0]=Math.max(Math.min(i[0],a),u),i[1]=Math.max(Math.min(i[1],a),u),this.barSpaceRatio=i;for(var s=0;s<t.length;s++)t[s]*=this.barSpaceRatio[s%2];}return Q()(C()(n.prototype),"_matchPattern",this).call(this,t,e)}},{key:"_findPattern",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=arguments.length>3&&void 0!==arguments[3]&&arguments[3],o=new Array(t.length).fill(0),i=0,a={error:Number.MAX_VALUE,start:0,end:0},u=this.AVG_CODE_ERROR;n=n||!1,r=r||!1,e||(e=this._nextSet(this._row));for(var c=e;c<this._row.length;c++)if(this._row[c]^(n?1:0))o[i]++;else {if(i===o.length-1){var s=o.reduce((function(t,e){return t+e}),0),f=this._matchPattern(o,t);if(f<u)return a.error=f,a.start=c-s,a.end=c,a;if(!r)return null;for(var l=0;l<o.length-2;l++)o[l]=o[l+2];o[o.length-2]=0,o[o.length-1]=0,i--;}else i++;o[i]=1,n=!n;}return null}},{key:"_findStart",value:function(){for(var t=0,e=this._nextSet(this._row),n=null,r=1;!n;){if(!(n=this._findPattern(this.START_PATTERN,e,!1,!0)))return null;if(r=Math.floor((n.end-n.start)/4),(t=n.start-10*r)>=0&&this._matchRange(t,n.start,0))return n;e=n.end,n=null;}return null}},{key:"_verifyTrailingWhitespace",value:function(t){var e=t.end+(t.end-t.start)/2;return e<this._row.length&&this._matchRange(t.end,e,0)?t:null}},{key:"_findEnd",value:function(){this._row.reverse();var t=this._findPattern(this.STOP_PATTERN);if(this._row.reverse(),null===t)return null;var e=t.start;return t.start=this._row.length-t.end,t.end=this._row.length-e,null!==t?this._verifyTrailingWhitespace(t):null}},{key:"_decodePair",value:function(t){for(var e=[],n=0;n<t.length;n++){var r=this._decodeCode(t[n]);if(!r)return null;e.push(r);}return e}},{key:"_decodeCode",value:function(t){for(var e=this.AVG_CODE_ERROR,n={error:Number.MAX_VALUE,code:-1,start:0,end:0},r=0;r<this.CODE_PATTERN.length;r++){var o=this._matchPattern(t,this.CODE_PATTERN[r]);o<n.error&&(n.code=r,n.error=o);}return n.error<e?n:null}},{key:"_decodePayload",value:function(t,e,n){for(var r=0,o=t.length,i=[[0,0,0,0,0],[0,0,0,0,0]],a=null;r<o;){for(var u=0;u<5;u++)i[0][u]=t[r]*this.barSpaceRatio[0],i[1][u]=t[r+1]*this.barSpaceRatio[1],r+=2;if(!(a=this._decodePair(i)))return null;for(var c=0;c<a.length;c++)e.push(a[c].code+""),n.push(a[c]);}return a}},{key:"_verifyCounterLength",value:function(t){return t.length%10==0}},{key:"decode",value:function(t,e){var n=new Array,r=new Array,o=this._findStart();if(!o)return null;r.push(o);var i=this._findEnd();if(!i)return null;var a=this._fillCounters(o.end,i.start,!1);return this._verifyCounterLength(a)&&this._decodePayload(a,n,r)?n.length%2!=0||n.length<6?null:(r.push(i),{code:n.join(""),start:o.start,end:i.end,startInfo:o,decodedCodes:r,format:this.FORMAT}):null}}]),n}(A);function xt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var _t=[3,1,3,1,1,1],mt=[3,1,1,1,3],bt=[[1,1,3,3,1],[3,1,1,1,3],[1,3,1,1,3],[3,3,1,1,1],[1,1,3,1,3],[3,1,3,1,1],[1,3,3,1,1],[1,1,1,3,3],[3,1,1,3,1],[1,3,1,3,1]],wt=_t.reduce((function(t,e){return t+e}),0),Ot=function(t){b()(n,t);var e=xt(n);function n(){var t;v()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),M()(_()(t),"barSpaceRatio",[1,1]),M()(_()(t),"FORMAT","2of5"),M()(_()(t),"SINGLE_CODE_ERROR",.78),M()(_()(t),"AVG_CODE_ERROR",.3),t}return g()(n,[{key:"_findPattern",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=arguments.length>3&&void 0!==arguments[3]&&arguments[3],o=[],i=0,a={error:Number.MAX_VALUE,code:-1,start:0,end:0},u=0,c=0,s=this.AVG_CODE_ERROR;e||(e=this._nextSet(this._row));for(var f=0;f<t.length;f++)o[f]=0;for(var l=e;l<this._row.length;l++)if(this._row[l]^(n?1:0))o[i]++;else {if(i===o.length-1){u=0;for(var h=0;h<o.length;h++)u+=o[h];if((c=this._matchPattern(o,t))<s)return a.error=c,a.start=l-u,a.end=l,a;if(!r)return null;for(var d=0;d<o.length-2;d++)o[d]=o[d+2];o[o.length-2]=0,o[o.length-1]=0,i--;}else i++;o[i]=1,n=!n;}return null}},{key:"_findStart",value:function(){for(var t=null,e=this._nextSet(this._row),n=1,r=0;!t;){if(!(t=this._findPattern(_t,e,!1,!0)))return null;if(n=Math.floor((t.end-t.start)/wt),(r=t.start-5*n)>=0&&this._matchRange(r,t.start,0))return t;e=t.end,t=null;}return t}},{key:"_verifyTrailingWhitespace",value:function(t){var e=t.end+(t.end-t.start)/2;return e<this._row.length&&this._matchRange(t.end,e,0)?t:null}},{key:"_findEnd",value:function(){this._row.reverse();var t=this._nextSet(this._row),e=this._findPattern(mt,t,!1,!0);if(this._row.reverse(),null===e)return null;var n=e.start;return e.start=this._row.length-e.end,e.end=this._row.length-n,null!==e?this._verifyTrailingWhitespace(e):null}},{key:"_verifyCounterLength",value:function(t){return t.length%10==0}},{key:"_decodeCode",value:function(t){for(var e=this.AVG_CODE_ERROR,n={error:Number.MAX_VALUE,code:-1,start:0,end:0},r=0;r<bt.length;r++){var o=this._matchPattern(t,bt[r]);o<n.error&&(n.code=r,n.error=o);}return n.error<e?n:null}},{key:"_decodePayload",value:function(t,e,n){for(var r=0,o=t.length,i=[0,0,0,0,0],a=null;r<o;){for(var u=0;u<5;u++)i[u]=t[r]*this.barSpaceRatio[0],r+=2;if(!(a=this._decodeCode(i)))return null;e.push("".concat(a.code)),n.push(a);}return a}},{key:"decode",value:function(t,e){var n=this._findStart();if(!n)return null;var r=this._findEnd();if(!r)return null;var o=this._fillCounters(n.end,r.start,!1);if(!this._verifyCounterLength(o))return null;var i=[];i.push(n);var a=[];return this._decodePayload(o,a,i)?a.length<5?null:(i.push(r),{code:a.join(""),start:n.start,end:r.end,startInfo:n,decodedCodes:i,format:this.FORMAT}):null}}]),n}(A);function Rt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var Ct=new Uint16Array(F()("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%abcd*").map((function(t){return t.charCodeAt(0)}))),Et=new Uint16Array([276,328,324,322,296,292,290,336,274,266,424,420,418,404,402,394,360,356,354,308,282,344,332,326,300,278,436,434,428,422,406,410,364,358,310,314,302,468,466,458,366,374,430,294,474,470,306,350]),Mt=function(t){b()(n,t);var e=Rt(n);function n(){var t;v()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),M()(_()(t),"FORMAT","code_93"),t}return g()(n,[{key:"_patternToChar",value:function(t){for(var e=0;e<Et.length;e++)if(Et[e]===t)return String.fromCharCode(Ct[e]);return null}},{key:"_toPattern",value:function(t){for(var e=t.length,n=t.reduce((function(t,e){return t+e}),0),r=0,o=0;o<e;o++){var i=Math.round(9*t[o]/n);if(i<1||i>4)return -1;if(0==(1&o))for(var a=0;a<i;a++)r=r<<1|1;else r<<=i;}return r}},{key:"_findStart",value:function(){for(var t=this._nextSet(this._row),e=t,n=new Uint16Array([0,0,0,0,0,0]),r=0,o=!1,i=t;i<this._row.length;i++)if(this._row[i]^(o?1:0))n[r]++;else {if(r===n.length-1){if(350===this._toPattern(n)){var a=Math.floor(Math.max(0,e-(i-e)/4));if(this._matchRange(a,e,0))return {start:e,end:i}}e+=n[0]+n[1];for(var u=0;u<4;u++)n[u]=n[u+2];n[4]=0,n[5]=0,r--;}else r++;n[r]=1,o=!o;}return null}},{key:"_verifyEnd",value:function(t,e){return !(t===e||!this._row[e])}},{key:"_decodeExtended",value:function(t){for(var e=t.length,n=[],r=0;r<e;r++){var o=t[r];if(o>="a"&&o<="d"){if(r>e-2)return null;var i=t[++r],a=i.charCodeAt(0),u=void 0;switch(o){case"a":if(!(i>="A"&&i<="Z"))return null;u=String.fromCharCode(a-64);break;case"b":if(i>="A"&&i<="E")u=String.fromCharCode(a-38);else if(i>="F"&&i<="J")u=String.fromCharCode(a-11);else if(i>="K"&&i<="O")u=String.fromCharCode(a+16);else if(i>="P"&&i<="S")u=String.fromCharCode(a+43);else {if(!(i>="T"&&i<="Z"))return null;u=String.fromCharCode(127);}break;case"c":if(i>="A"&&i<="O")u=String.fromCharCode(a-32);else {if("Z"!==i)return null;u=":";}break;case"d":if(!(i>="A"&&i<="Z"))return null;u=String.fromCharCode(a+32);break;default:return console.warn("* code_93_reader _decodeExtended hit default case, this may be an error",u),null}n.push(u);}else n.push(o);}return n}},{key:"_matchCheckChar",value:function(t,e,n){var r=t.slice(0,e),o=r.length,i=r.reduce((function(t,e,r){return t+((-1*r+(o-1))%n+1)*Ct.indexOf(e.charCodeAt(0))}),0);return Ct[i%47]===t[e].charCodeAt(0)}},{key:"_verifyChecksums",value:function(t){return this._matchCheckChar(t,t.length-2,20)&&this._matchCheckChar(t,t.length-1,15)}},{key:"decode",value:function(t,e){if(!(e=this._findStart()))return null;var n,r,o=new Uint16Array([0,0,0,0,0,0]),i=[],a=this._nextSet(this._row,e.end);do{o=this._toCounters(a,o);var u=this._toPattern(o);if(u<0)return null;if(null===(r=this._patternToChar(u)))return null;i.push(r),n=a,a+=S.a.sum(o),a=this._nextSet(this._row,a);}while("*"!==r);return i.pop(),i.length&&this._verifyEnd(n,a)&&this._verifyChecksums(i)?(i=i.slice(0,i.length-2),null===(i=this._decodeExtended(i))?null:{code:i.join(""),start:e.start,end:a,startInfo:e,decodedCodes:i,format:this.FORMAT}):null}}]),n}(A);function St(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var At=/[AEIO]/g,kt=function(t){b()(n,t);var e=St(n);function n(){var t;v()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),M()(_()(t),"FORMAT","code_32_reader"),t}return g()(n,[{key:"_decodeCode32",value:function(t){if(/[^0-9BCDFGHJKLMNPQRSTUVWXYZ]/.test(t))return null;for(var e=0,n=0;n<t.length;n++)e=32*e+"0123456789BCDFGHJKLMNPQRSTUVWXYZ".indexOf(t[n]);var r=""+e;return r.length<9&&(r=("000000000"+r).slice(-9)),"A"+r}},{key:"_checkChecksum",value:function(t){return !!t}},{key:"decode",value:function(t,e){var r=Q()(C()(n.prototype),"decode",this).call(this,t,e);if(!r)return null;var o=r.code;if(!o)return null;if(o=o.replace(At,""),!this._checkChecksum(o))return null;var i=this._decodeCode32(o);return i?(r.code=i,r):null}}]),n}(H),Pt={code_128_reader:P,ean_reader:B,ean_5_reader:ht,ean_2_reader:st,ean_8_reader:ut,code_39_reader:H,code_39_vin_reader:K,codabar_reader:rt,upc_reader:it,upc_e_reader:vt,i2of5_reader:gt,"2of5_reader":Ot,code_93_reader:Mt,code_32_reader:kt},Dt={registerReader:function(t,e){Pt[t]=e;},create:function(t,e){var r=[];function o(){t.readers.forEach((function(t){var e,n={},o=[];"object"===i()(t)?(e=t.format,n=t.config):"string"==typeof t&&(e=t),n.supplements&&(o=n.supplements.map((function(t){return new Pt[t]})));try{var a=new Pt[e](n,o);r.push(a);}catch(t){throw console.error("* Error constructing reader ",e,t),t}}));}function a(t){var n,o=null,i=h.getBarcodeLine(e,t[0],t[1]);for(h.toBinaryLine(i),n=0;n<r.length&&null===o;n++)o=r[n].decodePattern(i.line);return null===o?null:{codeResult:o,barcodeLine:i}}function u(t){var r,o;var i=function(t){return Math.sqrt(Math.pow(Math.abs(t[1].y-t[0].y),2)+Math.pow(Math.abs(t[1].x-t[0].x),2))}(r=function(t){return [{x:(t[1][0]-t[0][0])/2+t[0][0],y:(t[1][1]-t[0][1])/2+t[0][1]},{x:(t[3][0]-t[2][0])/2+t[2][0],y:(t[3][1]-t[2][1])/2+t[2][1]}]}(t)),u=Math.atan2(r[1].y-r[0].y,r[1].x-r[0].x);return null===(r=function(t,n,r){function o(e){var r=e*Math.sin(n),o=e*Math.cos(n);t[0].y-=r,t[0].x-=o,t[1].y+=r,t[1].x+=o;}for(o(r);r>1&&(!e.inImageWithBorder(t[0])||!e.inImageWithBorder(t[1]));)o(-(r-=Math.ceil(r/2)));return t}(r,u,Math.floor(.1*i)))?null:(null===(o=a(r))&&(o=function(t,e,n){var r,o,i,u=Math.sqrt(Math.pow(t[1][0]-t[0][0],2)+Math.pow(t[1][1]-t[0][1],2)),c=null,s=Math.sin(n),f=Math.cos(n);for(r=1;r<16&&null===c;r++)i={y:(o=u/16*r*(r%2==0?-1:1))*s,x:o*f},e[0].y+=i.x,e[0].x-=i.y,e[1].y+=i.x,e[1].x-=i.y,c=a(e);return c}(t,r,u)),null===o?null:{codeResult:o.codeResult,line:r,angle:u,pattern:o.barcodeLine.line,threshold:o.barcodeLine.threshold})}return o(),{decodeFromBoundingBox:function(t){return u(t)},decodeFromBoundingBoxes:function(e){var n,r,o=[],i=t.multiple;for(n=0;n<e.length;n++){var a=e[n];if((r=u(a)||{}).box=a,i)o.push(r);else if(r.codeResult)return r}if(i)return {barcodes:o}},decodeFromImage:function(t){return function(t){for(var e=null,n=0;n<r.length&&null===e;n++)e=r[n].decodeImage?r[n].decodeImage(t):null;return e}(t)},registerReader:function(t,e){if(Pt[t])throw new Error("cannot register existing reader",t);Pt[t]=e;},setReaders:function(e){t.readers=e,r.length=0,o();}}}},Tt=function(){var t={};function e(e){return t[e]||(t[e]={subscribers:[]}),t[e]}function n(t,e){t.async?setTimeout((function(){t.callback(e);}),4):t.callback(e);}function r(t,n,r){var o;if("function"==typeof n)o={callback:n,async:r};else if(!(o=n).callback)throw new Error("Callback was not specified on options");e(t).subscribers.push(o);}return {subscribe:function(t,e,n){return r(t,e,n)},publish:function(t,r){var o=e(t),i=o.subscribers;i.filter((function(t){return !!t.once})).forEach((function(t){n(t,r);})),o.subscribers=i.filter((function(t){return !t.once})),o.subscribers.forEach((function(t){n(t,r);}));},once:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];r(t,{callback:e,async:n,once:!0});},unsubscribe:function(n,r){if(n){var o=e(n);o.subscribers=o&&r?o.subscribers.filter((function(t){return t.callback!==r})):[];}else t={};}}}(),jt=n(20),It=n.n(jt),zt=n(11),Ut=n.n(zt),Lt=n(85),Nt=n.n(Lt),Bt=n(86);function Wt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=C()(t);if(e){var o=C()(this).constructor;n=Reflect.construct(r,arguments,o);}else n=r.apply(this,arguments);return O()(this,n)}}var Ft,Vt=function(t){b()(n,t);var e=Wt(n);function n(t,r){var o;return v()(this,n),o=e.call(this,t),M()(_()(o),"code",void 0),o.code=r,Object.setPrototypeOf(_()(o),n.prototype),o}return n}(n.n(Bt)()(Error)),qt="This may mean that the user has declined camera access, or the browser does not support media APIs. If you are running in iOS, you must use Safari.";function Gt(){try{return navigator.mediaDevices.enumerateDevices()}catch(e){var t=new Vt("enumerateDevices is not defined. ".concat(qt),-1);return Promise.reject(t)}}function Ht(t){try{return navigator.mediaDevices.getUserMedia(t)}catch(t){var e=new Vt("getUserMedia is not defined. ".concat(qt),-1);return Promise.reject(e)}}function Xt(t){return new Promise((function(e,n){var r=10;!function o(){r>0?t.videoWidth>10&&t.videoHeight>10?e():window.setTimeout(o,500):n(new Vt("Unable to play video stream. Is webcam working?",-1)),r--;}();}))}function Qt(t,e){return Yt.apply(this,arguments)}function Yt(){return (Yt=It()(Ut.a.mark((function t(e,n){var r;return Ut.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Ht(n);case 2:if(r=t.sent,Ft=r,!e){t.next=11;break}return e.setAttribute("autoplay","true"),e.setAttribute("muted","true"),e.setAttribute("playsinline","true"),e.srcObject=r,e.addEventListener("loadedmetadata",(function(){e.play();})),t.abrupt("return",Xt(e));case 11:return t.abrupt("return",Promise.resolve());case 12:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function $t(t){var e=Nt()(t,["width","height","facingMode","aspectRatio","deviceId"]);return void 0!==t.minAspectRatio&&t.minAspectRatio>0&&(e.aspectRatio=t.minAspectRatio,console.log("WARNING: Constraint 'minAspectRatio' is deprecated; Use 'aspectRatio' instead")),void 0!==t.facing&&(e.facingMode=t.facing,console.log("WARNING: Constraint 'facing' is deprecated. Use 'facingMode' instead'")),e}function Zt(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=$t(t);return e&&e.deviceId&&e.facingMode&&delete e.facingMode,Promise.resolve({audio:!1,video:e})}function Kt(){return (Kt=It()(Ut.a.mark((function t(){var e;return Ut.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Gt();case 2:return e=t.sent,t.abrupt("return",e.filter((function(t){return "videoinput"===t.kind})));case 4:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function Jt(){if(!Ft)return null;var t=Ft.getVideoTracks();return t&&null!=t&&t.length?t[0]:null}var te={requestedVideoElement:null,request:function(t,e){return It()(Ut.a.mark((function n(){var r;return Ut.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return te.requestedVideoElement=t,n.next=3,Zt(e);case 3:return r=n.sent,n.abrupt("return",Qt(t,r));case 5:case"end":return n.stop()}}),n)})))()},release:function(){var t=Ft&&Ft.getVideoTracks();return null!==te.requestedVideoElement&&te.requestedVideoElement.pause(),new Promise((function(e){setTimeout((function(){t&&t.length&&t[0].stop(),Ft=null,te.requestedVideoElement=null,e();}),0);}))},enumerateVideoDevices:function(){return Kt.apply(this,arguments)},getActiveStreamLabel:function(){var t=Jt();return t?t.label:""},getActiveTrack:Jt},ee=te;var ne={create:function(t){var e,n=document.createElement("canvas"),r=n.getContext("2d"),o=[],i=null!==(e=t.capacity)&&void 0!==e?e:20,a=!0===t.capture;function u(e){return !!i&&e&&!function(t,e){return e&&e.some((function(e){return Object.keys(e).every((function(n){return e[n]===t[n]}))}))}(e,t.blacklist)&&function(t,e){return "function"!=typeof e||e(t)}(e,t.filter)}return {addResult:function(t,e,c){var s={};u(c)&&(i--,s.codeResult=c,a&&(n.width=e.x,n.height=e.y,d.a.drawImage(t,e,r),s.frame=n.toDataURL()),o.push(s));},getResults:function(){return o}}}},re={inputStream:{name:"Live",type:"LiveStream",constraints:{width:640,height:480,facingMode:"environment"},area:{top:"0%",right:"0%",left:"0%",bottom:"0%"},singleChannel:!1},locate:!0,numOfWorkers:4,decoder:{readers:["code_128_reader"]},locator:{halfSample:!0,patchSize:"medium"}},oe=n(7),ie=function t(){v()(this,t),M()(this,"config",void 0),M()(this,"inputStream",void 0),M()(this,"framegrabber",void 0),M()(this,"inputImageWrapper",void 0),M()(this,"stopped",!1),M()(this,"boxSize",void 0),M()(this,"resultCollector",void 0),M()(this,"decoder",void 0),M()(this,"workerPool",[]),M()(this,"onUIThread",!0),M()(this,"canvasContainer",new ue);},ae=function t(){v()(this,t),M()(this,"image",void 0),M()(this,"overlay",void 0);},ue=function t(){v()(this,t),M()(this,"ctx",void 0),M()(this,"dom",void 0),this.ctx=new ae,this.dom=new ae;},ce=n(23);function se(t){if("undefined"==typeof document)return null;if(t instanceof HTMLElement&&t.nodeName&&1===t.nodeType)return t;var e="string"==typeof t?t:"#interactive.viewport";return document.querySelector(e)}function fe(t,e){var n=function(t,e){var n=document.querySelector(t);return n||((n=document.createElement("canvas")).className=e),n}(t,e),r=n.getContext("2d");return {canvas:n,context:r}}function le(t){var e,n,r,o,i=se(null==t||null===(e=t.config)||void 0===e||null===(n=e.inputStream)||void 0===n?void 0:n.target),a=null==t||null===(r=t.config)||void 0===r||null===(o=r.inputStream)||void 0===o?void 0:o.type;if(!a)return null;var u=function(t){if("undefined"!=typeof document){var e=fe("canvas.imgBuffer","imgBuffer"),n=fe("canvas.drawingBuffer","drawingBuffer");return e.canvas.width=n.canvas.width=t.x,e.canvas.height=n.canvas.height=t.y,{dom:{image:e.canvas,overlay:n.canvas},ctx:{image:e.context,overlay:n.context}}}return null}(t.inputStream.getCanvasSize());if(!u)return {dom:{image:null,overlay:null},ctx:{image:null,overlay:null}};var c=u.dom;return "undefined"!=typeof document&&i&&("ImageStream"!==a||i.contains(c.image)||i.appendChild(c.image),i.contains(c.overlay)||i.appendChild(c.overlay)),u}var he={274:"orientation"},de=Object.keys(he).map((function(t){return he[t]}));function pe(t){return new Promise((function(e){var n=new FileReader;n.onload=function(t){return e(t.target.result)},n.readAsArrayBuffer(t);}))}function ve(t){return new Promise((function(e,n){var r=new XMLHttpRequest;r.open("GET",t,!0),r.responseType="blob",r.onreadystatechange=function(){r.readyState!==XMLHttpRequest.DONE||200!==r.status&&0!==r.status||e(this.response);},r.onerror=n,r.send();}))}function ye(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:de,n=new DataView(t),r=t.byteLength,o=e.reduce((function(t,e){var n=Object.keys(he).filter((function(t){return he[t]===e}))[0];return n&&(t[n]=e),t}),{}),i=2;if(255!==n.getUint8(0)||216!==n.getUint8(1))return !1;for(;i<r;){if(255!==n.getUint8(i))return !1;if(225===n.getUint8(i+1))return ge(n,i+4,o);i+=2+n.getUint16(i+2);}return !1}function ge(t,e,n){if("Exif"!==function(t,e,n){for(var r="",o=e;o<e+n;o++)r+=String.fromCharCode(t.getUint8(o));return r}(t,e,4))return !1;var r,o=e+6;if(18761===t.getUint16(o))r=!1;else {if(19789!==t.getUint16(o))return !1;r=!0;}if(42!==t.getUint16(o+2,!r))return !1;var i=t.getUint32(o+4,!r);return !(i<8)&&function(t,e,n,r,o){for(var i=t.getUint16(n,!o),a={},u=0;u<i;u++){var c=n+12*u+2,s=r[t.getUint16(c,!o)];s&&(a[s]=xe(t,c,e,n,o));}return a}(t,o,o+i,n,r)}function xe(t,e,n,r,o){var i=t.getUint16(e+2,!o),a=t.getUint32(e+4,!o);switch(i){case 3:if(1===a)return t.getUint16(e+8,!o)}return null}var _e={};function me(t,e){t.onload=function(){e.loaded(this);};}_e.load=function(t,e,n,r,o){var i,a,u,c=new Array(r),s=new Array(c.length);if(!1===o)c[0]=t;else for(i=0;i<c.length;i++)u=n+i,c[i]="".concat(t,"image-").concat("00".concat(u).slice(-3),".jpg");for(s.notLoaded=[],s.addImage=function(t){s.notLoaded.push(t);},s.loaded=function(n){for(var r=s.notLoaded,i=0;i<r.length;i++)if(r[i]===n){r.splice(i,1);for(var a=0;a<c.length;a++){var u=c[a].substr(c[a].lastIndexOf("/"));if(-1!==n.src.lastIndexOf(u)){s[a]={img:n};break}}break}0===r.length&&(!1===o?function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:de;return /^blob:/i.test(t)?ve(t).then(pe).then((function(t){return ye(t,e)})):Promise.resolve(null)}(t,["orientation"]).then((function(t){s[0].tags=t,e(s);})).catch((function(t){console.log(t),e(s);})):e(s));},i=0;i<c.length;i++)a=new Image,s.addImage(a),me(a,s),a.src=c[i];};var be=_e,we={createVideoStream:function(t){var e,n,r=null,o=["canrecord","ended"],i={},a={x:0,y:0,type:"Point"},u={x:0,y:0,type:"XYSize"};var c={getRealWidth:function(){return t.videoWidth},getRealHeight:function(){return t.videoHeight},getWidth:function(){return e},getHeight:function(){return n},setWidth:function(t){e=t;},setHeight:function(t){n=t;},setInputStream:function(t){r=t,this.setAttribute("src",void 0!==t.src?t.src:"");},ended:function(){return t.ended},getConfig:function(){return r},setAttribute:function(e,n){t&&t.setAttribute(e,n);},pause:function(){t.pause();},play:function(){t.play();},setCurrentTime:function(t){var e;"LiveStream"!==(null===(e=r)||void 0===e?void 0:e.type)&&this.setAttribute("currentTime",t.toString());},addEventListener:function(e,n,r){-1!==o.indexOf(e)?(i[e]||(i[e]=[]),i[e].push(n)):t.addEventListener(e,n,r);},clearEventHandlers:function(){o.forEach((function(e){var n=i[e];n&&n.length>0&&n.forEach((function(n){t.removeEventListener(e,n);}));}));},trigger:function(o,a){var s,f,l,h,d,p=i[o];if("canrecord"===o&&(h=t.videoWidth,d=t.videoHeight,e=null!==(f=r)&&void 0!==f&&f.size?h/d>1?r.size:Math.floor(h/d*r.size):h,n=null!==(l=r)&&void 0!==l&&l.size?h/d>1?Math.floor(d/h*r.size):r.size:d,u.x=e,u.y=n),p&&p.length>0)for(s=0;s<p.length;s++)p[s].apply(c,a);},setTopRight:function(t){a.x=t.x,a.y=t.y;},getTopRight:function(){return a},setCanvasSize:function(t){u.x=t.x,u.y=t.y;},getCanvasSize:function(){return u},getFrame:function(){return t}};return c},createLiveStream:function(t){t&&t.setAttribute("autoplay","true");var e=we.createVideoStream(t);return e.ended=function(){return !1},e},createImageStream:function(){var t,e,n=null,r=0,o=0,i=0,a=!0,u=!1,c=null,s=0,f=null,l=!1,h=["canrecord","ended"],d={},p={x:0,y:0,type:"Point"},v={x:0,y:0,type:"XYSize"};function y(t,e){var n,r=d[t];if(r&&r.length>0)for(n=0;n<r.length;n++)r[n].apply(g,e);}var g={trigger:y,getWidth:function(){return t},getHeight:function(){return e},setWidth:function(e){t=e;},setHeight:function(t){e=t;},getRealWidth:function(){return r},getRealHeight:function(){return o},setInputStream:function(a){var l;n=a,!1===a.sequence?(f=a.src,s=1):(f=a.src,s=a.length),u=!1,be.load(f,(function(a){var s,f;if(c=a,a[0].tags&&a[0].tags.orientation)switch(a[0].tags.orientation){case 6:case 8:r=a[0].img.height,o=a[0].img.width;break;default:r=a[0].img.width,o=a[0].img.height;}else r=a[0].img.width,o=a[0].img.height;t=null!==(s=n)&&void 0!==s&&s.size?r/o>1?n.size:Math.floor(r/o*n.size):r,e=null!==(f=n)&&void 0!==f&&f.size?r/o>1?Math.floor(o/r*n.size):n.size:o,v.x=t,v.y=e,u=!0,i=0,setTimeout((function(){y("canrecord",[]);}),0);}),1,s,null===(l=n)||void 0===l?void 0:l.sequence);},ended:function(){return l},setAttribute:function(){},getConfig:function(){return n},pause:function(){a=!0;},play:function(){a=!1;},setCurrentTime:function(t){i=t;},addEventListener:function(t,e){-1!==h.indexOf(t)&&(d[t]||(d[t]=[]),d[t].push(e));},clearEventHandlers:function(){Object.keys(d).forEach((function(t){return delete d[t]}));},setTopRight:function(t){p.x=t.x,p.y=t.y;},getTopRight:function(){return p},setCanvasSize:function(t){v.x=t.x,v.y=t.y;},getCanvasSize:function(){return v},getFrame:function(){var t,e;if(!u)return null;a||(t=null===(e=c)||void 0===e?void 0:e[i],i<s-1?i++:setTimeout((function(){l=!0,y("ended",[]);}),0));return t}};return g}},Oe=we,Re=n(9),Ce=Math.PI/180;var Ee={create:function(t,e){var n,r={},o=t.getConfig(),i=(Object(Re.h)(t.getRealWidth(),t.getRealHeight()),t.getCanvasSize()),a=Object(Re.h)(t.getWidth(),t.getHeight()),u=t.getTopRight(),c=u.x,s=u.y,f=null,l=null;return (n=e||document.createElement("canvas")).width=i.x,n.height=i.y,f=n.getContext("2d"),l=new Uint8Array(a.x*a.y),r.attachData=function(t){l=t;},r.getData=function(){return l},r.grab=function(){var e,r=o.halfSample,u=t.getFrame(),h=u,d=0;if(h){if(function(t,e){t.width!==e.x&&(t.width=e.x),t.height!==e.y&&(t.height=e.y);}(n,i),"ImageStream"===o.type&&(h=u.img,u.tags&&u.tags.orientation))switch(u.tags.orientation){case 6:d=90*Ce;break;case 8:d=-90*Ce;}return 0!==d?(f.translate(i.x/2,i.y/2),f.rotate(d),f.drawImage(h,-i.y/2,-i.x/2,i.y,i.x),f.rotate(-d),f.translate(-i.x/2,-i.y/2)):f.drawImage(h,0,0,i.x,i.y),e=f.getImageData(c,s,a.x,a.y).data,r?Object(Re.e)(e,a,l):Object(Re.c)(e,l,o),!0}return !1},r.getSize=function(){return a},r}},Me=Ee;function Se(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r);}return n}function Ae(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?Se(Object(n),!0).forEach((function(e){M()(t,e,n[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Se(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e));}));}return t}var ke=[];function Pe(t){return Ae(Ae({},t),{},{inputStream:Ae(Ae({},t.inputStream),{},{target:null})})}function De(t){if(t){var e=t().default;if(!e)return void self.postMessage({event:"error",message:"Quagga could not be created"})}var n;function r(t){self.postMessage({event:"processed",imageData:n.data,result:t},[n.data.buffer]);}function o(){self.postMessage({event:"initialized",imageData:n.data},[n.data.buffer]);}self.onmessage=function(t){if("init"===t.data.cmd){var i=t.data.config;i.numOfWorkers=0,n=new e.ImageWrapper({x:t.data.size.x,y:t.data.size.y},new Uint8Array(t.data.imageData)),e.init(i,o,n),e.onProcessed(r);}else "process"===t.data.cmd?(n.data=new Uint8Array(t.data.imageData),e.start()):"setReaders"===t.data.cmd?e.setReaders(t.data.readers):"registerReader"===t.data.cmd&&e.registerReader(t.data.name,t.data.reader);};}function Te(t,e,n){var r,o,i=("undefined"!=typeof __factorySource__&&(o=__factorySource__),r=new Blob(["("+De.toString()+")("+o+");"],{type:"text/javascript"}),window.URL.createObjectURL(r)),a={worker:new Worker(i),imageData:new Uint8Array(e.getWidth()*e.getHeight()),busy:!0};a.worker.onmessage=function(t){"initialized"===t.data.event?(URL.revokeObjectURL(i),a.busy=!1,a.imageData=new Uint8Array(t.data.imageData),n(a)):"processed"===t.data.event?(a.imageData=new Uint8Array(t.data.imageData),a.busy=!1):t.data.event;},a.worker.postMessage({cmd:"init",size:{x:e.getWidth(),y:e.getHeight()},imageData:a.imageData,config:Pe(t)},[a.imageData.buffer]);}function je(t,e,n,r){var o=t-ke.length;if(0===o&&r)r();else if(o<0){ke.slice(o).forEach((function(t){t.worker.terminate();})),ke=ke.slice(0,o),r&&r();}else {var i=function(e){ke.push(e),ke.length>=t&&r&&r();};if(e)for(var a=0;a<o;a++)Te(e,n,i);}}function Ie(t,e,n){for(var r=t.length;r--;)t[r][0]+=e,t[r][1]+=n;}var ze=function(){function t(){var e=this;v()(this,t),M()(this,"context",new ie),M()(this,"canRecord",(function(t){var n;e.context.config&&(ce.a.checkImageConstraints(e.context.inputStream,null===(n=e.context.config)||void 0===n?void 0:n.locator),e.initCanvas(),e.context.framegrabber=Me.create(e.context.inputStream,e.context.canvasContainer.dom.image),void 0===e.context.config.numOfWorkers&&(e.context.config.numOfWorkers=0),je(e.context.config.numOfWorkers,e.context.config,e.context.inputStream,(function(){var n;0===(null===(n=e.context.config)||void 0===n?void 0:n.numOfWorkers)&&e.initializeData(),e.ready(t);})));})),M()(this,"update",(function(){if(e.context.onUIThread){var t,n=(o=e.context.framegrabber,ke.length?!!(i=ke.filter((function(t){return !t.busy}))[0])&&(o.attachData(i.imageData),o.grab()&&(i.busy=!0,i.worker.postMessage({cmd:"process",imageData:i.imageData},[i.imageData.buffer])),!0):null);if(!n)e.context.framegrabber.attachData(null===(t=e.context.inputImageWrapper)||void 0===t?void 0:t.data),e.context.framegrabber.grab()&&(n||e.locateAndDecode());}else {var r;e.context.framegrabber.attachData(null===(r=e.context.inputImageWrapper)||void 0===r?void 0:r.data),e.context.framegrabber.grab(),e.locateAndDecode();}var o,i;}));}var e;return g()(t,[{key:"initBuffers",value:function(t){if(this.context.config){var e=function(t,e,n){var r=e||new c.a({x:t.getWidth(),y:t.getHeight(),type:"XYSize"}),o=[Object(oe.clone)([0,0]),Object(oe.clone)([0,r.size.y]),Object(oe.clone)([r.size.x,r.size.y]),Object(oe.clone)([r.size.x,0])];return ce.a.init(r,n),{inputImageWrapper:r,boxSize:o}}(this.context.inputStream,t,this.context.config.locator),n=e.inputImageWrapper,r=e.boxSize;this.context.inputImageWrapper=n,this.context.boxSize=r;}}},{key:"initializeData",value:function(t){this.context.config&&(this.initBuffers(t),this.context.decoder=Dt.create(this.context.config.decoder,this.context.inputImageWrapper));}},{key:"getViewPort",value:function(){return this.context.config&&this.context.config.inputStream?se(this.context.config.inputStream.target):null}},{key:"ready",value:function(t){this.context.inputStream.play(),t();}},{key:"initCanvas",value:function(){var t=le(this.context);if(t){var e=t.ctx,n=t.dom;this.context.canvasContainer.dom.image=n.image,this.context.canvasContainer.dom.overlay=n.overlay,this.context.canvasContainer.ctx.image=e.image,this.context.canvasContainer.ctx.overlay=e.overlay;}}},{key:"initInputStream",value:function(t){if(this.context.config&&this.context.config.inputStream){var e=this.context.config.inputStream,n=e.type,r=e.constraints,o=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"LiveStream",e=arguments.length>1?arguments[1]:void 0,n=arguments.length>2?arguments[2]:void 0;switch(t){case"VideoStream":var r=document.createElement("video");return {video:r,inputStream:n.createVideoStream(r)};case"ImageStream":return {inputStream:n.createImageStream()};case"LiveStream":var o=null;return e&&((o=e.querySelector("video"))||(o=document.createElement("video"),e.appendChild(o))),{video:o,inputStream:n.createLiveStream(o)};default:return console.error("* setupInputStream invalid type ".concat(t)),{video:null,inputStream:null}}}(n,this.getViewPort(),Oe),i=o.video,a=o.inputStream;"LiveStream"===n&&i&&ee.request(i,r).then((function(){return a.trigger("canrecord")})).catch((function(e){return t(e)})),a.setAttribute("preload","auto"),a.setInputStream(this.context.config.inputStream),a.addEventListener("canrecord",this.canRecord.bind(void 0,t)),this.context.inputStream=a;}}},{key:"getBoundingBoxes",value:function(){var t;return null!==(t=this.context.config)&&void 0!==t&&t.locate?ce.a.locate():[[Object(oe.clone)(this.context.boxSize[0]),Object(oe.clone)(this.context.boxSize[1]),Object(oe.clone)(this.context.boxSize[2]),Object(oe.clone)(this.context.boxSize[3])]]}},{key:"transformResult",value:function(t){var e=this,n=this.context.inputStream.getTopRight(),r=n.x,o=n.y;if((0!==r||0!==o)&&(t.barcodes&&t.barcodes.forEach((function(t){return e.transformResult(t)})),t.line&&2===t.line.length&&function(t,e,n){t[0].x+=e,t[0].y+=n,t[1].x+=e,t[1].y+=n;}(t.line,r,o),t.box&&Ie(t.box,r,o),t.boxes&&t.boxes.length>0))for(var i=0;i<t.boxes.length;i++)Ie(t.boxes[i],r,o);}},{key:"addResult",value:function(t,e){var n=this;e&&this.context.resultCollector&&(t.barcodes?t.barcodes.filter((function(t){return t.codeResult})).forEach((function(t){return n.addResult(t,e)})):t.codeResult&&this.context.resultCollector.addResult(e,this.context.inputStream.getCanvasSize(),t.codeResult));}},{key:"hasCodeResult",value:function(t){return !(!t||!(t.barcodes?t.barcodes.some((function(t){return t.codeResult})):t.codeResult))}},{key:"publishResult",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1?arguments[1]:void 0,n=t;t&&this.context.onUIThread&&(this.transformResult(t),this.addResult(t,e),n=t.barcodes||t),Tt.publish("processed",n),this.hasCodeResult(t)&&Tt.publish("detected",n);}},{key:"locateAndDecode",value:function(){var t=this.getBoundingBoxes();if(t){var e,n=this.context.decoder.decodeFromBoundingBoxes(t)||{};n.boxes=t,this.publishResult(n,null===(e=this.context.inputImageWrapper)||void 0===e?void 0:e.data);}else {var r,o=this.context.decoder.decodeFromImage(this.context.inputImageWrapper);if(o)this.publishResult(o,null===(r=this.context.inputImageWrapper)||void 0===r?void 0:r.data);else this.publishResult();}}},{key:"startContinuousUpdate",value:function(){var t,e=this,n=null,r=1e3/((null===(t=this.context.config)||void 0===t?void 0:t.frequency)||60);this.context.stopped=!1;var o=this.context;!function t(i){n=n||i,o.stopped||(i>=n&&(n+=r,e.update()),window.requestAnimationFrame(t));}(performance.now());}},{key:"start",value:function(){var t,e;this.context.onUIThread&&"LiveStream"===(null===(t=this.context.config)||void 0===t||null===(e=t.inputStream)||void 0===e?void 0:e.type)?this.startContinuousUpdate():this.update();}},{key:"stop",value:(e=It()(Ut.a.mark((function t(){var e;return Ut.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.context.stopped=!0,je(0),null===(e=this.context.config)||void 0===e||!e.inputStream||"LiveStream"!==this.context.config.inputStream.type){t.next=6;break}return t.next=5,ee.release();case 5:this.context.inputStream.clearEventHandlers();case 6:case"end":return t.stop()}}),t,this)}))),function(){return e.apply(this,arguments)})},{key:"setReaders",value:function(t){this.context.decoder&&this.context.decoder.setReaders(t),function(t){ke.forEach((function(e){return e.worker.postMessage({cmd:"setReaders",readers:t})}));}(t);}},{key:"registerReader",value:function(t,e){Dt.registerReader(t,e),this.context.decoder&&this.context.decoder.registerReader(t,e),function(t,e){ke.forEach((function(n){return n.worker.postMessage({cmd:"registerReader",name:t,reader:e})}));}(t,e);}}]),t}(),Ue=new ze,Le=Ue.context,Ne={init:function(t,e,n){var r,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:Ue;return e||(r=new Promise((function(t,n){e=function(e){e?n(e):t();};}))),o.context.config=u()({},re,t),o.context.config.numOfWorkers>0&&(o.context.config.numOfWorkers=0),n?(o.context.onUIThread=!1,o.initializeData(n),e&&e()):o.initInputStream(e),r},start:function(){return Ue.start()},stop:function(){return Ue.stop()},pause:function(){Le.stopped=!0;},onDetected:function(t){t&&("function"==typeof t||"object"===i()(t)&&t.callback)?Tt.subscribe("detected",t):console.trace("* warning: Quagga.onDetected called with invalid callback, ignoring");},offDetected:function(t){Tt.unsubscribe("detected",t);},onProcessed:function(t){t&&("function"==typeof t||"object"===i()(t)&&t.callback)?Tt.subscribe("processed",t):console.trace("* warning: Quagga.onProcessed called with invalid callback, ignoring");},offProcessed:function(t){Tt.unsubscribe("processed",t);},setReaders:function(t){t?Ue.setReaders(t):console.trace("* warning: Quagga.setReaders called with no readers, ignoring");},registerReader:function(t,e){t?e?Ue.registerReader(t,e):console.trace("* warning: Quagga.registerReader called with no reader, ignoring"):console.trace("* warning: Quagga.registerReader called with no name, ignoring");},registerResultCollector:function(t){t&&"function"==typeof t.addResult&&(Le.resultCollector=t);},get canvas(){return Le.canvasContainer},decodeSingle:function(t,e){var n=this,r=new ze;return (t=u()({inputStream:{type:"ImageStream",sequence:!1,size:800,src:t.src},numOfWorkers:1,locator:{halfSample:!1}},t)).numOfWorkers>0&&(t.numOfWorkers=0),t.numOfWorkers>0&&("undefined"==typeof Blob||"undefined"==typeof Worker)&&(console.warn("* no Worker and/or Blob support - forcing numOfWorkers to 0"),t.numOfWorkers=0),new Promise((function(o,i){try{n.init(t,(function(){Tt.once("processed",(function(t){r.stop(),e&&e.call(null,t),o(t);}),!0),r.start();}),null,r);}catch(t){i(t);}}))},get default(){return Ne},Readers:r,CameraAccess:ee,ImageDebug:d.a,ImageWrapper:c.a,ResultCollector:ne};e.default=Ne;}]).default}));
	});

	var Quagga = /*@__PURE__*/getDefaultExportFromCjs(quagga_min);

	class BarcodeService {
	    readBarcode(image) {
	        {
	            return new Promise((resolve, reject) => {
	                try {
	                    const reader = new FileReader();
	                    reader.readAsDataURL(image);
	                    reader.onload = async (data) => {
	                        var _a;
	                        const image = data.target.result.toString();
	                        const result = await Quagga.decodeSingle({
	                            src: image,
	                            numOfWorkers: 0,
	                            inputStream: {
	                                size: 800,
	                                singleChannel: false,
	                            },
	                            locator: {
	                                halfSample: true,
	                                patchSize: 'medium',
	                            },
	                            decoder: {
	                                readers: ['ean_reader'],
	                            },
	                        });
	                        let code = (_a = result.codeResult) === null || _a === void 0 ? void 0 : _a.code;
	                        if (!/^97[89][0-9]{10}$/.test(code)) {
	                            code = null;
	                        }
	                        resolve(code);
	                    };
	                }
	                catch (e) {
	                    reject(e);
	                }
	            });
	        }
	    }
	}

	/* src/PinchZoom.svelte generated by Svelte v3.44.2 */
	const file$5 = "src/PinchZoom.svelte";

	// (26:4) <ModalHeader {toggle}>
	function create_default_slot_4(ctx) {
		let t;

		const block = {
			c: function create() {
				t = text("Barcode Scanning");
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(t);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_4.name,
			type: "slot",
			source: "(26:4) <ModalHeader {toggle}>",
			ctx
		});

		return block;
	}

	// (27:4) <ModalBody>
	function create_default_slot_3$1(ctx) {
		let p0;
		let t1;
		let p1;
		let t3;
		let p2;
		let img;
		let img_src_value;

		const block = {
			c: function create() {
				p0 = element("p");
				p0.textContent = "Use your camera to take a photo of a book's barcode.";
				t1 = space();
				p1 = element("p");
				p1.textContent = "Pinch to zoom in to the barcode and get a sharp photo.";
				t3 = space();
				p2 = element("p");
				img = element("img");
				add_location(p0, file$5, 27, 6, 677);
				add_location(p1, file$5, 28, 6, 743);
				if (!src_url_equal(img.src, img_src_value = "/images/pinch.png")) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "Pinch to zoom");
				attr_dev(img, "class", "svelte-1kpuhp1");
				add_location(img, file$5, 29, 36, 841);
				set_style(p2, "text-align", "center");
				add_location(p2, file$5, 29, 6, 811);
			},
			m: function mount(target, anchor) {
				insert_dev(target, p0, anchor);
				insert_dev(target, t1, anchor);
				insert_dev(target, p1, anchor);
				insert_dev(target, t3, anchor);
				insert_dev(target, p2, anchor);
				append_dev(p2, img);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(p0);
				if (detaching) detach_dev(t1);
				if (detaching) detach_dev(p1);
				if (detaching) detach_dev(t3);
				if (detaching) detach_dev(p2);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_3$1.name,
			type: "slot",
			source: "(27:4) <ModalBody>",
			ctx
		});

		return block;
	}

	// (39:20) <Button color="secondary" class="text-right" on:click={toggle}>
	function create_default_slot_2$1(ctx) {
		let t;

		const block = {
			c: function create() {
				t = text("Close");
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(t);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_2$1.name,
			type: "slot",
			source: "(39:20) <Button color=\\\"secondary\\\" class=\\\"text-right\\\" on:click={toggle}>",
			ctx
		});

		return block;
	}

	// (32:4) <ModalFooter>
	function create_default_slot_1$1(ctx) {
		let div3;
		let div2;
		let div0;
		let label;
		let input;
		let t0;
		let t1;
		let div1;
		let button;
		let current;
		let mounted;
		let dispose;

		button = new Button({
				props: {
					color: "secondary",
					class: "text-right",
					$$slots: { default: [create_default_slot_2$1] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		button.$on("click", /*toggle*/ ctx[3]);

		const block = {
			c: function create() {
				div3 = element("div");
				div2 = element("div");
				div0 = element("div");
				label = element("label");
				input = element("input");
				t0 = text(" Don't show this.");
				t1 = space();
				div1 = element("div");
				create_component(button.$$.fragment);
				attr_dev(input, "type", "checkbox");
				attr_dev(input, "class", "form-check-input");
				add_location(input, file$5, 35, 56, 1094);
				attr_dev(label, "class", "form-check-label p-2");
				add_location(label, file$5, 35, 20, 1058);
				attr_dev(div0, "class", "col form-switch");
				add_location(div0, file$5, 34, 16, 1008);
				attr_dev(div1, "class", "col text-right svelte-1kpuhp1");
				add_location(div1, file$5, 37, 16, 1232);
				attr_dev(div2, "class", "row");
				add_location(div2, file$5, 33, 12, 974);
				attr_dev(div3, "class", "container");
				add_location(div3, file$5, 32, 8, 938);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div3, anchor);
				append_dev(div3, div2);
				append_dev(div2, div0);
				append_dev(div0, label);
				append_dev(label, input);
				input.checked = /*doNotShow*/ ctx[1];
				append_dev(label, t0);
				append_dev(div2, t1);
				append_dev(div2, div1);
				mount_component(button, div1, null);
				current = true;

				if (!mounted) {
					dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[4]);
					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (dirty & /*doNotShow*/ 2) {
					input.checked = /*doNotShow*/ ctx[1];
				}

				const button_changes = {};

				if (dirty & /*$$scope*/ 64) {
					button_changes.$$scope = { dirty, ctx };
				}

				button.$set(button_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(button.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(button.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div3);
				destroy_component(button);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_1$1.name,
			type: "slot",
			source: "(32:4) <ModalFooter>",
			ctx
		});

		return block;
	}

	// (25:0) <Modal isOpen={state.open && !state.doNotShow} {toggle} size="md" on:close={() => dispatch('close')}>
	function create_default_slot$1(ctx) {
		let modalheader;
		let t0;
		let modalbody;
		let t1;
		let modalfooter;
		let current;

		modalheader = new ModalHeader({
				props: {
					toggle: /*toggle*/ ctx[3],
					$$slots: { default: [create_default_slot_4] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		modalbody = new ModalBody({
				props: {
					$$slots: { default: [create_default_slot_3$1] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		modalfooter = new ModalFooter({
				props: {
					$$slots: { default: [create_default_slot_1$1] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(modalheader.$$.fragment);
				t0 = space();
				create_component(modalbody.$$.fragment);
				t1 = space();
				create_component(modalfooter.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(modalheader, target, anchor);
				insert_dev(target, t0, anchor);
				mount_component(modalbody, target, anchor);
				insert_dev(target, t1, anchor);
				mount_component(modalfooter, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const modalheader_changes = {};

				if (dirty & /*$$scope*/ 64) {
					modalheader_changes.$$scope = { dirty, ctx };
				}

				modalheader.$set(modalheader_changes);
				const modalbody_changes = {};

				if (dirty & /*$$scope*/ 64) {
					modalbody_changes.$$scope = { dirty, ctx };
				}

				modalbody.$set(modalbody_changes);
				const modalfooter_changes = {};

				if (dirty & /*$$scope, doNotShow*/ 66) {
					modalfooter_changes.$$scope = { dirty, ctx };
				}

				modalfooter.$set(modalfooter_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(modalheader.$$.fragment, local);
				transition_in(modalbody.$$.fragment, local);
				transition_in(modalfooter.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(modalheader.$$.fragment, local);
				transition_out(modalbody.$$.fragment, local);
				transition_out(modalfooter.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(modalheader, detaching);
				if (detaching) detach_dev(t0);
				destroy_component(modalbody, detaching);
				if (detaching) detach_dev(t1);
				destroy_component(modalfooter, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot$1.name,
			type: "slot",
			source: "(25:0) <Modal isOpen={state.open && !state.doNotShow} {toggle} size=\\\"md\\\" on:close={() => dispatch('close')}>",
			ctx
		});

		return block;
	}

	function create_fragment$5(ctx) {
		let modal;
		let current;

		modal = new Modal({
				props: {
					isOpen: /*state*/ ctx[0].open && !/*state*/ ctx[0].doNotShow,
					toggle: /*toggle*/ ctx[3],
					size: "md",
					$$slots: { default: [create_default_slot$1] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		modal.$on("close", /*close_handler*/ ctx[5]);

		const block = {
			c: function create() {
				create_component(modal.$$.fragment);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				mount_component(modal, target, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				const modal_changes = {};
				if (dirty & /*state*/ 1) modal_changes.isOpen = /*state*/ ctx[0].open && !/*state*/ ctx[0].doNotShow;

				if (dirty & /*$$scope, doNotShow*/ 66) {
					modal_changes.$$scope = { dirty, ctx };
				}

				modal.$set(modal_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(modal.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(modal.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(modal, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$5.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$5($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('PinchZoom', slots, []);
		let { state = { open: false, doNotShow: false } } = $$props;
		let doNotShow = state.doNotShow;
		const dispatch = createEventDispatcher();

		const toggle = () => {
			$$invalidate(0, state.doNotShow = doNotShow, state);
			$$invalidate(0, state.open = !state.open, state);
		};

		const writable_props = ['state'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PinchZoom> was created with unknown prop '${key}'`);
		});

		function input_change_handler() {
			doNotShow = this.checked;
			$$invalidate(1, doNotShow);
		}

		const close_handler = () => dispatch('close');

		$$self.$$set = $$props => {
			if ('state' in $$props) $$invalidate(0, state = $$props.state);
		};

		$$self.$capture_state = () => ({
			Button,
			Modal,
			ModalBody,
			ModalFooter,
			ModalHeader,
			createEventDispatcher,
			state,
			doNotShow,
			dispatch,
			toggle
		});

		$$self.$inject_state = $$props => {
			if ('state' in $$props) $$invalidate(0, state = $$props.state);
			if ('doNotShow' in $$props) $$invalidate(1, doNotShow = $$props.doNotShow);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [state, doNotShow, dispatch, toggle, input_change_handler, close_handler];
	}

	class PinchZoom extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$5, create_fragment$5, safe_not_equal, { state: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "PinchZoom",
				options,
				id: create_fragment$5.name
			});
		}

		get state() {
			throw new Error("<PinchZoom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set state(value) {
			throw new Error("<PinchZoom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/Home.svelte generated by Svelte v3.44.2 */
	const file$4 = "src/Home.svelte";

	// (126:3) {#if !PwaInstaller.isStandalone && !installed}
	function create_if_block$4(ctx) {
		let div1;
		let div0;
		let a;
		let icon;
		let t;
		let current;
		let mounted;
		let dispose;

		icon = new Icon({
				props: { name: "cloud-download-fill" },
				$$inline: true
			});

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				a = element("a");
				create_component(icon.$$.fragment);
				t = text(" Install the App!");
				attr_dev(a, "href", "#install");
				attr_dev(a, "class", "svelte-1sqqy6n");
				add_location(a, file$4, 128, 6, 3282);
				attr_dev(div0, "class", "col");
				add_location(div0, file$4, 127, 5, 3258);
				attr_dev(div1, "class", "row installer svelte-1sqqy6n");
				add_location(div1, file$4, 126, 4, 3225);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				append_dev(div0, a);
				mount_component(icon, a, null);
				append_dev(a, t);
				current = true;

				if (!mounted) {
					dispose = listen_dev(a, "click", prevent_default(/*click_handler_2*/ ctx[15]), false, true, false);
					mounted = true;
				}
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div1);
				destroy_component(icon);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$4.name,
			type: "if",
			source: "(126:3) {#if !PwaInstaller.isStandalone && !installed}",
			ctx
		});

		return block;
	}

	function create_fragment$4(ctx) {
		let menu;
		let t0;
		let div9;
		let div8;
		let div7;
		let div1;
		let div0;
		let img0;
		let img0_src_value;
		let t1;
		let p;
		let t3;
		let div4;
		let form;
		let div3;
		let input0;
		let t4;
		let div2;
		let button0;
		let icon0;
		let t5;
		let button1;
		let img1;
		let img1_src_value;
		let t6;
		let t7;
		let div6;
		let div5;
		let a;
		let icon1;
		let t8;
		let t9;
		let input1;
		let t10;
		let pinchzoom;
		let current;
		let mounted;
		let dispose;

		menu = new Menu({
				props: { colour: "white" },
				$$inline: true
			});

		menu.$on("my-libraries", /*my_libraries_handler*/ ctx[10]);
		menu.$on("credits", /*credits_handler*/ ctx[11]);

		icon0 = new Icon({
				props: { name: "search" },
				$$inline: true
			});

		let if_block = !PwaInstaller.isStandalone && !/*installed*/ ctx[1] && create_if_block$4(ctx);

		icon1 = new Icon({
				props: { name: "credit-card" },
				$$inline: true
			});

		pinchzoom = new PinchZoom({
				props: { state: /*state*/ ctx[3] },
				$$inline: true
			});

		pinchzoom.$on("close", /*close_handler*/ ctx[18]);

		const block = {
			c: function create() {
				create_component(menu.$$.fragment);
				t0 = space();
				div9 = element("div");
				div8 = element("div");
				div7 = element("div");
				div1 = element("div");
				div0 = element("div");
				img0 = element("img");
				t1 = space();
				p = element("p");
				p.textContent = "Search for books in UK libraries.";
				t3 = space();
				div4 = element("div");
				form = element("form");
				div3 = element("div");
				input0 = element("input");
				t4 = space();
				div2 = element("div");
				button0 = element("button");
				create_component(icon0.$$.fragment);
				t5 = space();
				button1 = element("button");
				img1 = element("img");
				t6 = space();
				if (if_block) if_block.c();
				t7 = space();
				div6 = element("div");
				div5 = element("div");
				a = element("a");
				create_component(icon1.$$.fragment);
				t8 = text(" Add a library card to Apple Wallet");
				t9 = space();
				input1 = element("input");
				t10 = space();
				create_component(pinchzoom.$$.fragment);
				attr_dev(img0, "class", "logo svelte-1sqqy6n");
				if (!src_url_equal(img0.src, img0_src_value = "/images/Libraree-darkshade.png")) attr_dev(img0, "src", img0_src_value);
				attr_dev(img0, "alt", "Libraree");
				add_location(img0, file$4, 106, 5, 2391);
				add_location(p, file$4, 107, 5, 2469);
				attr_dev(div0, "class", "col text-center");
				add_location(div0, file$4, 105, 4, 2356);
				attr_dev(div1, "class", "row m-2");
				add_location(div1, file$4, 104, 3, 2330);
				attr_dev(input0, "type", "search");
				attr_dev(input0, "placeholder", "Title, author or ISBN");
				attr_dev(input0, "class", "form-control text-center");
				attr_dev(input0, "enterkeyhint", "search");
				add_location(input0, file$4, 114, 7, 2612);
				attr_dev(button0, "type", "submit");
				attr_dev(button0, "class", "btn btn-secondary ml-10");
				add_location(button0, file$4, 118, 8, 2809);
				attr_dev(img1, "class", "barcode");
				if (!src_url_equal(img1.src, img1_src_value = "/images/barcode.png")) attr_dev(img1, "src", img1_src_value);
				attr_dev(img1, "alt", "Scan barcode");
				add_location(img1, file$4, 119, 102, 3040);
				attr_dev(button1, "type", "submit");
				attr_dev(button1, "class", "btn btn-secondary");
				add_location(button1, file$4, 119, 8, 2946);
				attr_dev(div2, "class", "input-group-append");
				add_location(div2, file$4, 117, 7, 2768);
				attr_dev(div3, "class", "col input-group");
				add_location(div3, file$4, 112, 5, 2568);
				add_location(form, file$4, 111, 4, 2556);
				attr_dev(div4, "class", "row");
				add_location(div4, file$4, 110, 3, 2534);
				attr_dev(a, "href", "https://cards.libraree.org");
				attr_dev(a, "target", "_blank");
				attr_dev(a, "class", "svelte-1sqqy6n");
				add_location(a, file$4, 134, 5, 3503);
				attr_dev(div5, "class", "col");
				add_location(div5, file$4, 133, 4, 3480);
				attr_dev(div6, "class", "row installer svelte-1sqqy6n");
				add_location(div6, file$4, 132, 3, 3448);
				attr_dev(div7, "class", "container");
				add_location(div7, file$4, 103, 2, 2303);
				attr_dev(div8, "class", "col vertical-middle svelte-1sqqy6n");
				add_location(div8, file$4, 102, 1, 2267);
				attr_dev(div9, "id", "home");
				attr_dev(div9, "class", "row svelte-1sqqy6n");
				add_location(div9, file$4, 101, 0, 2238);
				attr_dev(input1, "id", "fileInput");
				attr_dev(input1, "type", "file");
				attr_dev(input1, "accept", ".jpg, .jpeg, .png");
				attr_dev(input1, "capture", true);
				attr_dev(input1, "class", "svelte-1sqqy6n");
				add_location(input1, file$4, 141, 0, 3669);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				mount_component(menu, target, anchor);
				insert_dev(target, t0, anchor);
				insert_dev(target, div9, anchor);
				append_dev(div9, div8);
				append_dev(div8, div7);
				append_dev(div7, div1);
				append_dev(div1, div0);
				append_dev(div0, img0);
				append_dev(div0, t1);
				append_dev(div0, p);
				append_dev(div7, t3);
				append_dev(div7, div4);
				append_dev(div4, form);
				append_dev(form, div3);
				append_dev(div3, input0);
				set_input_value(input0, /*filter*/ ctx[2]);
				append_dev(div3, t4);
				append_dev(div3, div2);
				append_dev(div2, button0);
				mount_component(icon0, button0, null);
				append_dev(div2, t5);
				append_dev(div2, button1);
				append_dev(button1, img1);
				append_dev(div7, t6);
				if (if_block) if_block.m(div7, null);
				append_dev(div7, t7);
				append_dev(div7, div6);
				append_dev(div6, div5);
				append_dev(div5, a);
				mount_component(icon1, a, null);
				append_dev(a, t8);
				insert_dev(target, t9, anchor);
				insert_dev(target, input1, anchor);
				/*input1_binding*/ ctx[16](input1);
				insert_dev(target, t10, anchor);
				mount_component(pinchzoom, target, anchor);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
						listen_dev(button0, "click", prevent_default(/*click_handler*/ ctx[13]), false, true, false),
						listen_dev(button1, "click", prevent_default(/*click_handler_1*/ ctx[14]), false, true, false),
						listen_dev(input1, "change", /*change_handler*/ ctx[17], false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*filter*/ 4) {
					set_input_value(input0, /*filter*/ ctx[2]);
				}

				if (!PwaInstaller.isStandalone && !/*installed*/ ctx[1]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*installed*/ 2) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block$4(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(div7, t7);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}

				const pinchzoom_changes = {};
				if (dirty & /*state*/ 8) pinchzoom_changes.state = /*state*/ ctx[3];
				pinchzoom.$set(pinchzoom_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(menu.$$.fragment, local);
				transition_in(icon0.$$.fragment, local);
				transition_in(if_block);
				transition_in(icon1.$$.fragment, local);
				transition_in(pinchzoom.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(menu.$$.fragment, local);
				transition_out(icon0.$$.fragment, local);
				transition_out(if_block);
				transition_out(icon1.$$.fragment, local);
				transition_out(pinchzoom.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(menu, detaching);
				if (detaching) detach_dev(t0);
				if (detaching) detach_dev(div9);
				destroy_component(icon0);
				if (if_block) if_block.d();
				destroy_component(icon1);
				if (detaching) detach_dev(t9);
				if (detaching) detach_dev(input1);
				/*input1_binding*/ ctx[16](null);
				if (detaching) detach_dev(t10);
				destroy_component(pinchzoom, detaching);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$4.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$4($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Home', slots, []);
		const dispatch = createEventDispatcher();
		const barcode = new BarcodeService();
		let fileInput;
		let installed = PwaInstaller.isInstalled;
		PwaInstaller.addEventListener(isInstalled => $$invalidate(1, installed = isInstalled));
		let filter = '';
		window.document.body.classList.toggle('home');

		function doSearch() {
			dispatch('search', filter);
			window.document.body.classList.toggle('home');
			window.document.body.classList.add('transition');
		}

		function configureLibraries() {
			dispatch('my-libraries');
			window.document.body.classList.toggle('home');
			window.document.body.classList.add('transition');
		}

		function goToCredits() {
			dispatch('credits');
			window.document.body.classList.toggle('home');
			window.document.body.classList.add('transition');
		}

		const state = {
			open: false,
			doNotShow: localStorage.getItem('pinchModalHidden') == 'true'
		};

		function launchModal() {
			if (state.doNotShow) {
				closeModal();
			} else {
				$$invalidate(3, state.open = true, state);
			}
		}

		function closeModal() {
			localStorage.setItem('pinchModalHidden', `${state.doNotShow}`);
			fileInput.click();
		}

		async function onBarcode(e) {
			const result = await barcode.readBarcode(e.target.files[0]);

			if (result) {
				$$invalidate(2, filter = result);
				doSearch();
			}
		}

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
		});

		const my_libraries_handler = () => configureLibraries();
		const credits_handler = () => goToCredits();

		function input0_input_handler() {
			filter = this.value;
			$$invalidate(2, filter);
		}

		const click_handler = () => doSearch();
		const click_handler_1 = () => launchModal();
		const click_handler_2 = () => PwaInstaller.install();

		function input1_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				fileInput = $$value;
				$$invalidate(0, fileInput);
			});
		}

		const change_handler = e => onBarcode(e);
		const close_handler = () => closeModal();

		$$self.$capture_state = () => ({
			createEventDispatcher,
			Icon,
			PwaInstaller,
			Menu,
			BarcodeService,
			PinchZoom,
			dispatch,
			barcode,
			fileInput,
			installed,
			filter,
			doSearch,
			configureLibraries,
			goToCredits,
			state,
			launchModal,
			closeModal,
			onBarcode
		});

		$$self.$inject_state = $$props => {
			if ('fileInput' in $$props) $$invalidate(0, fileInput = $$props.fileInput);
			if ('installed' in $$props) $$invalidate(1, installed = $$props.installed);
			if ('filter' in $$props) $$invalidate(2, filter = $$props.filter);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			fileInput,
			installed,
			filter,
			state,
			doSearch,
			configureLibraries,
			goToCredits,
			launchModal,
			closeModal,
			onBarcode,
			my_libraries_handler,
			credits_handler,
			input0_input_handler,
			click_handler,
			click_handler_1,
			click_handler_2,
			input1_binding,
			change_handler,
			close_handler
		];
	}

	class Home extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Home",
				options,
				id: create_fragment$4.name
			});
		}
	}

	class GoogleResult {
	    constructor(id, title, subtitle, authors, published, smallThumbnail, thumbnail, isbn) {
	        this.id = id;
	        this.title = title;
	        this.subtitle = subtitle;
	        this.authors = authors;
	        this.published = published;
	        this.smallThumbnail = smallThumbnail;
	        this.thumbnail = thumbnail;
	        this.isbn = isbn;
	    }
	    get url() {
	        return `https://www.google.co.uk/books/edition/_/${encodeURIComponent(this.id)}`;
	    }
	}

	var TransformationType;
	(function (TransformationType) {
	    TransformationType[TransformationType["PLAIN_TO_CLASS"] = 0] = "PLAIN_TO_CLASS";
	    TransformationType[TransformationType["CLASS_TO_PLAIN"] = 1] = "CLASS_TO_PLAIN";
	    TransformationType[TransformationType["CLASS_TO_CLASS"] = 2] = "CLASS_TO_CLASS";
	})(TransformationType || (TransformationType = {}));

	/**
	 * Storage all library metadata.
	 */
	var MetadataStorage = /** @class */ (function () {
	    function MetadataStorage() {
	        // -------------------------------------------------------------------------
	        // Properties
	        // -------------------------------------------------------------------------
	        this._typeMetadatas = new Map();
	        this._transformMetadatas = new Map();
	        this._exposeMetadatas = new Map();
	        this._excludeMetadatas = new Map();
	        this._ancestorsMap = new Map();
	    }
	    // -------------------------------------------------------------------------
	    // Adder Methods
	    // -------------------------------------------------------------------------
	    MetadataStorage.prototype.addTypeMetadata = function (metadata) {
	        if (!this._typeMetadatas.has(metadata.target)) {
	            this._typeMetadatas.set(metadata.target, new Map());
	        }
	        this._typeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
	    };
	    MetadataStorage.prototype.addTransformMetadata = function (metadata) {
	        if (!this._transformMetadatas.has(metadata.target)) {
	            this._transformMetadatas.set(metadata.target, new Map());
	        }
	        if (!this._transformMetadatas.get(metadata.target).has(metadata.propertyName)) {
	            this._transformMetadatas.get(metadata.target).set(metadata.propertyName, []);
	        }
	        this._transformMetadatas.get(metadata.target).get(metadata.propertyName).push(metadata);
	    };
	    MetadataStorage.prototype.addExposeMetadata = function (metadata) {
	        if (!this._exposeMetadatas.has(metadata.target)) {
	            this._exposeMetadatas.set(metadata.target, new Map());
	        }
	        this._exposeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
	    };
	    MetadataStorage.prototype.addExcludeMetadata = function (metadata) {
	        if (!this._excludeMetadatas.has(metadata.target)) {
	            this._excludeMetadatas.set(metadata.target, new Map());
	        }
	        this._excludeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
	    };
	    // -------------------------------------------------------------------------
	    // Public Methods
	    // -------------------------------------------------------------------------
	    MetadataStorage.prototype.findTransformMetadatas = function (target, propertyName, transformationType) {
	        return this.findMetadatas(this._transformMetadatas, target, propertyName).filter(function (metadata) {
	            if (!metadata.options)
	                return true;
	            if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
	                return true;
	            if (metadata.options.toClassOnly === true) {
	                return (transformationType === TransformationType.CLASS_TO_CLASS ||
	                    transformationType === TransformationType.PLAIN_TO_CLASS);
	            }
	            if (metadata.options.toPlainOnly === true) {
	                return transformationType === TransformationType.CLASS_TO_PLAIN;
	            }
	            return true;
	        });
	    };
	    MetadataStorage.prototype.findExcludeMetadata = function (target, propertyName) {
	        return this.findMetadata(this._excludeMetadatas, target, propertyName);
	    };
	    MetadataStorage.prototype.findExposeMetadata = function (target, propertyName) {
	        return this.findMetadata(this._exposeMetadatas, target, propertyName);
	    };
	    MetadataStorage.prototype.findExposeMetadataByCustomName = function (target, name) {
	        return this.getExposedMetadatas(target).find(function (metadata) {
	            return metadata.options && metadata.options.name === name;
	        });
	    };
	    MetadataStorage.prototype.findTypeMetadata = function (target, propertyName) {
	        return this.findMetadata(this._typeMetadatas, target, propertyName);
	    };
	    MetadataStorage.prototype.getStrategy = function (target) {
	        var excludeMap = this._excludeMetadatas.get(target);
	        var exclude = excludeMap && excludeMap.get(undefined);
	        var exposeMap = this._exposeMetadatas.get(target);
	        var expose = exposeMap && exposeMap.get(undefined);
	        if ((exclude && expose) || (!exclude && !expose))
	            return 'none';
	        return exclude ? 'excludeAll' : 'exposeAll';
	    };
	    MetadataStorage.prototype.getExposedMetadatas = function (target) {
	        return this.getMetadata(this._exposeMetadatas, target);
	    };
	    MetadataStorage.prototype.getExcludedMetadatas = function (target) {
	        return this.getMetadata(this._excludeMetadatas, target);
	    };
	    MetadataStorage.prototype.getExposedProperties = function (target, transformationType) {
	        return this.getExposedMetadatas(target)
	            .filter(function (metadata) {
	            if (!metadata.options)
	                return true;
	            if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
	                return true;
	            if (metadata.options.toClassOnly === true) {
	                return (transformationType === TransformationType.CLASS_TO_CLASS ||
	                    transformationType === TransformationType.PLAIN_TO_CLASS);
	            }
	            if (metadata.options.toPlainOnly === true) {
	                return transformationType === TransformationType.CLASS_TO_PLAIN;
	            }
	            return true;
	        })
	            .map(function (metadata) { return metadata.propertyName; });
	    };
	    MetadataStorage.prototype.getExcludedProperties = function (target, transformationType) {
	        return this.getExcludedMetadatas(target)
	            .filter(function (metadata) {
	            if (!metadata.options)
	                return true;
	            if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
	                return true;
	            if (metadata.options.toClassOnly === true) {
	                return (transformationType === TransformationType.CLASS_TO_CLASS ||
	                    transformationType === TransformationType.PLAIN_TO_CLASS);
	            }
	            if (metadata.options.toPlainOnly === true) {
	                return transformationType === TransformationType.CLASS_TO_PLAIN;
	            }
	            return true;
	        })
	            .map(function (metadata) { return metadata.propertyName; });
	    };
	    MetadataStorage.prototype.clear = function () {
	        this._typeMetadatas.clear();
	        this._exposeMetadatas.clear();
	        this._excludeMetadatas.clear();
	        this._ancestorsMap.clear();
	    };
	    // -------------------------------------------------------------------------
	    // Private Methods
	    // -------------------------------------------------------------------------
	    MetadataStorage.prototype.getMetadata = function (metadatas, target) {
	        var metadataFromTargetMap = metadatas.get(target);
	        var metadataFromTarget;
	        if (metadataFromTargetMap) {
	            metadataFromTarget = Array.from(metadataFromTargetMap.values()).filter(function (meta) { return meta.propertyName !== undefined; });
	        }
	        var metadataFromAncestors = [];
	        for (var _i = 0, _a = this.getAncestors(target); _i < _a.length; _i++) {
	            var ancestor = _a[_i];
	            var ancestorMetadataMap = metadatas.get(ancestor);
	            if (ancestorMetadataMap) {
	                var metadataFromAncestor = Array.from(ancestorMetadataMap.values()).filter(function (meta) { return meta.propertyName !== undefined; });
	                metadataFromAncestors.push.apply(metadataFromAncestors, metadataFromAncestor);
	            }
	        }
	        return metadataFromAncestors.concat(metadataFromTarget || []);
	    };
	    MetadataStorage.prototype.findMetadata = function (metadatas, target, propertyName) {
	        var metadataFromTargetMap = metadatas.get(target);
	        if (metadataFromTargetMap) {
	            var metadataFromTarget = metadataFromTargetMap.get(propertyName);
	            if (metadataFromTarget) {
	                return metadataFromTarget;
	            }
	        }
	        for (var _i = 0, _a = this.getAncestors(target); _i < _a.length; _i++) {
	            var ancestor = _a[_i];
	            var ancestorMetadataMap = metadatas.get(ancestor);
	            if (ancestorMetadataMap) {
	                var ancestorResult = ancestorMetadataMap.get(propertyName);
	                if (ancestorResult) {
	                    return ancestorResult;
	                }
	            }
	        }
	        return undefined;
	    };
	    MetadataStorage.prototype.findMetadatas = function (metadatas, target, propertyName) {
	        var metadataFromTargetMap = metadatas.get(target);
	        var metadataFromTarget;
	        if (metadataFromTargetMap) {
	            metadataFromTarget = metadataFromTargetMap.get(propertyName);
	        }
	        var metadataFromAncestorsTarget = [];
	        for (var _i = 0, _a = this.getAncestors(target); _i < _a.length; _i++) {
	            var ancestor = _a[_i];
	            var ancestorMetadataMap = metadatas.get(ancestor);
	            if (ancestorMetadataMap) {
	                if (ancestorMetadataMap.has(propertyName)) {
	                    metadataFromAncestorsTarget.push.apply(metadataFromAncestorsTarget, ancestorMetadataMap.get(propertyName));
	                }
	            }
	        }
	        return metadataFromAncestorsTarget
	            .slice()
	            .reverse()
	            .concat((metadataFromTarget || []).slice().reverse());
	    };
	    MetadataStorage.prototype.getAncestors = function (target) {
	        if (!target)
	            return [];
	        if (!this._ancestorsMap.has(target)) {
	            var ancestors = [];
	            for (var baseClass = Object.getPrototypeOf(target.prototype.constructor); typeof baseClass.prototype !== 'undefined'; baseClass = Object.getPrototypeOf(baseClass.prototype.constructor)) {
	                ancestors.push(baseClass);
	            }
	            this._ancestorsMap.set(target, ancestors);
	        }
	        return this._ancestorsMap.get(target);
	    };
	    return MetadataStorage;
	}());

	/**
	 * Default metadata storage is used as singleton and can be used to storage all metadatas.
	 */
	var defaultMetadataStorage = new MetadataStorage();

	/**
	 * This function returns the global object across Node and browsers.
	 *
	 * Note: `globalThis` is the standardized approach however it has been added to
	 * Node.js in version 12. We need to include this snippet until Node 12 EOL.
	 */
	function getGlobal() {
	    if (typeof globalThis !== 'undefined') {
	        return globalThis;
	    }
	    if (typeof global !== 'undefined') {
	        return global;
	    }
	    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	    // @ts-ignore: Cannot find name 'window'.
	    if (typeof window !== 'undefined') {
	        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	        // @ts-ignore: Cannot find name 'window'.
	        return window;
	    }
	    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	    // @ts-ignore: Cannot find name 'self'.
	    if (typeof self !== 'undefined') {
	        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	        // @ts-ignore: Cannot find name 'self'.
	        return self;
	    }
	}

	function isPromise(p) {
	    return p !== null && typeof p === 'object' && typeof p.then === 'function';
	}

	var __spreadArray = (window && window.__spreadArray) || function (to, from, pack) {
	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	        if (ar || !(i in from)) {
	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	            ar[i] = from[i];
	        }
	    }
	    return to.concat(ar || Array.prototype.slice.call(from));
	};
	function instantiateArrayType(arrayType) {
	    var array = new arrayType();
	    if (!(array instanceof Set) && !('push' in array)) {
	        return [];
	    }
	    return array;
	}
	var TransformOperationExecutor = /** @class */ (function () {
	    // -------------------------------------------------------------------------
	    // Constructor
	    // -------------------------------------------------------------------------
	    function TransformOperationExecutor(transformationType, options) {
	        this.transformationType = transformationType;
	        this.options = options;
	        // -------------------------------------------------------------------------
	        // Private Properties
	        // -------------------------------------------------------------------------
	        this.recursionStack = new Set();
	    }
	    // -------------------------------------------------------------------------
	    // Public Methods
	    // -------------------------------------------------------------------------
	    TransformOperationExecutor.prototype.transform = function (source, value, targetType, arrayType, isMap, level) {
	        var _this = this;
	        if (level === void 0) { level = 0; }
	        if (Array.isArray(value) || value instanceof Set) {
	            var newValue_1 = arrayType && this.transformationType === TransformationType.PLAIN_TO_CLASS
	                ? instantiateArrayType(arrayType)
	                : [];
	            value.forEach(function (subValue, index) {
	                var subSource = source ? source[index] : undefined;
	                if (!_this.options.enableCircularCheck || !_this.isCircular(subValue)) {
	                    var realTargetType = void 0;
	                    if (typeof targetType !== 'function' &&
	                        targetType &&
	                        targetType.options &&
	                        targetType.options.discriminator &&
	                        targetType.options.discriminator.property &&
	                        targetType.options.discriminator.subTypes) {
	                        if (_this.transformationType === TransformationType.PLAIN_TO_CLASS) {
	                            realTargetType = targetType.options.discriminator.subTypes.find(function (subType) {
	                                return subType.name === subValue[targetType.options.discriminator.property];
	                            });
	                            var options = { newObject: newValue_1, object: subValue, property: undefined };
	                            var newType = targetType.typeFunction(options);
	                            realTargetType === undefined ? (realTargetType = newType) : (realTargetType = realTargetType.value);
	                            if (!targetType.options.keepDiscriminatorProperty)
	                                delete subValue[targetType.options.discriminator.property];
	                        }
	                        if (_this.transformationType === TransformationType.CLASS_TO_CLASS) {
	                            realTargetType = subValue.constructor;
	                        }
	                        if (_this.transformationType === TransformationType.CLASS_TO_PLAIN) {
	                            subValue[targetType.options.discriminator.property] = targetType.options.discriminator.subTypes.find(function (subType) { return subType.value === subValue.constructor; }).name;
	                        }
	                    }
	                    else {
	                        realTargetType = targetType;
	                    }
	                    var value_1 = _this.transform(subSource, subValue, realTargetType, undefined, subValue instanceof Map, level + 1);
	                    if (newValue_1 instanceof Set) {
	                        newValue_1.add(value_1);
	                    }
	                    else {
	                        newValue_1.push(value_1);
	                    }
	                }
	                else if (_this.transformationType === TransformationType.CLASS_TO_CLASS) {
	                    if (newValue_1 instanceof Set) {
	                        newValue_1.add(subValue);
	                    }
	                    else {
	                        newValue_1.push(subValue);
	                    }
	                }
	            });
	            return newValue_1;
	        }
	        else if (targetType === String && !isMap) {
	            if (value === null || value === undefined)
	                return value;
	            return String(value);
	        }
	        else if (targetType === Number && !isMap) {
	            if (value === null || value === undefined)
	                return value;
	            return Number(value);
	        }
	        else if (targetType === Boolean && !isMap) {
	            if (value === null || value === undefined)
	                return value;
	            return Boolean(value);
	        }
	        else if ((targetType === Date || value instanceof Date) && !isMap) {
	            if (value instanceof Date) {
	                return new Date(value.valueOf());
	            }
	            if (value === null || value === undefined)
	                return value;
	            return new Date(value);
	        }
	        else if (!!getGlobal().Buffer && (targetType === Buffer || value instanceof Buffer) && !isMap) {
	            if (value === null || value === undefined)
	                return value;
	            return Buffer.from(value);
	        }
	        else if (isPromise(value) && !isMap) {
	            return new Promise(function (resolve, reject) {
	                value.then(function (data) { return resolve(_this.transform(undefined, data, targetType, undefined, undefined, level + 1)); }, reject);
	            });
	        }
	        else if (!isMap && value !== null && typeof value === 'object' && typeof value.then === 'function') {
	            // Note: We should not enter this, as promise has been handled above
	            // This option simply returns the Promise preventing a JS error from happening and should be an inaccessible path.
	            return value; // skip promise transformation
	        }
	        else if (typeof value === 'object' && value !== null) {
	            // try to guess the type
	            if (!targetType && value.constructor !== Object /* && TransformationType === TransformationType.CLASS_TO_PLAIN*/)
	                if (!Array.isArray(value) && value.constructor === Array) ;
	                else {
	                    // We are good we can use the built-in constructor
	                    targetType = value.constructor;
	                }
	            if (!targetType && source)
	                targetType = source.constructor;
	            if (this.options.enableCircularCheck) {
	                // add transformed type to prevent circular references
	                this.recursionStack.add(value);
	            }
	            var keys = this.getKeys(targetType, value, isMap);
	            var newValue = source ? source : {};
	            if (!source &&
	                (this.transformationType === TransformationType.PLAIN_TO_CLASS ||
	                    this.transformationType === TransformationType.CLASS_TO_CLASS)) {
	                if (isMap) {
	                    newValue = new Map();
	                }
	                else if (targetType) {
	                    newValue = new targetType();
	                }
	                else {
	                    newValue = {};
	                }
	            }
	            var _loop_1 = function (key) {
	                if (key === '__proto__' || key === 'constructor') {
	                    return "continue";
	                }
	                var valueKey = key;
	                var newValueKey = key, propertyName = key;
	                if (!this_1.options.ignoreDecorators && targetType) {
	                    if (this_1.transformationType === TransformationType.PLAIN_TO_CLASS) {
	                        var exposeMetadata = defaultMetadataStorage.findExposeMetadataByCustomName(targetType, key);
	                        if (exposeMetadata) {
	                            propertyName = exposeMetadata.propertyName;
	                            newValueKey = exposeMetadata.propertyName;
	                        }
	                    }
	                    else if (this_1.transformationType === TransformationType.CLASS_TO_PLAIN ||
	                        this_1.transformationType === TransformationType.CLASS_TO_CLASS) {
	                        var exposeMetadata = defaultMetadataStorage.findExposeMetadata(targetType, key);
	                        if (exposeMetadata && exposeMetadata.options && exposeMetadata.options.name) {
	                            newValueKey = exposeMetadata.options.name;
	                        }
	                    }
	                }
	                // get a subvalue
	                var subValue = undefined;
	                if (this_1.transformationType === TransformationType.PLAIN_TO_CLASS) {
	                    /**
	                     * This section is added for the following report:
	                     * https://github.com/typestack/class-transformer/issues/596
	                     *
	                     * We should not call functions or constructors when transforming to class.
	                     */
	                    subValue = value[valueKey];
	                }
	                else {
	                    if (value instanceof Map) {
	                        subValue = value.get(valueKey);
	                    }
	                    else if (value[valueKey] instanceof Function) {
	                        subValue = value[valueKey]();
	                    }
	                    else {
	                        subValue = value[valueKey];
	                    }
	                }
	                // determine a type
	                var type = undefined, isSubValueMap = subValue instanceof Map;
	                if (targetType && isMap) {
	                    type = targetType;
	                }
	                else if (targetType) {
	                    var metadata_1 = defaultMetadataStorage.findTypeMetadata(targetType, propertyName);
	                    if (metadata_1) {
	                        var options = { newObject: newValue, object: value, property: propertyName };
	                        var newType = metadata_1.typeFunction ? metadata_1.typeFunction(options) : metadata_1.reflectedType;
	                        if (metadata_1.options &&
	                            metadata_1.options.discriminator &&
	                            metadata_1.options.discriminator.property &&
	                            metadata_1.options.discriminator.subTypes) {
	                            if (!(value[valueKey] instanceof Array)) {
	                                if (this_1.transformationType === TransformationType.PLAIN_TO_CLASS) {
	                                    type = metadata_1.options.discriminator.subTypes.find(function (subType) {
	                                        if (subValue && subValue instanceof Object && metadata_1.options.discriminator.property in subValue) {
	                                            return subType.name === subValue[metadata_1.options.discriminator.property];
	                                        }
	                                    });
	                                    type === undefined ? (type = newType) : (type = type.value);
	                                    if (!metadata_1.options.keepDiscriminatorProperty) {
	                                        if (subValue && subValue instanceof Object && metadata_1.options.discriminator.property in subValue) {
	                                            delete subValue[metadata_1.options.discriminator.property];
	                                        }
	                                    }
	                                }
	                                if (this_1.transformationType === TransformationType.CLASS_TO_CLASS) {
	                                    type = subValue.constructor;
	                                }
	                                if (this_1.transformationType === TransformationType.CLASS_TO_PLAIN) {
	                                    if (subValue) {
	                                        subValue[metadata_1.options.discriminator.property] = metadata_1.options.discriminator.subTypes.find(function (subType) { return subType.value === subValue.constructor; }).name;
	                                    }
	                                }
	                            }
	                            else {
	                                type = metadata_1;
	                            }
	                        }
	                        else {
	                            type = newType;
	                        }
	                        isSubValueMap = isSubValueMap || metadata_1.reflectedType === Map;
	                    }
	                    else if (this_1.options.targetMaps) {
	                        // try to find a type in target maps
	                        this_1.options.targetMaps
	                            .filter(function (map) { return map.target === targetType && !!map.properties[propertyName]; })
	                            .forEach(function (map) { return (type = map.properties[propertyName]); });
	                    }
	                    else if (this_1.options.enableImplicitConversion &&
	                        this_1.transformationType === TransformationType.PLAIN_TO_CLASS) {
	                        // if we have no registererd type via the @Type() decorator then we check if we have any
	                        // type declarations in reflect-metadata (type declaration is emited only if some decorator is added to the property.)
	                        var reflectedType = Reflect.getMetadata('design:type', targetType.prototype, propertyName);
	                        if (reflectedType) {
	                            type = reflectedType;
	                        }
	                    }
	                }
	                // if value is an array try to get its custom array type
	                var arrayType_1 = Array.isArray(value[valueKey])
	                    ? this_1.getReflectedType(targetType, propertyName)
	                    : undefined;
	                // const subValueKey = TransformationType === TransformationType.PLAIN_TO_CLASS && newKeyName ? newKeyName : key;
	                var subSource = source ? source[valueKey] : undefined;
	                // if its deserialization then type if required
	                // if we uncomment this types like string[] will not work
	                // if (this.transformationType === TransformationType.PLAIN_TO_CLASS && !type && subValue instanceof Object && !(subValue instanceof Date))
	                //     throw new Error(`Cannot determine type for ${(targetType as any).name }.${propertyName}, did you forget to specify a @Type?`);
	                // if newValue is a source object that has method that match newKeyName then skip it
	                if (newValue.constructor.prototype) {
	                    var descriptor = Object.getOwnPropertyDescriptor(newValue.constructor.prototype, newValueKey);
	                    if ((this_1.transformationType === TransformationType.PLAIN_TO_CLASS ||
	                        this_1.transformationType === TransformationType.CLASS_TO_CLASS) &&
	                        // eslint-disable-next-line @typescript-eslint/unbound-method
	                        ((descriptor && !descriptor.set) || newValue[newValueKey] instanceof Function))
	                        return "continue";
	                }
	                if (!this_1.options.enableCircularCheck || !this_1.isCircular(subValue)) {
	                    var transformKey = this_1.transformationType === TransformationType.PLAIN_TO_CLASS ? newValueKey : key;
	                    var finalValue = void 0;
	                    if (this_1.transformationType === TransformationType.CLASS_TO_PLAIN) {
	                        // Get original value
	                        finalValue = value[transformKey];
	                        // Apply custom transformation
	                        finalValue = this_1.applyCustomTransformations(finalValue, targetType, transformKey, value, this_1.transformationType);
	                        // If nothing change, it means no custom transformation was applied, so use the subValue.
	                        finalValue = value[transformKey] === finalValue ? subValue : finalValue;
	                        // Apply the default transformation
	                        finalValue = this_1.transform(subSource, finalValue, type, arrayType_1, isSubValueMap, level + 1);
	                    }
	                    else {
	                        if (subValue === undefined && this_1.options.exposeDefaultValues) {
	                            // Set default value if nothing provided
	                            finalValue = newValue[newValueKey];
	                        }
	                        else {
	                            finalValue = this_1.transform(subSource, subValue, type, arrayType_1, isSubValueMap, level + 1);
	                            finalValue = this_1.applyCustomTransformations(finalValue, targetType, transformKey, value, this_1.transformationType);
	                        }
	                    }
	                    if (finalValue !== undefined || this_1.options.exposeUnsetFields) {
	                        if (newValue instanceof Map) {
	                            newValue.set(newValueKey, finalValue);
	                        }
	                        else {
	                            newValue[newValueKey] = finalValue;
	                        }
	                    }
	                }
	                else if (this_1.transformationType === TransformationType.CLASS_TO_CLASS) {
	                    var finalValue = subValue;
	                    finalValue = this_1.applyCustomTransformations(finalValue, targetType, key, value, this_1.transformationType);
	                    if (finalValue !== undefined || this_1.options.exposeUnsetFields) {
	                        if (newValue instanceof Map) {
	                            newValue.set(newValueKey, finalValue);
	                        }
	                        else {
	                            newValue[newValueKey] = finalValue;
	                        }
	                    }
	                }
	            };
	            var this_1 = this;
	            // traverse over keys
	            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
	                var key = keys_1[_i];
	                _loop_1(key);
	            }
	            if (this.options.enableCircularCheck) {
	                this.recursionStack.delete(value);
	            }
	            return newValue;
	        }
	        else {
	            return value;
	        }
	    };
	    TransformOperationExecutor.prototype.applyCustomTransformations = function (value, target, key, obj, transformationType) {
	        var _this = this;
	        var metadatas = defaultMetadataStorage.findTransformMetadatas(target, key, this.transformationType);
	        // apply versioning options
	        if (this.options.version !== undefined) {
	            metadatas = metadatas.filter(function (metadata) {
	                if (!metadata.options)
	                    return true;
	                return _this.checkVersion(metadata.options.since, metadata.options.until);
	            });
	        }
	        // apply grouping options
	        if (this.options.groups && this.options.groups.length) {
	            metadatas = metadatas.filter(function (metadata) {
	                if (!metadata.options)
	                    return true;
	                return _this.checkGroups(metadata.options.groups);
	            });
	        }
	        else {
	            metadatas = metadatas.filter(function (metadata) {
	                return !metadata.options || !metadata.options.groups || !metadata.options.groups.length;
	            });
	        }
	        metadatas.forEach(function (metadata) {
	            value = metadata.transformFn({ value: value, key: key, obj: obj, type: transformationType, options: _this.options });
	        });
	        return value;
	    };
	    // preventing circular references
	    TransformOperationExecutor.prototype.isCircular = function (object) {
	        return this.recursionStack.has(object);
	    };
	    TransformOperationExecutor.prototype.getReflectedType = function (target, propertyName) {
	        if (!target)
	            return undefined;
	        var meta = defaultMetadataStorage.findTypeMetadata(target, propertyName);
	        return meta ? meta.reflectedType : undefined;
	    };
	    TransformOperationExecutor.prototype.getKeys = function (target, object, isMap) {
	        var _this = this;
	        // determine exclusion strategy
	        var strategy = defaultMetadataStorage.getStrategy(target);
	        if (strategy === 'none')
	            strategy = this.options.strategy || 'exposeAll'; // exposeAll is default strategy
	        // get all keys that need to expose
	        var keys = [];
	        if (strategy === 'exposeAll' || isMap) {
	            if (object instanceof Map) {
	                keys = Array.from(object.keys());
	            }
	            else {
	                keys = Object.keys(object);
	            }
	        }
	        if (isMap) {
	            // expose & exclude do not apply for map keys only to fields
	            return keys;
	        }
	        /**
	         * If decorators are ignored but we don't want the extraneous values, then we use the
	         * metadata to decide which property is needed, but doesn't apply the decorator effect.
	         */
	        if (this.options.ignoreDecorators && this.options.excludeExtraneousValues && target) {
	            var exposedProperties = defaultMetadataStorage.getExposedProperties(target, this.transformationType);
	            var excludedProperties = defaultMetadataStorage.getExcludedProperties(target, this.transformationType);
	            keys = __spreadArray(__spreadArray([], exposedProperties, true), excludedProperties, true);
	        }
	        if (!this.options.ignoreDecorators && target) {
	            // add all exposed to list of keys
	            var exposedProperties = defaultMetadataStorage.getExposedProperties(target, this.transformationType);
	            if (this.transformationType === TransformationType.PLAIN_TO_CLASS) {
	                exposedProperties = exposedProperties.map(function (key) {
	                    var exposeMetadata = defaultMetadataStorage.findExposeMetadata(target, key);
	                    if (exposeMetadata && exposeMetadata.options && exposeMetadata.options.name) {
	                        return exposeMetadata.options.name;
	                    }
	                    return key;
	                });
	            }
	            if (this.options.excludeExtraneousValues) {
	                keys = exposedProperties;
	            }
	            else {
	                keys = keys.concat(exposedProperties);
	            }
	            // exclude excluded properties
	            var excludedProperties_1 = defaultMetadataStorage.getExcludedProperties(target, this.transformationType);
	            if (excludedProperties_1.length > 0) {
	                keys = keys.filter(function (key) {
	                    return !excludedProperties_1.includes(key);
	                });
	            }
	            // apply versioning options
	            if (this.options.version !== undefined) {
	                keys = keys.filter(function (key) {
	                    var exposeMetadata = defaultMetadataStorage.findExposeMetadata(target, key);
	                    if (!exposeMetadata || !exposeMetadata.options)
	                        return true;
	                    return _this.checkVersion(exposeMetadata.options.since, exposeMetadata.options.until);
	                });
	            }
	            // apply grouping options
	            if (this.options.groups && this.options.groups.length) {
	                keys = keys.filter(function (key) {
	                    var exposeMetadata = defaultMetadataStorage.findExposeMetadata(target, key);
	                    if (!exposeMetadata || !exposeMetadata.options)
	                        return true;
	                    return _this.checkGroups(exposeMetadata.options.groups);
	                });
	            }
	            else {
	                keys = keys.filter(function (key) {
	                    var exposeMetadata = defaultMetadataStorage.findExposeMetadata(target, key);
	                    return (!exposeMetadata ||
	                        !exposeMetadata.options ||
	                        !exposeMetadata.options.groups ||
	                        !exposeMetadata.options.groups.length);
	                });
	            }
	        }
	        // exclude prefixed properties
	        if (this.options.excludePrefixes && this.options.excludePrefixes.length) {
	            keys = keys.filter(function (key) {
	                return _this.options.excludePrefixes.every(function (prefix) {
	                    return key.substr(0, prefix.length) !== prefix;
	                });
	            });
	        }
	        // make sure we have unique keys
	        keys = keys.filter(function (key, index, self) {
	            return self.indexOf(key) === index;
	        });
	        return keys;
	    };
	    TransformOperationExecutor.prototype.checkVersion = function (since, until) {
	        var decision = true;
	        if (decision && since)
	            decision = this.options.version >= since;
	        if (decision && until)
	            decision = this.options.version < until;
	        return decision;
	    };
	    TransformOperationExecutor.prototype.checkGroups = function (groups) {
	        if (!groups)
	            return true;
	        return this.options.groups.some(function (optionGroup) { return groups.includes(optionGroup); });
	    };
	    return TransformOperationExecutor;
	}());

	/**
	 * These are the default options used by any transformation operation.
	 */
	var defaultOptions = {
	    enableCircularCheck: false,
	    enableImplicitConversion: false,
	    excludeExtraneousValues: false,
	    excludePrefixes: undefined,
	    exposeDefaultValues: false,
	    exposeUnsetFields: true,
	    groups: undefined,
	    ignoreDecorators: false,
	    strategy: undefined,
	    targetMaps: undefined,
	    version: undefined,
	};

	var __assign = (window && window.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	var ClassTransformer = /** @class */ (function () {
	    function ClassTransformer() {
	    }
	    ClassTransformer.prototype.instanceToPlain = function (object, options) {
	        var executor = new TransformOperationExecutor(TransformationType.CLASS_TO_PLAIN, __assign(__assign({}, defaultOptions), options));
	        return executor.transform(undefined, object, undefined, undefined, undefined, undefined);
	    };
	    ClassTransformer.prototype.classToPlainFromExist = function (object, plainObject, options) {
	        var executor = new TransformOperationExecutor(TransformationType.CLASS_TO_PLAIN, __assign(__assign({}, defaultOptions), options));
	        return executor.transform(plainObject, object, undefined, undefined, undefined, undefined);
	    };
	    ClassTransformer.prototype.plainToInstance = function (cls, plain, options) {
	        var executor = new TransformOperationExecutor(TransformationType.PLAIN_TO_CLASS, __assign(__assign({}, defaultOptions), options));
	        return executor.transform(undefined, plain, cls, undefined, undefined, undefined);
	    };
	    ClassTransformer.prototype.plainToClassFromExist = function (clsObject, plain, options) {
	        var executor = new TransformOperationExecutor(TransformationType.PLAIN_TO_CLASS, __assign(__assign({}, defaultOptions), options));
	        return executor.transform(clsObject, plain, undefined, undefined, undefined, undefined);
	    };
	    ClassTransformer.prototype.instanceToInstance = function (object, options) {
	        var executor = new TransformOperationExecutor(TransformationType.CLASS_TO_CLASS, __assign(__assign({}, defaultOptions), options));
	        return executor.transform(undefined, object, undefined, undefined, undefined, undefined);
	    };
	    ClassTransformer.prototype.classToClassFromExist = function (object, fromObject, options) {
	        var executor = new TransformOperationExecutor(TransformationType.CLASS_TO_CLASS, __assign(__assign({}, defaultOptions), options));
	        return executor.transform(fromObject, object, undefined, undefined, undefined, undefined);
	    };
	    ClassTransformer.prototype.serialize = function (object, options) {
	        return JSON.stringify(this.instanceToPlain(object, options));
	    };
	    /**
	     * Deserializes given JSON string to a object of the given class.
	     */
	    ClassTransformer.prototype.deserialize = function (cls, json, options) {
	        var jsonObject = JSON.parse(json);
	        return this.plainToInstance(cls, jsonObject, options);
	    };
	    /**
	     * Deserializes given JSON string to an array of objects of the given class.
	     */
	    ClassTransformer.prototype.deserializeArray = function (cls, json, options) {
	        var jsonObject = JSON.parse(json);
	        return this.plainToInstance(cls, jsonObject, options);
	    };
	    return ClassTransformer;
	}());

	/**
	 * Specifies a type of the property.
	 * The given TypeFunction can return a constructor. A discriminator can be given in the options.
	 *
	 * Can be applied to properties only.
	 */
	function Type(typeFunction, options) {
	    if (options === void 0) { options = {}; }
	    return function (target, propertyName) {
	        var reflectedType = Reflect.getMetadata('design:type', target, propertyName);
	        defaultMetadataStorage.addTypeMetadata({
	            target: target.constructor,
	            propertyName: propertyName,
	            reflectedType: reflectedType,
	            typeFunction: typeFunction,
	            options: options,
	        });
	    };
	}

	var classTransformer = new ClassTransformer();
	function plainToClass(cls, plain, options) {
	    return classTransformer.plainToInstance(cls, plain, options);
	}
	function plainToInstance(cls, plain, options) {
	    return classTransformer.plainToInstance(cls, plain, options);
	}

	// Current version.
	var VERSION = '1.13.1';

	// Establish the root object, `window` (`self`) in the browser, `global`
	// on the server, or `this` in some virtual machines. We use `self`
	// instead of `window` for `WebWorker` support.
	var root = typeof self == 'object' && self.self === self && self ||
	          typeof global == 'object' && global.global === global && global ||
	          Function('return this')() ||
	          {};

	// Save bytes in the minified (but not gzipped) version:
	var ArrayProto = Array.prototype, ObjProto = Object.prototype;
	var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

	// Create quick reference variables for speed access to core prototypes.
	var push = ArrayProto.push,
	    slice = ArrayProto.slice,
	    toString = ObjProto.toString,
	    hasOwnProperty = ObjProto.hasOwnProperty;

	// Modern feature detection.
	var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
	    supportsDataView = typeof DataView !== 'undefined';

	// All **ECMAScript 5+** native function implementations that we hope to use
	// are declared here.
	var nativeIsArray = Array.isArray,
	    nativeKeys = Object.keys,
	    nativeCreate = Object.create,
	    nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;

	// Create references to these builtin functions because we override them.
	var _isNaN = isNaN,
	    _isFinite = isFinite;

	// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	  'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	// The largest integer that can be represented exactly.
	var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

	// Some functions take a variable number of arguments, or a few expected
	// arguments at the beginning and then a variable number of values to operate
	// on. This helper accumulates all remaining arguments past the function’s
	// argument length (or an explicit `startIndex`), into an array that becomes
	// the last argument. Similar to ES6’s "rest parameter".
	function restArguments(func, startIndex) {
	  startIndex = startIndex == null ? func.length - 1 : +startIndex;
	  return function() {
	    var length = Math.max(arguments.length - startIndex, 0),
	        rest = Array(length),
	        index = 0;
	    for (; index < length; index++) {
	      rest[index] = arguments[index + startIndex];
	    }
	    switch (startIndex) {
	      case 0: return func.call(this, rest);
	      case 1: return func.call(this, arguments[0], rest);
	      case 2: return func.call(this, arguments[0], arguments[1], rest);
	    }
	    var args = Array(startIndex + 1);
	    for (index = 0; index < startIndex; index++) {
	      args[index] = arguments[index];
	    }
	    args[startIndex] = rest;
	    return func.apply(this, args);
	  };
	}

	// Is a given variable an object?
	function isObject(obj) {
	  var type = typeof obj;
	  return type === 'function' || type === 'object' && !!obj;
	}

	// Is a given value equal to null?
	function isNull(obj) {
	  return obj === null;
	}

	// Is a given variable undefined?
	function isUndefined(obj) {
	  return obj === void 0;
	}

	// Is a given value a boolean?
	function isBoolean(obj) {
	  return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	}

	// Is a given value a DOM element?
	function isElement(obj) {
	  return !!(obj && obj.nodeType === 1);
	}

	// Internal function for creating a `toString`-based type tester.
	function tagTester(name) {
	  var tag = '[object ' + name + ']';
	  return function(obj) {
	    return toString.call(obj) === tag;
	  };
	}

	var isString = tagTester('String');

	var isNumber = tagTester('Number');

	var isDate = tagTester('Date');

	var isRegExp = tagTester('RegExp');

	var isError = tagTester('Error');

	var isSymbol = tagTester('Symbol');

	var isArrayBuffer = tagTester('ArrayBuffer');

	var isFunction = tagTester('Function');

	// Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
	// v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
	var nodelist = root.document && root.document.childNodes;
	if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
	  isFunction = function(obj) {
	    return typeof obj == 'function' || false;
	  };
	}

	var isFunction$1 = isFunction;

	var hasObjectTag = tagTester('Object');

	// In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
	// In IE 11, the most common among them, this problem also applies to
	// `Map`, `WeakMap` and `Set`.
	var hasStringTagBug = (
	      supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8)))
	    ),
	    isIE11 = (typeof Map !== 'undefined' && hasObjectTag(new Map));

	var isDataView = tagTester('DataView');

	// In IE 10 - Edge 13, we need a different heuristic
	// to determine whether an object is a `DataView`.
	function ie10IsDataView(obj) {
	  return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
	}

	var isDataView$1 = (hasStringTagBug ? ie10IsDataView : isDataView);

	// Is a given value an array?
	// Delegates to ECMA5's native `Array.isArray`.
	var isArray = nativeIsArray || tagTester('Array');

	// Internal function to check whether `key` is an own property name of `obj`.
	function has$1(obj, key) {
	  return obj != null && hasOwnProperty.call(obj, key);
	}

	var isArguments = tagTester('Arguments');

	// Define a fallback version of the method in browsers (ahem, IE < 9), where
	// there isn't any inspectable "Arguments" type.
	(function() {
	  if (!isArguments(arguments)) {
	    isArguments = function(obj) {
	      return has$1(obj, 'callee');
	    };
	  }
	}());

	var isArguments$1 = isArguments;

	// Is a given object a finite number?
	function isFinite$1(obj) {
	  return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
	}

	// Is the given value `NaN`?
	function isNaN$1(obj) {
	  return isNumber(obj) && _isNaN(obj);
	}

	// Predicate-generating function. Often useful outside of Underscore.
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	// Common internal logic for `isArrayLike` and `isBufferLike`.
	function createSizePropertyCheck(getSizeProperty) {
	  return function(collection) {
	    var sizeProperty = getSizeProperty(collection);
	    return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
	  }
	}

	// Internal helper to generate a function to obtain property `key` from `obj`.
	function shallowProperty(key) {
	  return function(obj) {
	    return obj == null ? void 0 : obj[key];
	  };
	}

	// Internal helper to obtain the `byteLength` property of an object.
	var getByteLength = shallowProperty('byteLength');

	// Internal helper to determine whether we should spend extensive checks against
	// `ArrayBuffer` et al.
	var isBufferLike = createSizePropertyCheck(getByteLength);

	// Is a given value a typed array?
	var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
	function isTypedArray(obj) {
	  // `ArrayBuffer.isView` is the most future-proof, so use it when available.
	  // Otherwise, fall back on the above regular expression.
	  return nativeIsView ? (nativeIsView(obj) && !isDataView$1(obj)) :
	                isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
	}

	var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);

	// Internal helper to obtain the `length` property of an object.
	var getLength = shallowProperty('length');

	// Internal helper to create a simple lookup structure.
	// `collectNonEnumProps` used to depend on `_.contains`, but this led to
	// circular imports. `emulatedSet` is a one-off solution that only works for
	// arrays of strings.
	function emulatedSet(keys) {
	  var hash = {};
	  for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
	  return {
	    contains: function(key) { return hash[key]; },
	    push: function(key) {
	      hash[key] = true;
	      return keys.push(key);
	    }
	  };
	}

	// Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
	// be iterated by `for key in ...` and thus missed. Extends `keys` in place if
	// needed.
	function collectNonEnumProps(obj, keys) {
	  keys = emulatedSet(keys);
	  var nonEnumIdx = nonEnumerableProps.length;
	  var constructor = obj.constructor;
	  var proto = isFunction$1(constructor) && constructor.prototype || ObjProto;

	  // Constructor is a special case.
	  var prop = 'constructor';
	  if (has$1(obj, prop) && !keys.contains(prop)) keys.push(prop);

	  while (nonEnumIdx--) {
	    prop = nonEnumerableProps[nonEnumIdx];
	    if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
	      keys.push(prop);
	    }
	  }
	}

	// Retrieve the names of an object's own properties.
	// Delegates to **ECMAScript 5**'s native `Object.keys`.
	function keys(obj) {
	  if (!isObject(obj)) return [];
	  if (nativeKeys) return nativeKeys(obj);
	  var keys = [];
	  for (var key in obj) if (has$1(obj, key)) keys.push(key);
	  // Ahem, IE < 9.
	  if (hasEnumBug) collectNonEnumProps(obj, keys);
	  return keys;
	}

	// Is a given array, string, or object empty?
	// An "empty" object has no enumerable own-properties.
	function isEmpty(obj) {
	  if (obj == null) return true;
	  // Skip the more expensive `toString`-based type checks if `obj` has no
	  // `.length`.
	  var length = getLength(obj);
	  if (typeof length == 'number' && (
	    isArray(obj) || isString(obj) || isArguments$1(obj)
	  )) return length === 0;
	  return getLength(keys(obj)) === 0;
	}

	// Returns whether an object has a given set of `key:value` pairs.
	function isMatch(object, attrs) {
	  var _keys = keys(attrs), length = _keys.length;
	  if (object == null) return !length;
	  var obj = Object(object);
	  for (var i = 0; i < length; i++) {
	    var key = _keys[i];
	    if (attrs[key] !== obj[key] || !(key in obj)) return false;
	  }
	  return true;
	}

	// If Underscore is called as a function, it returns a wrapped object that can
	// be used OO-style. This wrapper holds altered versions of all functions added
	// through `_.mixin`. Wrapped objects may be chained.
	function _$1(obj) {
	  if (obj instanceof _$1) return obj;
	  if (!(this instanceof _$1)) return new _$1(obj);
	  this._wrapped = obj;
	}

	_$1.VERSION = VERSION;

	// Extracts the result from a wrapped and chained object.
	_$1.prototype.value = function() {
	  return this._wrapped;
	};

	// Provide unwrapping proxies for some methods used in engine operations
	// such as arithmetic and JSON stringification.
	_$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;

	_$1.prototype.toString = function() {
	  return String(this._wrapped);
	};

	// Internal function to wrap or shallow-copy an ArrayBuffer,
	// typed array or DataView to a new view, reusing the buffer.
	function toBufferView(bufferSource) {
	  return new Uint8Array(
	    bufferSource.buffer || bufferSource,
	    bufferSource.byteOffset || 0,
	    getByteLength(bufferSource)
	  );
	}

	// We use this string twice, so give it a name for minification.
	var tagDataView = '[object DataView]';

	// Internal recursive comparison function for `_.isEqual`.
	function eq(a, b, aStack, bStack) {
	  // Identical objects are equal. `0 === -0`, but they aren't identical.
	  // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
	  if (a === b) return a !== 0 || 1 / a === 1 / b;
	  // `null` or `undefined` only equal to itself (strict comparison).
	  if (a == null || b == null) return false;
	  // `NaN`s are equivalent, but non-reflexive.
	  if (a !== a) return b !== b;
	  // Exhaust primitive checks
	  var type = typeof a;
	  if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
	  return deepEq(a, b, aStack, bStack);
	}

	// Internal recursive comparison function for `_.isEqual`.
	function deepEq(a, b, aStack, bStack) {
	  // Unwrap any wrapped objects.
	  if (a instanceof _$1) a = a._wrapped;
	  if (b instanceof _$1) b = b._wrapped;
	  // Compare `[[Class]]` names.
	  var className = toString.call(a);
	  if (className !== toString.call(b)) return false;
	  // Work around a bug in IE 10 - Edge 13.
	  if (hasStringTagBug && className == '[object Object]' && isDataView$1(a)) {
	    if (!isDataView$1(b)) return false;
	    className = tagDataView;
	  }
	  switch (className) {
	    // These types are compared by value.
	    case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	    case '[object String]':
	      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	      // equivalent to `new String("5")`.
	      return '' + a === '' + b;
	    case '[object Number]':
	      // `NaN`s are equivalent, but non-reflexive.
	      // Object(NaN) is equivalent to NaN.
	      if (+a !== +a) return +b !== +b;
	      // An `egal` comparison is performed for other numeric values.
	      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	    case '[object Date]':
	    case '[object Boolean]':
	      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	      // millisecond representations. Note that invalid dates with millisecond representations
	      // of `NaN` are not equivalent.
	      return +a === +b;
	    case '[object Symbol]':
	      return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
	    case '[object ArrayBuffer]':
	    case tagDataView:
	      // Coerce to typed array so we can fall through.
	      return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
	  }

	  var areArrays = className === '[object Array]';
	  if (!areArrays && isTypedArray$1(a)) {
	      var byteLength = getByteLength(a);
	      if (byteLength !== getByteLength(b)) return false;
	      if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
	      areArrays = true;
	  }
	  if (!areArrays) {
	    if (typeof a != 'object' || typeof b != 'object') return false;

	    // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	    // from different frames are.
	    var aCtor = a.constructor, bCtor = b.constructor;
	    if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor &&
	                             isFunction$1(bCtor) && bCtor instanceof bCtor)
	                        && ('constructor' in a && 'constructor' in b)) {
	      return false;
	    }
	  }
	  // Assume equality for cyclic structures. The algorithm for detecting cyclic
	  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	  // Initializing stack of traversed objects.
	  // It's done here since we only need them for objects and arrays comparison.
	  aStack = aStack || [];
	  bStack = bStack || [];
	  var length = aStack.length;
	  while (length--) {
	    // Linear search. Performance is inversely proportional to the number of
	    // unique nested structures.
	    if (aStack[length] === a) return bStack[length] === b;
	  }

	  // Add the first object to the stack of traversed objects.
	  aStack.push(a);
	  bStack.push(b);

	  // Recursively compare objects and arrays.
	  if (areArrays) {
	    // Compare array lengths to determine if a deep comparison is necessary.
	    length = a.length;
	    if (length !== b.length) return false;
	    // Deep compare the contents, ignoring non-numeric properties.
	    while (length--) {
	      if (!eq(a[length], b[length], aStack, bStack)) return false;
	    }
	  } else {
	    // Deep compare objects.
	    var _keys = keys(a), key;
	    length = _keys.length;
	    // Ensure that both objects contain the same number of properties before comparing deep equality.
	    if (keys(b).length !== length) return false;
	    while (length--) {
	      // Deep compare each member
	      key = _keys[length];
	      if (!(has$1(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	    }
	  }
	  // Remove the first object from the stack of traversed objects.
	  aStack.pop();
	  bStack.pop();
	  return true;
	}

	// Perform a deep comparison to check if two objects are equal.
	function isEqual(a, b) {
	  return eq(a, b);
	}

	// Retrieve all the enumerable property names of an object.
	function allKeys(obj) {
	  if (!isObject(obj)) return [];
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  // Ahem, IE < 9.
	  if (hasEnumBug) collectNonEnumProps(obj, keys);
	  return keys;
	}

	// Since the regular `Object.prototype.toString` type tests don't work for
	// some types in IE 11, we use a fingerprinting heuristic instead, based
	// on the methods. It's not great, but it's the best we got.
	// The fingerprint method lists are defined below.
	function ie11fingerprint(methods) {
	  var length = getLength(methods);
	  return function(obj) {
	    if (obj == null) return false;
	    // `Map`, `WeakMap` and `Set` have no enumerable keys.
	    var keys = allKeys(obj);
	    if (getLength(keys)) return false;
	    for (var i = 0; i < length; i++) {
	      if (!isFunction$1(obj[methods[i]])) return false;
	    }
	    // If we are testing against `WeakMap`, we need to ensure that
	    // `obj` doesn't have a `forEach` method in order to distinguish
	    // it from a regular `Map`.
	    return methods !== weakMapMethods || !isFunction$1(obj[forEachName]);
	  };
	}

	// In the interest of compact minification, we write
	// each string in the fingerprints only once.
	var forEachName = 'forEach',
	    hasName = 'has',
	    commonInit = ['clear', 'delete'],
	    mapTail = ['get', hasName, 'set'];

	// `Map`, `WeakMap` and `Set` each have slightly different
	// combinations of the above sublists.
	var mapMethods = commonInit.concat(forEachName, mapTail),
	    weakMapMethods = commonInit.concat(mapTail),
	    setMethods = ['add'].concat(commonInit, forEachName, hasName);

	var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester('Map');

	var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap');

	var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester('Set');

	var isWeakSet = tagTester('WeakSet');

	// Retrieve the values of an object's properties.
	function values(obj) {
	  var _keys = keys(obj);
	  var length = _keys.length;
	  var values = Array(length);
	  for (var i = 0; i < length; i++) {
	    values[i] = obj[_keys[i]];
	  }
	  return values;
	}

	// Convert an object into a list of `[key, value]` pairs.
	// The opposite of `_.object` with one argument.
	function pairs(obj) {
	  var _keys = keys(obj);
	  var length = _keys.length;
	  var pairs = Array(length);
	  for (var i = 0; i < length; i++) {
	    pairs[i] = [_keys[i], obj[_keys[i]]];
	  }
	  return pairs;
	}

	// Invert the keys and values of an object. The values must be serializable.
	function invert(obj) {
	  var result = {};
	  var _keys = keys(obj);
	  for (var i = 0, length = _keys.length; i < length; i++) {
	    result[obj[_keys[i]]] = _keys[i];
	  }
	  return result;
	}

	// Return a sorted list of the function names available on the object.
	function functions(obj) {
	  var names = [];
	  for (var key in obj) {
	    if (isFunction$1(obj[key])) names.push(key);
	  }
	  return names.sort();
	}

	// An internal function for creating assigner functions.
	function createAssigner(keysFunc, defaults) {
	  return function(obj) {
	    var length = arguments.length;
	    if (defaults) obj = Object(obj);
	    if (length < 2 || obj == null) return obj;
	    for (var index = 1; index < length; index++) {
	      var source = arguments[index],
	          keys = keysFunc(source),
	          l = keys.length;
	      for (var i = 0; i < l; i++) {
	        var key = keys[i];
	        if (!defaults || obj[key] === void 0) obj[key] = source[key];
	      }
	    }
	    return obj;
	  };
	}

	// Extend a given object with all the properties in passed-in object(s).
	var extend = createAssigner(allKeys);

	// Assigns a given object with all the own properties in the passed-in
	// object(s).
	// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	var extendOwn = createAssigner(keys);

	// Fill in a given object with default properties.
	var defaults = createAssigner(allKeys, true);

	// Create a naked function reference for surrogate-prototype-swapping.
	function ctor() {
	  return function(){};
	}

	// An internal function for creating a new object that inherits from another.
	function baseCreate(prototype) {
	  if (!isObject(prototype)) return {};
	  if (nativeCreate) return nativeCreate(prototype);
	  var Ctor = ctor();
	  Ctor.prototype = prototype;
	  var result = new Ctor;
	  Ctor.prototype = null;
	  return result;
	}

	// Creates an object that inherits from the given prototype object.
	// If additional properties are provided then they will be added to the
	// created object.
	function create(prototype, props) {
	  var result = baseCreate(prototype);
	  if (props) extendOwn(result, props);
	  return result;
	}

	// Create a (shallow-cloned) duplicate of an object.
	function clone(obj) {
	  if (!isObject(obj)) return obj;
	  return isArray(obj) ? obj.slice() : extend({}, obj);
	}

	// Invokes `interceptor` with the `obj` and then returns `obj`.
	// The primary purpose of this method is to "tap into" a method chain, in
	// order to perform operations on intermediate results within the chain.
	function tap(obj, interceptor) {
	  interceptor(obj);
	  return obj;
	}

	// Normalize a (deep) property `path` to array.
	// Like `_.iteratee`, this function can be customized.
	function toPath$1(path) {
	  return isArray(path) ? path : [path];
	}
	_$1.toPath = toPath$1;

	// Internal wrapper for `_.toPath` to enable minification.
	// Similar to `cb` for `_.iteratee`.
	function toPath(path) {
	  return _$1.toPath(path);
	}

	// Internal function to obtain a nested property in `obj` along `path`.
	function deepGet(obj, path) {
	  var length = path.length;
	  for (var i = 0; i < length; i++) {
	    if (obj == null) return void 0;
	    obj = obj[path[i]];
	  }
	  return length ? obj : void 0;
	}

	// Get the value of the (deep) property on `path` from `object`.
	// If any property in `path` does not exist or if the value is
	// `undefined`, return `defaultValue` instead.
	// The `path` is normalized through `_.toPath`.
	function get(object, path, defaultValue) {
	  var value = deepGet(object, toPath(path));
	  return isUndefined(value) ? defaultValue : value;
	}

	// Shortcut function for checking if an object has a given property directly on
	// itself (in other words, not on a prototype). Unlike the internal `has`
	// function, this public version can also traverse nested properties.
	function has(obj, path) {
	  path = toPath(path);
	  var length = path.length;
	  for (var i = 0; i < length; i++) {
	    var key = path[i];
	    if (!has$1(obj, key)) return false;
	    obj = obj[key];
	  }
	  return !!length;
	}

	// Keep the identity function around for default iteratees.
	function identity(value) {
	  return value;
	}

	// Returns a predicate for checking whether an object has a given set of
	// `key:value` pairs.
	function matcher(attrs) {
	  attrs = extendOwn({}, attrs);
	  return function(obj) {
	    return isMatch(obj, attrs);
	  };
	}

	// Creates a function that, when passed an object, will traverse that object’s
	// properties down the given `path`, specified as an array of keys or indices.
	function property(path) {
	  path = toPath(path);
	  return function(obj) {
	    return deepGet(obj, path);
	  };
	}

	// Internal function that returns an efficient (for current engines) version
	// of the passed-in callback, to be repeatedly applied in other Underscore
	// functions.
	function optimizeCb(func, context, argCount) {
	  if (context === void 0) return func;
	  switch (argCount == null ? 3 : argCount) {
	    case 1: return function(value) {
	      return func.call(context, value);
	    };
	    // The 2-argument case is omitted because we’re not using it.
	    case 3: return function(value, index, collection) {
	      return func.call(context, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(context, accumulator, value, index, collection);
	    };
	  }
	  return function() {
	    return func.apply(context, arguments);
	  };
	}

	// An internal function to generate callbacks that can be applied to each
	// element in a collection, returning the desired result — either `_.identity`,
	// an arbitrary callback, a property matcher, or a property accessor.
	function baseIteratee(value, context, argCount) {
	  if (value == null) return identity;
	  if (isFunction$1(value)) return optimizeCb(value, context, argCount);
	  if (isObject(value) && !isArray(value)) return matcher(value);
	  return property(value);
	}

	// External wrapper for our callback generator. Users may customize
	// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
	// This abstraction hides the internal-only `argCount` argument.
	function iteratee(value, context) {
	  return baseIteratee(value, context, Infinity);
	}
	_$1.iteratee = iteratee;

	// The function we call internally to generate a callback. It invokes
	// `_.iteratee` if overridden, otherwise `baseIteratee`.
	function cb(value, context, argCount) {
	  if (_$1.iteratee !== iteratee) return _$1.iteratee(value, context);
	  return baseIteratee(value, context, argCount);
	}

	// Returns the results of applying the `iteratee` to each element of `obj`.
	// In contrast to `_.map` it returns an object.
	function mapObject(obj, iteratee, context) {
	  iteratee = cb(iteratee, context);
	  var _keys = keys(obj),
	      length = _keys.length,
	      results = {};
	  for (var index = 0; index < length; index++) {
	    var currentKey = _keys[index];
	    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	  }
	  return results;
	}

	// Predicate-generating function. Often useful outside of Underscore.
	function noop(){}

	// Generates a function for a given object that returns a given property.
	function propertyOf(obj) {
	  if (obj == null) return noop;
	  return function(path) {
	    return get(obj, path);
	  };
	}

	// Run a function **n** times.
	function times(n, iteratee, context) {
	  var accum = Array(Math.max(0, n));
	  iteratee = optimizeCb(iteratee, context, 1);
	  for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	  return accum;
	}

	// Return a random integer between `min` and `max` (inclusive).
	function random(min, max) {
	  if (max == null) {
	    max = min;
	    min = 0;
	  }
	  return min + Math.floor(Math.random() * (max - min + 1));
	}

	// A (possibly faster) way to get the current timestamp as an integer.
	var now = Date.now || function() {
	  return new Date().getTime();
	};

	// Internal helper to generate functions for escaping and unescaping strings
	// to/from HTML interpolation.
	function createEscaper(map) {
	  var escaper = function(match) {
	    return map[match];
	  };
	  // Regexes for identifying a key that needs to be escaped.
	  var source = '(?:' + keys(map).join('|') + ')';
	  var testRegexp = RegExp(source);
	  var replaceRegexp = RegExp(source, 'g');
	  return function(string) {
	    string = string == null ? '' : '' + string;
	    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	  };
	}

	// Internal list of HTML entities for escaping.
	var escapeMap = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#x27;',
	  '`': '&#x60;'
	};

	// Function for escaping strings to HTML interpolation.
	var _escape = createEscaper(escapeMap);

	// Internal list of HTML entities for unescaping.
	var unescapeMap = invert(escapeMap);

	// Function for unescaping strings from HTML interpolation.
	var _unescape = createEscaper(unescapeMap);

	// By default, Underscore uses ERB-style template delimiters. Change the
	// following template settings to use alternative delimiters.
	var templateSettings = _$1.templateSettings = {
	  evaluate: /<%([\s\S]+?)%>/g,
	  interpolate: /<%=([\s\S]+?)%>/g,
	  escape: /<%-([\s\S]+?)%>/g
	};

	// When customizing `_.templateSettings`, if you don't want to define an
	// interpolation, evaluation or escaping regex, we need one that is
	// guaranteed not to match.
	var noMatch = /(.)^/;

	// Certain characters need to be escaped so that they can be put into a
	// string literal.
	var escapes = {
	  "'": "'",
	  '\\': '\\',
	  '\r': 'r',
	  '\n': 'n',
	  '\u2028': 'u2028',
	  '\u2029': 'u2029'
	};

	var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

	function escapeChar(match) {
	  return '\\' + escapes[match];
	}

	// In order to prevent third-party code injection through
	// `_.templateSettings.variable`, we test it against the following regular
	// expression. It is intentionally a bit more liberal than just matching valid
	// identifiers, but still prevents possible loopholes through defaults or
	// destructuring assignment.
	var bareIdentifier = /^\s*(\w|\$)+\s*$/;

	// JavaScript micro-templating, similar to John Resig's implementation.
	// Underscore templating handles arbitrary delimiters, preserves whitespace,
	// and correctly escapes quotes within interpolated code.
	// NB: `oldSettings` only exists for backwards compatibility.
	function template(text, settings, oldSettings) {
	  if (!settings && oldSettings) settings = oldSettings;
	  settings = defaults({}, settings, _$1.templateSettings);

	  // Combine delimiters into one regular expression via alternation.
	  var matcher = RegExp([
	    (settings.escape || noMatch).source,
	    (settings.interpolate || noMatch).source,
	    (settings.evaluate || noMatch).source
	  ].join('|') + '|$', 'g');

	  // Compile the template source, escaping string literals appropriately.
	  var index = 0;
	  var source = "__p+='";
	  text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
	    index = offset + match.length;

	    if (escape) {
	      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	    } else if (interpolate) {
	      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	    } else if (evaluate) {
	      source += "';\n" + evaluate + "\n__p+='";
	    }

	    // Adobe VMs need the match returned to produce the correct offset.
	    return match;
	  });
	  source += "';\n";

	  var argument = settings.variable;
	  if (argument) {
	    // Insure against third-party code injection. (CVE-2021-23358)
	    if (!bareIdentifier.test(argument)) throw new Error(
	      'variable is not a bare identifier: ' + argument
	    );
	  } else {
	    // If a variable is not specified, place data values in local scope.
	    source = 'with(obj||{}){\n' + source + '}\n';
	    argument = 'obj';
	  }

	  source = "var __t,__p='',__j=Array.prototype.join," +
	    "print=function(){__p+=__j.call(arguments,'');};\n" +
	    source + 'return __p;\n';

	  var render;
	  try {
	    render = new Function(argument, '_', source);
	  } catch (e) {
	    e.source = source;
	    throw e;
	  }

	  var template = function(data) {
	    return render.call(this, data, _$1);
	  };

	  // Provide the compiled source as a convenience for precompilation.
	  template.source = 'function(' + argument + '){\n' + source + '}';

	  return template;
	}

	// Traverses the children of `obj` along `path`. If a child is a function, it
	// is invoked with its parent as context. Returns the value of the final
	// child, or `fallback` if any child is undefined.
	function result(obj, path, fallback) {
	  path = toPath(path);
	  var length = path.length;
	  if (!length) {
	    return isFunction$1(fallback) ? fallback.call(obj) : fallback;
	  }
	  for (var i = 0; i < length; i++) {
	    var prop = obj == null ? void 0 : obj[path[i]];
	    if (prop === void 0) {
	      prop = fallback;
	      i = length; // Ensure we don't continue iterating.
	    }
	    obj = isFunction$1(prop) ? prop.call(obj) : prop;
	  }
	  return obj;
	}

	// Generate a unique integer id (unique within the entire client session).
	// Useful for temporary DOM ids.
	var idCounter = 0;
	function uniqueId(prefix) {
	  var id = ++idCounter + '';
	  return prefix ? prefix + id : id;
	}

	// Start chaining a wrapped Underscore object.
	function chain(obj) {
	  var instance = _$1(obj);
	  instance._chain = true;
	  return instance;
	}

	// Internal function to execute `sourceFunc` bound to `context` with optional
	// `args`. Determines whether to execute a function as a constructor or as a
	// normal function.
	function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
	  if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	  var self = baseCreate(sourceFunc.prototype);
	  var result = sourceFunc.apply(self, args);
	  if (isObject(result)) return result;
	  return self;
	}

	// Partially apply a function by creating a version that has had some of its
	// arguments pre-filled, without changing its dynamic `this` context. `_` acts
	// as a placeholder by default, allowing any combination of arguments to be
	// pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
	var partial = restArguments(function(func, boundArgs) {
	  var placeholder = partial.placeholder;
	  var bound = function() {
	    var position = 0, length = boundArgs.length;
	    var args = Array(length);
	    for (var i = 0; i < length; i++) {
	      args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
	    }
	    while (position < arguments.length) args.push(arguments[position++]);
	    return executeBound(func, bound, this, this, args);
	  };
	  return bound;
	});

	partial.placeholder = _$1;

	// Create a function bound to a given object (assigning `this`, and arguments,
	// optionally).
	var bind = restArguments(function(func, context, args) {
	  if (!isFunction$1(func)) throw new TypeError('Bind must be called on a function');
	  var bound = restArguments(function(callArgs) {
	    return executeBound(func, bound, context, this, args.concat(callArgs));
	  });
	  return bound;
	});

	// Internal helper for collection methods to determine whether a collection
	// should be iterated as an array or as an object.
	// Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	var isArrayLike = createSizePropertyCheck(getLength);

	// Internal implementation of a recursive `flatten` function.
	function flatten$1(input, depth, strict, output) {
	  output = output || [];
	  if (!depth && depth !== 0) {
	    depth = Infinity;
	  } else if (depth <= 0) {
	    return output.concat(input);
	  }
	  var idx = output.length;
	  for (var i = 0, length = getLength(input); i < length; i++) {
	    var value = input[i];
	    if (isArrayLike(value) && (isArray(value) || isArguments$1(value))) {
	      // Flatten current level of array or arguments object.
	      if (depth > 1) {
	        flatten$1(value, depth - 1, strict, output);
	        idx = output.length;
	      } else {
	        var j = 0, len = value.length;
	        while (j < len) output[idx++] = value[j++];
	      }
	    } else if (!strict) {
	      output[idx++] = value;
	    }
	  }
	  return output;
	}

	// Bind a number of an object's methods to that object. Remaining arguments
	// are the method names to be bound. Useful for ensuring that all callbacks
	// defined on an object belong to it.
	var bindAll = restArguments(function(obj, keys) {
	  keys = flatten$1(keys, false, false);
	  var index = keys.length;
	  if (index < 1) throw new Error('bindAll must be passed function names');
	  while (index--) {
	    var key = keys[index];
	    obj[key] = bind(obj[key], obj);
	  }
	  return obj;
	});

	// Memoize an expensive function by storing its results.
	function memoize(func, hasher) {
	  var memoize = function(key) {
	    var cache = memoize.cache;
	    var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	    if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
	    return cache[address];
	  };
	  memoize.cache = {};
	  return memoize;
	}

	// Delays a function for the given number of milliseconds, and then calls
	// it with the arguments supplied.
	var delay = restArguments(function(func, wait, args) {
	  return setTimeout(function() {
	    return func.apply(null, args);
	  }, wait);
	});

	// Defers a function, scheduling it to run after the current call stack has
	// cleared.
	var defer = partial(delay, _$1, 1);

	// Returns a function, that, when invoked, will only be triggered at most once
	// during a given window of time. Normally, the throttled function will run
	// as much as it can, without ever going more than once per `wait` duration;
	// but if you'd like to disable the execution on the leading edge, pass
	// `{leading: false}`. To disable execution on the trailing edge, ditto.
	function throttle(func, wait, options) {
	  var timeout, context, args, result;
	  var previous = 0;
	  if (!options) options = {};

	  var later = function() {
	    previous = options.leading === false ? 0 : now();
	    timeout = null;
	    result = func.apply(context, args);
	    if (!timeout) context = args = null;
	  };

	  var throttled = function() {
	    var _now = now();
	    if (!previous && options.leading === false) previous = _now;
	    var remaining = wait - (_now - previous);
	    context = this;
	    args = arguments;
	    if (remaining <= 0 || remaining > wait) {
	      if (timeout) {
	        clearTimeout(timeout);
	        timeout = null;
	      }
	      previous = _now;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    } else if (!timeout && options.trailing !== false) {
	      timeout = setTimeout(later, remaining);
	    }
	    return result;
	  };

	  throttled.cancel = function() {
	    clearTimeout(timeout);
	    previous = 0;
	    timeout = context = args = null;
	  };

	  return throttled;
	}

	// When a sequence of calls of the returned function ends, the argument
	// function is triggered. The end of a sequence is defined by the `wait`
	// parameter. If `immediate` is passed, the argument function will be
	// triggered at the beginning of the sequence instead of at the end.
	function debounce(func, wait, immediate) {
	  var timeout, previous, args, result, context;

	  var later = function() {
	    var passed = now() - previous;
	    if (wait > passed) {
	      timeout = setTimeout(later, wait - passed);
	    } else {
	      timeout = null;
	      if (!immediate) result = func.apply(context, args);
	      // This check is needed because `func` can recursively invoke `debounced`.
	      if (!timeout) args = context = null;
	    }
	  };

	  var debounced = restArguments(function(_args) {
	    context = this;
	    args = _args;
	    previous = now();
	    if (!timeout) {
	      timeout = setTimeout(later, wait);
	      if (immediate) result = func.apply(context, args);
	    }
	    return result;
	  });

	  debounced.cancel = function() {
	    clearTimeout(timeout);
	    timeout = args = context = null;
	  };

	  return debounced;
	}

	// Returns the first function passed as an argument to the second,
	// allowing you to adjust arguments, run code before and after, and
	// conditionally execute the original function.
	function wrap(func, wrapper) {
	  return partial(wrapper, func);
	}

	// Returns a negated version of the passed-in predicate.
	function negate(predicate) {
	  return function() {
	    return !predicate.apply(this, arguments);
	  };
	}

	// Returns a function that is the composition of a list of functions, each
	// consuming the return value of the function that follows.
	function compose() {
	  var args = arguments;
	  var start = args.length - 1;
	  return function() {
	    var i = start;
	    var result = args[start].apply(this, arguments);
	    while (i--) result = args[i].call(this, result);
	    return result;
	  };
	}

	// Returns a function that will only be executed on and after the Nth call.
	function after(times, func) {
	  return function() {
	    if (--times < 1) {
	      return func.apply(this, arguments);
	    }
	  };
	}

	// Returns a function that will only be executed up to (but not including) the
	// Nth call.
	function before(times, func) {
	  var memo;
	  return function() {
	    if (--times > 0) {
	      memo = func.apply(this, arguments);
	    }
	    if (times <= 1) func = null;
	    return memo;
	  };
	}

	// Returns a function that will be executed at most one time, no matter how
	// often you call it. Useful for lazy initialization.
	var once = partial(before, 2);

	// Returns the first key on an object that passes a truth test.
	function findKey(obj, predicate, context) {
	  predicate = cb(predicate, context);
	  var _keys = keys(obj), key;
	  for (var i = 0, length = _keys.length; i < length; i++) {
	    key = _keys[i];
	    if (predicate(obj[key], key, obj)) return key;
	  }
	}

	// Internal function to generate `_.findIndex` and `_.findLastIndex`.
	function createPredicateIndexFinder(dir) {
	  return function(array, predicate, context) {
	    predicate = cb(predicate, context);
	    var length = getLength(array);
	    var index = dir > 0 ? 0 : length - 1;
	    for (; index >= 0 && index < length; index += dir) {
	      if (predicate(array[index], index, array)) return index;
	    }
	    return -1;
	  };
	}

	// Returns the first index on an array-like that passes a truth test.
	var findIndex = createPredicateIndexFinder(1);

	// Returns the last index on an array-like that passes a truth test.
	var findLastIndex = createPredicateIndexFinder(-1);

	// Use a comparator function to figure out the smallest index at which
	// an object should be inserted so as to maintain order. Uses binary search.
	function sortedIndex(array, obj, iteratee, context) {
	  iteratee = cb(iteratee, context, 1);
	  var value = iteratee(obj);
	  var low = 0, high = getLength(array);
	  while (low < high) {
	    var mid = Math.floor((low + high) / 2);
	    if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	  }
	  return low;
	}

	// Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
	function createIndexFinder(dir, predicateFind, sortedIndex) {
	  return function(array, item, idx) {
	    var i = 0, length = getLength(array);
	    if (typeof idx == 'number') {
	      if (dir > 0) {
	        i = idx >= 0 ? idx : Math.max(idx + length, i);
	      } else {
	        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	      }
	    } else if (sortedIndex && idx && length) {
	      idx = sortedIndex(array, item);
	      return array[idx] === item ? idx : -1;
	    }
	    if (item !== item) {
	      idx = predicateFind(slice.call(array, i, length), isNaN$1);
	      return idx >= 0 ? idx + i : -1;
	    }
	    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	      if (array[idx] === item) return idx;
	    }
	    return -1;
	  };
	}

	// Return the position of the first occurrence of an item in an array,
	// or -1 if the item is not included in the array.
	// If the array is large and already in sort order, pass `true`
	// for **isSorted** to use binary search.
	var indexOf = createIndexFinder(1, findIndex, sortedIndex);

	// Return the position of the last occurrence of an item in an array,
	// or -1 if the item is not included in the array.
	var lastIndexOf = createIndexFinder(-1, findLastIndex);

	// Return the first value which passes a truth test.
	function find(obj, predicate, context) {
	  var keyFinder = isArrayLike(obj) ? findIndex : findKey;
	  var key = keyFinder(obj, predicate, context);
	  if (key !== void 0 && key !== -1) return obj[key];
	}

	// Convenience version of a common use case of `_.find`: getting the first
	// object containing specific `key:value` pairs.
	function findWhere(obj, attrs) {
	  return find(obj, matcher(attrs));
	}

	// The cornerstone for collection functions, an `each`
	// implementation, aka `forEach`.
	// Handles raw objects in addition to array-likes. Treats all
	// sparse array-likes as if they were dense.
	function each(obj, iteratee, context) {
	  iteratee = optimizeCb(iteratee, context);
	  var i, length;
	  if (isArrayLike(obj)) {
	    for (i = 0, length = obj.length; i < length; i++) {
	      iteratee(obj[i], i, obj);
	    }
	  } else {
	    var _keys = keys(obj);
	    for (i = 0, length = _keys.length; i < length; i++) {
	      iteratee(obj[_keys[i]], _keys[i], obj);
	    }
	  }
	  return obj;
	}

	// Return the results of applying the iteratee to each element.
	function map(obj, iteratee, context) {
	  iteratee = cb(iteratee, context);
	  var _keys = !isArrayLike(obj) && keys(obj),
	      length = (_keys || obj).length,
	      results = Array(length);
	  for (var index = 0; index < length; index++) {
	    var currentKey = _keys ? _keys[index] : index;
	    results[index] = iteratee(obj[currentKey], currentKey, obj);
	  }
	  return results;
	}

	// Internal helper to create a reducing function, iterating left or right.
	function createReduce(dir) {
	  // Wrap code that reassigns argument variables in a separate function than
	  // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
	  var reducer = function(obj, iteratee, memo, initial) {
	    var _keys = !isArrayLike(obj) && keys(obj),
	        length = (_keys || obj).length,
	        index = dir > 0 ? 0 : length - 1;
	    if (!initial) {
	      memo = obj[_keys ? _keys[index] : index];
	      index += dir;
	    }
	    for (; index >= 0 && index < length; index += dir) {
	      var currentKey = _keys ? _keys[index] : index;
	      memo = iteratee(memo, obj[currentKey], currentKey, obj);
	    }
	    return memo;
	  };

	  return function(obj, iteratee, memo, context) {
	    var initial = arguments.length >= 3;
	    return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
	  };
	}

	// **Reduce** builds up a single result from a list of values, aka `inject`,
	// or `foldl`.
	var reduce = createReduce(1);

	// The right-associative version of reduce, also known as `foldr`.
	var reduceRight = createReduce(-1);

	// Return all the elements that pass a truth test.
	function filter(obj, predicate, context) {
	  var results = [];
	  predicate = cb(predicate, context);
	  each(obj, function(value, index, list) {
	    if (predicate(value, index, list)) results.push(value);
	  });
	  return results;
	}

	// Return all the elements for which a truth test fails.
	function reject(obj, predicate, context) {
	  return filter(obj, negate(cb(predicate)), context);
	}

	// Determine whether all of the elements pass a truth test.
	function every(obj, predicate, context) {
	  predicate = cb(predicate, context);
	  var _keys = !isArrayLike(obj) && keys(obj),
	      length = (_keys || obj).length;
	  for (var index = 0; index < length; index++) {
	    var currentKey = _keys ? _keys[index] : index;
	    if (!predicate(obj[currentKey], currentKey, obj)) return false;
	  }
	  return true;
	}

	// Determine if at least one element in the object passes a truth test.
	function some(obj, predicate, context) {
	  predicate = cb(predicate, context);
	  var _keys = !isArrayLike(obj) && keys(obj),
	      length = (_keys || obj).length;
	  for (var index = 0; index < length; index++) {
	    var currentKey = _keys ? _keys[index] : index;
	    if (predicate(obj[currentKey], currentKey, obj)) return true;
	  }
	  return false;
	}

	// Determine if the array or object contains a given item (using `===`).
	function contains(obj, item, fromIndex, guard) {
	  if (!isArrayLike(obj)) obj = values(obj);
	  if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	  return indexOf(obj, item, fromIndex) >= 0;
	}

	// Invoke a method (with arguments) on every item in a collection.
	var invoke = restArguments(function(obj, path, args) {
	  var contextPath, func;
	  if (isFunction$1(path)) {
	    func = path;
	  } else {
	    path = toPath(path);
	    contextPath = path.slice(0, -1);
	    path = path[path.length - 1];
	  }
	  return map(obj, function(context) {
	    var method = func;
	    if (!method) {
	      if (contextPath && contextPath.length) {
	        context = deepGet(context, contextPath);
	      }
	      if (context == null) return void 0;
	      method = context[path];
	    }
	    return method == null ? method : method.apply(context, args);
	  });
	});

	// Convenience version of a common use case of `_.map`: fetching a property.
	function pluck(obj, key) {
	  return map(obj, property(key));
	}

	// Convenience version of a common use case of `_.filter`: selecting only
	// objects containing specific `key:value` pairs.
	function where(obj, attrs) {
	  return filter(obj, matcher(attrs));
	}

	// Return the maximum element (or element-based computation).
	function max(obj, iteratee, context) {
	  var result = -Infinity, lastComputed = -Infinity,
	      value, computed;
	  if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
	    obj = isArrayLike(obj) ? obj : values(obj);
	    for (var i = 0, length = obj.length; i < length; i++) {
	      value = obj[i];
	      if (value != null && value > result) {
	        result = value;
	      }
	    }
	  } else {
	    iteratee = cb(iteratee, context);
	    each(obj, function(v, index, list) {
	      computed = iteratee(v, index, list);
	      if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	        result = v;
	        lastComputed = computed;
	      }
	    });
	  }
	  return result;
	}

	// Return the minimum element (or element-based computation).
	function min(obj, iteratee, context) {
	  var result = Infinity, lastComputed = Infinity,
	      value, computed;
	  if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
	    obj = isArrayLike(obj) ? obj : values(obj);
	    for (var i = 0, length = obj.length; i < length; i++) {
	      value = obj[i];
	      if (value != null && value < result) {
	        result = value;
	      }
	    }
	  } else {
	    iteratee = cb(iteratee, context);
	    each(obj, function(v, index, list) {
	      computed = iteratee(v, index, list);
	      if (computed < lastComputed || computed === Infinity && result === Infinity) {
	        result = v;
	        lastComputed = computed;
	      }
	    });
	  }
	  return result;
	}

	// Sample **n** random values from a collection using the modern version of the
	// [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	// If **n** is not specified, returns a single random element.
	// The internal `guard` argument allows it to work with `_.map`.
	function sample(obj, n, guard) {
	  if (n == null || guard) {
	    if (!isArrayLike(obj)) obj = values(obj);
	    return obj[random(obj.length - 1)];
	  }
	  var sample = isArrayLike(obj) ? clone(obj) : values(obj);
	  var length = getLength(sample);
	  n = Math.max(Math.min(n, length), 0);
	  var last = length - 1;
	  for (var index = 0; index < n; index++) {
	    var rand = random(index, last);
	    var temp = sample[index];
	    sample[index] = sample[rand];
	    sample[rand] = temp;
	  }
	  return sample.slice(0, n);
	}

	// Shuffle a collection.
	function shuffle(obj) {
	  return sample(obj, Infinity);
	}

	// Sort the object's values by a criterion produced by an iteratee.
	function sortBy(obj, iteratee, context) {
	  var index = 0;
	  iteratee = cb(iteratee, context);
	  return pluck(map(obj, function(value, key, list) {
	    return {
	      value: value,
	      index: index++,
	      criteria: iteratee(value, key, list)
	    };
	  }).sort(function(left, right) {
	    var a = left.criteria;
	    var b = right.criteria;
	    if (a !== b) {
	      if (a > b || a === void 0) return 1;
	      if (a < b || b === void 0) return -1;
	    }
	    return left.index - right.index;
	  }), 'value');
	}

	// An internal function used for aggregate "group by" operations.
	function group(behavior, partition) {
	  return function(obj, iteratee, context) {
	    var result = partition ? [[], []] : {};
	    iteratee = cb(iteratee, context);
	    each(obj, function(value, index) {
	      var key = iteratee(value, index, obj);
	      behavior(result, value, key);
	    });
	    return result;
	  };
	}

	// Groups the object's values by a criterion. Pass either a string attribute
	// to group by, or a function that returns the criterion.
	var groupBy = group(function(result, value, key) {
	  if (has$1(result, key)) result[key].push(value); else result[key] = [value];
	});

	// Indexes the object's values by a criterion, similar to `_.groupBy`, but for
	// when you know that your index values will be unique.
	var indexBy = group(function(result, value, key) {
	  result[key] = value;
	});

	// Counts instances of an object that group by a certain criterion. Pass
	// either a string attribute to count by, or a function that returns the
	// criterion.
	var countBy = group(function(result, value, key) {
	  if (has$1(result, key)) result[key]++; else result[key] = 1;
	});

	// Split a collection into two arrays: one whose elements all pass the given
	// truth test, and one whose elements all do not pass the truth test.
	var partition = group(function(result, value, pass) {
	  result[pass ? 0 : 1].push(value);
	}, true);

	// Safely create a real, live array from anything iterable.
	var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
	function toArray(obj) {
	  if (!obj) return [];
	  if (isArray(obj)) return slice.call(obj);
	  if (isString(obj)) {
	    // Keep surrogate pair characters together.
	    return obj.match(reStrSymbol);
	  }
	  if (isArrayLike(obj)) return map(obj, identity);
	  return values(obj);
	}

	// Return the number of elements in a collection.
	function size(obj) {
	  if (obj == null) return 0;
	  return isArrayLike(obj) ? obj.length : keys(obj).length;
	}

	// Internal `_.pick` helper function to determine whether `key` is an enumerable
	// property name of `obj`.
	function keyInObj(value, key, obj) {
	  return key in obj;
	}

	// Return a copy of the object only containing the allowed properties.
	var pick = restArguments(function(obj, keys) {
	  var result = {}, iteratee = keys[0];
	  if (obj == null) return result;
	  if (isFunction$1(iteratee)) {
	    if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
	    keys = allKeys(obj);
	  } else {
	    iteratee = keyInObj;
	    keys = flatten$1(keys, false, false);
	    obj = Object(obj);
	  }
	  for (var i = 0, length = keys.length; i < length; i++) {
	    var key = keys[i];
	    var value = obj[key];
	    if (iteratee(value, key, obj)) result[key] = value;
	  }
	  return result;
	});

	// Return a copy of the object without the disallowed properties.
	var omit = restArguments(function(obj, keys) {
	  var iteratee = keys[0], context;
	  if (isFunction$1(iteratee)) {
	    iteratee = negate(iteratee);
	    if (keys.length > 1) context = keys[1];
	  } else {
	    keys = map(flatten$1(keys, false, false), String);
	    iteratee = function(value, key) {
	      return !contains(keys, key);
	    };
	  }
	  return pick(obj, iteratee, context);
	});

	// Returns everything but the last entry of the array. Especially useful on
	// the arguments object. Passing **n** will return all the values in
	// the array, excluding the last N.
	function initial(array, n, guard) {
	  return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	}

	// Get the first element of an array. Passing **n** will return the first N
	// values in the array. The **guard** check allows it to work with `_.map`.
	function first(array, n, guard) {
	  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
	  if (n == null || guard) return array[0];
	  return initial(array, array.length - n);
	}

	// Returns everything but the first entry of the `array`. Especially useful on
	// the `arguments` object. Passing an **n** will return the rest N values in the
	// `array`.
	function rest(array, n, guard) {
	  return slice.call(array, n == null || guard ? 1 : n);
	}

	// Get the last element of an array. Passing **n** will return the last N
	// values in the array.
	function last(array, n, guard) {
	  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
	  if (n == null || guard) return array[array.length - 1];
	  return rest(array, Math.max(0, array.length - n));
	}

	// Trim out all falsy values from an array.
	function compact(array) {
	  return filter(array, Boolean);
	}

	// Flatten out an array, either recursively (by default), or up to `depth`.
	// Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
	function flatten(array, depth) {
	  return flatten$1(array, depth, false);
	}

	// Take the difference between one array and a number of other arrays.
	// Only the elements present in just the first array will remain.
	var difference = restArguments(function(array, rest) {
	  rest = flatten$1(rest, true, true);
	  return filter(array, function(value){
	    return !contains(rest, value);
	  });
	});

	// Return a version of the array that does not contain the specified value(s).
	var without = restArguments(function(array, otherArrays) {
	  return difference(array, otherArrays);
	});

	// Produce a duplicate-free version of the array. If the array has already
	// been sorted, you have the option of using a faster algorithm.
	// The faster algorithm will not work with an iteratee if the iteratee
	// is not a one-to-one function, so providing an iteratee will disable
	// the faster algorithm.
	function uniq(array, isSorted, iteratee, context) {
	  if (!isBoolean(isSorted)) {
	    context = iteratee;
	    iteratee = isSorted;
	    isSorted = false;
	  }
	  if (iteratee != null) iteratee = cb(iteratee, context);
	  var result = [];
	  var seen = [];
	  for (var i = 0, length = getLength(array); i < length; i++) {
	    var value = array[i],
	        computed = iteratee ? iteratee(value, i, array) : value;
	    if (isSorted && !iteratee) {
	      if (!i || seen !== computed) result.push(value);
	      seen = computed;
	    } else if (iteratee) {
	      if (!contains(seen, computed)) {
	        seen.push(computed);
	        result.push(value);
	      }
	    } else if (!contains(result, value)) {
	      result.push(value);
	    }
	  }
	  return result;
	}

	// Produce an array that contains the union: each distinct element from all of
	// the passed-in arrays.
	var union = restArguments(function(arrays) {
	  return uniq(flatten$1(arrays, true, true));
	});

	// Produce an array that contains every item shared between all the
	// passed-in arrays.
	function intersection(array) {
	  var result = [];
	  var argsLength = arguments.length;
	  for (var i = 0, length = getLength(array); i < length; i++) {
	    var item = array[i];
	    if (contains(result, item)) continue;
	    var j;
	    for (j = 1; j < argsLength; j++) {
	      if (!contains(arguments[j], item)) break;
	    }
	    if (j === argsLength) result.push(item);
	  }
	  return result;
	}

	// Complement of zip. Unzip accepts an array of arrays and groups
	// each array's elements on shared indices.
	function unzip(array) {
	  var length = array && max(array, getLength).length || 0;
	  var result = Array(length);

	  for (var index = 0; index < length; index++) {
	    result[index] = pluck(array, index);
	  }
	  return result;
	}

	// Zip together multiple lists into a single array -- elements that share
	// an index go together.
	var zip = restArguments(unzip);

	// Converts lists into objects. Pass either a single array of `[key, value]`
	// pairs, or two parallel arrays of the same length -- one of keys, and one of
	// the corresponding values. Passing by pairs is the reverse of `_.pairs`.
	function object(list, values) {
	  var result = {};
	  for (var i = 0, length = getLength(list); i < length; i++) {
	    if (values) {
	      result[list[i]] = values[i];
	    } else {
	      result[list[i][0]] = list[i][1];
	    }
	  }
	  return result;
	}

	// Generate an integer Array containing an arithmetic progression. A port of
	// the native Python `range()` function. See
	// [the Python documentation](https://docs.python.org/library/functions.html#range).
	function range(start, stop, step) {
	  if (stop == null) {
	    stop = start || 0;
	    start = 0;
	  }
	  if (!step) {
	    step = stop < start ? -1 : 1;
	  }

	  var length = Math.max(Math.ceil((stop - start) / step), 0);
	  var range = Array(length);

	  for (var idx = 0; idx < length; idx++, start += step) {
	    range[idx] = start;
	  }

	  return range;
	}

	// Chunk a single array into multiple arrays, each containing `count` or fewer
	// items.
	function chunk(array, count) {
	  if (count == null || count < 1) return [];
	  var result = [];
	  var i = 0, length = array.length;
	  while (i < length) {
	    result.push(slice.call(array, i, i += count));
	  }
	  return result;
	}

	// Helper function to continue chaining intermediate results.
	function chainResult(instance, obj) {
	  return instance._chain ? _$1(obj).chain() : obj;
	}

	// Add your own custom functions to the Underscore object.
	function mixin(obj) {
	  each(functions(obj), function(name) {
	    var func = _$1[name] = obj[name];
	    _$1.prototype[name] = function() {
	      var args = [this._wrapped];
	      push.apply(args, arguments);
	      return chainResult(this, func.apply(_$1, args));
	    };
	  });
	  return _$1;
	}

	// Add all mutator `Array` functions to the wrapper.
	each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	  var method = ArrayProto[name];
	  _$1.prototype[name] = function() {
	    var obj = this._wrapped;
	    if (obj != null) {
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) {
	        delete obj[0];
	      }
	    }
	    return chainResult(this, obj);
	  };
	});

	// Add all accessor `Array` functions to the wrapper.
	each(['concat', 'join', 'slice'], function(name) {
	  var method = ArrayProto[name];
	  _$1.prototype[name] = function() {
	    var obj = this._wrapped;
	    if (obj != null) obj = method.apply(obj, arguments);
	    return chainResult(this, obj);
	  };
	});

	// Named Exports

	var allExports = /*#__PURE__*/Object.freeze({
		__proto__: null,
		VERSION: VERSION,
		restArguments: restArguments,
		isObject: isObject,
		isNull: isNull,
		isUndefined: isUndefined,
		isBoolean: isBoolean,
		isElement: isElement,
		isString: isString,
		isNumber: isNumber,
		isDate: isDate,
		isRegExp: isRegExp,
		isError: isError,
		isSymbol: isSymbol,
		isArrayBuffer: isArrayBuffer,
		isDataView: isDataView$1,
		isArray: isArray,
		isFunction: isFunction$1,
		isArguments: isArguments$1,
		isFinite: isFinite$1,
		isNaN: isNaN$1,
		isTypedArray: isTypedArray$1,
		isEmpty: isEmpty,
		isMatch: isMatch,
		isEqual: isEqual,
		isMap: isMap,
		isWeakMap: isWeakMap,
		isSet: isSet,
		isWeakSet: isWeakSet,
		keys: keys,
		allKeys: allKeys,
		values: values,
		pairs: pairs,
		invert: invert,
		functions: functions,
		methods: functions,
		extend: extend,
		extendOwn: extendOwn,
		assign: extendOwn,
		defaults: defaults,
		create: create,
		clone: clone,
		tap: tap,
		get: get,
		has: has,
		mapObject: mapObject,
		identity: identity,
		constant: constant,
		noop: noop,
		toPath: toPath$1,
		property: property,
		propertyOf: propertyOf,
		matcher: matcher,
		matches: matcher,
		times: times,
		random: random,
		now: now,
		escape: _escape,
		unescape: _unescape,
		templateSettings: templateSettings,
		template: template,
		result: result,
		uniqueId: uniqueId,
		chain: chain,
		iteratee: iteratee,
		partial: partial,
		bind: bind,
		bindAll: bindAll,
		memoize: memoize,
		delay: delay,
		defer: defer,
		throttle: throttle,
		debounce: debounce,
		wrap: wrap,
		negate: negate,
		compose: compose,
		after: after,
		before: before,
		once: once,
		findKey: findKey,
		findIndex: findIndex,
		findLastIndex: findLastIndex,
		sortedIndex: sortedIndex,
		indexOf: indexOf,
		lastIndexOf: lastIndexOf,
		find: find,
		detect: find,
		findWhere: findWhere,
		each: each,
		forEach: each,
		map: map,
		collect: map,
		reduce: reduce,
		foldl: reduce,
		inject: reduce,
		reduceRight: reduceRight,
		foldr: reduceRight,
		filter: filter,
		select: filter,
		reject: reject,
		every: every,
		all: every,
		some: some,
		any: some,
		contains: contains,
		includes: contains,
		include: contains,
		invoke: invoke,
		pluck: pluck,
		where: where,
		max: max,
		min: min,
		shuffle: shuffle,
		sample: sample,
		sortBy: sortBy,
		groupBy: groupBy,
		indexBy: indexBy,
		countBy: countBy,
		partition: partition,
		toArray: toArray,
		size: size,
		pick: pick,
		omit: omit,
		first: first,
		head: first,
		take: first,
		initial: initial,
		last: last,
		rest: rest,
		tail: rest,
		drop: rest,
		compact: compact,
		flatten: flatten,
		without: without,
		uniq: uniq,
		unique: uniq,
		union: union,
		intersection: intersection,
		difference: difference,
		unzip: unzip,
		transpose: unzip,
		zip: zip,
		object: object,
		range: range,
		chunk: chunk,
		mixin: mixin,
		'default': _$1
	});

	// Default Export

	// Add all of the Underscore functions to the wrapper object.
	var _ = mixin(allExports);
	// Legacy Node.js API.
	_._ = _;

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */

	function __decorate(decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	}

	function __metadata(metadataKey, metadataValue) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
	}

	class Settings {
	    constructor() {
	        this.libraries = [];
	    }
	    get hasLibraries() {
	        return this.libraries.length > 0;
	    }
	    sort() {
	        this.libraries = _.sortBy(this.libraries, x => x.sortKey);
	    }
	    isFavourite(code) {
	        const found = _.find(this.libraries, x => x.code == code);
	        return found.favourite;
	    }
	    save() {
	        localStorage.setItem('settings', JSON.stringify(this));
	    }
	    static load() {
	        const existing = localStorage.getItem('settings');
	        if (existing) {
	            return plainToClass(Settings, JSON.parse(existing));
	        }
	        const created = new Settings();
	        created.save();
	        return created;
	    }
	}
	__decorate([
	    Type(() => Library),
	    __metadata("design:type", Array)
	], Settings.prototype, "libraries", void 0);
	class Library {
	    get sortKey() {
	        var _a;
	        let key = this.name;
	        // Some libraries prefix their names - e.g. "(CBA) Bamber Bridge"
	        const match = /^\([A-Z0-9]{3}\) (.+)/.exec(this.name);
	        if ((_a = match === null || match === void 0 ? void 0 : match.length) !== null && _a !== void 0 ? _a : 0 > 0) {
	            // Remove the prefix
	            key = match[1];
	        }
	        // Show available copies above copies that are on loan.
	        return `${this.favourite ? 0 : 1}-${key}`;
	    }
	}

	class ServiceResult {
	    constructor(service, code, favourite) {
	        this.service = service;
	        this.code = code;
	        this.favourite = favourite;
	    }
	    get sortKey() {
	        return `${this.favourite ? 0 : 1}-${this.service}`;
	    }
	}
	class AvailabilityResult {
	    constructor(url, library, available, total, isbn) {
	        this.url = url;
	        this.library = library;
	        this.available = available;
	        this.total = total;
	        this.isbn = isbn;
	    }
	    get sortKey() {
	        var _a;
	        let library = this.library;
	        // Some libraries prefix their names - e.g. "(CBA) Bamber Bridge"
	        const match = /^\([A-Z0-9]{3}\) (.+)/.exec(library);
	        if ((_a = match === null || match === void 0 ? void 0 : match.length) !== null && _a !== void 0 ? _a : 0 > 0) {
	            // Remove the prefix
	            library = match[1];
	        }
	        // Show available copies above copies that are on loan.
	        return `${this.available > 0 ? 0 : 1}-${library}`;
	    }
	}

	class ApiService {
	    constructor() {
	        this.libraries = null;
	    }
	    async listServices(filter, existing) {
	        if (!this.libraries) {
	            this.libraries = [];
	            const response = await this.doFetch('https://libraree.azurewebsites.net/api/ListServices?code=aaFrwAhEVYJRmX5qnwWsRkInIcg8/c4AUKZ2/WugzoYTnxMk6BEKNQ==');
	            this.libraries = _.map(response, x => plainToInstance(Library, x));
	        }
	        if (filter.length < 3)
	            return [];
	        const existingIds = _.map(existing, x => x.code);
	        const items = _.filter(this.libraries, x => x.name.toLowerCase().indexOf(filter.toLowerCase()) > -1
	            && !existingIds.includes(x.code));
	        return items;
	    }
	    async findTitles(filter) {
	        const response = await this.doFetch(`https://libraree.azurewebsites.net/api/FindTitles?code=aQ4MAQPvbEQrIjMB/GeZtRrrFYFSoR/7lHZn09wKiaLU0eWa8abqeg==&filter=${encodeURIComponent(filter)}`);
	        return _.map(response, x => plainToInstance(GoogleResult, x));
	    }
	    async getEditionsByVolumeId(volumeId) {
	        return await this.doFetch(`https://libraree.azurewebsites.net/api/GetEditions?code=AlovxtL6fEbcpaYCiVIoy7tpHbJFgadz8hvaozaF4hQ6Zf9SRiy3Ww==&volumeId=${encodeURIComponent(volumeId)}`);
	    }
	    async getEditionsByIsbn(isbn) {
	        return await this.doFetch(`https://libraree.azurewebsites.net/api/GetEditions?code=AlovxtL6fEbcpaYCiVIoy7tpHbJFgadz8hvaozaF4hQ6Zf9SRiy3Ww==&isbn=${encodeURIComponent(isbn)}`);
	    }
	    async searchLibraries(isbns, settings) {
	        const promises = [];
	        // Query catalogues
	        for (const library of settings.libraries) {
	            for (const isbn of isbns) {
	                promises.push(this.doFetch(`https://libraree.azurewebsites.net/api/SearchLibrary?code=OjDK0IsVNnXEqZVQOS4F32EnUgfuIexl76Cq0BV6dFzr5sTm//yXKw==&isbn=${isbn}&service=${library.code}`));
	            }
	        }
	        const promiseResults = await Promise.all(promises);
	        let results = promiseResults.flat();
	        // We want each URL only once.
	        results = _.uniq(results, x => x.url);
	        // We only want libraries that hold stock, even if that stock is currently on loan.
	        results = _.filter(results, x => x.availability.length > 0);
	        // Begin restructuring the resultset. Group by Local Authority and then by library service.
	        const services = _.uniq(_.map(results, x => {
	            return new ServiceResult(x.service, x.code, settings.isFavourite(x.code));
	        }), x => x.code);
	        for (const service of services) {
	            // Across all ISBNs, find stock for a particular library.
	            const serviceResults = _.filter(results, x => x.code == service.code);
	            service.items = _.map(serviceResults, result => _.map(result.availability, x => {
	                return new AvailabilityResult(result.url, x.library, x.available, x.available + x.unavailable, result.isbn);
	            })).flat();
	            service.items = _.sortBy(service.items, x => x.sortKey);
	        }
	        return _.sortBy(services, x => x.sortKey);
	    }
	    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	    async doFetch(url) {
	        const response = await fetch(url);
	        return await response.json();
	    }
	}

	/* src/MyLibraries.svelte generated by Svelte v3.44.2 */
	const file$3 = "src/MyLibraries.svelte";

	function get_each_context$2(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[17] = list[i];
		return child_ctx;
	}

	function get_each_context_1$1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[20] = list[i];
		return child_ctx;
	}

	// (68:12) {#if settings.hasLibraries}
	function create_if_block_3$1(ctx) {
		let button;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				button = element("button");
				attr_dev(button, "type", "button");
				attr_dev(button, "class", "btn-close");
				attr_dev(button, "aria-label", "Close");
				add_location(button, file$3, 68, 16, 1780);
			},
			m: function mount(target, anchor) {
				insert_dev(target, button, anchor);

				if (!mounted) {
					dispose = listen_dev(button, "click", /*click_handler*/ ctx[8], false, false, false);
					mounted = true;
				}
			},
			p: noop$1,
			d: function destroy(detaching) {
				if (detaching) detach_dev(button);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_3$1.name,
			type: "if",
			source: "(68:12) {#if settings.hasLibraries}",
			ctx
		});

		return block;
	}

	// (76:12) {#if !settings.hasLibraries}
	function create_if_block_2$3(ctx) {
		let div;
		let p0;
		let t1;
		let p1;
		let t3;
		let p2;

		const block = {
			c: function create() {
				div = element("div");
				p0 = element("p");
				p0.textContent = "Before we can find books for you, we need to know where you have library memberships.";
				t1 = space();
				p1 = element("p");
				p1.textContent = "Type in the name of your Local Authority below and we'll find their library service for you.";
				t3 = space();
				p2 = element("p");
				p2.textContent = "You can add multiple libraries and choose your favourites. Your favourite libraries will appear in the search results first.";
				add_location(p0, file$3, 77, 20, 2130);
				add_location(p1, file$3, 78, 20, 2243);
				add_location(p2, file$3, 79, 20, 2363);
				attr_dev(div, "class", "m-5");
				add_location(div, file$3, 76, 16, 2092);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, p0);
				append_dev(div, t1);
				append_dev(div, p1);
				append_dev(div, t3);
				append_dev(div, p2);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_2$3.name,
			type: "if",
			source: "(76:12) {#if !settings.hasLibraries}",
			ctx
		});

		return block;
	}

	// (91:24) {#each completionOptions as option}
	function create_each_block_1$1(ctx) {
		let a;
		let t0_value = /*option*/ ctx[20].name + "";
		let t0;
		let t1;
		let mounted;
		let dispose;

		function click_handler_1() {
			return /*click_handler_1*/ ctx[10](/*option*/ ctx[20]);
		}

		const block = {
			c: function create() {
				a = element("a");
				t0 = text(t0_value);
				t1 = space();
				attr_dev(a, "href", "#add");
				attr_dev(a, "class", "list-group-item list-group-item-action list-group-item-light library-name svelte-1pkldz");
				add_location(a, file$3, 91, 24, 2972);
			},
			m: function mount(target, anchor) {
				insert_dev(target, a, anchor);
				append_dev(a, t0);
				append_dev(a, t1);

				if (!mounted) {
					dispose = listen_dev(a, "click", prevent_default(click_handler_1), false, true, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;
				if (dirty & /*completionOptions*/ 4 && t0_value !== (t0_value = /*option*/ ctx[20].name + "")) set_data_dev(t0, t0_value);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(a);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_1$1.name,
			type: "each",
			source: "(91:24) {#each completionOptions as option}",
			ctx
		});

		return block;
	}

	// (110:28) {:else}
	function create_else_block$3(ctx) {
		let a;
		let icon;
		let current;
		let mounted;
		let dispose;
		icon = new Icon({ props: { name: "heart" }, $$inline: true });

		function click_handler_3() {
			return /*click_handler_3*/ ctx[12](/*library*/ ctx[17]);
		}

		const block = {
			c: function create() {
				a = element("a");
				create_component(icon.$$.fragment);
				attr_dev(a, "class", "heart mr-10");
				attr_dev(a, "href", "#favourite");
				add_location(a, file$3, 110, 32, 3935);
			},
			m: function mount(target, anchor) {
				insert_dev(target, a, anchor);
				mount_component(icon, a, null);
				current = true;

				if (!mounted) {
					dispose = listen_dev(a, "click", prevent_default(click_handler_3), false, true, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;
			},
			i: function intro(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(a);
				destroy_component(icon);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block$3.name,
			type: "else",
			source: "(110:28) {:else}",
			ctx
		});

		return block;
	}

	// (108:28) {#if library.favourite}
	function create_if_block_1$3(ctx) {
		let a;
		let icon;
		let current;
		let mounted;
		let dispose;

		icon = new Icon({
				props: { name: "heart-fill" },
				$$inline: true
			});

		function click_handler_2() {
			return /*click_handler_2*/ ctx[11](/*library*/ ctx[17]);
		}

		const block = {
			c: function create() {
				a = element("a");
				create_component(icon.$$.fragment);
				attr_dev(a, "class", "heart mr-10");
				attr_dev(a, "href", "#favourite");
				add_location(a, file$3, 108, 32, 3740);
			},
			m: function mount(target, anchor) {
				insert_dev(target, a, anchor);
				mount_component(icon, a, null);
				current = true;

				if (!mounted) {
					dispose = listen_dev(a, "click", prevent_default(click_handler_2), false, true, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;
			},
			i: function intro(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(a);
				destroy_component(icon);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1$3.name,
			type: "if",
			source: "(108:28) {#if library.favourite}",
			ctx
		});

		return block;
	}

	// (104:16) {#each settings.libraries as library}
	function create_each_block$2(ctx) {
		let li;
		let t0_value = /*library*/ ctx[17].name + "";
		let t0;
		let t1;
		let div;
		let current_block_type_index;
		let if_block;
		let t2;
		let a;
		let icon;
		let t3;
		let li_class_value;
		let current;
		let mounted;
		let dispose;
		const if_block_creators = [create_if_block_1$3, create_else_block$3];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*library*/ ctx[17].favourite) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		icon = new Icon({
				props: { name: "trash-fill" },
				$$inline: true
			});

		function click_handler_4() {
			return /*click_handler_4*/ ctx[13](/*library*/ ctx[17]);
		}

		const block = {
			c: function create() {
				li = element("li");
				t0 = text(t0_value);
				t1 = space();
				div = element("div");
				if_block.c();
				t2 = space();
				a = element("a");
				create_component(icon.$$.fragment);
				t3 = space();
				attr_dev(a, "href", "#remove");
				add_location(a, file$3, 113, 28, 4148);
				add_location(div, file$3, 106, 24, 3650);
				attr_dev(li, "class", li_class_value = "list-group-item p-3 d-flex w-100 justify-content-between " + (/*library*/ ctx[17].favourite ? 'favourite' : '') + " svelte-1pkldz");
				add_location(li, file$3, 104, 16, 3478);
			},
			m: function mount(target, anchor) {
				insert_dev(target, li, anchor);
				append_dev(li, t0);
				append_dev(li, t1);
				append_dev(li, div);
				if_blocks[current_block_type_index].m(div, null);
				append_dev(div, t2);
				append_dev(div, a);
				mount_component(icon, a, null);
				append_dev(li, t3);
				current = true;

				if (!mounted) {
					dispose = listen_dev(a, "click", prevent_default(click_handler_4), false, true, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;
				if ((!current || dirty & /*settings*/ 1) && t0_value !== (t0_value = /*library*/ ctx[17].name + "")) set_data_dev(t0, t0_value);
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(div, t2);
				}

				if (!current || dirty & /*settings*/ 1 && li_class_value !== (li_class_value = "list-group-item p-3 d-flex w-100 justify-content-between " + (/*library*/ ctx[17].favourite ? 'favourite' : '') + " svelte-1pkldz")) {
					attr_dev(li, "class", li_class_value);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(li);
				if_blocks[current_block_type_index].d();
				destroy_component(icon);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block$2.name,
			type: "each",
			source: "(104:16) {#each settings.libraries as library}",
			ctx
		});

		return block;
	}

	// (125:8) {#if settings.hasLibraries}
	function create_if_block$3(ctx) {
		let div1;
		let div0;
		let a;
		let icon;
		let t;
		let current;
		let mounted;
		let dispose;

		icon = new Icon({
				props: { name: "search" },
				$$inline: true
			});

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				a = element("a");
				create_component(icon.$$.fragment);
				t = text(" Search for a book!");
				attr_dev(a, "class", "primary-link");
				attr_dev(a, "href", "#search");
				add_location(a, file$3, 127, 20, 4721);
				attr_dev(div0, "class", "col text-center m-5");
				add_location(div0, file$3, 126, 16, 4666);
				attr_dev(div1, "class", "row");
				add_location(div1, file$3, 125, 12, 4632);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				append_dev(div0, a);
				mount_component(icon, a, null);
				append_dev(a, t);
				current = true;

				if (!mounted) {
					dispose = listen_dev(a, "click", prevent_default(/*click_handler_5*/ ctx[14]), false, true, false);
					mounted = true;
				}
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div1);
				destroy_component(icon);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$3.name,
			type: "if",
			source: "(125:8) {#if settings.hasLibraries}",
			ctx
		});

		return block;
	}

	function create_fragment$3(ctx) {
		let div12;
		let nav;
		let div1;
		let div0;
		let img;
		let img_src_value;
		let t0;
		let t1;
		let div3;
		let div2;
		let h2;
		let t3;
		let t4;
		let input;
		let t5;
		let div8;
		let div7;
		let div6;
		let div5;
		let div4;
		let t6;
		let div11;
		let div10;
		let ul;
		let t7;
		let div9;
		let small;
		let span;
		let icon;
		let t8;
		let t9;
		let current;
		let mounted;
		let dispose;
		let if_block0 = /*settings*/ ctx[0].hasLibraries && create_if_block_3$1(ctx);
		let if_block1 = !/*settings*/ ctx[0].hasLibraries && create_if_block_2$3(ctx);
		let each_value_1 = /*completionOptions*/ ctx[2];
		validate_each_argument(each_value_1);
		let each_blocks_1 = [];

		for (let i = 0; i < each_value_1.length; i += 1) {
			each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
		}

		let each_value = /*settings*/ ctx[0].libraries;
		validate_each_argument(each_value);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		icon = new Icon({
				props: { name: "heart-half" },
				$$inline: true
			});

		let if_block2 = /*settings*/ ctx[0].hasLibraries && create_if_block$3(ctx);

		const block = {
			c: function create() {
				div12 = element("div");
				nav = element("nav");
				div1 = element("div");
				div0 = element("div");
				img = element("img");
				t0 = space();
				if (if_block0) if_block0.c();
				t1 = space();
				div3 = element("div");
				div2 = element("div");
				h2 = element("h2");
				h2.textContent = "My Libraries";
				t3 = space();
				if (if_block1) if_block1.c();
				t4 = space();
				input = element("input");
				t5 = space();
				div8 = element("div");
				div7 = element("div");
				div6 = element("div");
				div5 = element("div");
				div4 = element("div");

				for (let i = 0; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].c();
				}

				t6 = space();
				div11 = element("div");
				div10 = element("div");
				ul = element("ul");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t7 = space();
				div9 = element("div");
				small = element("small");
				span = element("span");
				create_component(icon.$$.fragment);
				t8 = text(" Your favourite libraries will appear in search results first.");
				t9 = space();
				if (if_block2) if_block2.c();
				if (!src_url_equal(img.src, img_src_value = "/images/Libraree-light.png")) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "Libraree");
				attr_dev(img, "class", "small-logo");
				add_location(img, file$3, 65, 16, 1630);
				attr_dev(div0, "class", "col text-center");
				add_location(div0, file$3, 64, 12, 1584);
				attr_dev(div1, "id", "header");
				attr_dev(div1, "class", "row p-2 svelte-1pkldz");
				add_location(div1, file$3, 63, 8, 1538);
				attr_dev(nav, "class", "fixed-top");
				add_location(nav, file$3, 62, 4, 1506);
				attr_dev(h2, "class", "text-center m-5");
				add_location(h2, file$3, 74, 12, 1989);
				attr_dev(input, "placeholder", "Type a Local Authority name, e.g. Wigan");
				attr_dev(input, "class", "form-control text-center search-box svelte-1pkldz");
				add_location(input, file$3, 82, 12, 2548);
				attr_dev(div2, "class", "col");
				add_location(div2, file$3, 73, 8, 1959);
				attr_dev(div3, "id", "main");
				attr_dev(div3, "class", "row svelte-1pkldz");
				add_location(div3, file$3, 72, 4, 1923);
				attr_dev(div4, "class", "list-group");
				add_location(div4, file$3, 89, 20, 2863);
				attr_dev(div5, "class", "col-12");
				add_location(div5, file$3, 88, 16, 2822);
				attr_dev(div6, "class", "row");
				add_location(div6, file$3, 87, 12, 2788);
				attr_dev(div7, "class", "col");
				add_location(div7, file$3, 86, 8, 2758);
				attr_dev(div8, "class", "row");
				add_location(div8, file$3, 85, 4, 2732);
				attr_dev(ul, "class", "list-group");
				add_location(ul, file$3, 102, 12, 3384);
				attr_dev(span, "class", "heart");
				add_location(span, file$3, 120, 23, 4413);
				add_location(small, file$3, 120, 16, 4406);
				attr_dev(div9, "class", "m-2 text-center");
				add_location(div9, file$3, 119, 12, 4360);
				attr_dev(div10, "class", "col");
				add_location(div10, file$3, 101, 8, 3354);
				attr_dev(div11, "class", "row mt-3");
				add_location(div11, file$3, 100, 4, 3323);
				attr_dev(div12, "class", "container");
				add_location(div12, file$3, 61, 0, 1478);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div12, anchor);
				append_dev(div12, nav);
				append_dev(nav, div1);
				append_dev(div1, div0);
				append_dev(div0, img);
				append_dev(div1, t0);
				if (if_block0) if_block0.m(div1, null);
				append_dev(div12, t1);
				append_dev(div12, div3);
				append_dev(div3, div2);
				append_dev(div2, h2);
				append_dev(div2, t3);
				if (if_block1) if_block1.m(div2, null);
				append_dev(div2, t4);
				append_dev(div2, input);
				set_input_value(input, /*libraryName*/ ctx[1]);
				append_dev(div12, t5);
				append_dev(div12, div8);
				append_dev(div8, div7);
				append_dev(div7, div6);
				append_dev(div6, div5);
				append_dev(div5, div4);

				for (let i = 0; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].m(div4, null);
				}

				append_dev(div12, t6);
				append_dev(div12, div11);
				append_dev(div11, div10);
				append_dev(div10, ul);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(ul, null);
				}

				append_dev(div10, t7);
				append_dev(div10, div9);
				append_dev(div9, small);
				append_dev(small, span);
				mount_component(icon, span, null);
				append_dev(small, t8);
				append_dev(div11, t9);
				if (if_block2) if_block2.m(div11, null);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(input, "input", /*input_input_handler*/ ctx[9]),
						listen_dev(input, "keyup", /*handleKey*/ ctx[3], false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (/*settings*/ ctx[0].hasLibraries) {
					if (if_block0) {
						if_block0.p(ctx, dirty);
					} else {
						if_block0 = create_if_block_3$1(ctx);
						if_block0.c();
						if_block0.m(div1, null);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (!/*settings*/ ctx[0].hasLibraries) {
					if (if_block1) ; else {
						if_block1 = create_if_block_2$3(ctx);
						if_block1.c();
						if_block1.m(div2, t4);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}

				if (dirty & /*libraryName*/ 2 && input.value !== /*libraryName*/ ctx[1]) {
					set_input_value(input, /*libraryName*/ ctx[1]);
				}

				if (dirty & /*addLibrary, completionOptions*/ 20) {
					each_value_1 = /*completionOptions*/ ctx[2];
					validate_each_argument(each_value_1);
					let i;

					for (i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

						if (each_blocks_1[i]) {
							each_blocks_1[i].p(child_ctx, dirty);
						} else {
							each_blocks_1[i] = create_each_block_1$1(child_ctx);
							each_blocks_1[i].c();
							each_blocks_1[i].m(div4, null);
						}
					}

					for (; i < each_blocks_1.length; i += 1) {
						each_blocks_1[i].d(1);
					}

					each_blocks_1.length = each_value_1.length;
				}

				if (dirty & /*settings, removeLibrary, updateLibrary*/ 97) {
					each_value = /*settings*/ ctx[0].libraries;
					validate_each_argument(each_value);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$2(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block$2(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(ul, null);
						}
					}

					group_outros();

					for (i = each_value.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}

				if (/*settings*/ ctx[0].hasLibraries) {
					if (if_block2) {
						if_block2.p(ctx, dirty);

						if (dirty & /*settings*/ 1) {
							transition_in(if_block2, 1);
						}
					} else {
						if_block2 = create_if_block$3(ctx);
						if_block2.c();
						transition_in(if_block2, 1);
						if_block2.m(div11, null);
					}
				} else if (if_block2) {
					group_outros();

					transition_out(if_block2, 1, 1, () => {
						if_block2 = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;

				for (let i = 0; i < each_value.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				transition_in(icon.$$.fragment, local);
				transition_in(if_block2);
				current = true;
			},
			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				transition_out(icon.$$.fragment, local);
				transition_out(if_block2);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div12);
				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
				destroy_each(each_blocks_1, detaching);
				destroy_each(each_blocks, detaching);
				destroy_component(icon);
				if (if_block2) if_block2.d();
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$3.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('MyLibraries', slots, []);
		const dispatch = createEventDispatcher();
		let { settings } = $$props;
		settings.sort();
		let libraryName = '';
		const service = new ApiService();
		let completionOptions = [];

		async function handleKey() {
			$$invalidate(2, completionOptions = await service.listServices(libraryName, settings.libraries));
		}

		function addLibrary(library) {
			$$invalidate(0, settings.libraries = [...settings.libraries, library], settings);
			$$invalidate(1, libraryName = '');
			$$invalidate(2, completionOptions = []);
			settings.sort();
			settings.save();
		}

		function updateLibrary(library) {
			library.favourite = !library.favourite;
			settings.sort();
			settings.save();
			$$invalidate(0, settings);
		}

		function removeLibrary(library) {
			$$invalidate(0, settings.libraries = _.filter(settings.libraries, x => x.code != library.code), settings);
			settings.save();
			$$invalidate(0, settings);
			library.favourite = false;
		}

		function goHome() {
			dispatch('home');
		}

		const writable_props = ['settings'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MyLibraries> was created with unknown prop '${key}'`);
		});

		const click_handler = () => goHome();

		function input_input_handler() {
			libraryName = this.value;
			$$invalidate(1, libraryName);
		}

		const click_handler_1 = option => addLibrary(option);
		const click_handler_2 = library => updateLibrary(library);
		const click_handler_3 = library => updateLibrary(library);
		const click_handler_4 = library => removeLibrary(library);
		const click_handler_5 = () => goHome();

		$$self.$$set = $$props => {
			if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
		};

		$$self.$capture_state = () => ({
			ApiService,
			_,
			Icon,
			createEventDispatcher,
			dispatch,
			settings,
			libraryName,
			service,
			completionOptions,
			handleKey,
			addLibrary,
			updateLibrary,
			removeLibrary,
			goHome
		});

		$$self.$inject_state = $$props => {
			if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
			if ('libraryName' in $$props) $$invalidate(1, libraryName = $$props.libraryName);
			if ('completionOptions' in $$props) $$invalidate(2, completionOptions = $$props.completionOptions);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			settings,
			libraryName,
			completionOptions,
			handleKey,
			addLibrary,
			updateLibrary,
			removeLibrary,
			goHome,
			click_handler,
			input_input_handler,
			click_handler_1,
			click_handler_2,
			click_handler_3,
			click_handler_4,
			click_handler_5
		];
	}

	class MyLibraries extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$3, create_fragment$3, safe_not_equal, { settings: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "MyLibraries",
				options,
				id: create_fragment$3.name
			});

			const { ctx } = this.$$;
			const props = options.props || {};

			if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
				console.warn("<MyLibraries> was created without expected prop 'settings'");
			}
		}

		get settings() {
			throw new Error("<MyLibraries>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set settings(value) {
			throw new Error("<MyLibraries>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/Book.svelte generated by Svelte v3.44.2 */
	const file$2 = "src/Book.svelte";

	function get_each_context$1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[7] = list[i];
		return child_ctx;
	}

	// (70:20) {:else}
	function create_else_block$2(ctx) {
		let img;
		let img_src_value;
		let img_alt_value;

		const block = {
			c: function create() {
				img = element("img");
				attr_dev(img, "class", "cover fake-cover svelte-1iua8xl");
				if (!src_url_equal(img.src, img_src_value = "/images/no-cover.png")) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", img_alt_value = /*book*/ ctx[0].title);
				set_style(img, "background-color", /*getFakeColour*/ ctx[3]());
				add_location(img, file$2, 70, 24, 1716);
			},
			m: function mount(target, anchor) {
				insert_dev(target, img, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*book*/ 1 && img_alt_value !== (img_alt_value = /*book*/ ctx[0].title)) {
					attr_dev(img, "alt", img_alt_value);
				}
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(img);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block$2.name,
			type: "else",
			source: "(70:20) {:else}",
			ctx
		});

		return block;
	}

	// (68:20) {#if book.smallThumbnail}
	function create_if_block_2$2(ctx) {
		let img;
		let img_src_value;
		let img_alt_value;

		const block = {
			c: function create() {
				img = element("img");
				attr_dev(img, "class", "cover svelte-1iua8xl");
				if (!src_url_equal(img.src, img_src_value = /*book*/ ctx[0].smallThumbnail)) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", img_alt_value = /*book*/ ctx[0].title);
				add_location(img, file$2, 68, 24, 1599);
			},
			m: function mount(target, anchor) {
				insert_dev(target, img, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*book*/ 1 && !src_url_equal(img.src, img_src_value = /*book*/ ctx[0].smallThumbnail)) {
					attr_dev(img, "src", img_src_value);
				}

				if (dirty & /*book*/ 1 && img_alt_value !== (img_alt_value = /*book*/ ctx[0].title)) {
					attr_dev(img, "alt", img_alt_value);
				}
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(img);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_2$2.name,
			type: "if",
			source: "(68:20) {#if book.smallThumbnail}",
			ctx
		});

		return block;
	}

	// (78:24) {#if book.subtitle}
	function create_if_block_1$2(ctx) {
		let span;
		let t_value = /*book*/ ctx[0].subtitle + "";
		let t;
		let br;

		const block = {
			c: function create() {
				span = element("span");
				t = text(t_value);
				br = element("br");
				attr_dev(span, "class", "subtitle svelte-1iua8xl");
				add_location(span, file$2, 78, 28, 2106);
				add_location(br, file$2, 78, 73, 2151);
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
				append_dev(span, t);
				insert_dev(target, br, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*book*/ 1 && t_value !== (t_value = /*book*/ ctx[0].subtitle + "")) set_data_dev(t, t_value);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(span);
				if (detaching) detach_dev(br);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1$2.name,
			type: "if",
			source: "(78:24) {#if book.subtitle}",
			ctx
		});

		return block;
	}

	// (82:24) {#if book.authors}
	function create_if_block$2(ctx) {
		let each_1_anchor;
		let each_value = /*book*/ ctx[0].authors;
		validate_each_argument(each_value);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
		}

		const block = {
			c: function create() {
				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_1_anchor = empty();
			},
			m: function mount(target, anchor) {
				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert_dev(target, each_1_anchor, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*book*/ 1) {
					each_value = /*book*/ ctx[0].authors;
					validate_each_argument(each_value);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$1(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block$1(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}
			},
			d: function destroy(detaching) {
				destroy_each(each_blocks, detaching);
				if (detaching) detach_dev(each_1_anchor);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$2.name,
			type: "if",
			source: "(82:24) {#if book.authors}",
			ctx
		});

		return block;
	}

	// (83:28) {#each book.authors as author}
	function create_each_block$1(ctx) {
		let span;
		let t_value = /*author*/ ctx[7] + "";
		let t;
		let br;

		const block = {
			c: function create() {
				span = element("span");
				t = text(t_value);
				br = element("br");
				add_location(span, file$2, 83, 32, 2337);
				add_location(br, file$2, 83, 53, 2358);
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
				append_dev(span, t);
				insert_dev(target, br, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*book*/ 1 && t_value !== (t_value = /*author*/ ctx[7] + "")) set_data_dev(t, t_value);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(span);
				if (detaching) detach_dev(br);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block$1.name,
			type: "each",
			source: "(83:28) {#each book.authors as author}",
			ctx
		});

		return block;
	}

	function create_fragment$2(ctx) {
		let div6;
		let div5;
		let div4;
		let div3;
		let div0;
		let t0;
		let div2;
		let div1;
		let span;
		let t1_value = /*book*/ ctx[0].title + "";
		let t1;
		let br;
		let t2;
		let t3;
		let div6_class_value;
		let mounted;
		let dispose;

		function select_block_type(ctx, dirty) {
			if (/*book*/ ctx[0].smallThumbnail) return create_if_block_2$2;
			return create_else_block$2;
		}

		let current_block_type = select_block_type(ctx);
		let if_block0 = current_block_type(ctx);
		let if_block1 = /*book*/ ctx[0].subtitle && create_if_block_1$2(ctx);
		let if_block2 = /*book*/ ctx[0].authors && create_if_block$2(ctx);

		const block = {
			c: function create() {
				div6 = element("div");
				div5 = element("div");
				div4 = element("div");
				div3 = element("div");
				div0 = element("div");
				if_block0.c();
				t0 = space();
				div2 = element("div");
				div1 = element("div");
				span = element("span");
				t1 = text(t1_value);
				br = element("br");
				t2 = space();
				if (if_block1) if_block1.c();
				t3 = space();
				if (if_block2) if_block2.c();
				attr_dev(div0, "class", "col-3 cover-content svelte-1iua8xl");
				add_location(div0, file$2, 66, 16, 1495);
				attr_dev(span, "class", "title svelte-1iua8xl");
				add_location(span, file$2, 75, 24, 1989);
				add_location(br, file$2, 75, 63, 2028);
				add_location(div1, file$2, 74, 20, 1959);
				attr_dev(div2, "class", "col-9 p-3 book-content svelte-1iua8xl");
				add_location(div2, file$2, 73, 16, 1902);
				attr_dev(div3, "class", "row");
				add_location(div3, file$2, 65, 12, 1461);
				add_location(div4, file$2, 64, 8, 1443);
				attr_dev(div5, "class", "card-body");
				add_location(div5, file$2, 63, 4, 1411);
				attr_dev(div6, "class", div6_class_value = "card m-2 " + (/*showAvailability*/ ctx[1] ? 'card-link' : '') + " svelte-1iua8xl");
				add_location(div6, file$2, 62, 0, 1309);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div6, anchor);
				append_dev(div6, div5);
				append_dev(div5, div4);
				append_dev(div4, div3);
				append_dev(div3, div0);
				if_block0.m(div0, null);
				append_dev(div3, t0);
				append_dev(div3, div2);
				append_dev(div2, div1);
				append_dev(div1, span);
				append_dev(span, t1);
				append_dev(div1, br);
				append_dev(div1, t2);
				if (if_block1) if_block1.m(div1, null);
				append_dev(div1, t3);
				if (if_block2) if_block2.m(div1, null);

				if (!mounted) {
					dispose = listen_dev(div6, "click", /*click_handler*/ ctx[4], false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0.d(1);
					if_block0 = current_block_type(ctx);

					if (if_block0) {
						if_block0.c();
						if_block0.m(div0, null);
					}
				}

				if (dirty & /*book*/ 1 && t1_value !== (t1_value = /*book*/ ctx[0].title + "")) set_data_dev(t1, t1_value);

				if (/*book*/ ctx[0].subtitle) {
					if (if_block1) {
						if_block1.p(ctx, dirty);
					} else {
						if_block1 = create_if_block_1$2(ctx);
						if_block1.c();
						if_block1.m(div1, t3);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}

				if (/*book*/ ctx[0].authors) {
					if (if_block2) {
						if_block2.p(ctx, dirty);
					} else {
						if_block2 = create_if_block$2(ctx);
						if_block2.c();
						if_block2.m(div1, null);
					}
				} else if (if_block2) {
					if_block2.d(1);
					if_block2 = null;
				}

				if (dirty & /*showAvailability*/ 2 && div6_class_value !== (div6_class_value = "card m-2 " + (/*showAvailability*/ ctx[1] ? 'card-link' : '') + " svelte-1iua8xl")) {
					attr_dev(div6, "class", div6_class_value);
				}
			},
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) detach_dev(div6);
				if_block0.d();
				if (if_block1) if_block1.d();
				if (if_block2) if_block2.d();
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$2.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Book', slots, []);
		const dispatch = createEventDispatcher();
		let { book } = $$props;
		let { showAvailability = false } = $$props;
		const fakeColours = ['#054a91', '#3e7cb1', '#81a4cd', '#dbe4ee', '#f17300'];

		function checkAvailability() {
			if (showAvailability) dispatch('check-availability', book);
		}

		function getFakeColour() {
			const index = Math.floor(Math.random() * fakeColours.length);
			return fakeColours[index];
		}

		const writable_props = ['book', 'showAvailability'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Book> was created with unknown prop '${key}'`);
		});

		const click_handler = () => checkAvailability();

		$$self.$$set = $$props => {
			if ('book' in $$props) $$invalidate(0, book = $$props.book);
			if ('showAvailability' in $$props) $$invalidate(1, showAvailability = $$props.showAvailability);
		};

		$$self.$capture_state = () => ({
			createEventDispatcher,
			dispatch,
			book,
			showAvailability,
			fakeColours,
			checkAvailability,
			getFakeColour
		});

		$$self.$inject_state = $$props => {
			if ('book' in $$props) $$invalidate(0, book = $$props.book);
			if ('showAvailability' in $$props) $$invalidate(1, showAvailability = $$props.showAvailability);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [book, showAvailability, checkAvailability, getFakeColour, click_handler];
	}

	class Book extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$2, safe_not_equal, { book: 0, showAvailability: 1 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Book",
				options,
				id: create_fragment$2.name
			});

			const { ctx } = this.$$;
			const props = options.props || {};

			if (/*book*/ ctx[0] === undefined && !('book' in props)) {
				console.warn("<Book> was created without expected prop 'book'");
			}
		}

		get book() {
			throw new Error("<Book>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set book(value) {
			throw new Error("<Book>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get showAvailability() {
			throw new Error("<Book>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set showAvailability(value) {
			throw new Error("<Book>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/Search.svelte generated by Svelte v3.44.2 */
	const file$1 = "src/Search.svelte";

	function get_each_context_1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[28] = list[i];
		return child_ctx;
	}

	function get_each_context_2(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[33] = list[i];
		return child_ctx;
	}

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[28] = list[i];
		return child_ctx;
	}

	// (154:8) {#if screenName == 'results'}
	function create_if_block_6(ctx) {
		let button;
		let icon;
		let current;
		let mounted;
		let dispose;

		icon = new Icon({
				props: { name: "chevron-left" },
				$$inline: true
			});

		const block = {
			c: function create() {
				button = element("button");
				create_component(icon.$$.fragment);
				attr_dev(button, "class", "back svelte-tvk0iz");
				add_location(button, file$1, 154, 12, 3415);
			},
			m: function mount(target, anchor) {
				insert_dev(target, button, anchor);
				mount_component(icon, button, null);
				current = true;

				if (!mounted) {
					dispose = listen_dev(button, "click", /*click_handler*/ ctx[15], false, false, false);
					mounted = true;
				}
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(button);
				destroy_component(icon);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_6.name,
			type: "if",
			source: "(154:8) {#if screenName == 'results'}",
			ctx
		});

		return block;
	}

	// (201:8) {:else}
	function create_else_block$1(ctx) {
		let div;
		let book;
		let t;
		let current_block_type_index;
		let if_block;
		let current;

		book = new Book({
				props: { book: /*currentBook*/ ctx[5] },
				$$inline: true
			});

		const if_block_creators = [create_if_block_4, create_else_block_1];
		const if_blocks = [];

		function select_block_type_1(ctx, dirty) {
			if (/*libraryResults*/ ctx[4].length > 0) return 0;
			return 1;
		}

		current_block_type_index = select_block_type_1(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		const block = {
			c: function create() {
				div = element("div");
				create_component(book.$$.fragment);
				t = space();
				if_block.c();
				attr_dev(div, "class", "col");
				add_location(div, file$1, 201, 12, 5837);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				mount_component(book, div, null);
				append_dev(div, t);
				if_blocks[current_block_type_index].m(div, null);
				current = true;
			},
			p: function update(ctx, dirty) {
				const book_changes = {};
				if (dirty[0] & /*currentBook*/ 32) book_changes.book = /*currentBook*/ ctx[5];
				book.$set(book_changes);
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type_1(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(book.$$.fragment, local);
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(book.$$.fragment, local);
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				destroy_component(book);
				if_blocks[current_block_type_index].d();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block$1.name,
			type: "else",
			source: "(201:8) {:else}",
			ctx
		});

		return block;
	}

	// (192:75) 
	function create_if_block_3(ctx) {
		let div1;
		let book;
		let t0;
		let div0;
		let img;
		let img_src_value;
		let t1;
		let p;

		let t2_value = (/*screenName*/ ctx[3] == 'editions'
		? 'Finding editions..'
		: 'Checking your libraries..') + "";

		let t2;
		let current;

		book = new Book({
				props: { book: /*currentBook*/ ctx[5] },
				$$inline: true
			});

		const block = {
			c: function create() {
				div1 = element("div");
				create_component(book.$$.fragment);
				t0 = space();
				div0 = element("div");
				img = element("img");
				t1 = space();
				p = element("p");
				t2 = text(t2_value);
				attr_dev(img, "id", "progress");
				if (!src_url_equal(img.src, img_src_value = "/images/progress-anim.gif")) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "Working..");
				attr_dev(img, "class", "svelte-tvk0iz");
				add_location(img, file$1, 196, 20, 5568);
				attr_dev(p, "class", "progress-text svelte-tvk0iz");
				add_location(p, file$1, 197, 20, 5658);
				attr_dev(div0, "class", "text-center");
				add_location(div0, file$1, 195, 16, 5522);
				attr_dev(div1, "class", "col");
				add_location(div1, file$1, 192, 12, 5431);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				mount_component(book, div1, null);
				append_dev(div1, t0);
				append_dev(div1, div0);
				append_dev(div0, img);
				append_dev(div0, t1);
				append_dev(div0, p);
				append_dev(p, t2);
				current = true;
			},
			p: function update(ctx, dirty) {
				const book_changes = {};
				if (dirty[0] & /*currentBook*/ 32) book_changes.book = /*currentBook*/ ctx[5];
				book.$set(book_changes);

				if ((!current || dirty[0] & /*screenName*/ 8) && t2_value !== (t2_value = (/*screenName*/ ctx[3] == 'editions'
				? 'Finding editions..'
				: 'Checking your libraries..') + "")) set_data_dev(t2, t2_value);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(book.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(book.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div1);
				destroy_component(book);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_3.name,
			type: "if",
			source: "(192:75) ",
			ctx
		});

		return block;
	}

	// (186:51) 
	function create_if_block_2$1(ctx) {
		let each_1_anchor;
		let current;
		let each_value = /*results*/ ctx[2];
		validate_each_argument(each_value);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		const block = {
			c: function create() {
				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_1_anchor = empty();
			},
			m: function mount(target, anchor) {
				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert_dev(target, each_1_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (dirty[0] & /*results, getAvailability*/ 1028) {
					each_value = /*results*/ ctx[2];
					validate_each_argument(each_value);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					group_outros();

					for (i = each_value.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;

				for (let i = 0; i < each_value.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d: function destroy(detaching) {
				destroy_each(each_blocks, detaching);
				if (detaching) detach_dev(each_1_anchor);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_2$1.name,
			type: "if",
			source: "(186:51) ",
			ctx
		});

		return block;
	}

	// (182:52) 
	function create_if_block_1$1(ctx) {
		let div;
		let h2;

		const block = {
			c: function create() {
				div = element("div");
				h2 = element("h2");
				h2.textContent = "No results found";
				add_location(h2, file$1, 183, 16, 4997);
				attr_dev(div, "class", "text-center");
				add_location(div, file$1, 182, 12, 4955);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, h2);
			},
			p: noop$1,
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1$1.name,
			type: "if",
			source: "(182:52) ",
			ctx
		});

		return block;
	}

	// (177:8) {#if screenName == 'search'}
	function create_if_block$1(ctx) {
		let div;
		let img;
		let img_src_value;
		let t0;
		let p;

		const block = {
			c: function create() {
				div = element("div");
				img = element("img");
				t0 = space();
				p = element("p");
				p.textContent = "Searching for books..";
				attr_dev(img, "id", "progress");
				if (!src_url_equal(img.src, img_src_value = "/images/progress-anim.gif")) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "Working..");
				attr_dev(img, "class", "svelte-tvk0iz");
				add_location(img, file$1, 178, 16, 4733);
				attr_dev(p, "class", "progress-text svelte-tvk0iz");
				add_location(p, file$1, 179, 16, 4819);
				attr_dev(div, "class", "text-center progress-margin svelte-tvk0iz");
				add_location(div, file$1, 177, 12, 4675);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, img);
				append_dev(div, t0);
				append_dev(div, p);
			},
			p: noop$1,
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$1.name,
			type: "if",
			source: "(177:8) {#if screenName == 'search'}",
			ctx
		});

		return block;
	}

	// (249:16) {:else}
	function create_else_block_1(ctx) {
		let div;
		let p;

		const block = {
			c: function create() {
				div = element("div");
				p = element("p");
				p.textContent = "None of your libraries stock this book.";
				attr_dev(p, "class", "progress-text svelte-tvk0iz");
				add_location(p, file$1, 250, 20, 9154);
				attr_dev(div, "class", "text-center m-5");
				add_location(div, file$1, 249, 16, 9104);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, p);
			},
			p: noop$1,
			i: noop$1,
			o: noop$1,
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block_1.name,
			type: "else",
			source: "(249:16) {:else}",
			ctx
		});

		return block;
	}

	// (205:16) {#if libraryResults.length > 0}
	function create_if_block_4(ctx) {
		let div;
		let accordion;
		let current;

		accordion = new Accordion({
				props: {
					flush: true,
					$$slots: { default: [create_default_slot] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				div = element("div");
				create_component(accordion.$$.fragment);
				attr_dev(div, "class", "accordian-container svelte-tvk0iz");
				add_location(div, file$1, 205, 20, 5980);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				mount_component(accordion, div, null);
				current = true;
			},
			p: function update(ctx, dirty) {
				const accordion_changes = {};

				if (dirty[0] & /*libraryResults, settings*/ 18 | dirty[1] & /*$$scope*/ 32) {
					accordion_changes.$$scope = { dirty, ctx };
				}

				accordion.$set(accordion_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(accordion.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(accordion.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				destroy_component(accordion);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_4.name,
			type: "if",
			source: "(205:16) {#if libraryResults.length > 0}",
			ctx
		});

		return block;
	}

	// (240:74) <Badge pill color={item.available > 0 ? 'success' : 'secondary'}>
	function create_default_slot_3(ctx) {
		let t0_value = /*item*/ ctx[33].available + "";
		let t0;
		let t1;
		let t2_value = /*item*/ ctx[33].total + "";
		let t2;

		const block = {
			c: function create() {
				t0 = text(t0_value);
				t1 = text(" of ");
				t2 = text(t2_value);
			},
			m: function mount(target, anchor) {
				insert_dev(target, t0, anchor);
				insert_dev(target, t1, anchor);
				insert_dev(target, t2, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty[0] & /*libraryResults*/ 16 && t0_value !== (t0_value = /*item*/ ctx[33].available + "")) set_data_dev(t0, t0_value);
				if (dirty[0] & /*libraryResults*/ 16 && t2_value !== (t2_value = /*item*/ ctx[33].total + "")) set_data_dev(t2, t2_value);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(t0);
				if (detaching) detach_dev(t1);
				if (detaching) detach_dev(t2);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_3.name,
			type: "slot",
			source: "(240:74) <Badge pill color={item.available > 0 ? 'success' : 'secondary'}>",
			ctx
		});

		return block;
	}

	// (235:44) {#each result.items as item}
	function create_each_block_2(ctx) {
		let tr;
		let td0;
		let t0_value = /*item*/ ctx[33].library + "";
		let t0;
		let t1;
		let td1;
		let t2_value = /*item*/ ctx[33].isbn + "";
		let t2;
		let t3;
		let td2;
		let t4_value = /*item*/ ctx[33].isbn.slice(/*item*/ ctx[33].isbn.length - 3) + "";
		let t4;
		let t5;
		let td3;
		let badge;
		let t6;
		let tr_class_value;
		let current;
		let mounted;
		let dispose;

		badge = new Badge({
				props: {
					pill: true,
					color: /*item*/ ctx[33].available > 0 ? 'success' : 'secondary',
					$$slots: { default: [create_default_slot_3] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		function click_handler_3() {
			return /*click_handler_3*/ ctx[22](/*item*/ ctx[33]);
		}

		const block = {
			c: function create() {
				tr = element("tr");
				td0 = element("td");
				t0 = text(t0_value);
				t1 = space();
				td1 = element("td");
				t2 = text(t2_value);
				t3 = space();
				td2 = element("td");
				t4 = text(t4_value);
				t5 = space();
				td3 = element("td");
				create_component(badge.$$.fragment);
				t6 = space();
				add_location(td0, file$1, 236, 52, 8268);
				attr_dev(td1, "class", "fixed d-none d-md-block svelte-tvk0iz");
				add_location(td1, file$1, 237, 52, 8344);
				attr_dev(td2, "class", "fixed d-block d-md-none svelte-tvk0iz");
				add_location(td2, file$1, 238, 52, 8449);
				attr_dev(td3, "class", "available svelte-tvk0iz");
				add_location(td3, file$1, 239, 52, 8582);

				attr_dev(tr, "class", tr_class_value = "" + (null_to_empty(/*item*/ ctx[33].available > 0
				? 'is-available'
				: 'table-light not-available') + " svelte-tvk0iz"));

				add_location(tr, file$1, 235, 48, 8100);
			},
			m: function mount(target, anchor) {
				insert_dev(target, tr, anchor);
				append_dev(tr, td0);
				append_dev(td0, t0);
				append_dev(tr, t1);
				append_dev(tr, td1);
				append_dev(td1, t2);
				append_dev(tr, t3);
				append_dev(tr, td2);
				append_dev(td2, t4);
				append_dev(tr, t5);
				append_dev(tr, td3);
				mount_component(badge, td3, null);
				append_dev(tr, t6);
				current = true;

				if (!mounted) {
					dispose = listen_dev(tr, "click", click_handler_3, false, false, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;
				if ((!current || dirty[0] & /*libraryResults*/ 16) && t0_value !== (t0_value = /*item*/ ctx[33].library + "")) set_data_dev(t0, t0_value);
				if ((!current || dirty[0] & /*libraryResults*/ 16) && t2_value !== (t2_value = /*item*/ ctx[33].isbn + "")) set_data_dev(t2, t2_value);
				if ((!current || dirty[0] & /*libraryResults*/ 16) && t4_value !== (t4_value = /*item*/ ctx[33].isbn.slice(/*item*/ ctx[33].isbn.length - 3) + "")) set_data_dev(t4, t4_value);
				const badge_changes = {};
				if (dirty[0] & /*libraryResults*/ 16) badge_changes.color = /*item*/ ctx[33].available > 0 ? 'success' : 'secondary';

				if (dirty[0] & /*libraryResults*/ 16 | dirty[1] & /*$$scope*/ 32) {
					badge_changes.$$scope = { dirty, ctx };
				}

				badge.$set(badge_changes);

				if (!current || dirty[0] & /*libraryResults*/ 16 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*item*/ ctx[33].available > 0
				? 'is-available'
				: 'table-light not-available') + " svelte-tvk0iz"))) {
					attr_dev(tr, "class", tr_class_value);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(badge.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(badge.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(tr);
				destroy_component(badge);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_2.name,
			type: "each",
			source: "(235:44) {#each result.items as item}",
			ctx
		});

		return block;
	}

	// (209:32) <AccordionItem>
	function create_default_slot_2(ctx) {
		let table;
		let thead;
		let tr;
		let th0;
		let t1;
		let th1;
		let t3;
		let th2;
		let t5;
		let th3;
		let t7;
		let tbody;
		let t8;
		let current;
		let each_value_2 = /*result*/ ctx[28].items;
		validate_each_argument(each_value_2);
		let each_blocks = [];

		for (let i = 0; i < each_value_2.length; i += 1) {
			each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		const block = {
			c: function create() {
				table = element("table");
				thead = element("thead");
				tr = element("tr");
				th0 = element("th");
				th0.textContent = "Library";
				t1 = space();
				th1 = element("th");
				th1.textContent = "ISBN";
				t3 = space();
				th2 = element("th");
				th2.textContent = "ISBN";
				t5 = space();
				th3 = element("th");
				th3.textContent = "Available";
				t7 = space();
				tbody = element("tbody");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t8 = space();
				attr_dev(th0, "scope", "col");
				add_location(th0, file$1, 227, 48, 7524);
				attr_dev(th1, "scope", "col");
				attr_dev(th1, "class", "d-none d-md-block");
				add_location(th1, file$1, 228, 48, 7601);
				attr_dev(th2, "scope", "col");
				attr_dev(th2, "class", "d-block d-md-none");
				add_location(th2, file$1, 229, 48, 7701);
				attr_dev(th3, "scope", "col");
				add_location(th3, file$1, 230, 48, 7801);
				add_location(tr, file$1, 226, 44, 7471);
				add_location(thead, file$1, 225, 40, 7419);
				add_location(tbody, file$1, 233, 40, 7971);
				attr_dev(table, "class", "table table-hover svelte-tvk0iz");
				add_location(table, file$1, 224, 36, 7345);
			},
			m: function mount(target, anchor) {
				insert_dev(target, table, anchor);
				append_dev(table, thead);
				append_dev(thead, tr);
				append_dev(tr, th0);
				append_dev(tr, t1);
				append_dev(tr, th1);
				append_dev(tr, t3);
				append_dev(tr, th2);
				append_dev(tr, t5);
				append_dev(tr, th3);
				append_dev(table, t7);
				append_dev(table, tbody);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(tbody, null);
				}

				insert_dev(target, t8, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (dirty[0] & /*libraryResults*/ 16) {
					each_value_2 = /*result*/ ctx[28].items;
					validate_each_argument(each_value_2);
					let i;

					for (i = 0; i < each_value_2.length; i += 1) {
						const child_ctx = get_each_context_2(ctx, each_value_2, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block_2(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(tbody, null);
						}
					}

					group_outros();

					for (i = each_value_2.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;

				for (let i = 0; i < each_value_2.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(table);
				destroy_each(each_blocks, detaching);
				if (detaching) detach_dev(t8);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_2.name,
			type: "slot",
			source: "(209:32) <AccordionItem>",
			ctx
		});

		return block;
	}

	// (213:44) {#if settings.isFavourite(result.code)}
	function create_if_block_5(ctx) {
		let span;
		let icon;
		let current;

		icon = new Icon({
				props: { name: "heart-fill" },
				$$inline: true
			});

		const block = {
			c: function create() {
				span = element("span");
				create_component(icon.$$.fragment);
				attr_dev(span, "class", "heart ml-10");
				add_location(span, file$1, 213, 48, 6487);
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
				mount_component(icon, span, null);
				current = true;
			},
			i: function intro(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(span);
				destroy_component(icon);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_5.name,
			type: "if",
			source: "(213:44) {#if settings.isFavourite(result.code)}",
			ctx
		});

		return block;
	}

	// (218:44) <Badge pill color={_.reduce(result.items, (total, item) => total + item.available, 0) > 0 ? 'success' : 'secondary'}>
	function create_default_slot_1(ctx) {
		let t0_value = _.reduce(/*result*/ ctx[28].items, func, 0) + "";
		let t0;
		let t1;
		let t2_value = _.reduce(/*result*/ ctx[28].items, func_1, 0) + "";
		let t2;

		const block = {
			c: function create() {
				t0 = text(t0_value);
				t1 = text("\n                                                of\n                                                ");
				t2 = text(t2_value);
			},
			m: function mount(target, anchor) {
				insert_dev(target, t0, anchor);
				insert_dev(target, t1, anchor);
				insert_dev(target, t2, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty[0] & /*libraryResults*/ 16 && t0_value !== (t0_value = _.reduce(/*result*/ ctx[28].items, func, 0) + "")) set_data_dev(t0, t0_value);
				if (dirty[0] & /*libraryResults*/ 16 && t2_value !== (t2_value = _.reduce(/*result*/ ctx[28].items, func_1, 0) + "")) set_data_dev(t2, t2_value);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(t0);
				if (detaching) detach_dev(t1);
				if (detaching) detach_dev(t2);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_1.name,
			type: "slot",
			source: "(218:44) <Badge pill color={_.reduce(result.items, (total, item) => total + item.available, 0) > 0 ? 'success' : 'secondary'}>",
			ctx
		});

		return block;
	}

	// (210:36) 
	function create_header_slot(ctx) {
		let div1;
		let span;
		let t0_value = /*result*/ ctx[28].service + "";
		let t0;
		let t1;
		let show_if = /*settings*/ ctx[1].isFavourite(/*result*/ ctx[28].code);
		let t2;
		let div0;
		let badge;
		let t3;
		let current;
		let if_block = show_if && create_if_block_5(ctx);

		badge = new Badge({
				props: {
					pill: true,
					color: _.reduce(/*result*/ ctx[28].items, func_2, 0) > 0
					? 'success'
					: 'secondary',
					$$slots: { default: [create_default_slot_1] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				div1 = element("div");
				span = element("span");
				t0 = text(t0_value);
				t1 = space();
				if (if_block) if_block.c();
				t2 = space();
				div0 = element("div");
				create_component(badge.$$.fragment);
				t3 = space();
				add_location(span, file$1, 210, 40, 6286);
				attr_dev(div0, "class", "accordian-header-badge svelte-tvk0iz");
				add_location(div0, file$1, 216, 40, 6686);
				attr_dev(div1, "class", "accordian-header svelte-tvk0iz");
				attr_dev(div1, "slot", "header");
				add_location(div1, file$1, 209, 36, 6201);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, span);
				append_dev(span, t0);
				append_dev(span, t1);
				if (if_block) if_block.m(span, null);
				append_dev(div1, t2);
				append_dev(div1, div0);
				mount_component(badge, div0, null);
				append_dev(div1, t3);
				current = true;
			},
			p: function update(ctx, dirty) {
				if ((!current || dirty[0] & /*libraryResults*/ 16) && t0_value !== (t0_value = /*result*/ ctx[28].service + "")) set_data_dev(t0, t0_value);
				if (dirty[0] & /*settings, libraryResults*/ 18) show_if = /*settings*/ ctx[1].isFavourite(/*result*/ ctx[28].code);

				if (show_if) {
					if (if_block) {
						if (dirty[0] & /*settings, libraryResults*/ 18) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block_5(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(span, null);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}

				const badge_changes = {};

				if (dirty[0] & /*libraryResults*/ 16) badge_changes.color = _.reduce(/*result*/ ctx[28].items, func_2, 0) > 0
				? 'success'
				: 'secondary';

				if (dirty[0] & /*libraryResults*/ 16 | dirty[1] & /*$$scope*/ 32) {
					badge_changes.$$scope = { dirty, ctx };
				}

				badge.$set(badge_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				transition_in(badge.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				transition_out(badge.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div1);
				if (if_block) if_block.d();
				destroy_component(badge);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_header_slot.name,
			type: "slot",
			source: "(210:36) ",
			ctx
		});

		return block;
	}

	// (208:28) {#each libraryResults as result}
	function create_each_block_1(ctx) {
		let accordionitem;
		let current;

		accordionitem = new AccordionItem({
				props: {
					$$slots: {
						header: [create_header_slot],
						default: [create_default_slot_2]
					},
					$$scope: { ctx }
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(accordionitem.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(accordionitem, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const accordionitem_changes = {};

				if (dirty[0] & /*libraryResults, settings*/ 18 | dirty[1] & /*$$scope*/ 32) {
					accordionitem_changes.$$scope = { dirty, ctx };
				}

				accordionitem.$set(accordionitem_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(accordionitem.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(accordionitem.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(accordionitem, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_1.name,
			type: "each",
			source: "(208:28) {#each libraryResults as result}",
			ctx
		});

		return block;
	}

	// (207:24) <Accordion flush>
	function create_default_slot(ctx) {
		let each_1_anchor;
		let current;
		let each_value_1 = /*libraryResults*/ ctx[4];
		validate_each_argument(each_value_1);
		let each_blocks = [];

		for (let i = 0; i < each_value_1.length; i += 1) {
			each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		const block = {
			c: function create() {
				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_1_anchor = empty();
			},
			m: function mount(target, anchor) {
				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert_dev(target, each_1_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (dirty[0] & /*libraryResults, settings*/ 18) {
					each_value_1 = /*libraryResults*/ ctx[4];
					validate_each_argument(each_value_1);
					let i;

					for (i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_context_1(ctx, each_value_1, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block_1(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					group_outros();

					for (i = each_value_1.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;

				for (let i = 0; i < each_value_1.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d: function destroy(detaching) {
				destroy_each(each_blocks, detaching);
				if (detaching) detach_dev(each_1_anchor);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot.name,
			type: "slot",
			source: "(207:24) <Accordion flush>",
			ctx
		});

		return block;
	}

	// (187:12) {#each results as result}
	function create_each_block(ctx) {
		let div;
		let book;
		let t;
		let current;

		book = new Book({
				props: {
					book: /*result*/ ctx[28],
					showAvailability: true
				},
				$$inline: true
			});

		book.$on("check-availability", /*check_availability_handler*/ ctx[21]);

		const block = {
			c: function create() {
				div = element("div");
				create_component(book.$$.fragment);
				t = space();
				attr_dev(div, "class", "col-md-6");
				add_location(div, file$1, 187, 16, 5149);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				mount_component(book, div, null);
				append_dev(div, t);
				current = true;
			},
			p: function update(ctx, dirty) {
				const book_changes = {};
				if (dirty[0] & /*results*/ 4) book_changes.book = /*result*/ ctx[28];
				book.$set(book_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(book.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(book.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				destroy_component(book);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block.name,
			type: "each",
			source: "(187:12) {#each results as result}",
			ctx
		});

		return block;
	}

	function create_fragment$1(ctx) {
		let div5;
		let nav;
		let t0;
		let menu;
		let t1;
		let div3;
		let div0;
		let img0;
		let img0_src_value;
		let t2;
		let form;
		let div2;
		let input0;
		let t3;
		let div1;
		let button0;
		let icon;
		let t4;
		let button1;
		let img1;
		let img1_src_value;
		let t5;
		let div4;
		let current_block_type_index;
		let if_block1;
		let t6;
		let input1;
		let t7;
		let pinchzoom;
		let current;
		let mounted;
		let dispose;
		let if_block0 = /*screenName*/ ctx[3] == 'results' && create_if_block_6(ctx);
		menu = new Menu({ $$inline: true });
		menu.$on("my-libraries", /*my_libraries_handler*/ ctx[16]);
		menu.$on("credits", /*credits_handler*/ ctx[17]);

		icon = new Icon({
				props: { name: "search" },
				$$inline: true
			});

		const if_block_creators = [
			create_if_block$1,
			create_if_block_1$1,
			create_if_block_2$1,
			create_if_block_3,
			create_else_block$1
		];

		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*screenName*/ ctx[3] == 'search') return 0;
			if (/*screenName*/ ctx[3] == 'books' && !/*results*/ ctx[2]) return 1;
			if (/*screenName*/ ctx[3] == 'books' && /*results*/ ctx[2]) return 2;
			if (/*screenName*/ ctx[3] == 'editions' || /*screenName*/ ctx[3] == 'availability') return 3;
			return 4;
		}

		current_block_type_index = select_block_type(ctx);
		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		pinchzoom = new PinchZoom({
				props: { state: /*state*/ ctx[7] },
				$$inline: true
			});

		pinchzoom.$on("close", /*close_handler*/ ctx[25]);

		const block = {
			c: function create() {
				div5 = element("div");
				nav = element("nav");
				if (if_block0) if_block0.c();
				t0 = space();
				create_component(menu.$$.fragment);
				t1 = space();
				div3 = element("div");
				div0 = element("div");
				img0 = element("img");
				t2 = space();
				form = element("form");
				div2 = element("div");
				input0 = element("input");
				t3 = space();
				div1 = element("div");
				button0 = element("button");
				create_component(icon.$$.fragment);
				t4 = space();
				button1 = element("button");
				img1 = element("img");
				t5 = space();
				div4 = element("div");
				if_block1.c();
				t6 = space();
				input1 = element("input");
				t7 = space();
				create_component(pinchzoom.$$.fragment);
				if (!src_url_equal(img0.src, img0_src_value = "/images/Libraree-light.png")) attr_dev(img0, "src", img0_src_value);
				attr_dev(img0, "alt", "Libraree");
				attr_dev(img0, "class", "small-logo");
				add_location(img0, file$1, 162, 16, 3762);
				attr_dev(div0, "class", "col-12 text-center");
				add_location(div0, file$1, 161, 12, 3713);
				attr_dev(input0, "type", "search");
				attr_dev(input0, "class", "form-control search-box svelte-tvk0iz");
				attr_dev(input0, "placeholder", "Book title, author or ISBN");
				attr_dev(input0, "enterkeyhint", "search");
				add_location(input0, file$1, 166, 20, 3944);
				attr_dev(button0, "type", "submit");
				attr_dev(button0, "class", "btn btn-secondary submit ml-10 svelte-tvk0iz");
				add_location(button0, file$1, 168, 24, 4160);
				attr_dev(img1, "class", "barcode");
				if (!src_url_equal(img1.src, img1_src_value = "/images/barcode.png")) attr_dev(img1, "src", img1_src_value);
				attr_dev(img1, "alt", "Scan barcode");
				add_location(img1, file$1, 169, 125, 4421);
				attr_dev(button1, "type", "submit");
				attr_dev(button1, "class", "btn btn-secondary submit svelte-tvk0iz");
				add_location(button1, file$1, 169, 24, 4320);
				attr_dev(div1, "class", "input-group-append");
				add_location(div1, file$1, 167, 20, 4103);
				attr_dev(div2, "class", "col-12 input-group");
				add_location(div2, file$1, 165, 16, 3891);
				add_location(form, file$1, 164, 12, 3868);
				attr_dev(div3, "id", "header");
				attr_dev(div3, "class", "row svelte-tvk0iz");
				add_location(div3, file$1, 160, 8, 3671);
				attr_dev(nav, "class", "fixed-top");
				add_location(nav, file$1, 152, 4, 3341);
				attr_dev(div4, "id", "main");
				attr_dev(div4, "class", "row svelte-tvk0iz");
				add_location(div4, file$1, 175, 4, 4597);
				add_location(div5, file$1, 151, 0, 3331);
				attr_dev(input1, "id", "fileInput");
				attr_dev(input1, "type", "file");
				attr_dev(input1, "accept", ".jpg, .jpeg, .png");
				attr_dev(input1, "capture", true);
				attr_dev(input1, "class", "svelte-tvk0iz");
				add_location(input1, file$1, 258, 0, 9320);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div5, anchor);
				append_dev(div5, nav);
				if (if_block0) if_block0.m(nav, null);
				append_dev(nav, t0);
				mount_component(menu, nav, null);
				append_dev(nav, t1);
				append_dev(nav, div3);
				append_dev(div3, div0);
				append_dev(div0, img0);
				append_dev(div3, t2);
				append_dev(div3, form);
				append_dev(form, div2);
				append_dev(div2, input0);
				set_input_value(input0, /*filter*/ ctx[0]);
				append_dev(div2, t3);
				append_dev(div2, div1);
				append_dev(div1, button0);
				mount_component(icon, button0, null);
				append_dev(div1, t4);
				append_dev(div1, button1);
				append_dev(button1, img1);
				append_dev(div5, t5);
				append_dev(div5, div4);
				if_blocks[current_block_type_index].m(div4, null);
				insert_dev(target, t6, anchor);
				insert_dev(target, input1, anchor);
				/*input1_binding*/ ctx[23](input1);
				insert_dev(target, t7, anchor);
				mount_component(pinchzoom, target, anchor);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(input0, "input", /*input0_input_handler*/ ctx[18]),
						listen_dev(button0, "click", prevent_default(/*click_handler_1*/ ctx[19]), false, true, false),
						listen_dev(button1, "click", prevent_default(/*click_handler_2*/ ctx[20]), false, true, false),
						listen_dev(input1, "change", /*change_handler*/ ctx[24], false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (/*screenName*/ ctx[3] == 'results') {
					if (if_block0) {
						if_block0.p(ctx, dirty);

						if (dirty[0] & /*screenName*/ 8) {
							transition_in(if_block0, 1);
						}
					} else {
						if_block0 = create_if_block_6(ctx);
						if_block0.c();
						transition_in(if_block0, 1);
						if_block0.m(nav, t0);
					}
				} else if (if_block0) {
					group_outros();

					transition_out(if_block0, 1, 1, () => {
						if_block0 = null;
					});

					check_outros();
				}

				if (dirty[0] & /*filter*/ 1) {
					set_input_value(input0, /*filter*/ ctx[0]);
				}

				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block1 = if_blocks[current_block_type_index];

					if (!if_block1) {
						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block1.c();
					} else {
						if_block1.p(ctx, dirty);
					}

					transition_in(if_block1, 1);
					if_block1.m(div4, null);
				}

				const pinchzoom_changes = {};
				if (dirty[0] & /*state*/ 128) pinchzoom_changes.state = /*state*/ ctx[7];
				pinchzoom.$set(pinchzoom_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block0);
				transition_in(menu.$$.fragment, local);
				transition_in(icon.$$.fragment, local);
				transition_in(if_block1);
				transition_in(pinchzoom.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block0);
				transition_out(menu.$$.fragment, local);
				transition_out(icon.$$.fragment, local);
				transition_out(if_block1);
				transition_out(pinchzoom.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div5);
				if (if_block0) if_block0.d();
				destroy_component(menu);
				destroy_component(icon);
				if_blocks[current_block_type_index].d();
				if (detaching) detach_dev(t6);
				if (detaching) detach_dev(input1);
				/*input1_binding*/ ctx[23](null);
				if (detaching) detach_dev(t7);
				destroy_component(pinchzoom, detaching);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$1.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function launchUrl(url) {
		window.open(url);
	}

	const func = (total, item) => total + item.available;
	const func_1 = (total, item) => total + item.total;
	const func_2 = (total, item) => total + item.available;

	function instance$1($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Search', slots, []);
		const dispatch = createEventDispatcher();
		let { filter } = $$props;
		let { settings } = $$props;
		let results = [];
		let service = new ApiService();
		let screenName = 'search';
		let libraryResults = [];
		let currentBook = null;
		const barcode = new BarcodeService();
		let fileInput;

		async function doSearch() {
			$$invalidate(5, currentBook = null);
			$$invalidate(2, results = []);
			$$invalidate(3, screenName = 'search');
			$$invalidate(2, results = await service.findTitles(filter));
			$$invalidate(3, screenName = 'books');
		}

		async function getAvailability(book) {
			$$invalidate(5, currentBook = book);
			$$invalidate(3, screenName = 'editions');

			const isbns = book.isbn
			? await service.getEditionsByIsbn(book.isbn)
			: await service.getEditionsByVolumeId(book.id);

			$$invalidate(3, screenName = 'availability');
			$$invalidate(4, libraryResults = await service.searchLibraries(isbns, settings));
			$$invalidate(3, screenName = 'results');
		}

		function goToCredits() {
			dispatch('credits');
		}

		async function onBarcode(e) {
			const result = await barcode.readBarcode(e.target.files[0]);

			if (result) {
				$$invalidate(0, filter = result);
				doSearch();
			}
		}

		const state = {
			open: false,
			doNotShow: localStorage.getItem('pinchModalHidden') == 'true'
		};

		function launchModal() {
			if (state.doNotShow) {
				closeModal();
			} else {
				$$invalidate(7, state.open = true, state);
			}
		}

		function closeModal() {
			localStorage.setItem('pinchModalHidden', `${state.doNotShow}`);
			fileInput.click();
		}

		doSearch();
		const writable_props = ['filter', 'settings'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
		});

		const click_handler = () => $$invalidate(3, screenName = 'books');
		const my_libraries_handler = () => dispatch('my-libraries');
		const credits_handler = () => goToCredits();

		function input0_input_handler() {
			filter = this.value;
			$$invalidate(0, filter);
		}

		const click_handler_1 = () => doSearch();
		const click_handler_2 = () => launchModal();
		const check_availability_handler = e => getAvailability(e.detail);
		const click_handler_3 = item => launchUrl(item.url);

		function input1_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				fileInput = $$value;
				$$invalidate(6, fileInput);
			});
		}

		const change_handler = e => onBarcode(e);
		const close_handler = () => closeModal();

		$$self.$$set = $$props => {
			if ('filter' in $$props) $$invalidate(0, filter = $$props.filter);
			if ('settings' in $$props) $$invalidate(1, settings = $$props.settings);
		};

		$$self.$capture_state = () => ({
			ApiService,
			_,
			Icon,
			Accordion,
			AccordionItem,
			Badge,
			Book,
			Menu,
			createEventDispatcher,
			BarcodeService,
			PinchZoom,
			dispatch,
			filter,
			settings,
			results,
			service,
			screenName,
			libraryResults,
			currentBook,
			barcode,
			fileInput,
			doSearch,
			getAvailability,
			launchUrl,
			goToCredits,
			onBarcode,
			state,
			launchModal,
			closeModal
		});

		$$self.$inject_state = $$props => {
			if ('filter' in $$props) $$invalidate(0, filter = $$props.filter);
			if ('settings' in $$props) $$invalidate(1, settings = $$props.settings);
			if ('results' in $$props) $$invalidate(2, results = $$props.results);
			if ('service' in $$props) service = $$props.service;
			if ('screenName' in $$props) $$invalidate(3, screenName = $$props.screenName);
			if ('libraryResults' in $$props) $$invalidate(4, libraryResults = $$props.libraryResults);
			if ('currentBook' in $$props) $$invalidate(5, currentBook = $$props.currentBook);
			if ('fileInput' in $$props) $$invalidate(6, fileInput = $$props.fileInput);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			filter,
			settings,
			results,
			screenName,
			libraryResults,
			currentBook,
			fileInput,
			state,
			dispatch,
			doSearch,
			getAvailability,
			goToCredits,
			onBarcode,
			launchModal,
			closeModal,
			click_handler,
			my_libraries_handler,
			credits_handler,
			input0_input_handler,
			click_handler_1,
			click_handler_2,
			check_availability_handler,
			click_handler_3,
			input1_binding,
			change_handler,
			close_handler
		];
	}

	class Search extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, { filter: 0, settings: 1 }, null, [-1, -1]);

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Search",
				options,
				id: create_fragment$1.name
			});

			const { ctx } = this.$$;
			const props = options.props || {};

			if (/*filter*/ ctx[0] === undefined && !('filter' in props)) {
				console.warn("<Search> was created without expected prop 'filter'");
			}

			if (/*settings*/ ctx[1] === undefined && !('settings' in props)) {
				console.warn("<Search> was created without expected prop 'settings'");
			}
		}

		get filter() {
			throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set filter(value) {
			throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get settings() {
			throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set settings(value) {
			throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/App.svelte generated by Svelte v3.44.2 */
	const file = "src/App.svelte";

	// (38:1) {:else}
	function create_else_block(ctx) {
		let mylibraries;
		let current;

		mylibraries = new MyLibraries({
				props: { settings: /*settings*/ ctx[0] },
				$$inline: true
			});

		mylibraries.$on("home", /*home_handler_1*/ ctx[9]);

		const block = {
			c: function create() {
				create_component(mylibraries.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(mylibraries, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const mylibraries_changes = {};
				if (dirty & /*settings*/ 1) mylibraries_changes.settings = /*settings*/ ctx[0];
				mylibraries.$set(mylibraries_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(mylibraries.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(mylibraries.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(mylibraries, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block.name,
			type: "else",
			source: "(38:1) {:else}",
			ctx
		});

		return block;
	}

	// (35:35) 
	function create_if_block_2(ctx) {
		let credits;
		let current;
		credits = new Credits({ $$inline: true });
		credits.$on("home", /*home_handler*/ ctx[8]);

		const block = {
			c: function create() {
				create_component(credits.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(credits, target, anchor);
				current = true;
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(credits.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(credits.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(credits, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_2.name,
			type: "if",
			source: "(35:35) ",
			ctx
		});

		return block;
	}

	// (31:34) 
	function create_if_block_1(ctx) {
		let search_1;
		let current;

		search_1 = new Search({
				props: {
					settings: /*settings*/ ctx[0],
					filter: /*filter*/ ctx[2]
				},
				$$inline: true
			});

		search_1.$on("my-libraries", /*my_libraries_handler_1*/ ctx[6]);
		search_1.$on("credits", /*credits_handler_1*/ ctx[7]);

		const block = {
			c: function create() {
				create_component(search_1.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(search_1, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const search_1_changes = {};
				if (dirty & /*settings*/ 1) search_1_changes.settings = /*settings*/ ctx[0];
				if (dirty & /*filter*/ 4) search_1_changes.filter = /*filter*/ ctx[2];
				search_1.$set(search_1_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(search_1.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(search_1.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(search_1, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1.name,
			type: "if",
			source: "(31:34) ",
			ctx
		});

		return block;
	}

	// (27:1) {#if screenName == 'home'}
	function create_if_block(ctx) {
		let home;
		let current;
		home = new Home({ $$inline: true });
		home.$on("search", /*search*/ ctx[3]);
		home.$on("my-libraries", /*my_libraries_handler*/ ctx[4]);
		home.$on("credits", /*credits_handler*/ ctx[5]);

		const block = {
			c: function create() {
				create_component(home.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(home, target, anchor);
				current = true;
			},
			p: noop$1,
			i: function intro(local) {
				if (current) return;
				transition_in(home.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(home.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(home, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block.name,
			type: "if",
			source: "(27:1) {#if screenName == 'home'}",
			ctx
		});

		return block;
	}

	function create_fragment(ctx) {
		let main;
		let current_block_type_index;
		let if_block;
		let current;
		const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2, create_else_block];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*screenName*/ ctx[1] == 'home') return 0;
			if (/*screenName*/ ctx[1] == 'search') return 1;
			if (/*screenName*/ ctx[1] == 'credits') return 2;
			return 3;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		const block = {
			c: function create() {
				main = element("main");
				if_block.c();
				attr_dev(main, "class", "svelte-89ncgx");
				add_location(main, file, 25, 0, 507);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, main, anchor);
				if_blocks[current_block_type_index].m(main, null);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(main, null);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(main);
				if_blocks[current_block_type_index].d();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('App', slots, []);
		let { settings } = $$props;
		let screenName = 'home';
		let filter = '';

		if (!settings.hasLibraries) {
			// Go to the My Libraries screen automatically.
			screenName = 'my-libraries';
		}

		function search(value) {
			$$invalidate(1, screenName = 'search');
			$$invalidate(2, filter = value.detail);
		}

		const writable_props = ['settings'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
		});

		const my_libraries_handler = () => $$invalidate(1, screenName = 'my-libraries');
		const credits_handler = () => $$invalidate(1, screenName = 'credits');
		const my_libraries_handler_1 = () => $$invalidate(1, screenName = 'my-libraries');
		const credits_handler_1 = () => $$invalidate(1, screenName = 'credits');
		const home_handler = () => $$invalidate(1, screenName = 'home');
		const home_handler_1 = () => $$invalidate(1, screenName = 'home');

		$$self.$$set = $$props => {
			if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
		};

		$$self.$capture_state = () => ({
			Credits,
			Home,
			MyLibraries,
			Search,
			settings,
			screenName,
			filter,
			search
		});

		$$self.$inject_state = $$props => {
			if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
			if ('screenName' in $$props) $$invalidate(1, screenName = $$props.screenName);
			if ('filter' in $$props) $$invalidate(2, filter = $$props.filter);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			settings,
			screenName,
			filter,
			search,
			my_libraries_handler,
			credits_handler,
			my_libraries_handler_1,
			credits_handler_1,
			home_handler,
			home_handler_1
		];
	}

	class App extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment, safe_not_equal, { settings: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "App",
				options,
				id: create_fragment.name
			});

			const { ctx } = this.$$;
			const props = options.props || {};

			if (/*settings*/ ctx[0] === undefined && !('settings' in props)) {
				console.warn("<App> was created without expected prop 'settings'");
			}
		}

		get settings() {
			throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set settings(value) {
			throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	const settings = Settings.load();
	const app = new App({
	    target: document.body,
	    props: {
	        settings: settings
	    }
	});

	return app;

})();
//# sourceMappingURL=bundle.js.map
