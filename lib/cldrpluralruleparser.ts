// Type definitions for cldrpluralruleparser 1.4.0
// Project: https://github.com/santhoshtr/CLDRPluralRuleParser
// Definitions by: sunafterrainwm <https://github.com/sunafterrainwm>
// Definitions: https://github.com/sunafterrainwm/types-mediawiki/blob/master/lib/cldrpluralruleparser.ts
// TypeScript Version: 3.3

/**
 * Evaluates a plural rule in CLDR syntax for a number
 *
 * @param {string} rule
 * @param {number} number a integer
 * @return {boolean} true if evaluation passed, false if evaluation failed.
 *
 * Syntax: see http://unicode.org/reports/tr35/#Language_Plural_Rules
 *
 * - condition     = and_condition ('or' and_condition)*
 *       ('@integer' samples)?
 *       ('@decimal' samples)?
 * - and_condition = relation ('and' relation)*
 * - relation      = is_relation | in_relation | within_relation
 * - is_relation   = expr 'is' ('not')? value
 * - in_relation   = expr (('not')? 'in' | '=' | '!=') range_list
 * - within_relation = expr ('not')? 'within' range_list
 * - expr          = operand (('mod' | '%') value)?
 * - operand       = 'n' | 'i' | 'f' | 't' | 'v' | 'w'
 * - range_list    = (range | value) (',' range_list)*
 * - value         = digit+
 * - digit         = 0|1|2|3|4|5|6|7|8|9
 * - range         = value'..'value
 * - samples       = sampleRange (',' sampleRange)* (',' ('…'|'...'))?
 * - sampleRange   = decimalValue '~' decimalValue
 * - decimalValue  = value ('.' value)?
 */
declare function parser( rule: string, number: number ): boolean;

declare global {
	const pluralRuleParser: typeof parser;
}

export = parser;
