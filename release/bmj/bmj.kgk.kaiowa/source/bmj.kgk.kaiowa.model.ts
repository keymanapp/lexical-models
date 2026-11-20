/*
  Kaingang 1.0 — modelo de palavras (sugestões e correções) para o teclado Kaingang.

  A lista (wordlist.tsv) é gerada por ../../../modelo/construir_lista.py a partir das traduções oficiais da AGU
  em kaingang (Constituição, OIT 169, ODS) e do glossário jurídico kaingang.
*/

const source: LexicalModelSource = {
  format: 'trie-1.0',
  sources: ['wordlist.tsv'],
  languageUsesCasing: true,

  // A glotal é o apóstrofo e faz parte da palavra (pã'i).
  // O resto segue o separador padrão do Keyman (Unicode UAX #29): sinais combinantes ficam na letra, e números
  // (3.000,48) e endereços (www.exemplo.com) não se partem. Só o apóstrofo muda: conta como letra, para não
  // sair da palavra nem no fim dela.
  wordBreaker: function (text: string): Span[] {
    const customization = {
      propertyMapping: (char: string) => (char == "'" || char == '\u2019') ? 'ALetter' : null,
    };
    return wordBreakers['default'](text, customization);
  },

  // Chave de busca: minúscula, sem apóstrofo e sem nenhum sinal combinante (toda a faixa U+0300–U+036F
  // depois da NFKD: til, agudo, trema, grave, circunflexo, mácron, ogonek).
  // Assim "ty" encontra "tỹ" e "pai" encontra "pã'i".
  searchTermToKey: function (wordform: string): string {
    let s = '';
    for (const ch of wordform) {
      s += ch.toLowerCase();
    }
    return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/['\u2019]/g, '');
  },
};
export default source;
