// angular import
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// project import
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ConfigurationComponent } from 'src/app/theme/layout/admin/configuration/configuration.component';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-admin',
  imports: [NavBarComponent, NavigationComponent, RouterModule, CommonModule, ConfigurationComponent, BreadcrumbsComponent, Footer],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  // public props
  navCollapsed = false;
  navCollapsedMob = false;
  windowWidth: number;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth < 992) {
      this.navCollapsed = false;
    }
  }

  // constructor
  constructor() {
    this.windowWidth = window.innerWidth;
  }

  ngOnInit() {
    if (this.windowWidth < 992) {
      this.navCollapsedMob = false;
    }
  }

  // public method
  navMobClick() {
    this.navCollapsedMob = !this.navCollapsedMob;
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    this.navCollapsedMob = false;
  }
}
