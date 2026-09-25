import {
  executeDesktopAction as executeDesktopAgentAction,
} from "../services/desktop-agent.service.js";

export const executeDesktopAction = async (req, res) => {
  const { action, target } = req.body;

  if (!action) {
    return res.status(400).json({
      success: false,
      message: "Desktop action is required",
    });
  }

  try {
    const result = await executeDesktopAgentAction(action, target);

    return res.status(200).json({
      success: true,
      message: "Desktop action executed",
      result,
    });
  } catch (error) {
    console.error("Desktop Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Desktop action failed",
    });
  }
};