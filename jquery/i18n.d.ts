import 'jquery';

export type plurals = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export interface LanguageData {
	pluralRules: Record<string, Record<plurals, string>>;

	/**
	 * Plural form transformations, needed for some languages.
	 *
	 * @param {integer} count
	 *            Non-localized quantifier
	 * @param {Array} forms
	 *            List of plural forms
	 * @return {string} Correct form for quantifier in this language
	 */
	convertPlural( count: number, forms: string[], explicitPluralForms?: Record<number, string> ): string;

	/**
	 * For the number, get the plural for index
	 *
	 * @param {integer} number
	 * @param {Object} pluralRules
	 * @return {integer} plural form index
	 */
	getPluralForm( number: number, pluralRules: Partial<Record<plurals, string>> ): number;

	/**
	 * Converts a number using digitTransformTable.
	 *
	 * @param {number} num Value to be converted
	 * @param {boolean} integer Convert the return value to an integer
	 * @return {string} The number converted into a String.
	 */
	convertNumber( num: number, integer?: boolean ): number | string;

	/**
	 * Grammatical transformations, needed for inflected languages.
	 * Invoked by putting {{grammar:form|word}} in a message.
	 * Override this method for languages that need special grammar rules
	 * applied dynamically.
	 *
	 * @param {string} word
	 * @param {string} form
	 * @return {string}
	 */
	convertGrammar( word: string, form: string ): string;

	/**
	 * Provides an alternative text depending on specified gender. Usage
	 * {{gender:[gender|user object]|masculine|feminine|neutral}}. If second
	 * or third parameter are not specified, masculine is used.
	 *
	 * These details may be overridden per language.
	 *
	 * @param {string} gender
	 *      male, female, or anything else for neutral.
	 * @param {Array} forms
	 *      List of gender forms
	 *
	 * @return {string}
	 */
	gender( gender: string, forms: string[] ): string;

	/**
	 * Get the digit transform table for the given language
	 * See http://cldr.unicode.org/translation/numbering-systems
	 *
	 * @param {string} language
	 * @return {Array|boolean} List of digits in the passed language or false
	 * representation, or boolean false if there is no information.
	 */
	digitTransformTable( language: string ): string[] | false;
}

export interface IMessageStore {
	/**
	 * General message loading API
	 *
	 * This can take a URL string for the json formatted messages.
	 *
	 * @example
	 * ```
	 * load('path/to/all_localizations.json');
	 * ```
	 *
	 * This can also load a localization file for a locale
	 *
	 * @example
	 * ```
	 * load( 'path/to/de-messages.json', 'de' );
	 * ```
	 *
	 * A data object containing message key- message translation mappings
	 * can also be passed
	 *
	 * @example
	 * ```
	 * load( { 'hello' : 'Hello' }, optionalLocale );
	 * ```
	 *
	 * If the data argument is
	 * null/undefined/false,
	 * all cached messages for the i18n instance will get reset.
	 *
	 * @param {string|Object} source
	 * @param {string} locale Language tag
	 * @return {jQuery.Promise}
	 */
	load( source: string, locale?: string ): JQuery.Promise<void>;
	load( source: Record<string, string>, locale: string ): JQuery.Promise<void>;
	load( source: Record<string, string | Record<string, string>> ): JQuery.Promise<void>;

	get( locale: string, messageKey: string ): boolean;

	/**
	 * Set messages to the given locale.
	 * If locale exists, add messages to the locale.
	 *
	 * @param {string} locale
	 * @param {Object} messages
	 */
	set( locale: string, messages: Record<string, string> ): void;
}

export interface IParser {
	parse( message: string, parameters: string[] ): string;

	emitter: IParserEmitter;
}

export interface IParserEmitter {
	/**
	 * (We put this method definition here, and not in prototype, to make
	 * sure it's not overwritten by any magic.) Walk entire node structure,
	 * applying replacements and template functions when appropriate
	 *
	 * @param {Mixed} node abstract syntax tree (top node or subnode)
	 * @param {Array} replacements for $1, $2, ... $n
	 * @return {Mixed} single-string node or array of nodes suitable for
	 *  jQuery appending.
	 */
	emit<T extends string | number>( node: T, replacements: string[] ): T;
	emit<T extends ( string | string[] | number )[]>( node: [ Omit<keyof ParserEmitter, 'emit'>, ...T ], replacements: string[] ): T;
	emit( node: undefined, replacements: string[] ): '';
}

export declare class MessageStore implements IMessageStore {
	protected messages: Record<string, Record<string, string>>;
	protected sources: unknown;

	constructor();

