def fibonacci(n):
    if n == 1:
        return 0
    elif n == 2:
        return 1
    
    a, b = 0, 1
    for i in range(2, n):
        a, b = b, a + b
    
    return b

print(fibonacci(5)) #should output 3
