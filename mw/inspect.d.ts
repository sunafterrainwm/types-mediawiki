declare module '@sunafterrainwm/types-mediawiki/mw' {
	namespace MediaWiki {
		namespace inspect {
			/**
			 * @private
			 * @class mw.inspect.reports
			 * @singleton
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect.reports
			 */
			interface Reports {
				/**
				 * Generate a breakdown of all loaded modules and their size in
				 * kibibytes. Modules are ordered from largest to smallest.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect.reports-method-size
				 * @return {Object[]} Size reports
				 */
				size(): {
					name: string;
					size: string;
					sizeInBytes: number;
				}[];

				/**
				 * For each module with styles, count the number of selectors, and
				 * count how many match against some element currently in the DOM.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect.reports-method-css
				 * @return {Object[]} CSS reports
				 */
				css(): {
					name: string;
					allSelectors: number;
					matchedSelectors: number;
					percentMatched: string;
				}[];

				/**
				 * Report stats on mw.loader.store: the number of localStorage
				 * cache hits and misses, the number of items purged from the
				 * cache, and the total size of the module blob in localStorage.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect.reports-method-store
				 * @return {Object[]} Store stats
				 */
				store(): [ {
					enabled: boolean;
					stats?: loader.Store[ 'stats' ];
					totalSizeInBytes?: number;
					totalSize?: string;
				} ];

				/**
				 * Generate a breakdown of all loaded modules and their time
				 * spent during initialisation (measured in milliseconds).
				 *
				 * This timing data is collected by mw.loader.profiler.
				 *
				 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect.reports-method-time
				 * @return {Object[]} Table rows
				 */
				time(): {
					totalInMs: number;
					total: string;
				}[];
			}

			type reports = keyof Reports;
		}

		/**
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-inspect
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect
		 */
		interface Inspect {
			( ...reports: inspect.reports[] ): void;

			/**
			 * Return a map of all dependency relationships between loaded modules.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect-method-getDependencyGraph
			 * @return {Object} Maps module names to objects. Each sub-object has
			 *  two properties, 'requires' and 'requiredBy'.
			 */
			getDependencyGraph(): Record<string, {
				requiredBy: string[];
				requires: string[];
			}>;

			/**
			 * Calculate the byte size of a ResourceLoader module.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect-method-getModuleSize
			 * @param {string} moduleName The name of the module
			 * @return {number|null} Module size in bytes or null
			 */
			getModuleSize( moduleName: string ): number | null;

			/**
			 * Given CSS source, count both the total number of selectors it
			 * contains and the number which match some element in the current
			 * document.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect-method-auditSelectors
			 * @param {string} css CSS source
			 * @return {Object} Selector counts
			 * @return {number} return.selectors Total number of selectors
			 * @return {number} return.matched Number of matched selectors
			 */
			auditSelectors( css: string ): {
				selectors: number;
				matched: string;
			};

			/**
			 * Get a list of all loaded ResourceLoader modules.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect-method-getLoadedModules
			 * @return {Array} List of module names
			 */
			getLoadedModules(): string[];

			/**
			 * Print tabular data to the console, using console.table, console.log,
			 * or mw.log (in declining order of preference).
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect-method-dumpTable
			 * @param {Array} data Tabular data represented as an array of objects
			 *  with common properties.
			 */
			dumpTable( data: Parameters<Console[ 'table' ]>[ 0 ] ): void;

			/**
			 * Generate and print reports.
			 *
			 * When invoked without arguments, prints all available reports.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect-method-runReports
			 * @param {...string} [reports] One or more of "size", "css", "store", or "time".
			 */
			runReports( ...reports: inspect.reports[] ): void;

			/**
			 * Perform a string search across the JavaScript and CSS source code
			 * of all loaded modules and return an array of the names of the
			 * modules that matched.
			 *
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect-method-grep
			 * @param {string|RegExp} pattern String or regexp to match.
			 * @return {Array} Array of the names of modules that matched.
			 */
			grep( pattern: string | RegExp ): string[];

			/**
			 * @private
			 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect.reports
			 */
			readonly reports: inspect.Reports;
		}
	}

	interface MediaWiki {
		/**
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-inspect
		 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.inspect
		 */
		readonly inspect: MediaWiki.Inspect;
	}
}

export {};
