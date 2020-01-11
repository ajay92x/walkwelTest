import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  public baseUrl: string = environment.baseUrl;
  public toastMessage: string;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Check user authentication.
   */
  public get isAuthenticated() {
    return this.currentUserSubject.value;
  }

  /**
   * Loader
   * @param type toggle loader
   */
  loader(type: string = null){
    let element = document.getElementById('customLoader');
    (type == 'show') ? element.classList.add('show') : element.classList.remove('show');
  }

  /**
   * Toast message
   * @param message message
   * @param type message type (success | danger)
   */
  toast(message: string, type: string = 'success'){
    var element = document.getElementById("snackbar");
    element.classList.add(type);
    element.classList.add(`show`);
    this.toastMessage = message;
    setTimeout(()=>{ 
      element.className = "";
      // element.className = element.className.replace("show", ""); 
      this.toastMessage = null;
    }, 3000);
  }

  /**
   * Login request
   * @param data login data
   */
  login(data: any) {
    this.loader('show');
    return this.http.post<any>(`${this.baseUrl}create`, data)
      .pipe(map(response => {
        if (response) {
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.currentUserSubject.next(data);
        }
        this.loader();
      }));
  }
  
  /**
   * Signup request
   * @param data signup data
   */
  signup(data: any) {
    this.loader('show');
    return this.http.post<any>(`${this.baseUrl}create`, data);
  }
  
  /**
   * Get user request
   */
  getUsers() {
    this.loader('show');
    return this.http.get<any>(`${this.baseUrl}employees`);
  }

  /**
   * Logout
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.toast('Successfully logged out.');
    this.currentUserSubject.next(null);
  }
}
