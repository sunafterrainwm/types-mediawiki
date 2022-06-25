import './language';

declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		namespace jqueryMsg {
			interface ParserOptions {
				magic?: Record<string, string>;
				allowedHtmlElements?: string[];
				allowedHtmlCommonAttributes?: string[];
				allowedHtmlAttributesByElement?: Record<string, string[]>;
				messages?: MediaWiki[ 'messages' ];
				language?: MediaWiki.Language;
				format?: 'text' | 'parse' | 'escaped';
			}

			interface MessageFunction<R> {
				( key: string, ...replacements: string[] ): R;
				( key: string, replacements: string[] ): R;
			}

			type AbstractSyntaxTree = [ string, ...( string | string[] )[] ];

			/**
			 * The parser itself.
			 * Describes an object, whose primary duty is to .parse() message keys.
			 *
			 * @class
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.jqueryMsg.Parser
			 * @param {Object} options
			 */
			class Parser {
				protected settings: ParserOptions & {
					onlyCurlyBraceTransform: boolean;
				};
				protected astCache: Record<string, AbstractSyntaxTree>;
				protected emitter: HtmlEmitter;

				constructor( options: ParserOptions );

				/**
				 * Where the magic happens.
				 * Parses a message from the key, and swaps in replacements as necessary, wraps in jQuery
				 * If an error is thrown, returns original key, and logs the error
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.jqueryMsg.Parser-method-parse
				 * @param {string} key Message key.
				 * @param {Array} replacements Variable replacements for $1, $2... $n
				 * @return {jQuery}
				 */
				parse: MessageFunction<JQuery>;

				/**
				 * Fetch the message string associated with a key, return parsed structure. Memoized.
				 * Note that we pass '⧼' + key + '⧽' back for a missing message here.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.jqueryMsg.Parser-method-getAst
				 * @param {string} key
				 * @param {Array} replacements Variable replacements for $1, $2... $n
				 * @return {string|Array} string of '⧼key⧽' if message missing, simple string if possible, array of arrays if needs parsing
				 */
				getAst: MessageFunction<AbstractSyntaxTree|string>;

				/**
				 * Parses the input wikiText into an abstract syntax tree, essentially an s-expression.
				 *
				 * CAVEAT: This does not parse all wikitext. It could be more efficient, but it's pretty good already.
				 * n.b. We want to move this functionality to the server. Nothing here is required to be on the client.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.jqueryMsg.Parser-method-wikiTextToAst
				 * @param {string} input Message string wikitext
				 * @throws Error
				 * @return {Mixed} abstract syntax tree
				 */
				wikiTextToAst( input: string ): AbstractSyntaxTree;
			}

			/**
			 * Class that primarily exists to emit HTML from parser ASTs.
			 *
			 * @private
			 * @class
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.jqueryMsg.HtmlEmitter
			 * @param {Object} language
			 * @param {Object} magic
			 */
			class HtmlEmitter {
				protected language: MediaWiki.Language;

				constructor( language: MediaWiki.Language, magic: Partial<Record<string, string>> );

				/**
				 * (We put this method definition here, and not in prototype, to make sure it's not overwritten by any magic.)
				 * Walk entire node structure, applying replacements and template functions when appropriate
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.jqueryMsg.HtmlEmitter-method-emit
				 * @param {Mixed} node Abstract syntax tree (top node or subnode)
				 * @param {Array} replacements for $1, $2, ... $n
				 * @return {Mixed} single-string node or array of nodes suitable for jQuery appending
				 */
				emit<T extends string | number>( node: T, replacements: string[] ): T;
				emit<T extends ( OneOrMore<string | number> )[]>( node: [ string, ...T ], replacements: string[] ): T;
				emit( node: undefined, replacements: string[] ): '';

				/**
				 * Parsing has been applied depth-first we can assume that all nodes here are single nodes
				 * Must return a single node to parents -- a jQuery with synthetic span
				 * However, unwrap any other synthetic spans in our children and pass them upwards
				 *
				 * @param {Mixed[]} nodes Some single nodes, some arrays of nodes
				 * @return {jQuery}
				 */
				concat( nodes: ( OneOrMore<string | number> )[], replacements: string[] ): JQuery;

				/**
				 * Return escaped replacement of correct index, or string if unavailable.
				 * Note that we expect the parsed parameter to be zero-based. i.e. $1 should have become [ 0 ].
				 * if the specified parameter is not found return the same string
				 * (e.g. "$99" -> parameter 98 -> not found -> return "$99" )
				 *
				 * If the replacement at the index is an object, then a special property
				 * is is added to it (if it does not exist already).
				 * If the special property was already set, then we try to clone (instead of append)
				 * the replacement object. This allows allow using a jQuery or HTMLElement object
				 * multiple times within a single interface message.
				 *
				 * @param {Array} nodes List of one element, integer, n >= 0
				 * @param {Array} replacements List of at least n strings
				 * @return {string|jQuery} replacement
				 */
				replace( nodes: ( string | number )[], replacements: string[] ): string | JQuery;

				/**
				 * Transform wiki-link
				 *
				 * It does not attempt to handle features like the pipe trick.
				 * However, the pipe trick should usually not be present in wikitext retrieved
				 * from the server, since the replacement is done at save time.
				 * It may, though, if the wikitext appears in extension-controlled content.
				 *
				 * @param {string[]} nodes
				 * @return {jQuery}
				 */
				wikilink( nodes: string[] ): JQuery;

				/**
				 * Converts array of HTML element key value pairs to object
				 *
				 * @param {Array} nodes Array of consecutive key value pairs, with index 2 * n being a
				 *  name and 2 * n + 1 the associated value
				 * @return {Object} Object mapping attribute name to attribute value
				 */
				htmlattributes( nodes: string[] ): Record<string, string>;

				/**
				 * Handles an (already-validated) HTML element.
				 *
				 * @param {Array} nodes Nodes to process when creating element
				 * @return {jQuery}
				 */
				htmlelement( nodes: [ tagName: string, attributes: string, ...contents: string[] ] ): JQuery;

				/**
				 * Transform parsed structure into external link.
				 *
				 * The "href" can be:
				 * - a jQuery object, treat it as "enclosing" the link text.
				 * - a function, treat it as the click handler.
				 * - a string, or our HtmlEmitter jQuery object, treat it as a URI after stringifying.
				 *
				 * @param {Array} nodes List of two elements, {jQuery|Function|String} and {string}
				 * @return {jQuery}
				 */
				extlink( nodes: [ href: JQuery | ( ( event: JQuery.Event ) => string ) | string, contents: string ] ): JQuery;

				/**
				 * Transform parsed structure into pluralization
				 * n.b. The first node may be a non-integer (for instance, a string representing an Arabic number).
				 * So convert it back with the current language's convertNumber.
				 *
				 * @param {Array} nodes List of nodes, [ {string|number}, {string}, {string} ... ]
				 * @return {string|jQuery} selected pluralized form according to current language
				 */
				plural( nodes: [ string | number, ...string[] ] ): string | JQuery;

				/**
				 * Transform parsed structure according to gender.
				 *
				 * Usage: {{gender:[ mw.user object | '' | 'male' | 'female' | 'unknown' ] | masculine form | feminine form | neutral form}}.
				 *
				 * The first node must be one of:
				 * - the mw.user object (or a compatible one)
				 * - an empty string - indicating the current user, same effect as passing the mw.user object
				 * - a gender string ('male', 'female' or 'unknown')
				 *
				 * @param {Array} nodes List of nodes, [ {string|mw.user}, {string}, {string}, {string} ]
				 * @return {string|jQuery} Selected gender form according to current language
				 */
				gender(
					nodes: [ gender: '' | 'male' | 'female' | 'unknown' | MediaWiki.User, masculine: string, feminine: string, neutral: string ]
				): string | JQuery;

				/**
				 * Wraps argument with unicode control characters for directionality safety
				 *
				 * Identical to the implementation in jquery.i18n.emitter.bidi.js
				 *
				 * This solves the problem where directionality-neutral characters at the edge of
				 * the argument string get interpreted with the wrong directionality from the
				 * enclosing context, giving renderings that look corrupted like "(Ben_(WMF".
				 *
				 * The wrapping is LRE...PDF or RLE...PDF, depending on the detected
				 * directionality of the argument string, using the BIDI algorithm's own "First
				 * strong directional codepoint" rule. Essentially, this works round the fact that
				 * there is no embedding equivalent of U+2068 FSI (isolation with heuristic
				 * direction inference). The latter is cleaner but still not widely supported.
				 *
				 * @param {string[]} nodes The text nodes from which to take the first item.
				 * @return {string} Wrapped String of content as needed.
				 */
				bidi( nodes: [ string, ...unknown[] ] ): string;

				/**
				 * Transform parsed structure into grammar conversion.
				 * Invoked by putting `{{grammar:form|word}}` in a message
				 *
				 * @param {Array} nodes List of nodes [{Grammar case eg: genitive}, {string word}]
				 * @return {string|jQuery} selected grammatical form according to current language
				 */
				grammar( nodes: [ string, string ] ): string | JQuery;

				/**
				 * Transform parsed structure into a int: (interface language) message include
				 * Invoked by putting `{{int:othermessage}}` into a message
				 *
				 * @param {Array} nodes List of nodes
				 * @return {string} Other message
				 */
				int( nodes: [ string, ...string[] ] ): string;

				/**
				 * Get localized namespace name from canonical name or namespace number.
				 * Invoked by putting `{{ns:foo}}` into a message
				 *
				 * @param {Array} nodes List of nodes
				 * @return {string} Localized namespace name
				 */
				ns( nodes: [ string ] ): string;

				/**
				 * Takes an unformatted number (arab, no group separators and . as decimal separator)
				 * and outputs it in the localized digit script and formatted with decimal
				 * separator, according to the current language.
				 *
				 * @param {Array} nodes List of nodes
				 * @return {number|string|jQuery} Formatted number
				 */
				formatnum( nodes: [ number: string | number, format?: 'R' ] ): number | string | JQuery;

				/**
				 * Lowercase text
				 *
				 * @param {Array} nodes List of nodes
				 * @return {string} The given text, all in lowercase
				 */
				lc( nodes: [ string ] ): string;

				/**
				 * Uppercase text
				 *
				 * @param {Array} nodes List of nodes
				 * @return {string} The given text, all in uppercase
				 */
				uc( nodes: [ string ] ): string;

				/**
				 * Lowercase first letter of input, leaving the rest unchanged
				 *
				 * @param {Array} nodes List of nodes
				 * @return {string} The given text, with the first character in lowercase
				 */
				lcfirst( nodes: [ string ] ): string;

				/**
				 * Uppercase first letter of input, leaving the rest unchanged
				 *
				 * @param {Array} nodes List of nodes
				 * @return {string} The given text, with the first character in uppercase
				 */
				ucfirst( nodes: [ string ] ): string;
			}
		}

		/**
		 * @class mw.jqueryMsg
		 * @singleton
		 */
		interface JqueryMsg {
			/**
			 * Initialize parser defaults.
			 *
			 * This is currently used by the QUnit testrunner to change the reference in
			 * parserDefaults.messages to the test messages and back.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.jqueryMsg-method-setParserDefaults
			 * @param {Object} data New data to extend parser defaults with
			 */
			setParserDefaults( data: jqueryMsg.ParserOptions ): void;

			/**
			 * Get current parser defaults.
			 *
			 * Primarily used for the unit test. Returns a copy.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.jqueryMsg-method-getParserDefaults
			 * @return {Object}
			 */
			getParserDefaults(): Required<jqueryMsg.ParserOptions>;

			/**
			 * Returns a function suitable for static use, to construct strings from a message key (and optional replacements).
			 *
			 * @example
			 * ```
			 * var format = mediaWiki.jqueryMsg.getMessageFunction( options );
			 * $( '#example' ).text( format( 'hello-user', username ) );
			 * ```
			 *
			 * This returns only strings, so it destroys any bindings. If you want to preserve bindings, use the
			 * jQuery plugin version instead. This was originally created to ease migration from `window.gM()`,
			 * from a time when the parser used by `mw.message` was not extendable.
			 *
			 * N.B. replacements are variadic arguments or an array in second parameter. In other words:
			 * ```
			 *    somefunction( a, b, c, d )
			 * ```
			 * is equivalent to
			 * ```
			 *    somefunction( a, [b, c, d] )
			 * ```
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.jqueryMsg-method-getMessageFunction
			 * @param {Object} options parser options
			 * @return {Function} Function The message formatter
			 * @return {string} return.key Message key.
			 * @return {Array|Mixed} return.replacements Optional variable replacements (variadically or an array).
			 * @return {string} return.return Rendered HTML.
			 */
			getMessageFunction( options: jqueryMsg.ParserOptions ): jqueryMsg.MessageFunction<string>;

			/**
			 * Returns a jQuery plugin which parses the message in the message key, doing replacements optionally, and appends the nodes to
			 * the current selector. Bindings to passed-in jquery elements are preserved. Functions become click handlers for [$1 linktext] links.
			 * e.g.
			 *
			 * @example
			 * ```
			 * $.fn.msg = mediaWiki.jqueryMsg.getPlugin( options );
			 * var $userlink = $( '<a>' ).click( function () { alert( "hello!!" ) } );
			 * $( 'p#headline' ).msg( 'hello-user', $userlink );
			 * ```
			 *
			 * N.B. replacements are variadic arguments or an array in second parameter. In other words:
			 * ```
			 *    somefunction( a, b, c, d )
			 * ```
			 * is equivalent to
			 * ```
			 *    somefunction( a, [ b, c, d ] )
			 * ```
			 *
			 * We append to 'this', which in a jQuery plugin context will be the selected elements.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.jqueryMsg-method-getPlugin
			 * @param {Object} options Parser options
			 * @return {Function} Function suitable for assigning to jQuery plugin, such as jQuery#msg
			 * @return {string} return.key Message key.
			 * @return {Array|Mixed} return.replacements Optional variable replacements (variadically or an array).
			 * @return {jQuery} return.return
			 */
			getPlugin( options: jqueryMsg.ParserOptions ): jqueryMsg.MessageFunction<JQuery>;

			/**
			 * Backwards-compatible alias
			 *
			 * @deprecated since 1.31
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.jqueryMsg.Parser
			 */
			parser: typeof MediaWiki.jqueryMsg.Parser;
		}
	}

	interface MediaWiki {
		/**
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.jqueryMsg
		 */
		readonly jqueryMsg: MediaWiki.JqueryMsg;
	}
}

declare global {
	interface JQuery {
		/**
		 * @member jQuery
		 * @see mw.jqueryMsg#getPlugin
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/jQuery-method-msg
		 */
		msg: import( '@sunafterrainwm/types-mediawiki/mw' ).MediaWiki.jqueryMsg.MessageFunction<JQuery>;
	}
}

export {};
