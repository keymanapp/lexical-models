/*
  Kaingang 1.0 — modelo de palavras (sugestões e correções) para o teclado Kaingang.

  A lista (wordlist.tsv) vem das traduções oficiais da AGU
  em kaingang (Constituição, OIT 169, ODS) e do glossário jurídico kaingang.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  sources: ['wordlist.tsv'],
  languageUsesCasing: true,

  // A glotal é o apóstrofo e faz parte da palavra (pã'i).
  // Usa o word breaker padrão (Unicode UAX #29), que já trata abreviações ("e.g."),
  // URLs e números ("3,000.48"). A única customização é tratar o apóstrofo
  // (U+0027 e U+2019) como ALetter, para que ele não quebre a palavra.
  wordBreaker: function (text: string): Span[] {
    return wordBreakers['default'](text, {
      propertyMapping: (char: string) => (char === "'" || char === '\u2019') ? 'ALetter' : null
    });
  },

  // Chave de busca: minúscula, sem diacríticos e sem apóstrofo.
  // A normalização NFKD separa toda letra acentuada em letra base + marcas
  // combinantes do bloco U+0300–U+036F (agudo, grave, til, trema, mácron...),
  // então todas as marcas são removidas, não só algumas.
  // Assim "ty" encontra "tỹ" e "pai" encontra "pã'i".
  searchTermToKey: function (wordform: string): string {
    return wordform
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/['\u2019]/g, '');
  },
};
export default source;
