import { container } from 'tsyringe';

import uploadConfig from '@config/upload';

import DiskStorageProvider from './implementations/DiskStorageProvider';
import IStorageProvider from './models/IStorageProvider';

const providers = {
  disk: DiskStorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
