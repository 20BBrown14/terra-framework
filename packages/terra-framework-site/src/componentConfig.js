import PropTypes from 'prop-types';
import LayoutDefault from 'terra-layout/tests/nightwatch/LayoutDefault';
import LayoutNoMenu from 'terra-layout/tests/nightwatch/LayoutNoMenu';
import LayoutLongText from 'terra-layout/tests/nightwatch/LayoutLongText';
import LayoutNoHeader from 'terra-layout/tests/nightwatch/LayoutNoHeader';

import ApplicationToolbarDefault from 'terra-application-toolbar/tests/nightwatch/ApplicationToolbarDefault';

import LayoutExample from './examples/layout/Index';
import ToolbarExample from './examples/application-toolbar/Index';

const itemConfigPropType = PropTypes.shape({
  path: PropTypes.string,
  component: PropTypes.func,
  description: PropTypes.string,
});

const siteConfigPropType = PropTypes.objectOf(PropTypes.shape({
  name: PropTypes.string,
  example: itemConfigPropType,
  testRoot: PropTypes.string,
  tests: PropTypes.arrayOf(itemConfigPropType),
}));

const componentConfig = {
  layout: {
    name: 'Layout',
    example: {
      path: '/components/layout',
      component: LayoutExample,
      description: 'Layout',
    },
    testRoot: '/tests/layout',
    tests: [{
      path: '/default',
      component: LayoutDefault,
      description: 'Default',
    }, {
      path: '/no-menu',
      component: LayoutNoMenu,
      description: 'No Menu',
    }, {
      path: '/long-text',
      component: LayoutLongText,
      description: 'Long Text',
    }, {
      path: '/no-header',
      component: LayoutNoHeader,
      description: 'No Header',
    }],
  },
  applicationToolbar: {
    name: 'Application Toolbar',
    example: {
      path: '/components/application-toolbar',
      component: ToolbarExample,
      description: 'ApplicationToolbar',
    },
    testRoot: '/tests/application-toolbar',
    tests: [{
      path: '/default',
      component: ApplicationToolbarDefault,
      description: 'Default',
    }],
  },
};

export default componentConfig;
export { siteConfigPropType, itemConfigPropType };
