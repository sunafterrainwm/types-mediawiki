declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		/**
		 * Manage cookies in a way that is syntactically and functionally similar
		 * to the `WebRequest#getCookie` and `WebResponse#setcookie` methods in PHP.
		 *
		 * @author Sam Smith <samsmith@wikimedia.org>
		 * @author Matthew Flaschen <mflaschen@wikimedia.org>
		 *
		 * @class mw.cookie
		 * @singleton
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.cookie
		 */
		interface Cookie {
			/**
			 * Set or delete a cookie.
			 *
			 * **Note:** If explicitly passing `null` or `undefined` for an options key,
			 * that will override the default. This is natural in JavaScript, but noted
			 * here because it is contrary to MediaWiki's `WebResponse#setcookie()` method
			 * in PHP.
			 *
			 * When using this for persistent storage of identifiers (e.g. for tracking
			 * sessions), be aware that persistence may vary slightly across browsers and
			 * browser versions, and can be affected by a number of factors such as
			 * storage limits (cookie eviction) and session restore features.
			 *
			 * Without an expiry, this creates a session cookie. In a browser, session cookies persist
			 * for the lifetime of the browser *process*. Including across tabs, page views, and windows,
			 * until the browser itself is *fully* closed, or until the browser clears all storage for
			 * a given website. An exception to this is if the user evokes a "restore previous
			 * session" feature that some browsers have.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.cookie-method-set
			 * @param {string} key
			 * @param {string|null} value Value of cookie. If `value` is `null` then this method will
			 *   instead remove a cookie by name of `key`.
			 * @param {Object|Date|number} [options] Options object, or expiry date
			 * @param {Date|number|null} [options.expires=wgCookieExpiration] The expiry date of the cookie,
			 *  or lifetime in seconds. If `options.expires` is null or 0, then a session cookie is set.
			 * @param {string} [options.prefix=wgCookiePrefix] The prefix of the key
			 * @param {string} [options.domain=wgCookieDomain] The domain attribute of the cookie
			 * @param {string} [options.path=wgCookiePath] The path attribute of the cookie
			 * @param {boolean} [options.secure=false] Whether or not to include the secure attribute.
			 *   (Does **not** use the wgCookieSecure configuration variable)
			 * @param {string} [options.sameSite=''] The SameSite flag of the cookie ('None' / 'Lax'
			 *   / 'Strict', case-insensitive; default is to omit the flag, which results in Lax on
			 *   modern browsers). Set to None AND set secure=true if the cookie needs to be visible on
			 *   cross-domain requests.
			 * @param {boolean} [options.sameSiteLegacy=$wgUseSameSiteLegacyCookies] If true, sameSite=None
			 *   cookies will also be sent as a non-SameSite cookie with an 'ss0-' prefix, to work around
			 *   old browsers interpreting the standard differently.
			 */
			set( key: string, value: unknown, options?: JQueryCookieOptions ): void;

			/**
			 * Get the value of a cookie.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.cookie-method-get
			 * @param {string} key
			 * @param {string} [prefix=wgCookiePrefix] The prefix of the key. If `prefix` is
			 *   `undefined` or `null`, then `wgCookiePrefix` is used
			 * @param {Mixed} [defaultValue=null]
			 * @return {string|null|Mixed} If the cookie exists, then the value of the
			 *   cookie, otherwise `defaultValue`
			 */
			get( key: string, prefix?: string, defaultValue?: unknown ): string | null | unknown;

			/**
			 * Get the value of a SameSite=None cookie, using the legacy ss0- cookie if needed.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.cookie-method-getCrossSite
			 * @param {string} key
			 * @param {string} [prefix=wgCookiePrefix] The prefix of the key. If `prefix` is
			 *   `undefined` or `null`, then `wgCookiePrefix` is used
			 * @param {Mixed} [defaultValue=null]
			 * @return {string|null|Mixed} If the cookie exists, then the value of the
			 *   cookie, otherwise `defaultValue`
			 */
			getCrossSite( key: string, prefix?: string, defaultValue?: unknown ): string | null | unknown;
		}
	}

	interface MediaWiki {
		/**
		 * Manage cookies in a way that is syntactically and functionally similar
		 * to the `WebRequest#getCookie` and `WebResponse#setcookie` methods in PHP.
		 *
		 * @author Sam Smith <samsmith@wikimedia.org>
		 * @author Matthew Flaschen <mflaschen@wikimedia.org>
		 *
		 * @class mw.cookie
		 * @singleton
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.cookie
		 */
		readonly cookie: MediaWiki.Cookie;
	}
}

export {};
