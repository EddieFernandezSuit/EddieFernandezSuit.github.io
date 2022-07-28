def solutionold(map):

    def recursion(map, row, col):
        map[row][col] = 9
        for m in map:
            print(m)
        print(' ')

        if row == len(map) - 1 and col == len(map[0]) - 1:
            return 1
        if col + 1 < len(map[0]) and map[row][col + 1] == 0:
            complete = recursion(map, row, col + 1)
            if complete: return complete
        if row + 1 < len(map) and map[row + 1][col] == 0:
            complete = recursion(map, row + 1, col)
            if complete: return complete
        if col - 1 > 0 and map[row][col - 1]:
            complete = recursion(map, row, col - 1)
            if complete: return complete
        if row - 1 > 0 and map[row - 1][col]:
            complete = recursion(map, row - 1, col)
            if complete: return complete

    complete = recursion(map,0,0)
    return complete

def solution(map):
    pathSizes = []

    def recursion(map, row, col, count):
        if row >= len(map) or col >= len(map[0]) or row < 0 or col < 0:
            return 0, count
        elif row == len(map) - 1 and col == len(map[0]) - 1:
            # map[row][col] = 0
            # for m in map:
            #     print(m)
            # print(' ')

            pathSizes.append(count + 1)
            return 1, count
        elif map[row][col] == 0:
            count += 1
            map[row][col] = 2
            # for m in map:
            #     print(m)
            # print(' ')

            complete, count = recursion(map,row + 1, col, count)
            complete, count = recursion(map, row, col +1, count)
            complete, count = recursion(map,row - 1, col, count)
            complete, count = recursion(map, row, col - 1, count)
            if complete == 0:
                map[row][col] = 1
                count -= 1
        return 0, count

    complete, count = recursion(map,0,0,0)
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

print(solution(map2))
# solution2(map3)
