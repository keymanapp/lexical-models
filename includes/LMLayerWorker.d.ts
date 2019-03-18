/// <reference path="message.d.ts" />
declare class DefaultWordBreaker implements WorkerInternalWordBreaker {
    constructor(obj: any);
    break(text: string): string[];
}
declare namespace models {
    /**
     * @file dummy-model.ts
     *
     * Defines the Dummy model, which is used for testing the
     * prediction API exclusively.
     */
    /**
     * The Dummy Model that returns nonsensical, but predictable results.
     */
    class DummyModel implements WorkerInternalModel {
        configuration: Configuration;
        private _futureSuggestions;
        constructor(options?: any);
        configure(capabilities: Capabilities): Configuration;
        predict(transform: Transform, context: Context, injectedSuggestions?: Suggestion[]): Suggestion[];
    }
}
/**
 * @file wordlist-model.ts
 *
 * Defines a simple word list (unigram) model.
 */
declare namespace models {
    class WordListModel implements WorkerInternalModel {
        configuration: Configuration;
        private _wordlist;
        constructor(wordlist: string[]);
        configure(capabilities: Capabilities): Configuration;
        predict(transform: Transform, context: Context): Suggestion[];
    }
}
/**
 * @file index.ts
 *
 * The main LMLayerWorker class, the top-level class within the Web Worker.
 * The LMLayerWorker handles the keyboard/worker communication
 * protocol, delegating prediction requests to the language
 * model implementations.
 */
/**
 * Encapsulates all the state required for the LMLayer's worker thread.
 *
 * Implements the state pattern. There are three states:
 *
 *  - `unconfigured`  (initial state before configuration)
 *  - `modelless`     (state without model loaded)
 *  - `ready`         (state with model loaded, accepts prediction requests)
 *
 * Transitions are initiated by valid messages. Invalid
 * messages are errors, and do not lead to transitions.
 *
 *          +-------------+    load    +---------+
 *   config |             |----------->|         |
 *  +------->  modelless  +            +  ready  +---+
 *          |             |<-----------|         |   |
 *          +-------------+   unload   +----^----+   | predict
 *                                          |        |
 *                                          +--------+
 *
 * The model and the configuration are ONLY relevant in the `ready` state;
 * as such, they are NOT direct properties of the LMLayerWorker.
 */
declare class LMLayerWorker {
    /**
     * State pattern. This object handles onMessage().
     * handleMessage() can transition to a different state, if
     * necessary.
     */
    private state;
    /**
     * By default, it's self.postMessage(), but can be overridden
     * so that this can be tested **outside of a Worker**.
     */
    private _postMessage;
    /**
     * By default, it's self.importScripts(), but can be overridden
     * so that this can be tested **outside of a Worker**.
     *
     * To function properly, self.importScripts() must be bound to self
     * before being stored here, else it will fail.
     */
    private _importScripts;
    private _platformCapabilities;
    private _hostURL;
    constructor(options?: {
        importScripts: any;
        postMessage: any;
    });
    /**
     * A function that can be set as self.onmessage (the Worker
     * message handler).
     * NOTE! You must bind it to a specific instance, e.g.:
     *
     *   // Do this!
     *   self.onmessage = worker.onMessage.bind(worker);
     *
     * Incorrect:
     *
     *   // Don't do this!
     *   self.onmessage = worker.onMessage;
     *
     * See: .install();
     */
    onMessage(event: MessageEvent): void;
    /**
     * Sends back a message structured according to the protocol.
     * @param message A message type.
     * @param payload The message's payload. Can have any properties, except 'message'.
     */
    private cast;
    /**
     * Loads a model by executing the given source code, and
     * passing in the appropriate configuration.
     *
     * @param desc         Type of the model to instantiate and its parameters.
     * @param capabilities Capabilities on offer from the keyboard.
     */
    loadModel(model: WorkerInternalModel): void;
    private loadModelFile;
    unloadModel(): void;
    /**
     * Sets the initial state, i.e., `unconfigured`.
     * This state only handles `config` messages, and will
     * transition to the `modelless` state once it receives
     * the config data from the host platform.
     */
    private setupConfigState;
    loadWordBreaker(breaker: WorkerInternalWordBreaker): void;
    /**
     * Sets the model-loading state, i.e., `modelless`.
     * This state only handles `load` messages, and will
     * transition to the `ready` state once it receives a model
     * description and capabilities.
     */
    private transitionToLoadingState;
    /**
     * Sets the state to `ready`. This requires a
     * fully-instantiated model. The `ready` state only responds
     * to `predict` message, and is an accepting state.
     *
     * @param model The loaded language model.
     */
    private transitionToReadyState;
    /**
     * Creates a new instance of the LMLayerWorker, and installs all its
     * functions within the provided Worker global scope.
     *
     * In production, this is called within the Worker's scope as:
     *
     *    LMLayerWorker.install(self);
     *
     * ...and this will setup onmessage and postMessage() appropriately.
     *
     * During testing, this method is useful to mock an entire global scope,
     *
     *    var fakeScope = { postMessage: ... };
     *    LMLayerWorker.install(fakeScope);
     *    // now we can spy on methods in fakeScope!
     *
     * @param scope A global scope to install upon.
     */
    static install(scope: DedicatedWorkerGlobalScope): LMLayerWorker;
}
/**
 * @file worker-interfaces.ts
 *
 * Interfaces and types required internally in the worker code.
 */
