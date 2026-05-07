import { Component, inject, OnInit, signal } from '@angular/core';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'src/app/theme/shared/service/auth.service';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule, RouterModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // public props
  userInfo = signal<any>(null);

  // constructor
  constructor() {
    const config = inject(NgbDropdownConfig);
    config.placement = 'bottom-right';
  }

  ngOnInit(): void {
    const userStr = localStorage.getItem('qms_user');
    if (userStr) {
      this.userInfo.set(JSON.parse(userStr));
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
