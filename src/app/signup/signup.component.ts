import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public user: any = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  }

  constructor(private router: Router, public api: ApiService) { }

  ngOnInit() {
    this.api.isAuthenticated ? this.router.navigate(['/home']) : null;
  }

  /**
   * Signup
   * @param formData signup data
   */
  onSubmitSignupForm(formData: any) {
    this.api.signup(formData.value)
      .subscribe(
        data => {
          this.api.toast('Successfully registered.');
          this.api.loader();
          this.router.navigate(['/login']);
        },
        error => {
          console.log("error:", error);
        });
  }

}
