import { Item } from "../models/item.model.js";
import { User } from "../models/user.model.js";

export const createItem = async (req, res) => {
  const { title, description, category, date, location, imageUrl} =
    req.body;

  try {

    const userId = req.user._id;

    //Create new Item
    const newItem = new Item({
      title,
      description,
      category,
      date,
      location,
      imageUrl,
      userId,
    });

    await newItem.save();

    return res.status(201).json({
      message: "Item created successfully",
      success: true,
      data: newItem,
    });
  } catch (error) {
    console.log("Error creating Item", error);
    return res.status(500).json({
      message: "Error creating Item",
      success: false,
      error: error.message,
    });
  }
};

export async function getItems(req, res) {
  try {
    const items = await Item.find().populate("userId", "name email");
    return res.status(200).json({
      message: "Items fetched successfully",
      success: true,
      data: items,
    });
  } catch (error) {
    console.log("Error fetching items", error);
    return res.status(500).json({
      message: "Error fetching items",
      success: false,
      error,
    });
  }
}

export const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    //check if item exists
    const item = Item.findOne({ id }).populate("userId", "name email");
    if (!item) {
      return res.status(404).json({
        message: "Item not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Item fetched successfully",
      success: true,
      data: item,
    });
  } catch (error) {
    console.log("Error fetching item", error);
    return res.status(500).json({
      message: "Error fetching item",
      success: false,
      error: error.message,
    });
  }
};

// Update route /item/update
export const updateItem = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // check if item exists
    const item = await Item.findById(id);
    if(!item) {
        return res.status(404).json({
            message: "Item not found",
            success:false
        })
    }

    // update the Item
    const updatedItem = await Item.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(200).json({
        message: "Item updated successfully",
        success: true,
        data: updatedItem
    })
  } catch (error) {
    console.log("Error updating item", error);
    return res.status(500).json({
        message: "Error updating item",
        success: false,
        error: error.message
    })
  }
};

// Delete route /item/delete
export const deleteItem = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const userId = user._id;

  try{
      // fetch item
    const item = await Item.findById(id);
    if(!item) {
        return res.status(404).json({
            message: "Item not found",
            success:false
        })
    }

    //Authorization: check if user is author of item
    const isOwner = item.userId.equals(userId);
    const isAdmin = req.user.role === "admin";


    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to delete this item",
        success: false
      })
    }

    await item.deleteOne();

    return res.status(200).json({
      message: "Item deleted successfuly", 
      success: true
    })


  } catch (error) {
    console.log("Error deleting item", error);
    return res.status(500).json({
        message: "Error deleting item",
        success: false,
        error: error.message
    })
  }
};
