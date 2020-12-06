/*
 * @Author: wzd
 * @Date: 2020-07-02 13:18:07
 * @Description:
 */
// import React from 'react';
// import {
//   HashRouter as Router, Route,
// } from 'react-router-dom';

// import BasicLayout from '@/layouts/BasicLayout';
// import Login from '../pages/Login';

// const AppRouter = () => (
//   <Router>
//     <Route path="/login" exact component={Login} />
//     <Route path="/" key="basic" render={(props) => <BasicLayout {...props} />} />
//   </Router>
// );

// export default AppRouter;

import React, { Suspense } from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import LoadingPage from '@/components/LoadingPage';
import config from './config';

const renderRoutes = (routes) => {
  if (!Array.isArray(routes)) {
    return null;
  }

  return (<Switch> {
            routes.map((route, index) => {
              if (route.redirect) {
                return (<Redirect
                  key={route.path || index}
                  exact={route.exact}
                  strict={route.strict}
                  from={route.path}
                  to={route.redirect}
                />
                );
              }

              return (<Route
                key={route.path || index}
                path={route.path}
                exact={route.exact}
                strict={route.strict}
                render={
                        () => {
                          const renderChildRoutes = renderRoutes(route.childRoutes);
                          if (route.component) {
                            return (<Suspense fallback={<LoadingPage />}>
                                    <route.component route={route}> { renderChildRoutes }
                                    </route.component>
                                    </Suspense>
                            );
                          }
                          return renderChildRoutes;
                        }
                    }
              />
              );
            })
        }
          </Switch>
  );
};

const AppRouter = () => <Router> { renderRoutes(config) } </Router>;

export default AppRouter;
