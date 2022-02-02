import { Stream, ArrayStream } from '../../src/streams/stream-loader';
import { ValueAdapter } from '../../src/factories/adapters/value-adapter';
import { assertArrayStreamDecorator } from '../assertions/array-stream-assertions';
import { Picker } from '../../src/factories/decorators/picker';
import { Sampler } from '../../src/factories/decorators/sampler';
import { Shuffler } from '../../src/factories/decorators/shuffler';

describe('ArrayStream', () => {

  describe('.pick()', () => {

    it('should create a stream with picker decorator that wrap itself', () => {
      const stream = ArrayStream.fromList([1, 2, 3]);

      const result = stream.pick();

      expect(result).toBeInstanceOf(Stream);

      const picker = result.getFactory() as Picker;
      expect(picker).toBeInstanceOf(Picker);
      expect(picker.getFactory()).toBe(stream);
    });
  });

  describe('.sample()', () => {

    it('should create an array stream with sampler that wraps itself', () => {
      const size = 2;
      const stream = ArrayStream.fromList([1, 2, 3]);

      const result = stream.sample(size);

      expect(result).toBeInstanceOf(ArrayStream);

      const sampler = result.getFactory() as Sampler;
      expect(sampler).toBeInstanceOf(Sampler);
      expect(sampler.getFactory()).toBe(stream);
      expect(sampler.getSize()).toBe(size);
    });
  });

  describe('.shuffle()', () => {

    it('should create an array stream with shuffler decorator that wraps itself', () => {
      const arr = [1, 2, 3];
      const stream = ArrayStream.fromList(arr);

      const result = stream.shuffle();

      expect(result).toBeInstanceOf(ArrayStream);

      const picker = result.getFactory() as Shuffler;
      expect(picker).toBeInstanceOf(Shuffler);
      expect(picker.getFactory()).toBe(stream);
    });
  });

  describe('.map()', () => {

    it('should create a stream with factory decorator that wraps itself', () => {
      const value = [1, 2, 3];
      const stream = new ArrayStream(new ValueAdapter(value));

      assertArrayStreamDecorator(stream, stream.map((i) => i * 2), value, [2, 4, 6]);
    });
  });

  describe('.filter()', () => {

    it('should create a stream with factory decorator that wraps itself', () => {
      const value = [1, 2, 3];
      const stream = new ArrayStream(new ValueAdapter(value));

      assertArrayStreamDecorator(stream, stream.filter((i) => i % 2 === 1), value, [1, 3]);
    });
  });

  describe('.sort()', () => {

    it('should create a stream with factory decorator that wraps itself', () => {
      const value = [3, 2, 1, 4, 5];
      const stream = new ArrayStream(new ValueAdapter(value));

      assertArrayStreamDecorator(stream, stream.sort((a, b) => b - a), value, [5, 4, 3, 2, 1]);
    });

    it('should use default sort algorithm when sort function not given', () => {
      const value = [3, 2, 1, 4, 5];
      const stream = new ArrayStream(new ValueAdapter(value));

      assertArrayStreamDecorator(stream, stream.sort(), value, [1, 2, 3, 4, 5]);
    });
  });
});
