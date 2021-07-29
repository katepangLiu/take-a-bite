# livekit

## Intro

- an open source RTC resolution
- a Web SFU with multi-platform SDKs
- provides scalable, multi conferencing over WebRTC
- easy to use
- powered by  [Pion WebRTC](https://github.com/pion/webrtc), [ion-sfu](https://github.com/pion/ion-sfu)
  - pion webrtc: a pure golang webrtc implement
  - ion-sfu: a pure golang webrtc sfu implement

### features

- Horizontally-scalable WebRTC Selective Forwarding Unit (SFU)
- Modern, full-featured [client SDKs](https://docs.livekit.io/references/client-sdks) for JavaScript, React, Swift, and Kotlin (React Native, Unity/C# and Flutter in development)
- Built for production - JWT authentication and [server APIs](https://docs.livekit.io/guides/server-api)
- Robust networking & connectivity over UDP, TCP, and built-in TURN/TLS
- Easy to deploy: pure Go and single binary
- Advanced features like speaker detection, simulcasting, selective subscription, and moderation APIs.

### Why LiveKit

- WebRTC 
  - is powerful, but not easy to use
  - difficult to support large numbers of peers
- Hosted solutions 
  - costly
  - limited flexibility
  - vender lock-in
- Other open source solution
  - steep leanring curve
  - daunting to customize and deploy
- LiveKit
  - sever is easy to use and deploy
  - client
    - easily embeddable wthin any app
    - first-party SDKs for major software platforms 

### Architecture

![livekit-arch](https://docs.livekit.io/assets/images/architecture-accb863d8da92d23d6b0e7f2dc9da726.svg)

- horizontally-scalable
  - 1 node to 100 nodes
  - peer-to-peer routing via redis
    - peers in the same room will be routed to the same node
- no external dependencies when running

## QuickStart

### Docker

- Server
  - Generate API key and secret
  - Start the Server
- Clients
  - Generate access token for a  participant 
  - Connecting to your room

Steps:

```shell
# Generate API key and secret
docker run --rm livekit/livekit-server generate-keys

# Start the Server
docker run --rm \
  -p 7880:7880 \
  -p 7881:7881 \
  -p 7882:7882/udp \
  -e LIVEKIT_KEYS="<key>: <secret>" \
  livekit/livekit-server \
  --dev \
  --node-ip=<machine-ip>
  
# Generate access token for a  participant 
docker run --rm -e LIVEKIT_KEYS="<key>: <secret>" livekit/livekit-server create-join-token --room myroom --identity $participant_identity

```

My Practice:

```shell
[root@pang nginx]# docker run --rm livekit/livekit-server generate-keys
Unable to find image 'livekit/livekit-server:latest' locally
latest: Pulling from livekit/livekit-server
5843afab3874: Pull complete 
7abd3a8c1d89: Pull complete 
Digest: sha256:abf6116155d08ecbfd59d0600cb13ab9d5b63e94ae3ef9d141c600abc59f28eb
Status: Downloaded newer image for livekit/livekit-server:latest
API Key:  APIgC8grop4Jhhp
Secret Key:  cjns8EVfb9TxpTKb0tXIehgdFLqfWezRbFS1FeHGjTXB

[root@pang nginx]# docker run --rm \
>   -p 7880:7880 \
>   -p 7881:7881 \
>   -p 7882:7882/udp \
>   -e LIVEKIT_KEYS="APIgC8grop4Jhhp: cjns8EVfb9TxpTKb0tXIehgdFLqfWezRbFS1FeHGjTXB" \
>   livekit/livekit-server \
>   --dev \
>   --node-ip=192.168.71.128
2021-07-29T01:04:39.709Z	INFO	server/main.go:191	configured key provider	{"numKeys": 1}
2021-07-29T01:04:39.709Z	INFO	service/utils.go:58	using single-node routing
2021-07-29T01:04:39.732Z	INFO	service/server.go:172	starting LiveKit server	{"addr": ":7880", "nodeID": "ND_YrfIQVr2", "nodeIP": "192.168.71.128", "version": "0.11.2", "rtc.portTCP": 7881, "rtc.portUDP": 7882}

# Generate access token for pang
[root@pang nginx]# docker run --rm -e LIVEKIT_KEYS="APIgC8grop4Jhhp: cjns8EVfb9TxpTKb0tXIehgdFLqfWezRbFS1FeHGjTXB" livekit/livekit-server create-join-token --room myroom --identity pang
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MzAxMTI5MjYsImlzcyI6IkFQSWdDOGdyb3A0SmhocCIsImp0aSI6InBhbmciLCJuYmYiOjE2Mjc1MjA5MjYsInZpZGVvIjp7InJvb20iOiJteXJvb20iLCJyb29tSm9pbiI6dHJ1ZX19.dFUsp5moUUmJBjuFjG0sO2Ap7OF42wazAQrTmY-nunA
```

*TODO: Connecting to your room*

