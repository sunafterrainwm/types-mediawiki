declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		type OneOrMore<T> = T | T[];

		/**
		 * Create an object that can be read from or written to via methods that allow
		 * interaction both with single and multiple properties at once.
		 *
		 * @private
		 * @class mw.Map
		 * @constructor
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Map
		 */
		class Map<V extends Record<string, unknown>> {
			/**
			 * @private
			 */
			private values: V;

			/**
			 * Get the value of one or more keys.
			 *
			 * If called with no arguments, all values are returned.
			 *
			 * @param {string|Array} [selection] Key or array of keys to retrieve values for.
			 * @param {Mixed} [fallback=null] Value for keys that don't exist.
			 * @return {Mixed|Object|null} If selection was a string, returns the value,
			 *  If selection was an array, returns an object of key/values.
			 *  If no selection is passed, a new object with all key/values is returned.
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Map-method-get
			 */
			get(): V;
			get<S extends ( keyof V )[]>(
				selection: S,
				fallback?: unknown
			): Pick<V, S extends ( infer SS )[] ? SS : never>;
			get<S extends keyof V>( selection: S, fallback?: V[S] ): V[S];

			/**
			 * Set one or more key/value pairs.
			 *
			 * @param {string|Object} selection Key to set value for, or object mapping keys to values
			 * @param {Mixed} [value] Value to set (optional, only in use when key is a string)
			 * @return {boolean} True on success, false on failure
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Map-method-set
			 */
			set<S extends keyof V>( selection: S, value: V[S] ): boolean;
			set( data: Partial<V> ): boolean;

			/**
			 * Check if a given key exists in the map.
			 *
			 * @param {string} selection Key to check
			 * @return {boolean} True if the key exists
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Map-method-exists
			 */
			exists( selection: keyof V ): boolean;
		}

		type MapLike<V extends Record<string, unknown>> = Omit<Map<V>, 'values'>;

		/**
		 * Collection of methods to help log messages to the console.
		 *
		 * @class mw.log
		 * @singleton
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.log
		 */
		interface Log {
			/**
			 * Write a verbose message to the browser's console in debug mode.
			 *
			 * This method is mainly intended for verbose logging. It is a no-op in production mode.
			 * In ResourceLoader debug mode, it will use the browser's console.
			 *
			 * See {@link mw.log} for other logging methods.
			 *
			 * @member mw
			 * @param {...string} msg Messages to output to console.
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-log
			 */
			( ...msg: Parameters<Console[ 'log' ]> ): void;

			/**
			 * Write a message to the browser console's warning channel.
			 *
			 * This method is a no-op in browsers that don't implement the Console API.
			 *
			 * @param {...string} msg Messages to output to console
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.log-method-warn
			 */
			warn: Console[ 'warn' ];

			/**
			 * Write a message to the browser console's error channel.
			 *
			 * Most browsers also print a stacktrace when calling this method if the
			 * argument is an Error object.
			 *
			 * This method is a no-op in browsers that don't implement the Console API.
			 *
			 * @since 1.26
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-error
			 * @param {...Mixed} msg Messages to output to console
			 */
			error: Console[ 'error' ];

			/**
			 * Create a function that logs a deprecation warning when called.
			 *
			 * Usage:
			 *
			 * @example
			 * ```
			 * var deprecatedNoB = mw.log.makeDeprecated( 'hello_without_b', 'Use of hello without b is deprecated.' );
			 *
			 * function hello( a, b ) {
			 *     if ( b === undefined ) {
			 *         deprecatedNoB();
			 *         b = 0;
			 *     }
			 *     return a + b;
			 * }
			 *
			 * hello( 1 );
			 * ```
			 *
			 * @since 1.38
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-makeDeprecated
			 * @param {string|null} key Name of the feature for deprecation tracker,
			 *  or null for a console-only deprecation.
			 * @param {string} msg Deprecation warning.
			 * @return {Function}
			 */
			makeDeprecated( key: string | null, msg: string ): () => void;

			/**
			 * Create a property on a host object that, when accessed, will log
			 * a deprecation warning to the console.
			 *
			 * Usage:
			 *
			 * @example
			 * ```
			 * mw.log.deprecate( window, 'myGlobalFn', myGlobalFn );
			 *
			 * mw.log.deprecate( Thing, 'old', old, 'Use Other.thing instead', 'Thing.old'  );
			 * ```
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-deprecate
			 * @param {Object} obj Host object of deprecated property
			 * @param {string} key Name of property to create in `obj`
			 * @param {Mixed} val The value this property should return when accessed
			 * @param {string} [msg] Optional extra text to add to the deprecation warning
			 * @param {string} [logName] Name of the feature for deprecation tracker.
			 *  Tracking is disabled by default, except for global variables on `window`.
			 */
			deprecate<O, K extends keyof O>( obj: O, key: K, val: O[ K ], msg?: string, logName?: string ): void;
			deprecate( obj: object, key: string, val: unknown, msg?: string, logName?: string ): void;
		}

		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface Config extends Record<string, unknown> {
			// will defined at index.d.ts
		}

		/**
		 * Empty object for third-party libraries, for cases where you don't
		 * want to add a new global, or the global is bad and needs containment
		 * or wrapping.
		 *
		 */
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface Libraries {}
		/**
		 * Empty object for third-party libraries, for cases where you don't
		 * want to add a new global, or the global is bad and needs containment
		 * or wrapping.
		 *
		 */
		namespace libs {}

		namespace html {
			/**
			 * Wrapper object for raw HTML passed to mw.html.element().
			 *
			 * @class mw.html.Raw
			 * @constructor
			 * @param {string} value
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.html.Raw
			 */
			class Raw {
				value: string;
				constructor( value: string );
			}
		}

		/**
		 * HTML construction helper functions
		 *
		 * @example
		 * ```
		 * var Html, output;
		 *
		 * Html = mw.html;
		 * output = Html.element( 'div', {}, new Html.Raw(
		 *     Html.element( 'img', { src: '<' } )
		 * );
		 * mw.log( output ); // <div><img src="&lt;"/></div>
		 * ```
		 *
		 * @class mw.html
		 * @singleton
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.html
		 */
		interface Html {
			/**
			 * Escape a string for HTML.
			 *
			 * Converts special characters to HTML entities.
			 *
			 *      mw.html.escape( '< > \' & "' );
			 *      // Returns &lt; &gt; &#039; &amp; &quot;
			 *
			 * @param {string} s The string to escape
			 * @return {string} HTML
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.html-method-escape
			 */
			escape( s: string ): string;

			/**
			 * Create an HTML element string, with safe escaping.
			 *
			 * @param {string} name The tag name.
			 * @param {Object} [attrs] An object with members mapping element names to values
			 * @param {string|mw.html.Raw|null} [contents=null] The contents of the element.
			 *
			 *  - string: Text to be escaped.
			 *  - null: The element is treated as void with short closing form, e.g. `<br/>`.
			 *  - this.Raw: The raw value is directly included.
			 * @return {string} HTML
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.html-method-element
			 */
			element( name: string, attrs: Record<string, string>, contents: string|html.Raw|null ): string;
		}

		/**
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.errorLogger
		 */
		interface ErrorLogger {
			/**
			 * Logs an error by notifying subscribers to the given mw.track() topic
			 * (by default `error.caught`) that an event has occurred.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.errorLogger-method-logError
			 * @param {Error} error
			 * @param {string} [topic='error.caught'] Error topic. Conventionally in the form
			 *    'error.⧼component⧽' (where ⧼component⧽ identifies the code logging the error at a
			 *    high level; e.g. an extension name).
			 * @fires error.caught
			 */
			logError( error: Error, topic?: `error.${string}` ): void;
		}
	}

	interface MediaWiki {
		/**
		 * Get the current time, measured in milliseconds since January 1, 1970 (UTC).
		 *
		 * On browsers that implement the Navigation Timing API, this function will produce
		 * floating-point values with microsecond precision that are guaranteed to be monotonic.
		 * On all other browsers, it will fall back to using `Date`.
		 *
		 * @return {number} Current time
		 */
		now(): number;

		/**
		 * List of all analytic events emitted so far.
		 *
		 * Exposed only for use by mediawiki.base.
		 *
		 * @private
		 * @property {Array}
		 */
		readonly trackQueue: {
			topic: string;
			data: object;
		}[];

		/**
		 * Track an early error event via mw.track and send it to the window console.
		 *
		 * @private
		 * @param {string} topic Topic name
		 * @param {Object} data Data describing the event, encoded as an object; see mw#logError
		 * @see MediaWiki.logError
		 */
		trackError( topic: string, data: object ): void;

		/**
		 * Map of configuration values.
		 *
		 * Check out [the complete list of configuration values](https://www.mediawiki.org/wiki/Manual:Interface/JavaScript#mw.config)
		 * on mediawiki.org.
		 *
		 * If `$wgLegacyJavaScriptGlobals` is true, this Map will add its values to the
		 * global `window` object.
		 *
		 * @property {mw.Map}
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-property-config
		 * @see https://mediawiki.org/wiki/Manual:Interface/JavaScript#mw.config
		 */
		readonly config: MediaWiki.Map<MediaWiki.Config>;

		/**
		 * Store for messages.
		 *
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-property-messages
		 * @property {mw.Map}
		 */
		readonly messages: MediaWiki.Map<Record<string, string>>;

		/**
		 * Store for templates associated with a module.
		 *
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-property-templates
		 * @property {mw.Map}
		 */
		readonly templates: MediaWiki.Map<Record<string, string>>;

		/**
		 * Collection of methods to help log messages to the console.
		 *
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.log
		 */
		readonly log: MediaWiki.Log;

		/**
		 * @private
		 */
		requestIdleCallbackInternal( callback: ( info: {
			didTimeout: boolean;
			timeRemaining(): number;
		} ) => void ): void;

		/**
		 * Schedule a deferred task to run in the background.
		 *
		 * This allows code to perform tasks in the main thread without impacting
		 * time-critical operations such as animations and response to input events.
		 *
		 * Basic logic is as follows:
		 *
		 * - User input event should be acknowledged within 100ms per [RAIL].
		 * - Idle work should be grouped in blocks of upto 50ms so that enough time
		 *   remains for the event handler to execute and any rendering to take place.
		 * - Whenever a native event happens (e.g. user input), the deadline for any
		 *   running idle callback drops to 0.
		 * - As long as the deadline is non-zero, other callbacks pending may be
		 *   executed in the same idle period.
		 *
		 * See also:
		 *
		 * - <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback>
		 * - <https://w3c.github.io/requestidlecallback/>
		 * - <https://developers.google.com/web/updates/2015/08/using-requestidlecallback>
		 * [RAIL]: https://developers.google.com/web/fundamentals/performance/rail
		 *
		 * @member mw
		 * @param {Function} callback
		 * @param {Object} [options]
		 * @param {number} [options.timeout] If set, the callback will be scheduled for
		 *  immediate execution after this amount of time (in milliseconds) if it didn't run
		 *  by that time.
		 */
		requestIdleCallback(
			callback: ( info: {
				didTimeout: boolean;
				timeRemaining(): number;
			} ) => void,
			options?: {
				timeout?: number;
			}
		): void;

		/**
		 * Empty object for third-party libraries, for cases where you don't
		 * want to add a new global, or the global is bad and needs containment
		 * or wrapping.
		 *
		 * @property {Object}
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-property-libs
		 */
		readonly libs: MediaWiki.Libraries;

		/**
		 * Track an analytic event.
		 *
		 * This method provides a generic means for MediaWiki JavaScript code to capture state
		 * information for analysis. Each logged event specifies a string topic name that describes
		 * the kind of event that it is. Topic names consist of dot-separated path components,
		 * arranged from most general to most specific. Each path component should have a clear and
		 * well-defined purpose.
		 *
		 * Data handlers are registered via `mw.trackSubscribe`, and receive the full set of
		 * events that match their subscription, including those that fired before the handler was
		 * bound.
		 *
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-track
		 * @param {string} topic Topic name
		 * @param {Object|number|string} [data] Data describing the event.
		 */
		track( topic: 'global.error' | 'error.caught', data?: object | number | string ): void;

		/**
		 * Register a handler for subset of analytic events, specified by topic.
		 *
		 * Handlers will be called once for each tracked event, including any events that fired before the
		 * handler was registered; 'this' is set to a plain object with a topic' property naming the event, and a
		 * 'data' property which is an object of event-specific data. The event topic and event data are
		 * also passed to the callback as the first and second arguments, respectively.
		 *
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-trackSubscribe
		 * @param {string} topic Handle events whose name starts with this string prefix
		 * @param {Function} callback Handler to call for each matching tracked event
		 * @param {string} callback.topic
		 * @param {Object} [callback.data]
		 */
		trackSubscribe( topic: string, callback: ( info: {
			topic: string;
			data?: object | number | string;
		} ) => void ): void;

		/**
		 * Stop handling events for a particular handler
		 *
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-trackUnsubscribe
		 * @param {Function} callback
		 */
		trackUnsubscribe( callback: ( info: {
			topic: string;
			data?: object | number | string;
		} ) => void ): void;

		/**
		 * HTML construction helper functions
		 *
		 * @example
		 * ```
		 * var Html, output;
		 *
		 * Html = mw.html;
		 * output = Html.element( 'div', {}, new Html.Raw(
		 *     Html.element( 'img', { src: '<' } )
		 * );
		 * mw.log( output ); // <div><img src="&lt;"/></div>
		 * ```
		 *
		 * @class mw.html
		 * @singleton
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.html
		 */
		readonly html: MediaWiki.Html;

		/**
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.errorLogger
		 */
		readonly errorLogger: MediaWiki.ErrorLogger;
	}
}

