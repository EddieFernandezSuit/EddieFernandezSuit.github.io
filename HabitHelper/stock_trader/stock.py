import alpaca_trade_api as tradeapi
from alpaca_trade_api.rest import REST, TimeFrame
import pandas as pd
import time

# Alpaca API credentials
API_SECRET= 'DOnBKR37EG91Km5UJAHgcJYkQewghBjn92rULLal'
API_KEY = 'PKCALNF3CNOG6C5RYYPZ'

BASE_URL = 'https://paper-api.alpaca.markets'  # For paper trading
DATA_URL = 'https://data.alpaca.markets'  # For accessing market data

# Initialize Alpaca API for trading
api = tradeapi.REST(API_KEY, API_SECRET, BASE_URL, api_version='v2')
data_api = tradeapi.REST(API_KEY, API_SECRET, DATA_URL, api_version='v2')

# Define stock symbol and moving averages periods
symbol = 'AAPL'
short_window = 50
long_window = 200

def get_moving_average(prices, window):
    """Calculate the moving average for the given prices and window."""
    return prices.rolling(window=window).mean()

def get_market_price(symbol):
    """Fetch the current market price of the given symbol."""
    try:
        bar = api.get_last_trade(symbol)
        return bar.price
    except Exception as e:
        print(f"Error fetching market price: {e}")
        return None

def get_historical_data(symbol, limit):
    """Fetch historical market data for the given symbol."""
    try:
        print(f"Fetching data for {symbol} with limit {limit}")
        bars = data_api.get_bars(symbol, tradeapi.TimeFrame.Minute, limit=limit).df
        print("Fetched Data Columns:", bars.columns)
        print("First few rows of fetched data:\n", bars.head())
        if 'close' in bars.columns:
            return bars[['close']].reset_index()
        else:
            print("Close column not found in fetched data.")
            return None
    except Exception as e:
        print(f"Error fetching historical data: {e}")
        return None

def check_and_trade():
    """Check the moving averages and execute trades based on the strategy."""
    data = get_historical_data(symbol, long_window + 1)
    if data is None:
        print("Historical data not available.")
        return

    # Calculate moving averages
    data['short_ma'] = get_moving_average(data['close'], short_window)
    data['long_ma'] = get_moving_average(data['close'], long_window)
    
    # Get the latest moving averages
    short_ma = data['short_ma'].iloc[-1]
    long_ma = data['long_ma'].iloc[-1]
    market_price = get_market_price(symbol)
    if market_price is None:
        print("Market price not available.")
        return
    
    # Print current indicators
    print(f"Short MA: {short_ma}, Long MA: {long_ma}, Market Price: {market_price}")
    
    # Check the conditions and place orders
    if short_ma > long_ma and market_price < short_ma and market_price < long_ma:
        positions = api.list_positions()
        if not any(pos.symbol == symbol for pos in positions):
            print(f"Buying {symbol} at {market_price}")
            try:
                api.submit_order(
                    symbol=symbol,
                    qty=1,
                    side='buy',
                    type='market',
                    time_in_force='gtc'
                )
            except Exception as e:
                print(f"Error placing order: {e}")

def main():
    """Main function to run the trading bot."""
    while True:
        check_and_trade()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    main()
