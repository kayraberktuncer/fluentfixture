import { MockFactory } from '../mocks/mock-factory';
import { BooleanStream } from '../../src/streams/boolean-stream';
import { assertBooleanStreamDecorator } from '../assertions/boolean-stream-assertions';

describe('BooleanStream', () => {
  const value = true;
  const stream = new BooleanStream(new MockFactory(value));

  describe('.not()', () => {

    it('should create a stream with function decorator (not) that wraps itself', () => {
      assertBooleanStreamDecorator(stream, stream.not(), value, false);
    });
  });
});
