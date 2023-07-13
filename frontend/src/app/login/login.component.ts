import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {LoginService} from "./login.service";
import {User} from "../domain/user";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder,private route: ActivatedRoute, private router: Router, private loginService: LoginService,private title: Title) {
    this.title.setTitle("Log in");

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
  }

  login() {
    this.loginService.login({email: this.form.value.email, password: this.form.value.password}).subscribe((res: User) => {
        console.log("User = "+res);
        localStorage.setItem('access_token', res.token);
        localStorage.setItem('name', res.name);
        this.router.navigate(['/meets'], { relativeTo: this.route });
        console.log("User = "+res);
      },
      ()=>{
        console.log("Error");
      }
    );
  }
}
