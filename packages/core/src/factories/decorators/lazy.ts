import { IFactory } from '../interfaces/factory';
import { Assert } from '../../utils/assert';
import { ExtendedObjectModel } from '../../types/extended-object-model';
import { ConvertFunction } from '../../types/convert-function';
import { Decorator } from './decorator';

export class Lazy<S extends keyof any, T = any, K = any> extends Decorator<T, ExtendedObjectModel<S, T, K>> {
  private readonly fn: ConvertFunction<T, K>;
  private readonly property: S;

  public constructor(factory: IFactory<T>, fn: ConvertFunction<T, K>, property: S) {
    Assert.isFunction('Lazy.constructor(factory, fn, property)', 'fn', fn);
    Assert.key(property);
    super(factory);
    this.property = property;
    this.fn = fn;
  }

  public single(): ExtendedObjectModel<S, T, K> {
    const value = this.factory.single() as { [P in S]: K } & T;
    delete value[this.property];
    return { ...value, [this.property]: this.fn(value) };
  }

  public getFunction(): ConvertFunction<T, K> {
    return this.fn;
  }

  public getProperty(): S {
    return this.property;
  }
}
