import './Api';

declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		namespace ForeignApi {
			/**
			 * Default options for jQuery#ajax calls. Can be overridden by passing
			 * `options` to {@link mw.ForeignApi} constructor.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignApi-property-defaultOptions
			 */
			interface ForeignApiOptions extends Api.ApiOptions {
				/**
				 * Perform all requests anonymously. Use this option if
				 * the target wiki may otherwise not accept cross-origin requests, or if you don't need to
				 * perform write actions or read restricted information and want to avoid the overhead.
				 */
				anonymous?: boolean;
			}
		}

		/**
		 * Create an object like mw.Api, but automatically handling everything required to communicate
		 * with another MediaWiki wiki via cross-origin requests (CORS).
		 *
		 * The foreign wiki must be configured to accept requests from the current wiki. See
		 * <https://www.mediawiki.org/wiki/Manual:$wgCrossSiteAJAXdomains> for details.
		 *
		 * @example
		 * ```
		 * var api = new mw.ForeignApi( 'https://commons.wikimedia.org/w/api.php' );
		 * api.get( {
		 *     action: 'query',
		 *     meta: 'userinfo'
		 * } ).done( function ( data ) {
		 *     console.log( data );
		 * } );
		 * ```
		 *
		 * To ensure that the user at the foreign wiki is logged in, pass the `assert: 'user'` parameter
		 * to #get/#post (since MW 1.23): if they are not, the API request will fail. (Note that this
		 * doesn't guarantee that it's the same user. To assert that the user at the foreign wiki has
		 * a specific username, pass the `assertuser` parameter with the desired username.)
		 *
		 * Authentication-related MediaWiki extensions may extend this class to ensure that the user
		 * authenticated on the current wiki will be automatically authenticated on the foreign one. These
		 * extension modules should be registered using the ResourceLoaderForeignApiModules hook. See
		 * CentralAuth for a practical example. The general pattern to extend and override the name is:
		 *
		 * @example
		 * ```
		 * class MyForeignApi extends mw.ForeignApi {}
		 * mw.ForeignApi = MyForeignApi;
		 * ```
		 *
		 * @class mw.ForeignApi
		 * @extends mw.Api
		 * @since 1.26
		 *
		 * @constructor
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignApi
		 * @param {string|mw.Uri} url URL pointing to another wiki's `api.php` endpoint.
		 * @param {Object} [options] See mw.Api.
		 * @param {Object} [options.anonymous=false] Perform all requests anonymously. Use this option if
		 *     the target wiki may otherwise not accept cross-origin requests, or if you don't need to
		 *     perform write actions or read restricted information and want to avoid the overhead.
		 *
		 * @author Bartosz Dziewoński
		 * @author Jon Robson
		 */
		class ForeignApi extends Api {
			constructor( url: string | Uri, options: ForeignApi.ForeignApiOptions );

			/**
			 * Return the origin to use for API requests, in the required format (protocol, host and port, if
			 * any).
			 *
			 * @protected
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignApi-method-getOrigin
			 * @return {string|undefined}
			 */
			protected getOrigin(): string | undefined;
		}

		namespace ForeignRest {
			/**
			 * Default options for jQuery#ajax calls. Can be overridden by passing
			 * `options` to {@link mw.ForeignRest} constructor.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignRest-property-defaultOptions
			 */
			interface ForeignRestOptions extends Rest.RestOptions {
				/**
				 * Perform all requests anonymously. Use this option if
				 * the target wiki may otherwise not accept cross-origin requests, or if you don't need to
				 * perform write actions or read restricted information and want to avoid the overhead.
				 */
				anonymous?: boolean;
			}
		}

		/**
		 * Create an object like mw.Rest, but automatically handling everything required to communicate
		 * with another MediaWiki wiki via cross-origin requests (CORS).
		 *
		 *
		 * The foreign wiki must be configured to accept requests from the current wiki. See
		 * <https://www.mediawiki.org/wiki/Manual:$wgCrossSiteAJAXdomains> for details.
		 *
		 * @example
		 * ```
		 * var api = new mw.ForeignRest( 'https://commons.wikimedia.org/w/rest.php' );
		 * api.get( '/page/Main_Page/html' )
		 *     .done( function ( data ) {
		 *     console.log( data );
		 *     } );
		 * ```
		 *
		 * Authentication-related MediaWiki extensions may extend this class to ensure that the user
		 * authenticated on the current wiki will be automatically authenticated on the foreign one. These
		 * extension modules should be registered using the ResourceLoaderForeignApiModules hook. See
		 * CentralAuth for a practical example. The general pattern to extend and override the name is:
		 *
		 * @example
		 * ```
		 * class MyForeignRest extends mw.ForeignRest {}
		 * mw.ForeignRest = MyForeignRest;
		 * ```
		 *
		 * @class mw.ForeignRest
		 * @extends mw.Rest
		 * @since 1.36
		 *
		 * @constructor
		 * @param {string} url URL pointing to another wiki's `rest.php` endpoint.
		 * @param {mw.ForeignApi} foreignActionApi
		 * @param {Object} [options] See mw.Rest.
		 * @param {Object} [options.anonymous=false] Perform all requests anonymously. Use this option if
		 *     the target wiki may otherwise not accept cross-origin requests, or if you don't need to
		 *     perform write actions or read restricted information and want to avoid the overhead.
		 *
		 * @author Petr Pchelko
		 */
		class ForeignRest extends Rest {
			constructor( url: string, foreignActionApi: ForeignApi, options: ForeignRest.ForeignRestOptions );
		}
	}
}

export {};
