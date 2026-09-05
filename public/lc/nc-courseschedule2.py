from typing import List


class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        adjl:dict[int,set[int]] = {}
        for i in range(numCourses):
            adjl[i]=set()
        for edge in prerequisites:
            adjl[edge[1]].add(edge[0])


        visited:list[int] = [0] * numCourses
        stk = []
        def topo(curr:int):
            visited[curr] = 1
            for adj in adjl[curr]:
                if visited[adj] == 0:
                    if not topo(adj):
                        return False
                elif visited[adj] == 1:
                    #back edge
                    return False
            visited[curr] = 2
            stk.append(curr)
            return True

        for i in range(numCourses):
            if visited[i] == 0:
                if not topo(i):
                    return []

        ret = []
        while stk:
            ret.append(stk.pop())

        return ret