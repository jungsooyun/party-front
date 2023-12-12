// contractAddress, tokenID가 변수로 주어져야함

import { ethers } from "ethers";

// Provider 설정
const provider = new ethers.providers.Web3Provider(window.ethereum);

// 컨트랙트 주소 및 ABI 정의
// ERC4907 미리 배포한 컨트랙트
const contractAddress = '0x72Bb55C70b054Ca8B64C66Ec3f62227F6E59fe35';
const contractABI = [
    {
        "inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"userOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"userExpires","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"
    }
];

// 컨트랙트 인스턴스 생성
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// tokenId 정의
const tokenId = 0; // 실제 사용할 토큰 ID로 변경  NOTE: 얘를 동적으로 받아줘야합니다.
// //

async function getOwnerOf(tokenId) {
    try {
        const owner = await contract.ownerOf(tokenId);
        console.log(`The owner of tokenId ${tokenId} is: ${owner}`);
        document.getElementById("user-value").innerText = `User: ${owner}`;
    } catch (error) {
        console.error('Error:', error);
    }
}


async function getUserOf(tokenId) {
    try {
        const renter = await contract.userOf(tokenId);
        console.log(`The renter of tokenId ${tokenId} is: ${renter}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getExpires(tokenId) {
    try {
        const blockTimestamp = Number(await contract.userExpires(tokenId));
        const date = new Date(blockTimestamp * 1000);

        // 연도, 월, 일을 추출합니다.
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // 월과 일이 한 자리 숫자일 경우 앞에 0을 붙입니다.
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;

        // YYYY-MM-DD 형식으로 포맷팅
        const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

        // 혹은 const formattedDate = date.toISOString(); 로 바로 변환

        // 결과 출력
        console.log(`The expire date of tokenId ${tokenId} is: ${formattedDate}`);
        document.getElementById('expire-at-value').innerText = `Expire at: ${formattedDate}`;
        // 지금 디폴트 셋은 2511년 8월 28일. proposer관련 코드의 expires 값 17092948070에서 1709294807로 바꿔도 될듯
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('nft-contract-value').innerText = `nftContract: ${contractAddress}`;

// 함수 호출
// await getOwnerOf(tokenId);
// await getUserOf(tokenId);
// await getExpires(tokenId);
