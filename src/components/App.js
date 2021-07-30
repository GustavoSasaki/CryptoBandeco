import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Color from '../abis/Color.json'

import logo1 from '/home/g/Desktop/nft/src/components/21-07.png';
import logo2 from '/home/g/Desktop/nft/src/components/22-07.png';
import logo3 from '/home/g/Desktop/nft/src/components/23-07.png';
import logo6 from '/home/g/Desktop/nft/src/components/26-07.png';
import logo7 from '/home/g/Desktop/nft/src/components/27-07.png';
import logo8 from '/home/g/Desktop/nft/src/components/28-07.png';
import logo9 from '/home/g/Desktop/nft/src/components/29-07.png';

var dict = {
  "21-07": logo1,
  "22-07": logo2,
  "23-07": logo3,
  "26-07": logo6,
  "27-07": logo7,
  "28-07": logo8,
  "29-07": logo9,  
};

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colors: []
    }
  }

  async loadWeb3() {
    if (!window.web3){
      window.alert('Use MetaMask para usar este site')
      return;
    }
    
    window.web3 = new Web3(window.web3.currentProvider)
  }

  async loadBlockchainData() {
    const web3 = window.web3

    //Carregar contas
    const contas = await web3.eth.getAccounts()
    this.setState({ account: contas[0] })

    //Carregar informaçao da rede
    const idRede = await web3.eth.net.getId()
    const dataRede = Color.networks[idRede]

    if(!dataRede){
      window.alert('Erros nos smart contracts')
      return;
    }

    const contract = new web3.eth.Contract(Color.abi, dataRede.address)
    this.setState({ contract })

    const totalSupply = await contract.methods.totalSupply().call()
    this.setState({ totalSupply })

    //Carregar informaçao de cada menu
    for (var i = 0; i < totalSupply; i++) {
      const color = await contract.methods.colors(i).call()
      this.setState({
        colors: [...this.state.colors, color]
      })
    }

  }

  //Criar o token
  mint = (color) => {
    this.state.contract.methods.mint(color).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        colors: [...this.state.colors, color]
      })
    })
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  render() {
    return (
      <div>
        <div className="cryptoBandecoHeader">
          <nav className="navbar fixed-top flex-md-nowrap p-0 shadow">
            <a
              className="navbar-brand col-sm-3 col-md-2 mr-0 textoNavBar"
              target="_blank"
              rel="noopener noreferrer"
            >
              CryptoBandeco
            </a>
            <ul className="navbar-nav px-3 ">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <small className="textoNavBar"><span id="account">Conta: {this.state.account} </span></small>
              </li>
            </ul>
          </nav>
        </div>

        <div className="container-fluid mt-5">
          <div>

            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Criar Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const color = this.color.value
                  this.mint(color)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1 '
                    placeholder='Exemplo: 01-01'
                    ref={(input) => { this.color = input }}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary buttonMint textoNavBar'
                    value='Crie Crypto Bandeco Menu'
                  />
                </form>
              </div>

              <div></div>
            </main>
          </div>
          <hr/>
          <div className="row text-center containerr">
            { this.state.colors.map((color, key) => {
              return(
                <div key={key}>
                  <ShowImage  className="token" rightImage={color} />

                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

function ShowImage(props) {
  const rightImage = props.rightImage;

  if(rightImage in dict){
    return <div ><img src={dict[rightImage]} />  <hr /> </div>;
  }

  return <div> <p>Sem imagem (hash: {props.rightImage})</p> <hr /> </div>;
}

export default App;
