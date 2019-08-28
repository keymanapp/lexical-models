const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaking: {
    allowedCharacters: { initials: 'abcdefghijklmnopqrstuvwxyz', medials: 'abcdefghijklmnopqrstuvwxyz', finals: 'abcdefghijklmnopqrstuvwxyz' },
    defaultBreakCharacter: ' '
  },
  //... metadata ...
  sources: ['cree-kinship.tsv']
};

export default source;