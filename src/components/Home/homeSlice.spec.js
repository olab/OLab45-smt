import homeReducer, {
  increment,
  decrement,
  incrementByAmount,
} from './reducers';

describe('home reducer', () => {
  const initialState = {
    value: 3,
    status: 'idle',
  };
  it('should handle initial state', () => {
    expect(homeReducer(undefined, { type: 'unknown' })).toEqual({
      value: 0,
      status: 'idle',
    });
  });

  it('should handle increment', () => {
    const actual = homeReducer(initialState, increment());
    expect(actual.value).toEqual(4);
  });

  it('should handle decrement', () => {
    const actual = homeReducer(initialState, decrement());
    expect(actual.value).toEqual(2);
  });

  it('should handle incrementByAmount', () => {
    const actual = homeReducer(initialState, incrementByAmount(2));
    expect(actual.value).toEqual(5);
  });
});
