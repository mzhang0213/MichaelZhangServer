"""
# Definition for a Node.
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random
"""
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random

from typing import Optional


class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        if head is None:
            return None

        old_to_new: dict[Node, Node] = {}
        temp = head
        while temp is not None:
            old_to_new[temp] = Node(temp.val)
            temp = temp.next

        temp = head
        while temp is not None:
            copy = old_to_new[temp]
            copy.next = old_to_new.get(temp.next)
            copy.random = old_to_new.get(temp.random)
            temp = temp.next

        return old_to_new[head]


s = Solution()
inp = [[7,None],[13,0],[11,4],[10,2],[1,0]]
nodes:list[Node] = []
# inp = [[3,None],[3,0],[3,None]]
test_head = None
for raw in inp:
    curr = Node(raw[0])
    nodes.append(curr)
for i,node in enumerate(nodes):
    if i<len(nodes)-1:
        node.next = nodes[i+1]
    node.random = None if inp[i][1] is None else nodes[inp[i][1]]

sol = s.copyRandomList(nodes[0])
while sol is not None:
    print(sol.val, sol.random.val if sol.random else None)
    sol = sol.next