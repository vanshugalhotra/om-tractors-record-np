import Type from "@/models/Type";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const { _id } = req.query;

    try {
      // Find the type by id
      const type = await Type.findById(_id);

      if (!type) {
        return res
          .status(404)
          .json({ success: false, error: "type not found" });
      }
      res.status(200).json({ success: true, type });
    } catch (error) {
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, error: "This method is not allowed" });
  }
};

export default connectDb(handler);
