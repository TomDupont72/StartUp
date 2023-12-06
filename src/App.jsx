import React, { useContext } from 'react';  
import { GlobalContext } from './components/GlobalContext';
import BrowserRouter, { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Accueil from './components/pages/Accueil';
import Secure from './components/pages/Secure';
import Claim from './components/pages/Claim';
import Refuse  from './components/pages/Refuse';
import SuperWallet from './components/pages/SuperWallet';
import NFT from './components/pages/NFT';
import EthereumProvider from './components/ETH/ETHContext';
import TezosProvider from './components/TEZ/TezosContext';
import tezosImage from './components/pictures/Tezos.png';
import ethereumImage from './components/pictures/Ethereum.png';

const App = () => {
  const { blockchain, setBlockchain } = useContext(GlobalContext);

  return (
    <>
      {
        (blockchain === '') ? 
        <div className='tout'>
          <h1>Choose a Blockchain</h1>
          <div className='ligne'>
            <button className='bouton' onClick={() => setBlockchain("tez")}>
              <img src={tezosImage} className='image' id='Tezos'/>
              <span className='texte'>Tezos</span>
            </button>
            <button className='bouton' onClick={() => setBlockchain("eth")}>
            <img src={ethereumImage} className='image' id='Ethereum'/>
              <span className='texte'>Ethereum</span>
            </button>
          </div>
        </div> :
        (blockchain === 'tez') ? 
         <TezosProvider>
          <Router basename='/BackOnChain'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Accueil" element={<Accueil />} />
              <Route path="/Accueil/Secure" element={<Secure />} />
              <Route path="/Accueil/Claim" element={<Claim />} />
              <Route path="/Accueil/Refuse" element={<Refuse />} />
              <Route path="/Accueil/SuperWallet" element={<SuperWallet />} />
              <Route path="/Accueil/NFT" element={<NFT />} />
            </Routes>
          </Router>
        </TezosProvider> :
        <EthereumProvider>
          <Router basename='/BackOnChain'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Accueil" element={<Accueil />} />
              <Route path="/Accueil/Secure" element={<Secure />} />
              <Route path="/Accueil/Claim" element={<Claim />} />
              <Route path="/Accueil/Refuse" element={<Refuse />} />
              <Route path="/Accueil/SuperWallet" element={<SuperWallet />} />
              <Route path="/Accueil/NFT" element={<NFT />} />
            </Routes>
          </Router>
        </EthereumProvider> 
      }
    </>
  );
};

export default App;