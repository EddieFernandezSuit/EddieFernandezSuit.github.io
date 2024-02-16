def calculate_volume(walls):
    total_cubic_yards = 0
    for i in range(len(walls)):
        total_cubic_yards += (walls[i]['length'] - walls[i-1]['width']) * walls[i]['width'] * walls[i]['height']
    return total_cubic_yards

# def calculate_cubic_yards(width, height, lengths):
#     total_cubic_yards = 0
#     for i in range(len(walls)):
#         total_cubic_yards += (lengths[i] - width) * width * height
#     return total_cubic_yards

def fixedWidthAndHeight():
    width = int(input('Width: '))
    height = int(input('Height: '))

    lengths = []

    i = 1
    length = input('Length ' + str(i) + ': ')
    while(length != ''):
        length = int(length)
        i += 1
        lengths.append(length)
        length = input('Length ' + str(i) + ': ')

    cubic_yards = calculate_cubic_yards(width, height, lengths)
    print(cubic_yards)

def addNewWall(walls):
    i = len(walls) + 1
    print('Wall ' + str(i))
    wall = {
        'length': float(input('Length: ')),
        'width': float(input('Width: ')),
        'height': float(input('Height: ')),
    }
    if wall['length'] == 0 or wall['height'] == 0 or wall['width'] == 0:
        return 1
    
    walls.append(wall)
    return 0

    
def variableLengthWidthHeight():
    walls = []
    stop = 0
    addNewWall(walls)

    while stop == 0:
        stop = addNewWall(walls)

    volume = calculate_volume(walls)
    print('Feet: ' + str(volume))
    print('Yards: ' + str(volume * 1/3 * 1/3 * 1/3))

variableLengthWidthHeight()