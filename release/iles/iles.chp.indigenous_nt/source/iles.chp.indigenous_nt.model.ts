/*
  Indigenous NT 0.1 generated from template.
  
  This is a minimal lexical model source that uses a tab delimited wordlist.
  See documentation online at https://help.keyman.com/developer/ for
  additional parameters.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  wordBreaker : {
    use: 'default',     // we want to use the default word breaker, BUT!
    // CUSTOMIZE THIS:
    joinWordsAt: ['-','\''], // join words that contain hyphens
  },
  sources: ['wordlist.tsv'],
  searchTermToKey: function (term) {
        const COMBINING_DIACRITICAL_MARKS = /[\u0300-\u036f]/g;
        let lowercasedTerm = Array.from(term).map(c => c.toLowerCase()).join('');
        let normalizedTerm = lowercasedTerm.normalize('NFKD');
        let termWithoutDiacritics = normalizedTerm.replace(COMBINING_DIACRITICAL_MARKS, '');
        let termExtra = termWithoutDiacritics.replace(/ı/g,'i').replace(/ł/g,'l').replace(/Ł/g,'L').replace(/ʼ/g,'\'');
        return termExtra;
    },
};
export default source;