/**
 * The signature of self.postMessage(), so that unit tests can mock it.
 */
declare type PostMessage = typeof DedicatedWorkerGlobalScope.prototype.postMessage;
declare type ImportScripts = typeof DedicatedWorkerGlobalScope.prototype.importScripts;
/**
 * The valid incoming message kinds.
 */
declare type IncomingMessageKind = 'config' | 'load' | 'predict' | 'unload';
declare type IncomingMessage = ConfigMessage | LoadMessage | PredictMessage | UnloadMessage;
/**
 * The structure of a config message.  It should include the platform's supported
 * capabilities.
 */
interface ConfigMessage {
    message: 'config';
    /**
     * The platform's supported capabilities.
     */
    capabilities: Capabilities;
}
/**
 * The structure of an initialization message. It should include the model (either in
 * source code or parameter form), as well as the keyboard's capabilities.
 */
interface LoadMessage {
    message: 'load';
    /**
     * The model's compiled JS file.
     */
    model: string;
}
/**
 * Message to suggestion text.
 */
interface PredictMessage {
    message: 'predict';
    /**
     * Opaque, unique token that pairs this predict message with its suggestions.
     */
    token: Token;
    /**
     * How the input event will transform the buffer.
     * If this is not provided, then the prediction is not
     * assumed to be associated with an input event (for example,
     * when a user starts typing on an empty text field).
     *
     * TODO: test for absent transform!
     */
    transform?: Transform;
    /**
     * The context (text to the left and text to right) at the
     * insertion point/text cursor, at the moment before the
     * transform is applied to the buffer.
     */
    context: Context;
}
interface UnloadMessage {
    message: 'unload';
}
/**
 * Represents a state in the LMLayer.
 */
interface LMLayerWorkerState {
    /**
     * Informative property. Name of the state. Currently, the LMLayerWorker can only
     * be the following states:
     */
    name: 'unconfigured' | 'modelless' | 'ready';
    handleMessage(payload: IncomingMessage): void;
}
/**
 * The model implementation, within the Worker.
 */
interface WorkerInternalModel {
    configure(capabilities: Capabilities): Configuration;
    predict(transform: Transform, context: Context): Suggestion[];
}
/**
 * Constructors that return worker internal models.
 */
interface WorkerInternalModelConstructor {
    /**
     * WorkerInternalModel instances are all given the keyboard's
     * capabilities, plus any parameters they require.
     */
    new (...modelParameters: any[]): WorkerInternalModel;
}
interface WorkerInternalWordBreaker {
    break(text: string): string[];
}
