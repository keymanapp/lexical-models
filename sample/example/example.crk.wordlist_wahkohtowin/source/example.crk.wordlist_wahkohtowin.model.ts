const source: LexicalModelSource = {
  format: 'trie-1.0',
  /*wordBreaker: { //THIS IS THEORETICAL FUTURE FUNCTIONALITY
    allowedCharacters: { initials: 'abcdefghijklmnopqrstuvwxyz', medials: 'abcdefghijklmnopqrstuvwxyz', finals: 'abcdefghijklmnopqrstuvwxyz' },
    defaultBreakCharacter: ' '
  },*/
  //... metadata ...
  sources: ['cree-kinship.tsv']
};

export default source;