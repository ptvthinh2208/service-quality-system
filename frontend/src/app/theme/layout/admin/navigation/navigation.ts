export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  roles?: string[]; // Thêm trường roles để filter theo quyền
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Tổng quan',
    type: 'group',
    icon: 'icon-navigation',
    roles: ['Admin'],
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item',
        roles: ['Admin']
      }
    ]
  },
  {
    id: 'evaluation-management',
    title: 'Quản lý Đánh Giá',
    type: 'group',
    icon: 'icon-ui',
    roles: ['Admin'],
    children: [
      {
        id: 'categories',
        title: 'Tiêu chí đánh giá',
        type: 'item',
        url: '/admin/categories', // Placeholder route for future
        icon: 'feather icon-list',
        classes: 'nav-item',
        roles: ['Admin']
      },
      {
        id: 'sessions',
        title: 'Lịch sử đánh giá',
        type: 'item',
        url: '/admin/sessions', // Placeholder route for future
        icon: 'feather icon-check-square',
      }
    ]
  },
  {
    id: 'settings',
    title: 'Cài đặt',
    type: 'group',
    icon: 'icon-settings',
    roles: ['Admin'],
    children: [
      {
        id: 'app-config',
        title: 'Cấu hình Ứng dụng',
        type: 'item',
        url: '/admin/settings',
        icon: 'feather icon-settings',
        classes: 'nav-item',
        roles: ['Admin']
      }
    ]
  }

];
