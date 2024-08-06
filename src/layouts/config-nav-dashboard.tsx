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

  // Controle
  user: icon('ic-users'),
  setting: icon('ic-settings'),
  role: icon('ic-roles'),
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
        title: 'setting',
        path: paths.dashboard.setting.root,
        icon: ICONS.setting,
        roles: ['setting', 'question-list', 'about-us', 'privacy', 'term'],
        children: [
          { title: 'main-setting', path: paths.dashboard.setting.root, roles: ['setting'] },
          {
            title: 'common-questions',
            path: paths.dashboard.setting.question.root,
            roles: ['question-list'],
          },
          { title: 'about-us', path: paths.dashboard.setting.aboutUs, roles: ['about-us'] },
          { title: 'privacy', path: paths.dashboard.setting.privacy, roles: ['privacy'] },
          { title: 'term', path: paths.dashboard.setting.term, roles: ['term'] },
        ],
      },
    ],
  },
];
