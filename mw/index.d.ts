export declare namespace MediaWikiInternal {}

export declare namespace MediaWiki {
	interface Config {
		debug: boolean;
		skin: string;
		stylepath: string;
		wgArticlePath: string;
		wgCaseSensitiveNamespaces: string[];
		wgContentLanguage: string;
		wgContentNamespaces: number[];
		wgDBname: string;
		wgEnableAPI: boolean;
		wgEnableWriteAPI: boolean;
		wgExtensionAssetsPath: string;
		wgFormattedNamespaces: Record<number, string>;
		wgNamespaceIds: Record<string, number>;
		wgScript: string;
		wgScriptPath: string;
		wgServer: string;
		wgSiteName: string;
		wgVariantArticlePath: string | false;
		wgVersion: string;
		wgAction: string;
		wgArticleId: number;
		wgCanonicalNamespace: string;
		wgCanonicalSpecialPageName: string | false;
		wgCategories: string[];
		wgCurRevisionId: number;
		wgIsArticle: boolean;
		wgIsProbablyEditable: boolean;
		wgNamespaceNumber: number;
		wgPageContentLanguage: string;
		wgPageContentModel: string;
		wgPageName: string;
		wgRedirectedFrom: string;
		wgRelevantPageName: string;
		wgRelevantUserName: string;
		wgRelevantPageIsProbablyEditable: boolean;
		wgRestrictionEdit: string[];
		wgRestrictionMove: string[];
		wgRevisionId: number;
		wgSearchType: string;
		wgTitle: string;
		wgUserEditCount: number;
		wgUserGroups: string[];
		wgUserId: number;
		wgUserLanguage: string;
		wgUserName: string;
		wgUserRegistration: number;
		wgIsMainPage: boolean;
		wgUserVariant: string;
		wgPostEdit: string;
		wgDiffOldId: number | false;
		wgDiffNewId: number;
		wgWikibaseItemId: string;
	}
}

/**
 * Base library for MediaWiki.
 * Exposed globally as `mw`, with `mediaWiki` as alias.
 *
 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface MediaWiki { }

declare global {
	/**
	 * Base library for MediaWiki.
	 * Exposed globally as `mw`, with `mediaWiki` as alias.
	 *
	 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw
	 */
	const mw: MediaWiki & typeof MediaWiki;

	/**
	 * Base library for MediaWiki.
	 * Exposed globally as `mw`, with `mediaWiki` as alias.
	 *
	 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw
	 */
	const mediaWiki: MediaWiki & typeof MediaWiki;

	interface Window {
		/**
		 * Base library for MediaWiki.
		 * Exposed globally as `mw`, with `mediaWiki` as alias.
		 *
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw
		 */
		readonly mw: MediaWiki;

		/**
		 * Base library for MediaWiki.
		 * Exposed globally as `mw`, with `mediaWiki` as alias.
		 *
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw
		 */
		readonly mediaWiki: MediaWiki;
	}
}

//!AGS! ------------------- Auto Start: Export Modules --------------------------
//!AGS! Do NOT edit text between auto start and auto end. It is auto generated.
//!AGS! run "pnpm run update-import-modules" to update it.
import './Api';
import './base';
import './cookie';
import './Feedback';
import './ForeignApi';
import './ForeignStructuredUpload';
import './ForeignUpload';
import './hook';
import './inspect';
import './jqueryMsg';
import './language';
import './loader';
import './Message';
import './messagePoster';
import './notification';
import './storage';
import './Title';
import './Upload';
import './Uri';
import './user';
import './util';
import './widget';
//!AGE! SHA256: ce6746f5285579cf1088b1c0da20198e8d3fecb21d89c6bb9dbb2bfbed0624c7
//!AGE! Auto generated end.
//!AGE! -------------------- Auto End: Export Modules ---------------------------
