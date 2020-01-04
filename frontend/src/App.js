import React from 'react'
class App extends React.Component {

  componentWillMount(){
    fetch('http://localhost:8080')
    .then(res => {
      console.log('hello'); 
      res.json()
    }); 

  }

  render() {
    return (
      <div>
        <h1>Home</h1>
      </div>
    )
  }
}
export default App
