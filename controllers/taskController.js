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
    console.error("❌ getTasks error:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// @desc Create task
// @route POST /api/tasks
// @access Private
export const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status: status || "Pending",
      dueDate,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("❌ createTask error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// @desc Update task
// @route PUT /api/tasks/:id
// @access Private
export const updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { title, description, status, dueDate } },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error("❌ updateTask error:", err);
    res.status(500).json({ message: "Failed to update task" });
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
    console.error("❌ deleteTask error:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
