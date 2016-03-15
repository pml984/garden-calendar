/* globals afterEach, describe, it */

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import {
  FETCH_SOURCE_FIELDS_REQUEST,
  FETCH_SOURCE_FIELDS_SUCCESS
} from '../../src/js/actionTypes'
import {
  fetchSourceFields,
  fetchSourceFieldsRequest
} from '../../src/js/actions'
import {domain, port, protocol} from '../../config.js'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)
const source = 'SourceA'

describe('fields actions', () => {
  describe('sync actions', () => {
    it('fetchSourceFieldsRequest should create a FETCH_SOURCE_FIELDS_REQUEST action', () => {
      const expectedAction = {
        type: FETCH_SOURCE_FIELDS_REQUEST,
        source: source
      }

      expect(fetchSourceFieldsRequest(source)).toEqual(expectedAction)
    })
  })

  describe('async actions', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('creates FETCH_SOURCE_FIELDS_SUCCESS action when fetching datasouces has been done', (done) => {
      nock(`${protocol}://${domain}${port ? ':' + port : ''}`)
        .get(`/sources/${source}/fields`)
        .reply(200, {fields: ['SourceFieldA', 'SourceFieldB']})

      const initialState = {
        fields: []
      }
      const requestAction = {
        type: FETCH_SOURCE_FIELDS_REQUEST,
        source: source
      }
      const recieveAction = {
        type: FETCH_SOURCE_FIELDS_SUCCESS,
        data: [
          'SourceFieldA',
          'SourceFieldB'
        ],
        didInvalidate: false,
        isFetching: false,
        recievedAt: null
      }
      const store = mockStore(initialState)
      store.dispatch(fetchSourceFields(source))
        .then(() => {
          const actions = store.getActions()
          const expectedActions = [
            requestAction,
            recieveAction
          ]

          expectedActions[1].recievedAt = actions[1].recievedAt

          expect(actions).toEqual(expectedActions)
          done()
        })
    })
  })
})