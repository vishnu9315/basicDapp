import react, {useState, useEffect} from 'react';
import { ethers } from "ethers";



function App() {

  const[greeting, setGreet] = useState('');  
  const[balance, setBalance] = useState();
  const[greetingValue, setGreetingvalue] = useState('');  
  const[depositValue, setDepositvalue] = useState('');
  

       
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contractAddress = "0x4C62c2d757510637906fDdF9C717D28Aaf56130d";

               
          const ABI = [
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "_greeting",
                  "type": "string"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "inputs": [],
              "name": "deposit",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "greet",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "_greeting",
                  "type": "string"
                }
              ],
              "name": "setGreeting",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }
          ];

          // The Contract object
          const contract = new ethers.Contract(contractAddress, ABI, signer);

                    
      useEffect(() => {
        
       const connectwallet =  async() => {
       await provider.send("eth_requestAccounts", []);
      
       }
       const getBalance = async() => {
        const balance = await provider.getBalance(contractAddress);

        const formattedEther = ethers.utils.formatEther(balance);
        setBalance(formattedEther);
      }

      const getGreeting = async() => {
        const greeting = await contract.greet();
        setGreet(greeting);
      }

       connectwallet()
         .catch(console.error);
       
       getBalance()
       .catch(console.error);
       
       getGreeting()
       .catch(console.error);
      })

      
    const handledepositchange = (e) => {
    setDepositvalue(e.target.value);

  }

  const handlegreetingchange = (e) => {
    setGreetingvalue(e.target.value);
  }
  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    console.log(depositValue);
    const ethValue = ethers.utils.parseEther(depositValue);
    const depositUpdate = await contract.deposit({value : ethValue});
    await depositUpdate.wait();
    const balance = await provider.getBalance(contractAddress);

    const formattedEther = ethers.utils.formatEther(balance);
    setBalance(formattedEther);
    setDepositvalue(0);
    

  }
  const handleGreetingSubmit = async (e) => {
    e.preventDefault();
    const greetingUpdate = await contract.setGreeting(greetingValue)
    await greetingUpdate.wait();
    setGreet(greetingValue);
    setGreetingvalue('');
  }

  


  return (
    
    <div className="container" >
          <div className="row mt-5">
            <div className="col">
              <h3>{greeting}</h3>
              <p>contract balance: {balance} ETH</p>
            </div>
            <div className="col">
            <form onSubmit={handleDepositSubmit}>
                      <div className="mb-3">
                        
                        <input type="number" className="form-control" placeholder="0" onChange={handledepositchange} value = {depositValue} />
                        
                      </div>
                      <button type="submit" className="btn btn-success">Deposit</button>
            </form>
            {/* <form className='mt-5'>
            <div className="mb-3 mt-7">
              
              <input type="number" class="form-control" placeholder='0'/>
              </div>
              <button type = "submit" clasname= "btn btn-success"> Withdraw</button>
            </form> */}
            <form className = "mt-5" onSubmit={handleGreetingSubmit}>
                      <div className="mb-3">
                        
                        <input type="text" className="form-control" onChange={handlegreetingchange} value = {greetingValue} />
                        
                      </div>
                      <button type="submit" className="btn btn-dark">Change</button>
            </form>
            </div>
            </div>
        </div>
        
  );
}

export default App;
