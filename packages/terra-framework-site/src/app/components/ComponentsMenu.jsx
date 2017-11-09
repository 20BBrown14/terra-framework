import React from 'react';

import MenuList from '../common/menu/MenuList';
import RoutingDelegate from '../common/navigation/routing/RoutingDelegate';

const propTypes = {
  routingManager: RoutingDelegate.propType,
};

const ComponentsMenu = ({ routingManager, config }) => (
  <MenuList
    headerText="Components"
    routingManager={routingManager}
    links={Object.keys(config).map((componentKey) => {
      const example = config[componentKey].example;
      if (example) {
        return {
          id: example.path,
          path: example.path,
          text: example.description,
        };
      }
      return undefined;
    })}
  />
);

ComponentsMenu.propTypes = propTypes;

export default ComponentsMenu;
