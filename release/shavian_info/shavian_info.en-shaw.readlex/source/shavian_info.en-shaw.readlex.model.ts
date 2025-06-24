/*This is a minimal lexical model source that uses a tab delimited wordlist.

See documentation online at https://help.keyman.com/developer/ for additional parameters.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  sources: ['wordlist.tsv'],,
  punctuation: {
    quotesForKeepSuggestion: {
      open: "\u2039",
      close: "\u203A"
    }
  }
};
export default source;
