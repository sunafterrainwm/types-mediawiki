import {
	ApiEditPageParams,
	ApiParseParams,
	ApiQueryAllMessagesParams,
	ApiQueryTokensParams,
	ApiRollbackParams,
	ApiUploadParams
} from 'types-mediawiki/api_params';
import './Title';

declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		namespace Api {
			type ApiParams = Record<string, OneOrMore<string | boolean | number>>;
			type ApiResponse<R = unknown> = Record<string, R>; // it will always be a JSON object, the rest is uncertain ...

			/**
			 * Default options for jQuery#ajax calls. Can be overridden by passing
			 * `options` to {@link mw.Api} constructor.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-property-defaultOptions
			 */
			interface ApiOptions {
			/**
			 * Default query parameters for API requests
			 */
				parameters?: Api.ApiParams;
				/**
				 * Default options for jQuery#ajax
				 */
				ajax?: JQuery.AjaxSettings;
				/**
				 * Whether to use U+001F when joining multi-valued parameters (since 1.28).
				 * Default is true if ajax.url is not set, false otherwise for compatibility.
				 */
				useUS?: boolean;
			}

		}

		/**
		 * Client library for the action API. See mw.Rest for the REST API.
		 *
		 * See also <https://www.mediawiki.org/wiki/API:Main_page>.
		 *
		 * Interact with the API of a particular MediaWiki site. mw.Api objects represent the API of
		 * one particular MediaWiki site.
		 *
		 *     var api = new mw.Api();
		 *     api.get( {
		 *         action: 'query',
		 *         meta: 'userinfo'
		 *     } ).done( function ( data ) {
		 *         console.log( data );
		 *     } );
		 *
		 * Since MW 1.25, multiple values for a parameter can be specified using an array:
		 *
		 *     var api = new mw.Api();
		 *     api.get( {
		 *         action: 'query',
		 *         meta: [ 'userinfo', 'siteinfo' ] // same effect as 'userinfo|siteinfo'
		 *     } ).done( function ( data ) {
		 *         console.log( data );
		 *     } );
		 *
		 * Since MW 1.26, boolean values for API parameters can be specified natively. Parameter
		 * values set to `false` or `undefined` will be omitted from the request, as required by
		 * the API.
		 *
		 * @class mw.Api
		 * @constructor
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api
		 * @param {Object} [options] See #defaultOptions documentation above. Can also be overridden for
		 *  each individual request by passing them to #get or #post (or directly #ajax) later on.
		 */
		class Api {
			/**
			 * Constructor to create an object to interact with the API of a particular MediaWiki server.
			 * mw.Api objects represent the API of a particular MediaWiki server.
			 *
			 * @example
			 * ```js
			 * var api = new mw.Api();
			 * api.get( {
			 *     action: 'query',
			 *     meta: 'userinfo'
			 * } ).done( function ( data ) {
			 *     console.log( data );
			 * } );
			 * ```
			 *
			 * Since MW 1.25, multiple values for a parameter can be specified using an array:
			 *
			 * @example
			 * ```
			 * var api = new mw.Api();
			 * api.get( {
			 *     action: 'query',
			 *     meta: [ 'userinfo', 'siteinfo' ] // same effect as 'userinfo|siteinfo'
			 * } ).done( function ( data ) {
			 *     console.log( data );
			 * } );
			 * ```
			 * Since MW 1.26, boolean values for a parameter can be specified directly.
			 * If the value is false or undefined, the parameter will be omitted from the request, as required by the API.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-constructor
			 * @param {Object} options
			 */
			constructor( options?: Api.ApiOptions );

			/**
			 * Abort all unfinished requests issued by this Api object.
			 *
			 * @method
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-abort
			 */
			abort(): void;

			/**
			 * Perform API get request. See #ajax for details.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-get
			 * @param {Object} parameters
			 * @param {Object} [ajaxOptions]
			 * @return {jQuery.Promise}
			 */
			get(
				parameters: Api.ApiParams,
				ajaxOptions?: JQuery.AjaxSettings
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Perform API post request. See #ajax for details.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-post
			 * @param {Object} parameters
			 * @param {Object} [ajaxOptions]
			 * @return {jQuery.Promise}
			 */
			post(
				parameters: Api.ApiParams,
				ajaxOptions?: JQuery.AjaxSettings
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Massage parameters from the nice format we accept into a format suitable for the API.
			 *
			 * NOTE: A value of undefined/null in an array will be represented by Array#join()
			 * as the empty string. Should we filter silently? Warn? Leave as-is?
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-preprocessParameters
			 * @param {Object} parameters (modified in-place)
			 * @param {boolean} useUS Whether to use U+001F when joining multi-valued parameters.
			 */
			protected preprocessParameters( parameters: Api.ApiParams, useUS: boolean ): void;

			/**
			 * Perform the API call.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-ajax
			 * @param {Object} parameters Parameters to the API. See also #defaultOptions.parameters.
			 * @param {Object} [ajaxOptions] Parameters to pass to jQuery.ajax. See also
			 *   #defaultOptions.ajax.
			 * @return {jQuery.Promise} A promise that settles when the API response is processed.
			 *   Has an 'abort' method which can be used to abort the request.
			 *
			 *   - On success, resolves to `( result, jqXHR )` where `result` is the parsed API response.
			 *   - On an API error, rejects with `( code, result, result, jqXHR )` where `code` is the
			 *     [API error code](https://www.org/wiki/API:Errors_and_warnings), and `result`
			 *     is as above. When there are multiple errors, the code from the first one will be used.
			 *     If there is no error code, "unknown" is used.
			 *   - On other types of errors, rejects with `( 'http', details )` where `details` is an object
			 *     with three fields: `xhr` (the jqXHR object), `textStatus`, and `exception`.
			 *     The meaning of the last two fields is as follows:
			 *     - When the request is aborted (the abort method of the promise is called), textStatus
			 *       and exception are both set to "abort".
			 *     - On a network timeout, textStatus and exception are both set to "timeout".
			 *     - On a network error, textStatus is "error" and exception is the empty string.
			 *     - When the HTTP response code is anything other than 2xx or 304 (the API does not
			 *       use such response codes but some intermediate layer might), textStatus is "error"
			 *       and exception is the HTTP status text (the text following the status code in the
			 *       first line of the server response). For HTTP/2, `exception` is always an empty string.
			 *     - When the response is not valid JSON but the previous error conditions aren't met,
			 *       textStatus is "parsererror" and exception is the exception object thrown by
			 *       `JSON.parse`.
			 */
			ajax(
				parameters: Api.ApiParams,
				ajaxOptions?: JQuery.AjaxSettings
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Post to API with specified type of token. If we have no token, get one and try to post.
			 * If we have a cached token try using that, and if it fails, blank out the
			 * cached token and start over. For example to change an user option you could do:
			 *
			 * @example
			 * ```
			 * new mw.Api().postWithToken( 'csrf', {
			 *     action: 'options',
			 *     optionname: 'gender',
			 *     optionvalue: 'female'
			 * } );
			 * ```
			 *
			 * @since 1.22
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-postWithToken
			 * @param {string} tokenType The name of the token, like options or edit.
			 * @param {Object} params API parameters
			 * @param {Object} [ajaxOptions]
			 * @return {jQuery.Promise} See #post
			 */
			postWithToken(
				tokenType: string,
				params: Api.ApiParams,
				ajaxOptions?: JQuery.AjaxSettings
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Get a token for a certain action from the API.
			 *
			 * @since 1.22
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-getToken
			 * @param {string} type Token type
			 * @param {Object|string} [additionalParams] Additional parameters for the API (since 1.35).
			 *   When given a string, it's treated as the 'assert' parameter (since 1.25).
			 * @return {jQuery.Promise} Received token.
			 */
			getToken( type: string, additionalParams?: ApiQueryTokensParams | string ): JQuery.Promise<string>;

			/**
			 * Indicate that the cached token for a certain action of the API is bad.
			 *
			 * Call this if you get a 'badtoken' error when using the token returned by #getToken.
			 * You may also want to use #postWithToken instead, which invalidates bad cached tokens
			 * automatically.
			 *
			 * @since 1.26
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-badToken
			 * @param {string} type Token type
			 */
			badToken( type: string ): void;

			/**
			 * Given an API response indicating an error, get a jQuery object containing a human-readable
			 * error message that you can display somewhere on the page.
			 *
			 * For better quality of error messages, it's recommended to use the following options in your
			 * API queries:
			 *
			 *     errorformat: 'html',
			 *     errorlang: mw.config.get( 'wgUserLanguage' ),
			 *     errorsuselocal: true,
			 *
			 * Error messages, particularly for editing pages, may consist of multiple paragraphs of text.
			 * Your user interface should have enough space for that.
			 *
			 * @example
			 * ```
			 * var api = new mw.Api();
			 * // var title = 'Test valid title';
			 * var title = 'Test invalid title <>';
			 * api.postWithToken( 'watch', {
			 *     action: 'watch',
			 *     title: title
			 * } ).then( function ( data ) {
			 *     mw.notify( 'Success!' );
			 * }, function ( code, data ) {
			 *     mw.notify( api.getErrorMessage( data ), { type: 'error' } );
			 * } );
			 * ```
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-getErrorMessage
			 * @param {Object} data API response indicating an error
			 * @return {jQuery} Error messages, each wrapped in a `<div>`
			 */
			getErrorMessage( data: Api.ApiResponse ): JQuery;

			/**
			 * Determine if a category exists.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.category-method-isCategory
			 * @param {mw.Title|string} title
			 * @return {jQuery.Promise}
			 * @return {Function} return.done
			 * @return {boolean} return.done.isCategory Whether the category exists.
			 */
			isCategory( title: TitleLike ): JQuery.Promise<boolean>;

			/**
			 * Get a list of categories that match a certain prefix.
			 *
			 * E.g. given "Foo", return "Food", "Foolish people", "Foosball tables"...
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.category-method-getCategoriesByPrefix
			 * @param {string} prefix Prefix to match.
			 * @return {jQuery.Promise}
			 * @return {Function} return.done
			 * @return {string[]} return.done.categories Matched categories
			 */
			getCategoriesByPrefix( prefix: string ): JQuery.Promise<string[]>;

			/**
			 * Get the categories that a particular page on the wiki belongs to.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.category-method-getCategories
			 * @param {mw.Title|string} title
			 * @return {jQuery.Promise}
			 * @return {Function} return.done
			 * @return {boolean|mw.Title[]} return.done.categories List of category titles or false
			 *  if title was not found.
			 */
			getCategories( title: TitleLike ): JQuery.Promise<false | Title[]>;

			/**
			 * Post to API with csrf token.
			 * If we have no token, get one and try to post.
			 * If we have a cached token try using that, and if it fails, blank out the cached token and start over.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.edit-method-postWithEditToken
			 * @param {Object} params API parameters
			 * @param {Object} [ajaxOptions]
			 * @return {jQuery.Promise} See #post
			 */
			postWithEditToken(
				params: Api.ApiParams,
				ajaxOptions?: JQuery.AjaxSettings
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * API helper to grab a csrf token.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.edit-method-getEditToken
			 * @return {jQuery.Promise} Received token.
			 */
			getEditToken(): JQuery.Promise<string>;

			/**
			 * Create a new page.
			 *
			 * @example
			 * ```
			 * new mw.Api().create( 'Sandbox',
			 *     { summary: 'Load sand particles.' },
			 *     'Sand.'
			 * );
			 * ```
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.edit-method-create
			 * @param {mw.Title|string} title Page title
			 * @param {Object} params Edit API parameters
			 * @param {string} params.summary Edit summary
			 * @param {string} content
			 * @return {jQuery.Promise} API response
			 */
			create(
				title: TitleLike,
				params: ApiEditPageParams,
				content: string
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Edit an existing page.
			 *
			 * To create a new page, use create() instead.
			 *
			 *
			 * @example
			 * ```
			 * // Simple transformation:
			 * new mw.Api()
			 *     .edit( 'Sandbox', function ( revision ) {
			 *         return revision.content.replace( 'foo', 'bar' );
			 *     } )
			 *     .then( function () {
			 *         console.log( 'Saved!' );
			 *     } );
			 * ```
			 *
			 * @example
			 * ```
			 * // Set save parameters by returning an object instead of a string:
			 * new mw.Api().edit(
			 *     'Sandbox',
			 *     function ( revision ) {
			 *         return {
			 *             text: revision.content.replace( 'foo', 'bar' ),
			 *             summary: 'Replace "foo" with "bar".',
			 *             assert: 'bot',
			 *             minor: true
			 *         };
			 *     }
			 * )
			 * .then( function () {
			 *     console.log( 'Saved!' );
			 * } );
			 * ```
			 *
			 * @example
			 * ```
			 * // Transform asynchronously by returning a promise.
			 * new mw.Api()
			 *     .edit( 'Sandbox', function ( revision ) {
			 *         return Spelling
			 *             .corrections( revision.content )
			 *             .then( function ( report ) {
			 *                 return {
			 *                     text: report.output,
			 *                     summary: report.changelog
			 *             };
			 *         } );
			 *     } )
			 *     .then( function () {
			 *         console.log( 'Saved!' );
			 *     } );
			 * ```
			 *
			 * @since 1.28
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.edit-method-edit
			 * @param {mw.Title|string} title Page title
			 * @param {Function} transform Callback that prepares the edit
			 * @param {Object} transform.revision Current revision
			 * @param {string} transform.revision.content Current revision content
			 * @param {string|Object|jQuery.Promise} transform.return New content, object with edit
			 *  API parameters, or promise providing one of those.
			 * @return {jQuery.Promise} Edit API response
			 */
			edit(
				title: TitleLike,
				transform: ( revision: {
					timestamp: string;
					content: string;
				} ) => string | ApiEditPageParams
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Post a new section to the page.
			 *
			 * @see #postWithEditToken
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.edit-method-newSection
			 * @param {mw.Title|string} title Target page
			 * @param {string} header
			 * @param {string} message wikitext message
			 * @param {Object} [additionalParams] Additional API parameters, e.g. `{ redirect: true }`
			 * @return {jQuery.Promise}
			 */
			newSection(
				title: TitleLike,
				header: string,
				message: string,
				additionalParams?: ApiEditPageParams
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.login-method-login
			 * @param {string} username
			 * @param {string} password
			 * @return {jQuery.Promise} See mw.Api#post
			 */
			login( username: string, password: string ): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Get a set of messages.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.messages-method-getMessages
			 * @param {string|string[]} messages Messages to retrieve
			 * @param {Object} [options] Additional parameters for the API call
			 * @return {jQuery.Promise}
			 */
			getMessages(
				messages: string[],
				options?: ApiQueryAllMessagesParams
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Load a set of messages and add them to `mw.messages`.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.messages-method-loadMessages
			 * @param {string|string[]} messages Messages to retrieve
			 * @param {Object} [options] Additional parameters for the API call
			 * @return {jQuery.Promise}
			 */
			loadMessages(
				messages: string[],
				options?: ApiQueryAllMessagesParams
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Load a set of messages and add them to `mw.messages`.
			 * Only messages that are not already known are loaded.
			 * If all messages are known, the returned promise is resolved immediately.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.messages-method-loadMessagesIfMissing
			 * @param {string[]} messages Messages to retrieve
			 * @param {Object} [options] Additional parameters for the API call
			 * @return {jQuery.Promise}
			 */
			loadMessagesIfMissing(
				messages: string[],
				options?: ApiQueryAllMessagesParams
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Asynchronously save the value of a single user option using the API. See #saveOptions.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.options-method-saveOption
			 * @param {string} name
			 * @param {string|null} value
			 * @return {jQuery.Promise}
			 */
			saveOption( name: string, value: string ): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Asynchronously save the values of user options using the API.
			 *
			 * If a value of `null` is provided, the given option will be reset to the default value.
			 *
			 * Any warnings returned by the API, including warnings about invalid option names or values,
			 * are ignored. However, do not rely on this behavior.
			 *
			 * If necessary, the options will be saved using several sequential API requests. Only one promise
			 * is always returned that will be resolved when all requests complete.
			 *
			 * If a request from a previous #saveOptions call is still pending, this will wait for it to be
			 * completed, otherwise MediaWiki gets sad. No requests are sent for anonymous users, as they
			 * would fail anyway. See T214963.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.options-method-saveOptions
			 * @param {Object} options Options as a `{ name: value, … }` object
			 * @return {jQuery.Promise}
			 */
			saveOptions( options: Record<string, string> ): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Convenience method for 'action=parse'.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.parse-method-p
			 * @param {string|mw.Title} content Content to parse, either as a wikitext string or
			 *   a mw.Title.
			 * @param {Object} additionalParams Parameters object to set custom settings, e.g.
			 *   redirects, sectionpreview.  prop should not be overridden.
			 * @return {jQuery.Promise}
			 * @return {Function} return.done
			 * @return {string} return.done.data Parsed HTML of `wikitext`.
			 */
			parse(
				content: string | Title,
				additionalParams?: ApiParseParams
			): JQuery.Promise<string>;

			/**
			 * Convenience method for `action=rollback`.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.rollback-method-rollback
			 * @param {string|mw.Title} page
			 * @param {string} user
			 * @param {Object} [params] Additional parameters
			 * @return {jQuery.Promise}
			 */
			rollback(
				page: TitleLike,
				user: string,
				params?: ApiRollbackParams
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Upload a file to
			 *
			 * The file will be uploaded using AJAX and FormData.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.upload-method-upload
			 * @param {HTMLInputElement|File|Blob} file HTML input type=file element with a file already inside
			 *  of it, or a File object.
			 * @param {Object} data Other upload options, see action=upload API docs for more
			 * @return {jQuery.Promise}
			 */
			upload(
				file: File | Blob | HTMLInputElement,
				data: ApiUploadParams
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Uploads a file using the FormData API.
			 *
			 * @private
			 * @param {File} file
			 * @param {Object} data Other upload options, see action=upload API docs for more
			 * @return {jQuery.Promise}
			 */
			protected uploadWithFormData(
				file: File | Blob,
				data: ApiUploadParams
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Upload a file in several chunks.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.upload-method-chunkedUpload
			 * @param {File} file
			 * @param {Object} data Other upload options, see action=upload API docs for more
			 * @param {number} [chunkSize] Size (in bytes) per chunk (default: 5 MiB)
			 * @param {number} [chunkRetries] Amount of times to retry a failed chunk (default: 1)
			 * @return {jQuery.Promise}
			 */
			chunkedUpload(
				file: File,
				data: ApiUploadParams,
				chunkSize?: number,
				chunkRetries?: number
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Uploads 1 chunk.
			 *
			 * @private
			 * @param {File} file
			 * @param {Object} data Other upload options, see action=upload API docs for more
			 * @param {number} start Chunk start position
			 * @param {number} end Chunk end position
			 * @param {string} [filekey] File key, for follow-up chunks
			 * @param {number} [retries] Amount of times to retry request
			 * @return {jQuery.Promise}
			 */
			protected uploadChunk(
				file: File,
				data: ApiUploadParams,
				start: number,
				end: number,
				filekey?: string,
				retries?: number
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Launch the upload anew if it failed because of network issues.
			 *
			 * @private
			 * @param {string} code Error code
			 * @param {Object} result API result
			 * @param {Function} callable
			 * @return {jQuery.Promise}
			 */
			protected retry(
				code: string,
				result: Api.ApiResponse,
				callable: () => PromiseLike<Api.ApiResponse>
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Slice a chunk out of a File object.
			 *
			 * @private
			 * @param {File} file
			 * @param {number} start
			 * @param {number} stop
			 * @return {Blob}
			 */
			protected slice( file: File, start: number, stop: number ): Blob;

			/**
			 * This function will handle how uploads to stash (via uploadToStash or
			 * chunkedUploadToStash) are resolved/rejected.
			 *
			 * After a successful stash, it'll resolve with a callback which, when
			 * called, will finalize the upload in stash (with the given data, or
			 * with additional/conflicting data)
			 *
			 * A failed stash can still be recovered from as long as 'filekey' is
			 * present. In that case, it'll also resolve with the callback to
			 * finalize the upload (all warnings are then ignored.)
			 * Otherwise, it'll just reject as you'd expect, with code & result.
			 *
			 * @private
			 * @param {jQuery.Promise} uploadPromise
			 * @param {Object} data
			 * @return {jQuery.Promise}
			 * @return {Function} return.finishUpload Call this function to finish the upload.
			 * @return {Object} return.finishUpload.data Additional data for the upload.
			 * @return {jQuery.Promise} return.finishUpload.return API promise for the final upload
			 * @return {Object} return.finishUpload.return.data API return value for the final upload
			 */
			protected finishUploadToStash(
				uploadPromise: JQuery.Promise<Api.ApiResponse>,
				data: ApiUploadParams
			): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Upload a file to the stash.
			 *
			 * This function will return a promise, which when resolved, will pass back a function
			 * to finish the stash upload. You can call that function with an argument containing
			 * more, or conflicting, data to pass to the server.
			 *
			 * @example
			 * ```
			 * // upload a file to the stash with a placeholder filename
			 * api.uploadToStash( file, { filename: 'testing.png' } ).done( function ( finish ) {
			 *     // finish is now the function we can use to finalize the upload
			 *     // pass it a new filename from user input to override the initial value
			 *     finish( { filename: getFilenameFromUser() } ).done( function ( data ) {
			 *         // the upload is complete, data holds the API response
			 *     } );
			 * } );
			 * ```
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.upload-method-uploadToStash
			 * @param {File|HTMLInputElement} file
			 * @param {Object} [data]
			 * @return {jQuery.Promise}
			 * @return {Function} return.finishUpload Call this function to finish the upload.
			 * @return {Object} return.finishUpload.data Additional data for the upload.
			 * @return {jQuery.Promise} return.finishUpload.return API promise for the final upload
			 * @return {Object} return.finishUpload.return.data API return value for the final upload
			 */
			uploadToStash(
				file: File | HTMLInputElement,
				data?: ApiUploadParams
			): JQuery.Promise<( data?: ApiUploadParams ) => JQuery.Promise<Api.ApiResponse>>;

			/**
			 * Upload a file to the stash, in chunks.
			 *
			 * This function will return a promise, which when resolved, will pass back a function
			 * to finish the stash upload.
			 *
			 * @see Api#uploadToStash
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.upload-method-chunkedUploadToStash
			 * @param {File|HTMLInputElement} file
			 * @param {Object} [data]
			 * @param {number} [chunkSize] Size (in bytes) per chunk (default: 5 MiB)
			 * @param {number} [chunkRetries] Amount of times to retry a failed chunk (default: 1)
			 * @return {jQuery.Promise}
			 * @return {Function} return.finishUpload Call this function to finish the upload.
			 * @return {Object} return.finishUpload.data Additional data for the upload.
			 * @return {jQuery.Promise} return.finishUpload.return API promise for the final upload
			 * @return {Object} return.finishUpload.return.data API return value for the final upload
			 */
			chunkedUploadToStash(
				file: File,
				data?: ApiUploadParams,
				chunkSize?: number,
				chunkRetries?: number
			): JQuery.Promise<( data?: ApiUploadParams ) => JQuery.Promise<Api.ApiResponse>>;

			/**
			 * Finish an upload in the stash.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.upload-method-uploadFromStash
			 * @param {string} filekey
			 * @param {Object} data
			 * @return {jQuery.Promise}
			 */
			uploadFromStash( filekey: string, data: ApiUploadParams ): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Get the current user's groups and rights.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.user-method-getUserInfo
			 * @return {jQuery.Promise}
			 * @return {Function} return.done
			 * @return {Object} return.done.userInfo
			 * @return {string[]} return.done.userInfo.groups User groups that the current user belongs to
			 * @return {string[]} return.done.userInfo.rights Current user's rights
			 */
			getUserInfo(): JQuery.Promise<{
				groups: string[];
				rights: string[];
			}>;

			/**
			 * Extend an API parameter object with an assertion that the user won't change.
			 *
			 * This is useful for API calls which create new revisions or log entries. When the current
			 * page was loaded when the user was logged in, but at the time of the API call the user
			 * is not logged in anymore (e.g. due to session expiry), their IP is recorded in the page
			 * history or log, which can cause serious privacy issues. Extending the API parameters via
			 * this method ensures that that won't happen, by checking the user's identity that was
			 * embedded into the page when it was rendered against the active session on the server.
			 *
			 * Use it like this:
			 *     api.postWithToken( 'csrf', api.assertCurrentUser( { action: 'edit', ... } ) )
			 * When the assertion fails, the API request will fail, with one of the following error codes:
			 * - apierror-assertanonfailed: when the client-side logic thinks the user is anonymous
			 *   but the server thinks it is logged in;
			 * - apierror-assertuserfailed: when the client-side logic thinks the user is logged in but the
			 *   server thinks it is anonymous;
			 * - apierror-assertnameduserfailed: when both the client-side logic and the server thinks the
			 *   user is logged in but they see it logged in under a different username.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.user-method-assertCurrentUser
			 * @param {Object} query Query parameters. The object will not be changed.
			 * @return {Object}
			 */
			assertCurrentUser( query: Api.ApiParams ): {
				assert: 'anon' | 'user';
				assertUser: string;
			};

			/**
			 * Convenience method for `action=watch`.
			 *
			 * @since 1.35 - expiry parameter can be passed when
			 * Watchlist Expiry is enabled
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.watch-method-watch
			 * @param {string|mw.Title|string[]|mw.Title[]} pages Full page name or instance of mw.Title, or an
			 *  array thereof. If an array is passed, the return value passed to the promise will also be an
			 *  array of appropriate objects.
			 * @param {string} [expiry]
			 * @return {jQuery.Promise}
			 * @return {Function} return.done
			 * @return {Object|Object[]} return.done.watch Object or list of objects (depends on the `pages`
			 *  parameter)
			 * @return {string} return.done.watch.title Full pagename
			 */
			watch<P extends OneOrMore<TitleLike>>(
				pages: P,
				expiry?: string
			): JQuery.Promise<{
				watch: P extends TitleLike[]
					? { title: string; watched: boolean; }[]
					: { title: string; watched: boolean; };
			}>;

			/**
			 * Convenience method for `action=watch&unwatch=1`.
			 *
			 * @param {Object} pages
			 * @return {jQuery.Promise}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.watch-method-unwatch
			 * @param {string|mw.Title|string[]|mw.Title[]} pages Full page name or instance of mw.Title, or an
			 *  array thereof. If an array is passed, the return value passed to the promise will also be an
			 *  array of appropriate objects.
			 * @return {jQuery.Promise}
			 * @return {Function} return.done
			 * @return {Object|Object[]} return.done.watch Object or list of objects (depends on the `pages`
			 *  parameter)
			 * @return {string} return.done.watch.title Full pagename
			 */
			unwatch<P extends OneOrMore<TitleLike>>(
				pages: P
			): JQuery.Promise<{
				watch: P extends TitleLike[]
					? { title: string; watched: boolean; }[]
					: { title: string; watched: boolean; };
			}>;
		}

		namespace Rest {
			type RestParams = JQuery.PlainObject;
			type RestResponse<R = unknown> = Record<string, R>;

			/**
			 * Default options for jQuery#ajax calls. Can be overridden by passing
			 * `options` to {@link mw.Rest} constructor.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Rest-property-defaultOptions
			 */
			interface RestOptions {
				/**
				 * Default options for jQuery#ajax
				 */
				ajax?: JQuery.AjaxSettings;
			}
		}

		/**
		 * Constructor to create an object to interact with the REST API of a particular MediaWiki server.
		 * mw.Rest objects represent the REST API of a particular MediaWiki server.
		 *
		 *     var api = new mw.Rest();
		 *     api.get( '/v1/page/Main_Page/html' )
		 *     .done( function ( data ) {
		 *         console.log( data );
		 *     } );
		 *
		 *     api.post( '/v1/page/Main_Page', {
		 *          token: 'anon_token',
		 *          source: 'Lörem Ipsüm',
		 *          comment: 'tästing',
		 *          title: 'My_Page'
		 *     }, {
		 *         'authorization': 'token'
		 *     } )
		 *     .done( function ( data ) {
		 *         console.log( data );
		 *     } );
		 *
		 * @constructor
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Rest
		 * @param {Object} [options] See #defaultOptions documentation above.
		 */
		class Rest {
			constructor( options?: Rest.RestOptions );

			/**
			 * Abort all unfinished requests issued by this Api object.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Rest-method-abort
			 * @return {void}
			 */
			abort(): void;

			/**
			 * Perform REST API get request
			 *
			 * @method
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Rest-method-get
			 * @param {string} path
			 * @param {Object} query
			 * @param {Object} [headers]
			 * @return {jQuery.Promise}
			 */
			get( path: string, query: Rest.RestParams, headers?: HeadersInit ): JQuery.Promise<Rest.RestResponse>;

			/**
			 * Perform REST API post request.
			 *
			 * Note: only sending application/json is currently supported.
			 *
			 * @method
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Rest-method-post
			 * @param {string} path
			 * @param {Object} body
			 * @param {Object} [headers]
			 * @return {jQuery.Promise}
			 */
			post( path: string, body: Rest.RestParams, headers?: HeadersInit ): JQuery.Promise<Rest.RestResponse>;

			/**
			 * Perform the API call.
			 *
			 * @method
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Rest-method-ajax
			 * @param {string} path
			 * @param {Object} [ajaxOptions]
			 * @return {jQuery.Promise} Done: API response data and the jqXHR object.
			 *  Fail: Error code
			 */
			ajax( path: string, ajaxOptions?: JQuery.AjaxSettings ): JQuery.Promise<Rest.RestResponse>;
		}
	}
}

export {};
