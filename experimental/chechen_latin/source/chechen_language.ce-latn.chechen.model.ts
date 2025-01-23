/*
  Chechen 1.0

  Word forms are sourced from the corpus at corpora.dosham.info
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  sources: ['wordlist.tsv'],
  languageUsesCasing: true,
  punctuation: {
    quotesForKeepSuggestion: {
      open: "\"",
      close: "\""
    }
  }
};
export default source;
