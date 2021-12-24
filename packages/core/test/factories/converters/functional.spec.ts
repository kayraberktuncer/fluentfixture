import { instance, mock, spy, verify, when } from 'ts-mockito';
import { NON_FUNCTION_DATA_SET } from '../../data/type-sets';
import { MockFactory } from '../../mocks/mock-factory';
import { Factory } from '../../../src/factories/factory';
import { Functional } from '../../../src/factories/converters/functional';

describe('Functional', () => {

  describe('.constructor()', () => {

    describe('parameter assertions (decorator)', () => {

      test.each(NON_FUNCTION_DATA_SET)('should throw an error when decorator is not a function, given: %s', (decorator: any) => {

        const thrown = () => new Functional(new MockFactory({}), decorator);

        expect(thrown).toThrow('Parameter must be a function.');
      });
    });
  });

  describe('.single()', () => {

    it('should convert result of the given factory with given decorator function', () => {
      const mockFactory = mock(Factory);
      const factoryOut = 1;
      const out = 2;
      const decorator = { decorate: (value: any) => out };
      const spyDecorator = spy(decorator);
      const factory = new Functional(instance(mockFactory), decorator.decorate);

      when(mockFactory.single()).thenReturn(factoryOut);

      const result = factory.single();

      expect(result).toBe(out);
      verify(mockFactory.single()).once();
      verify(spyDecorator.decorate(factoryOut)).once();
    });
  });
});