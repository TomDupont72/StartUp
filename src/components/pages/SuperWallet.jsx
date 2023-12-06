import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import { TezosContext } from '../TEZ/TezosContext';
import { EthereumContext } from '../ETH/ETHContext';
import Loading from '../pictures/Loading.gif';

const SuperWallet = () => {

    const { blockchain } = useContext(GlobalContext);

    const { Node, publicKey, superWallet, deleteSpecial, storage, setChange, contractAddress, contractABI } = useContext((blockchain === 'eth') ? EthereumContext : TezosContext);

    const [specialUsers, setSpecialUsers] = useState([]);
    const [publicKeySpecial, setPublicKeySpecial] = useState('');
    const [amountSpecial, setAmountSpecial] = useState('');
    const [durationSpecial, setDurationSpecial] = useState('');
    const [specialUserTest, setSpecialUserTest] = useState(false);
    const [loadingTest, setLoadingTest] = useState(false);

    const navigate = useNavigate();

    const handleHome = () => {
        try {
            navigate('/Accueil');
        } catch (error) {
            console.log(error);
        }
    }

    const handleSuperWallet = async () => {
        try {
            setLoadingTest(false);
            await superWallet(publicKeySpecial, amountSpecial, durationSpecial);

            setPublicKeySpecial('');
            setAmountSpecial('');
            setDurationSpecial('');

            setChange('handleSuperWallet');

        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteSpecial = async (specialUser) => {
        try {
            setLoadingTest(false);
            await deleteSpecial(specialUser[0]);
            
            setChange('handleDeleteSpecial');

        } catch (error) {
            console.log(error);
        }
    }

    window.addEventListener('beforeunload', function (e) {
        localStorage.setItem('change', 'refresh');
    });

    useEffect(() => {
        const getContractInfos = async () => {
            try {
                setChange(localStorage.getItem('change'));
                if (blockchain === 'tez') {
                    const map_special2 = await storage.map_specials2.get(publicKey);
                    const newSpecialUsers = [];

                    if (map_special2 !== undefined) {
                        for (let i = 0; i < map_special2.length; i++) {
                            setSpecialUserTest(true);
                            const newSpecialUser = await storage.specials.get({ 0: map_special2[i], 1: publicKey });
                            newSpecialUsers.push([map_special2[i], newSpecialUser.montant*1e-6, newSpecialUser.delai_s/60]);
                        }
                        setSpecialUsers(newSpecialUsers);
                    }
                } else {
                    const contractETH = new Node.eth.Contract(contractABI, contractAddress);
                    const map_special2Length = await contractETH.methods.longueur_map_specials2(publicKey).call();
                    if (map_special2Length != 0) {
                        setSpecialUserTest(true);
                        const newSpecialUsers = [];
                        for (let i = 0; i < map_special2Length; i++) {
                            const a = await contractETH.methods.map_specials2(publicKey, i).call();
                            const specialUser = await contractETH.methods.specials(a, publicKey).call();
                            newSpecialUsers.push([a, Number(specialUser.montant)*1e-6, Number(specialUser.delai_s)/60]);
                        }
                        setSpecialUsers(newSpecialUsers);
                    }
                }
                localStorage.setItem('change', '');
                setLoadingTest(true);
            } catch (error) {
                console.log(error);
            }
        }
        getContractInfos();
    }, [storage]);

    return (
        <div>
        { loadingTest ?
        <div className='tout'>
            <div className='ligne'>
                <div className='cadre'>
                    <div className='ligne'>
                        <div className='colonne'>
                            <input type='text' className='ecrire' placeholder='Enter a public key' onChange={ e => setPublicKeySpecial(e.target.value)}/>
                            <input type='text' className='ecrire' placeholder='Enter an amount' onChange={ e => setAmountSpecial(e.target.value*1e6)}/>
                            <input type='text' className='ecrire' placeholder='Enter a delay' onChange={ e => setDurationSpecial(e.target.value*60)}/>
                        </div>
                        <input type='button' className='bouton' value='Add a special user' onClick={handleSuperWallet}/>
                    </div>
                    <input type='button' className='bouton' value='Home' onClick={handleHome}/>
                </div>
                { specialUserTest ?
                <div className='cadre'>
                {specialUsers.map((specialUser, index) => 
                    <div className='ligne' key={index}>
                        <div>
                            <h3 className='claim'>Address : {specialUser[0]}</h3>
                            <h3 className='claim'>Amount : {specialUser[1]} {blockchain === 'eth' ? 'Eth' : 'Tez'}</h3>
                            <h3 className='claim'>Delay : {specialUser[2]} minutes</h3>
                        </div>
                        <input type='button' className='bouton' value='Delete' onClick={() => handleDeleteSpecial(specialUser)}/>
                    </div>)}
                </div> : null }
            </div>
        </div> :
        <div className='toutp'>
            <img src={Loading} alt='Loading...' className='loading'/>
        </div>}
        </div>
    );
}

export default SuperWallet;