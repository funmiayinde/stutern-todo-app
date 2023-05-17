const expressApp = require("express");
const router = expressApp.Router();
const Validator = require("validatorjs");

const Todo = require("../models/Todo.js");

/** GET /todos/ */
router.get("/", async (req, res, next) => {
  try {
    const todos = await Todo.find({});
    return res.status(200).json({
      status: true,
      data: todos,
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "There is an error with our server, please try again later",
    });
  }
});

/*** POST /todos */
router.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    const rule = {
      name: "required|string",
      completed: "required|boolean",
      note: "required|string",
    };
    const validate = new Validator(body, rule);
    if (!validate.passes()) {
      return res.status(400).json({
        status: false,
        message: "There is a missing field in your input",
        error: validate.errors.all(),
      });
    }
    let todo = new Todo({ ...body });
    todo = await todo.save();
    return res.status(201).json({
      status: true,
      data: todo,
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "There is an error with our server, please try again later",
    });
  }
});

/*** GET /todos/:id */
router.get("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        status: false,
        message: "This todo cannot be found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Todo successfully created",
      data: todo,
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "There is an error with our server, please try again later",
    });
  }
});

/** Put /todos/:id */
router.put("/:id", async (req, res, next) => {
  try {
    const body = req.body;
    const rule = {
      completed: "required|boolean",
    };
    const validate = new Validator(body, rule);
    if (!validate.passes()) {
      return res.status(400).json({
        status: false,
        message: "There is a missing field in your input",
        error: validate.errors.all(),
      });
    }
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { ...body },
      { new: true }
    );
    return res.status(200).json({
      status: true,
      message: "Todo successfully updated",
      data: todo,
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "There is an error with our server, please try again later",
    });
  }
});

/** Delete /todos/:id */
router.delete("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndRemove(req.params.id);
    return res.status(200).json({
      status: true,
      message: "Todo deleted successfully",
      data: { _id: todo._id },
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "There is an error with our server, please try again later",
    });
  }
});

module.exports = router;
