# Installation

The data pixel app is build to be highly flexible. This means that it can be installed on various platforms.

::: tip
There are two primary ways to install the data pixel client

1. Accessing via ip address
2. Install using an installer

:::

::: warning
Before you attempt to install your client or try to access the IP address, make sure you have a backend set up by following the guide : http://localhost:8080/guide/setup

:::

## Access via IP

Type `http://192.168.1.133` in your address bar of your favorite browser

## Prebuild binaries

| Operating system    | Version                              | Link                               |
| ------------------- | ------------------------------------ | ---------------------------------- |
| Windows (32/64 bit) | [![vue-cli-status]][vue-cli-package] | [Release/windows][release/windows] |
| macOS               | [![vue-cli-status]][vue-cli-package] | [Release/macOS][release/windows]   |
| Linux               | [![vue-cli-status]][vue-cli-package] | [Release/linux][release/windows]   |

[release/windows]: https://github.com/JensVanhulst/data-pixel/releases
[vue-cli-status]: https://img.shields.io/npm/v/@vue/cli.svg
[vue-cli-package]: https://npmjs.com/package/@vue/cli

## Build from source

To build from source you need to run the following commands

```sh
git clone https://github.com/JensVanhulst/data-pixel

cd data-pixel/src/web

yarn electron:build
```

::: danger

NEED TO SPECITY OS ON BUILD FIX

:::

This will generate an installer for all operating systems