	/**
	 * General message loading API
	 *
	 * This can take a URL string for the json formatted messages.
	 *
	 * @example
	 * ```
	 * load('path/to/all_localizations.json');
	 * ```
	 *
	 * This can also load a localization file for a locale
	 *
	 * @example
	 * ```
	 * load( 'path/to/de-messages.json', 'de' );
	 * ```
	 *
	 * A data object containing message key- message translation mappings
	 * can also be passed
	 *
	 * @example
	 * ```
	 * load( { 'hello' : 'Hello' }, optionalLocale );
	 * ```
	 *
	 * If the data argument is
	 * null/undefined/false,
	 * all cached messages for the i18n instance will get reset.
	 *
	 * @param {string|Object} source
	 * @param {string} locale Language tag
	 * @return {jQuery.Promise}
	 */
	/**
	 * General message loading API
	 *
	 * This can take a URL string for the json formatted messages.
	 *
	 * @example
	 * ```
	 * load('path/to/all_localizations.json');
	 * ```
	 *
	 * This can also load a localization file for a locale
	 *
	 * @example
	 * ```
	 * load( 'path/to/de-messages.json', 'de' );
	 *
	 * @param {string} source url
	 * @param {string} [locale] Language tag
	 * @return {jQuery.Promise}
	 */
	load( source: string, locale?: string ): JQuery.Promise<void>;
	/**
	 * General message loading API
	 *
	 * A data object containing message key- message translation mappings
	 * can be passed
	 *
	 * @example
	 * ```
	 * load( { 'hello' : 'Hello' }, optionalLocale );
	 * ```
	 *
	 *
	 * @param {string|Object} source
	 * @param {string} locale Language tag
	 * @return {jQuery.Promise}
	 */
	load( source: Record<string, string>, locale: string ): JQuery.Promise<void>;
	/**
	 * General message loading API
	 *
	 * @example
	 * ```
	 * load( {
	 *     en: {
	 *         'hello' : 'Hello'
	 *     },
	 *     de: 'path/to/locale/de.json'
	 * }, optionalLocale );
	 * ```
	 *
	 *
	 * @param {string|Object} source
	 * @return {jQuery.Promise}
	 */
	load( source: Record<string, string | Record<string, string>> ): JQuery.Promise<void>;

	/**
	 * @param {string} locale
	 * @param {string} messageKey
	 * @return {boolean}
	 */
	get( locale: string, messageKey: string ): boolean;

	/**
	 * Set messages to the given locale.
	 * If locale exists, add messages to the locale.
	 *
	 * @param {string} locale
	 * @param {Object} messages
	 */
	set( locale: string, messages: Record<string, string> ): void;
}

export type AbstractSyntaxTree = [ string, ...( string | string[] )[] ];

export declare class Parser implements IParser {
	constructor( options: unknown );

	simpleParse( message: string, parameters: string[] ): string;

	parse( message: string, parameters: string[] ): string;

	ast( message: string ): AbstractSyntaxTree;

	readonly emitter: ParserEmitter;
}

export declare class ParserEmitter implements IParserEmitter {
	protected language: LanguageData;

	/**
	 * (We put this method definition here, and not in prototype, to make
	 * sure it's not overwritten by any magic.) Walk entire node structure,
	 * applying replacements and template functions when appropriate
	 *
	 * @param {Mixed} node abstract syntax tree (top node or subnode)
	 * @param {Array} replacements for $1, $2, ... $n
	 * @return {Mixed} single-string node or array of nodes suitable for
	 *  jQuery appending.
	 */
	emit<T extends string | number>( node: T, replacements: string[] ): T;
	emit<T extends ( string | string[] | number )[]>( node: [ Omit<keyof ParserEmitter, 'emit'>, ...T ], replacements: string[] ): T;
	emit( node: undefined, replacements: string[] ): '';

	/**
	 * Wraps argument with unicode control characters for directionality safety
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
	bidi( nodes: string[] ): string;

	/**
	 * Transform parsed structure into pluralization n.b. The first node may
	 * be a non-integer (for instance, a string representing an Arabic
	 * number). So convert it back with the current language's
	 * convertNumber.
	 *
	 * @param {Array} nodes List [ {String|Number}, {String}, {String} ... ]
	 * @return {string} selected pluralized form according to current
	 *  language.
	 */
	plural( nodes: [ string | number, ...string[] ] ): string;

	/**
	 * Transform parsed structure into gender Usage
	 * {{gender:gender|masculine|feminine|neutral}}.
	 *
	 * @param {Array} nodes List [ {String}, {String}, {String} , {String} ]
	 * @return {string} selected gender form according to current language
	 */
	gender<M extends string, F extends string, U extends string>( nodes: [ string, M, F, U ] ): M | F | U;

