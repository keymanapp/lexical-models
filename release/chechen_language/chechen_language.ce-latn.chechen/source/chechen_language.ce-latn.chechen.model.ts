/*
  Chechen 1.0

  Lexical model for the Chechen language using the 1992 Latin script. Word forms are sourced from the corpus at corpora.dosham.info,
  created by a member of our team and maintained as part of our efforts to support the Chechen language.
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
