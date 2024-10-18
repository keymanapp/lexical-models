/// <reference types="@keymanapp/models-types" />

/*
  Example custom-class predictor for the en.custom model
*/
class ExampleCustom implements LexicalModel {
  configuration: Configuration;

  configure(capabilities: Capabilities) {
    return this.configuration = {
      leftContextCodePoints: 64 < capabilities.maxLeftContextCodePoints ? 64 : capabilities.maxLeftContextCodePoints,
      rightContextCodePoints: 0
    }
  }

  predict(transform: Transform, context: Context): Distribution<Suggestion> {
    if(context.left == 'f') {
      return [{
        sample: {transform: {
          deleteLeft: 1,
          insert: 'foo'
        }, displayAs: 'foo'},
        p: 1.0
      }];
    } else {
      return [];
    }
  }
}