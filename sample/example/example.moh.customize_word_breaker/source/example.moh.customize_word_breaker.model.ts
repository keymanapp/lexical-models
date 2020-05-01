const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: {
    use: 'default',
    // : ' and ‘ can be used inside words!
    joinWordsAt: [':', "'", "‘"],
  },
  sources: ['example.tsv']
};

export default source;
