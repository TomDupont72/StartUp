import './Style.css';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { TezosContext } from './components/TEZ/TezosContext';
import { EthereumContext } from './components/ETH/ETHContext';
import { GlobalContext } from './components/GlobalContext';

function HomePage() {

    const { blockchain, setBlockchain } = useContext(GlobalContext);

    const navigate = useNavigate();
    const { publicKey, connectWallet, setChange } = useContext((blockchain === 'eth') ? EthereumContext : TezosContext);

    
    const handleConnectWallet = async () => {
        try {
            await connectWallet();
            setChange('handleConnectWallet');
        } catch (error) {
            console.log(error);
        }
    };

     useEffect(() => {
        if(publicKey) {
            navigate('/Accueil');
        }
    }, [publicKey, navigate]); 

    return (
        <div className='tout'>
            <h1>Welcome on {blockchain === 'eth' ? 'Ethereum' : 'Tezos'}</h1>
            <input type='button' value='Connect Wallet' className='bouton' onClick={handleConnectWallet}/>
            <input type='button' value='Back' className='bouton' onClick={() => setBlockchain('')}/>
        </div>
    );
}

export default HomePage;
