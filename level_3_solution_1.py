# Question Prompt
# You're awfully close to destroying the LAMBCHOP doomsday device and freeing Commander Lambda's bunny workers, but once they're free of the work duties the bunnies are going to need to escape Lambda's space station via the escape pods as quickly as possible. Unfortunately, the halls of the space station are a maze of corridors and dead ends that will be a deathtrap for the escaping bunnies. Fortunately, Commander Lambda has put you in charge of a remodeling project that will give you the opportunity to make things a little easier for the bunnies. Unfortunately (again), you can't just remove all obstacles between the bunnies and the escape pods - at most you can remove one wall per escape pod path, both to maintain structural integrity of the station and to avoid arousing Commander Lambda's suspicions. 
# You have maps of parts of the space station, each starting at a work area exit and ending at the door to an escape pod. The map is represented as a matrix of 0s and 1s, where 0s are passable space and 1s are impassable walls. The door out of the station is at the top left (0,0) and the door into an escape pod is at the bottom right (w-1,h-1). 
# Write a function solution(map) that generates the length of the shortest path from the station door to the escape pod, where you are allowed to remove one wall as part of your remodeling plans. The path length is the total number of nodes you pass through, counting both the entrance and exit nodes. The starting and ending positions are always passable (0). The map will always be solvable, though you may or may not need to remove a wall. The height and width of the map can be from 2 to 20. Moves can only be made in cardinal directions; no diagonal moves are allowed.

import copy

def solution(map):
    pathSizes = []

    def recursion(map1, row, col, count):
        if row >= len(map1) or col >= len(map1[0]) or row < 0 or col < 0:
            return 0, count
        elif row == len(map1) - 1 and col == len(map1[0]) - 1:

            pathSizes.append(count + 1)
            return 1, count
        elif map1[row][col] == 0:
            count += 1
            map1[row][col] = 2
            # for m in map:
            #     print(m)
            # print(' ')

            complete, count = recursion(map1,row + 1, col, count)
            complete, count = recursion(map1, row, col +1, count)
            complete, count = recursion(map1,row - 1, col, count)
            complete, count = recursion(map1, row, col - 1, count)
            if complete == 0:
                map1[row][col] = 1
                count -= 1
        return 0, count

    temp =0
    for i, r in enumerate(map):
        for j, c in enumerate(r):
            if map[i][j] == 1:
                mapCopy = copy.deepcopy(map)
                mapCopy[i][j] = 0
                # for ro in mapCopy:
                #     print(ro)
                complete, count = recursion(mapCopy,0,0,0)
                # print(pathSizes[temp])
                temp += 1

    # print(pathSizes)
    return min(pathSizes)

map1 = [[0,1,1,0],
        [0,0,0,1],
        [0,1,0,0],
        [0,1,1,0]]

map2 = [[0, 0, 0, 0, 0, 0], 
        [1, 1, 1, 1, 1, 0], 
        [0, 0, 0, 0, 0, 0], 
        [0, 1, 1, 1, 1, 1], 
        [0, 1, 1, 1, 1, 1], 
        [0, 0, 0, 0, 0, 0]]

map3 = [[0, 1, 0, 0, 0], 
        [0, 1, 0, 1, 0], 
        [0, 0, 0, 1, 0], 
        [0, 1, 1, 1, 0], 
        [0, 0, 0, 0, 0]]

print(solution(map1))
# solution2(map3)


