import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { canActivateAuth } from './auth/auth.guard';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { SidebarComponent } from './common-ui/sidebar/sidebar.component';

export const routes: Routes = [
    {path: '',
        component: ChatPageComponent,
        children:[
            {path: '', component: SidebarComponent}
            ],
        canActivate: [canActivateAuth]
    },
    {path: 'login', component: LoginPageComponent}
];
