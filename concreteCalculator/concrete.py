import webbrowser
import subprocess

def calculate_volume(walls):
    total_cubic_yards = 0
    for i in range(len(walls)):
        total_cubic_yards += (walls[i]['length'] - walls[i-1]['width']) * walls[i]['width'] * walls[i]['height']
    return total_cubic_yards

def add_new_wall(walls):
    wall = {
        'length': float(input('Length: ')),
        'width': float(input('Width: ')),
        'height': float(input('Height: ')),
    }
    walls.append(wall)
    
def calculate_volume_all_walls():
    walls = []
    add_new_wall(walls)

    while True:
        choice = input("Do you want to add another wall? (yes/no): ")
        if choice.lower() == "yes":
            i = len(walls) + 1
            print('Wall ' + str(i))
            add_new_wall(walls)

        elif choice.lower() == "no":
            break
        else:
            print("Invalid choice. Please enter 'yes' or 'no'.")

    volume = calculate_volume(walls)
    print('Feet: ' + str(volume))
    print('Yards: ' + str(volume * 1/3 * 1/3 * 1/3))

# calculate_volume_all_walls()

def start_server():
    url = "http://localhost:8000/CONCRETECALCULATOR/app.html"
    directory = "C:\\Users\\ferna\\Downloads\\GIthub\\EddieFernandezSuit.github.io"
    webbrowser.open(url)
    p = subprocess.Popen(["python3", "-m", "http.server"], cwd=directory)

start_server()

