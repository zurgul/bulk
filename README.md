# bulk [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Run a command from every installed npm package under a certain directory.

This is a more generalised fork of [hughsk/scoped-bulk](http://github.com/hughsk/scoped-bulk)

## CLI Usage

[![NPM](https://nodei.co/npm/bulk.png)](https://nodei.co/npm/bulk/)

``` bash
Usage:
  bulk <dirname> <command...>
```

Where `<dirname>` is a folder full of packages, and `<command...>` is a
command to run from your shell in each package.

For example, running the following in your project root might yield something
like this:

``` bash
bulk node_modules/@scoped ls -A
```

``` bash
node_modules/@scoped/1
> ls -A

.gitkeep

node_modules/@scoped/2
> ls -A

.gitkeep

node_modules/@scoped/3
> ls -A

.gitkeep

node_modules/@scoped/4
> ls -A

.gitkeep
```

You can use this, for example, to install the dependencies of locally scoped
modules:

``` bash
bulk node_modules/@scoped npm install --production
```

## License

MIT. See [LICENSE.md](http://github.com/hughsk/bulk/blob/master/LICENSE.md) for details.
