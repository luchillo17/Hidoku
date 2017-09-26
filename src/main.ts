import { enableProdMode } from '@angular/core';
import { bootstrapWorkerUi } from '@angular/platform-webworker';

import { platformWorkerAppDynamic } from '@angular/platform-webworker-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapWorkerUi('./web-worker/worker.ts')
  .catch(err => console.log(err));
