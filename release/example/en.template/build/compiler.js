/*
  index.ts: base file for lexical model compiles
*/
var fs = require('fs');
var zip = require('node-zip');
var com = { keyman: { lexicalModelCompiler: {
            compile: function (o) {
                // Validate fields provided by the model.ts file
                //todo: assert id format
                //todo: assert presence of source files
                // Add any additional fields required for compiled version
                // Import data files and transform
                // Emit the object as Javascript, to file
                var p = JSON.stringify(o); //TODO: real thingummy
                fs.writeFileSync(o.id + '.model.js', p);
                // Generate a zip file
                var kmpJsonData = {};
                zip.file(o.id + '.model.js');
                zip.file('kmp.json', JSON.stringify(kmpJsonData));
                var data = zip.generate({ base64: false, compression: 'DEFLATE' });
                fs.writeFileSync(o.id + '.model.kmp', data, 'binary');
            }
        } } };
com.keyman.lexicalModelCompiler.compile({
    id: 'example.template',
    format: 'trie-1.0',
    /*wordBreaking: {
      allowedCharacters: { initials: 'abcdefghijklmnopqrstuvwxyz', medials: 'abcdefghijklmnopqrstuvwxyz', finals: 'abcdefghijklmnopqrstuvwxyz' },
      defaultBreakCharacter: ' '
    },*/
    //... metadata ...
    sources: ['example.tsv']
});
