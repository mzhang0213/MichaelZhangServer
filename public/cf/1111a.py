t = int(input())
for ___ in range(t):
    n = int(input())
    print("yes" if sum(int(num) for num in input().split(" "))%4==0 else "no")