import styled from "styled-components";
import {Link} from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchCoins } from "../api";
import { Helmet } from "react-helmet";
const Container = styled.div`
padding: 0px 10px;
max-width: 440px;
margin: auto;
`;

const Header = styled.header`
height:15vh;
display: flex;
justify-content: center;
align-items: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
background-color: white;
color: ${(porps) => porps.theme.bgColor};
margin-bottom:20px;
border-radius: 15px;
a {
    padding: 20px 15px;
    transition: all 0.2s ease-in;
    display: flex;
    align-items: center;
}
&:hover {
    a {
        color: ${(props) => props.theme.accentColor}
    }
}
`;

const Title = styled.h1`
font-size: 60px;
color:${props => props.theme.accentColor};
`
const coins = [
    {
      id: "btc-bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      rank: 1,
      is_new: false,
      is_active: true,
      type: "coin",
    },
    {
      id: "eth-ethereum",
      name: "Ethereum",
      symbol: "ETH",
      rank: 2,
      is_new: false,
      is_active: true,
      type: "coin",
    },
    {
      id: "hex-hex",
      name: "HEX",
      symbol: "HEX",
      rank: 3,
      is_new: false,
      is_active: true,
      type: "token",
    },
  ];
const Loader = styled.span`
text-align: center;
display: block;
font-size: 22px;
`;
const Img = styled.img`
width: 30px;
height: 30px;
margin-right: 15px;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins(){
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);
  return (
    <Container>
      <Helmet>
        <title>
        COIN
        </title>
      </Helmet>
        <Header>
        <Title>COIN</Title>
        </Header>
            {isLoading ? ( 
              <Loader>Loading...</Loader>
            ) : ( <CoinsList>
              {data?.slice(0, 150).map((coin)  => <Coin key={coin.id}><Link to={{
                pathname:`${coin.id}`,
                state: {name: coin.name},
              }}>
              <Img src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`} />
                {coin.name} &rarr;
               </Link> 
               </Coin>
               )}
            </CoinsList>)}
        
    </Container>
    )
}
export default Coins;