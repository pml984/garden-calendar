import numeral from 'numeral'
import React, {PropTypes} from 'react'

export const SummaryComponent = ({data}) => {
  const style = {
    flexColumn: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center'
    },
    flexWrapper: {
      display: 'flex',
      flexDirection: 'row',
      flexFlow: 'row wrap',
      justifyContent: 'space-around'
    }
  }

  return (
    <div style={style.flexColumn}>
    <div style={style.flexWrapper}>
      {
        data.map((item, i) => {
          const key = Object.keys(item)[0]

          return (
            <div key={i}>
              <h2>
                {numeral(item[key]).format('0,0')}
               </h2>
              <h4>
                {key}
              </h4>
            </div>
           )
        })
      }
    </div>
    </div>
  )
}

SummaryComponent.propTypes = {
  data: PropTypes.array.isRequired
}