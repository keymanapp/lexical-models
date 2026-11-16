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
  // A palavra começa numa letra ou número e segue com letras, sinais combinantes, números e apóstrofos.
  wordBreaker: {
    use: function (text: string): Span[] {
      const spans: Span[] = [];
      const re = /[\p{L}\p{N}][\p{L}\p{M}\p{N}'’]*/gu;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        spans.push({ start: m.index, end: m.index + m[0].length, length: m[0].length, text: m[0] });
      }
      return spans;
    }
  },

  // Chave de busca: minúscula, sem acento/til/trema e sem apóstrofo.
  // Assim "ty" encontra "tỹ" e "pai" encontra "pã'i".
  searchTermToKey: function (wordform: string): string {
    let s = '';
    for (const ch of wordform) {
      s += ch.toLowerCase();
    }
    return s.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '');
  },
};
export default source;
