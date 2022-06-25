declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		/**
		 * Utility library provided by the `mediawiki.util` module.
		 *
		 * @class mw.util
		 * @singleton
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util
		 */
		interface Util {
			/**
			 * Encode the string like PHP's rawurlencode
			 *
			 * @param {string} str String to be encoded.
			 * @return {string} Encoded string
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-rawurlencode
			 */
			rawurlencode( str:string ): string;

			/**
			 * Encode a string as CSS id, for use as HTML id attribute value.
			 *
			 * Analog to `Sanitizer::escapeIdForAttribute()` in PHP.
			 *
			 * @since 1.30
			 * @param {string} str String to encode
			 * @return {string} Encoded string
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-escapeIdForAttribute
			 */
			escapeIdForAttribute( str:string ): string;

			/**
			 * Encode a string as URL fragment, for use as HTML anchor link.
			 *
			 * Analog to `Sanitizer::escapeIdForLink()` in PHP.
			 *
			 * @since 1.30
			 * @param {string} str String to encode
			 * @return {string} Encoded string
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-escapeIdForLink
			 */
			escapeIdForLink( str:string ): string;

			/**
			 * Return a wrapper function that is debounced for the given duration.
			 *
			 * When it is first called, a timeout is scheduled. If before the timer
			 * is reached the wrapper is called again, it gets rescheduled for the
			 * same duration from now until it stops being called. The original function
			 * is called from the "tail" of such chain, with the last set of arguments.
			 *
			 * @since 1.34
			 * @deprecated since 1.38, Use new signature instead.
			 * @param {number} delay Time in milliseconds
			 * @param {Function} callback
			 * @return {Function}
			 * @see https://doc.wikimedia.org/mediawiki-core/REL1_37/js/#!/api/mw.util-method-debounce
			 */
			debounce<T extends ( ...args: unknown[] ) => void>( delay: number, callback: T ): T;
			/**
			 * Return a function, that, as long as it continues to be invoked, will not
			 * be triggered. The function will be called after it stops being called for
			 * N milliseconds. If `immediate` is passed, trigger the function on the
			 * leading edge, instead of the trailing.
			 *
			 * Ported from Underscore.js 1.5.2, Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud
			 * and Investigative Reporters & Editors, distributed under the MIT license, from
			 * <https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L689>.
			 *
			 * @since 1.34
			 * @since 1.38 (new signature)
			 * @param {Function} func Function to debounce
			 * @param {number} [wait=0] Wait period in milliseconds
			 * @param {boolean} [immediate] Trigger on leading edge
			 * @return {Function} Debounced function
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-debounce
			 */
			debounce<T extends ( ...args: unknown[] ) => void>( func: T, wait?: number, immediate?: boolean ): T;

			/**
			 * Return a function, that, when invoked, will only be triggered at most once
			 * during a given window of time. If called again during that window, it will
			 * wait until the window ends and then trigger itself again.
			 *
			 * As it's not knowable to the caller whether the function will actually run
			 * when the wrapper is called, return values from the function are entirely
			 * discarded.
			 *
			 * Ported from OOUI.
			 *
			 * @param {Function} func Function to throttle
			 * @param {number} wait Throttle window length, in milliseconds
			 * @return {Function} Throttled function
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-throttle
			 */
			throttle<T extends ( ...args: unknown[] ) => void>( func: T, wait?: number ): T;

			/**
			 * Encode page titles for use in a URL
			 *
			 * We want / and : to be included as literal characters in our title URLs
			 * as they otherwise fatally break the title.
			 *
			 * The others are decoded because we can, it's prettier and matches behavior
			 * of `wfUrlencode` in PHP.
			 *
			 * @param {string} str String to be encoded.
			 * @return {string} Encoded string
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-wikiUrlencode
			 */
			wikiUrlencode( str:string ): string;

			/**
			 * Get the URL to a given local wiki page name,
			 *
			 * @param {string|null} [pageName=wgPageName] Page name
			 * @param {Object} [params] A mapping of query parameter names to values,
			 *  e.g. `{ action: 'edit' }`
			 * @return {string} URL, relative to `wgServer`.
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-getUrl
			 */
			getUrl( pageName?: string, params?: Record<string, string> ): string;

			/**
			 * Get URL to a MediaWiki server entry point.
			 *
			 * Similar to `wfScript()` in PHP.
			 *
			 * @since 1.18
			 * @param {string} [str="index"] Name of entry point (e.g. 'index' or 'api')
			 * @return {string} URL to the script file (e.g. `/w/api.php`)
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-wikiScript
			 */
			wikiScript( str?: string ): string;

			/**
			 * Append a new style block to the head and return the CSSStyleSheet object.
			 *
			 * To access the `<style>` element, reference `sheet.ownerNode`, or call
			 * the mw.loader#addStyleTag method directly.
			 *
			 * This function returns the CSSStyleSheet object for convince with features
			 * that are managed at that level, such as toggling of styles:
			 *
			 *     var sheet = util.addCSS( '.foobar { display: none; }' );
			 *     $( '#myButton' ).click( function () {
			 *         // Toggle the sheet on and off
			 *         sheet.disabled = !sheet.disabled;
			 *     } );
			 *
			 * See also [MDN: CSSStyleSheet](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet).
			 *
			 * @param {string} text CSS to be appended
			 * @return {CSSStyleSheet} The sheet object
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-addCSS
			 */
			addCSS( text: string ): CSSStyleSheet;

			/**
			 * Get the value for a given URL query parameter.
			 *
			 *     mw.util.getParamValue( 'foo', '/?foo=x' ); // "x"
			 *     mw.util.getParamValue( 'foo', '/?foo=' ); // ""
			 *     mw.util.getParamValue( 'foo', '/' ); // null
			 *
			 * @param {string} param The parameter name.
			 * @param {string} [url=location.href] URL to search through, defaulting to the current browsing location.
			 * @return {string|null} Parameter value, or null if parameter was not found.
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-getParamValue
			 */
			getParamValue( param: string, url?: string ): string|null;

			/**
			 * The content wrapper of the skin (e.g. `.mw-body`).
			 *
			 * Populated on document ready. To use this property,
			 * wait for `$.ready` and be sure to have a module dependency on
			 * `mediawiki.util` which will ensure
			 * your document ready handler fires after initialization.
			 *
			 * Because of the lazy-initialized nature of this property,
			 * you're discouraged from using it.
			 *
			 * If you need just the wikipage content (not any of the
			 * extra elements output by the skin), use `$( '#mw-content-text' )`
			 * instead. Or listen to mw.hook#wikipage_content which will
			 * allow your code to re-run when the page changes (e.g. live preview
			 * or re-render after ajax save).
			 *
			 * @property {jQuery}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-property-S-content
			 */
			readonly $content: JQuery | null;

			/**
			 * Hide a portlet.
			 *
			 * @param {string} portletId ID of the target portlet (e.g. 'p-cactions' or 'p-personal')
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-hidePortlet
			 */
			hidePortlet( portletId: string ): void;

			/**
			 * Is a portlet visible?
			 *
			 * @param {string} portletId ID of the target portlet (e.g. 'p-cactions' or 'p-personal')
			 * @return {boolean}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-isPortletVisible
			 */
			isPortletVisible( portletId: string ): boolean;

			/**
			 * Reveal a portlet if it is hidden.
			 *
			 * @param {string} portletId ID of the target portlet (e.g. 'p-cactions' or 'p-personal')
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-showPortlet
			 */
			showPortlet( portletId: string ): void;

			/**
			 * Add a link to a portlet menu on the page, such as:
			 *
			 * - p-cactions (Content actions),
			 * - p-personal (Personal tools),
			 * - p-navigation (Navigation),
			 * - p-tb (Toolbox).
			 *
			 * The first three parameters are required, the others are optional and
			 * may be null. Though providing an id and tooltip is recommended.
			 *
			 * By default, the new link will be added to the end of the menu. To
			 * add the link before an existing item, pass the DOM node or a CSS selector
			 * for that item, e.g. `'#foobar'` or `document.getElementById( 'foobar' )`.
			 *
			 * @example
			 * ```
			 * mw.util.addPortletLink(
			 *     'p-tb', 'https://www.mediawiki.org/',
			 *     'mediawiki.org', 't-mworg', 'Go to mediawiki.org', 'm', '#t-print'
			 * );
			 *
			 * var node = mw.util.addPortletLink(
			 *     'p-tb',
			 *     new mw.Title( 'Special:Example' ).getUrl(),
			 *     'Example'
			 * );
			 * $( node ).on( 'click', function ( e ) {
			 *     console.log( 'Example' );
			 *     e.preventDefault();
			 * } );
			 * ```
			 *
			 * Remember that to call this inside a user script, you may have to ensure the
			 * `mediawiki.util` is loaded first:
			 * ```
			 * $.when( mw.loader.using( [ 'mediawiki.util' ] ), $.ready ).then( function () {
			 *      mw.util.addPortletLink( 'p-tb', 'https://www.mediawiki.org/', 'mediawiki.org' );
			 * } );
			 * ```
			 *
			 * @param {string} portletId ID of the target portlet (e.g. 'p-cactions' or 'p-personal')
			 * @param {string} href Link URL
			 * @param {string} text Link text
			 * @param {string} [id] ID of the list item, should be unique and preferably have
			 *  the appropriate prefix ('ca-', 'pt-', 'n-' or 't-')
			 * @param {string} [tooltip] Text to show when hovering over the link, without accesskey suffix
			 * @param {string} [accesskey] Access key to activate this link. One character only,
			 *  avoid conflicts with other links. Use `$( '[accesskey=x]' )` in the console to
			 *  see if 'x' is already used.
			 * @param {HTMLElement|jQuery|string} [nextnode] Element that the new item should be added before.
			 *  Must be another item in the same list, it will be ignored otherwise.
			 *  Can be specified as DOM reference, as jQuery object, or as CSS selector string.
			 * @return {HTMLElement|null} The added list item, or null if no element was added.
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-addPortletLink
			 */
			addPortletLink(
				portletId: string,
				href: string,
				text: string,
				id?: `${'ca'|'pt'|'n'|'t'}-${string}`,
				tooltip?: string,
				accesskey?: string,
				nextnode?: HTMLElement | JQuery | string
			): HTMLLIElement | null;

			/**
			 * Validate a string as representing a valid e-mail address.
			 *
			 * This validation is based on the HTML5 specification.
			 *
			 *     mw.util.validateEmail( "me@example.org" ) === true;
			 *
			 * @param {string} email E-mail address
			 * @return {boolean|null} True if valid, false if invalid, null if `email` was empty.
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-validateEmail
			 */
			validateEmail( email: string ): boolean | null;

			/**
			 * Whether a string is a valid IPv4 address or not.
			 *
			 * Based on \Wikimedia\IPUtils::isIPv4 in PHP.
			 *
			 *     // Valid
			 *     mw.util.isIPv4Address( '80.100.20.101' );
			 *     mw.util.isIPv4Address( '192.168.1.101' );
			 *
			 *     // Invalid
			 *     mw.util.isIPv4Address( '192.0.2.0/24' );
			 *     mw.util.isIPv4Address( 'hello' );
			 *
			 * @param {string} address
			 * @param {boolean} [allowBlock=false]
			 * @return {boolean}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-isIPv4Address
			 */
			isIPv4Address( address: string, allowBlock?: boolean ): boolean;

			/**
			 * Whether a string is a valid IPv6 address or not.
			 *
			 * Based on \Wikimedia\IPUtils::isIPv6 in PHP.
			 *
			 *     // Valid
			 *     mw.util.isIPv4Address( '2001:db8:a:0:0:0:0:0' );
			 *     mw.util.isIPv4Address( '2001:db8:a::' );
			 *
			 *     // Invalid
			 *     mw.util.isIPv4Address( '2001:db8:a::/32' );
			 *     mw.util.isIPv4Address( 'hello' );
			 *
			 * @param {string} address
			 * @param {boolean} [allowBlock=false]
			 * @return {boolean}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-isIPv6Address
			 */
			isIPv6Address( address: string, allowBlock?: boolean ): boolean;

			/**
			 * Check whether a string is a valid IP address
			 *
			 * @since 1.25
			 * @param {string} address String to check
			 * @param {boolean} [allowBlock=false] If a block of IPs should be allowed
			 * @return {boolean}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-isIPAddress
			 */
			isIPAddress( address: string, allowBlock?: boolean ): boolean;

			/**
			 * Parse the URL of an image uploaded to MediaWiki, or a thumbnail for such an image,
			 * and return the image name, thumbnail size and a template that can be used to resize
			 * the image.
			 *
			 * @param {string} url URL to parse (URL-encoded)
			 * @return {Object|null} URL data, or null if the URL is not a valid MediaWiki
			 *   image/thumbnail URL.
			 * @return {string} return.name File name (same format as Title.getMainText()).
			 * @return {number} [return.width] Thumbnail width, in pixels. Null when the file is not
			 *   a thumbnail.
			 * @return {function(number):string} [return.resizeUrl] A function that takes a width
			 *   parameter and returns a thumbnail URL (URL-encoded) with that width. The width
			 *   parameter must be smaller than the width of the original image (or equal to it; that
			 *   only works if MediaHandler::mustRender returns true for the file). Null when the
			 *   file in the original URL is not a thumbnail.
			 *   On wikis with $wgGenerateThumbnailOnParse set to true, this will fall back to using
			 *   Special:Redirect which is less efficient. Otherwise, it is a direct thumbnail URL.
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-parseImageUrl
			 */
			parseImageUrl( url: string ): {
				name: string;
				width?: number;
				resizeUrl?( size: number ):string;
			} | null;

			/**
			 * Escape string for safe inclusion in regular expression
			 *
			 * The following characters are escaped:
			 *
			 *  `\` `{` `}` `(` `)` `|` `.` `?` `*` `+` `-` `^` `$` `[` `]`
			 *
			 * @since 1.26
			 * @since 1.34 moved to mw.util
			 * @param {string} str String to escape
			 * @return {string} Escaped string
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-escapeRegExp
			 */
			escapeRegExp( str: string ): string;

			/**
			 * This functionality has been adapted from \Wikimedia\IPUtils::sanitizeIP()
			 *
			 * Convert an IP into a verbose, uppercase, normalized form.
			 * Both IPv4 and IPv6 addresses are trimmed. Additionally,
			 * IPv6 addresses in octet notation are expanded to 8 words;
			 * IPv4 addresses have leading zeros, in each octet, removed.
			 *
			 * @param {string} ip IP address in quad or octet form (CIDR or not).
			 * @return {string|null}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-sanitizeIP
			 */
			sanitizeIP( ip: string ): string | null;

			/**
			 * This functionality has been adapted from \Wikimedia\IPUtils::prettifyIP()
			 *
			 * Prettify an IP for display to end users.
			 * This will make it more compact and lower-case.
			 *
			 * @param {string} ip IP address in quad or octet form (CIDR or not).
			 * @return {string|null}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-prettifyIP
			 */
			prettifyIP( ip: string ): string | null;
		}

		interface ExportLibrary {
			/**
			 * Utility library provided by the `mediawiki.util` module.
			 *
			 * @class mw.util
			 * @singleton
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util
			 */
			'mediawiki.util': MediaWiki.Util;
		}
	}

	interface MediaWiki {
		/**
		 * Utility library provided by the `mediawiki.util` module.
		 *
		 * @class mw.util
		 * @singleton
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util
		 */
		readonly util: MediaWiki.Util;

		/**
		 * @class mw.RegExp
		 * @deprecated since 1.34
		 * @see https://doc.wikimedia.org/mediawiki-core/REL1_33/js/#!/api/mw.RegExp
		 */
		readonly RegExp: {
			/**
			 * Escape string for safe inclusion in regular expression
			 *
			 * The following characters are escaped:
			 *
			 *  `\` `{` `}` `(` `)` `|` `.` `?` `*` `+` `-` `^` `$` `[` `]`
			 *
			 * @since 1.26
			 * @deprecated since 1.34 Use mw.util.escapeRegExp() instead.
			 * @static
			 * @param {string} str String to escape
			 * @return {string} Escaped string
			 * @see https://doc.wikimedia.org/mediawiki-core/REL1_33/js/#!/api/mw.RegExp-static-method-escape
			 */
			escapeRegExp( str: string ): string;
		};
	}
}

