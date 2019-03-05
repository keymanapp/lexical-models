/*
  Example predictor for the en.custom model
*/
class ExampleCustom {
  // TODO:  Needs to reference a .d.ts file for type definitions!
  predict(transform, context) {
    if(context == 'f') {
      return [{transform: 'foo', delete: 1}];
    } else {
      return [];
    }
  }
}