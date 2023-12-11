import { ethers } from "ethers";

// rpc 설정 골리
const provider = new ethers.JsonRpcProvider("https://goerli.infura.io/v3/50e195e9e1cb48dba3b50c212198bc7e");

// 지갑 설정
const signer = new ethers.Wallet("1번지갑", provider);

//atomic_base abi
const contractABI = [
    {
        "type": "function",
        "name": "execute",
        "inputs": [
          {
            "name": "proposalId",
            "type": "uint256",
            "internalType": "uint256"
          },
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
            "name": "preciousTokens",
            "type": "address[]",
            "internalType": "contract IERC721[]"
          },
          {
            "name": "preciousTokenIds",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "progressData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "extraData",
            "type": "bytes",
            "internalType": "bytes"
          }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
];

//골리
const contractAddress = '0xCF0e5Dc35A16914fE1b17Cc016D5f266B7B3384D';

// 컨트랙트 객체 생성
const contract = new ethers.Contract(contractAddress, contractABI, signer);

async function encodeDistributeProposalData(nftContract, tokenId, user, expires) {
    const encoder = ethers.AbiCoder.defaultAbiCoder();
    // DistributeProposalData 구조체의 각 필드를 인코딩
    return encoder.encode(
      ['address', 'uint256', 'address', 'uint64'],
      [nftContract, tokenId, user, expires]
    );
}


async function execute() {

    const proposalId = 1; //몇 번째 프로포절인지 확인해서 바꿔줘야됨

    // ProposalData 예시 생성
    const nftContract = '0x835A7B3f3EB7458D77834A46e4d6e65F5Cb979BA'; 
    const tokenId = 2; 
    const user = '0x858013142255cad3FD5137bDf4a7A40348Cb4D4a'; 
    const expires = 17092948070; // 일단 고정

    const proposalData = "0x00000004" + (await encodeDistributeProposalData(nftContract, tokenId, user, expires)).substring(2); //"0x00000004": Rent는 4번 프로포절

    // Proposal 데이터 인코딩
    const proposal = {
      maxExecutableTime: 1709294807, // maxExecutableTime nowSeconds + 3628800가 기본설정 근데 이걸 execute에서 참조해야돼서 그냥 상수로 둘게요
      cancelDelay: 3628800,       // cancelDelay 기본설정
      proposalData: proposalData
  };

    const preciousTokens = []; // 예시: preciousTokens 배열
    const preciousTokenIds = []; // 예시: preciousTokenIds 배열
    const progressData = '0x'; // 예시: progressData 값 (바이트열)
    const extraData = '0x'; // 예시: extraData 값 (바이트열)

    const callData = contract.interface.encodeFunctionData("execute", [
        proposalId,
        proposal,
        preciousTokens,
        preciousTokenIds,
        progressData,
        extraData
    ]);
    console.log(callData);

    //accept 함수 호출
    try {
        // 가스비 설정
        const gasLimit = 800000; // 예: 100,000 가스 한도
        const gasPrice = 100000000000; // 예: 50 gwei

        const tx = await contract.execute(proposalId, proposal, preciousTokens, preciousTokenIds, progressData, extraData, {
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

await execute();