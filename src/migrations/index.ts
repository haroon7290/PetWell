import * as migration_20261113_084043_initial from './20261113_084043_initial';
import * as migration_20261113_210325_blob_storage_fields from './20261113_210325_blob_storage_fields';
import * as migration_20261113_212155_homepage_mobile_images from './20261113_212155_homepage_mobile_images';

export const migrations = [
  {
    up: migration_20261113_084043_initial.up,
    down: migration_20261113_084043_initial.down,
    name: '20261113_084043_initial',
  },
  {
    up: migration_20261113_210325_blob_storage_fields.up,
    down: migration_20261113_210325_blob_storage_fields.down,
    name: '20261113_210325_blob_storage_fields',
  },
  {
    up: migration_20261113_212155_homepage_mobile_images.up,
    down: migration_20261113_212155_homepage_mobile_images.down,
    name: '20261113_212155_homepage_mobile_images'
  },
];
