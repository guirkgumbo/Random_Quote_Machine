import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Keyframes, Frame } from 'react-keyframes';
import { useQuery } from '@apollo/client';
import { FETCH_QUOTE } from './queries';
import "nes.css/css/nes.min.css";

const styles = makeStyles(() => ({
   main: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '10px',
   },
   row: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
   },
   section: {
      width: '100%',
      ['@media (min-width:780px)']: { // eslint-disable-line no-useless-computed-key
         width: '50%'
      }
   },
   title: {
      textAlign: 'center',
   },
   ballonSection: {
      display: 'flex',
      justifyContent: 'center',
   },
   ballon: {
      display: 'flex',
      width: '80%',
      minHeight: '90px',
      marginBottom: '15px',
   },
   quoteContainer: {
      minHeight: '150px',
   },
   quoteAuthor: {
      display: 'flex',
      margin: '10px',
   },
   quoteActions: {
      display: 'flex',
      justifyContent: 'space-between',
   },
   favorites: {
      padding: '15px 0',
   },
   favoritesTable: {
      width: '100%',
      paddingBottom: '15px',
   },
}));

const Index = () => {
   const classes = styles();
   let buildWelcome = '';
   let buildQuote = '';
   const welcomeMessage = 'Welcome to Video Game Quotes!'.split('');
   const [first, setFirst] = useState(null);
   const [quote, setQuote] = useState({});
   const [quoteText, setQuoteText] = useState(null);
   const [showFavs, setShowFavs] = useState(false);
   const [favorites, setFavorites] = useState([]);
   const {
      loading,
      // error,
      data,
      fetchMore,
   } = useQuery(FETCH_QUOTE, {
      variables: {
         limit: 1,
         nextToken: null,
      }
   });
   useEffect(() => {
      document.body.style.backgroundColor = '#212529';
      const favs = JSON.parse(localStorage.getItem('gameQuotes'));
      setFavorites(favs ? favs : []);
   }, []);

   useEffect(() => {
      if (data) {
         setQuote(data.listGame_quotes.items[0]);
         setQuoteText(data.listGame_quotes.items[0].quote.split(''));
         if (!first) {
            setFirst(data);
         }
      }
   }, [data, first]);
   const newQuote = async () => {
      setQuoteText(null);
      buildQuote = '';
      // fetchMore
      // refetch was being a hassle and fetchMore was fresh in my mind from another project
      await fetchMore({
         variables: {
            limit: 1,
            nextToken: data.listGame_quotes.nextToken,
         },
         updateQuery: (prev, { fetchMoreResult }) => {
            // gotta do this cause the nextToken of aws appsync is weird
            // if all options have been used then the next call with nextToken will return an empty array. 
            // pass back first data object to start over
            if (!fetchMoreResult || fetchMoreResult.listGame_quotes.items.length === 0) {
               setQuote(first.listGame_quotes.items[0]);
               setQuoteText(first.listGame_quotes.items[0].quote.split(''));
               return first;
            }
            return fetchMoreResult;
         },
      });
   };

   const newFavorite = async () => {
      setFavorites([...favorites, quote]);
      localStorage.setItem('gameQuotes', JSON.stringify([...favorites, quote]));
   };

   return (
      <div className={classes.main}>
         <div className={classes.row}>
            <div className={classes.section}>
               <h1 className={`${classes.title} nes-text is-primary`}>Video Game Quotes</h1>
               <div className={classes.ballonSection}>
                  <div className={`nes-balloon from-left ${classes.ballon}`}>
                     <Keyframes>
                        {welcomeMessage.map((char, index) => {
                           buildWelcome = buildWelcome + char;
                           return <Frame key={char + index} duration={50}>{buildWelcome}</Frame>;
                        })}
                     </Keyframes>
                  </div>
               </div>
               <div>
                  <i className={`nes-kirby`}></i>
               </div>
            </div>
         </div>
         <div className={classes.row}>
            <div className={classes.section}>
               <div className={`nes-container is-dark with-title ${classes.quoteContainer}`}>
                  <p className={`title`}>
                     Game:
                     {
                        !loading ? (<span className={`nes-text is-primary`}>{` ${quote.game} `}</span>) : (<span></span>)
                     }
                  </p>
                  {(quoteText) ? (
                     <>
                        <Keyframes component={'span'}>
                           {quoteText.map((char, index) => {
                              buildQuote = buildQuote + char;
                              return <Frame key={char + index} duration={25} style={{ color: 'white', display: 'flex' }}>{buildQuote}</Frame>;
                           })}
                        </Keyframes>

                        <span className={`nes-text is-primary ${classes.quoteAuthor}`}>{` Author: ${quote.quoter}`}</span>
                     </>
                  ) : (
                        <span>Loading...</span>
                     )}
               </div>
               <div className={classes.quoteActions}>
                  <button type="button" className={`nes-btn is-primary`} onClick={() => newQuote()}>New Quote</button>
                  <button type="button" className={`nes-btn is-success`} onClick={() => newFavorite()}>Favorite</button>
               </div>
            </div>
         </div >
         <div className={classes.row}>
            <div className={classes.section}>
               <div>
                  <h2 className={`${classes.title} nes-text is-primary`}>Favorite Quotes</h2>
                  <button type="button" className={`nes-btn is-primary`} onClick={() => setShowFavs(!showFavs)}>
                     {!showFavs ? 'Show Favorites' : 'Hide Favorites'}
                  </button>
               </div>
               {showFavs && (
                  <table className={`nes-table is-bordered ${classes.favoritesTable}`}>
                     <thead>
                        <tr>
                           <th>Quote</th>
                           <th>Author</th>
                           <th>Game</th>
                        </tr>
                     </thead>
                     <tbody>
                        {(favorites.length > 0) && (
                           <>
                              {favorites.map((favorite, index) => {
                                 return (
                                    <tr key={favorite.id}>

                                       <td>{favorite.quote}</td>
                                       <td>{favorite.quoter}</td>
                                       <td>{favorite.game}</td>
                                    </tr>
                                 )
                              })}
                           </>
                        )}
                     </tbody>
                  </table>
               )}
            </div>
         </div>
      </div >
   );
};

export default Index;
