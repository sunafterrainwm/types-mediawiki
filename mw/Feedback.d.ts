declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		namespace Feedback {
			/**
			 * mw.Feedback Dialog
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback.Dialog
			 * @class
			 */
			class Dialog /* extends OO.ui.ProcessDialog */ {
				protected status: string;

				protected feedbackPageTitle: string;

				/**
				 * Validate the feedback form
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback.Dialog-method-validateFeedbackForm
				 */
				validateFeedbackForm(): void;

				/**
				 * Returns an error message for the current status.
				 *
				 * @private
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback.Dialog-method-getErrorMessage
				 * @return {OO.ui.Error}
				 */
				protected getErrorMessage()/* :OO.ui.Error */: {
					message: string | JQuery;
					recoverable: boolean;
					warning: boolean;
				};

				/**
				 * Posts the message
				 *
				 * @private
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback.Dialog-method-postMessage
				 * @param {mw.messagePoster.MessagePoster} poster Poster implementation used to leave feedback
				 * @param {string} subject Subject of message
				 * @param {string} message Body of message
				 * @return {jQuery.Promise} Promise representing success of message posting action
				 */
				protected postMessage( poster: MediaWiki.messagePoster.MessagePoster, subject: string, message: string ): Promise<Api.ApiResponse>;

				/**
				 * Set the bug report link
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback.Dialog-method-setBugReportLink
				 * @param {string} link Link to the external bug report form
				 */
				setBugReportLink( link: string ): void;

				/**
				 * Get the bug report link
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback.Dialog-method-getBugReportLink
				 * @return {string} Link to the external bug report form
				 */
				getBugReportLink(): string;
			}

			interface FeedbackConfig {
			/**
			 * The title of the page where you collect feedback.
			 *
			 * @default "Feedback"
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback-cfg-title
			 */
				title?: MediaWiki.Title;

				/**
				 * api.php URL if the feedback page is on another wiki
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback-cfg-apiUrl
				 */
				apiUrl?: string;

				/**
				 * Message key for the title of the dialog box
				 *
				 * @default "feedback-dialog-title"
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback-cfg-dialogTitleMessageKey
				 */
				dialogTitleMessageKey?: string;

				/**
				 * URL where bugs can be posted
				 *
				 * @default "//phabricator.wikimedia.org/maniphest/task/edit/form/1/"
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback-cfg-bugsLink
				 */
				bugsLink?: MediaWiki.Uri | string;

				/**
				 * URL where bugs can be listed
				 *
				 * @default "//phabricator.wikimedia.org/maniphest/query/advanced"
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback-cfg-bugsListLink
				 */
				bugsListLink?: MediaWiki.Uri | string;

				/**
				 * Show a Useragent agreement checkbox as part of the form.
				 *
				 * @default false
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback-cfg-showUseragentCheckbox
				 */
				showUseragentCheckbox?: boolean;

				/**
				 * Make the Useragent checkbox mandatory.
				 *
				 * @default false
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback-cfg-useragentCheckboxMandatory
				 */
				useragentCheckboxMandatory?: boolean;

				/**
				 * Supply a custom message for the useragent checkbox. defaults to the message 'feedback-terms'.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback-cfg-useragentCheckboxMessage
				 */
				useragentCheckboxMessage?: string | JQuery;
			}
		}

		/**
		 * This is a way of getting simple feedback from users. It's useful
		 * for testing new features -- users can give you feedback without
		 * the difficulty of opening a whole new talk page. For this reason,
		 * it also tends to collect a wider range of both positive and negative
		 * comments. However you do need to tend to the feedback page. It will
		 * get long relatively quickly, and you often get multiple messages
		 * reporting the same issue.
		 *
		 * It takes the form of thing on your page which, when clicked, opens a small
		 * dialog box. Submitting that dialog box appends its contents to a
		 * wiki page that you specify, as a new section.
		 *
		 * This feature works with any content model that defines a
		 * `mw.messagePoster.MessagePoster`.
		 *
		 * @example
		 * ```
		 * var feedback = new mw.Feedback();
		 * $( '#myButton' ).click( function () { feedback.launch(); } );
		 * ```
		 *
		 * You can also launch the feedback form with a prefilled subject and body.
		 * See the docs for the #launch() method.
		 *
		 * @class
		 * @constructor
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Feedback
		 * @param {Object} [config] Configuration object
		 * @cfg {mw.Title} [title="Feedback"] The title of the page where you collect
		 *  feedback.
		 * @cfg {string} [apiUrl] api.php URL if the feedback page is on another wiki
		 * @cfg {string} [dialogTitleMessageKey="feedback-dialog-title"] Message key for the
		 *  title of the dialog box
		 * @cfg {mw.Uri|string} [bugsLink="//phabricator.wikimedia.org/maniphest/task/edit/form/1/"] URL where
		 *  bugs can be posted
		 * @cfg {mw.Uri|string} [bugsListLink="//phabricator.wikimedia.org/maniphest/query/advanced"] URL
		 *  where bugs can be listed
		 * @cfg {boolean} [showUseragentCheckbox=false] Show a Useragent agreement checkbox as part of the form.
		 * @cfg {boolean} [useragentCheckboxMandatory=false] Make the Useragent checkbox mandatory.
		 * @cfg {string|jQuery} [useragentCheckboxMessage] Supply a custom message for the useragent checkbox.
		 *  defaults to the message 'feedback-terms'.
		 */
		class Feedback {
			constructor( config?: Feedback.FeedbackConfig );

			dialogTitleMessageKey?: string;

			feedbackPageTitle?: MediaWiki.Title;

			messagePosterPromise: MediaWiki.messagePoster.MessagePoster;

			foreignApi: MediaWiki.ForeignApi | null;

			bugsTaskSubmissionLink: string;

			bugsTaskListLink: string;

			useragentCheckboxShow: boolean;

			useragentCheckboxMandatory: boolean;

			useragentCheckboxMessage: JQuery;

			thankYouDialog: unknown; // OO.ui

			/**
			 * Respond to dialog submit event. If the information was
			 * submitted successfully, open a MessageDialog to thank the user.
			 *
			 * @param {string} status A status of the end of operation
			 *  of the main feedback dialog. Empty if the dialog was
			 *  dismissed with no action or the user followed the button
			 *  to the external task reporting site.
			 * @param {string} feedbackPageName
			 * @param {string} feedbackPageUrl
			 */
			onDialogSubmit( status: string, feedbackPageName: string, feedbackPageUrl: string ): void;

			/**
			 * Modify the display form, and then open it, focusing interface on the subject.
			 *
			 * @param {Object} [contents] Prefilled contents for the feedback form.
			 * @param {string} [contents.subject] The subject of the feedback, as plaintext
			 * @param {string} [contents.message] The content of the feedback, as wikitext
			 */
			launch( contents?: {
				subject?: string;
				message?: string;
			} ): void;
		}
	}
}

export {};
