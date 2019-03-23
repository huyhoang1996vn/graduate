import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { env } from './environments/environment';

document.write(
    `
        <script type="text/javascript" src="${env.api_domain_root}/static/assets/js/ckeditor/ckeditor.js">
        </script>
    `
);

if (env.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
