/*
 Predictive text model for Gusilay (gsl, Senegal).
 wl2 1.2 generated from paratext wordlist and from literacy docs
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  sources: ['wordlist.tsv'],,
  punctuation: {
    quotesForKeepSuggestion: {
      open: "\u00AB",
      close: "\u00BB"
    }
  }
};
export default source;
