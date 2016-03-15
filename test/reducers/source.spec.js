/* globals describe, it */

import expect from 'expect'
import {
  SET_SOURCE
} from '../../src/js/actionTypes'
import {
  source as reducer
} from '../../src/js/reducers'

describe('source reducer', () => {
  it('should return the initial state', () => {
    const stateAfter = ''

    expect(reducer(undefined, {})).toEqual(stateAfter)
  })

  it('should handle SET_SOURCE', () => {
    const stateAfter = 'SourceA'
    const action = {
      type: SET_SOURCE,
      value: stateAfter
    }

    expect(reducer(undefined, action)).toEqual(stateAfter)
  })
})