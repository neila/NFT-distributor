import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import sapientia from './assets/ETH-dApp-sapientia.png';
import constantia from './assets/ETH-NFT-collection-constantia.png';
import utilitas from './assets/ETH-game-utilitas.png';
import raritas from './assets/Polygon-Generative-NFT-raritas.png';
import exploratio from './assets/Solana-NFT-drop-exploratio.png'
import React, {useEffect, useState, useRef} from "react";
import { ethers } from "ethers";
import { ChaiPassNFT } from "./utils";


// Constants
const TWITTER_HANDLE = '_k1ddx';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const RARIBLE_LINK = 'https://rinkeby.rarible.com/token/';
const OPENSEA_LINK = 'https://testnet.opensea.io/assets/mumbai/';

const CONTRACT_ADDRESS = "0xbD33f61CbdaE01edA17F46D481c3B25676515328";

const App = () => {
  
    const [currentAccount, setCurrentAccount] = useState("");
    const [showLoading, setShowLoading] = useState(false);

    const checkIfWalletIsConnected = async() => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request(
            { method: 'eth_accounts'}
        );

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
            setupEventListener();
        } else {
            console.log("No authorized account found");
        }

        let chainId = await ethereum.request({ method: 'eth_chainId' });
        
        console.log("Connected to chain " + chainId);
        
        // Polygon Main network chain ID
        const maticMainNetID = "0x89"; 
        // const mumbaiID = "0x13881"
        if (chainId !== maticMainNetID) {
            alert("You are not connected to the MATIC Mainnet!");    
        } else {
          console.log("You are connected to MATIC Mainnet.")
        }
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            
            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);  

            setupEventListener()   
        } catch (error) {
            console.log(error);
        }
    }

    // Setup our listener.
    const setupEventListener = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ChaiPassNFT.abi, signer);

                connectedContract.on(
                    "newTokenMinted", (sender, from, tokenId) => {
                        alert("Passport sent to: \n" + RARIBLE_LINK + CONTRACT_ADDRESS + ":" + tokenId 
                        + "\n \n or alternatively: \n" + OPENSEA_LINK + CONTRACT_ADDRESS + "/" + tokenId);
                        setShowLoading(false);
                    }
                );
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const inputAddress = useRef(null);
    const askContractToGrantAdminRole = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                let recipient = inputAddress.current.value
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ChaiPassNFT.abi, signer);

                const grantAdminTxn = await connectedContract.grantAdminRole(recipient);
                
                console.log("Granting admin role to %s, hold on...", recipient);
                
                setShowLoading(true);
                await grantAdminTxn.wait();
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const askContractToGrantMinterRole = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                let recipient = inputAddress.current.value
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ChaiPassNFT.abi, signer);

                const grantMinterTxn = await connectedContract.grantMinterRole(recipient);
                
                console.log("Granting minter role to %s, hold on...", recipient);

                setShowLoading(true);
                await grantMinterTxn.wait();
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const askContractToMintNft = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                // check if address exists, otherwise throw error
                let recipient = inputAddress.current.value
                console.log("recipient address:", ethers.utils.getAddress(recipient));

                // check which passport was selected
                let passport = document.querySelector('input[name = "passport"]:checked').value;
                switch (passport) {
                    case "sapientia":
                        {
                            var passportHash = "QmSAm1pzAfXxSmjH9bSJbf1WfaDbgsxnstPtj4cbXZathX";
                            break;
                        }
                    case "constantia":
                        {
                            var passportHash = "Qmcj4qnFwmTwe63LTw8kkaucqjT3BShwK1yCboq5mdUufe";
                            break;
                        }
                    case "utilitas":
                        {
                            var passportHash = "QmcJmVow43ESMimrpub9NsWHBvBtbRwyF8L1qKQjzwed5Y";
                            break;
                        }
                    case "raritas":
                        {
                            var passportHash = "QmPpY1CkNHUpaEn5yM65W6WkpjnJgExW8RMKih6hqp88SX";
                            break;
                        }
                    case "exploratio":
                        {
                            var passportHash = "QmWQE4ptkWTVohstZM86Aj3Hg7LDpeSVQepZYrfq5Z9KPT";
                            break;
                        }
                    default:
                        {
                            throw new Error('passport' + passport + "doesn't exist.")
                        }
                }
                console.log("passport:", passport);
                console.log("passportHash:", passportHash);

                // connect to contract from client's wallet
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ChaiPassNFT.abi, signer);
                
                console.log("Going to pop wallet now to pay gas...")

                // call contract's mintNFT function from connected wallet address and mint NFT to recipient address.
                let nftTxn = await connectedContract.mintNFT(recipient, passport, passportHash);
                
                console.log("Minting Unchain Passport, hold on...");

                setShowLoading(true);
                await nftTxn.wait();
            
            } else {
                console.log("Ethereum object doesn't exist!");
                setShowLoading(false)
            }
        } catch (error) {
            console.log(error);
            setShowLoading(false);
        }
    }

    const modalMint = () => {
        askContractToMintNft();
        setShowLoading(false);
    }

    const modalGrantMinter = () => {
        askContractToGrantMinterRole();
        setShowLoading(false);
    }

    const modalGrantAdmin = () => {
        askContractToGrantAdminRole();
        setShowLoading(false);
    }

    useEffect(() => {
      checkIfWalletIsConnected();
    }, [])

    return (
        <>
        <div className="App">
            <div className="container">
                
                <div className="header-container">
                    <span className="header gradient-digi">UNCHAIN </span>
                    <span className="header gradient-hana">PASSPORT</span>
                    <h2>Mint UNCHAIN Passports to those who finished the challenges.</h2>
                    {currentAccount === "" ? (
                        <button onClick={connectWallet} className="cta-button connect-wallet-button">Connect to Wallet</button>
                        ) : (
                        <div>
                            <form className="passport-container">
                                <div className="passport-box">
                                    <img src={sapientia} width="250px"/>
                                    <div>
                                        <input type="radio" id="sapientia" name="passport" value="sapientia" />
                                        <label htmlFor="sapientia">ETH-dApp</label>
                                    </div>
                                </div>

                                <div className="passport-box">
                                    <img src={constantia} width="250px"/>
                                    <div>
                                        <input type="radio" id="constantia" name="passport" value="constantia" />
                                        <label htmlFor="constantia">ETH-NFT-Collection</label>
                                    </div>
                                </div>

                                <div className="passport-box">
                                    <img src={utilitas} width="250px"/>
                                    <div>
                                        <input type="radio" id="utilitas" name="passport" value="utilitas" />
                                        <label htmlFor="utilitas">ETH-NFT-Game</label>
                                    </div>
                                </div>

                                <div className="passport-box">
                                    <img src={raritas} width="250px"/>
                                    <div>
                                        <input type="radio" id="raritas" name="passport" value="raritas" />
                                        <label htmlFor="raritas">MATIC-PFP-Collection</label>
                                    </div>
                                </div>

                                <div className="passport-box">
                                    <img src={exploratio} width="250px"/>
                                    <div>
                                        <input type="radio" id="exploratio" name="passport" value="exploratio" />
                                        <label htmlFor="exploratio">Solana-NFT-Collection</label>
                                    </div>
                                </div>
                            </form>

                            <div><input type="text" ref={inputAddress} placeholder="recipient address"></input></div>
                            <button className="cta-button mint-button" onClick={modalMint}>mint UnchPass</button>
                        </div>
                        )
                    }
                </div>

                <div className="footer-supercontainer">
                    <div className="footer-container">
                        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />      
                        <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built by @${TWITTER_HANDLE}`}</a>
                    </div>
                    <div className="grant-role-buttons-container">
                        <button className="cta-button grant-minter-button" onClick={modalGrantMinter}>grant minter role</button>
                        <button className="cta-button grant-admin-button" onClick={modalGrantAdmin}>grant admin role</button>
                    </div>
                </div>

            </div>
        </div>
        
        {showLoading ? (
            
            <div className="modalfill">
                <p className="loading header gradient-digi">Minting and sending recipient UnchPass (or granting roles, if that's what you selected). Hold on...</p>
            </div>
        ) : null}
        
    </>
        
    );
};

export default App;
