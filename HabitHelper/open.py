import subprocess
import webbrowser 

# python -m PyInstaller open.py

url = "http://localhost:8000/HabitHelper/app.html"
directory = "C:\\Users\\ferna\\Downloads\\GIthub\\EddieFernandezSuit.github.io"
webbrowser.open(url)
p = subprocess.Popen(["python3", "-m", "http.server"], cwd=directory)
