
const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  upgrade_to: '/upgrade_to',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    service_group: {
      service: {
        root: `${ROOTS.DASHBOARD}/service`,
      },
      coupon: {
        root: `${ROOTS.DASHBOARD}/service/coupon`,
        new: `${ROOTS.DASHBOARD}/service/coupon/new`,
        edit: (id: string) => `${ROOTS.DASHBOARD}/service/coupon/${id}/edit`,
      },
      report: {
        root: `${ROOTS.DASHBOARD}/service/report`,
        review: {
          root: `${ROOTS.DASHBOARD}/service/report/review`
        }
      }
    },
    user: {
      root: `${ROOTS.DASHBOARD}/users`,
      new: `${ROOTS.DASHBOARD}/users/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/users/${id}/edit`,
    },
    role: {
      root: `${ROOTS.DASHBOARD}/role`,
      new: `${ROOTS.DASHBOARD}/role/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/role/${id}/edit`,
      details: (id: string) => `${ROOTS.DASHBOARD}/role/${id}`,
    },
    page: {
      root: `${ROOTS.DASHBOARD}/page`,
      privacy: {
        root: `${ROOTS.DASHBOARD}/page/privacy`,
      },
      aboutUs: {
        root: `${ROOTS.DASHBOARD}/page/about-us`,
      },
      term: {
        root: `${ROOTS.DASHBOARD}/page/term`
      },
      question: {
        root: `${ROOTS.DASHBOARD}/page/question`,
        new: `${ROOTS.DASHBOARD}/page/question/new`,
        edit: (id: string) => `${ROOTS.DASHBOARD}/page/question/${id}/edit`,
      },
    },
    setting: {
      root: `${ROOTS.DASHBOARD}/setting`,
    }
  },
};
