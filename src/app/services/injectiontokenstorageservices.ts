import { InjectionToken } from '@angular/core';
import { IStorageService } from '../models/interfaceservicios';

export const MY_TOKEN_SERVICESTORAGE = new InjectionToken<IStorageService>('ClaveStorageServices');
