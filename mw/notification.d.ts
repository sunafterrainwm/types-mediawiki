declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWikiInternal {
		interface NotificationConfig {
			tag?: string;
			type?: string;
			title?: string;
			id?: string;
			classes?: string;
			autoHide?: boolean;
			autoHideSeconds?: keyof MediaWiki.Notification[ 'autoHideSeconds' ];
		}

		/**
		 * A Notification object for 1 message.
		 *
		 * The underscore in the name is to avoid a bug <https://github.com/senchalabs/jsduck/issues/304>.
		 * It is not part of the actual class name.
		 *
		 * The constructor is not publicly accessible; use mw.notification#notify instead.
		 * This does not insert anything into the document (see #start).
		 *
		 * @class MediaWikiInternal.Notification
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_
		 * @constructor
		 * @private
		 * @param {mw.Message|jQuery|HTMLElement|string} message
		 * @param {Object} options
		 */
		class Notification {
			constructor( message: MediaWiki.Message | JQuery | HTMLElement | string, options?: NotificationConfig );

			/**
			 * Start the notification. Called automatically by mw.notification#notify
			 * (possibly asynchronously on document-ready).
			 *
			 * This inserts the notification into the page, closes any matching tagged notifications,
			 * handles the fadeIn animations and replacement transitions, and starts autoHide timers.
			 *
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_-method-start
			 */
			protected start(): void;

			/**
			 * Pause any running auto-hide timer for this notification
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_-method-pause
			 */
			pause(): void;

			/**
			 * Start autoHide timer if not already started.
			 * Does nothing if autoHide is disabled.
			 * Either to resume from pause or to make the first start.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_-method-resume
			 */
			resume(): void;

			/**
			 * Close the notification.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_-method-close
			 */
			close(): void;
		}
	}

	namespace MediaWiki {
		/**
		 * Fallback only, use `MediaWikiInternal.Notification` instead.
		 *
		 * @class mw.Notification_
		 * @private
		 * @see MediaWikiInternal.Notification
		 */
		type Notification_ = MediaWikiInternal.Notification;

		/**
		 * @see MediaWikiInternal.NotificationConfig
		 */
		type NotificationConfig = MediaWikiInternal.NotificationConfig;

		/**
		 * @class mw.notification
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification
		 * @singleton
		 */
		interface Notification {
			/**
			 * Pause auto-hide timers for all notifications.
			 * Notifications will not auto-hide until resume is called.
			 *
			 * @see MediaWikiInternal.Notification#pause
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification-method-pause
			 */
			pause(): void;

			/**
			 * Resume any paused auto-hide timers from the beginning.
			 * Only the first #autoHideLimit timers will be resumed.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification-method-resume
			 */
			resume(): void;

			/**
			 * Display a notification message to the user.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification-method-notify
			 * @param {HTMLElement|HTMLElement[]|jQuery|mw.Message|string} message
			 * @param {Object} [options] The options to use for the notification.
			 *  See #defaults for details.
			 * @return {mw.Notification} Notification object
			 */
			notify( ...args: ConstructorParameters<typeof MediaWikiInternal.Notification> ): MediaWikiInternal.Notification;

			/**
			 * @property {Object}
			 * The defaults for #notify options parameter.
			 *
			 * - autoHide:
			 *   A boolean indicating whether the notification should automatically
			 *   be hidden after shown. Or if it should persist.
			 *
			 * - autoHideSeconds:
			 *   Key to #autoHideSeconds for number of seconds for timeout of auto-hide
			 *   notifications.
			 *
			 * - tag:
			 *   An optional string. When a notification is tagged only one message
			 *   with that tag will be displayed. Trying to display a new notification
			 *   with the same tag as one already being displayed will cause the other
			 *   notification to be closed and this new notification to open up inside
			 *   the same place as the previous notification.
			 *
			 * - title:
			 *   An optional title for the notification. Will be displayed above the
			 *   content. Usually in bold.
			 *
			 * - type:
			 *   An optional string for the type of the message used for styling:
			 *   Examples: 'info', 'warn', 'error', 'success'.
			 *
			 * - visibleTimeout:
			 *   A boolean indicating if the autoHide timeout should be based on
			 *   time the page was visible to user. Or if it should use wall clock time.
			 *
			 * - id:
			 *   HTML ID to set on the notification element.
			 *
			 * - classes:
			 *   CSS class names in the form of a single string or
			 *   array of strings, to be set on the notification element.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification-property-defaults
			 */
			defaults: MediaWikiInternal.NotificationConfig;

			/**
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification-property-autoHideSeconds
			 * @property {Object}
			 */
			autoHideSeconds: Record<'short' | 'long', number>;

			/**
			 * Maximum number of simultaneous notifications to start auto-hide timers for.
			 * Only this number of notifications being displayed will be auto-hidden at one time.
			 * Any additional notifications in the list will only start counting their timeout for
			 * auto-hiding after the previous messages have been closed.
			 *
			 * This basically represents the minimal number of notifications the user should
			 * be able to process during the {@link defaults default} #autoHideSeconds time.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification-property-autoHideLimit
			 * @property {number}
			 */
			autoHideLimit: number;
		}
	}

	interface MediaWiki {
		/**
		 * @see mw.notification.notify
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-notify
		 */
		notify( ...args: Parameters<MediaWiki.Notification[ 'notify' ]> ): JQuery.Promise<MediaWikiInternal.Notification>;

		/**
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification
		 */
		readonly notification: MediaWiki.Notification;
	}
}

export {};
