/*
 Chulalongkorn University top 5000 Thai frequency list http://ling.arts.chula.ac.th/TNC/category.php?id=58&
 Only words and their freqeuncies are leveraged in this wordlist

  This is a minimal lexical model source that uses a tab delimited wordlist.
  See documentation online at https://help.keyman.com/developer/ for
  additional parameters.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  sources: ['wordlist.tsv'],,
    wordBreaker: function(str: string) {
    return str.split(/\s|\u200b/).map(function(token) {
      return {
        left: str.indexOf(token),
        start: str.indexOf(token),
        right: str.indexOf(token) + token.length,
        end: str.indexOf(token) + token.length,
        text: token
      }
    });
  },
  punctuation: {
    insertAfterWord: "\u200B"
  }
};
export default source;
