const source: LexicalModelSource = {
  format: 'custom-1.0',
  wordBreaker: {
    sources: ['wordbreak.ts'],
    rootClass: 'ExampleWordBreaker'
  },
  //... metadata ...
  sources: ['predict.ts'],
  rootClass: 'ExampleCustom'
};

export default source;
