import React, {useState, Component } from 'react';
const URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=LYKNMNA18ZLXAMOG'
class Axios extends Component {

    constructor(props){
        super(props)
        this.state = {
            information: {}
        }
    }

    componentDidMount = async ()=>{
        const respuesta = await fetch(URL)
        const res = await respuesta.json()
        console.log(res["Time Series (Daily)"]["2020-02-14"]["1. open"])
        this.setState({
            information: res
        })        
    }
  
    render() {
        return (
            <div>
                <button onClick={this.checkData}> checkData</button>
            </div>
        );
    }
}

export default Axios;