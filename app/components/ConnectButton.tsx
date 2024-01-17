import React, { useEffect } from "react";

export default function ConnectButton() {
  return (
    <w3m-button
      // style={{ color: "white", padding: "10px", borderRadius: "5px" }}
      size="md"
      balance="show"
      loadingLabel="Loading WalletConnect"
      label="connect wallet"
    />
  );
}
