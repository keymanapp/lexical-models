/// <reference types="@keymanapp/lexical-model-compiler/dist/kmlmc.d.ts" />

const source: LexicalModelSource = {
  format: 'trie-1.0',

  sources: [
    'book_wordlist.tsv',
    'natural_sentences_wordlist.tsv',
    'bible_wordlist.tsv',
  ],

  wordBreaker: (text: string) => {
    const customization = {
      rules: [
        {
          match: (context: any) => {
           
            return context.propertyMatch(
              ['WSegSpace', 'sot'],
              ['Negation'],
              ['ALetter'],
              null
            );
          },
          breakIfMatch: false,
        },
      ],

      propertyMapping: (char: string) => {
        if (char === '/') {
          return 'Negation';
        }

        return null;
      },

      customProperties: ['Negation'],
    };

    return wordBreakers['default'](text, customization);
  },
};

export default source;