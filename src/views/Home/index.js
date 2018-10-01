import React from 'react'

const Jumbotron = () => (
  <div className="jumbotron jumbotron-fluid">
    <div className="container">
      <h1 className="display-4">Shh... Chat</h1>
    </div>
  </div>
)

const Home = () => (
  <div className="container">
    <Jumbotron />

    <div className="row">
      <div className="col-8">
        lorem ipsum
      </div>
      <div className="col-4">
        lorem ipsum
      </div>
    </div>
  </div>
)

export default Home