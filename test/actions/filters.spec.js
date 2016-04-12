/* globals describe, it */

import expect from 'expect'
import {
  ADD_FILTER,
  EDIT_FILTER,
  HYDRATE_FILTERS,
  REMOVE_FILTER,
  RESET_FILTERS
} from '../../src/js/action-types'
import {
  addFilter,
  editFilter,
  hydrateFilters,
  removeFilter,
  resetFilters
} from '../../src/js/actions'

describe('filter actions', () => {
  it('addFilter should create an ADD_FILTER action', () => {
    const filter = {
      id: 0,
      field: 'fieldA',
      operator: '=',
      value: 'fieldAValue'
    }
    const expectedAction = {
      type: ADD_FILTER,
      payload: {filter}
    }

    expect(addFilter(filter)).toEqual(expectedAction)
  })

  it('editFilter should create an EDIT_FILTER action', () => {
    const index = 0
    const value = 'value'
    const expectedAction = {
      type: EDIT_FILTER,
      payload: {index, value}
    }

    expect(editFilter(index, value)).toEqual(expectedAction)
  })

  it('hydrateFilters should create a HYDRATE_FILTERS action', () => {
    const filters = [{
      id: 0,
      field: 'fieldA',
      operator: '=',
      value: 'fieldAValue'
    }]
    const expectedAction = {
      type: HYDRATE_FILTERS,
      state: filters
    }

    expect(hydrateFilters(filters)).toEqual(expectedAction)
  })

  it('removeFilter should create a REMOVE_FILTER action', () => {
    const index = 0
    const expectedAction = {
      type: REMOVE_FILTER,
      payload: {index}
    }

    expect(removeFilter(index)).toEqual(expectedAction)
  })

  it('resetFilters should createa RESET_FILTERS action', () => {
    const expectedAction = {
      type: RESET_FILTERS
    }

    expect(resetFilters()).toEqual(expectedAction)
  })
})