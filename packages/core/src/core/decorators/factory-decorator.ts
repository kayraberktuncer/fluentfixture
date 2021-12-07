import { AbstractFactory } from '../abstract-factory';
import { Factory } from '../factory';
import { MapFunction } from '../types/map-function';
import { Assert } from '../../utils/assert';

export class FactoryDecorator<T, K> extends AbstractFactory<K> {
  private readonly factory: Factory<T>;
  private readonly decorator: MapFunction<T, K>;

  public constructor(factory: Factory<T>, decorator: MapFunction<T, K>) {
    Assert.factoryLike(factory);
    Assert.func(decorator);
    super();
    this.factory = factory;
    this.decorator = decorator;
  }

  public single(): K {
    return this.decorator(this.factory.single());
  }
}
