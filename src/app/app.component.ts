import { Component, OnInit } from '@angular/core';
import { AuthService } from './Auth/auth.service';
import * as fromApp from "./store/app.reducer";
import { Store } from '@ngrx/store';
import * as authActions from "./Auth/store/auth.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private authService : AuthService, private store : Store <fromApp.AppState>){}
  ngOnInit(): void {
    //this.authService.autoLogin();
    this.store.dispatch(authActions.autoLogin());
  }

}
