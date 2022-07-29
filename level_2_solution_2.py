# pegs is a list of the horizontal posiiton of each gear peg in a line of gear pegs.
# write a function that returns a list that contains [numerator, denominator] of the ratio of the first gears radius such that if each following
# gear had the appropriate radius to connect to each previous gear then the first gears radius would be twice the radius of the last gear.
# If there is no solution then return [-1,-1]

def solution(pegs):
    radius1 = 0
    radius1Ratio = []
    C = 0
    pegsReversed = reversed(pegs)
    sign = -1
    for index, peg in enumerate(pegsReversed):
        if index == 0:
            C += peg
        elif index == len(pegs) - 1:
            C += sign * peg
        else:
            C += sign * 2 * peg
            sign *= -1
    
    if len(pegs) % 2 == 0:
        radius1 = 2 * C / 3
        if (2 * C) % 3 == 0:
            radius1Ratio = [int(2 * C / 3), 1]
        else:
            radius1Ratio = [2 * C, 3]
    else:
        radius1 = -2 * C
        radius1Ratio = [-2 * C, 1]
    if radius1 < 1 or C + radius1 == 0 or C - radius1 == 0:
        radius1Ratio = [-1,-1]

    radius = []
    lastPeg = 0
    for index, peg in enumerate(pegs):
        if index == 0:
            radius.append(radius1)
        else:
            r = pegs[index] - pegs[index-1] - radius[index-1]
            radius.append(r)
            if r <= 0:
                radius1Ratio = [-1,-1]
    
    print(radius)

    return radius1Ratio

# print(solution([1,1000]))
print(solution([4,30,50]))

