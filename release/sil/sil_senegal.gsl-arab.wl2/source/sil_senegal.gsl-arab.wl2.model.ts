/*
 Predictive text model for Gusilay (gsl, Senegal) in Ajami, based on a word list.
  
  This is a minimal lexical model source that uses a tab delimited wordlist.
  See documentation online at https://help.keyman.com/developer/ for
  additional parameters.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  sources: ['wordlist.tsv'],,
  punctuation: {
    isRTL: true,
    quotesForKeepSuggestion: {
      open: "\u00AB",
      close: "\u00BB"
    }
  }
};
export default source;
