import {connect} from 'react-redux'
import ContentAdd from 'material-ui/lib/svg-icons/content/add'
import ContentRemove from 'material-ui/lib/svg-icons/content/remove'
import {FloatingActionButton, MenuItem, SelectField, TextField} from 'material-ui'
import React, {Component, PropTypes} from 'react'

class FilterCriteria extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    filters: PropTypes.array.isRequired,
    style: PropTypes.object,
    wrapperStyle: PropTypes.object,
    onAdd: PropTypes.func.isRequired,
    onChangeField: PropTypes.func.isRequired,
    onChangeOperator: PropTypes.func.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
  }

  static defaultProps = {
    style: {},
    wrapperStyle: {}
  }

  render () {
    const {
      fields,
      filters,
      style,
      wrapperStyle,
      onAdd,
      onChangeField,
      onChangeOperator,
      onChangeValue,
      onRemove
    } = this.props

    return (
      <div style={wrapperStyle}>
        <h3>Select filter criteria (optional)</h3>
        {
          filters.map((filter, i) => (
            <div key={i}>
              <SelectField
                floatingLabelText='Select a field'
                hintText='Select a field'
                style={style}
                value={filter.field}
                onChange={(ev, index, value) => onChangeField(i, value)}
              >
                {
                  fields.data.map((field) => (
                    <MenuItem
                      key={field._id}
                      primaryText={field.name}
                      value={field.name}
                    />
                  ))
                }
              </SelectField>
              <SelectField
                floatingLabelText='Select an operator'
                hintText='Select an operator'
                style={style}
                value={filter.operator}
                onChange={(ev, index, value) => onChangeOperator(i, value)}
              >
                <MenuItem
                  primaryText='='
                  value={'='}
                />
                <MenuItem
                  primaryText='>'
                  value={'>'}
                />
                <MenuItem
                  primaryText='>='
                  value={'>='}
                />
                <MenuItem
                  primaryText='<'
                  value={'<'}
                />
                <MenuItem
                  primaryText='<='
                  value={'<='}
                />
              </SelectField>
              <TextField
                floatingLabelText='Filter Criteria'
                hintText='Filter Criteria'
                style={style}
                value={filter.value}
                onChange={(ev, field) => onChangeValue(i, ev.target.value, filter.field, fields.data)}
              />
              {(() => {
                if (filters.length !== 1) {
                  return (
                    <FloatingActionButton
                      mini={true}
                      primary={true}
                      style={{
                        ...style,
                        margin: '1em 0 0 1em'
                      }}
                      onTouchTap={(ev) => onRemove(ev, i)}
                    >
                      <ContentRemove />
                    </FloatingActionButton>
                  )
                }
              })()}
              {(() => {
                if (i === filters.length - 1) {
                  return (
                    <FloatingActionButton
                      mini={true}
                      secondary={true}
                      style={{
                        ...style,
                        margin: '1em 0 0 1em'
                      }}
                      onTouchTap={onAdd}
                    >
                      <ContentAdd />
                    </FloatingActionButton>
                  )
                }
              })()}
            </div>
          ))
        }
      </div>
    )
  }
}

export default connect((state) => ({
  fields: state.fields,
  filters: state.filters
}))(FilterCriteria)