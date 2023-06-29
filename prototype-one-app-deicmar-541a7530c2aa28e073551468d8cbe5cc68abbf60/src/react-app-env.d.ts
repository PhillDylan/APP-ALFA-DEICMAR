
/// <reference types="react-scripts" />

declare module 'crypto' {
    import { CipherGCMTypes } from 'crypto-browserify';
  
    export interface CipherCCM extends CipherGCMTypes {}
  
    export interface CipherGCM extends CipherGCMTypes {}
  
    export interface DecipherCCM extends CipherGCMTypes {}
  
    export interface DecipherGCM extends CipherGCMTypes {}
  }

  const path = require('path');

module.exports = {
  // Resto da sua configuração do webpack...

  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/')
    }
  }
};

  
