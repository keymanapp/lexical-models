/*
  Gurage 1.0 generated from template.
  
  This is a minimal lexical model source that uses a tab delimited wordlist.
  See documentation online at https://help.keyman.com/developer/ for
  additional parameters.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  sources: ['sgw-unilex-NewOrthography-WordList.tsv', 'WolfLeslau-NewOrthography-WordList.tsv', 'SahleJingo-NewOrthography-WordList.tsv'],
};
export default source;
