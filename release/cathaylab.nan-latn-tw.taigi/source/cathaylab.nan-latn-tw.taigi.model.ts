
const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: {
    use: 'default',     // we want to use the default word breaker, BUT!
    // CUSTOMIZE THIS:
    joinWordsAt: [" ", '-'], // join words that contain hyphens
  }
  sources: ['wordlist.tsv'],
    punctuation: {
    insertAfterWord: ""
  }
  languageUsesCasing: true,
  searchTermToKey: function(term, applyCasing) {
    return Array.from(term)
      .map(function(c) { return applyCasing('lower', c) };
  }
};

export default source;
