declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		/**
		 * A interface defined registry exports
		 */
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface ExportLibrary {
			// nothing here
		}

		namespace loader {
			type state = 'registered' | 'loading' | 'loaded' | 'executing' | 'ready' | 'error' | 'missing';

			/**
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-property-moduleRegistry
			 */
			interface LoaderRegistry {
				version: string;
				dependencies: string[];
				group: string | number | null;
				source: string;
				skip: string | boolean | null;
				module: {
					exports: unknown;
				};
				state: state;
				script: loader.ImplementScriptCallBack | {
					main: string;
					files: Record<string, loader.ImplementScriptCallBack | Record<string, unknown>>;
				} | string[] | string | null;
				style: {
					css?: string[];
					url?: Record<string, string>;
				};
				/**
				 * @see messages
				 */
				messages: Record<string, string>;
				/**
				 * @see templates
				 */
				templates: Record<string, string>;
			}

			type ImplementScriptCallBack = (
				jQuery: JQueryStatic,
				$: JQueryStatic,
				require: Loader[ 'require' ],
				module: { exports: unknown; }
			) => unknown;

			/**
			 * On browsers that implement the localStorage API, the module store serves as a
			 * smart complement to the browser cache. Unlike the browser cache, the module store
			 * can slice a concatenated response from ResourceLoader into its constituent
			 * modules and cache each of them separately, using each module's versioning scheme
			 * to determine when the cache should be invalidated.
			 *
			 * @private
			 * @singleton
			 * @class mw.loader.store
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store
			 */
			interface Store {
				// Whether the store is in use on this page.
				enabled: null | boolean;

				// The contents of the store, mapping '[name]@[version]' keys
				// to module implementations.
				items: Record<`${string}@${string}`, string>;

				// Names of modules to be stored during the next update.
				// See add() and update().
				queue: [];

				// Cache hit stats
				stats: {
					hits: number;
					misses: number;
					expired: number;
					failed: number;
				};

				/**
				 * Construct a JSON-serializable object representing the content of the store.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-toJSON
				 * @return {Object} Module store contents.
				 */
				toJSON(): {
					items: Record<`${string}@${string}`, string>;
					vary: string;
					/**
					 * Store with 1e7 ms accuracy (1e4 seconds, or ~ 2.7 hours),
					 * which is enough for the purpose of expiring after ~ 30 days.
					 */
					asOf: number;
				};

				/**
				 * The localStorage key for the entire module store. The key references
				 * $wgDBname to prevent clashes between wikis which share a common host.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-property-key
				 * @property {string}
				 */
				key: string;

				/**
				 * A string containing various factors by which the module cache should vary.
				 *
				 * Defined by ResourceLoaderStartupModule::getStoreVary() in PHP.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-property-vary
				 * @property {string}
				 */
				vary: string;

				/**
				 * Initialize the store.
				 *
				 * Retrieves store from localStorage and (if successfully retrieved) decoding
				 * the stored JSON value to a plain object.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-init
				 */
				init(): void;

				/**
				 * Internal helper for init(). Separated for ease of testing.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-load
				 */
				load(): void;

				/**
				 * Retrieve a module from the store and update cache hit stats.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-get
				 * @param {string} module Module name
				 * @return {string|boolean} Module implementation or false if unavailable
				 */
				get( module: string ): string | false;

				/**
				 * Queue the name of a module that the next update should consider storing.
				 *
				 * @since 1.32
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-add
				 * @param {string} module Module name
				 */
				add( module: string ): void;

				/**
				 * Add the contents of the named module to the in-memory store.
				 *
				 * This method does not guarantee that the module will be stored.
				 * Inspection of the module's meta data and size will ultimately decide that.
				 *
				 * This method is considered internal to mw.loader.store and must only
				 * be called if the store is enabled.
				 *
				 * @private
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-set
				 * @param {string} module Module name
				 */
				set( module: string ): void;

				/**
				 * Iterate through the module store, removing any item that does not correspond
				 * (in name and version) to an item in the module registry.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-prune
				 */
				prune(): void;

				/**
				 * Clear the entire module store right now.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-clear
				 */
				clear(): void;

				/**
				 * Request a sync of the in-memory store back to persisted localStorage.
				 *
				 * This function debounces updates. The debouncing logic should account
				 * for the following factors:
				 *
				 * - Writing to localStorage is an expensive operation that must not happen
				 *   during the critical path of initializing and executing module code.
				 *   Instead, it should happen at a later time after modules have been given
				 *   time and priority to do their thing first.
				 *
				 * - This method is called from mw.loader.store.add(), which will be called
				 *   hundreds of times on a typical page, including within the same call-stack
				 *   and eventloop-tick. This is because responses from load.php happen in
				 *   batches. As such, we want to allow all modules from the same load.php
				 *   response to be written to disk with a single flush, not many.
				 *
				 * - Repeatedly deleting and creating timers is non-trivial.
				 *
				 * - localStorage is shared by all pages from the same origin, if multiple
				 *   pages are loaded with different module sets, the possibility exists that
				 *   modules saved by one page will be clobbered by another. The impact of
				 *   this is minor, it merely causes a less efficient cache use, and the
				 *   problem would be corrected by subsequent page views.
				 *
				 * This method is considered internal to mw.loader.store and must only
				 * be called if the store is enabled.
				 *
				 * @private
				 * @method
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store-method-requestUpdate
				 */
				requestUpdate(): void;
			}
		}

		interface Loader {
			/**
			 * The module registry is exposed as an aid for debugging and inspecting page
			 * state; it is not a public interface for modifying the registry.
			 *
			 * Mapping of registered modules.
			 *
			 * Example Format:
			 * ```
			 * {
			 *     'moduleName': {
			 *         // From mw.loader.register()
			 *         'version': '########', // hash
			 *         'dependencies': [ 'required.foo', 'bar.also', ... ],
			 *         'group': null, // or string, integer
			 *         'source': 'local' // (or) 'anotherwiki'
			 *         'skip': 'return !!window.Example;' // (or) null, (or) boolean result of skip
			 *         'module': {}, // exportObject
			 *
			 *         // Set from execute() or mw.loader.state()
			 *         'state': 'registered' // or 'loading' / 'loaded' / 'executing' / 'ready' / 'error' / 'missing'
			 *
			 *         // Optionally added at run-time by mw.loader.implement()
			 *         'script': 'module.exports = 1;', // or closure / array of urls
			 *         'style': { ... }, // see #execute
			 *         'messages': { 'key': 'value', ... }
			 *     }
			 * }
			 * ```
			 *
			 * State machine:
			 *
			 * - `registered`:
			 *    The module is known to the system but not yet required.
			 *    Meta data is registered via mw.loader#register. Calls to that method are
			 *    generated server-side by the startup module.
			 * - `loading`:
			 *    The module was required through mw.loader (either directly or as dependency of
			 *    another module). The client will fetch module contents from the server.
			 *    The contents are then stashed in the registry via mw.loader#implement.
			 * - `loaded`:
			 *    The module has been loaded from the server and stashed via mw.loader#implement.
			 *    Once the module has no more dependencies in-flight, the module will be executed,
			 *    controlled via #setAndPropagate and #doPropagation.
			 * - `executing`:
			 *    The module is being executed.
			 * - `ready`:
			 *    The module has been successfully executed.
			 * - `error`:
			 *    The module (or one of its dependencies) produced an error during execution.
			 * - `missing`:
			 *    The module was registered client-side and requested, but the server denied knowledge
			 *    of the module's existence.
			 *
			 * @property {Object}
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-property-moduleRegistry
			 */
			readonly moduleRegistry: Record<string, loader.LoaderRegistry>;

			/**
			 * Exposed for testing and debugging only.
			 *
			 * @property {number}
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-property-maxQueryLength
			 */
			maxQueryLength: number;

			/**
			 * Create a new style element and add it to the DOM.
			 *
			 * @method
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-addStyleTag
			 * @param {string} text CSS text
			 * @param {Node|null} [nextNode] The element where the style tag
			 *  should be inserted before
			 * @return {HTMLElement} Reference to the created style element
			 */
			addStyleTag( text: string, nextNode?: Node ): HTMLStyleElement;

			/**
			 * Add one or more modules to the module load queue.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-enqueue
			 * @param {string[]} dependencies Array of module names in the registry
			 * @param {Function} [ready] Callback to execute when all dependencies are ready
			 * @param {Function} [error] Callback to execute when any dependency fails
			 */
			enqueue(
				dependencies: string[] | string,
				ready?: ( require: Loader[ 'require' ] ) => void,
				error?: ( err: Error ) => void
			): void;

			/**
			 * Get names of module that a module depends on, in their proper dependency order.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-resolve
			 * @param {string[]} modules Array of string module names
			 * @return {Array} List of dependencies, including 'module'.
			 * @throws {Error} If an unregistered module or a dependency loop is encountered
			 */
			resolve( modules: string ): string[];

			/**
			 * Start loading of all queued module dependencies.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-work
			 */
			work(): void;

			/**
			 * Register a source.
			 *
			 * The #work() method will use this information to split up requests by source.
			 *
			 *     @example
			 *     mw.loader.addSource( { mediawikiwiki: 'https://www.mediawiki.org/w/load.php' } );
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-addSource
			 * @param {Object} ids An object mapping ids to load.php end point urls
			 * @throws {Error} If source id is already registered
			 */
			addSource( ids: Record<string, string> ): void;

			/**
			 * Register a module, letting the system know about it and its properties.
			 *
			 * The startup module calls this method.
			 *
			 * When using multiple module registration by passing an array, dependencies that
			 * are specified as references to modules within the array will be resolved before
			 * the modules are registered.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-register
			 * @param {string|Array} modules Module name or array of arrays, each containing
			 *  a list of arguments compatible with this method
			 * @param {string|number} [version] Module version hash (falls backs to empty string)
			 *  Can also be a number (timestamp) for compatibility with MediaWiki 1.25 and earlier.
			 *  A version string that ends with '!' signifies that the module requires ES6 support.
			 * @param {string[]} [dependencies] Array of module names on which this module depends.
			 * @param {string} [group=null] Group which the module is in
			 * @param {string} [source='local'] Name of the source
			 * @param {string} [skip=null] Script body of the skip function
			 */
			register(
				modules: string | string[],
				version?: string | number,
				dependencies?: string[],
				group?: string,
				source?: string,
				skip?: string
			): void;
			/**
			 * @private
			 */
			register( packages: [
				module: string,
				version: string,
				dependencies?: number[],
				group?: number | null,
				source?: string | null,
				skip?: string
			][] ): void;

			/**
			 * Implement a module given the components that make up the module.
			 *
			 * When #load() or #using() requests one or more modules, the server
			 * response contain calls to this function.
			 *
			 * @param {string} module Name of module and current module version. Formatted
			 *  as '`[name]@[version]`". This version should match the requested version
			 *  (from #batchRequest and #registry). This avoids race conditions (T117587).
			 *  For back-compat with MediaWiki 1.27 and earlier, the version may be omitted.
			 * @param {Function|Array|string|Object} [script] Module code. This can be a function,
			 *  a list of URLs to load via `<script src>`, a string for `domEval()`, or an
			 *  object like {"files": {"foo.js":function, "bar.js": function, ...}, "main": "foo.js"}.
			 *  If an object is provided, the main file will be executed immediately, and the other
			 *  files will only be executed if loaded via require(). If a function or string is
			 *  provided, it will be executed/evaluated immediately. If an array is provided, all
			 *  URLs in the array will be loaded immediately, and executed as soon as they arrive.
			 * @param {Object} [style] Should follow one of the following patterns:
			 *
			 *     { "css": [css, ..] }
			 *     { "url": { <media>: [url, ..] } }
			 *
			 * The reason css strings are not concatenated anymore is T33676. We now check
			 * whether it's safe to extend the stylesheet.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-implement
			 * @param {Object} [messages] List of key/value pairs to be added to mw#messages.
			 * @param {Object} [templates] List of key/value pairs to be added to mw#templates.
			 */
			implement(
				module: string,
				script?: loader.LoaderRegistry[ 'script' ],
				style?: loader.LoaderRegistry[ 'style' ],
				messages?: loader.LoaderRegistry[ 'messages' ],
				templates?: loader.LoaderRegistry[ 'templates' ]
			): void;

			/**
			 * Load an external script or one or more modules.
			 *
			 * This method takes a list of unrelated modules. Use cases:
			 *
			 * - A web page will be composed of many different widgets. These widgets independently
			 *   queue their ResourceLoader modules (`OutputPage::addModules()`). If any of them
			 *   have problems, or are no longer known (e.g. cached HTML), the other modules
			 *   should still be loaded.
			 * - This method is used for preloading, which must not throw. Later code that
			 *   calls #using() will handle the error.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-load
			 * @param {string|Array} modules Either the name of a module, array of modules,
			 *  or a URL of an external script or style
			 * @param {string} [type='text/javascript'] MIME type to use if calling with a URL of an
			 *  external script or style; acceptable values are "text/css" and
			 *  "text/javascript"; if no type is provided, text/javascript is assumed.
			 * @throws {Error} If type is invalid
			 */
			load( modules: string, type?: 'text/javascript' | 'text/css' ): void;
			load( modules: string[] ): void;

			/**
			 * Change the state of one or more modules.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-state
			 * @param {Object} states Object of module name/state pairs
			 */
			state( states: Record<string, loader.state> ): void;

			/**
			 * Get the state of a module.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-getState
			 * @param {string} module Name of module
			 * @return {string|null} The state, or null if the module (or its state) is not
			 *  in the registry.
			 */
			getState( module: string ): loader.state | null;

			/**
			 * Get the exported value of a module.
			 *
			 * This static method is publicly exposed for debugging purposes
			 * only and must not be used in production code. In production code,
			 * please use the dynamically provided `require()` function instead.
			 *
			 * In case of lazy-loaded modules via mw.loader#using(), the returned
			 * Promise provides the function, see #using() for examples.
			 *
			 * @private
			 * @since 1.27
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-require
			 * @param {string} moduleName Module name
			 * @return {Mixed} Exported value
			 */
			require<K extends keyof ExportLibrary>( moduleName: K ): ExportLibrary[ K ];
			require( moduleName: string ): unknown;

			/**
			 * On browsers that implement the localStorage API, the module store serves as a
			 * smart complement to the browser cache. Unlike the browser cache, the module store
			 * can slice a concatenated response from ResourceLoader into its constituent
			 * modules and cache each of them separately, using each module's versioning scheme
			 * to determine when the cache should be invalidated.
			 *
			 * @private
			 * @singleton
			 * @class mw.loader.store
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader.store
			 */
			readonly store: loader.Store;

			/**
			 * Get the names of all registered ResourceLoader modules.
			 *
			 * @member mw.loader
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-getModuleNames
			 * @return {string[]}
			 */
			getModuleNames(): string[];

			/**
			 * Execute a function after one or more modules are ready.
			 *
			 * Use this method if you need to dynamically control which modules are loaded
			 * and/or when they loaded (instead of declaring them as dependencies directly
			 * on your module.)
			 *
			 * This uses the same loader as for regular module dependencies. This means
			 * ResourceLoader will not re-download or re-execute a module for the second
			 * time if something else already needed it. And the same browser HTTP cache,
			 * and localStorage are checked before considering to fetch from the network.
			 * And any on-going requests from other dependencies or using() calls are also
			 * automatically re-used.
			 *
			 * Example of inline dependency on OOjs:
			 * ```
			 * mw.loader.using( 'oojs', function () {
			 *     OO.compare( [ 1 ], [ 1 ] );
			 * } );
			 * ```
			 *
			 * Example of inline dependency obtained via `require()`:
			 *
			 * ```
			 * mw.loader.using( [ 'mediawiki.util' ], function ( require ) {
			 *     var util = require( 'mediawiki.util' );
			 * } );
			 * ```
			 *
			 * Since MediaWiki 1.23 this returns a promise.
			 *
			 * Since MediaWiki 1.28 the promise is resolved with a `require` function.
			 *
			 * @member mw.loader
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-using
			 * @param {string|Array} dependencies Module name or array of modules names the
			 *  callback depends on to be ready before executing
			 * @param {Function} [ready] Callback to execute when all dependencies are ready
			 * @param {Function} [error] Callback to execute if one or more dependencies failed
			 * @return {jQuery.Promise} With a `require` function
			 */
			using(
				dependencies: string[] | string,
				ready?: ( require: Loader[ 'require' ] ) => void,
				error?: ( err: Error ) => void
			): JQuery.Promise<Loader[ 'require' ]>;

			/**
			 * Load a script by URL.
			 *
			 * Example:
			 *
			 * @example
			 * ```
			 * mw.loader.getScript(
			 *     'https://example.org/x-1.0.0.js'
			 * )
			 *     .then( function () {
			 *         // Script succeeded. You can use X now.
			 *     }, function ( e ) {
			 *         // Script failed. X is not available
			 *         mw.log.error( e.message ); // => "Failed to load script"
			 *     } );
			 * } );
			 * ```
			 *
			 * @member mw.loader
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-getScript
			 * @param {string} url Script URL
			 * @return {jQuery.Promise} Resolved when the script is loaded
			 */
			getScript( url: string ): JQuery.Promise<string>;
		}
	}

	interface MediaWiki {
		readonly loader: MediaWiki.Loader;
	}
}

export {};
