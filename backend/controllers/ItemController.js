import * as itemService from "../services/itemService.js";

export const getItems = async (req, res) => {
  try {
    const items = await itemService.fetchItems(req.user.sub);
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    handleError(res, err);
  }
};

export const createItem = async (req, res) => {
  try {
    const newItem = await itemService.addItem(req.user.sub, req.body, req.file);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteItem = async (req, res) => {
  try {
    const deletedItem = await itemService.removeItem(req.user.sub, req.params.id);
    res.status(200).json({ success: true, data: deletedItem });
  } catch (err) {
    handleError(res, err);
  }
};

// Optional centralized error handler for controllers
function handleError(res, err) {
  if (["Unauthorized", "BadRequest", "NotFound"].includes(err.message)) {
    const statusMap = { Unauthorized: 401, BadRequest: 400, NotFound: 404 };
    res.status(statusMap[err.message]).json({ success: false, message: err.message });
  } else {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
