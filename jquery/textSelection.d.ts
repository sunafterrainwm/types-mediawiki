/**
 * from https://github.com/wikimedia-gadgets/types-mediawiki/blob/a87532a3d5ebbd1416f7b12e2ec0173febd1da1b/jquery/textSelection.d.ts
 */

import 'jquery';

declare global {
	interface JQuery {
		// one overload for each command
		textSelection( command: 'getContents' | 'getSelection' ): string;

		textSelection( command: 'setContents' | 'replaceSelection' ): JQuery;

		textSelection(
			command: 'encapsulateSelection',
			commandOptions: {
				pre?: string;
				peri?: string;
				post?: string;
				ownline?: boolean;
				replace?: boolean;
				selectPeri?: boolean;
				splitlines?: boolean;
				selectionStart?: number;
				selectionEnd?: number;
			}
		): JQuery;

		textSelection(
			command: 'getCaretPosition',
			commandOptions?: {
				startAndEnd?: false;
			}
		): number;

		textSelection(
			command: 'getCaretPosition',
			commandOptions: {
				startAndEnd: true;
			}
		): [number, number];

		textSelection(
			command: 'setSelection',
			commandOptions: {
				start?: number;
				end?: number;
			}
		): JQuery;

		textSelection(
			command: 'scrollToCaretPosition',
			commandOptions: {
				force?: boolean;
			}
		): JQuery;
	}
}

export {};
