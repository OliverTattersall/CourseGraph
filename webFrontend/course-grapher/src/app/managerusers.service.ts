import { Injectable, inject } from '@angular/core';
import { User } from './user';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth, GoogleAuthProvider, authState, signInWithPopup, User as fireUser } from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, docData, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Firestoreuser } from './firestoreuser';
import { delay } from './utils';


@Injectable({
    providedIn: 'root'
})
export class ManagerusersService {
    curUser:User|null = new User(["PHYS122", "AMATH271", "MATH138", "PHYS249", "PHYS234"]);
    items$: Observable<any[]> | undefined; 
    firestore:Firestore = inject(Firestore);
    fireAuth:Auth = inject(Auth);
    authState$ = authState(this.fireAuth);
    authStateSubscription: Subscription;
    provider;
    fetchingInfo:boolean = false;
    constructor() { 
        this.provider = new GoogleAuthProvider();
        this.authStateSubscription = this.authState$.subscribe(async (aUser: fireUser | null) => {
            //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
            console.log(aUser);
            this.handleUserChange(aUser);
        })
    }

    ngOnDestroy() {
        // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
        this.authStateSubscription.unsubscribe();
    }

    async signInUp(): Promise<boolean>{

        // let res;
        this.fetchingInfo = true;
        try{
            await signInWithPopup(this.fireAuth, this.provider);
            while(this.fetchingInfo){
                await delay(50);
            }
            return true;
            // return !!await signInWithPopup(this.fireAuth, this.provider);
        }catch{
            this.fetchingInfo = false;
            return false;
        }

        // return !!res;
    
    }


    signOut(){
        this.fireAuth.signOut();
    }

    isUserRegistered(): boolean{
        console.log(this.curUser);
        return this.curUser?.registered || false;
    }

    async setUserRegistered(reg:boolean){
        if(this.fireAuth.currentUser){
            await updateDoc(doc(this.firestore, "Users", this.fireAuth.currentUser.uid), {
                registered:reg
            });
        }
        
    }

    async handleUserChange(user: fireUser | null){
        if(user){
            let id:string = user.uid;
            this.fetchingInfo = true;
            const userData = await getDoc(doc(this.firestore, "Users", id)); 

            console.log(userData.data(), userData.id);
            if(!userData.data()){
                this.curUser = null;
            }else{
                const tempUser = new User((userData.data() as Firestoreuser).coursesTaken || [], ); // fixthis
                console.log(tempUser);
                tempUser.registered = (userData.data() as Firestoreuser).registered || false;
                this.curUser = tempUser;
                
            }
            this.fetchingInfo = false;
            // testing
            // const aCollection = collection(this.firestore, 'Users'); 
            // this.items$ = collectionData(aCollection,  { idField: 'id'}); // get documents and 
            // await this.items$.forEach((val) => {
            //     val.forEach(docinfo => {
            //         if(id == docinfo.id){ 
            //             console.log(docinfo);
            //         }
            //     })
                
                
            // })
        }
    }

    updateUser(newUser:User):void{
        this.curUser = newUser;
    }

    getCurrentUser():User | null{
        return this.curUser;
    }

    getCurUserCourses():string[]{
        return this.curUser?.coursesTaken || [];
    }


    // given a string of prereqs, finds the first course the user has taken in the prereq array
    findTakenCoursesInPrereqs(prereqArr: string[]): string {
        if(!this.curUser){
            return "";
        }
        for(let i = 0; i < this.curUser.coursesTaken.length; ++i){
            if(prereqArr.includes(this.curUser.coursesTaken[i])){
                console.log(this.curUser.coursesTaken[i]);
                return this.curUser.coursesTaken[i];
            }
        }

        return "";
    }

    async updateUserCourses(courses: string[]){
        if(!this.curUser){
            throw new Error("no signed in user");
        }
        let id:string = this.fireAuth.currentUser?.uid as string;
        await updateDoc(doc(this.firestore, "Users", id), {
            coursesTaken: courses
        })
        this.curUser.coursesTaken = courses;
    }

}
