import mockXHR from 'xhr-mock';
import type { APISpecAdapter, AjaxConfig } from '@ofa/api-spec-adapter';

import APIStatesHub from '../states-hub-api';
import { initialState } from '../http/response';
import { APIStatesSpec } from '../..';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

const apiSpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

const apiStateSpec: APIStatesSpec = {
  findPetsByTags: { apiID: 'get:/api' },
};

test('APIStates_getCached_should_throw_if_stateID_has_not_corresponding_api', () => {
  const apiStates = new APIStatesHub(apiSpecAdapter, apiStateSpec);
  expect(() => apiStates.getCached('some_state_not_exist')).toThrow();
});

test('APIStates_getState_should_return_behaviorSubject_with_expected_initial_state', () => {
  const apiStates = new APIStatesHub(apiSpecAdapter, apiStateSpec);
  const state$ = apiStates.getState$('findPetsByTags');
  expect(state$.getValue()).toEqual(initialState);
});

test('APIStates_getState_should_return_the_same_behaviorSubject', () => {
  const apiStates = new APIStatesHub(apiSpecAdapter, apiStateSpec);
  const state$1 = apiStates.getState$('findPetsByTags');
  const state$2 = apiStates.getState$('findPetsByTags');

  expect(Object.is(state$1, state$2)).toBe(true);
});

test('APIStates_call_refresh_should_have_no_effect_if_api_has_not_been_called_ever', () => {
  const mockBuild = jest.fn();
  const adapter = { build: mockBuild };
  const apiStates = new APIStatesHub(adapter, apiStateSpec);
  const state$ = apiStates.getState$('findPetsByTags');

  const callback = jest.fn();
  state$.subscribe(callback);

  apiStates.refresh('findPetsByTags');

  expect(callback).toBeCalledTimes(1);
  expect(mockBuild).toBeCalledTimes(0);
});

test('APIStates_fetch_should_call_adapter_build_method', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const adapter = {
    build: jest.fn<AjaxConfig, any>(() => {
      return { method: 'get', url: 'api' };
    }),
  };
  const apiStates = new APIStatesHub(adapter, apiStateSpec);
  const fetchParams = { params: { foo: 'bar' }, body: 'abc' };

  function fetchCallback(): void {
    try {
      expect(adapter.build).toBeCalledTimes(1);
      expect(adapter.build).toBeCalledWith('get:/api', fetchParams);
      done();
    } catch (error) {
      done(error);
    }
  }

  apiStates.fetch('findPetsByTags', {
    callback: fetchCallback,
    params: fetchParams,
  });
});

test('APIStates_fetch_called_should_resolve_values', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const callback = jest.fn();
  const apiStates = new APIStatesHub(apiSpecAdapter, apiStateSpec);
  const state$ = apiStates.getState$('findPetsByTags');
  const fetchParams = { params: { foo: 'bar' }, body: 'abc' };

  state$.subscribe(callback);

  function fetchCallback(): void {
    try {
      expect(callback).toBeCalledTimes(3);
      done();
    } catch (error) {
      done(error);
    }
  }

  apiStates.fetch('findPetsByTags', {
    callback: fetchCallback,
    params: fetchParams,
  });
});

// todo test cases of success and error callbacks
