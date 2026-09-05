class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nm: dict[int,int] = dict()
        res: set[tuple[int,int,int]] = set()
        for i,num in enumerate(nums):
            nm[num] = nm.get(num,0) + 1
        for i,n in enumerate(nums):
            for j,m in enumerate(nums):
                if i==j:
                    continue
                print(n,m,-n-m)
                if n in nm and m in nm and -n-m in nm and (n,m,-n-m) not in res:
                    print("BANG")
                    if nm[n]>1:
                        nm[n]-=1
                    else:
                        del nm[n]
                    if nm[m]>1:
                        nm[m]-=1
                    else:
                        del nm[m]
                    if nm[-n-m]>1:
                        nm[-n-m]-=1
                    else:
                        del nm[-n-m]
                    res.add((n,m,-n-m))
        return [list(_) for _ in res]


inp = [-1,0,1,2,-1,-4]
s = Solution().threeSum(inp)
print(s)