/*
  Kanembu

  Lexical data from Simon Neuhaus
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  sources: ['wordlist_kbl.tsv'],,
  languageUsesCasing: true,
  punctuation: {
    quotesForKeepSuggestion: {
      open: "\u00AB",
      close: "\u00BB"
    }
  }};
export default source;
