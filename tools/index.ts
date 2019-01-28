/*
  index.ts: base file for lexical model compiles
*/

/// <reference path="lexical-model.ts" />

import * as ts from "typescript";
import KmpCompiler from "./kmp-compiler";

let fs = require('fs');
let path = require('path');

export default class LexicalModelCompiler {
  compile(o: LexicalModelSource) {
    // TODO: refactor into phases of build (use multiple source files for clarity)
    // Validate fields provided by the model.ts file
    //todo: assert id format
    //todo: assert presence of source files

    // Add any additional fields required for compiled version
    
    // Import data files and transform
    
    // Emit the object as Javascript, to file

    let model_info_file = fs.readdirSync('../').find(function(f) { return f.match(/\.model_info$/)});
    if(!model_info_file) {
      this.logError('Unable to find .model_info file in parent folder');
      return false;
    }
    
    let model_info = JSON.parse(fs.readFileSync('../'+model_info_file, 'utf8'));

    const kpsFileName = '../source/'+model_info.id+'.model.kps';
    const kmpFileName = model_info.id+'.model.kmp';
    const modelFileName = model_info.id+'.model.js';
    
    //
    // Build the compiled lexical model
    //
    
    let sources: string[] = o.sources.map(function(source) { 
      return fs.readFileSync(path.join('../source', source), 'utf8'); 
    });

    let oc: LexicalModelCompiled = {id:model_info.id, format:o.format, wordBreaking:o.wordBreaking};

    // Todo: add metadata in comment
    const filePrefix: string = `(function() {\n'use strict';\n`;
    const funcPrefix: string = `com.keyman.lexicalModel.register(`;
    const funcSuffix: string = `);`;
    const fileSuffix: string = `})();`;
    let func = filePrefix;

    //
    // Emit the model as code and data
    //

    // TODO: support functions within the LexicalModel object, so essentially
    // copy the polyfill for JSON.stringify and add function support

    switch(o.format) {
      case "custom-1.0":
        func += funcPrefix + JSON.stringify(oc) + funcSuffix + this.transpileSources(sources).join('');
        break;
      case "fst-foma-1.0":
        (oc as LexicalModelCompiledFst).fst = Buffer.from(sources.join('')).toString('base64');
        this.logError('Unimplemented model format '+o.format);
        return false;
      case "trie-1.0":
        // TODO: compile the trie
        (oc as LexicalModelCompiledTrie).trie = sources.join(' ');
        func += funcPrefix + JSON.stringify(oc) + funcSuffix;
        break;
      default:
        this.logError('Unknown model format '+o.format);
        return false;
    }

    //
    // Add custom wordbreak source files
    //

    if(o.wordBreaking && o.wordBreaking.sources) {
      let wordBreakingSources: string[] = o.wordBreaking.sources.map(function(source) { 
        return fs.readFileSync(path.join('../source', source), 'utf8'); 
      });

      let wordBreakingSource = this.transpileSources(wordBreakingSources).join('');

      func += wordBreakingSource;

      delete oc.wordBreaking.sources;
    }

    func += fileSuffix;
    let p = func;
    
    // Save full model to build folder as Javascript for use in KeymanWeb
    
    fs.writeFileSync(modelFileName, p);

    // TODO: update package.json schema at api.keyman.com/schemas to cater for additional fields.

    //
    // Create KMP file
    //

    let kpsString = fs.readFileSync(kpsFileName);
    let kmpCompiler = new KmpCompiler();
    let kmpJsonData = kmpCompiler.transformKpsToKmpObject(model_info.id, kpsString);
    kmpCompiler.buildKmpFile(kmpJsonData, kmpFileName);

    //
    // Build merged .model_info file
    //

    // TODO: Create complete .model_info from source .model_info
    

  };

  transpileSources(sources: Array<string>): Array<string> {
    return sources.map((source) => ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.None }
      }).outputText
    );
  };

  logError(s) {
    console.error(s);
  };
};