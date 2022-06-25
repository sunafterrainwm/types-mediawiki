declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWikiInternal {
		namespace messagePoster {
			type MessagePosterConstructor<M extends MediaWiki.messagePoster.MessagePoster = MediaWiki.messagePoster.MessagePoster> =
				new ( title: MediaWiki.Title, api: MediaWiki.Api ) => M;

			/**
			 * Factory for MessagePoster objects. This provides a pluggable to way to script the action
			 * of adding a message to someone's talk page.
			 *
			 * Usage example:
			 * ```
			 * function MyExamplePoster() {}
			 * OO.inheritClass( MyExamplePoster, mw.messagePoster.MessagePoster );
			 *
			 * mw.messagePoster.factory.register( 'mycontentmodel', MyExamplePoster );
			 * ```
			 *
			 * The JavaScript files(s) that register message posters for additional content
			 * models must be registered with MediaWiki via the `MessagePosterModule`
			 * extension attribute, like follows:
			 *
			 * ```
			 * "MessagePosterModule": {
			 *     "localBasePath": "", // (required)
			 *     "scripts": [], // relative file path(s) (required)
			 *     "dependencies": [], // module name(s) (optional)
			 * }
			 * ```
			 *
			 * @class mw.messagePoster.factory
			 * @singleton
			 */
			class Factory {
				contentModelToClass: Record<string, MessagePosterConstructor>;

				/**
				 * Register a MessagePoster subclass for a given content model.
				 *
				 * @param {string} contentModel Content model of pages this MessagePoster can post to
				 * @param {Function} constructor Constructor of a MessagePoster subclass
				 */
				register( contentModel: string, constructor: MessagePosterConstructor ): void | never;

				/**
				 * Unregister a given content model.
				 * This is exposed for testing and should not normally be used.
				 *
				 * @param {string} contentModel Content model to unregister
				 */
				unregister( contentModel: string ): void;

				/**
				 * Create a MessagePoster for given a title.
				 *
				 * A promise for this is returned. It works by determining the content model, then loading
				 * the corresponding module (which registers the MessagePoster class), and finally constructing
				 * an object for the given title.
				 *
				 * This does not require the message and should be called as soon as possible, so that the
				 * API and ResourceLoader requests run in the background.
				 *
				 * @param {mw.Title} title Title that will be posted to
				 * @param {string} [apiUrl] api.php URL if the title is on another wiki
				 * @return {jQuery.Promise} Promise resolving to a mw.messagePoster.MessagePoster.
				 *   For failure, rejected with up to three arguments:
				 *
				 *   - errorCode Error code string
				 *   - error Error explanation
				 *   - details Further error details
				 */
				create( title: MediaWiki.Title, apiUrl?: string ): JQuery.Promise<MediaWiki.messagePoster.MessagePoster>;
			}
		}
	}

	namespace MediaWiki {
		namespace messagePoster {
			/**
			 * This is the abstract base class for MessagePoster implementations.
			 *
			 * @abstract
			 * @class
			 *
			 * @constructor
			 * @param {mw.Title} title Title to post to
			 */
			abstract class MessagePoster {
				constructor( title: Title, api: Api );

				/**
				 * Post a message (with subject and body) to a talk page.
				 *
				 * @abstract
				 * @param {string} subject Subject/topic title.  The amount of wikitext supported is
				 *   implementation-specific. It is recommended to only use basic wikilink syntax for
				 *   maximum compatibility.
				 * @param {string} body Body, as wikitext.  Signature code will automatically be added
				 *   by MessagePosters that require one, unless the message already contains the string
				 *   ~~~.
				 * @param {Object} [options] Message options. See MessagePoster implementations for details.
				 * @return {jQuery.Promise} Promise completing when the post succeeds or fails.
				 *   For failure, will be rejected with three arguments:
				 *
				 *   - primaryError - Primary error code.  For a mw.Api failure,
				 *       this should be 'api-fail'.
				 *   - secondaryError - Secondary error code.  For a mw.Api failure,
				 *       this, should be mw.Api's code, e.g. 'http', 'ok-but-empty', or the error passed through
				 *       from the server.
				 *   - details - Further details about the error
				 *
				 * @localdoc
				 * The base class currently does nothing, but could be used for shared analytics or
				 * something.
				 */
				abstract post( subject: string, body: string, options?: Record<string, unknown> ): JQuery.Promise<Api.ApiResponse>;
			}

			/**
			 * This is an implementation of MessagePoster for wikitext talk pages.
			 *
			 * @class mw.messagePoster.WikitextMessagePoster
			 * @extends mw.messagePoster.MessagePoster
			 *
			 * @constructor
			 * @param {mw.Title} title Wikitext page in a talk namespace, to post to
			 * @param {mw.Api} api mw.Api object to use
			 */
			class WikitextMessagePoster extends MessagePoster {
				constructor( title: MediaWiki.Title, api: MediaWiki.Api );

				/**
				 * @inheritdoc
				 * @param {string} subject Section title.
				 * @param {string} body Message body, as wikitext.
				 * Signature code will automatically be added unless the message already contains the string ~~~.
				 * @param {Object} [options] Message options:
				 * @param {string} [options.tags]
				 * [Change tags](https://www.mediawiki.org/wiki/Special:MyLanguage/Manual:Tags)
				 * to add to the message's revision, pipe-separated.
				 */
				post( subject: string, body: string, options?: {
					/**
					 * [Change tags](https://www.mediawiki.org/wiki/Special:MyLanguage/Manual:Tags)
					 * to add to the message's revision, pipe-separated.
					 */
					tags?: string;
				} ): JQuery.Promise<Api.ApiResponse>;
			}
		}

		interface MessagePoster {
			/**
			 * Factory for MessagePoster objects. This provides a pluggable to way to script the action
			 * of adding a message to someone's talk page.
			 *
			 * Usage example:
			 * ```
			 * function MyExamplePoster() {}
			 * OO.inheritClass( MyExamplePoster, mw.messagePoster.MessagePoster );
			 *
			 * mw.messagePoster.factory.register( 'mycontentmodel', MyExamplePoster );
			 * ```
			 *
			 * The JavaScript files(s) that register message posters for additional content
			 * models must be registered with MediaWiki via the `MessagePosterModule`
			 * extension attribute, like follows:
			 *
			 * ```
			 * "MessagePosterModule": {
			 *     "localBasePath": "", // (required)
			 *     "scripts": [], // relative file path(s) (required)
			 *     "dependencies": [], // module name(s) (optional)
			 * }
			 * ```
			 *
			 * @class mw.messagePoster.factory
			 * @singleton
			 */
			readonly factory: MediaWikiInternal.messagePoster.Factory;
		}
	}

	interface MediaWiki {
		readonly messagePoster: MediaWiki.MessagePoster;
	}
}

export {};
