import './ForeignApi';
import './Upload';

declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		namespace ForeignStructuredUpload {
			interface ForeignStructuredUploadConfig {
				fields: {
					description: boolean;
					date: boolean;
					categories: boolean;
				};
				licensemessages: {
					local: string;
					foreign: string;
				};
				comment: {
					local: string;
					foreign: string;
				};
				format: {
					filepage: string;
					description: string;
					ownwork: string;
					license: string;
					uncategorized: string;
				};
			}
		}

		/**
		 * Used to represent an upload in progress on the frontend.
		 *
		 * This subclass will upload to a wiki using a structured metadata
		 * system similar to (or identical to) the one on Wikimedia Commons.
		 *
		 * See <https://commons.wikimedia.org/wiki/Commons:Structured_data> for
		 * a more detailed description of how that system works.
		 *
		 * **TODO: This currently only supports uploads under CC-BY-SA 4.0,
		 * and should really have support for more licenses.**
		 *
		 * @class mw.ForeignStructuredUpload
		 * @extends mw.ForeignUpload
		 *
		 * @constructor
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload
		 * @param {string} [target]
		 * @param {Object} [apiconfig]
		 */
		class ForeignStructuredUpload extends ForeignUpload {
			protected date: Date | undefined;
			protected descriptions: string[];
			protected categories: string[];

			/**
			 * Config for uploads to local wiki.
			 * Can be overridden with foreign wiki config when #loadConfig is called.
			 */
			protected config: ForeignStructuredUpload.ForeignStructuredUploadConfig;

			/**
			 * Get the configuration for the form and filepage from the foreign wiki, if any, and use it for
			 * this upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload-method-loadConfig
			 * @return {jQuery.Promise} Promise returning config object
			 */
			loadConfig(): JQuery.Promise<ForeignStructuredUpload.ForeignStructuredUploadConfig>;

			/**
			 * Add categories to the upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload-method-addCategories
			 * @param {string[]} categories Array of categories to which this upload will be added.
			 */
			addCategories( categories: string[] ): void;

			/**
			 * Empty the list of categories for the upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload-method-clearCategories
			 */
			clearCategories(): void;

			/**
			 * Add a description to the upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload-method-addDescription
			 * @param {string} language The language code for the description's language. Must have a template on the target wiki to work properly.
			 * @param {string} description The description of the file.
			 */
			addDescription( language: string, description: string ): void;

			/**
			 * Empty the list of descriptions for the upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload-method-clearDescriptions
			 */
			clearDescriptions(): void;

			/**
			 * Set the date of creation for the upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload-method-setDate
			 * @param {Date} date
			 */
			setDate( date: Date ): void;

			/**
			 * Get the text of the file page, to be created on upload. Brings together
			 * several different pieces of information to create useful text.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload-method-getText
			 * @return {string}
			 */
			getText(): string;

			/**
			 * Gets the wikitext for the creation date of this upload.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload-method-getDate
			 * @return {string}
			 */
			protected getDate(): string;

			/**
			 * Fetches the wikitext for any descriptions that have been added
			 * to the upload.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload-method-getDescriptions
			 * @return {string}
			 */
			protected getDescriptions(): string;

			/**
			 * Fetches the wikitext for the categories to which the upload will
			 * be added.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload-method-getCategories
			 * @return {string}
			 */
			protected getCategories(): string;

			/**
			 * Gets the wikitext for the license of the upload.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload-method-getLicense
			 * @return {string}
			 */
			protected getLicense(): string;

			/**
			 * Get the source. This should be some sort of localised text for "Own work".
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload-method-getSource
			 * @return {string}
			 */
			protected getSource(): string;

			/**
			 * Get the username.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.ForeignStructuredUpload-method-getUser
			 * @return {string}
			 */
			protected getUser(): string;
		}
	}
}

export {};
