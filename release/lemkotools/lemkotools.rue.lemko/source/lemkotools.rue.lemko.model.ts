/*
  Lemko - review prototype 0.1.0

  This is a minimal lexical model source that uses a tab delimited wordlist.
  See documentation online at https://help.keyman.com/developer/ for
  additional parameters.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker: { use: 'default' },
  sources: ['wordlist.tsv'],
  languageUsesCasing: true,
  searchTermToKey: function (term: string): string {
    return Array.from(term.normalize('NFC'))
      .map(ch => ch.toLowerCase()).join('').normalize('NFC');
  },
};
export default source;
