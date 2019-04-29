import LexicalModelCompiler from "../../../../tools/index";

(new LexicalModelCompiler).compile({
  format: 'trie-2.0',
  wordBreaking: {
    allowedCharacters: { initials: 'abcdefghijklmnopqrstuvwxyz', medials: 'abcdefghijklmnopqrstuvwxyz', finals: 'abcdefghijklmnopqrstuvwxyz' },
    defaultBreakCharacter: ' '
  },
  //... metadata ...
  sources: ['saanich.tsv'],
  // TODO: could include source code for key function here:
});
