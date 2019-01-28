import LexicalModelCompiler from "../../../../tools/index";

(new LexicalModelCompiler).compile({
  format: 'custom-1.0',
  wordBreaking: {
    sources: ['wordbreak.ts']
  },
  //... metadata ...
  predict: function(context: string): LexicalModelPrediction[] {
    if(context == 'f') {
      return [{transform: 'foo', delete: 1}];
    } else {
      return [];
    }
  },
  sources: []
});
