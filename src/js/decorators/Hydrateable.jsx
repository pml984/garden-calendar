/*
 * This is a decorator that wraps react components. It takes a {String} displayName,
 * and an {Array} of prop keys to be hydrated/dehydrated.
 *
 * Some assumptions are made about how props and hydrate actions are named.
 * props and hydrate actions are camel case:
 *   if your prop is source, than your hydrate action needs to be hydrateSource
 *   if your prop is searchResults, than your hydrate actoin needs to be hydrateSearchResults
 *
 * Usage:
 * @Hydrateable('MyComponent', ['propKey1', 'propKey2'])
 * class MyComponent extends Component {
 *   // rest of class definition
 * }
 */

import {actions} from '../modules/'
import {connect} from 'react-redux'
import {getValueByPath} from '../modules/utilities'
import React, {Component, PropTypes} from 'react'

const localState = {}

@connect()
export const Hydrateable = (displayName, hydrateableProps, uniquePropPath = '') => {
  return (TargetComponent) => {
    return class HydrateableComponent extends Component {
      static propTypes = {
        dispatch: PropTypes.func.isRequired
      }

      componentWillMount () {
        const {dispatch} = this.props
        const uniqueKey = getValueByPath(this.props, uniquePropPath)
        const stateKey = displayName + (uniqueKey ? `_${uniqueKey}` : '')
        const componentState = localState[stateKey] || {}

        hydrateableProps.forEach((prop) => {
          const actionName = `hydrate${prop.charAt(0).toUpperCase()}${prop.substring(1)}`

          dispatch(actions[actionName](componentState[prop]))
        })
      }

      componentWillUnmount () {
        const currentState = this.refs.target.props
        const newLocalState = {}
        const uniqueKey = getValueByPath(this.props, uniquePropPath) || ''
        const stateKey = displayName + (uniqueKey ? `_${uniqueKey}` : '')

        hydrateableProps.forEach((prop) => {
          newLocalState[prop] = currentState[prop]
        })

        localState[stateKey] = newLocalState
      }

      render () {
        return (
          <TargetComponent
            {...this.props}
            ref='target'
          />
        )
      }
    }
  }
}