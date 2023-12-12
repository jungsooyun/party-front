// rpc 설정 골리
const provider = new ethers.providers.Web3Provider(window.ethereum);
provider.send("eth_requestAccounts", []);

// 지갑 설정
const signer = provider.getSigner();

//atomic_base abi
const contractABI = [
    {
        "type": "function",
        "name": "propose",
        "inputs": [
          {
            "name": "proposal",
            "type": "tuple",
            "internalType": "struct PartyGovernance.Proposal",
            "components": [
              {
                "name": "maxExecutableTime",
                "type": "uint40",
                "internalType": "uint40"
              },
              {
                "name": "cancelDelay",
                "type": "uint40",
                "internalType": "uint40"
              },
              {
                "name": "proposalData",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "latestSnapIndex",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "outputs": [
          {
            "name": "proposalId",
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
//const contractAddress = '0xCF0e5Dc35A16914fE1b17Cc016D5f266B7B3384D'; 
// 아토믹에서 만든 컨트랙 주소를 넣어줘야함.
// 하드코딩? 

// 컨트랙트 객체 생성
const contract = new ethers.Contract(contractAddress, contractABI, signer);

async function encodeDistributeProposalData(nftContract, tokenId, user, expires) {
    ethers.utils.defaultAbiCoder;
    // version 5 abicoder
    const encoder = new ethers.utils.AbiCoder();
    // DistributeProposalData 구조체의 각 필드를 인코딩
    return encoder.encode(
        ['address', 'uint256', 'address', 'uint64'],
        [nftContract, tokenId, user, expires]
    );
}

async function propose() {
    //alert('Button clicked! Preparing to submit proposal...');
    // const nowMillis = Date.now();
    // const nowSeconds = Math.floor(nowMillis / 1000);

    // ProposalData 예시 생성
    const user = document.getElementById('toAddress').value;
    //const nftContract = parseInt(document.getElementById('nftcontract').value);
    //const expires = parseInt(document.getElementById('periodSeconds').value);
    const nftContract = '0x72Bb55C70b054Ca8B64C66Ec3f62227F6E59fe35'; // 현우님이 보내준, 건우님이 만들어준 이게 진짜 주소
    const tokenId = 2; // 몇번째인지가 중요한거임. n + 1. 아마도 하드코딩
    //const user = '0x858013142255cad3FD5137bDf4a7A40348Cb4D4a';
    const expires = 17092948070;

    const proposalData = "0x00000004" + (await encodeDistributeProposalData(nftContract, tokenId, user, expires)).substring(2); //"0x00000004": rent는 4번 프로포절

    // Proposal 데이터 인코딩
    const proposal = {
        maxExecutableTime: 1709294807, // maxExecutableTime nowSeconds + 3628800가 기본설정 근데 이걸 execute에서 참조해야돼서 그냥 상수로 둘게요
        cancelDelay: 3628800,       // cancelDelay 기본설정
        proposalData: proposalData
    };

    // 최신 스냅샷 인덱스 설정
    const latestSnapIndex = 0;
    
    const callData = contract.interface.encodeFunctionData("propose", [
        proposal,
        latestSnapIndex
    ]);
    console.log(callData);
    //propose 함수 호출
    try {
        // 가스비 설정
        const gasLimit = 800000; // 예: 100,000 가스 한도
        const gasPrice = 100000000000; // 예: 50 gwei

        const tx = await contract.propose(proposal, latestSnapIndex, {
            gasLimit: gasLimit,
            gasPrice: gasPrice
        });

        console.log('Transaction sent! Hash:', tx.hash);
        await tx.wait();
        console.log('Transaction confirmed.');
        alert('Your proposal has been submitted successfully!');
        window.location.href = 'GuiIdStatus.html';
    } catch (error) {
        console.error('Transaction failed:', error);
        alert('An error occurred while submitting your proposal.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.button5').addEventListener('click', async () => {

      // 이후 로직에 provider와 signer 사용
      // 예: const contract = new ethers.Contract(contractAddress, contractABI, signer);
      propose(signer); // 함수 수정 필요
  });
});

//await propose();
