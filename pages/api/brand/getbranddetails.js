import Brand from "@/models/Brand";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const { _id } = req.query;

    try {
      // Find the brand by id
      const brand = await Brand.findById(_id);

      if (!brand) {
        return res
          .status(404)
          .json({ success: false, error: "brand not found" });
      }
      res.status(200).json({ success: true, brand });
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
