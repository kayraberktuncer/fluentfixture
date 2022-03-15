import { Assert } from '../utils/assert';
import { Factory } from '../factories/factory';
import { DEFAULT_ARRAY_SIZE, DEFAULT_PERCENTAGE } from '../constants/limits';
import { ConvertFunction } from '../types/convert-function';
import { Functional } from '../factories/decorators/functional';
import { ConsumerFunction } from '../types/consumer-function';
import { Exporter } from '../factories/decorators/exporter';
import { Optional } from '../factories/selectors/optional';
import { Nullable } from '../factories/selectors/nullable';
import { ValueAdapter } from '../factories/adapters/value-adapter';
import { ProducerFunction } from '../types/producer-function';
import { FunctionAdapter } from '../factories/adapters/function-adapter';
import { Formatter } from '../factories/decorators/formatter';
import { Memo } from '../factories/decorators/memo';
import { ArrayStream, StringStream } from './stream-loader';

/**
 * `Stream` is the superclass of all stream types.
 * @class
 * @template T
 * @extends {Factory.<T>}
 */
export class Stream<T = any> extends Factory<T> {
  private readonly factory: Factory<T>;

  /**
   * Creates an instance of `Stream.<T>`.
   * @constructor
   * @param {Factory.<T>} [factory] - the factory to be decorated
   */
  public constructor(factory: Factory<T>) {
    Assert.isFactoryLike('Stream.constructor(factory)', 'factory', factory);
    super();
    this.factory = factory;
  }

  /**
   * Creates an instance of `Stream.<T>`
   * @static
   * @public
   * @param {Factory.<T>} [factory] - the factory to be decorated
   * @return {Stream.<T>}
   */
  public static from<T = any>(factory: Factory<T>): Stream<T> {
    return new Stream(factory);
  }

  /**
   * Creates a `Stream.<T>` with `ValueAdapter` adapter and the given value.
   * @see ValueAdapter
   * @static
   * @public
   * @param {T} [value] - the value to be returned
   * @returns {Stream.<T>}
   */
  public static fromValue<T = any>(value: T): Stream<T> {
    return Stream.from(new ValueAdapter(value));
  }

  /**
   * Creates a `Stream.<T>` with `FunctionAdapter` adapter and the given function.
   * @see FunctionAdapter
   * @static
   * @public
   * @param {function():T} [fn] - the producer function
   * @returns {Stream.<T>}
   */
  public static fromResult<T = any>(fn: ProducerFunction<T>): Stream<T> {
    return Stream.from(new FunctionAdapter(fn));
  }

  /**
   * Generates single data by using the decorated factory.
   * @see Factory
   * @returns {T}
   */
  public single(): T {
    return this.factory.single();
  }

  /**
   * Creates an `ArrayStream` with `Iterator` decorator and the given length
   * @see ArrayStream
   * @see Iterator
   * @public
   * @param {number} [length=10] - the length of the array
   * @returns {ArrayStream.<T>}
   */
  public array(length: number = DEFAULT_ARRAY_SIZE): ArrayStream<T> {
    return ArrayStream.iterate(this, length);
  }

  /**
   * Creates a `StringStream` with `Formatter` decorator and the given template.
   * @see StringStream
   * @see Formatter
   * @public
   * @param {string} [template] - the template expression
   * @returns {StringStream}
   */
  public format(template: string): StringStream {
    return new StringStream(new Formatter(this, template));
  }

  /**
   * Creates a `Stream` with `Functional` decorator and the given function.
   * The underlying type of the new stream is the same as the return type of the given function.
   * @see Functional
   * @public
   * @template T, K
   * @param {function(T):K} [fn] - the converter function
   * @returns {Stream.<K>}
   */
  public convert<K>(fn: ConvertFunction<T, K>): Stream<K> {
    return Stream.from(new Functional(this, fn));
  }

  /**
   * Creates a `Stream` with `Functional` decorator and the given function.
   * The underlying type of the new stream is the same as the return type of the given function.
   * @see Functional
   * @public
   * @param {function(T):T} [fn] - the converter function
   * @returns {Stream.<T>}
   */
  public apply(fn: ConvertFunction<T, T>): this {
    return new (this.constructor as (new (factory: Factory<T>) => any))(new Functional(this, fn));
  }

  /**
   * Creates a `Stream` with `Memo` decorator.
   * @see Memo
   * @public
   * @returns {Stream.<T>}
   */
  public memo(): this {
    return new (this.constructor as (new (factory: Factory<T>) => any))(new Memo(this));
  }

  /**
   * Creates a `Stream` with `Exporter` decorator and the given function.
   * @see Exporter
   * @public
   * @param {function(T):void} [fn] - the function that receives the result
   * @returns {Stream.<T>}
   */
  public dump(fn: ConsumerFunction<T>): this {
    return new (this.constructor as (new (factory: Factory<T>) => any))(new Exporter(this, fn));
  }

  /**
   * Creates a `Stream` with `Optional` decorator, which means it may generate a value or undefined.
   * @see Optional
   * @public
   * @param {number} [percentage=0.5] - a number within [0, 1] of how often the result should be defined
   * @returns {Stream.<T | undefined>}
   */
  public optional(percentage: number = DEFAULT_PERCENTAGE): Stream<T | undefined> {
    return Stream.from(new Optional(this, percentage));
  }

  /**
   * Creates a `Stream` with `Nullable` decorator, which means it may generate a value or null.
   * @see Nullable
   * @public
   * @param {number} [percentage=0.5] - a number within [0, 1] of how often the result should be defined
   * @returns {Stream.<T | null>}
   */
  public nullable(percentage: number = DEFAULT_PERCENTAGE): Stream<T | null> {
    return Stream.from(new Nullable(this, percentage));
  }

  /**
   * Returns the decorated factory.
   * @see Factory
   * @public
   * @returns {Factory.<T>}
   */
  public getFactory(): Factory<T> {
    return this.factory;
  }
}
