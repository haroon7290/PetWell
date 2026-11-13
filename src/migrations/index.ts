import * as migration_20261113_084043_initial from './20261113_084043_initial';

export const migrations = [
  {
    up: migration_20261113_084043_initial.up,
    down: migration_20261113_084043_initial.down,
    name: '20261113_084043_initial'
  },
];
