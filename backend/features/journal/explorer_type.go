package journal

// Represents a node in a virtual tree structure.
// It has an ID and a list of child nodes.
type ExplorerNode struct {
	Id    int            `form:"id"    json:"id"               cbor:"0,keyasint"`
	Child []ExplorerNode `form:"child" json:"child,omitempty"  cbor:"1,keyasint"`
}

// Representing a list of virtual trees.
type ExplorerTree []ExplorerNode
