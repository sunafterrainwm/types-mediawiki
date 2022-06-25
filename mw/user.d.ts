declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		interface User {
			/**
			 * @property {mw.Map}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-property-options
			 */
			options: Map<Record<string, unknown>>;

			/**
			 * @property {mw.Map}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-property-tokens
			 */
			tokens: Map<Record<string, string>>;

			/**
			 * Generate a random user session ID.
			 *
			 * This information would potentially be stored in a cookie to identify a user during a
			 * session or series of sessions. Its uniqueness should not be depended on unless the
			 * browser supports the crypto API.
			 *
			 * Known problems with Math.random():
			 * Using the Math.random function we have seen sets
			 * with 1% of non uniques among 200,000 values with Safari providing most of these.
			 * Given the prevalence of Safari in mobile the percentage of duplicates in
			 * mobile usages of this code is probably higher.
			 *
			 * Rationale:
			 * We need about 80 bits to make sure that probability of collision
			 * on 155 billion  is <= 1%
			 *
			 * See https://en.wikipedia.org/wiki/Birthday_attack#Mathematics
			 * n(p;H) = n(0.01,2^80)= sqrt (2 * 2^80 * ln(1/(1-0.01)))
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-generateRandomSessionId
			 * @return {string} 80 bit integer in hex format, padded
			 */
			generateRandomSessionId(): string;

			/**
			 * A sticky generateRandomSessionId for the current JS execution context,
			 * cached within this class (also known as a page view token).
			 *
			 * @since 1.32
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-getPageviewToken
			 * @return {string} 80 bit integer in hex format, padded
			 */
			getPageviewToken(): string;

			/**
			 * Get the current user's database id
			 *
			 * Not to be confused with #id.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-getId
			 * @return {number} Current user's id, or 0 if user is anonymous
			 */
			getId(): number;

			/**
			 * Get the current user's name
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-getName
			 * @return {string|null} User name string or null if user is anonymous
			 */
			getName(): string | null;

			/**
			 * Get date user registered, if available
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-getRegistration
			 * @return {boolean|null|Date} False for anonymous users, null if data is
			 *  unavailable, or Date for when the user registered.
			 */
			getRegistration(): boolean | null | Date;

			/**
			 * Whether the current user is anonymous
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-isAnon
			 * @return {boolean}
			 */
			isAnon(): boolean;

			/**
			 * Retrieve a random ID, generating it if needed
			 *
			 * This ID is shared across windows, tabs, and page views. It is persisted
			 * for the duration of one browser session (until the browser app is closed),
			 * unless the user evokes a "restore previous session" feature that some browsers have.
			 *
			 * **Note:** Server-side code must never interpret or modify this value.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-sessionId
			 * @return {string} Random session ID
			 */
			sessionId(): string;

			/**
			 * Get the current user's name or the session ID
			 *
			 * Not to be confused with #getId.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-id
			 * @return {string} User name or random session ID
			 */
			id(): string;

			/**
			 * Get the current user's groups
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-getGroups
			 * @param {Function} [callback]
			 * @return {jQuery.Promise}
			 */
			getGroups<T>( callback: ( groups: string[] ) => T ): JQuery.Promise<T>;
			getGroups(): JQuery.Promise<string[]>;

			/**
			 * Get the current user's rights
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-getRights
			 * @param {Function} [callback]
			 * @return {jQuery.Promise}
			 */
			getRights<T>( callback: ( groups: string[] ) => T ): JQuery.Promise<T>;
			getRights(): JQuery.Promise<string[]>;
		}
	}

	interface MediaWiki {
		/**
		 * @class mw.user
		 * @singleton
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user
		 */
		readonly user: MediaWiki.User;
	}
}

export {};
