import { ethers } from "ethers";


async function createPartyTransaction() {

    // Web3Provider를 사용하여 MetaMask와 연결
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    // MetaMask 계정의 Signer를 가져옴
    const signer = provider.getSigner();

    // 컨트랙트 ABI와 주소
    const contractABI = [
        {"inputs":[{"internalType":"contract Party","name":"partyImpl","type":"address"},{"components":[{"components":[{"internalType":"address[]","name":"hosts","type":"address[]"},{"internalType":"uint40","name":"voteDuration","type":"uint40"},{"internalType":"uint40","name":"executionDelay","type":"uint40"},{"internalType":"uint16","name":"passThresholdBps","type":"uint16"},{"internalType":"uint96","name":"totalVotingPower","type":"uint96"},{"internalType":"uint16","name":"feeBps","type":"uint16"},{"internalType":"address payable","name":"feeRecipient","type":"address"}],"internalType":"struct PartyGovernance.GovernanceOpts","name":"governance","type":"tuple"},{"components":[{"internalType":"bool","name":"enableAddAuthorityProposal","type":"bool"},{"internalType":"bool","name":"allowArbCallsToSpendPartyEth","type":"bool"},{"internalType":"bool","name":"allowOperators","type":"bool"},{"internalType":"bool","name":"distributionsRequireVote","type":"bool"}],"internalType":"struct ProposalStorage.ProposalEngineOpts","name":"proposalEngine","type":"tuple"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"customizationPresetId","type":"uint256"}],"internalType":"struct Party.PartyOptions","name":"opts","type":"tuple"},{"internalType":"contract IERC721[]","name":"preciousTokens","type":"address[]"},{"internalType":"uint256[]","name":"preciousTokenIds","type":"uint256[]"},{"internalType":"uint40","name":"rageQuitTimestamp","type":"uint40"},{"internalType":"address[]","name":"partyMembers","type":"address[]"},{"internalType":"uint96[]","name":"partyMemberVotingPowers","type":"uint96[]"}],"name":"createParty","outputs":[{"internalType":"contract Party","name":"party","type":"address"}],"stateMutability":"nonpayable","type":"function"}
    ];
    const contractAddress = '0x4ae2533869b9e40e52526f6ed5b607cd80b7365d';

    // 컨트랙트 객체 생성
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // ... 이하 코드 동일 ...
    // 입력값 설정
    const partyImpl = '0x8f228554287f7e00042411ef42a531f87b267aff';
    const governance = {
        hosts: ["0x858013142255cad3FD5137bDf4a7A40348Cb4D4a"], // 적절한 값으로 설정
        voteDuration: 604800, // 적절한 값으로 설정(기본 설정은 7일 인듯) https://basescan.org/tx/0xadc9e390acfd9becde930d7b208d623ec0368aac52edb05aec001e6e2b13acfb의 16번줄
        executionDelay: 1, // 적절한 값으로 설정(기본은 1인데 뭐하는 놈인지는 잘 모름) 스캔 Input Data 17번줄
        passThresholdBps: '5000', // 50프로를 의미, 이 투표율을 넘기면 프로포절 통과 스캔 Input Data 18번줄
        totalVotingPower: '2000000000000000000', // 기본 설정이었음 (유저당 1000000000000000000로 아래에 설정됨 기본설정인듯)
        feeBps: 250, // 기본설정
        feeRecipient: '0xf498fd75ee8d35294952343f1a77cae5ea5af6aa' // 기본설정
    };
    const proposalEngine = {
        enableAddAuthorityProposal: true, // 기본설정
        allowArbCallsToSpendPartyEth: true, // 기본설정
        allowOperators: true, // 기본설정
        distributionsRequireVote: true // 기본설정
    };
    const opts = {
        name: 'abcde',
        symbol: 'abcde',
        customizationPresetId: 1,
        governance: governance,
        proposalEngine: proposalEngine
    };
    const preciousTokens = []; // 기본설정
    const preciousTokenIds = []; // 기본설정
    const rageQuitTimestamp = 0; // 기본설정
    const partyMembers = ['0x858013142255cad3FD5137bDf4a7A40348Cb4D4a', '0x9e5E2C11A2f6FacB236FD3C345025103dDe190c7'];
    const partyMemberVotingPowers = ['1000000000000000000', '1000000000000000000'];

    const callData = contract.interface.encodeFunctionData("createParty", [
        partyImpl,
        opts,
        preciousTokens,
        preciousTokenIds,
        rageQuitTimestamp,
        partyMembers,
        partyMemberVotingPowers
    ]);
    console.log(callData);

    // 트랜잭션 제출
    try {
        // 트랜잭션 옵션 설정 (가스 한도 및 가스 가격은 필요에 따라 조정)
        const options = {
            gasLimit: 800000,
            gasPrice: ethers.utils.parseUnits('50', 'gwei')
        };

        // 트랜잭션 전송
        const tx = await contract.createParty(partyImpl, opts, preciousTokens, preciousTokenIds, rageQuitTimestamp, partyMembers, partyMemberVotingPowers, options);

        console.log('Transaction sent! Hash:', tx.hash);

        // 트랜잭션 확인 대기
        const receipt = await tx.wait();

        // 결과 처리
        const partyAddress = receipt.logs[1].address;
        console.log('New Party Address:', partyAddress);
        console.log('Transaction confirmed.');
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

// Event listener for the button click
document.addEventListener('DOMContentLoaded', () => {
    const startGuildButton = document.getElementById('startGuildButton');
    if (startGuildButton) {
        startGuildButton.addEventListener('click', createPartyTransaction);
    }
});
