// import { client } from "../index.js";
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const client = new SecretManagerServiceClient();

async function getPrivateKey() {
  const [version] = await client.accessSecretVersion({
    name: "projects/564550709579/secrets/vault_test/versions/1",
  });
  const privateKey = version.payload.data.toString();
  return privateKey;
}

module.exports = getPrivateKey;
