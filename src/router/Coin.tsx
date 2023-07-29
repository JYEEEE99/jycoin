import { useLocation, useParams, Switch, Route, Link, useRouteMatch, } from "react-router-dom";
import { styled } from "styled-components";
import Price from "./Price"
import Chart from "./Chart"
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet";

interface RouteParams {
    coinId:string;
}
interface RouteState {
    name: string;
}
const Container = styled.div`
padding: 0px 10px;
max-width: 440px;
margin: auto;
`;

const Header = styled.header`
height:20vh;
display: flex;
justify-content: center;
align-items: center;
`;

const Title = styled.h1`
font-size: 45px;
color:${props => props.theme.accentColor};
text-shadow:2px 2px 2px rgba(0, 0, 0, 0.3);;
`
const Loader = styled.span`
text-align: center;
display: block;
font-size: 22px;
`;
const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${props => props.theme.textColor};
  color: ${props => props.theme.bgColor};
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 20px;
  
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 25px;
  span:first-child {
    font-size: 13px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 25px 10px;
  font-size: 15px;
  line-height: 1.3;
`;
const Tabs = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 30px 0;
    gap: 20px;
`
const Tab = styled.span<{ isActive: boolean }>`
    text-align: center;
    text-transform: uppercase;
    font-size: 15px;
    background-color: ${props => props.theme.textColor};
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.2);
    a {
        color: ${(props) => props.isActive ? props.theme.accentColor : props.theme.bgColor};
        display: block;
        &:hover {
            opacity: 0.8;
        }
    }
`


interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
  }
  
  interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
      USD: {
        ath_date: string;
        ath_price: number;
        market_cap: number;
        market_cap_change_24h: number;
        percent_change_1h: number;
        percent_change_1y: number;
        percent_change_6h: number;
        percent_change_7d: number;
        percent_change_12h: number;
        percent_change_15m: number;
        percent_change_24h: number;
        percent_change_30d: number;
        percent_change_30m: number;
        percent_from_price_ath: number;
        price: number;
        volume_24h: number;
        volume_24h_change_24h: number;
      };
    };
  }
function Coin(){
    const { coinId } = useParams<RouteParams>();
    const { state } = useLocation<RouteState>();
    const chartMatch = useRouteMatch("/:coinId/chart");
    const priceMatch = useRouteMatch("/:coinId/price");
    
    const {isLoading: infoLoading, data: infoData } = useQuery<InfoData>(["info", coinId], () => fetchCoinInfo(coinId));
    
    const {isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(["tickers", coinId], () => fetchCoinTickers(coinId),
    {
      refetchInterval: 5000,
    }
    )

    const loading = infoLoading || tickersLoading;
    return ( <Container>
      <Helmet>
        <title>
        {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
    <Header>
    <Title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</Title>
    
    </Header>
        {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
           <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>${tickersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
                <Link to={`/${coinId}/chart`}>Chart</Link>
           </Tab>
           <Tab isActive={priceMatch !== null}>
           <Link to={`/${coinId}/price`}>Price</Link>
           </Tab>
          </Tabs>
          <Switch>
            <Route path={`/:coinId/price`}>
              <Price />
            </Route>
            <Route path={`/:coinId/chart`}>
              <Chart coinId={coinId}/>
            </Route>
          </Switch>
        </>
      )}
        </Container>
    );
}
export default Coin;