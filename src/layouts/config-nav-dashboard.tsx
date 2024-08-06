import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  // Service
  service: icon('ic-service'),
  coupon: icon('ic-coupon'),
  review: icon('ic-review'),
  report: icon('ic-report'),

  // Controle
  user: icon('ic-users'),
  setting: icon('ic-settings'),
  role: icon('ic-roles'),
  page: icon('ic-page'),
};

// ----------------------------------------------------------------------

export const navData = [
  /** ========================
   *  Overview
   *  ========================
   */
  {
    subheader: 'overview',
    items: [],
  },

  /** ========================
   *  Service
   *  ========================
   */
  {
    subheader: 'services',
    roles: ['service-list'],
    items: [
      {
        title: 'main-services',
        path: paths.dashboard.service_group.service.root,
        icon: ICONS.service,
        roles: ['service-list'],
      },
      {
        title: 'coupons',
        path: paths.dashboard.service_group.coupon.root,
        icon: ICONS.coupon,
        roles: ['coupon-list'],
      },
      {
        title: 'reports',
        icon: ICONS.report,
        roles: ['review-list'],
        path: paths.dashboard.service_group.report.root,
        children: [
          {
            title: 'reviews',
            path: paths.dashboard.service_group.report.review.root,
            roles: ['review-list'],
            icon: ICONS.review,
          },
        ],
      },
    ],
  },

  /** ========================
   *  Controle
   *  ========================
   */
  {
    subheader: 'controle',
    roles: ['user-list', 'role-list', 'setting', 'question-list', 'about-us', 'privacy', 'term'],
    items: [
      {
        title: 'users',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        roles: ['user-list'],
      },
      {
        title: 'roles',
        path: paths.dashboard.role.root,
        icon: ICONS.role,
        roles: ['role-list'],
      },
      {
        title: 'pages',
        path: paths.dashboard.page.root,
        icon: ICONS.page,
        roles: ['question-list', 'about-us', 'privacy', 'term'],
        children: [
          {
            title: 'common-questions',
            path: paths.dashboard.page.question.root,
            roles: ['question-list'],
          },
          { title: 'about-us', path: paths.dashboard.page.aboutUs.root, roles: ['about-us'] },
          { title: 'privacy', path: paths.dashboard.page.privacy.root, roles: ['privacy'] },
          { title: 'term', path: paths.dashboard.page.term.root, roles: ['term'] },
        ],
      },
      {
        title: 'setting',
        path: paths.dashboard.setting.root,
        icon: ICONS.setting,
        roles: ['setting'],
      },
    ],
  },
];
