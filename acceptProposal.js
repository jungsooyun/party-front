import { ethers } from "ethers";

// rpc 설정 골리
//const provider = new ethers.JsonRpcProvider("https://goerli.infura.io/v3/50e195e9e1cb48dba3b50c212198bc7e");
// rpc 설정 베이스
//const provider = new ethers.JsonRpcProvider("https://base.llamarpc.com");

// 지갑 설정
//const signer = new ethers.Wallet("2번지갑", provider);

const provider = new ethers.providers.Web3Provider(window.ethereum);
provider.send("eth_requestAccounts", []);

// 지갑 설정
const signer = provider.getSigner();

//atomic_base abi
const contractABI = [
    {
        "type": "function",
        "name": "accept",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "snapIndex",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [
          {
            "name": "totalVotes",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "nonpayable"
    }
];

const contractAddress = sessionStorage.getItem('partyAddress');
if (contractAddress) {
    console.log('Saved Party Address:', contractAddress);
    // 여기에서 savedPartyAddress를 사용합니다.
    // 예: 다른 함수 호출 또는 UI 업데이트
} else {
    console.log('No Party Address found in this session');
}
//골리
//const contractAddress = '0xa8f0df2fa7b5f38386d86e0e0bcab6b29e2771eb';
//베이스
//const contractAddress = '0x755793ca421e054d4c62797319e5409414bd21a4';

// 컨트랙트 객체 생성
const contract = new ethers.Contract(contractAddress, contractABI, signer);

async function accept() {

    const proposalId = 14; // proposal 생성시 리턴되는 id. 1부터 올라감. 시연때는 1로 하면 될듯
    const snapIndex = 0;

    const callData = contract.interface.encodeFunctionData("accept", [
        proposalId,
        snapIndex
    ]);
    console.log(callData);

    //propose 함수 호출
    try {
        // 가스비 설정
        const gasLimit = 700000; // 예: 100,000 가스 한도
        const gasPrice = 100000000000; // 예: 50 gwei

        const tx = await contract.accept(proposalId, snapIndex, {
            gasLimit: gasLimit,
            gasPrice: gasPrice
        });

        console.log('Transaction sent! Hash:', tx.hash);
        await tx.wait();
        console.log('Transaction confirmed.');
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.button7').addEventListener('click', async () => {

      // 이후 로직에 provider와 signer 사용
      // 예: const contract = new ethers.Contract(contractAddress, contractABI, signer);
      propose(signer); // 함수 수정 필요
  });
});


//await accept();