declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		type TitleLike = string | Title;

		/**
		 * Parse titles into an object structure. Note that when using the constructor
		 * directly, passing invalid titles will result in an exception. Use #newFromText to use the
		 * logic directly and get null for invalid titles which is easier to work with.
		 *
		 * Note that in the constructor and #newFromText method, `namespace` is the **default** namespace
		 * only, and can be overridden by a namespace prefix in `title`. If you do not want this behavior,
		 * use #makeTitle. Compare:
		 *
		 * @example
		 * ```
		 * new mw.Title( 'Foo', NS_TEMPLATE ).getPrefixedText();                  // => 'Template:Foo'
		 * mw.Title.newFromText( 'Foo', NS_TEMPLATE ).getPrefixedText();          // => 'Template:Foo'
		 * mw.Title.makeTitle( NS_TEMPLATE, 'Foo' ).getPrefixedText();            // => 'Template:Foo'
		 *
		 * new mw.Title( 'Category:Foo', NS_TEMPLATE ).getPrefixedText();         // => 'Category:Foo'
		 * mw.Title.newFromText( 'Category:Foo', NS_TEMPLATE ).getPrefixedText(); // => 'Category:Foo'
		 * mw.Title.makeTitle( NS_TEMPLATE, 'Category:Foo' ).getPrefixedText();   // => 'Template:Category:Foo'
		 *
		 * new mw.Title( 'Template:Foo', NS_TEMPLATE ).getPrefixedText();         // => 'Template:Foo'
		 * mw.Title.newFromText( 'Template:Foo', NS_TEMPLATE ).getPrefixedText(); // => 'Template:Foo'
		 * mw.Title.makeTitle( NS_TEMPLATE, 'Template:Foo' ).getPrefixedText();   // => 'Template:Template:Foo'
		 * ```
		 *
		 * @class mw.Title
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title
		 * @param {string} title Title of the page. If no second argument given,
		 *  this will be searched for a namespace
		 * @param {number} [namespace=NS_MAIN] If given, will used as default namespace for the given title
		 * @throws {Error} When the title is invalid
		 */
		class Title {
			constructor( title: string, namespace?: number );

			private title: string;

			private namespace: number;

			private fragment: string | null;

			/**
			 * Constructor for Title objects with a null return instead of an exception for invalid titles.
			 *
			 * Note that `namespace` is the **default** namespace only, and can be overridden by a namespace
			 * prefix in `title`. If you do not want this behavior, use #makeTitle. See #constructor for
			 * details.
			 *
			 * @static
			 * @param {string} title
			 * @param {number} [namespace=NS_MAIN] Default namespace
			 * @return {mw.Title|null} A valid Title object or null if the title is invalid
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-static-method-newFromText
			 */
			static newFromText( title: string, namespace?: number ): Title | null;

			/**
			 * Constructor for Title objects with predefined namespace.
			 *
			 * Unlike #newFromText or #constructor, this function doesn't allow the given `namespace` to be
			 * overridden by a namespace prefix in `title`. See #constructor for details about this behavior.
			 *
			 * The single exception to this is when `namespace` is 0, indicating the main namespace. The
			 * function behaves like #newFromText in that case.
			 *
			 * @static
			 * @param {number} namespace Namespace to use for the title
			 * @param {string} title
			 * @return {mw.Title|null} A valid Title object or null if the title is invalid
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-static-method-makeTitle
			 */
			static makeTitle( title: string, namespace?: number ): Title | null;

			/**
			 * Constructor for Title objects from user input altering that input to
			 * produce a title that MediaWiki will accept as legal
			 *
			 * @static
			 * @param {string} title
			 * @param {number} [defaultNamespace=NS_MAIN]
			 *  If given, will used as default namespace for the given title.
			 * @param {Object} [options] additional options
			 * @param {boolean} [options.forUploading=true]
			 *  Makes sure that a file is uploadable under the title returned.
			 *  There are pages in the file namespace under which file upload is impossible.
			 *  Automatically assumed if the title is created in the Media namespace.
			 * @return {mw.Title|null} A valid Title object or null if the input cannot be turned into a valid title
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-static-method-newFromUserInput
			 */
			static newFromUserInput( title: string, namespace?: number, options?: {
				forUploading?: boolean;
			} ): Title;

			/**
			 * Sanitizes a file name as supplied by the user, originating in the user's file system
			 * so it is most likely a valid MediaWiki title and file name after processing.
			 * Returns null on fatal errors.
			 *
			 * @static
			 * @param {string} uncleanName The unclean file name including file extension but
			 *   without namespace
			 * @return {mw.Title|null} A valid Title object or null if the title is invalid
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-static-method-newFromFileName
			 */
			static newFromFileName( uncleanName: string ): Title;

			/**
			 * Get the file title from an image element
			 *
			 *     var title = mw.Title.newFromImg( imageNode );
			 *
			 * @static
			 * @param {HTMLElement|jQuery} img The image to use as a base
			 * @return {mw.Title|null} The file title or null if unsuccessful
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-static-method-newFromImg
			 */
			static newFromImg( img: HTMLElement | JQuery ): Title;

			/**
			 * Check if a given namespace is a talk namespace
			 *
			 * See NamespaceInfo::isTalk in PHP
			 *
			 * @param {number} namespaceId Namespace ID
			 * @return {boolean} Namespace is a talk namespace
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-static-method-isTalkNamespace
			 */
			static isTalkNamespace( namespaceId: number ): boolean;

			/**
			 * Check if signature buttons should be shown in a given namespace
			 *
			 * See NamespaceInfo::wantSignatures in PHP
			 *
			 * @param {number} namespaceId Namespace ID
			 * @return {boolean} Namespace is a signature namespace
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-static-method-wantSignatureNamespace
			 */
			static wantSignatureNamespace( namespaceId: number ): boolean;

			/**
			 * Whether this title exists on the wiki.
			 *
			 * @static
			 * @param {string|mw.Title} title prefixed db-key name (string) or instance of Title
			 * @return {boolean|null} Boolean if the information is available, otherwise null
			 * @throws {Error} If title is not a string or mw.Title
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-static-method-exists
			 */
			static exists( title: TitleLike ): boolean | null;

			/**
			 * Store page existence
			 *
			 * @static
			 * @property {Object} exist
			 * @property {Object} exist.pages Keyed by title. Boolean true value indicates page does exist.
			 *
			 * @property {Function} exist.set The setter function.
			 *
			 * @example Declare existing titles:
			 * ```
			 * Title.exist.set( ['User:John_Doe', ...] );
			 * ```
			 *
			 * @example Declare titles nonexistent:
			 * ```
			 * Title.exist.set( ['File:Foo_bar.jpg', ...], false );
			 * ```
			 *
			 * @property {string|Array} exist.set.titles Title(s) in strict prefixedDb title form
			 * @property {boolean} [exist.set.state=true] State of the given titles
			 * @return {boolean}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-static-method-exist
			 */
			static exist: {
				pages: Record<string, boolean>;
				set: ( titles: string | string[], state?: boolean ) => boolean;
			};

			/**
			 * Normalize a file extension to the common form, making it lowercase and checking some synonyms,
			 * and ensure it's clean. Extensions with non-alphanumeric characters will be discarded.
			 * Keep in sync with File::normalizeExtension() in PHP.
			 *
			 * @param {string} extension File extension (without the leading dot)
			 * @return {string} File extension in canonical form
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-static-method-normalizeExtension
			 */
			static normalizeExtension( extension: string ): string;

			/**
			 * PHP's strtoupper differs from String.toUpperCase in a number of cases (T147646).
			 *
			 * @param {string} chr Unicode character
			 * @return {string} Unicode character, in upper case, according to the same rules as in PHP
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-static-method-phpCharToUpper
			 */
			static phpCharToUpper( chr: string ): string;

			/**
			 * Get the namespace number
			 *
			 * Example: 6 for "File:Example_image.svg".
			 *
			 * @return {number}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getNamespaceId
			 */
			getNamespaceId(): number;

			/**
			 * Get the namespace prefix (in the content language)
			 *
			 * Example: "File:" for "File:Example_image.svg".
			 * In #NS_MAIN this is '', otherwise namespace name plus ':'
			 *
			 * @return {string}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getNamespacePrefix
			 */
			getNamespacePrefix(): string;

			/**
			 * Get the page name as if it is a file name, without extension or namespace prefix. Warning,
			 * this is usually not what you want! A title like "User:Dr._J._Fail" will be returned as
			 * "Dr. J"! Use #getMain or #getMainText for the actual page name.
			 *
			 * @return {string} File name without file extension, in the canonical form with underscores
			 *  instead of spaces. For example, the title "File:Example_image.svg" will be returned as
			 *  "Example_image".
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getName
			 */
			getName(): string;

			/**
			 * Get the page name as if it is a file name, without extension or namespace prefix. Warning,
			 * this is usually not what you want! A title like "User:Dr._J._Fail" will be returned as
			 * "Dr. J"! Use #getMainText for the actual page name.
			 *
			 * @return {string} File name without file extension, formatted with spaces instead of
			 *  underscores. For example, the title "File:Example_image.svg" will be returned as
			 *  "Example image".
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getNameText
			 */
			getNameText(): string;

			/**
			 * Get the extension of the page name (if any)
			 *
			 * @return {string|null} Name extension or null if there is none
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getExtension
			 */
			getExtension(): string | null;

			/**
			 * Shortcut for appendable string to form the main page name.
			 *
			 * Returns a string like ".json", or "" if no extension.
			 *
			 * @return {string}
			 * @deprecated removed in 1.36
			 * @see https://doc.wikimedia.org/mediawiki-core/REL1_35/js/#!/api/mw.Title-method-getDotExtension
			 */
			getDotExtension(): string;

			/**
			 * Get the main page name
			 *
			 * Example: "Example_image.svg" for "File:Example_image.svg".
			 *
			 * @return {string}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getMain
			 */
			getMain(): string;

			/**
			 * Get the main page name (transformed by #text)
			 *
			 * Example: "Example image.svg" for "File:Example_image.svg".
			 *
			 * @return {string}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getMainText
			 */
			getMainText(): string;

			/**
			 * Get the full page name
			 *
			 * Example: "File:Example_image.svg".
			 * Most useful for API calls, anything that must identify the "title".
			 *
			 * @return {string}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getPrefixedDb
			 */
			getPrefixedDb(): string;

			/**
			 * Get the full page name (transformed by #text)
			 *
			 * Example: "File:Example image.svg" for "File:Example_image.svg".
			 *
			 * @return {string}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getPrefixedText
			 */
			getPrefixedText(): string;

			/**
			 * Get the page name relative to a namespace
			 *
			 * Example:
			 *
			 * - "Foo:Bar" relative to the Foo namespace becomes "Bar".
			 * - "Bar" relative to any non-main namespace becomes ":Bar".
			 * - "Foo:Bar" relative to any namespace other than Foo stays "Foo:Bar".
			 *
			 * @param {number} namespace The namespace to be relative to
			 * @return {string}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getRelativeText
			 */
			getRelativeText( namespace: number ): string;

			/**
			 * Get the fragment (if any).
			 *
			 * Note that this method (by design) does not include the hash character and
			 * the value is not url encoded.
			 *
			 * @return {string|null}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getFragment
			 */
			getFragment(): string | null;

			/**
			 * Get the URL to this title
			 *
			 * @see mw.util#getUrl
			 * @param {Object} [params] A mapping of query parameter names to values,
			 *     e.g. `{ action: 'edit' }`.
			 * @return {string}
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getUrl
			 */
			getUrl( params?: Record<string, string> ): string;

			/**
			 * Check if the title is in a talk namespace
			 *
			 * @return {boolean} The title is in a talk namespace
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-isTalkPage
			 */
			isTalkPage(): boolean;

			/**
			 * Get the title for the associated talk page
			 *
			 * @return {mw.Title|null} The title for the associated talk page, null if not available
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getTalkPage
			 */
			getTalkPage(): Title | null;

			/**
			 * Get the title for the subject page of a talk page
			 *
			 * @return {mw.Title|null} The title for the subject page of a talk page, null if not available
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-getSubjectPage
			 */
			getSubjectPage(): Title | null;

			/**
			 * Check the title can have an associated talk page
			 *
			 * @return {boolean} The title can have an associated talk page
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-canHaveTalkPage
			 */
			canHaveTalkPage(): boolean;

			/**
			 * Whether this title exists on the wiki.
			 *
			 * @see MediaWiki.Title.exists
			 * @return {boolean|null} Boolean if the information is available, otherwise null
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-exists
			 */
			exists(): boolean | null;

			/**
			 * Alias of mw.Title#getPrefixedDb
			 *
			 * @alias mw.Title#getPrefixedDb
			 * @see MediaWiki.Title#getPrefixedDb
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-toString
			 * @method
			 */
			toString(): string;

			/**
			 * Alias of mw.Title#getPrefixedText
			 *
			 * @alias mw.Title#getPrefixedText
			 * @see MediaWiki.Title#getPrefixedText
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Title-method-toText
			 * @method
			 */
			toText(): string;
		}
	}
}

export {};
