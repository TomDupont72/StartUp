const { TezosToolkit } = require('@taquito/taquito');
const { InMemorySigner } = require('@taquito/signer');
const { MichelsonMap } = require('@taquito/taquito');
const fs = require('fs');

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

async function originateContract() {
    const privateKey = 'edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq';
    Tezos.setProvider({ signer: new InMemorySigner(privateKey) });
    
    const storage = {
      utilisateurs: new MichelsonMap(),
      claims: new MichelsonMap(),
      map_claims1: new MichelsonMap(),
      map_claims2: new MichelsonMap(),
      specials: new MichelsonMap(),
      map_specials1: new MichelsonMap(),
      map_specials2: new MichelsonMap(),
      tokens: new MichelsonMap(),
      map_tokens: new MichelsonMap(),
    }

    const contrat = fs.readFileSync('contrat.tz', 'utf8');

    const op = await Tezos.contract.originate({
        code: contrat,
        storage: storage,
    });

    await op.confirmation();

    const contract = op.contractAddress;
    console.log(`Contract deployed at: ${contract}`);
}

originateContract().catch((e) => console.error(e));
