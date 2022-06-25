#!/usr/bin/env node
// @ts-check
import crypto from 'crypto';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.join( fileURLToPath( import.meta.url ), '..' );
const rootDir = path.join( __dirname, '..', 'mw' );
const exportPath = path.join( rootDir, 'index.d.ts' );
const skipName = [ 'index.d.ts' ];

let importNames = fs.readdirSync( rootDir )
	.map( function ( name ) {
		return {
			origName: name,
			importName: name.replace( /(\.d)?\.ts$/, '' )
		};
	} )
	.filter( function ( { origName } ) {
		return !skipName.includes( origName );
	} )
	.map( function ( { importName } ) {
		return importName;
	} );

importNames = [ ...new Set( importNames ) ]
	.sort( function ( a, b ) {
		return +( a.toLowerCase() > b.toLowerCase() );
	} );

console.log( 'Auto generate import modules: %s', importNames.join( ', ' ) );

const code = importNames
	.map( function ( name ) {
		return `import './${name}';`;
	} )
	.join( '\n' ) + '\n';

// Thanks auto-generate@0.0.8
// from https://github.com/ozum/auto-generate/blob/3a4b3b1ec43a1db40672763022b510dc8465fdfe/lib/auto-generate.js

const signature = '//!AG';

const warning = {
	start: signature + 'S! Do NOT edit text between auto start and auto end. It is auto generated.\n' +
		signature + 'S! run "pnpm run update-import-modules" to update it.\n',
	sha256: _.template( signature + 'E! SHA256: <%= sha256 %>\n' ),
	end: signature + 'E! Auto generated end.\n'
};

function getStartLine( /** @type {string} */ name ) {
	const pre = new Array( Math.floor( ( 60 - name.length ) / 2 ) - 3 ).join( '-' );
	const post = new Array( 60 - pre.length - name.length ).join( '-' );
	return signature + 'S! ' + pre + ' Auto Start: ' + name + ' ' + post + '\n';
}

function getEndLine( /** @type {string} */ name ) {
	const pre = new Array( Math.floor( ( 62 - name.length ) / 2 ) - 3 ).join( '-' );
	const post = new Array( 62 - pre.length - name.length ).join( '-' );
	return signature + 'E! ' + pre + ' Auto End: ' + name + ' ' + post + '\n';
}

function getRexExp( /** @type {string} */ name ) {
	// $1: Start Line, $2: Start Warning Line, $3: Content, $4: SHA256 Line, $5: End Warning Line, $6: End Line
	// eslint-disable-next-line max-len
	const reAuto = _.template( '(<%= startLine %>)(<%= startWarningLine %>)((?:.|\n|\r)*?)(<%= sha256Line %>)(<%= endWarningLine %>)(<%= endLine %>?)' );
	const reString = reAuto( {
		startLine: getStartLine( name ),
		startWarningLine: warning.start,
		sha256Line: warning.sha256( { sha256: '([a-f0-9]{64})' } ),
		endWarningLine: warning.end,
		endLine: getEndLine( name )
	} );
	return new RegExp( reString, 'mi' );
}

function makeAGPart( /** @type {string} */ name, /** @type {string} */ agCode ) {
	let part = getStartLine( name );
	part += warning.start;
	part += agCode || '';
	part += warning.sha256( {
		sha256: crypto.createHash( 'sha256' ).update( agCode ).digest( 'hex' )
	} );
	part += warning.end;
	part += getEndLine( name );
	return part;
}

let content = fs.readFileSync( exportPath, {
	encoding: 'utf-8'
} );

const agName = 'Export Modules';
const agReg = getRexExp( agName );
const agPart = makeAGPart( agName, code );

if ( content.match( agReg ) ) {
	content = content.replace( agReg, agPart );
} else {
	content += '\n' + agPart;
}

fs.writeFileSync( exportPath, content );
