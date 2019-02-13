/*
  Example predictor for the en.custom model
*/
com.keyman.lexicalModel.registerPredictor('example.en.custom', function(context: string): LexicalModelPrediction[] {
  if(context == 'f') {
    return [{transform: 'foo', delete: 1}];
  } else {
    return [];
  }
});
