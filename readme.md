## Kunet Agents

### Installation

0. Install `nvm` & `npm`
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

nvm install 21
nvm use 21
```

1. Clone & Install
```sh
git clone https://github.com/kunetglobal/bits
cd bits
npm install
```

1. Setup webhooks with github, then start watchtower:
```sh 
npx ts-node services/watchtower.ts
```

<!-- 3. todo -->