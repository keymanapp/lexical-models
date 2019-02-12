/*
  index.ts: base file for lexical model compiles
*/

/// <reference path="lexical-model.ts" />
/// <reference path="model-info-file.ts" />

import * as ts from "typescript";
import KmpCompiler from "./kmp-compiler";
import * as fs from "fs";
import * as path from "path";

export default class LexicalModelCompiler {
  compile(o: LexicalModelSource) {
    //
    // Load the model info file
    //
    let files = fs.readdirSync('../');
    let model_info_file = files.find((f) => !!f.match(/\.model_info$/));

    //let model_info_file = fs.readdirSync('../').find((f) => !!f.match(/\.model_info$/));
    if(!model_info_file) {
      this.logError('Unable to find .model_info file in parent folder');
      return false;
    }
    
    let model_info: ModelInfoFile = JSON.parse(fs.readFileSync('../'+model_info_file, 'utf8'));

    //
    // Filename expectations
    //
    const kpsFileName = `../source/${model_info.id}.model.kps`;
    const kmpFileName = `${model_info.id}.model.kmp`;
    const modelFileName = `${model_info.id}.model.js`;
    const modelInfoFileName = `${model_info.id}.model_info`;
    const sourcePath = '../source';

    const minKeymanVersion = '12.0';
    
    //
    // Validate the model ID.
    // TODO: the schema does not require the id field, but we are assuming its presence here
    //

    if(!model_info.id.match(/^[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*$/)) {
      this.logError(
        `The model identifier '${model_info.id}' is invalid.\n`+
        `Must be a valid alphanumeric identifier in format (author).(bcp_47).(uniq).\n`+
        `bcp_47 should be underscore (_) separated.`);
      return false;
    }

    //
    // This script is run from folder group/author/bcp47.uniq/build/ folder. We want to
    // verify that author.bcp47.uniq is the same as the model identifier.
    //

    let paths = process.cwd().split(path.sep).reverse();
    if(paths.length < 4 || paths[0] != 'build' || model_info.id != paths[2] + '.' + paths[1]) {
      this.logError(`Unexpected model path ${paths[2]}.${paths[1]}, does not match model id ${model_info.id}`);
      return false;
    }

    // 0 = build
    // 1 = bcp47.uniq
    // 2 = author
    // 3 = group
    let groupPath = paths[3];
    let authorPath = paths[2];
    let bcp47Path = paths[1];

    //
    // Build the compiled lexical model
    //
    
    let sources: string[] = o.sources.map(function(source) { 
      return fs.readFileSync(path.join(sourcePath, source), 'utf8'); 
    });

    let oc: LexicalModelCompiled = {id:model_info.id, format:o.format, wordBreaking:o.wordBreaking};

    // Todo: add metadata in comment
    const filePrefix: string = `(function() {\n'use strict';\n`;
    const funcPrefix: string = `com.keyman.lexicalModel.register(`;
    const funcSuffix: string = `);`;
    const fileSuffix: string = `})();`;
    let func = filePrefix;

    //
    // Load custom wordbreak source files
    //

    let wordBreakingSource;

    if(o.wordBreaking && o.wordBreaking.sources) {
      let wordBreakingSources: string[] = o.wordBreaking.sources.map(function(source) { 
        return fs.readFileSync(path.join(sourcePath, source), 'utf8'); 
      });

      wordBreakingSource = this.transpileSources(wordBreakingSources).join('\n');

      delete oc.wordBreaking.sources;
    }

    //
    // Emit the model as code and data
    //

    switch(o.format) {
      case "custom-1.0":
        func += funcPrefix + JSON.stringify(oc) + funcSuffix + '\n' + this.transpileSources(sources).join('\n');
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

    if(wordBreakingSource) {      
      func += '\n' + wordBreakingSource;
    }

    func += fileSuffix;
    
    // Save full model to build folder as Javascript for use in KeymanWeb
    
    fs.writeFileSync(modelFileName, func);

    //
    // Create KMP file
    //

    let kpsString: string = fs.readFileSync(kpsFileName, 'utf8');
    let kmpCompiler = new KmpCompiler();
    let kmpJsonData = kmpCompiler.transformKpsToKmpObject(model_info.id, kpsString);
    kmpCompiler.buildKmpFile(kmpJsonData, kmpFileName);

    //
    // Build merged .model_info file
    // https://api.keyman.com/schemas/model_info.source.json and
    // https://api.keyman.com/schemas/model_info.distribution.json 
    // https://help.keyman.com/developer/cloud/model_info/1.0
    //

    model_info.name = model_info.name || kmpJsonData.info.name.description;
    model_info.authorName = model_info.authorName || kmpJsonData.info.author.description;
    model_info.authorEmail = model_info.authorEmail || kmpJsonData.info.author.url;
    model_info.languages = model_info.languages || [].concat(kmpJsonData.lexicalModels.map((e) => e.languages.map((f) => f.id)));
    model_info.lastModifiedDate = model_info.lastModifiedDate || (new Date).toUTCString();
    model_info.packageFilename = model_info.packageFilename || kmpFileName;
    model_info.packageFileSize = fs.statSync(model_info.packageFilename).size; // Always overwrite with actual file size
    model_info.jsFilename = model_info.jsFilename || modelFileName;
    model_info.jsFileSize = fs.statSync(model_info.jsFilename).size; // Always overwrite with actual file size
    model_info.packageIncludes = kmpJsonData.files.filter((e) => !!e.name.match(/.[ot]tf$/i)).length ? ['fonts'] : []; // Always overwrite source data
    model_info.version = model_info.version || kmpJsonData.info.version.description;
    model_info.minKeymanVersion = model_info.minKeymanVersion || minKeymanVersion;
    //TODO: model_info.helpLink = model_info.helpLink || ... if source/help/id.php exists?
    model_info.sourcePath = model_info.sourcePath || [groupPath, authorPath, bcp47Path].join('/');
    
    fs.writeFileSync(modelInfoFileName, JSON.stringify(model_info, null, 2));
  };

  transpileSources(sources: Array<string>): Array<string> {
    return sources.map((source) => ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.None }
      }).outputText
    );
  };

  logError(s) {
    console.error(require('chalk').red(s));
  };
};