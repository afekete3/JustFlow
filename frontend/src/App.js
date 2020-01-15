import React from 'react'
import queryString from 'query-string'
class App extends React.Component {


  render() {
    return (
      <div>
        <h1>Home</h1>
        <button onClick={()=>window.location='http://localhost:8080/'}> login </button> 
      </div>
    )
  }

  componentDidMount(){
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed['access_token']
  }

}
export default App
