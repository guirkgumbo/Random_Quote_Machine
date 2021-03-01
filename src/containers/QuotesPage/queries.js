import gql from 'graphql-tag';

const FETCH_QUOTE = gql`
   query listGame_quotes($limit: Int, $nextToken: String) {
      listGame_quotes(limit: $limit, nextToken: $nextToken) {
         items {
            id
            quote
            quoter
            game
         }
         nextToken
      }
   }
`;

export { FETCH_QUOTE };