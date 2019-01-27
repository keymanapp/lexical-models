/*
  index.ts: base file for lexical model compiles
*/

let fs = require('fs');
let zip = require('node-zip')();

/// import file system

interface LexicalModel {
  readonly format: 'trie-1.0'|'fst-foma-1.0'|'custom-1.0',
  /*readonly wordBreaking: {
    allowedCharacters: { initials: string 'abcdefghijklmnopqrstuvwxyz', medials: 'abcdefghijklmnopqrstuvwxyz', finals: 'abcdefghijklmnopqrstuvwxyz' },
    defaultBreakCharacter: ' '
  },*/
  //... metadata ...
}

interface LexicalModelSource extends LexicalModel {
  readonly sources: [string];
}

interface LexicalModelTrie extends LexicalModel {
  readonly id: string;
  readonly trie: string;
}

let com = {keyman: {lexicalModelCompiler: {
  compile: function(o: LexicalModelSource) {
    // TODO: refactor into phases of build (use multiple source files for clarity)
    // Validate fields provided by the model.ts file
    //todo: assert id format
    //todo: assert presence of source files

    // TODO: Create complete .model_info from source .model_info
    
    // Add any additional fields required for compiled version
    
    // Import data files and transform

    
    // Emit the object as Javascript, to file

    let model_info_file = fs.readdirSync('../').find(function(f) { return f.match(/\.model_info$/)});
    
    let src = fs.readFileSync('../source/'+o.sources[0], 'utf8'); //todo: multiple source files
    
    let model_info = JSON.parse(fs.readFileSync('../'+model_info_file, 'utf8'));
    
    // TODO: split based on lexical model type (wordlist, fst, custom)
    // TODO: Is there a better way to do this?
    let oc: LexicalModelTrie = {id:model_info.id, format:o.format, trie:src};

    let p: string = JSON.stringify(oc); //TODO: real emission of javascript code

    // Save full model to build folder as Javascript for use in KeymanWeb
    fs.writeFileSync(oc.id + '.model.js', p);

    // Add model to .kmp file for deployment to mobile apps
    zip.file(oc.id + '.model.js', p);

    // TODO: this should be a transform from a .kps file. That allows us to add extra files such as documentation,
    // graphics etc. Then, in the repo .model_info file, we should omit anything that can be gleaned from the 
    // .kps, and warn if the content is in both places during compile phase.

    // TODO: update package.json schema at api.keyman.com/schemas to cater for additional fields.

    // Create kmp.json file

    let kmpJsonData = {
      system: {
        keymanDeveloperVersion: '12.0.0', //TODO: grab actual version from build environment
        fileVersion: '12.0' // TODO: Figure out what the file version should actually be -- 12.0? because we add model data?
      },
      options: {
        // TODO: We have no options at present for model files; we may add a readme or welcome later;
        // NOTE: this comes from the .kps
      },
      files: [
        {
          name: 'kmp.json',
          description: 'Package metadata'
        },
        {
          name: oc.id + '.model.js',
          description: oc.id + ' lexical model'
        }
      ],
      lexicalModels: [
        {
          name: oc.id + ' for English', // TODO: read from .model_info
          id: oc.id, // extension = .model.js
          version: '1.0', // TODO: read from .model_info
          languages: [{id: 'en', name: 'English'}], // TODO: read from .model_info

        }
      ],
      info: {
        name: {description: oc.id + ' for English Lexical Model'}, // TODO: read from .model_info
        version: {description:'1.0'}, //TODO: read from .model_info
        author: {description:'Marc Durdin', url:'mailto:marc@keyman.com'}, //TODO: read from .model_info
        copyright: {description:'(C) 2019 SIL International'} // TODO ... as above
      }      
    };

    zip.file('kmp.json', JSON.stringify(kmpJsonData));

    // Generate kmp file
    var data = zip.generate({base64:false,compression:'DEFLATE'});
    fs.writeFileSync(oc.id + '.model.kmp', data, 'binary');
  }
}}};