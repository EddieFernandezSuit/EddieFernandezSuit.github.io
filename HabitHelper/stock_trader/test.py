import alpaca_trade_api as tradeapi
from datetime import datetime
import yfinance as yf
import pytz
import requests
import json
import time

PAPER_URL = 'https://paper-api.alpaca.markets'
LIVE_URL = 'https://data.alpaca.markets'

PAPER_API_KEY = 'PKV05HVHYEZWIW2QL08D'
PAPER_API_SECRET= 'JLTG3FQjEPRI2wbnNU6lTCmvlg977ldCYndT137z'

LIVE_API_KEY='PKDT2N1Y07CYR8S1GBBT'
LIVE_API_SECRET='C4wvlecne870WzBUP0Qf1cpzOdl7scQ3OgbNgf4L'

def get_bars(symbol, timeframe='1Min', limit=10000):
    url = f"https://data.alpaca.markets/v2/stocks/bars?symbols={symbol}&timeframe={timeframe}&limit={limit}&adjustment=raw&feed=sip&sort=asc"
    headers = {
        "accept": "application/json",
        "APCA-API-KEY-ID": PAPER_API_KEY,
        "APCA-API-SECRET-KEY": PAPER_API_SECRET
    }
    response = requests.get(url, headers=headers)
    bars = json.loads(response.text)
    return bars

def get_simple_bars(symbol, timeframe='1Min', limit=10000):
    bars = get_bars(symbol, timeframe, limit)
    bars = bars.get('bars', {}).get('AAPL', [])
    simple_bars = [{'close': bar['c'], 'time': bar['t']} for bar in bars]
    # result = [{'close': bar['c'], 'time': convert_to_timezone(bar['t'])} for bar in bars]
    return simple_bars

def convert_to_timezone(utc_timestamp, timezone_str='America/Los_Angeles'):
    utc = pytz.utc
    target_timezone = pytz.timezone(timezone_str)
    utc_time = datetime.strptime(utc_timestamp, '%Y-%m-%dT%H:%M:%SZ')
    utc_time = utc.localize(utc_time)
    local_time = utc_time.astimezone(target_timezone)
    return local_time.strftime('%Y-%m-%d %H:%M:%S %Z')

def get_last_close(symbol):
    cont = False
    while cont == False:
        try:
            last_close = yf.download('AAPL','2024-06-25')['Close'].iloc[0]
            cont = True
        except:
            cont = False
    # live_url = tradeapi.REST(LIVE_API_KEY, LIVE_API_SECRET, LIVE_URL, api_version='v2')
    # latest = live_url.get_latest_bars(symbol)[symbol].c
    return last_close

def calculate_sma(data, period):
    period = min(period, len(data))
    sma_values = []
    closes = [entry['close'] for entry in data]
    
    for i in range(len(closes) - period + 1):
        sum_data = sum(closes[i:i+period])
        sma = sum_data / period
        sma_values.append(round(sma,2))
    
    return sma_values

def create_order(symbol='AAPL', qty=1, side='buy'):
    url = "https://paper-api.alpaca.markets/v2/orders"

    payload = {
        "side": side,
        "type": "market",
        "time_in_force": "day",
        "qty": str(qty),
        "symbol": "AAPL"
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "APCA-API-KEY-ID": PAPER_API_KEY,
        "APCA-API-SECRET-KEY": PAPER_API_SECRET
    }

    response = requests.post(url, json=payload, headers=headers)
    print(response.text)

def get_crypto_bars(symbol='BTC/USD', timeframe='1Min', limit=10000):
    url = f"https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols={symbol}&timeframe={timeframe}&limit={limit}&sort=asc"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    bars = json.loads(response.text)
    bars = bars.get('bars', {}).get(symbol, [])
    simple_bars = [{'close': bar['c'], 'time': bar['t']} for bar in bars]
    return simple_bars

def get_latest_crypto(symbol='BTC/USD'):
    url = f"https://data.alpaca.markets/v1beta3/crypto/us/latest/bars?symbols={symbol}"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    latest_crypto = json.loads(response.text)['bars'][symbol]['c']
    return latest_crypto

def create_crypto_order(symbol='BTC/USD', side='buy', qty=.001):
    url = PAPER_URL + '/v2/orders'
    # url = "https://paper-api.alpaca.markets/v2/orders"

    payload = {
        "side": side,
        "type": "market",
        "time_in_force": "gtc",
        "symbol": symbol,
        "qty": str(qty)
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "APCA-API-KEY-ID": PAPER_API_KEY,
        "APCA-API-SECRET-KEY": PAPER_API_SECRET
    }

    response = requests.post(url, json=payload, headers=headers)
    print(response.text)


while True:
    SYMBOL = 'BTC/USD'

    bars = get_crypto_bars(SYMBOL)
    last_close = get_latest_crypto(SYMBOL)
    sma1 = calculate_sma(bars, 10)[-1]
    sma2 = calculate_sma(bars, 100)[-1]
    sma3 = calculate_sma(bars, 1000)[-1]

    if sma1 < last_close and sma2 < last_close and sma3 < last_close:
        create_crypto_order(side='sell')
        print('Stock Sold')
    
    if sma1 > last_close and sma2 > last_close and sma3 > last_close:
        create_crypto_order()
        print('Stock Purchased')

    print('last_close', last_close)
    print('sma1', sma1)
    print('sma2', sma2)
    print('sma1', sma3)
    time.sleep(60)



# while True:
#     SYMBOL = 'AAPL'

#     bars = get_simple_bars(SYMBOL)
#     last_close = get_last_close(SYMBOL)
#     sma1 = calculate_sma(bars, 10)[-1]
#     sma2 = calculate_sma(bars, 100)[-1]
#     sma3 = calculate_sma(bars, 1000)[-1]

#     if sma1 < last_close and sma2 < last_close and sma3 < last_close:
#         create_order(SYMBOL, 1, 'sell')
#         print('Stock Sold')
    
#     if sma1 > last_close and sma2 > last_close and sma3 > last_close:
#         create_order(SYMBOL, 1)
#         print('Stock Purchased')

#     print(last_close)
#     print(sma1)
#     print(sma2)
#     print(sma3)
#     time.sleep(60)