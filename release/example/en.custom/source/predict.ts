/// <reference path="../../../../includes/LMLayerWorker.d.ts" />

/*
  Example custom-class predictor for the en.custom model
*/
class ExampleCustom implements WorkerInternalModel {
  configuration: Configuration;

  configure(capabilities: Capabilities) {
    return this.configuration = {
      leftContextCodeUnits: 64 < capabilities.maxLeftContextCodeUnits ? 64 : capabilities.maxLeftContextCodeUnits,
      rightContextCodeUnits: 0
    }
  }

  // TODO:  Needs to reference a .d.ts file for type definitions!
  predict(transform: Transform, context: Context): Suggestion[] {
    if(context.left == 'f') {
      return [{transform: {
          deleteLeft: 1,
          insert: 'foo'
        }, displayAs: 'foo'}];
    } else {
      return [];
    }
  }
}