export interface JQueryPluginAccessKeyLabel<TElement = HTMLElement> {
	/**
	 * Update the titles for all elements in a jQuery selection.
	 *
	 * @return {jQuery}
	 * @chainable
	 */
	(): JQuery<TElement>;

	/**
	 * Get the access key label for an element.
	 *
	 * Will use native accessKeyLabel if available (currently only in Firefox 8+).
	 *
	 * @method updateTooltipAccessKeys_getAccessKeyLabel
	 * @param {HTMLElement} element Element to get the label for
	 * @return {string} Access key label
	 */
	getAccessKeyLabel( element: HTMLElement ): string;

	/**
	 * getAccessKeyPrefix
	 *
	 * @method updateTooltipAccessKeys_getAccessKeyPrefix
	 * @param {Object} [nav] An object with a 'userAgent' and 'platform' property.
	 * @return {string}
	 */
	getAccessKeyPrefix( nav?: Navigator | Pick<Navigator, 'userAgent' | 'platform'> ): string;

	/**
	 * Switch test mode on and off.
	 *
	 * @method updateTooltipAccessKeys_setTestMode
	 * @param {boolean} mode New mode
	 */
	setTestMode( mode: boolean ): void;
}

declare global {
	interface JQuery<TElement = HTMLElement> {
		/**
		 * Update the titles for all elements in a jQuery selection.
		 */
		updateTooltipAccessKeys: JQueryPluginAccessKeyLabel<TElement>;
	}
}

export {};
