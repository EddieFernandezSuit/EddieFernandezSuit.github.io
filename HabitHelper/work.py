# import os
# import webbrowser

# def open_applications():
#     # Open clock application
#     os.system("start ms-clock:")  # For Windows

#     # Open vscode
#     os.system("code")  # Assuming you have vscode in your PATH

#     # Open chrome and go to the link
#     url = "https://app.dataannotation.tech/workers/projects"
#     chrome_path = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe %s"  # Assuming this is your chrome path
#     webbrowser.get(chrome_path).open(url)

# open_applications()


import os
import webbrowser
import time
import pyautogui

os.system('start ms-clock:')

time.sleep(1)

pyautogui.press('space')

os.system('code')

webbrowser.get('C:/Program Files/Google/Chrome/Application/chrome.exe %s').open('https://app.dataannotation.tech/workers/projects')