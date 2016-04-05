import fetch from 'isomorphic-fetch'
import {
  FETCH_SEARCH_RESULTS_REQUEST,
  FETCH_SEARCH_RESULTS_SUCCESS
} from '../actionTypes'
import {apiUri} from '../../../config'

export const fetchSearchResultsSuccess = (json) => ({
  data: json,
  didInvalidate: false,
  isFetching: false,
  recievedAt: Date.now(),
  type: FETCH_SEARCH_RESULTS_SUCCESS
})

export const fetchSearchResultsRequest = (source, filters) => ({
  type: FETCH_SEARCH_RESULTS_REQUEST,
  source,
  filters
})

export const fetchSearchResults = (source, filters) =>
  (dispatch) => {
    dispatch(fetchSearchResultsRequest(source, filters))
    return fetch(`${apiUri}/search/${source}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({filters})
      })
      .then((response) => response.json(), (err) => console.log(err))
      .then((json) => dispatch(fetchSearchResultsSuccess(json)))
  }