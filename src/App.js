import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  ApolloProvider,
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';
// import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import QuotesPage from './containers/QuotesPage';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) {
    console.log(`[Network error]: ${networkError.statusCode}`);
    console.log(`[Network error]: ${networkError.result}`);
    console.log(`[Network error]: ${networkError.message}`);
  }
});


const httpLink = new HttpLink({
  uri: `https://5d3uiluxjfauhe3bf2d3u5dnre.appsync-api.us-east-1.amazonaws.com/graphql`,
  headers: {
    'X-Api-Key' : 'da2-krd5fk3pzjgsfalbdcfrgn2xmq',
  }
});

const link = ApolloLink.from([
  errorLink,
  httpLink,
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});


const App = () => {
  return (
    <ApolloProvider client={client}>
      <Switch>
        <Route path="/" component={QuotesPage} />
      </Switch>
    </ApolloProvider>
  );
};

export { App as default };
