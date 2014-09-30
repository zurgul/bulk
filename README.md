# bulk [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Run a command in every directory within a directory.

End goal of this package is to make a more intuitive, simpler alternative to find/grep + xargs.

This is a more generalised fork of [hughsk/scoped-bulk](http://github.com/hughsk/scoped-bulk)

## CLI Usage

[![NPM](https://nodei.co/npm/bulk.png)](https://nodei.co/npm/bulk/)

``` bash
Usage:
  bulk <dirname> <command...>
```

Where `<dirname>` is a folder full of packages, and `<command...>` is a
command to run from your shell in each package.

## Examples

#### Run `npm install` in every folder inside ./lib

```bash
bulk lib npm install 
```

#### Clean all node_modules from children

This works well for cleaning dependencies out of symlinked packages, and allows for rededuplication without doing a full install.

```bash
bulk node_modules "rm -rf ."
```

#### Install the dependencies of locally scoped modules:

```bash
bulk node_modules/@scoped npm install --production
```

## License

MIT. See [LICENSE.md](http://github.com/hughsk/bulk/blob/master/LICENSE.md) for details.
