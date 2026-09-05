t = int(input())
for ___ in range(t):
    n,k,m = tuple([int(num) for num in input().split(" ")])
    if k > m:
        #fail
        print("NO")
        continue
    print("YES")
    print(" ".join([str(_) for _ in [m-(k-1)] + [1]*(n-1)]))
    # compute first num: m-(1*(k-1))
    #   if i chose the first num to fill gap between m and k-1 1's