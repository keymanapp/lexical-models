/*
  Burushaski 1.0

  This lexical model is for Predictive Writing in the Burushaski Language latin script. */

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  sources: ['wordlist.tsv'],,
  languageUsesCasing: true
};
export default source;
