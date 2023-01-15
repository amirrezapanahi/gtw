package adt

type Stack struct {
	isEmpty bool
	size    int
}

func (s *Stack) Empty() bool {
	return s.isEmpty
}

func (s *Stack) Add(value string) {
	s.isEmpty = false
	s.size += 1
}

func (s *Stack) Size() int {
	return s.size
}

func NewStack() *Stack {
	return &Stack{true, 0}
}
