# Definition for singly-linked list.
from typing import Optional


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        if head.next is None:
            return head
        n=0
        curr=head
        while curr is not None:
            n+=1
            curr=curr.next
        i=0
        gi=0
        nhead=None
        first=None
        just=None
        hold_first = None
        curr=head
        while curr is not None: #need limit for group
            if gi>=k:
                if hold_first is not None:
                    hold_first.next = just
                if nhead is None:
                    nhead=just
                #reset cycle except if remaining < k
                if n-i < k:
                    first.next=curr
                    return nhead
                hold_first = first
                gi=0
                first=None
                just=None
            temp=curr.next
            if just is not None:
                curr.next=just
            if first is None:
                first=curr
            just=curr
            curr=temp
            gi+=1
            i+=1
        if gi>=k:
            first.next = None
            if hold_first is not None:
                hold_first.next = just
            if nhead is None:
                nhead=just
        return nhead




inp = [1,2,3,4]
k=2

s = Solution()
nodes:list[ListNode] = []
# inp = [[3,None],[3,0],[3,None]]
test_head = None
for raw in inp:
    curr = ListNode(raw)
    if test_head is None:
        test_head = curr
    nodes.append(curr)
for i,node in enumerate(nodes):
    if i<len(nodes)-1:
        node.next = nodes[i+1]

sol = s.reverseKGroup(test_head, k)
while sol is not None:
    print(sol.val)
    sol = sol.next