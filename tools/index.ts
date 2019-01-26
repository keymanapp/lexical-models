/*
  index.ts: base file for lexical model compiles
*/

let fs = require('fs');
let zip = require('node-zip')();

/// import file system

interface LexicalModel {
  readonly id: string;
  readonly format: 'trie-1.0'|'fst-foma-1.0'|'custom-1.0',
  /*readonly wordBreaking: {
    allowedCharacters: { initials: string 'abcdefghijklmnopqrstuvwxyz', medials: 'abcdefghijklmnopqrstuvwxyz', finals: 'abcdefghijklmnopqrstuvwxyz' },
    defaultBreakCharacter: ' '
  },*/
  //... metadata ...
}

interface LexicalModelSource extends LexicalModel {
  readonly sources: [string];//['example.tsv']  
}

let com = {keyman: {lexicalModelCompiler: {
  compile: function(o: LexicalModelSource) {
    // Validate fields provided by the model.ts file
    //todo: assert id format
    //todo: assert presence of source files
    
    // Add any additional fields required for compiled version
    
    // Import data files and transform

    
    // Emit the object as Javascript, to file

    let p: string = JSON.stringify(o); //TODO: real thingummy
    fs.writeFileSync(o.id + '.model.js', p);
    
    // Generate a zip file

    let kmpJsonData = {};

    zip.file(o.id + '.model.js');
    zip.file('kmp.json', JSON.stringify(kmpJsonData));
    var data = zip.generate({base64:false,compression:'DEFLATE'});
    fs.writeFileSync(o.id + '.model.kmp', data, 'binary');
  }
}}};