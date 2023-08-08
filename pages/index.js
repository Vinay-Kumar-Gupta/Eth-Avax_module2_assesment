import {useState, useEffect} from "react";
import {ethers} from "ethers";
import { utils } from 'ethers';
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import Button from 'react-bootstrap/Button';
{
  /* The following line can be included in your src/index.js or App.js file */
}
import 'bootstrap/dist/css/bootstrap.min.css';

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [wei,setWei] = useState(1);
  const [unit,setUnit] = useState("Eth")

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
      // setBalance((BigInt(await atm.getBalance())).toNumber());
      // const balanceBigNumber = await atm.getBalance();
      // const formattedBalance = utils.formatUnits(balanceBigNumber, 18);
      // setBalance(formattedBalance);

    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  // ======================= Conversion functions =================

  const callUnitWeiFunction = async () => {
    try {
      if (atm) {
        const tx = await atm.unit_wei();
        setWei(tx.toString())
        setUnit("Wei")
      }
    } catch (error) {
      console.error('Error calling unit_wei function:', error);
    }
  };
  const callUnitGweiFunction = async () => {
    try {
      if (atm) {
        const tx = await atm.unit_Gwei();
        setWei(tx.toString())
        setUnit("Gwei")
      }
    } catch (error) {
      console.error('Error calling unit_wei function:', error);
    }
  };
  const callUnitFinneyFunction = async () => {
    try {
      if (atm) {
        const tx = await atm.unit_finney();
        setWei(tx.toString())
        setUnit("Finney")
      }
    } catch (error) {
      console.error('Error calling unit_wei function:', error);
    }
  };
  const callUnitEtherFunction = async () => {
    try {
      if (atm) {
        const tx = await atm.unit_ether();
        setWei(tx.toString())
        setUnit("Eth")
      }
    } catch (error) {
      console.error('Error calling unit_wei function:', error);
    }
  };

//  ========================================================================

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <Button variant="info" className=" p-2 fw-normal " onClick={connectAccount}>Please connect your MetaMask Wallet</Button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <> 
    <div className="mt-3">
      <div className="p-2">Your Account: {account}</div>
      <div className="pb-2">Your Balance: {balance}</div>
      <Button variant="primary m-2" onClick={deposit}>Deposit 1 ETH</Button>
      <Button variant="primary" onClick={withdraw}>Withdraw 1 ETH</Button>
      </div>
      <div className="button-container">
      <p>Converted Balance : {wei} {unit} </p>
      <Button variant="secondary" className=" m-1" onClick={callUnitWeiFunction}>Wei</Button>
      <Button variant="danger" className=" m-1" onClick={callUnitGweiFunction}>Gwei</Button>
      <Button variant="warning" className=" m-1" onClick={callUnitFinneyFunction}>Finney</Button>
      <Button variant="success" className=" m-1" onClick={callUnitEtherFunction}>Ether</Button>
    </div>
    </>
     
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container mt-4 font-monospace mb-4 ">
      <header><h1>MetaMask Wallet ATM With Unit Conversion</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
