import {connect} from 'react-redux'
import {excludeEmptyFilters} from '../modules/utilities'
import {fetchDashboards} from '../modules/dashboards'
import {fetchVisualizationResults} from '../modules/visualization-results'
import FilterCriteria from './FilterCriteria'
import {verticalTop} from '../styles/common'
import Visualization from './visualization/Visualization'
import {GridList, GridTile} from 'material-ui/GridList'
import React, {Component, PropTypes} from 'react'

const styles = {
  gridList: {
    width: '100%',
    height: '60%',
    overflowY: 'auto',
    marginBottom: 24
  },
  visualization: {
    height: '100%'
  }
}

class Dashboard extends Component {
  static propTypes = {
    dashboard: PropTypes.object.isRequired,
    dashboards: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    filters: PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)

    this.onClickFilter = ::this.onClickFilter
  }

  componentWillMount () {
    const {dashboards, dispatch} = this.props
    const {isFetching} = dashboards

    if (this.props.dashboards || isFetching) {
      return
    }

    dispatch(fetchDashboards())
  }

  onClickFilter () {
    const {dispatch, filters} = this.props
    const {gridList} = this.refs
    const {children} = gridList.props

    React.Children.forEach(children, (child) => {
      const {_id = null} = child.props.visualization

      if (!_id) {
        return
      }

      dispatch(fetchVisualizationResults(
        _id, excludeEmptyFilters(filters))
      )
    })
  }

  render () {
    const {dashboard} = this.props

    if (!dashboard) {
      return null
    }

    const {dispatch} = this.props
    const {visualizations = [], dashboardParams = {}} = dashboard
    const {size = 2, visualizationSizes = []} = dashboardParams
    // Populate the Fields based off of the fields
    // for each visualization's source.
    const fields = {
      data: visualizations.reduce(
        (array, visualization) => {
          const {fields = []} = visualization.source

          return [...array, ...fields]
        }, []
      ),
      isFetching: false
    }

    return (
      <div>
        <FilterCriteria
          fields={fields}
          headerStyle={{
            margin: 0
          }}
          showFilterButton={true}
          style={{
            ...verticalTop,
            marginBottom: '1em'
          }}
          onClickFilter={this.onClickFilter}
        />
        <GridList
          cellHeight={500}
          cols={visualizations.length > 1 ? size : 1}
          padding={0}
          ref='gridList'
          style={styles.gridList}
        >
          {
            visualizations.map((visualization, i) => {
              const isFirst = i === 0
              const isFirstTwo = isFirst || i === 1
              const isLast = i === visualizations.length - 1
              const isLastTwo = isLast || i === visualizations.length - 2
              const size = visualizationSizes[visualization._id]
              let padding = '10px'

              if (isFirst && size === 2 || isFirstTwo && size === 1) {
                padding = '0px 10px 10px 10px'
              }

              if (isLast && size === 2 || isLastTwo && size === 1) {
                padding = '10px 10px 0px 10px'
              }

              return (
                <GridTile
                  cols={size}
                  key={visualization._id}
                  style={{padding}}
                >
                  <Visualization
                    dispatch={dispatch}
                    visualization={visualization}
                  />
                </GridTile>
              )
            })
          }
        </GridList>
      </div>
    )
  }
}

export default connect((state, ownProps) => ({
  dashboards: state.dashboards,
  filters: state.filters
}))(Dashboard)