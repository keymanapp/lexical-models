import LexicalModelCompiler from "../../../../tools/index";

(new LexicalModelCompiler).compile({
  format: 'custom-1.0',
  wordBreaking: {
    sources: ['wordbreak.ts'],
    rootClass: 'ExampleWordBreaker'
  },
  //... metadata ...
  sources: ['predict.ts'],
  rootClass: 'ExampleCustom'
});
