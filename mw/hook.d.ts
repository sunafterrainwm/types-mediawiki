declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		namespace Hook {
			interface EventsCallBack {
				/**
				 * Fired after an edit was successfully saved.
				 *
				 * Does not fire for null edits.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook-event-postEdit
				 *
				 * @param data.message Message that listeners should use when displaying notifications.
				 * String for plain text, use array or jQuery object to pass actual nodes.
				 * @param data.user User that made the edit.
				 * @param data.tempUserCreated Whether a temporary user account was created. since 1.38
				 */
				'postEdit': ( data: {
					message: string |JQuery | unknown[];
					user: string | User;
					/**
					 * @since 1.38
					 */
					tempUserCreated?: boolean;
				} ) => void;

				/**
				 * After the listener for #postEdit removes the notification.
				 *
				 * @deprecated since 1.38
				 * @see MediaWiki.Hook.EventsCallBack#postEdit
				 */
				'postEdit.afterRemoval': () => void;

				/**
				 * Fired when initialization of the filtering interface for changes list is complete.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook-event-structuredChangeFilters_ui_initialized
				 */
				'structuredChangeFilters.ui.initialized': () => void;

				/**
				 * Fired when categories are being added to the DOM
				 *
				 * It is encouraged to fire it before the main DOM is changed (when $content is still detached).
				 * However, this order is not defined either way, so you should only rely on $content itself.
				 *
				 * This includes the ready event on a page load (including post-edit loads)
				 * and when content has been previewed with LivePreview.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook-event-wikipage_categories
				 * @param $content The most appropriate element containing the content, such as .catlinks
				 */
				'wikipage.categories': ( $content: JQuery<HTMLDivElement> ) => void;

				/**
				 * Fired after collapsible content has been initialized
				 *
				 * This gives an option to modify the collapsible behavior.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook-event-wikipage_collapsibleContent
				 * @param $content All the elements that have been made collapsible
				 */
				'wikipage.collapsibleContent': ( $content: JQuery<HTMLDivElement> ) => void;

				/**
				 * Fired when wiki content is being added to the DOM
				 *
				 * It is encouraged to fire it before the main DOM is changed (when $content is still detached).
				 * However, this order is not defined either way, so you should only rely on $content itself.
				 *
				 * This includes the ready event on a page load (including post-edit loads)
				 * and when content has been previewed with LivePreview.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook-event-wikipage_content
				 * @param $content The most appropriate element containing the content,
				 * such as #mw-content-text (regular content root) or #wikiPreview (live preview root)
				 */
				'wikipage.content': ( $content: JQuery<HTMLDivElement> ) => void;

				/**
				 * Fired when the diff is added to a page containing a diff
				 *
				 * Similar to the wikipage.content hook $diff may still be detached when the hook is fired.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook-event-wikipage_diff
				 * @param $diff The root element of the MediaWiki diff (table.diff).
				 */
				'wikipage.diff': ( $diff: JQuery<HTMLTableElement> ) => void;

				/**
				 * Fired when the editform is added to the edit page
				 *
				 * Similar to the wikipage.content hook $editForm can still be detached when this hook is fired.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook-event-wikipage_editform
				 * @param $editForm The most appropriate element containing the editform, usually #editform.
				 */
				'wikipage.editform': ( $editForm: JQuery<HTMLFormElement> ) => void;
			}

			type EventsCallBackForIndex = Record<string, ( data: unknown ) => void> & EventsCallBack;
		}

		/**
		 * Registry and firing of events.
		 *
		 * MediaWiki has various interface components that are extended, enhanced
		 * or manipulated in some other way by extensions, gadgets and even
		 * in core itself.
		 *
		 * This framework helps streamlining the timing of when these other
		 * code paths fire their plugins (instead of using document-ready,
		 * which can and should be limited to firing only once).
		 *
		 * Features like navigating to other wiki pages, previewing an edit
		 * and editing itself – without a refresh – can then retrigger these
		 * hooks accordingly to ensure everything still works as expected.
		 *
		 * @example
		 * ```
		 * mw.hook( 'wikipage.content' ).add( fn ).remove( fn );
		 * mw.hook( 'wikipage.content' ).fire( $content );
		 * ```
		 *
		 * Handlers can be added and fired for arbitrary event names at any time. The same
		 * event can be fired multiple times. The last run of an event is memorized
		 * (similar to `$(document).ready` and `$.Deferred().done`).
		 * This means if an event is fired, and a handler added afterwards, the added
		 * function will be fired right away with the last given event data.
		 *
		 * Like Deferreds and Promises, the mw.hook object is both detachable and chainable.
		 * Thus allowing flexible use and optimal maintainability and authority control.
		 * You can pass around the `add` and/or `fire` method to another piece of code
		 * without it having to know the event name (or `mw.hook` for that matter).
		 *
		 * ```
		 * var h = mw.hook( 'bar.ready' );
		 * new mw.Foo( .. ).fetch( { callback: h.fire } );
		 * ```
		 *
		 * Note: Events are documented with an underscore instead of a dot in the event
		 * name due to jsduck not supporting dots in that position.
		 *
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook
		 */
		interface Hook<E extends string> {
			/**
			 * Register a hook handler
			 *
			 * @param {Function} handler Function to bind.
			 * @chainable
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook-method-add
			 */
			add( ...handler: Hook.EventsCallBackForIndex[E][] ): Hook<E>;

			/**
			 * Run a hook.
			 *
			 * @chainable
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook-method-fire
			 */
			fire( ...args: Parameters<Hook.EventsCallBackForIndex[E]> ): Hook<E>;

			/**
			 * Unregister a hook handler
			 *
			 * @param {...Function} handler Function to unbind.
			 * @chainable
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook-method-remove
			 */
			remove( handler: Hook.EventsCallBackForIndex[E] ): Hook<E>;
		}
	}

	interface MediaWiki {
		/**
		 * Create an instance of mw.hook.
		 *
		 * @method hook
		 * @member mw
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-hook
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook
		 */
		hook<E extends string>( event: E ): MediaWiki.Hook<E>;
	}
}

export {};
