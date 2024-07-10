import { Component, inject } from '@angular/core';
import { ManagerusersService } from '../managerusers.service';
import { Router } from '@angular/router';
import { RegisterInfoPageComponent } from '../register-info-page/register-info-page.component';

@Component({
    selector: 'app-login-register',
    standalone: true,
    imports: [RegisterInfoPageComponent],
    templateUrl: './login-register.component.html',
    styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent {
    router = inject(Router);
    state = true; 
    userService = inject(ManagerusersService); 
    showRegisterPage: boolean = false;

    toggleState(){
        this.state = !this.state;
    }

    async signInUp(){
        let registered: boolean = await this.userService.signInUp();
        if(!registered){
            alert("Error with signing in/up");
            return ;
        }
        if(!this.userService.isUserRegistered()){
            this.showRegisterPage = true;
        }else{
            // console.log(this.userService.isUserRegistered());
            this.router.navigate(['/']);
        }
        
        console.log(this.router);
        // this.router.navigate(["/profile"], {queryParams:{'register':true}});
    }
    doneRegister(router:Router, userService:ManagerusersService){
        function doneRegiste(){ // weird fix
            console.log("hello", router);
            router.navigate(["/"]);
            userService.setUserRegistered(true);
        }
        return doneRegiste;
    }
    

}
