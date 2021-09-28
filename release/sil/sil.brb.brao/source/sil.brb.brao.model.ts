/*
  This is a minimal lexical model source that uses a tab delimited wordlist.
  See documentation online at https://help.keyman.com/developer/ for
  additional parameters.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  sources: ['wordlist.tsv'],
  wordBreaker: function(str: string) {
    return str.split(/\s/).map(function(token) {
      return {
        left: str.indexOf(token),
        start: str.indexOf(token),
        right: str.indexOf(token) + token.length,
        end: str.indexOf(token) + token.length,
        text: token
      }
    });
  }
};
export default source;
