import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: any = {
    email: ''
  }

  constructor(private router: Router, public api: ApiService) { }

  ngOnInit() {
    this.api.isAuthenticated ? this.router.navigate(['/home']) : null;
  }

  /**
   * Login
   * @param formData login data
   */
  onSubmitLoginForm(formData: any){
    this.api.login(formData.value)
    .subscribe(
      data => {
        this.api.toast('Successfully logged-in.');
        this.api.loader();
        this.router.navigate(['/home']);
      },
      error => {
        console.log("error:", error);
      });
  }

}
