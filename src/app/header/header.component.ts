import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild('.navbar') nav!: ElementRef;
  hide = false;
  scroll = 0;

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) { }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const verticalOffset = document.documentElement.scrollTop
      || document.body.scrollTop || 0;

    if (verticalOffset > this.scroll) {
      this.hide = true;
      this.scroll = verticalOffset;
    }

    if (verticalOffset < this.scroll) {
      this.hide = false;
      this.scroll = verticalOffset;
    }

    if (verticalOffset < 10) {
      this.hide = false;
      this.scroll = verticalOffset;
    }
  }

  signout() {
    this.firebaseAuth.signOut().then(res => this.router.navigate(['/auth']));

  }
}
