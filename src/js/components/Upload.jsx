/* global window */

import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Papa from 'papaparse'
import {FileInput} from 'safe-framework'
import {clearUploadDataTypes, setDialogOpen, setUploadDataTypes, setUploadDataTypeByHeaderName} from '../actions'
import {Dialog, DropDownMenu, FlatButton, MenuItem} from 'material-ui'
import {header, main} from '../styles/common'

const getFileExtension = (fileName) =>
  // From http://stackoverflow.com/a/12900504
  fileName
    .slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2)
    .toLowerCase()

class Upload extends Component {
  static propTypes = {
    dialogOpen: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    uploadDataTypes: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.checkAndParseFile = ::this.checkAndParseFile
    this.parseComplete = ::this.parseComplete
    this.parseError = ::this.parseError
    this.state = {open: false}
  }

  checkAndParseFile (file) {
    const {dispatch} = this.props
    if (getFileExtension(file.name) !== 'csv') {
      this.parseError(new Error('Only CSV files are supported'), file)
      dispatch(clearUploadDataTypes())

      return dispatch(setDialogOpen(true))
    }

    Papa.parse(file, {
      complete: this.parseComplete,
      dynamicTyping: true,
      encoding: 'utf-8',
      error: this.parseError,
      preview: 2
    })
  }

  parseComplete (results, file) {
    const {dispatch} = this.props
    const headers = results.data[0]
    const values = results.data[1]
    const uploadDataTypes = {}

    headers.forEach((header, i) => {
      const value = values[i]

      uploadDataTypes[header] = typeof value
    })
    dispatch(setUploadDataTypes(uploadDataTypes))
  }

  parseError (error, file) {
    console.log(`Error while trying to parse file: ${file.name}`, error)
  }
  
  handleDataTypeChange (header, value) {
    const {dispatch} = this.props
    dispatch(setUploadDataTypeByHeaderName({header, value}))
  }
  
  renderColumnMenu (header, value) {
    return (
      <div key={header}>{header}
        <DropDownMenu
          dispatch={this.props.dispatch}
          header={header}
          value={value}
          onChange={(event, index, value) => this.handleDataTypeChange(header, value)}
        >
          {this.renderMenuItem('number')}
          {this.renderMenuItem('string')}
        </DropDownMenu>
      </div>
    )
  }
  
  renderMenuItem (value) {
    return (
      <MenuItem
        primaryText={value}
        value={value}
      />
    )
  }
  
  renderResults () {
    const {uploadDataTypes} = this.props
    
    if (Object.keys(uploadDataTypes).length !== 0) {
      return (
        Object.keys(uploadDataTypes).map((header) => this.renderColumnMenu(header, uploadDataTypes[header]))
      )
    }
  }

  handleNonCsvDialogClose = () => {
    const {dispatch} = this.props
    dispatch(setDialogOpen(false))
  }
  
  render () {
    const actions = [
      <FlatButton
        key='actionCancel'
        label='OK'
        primary={true}
        onTouchTap={this.handleNonCsvDialogClose}
      />
    ]
    const {dialogOpen} = this.props

    return (
      <div>
        <header style={header}>
          <h1>Data</h1>
        </header>
        <main style={main}>
          <h3>Upload a Dataset</h3>
          <FileInput onChange={this.checkAndParseFile} />
          {this.renderResults()}
        </main>
        <Dialog
          actions={actions}
          modal={true}
          open={dialogOpen}
        >
          Only CSV files are supported.
        </Dialog>
      </div>
    )
  }
}

export default connect((state) => ({
  uploadDataTypes: state.uploadDataTypes,
  dialogOpen: state.dialog
}))(Upload)
