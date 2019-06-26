import React from "react";

function getTheLazyComponent(name) {
    const Component = React.lazy(() => import(`../components/${name}`));
    return <Component/>
}

export const routes = [
    {name: '/browseFile', component: getTheLazyComponent('browseFile/index')},
    {name: '/analytics', component: getTheLazyComponent('analytics/index')},
];