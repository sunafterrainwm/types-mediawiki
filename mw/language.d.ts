import pluralRuleParser from '../lib/cldrpluralruleparser';

declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		interface Libraries {
			pluralRuleParser: typeof pluralRuleParser;
		}

		interface ExportLibrary {
			'mediawiki.libs.pluralruleparser': typeof pluralRuleParser;
		}

		/**
		 * Namespace for CLDR-related utility methods.
		 *
		 * @class
		 * @singleton
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.cldr
		 */
		interface Cldr {
			/**
			 * Get the plural form index for the number.
			 *
			 * In case none of the rules passed, we return `pluralRules.length` -
			 * that means it is the "other" form.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.cldr-method-getPluralForm
			 * @param {number} number
			 * @param {Array} pluralRules
			 * @return {number} plural form index
			 */
			getPluralForm( number: number, pluralRules: string[] ): number;
		}

		namespace Language {
			/**
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-property-data
			 */
			interface LanguageData extends Record<string, unknown> {
				bcp47Map: Record<string, string>;

				digitGroupingPattern: string;

				digitTransformTable: string[] | null;

				fallbackLanguages: string[];

				grammarForms: unknown[];

				grammarTransformations: [] | {
					genitive?: string[][];
					accusative?: string[][];
					locative?: string[][];
					languagegen?: string[][];
					languageadverb?: string[][];
				};

				languageNames: Record<string, string>;

				minimumGroupingDigit: number | null;

				pluralRules: string[];

				separatorTransformTable: Record<string, string> | null;
			}

			/**
			 * Information about month names in current UI language.
			 *
			 * Object keys:
			 *
			 * - `names`: array of month names (in nominative case in languages which have the distinction),
			 *   zero-indexed
			 * - `genitive`: array of month names in genitive case, zero-indexed
			 * - `abbrev`: array of three-letter-long abbreviated month names, zero-indexed
			 * - `keys`: object with three keys like the above, containing zero-indexed arrays of message keys
			 *   for appropriate messages which can be passed to mw.msg.
			 *
			 * @property {Object}
			 * @member mw.language
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-property-months
			 */
			interface Months {
				keys: {
					names: string[];
					genitive: string[];
					abbrev: string[];
				};
				names: string[];
				genitive: string[];
				abbrev: string[];
			}
		}

		/**
		 * Base language object with methods related to language support, attempting to mirror some of the
		 * functionality of the Language class in MediaWiki:
		 *
		 *   - storing and retrieving language data
		 *   - transforming message syntax (`{{PLURAL:}}`, `{{GRAMMAR:}}`, `{{GENDER:}}`)
		 *   - formatting numbers
		 *
		 * @class
		 * @singleton
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language
		 */
		interface Language {
			/**
			 * Language-related data (keyed by language, contains instances of mw.Map).
			 *
			 * Exported dynamically by the ResourceLoaderLanguage.LanguageDataModule class in PHP.
			 *
			 * To set data:
			 *
			 *     // Override, extend or create the language data object of 'nl'
			 *     mw.language.setData( 'nl', 'myKey', 'My value' );
			 *
			 *     // Set multiple key/values pairs at once
			 *     mw.language.setData( 'nl', { foo: 'X', bar: 'Y' } );
			 *
			 * To get GrammarForms data for language 'nl':
			 *
			 *     var grammarForms = mw.language.getData( 'nl', 'grammarForms' );
			 *
			 * Possible data keys:
			 *
			 *  - `digitTransformTable`
			 *  - `separatorTransformTable`
			 *  - `minimumGroupingDigits`
			 *  - `grammarForms`
			 *  - `pluralRules`
			 *  - `digitGroupingPattern`
			 *  - `fallbackLanguages`
			 *  - `bcp47Map`
			 *  - `languageNames`
			 *
			 * @property {Object}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-property-data
			 */
			readonly data: Record<string, Map<Language.LanguageData>>;

			/**
			 * Convenience method for retrieving language data.
			 *
			 * Structured by language code and data key, covering for the potential inexistence of a
			 * data object for this language.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-getData
			 * @param {string} langCode
			 * @param {string} [dataKey]
			 * @return {Mixed} Value stored in the mw.Map (or `undefined` if there is no map for the
			 *  specified langCode)
			 */
			getData( langCode: string ): Language.LanguageData | undefined;
			getData<S extends ( keyof Language.LanguageData )[]>(
				selection: S
			): Pick<Language.LanguageData, S extends ( infer SS )[] ? SS : never>;
			getData<T extends keyof Language.LanguageData>( langCode: string, dataKey: T ): Language.LanguageData[ T ] | undefined;

			/**
			 * Convenience method for setting language data.
			 *
			 * Creates the data mw.Map if there isn't one for the specified language already.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-setData
			 * @param {string} langCode
			 * @param {string|Object} dataKey Key or object of key/values
			 * @param {Mixed} [value] Value for dataKey, omit if dataKey is an object
			 */
			setData( langCode: string, data: Partial<Language.LanguageData> ): void;
			setData<T extends keyof Language.LanguageData>( langCode: string, dataKey: T, value: Language.LanguageData[T] ): void;

			/**
			 * Plural form transformations, needed for some languages.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-convertPlural
			 * @param {number} count Non-localized quantifier
			 * @param {Array} forms List of plural forms
			 * @param {Object} [explicitPluralForms] List of explicit plural forms
			 * @return {string} Correct form for quantifier in this language
			 */
			convertPlural( count: number, forms: string[], explicitPluralForms?: Record<number, string> ): string;

			/**
			 * Pads an array to a specific length by copying the last one element.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-preConvertPlural
			 * @param {Array} forms Number of forms given to convertPlural
			 * @param {number} count Number of forms required
			 * @return {Array} Padded array of forms
			 */
			preConvertPlural( forms: string[], count: number ): string[];

			/**
			 * Provides an alternative text depending on specified gender.
			 *
			 * Usage in message text: `{{gender:[gender|user object]|masculine|feminine|neutral}}`.
			 * If second or third parameter are not specified, masculine is used.
			 *
			 * These details may be overridden per language.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-gender
			 * @param {string} gender 'male', 'female', or anything else for neutral.
			 * @param {Array} forms List of gender forms
			 * @return {string}
			 */
			gender( gender: string, forms: string[] ): string;

			/**
			 * Grammatical transformations, needed for inflected languages.
			 * Invoked by putting `{{grammar:case|word}}` in a message.
			 *
			 * The rules can be defined in $wgGrammarForms global or computed
			 * dynamically by overriding this method per language.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-convertGrammar
			 * @param {string} word
			 * @param {string} form
			 * @return {string}
			 */
			convertGrammar( word: string, form: string ): string;

			/**
			 * Turn a list of string into a simple list using commas and 'and'.
			 *
			 * See Language::listToText in languages/Language.php
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-listToText
			 * @param {string[]} list
			 * @return {string}
			 */
			listToText( list: string[] ): string;

			/**
			 * Formats language tags according the BCP 47 standard.
			 * See LanguageCode::bcp47 for the PHP implementation.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-bcp47
			 * @param {string} languageTag Well-formed language tag
			 * @return {string}
			 */
			bcp47( languageTag: string ): string;

			/**
			 * Converts a number using {@link getDigitTransformTable}.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-convertNumber
			 * @param {number} num Value to be converted
			 * @param {boolean} [integer=false] Whether to convert the return value to an integer
			 * @return {number|string} Formatted number
			 */
			convertNumber( num: number, integer?: boolean ): number | string;

			/**
			 * Get the digit transform table for current UI language.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-getDigitTransformTable
			 * @return {Object|Array}
			 */
			getDigitTransformTable(): Language.LanguageData['digitTransformTable'];

			/**
			 * Get the separator transform table for current UI language.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-getSeparatorTransformTable
			 * @return {Object|Array}
			 */
			getSeparatorTransformTable(): Language.LanguageData['separatorTransformTable'];

			/**
			 * Apply pattern to format value as a string.
			 *
			 * Using patterns from [Unicode TR35](https://www.unicode.org/reports/tr35/#Number_Format_Patterns).
			 *
			 * @method commafy
			 * @deprecated This function will be made private in a future release;
			 *   it is poorly named, corresponds to a deprecated function in core, and
			 *   its functionality should be rolled into {@link convertNumber()}.
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-commafy
			 * @param {number} value
			 * @param {string} pattern Pattern string as described by Unicode TR35
			 * @param {number|null} [minimumGroupingDigits=null]
			 * @throws {Error} If unable to find a number expression in `pattern`.
			 * @return {string}
			 */
			commafy( value: number, pattern: string, minimumGroupingDigits?: number | null ): string;

			/**
			 * Get the language fallback chain for current UI language (not including the language itself).
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-getFallbackLanguages
			 * @return {string[]} List of language keys, e.g. `['de', 'en']`
			 */
			getFallbackLanguages(): string[];

			/**
			 * Get the language fallback chain for current UI language, including the language itself.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-method-getFallbackLanguageChain
			 * @return {string[]} List of language keys, e.g. `['pfl', de', 'en']`
			 */
			getFallbackLanguageChain(): string[];

			/**
			 * Information about month names in current UI language.
			 *
			 * Object keys:
			 *
			 * - `names`: array of month names (in nominative case in languages which have the distinction),
			 *   zero-indexed
			 * - `genitive`: array of month names in genitive case, zero-indexed
			 * - `abbrev`: array of three-letter-long abbreviated month names, zero-indexed
			 * - `keys`: object with three keys like the above, containing zero-indexed arrays of message keys
			 *   for appropriate messages which can be passed to mw.msg.
			 *
			 * @property {Object}
			 * @member mw.language
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language-property-months
			 */
			months: Language.Months;
		}
	}

	interface MediaWiki {
		/**
		 * Namespace for CLDR-related utility methods.
		 *
		 * @class
		 * @singleton
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.cldr
		 */
		cldr: MediaWiki.Cldr;

		/**
		 * Base language object with methods related to language support, attempting to mirror some of the
		 * functionality of the Language class in MediaWiki:
		 *
		 *   - storing and retrieving language data
		 *   - transforming message syntax (`{{PLURAL:}}`, `{{GRAMMAR:}}`, `{{GENDER:}}`)
		 *   - formatting numbers
		 *
		 * @class
		 * @singleton
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.language
		 */
		readonly language: MediaWiki.Language;
	}
}

export {};
