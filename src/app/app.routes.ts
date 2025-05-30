import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { SidebarComponent } from './common-ui/sidebar/sidebar.component';
import { authGuard } from './auth/auth.guard';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

export const routes: Routes = [
    {path: '',
        component: ChatPageComponent,
        children:[
            {path: '', component: SidebarComponent}
            ],
        canActivate: [authGuard]
    },
    {path: 'login', component: LoginPageComponent},
    {path: 'register', component: RegisterPageComponent}
];
