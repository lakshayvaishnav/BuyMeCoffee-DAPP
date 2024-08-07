import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

function App() {
  const contractAddress = "0x218A65843dCe4ba454Fb253AC75a1A8f547C9FF7";

  const abi = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "message",
          type: "string",
        },
      ],
      name: "NewMemo",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_message",
          type: "string",
        },
      ],
      name: "buyCoffee",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "getMemos",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "message",
              type: "string",
            },
          ],
          internalType: "struct BuyMeACoffee.Memo[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "withdrawTips",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  // componenet state
  const [message, setmessage] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [memos, setMemos] = useState("");

  const onNameChangeEvent = (event) => {
    return setName(event.target.value);
  };

  const onMessageChange = (event) => {
    return setmessage(event.target.value);
  };

  const onAmountChange = (event) => {
    return setAmount(event.target.value);
  };

  // connect to the wallet.

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("please install metamsk");
      }
      const account = await ethereum.request({
        method: "eth_requestAccounts  ",
      });

      setCurrentAccount(account[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // check if already wallet connected.

  const isWalletConnected = async () => {
    try {
      const { ethereum } = window.ethereum;
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      if (accounts > 0) {
        const account = accounts[0];
        alert("wallet is connected to the account : ", account);
      } else {
        alert("make sure metamask is connected");
      }
    } catch (error) {
      console.log("error");
    }
  };

  const buyCoffee = async () => {
    try {
      const { ethereum } = window.ethereum;

      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const buyCoffeeContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );

        const coffeeTxn = await buyCoffeeContract.buyCoffee(
          name ? name : "Lxsh",
          message ? message : "Enjoy your day bruh...",
          { value: amount }
        );

        await coffeeTxn.wait();

        console.log("mined : ", coffeeTxn.hash);

        console.log("coffee Purchased");
        setName("");
        setmessage("");
      } else {
        alert("metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMemos = async () => {
    try {
      const { ethereum } = window.ethereum;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        const buyCoffeeContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        console.log("fetchin memos from chain");

        const memoFetch = await buyCoffeeContract.getMemos();
        console.log("memos fetched !!!");
        setMemos(memoFetch);
      } else {
        console.log("ethereum not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();

    const newMemo = (name, amount, timestamp, userAddress, message) => {
      console.log(
        "memos recieved : ",
        name,
        amount,
        timestamp,
        userAddress,
        message
      );

      setMemos((prevstate) => [
        ...prevstate,
        {
          name,
          amount,
          timestamp: new Date(timestamp * 1000),
          address: userAddress,
          message,
        },
      ]);
    };

    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(contractAddress, abi, signer);

      // adding event listners...
      try {
        buyMeACoffee.once(
          "NewMemo",
          (name, amount, timestamp, userAddress, message) => {
            console.log("emitting new memo calls; ");
            newMemo(name, amount, timestamp, userAddress, message);
          }
        );
      } catch (err) {}
      console.log(err);

      return () => {
        if (buyMeACoffee) {
          buyMeACoffee.off("NewMemo", newMemo);
        }
      };
    }
  }, []);

  return <></>;
}

export default App;
