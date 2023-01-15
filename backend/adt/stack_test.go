package adt_test

import (
	"gtw/adt"
	"testing"
)

func TestEmpty(t *testing.T) {
	s := adt.NewStack()

	if s.Empty() != true {
		t.Error("Stack was not empty")
	}
}

func TestNotEmpty(t *testing.T) {
	s := adt.NewStack()
	s.Add("bob")

	if s.Empty() == true {
		t.Error("Stack was empty")
	}
}

func TestSizeZero(t *testing.T) {
	s := adt.NewStack()

	if s.Size() != 0 {
		t.Errorf("Expected 0 elements, found: %d", s.Size())
	}
}