	/**
	 * Transform parsed structure into grammar conversion. Invoked by
	 * putting {{grammar:form|word}} in a message
	 *
	 * @param {Array} nodes List [{Grammar case eg: genitive}, {String word}]
	 * @return {string} selected grammatical form according to current
	 *  language.
	 */
	grammar( nodes: [ string, string ] ): string;

	/**
	 * Return escaped replacement of correct index, or string if
	 * unavailable. Note that we expect the parsed parameter to be
	 * zero-based. i.e. $1 should have become [ 0 ]. if the specified
	 * parameter is not found return the same string (e.g. "$99" ->
	 * parameter 98 -> not found -> return "$99" ) TODO throw error if
	 * nodes.length > 1 ?
	 *
	 * @param {Array} nodes One element, integer, n >= 0
	 * @param {Array} replacements for $1, $2, ... $n
	 * @return {string} replacement
	 */
	replace( nodes: string, replacements: string[] ): string;
}

export interface I18nOptions {
	fallbackLocale?: string;
	locale?: string;
	messageStore?: IMessageStore;
	parser?: IParser;
}

export declare class I18n {
	options: I18nOptions;
	parser: Parser;
	locale: string;
	messageStore: MessageStore;

	constructor( locale: string, options?: I18nOptions );

	/**
	 * Localize a given messageKey to a locale.
	 *
	 * @param {string} messageKey
	 * @return {string} Localized message
	 */
	localize( messageKey: string ): string;

	/**
	 * Destroy the i18n instance.
	 */
	destroy(): void;

	/**
	 * General message loading API This can take a URL string for
	 * the json formatted messages.
	 *
	 * @example
	 * ```
	 * $.i18n().load( 'path/to/all_localizations.json' );
	 * ```
	 *
	 * To load a localization file for a locale:
	 * @example
	 * ```
	 * $.i18n().load( 'path/to/de-messages.json', 'de' );
	 * ```
	 *
	 * To load a localization file from a directory:
	 * @example
	 * ```
	 * $.i18n().load( 'path/to/i18n/directory', 'de' );
	 * ```
	 *
	 * The above method has the advantage of fallback resolution.
	 * ie, it will automatically load the fallback locales for de.
	 * For most usecases, this is the recommended method.
	 * It is optional to have trailing slash at end.
	 *
	 * A data object containing message key- message translation mappings
	 * can also be passed.
	 * @example
	 * ```
	 * $.i18n().load( { 'hello' : 'Hello' }, optionalLocale );
	 * ```
	 *
	 * A source map containing key-value pair of languagename and locations
	 * can also be passed.
	 * @example
	 * ```
	 * $.i18n().load( {
	 *     bn: 'i18n/bn.json',
	 *     he: 'i18n/he.json',
	 *     en: 'i18n/en.json'
	 * } )
	 * ```
	 *
	 * If the data argument is null/undefined/false,
	 * all cached messages for the i18n instance will get reset.
	 *
	 * @param {string|Object} source
	 * @param {string} locale Language tag
	 * @return {jQuery.Promise}
	 */
	load( source: string | Record<string, string>, locale: string ): JQuery.Promise<unknown>;

	/**
	 * Does parameter and magic word substitution.
	 *
	 * @param {string} key Message key
	 * @param {Array} parameters Message parameters
	 * @return {string}
	 */
	parse( key: string, parameters: string ): string;

	static readonly default: {
		readonly locale: string;
		readonly fallbackLocale: string;
		readonly parser: IParser;
		readonly messageStore: MessageStore;
	};
}

export interface I18nStatic {
	/**
	 * Process a message from the $.I18N instance
	 * for the current document, stored in jQuery.data(document).
	 *
	 * @param {string} msg_or_key Key of the message.
	 * @param {...string} params Variadic list of parameters for {key}.
	 * @return {string} Parsed message
	 */
	( msg_or_key: string, ...params: string[] ): string;

	/**
	 * Get the instance of $.I18N.
	 *
	 * @param {I18nOptions} options
	 * @return {I18n} The instance of $.I18N
	 */
	( options: I18nOptions ): I18n;

	languages: Record<string, LanguageData> & {
		readonly default: Readonly<LanguageData>;
	};

	messageStore: MessageStore;

	parser: Parser;

	fallbacks: string[][];

	debug: boolean;

	log: Console[ 'log' ];

	constructor: typeof I18n;
}

declare global {
	interface JQueryStatic {
		i18n: I18nStatic;
	}

	interface JQuery {
		i18n(): this;
	}
}

export {};
