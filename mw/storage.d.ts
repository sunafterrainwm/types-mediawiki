declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWikiInternal {
		/**
		 * A wrapper for the HTML5 Storage interface (`localStorage` or `sessionStorage`)
		 * that is safe to call in all browsers.
		 *
		 * @class mw.SafeStorage
		 * @private
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.SafeStorage
		 * @param {Object|undefined} store The Storage instance to wrap around
		 */
		class SafeStorage {
			constructor( store: Storage | undefined );

			/**
			 * Retrieve value from device storage.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.SafeStorage-method-get
			 * @param {string} key Key of item to retrieve
			 * @return {string|null|boolean} String value, null if no value exists, or false
			 *  if storage is not available.
			 */
			get( key: string ): string | null | false;

			/**
			 * Set a value in device storage.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.SafeStorage-method-set
			 * @param {string} key Key name to store under
			 * @param {string} value Value to be stored
			 * @return {boolean} The value was set
			 */
			set( key: string, value:string ): boolean;

			/**
			 * Remove a value from device storage.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.SafeStorage-method-remove
			 * @param {string} key Key of item to remove
			 * @return {boolean} Whether the key was removed
			 */
			remove( key: string ): boolean;

			/**
			 * Retrieve JSON object from device storage.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.SafeStorage-method-getObject
			 * @param {string} key Key of item to retrieve
			 * @return {Object|null|boolean} Object, null if no value exists or value
			 *  is not JSON-parsable, or false if storage is not available.
			 */
			getObject<T extends Record<string, unknown>>( key: string ): T | null | false;

			/**
			 * Set an object value in device storage by JSON encoding
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.SafeStorage-method-setObject
			 * @param {string} key Key name to store under
			 * @param {Object} value Object value to be stored
			 * @return {boolean} The value was set
			 */
			setObject( key: string, value: Record<string, unknown> ): boolean;
		}
	}

	namespace MediaWiki {
		interface ExportLibrary {
			'mediawiki.storage': {
				/**
				 * A safe interface to HTML5 `localStorage`.
				 *
				 * This normalizes differences across browsers and silences any and all
				 * exceptions that may occur.
				 *
				 * **Note**: Storage keys are not automatically prefixed in relation to
				 * MediaWiki and/or the current wiki. Always **prefix your keys** with "mw" to
				 * avoid conflicts with other JavaScript libraries, gadgets, or third-party
				 * JavaScript.
				 *
				 * **Warning**: There is no expiry feature in this API. This means **keys
				 * are stored forever**, unless you re-discover and delete them manually.
				 * Avoid keys with variable components. Instead store dynamic values
				 * together under a single key so that you avoid leaving garbage behind,
				 * which would fill up the limited space available.
				 * See also <https://phabricator.wikimedia.org/T121646>.
				 *
				 * @example
				 * ```
				 * mw.storage.set( key, value );
				 * mw.storage.get( key );
				 * ```
				 *
				 * @example
				 * ```
				 * var local = require( 'mediawiki.storage' ).local;
				 * local.set( key, value );
				 * local.get( key );
				 * ```
				 *
				 * @class
				 * @singleton
				 * @extends mw.SafeStorage
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.storage
				 */
				local: MediaWikiInternal.SafeStorage;

				/**
				 * A safe interface to HTML5 `sessionStorage`.
				 *
				 * This normalizes differences across browsers and silences any and all
				 * exceptions that may occur.
				 *
				 * **Note**: Data persisted via `sessionStorage` will persist for the lifetime
				 * of the browser *tab*, not the browser *window*.
				 * For longer-lasting persistence across tabs, refer to mw.storage or mw.cookie instead.
				 *
				 * @example
				 * ```
				 * mw.storage.set( key, value );
				 * mw.storage.get( key );
				 * ```
				 *
				 * @example
				 * ```
				 * var session = require( 'mediawiki.storage' ).session;
				 * session.set( key, value );
				 * session.get( key );
				 * ```
				 *
				 * @class
				 * @singleton
				 * @extends mw.SafeStorage
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.storage.session
				 */
				session: MediaWikiInternal.SafeStorage;
			};
		}
	}

	interface MediaWiki {
		/**
		 * A safe interface to HTML5 `localStorage`.
		 *
		 * This normalizes differences across browsers and silences any and all
		 * exceptions that may occur.
		 *
		 * **Note**: Storage keys are not automatically prefixed in relation to
		 * MediaWiki and/or the current wiki. Always **prefix your keys** with "mw" to
		 * avoid conflicts with other JavaScript libraries, gadgets, or third-party
		 * JavaScript.
		 *
		 * **Warning**: There is no expiry feature in this API. This means **keys
		 * are stored forever**, unless you re-discover and delete them manually.
		 * Avoid keys with variable components. Instead store dynamic values
		 * together under a single key so that you avoid leaving garbage behind,
		 * which would fill up the limited space available.
		 * See also <https://phabricator.wikimedia.org/T121646>.
		 *
		 * @example
		 * ```
		 * mw.storage.set( key, value );
		 * mw.storage.get( key );
		 * ```
		 *
		 * @example
		 * ```
		 * var local = require( 'mediawiki.storage' ).local;
		 * local.set( key, value );
		 * local.get( key );
		 * ```
		 *
		 * @class
		 * @singleton
		 * @extends mw.SafeStorage
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.storage
		 */
		readonly storage: MediaWikiInternal.SafeStorage & {
			/**
			 * A safe interface to HTML5 `sessionStorage`.
			 *
			 * This normalizes differences across browsers and silences any and all
			 * exceptions that may occur.
			 *
			 * **Note**: Data persisted via `sessionStorage` will persist for the lifetime
			 * of the browser *tab*, not the browser *window*.
			 * For longer-lasting persistence across tabs, refer to mw.storage or mw.cookie instead.
			 *
			 * @example
			 * ```
			 * mw.storage.set( key, value );
			 * mw.storage.get( key );
			 * ```
			 *
			 * @example
			 * ```
			 * var session = require( 'mediawiki.storage' ).session;
			 * session.set( key, value );
			 * session.get( key );
			 * ```
			 *
			 * @class
			 * @singleton
			 * @extends mw.SafeStorage
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.storage.session
			 */
			readonly session: MediaWikiInternal.SafeStorage;
		};
	}
}

export {};
