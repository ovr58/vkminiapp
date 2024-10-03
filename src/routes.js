import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  HOME: 'home',
  CREATE: 'create',
  EXPLORE: 'explore',
  CONTACT: 'contact'
};

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.HOME, '/', []),
      createPanel(DEFAULT_VIEW_PANELS.CREATE, `/${DEFAULT_VIEW_PANELS.CREATE}`, []),
      createPanel(DEFAULT_VIEW_PANELS.EXPLORE, `/${DEFAULT_VIEW_PANELS.EXPLORE}`, []),
      createPanel(DEFAULT_VIEW_PANELS.CONTACT, `/${DEFAULT_VIEW_PANELS.CONTACT}`, []),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
