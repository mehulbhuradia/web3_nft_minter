import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import FiredGuys from '../artifacts/contracts/MyNFT.sol/FiredGuys.json';

const contractAddress = '0xfb5dbF65eb1c8FB9fa397Ad6a7B154cAC6BE015d';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, FiredGuys.abi, signer);


function Home() {

  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  return (
    <div>
        <WalletBalance />
      <h1>NFT Collection</h1>
        {Array(totalMinted + 1)
        .fill(0)
        .map((_, i) => (
            <div key={i}>
            <NFTImage tokenId={i} getCount={getCount} />
            </div>
        ))}
    </div>
  );
}
function NFTImage({ tokenId, getCount }) {
    const contentId = 'QmWU8nDYUTagvLE78Da8yHVrP3PdJ5wauGP8CCkVAp5xse';
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
    const [isMinted, setIsMinted] = useState(false);
    useEffect(() => {
      getMintedStatus();
    }, [isMinted]);
  
    const getMintedStatus = async () => {
      const result = await contract.isContentOwned(metadataURI);
      console.log(result)
      setIsMinted(result);
    };
  
    const mintToken = async () => {

      const connection = contract.connect(signer);
      
      const result = await contract.payToMint(metadataURI, {
        value: ethers.utils.parseEther('0.05'),
      });
  
      await result.wait();

      // // i get money
      // const result2 = await contract.withdraw();
  
      // await result2.wait();
      getMintedStatus();
      getCount();
    };
  
    async function getURI() {
      const uri = await contract.tokenURI(tokenId);
      alert(uri);
    }
    // placeholder code doesnt work
    return (
      <div>
        <img src={isMinted ? imageURI : 'img/placeholder.png'} width="200" height="200"></img>
          <h5>ID #{tokenId}</h5>
          {!isMinted ? (
            <button onClick={mintToken}>
              Mint
            </button>
          ) : (
            <button onClick={getURI}>
              Taken! Show URI
            </button>
          )}
      </div>
    );
  }
  
  export default Home;