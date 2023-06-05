/*
  GFF Tigre language lexical model.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  sources: ['TigreWordList.tsv'],
};
export default source;
