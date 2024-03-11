## Kunet Agents

### Installation

0. Install `nvm` & `npm`
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

nvm install 21
nvm use 21
```




1. Install `ts-node` 
```sh
npm install -g typescript
npm install -g ts-node
```

1. Setup webhooks with github, then start watchtower:
```sh 
ts-node services/watchtower.ts
```

<!-- 3. todo -->