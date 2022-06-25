[![NPM version](https://img.shields.io/npm/v/@sunafterrainwm/types-mediawiki.svg)](https://www.npmjs.com/package/@sunafterrainwm/types-mediawiki)

# @sunafterrainwm/types-mediawiki

TypeScript definitions for MediaWiki JS interface.

This project is a fork for [wikimedia-gadgets/types-mediawiki](https://github.com/wikimedia-gadgets/types-mediawiki) v1.2.0

This package covers the functions and classes in the `MediaWiki` interface in module `@sunafterrainwm/types-mediawiki/mw` and expose to global variant `mw` and `mediaWiki`, as well a few jQuery plugins used in MediaWiki core. All commonly used parts of the interface are covered but as far as complete coverage is concerned, this is a work in progress.

[![Download stats](https://nodei.co/npm/@sunafterrainwm/types-mediawiki.png?downloads=true&downloadRank=true)](https://nodei.co/npm/@sunafterrainwm/types-mediawiki/)

## Usage

To use types from this package, run

```bash
npm i @sunafterrainwm/types-mediawiki
```

Edit your project's `tsconfig.json` file so that it includes

```
"include": [
	"./node_modules/@sunafterrainwm/types-mediawiki"
]
```

You should be all set! `mw` and `mediaWiki` will be available in the global scope. There is no need to put any import statements in the TypeScript source files. This package includes [@types/jquery](https://www.npmjs.com/package/@types/jquery) as a dependency, so you don't need to install that separately.

**If you find any errors or have suggestions for more specific typings, please open a PR or file an issue.**

### mw.config

Types for mw.config are included:

```ts
let NS = mw.config.get( "wgNamespaceNumber" ); // NS gets type number
let pageName = mw.config.get( "wgPageName" ); // pageName gets type string
```

mw.config entries added by MediaWiki extensions can also be used but their type is not known, so they need to be explicitly cast:

```ts
let namespaces = mw.config.get("pageTriageNamespaces") as number[];
```
(`mw.config.get('pageTriageNamespaces')` gets the type `unknown` without a cast.)

or you can add it by

```ts
declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		interface Config {
			pageTriageNamespaces: number[];
		}
	}
}

let namespaces/**: number[] */ = mw.config.get( "pageTriageNamespaces" );
```


### MediaWiki API parameters

This package also provides typings for API request parameters for the [MediaWiki Action API](https://www.mediawiki.org/wiki/API:Main_page). API endpoints defined in MediaWiki core and by a number of common extensions (the ones enabled on English Wikipedia) are covered. These aren't exported to the global scope, however. For usage, you need to import them. For example:

```ts
import type { ApiEditPageParams, ApiParseParams } from "@sunafterrainwm/types-mediawiki/api_params";
```

Since it is just a type import, it doesn't generate any JavaScript. Hence, such imports can also be used in non-modular applications.

---

TODO:

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
