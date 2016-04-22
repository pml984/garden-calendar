import {apiUri} from '../../../config'
import fetch from 'isomorphic-fetch'

export const REQUEST = 'safe-app/search-results/REQUEST'
export const SUCCESS = 'safe-app/search-results/SUCCESS'

export const fetchSearchResultsRequest = (source, filters) => ({
  type: REQUEST,
  payload: {filters, source}
})

export const fetchSearchResultsSuccess = (data) => ({
  payload: {data},
  didInvalidate: false,
  isFetching: false,
  recievedAt: Date.now(),
  type: SUCCESS
})

export const fetchSearchResults = (source, filters) =>
  (dispatch) => {
    dispatch(fetchSearchResultsRequest(source, filters))
    
    return fetch(`${apiUri}/sources/${source}/query`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({filters})
      })
      .then((response) => response.json(), (err) => console.error(err))
      .then((json) => dispatch(fetchSearchResultsSuccess(json)))
  }

const initialState = {
  data: [],
  didInvalidate: false,
  isFetching: false,
  lastUpdated: null
}

export default (state = initialState, {payload = {}, type, ...action}) => {
  const {data} = payload

  switch (type) {
    case REQUEST:
      return {
        ...state,
        didInvalidate: false,
        isFetching: true
      }
    case SUCCESS:
      return {
        ...state,
        data,
        didInvalidate: false,
        isFetching: false,
        lastUpdated: action.recievedAt
      }
    default:
      return state
  }
}