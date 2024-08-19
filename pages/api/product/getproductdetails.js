import Product from "@/models/Product";
import Type from "@/models/Type";
import Brand from "@/models/Brand";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const { _id } = req.query;

    try {
      // Find the product by id and populate type and brand fields
      const product = await Product.findById(_id)
        .populate({
          path: "type",
          select: "name color", // Specify the fields you want to populate
        })
        .populate({
          path: "brand",
          select: "name", // Specify the fields you want to populate for brand
        });

      if (!product) {
        return res
          .status(404)
          .json({ success: false, error: "Product not found" });
      }

      res.status(200).json({ success: true, product });
    } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, error: "This method is not allowed" });
  }
};

export default connectDb(handler);
