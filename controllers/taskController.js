import Task from "../models/Task.js";

// @desc Get all tasks for user (with optional status filter)
// @route GET /api/tasks
// @access Private
export const getTasks = async (req, res) => {
  try {
    const { status } = req.query; // Pending or Completed
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// @desc Create task
// @route POST /api/tasks
// @access Private
export const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const task = new Task({
      user: req.user._id,
      title,
      description,
      status,
      dueDate,
    });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// @desc Update task
// @route PUT /api/tasks/:id
// @access Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const { title, description, status, dueDate } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.dueDate = dueDate ?? task.dueDate;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
