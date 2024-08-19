import Product from "@/models/Product";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method == "PATCH") {
    const { _id, amount } = req.body;

    try {
      // Fetch the current product data
      const currentProduct = await Product.findById(_id);

      if (!currentProduct) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      // Check if the amount is being changed
      if (amount !== undefined && amount !== currentProduct.amount) {
        // Set oldMRP to current amount
        req.body.oldMRP = currentProduct.amount;
      }

      // Update the product with the new data
      const updatedProduct = await Product.findByIdAndUpdate(_id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedProduct) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    res.status(400).json({ success: false, error: "This method is not allowed" });
  }
};

export default connectDb(handler);
