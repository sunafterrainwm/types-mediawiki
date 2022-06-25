import './Api';

declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		namespace Upload {
			/**
			 * @enum mw.Upload.State
			 * State of uploads represented in simple terms.
			 */
			const enum State {
				/** Upload not yet started */
				NEW,

				/** Upload finished, but there was a warning */
				WARNING,

				/** Upload finished, but there was an error */
				ERROR,

				/** Upload in progress */
				UPLOADING,

				/** Upload finished, but not published, call #finishStashUpload */
				STASHED,

				/** Upload finished and published */
				UPLOADED
			}

			interface ImageInfo {
				timestamp: string;
				user: string;
				userid: number;
				size: number;
				width: number;
				height: number;
				parsedcomment: string;
				comment: string;
				html: string;
				canonicaltitle: string;
				url: string;
				descriptionurl: string;
				sha1: string;
				metadata: {
					name: string;
					value: unknown;
				}[];
				commonmetadata: {
					name: string;
					value: unknown;
				}[];
				extmetadata: Record<string, {
					value: unknown;
					source: string;
					hidden?: string;
				}>;
				mime: string;
				mediatype: string;
				bitdepth: number;
			}
		}

		/**
		 * Used to represent an upload in progress on the frontend.
		 * Most of the functionality is implemented in mw.Api.plugin.upload,
		 * but this model class will tie it together as well as let you perform
		 * actions in a logical way.
		 *
		 * A simple example:
		 *
		 * @example
		 * ```
		 * var file = new OO.ui.SelectFileWidget(),
		 *     button = new OO.ui.ButtonWidget( { label: 'Save' } ),
		 *     upload = new mw.Upload;
		 *
		 * button.on( 'click', function () {
		 *     upload.setFile( file.getValue() );
		 *     upload.setFilename( file.getValue().name );
		 *     upload.upload();
		 * } );
		 *
		 * $( document.body ).append( file.$element, button.$element );
		 * ```
		 *
		 * You can also choose to {@link uploadToStash stash the upload} and
		 * {@link finishStashUpload finalize} it later:
		 *
		 * @example
		 * ```
		 * var file, // Some file object
		 *     upload = new mw.Upload,
		 *     stashPromise = $.Deferred();
		 *
		 * upload.setFile( file );
		 * upload.uploadToStash().then( function () {
		 *     stashPromise.resolve();
		 * } );
		 *
		 * stashPromise.then( function () {
		 *     upload.setFilename( 'foo' );
		 *     upload.setText( 'bar' );
		 *     upload.finishStashUpload().then( function () {
		 *         console.log( 'Done!' );
		 *     } );
		 * } );
		 * ```
		 *
		 * @class mw.Upload
		 *
		 * @constructor
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload
		 * @param {Object|mw.Api} [apiconfig] A mw.Api object (or subclass), or configuration
		 *     to pass to the constructor of mw.Api.
		 */
		class Upload {
			protected api: Api;

			protected watchlist: boolean;
			protected text: string;
			protected comment: string;
			protected filename: string | null;
			protected file: null;
			protected imageinfo: Upload.ImageInfo | undefined;
			protected state: null | MediaWiki.Upload.State;
			protected stateDetails: unknown;

			constructor( apiconfig: Api.ApiOptions | Api );

			/**
			 * Get the mw.Api instance used by this Upload object.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-getApi
			 * @return {jQuery.Promise}
			 * @return {Function} return.done
			 * @return {mw.Api} return.done.api
			 */
			getApi(): JQuery.Promise<Api>;

			/**
			 * Set the text of the file page, to be created on file upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-setText
			 * @param {string} text
			 */
			setText( text: string ): void;

			/**
			 * Set the filename, to be finalized on upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-setFilename
			 * @param {string} filename
			 */
			setFilename( filename: string ): void;

			/**
			 * Set the stashed file to finish uploading.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-setFilekey
			 * @param {string} filekey
			 */
			setFilekey( filekey: string ): void;

			/**
			 * Sets the filename based on the filename as it was on the upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-setFilenameFromFile
			 */
			setFilenameFromFile(): void;

			/**
			 * Set the file to be uploaded.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-setFile
			 * @param {HTMLInputElement|File|Blob} file
			 */
			setFile( file: HTMLInputElement|File|Blob ): void;

			/**
			 * Set whether the file should be watchlisted after upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-setWatchlist
			 * @param {boolean} watchlist
			 */
			setWatchlist( watchlist: boolean ): void;

			/**
			 * Set the edit comment for the upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-setComment
			 * @param {string} comment
			 */
			setComment( comment: string ): void;

			/**
			 * Get the text of the file page, to be created on file upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-getText
			 * @return {string}
			 */
			getText(): string;

			/**
			 * Get the filename, to be finalized on upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-getFilename
			 * @return {string}
			 */
			getFilename(): string;

			/**
			 * Get the file being uploaded.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-getFile
			 * @return {HTMLInputElement|File|Blob}
			 */
			getFile(): HTMLInputElement|File|Blob;

			/**
			 * Get the boolean for whether the file will be watchlisted after upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-getWatchlist
			 * @return {boolean}
			 */
			getWatchlist(): boolean;

			/**
			 * Get the current value of the edit comment for the upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-getComment
			 * @return {string}
			 */
			getComment(): string;

			/**
			 * Gets the base filename from a path name.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-getBasename
			 * @param {string} path
			 * @return {string}
			 */
			getBasename( path:string ): string;

			/**
			 * Sets the state and state details (if any) of the upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-setState
			 * @param {mw.Upload.State} state
			 * @param {Object} stateDetails
			 */
			setState( state: MediaWiki.Upload.State, stateDetails?: unknown ): void;

			/**
			 * Gets the state of the upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-getState
			 * @return {mw.Upload.State}
			 */
			getState(): MediaWiki.Upload.State;

			/**
			 * Gets details of the current state.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-getStateDetails
			 * @return {string}
			 */
			getStateDetails(): string;

			/**
			 * Get the imageinfo object for the finished upload.
			 * Only available once the upload is finished! Don't try to get it
			 * beforehand.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-getImageInfo
			 * @return {Object|undefined}
			 */
			getImageInfo(): Upload.ImageInfo | undefined;

			/**
			 * Upload the file directly.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-upload
			 * @return {jQuery.Promise}
			 */
			upload(): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Upload the file to the stash to be completed later.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-uploadToStash
			 * @return {jQuery.Promise}
			 */
			uploadToStash(): JQuery.Promise<Api.ApiResponse>;

			/**
			 * Finish a stash upload.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Upload-method-finishStashUpload
			 * @return {jQuery.Promise}
			 */
			finishStashUpload(): JQuery.Promise<Api.ApiResponse>;
		}
	}
}

export {};
