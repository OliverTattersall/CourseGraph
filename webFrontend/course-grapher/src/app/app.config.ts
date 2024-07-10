import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// import { AngularFireModule } from '@angular/fire/compat';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
                provideFirebaseApp(() => initializeApp({"projectId":"coursegrapheruw","appId":"1:77777808906:web:82aa23069474187291b9f3","storageBucket":"coursegrapheruw.appspot.com","apiKey":"AIzaSyBffkSwXwtzofIwBD6-zSB__89LrcBaJZA","authDomain":"coursegrapheruw.firebaseapp.com","messagingSenderId":"77777808906","measurementId":"G-SX0BF16Y8R"})), 
                provideAuth(() => getAuth()), 
                provideFirestore(() => getFirestore())
                // importProvidersFrom(AngularFireModule)
              
              ]
};
