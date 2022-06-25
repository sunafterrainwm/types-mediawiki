declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface Widgets {
			// Because OOjs-ui didn't have type defined, so this is still nothing.
		}
	}

	interface MediaWiki {
		/**
		 * OOUI widgets specific to MediaWiki.
		 *
		 * Because OOjs-ui didn't have type defined, so this is like unknown.
		 *
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.widgets
		 * @property {Object}
		 */
		readonly widgets: MediaWiki.Widgets;
	}
}

export {};
