package journal

// peak maximum data compression

// Represents a node in a virtual tree structure.
// It has an ID and a list of child nodes.
type VirTreeNode struct {
	Id    int           `json:"id"               cbor:"0,keyasint"`
	Child []VirTreeNode `json:"child,omitempty"  cbor:"0,keyasint"`
}

// Representing a list of virtual trees.
type VirTreeData []VirTreeNode
