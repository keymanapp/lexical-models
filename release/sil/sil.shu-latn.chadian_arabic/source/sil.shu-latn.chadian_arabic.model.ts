/*
  Chadian Arabic 1.0
  
  This lexical model is created from three sources: a word list created from traditional
  stories, a Paratext word list (no proper names), and a FieldWorks lexicon word list.*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: 'default',
  sources: ['Texts word list.tsv', 'CABRS wordlist from Paratext no names.txt', 'FLEx lexicon.txt'],
};
export default source;
