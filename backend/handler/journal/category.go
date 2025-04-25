package journal

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"time"
)

// Defines how a new category should be created.
type CategorySchema struct {
	Name string `form:"name" json:"name" binding:"required"`
}

// Defines how a category can be updated.
type CategoryUpdateSchema struct {
	Name string `form:"name" json:"name"`
}

// Holds all the information about a category.
//
// You can think of it as a folder.
type CategoryData struct {
	Id       int           `json:"id"                 cbor:"0,keyasint"`
	Type     uint8         `json:"type"               cbor:"1,keyasint"`
	Created  time.Duration `json:"created"            cbor:"2,keyasint"`
	Modified time.Duration `json:"modified,omitempty" cbor:"3,keyasint,omitempty"`
	Name     string        `json:"name"               cbor:"4,keyasint"`
}

func CreateCategory(groupId int, schema *CategorySchema) *CategoryData {
	stringCategoryId, categoryId := utils.GenerateRandomNumberId()

	newData := CategoryData{
		Id:      categoryId,
		Type:    uint8(TYPE_CATEGORY),
		Created: utils.GetCurrentDateNow(),
		Name:    schema.Name,
	}

	internals.ModifyCacheDb(utils.IntToString(groupId), func(thisCache *internals.JSONCacheUtils) {
		thisCache.Set(stringCategoryId, &newData)
	})

	utils.BSON_WriteFile(GetCategorySavedFilePath(groupId, categoryId), &newData)

	return &newData
}

func DeleteCategory(groupId int, categoryId int) {
	utils.RemoveFileOrDirectory(GetCategorySavedFilePath(groupId, categoryId))

	internals.ModifyCacheDb(utils.IntToString(groupId), func(thisCache *internals.JSONCacheUtils) {
		thisCache.Delete(utils.IntToString(categoryId))
	})
}
