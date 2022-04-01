import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React, { useState } from "react";
import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts, tx, writeContracts }) {

  const [selectedOption, setSelectedOption] = useState();

  const options = [
    {
      id: 0,
      icon: "🪨",
      name: "Rock",
    },
    {
      id: 1,
      icon: "📰",
      name: "Paper",
    },
    {
      id: 2,
      icon: "✂️",
      name: "Scissors",
    },
  ]


  const currentRound = useContractReader(readContracts, "RockPaperScissors", "getCurrentRound");
  console.log(currentRound && currentRound.toNumber);

  const shoot = async () => {
    const result = tx(writeContracts.RockPaperScissors.shoot(selectedOption, {value: ethers.utils.parseEther("0.01")}), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" 🍾 Transaction " + update.hash + " finished!");
        console.log(
          " ⛽️ " +
          update.gasUsed +
          "/" +
          (update.gasLimit || update.gas) +
          " @ " +
          parseFloat(update.gasPrice) / 1000000000 +
          " gwei",
        );
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  }

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>🪨📰✂️</h2>
        <h4>Current round: {currentRound && currentRound.toNumber()}</h4>
        <div style={{ marginTop: "45px" }}>
          {options.map((op) =>
            <Button
              style={{
                height: "100px",
                width: "100px",
                marginLeft: "10px",
                marginRight: "10px",
                borderColor: (op.id === selectedOption) && "#40a9ff",
                color: (op.id === selectedOption) && "#40a9ff",
              }}
              onClick={() => { setSelectedOption(op.id) }}>
              <div style={{
                fontSize: "40px",
              }}>
                {op.icon}
              </div>
              <div>{op.name}</div>
            </Button>)}
          <div style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Button onClick={shoot} type="primary" size="large" style={{ marginTop: "15px", width: "100%" }}>
              Shoot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
