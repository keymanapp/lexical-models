import LexicalModelCompiler from "@keymanapp/developer-lexical-model-compiler"; 

(new LexicalModelCompiler).compile({
  format: 'trie-1.0',
  wordBreaking: {
    allowedCharacters: { initials: 'abcdefghijklmnopqrstuvwxyz', medials: 'abcdefghijklmnopqrstuvwxyz', finals: 'abcdefghijklmnopqrstuvwxyz' },
    defaultBreakCharacter: ' '
  },
  //... metadata ...
  sources: ['cree-kinship.tsv']
});
