# Find the Access Codes
# =====================

# In order to destroy Commander Lambda's LAMBCHOP doomsday device, you'll need access to it. But the only door leading to the LAMBCHOP chamber is secured with a unique lock system whose number of passcodes changes daily. Commander Lambda gets a report every day that includes the locks' access codes, but only the Commander knows how to figure out which of several lists contains the access codes. You need to find a way to determine which list contains the access codes once you're ready to go in. 
# Fortunately, now that you're Commander Lambda's personal assistant, Lambda has confided to you that all the access codes are "lucky triples" in order to make it easier to find them in the lists. A "lucky triple" is a tuple (x, y, z) where x divides y and y divides z, such as (1, 2, 4). With that information, you can figure out which list contains the number of access codes that matches the number of locks on the door when you're ready to go in (for example, if there's 5 passcodes, you'd need to find a list with 5 "lucky triple" access codes).
# Write a function solution(l) that takes a list of positive integers l and counts the number of "lucky triples" of (li, lj, lk) where the list indices meet the requirement i < j < k.  The length of l is between 2 and 2000 inclusive.  The elements of l are between 1 and 999999 inclusive.  The solution fits within a signed 32-bit integer. Some of the lists are purposely generated without any access codes to throw off spies, so if no triples are found, return 0. 
# For example, [1, 2, 3, 4, 5, 6] has the triples: [1, 2, 4], [1, 2, 6], [1, 3, 6], making the solution 3 total.

# Test cases
# ==========

# -- Python cases --
# Input:
# solution.solution([1, 2, 3, 4, 5, 6])
# Output:
#     3

# Input:
# solution.solution([1, 1, 1])
# Output:
#     1

# def solution(l):
#     count = 0
#     for i, num1 in enumerate(l):
#         for j, num2 in enumerate(l):
#             for k, num3 in enumerate(l):
#                 if i < j and j < k:
#                     if num2 % num1 == 0 and num3 % num2 == 0:
#                         count += 1
#     return count


def solution(l):
    count = 0
    for i, num1 in enumerate(l):
        for j, num2 in enumerate(l):
            if i < j and num1 < num2 and num2 % num1 == 0:
                for k, num3 in enumerate(l):
                        if j < k and num3 % num2 == 0:
                            count += 1
                            print([num1,num2,num3])
    return count


# def solution(l):
#     count = 0
#     secondIndex = []
#     for i, num1 in enumerate(l):
#         if num1 != 0:
#             for j, num2 in enumerate(l):
#                 if l[j] != 0 and i < j and num2 % num1 == 0:
#                     secondIndex.append(j)
    
#     for j in secondIndex:
#         for k, num3 in enumerate(l):
#             if j < k and num3 % l[j] == 0:
#                 count += 1
#     return count

# def solution(l):
#     count = 0
#     secondIndex = []
#     for i, num1 in enumerate(l):
#         if num1 != 0:
#             j = i + 1
#             while(j < len(l)):
#                 if l[j] != 0 and l[j] % num1 == 0:
#                     secondIndex.append(j)
#                 j += 1
        
#     for j in secondIndex:
#         k = j + 1
#         while(k < len[l]):
#             if k[l] % l[j] == 0:
#                 count += 1
#             k += 1
#     return count


# def solution(l):
    # count = 0
    # secondIndex = []
    # for i, num1 in enumerate(l):
    #     for j, num2 in enumerate(l):
    #         if num1 != 0 and i < j and num2 % num1 == 0:
    #             secondIndex.append(j)

    # for k, num3 in enumerate(l):
    #     for j in secondIndex:
    #         if l[j] != 0 and j < k and num3 % l[j] == 0:
    #             count += 1

    # hash = {}
    # for i, num in enumerate(l):
    #     hash[num] = []
    # for i, num in enumerate(l):
    #     hash[num].append(i)
    # for key in hash:
        
        


list1 = range(1,2000)
sol = solution(range(1,100))
# sol = solution(list1)
# sol = solution([1,2,3,4,5,6])
# sol = solution([2,4])

print(sol)