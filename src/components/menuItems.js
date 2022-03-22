import {
  ROUTE_STATS,
  ROUTE_SWAP,
  ROUTE_ANALYTICS,
  ROUTE_MY_SWAP,
  ROUTE_LIQUIDITY_TOKENS,
  ROUTE_LIQUIDITY_POOLS,
  ROUTE_LIQUIDITY_MY_LIQUIDITY,
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED,
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
  ROUTE_LIQUIDITY_REMOVE_LIQUIDITY,
  ROUTE_STAKE,
  ROUTE_UNSTAKE,
} from '../router/routes';

export const SWAP = {
  id: 0,
  label: 'swap',
  route: ROUTE_SWAP,
  activeRoutes: [ROUTE_MY_SWAP],
};
export const LIQUIDITY = {
  id: 1,
  label: 'Liquidity',
  route: ROUTE_LIQUIDITY_TOKENS,
  activeRoutes: [
    ROUTE_LIQUIDITY_POOLS,
    ROUTE_LIQUIDITY_MY_LIQUIDITY,
    ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED,
    ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
    ROUTE_LIQUIDITY_REMOVE_LIQUIDITY,
  ],
};

export const ANALYTICS = {
  id: 3,
  label: 'analytics',
  route: ROUTE_ANALYTICS,
};
export const STAKE = {
  id: 3,
  label: 'stake',
  route: ROUTE_STAKE,
  activeRoutes: [ROUTE_UNSTAKE],
};
export const VAULT = {
  id: 3,
  label: 'vault',
  link: 'http://134.209.219.136/',
};

export default [SWAP, LIQUIDITY, STAKE, ANALYTICS, VAULT];

export const gameEditionRoutes = [
  {
    id: 0,
    label: 'swap',
    route: ROUTE_SWAP,
  },
  {
    id: 1,
    label: 'stats',
    route: ROUTE_STATS,
  },
  {
    id: 2,
    label: 'history',
    route: ROUTE_MY_SWAP,
  },
];
