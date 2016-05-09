/* globals afterEach, describe, it */

import {apiUri} from '../../config.js'
import configureStore from 'redux-mock-store'
import expect from 'expect'
import nock from 'nock'
import thunk from 'redux-thunk'
import {
  FAILURE,
  fetchSources,
  fetchSourcesFailure,
  fetchSourcesRequest,
  fetchSourcesSuccess,
  default as reducer,
  REQUEST,
  SUCCESS
} from '../../src/js/modules/sources'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('sources actions', () => {
  describe('sync actions', () => {
    it('fetchSourcesFailure should create a FAILURE action', () => {
      const error = new Error('test error')
      const expectedAction = {
        payload: {error},
        type: FAILURE
      }

      expect(fetchSourcesFailure(error)).toEqual(expectedAction)
    })
    it('fetchSourcesRequest should create a REQUEST action', () => {
      const expectedAction = {
        type: REQUEST
      }

      expect(fetchSourcesRequest()).toEqual(expectedAction)
    })

    it('fetchSourcesSuccess should create a SUCCESS action', () => {
      const expectedAction = {
        payload: {data: []},
        receivedAt: null,
        type: SUCCESS
      }
      const action = fetchSourcesSuccess([])

      expectedAction.receivedAt = action.receivedAt

      expect(action).toEqual(expectedAction)
    })
  })

  describe('async actions', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('fetchSources creates a SUCCESS action on success', (done) => {
      nock(apiUri)
        .get('/sources')
        .reply(200, [{_id: '1', name: 'SourceA'}, {_id: '2', name: 'SourceB'}])

      const initialState = {
        sources: []
      }
      const requestAction = {
        type: REQUEST
      }
      const recieveAction = {
        type: SUCCESS,
        payload: {
          data: [
            {_id: '1', name: 'SourceA'},
            {_id: '2', name: 'SourceB'}
          ]
        },
        receivedAt: null
      }
      const store = mockStore(initialState)

      store.dispatch(fetchSources())
        .then(() => {
          const actions = store.getActions()
          const expectedActions = [
            requestAction,
            recieveAction
          ]

          expectedActions[1].receivedAt = actions[1].receivedAt

          expect(actions).toEqual(expectedActions)
          done()
        })
    })

    it('fetchSources creates a FAILURE action on failure', (done) => {
      nock(apiUri)
        .get('/sources')
        .reply(500)

      const initialState = {
        sources: []
      }

      const requestAction = {
        type: REQUEST
      }
      const failureAction = {
        payload: {},
        type: FAILURE
      }
      const store = mockStore(initialState)

      store.dispatch(fetchSources())
        .then(() => {
          const actions = store.getActions()
          const expectedActions = [
            requestAction,
            failureAction
          ]

          expectedActions[1].payload.error = actions[1].payload.error

          expect(actions).toEqual(expectedActions)
          done()
        })
    })
  })
})

describe('sources reducer', () => {
  it('should return the initial state', () => {
    const stateAfter = {
      data: [],
      error: undefined,
      isFetching: false,
      lastUpdated: null
    }

    expect(reducer(undefined, {})).toEqual(stateAfter)
  })

  it('should handle FAILURE', () => {
    const error = new Error('test error')
    const action = {
      payload: {error},
      type: FAILURE
    }
    const stateAfter = {
      data: [],
      error,
      isFetching: false,
      lastUpdated: null
    }

    expect(reducer(undefined, action)).toEqual(stateAfter)
  })

  it('should handle REQUEST', () => {
    const action = {
      type: REQUEST
    }
    const stateAfter = {
      data: [],
      error: undefined,
      isFetching: true,
      lastUpdated: null
    }

    expect(reducer(undefined, action)).toEqual(stateAfter)
  })

  it('should handle SUCCESS', () => {
    const data = ['SourceA', 'SourceB']
    const action = {
      payload: {data},
      receivedAt: Date.now(),
      type: SUCCESS
    }
    const result = reducer(undefined, action)
    const stateAfter = {
      data,
      error: undefined,
      isFetching: false,
      lastUpdated: result.lastUpdated
    }

    expect(result).toEqual(stateAfter)
  })
})