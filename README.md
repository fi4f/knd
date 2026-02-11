### KND is for _Kids Next Door_

KND is a p2p decentralized messaging and file-sharing app.

### Objective(s)

Offer a free and open source alternative to platforms like Discord and Slack that puts users in control of their data.

### Features

Leverage browser features and decentralized infrastructure to provide 
- Voice calls over WebRTC
- Video calls over WebRTC
- Screen sharing over WebRTC
- Send and receive messages
- Send and receive files

#### Decentralized Rooms
KND is built on top of Trystero which leverages ephemeral "rooms". Rooms are not true infrastructure, but instead are unique identifiers that clients can use to find and connect to eachother without a central authority.

#### Decentralized Identity Model
KND uses a hierarchical identity model to provide a secure and decentralized way to identify users. Each user is represented by a unique primary public/private key pair, which can be used to authorize or revoke additional device keys.

#### Decentralized Persistence
KND mirrors all interactions in a local database which is merged with views from other clients when connected.

#### Decentralized Ordering
KND leverages a combination of lamport clocks and unix timestamps to order interactions when merging views.

#### Signatures Everywhere
All interactions are signed by a user's primary key, which can be used to verify its authenticity.

