declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		/**
		 * Object constructor for messages.
		 *
		 * Similar to the Message class in MediaWiki PHP.
		 *
		 * @example
		 * ```
		 * var obj, str;
		 * mw.messages.set( {
		 *     'hello': 'Hello world',
		 *     'hello-user': 'Hello, $1!',
		 *     'welcome-user': 'Welcome back to $2, $1! Last visit by $1: $3',
		 *     'so-unusual': 'You will find: $1'
		 * } );
		 *
		 * obj = mw.message( 'hello' );
		 * mw.log( obj.text() );
		 * // Hello world
		 *
		 * obj = mw.message( 'hello-user', 'John Doe' );
		 * mw.log( obj.text() );
		 * // Hello, John Doe!
		 *
		 * obj = mw.message( 'welcome-user', 'John Doe', 'Wikipedia', '2 hours ago' );
		 * mw.log( obj.text() );
		 * // Welcome back to Wikipedia, John Doe! Last visit by John Doe: 2 hours ago
		 *
		 * // Using mw.msg shortcut, always in "text' format.
		 * str = mw.msg( 'hello-user', 'John Doe' );
		 * mw.log( str );
		 * // Hello, John Doe!
		 *
		 * // Different formats
		 * obj = mw.message( 'so-unusual', 'Time "after" <time>' );
		 *
		 * mw.log( obj.text() );
		 * // You will find: Time "after" <time>
		 *
		 * mw.log( obj.escaped() );
		 * // You will find: Time &quot;after&quot; &lt;time&gt;
		 * ```
		 *
		 * @class mw.Message
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Message
		 * @constructor
		 * @param {mw.Map} map Message store
		 * @param {string} key
		 * @param {Array} [parameters]
		 */
		class Message {
			constructor( map: Map<Record<string, string>> | MapLike<Record<string, string>>, key: string, parameters: string[] );

			/**
			 * Get parsed contents of the message.
			 *
			 * The default parser does simple $N replacements and nothing else.
			 * This may be overridden to provide a more complex message parser.
			 * The primary override is in the mediawiki.jqueryMsg module.
			 *
			 * This function will not be called for nonexistent messages.
			 *
			 * @private For internal use by mediawiki.jqueryMsg only
			 * @param {string} format
			 * @return {string} Parsed message
			 */
			parser( format: string ): string;

			/**
			 * Add (does not replace) parameters for `$N` placeholder values.
			 *
			 * @param {Array} parameters
			 * @return {mw.Message}
			 * @chainable
			 */
			params( parameters: string[] ): this;

			/**
			 * Convert message object to a string using the "text"-format .
			 *
			 * This exists for implicit string type casting only.
			 * Do not call this directly. Use mw.Message#text() instead, one of the
			 * other format methods.
			 *
			 * @private
			 * @param {string} [format="text"] Internal parameter. Uses "text" if called
			 *  implicitly through string casting.
			 * @return {string} Message in the given format, or `⧼key⧽` if the key
			 *  does not exist.
			 */
			toString( format?: string ): string;

			/**
			 * Parse message as wikitext and return HTML.
			 *
			 * If jqueryMsg is loaded, this transforms text and parses a subset of supported wikitext
			 * into HTML. Without jqueryMsg, it is equivalent to #escaped.
			 *
			 * @return {string} String form of parsed message
			 */
			parse(): string;

			/**
			 * Return message plainly.
			 *
			 * This substitutes parameters, but otherwise does not transform the
			 * message content.
			 *
			 * @return {string} String form of plain message
			 */
			plain(): string;

			/**
			 * Format message with text transformations applied.
			 *
			 * If jqueryMsg is loaded, `{{`-transformation is done for supported
			 * magic words such as `{{plural:}}`, `{{gender:}}`, and `{{int:}}`.
			 * Without jqueryMsg, it is equivalent to #plain.
			 *
			 * @return {string} String form of text message
			 */
			text(): string;

			/**
			 * Format message and return as escaped text in HTML.
			 *
			 * This is equivalent to the #text format, which is then HTML-escaped.
			 *
			 * @return {string} String form of html escaped message
			 */
			escaped(): string;

			/**
			 * Check if a message exists
			 *
			 * @see MediaWiki.Map#exists
			 * @return {boolean}
			 */
			exists(): boolean;
		}
	}

	interface MediaWiki {
		/**
		 * Replace `$*` with a list of parameters for `uselang=qqx` support.
		 *
		 * @private
		 * @since 1.33
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-internalDoTransformFormatForQqx
		 * @param {string} formatString Format string
		 * @param {Array} parameters Values for $N replacements
		 * @return {string} Transformed format string
		 */
		internalDoTransformFormatForQqx( formatString: string, parameters: string[] ): string;

		/**
		 * Format a string. Replace $1, $2 ... $N with positional arguments.
		 *
		 * Used by Message#parser().
		 *
		 * @since 1.25
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-format
		 * @param {string} formatString Format string
		 * @param {...Mixed} parameters Values for $N replacements
		 * @return {string} Formatted string
		 */
		format( formatString: string, parameters: string[] ): string;

		/**
		 * Get a message object.
		 *
		 * Shortcut for `new mw.Message( mw.messages, key, parameters )`.
		 *
		 * @see mw.Message
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-message
		 * @param {string} key Key of message to get
		 * @param {...Mixed} parameters Values for $N replacements
		 * @return {mw.Message}
		 */
		message( key: string, parameters: string[] ): MediaWiki.Message;

		/**
		 * Get a message string using the (default) 'text' format.
		 *
		 * Shortcut for `mw.message( key, parameters... ).text()`.
		 *
		 * @see mw.Message
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-msg
		 * @param {string} key Key of message to get
		 * @param {...Mixed} parameters Values for $N replacements
		 * @return {string}
		 */
		msg( key: string, parameters: string[] ): string;
	}
}

export {};