declare global {
	/**
	 * Wikipage import methods
	 *
	 * See https://www.mediawiki.org/wiki/ResourceLoader/Legacy_JavaScript#wikibits.js
	 */

	const loadedScripts: Record<string, boolean>;

	/**
	 * @deprecated since 1.17 Use mw.loader instead. Warnings added in 1.25.
	 * @param {string} url
	 * @return {HTMLElement} Script tag
	 */
	function importScriptURI( url: string ): HTMLScriptElement;

	function importScript( page: string ): HTMLScriptElement;

	/**
	 * @deprecated since 1.17 Use mw.loader instead. Warnings added in 1.25.
	 * @param {string} url
	 * @param {string} media
	 * @return {HTMLElement} Link tag
	 */
	function importStylesheetURI( url: string, media?: string ): HTMLLinkElement;

	function importStylesheet( page: string ): HTMLLinkElement;

	interface Document {
		/**
		 * Writes one or more HTML expressions to a document in the specified window.
		 *
		 * @param text Specifies the text and HTML tags to write.
		 * @deprecated since 1.26 Use mw.loader or jQuery instead.
		 */
		write( ...text: string[] ): void;

		/**
		 * Writes one or more HTML expressions, followed by a carriage return, to a document in the specified window.
		 *
		 * @param text The text and HTML tags to write.
		 * @deprecated since 1.26 Use mw.loader or jQuery instead.
		 */
		writeln( ...text: string[] ): void;
	}
}

export {};
