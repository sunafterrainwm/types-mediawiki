declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWikiInternal {
		namespace UriRelative {
			interface UriRelativeOptions {
				strictMode?: boolean;
				overrideKeys?: boolean;
				arrayParams?: boolean;
			}

			interface BaseUri {
				fragment?: string;
				host: string;
				password?: string;
				path: string;
				port?: string | undefined;
				protocol: string;
				query?: Record<string, string>;
				user?: string;
			}
		}

		/**
		 * Library for simple URI parsing and manipulation.
		 *
		 * Intended to be minimal, but featureful; do not expect full RFC 3986 compliance. The use cases we
		 * have in mind are constructing 'next page' or 'previous page' URLs, detecting whether we need to
		 * use cross-domain proxies for an API, constructing simple URL-based API calls, etc. Parsing here
		 * is regex-based, so may not work on all URIs, but is good enough for most.
		 *
		 * You can modify the properties directly, then use the #toString method to extract the full URI
		 * string again.
		 *
		 * @example
		 * ```
		 * var uri = new mw.Uri( 'http://example.com/mysite/mypage.php?quux=2' );
		 *
		 * if ( uri.host == 'example.com' ) {
		 *     uri.host = 'foo.example.com';
		 *     uri.extend( { bar: 1 } );
		 *
		 *     $( 'a#id1' ).attr( 'href', uri );
		 *     // anchor with id 'id1' now links to http://foo.example.com/mysite/mypage.php?bar=1&quux=2
		 *
		 *     $( 'a#id2' ).attr( 'href', uri.clone().extend( { bar: 3, pif: 'paf' } ) );
		 *     // anchor with id 'id2' now links to http://foo.example.com/mysite/mypage.php?bar=3&quux=2&pif=paf
		 * }
		 * ```
		 *
		 * Given a URI like
		 * `http://usr:pwd@www.example.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=&test3=value+%28escaped%29&r=1&r=2#top`
		 * the returned object will have the following properties:
		 * ```
		 *     protocol  'http'
		 *     user      'usr'
		 *     password  'pwd'
		 *     host      'www.example.com'
		 *     port      '81'
		 *     path      '/dir/dir.2/index.htm'
		 *     query     {
		 *                   q1: '0',
		 *                   test1: null,
		 *                   test2: '',
		 *                   test3: 'value (escaped)'
		 *                   r: ['1', '2']
		 *               }
		 *     fragment  'top'
		 * ```
		 *
		 * (N.b., 'password' is technically not allowed for HTTP URIs, but it is possible with other kinds
		 * of URIs.)
		 *
		 * @class mw.Uri
		 * @constructor
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri
		 * @param {Object|string} [uri] URI string, or an Object with appropriate properties (especially
		 *  another URI object to clone). Object must have non-blank `protocol`, `host`, and `path`
		 *  properties. If omitted (or set to `undefined`, `null` or empty string), then an object
		 *  will be created for the default `uri` of this constructor (`location.href` for mw.Uri,
		 *  other values for other instances -- see mw.UriRelative for details).
		 * @param {Object|boolean} [options] Object with options, or (backwards compatibility) a boolean
		 *  for strictMode
		 * @param {boolean} [options.strictMode=false] Trigger strict mode parsing of the url.
		 * @param {boolean} [options.overrideKeys=false] Whether to let duplicate query parameters
		 *  override each other (`true`) or automagically convert them to an array (`false`).
		 * @param {boolean} [options.arrayParams=false] Whether to parse array query parameters (e.g.
		 *  `&foo[0]=a&foo[1]=b` or `&foo[]=a&foo[]=b`) or leave them alone. Currently this does not
		 *  handle associative or multi-dimensional arrays, but that may be improved in the future.
		 *  Implies `overrideKeys: true` (query parameters without `[...]` are not parsed as arrays).
		 * @throws {Error} when the query string or fragment contains an unknown % sequence
		 */
		class UriRelative implements UriRelative.BaseUri {
			fragment?: string;
			host: string;
			password?: string;
			path: string;
			port?: string | undefined;
			protocol: string;
			query: Record<string, string>;
			user?: string;

			/**
			 * Construct a new URI object. Throws error if arguments are illegal/impossible, or
			 * otherwise don't parse.
			 */
			constructor( uri?: string | UriRelative.BaseUri, options?: UriRelative.UriRelativeOptions );

			/**
			 * Encode a value for inclusion in a url.
			 *
			 * Standard encodeURIComponent, with extra stuff to make all browsers work similarly and more
			 * compliant with RFC 3986. Similar to rawurlencode from PHP and our JS library
			 * mw.util.rawurlencode, except this also replaces spaces with `+`.
			 *
			 * @static
			 * @param {string} s String to encode
			 * @return {string} Encoded string for URI
			 */
			static encode( s: string ): string;

			/**
			 * Decode a url encoded value.
			 *
			 * Reversed #encode. Standard decodeURIComponent, with addition of replacing
			 * `+` with a space.
			 *
			 * @static
			 * @param {string} s String to decode
			 * @return {string} Decoded string
			 * @throws {Error} when the string contains an unknown % sequence
			 */
			static decode( s: string ): string;

			/**
			 * Parse a string and set our properties accordingly.
			 *
			 * @private
			 * @param {string} str URI, see constructor.
			 * @param {Object} options See constructor.
			 * @throws {Error} when the query string or fragment contains an unknown % sequence
			 */
			private parse( str: string, options: UriRelative.UriRelativeOptions ): void;

			/**
			 * Get user and password section of a URI.
			 *
			 * @return {string}
			 */
			getUserInfo(): string;

			/**
			 * Get host and port section of a URI.
			 *
			 * @return {string}
			 */
			getHostPort(): string;

			/**
			 * Get the userInfo, host and port section of the URI.
			 *
			 * In most real-world URLs this is simply the hostname, but the definition of 'authority' section is more general.
			 *
			 * @return {string}
			 */
			getAuthority(): string;

			/**
			 * Get the query arguments of the URL, encoded into a string.
			 *
			 * Does not preserve the original order of arguments passed in the URI. Does handle escaping.
			 *
			 * @return {string}
			 */
			getQueryString(): string;

			/**
			 * Get everything after the authority section of the URI.
			 *
			 * @return {string}
			 */
			getRelativePath(): string;

			/**
			 * Get the entire URI string.
			 *
			 * May not be precisely the same as input due to order of query arguments.
			 *
			 * @return {string} The URI string
			 */
			toString(): string;

			/**
			 * Clone this URI
			 *
			 * @return {Object} New URI object with same properties
			 */
			clone(): this;

			/**
			 * Extend the query section of the URI with new parameters.
			 *
			 * @param {Object} parameters Query parameters to add to ours (or to override ours with) as an
			 *  object
			 * @return {Object} This URI object
			 */
			extend( parameters: Record<string, string> ): this;
		}
	}

	namespace MediaWiki {
		namespace Uri {
			/* eslint-disable @typescript-eslint/no-empty-interface */
			interface BaseUri extends MediaWikiInternal.UriRelative.BaseUri {}
			interface UriOptions extends MediaWikiInternal.UriRelative.UriRelativeOptions {}
		}

		/**
		 * Library for simple URI parsing and manipulation.
		 *
		 * Intended to be minimal, but featureful; do not expect full RFC 3986 compliance. The use cases we
		 * have in mind are constructing 'next page' or 'previous page' URLs, detecting whether we need to
		 * use cross-domain proxies for an API, constructing simple URL-based API calls, etc. Parsing here
		 * is regex-based, so may not work on all URIs, but is good enough for most.
		 *
		 * @class mw.Uri
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri
		 */
		class Uri extends MediaWikiInternal.UriRelative {
			/**
			 * Library for simple URI parsing and manipulation.
			 *
			 * Intended to be minimal, but featureful; do not expect full RFC 3986 compliance. The use cases we
			 * have in mind are constructing 'next page' or 'previous page' URLs, detecting whether we need to
			 * use cross-domain proxies for an API, constructing simple URL-based API calls, etc. Parsing here
			 * is regex-based, so may not work on all URIs, but is good enough for most.
			 *
			 * You can modify the properties directly, then use the #toString method to extract the full URI
			 * string again.
			 *
			 * @example
			 * ```
			 * var uri = new mw.Uri( 'http://example.com/mysite/mypage.php?quux=2' );
			 *
			 * if ( uri.host == 'example.com' ) {
			 *     uri.host = 'foo.example.com';
			 *     uri.extend( { bar: 1 } );
			 *
			 *     $( 'a#id1' ).attr( 'href', uri );
			 *     // anchor with id 'id1' now links to http://foo.example.com/mysite/mypage.php?bar=1&quux=2
			 *
			 *     $( 'a#id2' ).attr( 'href', uri.clone().extend( { bar: 3, pif: 'paf' } ) );
			 *     // anchor with id 'id2' now links to http://foo.example.com/mysite/mypage.php?bar=3&quux=2&pif=paf
			 * }
			 * ```
			 *
			 * Given a URI like
			 * `http://usr:pwd@www.example.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=&test3=value+%28escaped%29&r=1&r=2#top`
			 * the returned object will have the following properties:
			 * ```
			 *     protocol  'http'
			 *     user      'usr'
			 *     password  'pwd'
			 *     host      'www.example.com'
			 *     port      '81'
			 *     path      '/dir/dir.2/index.htm'
			 *     query     {
			 *                   q1: '0',
			 *                   test1: null,
			 *                   test2: '',
			 *                   test3: 'value (escaped)'
			 *                   r: ['1', '2']
			 *               }
			 *     fragment  'top'
			 * ```
			 *
			 * (N.b., 'password' is technically not allowed for HTTP URIs, but it is possible with other kinds
			 * of URIs.)
			 *
			 * @constructor
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Uri-method-constructor
			 * @param {Object|string} [uri] URI string, or an Object with appropriate properties (especially
			 *  another URI object to clone). Object must have non-blank `protocol`, `host`, and `path`
			 *  properties. If omitted (or set to `undefined`, `null` or empty string), then an object
			 *  will be created for the default `uri` of this constructor (`location.href` for mw.Uri,
			 *  other values for other instances -- see mw.UriRelative for details).
			 * @param {Object|boolean} [options] Object with options, or (backwards compatibility) a boolean
			 *  for strictMode
			 * @param {boolean} [options.strictMode=false] Trigger strict mode parsing of the url.
			 * @param {boolean} [options.overrideKeys=false] Whether to let duplicate query parameters
			 *  override each other (`true`) or automatically convert them to an array (`false`).
			 * @param {boolean} [options.arrayParams=false] Whether to parse array query parameters (e.g.
			 *  `&foo[0]=a&foo[1]=b` or `&foo[]=a&foo[]=b`) or leave them alone. Currently this does not
			 *  handle associative or multi-dimensional arrays, but that may be improved in the future.
			 *  Implies `overrideKeys: true` (query parameters without `[...]` are not parsed as arrays).
			 * @throws {Error} when the query string or fragment contains an unknown % sequence
			 */
			constructor ( uri?: string | Uri.BaseUri, options?: Uri.UriOptions );
		}
		/* eslint-enable @typescript-eslint/no-empty-interface */
	}

	interface MediaWiki {
		/**
		 * A factory method to create an mw.Uri class with a default location to resolve relative URLs
		 * against (including protocol-relative URLs).
		 *
		 * @method
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-UriRelative
		 * @param {string|Function} documentLocation A full url, or function returning one.
		 *  If passed a function, the return value may change over time and this will be honoured. (T74334)
		 * @member mw
		 * @return {Function} An mw.Uri class constructor
		 */
		UriRelative( documentLocation: string | ( () => string ) ): typeof MediaWikiInternal.UriRelative;
	}
}

export {};
